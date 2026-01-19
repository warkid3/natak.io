/**
 * Generation Service
 * Main pipeline orchestrator for image and video generation
 */

import { supabase } from "@/lib/supabase";
import { uploadFileToR2 } from "@/lib/r2";
import { generatePrompt } from "./promptService";
import {
    generateImage,
    segmentClothing,
    inpaintImage,
    upscaleImage,
    generateVideo,
    FAL_ENDPOINTS
} from "./falClient";
import { PipelineStep, calculateJobCost, calculateJobProgress, inferPlatform } from "@/types/operations";

interface GenConfig {
    characterId: string;
    prompt: string;
    useGrok: boolean;
    aspectRatio: string;
    changeClothes: boolean;
    clothesUrl?: string;
    clothesPrompt?: string;
    generateVideo: boolean;
    isNSFW: boolean;
    upscaleFactor?: number;
}

// Helper to update job step
async function updateJobStep(jobId: string, step: PipelineStep, includeVideo: boolean) {
    const progress = calculateJobProgress(step);
    const cost = calculateJobCost(step, includeVideo);

    await supabase.from("jobs").update({
        current_step: step,
        progress,
        cost
    }).eq("id", jobId);
}

/**
 * Main generation pipeline
 * Orchestrates: Prompt → Image → [Cloth Swap] → Upscale → [Video]
 */
export async function processGenerationJob(jobId: string, userId: string, config: GenConfig & { video_action?: string, asset_url?: string }) {
    // Route to Video Pipeline if Action is present
    if (config.video_action) {
        return processVideoJob(jobId, userId, config);
    }

    try {
        // ... Image Pipeline ...
        // Initialize tracking
        const platform = inferPlatform(config);
        await supabase.from("jobs").update({
            platform,
            is_nsfw: config.isNSFW,
            current_step: PipelineStep.BASE_GEN,
            progress: 0,
            status: "processing"
        }).eq("id", jobId);

        // 1. Fetch Character (LoRA)
        const { data: character } = await supabase
            .from("characters")
            .select("*")
            .eq("id", config.characterId)
            .single();

        if (!character || !character.lora_url) {
            throw new Error("Character or LoRA not found");
        }

        // 2. Generate Prompt with Grok (if enabled)
        let finalPrompt = config.prompt;
        if (config.useGrok) {
            finalPrompt = await generatePrompt(
                config.prompt,
                character.name,
                config.isNSFW,
                config.aspectRatio
            );
            // Update prompt in Job
            await supabase.from("jobs").update({ prompt: finalPrompt }).eq("id", jobId);
        }

        // 3. Generate Base Image with Z-Image Turbo + LoRA
        let currentImageUrl = await generateImage({
            prompt: finalPrompt,
            loraUrl: character.lora_url,
            loraScale: 1.0,
            triggerWord: character.trigger_word,
            aspectRatio: config.aspectRatio,
            enableSafetyChecker: !config.isNSFW,
        });

        if (!currentImageUrl) {
            throw new Error("Image generation failed - no output URL");
        }

        // Update step tracking
        await updateJobStep(jobId, PipelineStep.BASE_GEN, config.generateVideo);

        // 4. Clothing Swap (if requested)
        if (config.changeClothes && config.clothesUrl) {
            try {
                // 4a. Segment clothing from generated image
                const maskData = await segmentClothing(currentImageUrl);
                const maskUrl = maskData?.url || maskData?.mask_url;

                if (maskUrl) {
                    // 4b. Inpaint with new clothing
                    const clothPrompt = config.clothesPrompt || "wearing new clothes, same person";
                    const inpaintedUrl = await inpaintImage({
                        imageUrl: currentImageUrl,
                        maskUrl: maskUrl,
                        prompt: `${character.trigger_word}, ${finalPrompt}, ${clothPrompt}`,
                    });

                    if (inpaintedUrl) {
                        currentImageUrl = inpaintedUrl;
                    }
                }

                await updateJobStep(jobId, PipelineStep.CLOTH_SWAP, config.generateVideo);
            } catch (clothError: any) {
                console.error("Cloth swap failed, continuing with original:", clothError.message);
                // Don't fail the whole job, just skip cloth swap
            }
        }

        // 5. Upscale Image
        const upscaleFactor = config.upscaleFactor || 5;
        const upscaledUrl = await upscaleImage(currentImageUrl, upscaleFactor);

        if (upscaledUrl) {
            currentImageUrl = upscaledUrl;
        }

        await updateJobStep(jobId, PipelineStep.UPSCALE, config.generateVideo);

        // 5.5 Back up Image to R2
        try {
            const imageResponse = await fetch(currentImageUrl);
            if (imageResponse.ok) {
                const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
                const r2Key = `generations/${jobId}.png`;
                const r2Url = await uploadFileToR2(r2Key, imageBuffer, "image/png");
                if (r2Url) {
                    currentImageUrl = r2Url;
                }
            }
        } catch (r2Error) {
            console.error("R2 backup failed, continuing with original URL:", r2Error);
        }

        // 6. Save Final Image
        await supabase.from("jobs").update({
            output_url: currentImageUrl,
            status: config.generateVideo ? "processing" : "completed",
            progress: config.generateVideo ? 50 : 100
        }).eq("id", jobId);

        // 7. Generate Video (if requested) - Async with webhook
        if (config.generateVideo) {
            await updateJobStep(jobId, PipelineStep.VIDEO_PREP, true);

            // Submit to queue with webhook
            await generateVideo({
                prompt: finalPrompt,
                imageUrl: currentImageUrl,
                jobId: jobId,
                resolution: '1080p',
                duration: 5,
            });

            // Job will be completed via webhook
            await supabase.from("jobs").update({
                status: "processing",
                metadata: { video_queued: true }
            }).eq("id", jobId);
        }

        return { success: true, imageUrl: currentImageUrl };

    } catch (error: any) {
        console.error("Generation Failed:", error);
        await supabase.from("jobs").update({
            status: "failed",
            error: error.message
        }).eq("id", jobId);
        return { success: false, error: error.message };
    }
}

