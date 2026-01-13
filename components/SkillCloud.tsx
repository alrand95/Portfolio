'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Sparkles, Zap, Star, Hexagon, Crown, Heart, PawPrint } from 'lucide-react';

interface SkillCloudProps {
    skills: any[];
}

// --- Skill Card Component (Extracted for individual state) ---
const SkillCard = ({
    skill,
    index,
    isActive,
    onToggle
}: {
    skill: any,
    index: number,
    isActive: boolean,
    onToggle: () => void
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const skillName = typeof skill === 'string' ? skill : skill.name;

    // Helper to get a random-ish icon based on string length if no icon provided
    const getIcon = (name: string, i: number) => {
        const icons = [Sparkles, Zap, Star, Hexagon, Crown];
        const IconComponent = icons[i % icons.length];
        return <IconComponent size={24} />;
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0, scale: 0.8 },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 10
            } as any
        }
    };

    return (
        <motion.div
            variants={itemVariants}
            className="group relative flex justify-center" // Center item in grid cell
        >
            {/* Continuous Floating Animation Wrapper */}
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                    duration: 3 + (index % 3),
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: (index % 5) * 0.4
                }}
            >
                {/* Main Card Body - PLUSHIE STYLE */}
                <motion.div
                    initial="rest"
                    animate={(isHovered || isActive) ? "hover" : "rest"}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    onTap={onToggle}
                    whileTap={{ scale: 0.95 }}
                    variants={{
                        hover: { scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="
                        relative
                        w-32 h-40 md:w-48 md:h-60
                        rounded-[24px] md:rounded-[40px]
                        bg-white/20
                        backdrop-blur-md
                        border-4 border-white/40
                        flex flex-col items-center justify-between
                        p-3 pt-6 md:p-6 md:pt-9
                        shadow-2xl
                        z-10
                        overflow-visible
                        cursor-pointer
                    "
                    style={{
                        boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    {/* STITCHED BORDER EFFECT */}
                    <div className="absolute inset-1.5 md:inset-2 rounded-[24px] md:rounded-[32px] border-2 border-dashed border-white/30 pointer-events-none" />

                    {/* 🐰 HOVER EARS ANIMATION (Nav Design + Old Wiggle Effect) */}
                    <motion.div
                        className="absolute left-0 right-0 mx-auto w-full flex justify-center gap-2 top-0 z-0 pointer-events-none"
                        variants={{
                            visible: { opacity: 0, y: 10 },
                            hover: { opacity: 1, y: -24 }
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                        {/* Left Ear - Pink (Wiggles Left) */}
                        <motion.div
                            className="w-4 h-8 bg-pink-500 rounded-full shadow-[0_0_10px_#FF4DA6]"
                            variants={{
                                visible: { rotate: -12 },
                                hover: {
                                    rotate: [-12, -20, -5, -12],
                                    transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                                }
                            }}
                        />
                        {/* Right Ear - Purple (Wiggles Right) */}
                        <motion.div
                            className="w-4 h-8 bg-purple-500 rounded-full shadow-[0_0_10px_#9B5CFF]"
                            variants={{
                                visible: { rotate: 12 },
                                hover: {
                                    rotate: [12, 20, 5, 12],
                                    transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.1 }
                                }
                            }}
                        />
                    </motion.div>

                    {/* Pastel Gradient Overlay (Milky) */}
                    <div className="absolute inset-0 rounded-[30px] md:rounded-[36px] bg-gradient-to-b from-white/10 to-transparent opacity-50" />

                    {/* CUTE STICKERS (Top Corners) */}
                    <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 text-pink-400 rotate-[-20deg] animate-pulse">
                        <Heart fill="currentColor" size={20} className="md:w-6 md:h-6" />
                    </div>
                    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 text-yellow-300 rotate-[15deg]">
                        <Star fill="currentColor" size={16} className="md:w-5 md:h-5" />
                    </div>

                    {/* Icon Bubble */}
                    <div className="
                                        relative w-14 h-14 md:w-18 md:h-18
                                        rounded-full
                                        bg-white
                                        shadow-[0_5px_15px_rgba(0,0,0,0.1)]
                                        flex items-center justify-center
                                        text-pink-500
                                        group-hover:scale-110 group-hover:rotate-12
                                        transition-transform duration-300
                                        z-20
                                        p-3 md:p-4
                                    ">
                        {getIcon(skillName, index)}
                    </div>

                    {/* Text */}
                    <div className="relative z-20 text-center mt-1 md:mt-2 flex-grow flex items-center">
                        <h3 className="text-white font-[family-name:var(--font-baloo)] text-base md:text-2xl leading-5 drop-shadow-md group-hover:text-pink-200 transition-colors">
                            {skillName}
                        </h3>
                    </div>

                    {/* Decorative Dots (Cheeks) */}
                    <div className="relative z-20 flex gap-3 md:gap-4 opacity-60">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-pink-300 blur-[1px]" />
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-pink-300 blur-[1px]" />
                    </div>

                    {/* Little Paw Interaction Wrapper */}
                    <div className="absolute -bottom-3 -right-0 md:-bottom-4 md:-right-1 z-40 pointer-events-none">
                        {/* The Cute Paw (Icon Version) */}
                        <motion.div
                            className="
                                                relative w-8 h-8 md:w-10 md:h-10 
                                                bg-white rounded-full 
                                                border border-pink-100 shadow-lg 
                                                flex items-center justify-center
                                                text-pink-300
                                            "
                            initial={{ rotate: -20, x: 10, y: 10, opacity: 0 }}
                            variants={{
                                hover: {
                                    x: -12,
                                    y: -8,
                                    opacity: 1,
                                    rotate: -15,
                                    scale: 1.1,
                                    transition: { type: "spring", stiffness: 200, delay: 0.1 }
                                }
                            }}
                        >
                            <PawPrint size={20} className="md:w-6 md:h-6" fill="currentColor" />
                        </motion.div>
                    </div>

                    {/* Bunny Tail (Wags on hover) */}
                    <motion.div
                        className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center z-30 origin-top"
                        variants={{
                            hover: {
                                rotate: [0, 15, -15, 0],
                                scale: 1.1,
                                transition: {
                                    rotate: { repeat: Infinity, duration: 0.6, ease: "linear" }
                                }
                            }
                        }}
                    >
                        <div className="w-7 h-7 md:w-9 md:h-9 rounded-full border border-gray-100 shadow-inner bg-gradient-to-tr from-gray-50 to-white" />
                    </motion.div>

                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export const SkillCloud = ({ skills }: SkillCloudProps) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        if (activeIndex === index) {
            setActiveIndex(null); // Close if tapping the same one
        } else {
            setActiveIndex(index); // Open new one (auto-closes others)
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="relative w-full max-w-6xl mx-auto py-12 md:py-24 flex flex-col items-center justify-center overflow-visible">

            {/* Section Header */}
            <div className="text-center mb-12 md:mb-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className="inline-block relative"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-[family-name:var(--font-baloo)] text-transparent bg-clip-text bg-gradient-to-br from-white via-pink-200 to-purple-200 drop-shadow-[0_4px_0_rgba(255,77,166,0.4)]">
                        Magic Abilities
                    </h2>
                    {/* Cute floating elements near title */}
                    <div className="absolute -top-4 -right-6 text-2xl md:text-4xl animate-bounce">✨</div>
                    <div className="absolute -bottom-2 -left-6 text-2xl md:text-4xl animate-pulse">🌸</div>
                </motion.div>
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="h-1.5 md:h-2 w-32 md:w-48 mx-auto mt-4 bg-gradient-to-r from-transparent via-pink-400 to-transparent rounded-full opacity-60"
                />
            </div>

            {/* Skills Grid - "Plushie Bunny Cards" */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                // MOBILE: Grid 2 cols | DESKTOP: Flex row centered
                className="grid grid-cols-2 gap-4 px-2 md:flex md:flex-wrap md:justify-center md:gap-10 md:px-4 relative z-10 w-full max-w-sm md:max-w-none"
            >
                {skills.map((skill, i) => (
                    <SkillCard
                        key={i}
                        skill={skill}
                        index={i}
                        isActive={activeIndex === i}
                        onToggle={() => handleToggle(i)}
                    />
                ))}
            </motion.div>

            {/* Background Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-radial-gradient from-purple-900/20 to-transparent blur-[100px] opacity-30" />
            </div>

        </div>
    );
};
