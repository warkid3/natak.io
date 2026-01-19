"use client";

import { motion } from "framer-motion";

const logos = [
    { name: "NVIDIA", text: "NVIDIA" },
    { name: "Fal.ai", text: "FAL.AI" },
    { name: "Cloudflare", text: "CLOUDFLARE" },
    { name: "Supabase", text: "SUPABASE" },
    { name: "Vercel", text: "VERCEL" },
];

export function TrustBar() {
    return (
        <section className="py-12 bg-charcoal border-y border-industrial/10 overflow-hidden">
            <div className="container-wide mx-auto px-6">
                <div className="text-center mb-8">
                    <p className="text-sm mono text-muted uppercase tracking-widest">
                        Built on Enterprise Infrastructure
                    </p>
                </div>

                {/* Logo Strip with Infinite Scroll */}
                <div className="relative">
                    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                        <motion.div
                            className="flex gap-16 items-center"
                            animate={{
                                x: [0, -50 * logos.length * 2],
                            }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 20,
                                    ease: "linear",
                                },
                            }}
                        >
                            {/* Duplicate logos for seamless loop */}
                            {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
                                <div
                                    key={i}
                                    className="flex-shrink-0 text-industrial/30 hover:text-industrial/60 transition-colors duration-300 cursor-default"
                                >
                                    <span className="text-lg font-bold tracking-wider whitespace-nowrap">
                                        {logo.text}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
