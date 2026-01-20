import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { processGenerationJob } from "@/services/generationService";
import { creditService } from "@/services/creditService";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { characterId, prompt, userId } = body; // Simplified
        const user_id = userId || "00000000-0000-0000-0000-000000000000";

        // 0. Permission Check
        const { allowed, error: permitError } = await creditService.checkPermissions(user_id, body);
        if (!allowed) {
            return NextResponse.json({ error: permitError }, { status: 403 });
        }

        // 1. Calculate Cost & Check Balance
        const cost = creditService.calculateCost(body);
        const hasBalance = await creditService.checkBalance(user_id, cost);

        if (!hasBalance) {
            return NextResponse.json(
                { error: "Insufficient credits", cost, required: cost },
                { status: 402 } // Payment Required
            );
        }

        // 2. Create Job Record
        const { data: job, error } = await supabase.from("jobs").insert([{
            user_id: user_id,
            character_id: characterId,
            status: "queued",
            prompt: prompt, // Initial prompt
            config: body,   // Store full config
            prompting_model: body.useGrok ? "xAI Grok Beta" : "None",
            image_model: body.imageModel || "Z-Image Turbo",
            video_model: body.generateVideo ? (body.video_model || "LTX-2") : null,
            cost: cost // Record estimated cost
        }]).select().single();

        if (error) throw new Error(error.message);

        // 3. Deduct Credits
        try {
            await creditService.deductCredits(user_id, cost, "generation_job", { jobId: job.id });
        } catch (creditError: any) {
            // Rollback job creation if deduction fails (or just fail job)
            await supabase.from("jobs").delete().eq("id", job.id);
            return NextResponse.json({ error: creditError.message }, { status: 402 });
        }

        // 4. Trigger Processing
        await processGenerationJob(job.id, job.user_id, body);

        return NextResponse.json({ jobId: job.id, status: "processing" });

    } catch (error: any) {
        console.error("Generate API Error", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
