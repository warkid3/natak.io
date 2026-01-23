"use client";

import React, { useState } from 'react';
import { Sparkles, Zap, Shield, CreditCard, Box, Layers, Coins, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CreditStoreSection = () => {
    const [selectedPack, setSelectedPack] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const creditPacks = [
        {
            id: 1,
            name: 'Refuel S',
            amount: 500,
            price: 35,
            icon: Box,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            border: 'border-blue-400/20',
            description: 'Quick top-up for small projects.',
            bonus: null,
            costPerCredit: '$0.07'
        },
        {
            id: 2,
            name: 'Refuel M',
            amount: 1500,
            price: 90,
            icon: Layers,
            color: 'text-violet-400',
            bg: 'bg-violet-400/10',
            border: 'border-violet-400/20',
            description: 'Ideal for standard production runs.',
            bonus: null,
            costPerCredit: '$0.06'
        },
        {
            id: 3,
            name: 'Refuel L',
            amount: 5000,
            price: 250,
            icon: Coins,
            color: 'text-amber-400',
            bg: 'bg-amber-400/10',
            border: 'border-amber-400/20',
            description: 'Massive volume for agency scale.',
            bonus: 'Best Value',
            costPerCredit: '$0.05'
        }
    ];

    const handlePurchase = (pack: typeof creditPacks[0]) => {
        setIsProcessing(true);
        setSelectedPack(pack.id);

        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            setSelectedPack(null);
            alert(`Purchased ${pack.amount} credits!`);
        }, 1500);
    };

    return (
        <section className="py-20 w-full max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-sm font-bold text-violet-400 uppercase tracking-widest mb-2">The Exchange</h2>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Inject Resources</h3>
                <p className="text-zinc-500 mt-2 text-sm font-mono uppercase tracking-widest">
                    One-time credit infusions. Never expire.
                </p>
            </div>

            {/* Shop Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {creditPacks.map((pack) => {
                    const Icon = pack.icon;
                    return (
                        <div
                            key={pack.id}
                            className="group relative"
                        >
                            {/* Glow Effect */}
                            <div className={`absolute -inset-0.5 rounded-[12px] opacity-0 group-hover:opacity-100 blur transition duration-500 ${pack.bg}`}></div>

                            {/* Card Body */}
                            <div className="relative h-full bg-slate-900/50 border border-slate-800 hover:border-slate-700 rounded-[10px] p-6 flex flex-col transition-all duration-300 group-hover:-translate-y-1 shadow-xl">

                                {/* Pack Icon & Bonus */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-[8px] ${pack.bg} ${pack.border} border flex items-center justify-center`}>
                                        <Icon className={`w-7 h-7 ${pack.color}`} />
                                    </div>
                                    {pack.bonus && (
                                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-[6px]">
                                            {pack.bonus}
                                        </span>
                                    )}
                                </div>

                                {/* Pack Details */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-black italic uppercase tracking-tighter text-white mb-1">{pack.name}</h3>
                                    <p className="text-xs text-slate-400 font-mono uppercase mb-4">{pack.description}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-white italic tracking-tighter">{pack.amount.toLocaleString()}</span>
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">credits</span>
                                    </div>
                                    <div className="text-[10px] text-zinc-500 font-mono mt-1">
                                        {pack.costPerCredit} / unit
                                    </div>
                                </div>

                                {/* Spacer to push button down */}
                                <div className="flex-1"></div>

                                {/* Buy Button */}
                                <button
                                    onClick={() => handlePurchase(pack)}
                                    disabled={isProcessing}
                                    className={`
                      w-full py-4 rounded-[8px] font-bold text-xs uppercase tracking-widest transition-all
                      flex items-center justify-between px-6
                      ${isProcessing && selectedPack === pack.id
                                            ? 'bg-slate-800 text-slate-500 cursor-wait'
                                            : 'bg-white text-slate-950 hover:bg-slate-200 hover:shadow-lg hover:shadow-white/5 active:scale-[0.98]'
                                        }
                    `}
                                >
                                    {isProcessing && selectedPack === pack.id ? (
                                        <span className="w-full text-center flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                                            PROCESSING...
                                        </span>
                                    ) : (
                                        <>
                                            <span>${pack.price}</span>
                                            <div className="flex items-center gap-2 opacity-60">
                                                ACQUIRE <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Info/Trust Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
                <div className="flex items-center gap-4 justify-center md:justify-start">
                    <Zap className="w-5 h-5 text-slate-400" />
                    <div>
                        <h4 className="text-xs font-black uppercase text-slate-300">Instant Delivery</h4>
                    </div>
                </div>

                <div className="flex items-center gap-4 justify-center md:justify-start">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                    <div>
                        <h4 className="text-xs font-black uppercase text-slate-300">Secure Payment</h4>
                    </div>
                </div>

                <div className="flex items-center gap-4 justify-center md:justify-start">
                    <Shield className="w-5 h-5 text-slate-400" />
                    <div>
                        <h4 className="text-xs font-black uppercase text-slate-300">Never Expire</h4>
                    </div>
                </div>
            </div>
        </section>
    );
};
