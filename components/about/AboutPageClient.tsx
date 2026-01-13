'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/context';
import { SocialOrb } from '@/components/SocialOrb';
import { JourneyTimeline } from '@/components/JourneyTimeline';
import { SkillCloud } from '@/components/SkillCloud';
import { Instagram, Facebook, Palette, Globe, Twitter, Linkedin, Github, Mail, Phone } from 'lucide-react';
import Image from 'next/image';

const iconMap: Record<string, any> = {
    Instagram: <Instagram size={20} />,
    Facebook: <Facebook size={20} />,
    Behance: <Palette size={20} />,
    Website: <Globe size={20} />,
    Twitter: <Twitter size={20} />,
    Linkedin: <Linkedin size={20} />,
    Github: <Github size={20} />,
};

interface AboutPageClientProps {
    profile: any;
    experience: any[];
    skills: any[];
    socials: any[];
}

export function AboutPageClient({ profile, experience, skills, socials }: AboutPageClientProps) {
    const [mounted, setMounted] = useState(false);
    const [seeds, setSeeds] = useState<any[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const { t, language } = useLanguage();

    // Resolve Bilingual Profile Data
    const displayProfile = useMemo(() => {
        if (!profile) return {};
        return {
            ...profile,
            full_name: (language === 'ar' && profile.full_name_ar) ? profile.full_name_ar : profile.full_name,
            job_title: (language === 'ar' && profile.job_title_ar) ? profile.job_title_ar : profile.job_title,
            about_bio: (language === 'ar' && profile.about_bio_ar) ? profile.about_bio_ar : profile.about_bio,
        };
    }, [profile, language]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true); // Mark component as mounted on client
            // Generate random seeds for motes only once on the client
            const newSeeds = Array.from({ length: 20 }, () => ({
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                duration: 5 + (Math.random() * 10),
                delay: Math.random() * 2,
            }));
            setSeeds(newSeeds);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className="min-h-screen pt-40 pb-40 px-4 relative bg-black selection:bg-neon-pink/30 selection:text-white overflow-x-hidden snap-y snap-mandatory">

            {/* --- Global Decorative Elements --- */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-neon-purple/20 blur-[180px] rounded-full animate-slow-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-neon-pink/20 blur-[180px] rounded-full animate-slow-pulse delay-2000" />

                {/* Floating Motes - Client Side Only */}
                {mounted && seeds.map((seed, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-20"
                        initial={{
                            x: seed.x,
                            y: seed.y
                        }}
                        animate={{
                            y: [null, "-20px", "20px", null],
                            opacity: [0.1, 0.4, 0.1],
                        }}
                        transition={{
                            duration: seed.duration,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 relative z-10">

                {/* LEFT COLUMN: Bunnified Character Card (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                        className="relative w-full max-w-md"
                    >
                        {/* --- THE FLUFFY BUNNY FRAME --- */}
                        <div className="
                            relative p-1
                            rounded-[50px]
                            bg-gradient-to-b from-pink-200 via-white to-pink-200
                            shadow-[0_0_50px_rgba(255,77,166,0.3)]
                        ">
                            {/* Fluffy Texture Simulation (Border) */}
                            <div className="absolute inset-0 rounded-[50px] border-[8px] border-white/50 blur-sm pointer-events-none" />
                            <div className="absolute inset-0 rounded-[50px] border-[4px] border-neon-pink/20 pointer-events-none" />

                            {/* BUNNY EARS (Top) */}
                            <div className="absolute -top-16 left-0 right-0 flex justify-center gap-8 md:gap-16 pointer-events-none z-0">
                                {/* Left Ear - Animated & Cute */}
                                <motion.div
                                    className="w-16 h-32 bg-gradient-to-t from-white to-pink-100 rounded-full border-4 border-white shadow-lg origin-bottom flex items-center justify-center transform translate-y-8 overflow-hidden relative"
                                    initial={{ rotate: -12 }}
                                    animate={{ rotate: [-12, -20, -8, -12] }}
                                    transition={{
                                        duration: 4,
                                        ease: "easeInOut",
                                        times: [0, 0.1, 0.2, 1],
                                        repeat: Infinity,
                                        repeatDelay: 1
                                    }}
                                >
                                    <div className="w-8 h-24 bg-pink-200 rounded-full opacity-80" />
                                    {/* Light/Shine Effect */}
                                    <motion.div
                                        className="absolute top-0 -left-[150%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                                        animate={{ left: ["-150%", "150%"] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", repeatDelay: 3 }}
                                    />
                                </motion.div>
                                {/* Right Ear - Animated & Cute */}
                                <motion.div
                                    className="w-16 h-32 bg-gradient-to-t from-white to-pink-100 rounded-full border-4 border-white shadow-lg origin-bottom flex items-center justify-center transform translate-y-8 overflow-hidden relative"
                                    initial={{ rotate: 12 }}
                                    animate={{ rotate: [12, 20, 8, 12] }}
                                    transition={{
                                        duration: 5,
                                        ease: "easeInOut",
                                        times: [0, 0.1, 0.2, 1],
                                        repeat: Infinity,
                                        repeatDelay: 0.5,
                                        delay: 1.5
                                    }}
                                >
                                    <div className="w-8 h-24 bg-pink-200 rounded-full opacity-80" />
                                    {/* Light/Shine Effect */}
                                    <motion.div
                                        className="absolute top-0 -left-[150%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                                        animate={{ left: ["-150%", "150%"] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", repeatDelay: 4, delay: 1 }}
                                    />
                                </motion.div>
                            </div>

                            {/* BUNNY PAWS (Bottom) */}
                            <div className="absolute -bottom-6 -left-4 w-20 h-20 bg-white rounded-full border-4 border-pink-100 shadow-lg flex flex-col items-center justify-center z-20 rotate-[-15deg]">
                                <div className="flex gap-1 mb-1">
                                    <div className="w-4 h-4 bg-pink-300 rounded-full" />
                                    <div className="w-4 h-4 bg-pink-300 rounded-full" />
                                    <div className="w-4 h-4 bg-pink-300 rounded-full" />
                                </div>
                                <div className="w-10 h-8 bg-pink-300 rounded-full" />
                            </div>
                            <div className="absolute -bottom-6 -right-4 w-20 h-20 bg-white rounded-full border-4 border-pink-100 shadow-lg flex flex-col items-center justify-center z-20 rotate-[15deg]">
                                <div className="flex gap-1 mb-1">
                                    <div className="w-4 h-4 bg-pink-300 rounded-full" />
                                    <div className="w-4 h-4 bg-pink-300 rounded-full" />
                                    <div className="w-4 h-4 bg-pink-300 rounded-full" />
                                </div>
                                <div className="w-10 h-8 bg-pink-300 rounded-full" />
                            </div>


                            {/* Inner Dark Card Content */}
                            <div className="
                                relative z-10
                                bg-black 
                                rounded-[46px] 
                                p-8 pt-12
                                border border-pink-500/30
                                flex flex-col items-center text-center
                            ">
                                {/* Decorative Corner Flourishes */}
                                <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-neon-pink/50 rounded-tl-3xl opacity-50 pointer-events-none" />
                                <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-neon-pink/50 rounded-tr-3xl opacity-50 pointer-events-none" />
                                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-neon-pink/50 rounded-bl-3xl opacity-50 pointer-events-none" />
                                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-neon-pink/50 rounded-br-3xl opacity-50 pointer-events-none" />

                                {/* Avatar Ring (Centered in the "Forehead") */}
                                <motion.div
                                    className="relative mb-6 -mt-6 group cursor-pointer"
                                    initial="rest"
                                    animate={(isHovered || isClicked) ? "hover" : "rest"}
                                    onHoverStart={() => setIsHovered(true)}
                                    onHoverEnd={() => setIsHovered(false)}
                                    onTap={() => setIsClicked(!isClicked)}
                                >
                                    {/* Glowing Pulse Background */}
                                    <div className="absolute inset-0 bg-neon-pink blur-xl opacity-40 animate-pulse" />

                                    {/* Rotating "Halo" of Cute Icons */}
                                    <motion.div
                                        className="absolute inset-[-30%] z-0 pointer-events-none"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    >
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-yellow-300 text-lg">⭐</div>
                                        <div className="absolute bottom-0 right-1/4 translate-y-4 text-pink-300 text-lg">❤️</div>
                                        <div className="absolute top-1/2 -left-6 text-blue-300 text-sm">✨</div>
                                        <div className="absolute bottom-1/4 -right-4 text-purple-300 text-sm">🎵</div>
                                    </motion.div>

                                    {/* Peeking Bunny Ears (Pop up from behind on hover) */}
                                    <motion.div
                                        className="absolute -top-5 left-0 right-0 flex justify-center gap-6 z-0"
                                        variants={{
                                            rest: { y: 15, opacity: 0 },
                                            hover: {
                                                y: 0,
                                                opacity: 1,
                                                transition: { type: "spring", stiffness: 300, damping: 20 }
                                            }
                                        }}
                                    >
                                        {/* Tiny Ears (Smaller Size) */}
                                        <div className="w-3 h-6 bg-white rounded-full border-2 border-pink-200 -rotate-12 flex justify-center"><div className="w-1.5 h-3 bg-pink-300 rounded-full mt-1 opacity-60" /></div>
                                        <div className="w-3 h-6 bg-white rounded-full border-2 border-pink-200 rotate-12 flex justify-center"><div className="w-1.5 h-3 bg-pink-300 rounded-full mt-1 opacity-60" /></div>
                                    </motion.div>

                                    {/* Main Avatar Container */}
                                    <motion.div
                                        className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-b from-white to-pink-200 overflow-hidden shadow-lg border-2 border-white z-10"
                                        variants={{
                                            hover: { scale: 1.05, rotate: 2 }
                                        }}
                                    >
                                        <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-900">
                                            {displayProfile?.avatar_url ? (
                                                <Image src={displayProfile.avatar_url} alt={displayProfile.full_name || 'Creator'} fill className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-600 text-xs">{t('about.no_img')}</div>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Spinning Flower Decorations */}
                                    <motion.div
                                        className="absolute -right-2 top-0 text-2xl z-20"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    >
                                        🌸
                                    </motion.div>
                                    <motion.div
                                        className="absolute -left-2 top-0 text-2xl z-20"
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                    >
                                        🌸
                                    </motion.div>
                                </motion.div>

                                {/* TEXT CONTENT */}
                                <h1 className="text-3xl font-[family-name:var(--font-baloo)] text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                    {displayProfile?.full_name || 'Bunny'}
                                </h1>

                                <p className="inline-block px-4 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-neon-pink font-bold tracking-widest text-[10px] mb-6 uppercase">
                                    {displayProfile?.job_title}
                                </p>

                                <p className="text-gray-300 text-xs leading-6 mb-8 font-medium px-2">
                                    {displayProfile?.about_bio}
                                </p>

                                {/* Contact Details */}
                                {(displayProfile?.email || displayProfile?.phone) && (
                                    <div className="w-full flex flex-col gap-2 mb-8 px-4">
                                        {displayProfile.email && (
                                            <div className="flex items-center gap-3 text-xs text-gray-400 font-mono bg-white/5 p-2 rounded-lg border border-white/5">
                                                <Mail size={14} className="text-neon-pink shrink-0" />
                                                <span className="truncate">{displayProfile.email}</span>
                                            </div>
                                        )}
                                        {displayProfile.phone && (
                                            <div className="flex items-center gap-3 text-xs text-gray-400 font-mono bg-white/5 p-2 rounded-lg border border-white/5">
                                                <Phone size={14} className="text-neon-blue shrink-0" />
                                                <span className="truncate">{displayProfile.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Social Orbs */}
                                <div className="flex justify-center gap-4 flex-wrap mb-6 px-4">
                                    {socials.map((s, i) => (
                                        <SocialOrb key={s.id} href={s.url} icon={iconMap[s.platform] || <Globe size={20} />} iconUrl={s.icon_url} platform={s.platform} delay={i * 0.1} />
                                    ))}
                                </div>

                                {/* Resume Button */}
                                <div className="w-full">
                                    <a
                                        href={displayProfile?.resume_pdf_url || '#'}
                                        download={!!displayProfile?.resume_pdf_url}
                                        className="
                                            w-full block py-3 rounded-xl
                                            bg-white/10 hover:bg-neon-pink
                                            text-white hover:text-black
                                            font-bold text-xs uppercase tracking-widest
                                            transition-all duration-300
                                            border border-white/10 hover:border-transparent
                                        "
                                    >
                                        {t('about.resume_btn')}
                                    </a>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT COLUMN: Journey & Skills */}
                <div className="lg:col-span-8 flex flex-col gap-24 pt-8">

                    {/* Timeline Section */}
                    <section>
                        <JourneyTimeline experience={experience} />
                    </section>

                    {/* Skills Section */}
                    <section className="relative">
                        <SkillCloud skills={skills} />
                    </section>

                </div>

            </div>

            {/* Cute Footer */}
            <footer className="relative z-10 text-center mt-auto opacity-60 hover:opacity-100 transition-opacity">
                <p className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase">
                    {t('about.footer_text')} <span className="text-neon-pink text-sm align-middle">♥</span>
                </p>
            </footer>

        </main>
    );
}
