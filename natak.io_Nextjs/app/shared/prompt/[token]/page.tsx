"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Copy, Check, Image as ImageIcon, Video, Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SharedPrompt {
    id: string;
    prompt: string;
    title: string;
    generation_type: 'image' | 'video' | 'motion_control';
    tags?: string[];
    created_at: string;
    collection?: {
        name: string;
        color: string;
    };
}

export default function SharedPromptPage() {
    const params = useParams();
    const token = params.token as string;
    const [prompt, setPrompt] = useState<SharedPrompt | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchPrompt = async () => {
            try {
                const res = await fetch(`/api/prompts/share/${token}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Prompt not found');
                }

                setPrompt(data.prompt);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchPrompt();
        }
    }, [token]);

    const handleCopy = () => {
        if (prompt) {
            navigator.clipboard.writeText(prompt.prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video':
                return <Video className="w-4 h-4 text-purple-400" />;
            case 'motion_control':
                return <Sparkles className="w-4 h-4 text-lime-400" />;
            default:
                return <ImageIcon className="w-4 h-4 text-blue-400" />;
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !prompt) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] text-white flex flex-col items-center justify-center p-4">
                <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
                    <span className="text-4xl">🔒</span>
                </div>
                <h1 className="text-2xl font-bold mb-2">Prompt Not Found</h1>
                <p className="text-zinc-500 text-center max-w-md mb-6">
                    This prompt may have been deleted or is no longer shared.
                </p>
                <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white">
            {/* Header */}
            <header className="border-b border-zinc-800 p-6">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-sm font-black text-black">N</span>
                        </div>
                        <span className="text-sm font-bold uppercase tracking-wider">NATAK.IO</span>
                    </Link>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Shared Prompt</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto p-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
                >
                    {/* Title Section */}
                    <div className="p-8 border-b border-zinc-800">
                        <div className="flex items-center gap-3 mb-4">
                            <span className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border",
                                getTypeColor(prompt.generation_type)
                            )}>
                                {getTypeIcon(prompt.generation_type)}
                                {prompt.generation_type?.replace('_', ' ') || 'Image'}
                            </span>
                            {prompt.collection && (
                                <span className="flex items-center gap-2 text-[10px] text-zinc-500">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: prompt.collection.color }}
                                    />
                                    {prompt.collection.name}
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl font-black">{prompt.title || 'Untitled Prompt'}</h1>
                        <p className="text-zinc-500 text-sm mt-2">
                            Shared on {new Date(prompt.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    {/* Prompt Content */}
                    <div className="p-8">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">
                            Prompt
                        </label>
                        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {prompt.prompt}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-8 pt-0">
                        <button
                            onClick={handleCopy}
                            className={cn(
                                "w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all",
                                copied
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : "bg-primary text-black hover:bg-primary/90"
                            )}
                        >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            {copied ? 'Copied to Clipboard!' : 'Copy This Prompt'}
                        </button>
                    </div>
                </motion.div>

                {/* CTA */}
                <div className="mt-8 text-center">
                    <p className="text-zinc-500 text-sm mb-4">Want to create prompts like this?</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 rounded-xl font-bold hover:bg-zinc-700 transition-colors"
                    >
                        Try NATAK.IO Free
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
