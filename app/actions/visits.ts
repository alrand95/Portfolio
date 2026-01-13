'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

export async function recordVisit() {
    const supabase = await createClient();
    const headersList = await headers();

    // Extract IP
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Simple validation
    if (ip === 'unknown') return;

    // Check for existing visit in the last hour to prevent spamming
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: existingVisit } = await supabase
        .from('site_visits')
        .select('id')
        .eq('ip_address', ip)
        .gte('visited_at', oneHourAgo)
        .single();

    if (existingVisit) {
        return; // Already counted recently
    }

    // Insert new visit
    await supabase.from('site_visits').insert({
        ip_address: ip,
        user_agent: userAgent
    });
}
