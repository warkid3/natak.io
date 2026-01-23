import { createClient } from '@/lib/supabase/server';
import { emailService } from '@/lib/email';
import crypto from 'crypto';

export type InvitationRole = 'admin' | 'creator' | 'viewer';

export interface Invitation {
    id: string;
    organization_id: string;
    email: string;
    role: InvitationRole;
    invited_by: string;
    token: string;
    status: 'pending' | 'accepted' | 'declined' | 'expired';
    expires_at: string;
    created_at: string;
    accepted_at: string | null;
    organization?: {
        id: string;
        name: string;
        tier: string;
    };
    inviter?: {
        name: string;
        email: string;
    };
}

export interface InvitationResult {
    success: boolean;
    error?: string;
    invitation?: Invitation;
}

const SEAT_LIMITS: Record<string, number> = {
    'Starter': 5,
    'Pro': 25,
    'Agency': 999, // effectively unlimited
};

/**
 * Get the number of available seats for an organization
 */
export async function getAvailableSeats(orgId: string): Promise<{ total: number; used: number; available: number }> {
    const supabase = await createClient();

    // Get org tier and seat limit
    const { data: org } = await supabase
        .from('organizations')
        .select('tier, seat_limit')
        .eq('id', orgId)
        .single();

    const seatLimit = org?.seat_limit || SEAT_LIMITS[org?.tier || 'Starter'] || 5;

    // Count current members
    const { count: memberCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId);

    const used = memberCount || 0;

    return {
        total: seatLimit,
        used,
        available: Math.max(0, seatLimit - used),
    };
}

/**
 * Create a new invitation
 */
export async function createInvitation(
    orgId: string,
    email: string,
    role: InvitationRole,
    invitedBy: string
): Promise<InvitationResult> {
    const supabase = await createClient();

    // 1. Check seat availability
    const seats = await getAvailableSeats(orgId);
    if (seats.available <= 0) {
        return {
            success: false,
            error: `Your organization has reached its seat limit (${seats.total} seats). Please upgrade your plan to invite more members.`,
        };
    }

    // 2. Check if user is already in an org
    const { data: existingUser } = await supabase
        .from('profiles')
        .select('id, organization_id')
        .eq('email', email)
        .single();

    if (existingUser?.organization_id) {
        return {
            success: false,
            error: 'This user is already a member of another organization.',
        };
    }

    // 3. Check for existing pending invitation
    const { data: existingInvite } = await supabase
        .from('organization_invitations')
        .select('id, status')
        .eq('organization_id', orgId)
        .eq('email', email)
        .eq('status', 'pending')
        .single();

    if (existingInvite) {
        return {
            success: false,
            error: 'An invitation has already been sent to this email address.',
        };
    }

    // 4. Generate secure token
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    // 5. Create invitation
    const { data: invitation, error: insertError } = await supabase
        .from('organization_invitations')
        .insert({
            organization_id: orgId,
            email: email.toLowerCase(),
            role,
            invited_by: invitedBy,
            token,
            expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

    if (insertError) {
        console.error('[INVITATIONS] Create error:', insertError);
        return { success: false, error: 'Failed to create invitation.' };
    }

    // 6. Get org and inviter details for email
    const { data: org } = await supabase
        .from('organizations')
        .select('name')
        .eq('id', orgId)
        .single();

    const { data: inviter } = await supabase
        .from('profiles')
        .select('name, email')
        .eq('id', invitedBy)
        .single();

    // 7. Send invitation email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://natak.io';
    await emailService.sendInvitation({
        to: email,
        inviterName: inviter?.name || 'A team member',
        orgName: org?.name || 'the organization',
        role,
        acceptUrl: `${baseUrl}/invite/${token}`,
    });

    return { success: true, invitation };
}

/**
 * Validate an invitation token
 */
export async function validateInvitation(token: string): Promise<Invitation | null> {
    const supabase = await createClient();

    const { data: invitation } = await supabase
        .from('organization_invitations')
        .select(`
            *,
            organization:organizations(id, name, tier),
            inviter:profiles!invited_by(name, email)
        `)
        .eq('token', token)
        .single();

    if (!invitation) return null;

    // Check if expired
    if (new Date(invitation.expires_at) < new Date() && invitation.status === 'pending') {
        await supabase
            .from('organization_invitations')
            .update({ status: 'expired' })
            .eq('id', invitation.id);
        invitation.status = 'expired';
    }

    return invitation as Invitation;
}

/**
 * Accept an invitation
 */
export async function acceptInvitation(token: string, userId: string): Promise<InvitationResult> {
    const supabase = await createClient();

    // 1. Validate invitation
    const invitation = await validateInvitation(token);

    if (!invitation) {
        return { success: false, error: 'Invalid invitation link.' };
    }

    if (invitation.status === 'expired') {
        return { success: false, error: 'This invitation has expired.' };
    }

    if (invitation.status === 'accepted') {
        return { success: false, error: 'This invitation has already been used.' };
    }

    if (invitation.status === 'declined') {
        return { success: false, error: 'This invitation was declined.' };
    }

    // 2. Check user email matches invitation
    const { data: user } = await supabase
        .from('profiles')
        .select('email, organization_id')
        .eq('id', userId)
        .single();

    if (user?.email?.toLowerCase() !== invitation.email.toLowerCase()) {
        return {
            success: false,
            error: `This invitation was sent to ${invitation.email}. Please sign in with that email address.`
        };
    }

    if (user?.organization_id) {
        return { success: false, error: 'You are already a member of an organization.' };
    }

    // 3. Check seat availability again (race condition protection)
    const seats = await getAvailableSeats(invitation.organization_id);
    if (seats.available <= 0) {
        return { success: false, error: 'This organization has no available seats.' };
    }

    // 4. Add user to organization
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            organization_id: invitation.organization_id,
            role: invitation.role,
            onboarding_status: 'completed', // Skip onboarding for invited users
        })
        .eq('id', userId);

    if (updateError) {
        console.error('[INVITATIONS] Accept error:', updateError);
        return { success: false, error: 'Failed to join organization.' };
    }

    // 5. Mark invitation as accepted
    await supabase
        .from('organization_invitations')
        .update({
            status: 'accepted',
            accepted_at: new Date().toISOString(),
        })
        .eq('id', invitation.id);

    // 6. Send welcome email
    await emailService.sendWelcome(invitation.email, user?.email?.split('@')[0] || 'Operator');

    return { success: true, invitation };
}

/**
 * Decline an invitation
 */
export async function declineInvitation(token: string): Promise<InvitationResult> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('organization_invitations')
        .update({ status: 'declined' })
        .eq('token', token)
        .eq('status', 'pending');

    if (error) {
        return { success: false, error: 'Failed to decline invitation.' };
    }

    return { success: true };
}

/**
 * Get all invitations for an organization
 */
export async function getOrgInvitations(orgId: string): Promise<Invitation[]> {
    const supabase = await createClient();

    const { data } = await supabase
        .from('organization_invitations')
        .select(`
            *,
            inviter:profiles!invited_by(name, email)
        `)
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });

    return (data || []) as Invitation[];
}

/**
 * Revoke a pending invitation
 */
export async function revokeInvitation(invitationId: string): Promise<InvitationResult> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('organization_invitations')
        .delete()
        .eq('id', invitationId)
        .eq('status', 'pending');

    if (error) {
        return { success: false, error: 'Failed to revoke invitation.' };
    }

    return { success: true };
}
