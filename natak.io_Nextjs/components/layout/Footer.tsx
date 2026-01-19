"use client";

import React from 'react';
import { Globe, Shield, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-black border-t border-white/5 py-32 px-6">
            <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
                <div className="md:col-span-2">
                    <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-6">NATAK</h2>
                    <p className="text-zinc-600 text-sm max-w-xs leading-relaxed uppercase tracking-widest font-bold">
                        The Identity-First Content Infrastructure for the next generation of visual creators.
                    </p>
                    <div className="mt-8 flex gap-4">
                        <input type="email" placeholder="JOIN_DISPATCH" className="bg-zinc-900 border border-white/5 rounded-xl px-5 py-3 text-[10px] font-black uppercase tracking-widest focus:border-lime/50 outline-none w-48" />
                        <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-lime hover:text-black transition-all">
                            <ArrowUpRight size={16} />
                        </button>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white">System_Links</div>
                    <ul className="space-y-3 text-sm font-bold uppercase tracking-widest text-zinc-500">
                        <li className="hover:text-lime cursor-pointer transition-colors">Documentation</li>
                        <li className="hover:text-lime cursor-pointer transition-colors">API_Reference</li>
                        <li className="hover:text-lime cursor-pointer transition-colors">Changelog</li>
                        <li><Link href="/pricing" className="hover:text-lime cursor-pointer transition-colors">Pricing</Link></li>
                    </ul>
                </div>
                <div className="space-y-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Governance</div>
                    <ul className="space-y-3 text-sm font-bold uppercase tracking-widest text-zinc-500">
                        <li className="hover:text-lime cursor-pointer transition-colors">Terms_of_Service</li>
                        <li className="hover:text-lime cursor-pointer transition-colors">Privacy_Policy</li>
                        <li className="hover:text-lime cursor-pointer transition-colors">Security_Audit</li>
                        <li className="hover:text-lime cursor-pointer transition-colors">Founder_Offer</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700 mono">© 2025 NATAK_OS // ALL_RIGHTS_RESERVED</div>
                <div className="flex gap-8">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer"><Globe size={16} /></div>
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer"><Shield size={16} /></div>
                </div>
            </div>
        </footer>
    );
}
