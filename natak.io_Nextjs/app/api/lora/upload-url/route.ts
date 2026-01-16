import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/r2";

export async function POST(req: NextRequest) {
    try {
        const { filename, contentType } = await req.json();
        if (!filename || !contentType) {
            return NextResponse.json({ error: "Filename and content type required" }, { status: 400 });
        }

        const key = `lora-datasets/${Date.now()}-${filename.replace(/\s+/g, "-")}`;
        const url = await getPresignedUploadUrl(key, contentType);

        return NextResponse.json({ url, key });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
