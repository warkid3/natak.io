"use client";

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { AuthLayout, GlassInputWrapper, GoogleIcon, Testimonial } from "@/components/ui/sign-in";
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: signupError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (signupError) {
            setError(signupError.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <AuthLayout
            title={<>Create<br /><span className="text-primary">Account</span></>}
            description="Join NATAK"
            heroImageSrc="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=1200&q=80"
        >
            {success ? (
                <div className="text-center space-y-6 py-8">
                    <div className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-black p-6 rounded-sm uppercase tracking-widest leading-relaxed">
                        Registration successful. <br />Please check your email for verification.
                    </div>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full rounded-2xl border border-white/10 text-white font-black uppercase tracking-widest hover:bg-white/5 transition-all py-4 text-[12px]"
                    >
                        Return to Login
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">Email Address</label>
                            <GlassInputWrapper>
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white font-mono"
                                    required
                                />
                            </GlassInputWrapper>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">Password</label>
                            <GlassInputWrapper>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-white font-mono"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center">
                                        {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />}
                                    </button>
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
                            className="w-full rounded-2xl bg-primary py-4 font-black text-[12px] uppercase tracking-[0.2em] text-black hover:bg-primary/90 transition-all shadow-[0_20px_40px_rgba(204,255,0,0.2)]"
                        >
                            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                        </button>
                    </form>

                    <div className="relative flex items-center justify-center py-4">
                        <span className="w-full border-t border-white/5"></span>
                        <span className="px-4 text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground bg-background absolute">OR</span>
                    </div>

                    <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 border border-white/5 rounded-2xl py-4 hover:bg-white/5 transition-all text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white">
                        <GoogleIcon />
                        Continue with Google
                    </button>

                    <div className="flex justify-center text-[10px] font-bold uppercase tracking-widest text-slate-600 pb-8">
                        Already have an account? <a href="/login" className="text-primary hover:underline ml-2">Sign In</a>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
}
