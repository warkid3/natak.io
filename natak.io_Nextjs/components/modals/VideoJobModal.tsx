"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Download, Bookmark, Check, ExternalLink, Video, Image as ImageIcon, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { OperationsJob } from '@/types/operations';
import { cn } from '@/lib/utils';

interface VideoJobModalProps {
    job: OperationsJob;
    onClose: () => void;
    onAction: (action: 'retry' | 'approve' | 'reject') => void;
    onSavePrompt?: (prompt: string, jobId: string) => void;
}

export function VideoJobModal({ job, onClose, onAction, onSavePrompt }: VideoJobModalProps) {
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<'video' | 'image'>('video');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

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

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
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
                    className="bg-zinc-900 border border-purple-500/20 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-purple-500/10"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-md border-b border-purple-500/20 p-6 flex items-center justify-between z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <Video className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{job.character_name || 'Video Generation'}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{job.id.slice(0, 8)}</span>
                                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Image + Video</span>
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
                        {/* Preview Tabs */}
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setActiveTab('video')}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all",
                                    activeTab === 'video'
                                        ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                                )}
                            >
                                <Video className="w-4 h-4" />
                                Video Output
                            </button>
                            <button
                                onClick={() => setActiveTab('image')}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all",
                                    activeTab === 'image'
                                        ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                                )}
                            >
                                <ImageIcon className="w-4 h-4" />
                                Source Image
                            </button>
                        </div>

                        {/* Preview Content */}
                        <div className="relative group rounded-xl overflow-hidden border border-purple-500/20 bg-zinc-950">
                            {activeTab === 'video' ? (
                                job.video_url ? (
                                    <div className="relative">
                                        <video
                                            ref={videoRef}
                                            src={job.video_url}
                                            className="w-full aspect-video object-contain bg-black"
                                            poster={job.output_url}
                                            loop
                                            muted={isMuted}
                                            onPlay={() => setIsPlaying(true)}
                                            onPause={() => setIsPlaying(false)}
                                        />
                                        {/* Video Controls Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <button
                                                onClick={togglePlay}
                                                className="w-20 h-20 rounded-full bg-purple-500/90 flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.4)] hover:scale-110 transition-transform"
                                            >
                                                {isPlaying ? (
                                                    <Pause className="w-8 h-8 text-white" />
                                                ) : (
                                                    <Play className="w-8 h-8 text-white ml-1" />
                                                )}
                                            </button>
                                        </div>
                                        {/* Bottom Controls */}
                                        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={toggleMute}
                                                className="p-2.5 bg-black/70 backdrop-blur-md rounded-lg hover:bg-black/90 transition-colors border border-white/10"
                                            >
                                                {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                                            </button>
                                            <a
                                                href={job.video_url}
                                                download
                                                className="p-2.5 bg-black/70 backdrop-blur-md rounded-lg hover:bg-black/90 transition-colors border border-white/10"
                                            >
                                                <Download className="w-4 h-4 text-white" />
                                            </a>
                                        </div>
                                        {/* Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1.5 bg-purple-500/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-purple-400 border border-purple-500/30 uppercase tracking-widest">
                                                LTX-2 Video
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-video flex items-center justify-center bg-zinc-950">
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin mx-auto mb-4" />
                                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Generating Video...</p>
                                            <p className="text-zinc-600 text-xs mt-1">LTX-2 processing in progress</p>
                                        </div>
                                    </div>
                                )
                            ) : (
                                job.output_url ? (
                                    <div className="relative">
                                        <img
                                            src={job.output_url}
                                            alt="Source Image"
                                            className="w-full aspect-video object-contain bg-black"
                                        />
                                        {/* Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1.5 bg-blue-500/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-blue-400 border border-blue-500/30 uppercase tracking-widest">
                                                Source Image
                                            </span>
                                        </div>
                                        {/* Actions */}
                                        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => window.open(job.output_url, '_blank')}
                                                className="p-2.5 bg-black/70 backdrop-blur-md rounded-lg hover:bg-black/90 transition-colors border border-white/10"
                                            >
                                                <ExternalLink className="w-4 h-4 text-white" />
                                            </button>
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
                            )}
                        </div>

                        {/* Pipeline Progress */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-zinc-500">Pipeline Progress</span>
                                <span className="text-purple-400">{job.progress}%</span>
                            </div>
                            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${job.progress}%` }}
                                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                                />
                            </div>
                            <div className="grid grid-cols-5 gap-1">
                                {[1, 2, 3, 4, 5].map((step) => (
                                    <div
                                        key={step}
                                        className={cn(
                                            "h-1 rounded-full",
                                            step <= job.current_step ? 'bg-purple-500/40' : 'bg-zinc-800'
                                        )}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Job Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <InfoCard label="Status" value={job.status.toUpperCase()} color="purple" />
                            <InfoCard label="Current Step" value={`${job.current_step}/5`} />
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
                                                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                                : "bg-purple-500 text-white hover:bg-purple-600 border border-purple-500"
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
                        {job.video_url && (
                            <a
                                href={job.video_url}
                                download
                                className="flex items-center justify-center gap-2 px-6 bg-purple-500 text-white py-3 rounded-xl font-bold hover:bg-purple-600 transition-all"
                            >
                                <Download className="w-4 h-4" />
                                Download Video
                            </a>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function InfoCard({ label, value, color = 'default' }: { label: string; value: string; color?: 'purple' | 'default' }) {
    return (
        <div className={cn(
            "bg-zinc-950 border rounded-xl p-4",
            color === 'purple' ? 'border-purple-500/20' : 'border-zinc-800'
        )}>
            <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1">{label}</div>
            <div className={cn(
                "text-lg font-bold",
                color === 'purple' ? 'text-purple-400' : 'text-white'
            )}>{value}</div>
        </div>
    );
}

export default VideoJobModal;
