import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/admin';

    if (code) {
        try {
            const supabase = await createClient();
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (!error) {
                return NextResponse.redirect(`${origin}${next}`);
            }
        } catch (err) {
            console.error("Auth Callback Error:", err);
            // Fall through to error redirect
        }
    }

    // return the user to login page with error
    return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
