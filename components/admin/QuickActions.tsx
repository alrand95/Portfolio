"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { PenTool, Image as ImageIcon, Plus } from 'lucide-react';
import Link from 'next/link';

export function QuickActions({ stats }: { stats: any }) {

    const [greeting, setGreeting] = useState<'Good Morning' | 'Good Afternoon' | 'Good Evening' | ''>('');

    useEffect(() => {
        const timer = setTimeout(() => {
            const hour = new Date().getHours();
            setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* 🐰 GREETING CARD */}
            <div className="flex-1 glass p-6 rounded-[30px] border border-white/10 flex items-center justify-between relative overflow-hidden">
                <div className="z-10">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-1">
                        {greeting}, <span className="text-neon-pink">Admin</span>
                    </h2>
                    <p className="text-gray-400 text-sm font-medium">System integrity is stable. Time to create.</p>

                    <div className="flex items-center gap-3 mt-4">
                        <Link href="/admin/blog?new=true">
                            <button className="px-4 py-2 rounded-full bg-neon-pink/10 hover:bg-neon-pink text-neon-pink hover:text-black font-bold text-xs transition-all flex items-center gap-2 border border-neon-pink/20">
                                <PenTool size={14} /> NEW POST
                            </button>
                        </Link>
                        <Link href="/admin/gallery?upload=true">
                            <button className="px-4 py-2 rounded-full bg-neon-blue/10 hover:bg-neon-blue text-neon-blue hover:text-black font-bold text-xs transition-all flex items-center gap-2 border border-neon-blue/20">
                                <ImageIcon size={14} /> UPLOAD ASSET
                            </button>
                        </Link>
                    </div>
                </div>

                {/* DECORATIVE MASCOT */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute right-[-20px] bottom-[-40px] opacity-20 md:opacity-100 z-0"
                >
                    <div className="text-[120px] leading-none select-none">🐰</div>
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-neon-pink/10 pointer-events-none" />
            </div>
        </div>
    );
}
