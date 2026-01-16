import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        // Get user settings
        let { data: settings, error } = await supabase
            .from("user_settings")
            .select("*")
            .eq("user_id", userId)
            .single();

        // If no settings exist, create defaults
        if (error && error.code === 'PGRST116') {
            const { data: newSettings, error: insertError } = await supabase
                .from("user_settings")
                .insert({ user_id: userId })
                .select()
                .single();

            if (insertError) throw insertError;
            settings = newSettings;
        } else if (error) {
            throw error;
        }

        // Get profile data
        const { data: profile } = await supabase
            .from("profiles")
            .select("name, email, avatar_url, timezone, theme, role")
            .eq("id", userId)
            .single();

        return NextResponse.json({
            profile: profile || {},
            settings: settings || {}
        });
    } catch (error: any) {
        console.error("Get settings error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch settings" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { userId, profile, settings } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        // Update profile if provided
        if (profile) {
            const { error: profileError } = await supabase
                .from("profiles")
                .update({
                    name: profile.name,
                    avatar_url: profile.avatar_url,
                    timezone: profile.timezone,
                    theme: profile.theme
                })
                .eq("id", userId);

            if (profileError) throw profileError;
        }

        // Update settings if provided
        if (settings) {
            const { error: settingsError } = await supabase
                .from("user_settings")
                .upsert({
                    user_id: userId,
                    notifications: settings.notifications,
                    workflow_defaults: settings.workflow_defaults,
                    accessibility: settings.accessibility,
                    updated_at: new Date().toISOString()
                })
                .eq("user_id", userId);

            if (settingsError) throw settingsError;
        }

        // Log the change
        await supabase.from("audit_logs").insert({
            user_id: userId,
            action: "update",
            resource_type: "settings",
            resource_id: userId,
            details: { profile: !!profile, settings: !!settings }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Update settings error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update settings" },
            { status: 500 }
        );
    }
}
