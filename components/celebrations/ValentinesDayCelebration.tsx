"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Stars, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { useLanguage } from "@/lib/i18n/context";
import Image from "next/image";

export function ValentinesDayCelebration() {
    const { hasSelectedLanguage } = useLanguage();
    const [isVisible, setIsVisible] = useState(true); // Forced TRUE
    const [animationStage, setAnimationStage] = useState<
        "seed" | "sprout" | "growth" | "leaves" | "bud" | "bloom" | "message" | "complete"
    >("seed");

    const [backgroundStars, setBackgroundStars] = useState<any[]>([]);
    const [floatingParticles, setFloatingParticles] = useState<any[]>([]);

    const triggerSparkles = useCallback(() => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 20 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
                colors: ['#a855f7', '#d8b4fe', '#ffffff', '#e879f9'],
                shapes: ['circle', 'star'],
                scalar: 0.5
            });
            confetti({
                ...defaults,
                particleCount: particleCount / 2,
                origin: { x: randomInRange(0.3, 0.7), y: Math.random() - 0.2 },
                colors: ['#ff00ff', '#800080'],
                shapes: ['heart' as any],
                scalar: 0.8
            });
        }, 250);
    }, []);

    const startAnimationSequence = useCallback(async () => {
        // Sequence timing
        const timings = {
            seed: 0,
            sprout: 2000,
            growth: 4000,
            leaves: 5500,
            bud: 7000,
            bloom: 8500,
            message: 10500,
            end: 12000,
        };

        const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

        setAnimationStage("seed");

        await delay(timings.sprout);
        setAnimationStage("sprout");

        await delay(2000);
        setAnimationStage("growth");

        await delay(1500);
        setAnimationStage("leaves");

        await delay(1500);
        setAnimationStage("bud");

        await delay(1500);
        setAnimationStage("bloom");

        // Trigger particles at bloom
        triggerSparkles();

        await delay(2000);
        setAnimationStage("message");

    }, [triggerSparkles]);

    useEffect(() => {
        // Generate random stars and particles on client side only - Use setTimeout to avoid synchronous state update warning
        const timer = setTimeout(() => {
            setBackgroundStars(Array.from({ length: 150 }).map(() => ({
                width: Math.random() < 0.2 ? '3px' : '1px',
                height: Math.random() < 0.2 ? '3px' : '1px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDuration: Math.random() * 3 + 2 + 's',
                animationDelay: Math.random() * 2 + 's'
            })));

            setFloatingParticles(Array.from({ length: 20 }).map(() => ({
                left: Math.random() * 100 + '%',
                animationDuration: Math.random() * 10 + 10 + 's',
                animationDelay: Math.random() * 5 + 's',
                scale: Math.random() * 0.5 + 0.5
            })));
        }, 0);
        return () => clearTimeout(timer);


        const checkDate = () => {
            const now = new Date();
            const isValentine = now.getDate() === 14 && now.getMonth() === 1;
            const isValentineTest = true;

            if (isValentine || isValentineTest) {
                const year = now.getFullYear();
                const sessionKey = `admin_valentine_shown_${year}_test`;
                const hasShown = sessionStorage.getItem(sessionKey);

                if (!hasShown) {
                    setIsVisible(true);
                    sessionStorage.setItem(sessionKey, "true");
                    startAnimationSequence();
                }
            }
        };

        checkDate();
    }, [startAnimationSequence]);

    const onClose = () => {
        setIsVisible(false);
    };

    // if (!hasSelectedLanguage) return null;
    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1 } }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black overflow-hidden font-sans"
                >
                    {/* 🌌 Background Stars & Glow - Cutified */}
                    <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#1a052b] to-black">
                        {/* Static Stars for depth */}
                        {backgroundStars.map((style, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full bg-white opacity-60 animate-pulse"
                                style={style}
                            />
                        ))}
                        {/* Soft Pastel Clouds */}
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pink-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" />
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 blur-[100px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />
                    </div>

                    {/* 🌹 Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-50 text-white/30 hover:text-pink-200 transition-colors p-2 rounded-full hover:bg-white/10"
                    >
                        <X size={24} />
                    </button>

                    {/* 🌸 Main Animation Container */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">

                        {/* THE ROSE CONTAINER - Swaying Animation */}
                        <motion.div
                            className="relative w-[500px] h-[700px] flex items-end justify-center mb-10"
                            animate={{ rotate: [0, 1, 0, -1, 0] }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            style={{ transformOrigin: "bottom center" }}
                        >

                            {/* SVG DEFINTIONS for Gradients/Filters */}
                            <svg width="0" height="0" className="absolute">
                                <defs>
                                    <linearGradient id="stemGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#0f172a" />
                                        <stop offset="50%" stopColor="#1e3a8a" />
                                        <stop offset="100%" stopColor="#0f172a" />
                                    </linearGradient>
                                    <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#334155" />
                                        <stop offset="100%" stopColor="#0f172a" />
                                    </linearGradient>

                                    {/* === NEW REALISTIC PALETTE === */}
                                    {/* Deep Velvet (Shadows) - Dark Indigo/Black */}
                                    <radialGradient id="petalGradientVelvet" cx="50%" cy="70%" r="80%">
                                        <stop offset="0%" stopColor="#4c1d95" /> {/* violet */}
                                        <stop offset="60%" stopColor="#2e1065" /> {/* deep violet */}
                                        <stop offset="100%" stopColor="#020617" /> {/* almost black */}
                                    </radialGradient>

                                    {/* Vibrant Magenta (Highlights) - Pinkish Purple */}
                                    <radialGradient id="petalGradientBright" cx="30%" cy="30%" r="90%">
                                        <stop offset="0%" stopColor="#f0abfc" /> {/* fuchsia-300 */}
                                        <stop offset="40%" stopColor="#d946ef" /> {/* fuchsia-500 */}
                                        <stop offset="100%" stopColor="#86198f" /> {/* fuchsia-900 */}
                                    </radialGradient>

                                    {/* Royal Purple (Mid-tones) - Rich Purple/Blue */}
                                    <radialGradient id="petalGradientRoyal" cx="50%" cy="50%" r="70%">
                                        <stop offset="20%" stopColor="#a855f7" /> {/* purple-500 */}
                                        <stop offset="100%" stopColor="#581c87" /> {/* purple-900 */}
                                    </radialGradient>

                                    {/* Soft Glow core */}
                                    <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="rgba(240, 171, 252, 0.8)" />
                                        <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                                    </radialGradient>

                                    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                    <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
                                        <feGaussianBlur stdDeviation="15" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>
                            </svg>

                            {/* 1. SEED */}
                            <AnimatePresence>
                                {animationStage === 'seed' && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: 1,
                                            boxShadow: ["0 0 15px 2px #d8b4fe", "0 0 30px 8px #f0abfc", "0 0 15px 2px #d8b4fe"]
                                        }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute bottom-20 w-4 h-4 bg-white rounded-full blur-[1px]"
                                    />
                                )}
                            </AnimatePresence>

                            {/* MAIN FLOWER SVG */}
                            <svg
                                width="500"
                                height="700"
                                viewBox="0 0 500 700"
                                className="overflow-visible"
                                style={{ filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.6))" }}
                            >
                                {/* 2. STEM - Kept same size (not bigger) */}
                                {(animationStage !== 'seed') && (
                                    <motion.g>
                                        <motion.path
                                            d="M245,680 C245,600 230,500 250,400 C265,320 250,250 250,250"
                                            fill="none"
                                            stroke="url(#stemGradient)"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 4, ease: "easeOut" }}
                                        />
                                        {/* Thorns */}
                                        <motion.path
                                            d="M242,550 Q230,560 225,545"
                                            stroke="#1e3a8a" strokeWidth="2" fill="none"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
                                        />
                                    </motion.g>
                                )}

                                {/* 3. LEAVES - Darker, more realistic */}
                                {['leaves', 'bud', 'bloom', 'message'].includes(animationStage) && (
                                    <motion.g>
                                        <motion.path
                                            d="M245,520 Q180,500 160,450 Q220,480 245,510"
                                            fill="url(#leafGradient)"
                                            stroke="#0f172a" strokeWidth="1"
                                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 1.5, type: "spring" }}
                                            style={{ transformOrigin: "245px 520px" }}
                                        />
                                    </motion.g>
                                )}

                                {/* 4. THE ROSE HEAD - SUPER SIZED & COLORFUL */}
                                {['bud', 'bloom', 'message'].includes(animationStage) && (
                                    <motion.g
                                        initial={{ scale: 0.1, opacity: 0 }}
                                        animate={{ scale: animationStage === 'bud' ? 0.4 : 1.7, opacity: 1 }} // SCALED UP TO 1.7!
                                        transition={{ duration: 3, ease: "easeInOut" }}
                                        style={{ transformOrigin: "250px 250px" }}
                                    >
                                        {/* Sepals */}
                                        <g>
                                            <motion.path d="M235,260 Q220,300 200,320 L245,270" fill="#0f172a" />
                                            <motion.path d="M265,260 Q280,300 300,320 L255,270" fill="#0f172a" />
                                        </g>

                                        {/* === MULTI-COLOR PETAL SYSTEM === */}
                                        <g filter="url(#softGlow)">

                                            {/* OUTER LAYER - DEEP VELVET (Dark Purple/Black) */}
                                            <motion.path
                                                d="M200,240 C150,150 350,150 300,240 C300,320 200,320 200,240"
                                                fill="url(#petalGradientVelvet)"
                                                initial={{ scale: 0.5 }}
                                                animate={{
                                                    scale: 1,
                                                    d: animationStage === 'bud'
                                                        ? "M220,240 C200,200 300,200 280,240 C280,280 220,280 220,240"
                                                        : "M170,220 C80,80 420,80 330,220 C330,360 170,360 170,220" // Extra Wide Open
                                                }}
                                                transition={{ duration: 3.5 }}
                                            />

                                            {/* MID LAYER 1 - ROYAL PURPLE */}
                                            <motion.path
                                                d="M220,250 Q180,180 240,160 Q300,180 260,250"
                                                fill="url(#petalGradientRoyal)"
                                                initial={{ scale: 0.5 }}
                                                animate={{ x: -25, rotate: -15, scale: 1.1 }}
                                                transition={{ duration: 3, delay: 0.2 }}
                                            />
                                            <motion.path
                                                d="M280,250 Q320,180 260,160 Q200,180 240,250"
                                                fill="url(#petalGradientRoyal)"
                                                initial={{ scale: 0.5 }}
                                                animate={{ x: 25, rotate: 15, scale: 1.1 }}
                                                transition={{ duration: 3, delay: 0.2 }}
                                            />

                                            {/* MID LAYER 2 - BRIGHT MAGENTA HIGHLIGHTS */}
                                            <motion.path
                                                d="M250,280 Q180,200 250,140 Q320,200 250,280"
                                                fill="url(#petalGradientBright)"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: animationStage === 'bud' ? 0.6 : 1.05 }}
                                                transition={{ duration: 3, delay: 0.4 }}
                                            />

                                            {/* CORE CENTER - GLOWING HEART SHAPE */}
                                            <motion.path
                                                d="M250,240 C230,220 230,200 250,190 C270,200 270,220 250,240"
                                                fill="#fdf4ff" // Nearly white center
                                                filter="url(#strongGlow)"
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{
                                                    scale: (animationStage === 'bloom' || animationStage === 'message') ? 1.4 : 0,
                                                    opacity: 1
                                                }}
                                                transition={{ duration: 2.5, delay: 0.8 }}
                                            />
                                        </g>

                                        {/* Pollen/Sparkles */}
                                        {(animationStage === 'bloom' || animationStage === 'message') && (
                                            <g>
                                                <motion.circle cx="250" cy="220" r="3" fill="#fef08a" filter="url(#glow)" animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                                            </g>
                                        )}
                                    </motion.g>
                                )}
                            </svg>

                            {/* 🐰 KAWAII BUNNY WATCHING THE FLOWER */}
                            <motion.div
                                className="absolute bottom-10 -right-20 w-32 h-32 pointer-events-none"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{
                                    y: animationStage === 'seed' ? 0 :
                                        (animationStage === 'bloom' || animationStage === 'message') ? [0, -15, 0] : 0, // Jump for joy
                                    opacity: 1,
                                    rotate: (animationStage === 'bloom' || animationStage === 'message') ? [0, -5, 5, 0] : 0
                                }}
                                transition={{ duration: 0.5, delay: 1 }}
                            >
                                {/* Simple Kawaii Bunny SVG */}
                                <svg viewBox="0 0 100 100" className="drop-shadow-lg">
                                    <g filter="url(#softGlow)">
                                        {/* Ears */}
                                        <motion.ellipse cx="35" cy="20" rx="8" ry="25" fill="#fff" stroke="#f3e8ff" strokeWidth="2"
                                            animate={{ rotate: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }} />
                                        <motion.ellipse cx="65" cy="20" rx="8" ry="25" fill="#fff" stroke="#f3e8ff" strokeWidth="2"
                                            animate={{ rotate: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} />
                                        {/* Head */}
                                        <circle cx="50" cy="60" r="25" fill="#fff" stroke="#f3e8ff" strokeWidth="2" />
                                        {/* Eyes (Happy arcs or dots) */}
                                        {['bloom', 'message'].includes(animationStage) ? (
                                            <>
                                                <path d="M40,55 Q45,50 50,55" stroke="#4c1d95" strokeWidth="2" fill="none" /> {/* Happy eyes */}
                                                <path d="M60,55 Q55,50 50,55" stroke="#4c1d95" strokeWidth="2" fill="none" />
                                            </>
                                        ) : (
                                            <>
                                                <circle cx="42" cy="58" r="3" fill="#0f172a" />
                                                <circle cx="58" cy="58" r="3" fill="#0f172a" />
                                            </>
                                        )}
                                        {/* Cheeks */}
                                        <circle cx="38" cy="65" r="4" fill="#f472b6" opacity="0.6" />
                                        <circle cx="62" cy="65" r="4" fill="#f472b6" opacity="0.6" />
                                        {/* Mouth */}
                                        <path d="M47,65 Q50,68 53,65" stroke="#0f172a" strokeWidth="1.5" fill="none" />

                                        {/* Paws (Peeking) */}
                                        {animationStage === 'seed' && (
                                            <>
                                                <ellipse cx="35" cy="80" rx="6" ry="4" fill="#fff" />
                                                <ellipse cx="65" cy="80" rx="6" ry="4" fill="#fff" />
                                            </>
                                        )}
                                    </g>
                                </svg>

                                {/* Emotion Bubble */}
                                {['bloom', 'message'].includes(animationStage) && (
                                    <motion.div
                                        initial={{ scale: 0, y: 10 }}
                                        animate={{ scale: 1, y: 0 }}
                                        className="absolute -top-4 right-0 text-2xl"
                                    >
                                        💖
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Floating Multi-colored Particles */}
                            {(animationStage === 'bloom' || animationStage === 'message') && (
                                <div className="absolute inset-0 pointer-events-none">
                                    {floatingParticles.map((p, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
                                            animate={{
                                                opacity: [0, 1, 0],
                                                y: p.y,
                                                x: p.x,
                                                scale: p.scale,
                                                rotate: p.rotate
                                            }}
                                            transition={{
                                                duration: p.duration,
                                                repeat: Infinity,
                                                delay: p.delay,
                                                ease: "easeOut"
                                            }}
                                            className="absolute bottom-1/2 left-1/2"
                                        >
                                            {/* Randomly choose Heart or Star or Sparkle */}
                                            {i % 3 === 0 ? (
                                                <Heart className="fill-pink-400 text-pink-400 blur-[0.5px]" size={p.size} />
                                            ) : i % 3 === 1 ? (
                                                <Stars className="fill-purple-300 text-purple-300" size={p.size} />
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-white blur-[1px]" />
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                        </motion.div>

                        {/* 💌 MESSAGE CARD */}
                        <AnimatePresence>
                            {animationStage === 'message' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                                    className="absolute bottom-16 z-50 w-full max-w-md text-center px-4 pointer-events-auto"
                                >
                                    <motion.div
                                        className="bg-pink-950/40 backdrop-blur-md border-[3px] border-pink-200/40 p-6 rounded-[3rem] relative overflow-hidden flex flex-col items-center shadow-[0_0_50px_rgba(236,72,153,0.3)]"
                                        initial={{ boxShadow: "0 0 0 rgba(236, 72, 153, 0)" }}
                                        animate={{ boxShadow: "0 0 50px rgba(236, 72, 153, 0.4)" }}
                                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                                    >
                                        {/* Cute Corner Decorations */}
                                        <Heart className="absolute top-4 left-4 text-pink-300/50 -rotate-12" size={24} fill="currentColor" />
                                        <Heart className="absolute top-4 right-4 text-pink-300/50 rotate-12" size={24} fill="currentColor" />
                                        <Heart className="absolute bottom-4 left-4 text-pink-300/50 rotate-45" size={18} fill="currentColor" />
                                        <Heart className="absolute bottom-4 right-4 text-pink-300/50 -rotate-45" size={18} fill="currentColor" />

                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer pointer-events-none" />

                                        {/* 📸 COUPLE PHOTO (Heart Shape) */}
                                        <motion.div
                                            initial={{ scale: 0, rotate: -10 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
                                            className="relative w-48 h-48 mb-4 shrink-0"
                                        >
                                            <div className="absolute inset-0 bg-pink-500 rounded-full blur-md opacity-50 animate-pulse-slow"></div>
                                            <div className="relative w-full h-full rounded-full border-4 border-pink-200 overflow-hidden shadow-xl">
                                                {/* Using standard img for simplicity in this overlay */}
                                                <Image
                                                    src="/valentine-us.png"
                                                    alt="Us"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            {/* Cute floaty elements around photo */}
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute -top-2 -right-2 text-2xl"
                                            >
                                                ✨
                                            </motion.div>
                                        </motion.div>

                                        <motion.h1
                                            className="text-3xl md:text-5xl font-script text-white mb-3 drop-shadow-md"
                                            style={{ fontFamily: "'Dancing Script', cursive" }}
                                        >
                                            Happy Valentine’s Day,<br />My Love
                                        </motion.h1>

                                        <motion.p
                                            className="text-sm md:text-base text-pink-50 font-medium leading-relaxed italic opacity-90 mb-6"
                                            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                                        >
                                            &quot;With you, every day feels softer and brighter, a comfort that reminds me of home and peace placed in my heart by Allah.
                                            I’m deeply grateful to share this life, this love, and every quiet blessing in between with you.
                                            May Allah protect us, strengthen our bond, and continue to bless our hearts and our journey together.&quot;
                                        </motion.p>

                                        <motion.button
                                            onClick={onClose}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold uppercase tracking-widest shadow-lg hover:shadow-pink-500/50 transition-all flex items-center gap-2"
                                        >
                                            <Heart size={12} className="fill-white animate-bounce" />
                                            <span>Forever & Always</span>
                                            <Heart size={12} className="fill-white animate-bounce" />
                                        </motion.button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <style jsx global>{`
                        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
                        .font-script {
                            font-family: 'Dancing Script', cursive;
                        }
                        @keyframes shimmer {
                            0% { transform: translateX(-100%) skewX(-12deg); }
                            100% { transform: translateX(200%) skewX(-12deg); }
                        }
                        .animate-shimmer {
                            animation: shimmer 8s infinite linear;
                        }
                         @keyframes pulse-slow {
                            0%, 100% { opacity: 0.5; transform: scale(1); }
                            50% { opacity: 0.7; transform: scale(1.05); }
                        }
                        .animate-pulse-slow {
                            animation: pulse-slow 6s ease-in-out infinite;
                        }
                    `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
