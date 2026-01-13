"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Star, Heart, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import Image from "next/image";

export function PublicBirthdayCelebration() {
    const { language, hasSelectedLanguage } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname();
    const [candleState, setCandleState] = useState<"lit" | "blown">("lit");

    const content = {
        en: {
            title: "It's My Birthday!",
            subtitle: "From my heart, I wish you success and peace.",
            message: "May Allah bless us all. Keep me in your prayers.",
            blow: "Blow the Candle!",
            wish: "Make a Wish!"
        },
        ar: {
            title: "إنه عيد ميلادي!",
            subtitle: "من كل قلبي، أتمنى لكم النجاح والسلام.",
            message: "بارك الله فينا جميعاً. لا تنسوني من دعائكم.",
            blow: "اطفئ الشمعة!",
            wish: "تمنى أمنية!"
        }
    };

    const t = content[language];

    useEffect(() => {
        const checkDate = () => {
            const now = new Date();
            const isBirthday = now.getDate() === 17 && now.getMonth() === 5; // June 17
            // const isBirthday = true; // TESTING MODE RE-ENABLED FOR REVIEW

            if (isBirthday) {
                const year = now.getFullYear();
                const storageKey = `birthday_public_shown_${year}`;
                const hasShown = localStorage.getItem(storageKey);

                if (!hasShown) {
                    setIsVisible(true);
                    localStorage.setItem(storageKey, "true");
                }
            }
        };

        const timer = setTimeout(checkDate, 1000);
        return () => clearTimeout(timer);
    }, []);

    const blowCandle = () => {
        if (candleState === "blown") return;
        setCandleState("blown");
        triggerConfetti();
    };

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 9999 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 80 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
                colors: ['#f9a8d4', '#d8b4fe', '#818cf8', '#ffffff']
            });
        }, 250);
    };

    // Hide on admin routes
    if (pathname?.startsWith('/admin')) return null;
    if (!hasSelectedLanguage) return null; // Wait for language selection
    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm font-sans"
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="relative w-full max-w-md bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-black/50 backdrop-blur-xl border border-purple-400/20 rounded-[3rem] p-8 shadow-[0_8px_32px_0_rgba(168,85,247,0.4)] overflow-visible"
                    >
                        {/* 🐰 BUNNY HOLDING INTERACTIVE CAKE */}
                        <div className="relative w-full flex justify-center -mt-12 mb-2">
                            <div className="relative w-64 h-64 flex justify-center items-center">
                                {/* Bunny Background */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3, duration: 1 }}
                                    className="absolute inset-0 z-0 pointer-events-none translate-x-6"
                                >
                                    <Image
                                        src="/birthday-bunny-v6.png"
                                        alt="Birthday Bunny"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </motion.div>

                                {/* Interactive Cake (Positioned on the plate) */}
                                <motion.div
                                    className="absolute z-10 w-24 h-24 translate-y-2 cursor-pointer hover:scale-105 transition-transform duration-300"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", delay: 0.5 }}
                                    onClick={blowCandle}
                                >

                                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl cursor-pointer hover:scale-105 transition-transform duration-300">
                                        <defs>
                                            <filter id="softGlow">
                                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                                <feMerge>
                                                    <feMergeNode in="coloredBlur" />
                                                    <feMergeNode in="SourceGraphic" />
                                                </feMerge>
                                            </filter>
                                        </defs>

                                        {/* Cute Pink Cake */}
                                        <path d="M40,140 L160,140 L160,170 C160,180 140,190 100,190 C60,190 40,180 40,170 Z" fill="#fbcfe8" />
                                        <path d="M40,140 C40,150 60,160 100,160 C140,160 160,150 160,140 C160,130 140,120 100,120 C60,120 40,130 40,140" fill="#f9a8d4" />

                                        <path d="M55,100 L145,100 L145,130 C145,140 125,145 100,145 C75,145 55,140 55,130 Z" fill="#fbcfe8" />
                                        <path d="M55,100 C55,110 75,115 100,115 C125,115 145,110 145,100 C145,90 125,85 100,85 C75,85 55,90 55,100" fill="#f9a8d4" />

                                        {/* Frosting */}
                                        <path d="M55,100 Q65,115 75,105 Q85,120 95,105 Q105,120 115,105 Q125,120 135,105 Q145,115 145,100" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />

                                        {/* Candle */}
                                        <rect x="95" y="50" width="10" height="40" rx="2" fill="#fff" stroke="#e2e8f0" />

                                        {/* Flame */}
                                        <AnimatePresence>
                                            {candleState === 'lit' && (
                                                <motion.path
                                                    d="M100,50 Q105,30 100,15 Q95,30 100,50"
                                                    fill="#fcd34d"
                                                    filter="url(#softGlow)"
                                                    animate={{ d: ["M100,50 Q106,30 100,15 Q94,30 100,50", "M100,50 Q104,30 100,12 Q96,30 100,50"] }}
                                                    transition={{ repeat: Infinity, duration: 0.4 }}
                                                    exit={{ scale: 0, opacity: 0 }}
                                                />
                                            )}
                                        </AnimatePresence>
                                        {candleState === 'blown' && (
                                            <motion.path
                                                d="M100,50 Q105,40 100,30"
                                                stroke="#cbd5e1"
                                                strokeWidth="2"
                                                fill="none"
                                                initial={{ opacity: 0, pathLength: 0 }}
                                                animate={{ opacity: [0, 0.5, 0], pathLength: 1, y: -10 }}
                                                transition={{ duration: 1.5 }}
                                            />
                                        )}
                                    </svg>
                                </motion.div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center text-center relative z-10 mt-4">
                            <motion.h1
                                className="text-3xl font-black text-white mb-2 drop-shadow-md"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                {t.title}
                            </motion.h1>

                            <motion.p
                                className="text-white mb-6 font-medium text-lg leading-relaxed max-w-xs mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent font-bold text-xl block mb-2">
                                    {t.subtitle}
                                </span>
                                <span className="text-sm text-purple-100/90 font-medium block leading-snug shadow-black drop-shadow-sm">
                                    {t.message}
                                </span>
                            </motion.p>

                            <motion.button
                                onClick={candleState === 'lit' ? blowCandle : () => setIsVisible(false)}
                                className="px-8 py-3 bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 border border-purple-300/40 rounded-full text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2 backdrop-blur-md"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                {candleState === 'lit' ? (
                                    <>
                                        <Zap className="w-4 h-4" />
                                        <span>{t.blow}</span>
                                    </>
                                ) : (
                                    <>
                                        <Star className="w-4 h-4 animate-spin-slow" />
                                        <span>{t.wish}</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
