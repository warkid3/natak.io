import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const characterId = searchParams.get("character_id");

    if (!characterId) {
        return NextResponse.json({ error: "Missing character_id" }, { status: 400 });
    }

    try {
        const body = await req.json();
        const { status, payload, error } = body;

        if (status === "COMPLETED") {
            // Fal.ai z-image-trainer usually returns a file structure in payload.
            // Example: payload: { diffusers_lora_file: { url: "...", ... } }
            // or sometimes just the URL directly if simple output.
            // We'll inspect payload to find the safe_tensors or lora file.

            const loraUrl = payload.diffusers_lora_file?.url || payload.lora_file?.url || payload.file?.url;

            if (loraUrl) {
                // Transfer to R2
                console.log(`Downloading LoRA from Fal: ${loraUrl}`);
                const fileRes = await fetch(loraUrl);
                if (!fileRes.ok) throw new Error(`Failed to download LoRA from Fal: ${fileRes.statusText}`);

                const arrayBuffer = await fileRes.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                const r2Key = `loras/${characterId}.safetensors`;
                console.log(`Uploading to R2: ${r2Key}`);

                const { uploadFileToR2 } = await import("@/lib/r2");
                const r2Url = await uploadFileToR2(r2Key, buffer, "application/octet-stream");
                console.log(`LoRA saved to R2: ${r2Url}`);

                await supabase
                    .from("characters")
                    .update({
                        status: "ready",
                        lora_url: r2Url // Save R2 URL instead of Fal URL
                    })
                    .eq("id", characterId);

                // Trigger Reference Generation
                // We fetch the character details first to get the trigger word
                const { data: charData } = await supabase
                    .from("characters")
                    .select("trigger_word, user_id")
                    .eq("id", characterId)
                    .single();

                if (charData) {
                    // Dynamic import or direct call if environment allows.
                    // Since we are in Next.js Server Components / Route Handlers, direct import is fine.
                    const { generateReferenceImages } = await import("@/services/referenceGenerationService");
                    // Fire and forget - don't await to keep webhook response fast? 
                    // Or await if Vercel function lifetime allows.
                    await generateReferenceImages(characterId, loraUrl, charData.trigger_word);
                }
            } else {
                console.error("Fal Webhook: No Lora URL found in payload", payload);
                await supabase
                    .from("characters")
                    .update({ status: "failed" })
                    .eq("id", characterId);
            }

        } else if (status === "FAILED") {
            console.error("Fal Webhook: Training Failed", error);
            await supabase
                .from("characters")
                .update({ status: "failed" })
                .eq("id", characterId);
        }

        return NextResponse.json({ received: true });
    } catch (e: any) {
        console.error("Webhook Error", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
