"use client";

import React, { useState, useEffect } from 'react';
import { AuthLayout, GlassInputWrapper } from "@/components/ui/sign-in";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionChecked, setSessionChecked] = useState(false);
    const [hasSession, setHasSession] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Check if user has a valid recovery session
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setHasSession(!!session);
            setSessionChecked(true);
        };
        checkSession();
    }, [supabase.auth]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setLoading(true);

        const { error: updateError } = await supabase.auth.updateUser({
            password: password
        });

        if (updateError) {
            setError(updateError.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
            // Sign out and redirect to login after 2 seconds
            setTimeout(async () => {
                await supabase.auth.signOut();
                router.push('/login');
            }, 2000);
        }
    };

    if (!sessionChecked) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-primary animate-spin rounded-full" />
            </div>
        );
    }

    if (!hasSession) {
        return (
            <AuthLayout
                title={<>Session<br /><span className="text-primary">Expired</span></>}
                description="Please request a new reset link"
                heroImageSrc="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=1200&q=80"
            >
                <div className="flex flex-col items-center text-center space-y-6 py-8">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-black uppercase text-white italic">Invalid or Expired Link</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 max-w-xs">
                            This password reset link has expired or is invalid. Please request a new one.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/forgot-password')}
                        className="w-full rounded-2xl bg-primary py-4 font-black text-[12px] uppercase tracking-[0.2em] text-black hover:bg-primary/90 transition-all"
                    >
                        Request New Link
                    </button>
                </div>
            </AuthLayout>
        );
    }

    if (success) {
        return (
            <AuthLayout
                title={<>Password<br /><span className="text-primary">Updated</span></>}
                description="Your password has been changed"
                heroImageSrc="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=1200&q=80"
            >
                <div className="flex flex-col items-center text-center space-y-6 py-8">
                    <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-black uppercase text-white italic">Success!</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 max-w-xs">
                            Your password has been updated. Redirecting to login...
                        </p>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title={<>New<br /><span className="text-primary">Password</span></>}
            description="Enter your new password"
            heroImageSrc="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=1200&q=80"
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">New Password</label>
                    <GlassInputWrapper>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent text-sm p-4 pl-12 pr-12 rounded-2xl focus:outline-none text-white font-mono"
                                required
                                minLength={8}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                                {showPassword ? <EyeOff className="w-4 h-4 text-slate-500 hover:text-primary" /> : <Eye className="w-4 h-4 text-slate-500 hover:text-primary" />}
                            </button>
                        </div>
                    </GlassInputWrapper>
                    <p className="text-[9px] text-slate-600 mt-2 ml-1 uppercase tracking-wider">Minimum 8 characters</p>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">Confirm Password</label>
                    <GlassInputWrapper>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-transparent text-sm p-4 pl-12 pr-12 rounded-2xl focus:outline-none text-white font-mono"
                                required
                            />
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2">
                                {showConfirm ? <EyeOff className="w-4 h-4 text-slate-500 hover:text-primary" /> : <Eye className="w-4 h-4 text-slate-500 hover:text-primary" />}
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
                    className="w-full rounded-2xl bg-primary py-4 font-black text-[12px] uppercase tracking-[0.2em] text-black hover:bg-primary/90 transition-all shadow-[0_20px_40px_rgba(204,255,0,0.2)] disabled:opacity-50"
                >
                    {loading ? 'UPDATING...' : 'SET NEW PASSWORD'}
                </button>
            </form>
        </AuthLayout>
    );
}
