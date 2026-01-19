"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Share2, ArrowRight, HardDrive } from 'lucide-react';
import { Job } from '@/lib/types';
import { STATUS_COLORS } from '@/lib/constants';

interface JobInspectorPanelProps {
    job: Job;
    onClose: () => void;
    onAction: (action: string) => void;
}

export function JobInspectorPanel({ job, onClose, onAction }: JobInspectorPanelProps) {
    return (
        <AnimatePresence>
            {/* Background Dimmer (internal to the dashboard) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />

            {/* Docked Inspector Panel */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 bottom-0 z-[70] w-full md:w-[450px] bg-zinc-950/90 border-l border-white/10 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
            >
                {/* Panel Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/30">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-lime shadow-[0_0_8px_#DFFF00]"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Live Inspector</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X size={16} className="text-zinc-500" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                    {/* Hero Header */}
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none">
                                {job.character}
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${STATUS_COLORS[job.status]}`}>
                                {job.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-zinc-600 font-mono text-[9px] uppercase tracking-widest">
                            <span>{job.id}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                            <span>{job.timestamp}</span>
                        </div>
                    </div>

                    {/* Visual Preview */}
                    <div className="relative group">
                        <div className="aspect-video rounded-[20px] overflow-hidden border border-white/5 bg-zinc-900">
                            <img
                                src={`https://picsum.photos/seed/${job.id}/600/400`}
                                alt="Thread Preview"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                        <button className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 p-3 rounded-xl backdrop-blur-md transition-all">
                            <Share2 size={16} className="text-white" />
                        </button>
                    </div>

                    {/* Progress & Pipeline */}
                    <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-zinc-500">Pipeline Synchronization</span>
                            <span className="text-lime">{job.progress}%</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${job.progress}%` }}
                                className="h-full bg-lime shadow-[0_0_15px_rgba(223,255,0,0.4)]"
                            />
                        </div>
                        <div className="grid grid-cols-5 gap-1">
                            {[1, 2, 3, 4, 5].map((step) => (
                                <div
                                    key={step}
                                    className={`h-1 rounded-full ${step <= job.currentStep ? 'bg-lime/40' : 'bg-zinc-800'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-5 bg-zinc-900/50 border border-white/5 rounded-[20px] group hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-2 text-zinc-500 mb-2">
                                <Zap size={12} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Platform</span>
                            </div>
                            <div className="text-white font-black uppercase text-xs">{job.platform}</div>
                        </div>
                        <div className="p-5 bg-zinc-900/50 border border-white/5 rounded-[20px] group hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-2 text-zinc-500 mb-2">
                                <HardDrive size={12} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Compute</span>
                            </div>
                            <div className="text-white font-black uppercase text-xs">${job.cost.toFixed(3)}</div>
                        </div>
                    </div>

                    {/* Technical Diagnostics */}
                    <div className="space-y-4">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-white/5 pb-2">Technical Diagnostics</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                                <span className="text-zinc-500">Node Cluster</span>
                                <span className="text-zinc-300">GPU-US-EAST-04</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                                <span className="text-zinc-500">Latency Threshold</span>
                                <span className="text-zinc-300">12ms Peak</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-tight">
                                <span className="text-zinc-500">Seed Signature</span>
                                <span className="text-zinc-300">0XEF_9921_A</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-white/5 bg-zinc-900/20 grid grid-cols-2 gap-4">
                    <button
                        onClick={() => onAction('RETRY')}
                        className="py-4 border border-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all active:scale-95"
                    >
                        Reset Thread
                    </button>
                    <button
                        onClick={() => onAction('EXPORT')}
                        className="py-4 bg-lime text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] shadow-[0_10px_20px_rgba(223,255,0,0.1)] transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        Export <ArrowRight size={14} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
