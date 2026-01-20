import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

// POST: Verify API key
export async function POST(req: NextRequest) {
    try {
        const apiKey = req.headers.get("x-api-key");

        if (!apiKey) {
            return NextResponse.json(
                { error: "Missing API key" },
                { status: 401, headers: corsHeaders() }
            );
        }

        // Validate format: nk_[something]_[something]
        const parts = apiKey.split('_');
        if (parts.length < 3 || parts[0] !== 'nk') {
            return NextResponse.json(
                { error: "Invalid API key format. Must allow 'nk_...'" },
                { status: 401, headers: corsHeaders() }
            );
        }

        // Mock successful auth
        return NextResponse.json({
            success: true,
            user: {
                id: "user_123",
                email: "operator@natak.io",
                tier: "Agency"
            }
        }, { headers: corsHeaders() });

    } catch (error: any) {
        console.error("Auth error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500, headers: corsHeaders() }
        );
    }
}
