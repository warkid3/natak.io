import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Get single prompt details
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const { id } = await params;

        const { data, error } = await supabase
            .from("saved_prompts")
            .select(`
                *,
                collection:prompt_collections(id, name, color)
            `)
            .eq("id", id)
            .single();

        if (error) throw error;

        // Check access rights
        if (data.user_id !== user?.id && !data.is_public) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ prompt: data });
    } catch (error: any) {
        console.error("GET /api/prompts/[id] error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT: Update prompt
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const { id } = await params;

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, collectionId, tags, isPublic } = body;

        const updateData: any = { updated_at: new Date().toISOString() };
        if (title !== undefined) updateData.title = title;
        if (collectionId !== undefined) updateData.collection_id = collectionId;
        if (tags !== undefined) updateData.tags = tags;
        if (isPublic !== undefined) updateData.is_public = isPublic;

        const { data, error } = await supabase
            .from("saved_prompts")
            .update(updateData)
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ prompt: data, message: "Prompt updated" });
    } catch (error: any) {
        console.error("PUT /api/prompts/[id] error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Delete prompt
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const { id } = await params;

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { error } = await supabase
            .from("saved_prompts")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) throw error;

        return NextResponse.json({ message: "Prompt deleted" });
    } catch (error: any) {
        console.error("DELETE /api/prompts/[id] error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
