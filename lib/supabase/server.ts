import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Supabase Env Vars in Server Client!");
        // Return a dummy client that mimics the Supabase interface but returns empty data or errors
        // This prevents the entire page from crashing (500) if keys are missing.
        const dummyClient = {
            from: () => ({
                select: () => ({
                    single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
                    order: () => Promise.resolve({ data: [], error: { message: "Supabase not configured" } }),
                    limit: () => Promise.resolve({ data: [], error: { message: "Supabase not configured" } }),
                    eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }) }),
                    insert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
                }),
                insert: () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } })
            }),
            auth: {
                getUser: () => Promise.resolve({ data: { user: null }, error: { message: "Supabase not configured" } }),
                exchangeCodeForSession: () => Promise.resolve({ data: { session: null }, error: { message: "Supabase not configured" } })
            }
        };
        // We assert this as any because mocking the full Supabase Type definition is complex
        return dummyClient as any;
    }

    return createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}
