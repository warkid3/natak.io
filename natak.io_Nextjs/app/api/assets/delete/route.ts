import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteFileFromR2 } from "@/lib/r2";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { assetIds } = body;

        if (!assetIds || !Array.isArray(assetIds) || assetIds.length === 0) {
            return NextResponse.json({ error: "No assets selected" }, { status: 400 });
        }

        console.log(`[Delete] Attempting to delete ${assetIds.length} assets`);

        // Use SERVICE ROLE key to bypass RLS policies for now
        const { createClient } = require('@supabase/supabase-js');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        if (!supabaseServiceKey) {
            console.error("[Delete] Missing SUPABASE_SERVICE_ROLE_KEY");
            throw new Error("Server misconfiguration: Missing Service Role Key");
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // 1. Fetch assets to get storage paths (if any)
        console.log("[Delete] Fetching asset details...");
        const { data: assets, error: fetchError } = await supabase
            .from('assets')
            .select('id, url')
            .in('id', assetIds);

        if (fetchError) {
            console.error("[Delete] DB Fetch Error:", fetchError);
            return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 });
        }

        // 2. Delete from R2 (derive key from URL)
        const deletePromises = assets.map(async (asset: any) => {
            let key = null;

            // URL format: https://pub-r2.natak.io/imports/filename.jpg
            if (asset.url) {
                try {
                    const urlObj = new URL(asset.url);
                    // Pathname starts with /, so slice(1) to get "imports/filename.jpg"
                    key = urlObj.pathname.slice(1);
                } catch (e) {
                    console.warn(`Could not parse URL for asset ${asset.id}`);
                }
            }

            if (key) {
                console.log(`[Delete] Deleting R2 object: ${key}`);
                await deleteFileFromR2(key);
            }
        });

        await Promise.all(deletePromises);

        // 3. Delete from Database
        console.log("[Delete] Deleting from DB...");
        const { error: deleteError } = await supabase
            .from('assets')
            .delete()
            .in('id', assetIds);

        if (deleteError) {
            console.error("[Delete] DB Delete Error:", deleteError);
            throw deleteError;
        }

        console.log("[Delete] Success!");
        return NextResponse.json({ success: true, count: assetIds.length });

    } catch (error: any) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
