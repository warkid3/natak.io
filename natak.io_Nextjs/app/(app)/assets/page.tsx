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
import { useAssets } from '@/hooks/use-assets';
import { useJobs } from '@/hooks/use-jobs';
import { createClient } from '@/lib/supabase/client';

import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';

export default function AssetsPage() {
    // ... existing state ...
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // ... existing hooks and effects ...

    // OLD submitDelete removed
    // New handler for confirming delete via Modal
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch("/api/assets/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assetIds: selectedAssetIds }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Deletion failed");
            }

            // Success
            setSelectedAssetIds([]);
            setShowQueueSidebar(false);
            refreshAssets();
            setShowDeleteModal(false);
            // Optional: nice toast here

        } catch (error) {
            console.error("Delete failed:", error);
            alert("Delete failed: " + (error as Error).message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };
    const [assets, setAssets] = useState<Asset[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [characters, setCharacters] = useState<CharacterModel[]>([]);
    const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
    const [showQueueSidebar, setShowQueueSidebar] = useState(true);

    // Filter State
    const [activeCollection, setActiveCollection] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');

    // TEST CONFIG: Use real Admin ID for testing
    const TEST_USER_ID = "cceb1f9e-0dde-458d-a010-282cdf34e805"; // Harsh tambe

    // Configuration State
    const [selectedCharacterId, setSelectedCharacterId] = useState<string>('');
    const [promptingModel, setPromptingModel] = useState<PromptingModel>('Gemini 1.5 Flash');
    const [aspectRatio, setAspectRatio] = useState('16:9');
    const [clothingImage, setClothingImage] = useState<File | null>(null);
    const [useVideo, setUseVideo] = useState(false); // Mode: false = Studio (ETL), true = Motion Control
    const [generateVideoLTX, setGenerateVideoLTX] = useState(false); // Config for Studio Mode
    const [videoAction, setVideoAction] = useState('animate');
    const [isNsfw, setIsNsfw] = useState(false);
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');

    // Use Real Hooks
    const { assets: realAssets, refresh: refreshAssets, loading: assetsLoading } = useAssets(TEST_USER_ID);
    const { jobs, refresh: refreshJobs } = useJobs(TEST_USER_ID);

    // Merge real assets with any remaining local assets if needed (or just use real)
    useEffect(() => {
        if (realAssets) setAssets(realAssets);
    }, [realAssets]);

    // Handle Job Completion -> Refresh Assets
    useEffect(() => {
        const hasCompletedRecently = jobs.some(j => j.status === 'completed' && new Date(j.created_at).getTime() > Date.now() - 5000);
        if (hasCompletedRecently) {
            refreshAssets();
        }
    }, [jobs, refreshAssets]);

    useEffect(() => {
        // Load Collections from Mock (keep for now until REAL storage is ready)
        setCollections(mockStore.getCollections());

        // Load REAL Characters from Supabase
        const fetchCharacters = async () => {
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            const { data, error } = await supabase
                .from('characters')
                .select('*')
                .or(`is_shared.eq.true,user_id.eq.${TEST_USER_ID}`);

            if (data && !error) {
                setCharacters(data as CharacterModel[]);
                // Auto-select first one
                if (data.length > 0) setSelectedCharacterId(data[0].id);
            } else {
                console.error("Failed to fetch characters:", error);
                // Fallback
                setCharacters(mockStore.getCharacters().filter(c => c.status === 'ready'));
            }
        };

        fetchCharacters();
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

    const handleUpload = async (files: File[]) => {
        try {
            const supabase = createClient();

            for (const file of files) {
                // 1. Get Presigned URL
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: JSON.stringify({ filename: file.name, contentType: file.type, folder: "uploads" }),
                });
                const { url, key } = await res.json();
                if (!url) throw new Error("Failed to get upload URL");

                // 2. Upload to R2
                await fetch(url, {
                    method: "PUT",
                    body: file,
                    headers: { "Content-Type": file.type },
                });

                // 3. Construct Public URL
                const publicUrl = `https://pub-r2.natak.io/${key}`;

                // 4. Save to Supabase
                const { error } = await supabase.from('assets').insert({
                    user_id: TEST_USER_ID,
                    url: publicUrl,
                    type: file.type.startsWith('video') ? 'video' : 'image',
                    source: 'upload',
                    caption: file.name,
                    storage_path: key
                });

                if (error) console.error('DB Insert Error:', error);
            }

            refreshAssets(); // Refresh grid

        } catch (e) {
            console.error("Upload failed:", e);
            alert("Upload failed");
        }
    };

    // Helper for clothing reference only (returns key)
    const uploadFile = async (file: File) => {
        const res = await fetch("/api/upload", {
            method: "POST",
            body: JSON.stringify({ filename: file.name, contentType: file.type, folder: "clothing-refs" }),
        });
        const { url, key } = await res.json();
        await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
        return key;
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

            // Real API Submission
            const promises = selectedAssetIds.map(async (id) => {
                const asset = assets.find(a => a.id === id);
                if (!asset) return null;

                const payload = {
                    userId: TEST_USER_ID, // Use Real Admin ID
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

                    // Video Logic
                    generateVideo: useVideo ? true : generateVideoLTX,
                    video_action: useVideo ? videoAction : undefined,
                    video_model: useVideo ? 'Wan 2.2 Animate' : (generateVideoLTX ? 'LTX-2' : undefined)
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
                return res.json();
            });

            await Promise.all(promises);

            setSelectedAssetIds([]);
            setShowQueueSidebar(false);
            setClothingImage(null);

            // Trigger refreshes
            refreshJobs();

            alert(`Successfully queued ${selectedAssetIds.length} generation jobs.`);
        } catch (error) {
            console.error(error);
            alert('Failed to initiate batch: ' + ((error as Error).message || String(error)));
        }
    };

    const submitDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedAssetIds.length} assets? This cannot be undone.`)) return;

        try {
            const res = await fetch("/api/assets/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assetIds: selectedAssetIds }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Deletion failed");
            }

            // Success
            setSelectedAssetIds([]);
            setShowQueueSidebar(false);
            refreshAssets();
            alert("Assets deleted successfully.");

        } catch (error) {
            console.error("Delete failed:", error);
            alert("Delete failed");
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
                        <Button
                            onClick={() => setShowQueueSidebar(!showQueueSidebar)}
                            size="sm"
                            className={cn(
                                "border transition-all duration-300",
                                showQueueSidebar
                                    ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(204,255,0,0.3)]'
                                    : 'bg-[#1A1A1D] text-slate-400 border-white/10 hover:border-white/20'
                            )}
                        >
                            <Settings className={cn("w-4 h-4", showQueueSidebar ? "animate-spin-slow" : "")} />
                            <span className="ml-2 text-[10px] font-black uppercase tracking-widest hidden lg:inline">Studio</span>
                        </Button>
                    </div>
                </header>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {filteredAssets.length > 0 ? (
                        <>
                            {/* Upload Area */}
                            <div className="mb-6">
                                <FileUpload onChange={handleUpload} />
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

            {/* RIGHT: Config Sidebar (Floating Glass Card) */}
            <aside className={
                cn(
                    "w-[400px] bg-black/60 backdrop-blur-3xl border border-white/10 flex flex-col transition-all duration-500 fixed right-6 top-6 bottom-6 z-30 rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)] overflow-hidden",
                    showQueueSidebar ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-[450px] opacity-0 scale-95 pointer-events-none'
                )
            }>
                <div className="p-4 border-b border-white/10 bg-black/20 backdrop-blur-md flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-[11px] font-black tracking-widest uppercase text-white">Batch Studio</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{selectedAssetIds.length} Assets Selected</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowQueueSidebar(false)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                    >
                        <X className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
                    {/* Existing Config Logic */}
                    <div className="flex bg-black border border-white/10 p-1 rounded-sm">
                        <button
                            onClick={() => setUseVideo(false)}
                            className={cn("flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all", !useVideo ? 'bg-white text-black' : 'text-slate-500 hover:text-white')}
                        >
                            Studio (ETL)
                        </button>
                        <button
                            onClick={() => setUseVideo(true)}
                            className={cn("flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all", useVideo ? 'bg-primary text-black' : 'text-slate-500 hover:text-white')}
                        >
                            Motion Control
                        </button>
                    </div>

                    {useVideo ? (
                        /* MOTION CONTROL CONFIG (Wan 2.2) */
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
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">2. Action</label>
                                <Select value={videoAction} onValueChange={setVideoAction}>
                                    <SelectTrigger className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:ring-0 focus:ring-offset-0 font-mono h-auto">
                                        <SelectValue placeholder="Select Action" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black border border-white/10 text-white">
                                        <SelectItem value="animate" className="focus:bg-white/10 focus:text-white cursor-pointer">Animate (Wan 2.2)</SelectItem>
                                        <SelectItem value="style_transfer" className="focus:bg-white/10 focus:text-white cursor-pointer">Style Transfer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">3. Engine</label>
                                <Select disabled defaultValue="wan2.2">
                                    <SelectTrigger className="w-full bg-zinc-900 border border-white/10 rounded-sm px-4 py-3 text-xs text-slate-400 font-mono opacity-80 cursor-not-allowed h-auto focus:ring-0">
                                        <SelectValue placeholder="Wan 2.2 14B" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black border border-white/10 text-white">
                                        <SelectItem value="wan2.2">Wan 2.2 14B</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </section>
                    ) : (
                        /* STUDIO CONFIG (Image + LTX-2) */
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

                            <div className="border border-primary/20 bg-primary/5 p-4 rounded-sm flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-black text-primary uppercase tracking-widest">Generate Video</div>
                                    <div className="text-[8px] text-slate-500">Enable LTX-2 follow-up</div>
                                </div>
                                <button
                                    onClick={() => setGenerateVideoLTX(!generateVideoLTX)}
                                    className={cn("w-10 h-5 rounded-full relative transition-colors duration-200", generateVideoLTX ? 'bg-primary' : 'bg-zinc-800')}
                                >
                                    <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200", generateVideoLTX ? 'left-6' : 'left-1')} />
                                </button>
                            </div>
                        </section>
                    )}

                </div>

                <div className="p-4 border-t border-white/10 bg-[#0F0F11] space-y-3 flex-shrink-0">
                    <Button variant="natak" onClick={submitBatch} className="w-full py-4 shadow-[0_10px_40px_rgba(204,255,0,0.2)]">
                        {useVideo ? 'INITIATE MOTION ACTION' : 'INITIATE STUDIO BATCH'}
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setUseVideo(!useVideo)}
                        className={cn("w-full py-3 border text-[10px] uppercase tracking-wider", useVideo ? 'border-primary text-primary' : 'border-white/10 text-slate-400')}
                    >
                        {useVideo ? '← Switch to Image' : 'Create Video →'}
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={handleDeleteClick}
                        className="w-full py-3 border border-red-900/30 text-[10px] uppercase tracking-wider text-red-500 hover:bg-red-900/20 hover:text-red-400"
                    >
                        Delete Selected ({selectedAssetIds.length})
                    </Button>
                </div>
            </aside >

            {/* Modals */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                count={selectedAssetIds.length}
                loading={isDeleting}
            />
        </div >
    );
}
