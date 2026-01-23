"use client";

import React from 'react';
import AnimatedFooter from '@/components/ui/animated-footer';

export function Footer() {
    return (
        <AnimatedFooter
            leftLinks={[
                { href: "/docs", label: "Documentation" },
                { href: "/api", label: "API Reference" },
                { href: "/pricing", label: "Pricing" },
            ]}
            rightLinks={[
                { href: "/tos", label: "Terms" },
                { href: "/privacy", label: "Privacy" },
                { href: "/security", label: "Security" },
            ]}
            copyrightText="2025 NATAK_OS // ALL_RIGHTS_RESERVED"
            barCount={40}
        />
    );
}
