import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {

    // Handle CORS for extension
    if (request.nextUrl.pathname.startsWith('/api/extension')) {
        if (request.method === 'OPTIONS') {
            return new NextResponse('ok', {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
                },
            })
        }
    }

    // CORS headers for actual responses are handled in the route, 
    // OR we could add them here to the response. 
    // But for now let's just fix the preflight.

    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
