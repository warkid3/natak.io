"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layers,
    RefreshCcw,
    Database,
    Video,
    Eye,
    MessageSquare,
    ShieldCheck,
    AlertOctagon
} from 'lucide-react';
import { QueueManager } from './QueueManager';

interface HeroVisualProps {
    view: 'desktop' | 'mobile';
    isSystemActive: boolean;
    setIsSystemActive: (active: boolean) => void;
}

const chaosItemsData = [
    {
        id: 1, x: 10, y: 25, rotate: -10,
        chaos: { text: "UPLOAD FAILED", icon: <Video className="text-red-500" /> },
        order: { text: "SYNC COMPLETE", icon: <Video className="text-black" /> }
    },
    {
        id: 2, x: 85, y: 20, rotate: 12,
        chaos: { text: "MISSING DATA", icon: <MessageSquare className="text-red-500" /> },
        order: { text: "AUTO TAGGED", icon: <MessageSquare className="text-black" /> }
    },
    {
        id: 3, x: 8, y: 65, rotate: -5,
        chaos: { text: "UNORGANIZED", icon: <Database className="text-red-500" /> },
        order: { text: "CLOUD READY", icon: <Database className="text-black" /> }
    },
    {
        id: 4, x: 88, y: 75, rotate: 15,
        chaos: { text: "LOW QUALITY", icon: <Eye className="text-red-500" /> },
        order: { text: "4K ENHANCED", icon: <Eye className="text-black" /> }
    },
    {
        id: 5, x: 15, y: 88, rotate: -15,
        chaos: { text: "SYSTEM LAG", icon: <Layers className="text-red-500" /> },
        order: { text: "BATCH READY", icon: <Layers className="text-black" /> }
    },
    {
        id: 6, x: 80, y: 90, rotate: 8,
        chaos: { text: "FILE ERROR", icon: <AlertOctagon className="text-red-500" /> },
        order: { text: "SECURE", icon: <ShieldCheck className="text-black" /> }
    },
];

