"use client";

import { motion } from 'framer-motion';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';
import {
    Home,
    Sparkles,
    Layers,
    UserCircle,
    Archive,
    CreditCard,
    Settings,
    HelpCircle,
    Bell,
    LogOut,
    Zap,
    Plus,
    BarChart3,
    Image,
    Shield
} from 'lucide-react';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { mockStore } from '@/lib/mockStore';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        setUser(mockStore.getUser());
        const interval = setInterval(() => {
            setUser(mockStore.getUser());
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        mockStore.setUser(null);
        router.push('/login');
    };

    if (pathname === '/login' || pathname === '/signup') return null;


    return (
        <aside className="w-72 h-full bg-surface border-r border-white/5 flex flex-col p-6 font-sans select-none shrink-0 z-40">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-12 flex items-center gap-3"
            >
                <div className="w-8 h-8 bg-primary rounded-[2px] flex items-center justify-center">
                    <Zap className="w-5 h-5 text-black fill-black" />
                </div>
                <div className="text-xl font-black tracking-tighter text-white uppercase italic">
                    natak<span className="text-primary">.</span>io
                </div>
            </motion.div>

            <div className="flex-1 space-y-12">
                {/* Workspace Section */}
                <section>
                    <h3 className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mb-4 ml-3 italic">Workspace</h3>
                    <StaggerContainer className="space-y-1" delayChildren={0.1}>
                        <SidebarItem href="/operations" icon={<Home className="w-4 h-4" />} label="Operations Center" isActive={pathname === '/operations'} />
                        <SidebarItem href="/analytics" icon={<BarChart3 className="w-4 h-4" />} label="Analytics" isActive={pathname === '/analytics'} />
                        <SidebarItem href="/library" icon={<Image className="w-4 h-4" />} label="Library" isActive={pathname === '/library'} />
                        <SidebarItem href="/creative" icon={<Sparkles className="w-4 h-4" />} label="Creative Mode" isActive={pathname === '/creative'} />
                        <SidebarItem href="/admin" icon={<Shield className="w-4 h-4" />} label="Admin Panel" isActive={pathname === '/admin'} />
                        <SidebarItem href="/assets" icon={<Layers className="w-4 h-4" />} label="Asset DAM" isActive={pathname === '/assets'} />
                        <SidebarItem href="/characters" icon={<UserCircle className="w-4 h-4" />} label="Characters" isActive={pathname === '/characters'} />
                        <SidebarItem href="/saved-prompts" icon={<Archive className="w-4 h-4" />} label="Prompt Archive" isActive={pathname === '/saved-prompts'} />
                    </StaggerContainer>
                </section>

                {/* Account Section */}
                <section>
                    <h3 className="text-[9px] font-black text-slate-700 uppercase tracking-[0.4em] mb-4 ml-3 italic">Management</h3>
                    <StaggerContainer className="space-y-1" delayChildren={0.3}>
                        <SidebarItem href="/notifications" icon={<Bell className="w-4 h-4" />} label="Notifications" isActive={pathname === '/notifications'} />
                        <SidebarItem href="/credits" icon={<CreditCard className="w-4 h-4" />} label="Credit Store" isActive={pathname === '/credits'} />
                        <SidebarItem href="/settings" icon={<Settings className="w-4 h-4" />} label="Settings & API" isActive={pathname === '/settings'} />
                        <SidebarItem href="/support" icon={<HelpCircle className="w-4 h-4" />} label="Help & Support" isActive={pathname === '/support'} />
                    </StaggerContainer>
                </section>
            </div>

            {/* User Footer */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-6 border-t border-white/5 space-y-4"
            >
                {/* ... existing footer content ... */}
                <div className="flex items-center justify-between px-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{user?.tier || 'GUEST'} OPERATOR</span>
                        <span className="text-[13px] font-black text-white italic truncate max-w-[120px]">{user?.email || 'Login Required'}</span>
                    </div>
                    <button onClick={handleLogout} className="text-slate-700 hover:text-primary transition-colors">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>

                <Link href="/credits" className="flex items-center justify-between bg-primary/5 border border-primary/20 p-4 rounded-[2px] hover:bg-primary/10 transition-all group">
                    <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-[11px] font-black text-primary italic uppercase tracking-widest">
                            {(user?.credits || 0).toLocaleString()} CR
                        </span>
                    </div>
                    <Plus className="w-3 h-3 text-primary opacity-30 group-hover:opacity-100" />
                </Link>
            </motion.div>
        </aside>
    );
}

function SidebarItem({ href, icon, label, isActive }: { href: string; icon: React.ReactNode; label: string; isActive: boolean }) {
    return (
        <StaggerItem>
            <Link
                href={href}
                className="relative flex items-center gap-4 px-4 py-3.5 rounded-[10px] text-[10px] font-black uppercase tracking-[0.2em] italic transition-all group overflow-hidden"
            >
                {isActive && (
                    <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 bg-primary shadow-[0_4px_20px_rgba(204,255,0,0.15)] rounded-[10px] z-0"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}

                <span className={cn("relative z-10 flex items-center gap-4 transition-colors", isActive ? "text-black" : "text-slate-500 group-hover:text-white")}>
                    {icon}
                    {label}
                </span>
            </Link>
        </StaggerItem>
    );
}
