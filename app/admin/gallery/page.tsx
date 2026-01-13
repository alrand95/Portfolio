import { requireAdmin } from '@/lib/auth/admin';
import { GalleryPageClient } from '@/components/admin/GalleryPageClient';

/**
 * Admin Gallery Page - Server Component
 * Handles authentication before rendering the client component
 */
export default async function AdminGalleryPage() {
    // CRITICAL SECURITY: Server-side authentication check
    await requireAdmin();

    // Render client component (all interactivity handled there)
    return <GalleryPageClient />;
}
