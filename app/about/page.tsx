import { createClient } from '@/lib/supabase/server';
import { AboutPageClient } from '@/components/about/AboutPageClient';

export default async function AboutPage() {
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
