import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const { collectionId, jobId } = await req.json();

        if (!collectionId || !jobId) {
            return NextResponse.json(
                { error: "Collection ID and Job ID required" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("collection_items")
            .insert({ collection_id: collectionId, job_id: jobId })
            .select()
            .single();

        if (error) {
            // Handle unique constraint violation
            if (error.code === '23505') {
                return NextResponse.json(
                    { error: "Item already in collection" },
                    { status: 409 }
                );
            }
            throw error;
        }

        return NextResponse.json({ success: true, item: data });
    } catch (error: any) {
        console.error("Add to collection error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to add to collection" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const collectionId = searchParams.get("collectionId");
        const jobId = searchParams.get("jobId");

        if (!collectionId || !jobId) {
            return NextResponse.json(
                { error: "Collection ID and Job ID required" },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from("collection_items")
            .delete()
            .eq("collection_id", collectionId)
            .eq("job_id", jobId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Remove from collection error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to remove from collection" },
            { status: 500 }
        );
    }
}
