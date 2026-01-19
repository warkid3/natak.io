"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, MousePointer, LayoutGrid, Check, X } from "lucide-react";

const features = [
    {
        icon: Sparkles,
        title: "Identity Engine",
        subtitle: "LoRA Training",
        description:
            "Train your unique identity model once. Generate infinite variations across any context, style, or setting. Your face, your brand—perfectly consistent.",
        stats: [
            { label: "Training Time", value: "~30 min" },
            { label: "Contexts", value: "Unlimited" },
        ],
    },
    {
        icon: MousePointer,
        title: "Vibe Stealer",
        subtitle: "Chrome Extension",
        description:
            "See a style you love on Instagram? Right-click, send to NATAK. We extract the vibe and apply it to your identity model. Inspiration to execution in seconds.",
        stats: [
            { label: "Style Extraction", value: "Instant" },
            { label: "Integration", value: "1-Click" },
        ],
    },
    {
        icon: LayoutGrid,
        title: "Kanban Factory",
        subtitle: "Batch Pipeline",
        description:
            "Queue 50+ renders at once. Watch them flow through processing to completion. Track every image, every status—like a factory floor for content.",
        stats: [
            { label: "Batch Size", value: "50+" },
            { label: "Parallel Jobs", value: "10" },
        ],
    },
];

const painPoints = [
    { pain: "Hours spent on single photoshoots", solution: "50+ images in minutes" },
    { pain: "Inconsistent brand identity across content", solution: "Perfect face consistency via LoRA" },
    { pain: "Expensive photographer retainer fees", solution: "$0.02 per image generation" },
    { pain: "Limited to physical locations only", solution: "Any setting, any context imaginable" },
    { pain: "Weeks of calendar coordination", solution: "Generate on-demand, 24/7" },
];

export function Features() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="features" className="section bg-void">
            <div className="container-narrow mx-auto">
                {/* Section Header */}
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-4 py-1 bg-lime/10 text-lime text-sm mono uppercase tracking-wider mb-4 rounded">
                        Features
                    </span>
                    <h2 className="text-industrial mb-6">
                        Industrial-Grade <span className="text-lime">Content Factory</span>
                    </h2>
                    <p className="text-muted text-lg max-w-2xl mx-auto">
                        Three core systems working in perfect harmony. Extract inspiration,
                        transform it through your identity, load it into your content pipeline.
                    </p>
                </motion.div>

                {/* Pain vs Solution Grid */}
                <div className="mb-24">
                    <motion.h3
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-2xl font-bold text-industrial text-center mb-10"
                    >
                        From Chaos → <span className="text-lime">Control</span>
                    </motion.h3>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {painPoints.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-4 p-4 bg-charcoal rounded border border-industrial/10"
                            >
                                <div className="flex flex-col gap-3 flex-1">
                                    <div className="flex items-center gap-2 text-error/80">
                                        <X className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm line-through opacity-70">{item.pain}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-lime">
                                        <Check className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm font-medium">{item.solution}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="card group relative overflow-hidden"
                        >
                            {/* Accent Line */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-lime via-lime/50 to-transparent" />

                            {/* Icon */}
                            <div className="w-12 h-12 rounded bg-lime/10 flex items-center justify-center mb-6 group-hover:bg-lime/20 transition-colors">
                                <feature.icon className="w-6 h-6 text-lime" />
                            </div>

                            {/* Content */}
                            <div className="mb-6">
                                <span className="text-xs mono text-muted uppercase tracking-wider">
                                    {feature.subtitle}
                                </span>
                                <h3 className="text-xl font-bold text-industrial mt-1">
                                    {feature.title}
                                </h3>
                            </div>

                            <p className="text-muted text-sm leading-relaxed mb-6">
                                {feature.description}
                            </p>

                            {/* Stats */}
                            <div className="flex gap-4 pt-4 border-t border-industrial/10">
                                {feature.stats.map((stat) => (
                                    <div key={stat.label}>
                                        <div className="text-lime font-bold mono">{stat.value}</div>
                                        <div className="text-xs text-muted">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
