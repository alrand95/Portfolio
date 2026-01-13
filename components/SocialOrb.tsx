'use client';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ReactNode, useRef, useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SocialOrbProps {
    href: string;
    icon: ReactNode;
    delay?: number;
    iconUrl?: string;
    platform?: string; // Added for tooltip
}

export const SocialOrb = ({ href, icon, delay = 0, iconUrl, platform = "Link" }: SocialOrbProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // --- Physics for Magnetic Effect ---
    // We map mouse position relative to center of the button
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring physics for smooth "catch up"
    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const mouseX = useSpring(x, springConfig);
    const mouseY = useSpring(y, springConfig);

    // Memoize random coordinates for sparkles to avoid hydration mismatch
    const [randomCoords, setRandomCoords] = useState<{ x: number; y: number }[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRandomCoords(Array.from({ length: 3 }).map(() => ({
                x: (Math.random() - 0.5) * 60,
                y: (Math.random() - 0.5) * 60
            })));
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Internal icon moves slightly MORE than the container for parallax depth
    const iconX = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
    const iconY = useTransform(mouseY, [-0.5, 0.5], [-8, 8]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXRel = e.clientX - rect.left - width / 2;
        const mouseYRel = e.clientY - rect.top - height / 2;

        // Normalize values (-0.5 to 0.5) roughly
        x.set(mouseXRel);
        y.set(mouseYRel);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay, type: 'spring', stiffness: 200, damping: 15 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={handleMouseLeave}
            onTouchMove={(e) => {
                // Prevent scrolling while interacting with the orb
                // e.preventDefault(); // React synthetic event doesn't always support this well in passive listeners

                if (!ref.current) return;
                const touch = e.touches[0];
                const rect = ref.current.getBoundingClientRect();
                const width = rect.width;
                const height = rect.height;
                const touchXRel = touch.clientX - rect.left - width / 2;
                const touchYRel = touch.clientY - rect.top - height / 2;

                x.set(touchXRel);
                y.set(touchYRel);
            }}
            className="relative group z-10"
            style={{ x: mouseX, y: mouseY }}
        >
            <Link href={href} className="relative block" target="_blank">
                {/* --- Tooltip (Holographic Projection) --- */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: -45, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-50 whitespace-nowrap"
                        >
                            <div className="
                                relative px-3 py-1.5
                                bg-black/80 backdrop-blur-md
                                border border-neon-pink/50
                                rounded-lg
                                shadow-[0_0_15px_rgba(255,77,166,0.3)]
                            ">
                                {/* Decor: Tiny connector line */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[4px] w-1.5 h-1.5 bg-neon-pink/50 rotate-45 border-r border-b border-neon-pink/50 bg-black" />

                                <span className="text-[10px] font-bold tracking-widest text-neon-pink uppercase drop-shadow-[0_0_5px_rgba(255,77,166,0.8)]">
                                    {platform}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>


                {/* Glow Ring - Pulse Animation (Optimized) */}
                <div className="absolute inset-0 rounded-full bg-neon-pink opacity-0 group-hover:opacity-40 blur-md transition-all duration-300 scale-150 pointer-events-none" />

                {/* Magical Sparkles (Particles) */}
                <AnimatePresence>
                    {isHovered && (
                        <>
                            {randomCoords.map((coords, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute inset-0 m-auto w-1 h-1 bg-white rounded-full pointer-events-none"
                                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0, 1.5, 0],
                                        x: coords.x,
                                        y: coords.y
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                                />
                            ))}
                        </>
                    )}
                </AnimatePresence>

                {/* Orb Body - Glassmorphism */}
                <div className={cn(
                    "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center",
                    "bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md border border-white/20",
                    "group-hover:border-neon-pink/50 group-hover:bg-white/20 transition-colors duration-300",
                    "text-white shadow-[0_4px_10px_rgba(0,0,0,0.2)]",
                    "overflow-hidden" // Keep content inside
                )}>
                    {/* Internal Shine Wipe */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out pointer-events-none" />

                    {/* Content Container with Parallax Parallax */}
                    <motion.div
                        style={{ x: iconX, y: iconY }}
                        className="relative z-10 w-full h-full p-2.5 flex items-center justify-center"
                    >
                        {iconUrl ? (
                            <Image
                                src={iconUrl}
                                alt={platform}
                                fill
                                className="object-cover rounded-full opacity-90 group-hover:opacity-100 transition-opacity pointer-events-none select-none"
                                draggable={false}
                                onContextMenu={(e) => e.preventDefault()}
                            />
                        ) : (
                            <div className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                                {icon}
                            </div>
                        )}
                    </motion.div>
                </div>
            </Link>
        </motion.div>
    );
};
