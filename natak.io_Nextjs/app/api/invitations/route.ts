import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createInvitation, getOrgInvitations, getAvailableSeats, revokeInvitation } from '@/lib/invitations';

/**
 * GET /api/invitations - List invitations for user's organization
 */
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user's org
        const { data: profile } = await supabase
            .from('profiles')
            .select('organization_id, role')
            .eq('id', user.id)
            .single();

        if (!profile?.organization_id) {
            return NextResponse.json({ error: 'No organization found' }, { status: 400 });
        }

        // Get invitations and seats
        const [invitations, seats] = await Promise.all([
            getOrgInvitations(profile.organization_id),
            getAvailableSeats(profile.organization_id),
        ]);

        return NextResponse.json({ invitations, seats });
    } catch (error) {
        console.error('[API] List invitations error:', error);
        return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
    }
}

/**
 * POST /api/invitations - Create a new invitation
 */
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('organization_id, role')
            .eq('id', user.id)
            .single();

        if (!profile?.organization_id) {
            return NextResponse.json({ error: 'No organization found' }, { status: 400 });
        }

        if (profile.role !== 'admin') {
            return NextResponse.json({ error: 'Only admins can invite members' }, { status: 403 });
        }

        const body = await request.json();
        const { email, role = 'creator' } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const result = await createInvitation(
            profile.organization_id,
            email,
            role,
            user.id
        );

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({ success: true, invitation: result.invitation });
    } catch (error) {
        console.error('[API] Create invitation error:', error);
        return NextResponse.json({ error: 'Failed to create invitation' }, { status: 500 });
    }
}

/**
 * DELETE /api/invitations - Revoke an invitation
 */
export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const invitationId = searchParams.get('id');

        if (!invitationId) {
            return NextResponse.json({ error: 'Invitation ID is required' }, { status: 400 });
        }

        const result = await revokeInvitation(invitationId);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API] Revoke invitation error:', error);
        return NextResponse.json({ error: 'Failed to revoke invitation' }, { status: 500 });
    }
}
