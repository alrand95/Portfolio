'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxCardProps {
    children: ReactNode;
    className?: string;
}

export const ParallaxCard = ({ children, className }: ParallaxCardProps) => {
    return (
        <div className="relative group perspective-1000 will-change-transform">
            {/* Bunny Ears - Positioned Absolute Behind */}
            <motion.div
                className="absolute -top-8 left-10 flex gap-4 z-10 transition-all duration-300 group-hover:-translate-y-4"
            >
                <div className="w-6 h-16 bg-neon-pink rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-white/50" />
                <div className="w-6 h-16 bg-neon-purple rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-2 border-white/50" />
            </motion.div>

            <motion.div
                className={cn(
                    'relative p-8 rounded-bunny bg-black border border-neon-purple/50 shadow-[0_0_15px_rgba(155,92,255,0.3)] overflow-hidden z-20 will-change-transform transition-[border-color,box-shadow] duration-300 ease-out hover:border-neon-pink hover:shadow-[0_10px_40px_-10px_var(--color-neon-purple)]',
                    className
                )}
                initial={{ y: 0 }}
                whileHover={{
                    y: -12,
                    scale: 1.02,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                }}
            >
                {children}

                {/* Shine Effect */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
        </div>
    );
};
