import { requireAdmin } from '@/lib/auth/admin';
import { BlogPageClient } from '@/components/admin/BlogPageClient';

/**
 * Admin Blog Page - Server Component
 * Handles authentication before rendering the client component
 */
export default async function AdminBlogPage() {
    // CRITICAL SECURITY: Server-side authentication check
    await requireAdmin();

    // Render client component (all interactivity handled there)
    return <BlogPageClient />;
}
