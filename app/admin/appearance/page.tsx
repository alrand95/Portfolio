import { requireAdmin } from '@/lib/auth/admin';
import { AppearancePageClient } from '@/components/admin/AppearancePageClient';

/**
 * Admin Appearance Page - Server Component
 * Handles authentication before rendering the client component
 */
export default async function AdminAppearancePage() {
    // CRITICAL SECURITY: Server-side authentication check
    await requireAdmin();

    // Render client component (all interactivity handled there)
    return <AppearancePageClient />;
}
