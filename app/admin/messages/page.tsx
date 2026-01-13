import { requireAdmin } from '@/lib/auth/admin';
import { MessagesPageClient } from '@/components/admin/MessagesPageClient';

/**
 * Admin Messages Page - Server Component
 * Handles authentication before rendering the client component
 */
export default async function MessagesPage() {
    // CRITICAL SECURITY: Server-side authentication check
    await requireAdmin();

    // Render client component (all interactivity handled there)
    return <MessagesPageClient />;
}
