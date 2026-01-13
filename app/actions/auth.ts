'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export interface LoginResult {
    error?: string;
    success?: boolean;
}

export async function loginAction(prevState: LoginResult, formData: FormData): Promise<LoginResult> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    const supabase = await createClient();

    // 1. Get IP Address
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    // 2. Check Rate Limit (via Database RPC)
    try {
        const { data: limitResult, error: limitError } = await supabase
            .rpc('check_rate_limit', { check_ip: ip });

        if (limitError) {
            console.error('Rate limit check failed:', limitError);
            // FAIL OPEN: Allow login even if rate limiting fails
            return { error: 'Security check failed. Please try again later.' };
        }

        // Handle rate limit response
        if (limitResult && !limitResult.allowed) {
            const blockedUntil = new Date(limitResult.blocked_until).toLocaleTimeString();
            return {
                error: `Too many login attempts. Please try again after ${blockedUntil}.`
            };
        }
    } catch (e) {
        console.error('Rate limit critical error:', e);
        // Fallback: If DB rate limiting fails, we shouldn't block valid logins completely, 
        // but for high security admin, maybe we should.
        // For now, let's allow but log error to avoid locking out admins if DB has issues.
    }

    // 3. Attempt Login
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        // Generic error message to prevent account enumeration
        return { error: 'Invalid email or password. Please try again.' };
    }

    // 4. Success - Redirect handled by the calling page or here?
    // In Server Actions, redirect() throws an error, so usually we return success 
    // and let client redirect, OR just call redirect() here which ends execution.
    redirect('/admin');
}
