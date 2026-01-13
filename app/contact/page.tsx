'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
    Instagram, Facebook, Palette, Globe, Twitter, Linkedin, Github,
    Sparkles, Send, Zap, Rocket, Star, Heart, Moon, Cloud, Check, Copy, User
} from 'lucide-react';
import Image from 'next/image';
import { Baloo_2, Inter } from 'next/font/google';
import { submitContact } from '@/app/actions/contact';
import { SocialOrb } from '@/components/SocialOrb';
import { ParallaxCard } from '@/components/ParallaxCard';

import { useLanguage } from '@/lib/i18n/context';

// --- Fonts ---
const baloo = Baloo_2({ subsets: ['latin'], weight: ['400', '700', '800'], variable: '--font-baloo' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// --- Types ---
type SocialLink = {
    id: string;
    platform: string;
    url: string;
    icon_url?: string;
};

const iconMap: Record<string, any> = {
    Instagram: <Instagram size={20} />,
    Facebook: <Facebook size={20} />,
    Behance: <Palette size={20} />,
    Website: <Globe size={20} />,
    Twitter: <Twitter size={20} />,
    Linkedin: <Linkedin size={20} />,
    Github: <Github size={20} />,
};

// --- Custom SVGs for Distinct Look ---

const BunnyIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 15C15.866 15 19 12.5 19 9.5C19 6.5 15.866 4 12 4C8.13401 4 5 6.5 5 9.5C5 12.5 8.13401 15 12 15Z" />
        <path d="M8 4L6 2" />
        <path d="M16 4L18 2" />
        <path d="M9 10C9 10 9.5 11 10.5 11" />
        <path d="M15 10C15 10 14.5 11 13.5 11" />
        <path d="M12 11V12" />
    </svg>
);

const PlanetIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="6" />
        <path d="M2.5 14C2.5 14 6 8 12 8C18 8 21.5 14 21.5 14" />
        <path d="M2.5 14C2.5 14 6 15 12 15C18 15 21.5 14 21.5 14" />
    </svg>
)

// --- Background Component ---

function NeonMagicBackground() {
    const [elements, setElements] = useState<any[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setElements(Array.from({ length: 30 }).map((_, i) => {
                const isBunny = Math.random() > 0.4;
                return {
                    id: i,
                    type: isBunny ? 0 : (i % 4) + 1,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    scale: Math.random() * 0.5 + (isBunny ? 1 : 0.5),
                    duration: Math.random() * 20 + 20,
                    delay: Math.random() * 5,
                    color: Math.random() > 0.5 ? 'text-neon-pink' : 'text-neon-purple'
                };
            }));
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const getIcon = (type: number, className: string) => {
        switch (type) {
            case 0: return <BunnyIcon className={className} />;
            case 1: return <PlanetIcon className={className} />;
            case 2: return <Star className={className} />;
            case 3: return <Heart className={className} />;
            case 4: return <Moon className={className} />;
            default: return <Sparkles className={className} />;
        }
    }

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-black">
            {/* Deep Void Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(20,0,20,1)_0%,rgba(0,0,0,1)_100%)]" />

            {/* Floating Soft Blobs */}
            <motion.div
                className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-neon-blue/5 blur-[120px] rounded-full mix-blend-screen"
                animate={{ y: [-50, 50, -50], scale: [1, 1.2, 1] }}
                transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-neon-pink/5 blur-[150px] rounded-full mix-blend-screen"
                animate={{ y: [50, -50, 50], scale: [1, 1.1, 1] }}
                transition={{ duration: 45, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Icons */}
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    className={`absolute opacity-20 ${el.color}`}
                    style={{
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                    }}
                    animate={{
                        y: [-10, 10, -10],
                        opacity: [0.1, 0.3, 0.1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: el.duration * 2,
                        repeat: Infinity,
                        delay: el.delay,
                        ease: "easeInOut"
                    }}
                >
                    {getIcon(el.type, `w-6 h-6 drop-shadow-[0_0_5px_currentColor]`)}
                </motion.div>
            ))}
        </div>
    );
}

// --- Inputs ---


