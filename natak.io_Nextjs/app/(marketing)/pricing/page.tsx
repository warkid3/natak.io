import React from 'react';
import { cn } from '@/lib/utils';
import { Shield, Users, Rocket } from 'lucide-react';
import {
    type FeatureItem,
    PricingTable,
    PricingTableBody,
    PricingTableHeader,
    PricingTableHead,
    PricingTableRow,
    PricingTableCell,
    PricingTablePlan,
} from '@/components/ui/pricing-table';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CreditStoreSection } from '@/components/CreditStoreSection';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-black relative selection:bg-lime selection:text-black">
            <Navbar isSystemActive={false} />
            <div className="relative min-h-screen overflow-hidden px-4 py-32">
                <div
                    className={cn(
                        'absolute inset-0 z-0 size-full max-h-102 opacity-50',
                        '[mask-image:radial-gradient(ellipse_at_center,var(--background),transparent)]',
                    )}
                    style={{
                        backgroundImage:
                            'radial-gradient(var(--foreground) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />
                <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center z-10">
                    <h1
                        className={cn(
                            'text-3xl leading-tight font-black uppercase tracking-tighter text-balance sm:text-7xl text-white',
                        )}
                    >
                        {'Industrial '}
                        <span className="text-lime italic">
                            {'Scale'}
                        </span>
                        <br />
                        <span className="text-zinc-500 text-3xl sm:text-5xl tracking-[0.2em]">
                            {'Infrastructure'}
                        </span>
                    </h1>
                    <p className="text-zinc-400 mt-6 max-w-2xl text-sm font-mono tracking-widest uppercase">
                        Choose the computing power that drives your content empire.
                    </p>
                </div>
                <Default />

                <div className="mt-12 border-t border-white/5 pt-8">
                    <CreditStoreSection />
                </div>
            </div>
            <Footer />
        </div>

    );
}

function Default() {
    return (
        <PricingTable className="mx-auto my-10 max-w-5xl z-10 relative">
            <PricingTableHeader>
                <PricingTableRow>
                    <th />
                    <th className="p-1">
                        <PricingTablePlan
                            name="OPERATOR"
                            badge="For Solopreneurs"
                            price="$29"
                            compareAt="$49"
                            icon={Shield}
                        >
                            <Button variant="outline" className="w-full rounded-lg" size="lg">
                                Start Pipeline
                            </Button>
                        </PricingTablePlan>
                    </th>
                    <th className="p-1">
                        <PricingTablePlan
                            name="DIRECTOR"
                            badge="For Growth"
                            price="$79"
                            compareAt="$99"
                            icon={Users}
                            className="after:pointer-events-none after:absolute after:-inset-0.5 after:rounded-[inherit] after:bg-gradient-to-b after:from-lime/15 after:to-transparent after:blur-[2px] border-lime/50"
                        >
                            <Button
                                className="w-full rounded-lg bg-lime text-black hover:bg-lime/90 font-bold"
                                size="lg"
                            >
                                Upgrade Now
                            </Button>
                        </PricingTablePlan>
                    </th>
                    <th className="p-1">
                        <PricingTablePlan
                            name="EXECUTIVE"
                            badge="For Agencies"
                            price="$199"
                            compareAt="$299"
                            icon={Rocket}
                        >
                            <Button variant="outline" className="w-full rounded-lg" size="lg">
                                Contact Sales
                            </Button>
                        </PricingTablePlan>
                    </th>
                </PricingTableRow>
            </PricingTableHeader>
            <PricingTableBody>
                {FEATURES.map((feature, index) => (
                    <PricingTableRow key={index}>
                        <PricingTableHead className="text-zinc-400 font-mono uppercase text-xs tracking-wider">{feature.label}</PricingTableHead>
                        {feature.values.map((value, index) => (
                            <PricingTableCell key={index} className="text-zinc-300 font-medium">{value}</PricingTableCell>
                        ))}
                    </PricingTableRow>
                ))}
            </PricingTableBody>
        </PricingTable>
    );
}

export const FEATURES: FeatureItem[] = [
    {
        label: 'Monthly Credits',
        values: ['500', '2,000', '6,000'],
    },
    {
        label: 'Character Slots',
        values: ['3', '10', 'Unlimited'],
    },
    {
        label: 'Image Models',
        values: ['Standard', 'Standard + Creative', 'Standard + Creative'],
    },
    {
        label: 'Creative Freedom (Grok)',
        values: [false, true, true],
    },
    {
        label: 'Video Resolution',
        values: ['1080p', '1440p', '4K (2160p)'],
    },
    {
        label: 'Max Video Duration',
        values: ['5s', '10s', '20s'],
    },
    {
        label: 'Batch Processing',
        values: ['Sequential', '10x Parallel', '20x Parallel'],
    },
    {
        label: 'Chrome Extension',
        values: [false, true, true],
    },
    {
        label: 'API Access',
        values: [false, false, true],
    },
    {
        label: 'Support Level',
        values: ['Community', 'Priority Email', 'Dedicated Agent'],
    },
];
