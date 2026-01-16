import { NextRequest, NextResponse } from "next/server";
import { trainLoRA } from "@/services/loraService";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
    try {
        const { name, triggerWord, imageKeys, userId } = await req.json();

        // In a real app, verify user session here.
        // const { data: { user }, error } = await supabase.auth.getUser();
        // if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const effectiveUserId = userId || "00000000-0000-0000-0000-000000000000"; // Fallback for dev

        if (!name || !triggerWord || !imageKeys) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (imageKeys.length < 20 || imageKeys.length > 30) {
            return NextResponse.json({ error: "Image count must be between 20 and 30" }, { status: 400 });
        }

        const r2Public = process.env.NEXT_PUBLIC_R2_DOMAIN || "https://assets.natak.io";
        // Ensure NEXT_PUBLIC_R2_DOMAIN is set in env

        const imageUrls = imageKeys.map((key: string) => `${r2Public}/${key}`);

        const result = await trainLoRA(effectiveUserId, name, triggerWord, imageUrls);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Training Trigger Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
