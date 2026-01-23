"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Building2, Users, Rocket, CheckCircle2, ChevronRight, Globe, LayoutGrid, Zap } from 'lucide-react';
import { createOrganization, joinOrganization, submitMarketingData, selectPlan } from './actions';
import PricingSection from '@/components/ui/pricing-section-4';
import { CreditStoreSection } from '@/components/CreditStoreSection';
import { cn } from '@/lib/utils';

type OnboardingStep = 'org_selection' | 'org_details' | 'marketing' | 'pricing' | 'completed';

export default function OnboardingPage() {
    const [step, setStep] = useState<OnboardingStep>('org_selection');
    const [orgMode, setOrgMode] = useState<'create' | 'join' | null>(null);
    const [orgName, setOrgName] = useState('');
    const [orgId, setOrgId] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [marketingData, setMarketingData] = useState({
        role: '',
        teamSize: '',
        useCase: ''
    });

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('onboarding_status')
                .eq('id', user.id)
                .single();

            if (profile?.onboarding_status && profile.onboarding_status !== 'completed') {
                setStep(profile.onboarding_status as OnboardingStep);
            } else if (profile?.onboarding_status === 'completed') {
                router.push('/analytics');
            }
            setLoading(false);
        };
        checkStatus();
    }, [router, supabase]);

    const handleAction = async (action: () => Promise<any>, nextStep?: OnboardingStep) => {
        setLoading(true);
        setError(null);
        try {
            await action();
            if (nextStep) setStep(nextStep);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOrgSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (orgMode === 'create') {
            await handleAction(() => createOrganization(orgName), 'marketing');
        } else {
            await handleAction(() => joinOrganization(orgId));
            router.push('/analytics');
        }
    };

    const handleMarketingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleAction(() => submitMarketingData(marketingData), 'pricing');
    };

    const handlePlanSelect = async (plan: string) => {
        // Map UI plan names to Database values
        let dbTier = plan;
        if (plan === 'Business') dbTier = 'Pro';
        if (plan === 'Enterprise') dbTier = 'Agency';

        await handleAction(() => selectPlan(dbTier));
        router.push('/analytics');
    };

    if (loading && step === 'org_selection') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-primary animate-spin rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#070708] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[160px] pointer-events-none" />

            <div className="w-full max-w-4xl z-10">
                {/* Progress Indicator */}
                <div className="flex justify-center mb-12 gap-4">
                    {['org_selection', 'marketing', 'pricing'].map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div className={cn(
                                "w-2 h-2 rounded-full transition-all duration-500",
                                step === s ? "bg-primary w-8 shadow-[0_0_15px_rgba(204,255,0,0.5)]" : (i < ['org_selection', 'marketing', 'pricing'].indexOf(step) ? "bg-primary/40" : "bg-white/10")
                            )} />
                        </div>
                    ))}
                </div>

                {step === 'org_selection' && (
                    <div className="grid md:grid-cols-2 gap-6 animate-element">
                        <Card
                            className={cn(
                                "bg-black/40 backdrop-blur-xl border-white/10 hover:border-primary/40 cursor-pointer transition-all flex flex-col items-center p-12 text-center group",
                                orgMode === 'create' && "border-primary/60 bg-primary/5"
                            )}
                            onClick={() => { setOrgMode('create'); setStep('org_details'); }}
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <Rocket className="w-8 h-8 text-white group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">Create New Organization</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Start a fresh organization and invite your team</p>
                        </Card>

                        <Card
                            className={cn(
                                "bg-black/40 backdrop-blur-xl border-white/10 hover:border-primary/40 cursor-pointer transition-all flex flex-col items-center p-12 text-center group",
                                orgMode === 'join' && "border-primary/60 bg-primary/5"
                            )}
                            onClick={() => { setOrgMode('join'); setStep('org_details'); }}
                        >
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <Users className="w-8 h-8 text-white group-hover:text-primary transition-colors" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">Join Existing</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Access an established workspace with an Organization ID</p>
                        </Card>
                    </div>
                )}

                {step === 'org_details' && (
                    <Card className="bg-black/40 backdrop-blur-xl border-white/10 max-w-md mx-auto animate-element">
                        <CardHeader>
                            <CardTitle className="text-2xl font-black uppercase text-white">
                                {orgMode === 'create' ? 'Organization Details' : 'Organization ID'}
                            </CardTitle>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                {orgMode === 'create' ? 'Name your new workspace' : 'Enter the Organization ID provided by your admin'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleOrgSubmit} className="space-y-6">
                                {orgMode === 'create' ? (
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Organization Name</Label>
                                        <Input
                                            placeholder="NATAK_CORP_01"
                                            value={orgName}
                                            onChange={(e) => setOrgName(e.target.value)}
                                            className="bg-black/50 border-white/10 h-12 font-mono text-xs focus:border-primary"
                                            required
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Organization ID</Label>
                                        <Input
                                            placeholder="00000000-0000-0000-0000-000000000000"
                                            value={orgId}
                                            onChange={(e) => setOrgId(e.target.value)}
                                            className="bg-black/50 border-white/10 h-12 font-mono text-xs focus:border-primary"
                                            required
                                        />
                                    </div>
                                )}
                                {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">{error}</p>}
                                <Button className="w-full h-12 bg-primary text-black font-black uppercase tracking-[0.2em]">
                                    {loading ? 'PROCESSING...' : 'CONTINUE'}
                                </Button>
                            </form>
                        </CardContent>
                        <CardFooter>
                            <button onClick={() => setStep('org_selection')} className="text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors">
                                ← Back to selection
                            </button>
                        </CardFooter>
                    </Card>
                )}

                {/* Global Loading Overlay */}
                {loading && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-t-2 border-primary animate-spin rounded-full" />
                            <p className="text-white font-mono text-xs animate-pulse">PROCESSING...</p>
                        </div>
                    </div>
                )}

                {step === 'marketing' && (
                    <Card className="bg-black/40 backdrop-blur-xl border-white/10 max-w-xl mx-auto animate-element">
                        <CardHeader>
                            <CardTitle className="text-2xl font-black uppercase text-white">Tell us about yourself</CardTitle>
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Help us customize your experience</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleMarketingSubmit} className="space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">What is your primary role?</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Agency Owner', 'Content Manager', 'Independent Creator', 'Technical Handler'].map((r) => (
                                            <div
                                                key={r}
                                                className={cn(
                                                    "p-4 border border-white/5 rounded-xl text-center cursor-pointer transition-all text-[10px] font-bold uppercase tracking-wider",
                                                    marketingData.role === r ? "bg-primary text-black border-primary" : "bg-white/5 text-slate-400 hover:border-white/20"
                                                )}
                                                onClick={() => setMarketingData({ ...marketingData, role: r })}
                                            >
                                                {r}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Team Size</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Solo', '2-5 People', '10+ People'].map((t) => (
                                            <div
                                                key={t}
                                                className={cn(
                                                    "p-4 border border-white/5 rounded-xl text-center cursor-pointer transition-all text-[10px] font-bold uppercase tracking-wider",
                                                    marketingData.teamSize === t ? "bg-primary text-black border-primary" : "bg-white/5 text-slate-400 hover:border-white/20"
                                                )}
                                                onClick={() => setMarketingData({ ...marketingData, teamSize: t })}
                                            >
                                                {t}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-xs font-mono">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    className="w-full h-12 bg-primary text-black font-black uppercase tracking-[0.2em]"
                                    disabled={!marketingData.role || !marketingData.teamSize}
                                >
                                    Proceed to Plan Selection
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {step === 'pricing' && (
                    <div className="animate-element relative">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-black uppercase text-white mb-2 italic">Select a Plan</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Choose the plan that fits your needs</p>
                        </div>

                        {error && (
                            <div className="max-w-md mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-center font-mono">
                                Error: {error}
                            </div>
                        )}

                        <PricingSection onSelectPlan={handlePlanSelect} />

                        <div className="mt-20 border-t border-white/5 pt-10">
                            <CreditStoreSection />
                        </div>

                        <div className="flex justify-center mt-12">
                            <Button
                                variant="ghost"
                                onClick={() => handlePlanSelect('Pro')}
                                className="text-primary font-black uppercase tracking-widest"
                            >
                                Continue with Default (PRO) →
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
