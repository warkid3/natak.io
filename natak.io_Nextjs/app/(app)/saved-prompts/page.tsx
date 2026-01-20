"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePrompts, SavedPrompt, PromptCollection } from '@/hooks/use-prompts';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    Folder,
    Download,
    Copy,
    Trash2,
    Share2,
    Check,
    X,
    Image as ImageIcon,
    Video,
    Sparkles,
    ExternalLink,
    MoreVertical,
    Eye,
    CheckSquare,
    Square,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function SavedPromptsPage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPrompt, setSelectedPrompt] = useState<SavedPrompt | null>(null);
    const [showCreateCollection, setShowCreateCollection] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [selectedPromptIds, setSelectedPromptIds] = useState<Set<string>>(new Set());
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const router = useRouter();

    // Get current user
    useEffect(() => {
        const getUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
        };
        getUser();
    }, []);

    const {
        prompts,
        collections,
        totalPrompts,
        loading,
        savePrompt,
        updatePrompt,
        deletePrompt,
        createCollection,
        deleteCollection,
        refresh
    } = usePrompts(userId || undefined, {
        collectionId: selectedCollection || undefined,
        search: searchQuery || undefined
    });

    const handleCopyPrompt = (prompt: SavedPrompt) => {
        navigator.clipboard.writeText(prompt.prompt);
        setCopiedId(prompt.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleSharePrompt = async (prompt: SavedPrompt) => {
        // Toggle public status and copy share link
        const newPublicStatus = !prompt.is_public;
        await updatePrompt(prompt.id, { isPublic: newPublicStatus });

        if (newPublicStatus) {
            const shareUrl = `${window.location.origin}/shared/prompt/${prompt.share_token}`;
            navigator.clipboard.writeText(shareUrl);
            alert('Share link copied! Anyone with the link can view this prompt.');
        }
    };

    const handleDeletePrompt = async (id: string) => {
        if (confirm('Are you sure you want to delete this prompt?')) {
            await deletePrompt(id);
            setSelectedPrompt(null);
        }
    };

    const handleCreateCollection = async () => {
        if (newCollectionName.trim()) {
            await createCollection(newCollectionName.trim());
            setNewCollectionName('');
            setShowCreateCollection(false);
        }
    };

    const handleExportCSV = () => {
        const params = new URLSearchParams();
        if (selectedCollection) params.append('collection_id', selectedCollection);
        // If in select mode with selections, pass IDs
        if (isSelectMode && selectedPromptIds.size > 0) {
            params.append('ids', Array.from(selectedPromptIds).join(','));
        }
        window.open(`/api/prompts/export?${params.toString()}`, '_blank');
    };

    const togglePromptSelection = (id: string) => {
        const newSet = new Set(selectedPromptIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedPromptIds(newSet);
    };

    const selectAllPrompts = () => {
        if (selectedPromptIds.size === prompts.length) {
            setSelectedPromptIds(new Set());
        } else {
            setSelectedPromptIds(new Set(prompts.map(p => p.id)));
        }
    };

    const clearSelection = () => {
        setSelectedPromptIds(new Set());
        setIsSelectMode(false);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video':
                return <Video className="w-3 h-3 text-purple-400" />;
            case 'motion_control':
                return <Sparkles className="w-3 h-3 text-lime-400" />;
            default:
                return <ImageIcon className="w-3 h-3 text-blue-400" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'video':
                return 'border-purple-500/30 bg-purple-500/10 text-purple-400';
            case 'motion_control':
                return 'border-lime-500/30 bg-lime-500/10 text-lime-400';
            default:
                return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
        }
    };

    return (
        <div className="flex h-full w-full bg-[#0a0a0b] text-white overflow-hidden">
            {/* LEFT: Collections Sidebar */}
            <aside
                className={cn(
                    "border-r border-zinc-800 bg-[#0a0a0b] flex flex-col transition-all duration-300 relative",
                    sidebarCollapsed ? "w-16" : "w-72"
                )}
            >
                {/* Collapse Toggle Button */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="absolute -right-3 top-6 z-20 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center hover:bg-zinc-700 transition-colors"
                >
                    {sidebarCollapsed ? (
                        <ChevronRight className="w-3 h-3 text-zinc-400" />
                    ) : (
                        <ChevronLeft className="w-3 h-3 text-zinc-400" />
                    )}
                </button>
                <div className={cn("p-6 border-b border-zinc-800", sidebarCollapsed && "p-4")}>
                    {!sidebarCollapsed && (
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                            {totalPrompts} Stored Sequences
                        </p>
                    )}
                    {sidebarCollapsed && (
                        <p className="text-[10px] text-zinc-500 font-bold text-center">{totalPrompts}</p>
                    )}
                </div>

                <div className={cn("flex-1 overflow-y-auto space-y-2", sidebarCollapsed ? "p-2" : "p-4")}>
                    {/* All Prompts */}
                    <button
                        onClick={() => setSelectedCollection(null)}
                        className={cn(
                            "w-full flex items-center rounded-xl transition-all",
                            sidebarCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                            !selectedCollection
                                ? "bg-primary/10 border border-primary/30 text-primary"
                                : "hover:bg-zinc-800/50 text-zinc-400"
                        )}
                        title="All Prompts"
                    >
                        <Folder className="w-4 h-4 flex-shrink-0" />
                        {!sidebarCollapsed && (
                            <>
                                <span className="text-sm font-bold">All Prompts</span>
                                <span className="ml-auto text-xs font-mono">{totalPrompts}</span>
                            </>
                        )}
                    </button>

                    {/* Collections */}
                    {collections.map(col => (
                        <button
                            key={col.id}
                            onClick={() => setSelectedCollection(col.id)}
                            className={cn(
                                "w-full flex items-center rounded-xl transition-all group",
                                sidebarCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                                selectedCollection === col.id
                                    ? "bg-zinc-800 border border-zinc-700 text-white"
                                    : "hover:bg-zinc-800/50 text-zinc-400"
                            )}
                            title={col.name}
                        >
                            <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: col.color }}
                            />
                            {!sidebarCollapsed && (
                                <>
                                    <span className="text-sm font-bold truncate">{col.name}</span>
                                    <span className="ml-auto text-xs font-mono">{col.prompt_count || 0}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Delete this collection?')) deleteCollection(col.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-all"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </>
                            )}
                        </button>
                    ))}

                    {/* Create Collection */}
                    {!sidebarCollapsed && (
                        showCreateCollection ? (
                            <div className="flex gap-2 p-2 bg-zinc-900 rounded-xl border border-zinc-700">
                                <Input
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    placeholder="Collection name..."
                                    className="h-8 text-xs bg-transparent border-0 focus-visible:ring-0"
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateCollection()}
                                    autoFocus
                                />
                                <button onClick={handleCreateCollection} className="text-primary hover:text-primary/80">
                                    <Check className="w-4 h-4" />
                                </button>
                                <button onClick={() => setShowCreateCollection(false)} className="text-zinc-500 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowCreateCollection(true)}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-500 transition-all"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="text-sm font-bold">New Collection</span>
                            </button>
                        )
                    )}
                    {sidebarCollapsed && (
                        <button
                            onClick={() => {
                                setSidebarCollapsed(false);
                                setShowCreateCollection(true);
                            }}
                            className="w-full flex items-center justify-center p-3 rounded-xl border border-dashed border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-500 transition-all"
                            title="New Collection"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Export Button */}
                <div className={cn("border-t border-zinc-800", sidebarCollapsed ? "p-2" : "p-4")}>
                    <Button
                        onClick={handleExportCSV}
                        variant="outline"
                        className={cn("w-full", sidebarCollapsed ? "p-2" : "gap-2")}
                        title="Export as CSV"
                    >
                        <Download className="w-4 h-4" />
                        {!sidebarCollapsed && "Export as CSV"}
                    </Button>
                </div>
            </aside>

            {/* MAIN: Prompts Grid */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="flex-shrink-0 border-b border-zinc-800 p-6 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search prompts..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-600"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        {isSelectMode ? (
                            <>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                                    {selectedPromptIds.size} selected
                                </span>
                                <button
                                    onClick={selectAllPrompts}
                                    className="px-3 py-1.5 text-xs font-bold bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                                >
                                    {selectedPromptIds.size === prompts.length ? 'Deselect All' : 'Select All'}
                                </button>
                                <button
                                    onClick={handleExportCSV}
                                    disabled={selectedPromptIds.size === 0}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                        selectedPromptIds.size > 0
                                            ? "bg-primary text-black hover:bg-primary/90"
                                            : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                                    )}
                                >
                                    <Download className="w-4 h-4" />
                                    Export Selected
                                </button>
                                <button
                                    onClick={clearSelection}
                                    className="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                    {prompts.length} prompts
                                </span>
                                <button
                                    onClick={() => setIsSelectMode(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition-colors"
                                >
                                    <CheckSquare className="w-4 h-4" />
                                    Select
                                </button>
                            </>
                        )}
                    </div>
                </header>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : prompts.length === 0 ? (
                        <EmptyState hasSearch={!!searchQuery} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {prompts.map((prompt) => (
                                <motion.div
                                    key={prompt.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "group bg-zinc-900 border rounded-xl p-5 transition-all cursor-pointer",
                                        isSelectMode && selectedPromptIds.has(prompt.id)
                                            ? "border-primary bg-primary/5"
                                            : "border-zinc-800 hover:border-zinc-700"
                                    )}
                                    onClick={() => isSelectMode ? togglePromptSelection(prompt.id) : setSelectedPrompt(prompt)}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            {isSelectMode && (
                                                <div
                                                    className={cn(
                                                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0",
                                                        selectedPromptIds.has(prompt.id)
                                                            ? "bg-primary border-primary"
                                                            : "border-zinc-600"
                                                    )}
                                                >
                                                    {selectedPromptIds.has(prompt.id) && (
                                                        <Check className="w-3 h-3 text-black" />
                                                    )}
                                                </div>
                                            )}
                                            <span className={cn(
                                                "flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold uppercase border",
                                                getTypeColor(prompt.generation_type)
                                            )}>
                                                {getTypeIcon(prompt.generation_type)}
                                                {prompt.generation_type?.replace('_', ' ')}
                                            </span>
                                            {prompt.is_public && (
                                                <span className="text-[9px] text-green-400 font-bold uppercase">Shared</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopyPrompt(prompt);
                                            }}
                                            className={cn(
                                                "p-1.5 rounded-lg transition-all",
                                                copiedId === prompt.id
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "opacity-0 group-hover:opacity-100 bg-zinc-800 text-zinc-400 hover:text-white"
                                            )}
                                        >
                                            {copiedId === prompt.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        </button>
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-bold text-white mb-2 truncate">
                                        {prompt.title || 'Untitled Prompt'}
                                    </h3>

                                    {/* Prompt Preview */}
                                    <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                                        {prompt.prompt}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800">
                                        {prompt.collection && (
                                            <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: prompt.collection.color }}
                                                />
                                                {prompt.collection.name}
                                            </div>
                                        )}
                                        <span className="text-[10px] text-zinc-600 ml-auto">
                                            {new Date(prompt.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Prompt Detail Modal */}
            <AnimatePresence>
                {selectedPrompt && (
                    <PromptDetailModal
                        prompt={selectedPrompt}
                        collections={collections}
                        onClose={() => setSelectedPrompt(null)}
                        onCopy={() => handleCopyPrompt(selectedPrompt)}
                        onShare={() => handleSharePrompt(selectedPrompt)}
                        onDelete={() => handleDeletePrompt(selectedPrompt.id)}
                        onUpdate={async (updates) => {
                            await updatePrompt(selectedPrompt.id, updates);
                            refresh();
                        }}
                        copied={copiedId === selectedPrompt.id}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center h-full py-20">
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
                <Folder className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
                {hasSearch ? 'No prompts found' : 'No saved prompts yet'}
            </h3>
            <p className="text-zinc-500 text-sm text-center max-w-md">
                {hasSearch
                    ? 'Try adjusting your search query'
                    : 'Save prompts from your generation jobs to build your prompt library'}
            </p>
        </div>
    );
}

interface PromptDetailModalProps {
    prompt: SavedPrompt;
    collections: PromptCollection[];
    onClose: () => void;
    onCopy: () => void;
    onShare: () => void;
    onDelete: () => void;
    onUpdate: (updates: { title?: string; collectionId?: string }) => void;
    copied: boolean;
}

function PromptDetailModal({
    prompt,
    collections,
    onClose,
    onCopy,
    onShare,
    onDelete,
    onUpdate,
    copied
}: PromptDetailModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(prompt.title || '');

    const handleSaveTitle = () => {
        if (editTitle.trim() !== prompt.title) {
            onUpdate({ title: editTitle.trim() });
        }
        setIsEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onBlur={handleSaveTitle}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                                className="text-xl font-bold bg-transparent border-b border-primary focus:outline-none w-full"
                                autoFocus
                            />
                        ) : (
                            <h2
                                className="text-xl font-bold cursor-pointer hover:text-primary transition-colors"
                                onClick={() => setIsEditing(true)}
                            >
                                {prompt.title || 'Untitled Prompt'}
                            </h2>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                            <span className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold uppercase border",
                                prompt.generation_type === 'video' ? 'border-purple-500/30 bg-purple-500/10 text-purple-400' :
                                    prompt.generation_type === 'motion_control' ? 'border-lime-500/30 bg-lime-500/10 text-lime-400' :
                                        'border-blue-500/30 bg-blue-500/10 text-blue-400'
                            )}>
                                {prompt.generation_type?.replace('_', ' ') || 'image'}
                            </span>
                            {prompt.is_public && (
                                <span className="text-[9px] text-green-400 font-bold uppercase flex items-center gap-1">
                                    <Share2 className="w-3 h-3" /> Shared
                                </span>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full">
                        <X className="w-5 h-5 text-zinc-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[50vh]">
                    {/* Collection Selector */}
                    <div className="mb-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">
                            Collection
                        </label>
                        <select
                            value={prompt.collection_id || ''}
                            onChange={(e) => onUpdate({ collectionId: e.target.value || undefined })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white"
                        >
                            <option value="">No Collection</option>
                            {collections.map(col => (
                                <option key={col.id} value={col.id}>{col.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Full Prompt */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">
                            Full Prompt
                        </label>
                        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {prompt.prompt}
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="mt-6 flex items-center gap-4 text-[10px] text-zinc-500">
                        <span>Created: {new Date(prompt.created_at).toLocaleString()}</span>
                        {prompt.source_job_id && (
                            <span>From Job: {prompt.source_job_id.slice(0, 8)}</span>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-zinc-800 flex gap-3">
                    <button
                        onClick={onCopy}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all",
                            copied
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-zinc-800 text-white hover:bg-zinc-700"
                        )}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy Prompt'}
                    </button>
                    <button
                        onClick={onShare}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all",
                            prompt.is_public
                                ? "bg-green-500 text-white"
                                : "bg-primary text-black hover:bg-primary/90"
                        )}
                    >
                        <Share2 className="w-4 h-4" />
                        {prompt.is_public ? 'Copy Share Link' : 'Share Prompt'}
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-4 py-3 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
