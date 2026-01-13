import { motion } from "framer-motion";
import { HeroContent } from "@/types/hero";
import Link from "next/link";
import { BoingButton } from "@/components/BoingButton";

export function CyberHeroText({ content }: { content: HeroContent }) {
    return (
        <div className="relative z-10 flex flex-col items-start justify-center h-full px-6 md:px-20 pointer-events-none select-none">

            {/* GLASS CARD CONTAINER */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="
                    relative 
                    w-full max-w-2xl
                    p-6 md:p-12 
                    
                    /* Mobile: Subtle Gradient Bottom */
                    bg-gradient-to-t from-black/90 via-black/50 to-transparent
                    md:bg-black/40 md:bg-none
                    
                    /* Desktop: Glass Card Stylings */
                    md:backdrop-blur-xl 
                    md:border md:border-white/10 md:border-l-4 md:border-l-neon-pink
                    md:rounded-r-2xl md:shadow-[0_0_40px_rgba(0,0,0,0.6)]
                    
                    overflow-hidden
                    pointer-events-auto
                "
            >
                {/* Decorative Cyber Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,77,166,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,77,166,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                {/* Top Label */}
                <div className="hidden md:flex items-center gap-2 mb-4 opacity-70">
                    <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                    <span className="text-xs font-mono text-neon-green tracking-widest">CRAFT BY SIMON</span>
                </div>

                {/* Main Title */}
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight font-[family-name:var(--font-baloo)] drop-shadow-xl">
                    {content.title_prefix} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-purple filter drop-shadow-[0_0_10px_rgba(255,77,166,0.5)]">
                        {content.title_highlight}
                    </span> <br />
                    {content.subtitle}
                </h1>

                <div className="h-1 w-20 bg-gradient-to-r from-neon-pink to-transparent my-6" />

                {/* Description */}
                <p className="text-gray-200 text-lg font-medium leading-relaxed max-w-md mb-8">
                    {content.description.split('\n').map((line, i) => (
                        <span key={i} className="block">
                            {line}
                        </span>
                    ))}
                </p>

                {/* Buttons (Dynamic) */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                    <Link href={content.button_primary_url}>
                        <BoingButton variant="pink">{content.button_primary_text}</BoingButton>
                    </Link>
                    <Link href={content.button_secondary_url}>
                        <BoingButton variant="purple">{content.button_secondary_text}</BoingButton>
                    </Link>
                </div>

                {/* Decorative Corner details */}
                <div className="absolute top-0 right-0 p-2">
                    <div className="w-4 h-4 border-t-2 border-r-2 border-white/20" />
                </div>

            </motion.div>
        </div>
    );
}
