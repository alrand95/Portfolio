"use client";

import { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function AdminValentinePopup() {
    const [isVisible, setIsVisible] = useState(false);


    useEffect(() => {
        // Strict Date Check: Feb 14 (Month is 0-indexed, so 1 is Feb)
        const now = new Date();
        const isValentine = now.getDate() === 14 && now.getMonth() === 1;

        if (isValentine) {
            setIsVisible(true);
        }
    }, []);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 50 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="relative bg-black/60 border border-pink-500/30 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_0_80px_rgba(236,72,153,0.4)] flex flex-col items-center gap-6 max-w-sm w-full pointer-events-auto overflow-hidden"
                >
                    {/* Background Glows */}
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-pink-500/10 to-transparent pointer-events-none" />
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/20 blur-[50px] rounded-full pointer-events-none" />

                    {/* 🌹 ANIMATED FLOWER BLOOM (Moved to Top) */}
                    <div className="relative w-24 h-24 -mt-4 shrink-0">
                        <motion.svg
                            viewBox="0 0 500 500"
                            className="w-full h-full drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]"
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <title>Blooming Rose</title>
                            <defs>
                                <radialGradient id="popupPetalGradientVelvet" cx="50%" cy="70%" r="80%">
                                    <stop offset="0%" stopColor="#4c1d95" />
                                    <stop offset="60%" stopColor="#2e1065" />
                                    <stop offset="100%" stopColor="#020617" />
                                </radialGradient>
                                <radialGradient id="popupPetalGradientBright" cx="30%" cy="30%" r="90%">
                                    <stop offset="0%" stopColor="#f0abfc" />
                                    <stop offset="40%" stopColor="#d946ef" />
                                    <stop offset="100%" stopColor="#86198f" />
                                </radialGradient>
                                <radialGradient id="popupPetalGradientRoyal" cx="50%" cy="50%" r="70%">
                                    <stop offset="20%" stopColor="#a855f7" />
                                    <stop offset="100%" stopColor="#581c87" />
                                </radialGradient>
                            </defs>

                            <g transform="translate(250, 250) scale(1.8)">
                                {/* Petals */}
                                <motion.path
                                    d="M-50,-10 C-100,-100 100,-100 50,-10 C50,70 -50,70 -50,-10"
                                    fill="url(#popupPetalGradientVelvet)"
                                    animate={{
                                        d: ["M-50,-10 C-100,-100 100,-100 50,-10 C50,70 -50,70 -50,-10", "M-60,-20 C-110,-110 110,-110 60,-20 C60,80 -60,80 -60,-20", "M-50,-10 C-100,-100 100,-100 50,-10 C50,70 -50,70 -50,-10"]
                                    }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <motion.path
                                    d="M-30,0 Q-70,-70 -10,-90 Q50,-70 10,0"
                                    fill="url(#popupPetalGradientRoyal)"
                                    transform="rotate(-15)"
                                    animate={{ transform: "rotate(-10) scale(1.05)" }}
                                    transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
                                />
                                <motion.path
                                    d="M30,0 Q70,-70 10,-90 Q-50,-70 -10,0"
                                    fill="url(#popupPetalGradientRoyal)"
                                    transform="rotate(15)"
                                    animate={{ transform: "rotate(10) scale(1.05)" }}
                                    transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", delay: 0.5 }}
                                />
                                <motion.path
                                    d="M0,30 Q-70,-50 0,-110 Q70,-50 0,30"
                                    fill="url(#popupPetalGradientBright)"
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
                                />

                                {/* Inner Glow */}
                                <motion.circle
                                    cx="0" cy="-20" r="15"
                                    fill="#fdf4ff"
                                    filter="blur(5px)"
                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                            </g>
                        </motion.svg>

                        {/* Sparkles around flower */}
                        <motion.div
                            className="absolute top-0 right-0 text-yellow-200"
                            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                            <svg width="10" height="10" viewBox="0 0 24 24"><path fill="currentColor" d="M12,2L14.4,8.4L20.8,10.8L14.4,13.2L12,19.6L9.6,13.2L3.2,10.8L9.6,8.4Z" /></svg>
                        </motion.div>
                        <motion.div
                            className="absolute bottom-4 left-0 text-pink-200"
                            animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M12,2L14.4,8.4L20.8,10.8L14.4,13.2L12,19.6L9.6,13.2L3.2,10.8L9.6,8.4Z" /></svg>
                        </motion.div>
                    </div>

                    {/* 📸 Image Container - Cyber Styled */}
                    <div className="relative group">

                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow font-sans"></div>
                        <div className="relative w-28 h-28 p-1 bg-gradient-to-br from-white/20 to-white/5 rounded-full backdrop-blur-sm border border-white/20 shadow-2xl overflow-hidden shrink-0">
                            <div className="w-full h-full rounded-full overflow-hidden relative">
                                <Image
                                    src="/valentine-update.jpg"
                                    alt="Us"
                                    fill
                                    className="object-cover scale-105"
                                />
                            </div>
                        </div>
                        {/* Cutie badge */}
                        <motion.div
                            className="absolute -bottom-2 -right-2 bg-white text-pink-600 p-1.5 rounded-full shadow-lg z-10"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <Heart size={14} fill="currentColor" />
                        </motion.div>
                    </div>

                    {/* 💌 Text Content */}
                    <div className="text-center w-full px-2 relative z-10">
                        <h4 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-200 to-pink-200 font-bold text-2xl leading-tight font-sans tracking-wide mb-3 drop-shadow-sm">
                            Happy Valentine&apos;s Day 🌹
                        </h4>
                        <div className="relative">
                            <p className="text-pink-100/90 text-sm md:text-base font-medium leading-relaxed italic">
                                &quot;May Allah bless you, bring our hearts closer, and keep us together forever in Jannah.&quot;
                            </p>
                        </div>
                    </div>

                    {/* Close Button - Minimal */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute top-4 right-4 text-white/40 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all"
                    >
                        <X size={18} strokeWidth={2.5} />
                    </button>

                    <style jsx global>{`
                        @keyframes pulse-slow {
                            0%, 100% { opacity: 0.6; transform: scale(1); }
                            50% { opacity: 1; transform: scale(1.05); }
                        }
                        .animate-pulse-slow {
                            animation: pulse-slow 4s ease-in-out infinite;
                        }
                    `}</style>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
