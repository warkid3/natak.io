"use client";

import { motion } from "framer-motion";
import { Eye, Cpu, Download, ArrowRight } from "lucide-react";

const steps = [
    {
        icon: Eye,
        number: "01",
        title: "EXTRACT",
        description:
            "Capture inspiration from anywhere. Our Vibe Stealer Chrome extension lets you grab any style with a right-click. We analyze composition, lighting, styling, and mood.",
        detail: "Visual DNA Extraction",
    },
    {
        icon: Cpu,
        number: "02",
        title: "TRANSFORM",
        description:
            "Your Identity Engine takes over. The extracted style merges with your LoRA-trained identity model. AI generates unique variations while maintaining perfect face consistency.",
        detail: "Identity + Style Fusion",
    },
    {
        icon: Download,
        number: "03",
        title: "LOAD",
        description:
            "Images flow into your Kanban Factory. Track batches from queue to completion. Download, organize, and deploy your content library—ready for any platform.",
        detail: "Pipeline to Production",
    },
];

export function HowItWorks() {
    return (
        <section className="section bg-charcoal relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage: `
              repeating-linear-gradient(
                90deg,
                var(--acid-lime) 0,
                var(--acid-lime) 1px,
                transparent 1px,
                transparent 100px
              )
            `,
                    }}
                />
            </div>

            <div className="container-narrow mx-auto relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-4 py-1 bg-lime/10 text-lime text-sm mono uppercase tracking-wider mb-4 rounded">
                        Process
                    </span>
                    <h2 className="text-industrial mb-6">
                        The ETL <span className="text-lime">Pipeline</span>
                    </h2>
                    <p className="text-muted text-lg max-w-2xl mx-auto">
                        Extract styles, Transform through your identity, Load into production.
                        Industrial content creation in three precision steps.
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] bg-industrial/10 -translate-y-1/2" />
                    <motion.div
                        className="hidden lg:block absolute top-1/2 left-0 h-[2px] bg-lime -translate-y-1/2"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    <div className="grid lg:grid-cols-3 gap-8 relative">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="relative"
                            >
                                {/* Step Card */}
                                <div className="bg-void p-8 rounded border border-industrial/10 relative z-10">
                                    {/* Number Badge */}
                                    <div className="absolute -top-4 left-6 px-3 py-1 bg-lime text-void font-bold mono text-sm">
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded bg-lime/10 flex items-center justify-center mb-6 mt-2">
                                        <step.icon className="w-7 h-7 text-lime" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-black text-industrial mb-2 tracking-tight">
                                        {step.title}
                                    </h3>
                                    <p className="text-xs mono text-lime uppercase tracking-wider mb-4">
                                        {step.detail}
                                    </p>
                                    <p className="text-muted text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Arrow (not on last item) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:flex absolute top-1/2 -right-4 z-20 w-8 h-8 bg-charcoal rounded-full items-center justify-center border border-lime">
                                        <ArrowRight className="w-4 h-4 text-lime" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Result Statement */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-4 px-6 py-4 bg-void border border-lime/20 rounded-lg">
                        <span className="text-muted">Result:</span>
                        <span className="text-lime font-bold mono">50+ UNIQUE IMAGES</span>
                        <span className="text-muted">in</span>
                        <span className="text-lime font-bold mono">~12 MINUTES</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
