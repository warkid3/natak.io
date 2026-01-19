"use client";

import * as React from "react";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
        {
            title: "Creative Mode",
            url: "/creative",
            icon: Sparkles,
        },
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

            <div className="border-t border-zinc-800 p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Profile</span>
                    <UserButton afterSignOutUrl="/" />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Team</span>
                    <OrganizationSwitcher
                        appearance={{
                            elements: {
                                organizationPreviewTextContainer: "text-white",
                                organizationSwitcherTrigger: "text-white hover:text-primary"
                            }
                        }}
                    />
                </div>
            </div>
        </Sidebar>
    );
}