function CuteInput({ placeholder, name, type = "text", iconLeft: IconLeft, iconRight: IconRight, required, maxLength = 100, error }: any) {
    return (
        <div className="w-full">
            <div className="relative group w-full">
                {/* Glow Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/50 to-neon-purple/50 rounded-full blur-[2px] opacity-50 group-hover:opacity-100 group-focus-within:opacity-100 group-focus-within:blur-md transition-all duration-300" />

                <div className={`relative flex items-center bg-black/60 backdrop-blur-md rounded-full border ${error ? 'border-red-500' : 'border-neon-pink/30 hover:border-neon-pink'} transition-colors h-14 px-6 gap-3`}>
                    {/* Left Icon */}
                    <span className="text-neon-pink drop-shadow-[0_0_5px_rgba(255,0,153,0.5)]">
                        <IconLeft size={24} />
                    </span>

                    <input
                        name={name}
                        type={type}
                        required={required}
                        maxLength={maxLength}
                        placeholder={placeholder}
                        aria-label={placeholder}
                        className="flex-1 bg-transparent text-white font-[family-name:var(--font-baloo)] text-lg placeholder:text-white/40 focus:outline-none h-full pt-1"
                    />

                    {/* Right Icon */}
                    {IconRight && (
                        <span className="text-neon-purple drop-shadow-[0_0_5px_rgba(157,0,255,0.5)]">
                            <IconRight size={20} />
                        </span>
                    )}
                </div>
            </div>
            {error && <p className="text-red-400 text-sm mt-1 ml-4 shadow-black drop-shadow-md font-bold">{error}</p>}
        </div>
    );
}

function CuteTextArea({ placeholder, name, required, maxLength = 500, error }: any) {
    const [count, setCount] = useState(0);

    return (
        <div className="w-full">
            <div className="relative group w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/50 to-neon-purple/50 rounded-3xl blur-[2px] opacity-50 group-hover:opacity-100 group-focus-within:opacity-100 group-focus-within:blur-md transition-all duration-300" />
                <div className={`relative flex flex-col bg-black/60 backdrop-blur-md rounded-3xl border ${error ? 'border-red-500' : 'border-neon-pink/30 hover:border-neon-pink'} transition-colors p-6 pb-4 gap-3`}>
                    <div className="flex gap-3 w-full">
                        <span className="text-neon-pink drop-shadow-[0_0_5px_rgba(255,0,153,0.5)] pt-1">
                            <BunnyIcon className="w-6 h-6" />
                        </span>
                        <textarea
                            name={name}
                            required={required}
                            maxLength={maxLength}
                            placeholder={placeholder}
                            aria-label={placeholder}
                            rows={4}
                            onChange={(e) => setCount(e.target.value.length)}
                            className="flex-1 bg-transparent text-white font-[family-name:var(--font-baloo)] text-lg placeholder:text-white/40 focus:outline-none resize-none no-scrollbar pt-1"
                        />
                    </div>
                    {/* Character Counter */}
                    <div className="w-full text-right">
                        <span className={`text-xs font-medium font-[family-name:var(--font-baloo)] ${count >= maxLength ? 'text-neon-pink' : 'text-white/30'}`}>
                            {count}/{maxLength}
                        </span>
                    </div>
                </div>
            </div>
            {error && <p className="text-red-400 text-sm mt-1 ml-4 shadow-black drop-shadow-md font-bold">{error}</p>}
        </div>
    );
}

