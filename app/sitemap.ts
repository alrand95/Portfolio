import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.alrund.space';

    const routes = [
        '',
        '/gallery',
        '/cv',
        '/contact',
        '/blog'
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Static pages entries for both English and Arabic
    for (const route of routes) {
        sitemapEntries.push({
            url: `${baseUrl}${route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: route === '' ? 1.0 : 0.8,
        });
        sitemapEntries.push({
            url: `${baseUrl}${route}?lang=ar`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: route === '' ? 1.0 : 0.8,
        });
    }

    try {
        const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
        
        const { data: posts } = await supabase
            .from('blog_posts')
            .select('slug, published_at')
            .not('published_at', 'is', null);

        if (posts) {
            for (const post of posts) {
                const postUrl = `${baseUrl}/blog/${post.slug}`;
                sitemapEntries.push({
                    url: postUrl,
                    lastModified: new Date(post.published_at),
                    changeFrequency: 'monthly',
                    priority: 0.6,
                });
                sitemapEntries.push({
                    url: `${postUrl}?lang=ar`,
                    lastModified: new Date(post.published_at),
                    changeFrequency: 'monthly',
                    priority: 0.6,
                });
            }
        }
    } catch (e) {
        console.error("Failed to generate blog routes for sitemap:", e);
    }

    return sitemapEntries;
}
