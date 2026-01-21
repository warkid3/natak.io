"use client";

import React, { useState, useEffect } from 'react';
import { Heart, FolderPlus, Download, MoreVertical, Folder, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';

interface LibraryOutput {
    id: string;
    character_name: string;
    output_url: string;
    video_url?: string;
    prompt: string;
    format: string;
    platform: string;
    is_nsfw: boolean;
    created_at: string;
    isFavorited: boolean;
}

interface Collection {
    id: string;
    name: string;
    description?: string;
    collection_items: { count: number }[];
}

export default function LibraryPage() {
    const { user, loading: userLoading } = useUser();
    const [outputs, setOutputs] = useState<LibraryOutput[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [filter, setFilter] = useState<'all' | 'favorites' | 'collection'>('all');
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showCreateCollection, setShowCreateCollection] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchLibrary();
            fetchCollections();
        }
    }, [filter, selectedCollection, user?.id]);

    const fetchLibrary = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            let url = `/api/library?userId=${user.id}&filter=${filter}`;
            if (filter === 'collection' && selectedCollection) {
                url += `&collectionId=${selectedCollection}`;
            }

            const res = await fetch(url);
            const data = await res.json();
            setOutputs(data.outputs || []);
        } catch (error) {
            console.error('Failed to fetch library:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCollections = async () => {
        if (!user?.id) return;
        try {
            const res = await fetch(`/api/library/collections?userId=${user.id}`);
            const data = await res.json();
            setCollections(data.collections || []);
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        }
    };

    const toggleFavorite = async (jobId: string, currentlyFavorited: boolean) => {
        if (!user?.id) return;
        try {
            if (currentlyFavorited) {
                await fetch(`/api/library/favorites?userId=${user.id}&jobId=${jobId}`, {
                    method: 'DELETE',
                });
            } else {
                await fetch('/api/library/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, jobId }),
                });
            }
            fetchLibrary();
        } catch (error) {
            console.error('Toggle favorite failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white p-8">
            <div className="flex gap-8">
                {/* Sidebar */}
                <aside className="w-64 flex-shrink-0">
                    <div className="sticky top-8 space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Library</h2>
                            <p className="text-zinc-500 text-sm">Your approved outputs</p>
                        </div>

                        {/* Filters */}
                        <div className="space-y-1">
                            <button
                                onClick={() => { setFilter('all'); setSelectedCollection(null); }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all",
                                    filter === 'all' ? 'bg-primary text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                )}
                            >
                                <Folder className="w-4 h-4" />
                                All Outputs
                            </button>
                            <button
                                onClick={() => { setFilter('favorites'); setSelectedCollection(null); }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all",
                                    filter === 'favorites' ? 'bg-primary text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                )}
                            >
                                <Star className="w-4 h-4" />
                                Favorites
                            </button>
                        </div>

                        {/* Collections */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Collections</h3>
                                <button
                                    onClick={() => setShowCreateCollection(true)}
                                    className="p-1 hover:bg-zinc-800 rounded transition-colors"
                                >
                                    <FolderPlus className="w-4 h-4 text-zinc-500 hover:text-primary" />
                                </button>
                            </div>
                            <div className="space-y-1">
                                {collections.map((collection) => (
                                    <button
                                        key={collection.id}
                                        onClick={() => { setFilter('collection'); setSelectedCollection(collection.id); }}
                                        className={cn(
                                            "w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all",
                                            selectedCollection === collection.id ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                        )}
                                    >
                                        <span className="truncate">{collection.name}</span>
                                        <span className="text-xs text-zinc-600 ml-2">{collection.collection_items?.[0]?.count || 0}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {loading ? (
                        <div className="text-center py-20 text-zinc-500">Loading...</div>
                    ) : outputs.length === 0 ? (
                        <EmptyLibraryState filter={filter} />
                    ) : (
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                            {outputs.map((output) => (
                                <OutputCard
                                    key={output.id}
                                    output={output}
                                    onToggleFavorite={toggleFavorite}
                                    onAddToCollection={() => {/* TODO */ }}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Create Collection Modal */}
            {showCreateCollection && (
                <CreateCollectionModal
                    userId={user?.id}
                    onClose={() => setShowCreateCollection(false)}
                    onCreated={fetchCollections}
                />
            )}
        </div>
    );
}

function OutputCard({ output, onToggleFavorite, onAddToCollection }: any) {
    return (
        <div className="mb-4 break-inside-avoid group relative">
            <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                <img
                    src={output.output_url}
                    alt={output.prompt}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Top bar */}
                    <div className="flex justify-between items-start">
                        <div className="flex gap-2">
                            {output.is_nsfw && <span className="px-2 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded">18+</span>}
                            <span className="px-2 py-0.5 bg-zinc-900/80 text-white text-[9px] font-bold rounded">{output.platform}</span>
                        </div>
                        <button
                            onClick={() => onToggleFavorite(output.id, output.isFavorited)}
                            className="p-2 bg-zinc-900/80 rounded-full hover:bg-zinc-800 transition-all"
                        >
                            <Heart className={cn("w-4 h-4", output.isFavorited ? "fill-rose-500 text-rose-500" : "text-white")} />
                        </button>
                    </div>

                    {/* Bottom bar */}
                    <div className="flex items-end justify-between">
                        <div className="flex-1">
                            <div className="font-bold text-sm mb-1">{output.character_name}</div>
                            <div className="text-xs text-zinc-400 line-clamp-2">{output.prompt}</div>
                        </div>
                        <div className="flex gap-2 ml-2">
                            <button
                                onClick={onAddToCollection}
                                className="p-2 bg-zinc-900/80 rounded-full hover:bg-primary hover:text-black transition-all"
                                title="Add to collection"
                            >
                                <FolderPlus className="w-4 h-4" />
                            </button>
                            <a
                                href={output.output_url}
                                download
                                className="p-2 bg-zinc-900/80 rounded-full hover:bg-primary hover:text-black transition-all"
                                title="Download"
                            >
                                <Download className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EmptyLibraryState({ filter }: { filter: string }) {
    const messages = {
        all: "No outputs yet. Approve jobs from the Operations Center to populate your library.",
        favorites: "No favorites yet. Star outputs to add them to this list.",
        collection: "This collection is empty. Add outputs from your library.",
    };

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <Folder className="w-16 h-16 text-zinc-800 mb-4" />
            <h3 className="text-xl font-bold mb-2">Empty {filter === 'all' ? 'Library' : filter === 'favorites' ? 'Favorites' : 'Collection'}</h3>
            <p className="text-zinc-500 max-w-md">{messages[filter as keyof typeof messages]}</p>
        </div>
    );
}

function CreateCollectionModal({ userId, onClose, onCreated }: { userId?: string; onClose: () => void; onCreated: () => void }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = async () => {
        if (!userId) return;
        try {
            await fetch('/api/library/collections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, name, description }),
            });
            onCreated();
            onClose();
        } catch (error) {
            console.error('Create collection failed:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold mb-4">Create Collection</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-zinc-400 mb-2 block">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white"
                            placeholder="e.g., Instagram Posts"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-zinc-400 mb-2 block">Description (optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white h-20 resize-none"
                            placeholder="What's this collection for?"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={!name}
                            className="flex-1 px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
