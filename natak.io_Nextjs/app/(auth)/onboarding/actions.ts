"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { emailService } from "@/lib/email";

export async function createOrganization(name: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // 1. Create Organization
    const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert([{ name }])
        .select()
        .single();

    if (orgError) throw orgError;

    // 2. Link User and Update Status
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            organization_id: org.id,
            onboarding_status: 'marketing'
        })
        .eq('id', user.id);

    if (profileError) throw profileError;

    revalidatePath("/onboarding");
    return { success: true };
}

export async function joinOrganization(orgId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // 1. Verify Org Exists
    const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('id', orgId)
        .single();

    if (orgError) throw new Error("Organization not found");

    // 2. Link User and Complete Onboarding (Skip marketing/pricing for joiners)
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            organization_id: org.id,
            onboarding_status: 'completed'
        })
        .eq('id', user.id);

    if (profileError) throw profileError;

    // Send welcome email
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', user.id)
            .single();

        await emailService.sendOnboardingComplete(
            user.email!,
            profile?.name || 'Operator',
            'Starter' // Default tier for joiners
        );
    } catch (emailError) {
        console.error("Failed to send welcome email (non-fatal):", emailError);
    }

    revalidatePath("/");
    return { success: true };
}

export async function submitMarketingData(data: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('profiles')
        .update({
            marketing_responses: data,
            onboarding_status: 'pricing'
        })
        .eq('id', user.id);

    if (error) throw error;

    revalidatePath("/onboarding");
    return { success: true };
}

export async function selectPlan(tier: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Determine credits based on tier
    // Starter/Operator: 200
    // Pro/Director: 800
    // Agency/Executive: 10000 (Effectively unlimited for beta)
    let initialCredits = 200;
    if (tier === 'Pro' || tier === 'Director') initialCredits = 800;
    if (tier === 'Agency' || tier === 'Executive') initialCredits = 10000;

    const { error } = await supabase
        .from('profiles')
        .update({
            tier: tier,
            onboarding_status: 'completed',
            credits: initialCredits // Grant initial credits
        })
        .eq('id', user.id);

    if (error) throw error;

    // Log the credit grant
    await supabase.from('credits_ledger').insert({
        user_id: user.id,
        amount: initialCredits,
        action: 'PLAN_GRANT',
        metadata: { tier: tier }
    });



    // Send onboarding complete email with tier info
    // Wrap in try-catch to ensure onboarding completes even if email fails (e.g. unverified email in dev)
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', user.id)
            .single();

        await emailService.sendOnboardingComplete(
            user.email!,
            profile?.name || 'Operator',
            tier
        );
    } catch (emailError) {
        console.error("Failed to send onboarding email (non-fatal):", emailError);
    }

    revalidatePath("/");
    return { success: true };
}
