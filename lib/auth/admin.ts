import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Get list of admin emails
 * Supports both environment variable (comma-separated) and hardcoded fallback
 * Hidden admin: aliaktarsimon@gmail.com (not exposed in public code)
 */
function getAdminEmails(): string[] {
    const adminEmails = [
        'rundkhaled1995@gmail.com',
        'aliaktarsimon@gmail.com'  // Secondary admin (hidden)
    ];

    // Append emails from environment variable if present
    if (process.env.ADMIN_EMAILS) {
        const envEmails = process.env.ADMIN_EMAILS.split(',').map(email => email.trim());
        adminEmails.push(...envEmails);
    }

    // Return unique list
    return Array.from(new Set(adminEmails));
}

/**
 * Check if email is an admin
 */
function isAdmin(email: string | undefined): boolean {
    if (!email) return false;
    const adminEmails = getAdminEmails();
    return adminEmails.includes(email.toLowerCase());
}

/**
 * CRITICAL SECURITY: Server-side admin authentication check
 * This function MUST be called at the top of every admin page (Server Component)
 * to prevent unauthorized access.
 * 
 * @returns The authenticated admin user
 * @throws Redirects to /login if not authenticated or not admin
 */
export async function requireAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is authenticated
    if (!user) {
        redirect('/login');
    }

    // Verify user is admin
    if (!isAdmin(user.email)) {
        // Return 404 to hide admin route existence
        redirect('/404');
    }

    return user;
}

/**
 * Get admin email list (for RLS policies, etc.)
 * @returns Array of admin emails
 */
export function getAdminEmailList(): string[] {
    return getAdminEmails();
}
