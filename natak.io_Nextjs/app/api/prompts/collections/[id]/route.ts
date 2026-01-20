import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PUT: Update collection
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
        const { name, description, color } = body;

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (color !== undefined) updateData.color = color;

        const { data, error } = await supabase
            .from("prompt_collections")
            .update(updateData)
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ collection: data, message: "Collection updated" });
    } catch (error: any) {
        console.error("PUT /api/prompts/collections/[id] error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Delete collection
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
            .from("prompt_collections")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) throw error;

        return NextResponse.json({ message: "Collection deleted" });
    } catch (error: any) {
        console.error("DELETE /api/prompts/collections/[id] error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
