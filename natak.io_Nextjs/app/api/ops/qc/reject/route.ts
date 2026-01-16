import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const { jobId, reason } = await req.json();

        if (!jobId) {
            return NextResponse.json(
                { error: "Job ID required" },
                { status: 400 }
            );
        }

        // Fetch job
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

        // Verify job is completed and pending QC
        if (job.status !== "completed") {
            return NextResponse.json(
                { error: "Only completed jobs can be rejected" },
                { status: 400 }
            );
        }

        if (job.quality_status !== "pending") {
            return NextResponse.json(
                { error: "Job has already been reviewed" },
                { status: 400 }
            );
        }

        // Mark as rejected
        const { error: updateError } = await supabase
            .from("jobs")
            .update({
                quality_status: "rejected",
                feedback: reason || "Quality control rejection"
            })
            .eq("id", jobId);

        if (updateError) throw updateError;

        // Refund credits to user
        if (job.cost > 0 && job.user_id) {
            // Credit back the cost
            const { error: refundError } = await supabase
                .from("credits_ledger")
                .insert({
                    user_id: job.user_id,
                    type: "credit",
                    amount: Math.ceil(job.cost * 100), // Convert to credits (assuming 1 credit = $0.01)
                    description: `Refund for rejected job ${jobId}`
                });

            if (refundError) {
                console.error("Refund error:", refundError);
                // Don't fail the entire operation if refund fails
            } else {
                // Update user's credit balance
                await supabase.rpc("increment_credits", {
                    user_id: job.user_id,
                    amount: Math.ceil(job.cost * 100)
                });
            }
        }

        return NextResponse.json({
            success: true,
            message: "Job rejected and credits refunded",
            jobId,
            refundAmount: job.cost
        });

    } catch (error: any) {
        console.error("Rejection error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to reject job" },
            { status: 500 }
        );
    }
}
