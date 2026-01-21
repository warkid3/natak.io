"use client";

import React from 'react';
import { CreditStoreSection } from '@/components/CreditStoreSection';
import { PricingTable, PricingTableHeader, PricingTableRow, PricingTablePlan, PricingTableBody, PricingTableHead, PricingTableCell } from '@/components/ui/pricing-table';
import { Button } from '@/components/ui/button';
import { Shield, Users, Rocket } from 'lucide-react';
import { FEATURES } from '@/app/(marketing)/pricing/page'; // Reuse feature list

export default function CreditsPage() {
    return (
        <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-violet-500/30 p-4 md:p-8 overflow-y-auto custom-scrollbar">
            <main className="w-full max-w-6xl mx-auto space-y-20">

                {/* Header */}
                <div className="text-center space-y-4 pt-10">
                    <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
                        Resource <span className="text-primary">Command</span>
                    </h1>
                    <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
                        Manage your subscription tier and available computing credits.
                    </p>
                </div>

                {/* Subscription Section */}
                <section>
                    <div className="flex items-center justify-center mb-8 gap-4">
                        <div className="h-px bg-zinc-800 w-20"></div>
                        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Active Subscription Plans</h2>
                        <div className="h-px bg-zinc-800 w-20"></div>
                    </div>

                    {/* We reuse the Pricing Table UI logic here but adapted for 'Upgrade' context */}
                    <PricingTable className="mx-auto max-w-5xl">
                        <PricingTableHeader>
                            <PricingTableRow>
                                <th />
                                <th className="p-1">
                                    <PricingTablePlan
                                        name="OPERATOR"
                                        badge="Current Plan"
                                        price="$29"
                                        compareAt="$49"
                                        icon={Shield}
                                    >
                                        <Button disabled className="w-full rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700" size="lg">
                                            Active
                                        </Button>
                                    </PricingTablePlan>
                                </th>
                                <th className="p-1">
                                    <PricingTablePlan
                                        name="DIRECTOR"
                                        badge="Recommended"
                                        price="$79"
                                        compareAt="$99"
                                        icon={Users}
                                        className="border-lime/50 bg-lime/5"
                                    >
                                        <Button
                                            className="w-full rounded-lg bg-lime text-black hover:bg-lime/90 font-bold"
                                            size="lg"
                                        >
                                            Upgrade
                                        </Button>
                                    </PricingTablePlan>
                                </th>
                                <th className="p-1">
                                    <PricingTablePlan
                                        name="EXECUTIVE"
                                        badge="Agency Scale"
                                        price="$199"
                                        compareAt="$299"
                                        icon={Rocket}
                                    >
                                        <Button variant="outline" className="w-full rounded-lg hover:bg-white hover:text-black transition-all" size="lg">
                                            Contact Sales
                                        </Button>
                                    </PricingTablePlan>
                                </th>
                            </PricingTableRow>
                        </PricingTableHeader>
                        <PricingTableBody>
                            {FEATURES.map((feature, index) => (
                                <PricingTableRow key={index}>
                                    <PricingTableHead className="text-zinc-500 font-mono uppercase text-[10px] tracking-wider">{feature.label}</PricingTableHead>
                                    {feature.values.map((value, index) => (
                                        <PricingTableCell key={index} className="text-zinc-300 font-bold text-xs text-center">{value}</PricingTableCell>
                                    ))}
                                </PricingTableRow>
                            ))}
                        </PricingTableBody>
                    </PricingTable>
                </section>

                {/* Credit Store Section */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none"></div>
                    <CreditStoreSection />
                </div>

            </main>
        </div>
    );
}
