import { createClient } from '@/lib/supabase/server';
import { BlogPostClient } from '@/components/blog/BlogPostClient';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
    const supabase = await createClient();

    // Fetch post by slug
    let { data: post } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

    // Fallback search by ID
    if (!post) {
        const { data: idPost } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', slug)
            .single();
        post = idPost;
    }

    return post;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const post = await getPost(resolvedParams.slug);

    if (!post) {
        return {
            title: 'Memory Not Found | Rand Albakhet Blog',
            description: 'This blog post could not be found in the portfolio archives.'
        };
    }

    const title = `${post.title} | Rand Albakhet Design Blog`;
    const description = post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : '');
    const canonical = `https://www.alrund.space/blog/${resolvedParams.slug}`;

    return {
        title,
        description,
        alternates: {
            canonical
        },
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime: post.published_at,
            authors: ['Rand Albakhet'],
            url: canonical,
            images: post.image_url ? [{ url: post.image_url }] : [],
            locale: 'en_US'
        }
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const resolvedParams = await params;
    const post = await getPost(resolvedParams.slug);

    if (!post) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || '',
        image: post.image_url ? [post.image_url] : [],
        datePublished: post.published_at,
        dateModified: post.updated_at || post.published_at,
        author: {
            '@type': 'Person',
            name: 'Rand Albakhet',
            url: 'https://www.alrund.space/'
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogPostClient post={post} />
        </>
    );
}
