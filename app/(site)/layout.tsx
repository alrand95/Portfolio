
import { BunnyNav } from '@/components/BunnyNav';
import { SmoothScroll } from '@/components/SmoothScroll';

export default function SiteLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <SmoothScroll>
                <div className="relative z-10 w-full min-h-screen">
                    {children}
                </div>
                <BunnyNav />

                {/* Background Ambient Glow */}
                <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(75,208,255,0.03),transparent_40%)]" />
            </SmoothScroll>
        </>
    );
}