// --- Main Page ---
export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<any>(null);

    const [sent, setSent] = useState(false);
    const [socials, setSocials] = useState<SocialLink[]>([]);
    const [formErrors, setFormErrors] = useState<any>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const formStartTime = useRef<number>(0);
    const [isAvatarHovered, setIsAvatarHovered] = useState(false);
    const { t, language } = useLanguage();

    // --- Dynamic Content State ---
    // Initialize with translations, then update with DB content
    const [dbContent, setDbContent] = useState<any>(null);

    const pageContent = useMemo(() => {
        const base = {
            headline: t('contact.headline'),
            subheadline: t('contact.subheadline'),
            social_title: t('contact.social_title'),
            form_title: t('contact.form_title'),
            form_btn_text: t('contact.form_btn_text')
        };

        if (!dbContent) return base;

        // Merge logic: Admin > Translation
        // Check for language specific overrides in dbContent
        const keyMap: Record<string, string> = {
            headline: 'headline',
            subheadline: 'subheadline',
            social_title: 'social_title',
            form_title: 'form_title',
            form_btn_text: 'form_btn_text'
        };

        const merged: any = { ...base };

        Object.keys(keyMap).forEach(key => {
            const dbKey = language === 'ar' ? `${key}_ar` : key;
            // Only override if DB value is truthy (and not just empty string if we want that behavior)
            // Assuming DB saves as empty string if cleared, we might want to fall back to translation?
            // Let's assume non-empty string overrides.
            if (dbContent[dbKey]) {
                merged[key] = dbContent[dbKey];
            } else if (language === 'ar' && !dbContent[dbKey] && dbContent[key]) {
                // FALLBACK: If Arabic override is missing, do we show English DB content or Arabic Translation?
                // Visual consistency might suggest showing Arabic Translation is better than English DB content in Arabic mode.
                // So we do NOTHING here, keeping the 'base' (translation) value.
            }
        });

        return merged;

    }, [dbContent, language, t]);

    // Fetch Data
    useEffect(() => {
        const fetch = async () => {
            formStartTime.current = Date.now(); // Start timer on mount
            const supabase = createClient();
            const { data: p } = await supabase.from('profile_settings').select('*').single();
            if (p) setProfile(p);

            const { data: s } = await supabase.from('social_links').select('*').eq('is_active', true).order('created_at', { ascending: true });
            if (s) setSocials(s);

            const { data: settings } = await supabase.from('site_settings').select('contact_content').single();
            if (settings?.contact_content) {
                setDbContent(settings.contact_content);
            }
        };
        fetch();
    }, []);

    const handleCopyEmail = () => {
        if (profile?.email) {
            navigator.clipboard.writeText(profile.email);
            alert("Email copied to clipboard! 📬");
        }
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormErrors({});
        setGeneralError(null);

        // Client-side quick checks
        const timeElapsed = Date.now() - formStartTime.current;
        if (timeElapsed < 2000) {
            setGeneralError("Whoa there, speedster! Please wait a moment before sending.");
            return;
        }

        setLoading(true);

        const formData = new FormData(e.currentTarget);

        // Call Server Action
        try {
            const result = await submitContact({}, formData);

            if (result.error) {
                setGeneralError(result.error);
            } else if (result.errors) {
                setFormErrors(result.errors);
            } else if (result.success) {
                setSent(true);
            }
        } catch (err) {
            setGeneralError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (sent) return (
        <div className={`min-h-screen flex items-center justify-center bg-black relative overflow-hidden ${baloo.variable} ${inter.variable}`}>
            <NeonMagicBackground />
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                className="text-center z-20 p-12 bg-black/40 backdrop-blur-xl rounded-[40px] border-2 border-neon-pink box-glow max-w-md w-full mx-4"
            >
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-neon-pink to-neon-purple rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,0,153,0.6)] animate-bounce text-white">
                    <Heart size={48} fill="currentColor" />
                </div>
                <h1 className="text-5xl mb-4 text-white font-[family-name:var(--font-baloo)] font-bold text-glow">Packet Sent!</h1>
                <p className="text-neon-blue font-[family-name:var(--font-baloo)] text-xl mb-8">Magic delivered successfully! ✨</p>
                <button
                    onClick={() => setSent(false)}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold text-xl font-[family-name:var(--font-baloo)] shadow-[0_0_20px_rgba(255,0,153,0.4)] hover:scale-105 transition-transform"
                >
                    Send Another! 🚀
                </button>
            </motion.div>
        </div>
    );

    return (
        <main className={`min-h-screen pt-32 pb-12 px-4 md:px-8 relative bg-black overflow-hidden selection:bg-neon-pink selection:text-white ${baloo.variable} ${inter.variable}`}>

            <NeonMagicBackground />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start relative z-10">
                {/* --- Left Column: Intro & Socials --- */}
                <div className="space-y-12 lg:pt-12">
                    <div className="space-y-6">
                        {/* Cutie Avatar with Ears */}
                        <motion.div
                            className="relative w-32 h-32 mb-8 group"
                            onMouseEnter={() => setIsAvatarHovered(true)}
                            onMouseLeave={() => setIsAvatarHovered(false)}
                            onTouchStart={() => setIsAvatarHovered(!isAvatarHovered)}
                            whileHover={{ scale: 1.05 }}
                        >
                            <AnimatePresence>
                                {isAvatarHovered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: -20 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute -top-4 left-0 right-0 flex justify-center gap-6 -z-10"
                                    >
                                        <div className="w-6 h-12 bg-neon-pink rounded-full -rotate-12 border-2 border-white/20" />
                                        <div className="w-6 h-12 bg-neon-purple rounded-full rotate-12 border-2 border-white/20" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="w-full h-full rounded-full border-4 border-white/10 p-1 bg-black/50 backdrop-blur-md shadow-[0_0_30px_rgba(255,77,166,0.3)] group-hover:border-neon-pink transition-colors duration-500">
                                <div className="w-full h-full rounded-full overflow-hidden relative">
                                    {profile?.avatar_url ? (
                                        <Image src={profile.avatar_url} alt="Me" fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                                            <User className="text-white/50" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="absolute bottom-1 right-1 w-8 h-8 bg-neon-green rounded-full border-4 border-black flex items-center justify-center animate-pulse">
                                <Sparkles size={12} className="text-black fill-current" />
                            </div>
                        </motion.div>

                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-[family-name:var(--font-baloo)] uppercase tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            {pageContent.headline || "Let's Create Magic Together"}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 font-medium max-w-lg leading-relaxed">
                            {pageContent.subheadline || "Have a project in mind? Just want to say hi? I'm always open to discussing new ideas and opportunities."}
                        </p>
                    </div>

                    {/* Social Orbs Grid */}
                    <div className="space-y-4">
                        <h3 className="text-neon-blue font-bold tracking-widest uppercase text-sm mb-6 flex items-center gap-2">
                            <Sparkles size={16} /> {pageContent.social_title || "Connect With Me"}
                        </h3>
                        <div className="flex flex-wrap gap-6">
                            {socials.map((s, i) => (
                                <SocialOrb
                                    key={s.id}
                                    href={s.url}
                                    icon={iconMap[s.platform] || <Globe size={24} />}
                                    iconUrl={s.icon_url}
                                    platform={s.platform}
                                    delay={i * 0.1}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- Right Column: The Form Card --- */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
                >
                    <ParallaxCard className="bg-black/40 backdrop-blur-xl border-white/10 p-6 md:p-12 relative overflow-hidden group">

                        {/* Decorative Gradient Blob */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-neon-pink/20 rounded-full blur-[80px] pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-neon-purple/20 rounded-full blur-[80px] pointer-events-none" />

                        <div className="relative z-10">
                            <h2 className="text-3xl font-[family-name:var(--font-baloo)] font-bold text-white mb-8 flex items-center gap-3">
                                <Send className="text-neon-pink" />
                                {pageContent.form_title || "Send a Message"}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <CuteInput
                                    name="name"
                                    placeholder={t('contact.input_name')}
                                    iconLeft={BunnyIcon}
                                    required
                                    error={formErrors?.name?.[0]}
                                />

                                <CuteInput
                                    name="email"
                                    type="email"
                                    placeholder={t('contact.input_email')}
                                    iconLeft={Moon}
                                    required
                                    error={formErrors?.email?.[0]}
                                />

                                <CuteTextArea
                                    name="message"
                                    placeholder={t('contact.input_message')}
                                    required
                                    error={formErrors?.message?.[0]}
                                />

                                {generalError && (
                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm font-bold text-center">
                                        {generalError}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                                        w-full py-5 rounded-2xl relative overflow-hidden
                                        bg-white text-black font-bold text-lg uppercase tracking-wider
                                        hover:bg-neon-pink hover:text-white
                                        transition-all duration-300
                                        shadow-[0_0_20px_rgba(255,255,255,0.1)]
                                        hover:shadow-[0_0_40px_rgba(255,0,153,0.4)]
                                        group/btn
                                        disabled:opacity-50
                                    "
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {loading ? 'Sending...' : (pageContent.form_btn_text || "Send Message")}
                                        <Rocket size={20} className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                                    </span>
                                </button>

                                {/* Honeypot - hidden from both visual and screen readers */}
                                <input
                                    type="text"
                                    name="_fax_number"
                                    aria-hidden="true"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{
                                        position: 'absolute',
                                        left: '-9999px',
                                        width: '1px',
                                        height: '1px',
                                        opacity: 0
                                    }}
                                />
                            </form>
                        </div>
                    </ParallaxCard>
                </motion.div>
            </div>

        </main>
    );
}

// Additional Small Decors
const BotDecor = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
        <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" />
    </svg>
)
const StarDecor = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" />
    </svg>
)
const HeartDecor = ({ className }: { className?: string }) => (
    <Heart className={className} fill="currentColor" />
)
const MoonDecor = ({ className }: { className?: string }) => (
    <Moon className={className} fill="currentColor" />
)
