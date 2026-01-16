import { supabase } from "@/lib/supabase";

const FAL_KEY = process.env.FAL_KEY;

export async function trainLoRA(
    userId: string,
    name: string,
    triggerWord: string,
    imageUrls: string[]
) {
    // 1. Create Character Record
    const { data: character, error: charError } = await supabase
        .from("characters")
        .insert([{
            user_id: userId,
            name,
            trigger_word: triggerWord,
            status: "training",
        }])
        .select()
        .single();

    if (charError) throw new Error(charError.message);

    // 2. Call Fal.ai for Training
    const response = await fetch("https://queue.fal.run/fal-ai/z-image-trainer", {
        method: "POST",
        headers: {
            "Authorization": `Key ${FAL_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            images: imageUrls,
            steps: 2000,
            learning_rate: 0.0001,
            training_type: "content",
            trigger_phrase: triggerWord,
            captioning_model: "wavespeed-ai/image-captioner",
            webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/fal?character_id=${character.id}`,
        }),
    });

    const result = await response.json();
    return { character, result };
}
