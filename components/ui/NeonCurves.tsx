'use client';

import { motion } from 'framer-motion';

export function NeonCurves() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden text-pink-500/30">

            {/* Left Curves */}
            <motion.svg
                viewBox="0 0 400 600"
                className="absolute top-1/2 -translate-y-1/2 left-0 h-[80vh] w-auto max-w-[40vw] -ml-10 md:ml-0"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <defs>
                    <linearGradient id="neonGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(236, 72, 153, 0)" />
                        <stop offset="50%" stopColor="rgba(236, 72, 153, 0.8)" />
                        <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                    </linearGradient>
                    <filter id="glowLeft">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Multiple overlapping curves for the 'stream' effect */}
                <motion.path
                    d="M -50 400 Q 150 300 350 100"
                    stroke="url(#neonGradLeft)" strokeWidth="8" fill="none" strokeLinecap="round" filter="url(#glowLeft)"
                    animate={{ d: ["M -50 400 Q 150 300 350 100", "M -50 410 Q 160 310 360 90", "M -50 400 Q 150 300 350 100"] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.path
                    d="M -50 450 Q 180 350 380 50"
                    stroke="url(#neonGradLeft)" strokeWidth="6" fill="none" strokeLinecap="round" filter="url(#glowLeft)"
                    animate={{ d: ["M -50 450 Q 180 350 380 50", "M -50 440 Q 170 340 370 60", "M -50 450 Q 180 350 380 50"] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <motion.path
                    d="M -50 500 Q 120 400 300 150"
                    stroke="url(#neonGradLeft)" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" filter="url(#glowLeft)"
                    animate={{ d: ["M -50 500 Q 120 400 300 150", "M -50 510 Q 110 410 290 140", "M -50 500 Q 120 400 300 150"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
            </motion.svg>

            {/* Right Curves (Mirrored) */}
            <motion.svg
                viewBox="0 0 400 600"
                className="absolute top-1/2 -translate-y-1/2 right-0 h-[80vh] w-auto max-w-[40vw] -mr-10 md:mr-0 scale-x-[-1]"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <defs>
                    <linearGradient id="neonGradRight" x1="0%" y1="0%" x2="100%" y2="0%">
                        {/* Same gradient logic but applied to mirrored SVG */}
                        <stop offset="0%" stopColor="rgba(236, 72, 153, 0)" />
                        <stop offset="50%" stopColor="rgba(236, 72, 153, 0.8)" />
                        <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                    </linearGradient>
                    <filter id="glowRight">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <motion.path
                    d="M -50 400 Q 150 300 350 100"
                    stroke="url(#neonGradRight)" strokeWidth="8" fill="none" strokeLinecap="round" filter="url(#glowRight)"
                    animate={{ d: ["M -50 400 Q 150 300 350 100", "M -50 410 Q 160 310 360 90", "M -50 400 Q 150 300 350 100"] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.path
                    d="M -50 450 Q 180 350 380 50"
                    stroke="url(#neonGradRight)" strokeWidth="6" fill="none" strokeLinecap="round" filter="url(#glowRight)"
                    animate={{ d: ["M -50 450 Q 180 350 380 50", "M -50 440 Q 170 340 370 60", "M -50 450 Q 180 350 380 50"] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <motion.path
                    d="M -50 500 Q 120 400 300 150"
                    stroke="url(#neonGradRight)" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" filter="url(#glowRight)"
                    animate={{ d: ["M -50 500 Q 120 400 300 150", "M -50 510 Q 110 410 290 140", "M -50 500 Q 120 400 300 150"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
            </motion.svg>
        </div>
    );
}
