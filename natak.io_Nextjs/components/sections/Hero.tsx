"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export function Hero() {
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // GSAP typewriter effect for headline
        if (headlineRef.current) {
            const text = headlineRef.current.innerText;
            headlineRef.current.innerHTML = "";

            const chars = text.split("");
            chars.forEach((char, i) => {
                const span = document.createElement("span");
                span.innerHTML = char === " " ? "&nbsp;" : char;
                span.style.opacity = "0";
                span.style.display = "inline-block";
                headlineRef.current?.appendChild(span);
            });

            gsap.to(headlineRef.current.children, {
                opacity: 1,
                stagger: 0.03,
                duration: 0.1,
                ease: "power1.out",
                delay: 0.5,
            });
        }
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-void"
        >
            {/* Grid Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage: `
              linear-gradient(var(--acid-lime) 1px, transparent 1px),
              linear-gradient(90deg, var(--acid-lime) 1px, transparent 1px)
            `,
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            {/* Radial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-void/50 to-void" />

            <div className="container-narrow mx-auto px-6 pt-32 pb-20 relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-charcoal border border-lime/20 rounded-full"
                    >
                        <Zap className="w-4 h-4 text-lime" />
                        <span className="text-sm mono text-industrial/80">
                            Identity-First Content Infrastructure
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <h1
                        ref={headlineRef}
                        className="text-industrial mb-6 leading-[1.05]"
                    >
                        Transform Chaos Into{" "}
                        <span className="text-lime">Content Control</span>
                    </h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        NATAK.io is the world's first Identity-First Content Infrastructure—
                        transforming chaotic content creation into a predictable, scalable
                        supply chain. Create 50+ unique images in minutes, not months.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Link
                            href="#pricing"
                            className="btn btn-primary group text-base px-8 py-4"
                        >
                            Join the Syndicate
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="#features"
                            className="btn btn-secondary text-base px-8 py-4"
                        >
                            See How It Works
                        </Link>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.8 }}
                        className="mt-16 pt-10 border-t border-industrial/10"
                    >
                        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-black text-lime mb-2">50+</div>
                                <div className="text-sm mono text-muted uppercase tracking-wider">Images/Batch</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-black text-lime mb-2">14s</div>
                                <div className="text-sm mono text-muted uppercase tracking-wider">Avg Render</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-black text-lime mb-2">$0.02</div>
                                <div className="text-sm mono text-muted uppercase tracking-wider">Per Image</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Hero Visual Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 2 }}
                    className="mt-20 relative"
                >
                    <div className="relative mx-auto max-w-5xl">
                        {/* Browser Chrome Mockup */}
                        <div className="bg-charcoal rounded-lg border border-industrial/10 overflow-hidden shadow-2xl">
                            {/* Browser Bar */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-steel border-b border-industrial/10">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-error/60" />
                                    <div className="w-3 h-3 rounded-full bg-warning/60" />
                                    <div className="w-3 h-3 rounded-full bg-success/60" />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <div className="px-4 py-1 bg-void rounded text-xs mono text-muted">
                                        app.natak.io
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Preview Placeholder */}
                            <div className="p-6 min-h-[400px] flex items-center justify-center">
                                <div className="grid grid-cols-4 gap-4 w-full max-w-3xl">
                                    {/* Kanban Columns */}
                                    {["Queued", "Processing", "Ready", "Done"].map((col, i) => (
                                        <div key={col} className="space-y-3">
                                            <div className="text-xs mono text-muted uppercase flex items-center gap-2">
                                                <span
                                                    className={`w-2 h-2 rounded-full ${i === 3 ? "bg-lime" : i === 2 ? "bg-success" : i === 1 ? "bg-warning" : "bg-muted"
                                                        }`}
                                                />
                                                {col}
                                            </div>
                                            {/* Cards */}
                                            {[...Array(3 - Math.floor(i * 0.5))].map((_, j) => (
                                                <div
                                                    key={j}
                                                    className="aspect-[3/4] bg-steel rounded border border-industrial/10 flex items-center justify-center"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-industrial/20" />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Glow Effect */}
                        <div className="absolute -inset-4 bg-lime/5 blur-3xl -z-10 rounded-full" />
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-10 rounded-full border-2 border-industrial/30 flex items-start justify-center p-2"
                >
                    <div className="w-1 h-2 bg-lime rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
}