export function HeroVisual({ view, isSystemActive, setIsSystemActive }: HeroVisualProps) {
    const [pinpoint, setPinpoint] = useState('');
    const isDesktop = view === 'desktop';

    const toggleSystem = () => setIsSystemActive(!isSystemActive);

    return (
        <div className={`relative w-full overflow-visible transition-colors duration-1000 ease-in-out flex flex-col items-center pb-32
      ${isDesktop ? 'min-h-[1250px]' : 'min-h-[1350px]'}
      ${isSystemActive ? 'bg-lime' : 'bg-[#1a0000]'}
    `}>

            {/* Dynamic Background Grain Effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

            <div className="mt-32 md:mt-40 text-center z-40 px-6 max-w-7xl">
                <AnimatePresence mode="wait">
                    {!isSystemActive ? (
                        <motion.div
                            key="chaos-text"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none mb-4">
                                Does your content <br /> <span className="text-red-500 underline underline-offset-[12px]">struggle to scale?</span>
                            </h1>
                            <div className="space-y-1">
                                <p className="text-red-500/60 text-[10px] md:text-xs font-bold uppercase tracking-widest">From Unorganized Chaos / Broken Workflows</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="order-text"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-black text-3xl md:text-5xl font-black uppercase tracking-tighter italic leading-none mb-4">
                                Grow your content <br /> <span className="underline decoration-black underline-offset-[12px]">while you sleep</span>
                            </h1>
                            <div className="space-y-1">
                                <p className="text-black/60 text-[10px] md:text-xs font-bold uppercase tracking-widest">Automated Management / Systems Perfected</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.div
                layout
                initial={{ y: 20, opacity: 0 }}
                animate={{
                    y: isDesktop ? 40 : 30,
                    opacity: 1,
                    height: isDesktop ? 550 : 500,
                    width: isDesktop ? 900 : '94%'
                }}
                className={`relative z-30 transition-all duration-700 ease-in-out
          rounded-[20px] border shadow-[0_40px_120px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col
          ${isSystemActive ? 'bg-black border-white/10' : 'bg-[#0a0a0c] border-white/5'}
        `}
            >
                {/* Dashboard Header */}
                <div className={`h-16 border-b flex items-center px-10 justify-between shrink-0
          ${isSystemActive ? 'border-white/10 bg-white/5' : 'border-white/5 bg-black/40'}
        `}>
                    <div className="flex gap-2">
                        <div className={`w-3 h-3 rounded-full ${isSystemActive ? 'bg-lime shadow-[0_0_15px_#DFFF00]' : 'bg-red-900 animate-pulse'}`}></div>
                        <div className="w-3 h-3 rounded-full bg-neutral-800"></div>
                        <div className="w-3 h-3 rounded-full bg-neutral-800"></div>
                    </div>

                    <div className="flex items-center gap-8">
                        <span className={`hidden md:block text-[9px] tracking-widest uppercase font-bold italic
              ${isSystemActive ? 'text-lime' : 'text-neutral-700'}
            `}>
                            {isSystemActive ? 'AUTOMATION SYSTEM ACTIVE' : 'AWAITING MEDIA INPUT'}
                        </span>

                        <button
                            onClick={toggleSystem}
                            className={`flex items-center gap-3 px-5 py-2 rounded-full border transition-all active:scale-95 group
                ${isSystemActive
                                    ? 'bg-lime/10 border-lime/40 text-lime shadow-[0_0_20px_rgba(223,255,0,0.15)]'
                                    : 'bg-white/5 border-white/10 text-white/40'}
              `}
                        >
                            <span className="text-[9px] font-bold uppercase tracking-widest">
                                {isSystemActive ? 'SYSTEM ON' : 'START SYSTEM'}
                            </span>
                            <div className={`w-8 h-4 rounded-full relative p-0.5 flex items-center transition-colors
                ${isSystemActive ? 'bg-lime/30' : 'bg-neutral-800'}
              `}>
                                <motion.div
                                    layout
                                    className={`w-3 h-3 rounded-full shadow-lg ${isSystemActive ? 'bg-lime' : 'bg-red-600'}`}
                                    animate={{ x: isSystemActive ? 16 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="flex-1 relative overflow-hidden bg-black">
                    <div className={`w-full h-full transition-all duration-700 ${!isSystemActive ? 'blur-[12px] scale-[0.98] opacity-30 grayscale' : 'blur-0 scale-100 opacity-100'}`}>
                        <QueueManager />
                    </div>

                    <AnimatePresence>
                        {!isSystemActive && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-40 flex items-center justify-center p-8 bg-black/20"
                            >
                                <div className="w-full max-w-md space-y-8 text-center bg-black/40 backdrop-blur-md p-10 rounded-[20px] border border-white/5">
                                    <div className="space-y-3">
                                        <h3 className="text-white text-3xl font-black uppercase tracking-tighter italic leading-none">Get Organized</h3>
                                        <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Identify your biggest content hurdle</p>
                                    </div>

                                    <div className="relative w-full group">
                                        <input
                                            type="text"
                                            placeholder="E.g. Too much footage, slow editing..."
                                            value={pinpoint}
                                            onChange={(e) => setPinpoint(e.target.value)}
                                            className="w-full bg-black border border-white/10 rounded-xl px-6 py-5 text-sm focus:outline-none focus:border-red-500/50 transition-all text-white placeholder:text-neutral-800 font-medium"
                                        />
                                    </div>

                                    <div className="pt-2 text-red-500/40 text-[9px] tracking-widest animate-pulse uppercase font-bold">
                                        System Offline // Awaiting Command
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Dashboard Footer */}
                <div className={`h-10 px-10 border-t flex items-center justify-between text-[8px] font-bold uppercase tracking-widest shrink-0
          ${isSystemActive ? 'border-white/10 text-white/30' : 'border-white/5 text-neutral-800'}
        `}>
                    <span className="flex items-center gap-2"><RefreshCcw size={10} className={isSystemActive ? 'animate-spin' : ''} /> CORE SYSTEM RUNNING</span>
                    <span>FILES ACTIVE: {isSystemActive ? "48" : "0"}</span>
                </div>
            </motion.div>

            {/* Floating Chaos/Order Items */}
            {chaosItemsData.map((item) => (
                <motion.div
                    key={item.id}
                    initial={false}
                    animate={{
                        x: [0, 5, 0],
                        y: [0, -10, 0],
                        rotate: isSystemActive ? 0 : item.rotate,
                        scale: isSystemActive ? 0.9 : 1
                    }}
                    transition={{
                        y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: item.id * 0.2 },
                        x: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: item.id * 0.1 },
                    }}
                    style={{ position: 'absolute', left: `${item.x}%`, top: `${item.y}%` }}
                    className="z-10 hidden lg:block"
                >
                    <motion.div
                        className={`px-4 py-2.5 rounded-2xl border backdrop-blur-md shadow-2xl flex items-center gap-3 transition-all duration-700
              ${isSystemActive
                                ? 'bg-black border-white/20 text-white'
                                : 'bg-red-950/20 border-red-500/30 text-red-400'}
            `}
                    >
                        <div className={`p-2 rounded-xl ${isSystemActive ? 'bg-lime shadow-[0_0_10px_rgba(223,255,0,0.5)]' : 'bg-red-500/10'}`}>
                            {isSystemActive ? item.order.icon : item.chaos.icon}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tight italic">
                            {isSystemActive ? item.order.text : item.chaos.text}
                        </span>
                    </motion.div>
                </motion.div>
            ))}

            {/* Branding background text */}
            <div className="absolute bottom-0 left-0 right-0 h-60 flex items-center justify-center opacity-[0.03] select-none pointer-events-none overflow-hidden">
                <h2 className={`text-[25rem] font-black italic tracking-tighter uppercase transition-colors duration-1000
          ${isSystemActive ? 'text-black' : 'text-white'}
        `}>NATAK</h2>
            </div>

        </div>
    );
}
