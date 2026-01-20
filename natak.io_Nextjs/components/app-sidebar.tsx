"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import {
    Home,
    BarChart3,
    Image,
    Sparkles,
    Layers,
    UserCircle,
    Archive,
    Settings as SettingsIcon,
    CreditCard,
    Shield,
    Users,
    FileText,
    Building2,
    ChevronRight,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useCredits } from "@/hooks/use-credits";

const navData = {
    workspace: [
        {
            title: "Operations Center",
            url: "/operations",
            icon: Home,
        },
        {
            title: "Analytics",
            url: "/analytics",
            icon: BarChart3,
        },
        {
            title: "Library",
            url: "/library",
            icon: Image,
        },
    ],
    create: [
        // Creative Mode hidden - different plans
        // {
        //     title: "Creative Mode",
        //     url: "/creative",
        //     icon: Sparkles,
        // },
        {
            title: "Asset DAM",
            url: "/assets",
            icon: Layers,
        },
        {
            title: "Characters",
            url: "/characters",
            icon: UserCircle,
        },
        {
            title: "Prompt Archive",
            url: "/saved-prompts",
            icon: Archive,
        },
    ],
    admin: {
        title: "Administration",
        icon: Shield,
        items: [
            {
                title: "User Management",
                url: "/admin#users",
                icon: Users,
            },
            {
                title: "Audit Logs",
                url: "/admin#audit",
                icon: FileText,
            },
            {
                title: "Organization",
                url: "/admin#organization",
                icon: Building2,
            },
        ],
    },
    account: [
        {
            title: "Settings",
            url: "/settings",
            icon: SettingsIcon,
        },
        {
            title: "Credits",
            url: "/credits",
            icon: CreditCard,
        },
    ],
};


function UserProfile() {
    const [user, setUser] = React.useState<User | null>(null);
    const router = useRouter();
    const supabase = createClient();

    React.useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const { credits, tier, loading } = useCredits(user?.id);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    if (!user) return (
        <div className="flex items-center gap-3 py-2 animate-pulse">
            <div className="h-8 w-8 rounded-full bg-zinc-800" />
            <div className="space-y-2">
                <div className="h-2 w-20 bg-zinc-800 rounded" />
                <div className="h-2 w-16 bg-zinc-800 rounded" />
            </div>
        </div>
    );

    return (
        <div className="flex items-center justify-between gap-3 group/user overflow-hidden">
            <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-8 w-8 border border-white/10 ring-1 ring-white/5">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary text-black text-[10px] font-black uppercase">
                        {user.email?.substring(0, 2) || 'OP'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-tight text-white truncate">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-600 truncate">
                            {tier}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                        <span className="text-[8px] font-bold text-primary font-mono">
                            {loading ? '...' : credits} CR
                        </span>
                    </div>
                </div>
            </div>
            <button
                onClick={handleSignOut}
                className="p-2 opacity-0 group-hover/user:opacity-100 hover:bg-white/5 rounded-sm transition-all text-zinc-600 hover:text-red-500"
                title="Decommission Session"
            >
                <LogOut className="h-4 w-4" />
            </button>
        </div>
    );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();

    return (
        <Sidebar {...props} className="border-r border-zinc-800 bg-[#0a0a0b]">
            <SidebarHeader className="border-b border-zinc-800 p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                        <span className="text-xl font-black text-black">N</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black uppercase tracking-wider text-white">NATAK.IO</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">AI Studio</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className="p-2 overflow-y-auto scrollbar-hide">
                {/* Workspace */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                        Workspace
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {navData.workspace.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.url;
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={isActive} className="h-10">
                                        <Link href={item.url} className="flex items-center gap-3">
                                            <Icon className="h-4 w-4" />
                                            <span className="text-xs font-bold uppercase">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Create */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                        Create
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {navData.create.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.url;
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={isActive} className="h-10">
                                        <Link href={item.url} className="flex items-center gap-3">
                                            <Icon className="h-4 w-4" />
                                            <span className="text-xs font-bold uppercase">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Account */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
                        Account
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {navData.account.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.url;
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={isActive} className="h-10">
                                        <Link href={item.url} className="flex items-center gap-3">
                                            <Icon className="h-4 w-4" />
                                            <span className="text-xs font-bold uppercase">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}

                        {/* Admin (Collapsible) - nested under Account */}
                        <Collapsible defaultOpen={false} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton className="h-10">
                                        <Shield className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase">Administration</span>
                                        <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {navData.admin.items.map((item) => {
                                            const Icon = item.icon;
                                            const isActive = pathname === item.url;
                                            return (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuSubButton asChild isActive={isActive}>
                                                        <Link href={item.url} className="flex items-center gap-2">
                                                            <Icon className="h-3 w-3" />
                                                            <span className="text-[10px] font-bold uppercase">{item.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarRail />

            <div className="border-t border-zinc-800 p-4">
                <UserProfile />
            </div>
        </Sidebar>
    );
}
