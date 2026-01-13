import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase Environment Variables Missing in Client!");
        // Return a broken client that logs errors instead of crashing immediately on init
        // This allows the page to render, though dynamic features will fail.
        return createBrowserClient("https://placeholder.supabase.co", "placeholder", {
            global: {
                fetch: () => {
                    return Promise.reject(new Error("Supabase not configured"));
                }
            }
        });
    }

    return createBrowserClient(supabaseUrl, supabaseKey);
}
