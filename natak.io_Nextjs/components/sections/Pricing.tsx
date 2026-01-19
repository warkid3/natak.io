"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";

const tiers = [
    {
        name: "OPERATOR",
        price: { monthly: 29, annual: 24 },
        description: "For creators just starting their content journey.",
        credits: "200",
        features: [
            "1 Identity Model (LoRA)",
            "200 Generation Credits/mo",
            "Basic Kanban Pipeline",
            "Standard Queue Priority",
            "Community Support",
        ],
        cta: "Start Operating",
        popular: false,
    },
    {
        name: "DIRECTOR",
        price: { monthly: 79, annual: 66 },
        description: "For serious creators scaling their content operation.",
        credits: "800",
        features: [
            "3 Identity Models (LoRA)",
            "800 Generation Credits/mo",
            "Vibe Stealer Extension",
            "Advanced Kanban Pipeline",
            "Priority Queue Access",
            "Batch Processing (50+)",
            "Email Support",
        ],
        cta: "Take Direction",
        popular: true,
    },
    {
        name: "EXECUTIVE",
        price: { monthly: 199, annual: 166 },
        description: "For agencies and high-volume content operations.",
        credits: "Unlimited",
        features: [
            "10 Identity Models (LoRA)",
            "Unlimited Generation Credits",
            "Vibe Stealer Extension",
            "Enterprise Pipeline",
            "Highest Priority Queue",
            "Batch Processing (100+)",
            "API Access",
            "Dedicated Support",
            "Custom Integrations",
        ],
        cta: "Go Executive",
        popular: false,
    },
];

export function Pricing() {
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <section id="pricing" className="section bg-void">
            <div className="container-narrow mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="inline-block px-4 py-1 bg-lime/10 text-lime text-sm mono uppercase tracking-wider mb-4 rounded">
                        Pricing
                    </span>
                    <h2 className="text-industrial mb-6">
                        Choose Your <span className="text-lime">Tier</span>
                    </h2>
                    <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
                        Scalable pricing that grows with your content operation.
                        All plans include core infrastructure access.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-4 p-1 bg-charcoal rounded-lg">
                        <button
                            onClick={() => setIsAnnual(false)}
                            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${!isAnnual ? "bg-lime text-void" : "text-muted hover:text-industrial"
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setIsAnnual(true)}
                            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${isAnnual ? "bg-lime text-void" : "text-muted hover:text-industrial"
                                }`}
                        >
                            Annual
                            <span className="ml-2 text-xs bg-void/20 px-2 py-0.5 rounded">
                                Save 20%
                            </span>
                        </button>
                    </div>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative card ${tier.popular ? "card-highlight" : ""}`}
                        >
                            {/* Popular Badge */}
                            {tier.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <div className="flex items-center gap-1 px-3 py-1 bg-lime text-void text-xs font-bold mono rounded">
                                        <Star className="w-3 h-3 fill-current" />
                                        MOST POPULAR
                                    </div>
                                </div>
                            )}

                            {/* Tier Name */}
                            <div className="mb-6">
                                <h3 className="text-sm mono text-muted uppercase tracking-widest mb-2">
                                    {tier.name}
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-industrial">
                                        ${isAnnual ? tier.price.annual : tier.price.monthly}
                                    </span>
                                    <span className="text-muted text-sm">/month</span>
                                </div>
                                <p className="text-muted text-sm mt-2">{tier.description}</p>
                            </div>

                            {/* Credits Badge */}
                            <div className="mb-6 p-3 bg-void rounded border border-industrial/10">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted">Credits/month</span>
                                    <span className="font-bold mono text-lime">{tier.credits}</span>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-lime mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-industrial/80">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <Link
                                href="#"
                                className={`btn w-full justify-center ${tier.popular ? "btn-primary" : "btn-secondary"
                                    }`}
                            >
                                {tier.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Syndicate Upsell */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 p-8 bg-charcoal rounded border border-lime/30 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-lime/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime/10 rounded mb-4">
                                <Star className="w-4 h-4 text-lime fill-lime" />
                                <span className="text-sm font-bold mono text-lime">FOUNDER'S SYNDICATE</span>
                            </div>
                            <h3 className="text-2xl font-bold text-industrial mb-2">
                                Lock In Lifetime Pricing
                            </h3>
                            <p className="text-muted max-w-xl">
                                Join the founding 100 members. Get Executive-tier access at Director pricing—forever.
                                Plus exclusive founder perks, priority feature requests, and direct line to the team.
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <Link href="#" className="btn btn-primary text-base px-8 py-4">
                                Join the Syndicate
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
