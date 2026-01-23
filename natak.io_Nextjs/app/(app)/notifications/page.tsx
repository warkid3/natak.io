"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { realStore } from '@/services/realStore';
import { Notification } from '@/types';
import { Bell, Zap, Terminal, ShieldAlert, Check, Trash2, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const router = useRouter();

    useEffect(() => {
        const loadNotifications = async () => {
            const data = await realStore.getNotifications();
            setNotifications(data);
        };
        loadNotifications();
    }, []);

    const handleMarkAllRead = async () => {
        await Promise.all(notifications.map(n => realStore.markNotificationRead(n.id)));
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const handleItemClick = async (n: Notification) => {
        await realStore.markNotificationRead(n.id);
        if (n.link) router.push(n.link);
        setNotifications(notifications.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
    };

    return (
        <div className="h-full flex flex-col space-y-10 overflow-hidden bg-black font-sans w-full p-2">
            <header className="flex-shrink-0 bg-surface p-12 rounded-sm border border-white/5 flex justify-between items-end shadow-2xl">
                <div>
                    <h1 className="text-4xl font-[900] italic tracking-tighter text-white uppercase leading-none">Event Logs</h1>
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mt-3 italic">System Alerts & Operation Status</p>
                </div>
                <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-3 px-8 py-4 rounded-sm bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest italic text-slate-400 hover:text-white transition-all"
                >
                    <Check className="w-4 h-4" /> Acknowledge All
                </button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-12 pb-20">
                <div className="max-w-5xl space-y-4">
                    {notifications.map(n => (
                        <div
                            key={n.id}
                            onClick={() => handleItemClick(n)}
                            className={cn(
                                "bg-[#1A1A1D] border rounded-sm p-8 flex items-center justify-between transition-all cursor-pointer group",
                                n.read ? "border-white/5 opacity-60" : "border-primary/30 shadow-[0_0_30px_rgba(204,255,0,0.02)]"
                            )}
                        >
                            <div className="flex items-center gap-10">
                                <div className={cn(
                                    "w-12 h-12 rounded-sm flex items-center justify-center transition-all group-hover:scale-110",
                                    n.type === 'job' ? 'bg-primary/10 text-primary' :
                                        n.type === 'system' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                                )}>
                                    {n.type === 'job' ? <Zap className="w-5 h-5" /> :
                                        n.type === 'system' ? <Terminal className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3 mb-1">
                                        {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>}
                                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">
                                            {n.type.toUpperCase()} / {new Date(n.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-[900] italic uppercase text-white tracking-tighter mb-1">{n.title}</h3>
                                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic">{n.message}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {n.link && (
                                    <div className="p-3 bg-white/5 rounded-sm text-slate-600 group-hover:bg-primary group-hover:text-black transition-all">
                                        <ArrowUpRight className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {notifications.length === 0 && (
                        <div className="h-80 border border-dashed border-white/5 rounded-sm flex flex-col items-center justify-center text-slate-900">
                            <Bell className="w-16 h-16 mb-8 opacity-10" />
                            <span className="text-[11px] font-black uppercase italic tracking-[0.5em] opacity-20">Logs Synchronized</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
