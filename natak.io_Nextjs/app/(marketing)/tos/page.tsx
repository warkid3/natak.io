"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-void text-white flex flex-col font-sans">
            <Navbar isSystemActive={false} />
            <main className="flex-1 py-32 px-6">
                <div className="max-w-4xl mx-auto prose prose-invert prose-zinc">
                    <p className="text-lime text-xs font-black uppercase tracking-[0.3em] mb-4">Legal // Governance</p>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-12">Terms of Service</h1>
                    <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold mb-16">Last Updated: January 19, 2026</p>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">1. Agreement to Terms</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            By accessing or using the NATAK platform (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these terms, you do not have permission to access the Service. NATAK is a generative AI tooling and Digital Asset Management (DAM) platform designed for professional content creators and digital media agencies.
                        </p>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">2. Description of Service</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            NATAK provides an Extract, Transform, Load (ETL) infrastructure for synthetic media workflows. Our services include, but are not limited to:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li>AI model training (LoRA) for character identity persistence.</li>
                            <li>Batch image and video generation pipelines.</li>
                            <li>Cloud-based Digital Asset Management (DAM) and storage.</li>
                            <li>Automated content processing, upscaling, and metadata tagging.</li>
                        </ul>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">3. User Responsibilities & Acceptable Use</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            You are responsible for your use of the Service and for any content you generate or store using our platform. You agree not to use the Service to:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li>Generate content depicting real individuals without their verifiable consent.</li>
                            <li>Create, store, or distribute content that violates any applicable local, state, national, or international law.</li>
                            <li>Engage in any activity that could harm minors.</li>
                            <li>Infringe upon the intellectual property rights of others.</li>
                            <li>Distribute malware, spam, or engage in any form of automated abuse of the platform.</li>
                        </ul>
                        <p className="text-zinc-400 leading-relaxed mt-4">
                            We reserve the right to suspend or terminate accounts that violate these terms without prior notice.
                        </p>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">4. Intellectual Property</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            <strong className="text-white">Your Content:</strong> You retain all ownership rights to the content you create or upload using our Service, including trained LoRA models and generated assets. We claim no intellectual property rights over your creations.
                        </p>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            <strong className="text-white">Our Platform:</strong> The Service, including its original code, features, and functionality, is and will remain the exclusive property of NATAK and its licensors. Our trademarks may not be used without prior written consent.
                        </p>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">5. Subscription & Payment</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            Certain features of the Service require a paid subscription. By subscribing, you agree to pay all fees associated with your chosen plan. All fees are non-refundable unless otherwise stated. We reserve the right to change pricing with 30 days&apos; notice.
                        </p>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">6. Disclaimer of Warranties</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                        </p>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">7. Limitation of Liability</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            IN NO EVENT SHALL NATAK, ITS DIRECTORS, EMPLOYEES, OR PARTNERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE.
                        </p>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">8. Governing Law</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which NATAK operates, without regard to its conflict of law provisions.
                        </p>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">9. Changes to Terms</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the new Terms on this page and updating the &quot;Last Updated&quot; date. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
                        </p>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">10. Contact Us</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            If you have any questions about these Terms, please contact us at <a href="mailto:legal@natak.io" className="text-lime hover:underline">legal@natak.io</a>.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
