import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const { jobId } = await req.json();

        if (!jobId) {
            return NextResponse.json(
                { error: "Job ID required" },
                { status: 400 }
            );
        }

        // Fetch job
        const { data: job, error: fetchError } = await supabase
            .from("jobs")
            .select("*, characters(*)")
            .eq("id", jobId)
            .single();

        if (fetchError || !job) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        // Verify job is completed and pending QC
        if (job.status !== "completed") {
            return NextResponse.json(
                { error: "Only completed jobs can be approved" },
                { status: 400 }
            );
        }

        if (job.quality_status !== "pending") {
            return NextResponse.json(
                { error: "Job has already been reviewed" },
                { status: 400 }
            );
        }

        // Mark as approved
        const { error: updateError } = await supabase
            .from("jobs")
            .update({
                quality_status: "approved"
            })
            .eq("id", jobId);

        if (updateError) throw updateError;

        return NextResponse.json({
            success: true,
            message: "Job approved",
            jobId
        });

    } catch (error: any) {
        console.error("Approval error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to approve job" },
            { status: 500 }
        );
    }
}
