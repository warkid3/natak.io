"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Assuming this exists or I use standard labels
import { Switch } from "@/components/ui/switch"; // Need to check if this exists
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Need to verify Select
import { CharacterModel } from "@/types";
import { supabase } from "@/lib/supabase";

interface GenerationConfigProps {
    onGenerate: (config: any) => void;
}

export default function GenerationConfig({ onGenerate }: GenerationConfigProps) {
    const [characters, setCharacters] = useState<CharacterModel[]>([]);
    const [selectedChar, setSelectedChar] = useState<string>("");
    const [prompt, setPrompt] = useState("");
    const [useGrok, setUseGrok] = useState(true);
    const [aspectRatio, setAspectRatio] = useState("16:9");
    const [changeClothes, setChangeClothes] = useState(false);
    const [clothesImage, setClothesImage] = useState<File | null>(null);
    const [generateVideo, setGenerateVideo] = useState(false);
    const [isNSFW, setIsNSFW] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch characters
        const fetchChars = async () => {
            const { data } = await supabase.from("characters").select("*").eq("status", "ready");
            if (data) setCharacters(data);
        };
        fetchChars();
    }, []);

    const handleGenerate = async () => {
        setLoading(true);
        // 1. Upload clothes image if needed
        let clothesUrl = null;
        if (changeClothes && clothesImage) {
            // Upload logic here (reusing similar logic to LoRA upload or separate endpoint)
            // For now, I'll simulate or assume we implement an upload helper
            const res = await fetch("/api/lora/upload-url", {
                method: "POST",
                body: JSON.stringify({ filename: clothesImage.name, contentType: clothesImage.type })
            });
            const { url, key } = await res.json();
            await fetch(url, { method: "PUT", body: clothesImage, headers: { "Content-Type": clothesImage.type } });
            clothesUrl = key; // Use the key/path
        }

        const config = {
            characterId: selectedChar,
            prompt,
            useGrok,
            aspectRatio,
            changeClothes,
            clothesUrl,
            generateVideo,
            isNSFW
        };

        onGenerate(config);
        setLoading(false);
    };

    return (
        <div className="space-y-6 p-6 bg-zinc-900/80 border border-white/10 rounded-xl max-w-2xl mx-auto backdrop-blur-md">
            <h2 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Generate Content
            </h2>

            {/* Character Selection */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Select Character</label>
                <select
                    className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-white"
                    value={selectedChar}
                    onChange={(e) => setSelectedChar(e.target.value)}
                >
                    <option value="">-- Choose a LoRA --</option>
                    {characters.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            {/* Prompt Section */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Prompt</label>
                <div className="flex gap-2">
                    <Input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe your scene..."
                        className="flex-1 bg-black/40 border-white/10 text-white"
                    />
                    <Button
                        variant={useGrok ? "default" : "outline"}
                        onClick={() => setUseGrok(!useGrok)}
                        className={`w-32 ${useGrok ? "bg-purple-600 hover:bg-purple-700" : "border-purple-600 text-purple-400"}`}
                    >
                        {useGrok ? "✨ Grok On" : "Grok Off"}
                    </Button>
                </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Resolution</label>
                    <div className="grid grid-cols-2 gap-2">
                        {["16:9", "9:16", "4:3", "2:3"].map(r => (
                            <button
                                key={r}
                                onClick={() => setAspectRatio(r)}
                                className={`p-2 rounded-md text-sm border ${aspectRatio === r
                                    ? "border-purple-500 bg-purple-500/20 text-white"
                                    : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-zinc-400">Change Clothes?</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={changeClothes} onChange={(e) => setChangeClothes(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>

                    {changeClothes && (
                        <input
                            type="file"
                            onChange={(e) => setClothesImage(e.target.files?.[0] || null)}
                            className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                        />
                    )}

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-zinc-400">Generate Video?</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={generateVideo} onChange={(e) => setGenerateVideo(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-purple-400">Unfiltered Mode</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={isNSFW} onChange={(e) => setIsNSFW(e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <Button onClick={handleGenerate} disabled={loading || !selectedChar} className="w-full bg-white text-black hover:bg-zinc-200 mt-4 h-12 text-lg font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                {loading ? "Starting Generation..." : "GENERATE"}
            </Button>
        </div>
    );
}
