import type { Metadata } from 'next';
import { Baloo_2, Inter, Cairo } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';
import { ThemeProvider } from '@/components/ThemeContext';
import { BunnyNav } from '@/components/BunnyNav';
import { LanguageProvider } from '@/lib/i18n/context';
import { LanguageSelectionModal } from '@/components/LanguageSelectionModal';
import { PublicBirthdayCelebration } from '@/components/celebrations/PublicBirthdayCelebration';
import { EventPopup } from '@/components/EventPopup';
import { recordVisit } from '@/app/actions/visits'; // Direct import

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const baloo = Baloo_2({ subsets: ['latin'], weight: ['400', '700', '800'], variable: '--font-baloo' });
const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '700', '900'], variable: '--font-cairo' });

export const metadata: Metadata = {
  title: 'Rand Albakhet | Creative Graphic Designer & Visual Artist',
  description: 'Portfolio of Rand Albakhet, a highly creative Graphic Designer with 6+ years of experience in Branding, Logo Design, and Digital Marketing. Based in Jordan, working globally.',
  keywords: ['Graphic Designer', 'Rand Albakhet', 'Rand Khalid', 'Rand Khaled', 'Rund Khaled', 'Rund Khalid', 'Branding', 'Logo Design', 'Typography', 'Visual Artist', 'Jordan', 'Freelance Designer', 'Digital Marketing', 'Video Editing'],
  openGraph: {
    title: 'Rand Albakhet | Creative Graphic Designer',
    description: 'Expert in Branding, Logo Design, and Visual Identity. 6+ years of global experience.',
    type: 'website',
    locale: 'en_US',
    url: 'https://alrand-portfolio.vercel.app',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Rand Albakhet',
  alternateName: ['Rand Khalid', 'Rand Khaled', 'Rund Khaled', 'Rund Khalid'],
  jobTitle: 'Graphic Designer',
  url: 'https://alrand-portfolio.vercel.app',
  description: 'Highly creative and knowledgeable Graphic Designer with a strong background in developing and executing visual design.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Al Zarqa',
    addressCountry: 'Jordan'
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Freelance'
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let themeConfig = undefined;

  try {
    const supabase = await createClient();
    const { data: settings } = await supabase.from('site_settings').select('theme_config').single();
    themeConfig = settings?.theme_config || undefined;

    // Track visit server-side
    await recordVisit();
  } catch (error) {
    console.error("RootLayout Error (Non-Critical):", error);
    // Proceed with default theme and no visit tracking
  }

  return (
    <html className={cn(inter.variable, baloo.variable, cairo.variable)} suppressHydrationWarning>
      <body className="font-sans antialiased bg-primary-bg text-foreground min-h-screen selection:bg-neon-pink selection:text-white overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <ThemeProvider initialTheme={themeConfig}>
            <PublicBirthdayCelebration />
            <EventPopup />
            {children}
            <BunnyNav />
            <LanguageSelectionModal />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
