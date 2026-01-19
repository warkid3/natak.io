"use client";

import React, { ReactNode } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle2, Search, Activity, Link as LinkIcon, Cpu, FastForward, Lock } from 'lucide-react'

export function Features() {
    return (
        <section className="py-16 md:py-32 bg-transparent">
            <div className="mx-auto max-w-2xl px-6 lg:max-w-5xl">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic leading-none text-white">
                        The <span className="text-red-500">Transformation</span>
                    </h2>
                    <p className="mt-6 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.4em]">Infrastructure Audit // Chaos vs. NATAK Order</p>
                </div>

                <div className="mx-auto grid gap-6 lg:grid-cols-2">
                    {/* LEFT SIDE: COMMON PAIN POINTS */}
                    <FeatureCard variant="chaos">
                        <CardHeader className="pb-3">
                            <CardHeading
                                variant="chaos"
                                icon={AlertCircle}
                                title="Common Pain Points"
                                description="The bottlenecks of traditional manual workflows."
                            />
                        </CardHeader>

                        <div className="px-6 pb-6 space-y-3">
                            <InfoCard
                                variant="chaos"
                                icon={Search}
                                label="Asset Discovery Friction"
                                value="High Friction"
                                detail="AI creator teams spend 40% of their time searching for specific assets across unindexed storage systems and fragmented cloud buckets."
                            />
                            <InfoCard
                                variant="chaos"
                                icon={Activity}
                                label="Training on Consumer Hardware"
                                value="System Lag"
                                detail="Training Identity Models (LoRAs) and batch upscaling thousands of AI-generated images requires days of manual supervision on local GPUs."
                            />
                            <InfoCard
                                variant="chaos"
                                icon={LinkIcon}
                                label="Identity Consistency Breakdown"
                                value="Brand Chaos"
                                detail="Generic AI tools generate random faces every time. Maintaining visual brand continuity for virtual influencers across 5+ platforms is nearly impossible."
                            />
                        </div>
                    </FeatureCard>

                    {/* RIGHT SIDE: THE NATAK SOLUTION */}
                    <FeatureCard variant="order">
                        <CardHeader className="pb-3">
                            <CardHeading
                                variant="order"
                                icon={CheckCircle2}
                                title="The NATAK Solution"
                                description="The autonomous future of content management."
                            />
                        </CardHeader>

                        <CardContent className="space-y-3">
                            <InfoCard
                                variant="order"
                                icon={Cpu}
                                label="Neural Content Lake"
                                value="Zero Latency"
                                detail="Our AI-powered DAM indexes every asset for instant retrieval via natural language. Search by scene, style, or character identity—zero manual tagging."
                            />
                            <InfoCard
                                variant="order"
                                icon={FastForward}
                                label="Identity Persistence Engine"
                                value="GPU Accelerated"
                                detail="Train custom LoRAs once, generate unlimited AI influencer content with perfect facial consistency. GPU clusters process at 100x consumer hardware speed."
                            />
                            <InfoCard
                                variant="order"
                                icon={Lock}
                                label="ETL Pipeline Automation"
                                value="Unified DNA"
                                detail="Extract fan engagement insights, Transform raw prompts into optimized assets, Load directly to distribution channels. Your content factory runs 24/7."
                            />
                        </CardContent>
                    </FeatureCard>

                    {/* FULL WIDTH BOTTOM: SYSTEM INTEGRATION */}
                    <FeatureCard variant="hybrid" className="p-10 lg:col-span-2">
                        <p className="mx-auto my-6 max-w-2xl text-balance text-center text-2xl font-black uppercase italic tracking-tight text-white">
                            Smart synchronization with <span className="text-lime">automated metadata</span> reminders for maintenance.
                        </p>

                        <div className="flex justify-center gap-12 overflow-hidden py-8">
                            <CircularUI
                                label="Friction"
                                circles={[{ pattern: 'border' }, { pattern: 'border' }]}
                            />

                            <CircularUI
                                label="Processing"
                                circles={[{ pattern: 'none' }, { pattern: 'primary' }]}
                            />

                            <CircularUI
                                label="Integration"
                                circles={[{ pattern: 'blue' }, { pattern: 'none' }]}
                            />

                            <CircularUI
                                label="Security"
                                circles={[{ pattern: 'primary' }, { pattern: 'none' }]}
                                className="hidden sm:block"
                            />
                        </div>
                    </FeatureCard>
                </div>
            </div>
        </section>
    )
}

