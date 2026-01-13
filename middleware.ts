import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    let user = null;

    try {
        // Skip if Supabase keys are not configured to avoid dev crashes
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            console.warn("Middleware: Supabase keys missing, skipping user check.");
            return response
        }

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value }) =>
                            request.cookies.set(name, value)
                        )
                        response = NextResponse.next({
                            request: {
                                headers: request.headers,
                            },
                        })
                        cookiesToSet.forEach(({ name, value, options }) =>
                            response.cookies.set(name, value, options as any)
                        )
                    },
                },
            }
        )

        const { data } = await supabase.auth.getUser()
        user = data.user;

    } catch (e) {
        console.error("Middleware Supabase Error:", e);
        // On error, treat as not logged in and allow request to proceed (or standard handling)
        return response;
    }

    // Admin Route Protection with Email Whitelist
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Get list of admin emails from Environment Variables
        const adminEmails: string[] = [];

        if (process.env.ADMIN_EMAILS) {
            const envEmails = process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase());
            adminEmails.push(...envEmails);
        }

        // Log access attempt for debugging
        console.log(`[Middleware] Admin Check: User='${user.email}'`);
        console.log(`[Middleware] Raw Env='${process.env.ADMIN_EMAILS}'`);
        console.log(`[Middleware] Parsed Allowed List=${JSON.stringify(adminEmails)}`);

        const isAuthorized = user.email && adminEmails.includes(user.email.toLowerCase());
        console.log(`[Middleware] Authorized=${isAuthorized}`);

        // Check if user email is in admin list
        if (!isAuthorized) {
            // Return 404 to hide the existence of admin routes
            return NextResponse.redirect(new URL('/404', request.url));
        }
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
