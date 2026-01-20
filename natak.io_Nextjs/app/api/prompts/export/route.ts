import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Export prompts as CSV
export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const collectionId = searchParams.get("collection_id");
        const ids = searchParams.get("ids"); // Comma-separated list of prompt IDs

        let query = supabase
            .from("saved_prompts")
            .select(`
                id,
                title,
                prompt,
                generation_type,
                tags,
                created_at,
                collection:prompt_collections(name)
            `)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        // Filter by specific IDs if provided (for multi-select export)
        if (ids) {
            const idArray = ids.split(',').filter(id => id.trim());
            if (idArray.length > 0) {
                query = query.in("id", idArray);
            }
        } else if (collectionId) {
            query = query.eq("collection_id", collectionId);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Convert to CSV
        const headers = ["ID", "Title", "Prompt", "Type", "Tags", "Collection", "Created At"];
        const csvRows = [headers.join(",")];

        data?.forEach((row: any) => {
            const csvRow = [
                row.id,
                `"${(row.title || "").replace(/"/g, '""')}"`,
                `"${(row.prompt || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`,
                row.generation_type || "",
                `"${(row.tags || []).join("; ")}"`,
                `"${row.collection?.name || "Uncategorized"}"`,
                new Date(row.created_at).toISOString()
            ];
            csvRows.push(csvRow.join(","));
        });

        const csvContent = csvRows.join("\n");

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="prompts_export_${new Date().toISOString().split("T")[0]}.csv"`
            }
        });
    } catch (error: any) {
        console.error("GET /api/prompts/export error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
