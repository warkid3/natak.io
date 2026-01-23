import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const type = requestUrl.searchParams.get('type')
    const origin = requestUrl.origin

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error('[AUTH CALLBACK] Session exchange error:', error.message)
            return NextResponse.redirect(`${origin}/login?error=auth_failed`)
        }

        // Handle password recovery flow
        if (type === 'recovery') {
            console.log('[AUTH CALLBACK] Password recovery flow detected')
            return NextResponse.redirect(`${origin}/reset-password`)
        }

        // Get user's profile to check onboarding status
        if (data?.user) {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('onboarding_status')
                .eq('id', data.user.id)
                .single()

            if (profileError) {
                console.error('[AUTH CALLBACK] Profile fetch error:', profileError.message)
                // Profile might not exist yet for new users - send to onboarding
                return NextResponse.redirect(`${origin}/onboarding`)
            }

            // Check onboarding status
            const status = profile?.onboarding_status

            if (!status || status === 'org_selection' || status === 'org_details' || status === 'marketing' || status === 'pricing') {
                console.log('[AUTH CALLBACK] Incomplete onboarding, redirecting. Status:', status)
                return NextResponse.redirect(`${origin}/onboarding`)
            }

            // Onboarding complete - go to main app
            console.log('[AUTH CALLBACK] Onboarding complete, redirecting to assets')
            return NextResponse.redirect(`${origin}/assets`)
        }
    }

    // Fallback - no code provided
    console.log('[AUTH CALLBACK] No code provided, redirecting to login')
    return NextResponse.redirect(`${origin}/login`)
}
