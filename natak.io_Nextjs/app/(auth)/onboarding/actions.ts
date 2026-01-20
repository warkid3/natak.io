"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

async function triggerWelcomeEmail(email: string) {
    console.log(`[SIMULATION] Sending welcome email to: ${email}`);
    // In production, call a service like Resend or a Supabase Edge Function here.
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

    await triggerWelcomeEmail(user.email!);

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

    const { error } = await supabase
        .from('profiles')
        .update({
            tier: tier,
            onboarding_status: 'completed'
        })
        .eq('id', user.id);

    if (error) throw error;

    await triggerWelcomeEmail(user.email!);

    revalidatePath("/");
    return { success: true };
}
