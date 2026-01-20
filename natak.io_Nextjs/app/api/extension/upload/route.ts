import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadFileToR2 } from "@/lib/r2";

// Helper for CORS headers
function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key'
    };
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders() });
}

// POST: Upload media from extension
export async function POST(req: NextRequest) {
    try {
        const apiKey = req.headers.get("x-api-key");

        if (!apiKey) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401, headers: corsHeaders() }
            );
        }

        // TODO: In production, resolve API key to real user
        // For now, use the same Test User ID as the frontend to ensure visibility
        const TEST_USER_ID = "cceb1f9e-0dde-458d-a010-282cdf34e805";

        const body = await req.json();
        const { url, type, source } = body;

        if (!url) {
            return NextResponse.json(
                { error: "Missing media URL" },
                { status: 400, headers: corsHeaders() }
            );
        }

        // Use SERVICE ROLE key to bypass RLS since we are validating via API Key
        // We cannot use the cookie-based client here
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Download the file from the URL with browser-like headers
        console.log(`[Extension] Downloading from ${source}: ${url}`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': source === 'instagram' ? 'https://www.instagram.com/' : 'https://www.pinterest.com/'
            }
        });
        if (!response.ok) throw new Error(`Failed to fetch media from ${source}: ${response.status} ${response.statusText}`);

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Generate filename
        const timestamp = Date.now();
        const ext = type === 'video' ? 'mp4' : 'jpg';
        const filename = `${source}_${timestamp}.${ext}`;
        const key = `imports/${filename}`;

        // 3. Upload to R2 (Cloudflare)
        console.log(`[Extension] Uploading to R2: ${key}`);
        const publicUrl = await uploadFileToR2(key, buffer, type === 'video' ? 'video/mp4' : 'image/jpeg');

        if (!publicUrl) {
            throw new Error("Failed to upload to R2");
        }

        // 4. Insert into Supabase Assets Table (Asset DAM)
        // using service role client to bypass RLS
        const { data: assetData, error: dbError } = await supabase
            .from('assets')
            .insert({
                user_id: TEST_USER_ID,
                url: publicUrl,
                type: type === 'video' ? 'video' : 'image',
                source: 'scraped', // or 'upload'
                caption: `Imported from ${source}`,
                collection: 'imports' // optional
            })
            .select()
            .single();

        if (dbError) {
            console.error("DB Insert error:", dbError);
            throw new Error(`Failed to save to database: ${dbError.message}`);
        }

        return NextResponse.json({
            success: true,
            asset: assetData
        }, { headers: corsHeaders() });

    } catch (error: any) {
        console.error("Extension upload error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500, headers: corsHeaders() }
        );
    }
}
