import { supabase } from "@/lib/supabase";

const FAL_KEY = process.env.FAL_KEY;
const TXT2IMG_ENDPOINT = "fal-ai/flux/dev"; // Using Z-Image Turbo equivalent

export async function generateReferenceImages(characterId: string, loraUrl: string, triggerWord: string) {
    console.log(`Starting reference generation for ${characterId}`);

    // Fetch character owner ID to assign assets correctly
    const { data: char } = await supabase.from("characters").select("user_id").eq("id", characterId).single();
    const ownerId = char?.user_id || "00000000-0000-0000-0000-000000000000";

    const prompts = [
        { type: "face", prompt: `photo of ${triggerWord}, close up face portrait, highly detailed, 8k, realistic skin texture` },
        { type: "face", prompt: `photo of ${triggerWord}, side profile face portrait, studio lighting, highly detailed` },
        { type: "body", prompt: `photo of ${triggerWord}, full body shot, standing pose, neutral background, fashion photography` },
        { type: "body", prompt: `photo of ${triggerWord}, full body shot, walking pose, dynamic angle, street fashion` }
    ];

    try {
        const generationPromises = prompts.map(async (p) => {
            const res = await fetch(`https://fal.run/${TXT2IMG_ENDPOINT}`, {
                method: "POST",
                headers: {
                    "Authorization": `Key ${FAL_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    prompt: p.prompt,
                    image_size: p.type === "face" ? "square_hd" : "portrait_16_9",
                    loras: [{ path: loraUrl, scale: 1.0 }],
                    num_inference_steps: 30,
                    enable_safety_checker: true
                })
            });

            if (!res.ok) {
                const err = await res.json();
                console.error(`Failed to generate ${p.type} ref:`, err);
                return null;
            }

            const data = await res.json();
            const imageUrl = data.images[0].url;

            // Save as Asset
            await supabase.from("assets").insert({
                user_id: ownerId,
                url: imageUrl,
                caption: p.prompt,
                collection: "reference_images",
                type: "image",
                source: "upload"
            });

            return imageUrl;
        });

        await Promise.all(generationPromises);
        console.log("Reference generation complete");

    } catch (error) {
        console.error("Error in generateReferenceImages:", error);
    }
}
