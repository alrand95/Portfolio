'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeContext';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';

export function EventPopup() {
    const { theme } = useTheme();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Reset visibility when path changes or settings change
        setIsVisible(false);

        const config = theme.event_popup;
        if (!config?.enabled || !config.message) return;

        // Check if current page is in the list
        // We match strict paths, maybe handle trailing slashes roughly
        const currentPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');

        // Normalize config pages to ensure comparison works
        const targetPages = config.pages || [];

        // "gallery" usually maps to "/gallery", "about" to "/about" etc.
        // We will store actual paths in the config ('/about', '/gallery')
        const isMatch = targetPages.some(page => currentPath === page);

        if (isMatch) {
            // Delay slightly to allow page transition to settle
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 500);

            // Hide after 5 seconds + delay
            const hideTimer = setTimeout(() => {
                setIsVisible(false);
            }, 5500);

            return () => {
                clearTimeout(timer);
                clearTimeout(hideTimer);
            };
        }
    }, [pathname, theme.event_popup]);

    return (
        <AnimatePresence>
            {isVisible && theme.event_popup?.message && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md pointer-events-none"
                >
                    <div className="
                        relative pointer-events-auto
                        bg-black/80 backdrop-blur-xl
                        border border-neon-pink/50
                        rounded-2xl p-4 pr-12
                        shadow-[0_0_30px_rgba(255,77,166,0.3)]
                        flex items-start gap-4
                        overflow-hidden
                    ">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-[shimmer_2s_infinite]" />

                        <div className="w-10 h-10 rounded-full bg-neon-pink/20 flex items-center justify-center shrink-0 text-neon-pink animate-pulse">
                            <Bell size={20} fill="currentColor" />
                        </div>

                        <div className="flex-1">
                            <h4 className="text-neon-pink text-xs font-black tracking-widest uppercase mb-1">{theme.event_popup.title || 'Incoming Event'}</h4>
                            <p className="text-white text-sm font-medium leading-relaxed">
                                {theme.event_popup.message}
                            </p>
                        </div>

                        {/* Progress Bar (Timer) */}
                        <motion.div
                            className="absolute bottom-0 left-0 h-1 bg-neon-pink"
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 5, ease: "linear" }}
                        />

                        {/* Close Button */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
