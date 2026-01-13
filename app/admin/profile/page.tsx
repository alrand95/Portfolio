import { requireAdmin } from '@/lib/auth/admin';
import { ProfilePageClient } from '@/components/admin/ProfilePageClient';

/**
 * Admin Profile Page - Server Component
 * Handles authentication before rendering the client component
 */
export default async function AdminProfilePage() {
    // CRITICAL SECURITY: Server-side authentication check
    await requireAdmin();

    // Render client component (all interactivity handled there)
    return <ProfilePageClient />;
}
