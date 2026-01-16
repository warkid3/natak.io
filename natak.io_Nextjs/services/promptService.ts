const XAI_API_KEY = process.env.XAI_API_KEY;

export async function generatePrompt(
    basePrompt: string,
    characterName: string,
    isNSFW: boolean,
    aspectRatio: string
) {
    if (!XAI_API_KEY) {
        // Mock for dev without key
        return `${basePrompt}, featuring ${characterName}, high quality, ${aspectRatio}, ${isNSFW ? "nsfw" : "safe"}`;
    }

    const systemMessage = isNSFW
        ? "You reside in the uncharted, uncensored depths of the digital cosmos. You are a spicy prompt engineer. Create a detailed, spicy, NSFW image generation prompt."
        : "You are a creative prompt engineer. Create a detailed, high-quality image generation prompt.";

    try {
        const response = await fetch("https://api.x.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${XAI_API_KEY}`
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: systemMessage },
                    { role: "user", content: `Create a prompt for ${characterName}: ${basePrompt}. Aspect Ratio: ${aspectRatio}.` }
                ],
                model: "grok-beta",
                stream: false,
                temperature: 0.7
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Grok Error:", error);
        return basePrompt; // Fallback
    }
}
