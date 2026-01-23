import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Filter parameters
        const filter = searchParams.get("filter") || "all"; // all, processing, failed, qc_required, stuck
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");

        let query = supabase
            .from("jobs")
            .select(`
                *,
                characters (
                    name,
                    trigger_word
                )
            `)
            .eq("user_id", user.id) // Enforce ownership
            .order("created_at", { ascending: false });

        // Apply filters
        switch (filter) {
            case "processing":
                query = query.eq("status", "processing");
                break;
            case "failed":
                query = query.eq("status", "failed");
                break;
            case "qc_required":
            case "qc required":
                query = query
                    .eq("status", "completed")
                    .eq("quality_status", "pending");
                break;
            case "stuck":
                // Jobs stuck for > 10 minutes
                const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
                query = query
                    .eq("status", "processing")
                    .lt("created_at", tenMinutesAgo);
                break;
            case "all jobs":
            case "all":
            default:
                // No additional filter
                break;
        }

        // Pagination
        query = query.range(offset, offset + limit - 1);

        const { data: jobs, error } = await query;

        if (error) throw error;

        // Transform data to match OperationsJob interface
        const transformedJobs = jobs?.map(job => ({
            ...job,
            character_name: job.characters?.name || "Unknown",
            format: job.config?.generateVideo ? "Video" : "Photo",
        })) || [];

        return NextResponse.json({
            jobs: transformedJobs,
            count: jobs?.length || 0,
            hasMore: jobs?.length === limit
        });

    } catch (error: any) {
        console.error("Queue fetch error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch queue" },
            { status: 500 }
        );
    }
}
