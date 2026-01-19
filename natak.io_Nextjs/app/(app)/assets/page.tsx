"use client";

import React, { useState, useEffect } from 'react';
import { Asset, CharacterModel, ImageModel, VideoModel, PromptingModel, GenerationJob, Collection } from '@/types';
import { mockStore } from '@/lib/mockStore';
import { X, Check, Settings, Upload, Folder, Plus, Search, Filter, Grid, List as ListIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { cn } from '@/lib/utils';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [characters, setCharacters] = useState<CharacterModel[]>([]);
    const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
    const [showQueueSidebar, setShowQueueSidebar] = useState(true); // Default open for 3-pane look

    // Filter State
    const [activeCollection, setActiveCollection] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');

    // Configuration State
    const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');
    const [promptingModel, setPromptingModel] = useState<PromptingModel>('Gemini 1.5 Flash');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [clothingImage, setClothingImage] = useState<File | null>(null);
    const [useVideo, setUseVideo] = useState(false);
    const [videoAction, setVideoAction] = useState('animate');
    const [isNsfw, setIsNsfw] = useState(false);
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');

    useEffect(() => {
        setAssets(mockStore.getAssets());
        setCollections(mockStore.getCollections());
        setCharacters(mockStore.getCharacters().filter(c => c.status === 'ready'));
        console.log('Loaded Assets:', mockStore.getAssets());
        console.log('Loaded Collections:', mockStore.getCollections());
    }, []);

    const toggleSelect = (id: string) => {
        setSelectedAssetIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleCreateCollection = () => {
        setShowCollectionModal(true);
    };

    const handleSaveCollection = () => {
        if (newCollectionName.trim()) {
            const newCol = { id: `c-${Date.now()}`, name: newCollectionName.trim(), count: 0, created_at: new Date().toISOString() };
            mockStore.saveCollection(newCol);
            setCollections(mockStore.getCollections());
            setNewCollectionName('');
            setShowCollectionModal(false);
        }
    };

    const filteredAssets = assets.filter(a => {
        if (activeCollection !== 'all' && a.collection_id !== activeCollection) return false;
        if (filterType !== 'all' && a.type !== filterType) return false;
        if (searchQuery && !a.caption.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    console.log('Filtered Assets:', filteredAssets.length, 'of', assets.length);


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
            // User requested Wan 2.2 Animate
            const finalVideoModel: VideoModel = 'Wan 2.2 Animate';

            // Real API Submission
            const promises = selectedAssetIds.map(async (id) => {
                const asset = assets.find(a => a.id === id);
                if (!asset) return null;

                const payload = {
                    userId: "00000000-0000-0000-0000-000000000000", // Default/Mock User
                    characterId: selectedCharacterId,
                    prompt: asset.caption || "Auto-generated sequence",
                    assetId: id,
                    asset_url: asset.url, // Pass URL directly to avoid DB lookup issues
                    promptingModel,

                    // Config flags
                    changeClothes: !!clothingImage,
                    clothing_ref: clothingKey,

                    useGrok: promptingModel === 'xAI Grok Beta',
                    isNSFW: isNsfw,
                    aspectRatio: aspectRatio,

                    // Video Specific
                    generateVideo: useVideo, // Legacy flag
                    video_action: useVideo ? videoAction : undefined,
                    videoModel: useVideo ? finalVideoModel : undefined
                };

                const res = await fetch("/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Job failed to start");
                }

                // Save to mockStore for immediate UI feedback (optional, but keeps UI working)
                const jobData = await res.json();
                mockStore.saveJob({
                    id: jobData.jobId,
                    status: 'processing',
                    created_at: new Date().toISOString(),
                    prompt: payload.prompt,
                    character_id: selectedCharacterId,
                    image_model: finalImageModel,
                    video_model: useVideo ? finalVideoModel : undefined,
                    progress: 0,
                    is_nsfw: isNsfw,
                    prompting_model: promptingModel
                } as any);
            });

            await Promise.all(promises);

            setSelectedAssetIds([]);
            setShowQueueSidebar(false);
            setClothingImage(null);
            alert(`Successfully started ${selectedAssetIds.length} generation jobs.`);
        } catch (error) {
            console.error(error);
            alert('Failed to initiate batch: ' + ((error as Error).message || String(error)));
        }
    };

    return (
        <div className="flex h-full w-full bg-[#09090b] text-white overflow-hidden font-sans">

            {/* LEFT: Collection Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-[#09090b] flex flex-col hidden md:flex">
                <div className="flex-1 overflow-y-auto p-4 space-y-6 pt-6">
                    {/* Collections */}
                    <div>
                        <div className="flex items-center justify-between mb-2 px-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Collections</span>
                            <button onClick={handleCreateCollection} className="text-slate-500 hover:text-primary"><Plus className="w-3 h-3" /></button>
                        </div>
                        <ul className="space-y-1">
                            <li>
                                <button
                                    onClick={() => setActiveCollection('all')}
                                    className={cn("w-full flex items-center px-3 py-2 text-xs font-bold rounded-sm transition-colors", activeCollection === 'all' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5')}
                                >
                                    <Folder className="w-4 h-4 mr-3 text-slate-500" />
                                    All Assets
                                    <span className="ml-auto text-[9px] text-slate-600 font-mono">{assets.length}</span>
                                </button>
                            </li>
                            {collections.map(col => (
                                <li key={col.id}>
                                    <button
                                        onClick={() => setActiveCollection(col.id)}
                                        className={cn("w-full flex items-center px-3 py-2 text-xs font-bold rounded-sm transition-colors", activeCollection === col.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5')}
                                    >
                                        <Folder className={cn("w-4 h-4 mr-3", activeCollection === col.id ? 'text-primary' : 'text-slate-500')} />
                                        {col.name}
                                        <span className="ml-auto text-[9px] text-slate-600 font-mono">{col.count}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Filters */}
                    <div>
                        <div className="flex items-center justify-between mb-2 px-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Filter By</span>
                        </div>
                        <div className="space-y-1">
                            {['all', 'image', 'video'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type as any)}
                                    className={cn("w-full flex items-center px-3 py-2 text-xs font-bold rounded-sm uppercase tracking-wider", filterType === type ? 'text-primary' : 'text-slate-500 hover:text-white')}
                                >
                                    <div className={cn("w-1.5 h-1.5 rounded-full mr-3", filterType === type ? 'bg-primary' : 'bg-transparent border border-slate-600')} />
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* MIDDLE: Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-black/50 relative">
                {/* Desktop Header */}
                <header className="flex-shrink-0 border-b border-white/5 p-4 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search assets by caption or tag..."
                            className="w-full bg-[#1A1A1D] border border-white/10 rounded-sm pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-white/20"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex bg-[#1A1A1D] border border-white/10 rounded-sm p-1">
                            <button className="p-1.5 hover:bg-white/10 rounded-sm text-white"><Grid className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-white/10 rounded-sm text-slate-500"><ListIcon className="w-4 h-4" /></button>
                        </div>
                        <Button onClick={() => setShowQueueSidebar(!showQueueSidebar)} size="sm" variant="ghost" className={cn("border border-white/10", showQueueSidebar && 'bg-white/10')}>
                            <Settings className="w-4 h-4" />
                        </Button>
                    </div>
                </header>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {filteredAssets.length > 0 ? (
                        <>
                            {/* Upload Area */}
                            <div className="mb-6">
                                <FileUpload onChange={(files) => console.log('Uploaded:', files)} />
                            </div>

                            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                {filteredAssets.map(asset => (
                                    <StaggerItem
                                        key={asset.id}
                                        onClick={() => toggleSelect(asset.id)}
                                        className={cn(
                                            "group relative bg-[#1A1A1D] border rounded-sm overflow-hidden transition-all cursor-pointer",
                                            selectedAssetIds.includes(asset.id) ? 'border-primary ring-1 ring-primary' : 'border-white/5 hover:border-white/20'
                                        )}
                                    >
                                        <div className="aspect-[9/16] relative overflow-hidden">
                                            {asset.type === 'video' ? (
                                                <div className="w-full h-full flex items-center justify-center bg-black">
                                                    <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${asset.url})` }} />
                                                    <div className="w-8 h-8 rounded-full border border-white flex items-center justify-center z-10">
                                                        <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <img src={asset.url} className={cn("w-full h-full object-cover transition-transform duration-700", selectedAssetIds.includes(asset.id) ? 'scale-105' : 'group-hover:scale-105')} />
                                            )}

                                            {/* Selection Check */}
                                            <div className="absolute top-2 right-2 z-20">
                                                <div className={cn("w-6 h-6 rounded-sm border flex items-center justify-center transition-all", selectedAssetIds.includes(asset.id) ? 'bg-primary border-primary' : 'bg-black/40 border-white/20 opacity-0 group-hover:opacity-100')}>
                                                    {selectedAssetIds.includes(asset.id) && <Check className="w-4 h-4 text-black" strokeWidth={4} />}
                                                </div>
                                            </div>

                                            {/* Type Badge - Mini */}
                                            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded-sm border border-white/10 text-[8px] font-black uppercase text-white tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                {asset.type}
                                            </div>
                                        </div>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-20">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                <Upload className="w-10 h-10 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Assets Found</h3>
                            <p className="text-slate-500 text-sm mb-8 max-w-md text-center">
                                {activeCollection !== 'all' ? 'This collection is empty.' : 'Upload assets or adjust your filters.'}
                            </p>
                            <div className="border border-dashed border-white/10 rounded-sm bg-white/5 hover:bg-white/10 transition-colors px-8 py-6 cursor-pointer">
                                <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                                <span className="text-xs font-bold text-slate-400">Click to Upload Files</span>
                            </div>
                        </div>
                    )}
                </div>
            </main >

            {/* RIGHT: Config Sidebar (Collapsible) */}
            < aside className={
                cn(
                    "w-[400px] bg-[#0F0F11] border-l border-white/10 flex flex-col transition-all duration-300 absolute right-0 top-0 bottom-0 z-20 md:relative",
                    showQueueSidebar ? 'translate-x-0' : 'translate-x-full md:hidden'
                )
            } >
                <div className="p-3 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <h2 className="text-[10px] font-bold tracking-tight uppercase text-slate-400">Batch Studio</h2>
                        <p className="text-[8px] text-slate-600 font-medium">{selectedAssetIds.length} selected</p>
                    </div>
                    <button onClick={() => setShowQueueSidebar(false)} className="md:hidden text-slate-500"><X className="w-5 h-5" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
                    {/* Existing Config Logic */}
                    <div className="flex bg-black border border-white/10 p-1 rounded-sm">
                        <button
                            onClick={() => setUseVideo(false)}
                            className={cn("flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all", !useVideo ? 'bg-white text-black' : 'text-slate-500 hover:text-white')}
                        >
                            Image Gen
                        </button>
                        <button
                            onClick={() => setUseVideo(true)}
                            className={cn("flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all", useVideo ? 'bg-primary text-black' : 'text-slate-500 hover:text-white')}
                        >
                            Video Animate
                        </button>
                    </div>

                    {useVideo ? (
                        /* VIDEO CONFIG - SAME COMPONENT */
                        <section className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">1. Subject (LoRA)</label>
                                <Select value={selectedCharacterId} onValueChange={setSelectedCharacterId}>
                                    <SelectTrigger className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:ring-0 focus:ring-offset-0 font-mono h-auto">
                                        <SelectValue placeholder="-- Select Character --" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black border border-white/10 text-white">
                                        {characters.map(c => (<SelectItem key={c.id} value={c.id} className="focus:bg-white/10 focus:text-white cursor-pointer">{c.name} ({c.trigger_word})</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">2. Clothes (Optional)</label>
                                <div className="border border-dashed border-white/10 rounded-sm p-4 flex flex-col items-center justify-center bg-black/50 hover:bg-white/5 transition-colors relative h-20">
                                    <input type="file" accept="image/*" onChange={(e) => setClothingImage(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    <div className="text-center">{clothingImage ? <span className="text-green-500 text-[9px] font-bold">{clothingImage.name}</span> : <span className="text-[9px] font-bold text-slate-500">UPLOAD REFERENCE</span>}</div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">3. Engine</label>
                                <Select disabled defaultValue="wan2.1">
                                    <SelectTrigger className="w-full bg-zinc-900 border border-white/10 rounded-sm px-4 py-3 text-xs text-slate-400 font-mono opacity-80 cursor-not-allowed h-auto focus:ring-0">
                                        <SelectValue placeholder="Wan 2.1 Animate" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black border border-white/10 text-white">
                                        <SelectItem value="wan2.1">Wan 2.1 Animate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">4. Action</label>
                                <Select value={videoAction} onValueChange={setVideoAction}>
                                    <SelectTrigger className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:ring-0 focus:ring-offset-0 font-mono h-auto">
                                        <SelectValue placeholder="Select Action" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black border border-white/10 text-white">
                                        <SelectItem value="animate" className="focus:bg-white/10 focus:text-white cursor-pointer">Animate (Motion)</SelectItem>
                                        <SelectItem value="style_transfer" className="focus:bg-white/10 focus:text-white cursor-pointer">Style Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </section>
                    ) : (
                        /* IMAGE CONFIG - Full Version */
                        <section className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">1. Subject (LoRA)</label>
                                <Select value={selectedCharacterId} onValueChange={setSelectedCharacterId}>
                                    <SelectTrigger className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:ring-0 focus:ring-offset-0 font-mono h-auto">
                                        <SelectValue placeholder="-- Select Character --" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black border border-white/10 text-white">
                                        {characters.map(c => (<SelectItem key={c.id} value={c.id} className="focus:bg-white/10 focus:text-white cursor-pointer">{c.name} ({c.trigger_word})</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">2. Prompt Generator</label>
                                <Select
                                    value={isNsfw ? 'xAI Grok Beta' : promptingModel}
                                    onValueChange={(val) => setPromptingModel(val as PromptingModel)}
                                    disabled={isNsfw}
                                >
                                    <SelectTrigger className={cn("w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:ring-0 focus:ring-offset-0 font-mono h-auto", isNsfw && 'opacity-50 cursor-not-allowed')}>
                                        <SelectValue placeholder="Select Model" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black border border-white/10 text-white">
                                        <SelectItem value="Gemini 1.5 Flash" className="focus:bg-white/10 focus:text-white cursor-pointer">Gemini 1.5 Flash</SelectItem>
                                        <SelectItem value="xAI Grok Beta" className="focus:bg-white/10 focus:text-white cursor-pointer">xAI Grok Beta (Creative)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between bg-zinc-900 border border-white/5 p-3 rounded-sm">
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">NSFW Mode</span>
                                    {isNsfw && <span className="text-[8px] text-red-400 ml-2">(Grok locked)</span>}
                                </div>
                                <button onClick={() => setIsNsfw(!isNsfw)} className={cn("px-2 py-1 text-[8px] font-black rounded-sm border transition-colors", isNsfw ? 'bg-red-600/20 text-red-500 border-red-500' : 'text-slate-600 border-slate-800')}>
                                    {isNsfw ? 'ON' : 'OFF'}
                                </button>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">3. Aspect Ratio</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['16:9', '9:16', '4:3', '2:3'].map((ratio) => (
                                        <button key={ratio} onClick={() => setAspectRatio(ratio)} className={cn("py-2 text-[9px] font-black border rounded-sm transition-all", aspectRatio === ratio ? 'bg-white text-black border-white' : 'bg-black text-slate-500 border-white/10 hover:border-white/30')}>{ratio}</button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">4. Change Clothes (Experimental)</label>
                                <div className="border border-dashed border-white/10 rounded-sm p-4 flex flex-col items-center justify-center bg-black/50 hover:bg-white/5 transition-colors relative h-20">
                                    <input type="file" accept="image/*" onChange={(e) => setClothingImage(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    {clothingImage ? (
                                        <div className="text-center">
                                            <div className="text-green-500 text-[9px] font-bold mb-1">Uploaded</div>
                                            <div className="text-[8px] text-slate-400">{clothingImage.name}</div>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="w-4 h-4 text-slate-600 mx-auto mb-1" />
                                            <span className="text-[9px] font-bold text-slate-500">Upload Reference</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                <div className="p-4 border-t border-white/10 bg-[#0F0F11] space-y-3 flex-shrink-0">
                    <Button variant="natak" onClick={submitBatch} className="w-full py-4 shadow-[0_10px_40px_rgba(204,255,0,0.2)]">
                        {useVideo ? 'INITIATE ANIMATION' : 'INITIATE GENERATION'}
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setUseVideo(!useVideo)}
                        className={cn("w-full py-3 border text-[10px] uppercase tracking-wider", useVideo ? 'border-primary text-primary' : 'border-white/10 text-slate-400')}
                    >
                        {useVideo ? '← Switch to Image' : 'Create Video →'}
                    </Button>
                </div>
            </aside >
        </div >
    );
}
