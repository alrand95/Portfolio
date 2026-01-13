"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { BoingButton } from "@/components/BoingButton";
import { CyberHeroText } from "@/components/CyberHeroText";
import { BunnyLoader } from "@/components/BunnyLoader";
import dynamic from "next/dynamic";
import { defaultHeroContent } from "@/types/hero";
import { useTheme } from "@/components/ThemeContext";
import { useLanguage } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene").then((mod) => mod.HeroScene), {
  ssr: false,
  loading: () => <BunnyLoader />
});

export default function Home() {
  const { theme } = useTheme();
  // Parallax Logic
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]); // Parallax Background
  const textY = useTransform(scrollY, [0, 500], [0, 100]); // Parallax Text

  const { t, language } = useLanguage();

  // MERGING STRATEGY:
  // 1. Start with Default Content
  // 2. Override with Translations (Static)
  // 3. Override with Theme Config (Dynamic from Admin) - IF IT EXISTS

  // Base translations
  const translatedContent = {
    title_prefix: t('hero.title_prefix'),
    title_highlight: t('hero.title_highlight'),
    subtitle: t('hero.subtitle'),
    description: t('hero.description'),
    button_primary_text: t('hero.cta_primary'),
    button_secondary_text: t('hero.cta_secondary'),
  };

  // Admin Overrides
  // We check if the 'ar' fields exist in the theme when language is 'ar'.
  // If language is 'en', we use the standard fields.

  const adminContent = theme.hero_content || {} as any;

  // Resolve dynamic content based on language
  const dynamicTitlePrefix = language === 'ar' ? (adminContent.title_prefix_ar || adminContent.title_prefix) : adminContent.title_prefix;
  const dynamicTitleHighlight = language === 'ar' ? (adminContent.title_highlight_ar || adminContent.title_highlight) : adminContent.title_highlight;
  const dynamicSubtitle = language === 'ar' ? (adminContent.subtitle_ar || adminContent.subtitle) : adminContent.subtitle;
  const dynamicDescription = language === 'ar' ? (adminContent.description_ar || adminContent.description) : adminContent.description;

  // Final merge
  const heroContent = {
    ...defaultHeroContent,
    ...translatedContent,
    // Apply Admin Overrides only if they are not empty strings (optional check, or just overwrite)
    // If the admin user explicitly saves " ", we strictly respect that? Maybe not.
    // Let's assume if it's truthy in the DB, we use it.
    ...(dynamicTitlePrefix && { title_prefix: dynamicTitlePrefix }),
    ...(dynamicTitleHighlight && { title_highlight: dynamicTitleHighlight }),
    ...(dynamicSubtitle && { subtitle: dynamicSubtitle }),
    ...(dynamicDescription && { description: dynamicDescription }),
  };

  return (
    <main className="bg-black min-h-screen overflow-hidden selection:bg-neon-pink selection:text-white">

      {/* ---------------------------------------------------- */}
      {/* SECTION 1: THE HERO (3D BUNNY EXPERIENCE)            */}
      {/* ---------------------------------------------------- */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">

        {/* 3D Background */}
        <div className="absolute inset-0 z-0">
          <HeroScene />
        </div>

        {/* Floating Language Switcher for Homepage */}
        <div className="absolute top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>


        {/* Content Layer - Grid Layout for better positioning */}
        <div className="relative z-10 w-full h-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 pointer-events-none">

          {/* Left Col: Text (Spans 2 cols on mobile usually, but here we split) */}
          <div className="flex flex-col justify-end pb-2 md:pb-0 md:justify-center h-full pointer-events-auto">
            <CyberHeroText content={heroContent} />
          </div>

          {/* Right Col: Empty for now (This is where the 3D model is visible) */}
          <div className="hidden lg:block"></div>

        </div>
      </section>

    </main>
  );
}
