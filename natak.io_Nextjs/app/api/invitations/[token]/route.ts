import { NextResponse } from 'next/server';
import { validateInvitation, acceptInvitation, declineInvitation } from '@/lib/invitations';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/invitations/[token] - Validate invitation token
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;
        const invitation = await validateInvitation(token);

        if (!invitation) {
            return NextResponse.json({ error: 'Invalid invitation' }, { status: 404 });
        }

        return NextResponse.json({
            invitation: {
                id: invitation.id,
                email: invitation.email,
                role: invitation.role,
                status: invitation.status,
                expires_at: invitation.expires_at,
                organization: invitation.organization,
                inviter: invitation.inviter,
            }
        });
    } catch (error) {
        console.error('[API] Validate invitation error:', error);
        return NextResponse.json({ error: 'Failed to validate invitation' }, { status: 500 });
    }
}

/**
 * POST /api/invitations/[token] - Accept invitation
 */
export async function POST(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Please sign in to accept this invitation' }, { status: 401 });
        }

        const { token } = await params;
        const result = await acceptInvitation(token, user.id);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({ success: true, redirectTo: '/assets' });
    } catch (error) {
        console.error('[API] Accept invitation error:', error);
        return NextResponse.json({ error: 'Failed to accept invitation' }, { status: 500 });
    }
}

/**
 * DELETE /api/invitations/[token] - Decline invitation
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;
        const result = await declineInvitation(token);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API] Decline invitation error:', error);
        return NextResponse.json({ error: 'Failed to decline invitation' }, { status: 500 });
    }
}
