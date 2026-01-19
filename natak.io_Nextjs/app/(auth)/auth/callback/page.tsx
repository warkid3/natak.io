"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { mockStore } from '@/lib/mockStore';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handleAuthCallback = async () => {
            const code = searchParams.get('code');
            const next = searchParams.get('next') ?? '/';

            if (code) {
                try {
                    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) throw error;

                    if (data.session) {
                        // Sync with our mockStore for now to keep the UI happy
                        // In a real app, realStore would just use supabase.auth.user()
                        const { user } = data.session;
                        mockStore.setUser({
                            id: user.id,
                            email: user.email || 'user@natak.io',
                            credits: 1000,
                            tier: 'Pro'
                        });
                    }

                    router.push(next);
                } catch (error) {
                    console.error('Auth Callback Error:', error);
                    router.push('/login?error=auth_callback_failed');
                }
            } else {
                // Check if session was established implicitly or handles hash
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    mockStore.setUser({
                        id: session.user.id,
                        email: session.user.email || 'user@natak.io',
                        credits: 1000,
                        tier: 'Pro'
                    });
                    router.push(next);
                } else {
                    // No code, no session -> redirect to login
                    router.push('/login');
                }
            }
        };

        handleAuthCallback();
    }, [searchParams, router]);

    return (
        <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="w-8 h-8 bg-primary rounded-[2px]" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                Authenticating...
            </p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center font-sans text-white">
            <Suspense fallback={<div>Loading...</div>}>
                <AuthCallbackContent />
            </Suspense>
        </div>
    );
}
