import { createClient } from '@/lib/supabase/server';
import { BlogPageClient } from '@/components/blog/BlogPageClient';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
    const params = await searchParams;
    const cookieStore = await cookies();
    const cookieLang = cookieStore.get('bunny-lang')?.value;
    const lang = params.lang || cookieLang || 'en';

    if (lang === 'ar') {
        return {
            title: 'المدونة والملخصات الإبداعية | رند البخيت',
            description: 'مقالات، دروس وتجارب في مجالات التصميم الجرافيكي، تصميم الشعارات، الهويات البصرية، والتسويق الرقمي.',
            alternates: {
                canonical: 'https://www.alrund.space/blog?lang=ar',
            },
            openGraph: {
                title: 'مدونة رند البخيت | مصممة جرافيك',
                description: 'أفكار ونصائح في تصميم العلامات التجارية والوسائط الإبداعية.',
                url: 'https://www.alrund.space/blog?lang=ar',
                locale: 'ar_JO',
            }
        };
    }

    return {
        title: 'Design Diary & Creative Brainwaves | Rand Albakhet',
        description: 'Read the professional design blog of Rand Albakhet. Insights on graphic design trends, branding design tutorials, UI/UX tips, and visual identity updates.',
        alternates: {
            canonical: 'https://www.alrund.space/blog',
        },
        openGraph: {
            title: 'Design Diary & Creative Brainwaves | Rand Albakhet',
            description: 'Insights, design guides, and tutorials from a senior branding and packaging designer.',
            url: 'https://www.alrund.space/blog',
            locale: 'en_US',
        }
    };
}

export default async function BlogPage() {
    const supabase = await createClient();

    // Fetch published posts on the server
    const { data: postsData } = await supabase
        .from('blog_posts')
        .select('*')
        .not('published_at', 'is', null)
        .order('is_pinned', { ascending: false })
        .order('published_at', { ascending: false });

    const posts = postsData || [];

    return (
        <BlogPageClient initialPosts={posts} />
    );
}
