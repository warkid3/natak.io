"use client";

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-void text-white flex flex-col font-sans">
            <Navbar isSystemActive={false} />
            <main className="flex-1 py-32 px-6">
                <div className="max-w-4xl mx-auto prose prose-invert prose-zinc">
                    <p className="text-lime text-xs font-black uppercase tracking-[0.3em] mb-4">Legal // Governance</p>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-12">Privacy Policy</h1>
                    <p className="text-zinc-500 text-sm uppercase tracking-widest font-bold mb-16">Last Updated: January 19, 2026</p>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">1. Introduction</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            NATAK (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our generative AI and Digital Asset Management platform (&quot;Service&quot;).
                        </p>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">2. Information We Collect</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">We collect information in the following ways:</p>

                        <h3 className="text-lg font-bold text-white mt-6 mb-3">2.1 Information You Provide</h3>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li><strong className="text-white">Account Data:</strong> Email address, name, and password upon registration.</li>
                            <li><strong className="text-white">Payment Data:</strong> Billing information processed securely by our third-party payment processor (e.g., Stripe). We do not store full credit card numbers.</li>
                            <li><strong className="text-white">User Content:</strong> Images, videos, prompts, and other files you upload for processing or storage within the platform.</li>
                            <li><strong className="text-white">LoRA Training Data:</strong> Reference images you provide for AI model training.</li>
                        </ul>

                        <h3 className="text-lg font-bold text-white mt-6 mb-3">2.2 Information Collected Automatically</h3>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li><strong className="text-white">Usage Data:</strong> Information about how you interact with the Service, such as features used, generation counts, and timestamps.</li>
                            <li><strong className="text-white">Device Data:</strong> IP address, browser type, operating system, and device identifiers.</li>
                            <li><strong className="text-white">Cookies:</strong> We use cookies and similar tracking technologies for session management and analytics.</li>
                        </ul>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">3. How We Use Your Information</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">We use the information we collect for the following purposes:</p>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li>To provide, operate, and maintain the Service.</li>
                            <li>To process transactions and manage your subscriptions.</li>
                            <li>To train custom AI models (LoRAs) based solely on your provided data, exclusively for your use.</li>
                            <li>To improve and personalize the Service.</li>
                            <li>To communicate with you, including for support and service updates.</li>
                            <li>To detect, prevent, and address technical issues and fraud.</li>
                        </ul>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">4. Data Storage & Security</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            Your data is stored on secure, enterprise-grade cloud infrastructure (Cloudflare R2, Supabase). All data is encrypted in transit (TLS) and at rest. We implement strict access controls and regularly audit our systems for vulnerabilities.
                        </p>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            <strong className="text-white">LoRA Weights & User Content:</strong> Your trained AI models and generated assets are stored in private, isolated cloud buckets accessible only to your account.
                        </p>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">5. Data Sharing & Disclosure</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            We do not sell your personal data. We may share information with:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li><strong className="text-white">Service Providers:</strong> Third-party vendors who assist us in operating the Service (e.g., cloud hosting, payment processing, analytics). These providers are bound by confidentiality agreements.</li>
                            <li><strong className="text-white">Legal Compliance:</strong> If required by law, regulation, or legal process.</li>
                            <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
                        </ul>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">6. Your Data Rights</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            Depending on your jurisdiction, you may have the following rights:
                        </p>
                        <ul className="list-disc list-inside text-zinc-400 space-y-2 ml-4">
                            <li><strong className="text-white">Access:</strong> Request a copy of the personal data we hold about you.</li>
                            <li><strong className="text-white">Correction:</strong> Request correction of inaccurate data.</li>
                            <li><strong className="text-white">Deletion:</strong> Request deletion of your account and associated data.</li>
                            <li><strong className="text-white">Portability:</strong> Request your data in a portable format.</li>
                        </ul>
                        <p className="text-zinc-400 leading-relaxed mt-4">
                            To exercise these rights, contact us at <a href="mailto:privacy@natak.io" className="text-lime hover:underline">privacy@natak.io</a>.
                        </p>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">7. Data Retention</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            We retain your personal data for as long as your account is active or as needed to provide the Service. Upon account deletion, we will delete your data within 30 days, except where retention is required by law.
                        </p>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">8. Children&apos;s Privacy</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            The Service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will take steps to delete it promptly.
                        </p>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">9. Changes to This Policy</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
                        </p>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 text-white">10. Contact Us</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@natak.io" className="text-lime hover:underline">privacy@natak.io</a>.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