/**
 * Video Animation Pipeline (Wan 2.2)
 * Video -> Frame -> Face Morph (LoRA) -> Animate
 */
export async function processVideoJob(jobId: string, userId: string, config: any) {
    try {
        console.log(`Starting Video Job ${jobId} [${config.video_action}]`);

        await supabase.from("jobs").update({
            status: 'processing',
            current_step: PipelineStep.VIDEO_PREP,
            progress: 5
        }).eq("id", jobId);

        // 1. Fetch Character
        const { data: character } = await supabase.from("characters").select("*").eq("id", config.characterId).single();
        if (!character) throw new Error("Character not found");

        // 2. Extract Frame (Mock: use Asset URL directly assuming Image for now)
        const sourceFrameUrl = config.asset_url;
        if (!sourceFrameUrl) throw new Error("No asset URL provided");

        // 3. Face Morph / Img2Img with Character LoRA
        const morphedFrameUrl = await generateImage({
            prompt: config.prompt,
            loraUrl: character.lora_url!,
            triggerWord: character.trigger_word,
            imageUrl: sourceFrameUrl,
            strength: 0.65,
            aspectRatio: config.aspectRatio
        });

        if (!morphedFrameUrl) throw new Error("Face Morphing failed");
        await updateJobStep(jobId, PipelineStep.BASE_GEN, true);

        // 4. Animate with Wan 2.2
        const { requestId } = await import("./falClient").then(m => m.animateWan({
            imageUrl: morphedFrameUrl,
            prompt: config.prompt,
            jobId: jobId,
            aspectRatio: config.aspectRatio
        }));

        await supabase.from("jobs").update({
            metadata: { fal_request_id: requestId },
            current_step: PipelineStep.VIDEO_GEN,
            progress: 50
        }).eq("id", jobId);

    } catch (error: any) {
        console.error("Video Job Error", error);
        await supabase.from("jobs").update({ status: 'failed', error: error.message }).eq("id", jobId);
    }
}

/**
 * Animation with WAN 2.2 
 * For image-to-video animation with motion reference
 */
export async function animateWithWan(
    jobId: string,
    imageUrl: string,
    motionVideoUrl: string,
    prompt: string
) {
    try {
        await supabase.from("jobs").update({
            status: "processing",
            current_step: PipelineStep.VIDEO_GEN,
        }).eq("id", jobId);

        // WAN 2.2 Animate requires a motion reference video
        // This is submitted to queue with webhook
        const { falQueue } = await import("./falClient");

        const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/fal/animate?job_id=${jobId}`;

        await falQueue(FAL_ENDPOINTS.WAN_ANIMATE, {
            image_url: imageUrl,
            video_url: motionVideoUrl, // Motion reference
            prompt: prompt,
            num_frames: 81, // ~5 seconds at 16fps
            frames_per_second: 16,
            resolution: "720p",
        }, webhookUrl);

        return { success: true, queued: true };

    } catch (error: any) {
        console.error("Animation failed:", error);
        await supabase.from("jobs").update({
            status: "failed",
            error: error.message
        }).eq("id", jobId);
        return { success: false, error: error.message };
    }
}
