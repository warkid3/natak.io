import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Get shared prompt by token (public access)
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const supabase = await createClient();
        const { token } = await params;

        const { data, error } = await supabase
            .from("saved_prompts")
            .select(`
                id,
                prompt,
                title,
                generation_type,
                tags,
                created_at,
                collection:prompt_collections(name, color)
            `)
            .eq("share_token", token)
            .eq("is_public", true)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: "Prompt not found or not shared" }, { status: 404 });
        }

        return NextResponse.json({ prompt: data });
    } catch (error: any) {
        console.error("GET /api/prompts/share/[token] error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
