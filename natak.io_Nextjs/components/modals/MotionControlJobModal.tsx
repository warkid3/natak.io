"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, Bookmark, Check, Sparkles, Play, Pause, ArrowLeftRight, Image as ImageIcon, Video } from 'lucide-react';
import { OperationsJob } from '@/types/operations';
import { cn } from '@/lib/utils';

interface MotionControlJobModalProps {
    job: OperationsJob;
    onClose: () => void;
    onAction: (action: 'retry' | 'approve' | 'reject') => void;
    onSavePrompt?: (prompt: string, jobId: string) => void;
}

type PreviewMode = 'comparison' | 'source' | 'animation';

export function MotionControlJobModal({ job, onClose, onAction, onSavePrompt }: MotionControlJobModalProps) {
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [previewMode, setPreviewMode] = useState<PreviewMode>('comparison');
    const [sliderPosition, setSliderPosition] = useState(50);
    const videoRef = useRef<HTMLVideoElement>(null);
    const comparisonRef = useRef<HTMLDivElement>(null);

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

    const togglePlayback = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Handle comparison slider
    const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!comparisonRef.current) return;
        const rect = comparisonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setSliderPosition(Math.min(Math.max(percentage, 0), 100));
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
                    className="bg-zinc-900 border border-lime-500/20 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-lime-500/10"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-md border-b border-lime-500/20 p-6 flex items-center justify-between z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-lime-500/20 flex items-center justify-center relative">
                                <Sparkles className="w-5 h-5 text-lime-400" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-lime-500 rounded-full animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{job.character_name || 'Motion Control'}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{job.id.slice(0, 8)}</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                    <span className="text-[10px] font-bold text-lime-400 uppercase tracking-widest">Wan 2.2 Animate</span>
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
                        {/* Preview Mode Tabs */}
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setPreviewMode('comparison')}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all",
                                    previewMode === 'comparison'
                                        ? "bg-lime-500 text-black shadow-lg shadow-lime-500/25"
                                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                                )}
                            >
                                <ArrowLeftRight className="w-4 h-4" />
                                Compare
                            </button>
                            <button
                                onClick={() => setPreviewMode('source')}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all",
                                    previewMode === 'source'
                                        ? "bg-lime-500 text-black shadow-lg shadow-lime-500/25"
                                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                                )}
                            >
                                <ImageIcon className="w-4 h-4" />
                                Source
                            </button>
                            <button
                                onClick={() => setPreviewMode('animation')}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all",
                                    previewMode === 'animation'
                                        ? "bg-lime-500 text-black shadow-lg shadow-lime-500/25"
                                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                                )}
                            >
                                <Video className="w-4 h-4" />
                                Animation
                            </button>
                        </div>

                        {/* Preview Content */}
                        <div className="relative rounded-xl overflow-hidden border border-lime-500/20 bg-zinc-950">
                            {previewMode === 'comparison' && job.output_url && job.video_url ? (
                                /* Comparison Slider View */
                                <div
                                    ref={comparisonRef}
                                    className="relative aspect-video cursor-col-resize select-none"
                                    onMouseMove={handleSliderMove}
                                >
                                    {/* Animation (Right/Background) */}
                                    <div className="absolute inset-0">
                                        <video
                                            ref={videoRef}
                                            src={job.video_url}
                                            className="w-full h-full object-cover"
                                            loop
                                            muted
                                            autoPlay
                                            onPlay={() => setIsPlaying(true)}
                                            onPause={() => setIsPlaying(false)}
                                        />
                                    </div>

                                    {/* Source Image (Left/Foreground with clip) */}
                                    <div
                                        className="absolute inset-0 overflow-hidden"
                                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                    >
                                        <img
                                            src={job.output_url}
                                            alt="Source Image"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Slider Line */}
                                    <div
                                        className="absolute top-0 bottom-0 w-1 bg-lime-500 shadow-[0_0_20px_rgba(163,230,53,0.5)]"
                                        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                                    >
                                        {/* Slider Handle */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-lime-500 flex items-center justify-center shadow-lg">
                                            <ArrowLeftRight className="w-5 h-5 text-black" />
                                        </div>
                                    </div>

                                    {/* Labels */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1.5 bg-blue-500/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-blue-400 border border-blue-500/30 uppercase tracking-widest">
                                            Source
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1.5 bg-lime-500/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-lime-400 border border-lime-500/30 uppercase tracking-widest">
                                            Animated
                                        </span>
                                    </div>

                                    {/* Play/Pause Control */}
                                    <button
                                        onClick={togglePlayback}
                                        className="absolute bottom-4 left-1/2 -translate-x-1/2 p-3 bg-black/70 backdrop-blur-md rounded-full hover:bg-black/90 transition-colors border border-white/10"
                                    >
                                        {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
                                    </button>
                                </div>
                            ) : previewMode === 'comparison' && (!job.output_url || !job.video_url) ? (
                                <div className="aspect-video flex items-center justify-center bg-zinc-950">
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full border-4 border-lime-500/30 border-t-lime-500 animate-spin mx-auto mb-4" />
                                        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Processing...</p>
                                        <p className="text-zinc-600 text-xs mt-1">Comparison will be available when complete</p>
                                    </div>
                                </div>
                            ) : previewMode === 'source' ? (
                                job.output_url ? (
                                    <div className="relative group">
                                        <img
                                            src={job.output_url}
                                            alt="Source Image"
                                            className="w-full aspect-video object-contain bg-black"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1.5 bg-blue-500/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-blue-400 border border-blue-500/30 uppercase tracking-widest">
                                                Source Image
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a
                                                href={job.output_url}
                                                download
                                                className="p-2.5 bg-black/70 backdrop-blur-md rounded-lg hover:bg-black/90 transition-colors border border-white/10"
                                            >
                                                <Download className="w-4 h-4 text-white" />
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-video flex items-center justify-center bg-zinc-950 text-zinc-600">
                                        No source image available
                                    </div>
                                )
                            ) : (
                                /* Animation View */
                                job.video_url ? (
                                    <div className="relative group">
                                        <video
                                            ref={videoRef}
                                            src={job.video_url}
                                            className="w-full aspect-video object-contain bg-black"
                                            loop
                                            muted
                                            poster={job.output_url}
                                            onPlay={() => setIsPlaying(true)}
                                            onPause={() => setIsPlaying(false)}
                                        />
                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <button
                                                onClick={togglePlayback}
                                                className="w-20 h-20 rounded-full bg-lime-500/90 flex items-center justify-center shadow-[0_0_50px_rgba(163,230,53,0.4)] hover:scale-110 transition-transform"
                                            >
                                                {isPlaying ? (
                                                    <Pause className="w-8 h-8 text-black" />
                                                ) : (
                                                    <Play className="w-8 h-8 text-black ml-1" />
                                                )}
                                            </button>
                                        </div>
                                        {/* Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1.5 bg-lime-500/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-lime-400 border border-lime-500/30 uppercase tracking-widest">
                                                Wan 2.2 Animation
                                            </span>
                                        </div>
                                        {/* Download */}
                                        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a
                                                href={job.video_url}
                                                download
                                                className="p-2.5 bg-black/70 backdrop-blur-md rounded-lg hover:bg-black/90 transition-colors border border-white/10"
                                            >
                                                <Download className="w-4 h-4 text-white" />
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-video flex items-center justify-center bg-zinc-950">
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-full border-4 border-lime-500/30 border-t-lime-500 animate-spin mx-auto mb-4" />
                                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Animating...</p>
                                            <p className="text-zinc-600 text-xs mt-1">Wan 2.2 processing in progress</p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Motion Parameters */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-zinc-950 border border-lime-500/20 rounded-xl p-4">
                                <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Engine</div>
                                <div className="text-lg font-bold text-lime-400">Wan 2.2 14B</div>
                            </div>
                            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                                <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Action</div>
                                <div className="text-lg font-bold text-white">Animate</div>
                            </div>
                            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                                <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Status</div>
                                <div className={cn(
                                    "text-lg font-bold",
                                    job.status === 'completed' ? 'text-lime-400' :
                                        job.status === 'failed' ? 'text-rose-400' :
                                            'text-amber-400'
                                )}>{job.status.toUpperCase()}</div>
                            </div>
                        </div>

                        {/* Pipeline Progress */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-zinc-500">Animation Pipeline</span>
                                <span className="text-lime-400">{job.progress}%</span>
                            </div>
                            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${job.progress}%` }}
                                    className="h-full bg-gradient-to-r from-lime-500 to-green-500 shadow-[0_0_15px_rgba(163,230,53,0.4)]"
                                />
                            </div>
                        </div>

                        {/* Job Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <InfoCard label="Progress" value={`${job.progress}%`} />
                            <InfoCard label="Step" value={`${job.current_step}/5`} />
                            <InfoCard label="Platform" value={job.platform} />
                            <InfoCard label="Cost" value={`$${job.cost.toFixed(3)}`} />
                        </div>

                        {/* Prompt Section */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Motion Prompt</label>
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
                                                ? "bg-lime-500/20 text-lime-400 border border-lime-500/30"
                                                : "bg-lime-500 text-black hover:bg-lime-400 border border-lime-500"
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
                                Retry Animation
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
                        {job.video_url && (
                            <a
                                href={job.video_url}
                                download
                                className="flex items-center justify-center gap-2 px-6 bg-lime-500 text-black py-3 rounded-xl font-bold hover:bg-lime-400 transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Download Animation
                            </a>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
            <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1">{label}</div>
            <div className="text-lg font-bold text-white">{value}</div>
        </div>
    );
}

export default MotionControlJobModal;
