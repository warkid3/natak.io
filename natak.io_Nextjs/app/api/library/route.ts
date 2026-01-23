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

        const userId = user.id;
        const filter = searchParams.get("filter") || "all"; // all, favorites, collection
        const collectionId = searchParams.get("collectionId");

        let query = supabase
            .from("jobs")
            .select(`
        *,
        characters(name, trigger_word),
        favorites!left(id)
      `)
            .eq("user_id", userId)
            .eq("status", "completed")
            .eq("quality_status", "approved")
            .order("created_at", { ascending: false });

        // Apply filters
        if (filter === "favorites") {
            query = query.not("favorites", "is", null);
        } else if (filter === "collection" && collectionId) {
            // Get jobs in specific collection
            const { data: collectionItems } = await supabase
                .from("collection_items")
                .select("job_id")
                .eq("collection_id", collectionId);

            const jobIds = collectionItems?.map(item => item.job_id) || [];
            if (jobIds.length > 0) {
                query = query.in("id", jobIds);
            } else {
                // No items in collection
                return NextResponse.json({ outputs: [] });
            }
        }

        const { data: outputs, error } = await query;

        if (error) throw error;

        // Transform to include isFavorited flag
        const transformedOutputs = outputs?.map(output => ({
            ...output,
            character_name: output.characters?.name || "Unknown",
            isFavorited: output.favorites && output.favorites.length > 0
        })) || [];

        return NextResponse.json({ outputs: transformedOutputs });
    } catch (error: any) {
        console.error("Get library error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch library" },
            { status: 500 }
        );
    }
}
