'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export interface AuthResetResult {
    error?: string;
    success?: string;
}

export async function requestPasswordReset(prevState: AuthResetResult, formData: FormData): Promise<AuthResetResult> {
    const email = formData.get('email') as string;

    if (!email) {
        return { error: 'Email is required' };
    }

    // 1. Strict Admin Check
    // Only allow resets for the specified admin emails
    const allowedAdmins: string[] = [];
    if (process.env.ADMIN_EMAILS) {
        const envEmails = process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase());
        allowedAdmins.push(...envEmails);
    }

    // Connect to hardcoded list if needed as fallback or remove if purely env based
    // (Keeping empty if env is source of truth, or match middleware logic)
    if (allowedAdmins.length === 0) {
        // Fallback or just empty
        allowedAdmins.push('rundkhaled1995@gmail.com', 'aliaktarsimon@gmail.com');
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    if (!allowedAdmins.includes(normalizedEmail)) {
        // SECURITY: Return success even if blocked to prevent enumeration
        // We lie to the user here intentionally
        return { success: 'If an account exists for this email, a reset link has been sent.' };
    }

    const supabase = await createClient();
    const host = (await headers()).get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const origin = `${protocol}://${host}`;

    console.log('Sending reset link with redirect to:', `${origin}/auth/callback?next=/update-password`);

    // 2. Trigger Password Reset
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${origin}/auth/callback?next=/update-password`,
    });

    if (error) {
        console.error('Reset password error:', error);
        return { error: 'Could not send reset email. Please try again.' };
    }

    return { success: 'If an account exists for this email, a reset link has been sent.' };
}

export async function updatePassword(prevState: AuthResetResult, formData: FormData): Promise<AuthResetResult> {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!password || !confirmPassword) {
        return { error: 'Passwords are required' };
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' };
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        return { error: error.message };
    }

    redirect('/admin');
}
