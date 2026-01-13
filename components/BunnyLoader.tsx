import { motion } from "framer-motion";

export function BunnyLoader() {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full absolute inset-0 z-50 bg-black text-white">
            {/* Spinning Cyber Ring - Simple clean CSS animation */}
            <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-transparent border-t-neon-pink border-r-neon-purple rounded-full animate-spin" />
                <div className="absolute inset-2 border-4 border-transparent border-l-neon-blue rounded-full animate-spin opacity-50 reverse-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />

                {/* Glow effect at center */}
                <div className="absolute inset-0 bg-neon-pink/20 blur-xl rounded-full animate-pulse" />
            </div>

            <motion.p
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                className="text-sm font-mono tracking-widest text-neon-pink uppercase"
            >
                Summoning...
            </motion.p>
        </div>
    );
}
