"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function LanguageSelectionModal() {
    const { language, setLanguage, isLoaded, hasSelectedLanguage } = useLanguage();

    // Derive visibility directly from context, avoiding useEffect state sync
    const showModal = isLoaded && !hasSelectedLanguage;

    const handleSelect = (lang: "en" | "ar") => {
        setLanguage(lang);
    };

    if (!isLoaded && !hasSelectedLanguage) return null; // Don't show until loaded

    return (
        <AnimatePresence>
            {showModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 cursor-default"
                    onClick={(e) => e.stopPropagation()} // Prevent clicking through
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-zinc-900/90 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(255,77,166,0.2)] text-center relative overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-pink-500/20 rounded-full blur-[50px] pointer-events-none" />

                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2 font-baloo">
                            Choose Your Experience
                        </h2>
                        <p className="text-gray-400 mb-8 font-inter">
                            اختر لغتك المبدأية / Select your starting language
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleSelect("en")}
                                className="group relative overflow-hidden rounded-2xl bg-zinc-800 p-6 transition-all hover:bg-zinc-700 hover:shadow-[0_0_20px_rgba(255,77,166,0.4)] border border-white/5 hover:border-pink-500/50"
                            >
                                <span className="relative z-10 text-xl font-bold text-white block mb-1">English</span>
                                <span className="relative z-10 text-xs text-gray-500 group-hover:text-pink-300 transition-colors">LTR Interface</span>
                            </button>

                            <button
                                onClick={() => handleSelect("ar")}
                                className="group relative overflow-hidden rounded-2xl bg-zinc-800 p-6 transition-all hover:bg-zinc-700 hover:shadow-[0_0_20px_rgba(155,92,255,0.4)] border border-white/5 hover:border-purple-500/50"
                            >
                                <span className="relative z-10 text-xl font-bold text-white block mb-1 font-baloo">العربية</span>
                                <span className="relative z-10 text-xs text-gray-500 group-hover:text-purple-300 transition-colors">RTL Interface</span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
