import { createClient } from '@/lib/supabase/server';
import { ContactPageClient } from '@/components/contact/ContactPageClient';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ lang?: string }> }): Promise<Metadata> {
    const params = await searchParams;
    const cookieStore = await cookies();
    const cookieLang = cookieStore.get('bunny-lang')?.value;
    const lang = params.lang || cookieLang || 'en';

    if (lang === 'ar') {
        return {
            title: 'اتصل بنا | تواصل مع رند البخيت',
            description: 'تواصل مع رند البخيت لمناقشة مشاريع التصميم الجرافيكي، الهويات التجارية، وتصميم التغليف والملصقات.',
            alternates: {
                canonical: 'https://www.alrund.space/contact?lang=ar',
            },
            openGraph: {
                title: 'تواصل معي | رند البخيت',
                description: 'تواصل لمناقشة أفكار التصميم الجرافيكي والهوية البصرية.',
                url: 'https://www.alrund.space/contact?lang=ar',
                locale: 'ar_JO',
            }
        };
    }

    return {
        title: 'Summon & Connect | Contact Rand Albakhet',
        description: 'Get in touch with Rand Albakhet. Let’s collaborate on branding, logo design, UI/UX, or packaging design projects. Open to freelance inquiries worldwide.',
        alternates: {
            canonical: 'https://www.alrund.space/contact',
        },
        openGraph: {
            title: 'Contact Rand Albakhet | Graphic Designer',
            description: 'Send a message or connect through social links. Ready to discuss new ideas and opportunities.',
            url: 'https://www.alrund.space/contact',
            locale: 'en_US',
        }
    };
}

export default async function ContactPage() {
    const supabase = await createClient();

    // Fetch data in parallel on the server
    const [
        { data: profileData },
        { data: socialData },
        { data: settings }
    ] = await Promise.all([
        supabase.from('profile_settings').select('*').single(),
        supabase.from('social_links').select('*').eq('is_active', true).order('created_at', { ascending: true }),
        supabase.from('site_settings').select('contact_content').single()
    ]);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Rand Albakhet',
        jobTitle: 'Graphic Designer',
        url: 'https://www.alrund.space/',
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: profileData?.phone || '+962799167626',
            contactType: 'professional inquiries',
            email: profileData?.email || 'randkhaled1995@gmail.com',
            availableLanguage: ['Arabic', 'English']
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ContactPageClient
                profile={profileData || {}}
                socials={socialData || []}
                dbContent={settings?.contact_content || null}
            />
        </>
    );
}
