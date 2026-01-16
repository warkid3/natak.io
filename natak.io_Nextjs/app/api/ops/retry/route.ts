import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { PipelineStep } from "@/types/operations";

export async function POST(req: NextRequest) {
    try {
        const { jobId } = await req.json();

        if (!jobId) {
            return NextResponse.json(
                { error: "Job ID required" },
                { status: 400 }
            );
        }

        // Fetch current job state
        const { data: job, error: fetchError } = await supabase
            .from("jobs")
            .select("*")
            .eq("id", jobId)
            .single();

        if (fetchError || !job) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        if (job.status !== "failed") {
            return NextResponse.json(
                { error: "Only failed jobs can be retried" },
                { status: 400 }
            );
        }

        // Reset to the failed step and mark as queued
        const { error: updateError } = await supabase
            .from("jobs")
            .update({
                status: "queued",
                retry_count: (job.retry_count || 0) + 1,
                error: null
            })
            .eq("id", jobId);

        if (updateError) throw updateError;

        // TODO: Re-trigger the generation service
        // This would typically involve calling processGenerationJob again
        // For now, just mark as queued and the background worker will pick it up

        return NextResponse.json({
            success: true,
            message: "Job queued for retry",
            jobId,
            retryCount: (job.retry_count || 0) + 1
        });

    } catch (error: any) {
        console.error("Retry error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to retry job" },
            { status: 500 }
        );
    }
}