interface FeatureCardProps {
    children: ReactNode
    className?: string
    variant?: 'chaos' | 'order' | 'hybrid'
}

const FeatureCard = ({ children, className, variant = 'chaos' }: FeatureCardProps) => (
    <Card className={cn(
        'group relative rounded-none shadow-none overflow-hidden transition-all duration-500 bg-zinc-950/40 border-white/5',
        variant === 'chaos' ? 'hover:border-red-500/30' : variant === 'order' ? 'hover:border-lime/30' : 'hover:border-white/20',
        className
    )}>
        <CardDecorator variant={variant} />
        {children}
    </Card>
)

const CardDecorator = ({ variant }: { variant: 'chaos' | 'order' | 'hybrid' }) => {
    const color = variant === 'chaos' ? 'bg-red-500' : variant === 'order' ? 'bg-lime' : 'bg-zinc-700';
    return (
        <>
            <span className={cn(color, "absolute -left-px -top-px block size-2 rounded-tl-sm transition-colors duration-500")}></span>
            <span className={cn(color, "absolute -right-px -top-px block size-2 rounded-tr-sm transition-colors duration-500")}></span>
            <span className={cn(color, "absolute -bottom-px -left-px block size-2 rounded-bl-sm transition-colors duration-500")}></span>
            <span className={cn(color, "absolute -bottom-px -right-px block size-2 rounded-br-sm transition-colors duration-500")}></span>
        </>
    )
}

interface CardHeadingProps {
    icon: any
    title: string
    description: string
    variant?: 'chaos' | 'order'
}

const CardHeading = ({ icon: Icon, title, description, variant = 'chaos' }: CardHeadingProps) => (
    <div className="p-4">
        <span className={cn(
            "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]",
            variant === 'chaos' ? 'text-red-500' : 'text-lime'
        )}>
            <Icon className="size-4" />
            {title}
        </span>
        <p className="mt-8 text-2xl font-black uppercase italic tracking-tighter text-white/90 leading-tight">
            {description}
        </p>
    </div>
)

interface InfoCardProps {
    icon: any
    label: string
    value: string
    detail: string
    variant: 'chaos' | 'order'
}

const InfoCard = ({ icon: Icon, label, value, detail, variant }: InfoCardProps) => {
    const isChaos = variant === 'chaos';
    return (
        <div className={cn(
            "p-5 border transition-all duration-500 rounded-2xl flex items-start gap-5",
            isChaos
                ? "bg-red-500/5 border-red-500/10 hover:border-red-500/30 group/info"
                : "bg-lime/5 border-lime/10 hover:border-lime/30 group/info"
        )}>
            <div className={cn(
                "p-3 rounded-xl shrink-0 mt-1",
                isChaos ? "bg-red-500/10 text-red-500" : "bg-lime/10 text-lime"
            )}>
                <Icon size={20} className="group-hover/info:scale-110 transition-transform" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</span>
                    <span className={cn("text-[10px] font-black uppercase tracking-widest border px-2 py-0.5 rounded-full", isChaos ? "text-red-400 border-red-500/20" : "text-lime border-lime/20")}>
                        {value}
                    </span>
                </div>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">{detail}</p>
            </div>
        </div>
    )
}

interface CircleConfig {
    pattern: 'none' | 'border' | 'primary' | 'blue'
}

interface CircularUIProps {
    label: string
    circles: CircleConfig[]
    className?: string
}

const CircularUI = ({ label, circles, className }: CircularUIProps) => (
    <div className={className}>
        <div className="bg-gradient-to-b from-white/10 size-fit rounded-2xl to-transparent p-px">
            <div className="bg-zinc-900 relative flex aspect-square w-fit items-center -space-x-4 rounded-[15px] p-4">
                {circles.map((circle, i) => (
                    <div
                        key={i}
                        className={cn('size-7 rounded-full border sm:size-8', {
                            'border-lime': circle.pattern === 'none',
                            'border-lime bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.1),rgba(255,255,255,0.1)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'border',
                            'border-lime bg-zinc-800 bg-[repeating-linear-gradient(-45deg,rgba(223,255,0,0.5),rgba(223,255,0,0.5)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'primary',
                            'bg-zinc-800 z-1 border-white/20 bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.05),rgba(255,255,255,0.05)_1px,transparent_1px,transparent_4px)]': circle.pattern === 'blue',
                        })}></div>
                ))}
            </div>
        </div>
        <span className="text-zinc-600 mt-2 block text-center text-[9px] font-bold uppercase tracking-widest">{label}</span>
    </div>
)
