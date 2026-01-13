'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CodeBunny } from '@/components/ui/CodeBunny';
import { StarBackground } from '@/components/ui/StarBackground';
import { NeonCurves } from '@/components/ui/NeonCurves';

export default function NotFound() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center font-baloo selection:bg-pink-400/30">

            {/* 1. Backgrounds */}
            <StarBackground />

            {/* Deep Space Gradients Over Canvas */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.15),transparent_60%)] pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#2e1065] via-transparent to-transparent opacity-20 pointer-events-none" />

            {/* Side Neon Curves */}
            <NeonCurves />

            {/* 2. Main Content Wrapper */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="z-10 relative flex flex-col items-center justify-center pointer-events-auto"
            >

                {/* --- 404 DISPLAY --- */}
                <div className="relative flex items-end justify-center">

                    {/* Left 4 */}
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5, duration: 1.5 }}
                        className="text-[180px] md:text-[250px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 drop-shadow-[0_10px_35px_rgba(192,132,252,0.5)]"
                        style={{ WebkitTextStroke: '4px rgba(255,255,255,0.1)' }}
                    >
                        4
                    </motion.div>

                    {/* Middle 0 with Bunny inside/sitting */}
                    <div className="relative w-[140px] h-[180px] md:w-[200px] md:h-[240px] mx-[-20px] md:mx-[-40px] flex items-center justify-center">
                        {/* The "0" shape represented by a glowing portal/ring or just the bunny? 
                     User asked for bunny sitting INSIDE the 0. Let's make the 0 a ring and put bunny in it. */}
                        <motion.div
                            className="absolute inset-0 rounded-full border-[15px] md:border-[25px] border-pink-200/20 shadow-[0_0_50px_rgba(232,121,249,0.4)]"
                            animate={{ boxShadow: ["0 0 50px rgba(232,121,249,0.4)", "0 0 80px rgba(232,121,249,0.7)", "0 0 50px rgba(232,121,249,0.4)"] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />

                        {/* Sitting Bunny */}
                        <div className="absolute bottom-[-10px] scale-75 md:scale-100 z-10">
                            <CodeBunny pose="sitting" primaryColor="#f5d0fe" />
                        </div>
                    </div>

                    {/* Right 4 */}
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5, duration: 1.5, delay: 0.2 }}
                        className="text-[180px] md:text-[250px] leading-none font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 drop-shadow-[0_10px_35px_rgba(192,132,252,0.5)]"
                        style={{ WebkitTextStroke: '4px rgba(255,255,255,0.1)' }}
                    >
                        4
                    </motion.div>

                    {/* Floating Bunnies around */}
                    <motion.div
                        className="absolute top-10 -left-20 md:-left-32 scale-75 rotate-[-15deg] z-20"
                        animate={{ y: [-10, 10, -10] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <CodeBunny pose="peeking" primaryColor="#e0e7ff" secondaryColor="#c7d2fe" />
                    </motion.div>
                    <motion.div
                        className="absolute -top-10 -right-20 md:-right-32 scale-75 rotate-[15deg] z-0"
                        animate={{ y: [10, -10, 10] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    >
                        <CodeBunny pose="floating" primaryColor="#fce7f3" secondaryColor="#fbcfe8" />
                    </motion.div>

                </div>

                {/* --- TEXT CONTENT --- */}
                <div className="text-center mt-12 space-y-4 relative z-20">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-4xl md:text-5xl font-extrabold text-white tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                    >
                        PAGE NOT FOUND
                    </motion.h2>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-xl md:text-2xl text-pink-200 font-medium"
                    >
                        let&apos;s found our wayyy-yuhooo back home !!
                    </motion.p>
                </div>

                {/* --- BUTTON --- */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-10"
                >
                    <Link href="/" className="group relative inline-flex items-center justify-center px-10 py-5 bg-white/10 backdrop-blur-md rounded-full overflow-hidden transition-transform duration-300 hover:scale-110 active:scale-95 border border-white/20 hover:border-pink-400/50">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-pink-500/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />

                        <span className="relative z-10 text-xl font-bold text-white group-hover:text-pink-100 flex items-center gap-3">
                            <span className="text-2xl">✨</span>
                            Return to Base
                            <span className="text-2xl">✨</span>
                        </span>

                        <div className="absolute inset-0 rounded-full ring-2 ring-white/10 group-hover:ring-pink-300/50 transition-all duration-300" />
                    </Link>
                </motion.div>

            </motion.div>

        </div>
    );
}
