"use client";

import dynamic from "next/dynamic";
import { CyberHeroText } from "@/components/CyberHeroText";
import { BunnyLoader } from "@/components/BunnyLoader";
import { defaultHeroContent } from "@/types/hero";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene").then((mod) => mod.HeroScene), {
    ssr: false,
    loading: () => <BunnyLoader />
});

export function HeroSection({ content }: { content: any }) {
    // Merge with defaults to prevent crashes
    const safeContent = { ...defaultHeroContent, ...content };

    return (
        <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <HeroScene />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 w-full h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 pointer-events-none">
                {/* Left Col: Text */}
                <div className="flex flex-col justify-end pb-2 md:pb-0 md:justify-center h-full pointer-events-auto">
                    <CyberHeroText content={safeContent} />
                </div>

                {/* Right Col: 3D view obstruction area */}
                <div className="hidden lg:block"></div>
            </div>
        </section>
    );
}
