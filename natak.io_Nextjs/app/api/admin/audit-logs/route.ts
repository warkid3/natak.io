import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const action = searchParams.get("action");
        const resource_type = searchParams.get("resource_type");
        const limit = parseInt(searchParams.get("limit") || "100");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Build query
        let query = supabase
            .from("audit_logs")
            .select(`
        *,
        profiles(name, email)
      `)
            .order("timestamp", { ascending: false })
            .limit(limit);

        // Apply filters
        if (action) {
            query = query.eq("action", action);
        }
        if (resource_type) {
            query = query.eq("resource_type", resource_type);
        }

        const { data: logs, error } = await query;

        if (error) throw error;

        return NextResponse.json({ logs });
    } catch (error: any) {
        console.error("Get audit logs error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch audit logs" },
            { status: 500 }
        );
    }
}
