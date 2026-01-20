"use client";

import React, { useState } from 'react';
import { AuthLayout, GlassInputWrapper, GoogleIcon, Testimonial } from "@/components/ui/sign-in";
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const sampleTestimonials: Testimonial[] = [];

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [showPassword, setShowPassword] = useState(false);

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            router.push('/assets');
            router.refresh();
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

    const handleResetPassword = () => {
        alert("Redirecting to secure password reset portal...");
        // Implement real reset flow if needed
    }

    const handleCreateAccount = () => {
        router.push('/signup');
    }

    return (
        <AuthLayout
            title={<>Welcome<br /><span className="text-primary">Back</span></>}
            description="Sign in to your account to continue"
            heroImageSrc="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=1200&q=80"
            testimonials={sampleTestimonials}
        >
            <form className="space-y-5" onSubmit={handleSignIn}>
                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">Email Address</label>
                    <GlassInputWrapper>
                        <input name="email" type="email" placeholder="Enter your email" className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white font-mono" required />
                    </GlassInputWrapper>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">Password</label>
                    <GlassInputWrapper>
                        <div className="relative">
                            <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-white font-mono" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-4 flex items-center">
                                {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" /> : <Eye className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />}
                            </button>
                        </div>
                    </GlassInputWrapper>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" name="rememberMe" className="w-4 h-4 rounded-sm border-white/10 bg-white/5 checked:bg-primary transition-all" />
                        <span className="text-foreground/60 group-hover:text-white-100 transition-colors">Remember me</span>
                    </label>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleResetPassword?.(); }} className="hover:underline text-primary transition-colors">Forgot Password?</a>
                </div>

                <button type="submit" className="w-full rounded-2xl bg-primary py-4 font-black text-[12px] uppercase tracking-[0.2em] text-black hover:bg-primary/90 transition-all shadow-[0_20px_40px_rgba(204,255,0,0.2)]">
                    Sign In
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

            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); handleCreateAccount?.(); }} className="text-primary hover:underline transition-colors ml-1">Sign Up</a>
            </p>
        </AuthLayout>
    );
}
