import { createClient } from '@/lib/supabase/server';
import { AboutPageClient } from '@/components/about/AboutPageClient';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
    const params = await searchParams;
    const cookieStore = await cookies();
    const cookieLang = cookieStore.get('bunny-lang')?.value;
    const lang = params.lang || cookieLang || 'en';

    if (lang === 'ar') {
        return {
            title: 'السيرة الذاتية والخبرات المهنية | رند البخيت',
            description: 'السيرة المهنية للمصممة رند البخيت، رئيسة قسم التصميم والتغليف مع خبرة 6+ سنوات. تفاصيل المهارات، الهوية البصرية، والتعليم.',
            alternates: {
                canonical: 'https://www.alrund.space/cv?lang=ar',
            },
            openGraph: {
                title: 'السيرة المهنية | رند البخيت',
                description: 'مهارات التصميم، الخبرات، والمسار المهني باللغتين العربية والإنجليزية.',
                url: 'https://www.alrund.space/cv?lang=ar',
                locale: 'ar_JO',
            }
        };
    }

    return {
        title: 'Resume & Career Journey | Rand Albakhet',
        description: 'Professional CV and experience timeline of Rand Albakhet, Head of Label & Packaging and Senior Graphic Designer. Specialized in branding, packaging, and visual identity.',
        alternates: {
            canonical: 'https://www.alrund.space/cv',
        },
        openGraph: {
            title: 'Resume & Career Journey | Rand Albakhet',
            description: '6+ years of graphic design experience in branding, UI/UX, and marketing.',
            url: 'https://www.alrund.space/cv',
            locale: 'en_US',
        }
    };
}

export default async function CVPage() {
    const supabase = await createClient();

    // Fetch all data in parallel on the server
    const [
        { data: profileData },
        { data: expData },
        { data: skillData },
        { data: socialData }
    ] = await Promise.all([
        supabase.from('profile_settings').select('*').single(),
        supabase.from('experience_timeline').select('*').order('sort_order', { ascending: true }),
        supabase.from('skills').select('*').order('created_at', { ascending: true }),
        supabase.from('social_links').select('*')
    ]);

    return (
        <AboutPageClient
            profile={profileData || {}}
            experience={expData || []}
            skills={skillData || []}
            socials={socialData || []}
        />
    );
}
