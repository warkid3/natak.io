"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { CharacterModel } from '@/types';
import { mockStore } from '@/lib/mockStore';
import { BlurFade } from '@/components/ui/blur-fade';
import CharacterUpload from '@/components/CharacterUpload';
import { Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ConfirmDialog from '@/components/ConfirmDialog';

const CharacterCard: React.FC<{ char: CharacterModel }> = ({ char }) => {
    const [hovered, setHovered] = React.useState(false);

    return (
        <div
            className="group relative aspect-[3/4] rounded-sm overflow-hidden bg-[#1A1A1D] border border-white/5 cursor-pointer transition-all duration-700 hover:border-primary/40 hover:shadow-[0_0_60px_rgba(204,255,0,0.1)]"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className="absolute inset-0">
                <img
                    src={`https://picsum.photos/seed/${char.id}/800/1200`}
                    className={cn(
                        "w-full h-full object-cover transition-transform duration-[2000ms] grayscale group-hover:grayscale-0",
                        hovered ? "scale-110" : "scale-100",
                        char.status === 'training' && "opacity-30 blur-sm"
                    )}
                    alt={char.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            </div>

            {char.status === 'training' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center z-20">
                    <div className="w-14 h-14 border border-primary border-t-transparent animate-spin rounded-full mb-6"></div>
                    <span className="text-[11px] font-[900] uppercase tracking-[0.4em] text-primary animate-pulse italic">Analyzing Geometry</span>
                    <p className="text-slate-600 text-[9px] mt-3 max-w-[160px] font-black uppercase tracking-widest">Extracting core identity features...</p>
                </div>
            )}

            <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col items-start gap-2 z-10">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary opacity-80 italic">
                    Seed Frame Active
                </span>
                <h3 className="text-4xl font-[900] uppercase tracking-tighter text-white drop-shadow-2xl italic">
                    {char.name}
                </h3>
            </div>

            {char.status === 'ready' && (
                <div className="absolute top-8 right-8 p-3 bg-black/60 backdrop-blur-md rounded-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <Sparkles className="w-4 h-4 text-primary fill-primary" />
                </div>
            )}
        </div>
    );
};

export default function CharactersPage() {
    const [characters, setCharacters] = useState<CharacterModel[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [showCreditAlert, setShowCreditAlert] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    useEffect(() => {
        setUser(mockStore.getUser());
        setCharacters(mockStore.getCharacters());
    }, []);

    const heroImages = [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529139513055-119d59aba1bb?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"
    ];

    const handleFileChange = useCallback((count: number) => {
        setImages(new Array(count).fill(null));
    }, []);

    const handleCloseModal = () => {
        if (images.length > 0) {
            setShowCloseConfirm(true);
        } else {
            setIsCreating(false);
        }
    };

    const confirmClose = () => {
        setIsCreating(false);
        setImages([]);
        setShowCloseConfirm(false);
    };

    return (
        <div className="h-full bg-black text-white overflow-y-auto custom-scrollbar font-sans">
            <ConfirmDialog
                isOpen={showCloseConfirm}
                title="Cancel Training?"
                description="You have uploaded images. Closing this modal will discard them."
                confirmText="Discard & Close"
                variant="danger"
                onConfirm={confirmClose}
                onCancel={() => setShowCloseConfirm(false)}
            />

            {/* Editorial Hero Section */}
            <section className="pt-24 pb-20 px-6 text-center max-w-5xl mx-auto">
                <div className="flex justify-center items-center gap-4 mb-16">
                    {heroImages.map((src, i) => (
                        <BlurFade key={i} delay={i * 0.1}>
                            <div
                                className={cn(
                                    "w-32 h-48 md:w-44 md:h-64 rounded-sm overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 hover:scale-110 hover:z-50 grayscale hover:grayscale-0",
                                    i === 0 && "-rotate-6 translate-x-4",
                                    i === 1 && "-rotate-3 translate-x-2",
                                    i === 2 && "rotate-3 -translate-x-2",
                                    i === 3 && "rotate-6 -translate-x-4"
                                )}
                            >
                                <img src={src} className="w-full h-full object-cover" alt="Editorial sample" />
                            </div>
                        </BlurFade>
                    ))}
                </div>

                <BlurFade delay={0.4}>
                    <h1 className="text-6xl md:text-8xl font-[900] uppercase tracking-tighter mb-8 leading-[0.85] italic">
                        IDENTITY<br /><span className="text-primary">EXTRACTION</span>
                    </h1>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] max-w-2xl mx-auto mb-12 py-6 border-y border-white/5">
                        Train consistent digital twins of any character for hyper-realistic content production.
                    </p>
                </BlurFade>

                <BlurFade delay={0.6}>
                    <Button
                        variant="natak"
                        onClick={() => setIsCreating(true)}
                        className="px-12 py-6 shadow-[0_10px_40px_rgba(204,255,0,0.2)]"
                    >
                        <Sparkles className="w-5 h-5 fill-black mr-4" />
                        Initiate Training
                    </Button>
                </BlurFade>
            </section>

            {/* Characters Grid */}
            <section className="max-w-7xl mx-auto px-6 pb-32">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {characters.map((char, i) => (
                        <BlurFade key={char.id} delay={0.8 + (i * 0.1)}>
                            <CharacterCard char={char} />
                        </BlurFade>
                    ))}
                </div>
            </section>

            {/* Floating Credit Alert */}
            {showCreditAlert && (
                <div className="fixed bottom-12 right-12 z-[200] animate-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-[#1C1C1E] border border-white/10 rounded-sm p-6 flex items-center gap-6 shadow-2xl pr-4">
                        <div className="flex flex-col gap-1 pl-2">
                            <span className="text-[10px] font-black uppercase text-white tracking-widest italic">Protocol Alert</span>
                            <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Credits depleted</span>
                        </div>
                        <Button variant="natak" className="h-8 px-6 text-[10px]">
                            Upgrade
                        </Button>
                        <button onClick={() => setShowCreditAlert(false)} className="p-2 text-slate-700 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Creation Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-[#0F0F11] border border-white/10 p-12 rounded-md w-full max-w-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-10 right-10 text-slate-600 hover:text-white transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <CharacterUpload
                            onUploadStart={() => console.log("Upload started")}
                            onUploadComplete={() => {
                                setIsCreating(false);
                                // Refresh logic could go here or rely on real-time / manual refresh
                                setCharacters(mockStore.getCharacters());
                            }}
                            onFileChange={handleFileChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
