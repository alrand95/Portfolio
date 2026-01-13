'use client';

import { motion, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

type BunnyProps = {
    className?: string;
    pose?: 'floating' | 'sitting' | 'peeking';
    primaryColor?: string; // e.g. #FFC8DD (pastel pink)
    secondaryColor?: string; // e.g. #FFAFCC (darker pink)
};

export function CodeBunny({
    className = "",
    pose = 'floating',
    primaryColor = "#e9d5ff", // lavender-ish
    secondaryColor = "#d8b4fe"
}: BunnyProps) {
    const [blink, setBlink] = useState(false);

    // Blinking logic
    useEffect(() => {
        const blinkInterval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 200);
        }, 4000);
        return () => clearInterval(blinkInterval);
    }, []);

    const variants: Variants = {
        floating: {
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
            transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        },
        sitting: {
            scaleY: [1, 1.05, 1],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        },
        peeking: {
            y: [0, -5, 0],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
    };

    return (
        <motion.div
            className={`relative w-48 h-48 ${className}`}
            animate={pose}
            variants={variants}
        >
            <svg
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-xl"
            >
                {/* --- BODY --- */}
                {pose === 'sitting' && (
                    <motion.path
                        d="M60 140 C40 140, 30 200, 100 200 C170 200, 160 140, 140 140 C140 110, 60 110, 60 140 Z"
                        fill={primaryColor}
                    />
                )}
                {pose === 'floating' && (
                    <motion.ellipse cx="100" cy="140" rx="55" ry="45" fill={primaryColor} />
                )}

                {/* --- LONG BUNNY EARS --- */}
                {/* Left Ear - Much longer and rounder */}
                <motion.g
                    animate={{ rotate: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ originX: "70px", originY: "70px" }}
                >
                    <path
                        d="M70 80 C60 10, 40 10, 50 80"
                        fill={primaryColor}
                        stroke={secondaryColor}
                        strokeWidth="2"
                    />
                    <path
                        d="M65 75 C60 30, 50 30, 55 75"
                        fill={secondaryColor}
                        opacity="0.6"
                    />
                </motion.g>

                {/* Right Ear - Much longer and rounder */}
                <motion.g
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
                    style={{ originX: "130px", originY: "70px" }}
                >
                    <path
                        d="M130 80 C140 10, 160 10, 150 80"
                        fill={primaryColor}
                        stroke={secondaryColor}
                        strokeWidth="2"
                    />
                    <path
                        d="M135 75 C140 30, 150 30, 145 75"
                        fill={secondaryColor}
                        opacity="0.6"
                    />
                </motion.g>

                {/* --- HEAD --- */}
                {/* Wider, rounder head shape */}
                <ellipse cx="100" cy="100" rx="65" ry="55" fill={primaryColor} />

                {/* --- FACE --- */}
                {/* Eyes - Wide set for cuteness */}
                <motion.ellipse
                    cx="75" cy="100" rx="5" ry={blink ? 0.5 : 7}
                    fill="#2a2a2a"
                    animate={{ ry: blink ? 0.5 : 7 }}
                />
                <motion.ellipse
                    cx="125" cy="100" rx="5" ry={blink ? 0.5 : 7}
                    fill="#2a2a2a"
                    animate={{ ry: blink ? 0.5 : 7 }}
                />

                {/* Cheeks - Rosy and prominent */}
                <ellipse cx="65" cy="115" rx="10" ry="6" fill="#fabcdd" opacity="0.6" />
                <ellipse cx="135" cy="115" rx="10" ry="6" fill="#fabcdd" opacity="0.6" />

                {/* Snout/Mouth - Tiny 'Y' shape */}
                <path d="M95 110 Q100 115 105 110" stroke="#555" strokeWidth="2" strokeLinecap="round" fill="none" />
                <line x1="100" y1="112.5" x2="100" y2="105" stroke="#555" strokeWidth="2" strokeLinecap="round" />

                {/* Tiny Nose */}
                <circle cx="100" cy="105" r="3.5" fill="#ec4899" />

                {/* --- WHISKERS (Optional, but adds bunny-ness) --- */}
                <path d="M50 110 L30 105 M50 115 L30 115 M50 120 L30 125" stroke="white" strokeWidth="1.5" opacity="0.5" />
                <path d="M150 110 L170 105 M150 115 L170 115 M150 120 L170 125" stroke="white" strokeWidth="1.5" opacity="0.5" />

                {/* --- PAWS --- */}
                {pose === 'floating' && (
                    <>
                        <motion.circle cx="70" cy="145" r="12" fill="white" animate={{ y: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }} />
                        <motion.circle cx="130" cy="145" r="12" fill="white" animate={{ y: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity }} />
                    </>
                )}
                {pose === 'sitting' && (
                    <>
                        <ellipse cx="80" cy="170" rx="12" ry="15" fill="white" />
                        <ellipse cx="120" cy="170" rx="12" ry="15" fill="white" />
                    </>
                )}
            </svg>
        </motion.div>
    );
}
