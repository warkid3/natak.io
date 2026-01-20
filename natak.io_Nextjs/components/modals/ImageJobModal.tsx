"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, Bookmark, Check, ExternalLink, Image as ImageIcon, ZoomIn } from 'lucide-react';
import { OperationsJob } from '@/types/operations';
import { cn } from '@/lib/utils';

interface ImageJobModalProps {
    job: OperationsJob;
    onClose: () => void;
    onAction: (action: 'retry' | 'approve' | 'reject') => void;
    onSavePrompt?: (prompt: string, jobId: string) => void;
}

export function ImageJobModal({ job, onClose, onAction, onSavePrompt }: ImageJobModalProps) {
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    const handleCopyPrompt = () => {
        navigator.clipboard.writeText(job.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSavePrompt = async () => {
        if (onSavePrompt) {
            onSavePrompt(job.prompt, job.id);
            setSaved(true);
        }
    };

    return (
        <AnimatePresence>
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
                    className="bg-zinc-900 border border-blue-500/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-blue-500/10"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-md border-b border-blue-500/20 p-6 flex items-center justify-between z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{job.character_name || 'Image Generation'}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{job.id.slice(0, 8)}</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Image Only</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-zinc-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6 space-y-6">
                        {/* Enhanced Image Preview */}
                        <div className="relative group">
                            {job.output_url ? (
                                <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                                    {/* Main Image Container */}
                                    <div
                                        className={cn(
                                            "relative bg-zinc-950 transition-all duration-300 cursor-zoom-in",
                                            isZoomed ? "aspect-auto" : "aspect-[4/3]"
                                        )}
                                        onClick={() => setIsZoomed(!isZoomed)}
                                    >
                                        <img
                                            src={job.output_url}
                                            alt="Generated Image"
                                            className={cn(
                                                "w-full transition-transform duration-300",
                                                isZoomed ? "h-auto object-contain" : "h-full object-contain group-hover:scale-[1.02]"
                                            )}
                                        />
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </div>

                                    {/* Preview Actions */}
                                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setIsZoomed(!isZoomed)}
                                            className="p-2.5 bg-black/70 backdrop-blur-md rounded-lg hover:bg-black/90 transition-colors border border-white/10"
                                            title={isZoomed ? "Zoom Out" : "Zoom In"}
                                        >
                                            <ZoomIn className="w-4 h-4 text-white" />
                                        </button>
                                        <button
                                            onClick={() => window.open(job.output_url, '_blank')}
                                            className="p-2.5 bg-black/70 backdrop-blur-md rounded-lg hover:bg-black/90 transition-colors border border-white/10"
                                            title="View Full Size"
                                        >
                                            <ExternalLink className="w-4 h-4 text-white" />
                                        </button>
                                        <a
                                            href={job.output_url}
                                            download
                                            className="p-2.5 bg-black/70 backdrop-blur-md rounded-lg hover:bg-black/90 transition-colors border border-white/10"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4 text-white" />
                                        </a>
                                    </div>

                                    {/* Image Info Badge */}
                                    <div className="absolute top-4 left-4 flex items-center gap-2">
                                        <span className="px-3 py-1.5 bg-blue-500/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-blue-400 border border-blue-500/30 uppercase tracking-widest">
                                            Generated Output
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-[4/3] bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin mx-auto mb-4" />
                                        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Processing...</p>
                                        <p className="text-zinc-600 text-xs mt-1">Image generation in progress</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Job Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <InfoCard label="Status" value={job.status.toUpperCase()} color="blue" />
                            <InfoCard label="Progress" value={`${job.progress}%`} />
                            <InfoCard label="Platform" value={job.platform} />
                            <InfoCard label="Cost" value={`$${job.cost.toFixed(3)}`} />
                        </div>

                        {/* Prompt Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Prompt</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCopyPrompt}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all",
                                            copied
                                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                : "bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700"
                                        )}
                                    >
                                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button
                                        onClick={handleSavePrompt}
                                        disabled={saved}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all",
                                            saved
                                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                : "bg-blue-500 text-white hover:bg-blue-600 border border-blue-500"
                                        )}
                                    >
                                        <Bookmark className="w-3 h-3" />
                                        {saved ? 'Saved!' : 'Save to Archive'}
                                    </button>
                                </div>
                            </div>
                            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 leading-relaxed">
                                {job.prompt}
                            </div>
                        </div>

                        {/* Error */}
                        {job.error && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-rose-500">Error</label>
                                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-sm text-rose-400">
                                    {job.error}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex gap-3">
                        {job.status === 'failed' && (
                            <button
                                onClick={() => onAction('retry')}
                                className="flex-1 bg-rose-500 text-white py-3 rounded-xl font-bold hover:bg-rose-600 transition-all"
                            >
                                Retry Generation
                            </button>
                        )}
                        {job.status === 'completed' && job.quality_status === 'pending' && (
                            <>
                                <button
                                    onClick={() => onAction('approve')}
                                    className="flex-1 bg-emerald-500 text-black py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => onAction('reject')}
                                    className="flex-1 bg-zinc-800 text-white py-3 rounded-xl font-bold hover:bg-zinc-700 transition-all"
                                >
                                    Reject
                                </button>
                            </>
                        )}
                        {job.output_url && (
                            <a
                                href={job.output_url}
                                download
                                className="flex items-center justify-center gap-2 px-6 bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </a>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function InfoCard({ label, value, color = 'default' }: { label: string; value: string; color?: 'blue' | 'default' }) {
    return (
        <div className={cn(
            "bg-zinc-950 border rounded-xl p-4",
            color === 'blue' ? 'border-blue-500/20' : 'border-zinc-800'
        )}>
            <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1">{label}</div>
            <div className={cn(
                "text-lg font-bold",
                color === 'blue' ? 'text-blue-400' : 'text-white'
            )}>{value}</div>
        </div>
    );
}

export default ImageJobModal;
