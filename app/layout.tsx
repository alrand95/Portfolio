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
  title: 'Rand Portfolio',
  description: 'I Code Fast. I Break Things. I Hop Back Up.',
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
