"use client";

import React, { useState } from 'react';
import { AuthLayout, GlassInputWrapper } from "@/components/ui/sign-in";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
        });

        if (resetError) {
            setError(resetError.message);
            setLoading(false);
        } else {
            setSent(true);
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <AuthLayout
                title={<>Check<br /><span className="text-primary">Email</span></>}
                description="Password reset link sent"
                heroImageSrc="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=1200&q=80"
            >
                <div className="flex flex-col items-center text-center space-y-6 py-8">
                    <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-black uppercase text-white italic">Email Sent</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 max-w-xs">
                            We've sent a password reset link to <span className="text-primary">{email}</span>. Check your inbox and follow the instructions.
                        </p>
                    </div>
                    <div className="space-y-3 w-full pt-4">
                        <button
                            onClick={() => router.push('/login')}
                            className="w-full rounded-2xl border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/5 transition-all py-4 text-[12px]"
                        >
                            Return to Login
                        </button>
                        <button
                            onClick={() => { setSent(false); setEmail(''); }}
                            className="w-full text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors py-2"
                        >
                            Try a different email
                        </button>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title={<>Reset<br /><span className="text-primary">Password</span></>}
            description="Enter your email to receive a reset link"
            heroImageSrc="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=1200&q=80"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">Email Address</label>
                    <GlassInputWrapper>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent text-sm p-4 pl-12 rounded-2xl focus:outline-none text-white font-mono"
                                required
                            />
                        </div>
                    </GlassInputWrapper>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold p-3 rounded-sm uppercase tracking-wider">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-primary py-4 font-black text-[12px] uppercase tracking-[0.2em] text-black hover:bg-primary/90 transition-all shadow-[0_20px_40px_rgba(204,255,0,0.2)] disabled:opacity-50"
                >
                    {loading ? 'SENDING...' : 'SEND RESET LINK'}
                </button>
            </form>

            <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors mt-6"
            >
                <ArrowLeft className="w-3 h-3" />
                Back to Login
            </Link>
        </AuthLayout>
    );
}
