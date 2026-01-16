"use client";

import React, { useState, useEffect } from 'react';
import { Asset, CharacterModel, ImageModel, VideoModel, PromptingModel, GenerationJob } from '@/types';
import { mockStore } from '@/lib/mockStore';
import { X, Check, Settings, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';

// Actually, standard select is safer if I haven't installed Select component from shadcn. I did not install `select`. I will use standard native select for now to avoid errors, or basic styling.

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [characters, setCharacters] = useState<CharacterModel[]>([]);
    const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
    const [showQueueSidebar, setShowQueueSidebar] = useState(false);

    // Configuration State
    const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');
    const [promptingModel, setPromptingModel] = useState<PromptingModel>('Gemini 1.5 Flash');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [clothingImage, setClothingImage] = useState<File | null>(null);
    const [useVideo, setUseVideo] = useState(false);
    const [isNsfw, setIsNsfw] = useState(false); // Controls Grok prompt generation

    // Models are now inferred or hardcoded based on features
    // Image Model -> Pony Realism (SDXL) default, or Seedream 4.5 if changing clothes
    // Video Model -> Wan 2.6 default

    useEffect(() => {
        setAssets(mockStore.getAssets());
        setCharacters(mockStore.getCharacters().filter(c => c.status === 'ready'));
    }, []);

    const toggleSelect = (id: string) => {
        setSelectedAssetIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleQueueToAuto = () => {
        // if (selectedAssetIds.length === 0) return; // Allow opening without selection for configuration
        setShowQueueSidebar(true);
    };

    const uploadFile = async (file: File) => {
        // 1. Get Presigned URL
        const res = await fetch("/api/upload", {
            method: "POST",
            body: JSON.stringify({ filename: file.name, contentType: file.type, folder: "clothing-refs" }),
        });
        const { url, key } = await res.json();
        if (!url) throw new Error("Failed to get upload URL");

        // 2. Upload to R2
        await fetch(url, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
        });

        return key; // Storing Key. Backend should resolve this to full URL or use R2 directly.
    };

    const submitBatch = async () => {
        if (!selectedCharacterId) return alert('Please select a Character (LoRA)');

        try {
            let clothingKey = null;
            if (clothingImage) {
                // Determine if we need to upload
                clothingKey = await uploadFile(clothingImage);
            }

            // Logic for model selection based on features
            const finalImageModel: ImageModel = clothingImage ? 'Seedream 4.5' : 'Pony Realism (SDXL)';
            const finalVideoModel: VideoModel = 'Wan 2.6';

            const jobs: GenerationJob[] = selectedAssetIds.map(id => {
                const asset = assets.find(a => a.id === id);
                return {
                    id: Math.random().toString(36).substr(2, 9),
                    asset_id: id,
                    character_id: selectedCharacterId,
                    prompting_model: promptingModel,
                    image_model: finalImageModel,
                    video_model: useVideo ? finalVideoModel : undefined,
                    status: 'queued',
                    is_nsfw: isNsfw,
                    aspect_ratio: aspectRatio,
                    clothing_image_url: clothingKey ? `r2://${clothingKey}` : undefined, // Using r2:// schema for internal resolution
                    prompt: asset?.caption || 'Auto-generated sequence',
                    created_at: new Date().toISOString(),
                    progress: 0,
                    // Config object for flexibility
                    config: {
                        aspect_ratio: aspectRatio,
                        clothing_ref: clothingKey,
                        use_grok: promptingModel === 'xAI Grok Beta'
                    }
                };
            });

            // Save all jobs
            jobs.forEach(job => mockStore.saveJob(job));

            setSelectedAssetIds([]);
            setShowQueueSidebar(false);
            setClothingImage(null);
            alert('Batch manifestations initiated with custom configuration.');
        } catch (error) {
            console.error(error);
            alert('Failed to initiate batch: ' + (error as Error).message);
        }
    };

    return (
        <div className="flex h-full gap-4 relative overflow-hidden bg-black text-white p-2 font-sans w-full">
            <div className={cn("flex-1 space-y-6 transition-all duration-300 w-full overflow-hidden flex flex-col")}>
                <header className="flex-shrink-0 flex justify-between items-center bg-surface p-8 rounded-sm border border-white/5">
                    <div>
                        <h1 className="text-3xl font-[900] italic tracking-tighter uppercase leading-none">Asset DAM</h1>
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] mt-2">Digital Asset Management</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex gap-4">
                            {selectedAssetIds.length === 0 ? (
                                <Button
                                    variant="natak"
                                    onClick={() => setShowQueueSidebar(true)}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 h-auto text-xs border border-white/10"
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    CONFIGURE
                                </Button>
                            ) : (
                                <Button
                                    variant="natak"
                                    onClick={handleQueueToAuto}
                                    className="px-8 py-3 h-auto text-xs shadow-[0_10px_40px_rgba(204,255,0,0.2)]"
                                >
                                    PROCEED WITH ({selectedAssetIds.length})
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-20">
                    {assets.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-20 border border-dashed border-white/10 rounded-sm">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <Upload className="w-8 h-8 text-slate-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Asset DAM is Empty</h3>
                            <p className="text-slate-500 text-sm mb-6 max-w-md text-center">
                                Upload assets or generate new content in Creative Mode to populate your Digital Asset Management system.
                            </p>
                            <Button
                                variant="natak"
                                onClick={() => window.location.href = '/creative'} // Simple redirect for now
                                className="px-8 py-3 h-auto text-xs"
                            >
                                GO TO CREATIVE MODE
                            </Button>
                        </div>
                    ) : (
                        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {assets.map(asset => (
                                <StaggerItem
                                    key={asset.id}
                                    onClick={() => toggleSelect(asset.id)}
                                    className={cn(
                                        "group relative bg-[#1A1A1D] border rounded-sm overflow-hidden transition-all cursor-pointer h-full",
                                        selectedAssetIds.includes(asset.id) ? 'border-primary' : 'border-white/5'
                                    )}
                                >
                                    <div className="aspect-[3/4] relative overflow-hidden">
                                        <img src={asset.url} className={cn("w-full h-full object-cover transition-transform duration-1000", selectedAssetIds.includes(asset.id) ? 'scale-110' : 'group-hover:scale-110')} />
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className={cn("w-8 h-8 rounded-sm border flex items-center justify-center transition-all", selectedAssetIds.includes(asset.id) ? 'bg-primary border-primary' : 'bg-black/60 border-white/20')}>
                                                {selectedAssetIds.includes(asset.id) && <Check className="w-5 h-5 text-black" strokeWidth={4} />}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-1 italic">{asset.source}</div>
                                        <div className="text-xs text-slate-300 truncate font-medium uppercase tracking-tight italic">{asset.caption}</div>
                                    </div>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    )}
                </div>
            </div>

            <aside className={cn(
                "fixed right-4 top-[20px] bottom-6 w-[400px] bg-[#0F0F11] border border-white/10 z-50 p-10 rounded-md flex flex-col transform transition-all duration-500",
                showQueueSidebar ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
            )}>
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-[900] tracking-tighter italic uppercase text-white">Batch Config</h2>
                    <button onClick={() => setShowQueueSidebar(false)} className="text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
                </div>
                <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                    <section className="space-y-6">
                        {/* 1. Character Selection */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">1. Subject (LoRA)</label>
                            <select
                                value={selectedCharacterId}
                                onChange={(e) => setSelectedCharacterId(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-sm px-6 py-4 text-sm text-white focus:outline-none font-mono"
                            >
                                <option value="">-- Select Character --</option>
                                {characters.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.trigger_word})</option>
                                ))}
                            </select>
                        </div>

                        {/* 2. Prompt Generator */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">2. Prompt Generator</label>
                            <select
                                value={promptingModel}
                                onChange={(e) => setPromptingModel(e.target.value as PromptingModel)}
                                className="w-full bg-black border border-white/10 rounded-sm px-6 py-4 text-sm text-white focus:outline-none font-mono"
                            >
                                <option value="Gemini 1.5 Flash">Gemini 1.5 Flash (Standard)</option>
                                <option value="xAI Grok Beta">xAI Grok Beta (Creative)</option>
                            </select>
                        </div>

                        {/* NSFW Toggle for Grok */}
                        {promptingModel === 'xAI Grok Beta' && (
                            <div className="flex items-center justify-between bg-zinc-900 border border-white/5 p-4 rounded-sm">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Grok NSFW Mode</span>
                                <button
                                    onClick={() => setIsNsfw(!isNsfw)}
                                    className={cn("px-3 py-1 text-[9px] font-black rounded-sm border transition-colors", isNsfw ? 'bg-red-600/20 text-red-500 border-red-500' : 'text-slate-600 border-slate-800')}
                                >
                                    {isNsfw ? 'ENABLED' : 'DISABLED'}
                                </button>
                            </div>
                        )}

                        {/* 3. Resolution */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">3. Aspect Ratio</label>
                            <div className="grid grid-cols-4 gap-2">
                                {['16:9', '9:16', '4:3', '2:3'].map((ratio) => (
                                    <button
                                        key={ratio}
                                        onClick={() => setAspectRatio(ratio)}
                                        className={cn(
                                            "py-3 text-[10px] font-black border rounded-sm transition-all",
                                            aspectRatio === ratio ? 'bg-white text-black border-white' : 'bg-black text-slate-500 border-white/10 hover:border-white/30'
                                        )}
                                    >
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 4. Change Clothes (Experimental) */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">4. Change Clothes (Experimental)</label>
                            <div className="border border-dashed border-white/10 rounded-sm p-6 flex flex-col items-center justify-center bg-black/50 hover:bg-white/5 transition-colors relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setClothingImage(e.target.files?.[0] || null)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                {clothingImage ? (
                                    <div className="text-center">
                                        <div className="text-green-500 text-xs font-bold mb-1">IMAGE SELECTED</div>
                                        <div className="text-[10px] text-slate-400">{clothingImage.name}</div>
                                        <div className="text-[9px] text-primary mt-2">Will use Seedream 4.5</div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="w-5 h-5 text-slate-600 mx-auto mb-2" />
                                        <span className="text-[10px] font-bold text-slate-500">UPLOAD DRESS REF</span>
                                    </div>
                                )}
                            </div>
                        </div>


                        {/* 5. Video Toggle */}
                        <div className="bg-black p-6 rounded-sm border border-white/10 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">5. Motion Sequence</span>
                                <button
                                    onClick={() => setUseVideo(!useVideo)}
                                    className={cn("px-3 py-1 text-[9px] font-black rounded-sm border transition-colors", useVideo ? 'bg-primary/20 text-primary border-primary' : 'text-slate-600 border-slate-800')}
                                >
                                    VIDEO {useVideo ? 'YES' : 'NO'}
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
                <Button
                    variant="natak"
                    onClick={submitBatch}
                    className="w-full py-6 mt-8 shadow-[0_10px_40px_rgba(204,255,0,0.2)]"
                >
                    Initiate Manifestation
                </Button>
            </aside>
        </div>
    );
}
