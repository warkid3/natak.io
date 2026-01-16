import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const { data: favorites, error } = await supabase
            .from("favorites")
            .select(`
        *,
        jobs(*)
      `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ favorites });
    } catch (error: any) {
        console.error("Get favorites error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch favorites" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId, jobId } = await req.json();

        if (!userId || !jobId) {
            return NextResponse.json(
                { error: "User ID and Job ID required" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("favorites")
            .insert({ user_id: userId, job_id: jobId })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: "Already favorited" },
                    { status: 409 }
                );
            }
            throw error;
        }

        return NextResponse.json({ success: true, favorite: data });
    } catch (error: any) {
        console.error("Add favorite error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to add favorite" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const jobId = searchParams.get("jobId");

        if (!userId || !jobId) {
            return NextResponse.json(
                { error: "User ID and Job ID required" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("favorites")
            .delete()
            .eq("user_id", userId)
            .eq("job_id", jobId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Remove favorite error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to remove favorite" },
            { status: 500 }
        );
    }
}
