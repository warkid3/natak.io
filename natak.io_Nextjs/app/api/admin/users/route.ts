import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Middleware to check if user is admin
async function checkAdmin(userId: string) {
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

    return profile?.role === 'admin';
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        // Check if user is admin
        const isAdmin = await checkAdmin(userId);
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Get user's organization
        const { data: profile } = await supabase
            .from("profiles")
            .select("organization_id")
            .eq("id", userId)
            .single();

        // Fetch all users in the same organization
        const { data: users, error } = await supabase
            .from("profiles")
            .select("id, name, email, role, tier, credits, theme, last_login, updated_at")
            .eq("organization_id", profile?.organization_id)
            .order("updated_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ users });
    } catch (error: any) {
        console.error("Get users error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch users" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId, email, role } = await req.json();

        if (!userId || !email) {
            return NextResponse.json(
                { error: "User ID and email required" },
                { status: 400 }
            );
        }

        // Check if user is admin
        const isAdmin = await checkAdmin(userId);
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // TODO: Send invitation email
        // For now, just log the audit trail
        await supabase.from("audit_logs").insert({
            user_id: userId,
            action: "invite_user",
            resource_type: "user",
            details: { email, role: role || 'creator' }
        });

        return NextResponse.json({
            success: true,
            message: "Invitation sent"
        });
    } catch (error: any) {
        console.error("Invite user error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to invite user" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { userId, targetUserId, role } = await req.json();

        if (!userId || !targetUserId || !role) {
            return NextResponse.json(
                { error: "User ID, target user ID, and role required" },
                { status: 400 }
            );
        }

        // Check if user is admin
        const isAdmin = await checkAdmin(userId);
        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Update user role
        const { error } = await supabase
            .from("profiles")
            .update({ role })
            .eq("id", targetUserId);

        if (error) throw error;

        // Log the change
        await supabase.from("audit_logs").insert({
            user_id: userId,
            action: "role_change",
            resource_type: "user",
            resource_id: targetUserId,
            details: { new_role: role }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Update role error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update role" },
            { status: 500 }
        );
    }
}
