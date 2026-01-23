"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AuthLayout } from '@/components/ui/sign-in';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Invitation } from '@/lib/invitations';

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
    const router = useRouter();
    const supabase = createClient();
    const [invitation, setInvitation] = useState<Invitation | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    // Unwrap params
    const [token, setToken] = useState<string>("");

    useEffect(() => {
        params.then(p => setToken(p.token));
    }, [params]);

    useEffect(() => {
        if (!token) return;

        const checkAuthAndInvite = async () => {
            // 1. Check auth
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            // 2. Fetch invitation
            try {
                const response = await fetch(`/api/invitations/${token}`);
                if (!response.ok) {
                    throw new Error('Invitation not found or expired');
                }
                const data = await response.json();
                setInvitation(data.invitation);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        checkAuthAndInvite();
    }, [token, supabase]);

    const handleAccept = async () => {
        if (!user) {
            router.push(`/login?next=/invite/${token}`);
            return;
        }

        setProcessing(true);
        try {
            const response = await fetch(`/api/invitations/${token}`, {
                method: 'POST',
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to accept invitation');
            }

            // Success - redirect to app
            router.push('/assets');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setProcessing(false);
        }
    };

    const handleDecline = async () => {
        if (!confirm('Are you sure you want to decline this invitation?')) return;

        setProcessing(true);
        try {
            await fetch(`/api/invitations/${token}`, {
                method: 'DELETE',
            });
            setError('Invitation declined');
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <AuthLayout
                title={<>Invitation<br /><span className="text-red-500">Error</span></>}
                description="Unable to process invitation"
                heroImageSrc="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=1200&q=80"
            >
                <div className="flex flex-col items-center text-center space-y-6 py-8">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <XCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-black uppercase text-white italic">Something went wrong</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 max-w-xs">
                            {error}
                        </p>
                    </div>
                    <Button onClick={() => router.push('/login')} className="w-full bg-white/10 hover:bg-white/20">
                        Back to Login
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    // Checking email match if user is logged in
    const emailMatch = user && invitation && user.email?.toLowerCase() === invitation.email.toLowerCase();

    return (
        <AuthLayout
            title={<>You're<br /><span className="text-primary">Invited</span></>}
            description={`Join ${invitation?.organization?.name}`}
            heroImageSrc="https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=1200&q=80"
        >
            <div className="space-y-8">
                {/* Inviter Info */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary font-black text-xl">
                        {invitation?.organization?.name?.[0]}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Invited by</p>
                        <p className="text-white font-bold">{invitation?.inviter?.name}</p>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Role</p>
                        <p className="text-primary font-black uppercase tracking-wider">{invitation?.role}</p>
                    </div>
                </div>

                {/* Warning if logged in with wrong email */}
                {user && !emailMatch && (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-amber-500 uppercase">Wrong Account</p>
                            <p className="text-[10px] text-slate-400">
                                You are logged in as {user.email}, but this invitation is for {invitation?.email}.
                                Please switch accounts to accept.
                            </p>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                    {!user ? (
                        <Button
                            onClick={() => router.push(`/login?next=/invite/${token}`)}
                            className="w-full h-12 bg-primary text-black font-black uppercase tracking-widest hover:bg-primary/90"
                        >
                            Log In to Accept
                        </Button>
                    ) : (
                        <Button
                            onClick={handleAccept}
                            disabled={!emailMatch || processing}
                            className="w-full h-12 bg-primary text-black font-black uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50"
                        >
                            {processing ? 'Joining...' : 'Accept Invitation'}
                        </Button>
                    )}

                    <Button
                        onClick={handleDecline}
                        disabled={processing}
                        variant="ghost"
                        className="w-full h-12 text-slate-500 hover:text-red-500 font-bold uppercase tracking-widest text-[10px]"
                    >
                        Decline
                    </Button>
                </div>
            </div>
        </AuthLayout>
    );
}
