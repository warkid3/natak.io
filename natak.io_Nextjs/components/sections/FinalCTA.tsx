"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export function FinalCTA() {
    return (
        <section className="section bg-void relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lime/5 rounded-full blur-3xl" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime/30 to-transparent" />
            </div>

            <div className="container-narrow mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-lime/10 border border-lime/30 rounded-full"
                    >
                        <Zap className="w-4 h-4 text-lime fill-lime" />
                        <span className="text-sm mono text-lime font-medium">
                            Limited Founding Spots Available
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-industrial mb-6 leading-tight">
                        Stop Creating Content.
                        <br />
                        <span className="text-lime">Start Manufacturing It.</span>
                    </h2>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join the creators who've traded chaos for control.
                        Your content factory awaits.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            href="#pricing"
                            className="btn btn-primary group text-lg px-10 py-5"
                        >
                            Join the Syndicate
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="#features"
                            className="btn btn-ghost text-lg"
                        >
                            Learn More
                        </Link>
                    </div>

                    {/* Urgency Note */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 text-sm text-muted"
                    >
                        <span className="text-lime font-mono">47 of 100</span> founding spots remaining.
                        Pricing increases after launch.
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
