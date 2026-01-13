'use client';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useAnimationFrame } from 'framer-motion';
import { useRef, useState, useEffect, memo } from 'react';
import { Flag, Star, Trophy, MapPin, Sparkle, Zap, Activity, Cpu } from 'lucide-react';
import { SparklesText } from '@/components/ui/sparkles-text';

interface JourneyTimelineProps {
    experience: any[];
}

// --- 3D EXPERIENCE CARD COMPONENT ---
const ExperienceCard = memo(({ job, index, isMobile, isEven, swerveWidth, itemHeight }: { job: any, index: number, isMobile: boolean, isEven: boolean, swerveWidth: number, itemHeight: number }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 150, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 150, damping: 30 });

    const mouseX = useSpring(x, { stiffness: 200, damping: 40 });
    const mouseY = useSpring(y, { stiffness: 200, damping: 40 });

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const yOffset = index * itemHeight + 240;

    return (
        <motion.div
            className={`absolute ${!isMobile ? '-translate-x-1/2 -translate-y-1/2' : ''}`}
            style={{
                top: isMobile ? (index * itemHeight + 100) : yOffset,
                left: isMobile ? 60 : '50%',
                x: isMobile ? 0 : (isEven ? swerveWidth : -swerveWidth)
            }}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ margin: "-120px", once: false }}
            transition={{ type: "spring", damping: 15, stiffness: 100, delay: index * 0.05 }}
        >
            <motion.div
                style={{ rotateX, rotateY, perspective: 1000 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`transition-transform duration-300 ease-out will-change-transform relative z-30 ${!isMobile && (isEven ? 'ml-14' : 'mr-14')} w-[calc(100vw-110px)] md:w-[410px] group`}
            >
                {/* Minimalist Brackets with Glow */}
                <div className="absolute -top-4 -left-4 w-10 h-10 border-t-2 border-l-2 border-neon-pink/40 rounded-tl-xl pointer-events-none group-hover:border-neon-pink transition-colors duration-500" />
                <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b-2 border-r-2 border-neon-purple/40 rounded-br-xl pointer-events-none group-hover:border-neon-purple transition-colors duration-500" />

                {/* Scanning line animation */}
                <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.div
                        animate={{ y: ["-100%", "200%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-full h-20 bg-gradient-to-b from-transparent via-neon-pink/10 to-transparent blur-xl"
                    />
                </div>

                {/* Card Content Wrapper */}
                <div className="relative overflow-visible">
                    {/* HUD Coordinates Text - Dynamic */}
                    <motion.div
                        style={{ x: useTransform(mouseX, [-100, 100], [5, -5]), y: useTransform(mouseY, [-100, 100], [5, -5]) }}
                        className="absolute -top-8 left-4 text-[7px] font-mono text-neon-pink/40 uppercase tracking-[0.5em] hidden md:block"
                    >
                        DATA_FRAG_{index}: [{Math.floor(x.get())}/{Math.floor(y.get())}]
                    </motion.div>

                    <div className="absolute -bottom-8 left-4 flex gap-4 text-[6px] font-mono text-white/20 uppercase tracking-widest hidden md:flex">
                        <div className="flex flex-col gap-1 text-right">
                            <div className="flex items-center gap-1 justify-end">
                                <span className="text-[8px] text-white/30 uppercase">Signal</span>
                                <div className="flex gap-0.5">
                                    {[...Array(4)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                height: [2, 4, 3, 5][i],
                                                backgroundColor: i < 3 ? '#FF4DA6' : '#333'
                                            }}
                                            className="w-[2px]"
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: ["60%", "90%", "75%"] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="h-full bg-neon-pink shadow-[0_0_5px_#FF4DA6]"
                                    />
                                </div>
                                <span className="text-[8px] text-neon-pink font-bold">PWR_RESERVE</span>
                            </div>
                        </div>
                    </div>

                    <div className="
                        relative overflow-hidden
                        bg-[#0a0a0c]/80 backdrop-blur-3xl
                        border border-white/5 
                        p-8 md:p-10 rounded-[2.5rem]
                        shadow-[0_30px_60px_rgba(0,0,0,0.6)]
                        hover:border-neon-pink/40 transition-all duration-700 group/card
                    ">
                        {/* Scanline Effect Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-5 group-hover:opacity-20 transition-opacity" />

                        <div className="flex justify-between items-start mb-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-neon-pink text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Activity size={12} className="text-neon-pink animate-pulse" />
                                    Phase_0x0{index + 1}
                                </span>
                                <div className="h-px w-8 bg-neon-pink/30" />
                            </div>
                            <div className="flex flex-col items-end opacity-40 group-hover/card:opacity-100 transition-opacity">
                                <span className="text-[9px] font-mono text-white/50 uppercase tracking-tighter">Sync_Complete</span>
                                <span className="text-white font-mono text-[10px] font-bold">{job.start_date} // {job.end_date || 'LIVE'}</span>
                            </div>
                        </div>

                        <div className="relative">
                            <motion.h3
                                style={{
                                    y: useTransform(mouseX, [-100, 100], [-5, 5]),
                                    textShadow: useTransform(
                                        mouseX,
                                        [-100, 0, 100],
                                        ["2px 0 rgba(255,0,0,0.5), -2px 0 rgba(0,255,255,0.5)", "0px 0 transparent", "-2px 0 rgba(255,0,0,0.5), 2px 0 rgba(0,255,255,0.5)"]
                                    )
                                }}
                                className="text-3xl md:text-4xl font-black text-white mb-4 leading-none tracking-tight group-hover/card:text-neon-pink transition-colors"
                            >
                                {job.role}
                            </motion.h3>
                        </div>

                        <motion.h4
                            style={{ y: useTransform(mouseY, [-100, 100], [-3, 3]) }}
                            className="text-base md:text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-10 flex items-center gap-2"
                        >
                            <Cpu size={18} className="text-purple-400/50" /> {job.company}
                        </motion.h4>

                        <div className="flex flex-wrap gap-2.5 mt-auto">
                            {(job.location || "Vision, Art, Code").split(',').map((tag: string, t: number) => (
                                <span key={t} className="text-[9px] uppercase font-bold tracking-widest bg-white/5 text-white/40 px-3.5 py-1.5 rounded-lg border border-white/5 hover:bg-neon-pink/10 hover:text-neon-pink transition-all">
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>

                        {/* Corner Accents */}
                        <Sparkle size={16} className="absolute bottom-8 right-8 text-white/5 group-hover/card:text-neon-pink/30 group-hover/card:rotate-90 transition-all duration-700" />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
});
ExperienceCard.displayName = 'ExperienceCard';

// --- HUD DECORATIONS ---
const HUDDecoration = ({ className }: { className?: string }) => (
    <div className={`absolute pointer-events-none opacity-20 hidden md:block ${className}`}>
        <div className="flex gap-2">
            <div className="w-1 h-3 bg-neon-pink rounded-full animate-pulse" />
            <div className="text-[8px] font-mono text-white tracking-widest uppercase truncate w-24">System_Sync_0x24</div>
        </div>
        <div className="w-20 h-px bg-gradient-to-r from-neon-pink to-transparent mt-1" />
    </div>
);

// --- 3D TILT CARD COMPONENT (SLEEK VERSION) ---
const TiltCard = memo(({ children, className, index }: { children: React.ReactNode, className?: string, index: number }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 150, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 150, damping: 30 });

    const mouseX = useSpring(x, { stiffness: 200, damping: 40 });
    const mouseY = useSpring(y, { stiffness: 200, damping: 40 });

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(event.clientX - centerX);
        y.set(event.clientY - centerY);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            style={{ rotateX, rotateY, perspective: 1000 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
        >
            {/* Minimalist Brackets with Glow */}
            <div className="absolute -top-4 -left-4 w-10 h-10 border-t-2 border-l-2 border-neon-pink/40 rounded-tl-xl pointer-events-none group-hover:border-neon-pink transition-colors duration-500" />
            <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b-2 border-r-2 border-neon-purple/40 rounded-br-xl pointer-events-none group-hover:border-neon-purple transition-colors duration-500" />

            {/* Scanning line animation */}
            <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.div
                    animate={{ y: ["-100%", "200%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="w-full h-20 bg-gradient-to-b from-transparent via-neon-pink/10 to-transparent blur-xl"
                />
            </div>

            {/* Card Content Wrapper */}
            <div className="relative group overflow-visible">
                {/* HUD Coordinates Text - Dynamic */}
                <motion.div
                    style={{ x: useTransform(mouseX, [-100, 100], [5, -5]), y: useTransform(mouseY, [-100, 100], [5, -5]) }}
                    className="absolute -top-8 left-4 text-[7px] font-mono text-neon-pink/40 uppercase tracking-[0.5em] hidden md:block"
                >
                    DATA_FRAG_{index}: [{Math.floor(x.get())}/{Math.floor(y.get())}]
                </motion.div>

                <div className="absolute -bottom-8 left-4 flex gap-4 text-[6px] font-mono text-white/20 uppercase tracking-widest hidden md:flex">
                    <span>V_0x24</span>
                    <span>MEM_SYC: OK</span>
                    <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>CUR_ACT</motion.span>
                </div>

                {children}
            </div>
        </motion.div>
    );
});
TiltCard.displayName = 'TiltCard';

const letterVariants = {
    hidden: { y: -50, opacity: 0, rotate: -10 },
    visible: { y: 0, opacity: 1, rotate: 0, transition: { type: "spring", stiffness: 200, damping: 10 } as any },
    hover: { y: -10, rotate: [0, -10, 10, 0], color: "#FF4DA6", textShadow: "0 0 8px rgb(255, 77, 166)", transition: { duration: 0.3 } }
};

const AnimatedText = ({ text, className = "", highlight = false }: any) => (
    <span className={`inline-block whitespace-nowrap ${className}`}>
        {text.split("").map((char: string, i: number) => (
            <motion.span key={i} variants={letterVariants} whileHover="hover" className={`inline-block cursor-default ${char === " " ? "w-4" : ""}`}>
                {char}
            </motion.span>
        ))}
    </span>
);

// --- POLISHED BUNNY AVATAR ---
const BunnyAvatar = ({ progress }: { progress: any }) => {
    return (
        <div className="relative">
            {/* Primary Lens Flare */}
            <motion.div
                animate={{
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1, 1.2, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-[-40px] bg-[radial-gradient(circle,#FF4DA6_0%,transparent_70%)] opacity-20 blur-xl pointer-events-none"
            />
            {/* Glow Shell */}
            <div className="absolute inset-0 bg-neon-pink blur-[40px] opacity-30 animate-pulse scale-150" />

            {/* Landing Ripple Effect */}
            <motion.div
                animate={{
                    scale: [1, 2.5],
                    opacity: [0.3, 0],
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-[-20px] rounded-full border border-neon-pink/30 blur-[2px]"
            />

            {/* High-speed particles trail */}
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-20 flex gap-1 pointer-events-none">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ x: [-20, 0], opacity: [0, 0.5, 0], scale: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1 h-px bg-neon-pink"
                    />
                ))}
            </div>

            <motion.div
                animate={{
                    y: [0, -12, 0],
                    rotate: [-3, 3, -3],
                    scale: [1, 1.05, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
            >
                {/* Custom SVG Bunny */}
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(255,77,166,0.5)]">
                    {/* Ears */}
                    <motion.path
                        animate={{ rotate: [-5, 5, -5] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        d="M20 15C20 5 28 5 28 15V25H20V15Z" fill="white" stroke="#FF4DA6" strokeWidth="2"
                    />
                    <motion.path
                        animate={{ rotate: [5, -5, 5] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        d="M36 15C36 5 44 5 44 15V25H36V15Z" fill="white" stroke="#FF4DA6" strokeWidth="2"
                    />
                    {/* Inner Ears */}
                    <path d="M22 15C22 8 26 8 26 15V23H22V15Z" fill="#FFE4F0" />
                    <path d="M38 15C38 8 42 8 42 15V23H38V15Z" fill="#FFE4F0" />
                    {/* Body/Head */}
                    <circle cx="32" cy="35" r="20" fill="white" stroke="#FF4DA6" strokeWidth="2" />
                    {/* Eyes */}
                    <motion.g animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}>
                        <circle cx="25" cy="32" r="2.5" fill="#FF4DA6" />
                        <circle cx="39" cy="32" r="2.5" fill="#FF4DA6" />
                    </motion.g>
                    {/* Cheeks */}
                    <circle cx="20" cy="38" r="3" fill="#FFE4F0" opacity="0.6" />
                    <circle cx="44" cy="38" r="3" fill="#FFE4F0" opacity="0.6" />
                    {/* Nose & Mouth */}
                    <path d="M31 38L32 39L33 38" stroke="#FF4DA6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </motion.div>
        </div>
    );
};

// --- STORY BEAT NODE ---
const StoryBeat = ({ progress, targetProgress, delay }: { progress: any, targetProgress: number, delay: number }) => {
    const isActive = useTransform(progress, (val: number) => val >= targetProgress - 0.02);
    const [active, setActive] = useState(false);

    useEffect(() => {
        return isActive.on("change", (latest: boolean) => {
            if (latest && !active) setActive(true);
            if (!latest && active) setActive(false);
        });
    }, [isActive, active]);

    return (
        <div className="absolute flex items-center justify-center pointer-events-none translate-x-[-50%] translate-y-[-50%]">
            {/* Impact Flash Ring */}
            {active && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-[-20px] bg-white rounded-full blur-md z-0"
                />
            )}

            {/* Checkpoint Rings */}
            {active && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute w-12 h-12 border border-neon-pink rounded-full blur-[1px]"
                />
            )}

            {/* Background Glow */}
            <motion.div
                animate={{
                    scale: active ? 2 : 1,
                    opacity: active ? 0.3 : 0.1,
                    backgroundColor: active ? '#FF4DA6' : '#222'
                }}
                className="absolute w-8 h-8 rounded-full blur-xl transition-colors duration-500"
            />

            {/* The Node */}
            <motion.div
                animate={{
                    scale: active ? 1.5 : 0.8,
                    backgroundColor: active ? '#FF4DA6' : '#444',
                    boxShadow: active ? '0 0 15px #FF4DA6' : '0 0 0px transparent'
                }}
                className="w-3 h-3 rounded-full relative z-10 border border-white/20 transition-all duration-500"
            />

            {/* Crosshair Decorations */}
            {active && (
                <motion.div
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    className="absolute inset-[-12px] opacity-60"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-neon-pink" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-neon-pink" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-3 bg-neon-pink" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[2px] w-3 bg-neon-pink" />
                </motion.div>
            )}
        </div>
    );
};



const ParallaxBackgroundLine = memo(({ index, progress }: { index: number, progress: any }) => {
    const y = useTransform(progress, [0, 1], [0, -200 * (index + 1)]);
    return (
        <motion.div
            style={{
                y,
                left: `${index * 25}%`
            }}
            className="absolute h-[200%] w-px bg-gradient-to-b from-transparent via-white to-transparent"
        />
    );
});
ParallaxBackgroundLine.displayName = 'ParallaxBackgroundLine';

export const JourneyTimeline = ({ experience }: JourneyTimelineProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [seeds, setSeeds] = useState<any[]>([]);
    const [floatingMotes, setFloatingMotes] = useState<any[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMounted(true);
            setSeeds([...Array(12)].map(() => ({
                left: Math.random() * 100,
                top: Math.random() * 100,
                duration: 10 + Math.random() * 15,
                delay: Math.random() * 10
            })));

            setFloatingMotes([...Array(15)].map(() => ({
                x: Math.random() * 100,
                y: Math.random() * 100,
                duration: 10 + Math.random() * 20,
                delay: Math.random() * 10
            })));
        }, 0);

        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => {
            window.removeEventListener('resize', checkMobile);
            clearTimeout(timer);
        };
    }, []);

    // --- PATH PROGRESS HELPERS ---
    const getCubicBezier = (t: number, p0: number, p1: number, p2: number, p3: number) => {
        return Math.pow(1 - t, 3) * p0 + 3 * Math.pow(1 - t, 2) * t * p1 + 3 * (1 - t) * Math.pow(t, 2) * p2 + Math.pow(t, 3) * p3;
    };

    const getSteppedProgress = (val: number) => {
        const N = experience.length;
        if (N === 0) return val;

        const rawIndex = val * N;
        const i = Math.floor(rawIndex);
        const f = rawIndex - i;

        // Create a dwell/plateau at f = 0.5 (center of the segment)
        // Using a smooth step function (sigmoid-like)
        // We want f' to stay near 0.5 for a while
        const plateauWidth = 0.2; // How long to wait at the card
        let steppedF;
        if (f < 0.5 - plateauWidth) {
            steppedF = (f / (0.5 - plateauWidth)) * 0.4;
        } else if (f > 0.5 + plateauWidth) {
            steppedF = 0.6 + ((f - (0.5 + plateauWidth)) / (0.5 - plateauWidth)) * 0.4;
        } else {
            steppedF = 0.5; // Snap to center
        }

        // Soften the snap for organic feel
        // return (i + steppedF) / N;

        // Actually, for better feel, let's use a smoother interpolation
        const smoothF = f < 0.3 ? (f / 0.3) * 0.4 : (f > 0.7 ? 0.6 + ((f - 0.7) / 0.3) * 0.4 : 0.5);
        // This is still a bit harsh. Let's use Math.atan
        const organicF = 0.5 + Math.atan((f - 0.5) * 10) / (Math.PI / 1.1); // range approx 0 to 1 with plateau

        return (i + Math.max(0, Math.min(1, organicF))) / N;
    };

    const ITEM_HEIGHT = 480;
    const MILESTONE_Y = 240; // Card center relative to ITEM_HEIGHT
    const SWERVE_WIDTH = isMobile ? 0 : 200;
    const totalHeight = experience.length * ITEM_HEIGHT;

    // --- PATH GENERATION ---
    const generatePath = () => {
        if (isMobile) {
            return `M 30 0 L 30 ${totalHeight}`;
        } else {
            let path = `M 0 0`;
            experience.forEach((_, i) => {
                const yStart = i * ITEM_HEIGHT;
                const direction = i % 2 === 0 ? 1 : -1;
                // Part 1: Swerve into the card
                path += ` C ${80 * direction} ${yStart + 120}, ${SWERVE_WIDTH * direction} ${yStart + 180}, ${SWERVE_WIDTH * direction} ${yStart + MILESTONE_Y}`;
                // Part 2: Swerve back to center
                path += ` S ${0} ${yStart + 360}, 0 ${yStart + ITEM_HEIGHT}`;
            });
            return path;
        }
    };

    const pathString = generatePath();

    // Track scroll progress with spring for smoothness
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const springProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25, restDelta: 0.001 });

    // --- AVATAR POSITIONING ---
    const steppedProgress = useTransform(springProgress, getSteppedProgress);

    const pathPoints = useTransform(steppedProgress, val => {
        if (isMobile) return { x: 30 - 32, y: val * totalHeight - 32 };

        const N = experience.length;
        const rawIndex = val * N;
        const i = Math.min(Math.floor(rawIndex), N - 1);
        const f = rawIndex - i;
        const yStart = i * ITEM_HEIGHT;
        const direction = i % 2 === 0 ? 1 : -1;

        let x, y;
        if (f < 0.5) {
            // First half of segment (C curve)
            const t = f * 2;
            x = getCubicBezier(t, 0, 80 * direction, SWERVE_WIDTH * direction, SWERVE_WIDTH * direction);
            y = yStart + getCubicBezier(t, 0, 120, 180, MILESTONE_Y);
        } else {
            // Second half of segment (S curve)
            // S curves are implicit C curves: CP1 is reflected CP2 of previous
            // dy = MILESTONE_Y - 180 = 60. Reflect CP2(180) across P(240) -> 300
            const t = (f - 0.5) * 2;
            x = getCubicBezier(t, SWERVE_WIDTH * direction, SWERVE_WIDTH * direction, 0, 0);
            y = yStart + getCubicBezier(t, MILESTONE_Y, 300, 360, ITEM_HEIGHT);
        }

        return { x: x - 48, y: y - 48 };
    });

    const xPos = useTransform(pathPoints, p => p.x);
    const yPos = useTransform(pathPoints, p => p.y);

    return (
        <div ref={containerRef} className="relative w-full max-w-6xl mx-auto py-32 overflow-visible px-4 scroll-smooth">
            {/* Background Parallax Data Streams */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
                {[...Array(5)].map((_, i) => (
                    <ParallaxBackgroundLine key={i} index={i} progress={springProgress} />
                ))}
            </div>
            {/* Floating Motes */}
            {/* Floating Motes */}
            {floatingMotes.map((mote, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-neon-pink rounded-full blur-[1px]"
                    initial={{
                        x: `${mote.x}%`,
                        y: `${mote.y}%`,
                        opacity: 0.1
                    }}
                    animate={{
                        y: ["-20%", "120%"],
                        opacity: [0, 0.4, 0]
                    }}
                    transition={{
                        duration: mote.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: mote.delay
                    }}
                />
            ))}
            {/* Invisible Scroll-Snap Targets */}
            <div className="absolute inset-0 pointer-events-none">
                {experience.map((_, i) => (
                    <div
                        key={`snap-${i}`}
                        className="absolute w-full h-px"
                        style={{
                            top: i * ITEM_HEIGHT + MILESTONE_Y,
                            scrollSnapAlign: 'center'
                        }}
                    />
                ))}
            </div>

            <style jsx global>{`
                @keyframes float-mote {
                    0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
                    25% { opacity: 0.4; }
                    50% { transform: translateY(-100px) translateX(20px) scale(1.5); opacity: 0.6; }
                    75% { opacity: 0.4; }
                    100% { transform: translateY(-200px) translateX(-10px) scale(1); opacity: 0; }
                }
                @keyframes path-pulse {
                    0% { stroke-dashoffset: 1000; }
                    100% { stroke-dashoffset: 0; }
                }
            `}</style>

            {/* CSS DATA MOTES - High Performance Floating Particles - Client Side Only */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {mounted && [...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-neon-pink rounded-full blur-[1px]"
                        style={{
                            left: `${seeds[i]?.left || 0}%`,
                            top: `${seeds[i]?.top || 0}%`,
                            animation: `float-mote ${seeds[i]?.duration || 10}s linear infinite`,
                            animationDelay: `${seeds[i]?.delay || 0}s`
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-52 relative z-20"
            >
                <div className="text-5xl md:text-8xl font-[family-name:var(--font-baloo)] text-white uppercase tracking-tighter leading-none">
                    <div className="flex flex-col items-center justify-center gap-2 mb-4">
                        <motion.div
                            initial={{ width: 0 }} whileInView={{ width: "120px" }}
                            className="h-[2px] bg-gradient-to-r from-transparent via-neon-pink to-transparent"
                        />
                        <span className="text-neon-pink font-mono text-[9px] tracking-[0.8em] uppercase opacity-60">System Log Active</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                        <SparklesText
                            text="The Adventure Log"
                            colors={{ first: '#FF4DA6', second: '#A855F7' }}
                            className="text-5xl md:text-7xl !font-[family-name:var(--font-baloo)] text-white drop-shadow-[0_0_15px_rgba(255,77,166,0.6)]"
                        />
                    </div>
                </div>

                <HUDDecoration className="top-1/2 left-[10%] -translate-y-1/2" />
                <HUDDecoration className="top-1/2 right-[10%] -translate-y-1/2 rotate-180" />
            </motion.div>

            {/* MAP CONTAINER */}
            <div className="relative" style={{ height: totalHeight + 300 }}>

                {/* SVG Path Layer */}
                <svg
                    className={`absolute top-0 overflow-visible ${isMobile ? 'left-0 w-full' : 'left-1/2'}`}
                    style={{ height: totalHeight, width: '1px', pointerEvents: 'none' }}
                >
                    {/* Permanent Tracking Path */}
                    <path d={pathString} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={isMobile ? "10" : "30"} strokeLinecap="round" />
                    <path d={pathString} fill="none" stroke="#A855F7" strokeWidth="1" strokeLinecap="round" strokeDasharray="10 20" className="opacity-10" />

                    {/* Path Pulse Effect */}
                    <path
                        d={pathString} fill="none" stroke="rgba(255, 77, 166, 0.4)" strokeWidth="2" strokeLinecap="round"
                        strokeDasharray="50 950"
                        style={{ animation: 'path-pulse 4s linear infinite' }}
                    />

                    {/* Progress Path (Synced with Bunny) */}
                    <motion.path
                        d={pathString} fill="none" stroke="#FF4DA6" strokeWidth={isMobile ? "4" : "10"} strokeLinecap="round"
                        pathLength={steppedProgress} style={{ pathLength: steppedProgress, filter: 'drop-shadow(0 0 12px #FF4DA6)' }}
                    />
                </svg>

                {/* THE BUNNY AVATAR */}
                <motion.div
                    className={`absolute top-0 w-24 h-24 z-50 flex items-center justify-center pointer-events-none ${isMobile ? 'left-0' : 'left-1/2'}`}
                    style={{ x: xPos, y: yPos, willChange: 'transform' }}
                >
                    <BunnyAvatar progress={springProgress} />
                </motion.div>

                {/* STORY BEAT NODES */}
                {!isMobile && experience.map((_, i) => (
                    <div
                        key={`beat-${i}`}
                        className="absolute left-1/2 z-[60]"
                        style={{
                            top: i * ITEM_HEIGHT + MILESTONE_Y,
                            transform: `translateX(${(i % 2 === 0 ? 1 : -1) * SWERVE_WIDTH}px)`
                        }}
                    >
                        <StoryBeat
                            progress={springProgress}
                            targetProgress={(i + 0.5) / experience.length}
                            delay={i * 0.2}
                        />
                    </div>
                ))}


                {/* LEVEL CARDS */}
                {experience.map((job, i) => (
                    <ExperienceCard
                        key={i}
                        job={job}
                        index={i}
                        isMobile={isMobile}
                        isEven={i % 2 === 0}
                        swerveWidth={SWERVE_WIDTH}
                        itemHeight={ITEM_HEIGHT}
                    />
                ))}

                {/* FINAL SECTION */}
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-6" style={{ top: totalHeight + 150 }}>

                    {/* Floating Cuteness Container */}
                    <div className="relative group cursor-pointer">
                        {/* Glow Behind */}
                        <div className="absolute inset-0 bg-yellow-400/30 blur-[60px] rounded-full group-hover:bg-neon-pink/40 group-hover:blur-[80px] transition-all duration-700" />

                        {/* Bouncing Trophy */}
                        <motion.div
                            animate={{
                                y: [-10, 10, -10],
                                rotate: [-5, 5, -5],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10"
                        >
                            <Trophy className="text-yellow-400 w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] filter group-hover:drop-shadow-[0_0_25px_rgba(255,77,166,0.6)] transition-all duration-500" />

                            {/* Cute Face on Trophy (CSS) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4 opacity-60">
                                <div className="w-2 h-3 bg-black/20 rounded-full" />
                                <div className="w-2 h-3 bg-black/20 rounded-full" />
                            </div>
                        </motion.div>

                        {/* Floating Decorative Icons */}
                        <motion.div
                            animate={{ y: [10, -20, 10], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                            className="absolute -top-4 -right-8 text-neon-pink"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                            className="absolute -bottom-2 -left-8 text-yellow-400"
                        >
                            <Star size={24} fill="currentColor" />
                        </motion.div>
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute top-0 left-0 text-white"
                        >
                            <Sparkle size={16} />
                        </motion.div>
                    </div>

                    <div className="text-center group flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                        >
                            <SparklesText
                                text="Quest Complete!"
                                className="text-3xl md:text-5xl font-[family-name:var(--font-baloo)] text-[#ffffff] font-black tracking-wide drop-shadow-[0_0_10px_rgba(255,77,166,0.8)] mb-2"
                                colors={{ first: "#FF4DA6", second: "#FACC15" }}
                            />
                        </motion.div>

                        <div className="flex items-center gap-3 justify-center mt-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                            <span className="text-pink-300 text-xs font-bold tracking-widest uppercase">All Stories Unlocked</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.8)] animate-pulse" />
                        </div>

                        <p className="text-white/30 text-[10px] mt-4 font-mono">
                            Stay tuned for the expansion pack...
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

const ArrowRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="inline-block mx-2 text-neon-pink"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
);
