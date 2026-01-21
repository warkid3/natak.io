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

        const { data: collections, error } = await supabase
            .from("collections")
            .select(`
        *,
        collection_items(count)
      `)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return NextResponse.json({ collections });
    } catch (error: any) {
        console.error("Get collections error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch collections" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const { name, description } = await req.json();

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!name) {
            return NextResponse.json(
                { error: "Name required" },
                { status: 400 }
            );
        }

        const { data: collection, error } = await supabase
            .from("collections")
            .insert({ user_id: user.id, name, description })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ collection });
    } catch (error: any) {
        console.error("Create collection error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create collection" },
            { status: 500 }
        );
    }
}
