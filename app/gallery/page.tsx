import { createClient } from '@/lib/supabase/server';
import { GalleryPageClient } from '@/components/gallery/GalleryPageClient';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
    const params = await searchParams;
    const cookieStore = await cookies();
    const cookieLang = cookieStore.get('bunny-lang')?.value;
    const lang = params.lang || cookieLang || 'en';

    if (lang === 'ar') {
        return {
            title: 'معرض التصميم الجرافيكي والأعمال | رند البخيت',
            description: 'تصفح الأعمال الفنية وتصميمات التغليف والهويات البصرية للمصممة رند البخيت. مهارات احترافية وخبرة إبداعية متكاملة.',
            alternates: {
                canonical: 'https://www.alrund.space/gallery?lang=ar',
            },
            openGraph: {
                title: 'معرض الأعمال الإبداعية | رند البخيت',
                description: 'تصميم جرافيكي، شعارات، هويات تجارية وتغليف منتجات.',
                url: 'https://www.alrund.space/gallery?lang=ar',
                locale: 'ar_JO',
            }
        };
    }

    return {
        title: 'Creative Design & Branding Portfolio | Rand Albakhet',
        description: 'Explore the design showcase of Rand Albakhet. Featuring premium projects in packaging design, branding identity, UI/UX designs, and marketing assets.',
        alternates: {
            canonical: 'https://www.alrund.space/gallery',
        },
        openGraph: {
            title: 'Creative Design & Branding Portfolio | Rand Albakhet',
            description: 'A curated selection of packaging, visual identity, and graphic design projects.',
            url: 'https://www.alrund.space/gallery',
            locale: 'en_US',
        }
    };
}

export default async function GalleryPage() {
    const supabase = await createClient();

    // Fetch gallery items on the server
    const { data: galleryItems } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

    const items = galleryItems || [];

    // Create a structured data list of portfolio works
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: 'Rand Albakhet Graphic Design Portfolio',
        author: {
            '@type': 'Person',
            name: 'Rand Albakhet'
        },
        description: 'Creative graphic design, branding, and packaging designs.',
        hasPart: items.map((item: any) => ({
            '@type': 'CreativeWork',
            name: item.caption || 'Design Piece',
            image: item.image_url,
            keywords: item.tags?.join(', ') || ''
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <GalleryPageClient initialItems={items} />
        </>
    );
}
