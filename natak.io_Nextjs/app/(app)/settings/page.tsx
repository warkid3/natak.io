"use client";

import React, { useState, useEffect } from 'react';
import { mockStore } from '@/lib/mockStore';
import { User, ImageModel, VideoModel } from '@/types';
import { User as UserIcon, Settings2, Key, Terminal, Eye, EyeOff, Save, RefreshCw, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

type SettingsTab = 'general' | 'models' | 'api';

const TabButton = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 px-8 py-4 rounded-sm text-[10px] font-black uppercase tracking-widest italic transition-all",
            active ? "bg-primary text-black shadow-lg" : "text-slate-500 hover:text-white hover:bg-white/5"
        )}
    >
        {icon}
        {label}
    </button>
);

const InputGroup = ({ label, placeholder, value, readOnly }: { label: string, placeholder: string, value?: string, readOnly?: boolean }) => (
    <div className="space-y-3">
        <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] block ml-1 italic">{label}</label>
        <Input
            readOnly={readOnly}
            defaultValue={value}
            placeholder={placeholder}
            className={cn(
                "w-full bg-[#1A1A1D] border border-white/5 rounded-sm px-6 py-5 h-auto text-sm font-medium text-white focus-visible:ring-offset-0 focus-visible:ring-primary focus:border-primary transition-all italic",
                readOnly && "opacity-40 cursor-not-allowed bg-black"
            )}
        />
    </div>
);

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [user, setUser] = useState<User | null>(null);
    const [settings, setSettings] = useState<any>(null);
    const [showApiKey, setShowApiKey] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    // These states are strictly local here as they weren't in mockStore type
    const [defaultImageModel, setDefaultImageModel] = useState<ImageModel>('Pony Realism (SDXL)');
    const [defaultVideoModel, setDefaultVideoModel] = useState<VideoModel>('Wan 2.6');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Fetch profile/settings (mocking for now, but using real user ID)
                setUser({
                    id: user.id,
                    name: user.user_metadata?.full_name || 'Operator',
                    email: user.email || '',
                    tier: 'Agency', // Force Agency tier for now to enable API tab
                    // ... other fields
                } as any);

                // Check for existing API key in metadata
                const apiKey = user.user_metadata?.api_key;
                if (apiKey) {
                    setApiKey(apiKey);
                } else {
                    // Generate new if none
                    const newKey = `nk_${user.id.substring(0, 8)}_${Math.random().toString(36).substring(2, 15)}`;
                    setApiKey(newKey);
                    // In a real app, we'd save this back to user metadata here
                }
            } else {
                // Fallback to mockStore only if no auth
                setUser(mockStore.getUser());
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            setUser(mockStore.getUser());
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const userId = user?.id || 'mock-user-id';
            await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    profile: {
                        name: user?.name,
                        avatar_url: user?.avatar_url,
                        timezone: user?.timezone || 'UTC',
                        theme: user?.theme || 'dark'
                    }
                })
            });
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    };

    const [apiKey, setApiKey] = useState("nk_live_std_8923_xll_991");

    const refreshApiKey = () => {
        if (!user) return;
        const newKey = `nk_${user.id.substring(0, 8)}_${Math.random().toString(36).substring(2, 15)}`;
        setApiKey(newKey);
        // Save to backend would go here
    };

    return (
        <div className="h-full flex flex-col space-y-10 overflow-hidden bg-black font-sans w-full p-2">
            <header className="flex-shrink-0 bg-surface p-12 rounded-sm border border-white/5 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-[900] italic tracking-tighter text-white uppercase leading-none">System Settings</h1>
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mt-3 italic">Operator Protocols & Identity Keys</p>
                </div>
                <div className="flex bg-black p-1 rounded-sm border border-white/5">
                    <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} label="General" icon={<UserIcon className="w-4 h-4" />} />
                    <TabButton active={activeTab === 'models'} onClick={() => setActiveTab('models')} label="Inference" icon={<Settings2 className="w-4 h-4" />} />
                    <TabButton active={activeTab === 'api'} onClick={() => setActiveTab('api')} label="API Hub" icon={<Key className="w-4 h-4" />} />
                </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-12 pb-20">
                {activeTab === 'general' && (
                    <div className="max-w-3xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <section className="space-y-8">
                            <div className="flex items-center gap-8">
                                <div className="w-32 h-32 rounded-sm bg-[#1A1A1D] border border-white/10 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${user?.id}`} className="w-full h-full p-4 opacity-80" />
                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <RefreshCw className="w-6 h-6 text-primary" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <h3 className="text-2xl font-[900] italic uppercase tracking-tighter text-white">Operator Profile</h3>
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">Identity Identifier: {user?.id?.toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <InputGroup label="Public Name" placeholder="Unit Operator" value={user?.name || "Unassigned"} />
                                <InputGroup label="System Email" placeholder="operator@natak.io" value={user?.email || ""} readOnly />
                            </div>
                        </section>

                        <Button
                            onClick={handleSave}
                            variant="natak"
                            className="px-12 py-5 shadow-xl shadow-primary/10 h-auto"
                        >
                            {isSaved ? <><Check className="w-5 h-5 mr-3" /> Protocol Saved</> : <><Save className="w-5 h-5 mr-3" /> Update Profile</>}
                        </Button>
                    </div>
                )}

                {activeTab === 'models' && (
                    <div className="max-w-3xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <section className="space-y-10">
                            <div className="bg-[#1A1A1D] p-10 rounded-sm border border-white/5 space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">Default Diffusion Logic</label>
                                    <select
                                        value={defaultImageModel}
                                        onChange={(e) => setDefaultImageModel(e.target.value as ImageModel)}
                                        className="w-full bg-black border border-white/10 rounded-sm px-8 py-5 text-sm font-mono text-white focus:outline-none focus:border-primary italic"
                                    >
                                        <option value="Pony Realism (SDXL)">Pony Realism (LoRA Optimized)</option>
                                        <option value="Nano Banana Pro">Nano Banana Pro (Fast SFW)</option>
                                        <option value="Seedream 4.5">Seedream 4.5 (High Fidelity)</option>
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.4em] italic">Default Motion Engine</label>
                                    <select
                                        value={defaultVideoModel}
                                        onChange={(e) => setDefaultVideoModel(e.target.value as VideoModel)}
                                        className="w-full bg-black border border-white/10 rounded-sm px-8 py-5 text-sm font-mono text-white focus:outline-none focus:border-primary italic"
                                    >
                                        <option value="Wan 2.6">Wan 2.6 (Fidelity Realism)</option>
                                        <option value="Wan 2.5">Wan 2.5 (Realistic Motion)</option>
                                        <option value="Kling 2.6 Pro">Kling 2.6 Pro (High Quality SFW)</option>
                                        <option value="Veo 3.1">Veo 3.1 (Commercial Standard)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-sm flex items-start gap-6">
                                <div className="bg-red-500/10 p-3 rounded-sm"><Terminal className="w-6 h-6 text-red-500" /></div>
                                <div className="space-y-2">
                                    <h4 className="text-[11px] font-black uppercase text-red-500 tracking-[0.2em] italic">Experimental Protocols</h4>
                                    <p className="text-[10px] text-red-500/60 font-black uppercase tracking-widest leading-relaxed">
                                        Bypassing Safety Logic (NSFW) is permanent for this session. Use caution with public manifestations.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <Button onClick={handleSave} variant="natak" className="px-12 py-5 h-auto">
                            {isSaved ? 'Logic Updated' : 'Persist Engine Prefs'}
                        </Button>
                    </div>
                )}

                {activeTab === 'api' && (
                    <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {user?.tier !== 'Agency' ? (
                            <div className="bg-[#1A1A1D] border border-white/5 rounded-sm p-20 text-center flex flex-col items-center">
                                <Key className="w-16 h-16 text-slate-800 mb-8" />
                                <h3 className="text-3xl font-[900] italic text-white uppercase tracking-tighter mb-4">Agency Access Required</h3>
                                <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] max-w-sm mb-12">
                                    API access and high-volume orchestration logic are reserved for Agency tier operators.
                                </p>
                                {/* <button onClick={() => window.location.hash = '#/credits'} className="bg-[#CCFF00] text-black px-12 py-5 rounded-[2px] font-black uppercase italic text-sm tracking-widest shadow-2xl">Upgrade Session</button> */}
                                <Button variant="natak" className="shadow-2xl h-auto py-5 uppercase">Upgrade Session</Button>
                            </div>
                        ) : (
                            <section className="space-y-10">
                                <div className="bg-[#1A1A1D] p-12 rounded-sm border border-white/10 space-y-12">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.4em] italic">Live Production Keys</h3>
                                            <button
                                                onClick={refreshApiKey}
                                                className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2 italic"
                                            >
                                                <RefreshCw className="w-3 h-3" /> Rotate Credentials
                                            </button>
                                        </div>
                                        <div className="bg-black border border-white/5 rounded-sm flex items-center p-2 group">
                                            <div className="flex-1 font-mono text-sm px-6 py-4 text-slate-400 select-all overflow-hidden truncate italic">
                                                {showApiKey ? apiKey : "******************************************"}
                                            </div>
                                            <button onClick={() => setShowApiKey(!showApiKey)} className="p-4 text-slate-600 hover:text-white transition-colors">
                                                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                            <button className="p-4 text-primary hover:bg-primary/10 transition-all rounded-sm">
                                                <Copy className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Webhook Orchestration</h3>
                                        <div className="grid grid-cols-2 gap-8">
                                            <InputGroup label="Endpoint URL" placeholder="https://api.natak.io/v1/prism-hook" />
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black text-slate-800 uppercase tracking-[0.4em] block italic">Retry Policy</label>
                                                <select className="w-full bg-black border border-white/10 rounded-sm px-6 py-4 text-xs font-mono text-slate-400 focus:outline-none italic">
                                                    <option>Exponential Backoff (Recommended)</option>
                                                    <option>Linear Retry (3x)</option>
                                                    <option>No Retry</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-black border border-white/5 rounded-sm p-10 font-mono text-xs text-slate-500 space-y-4">
                                    <div className="text-primary font-black mb-4 flex items-center gap-3">
                                        <Terminal className="w-4 h-4" />
                                        <span className="uppercase tracking-[0.2em] italic">Quick Manifest Request (cURL)</span>
                                    </div>
                                    <div className="bg-[#0F0F11] p-8 rounded-sm text-slate-400 leading-relaxed overflow-x-auto whitespace-nowrap italic border border-white/5">
                                        curl -X POST https://api.natak.io/v3/manifest \<br />
                                        &nbsp;&nbsp;-H "Authorization: Bearer $API_KEY" \<br />
                                        &nbsp;&nbsp;-d '&#123;"prompt": "Cinematic wide shot...", "engine": "pony-sdxl"&#125;'
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
