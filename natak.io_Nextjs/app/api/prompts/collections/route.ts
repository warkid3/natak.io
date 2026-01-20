import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: List user's collections with prompt counts
export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get collections
        const { data: collections, error: colError } = await supabase
            .from("prompt_collections")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (colError) throw colError;

        // Get prompt counts per collection
        const { data: promptCounts, error: countError } = await supabase
            .from("saved_prompts")
            .select("collection_id")
            .eq("user_id", user.id);

        if (countError) throw countError;

        // Calculate counts
        const countMap: Record<string, number> = {};
        promptCounts?.forEach((p) => {
            if (p.collection_id) {
                countMap[p.collection_id] = (countMap[p.collection_id] || 0) + 1;
            }
        });

        const collectionsWithCounts = collections?.map((col) => ({
            ...col,
            prompt_count: countMap[col.id] || 0
        }));

        // Get total prompt count
        const totalPrompts = promptCounts?.length || 0;

        return NextResponse.json({
            collections: collectionsWithCounts,
            totalPrompts
        });
    } catch (error: any) {
        console.error("GET /api/prompts/collections error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Create new collection
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, description, color } = body;

        if (!name) {
            return NextResponse.json({ error: "Collection name is required" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("prompt_collections")
            .insert({
                user_id: user.id,
                name,
                description: description || null,
                color: color || "#ccff00"
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ collection: data, message: "Collection created" });
    } catch (error: any) {
        console.error("POST /api/prompts/collections error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
