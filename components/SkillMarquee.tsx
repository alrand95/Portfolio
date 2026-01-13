"use client";

import { motion } from "framer-motion";

const skills = [
    "NEXT.JS 14", "REACT", "TYPESCRIPT", "TAILWIND CSS", "FRAMER MOTION",
    "SUPABASE", "POSTGRESQL", "UI/UX DESIGN", "BRANDING", "3D MODELING",
    "FIGMA", "ADOBE CREATIVE SUITE", "GSAP", "WEBGL"
];

export function SkillMarquee() {
    return (
        <div className="w-full py-20 overflow-hidden bg-black border-y border-white/5 relative z-20">
            {/* Gradient Masks for fade effect at edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            >
                {/* Double list for infinite loop */}
                {[...skills, ...skills].map((skill, i) => (
                    <div
                        key={i}
                        className="group inline-block px-8 relative cursor-default"
                    >
                        <span className="text-6xl md:text-8xl font-black font-[family-name:var(--font-baloo)] text-transparent stroke-text group-hover:text-neon-pink transition-all duration-300">
                            {skill}
                        </span>
                        {/* Outline Styling via CSS or Inline Style (using local style for text-stroke if not in globals) */}
                        <style jsx>{`
              .stroke-text {
                -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
              }
              .group:hover .stroke-text {
                 -webkit-text-stroke: 1px #FF4DA6;
                 text-shadow: 0 0 30px rgba(255, 77, 166, 0.5);
              }
            `}</style>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
