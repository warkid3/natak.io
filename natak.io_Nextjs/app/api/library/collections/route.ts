import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const { data: collections, error } = await supabase
            .from("collections")
            .select(`
        *,
        collection_items(count)
      `)
            .eq("user_id", userId)
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
        const { userId, name, description } = await req.json();

        if (!userId || !name) {
            return NextResponse.json(
                { error: "User ID and name required" },
                { status: 400 }
            );
        }

        const { data: collection, error } = await supabase
            .from("collections")
            .insert({ user_id: userId, name, description })
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
