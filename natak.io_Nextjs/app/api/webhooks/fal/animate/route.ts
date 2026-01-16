/**
 * Fal.ai Animation Webhook Handler
 * Receives callback when WAN 2.2 Animate completes
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { uploadFileToR2 } from "@/lib/r2";
import { PipelineStep } from "@/types/operations";

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("job_id");

    if (!jobId) {
        return NextResponse.json({ error: "Missing job_id" }, { status: 400 });
    }

    try {
        const body = await req.json();
        const status = body.status;
        const output = body.output || body.payload || body;
        const error = body.error;

        if (status === "FAILED" || error) {
            await supabase.from("jobs").update({
                status: "failed",
                error: typeof error === 'string' ? error : JSON.stringify(error) || "Animation failed",
                current_step: PipelineStep.VIDEO_GEN,
            }).eq("id", jobId);

            return NextResponse.json({ received: true, status: "failed" });
        }

        if (status === "COMPLETED" || output) {
            // Extract video URL
            const videoUrl = output.video?.url || output.file?.url || output.url || output.video_url;

            if (!videoUrl) {
                await supabase.from("jobs").update({
                    status: "failed",
                    error: "No animation video URL in response"
                }).eq("id", jobId);
                return NextResponse.json({ error: "No video URL" }, { status: 400 });
            }

            // Backup to R2
            let finalVideoUrl = videoUrl;
            try {
                const videoResponse = await fetch(videoUrl);
                if (videoResponse.ok) {
                    const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());
                    const r2Key = `animations/${jobId}.mp4`;
                    const r2Url = await uploadFileToR2(r2Key, videoBuffer, "video/mp4");
                    if (r2Url) {
                        finalVideoUrl = r2Url;
                    }
                }
            } catch (r2Error) {
                console.error("R2 backup failed:", r2Error);
            }

            // Update job
            await supabase.from("jobs").update({
                video_url: finalVideoUrl,
                status: "completed",
                progress: 100,
                current_step: PipelineStep.VIDEO_GEN,
                metadata: { animation: true }
            }).eq("id", jobId);

            return NextResponse.json({
                received: true,
                status: "completed",
                videoUrl: finalVideoUrl
            });
        }

        return NextResponse.json({ received: true, status });

    } catch (e: any) {
        console.error("Animation webhook error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
