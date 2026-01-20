import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: List user's prompts with optional filters
export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const collectionId = searchParams.get("collection_id");
        const generationType = searchParams.get("generation_type");
        const search = searchParams.get("search");

        let query = supabase
            .from("saved_prompts")
            .select(`
                *,
                collection:prompt_collections(id, name, color)
            `)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (collectionId) {
            query = query.eq("collection_id", collectionId);
        }

        if (generationType) {
            query = query.eq("generation_type", generationType);
        }

        if (search) {
            query = query.or(`prompt.ilike.%${search}%,title.ilike.%${search}%`);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({ prompts: data });
    } catch (error: any) {
        console.error("GET /api/prompts error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Save a new prompt
export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { prompt, title, collectionId, generationType, sourceJobId, modelConfig, tags } = body;

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // Generate share token
        const shareToken = crypto.randomUUID().replace(/-/g, "").slice(0, 12);

        const { data, error } = await supabase
            .from("saved_prompts")
            .insert({
                user_id: user.id,
                prompt,
                title: title || `Prompt ${new Date().toLocaleDateString()}`,
                collection_id: collectionId || null,
                generation_type: generationType || "image",
                source_job_id: sourceJobId || null,
                model_config: modelConfig || null,
                tags: tags || [],
                share_token: shareToken
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ prompt: data, message: "Prompt saved successfully" });
    } catch (error: any) {
        console.error("POST /api/prompts error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
