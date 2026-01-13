"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Image, PenTool, Sparkles, User, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { LanguageSwitcher } from "./LanguageSwitcher";

// 🎀 Config: Navigation Items (Moved inside component for translation)
// Adapted to match actual project routes


export function BunnyNav() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);

    const navItems = [
        { name: t('nav.home'), url: "/", icon: Home },
        { name: t('nav.about'), url: "/about", icon: User },
        { name: t('nav.blog'), url: "/blog", icon: PenTool },
        { name: t('nav.gallery'), url: "/gallery", icon: Sparkles },
        { name: t('nav.contact'), url: "/contact", icon: Mail },
    ];

    // Hide navigation bar on Homepage ("/") or Admin Panel ("/admin")
    if (pathname === "/" || pathname?.startsWith("/admin")) return null;

    return (
        <div className="fixed bottom-8 inset-x-0 mx-auto w-full z-50 flex justify-center px-4 pointer-events-none">
            <nav
                className="pointer-events-auto flex items-center gap-2 p-2 rounded-full 
        bg-black/80 backdrop-blur-xl border border-white/10 
        shadow-[0_0_20px_rgba(255,77,166,0.3)] 
        transition-all duration-300 hover:shadow-[0_0_30px_rgba(155,92,255,0.5)]"
            >
                {navItems.map((item) => {
                    const isActive = pathname === item.url;
                    const isHovered = hoveredTab === item.name;

                    return (
                        <Link key={item.url} href={item.url}>
                            <div
                                className="relative cursor-pointer px-4 py-3 rounded-full flex items-center justify-center gap-2 transition-colors"
                                onMouseEnter={() => setHoveredTab(item.name)}
                                onMouseLeave={() => setHoveredTab(null)}
                            >
                                {/* 🐰 THE ACTIVE BUNNY BACKGROUND (The "Spotlight") */}
                                {isActive && (
                                    <motion.div
                                        layoutId="bunny-spotlight"
                                        className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full border border-pink-500/50"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}

                                {/* 🐰 HOVER EARS ANIMATION */}
                                <AnimatePresence>
                                    {(isActive || isHovered) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: -22 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute left-0 right-0 mx-auto w-full flex justify-center gap-1 top-0"
                                        >
                                            {/* Left Ear */}
                                            <div className="w-2 h-4 bg-pink-500 rounded-full -rotate-12 shadow-[0_0_10px_#FF4DA6]" />
                                            {/* Right Ear */}
                                            <div className="w-2 h-4 bg-purple-500 rounded-full rotate-12 shadow-[0_0_10px_#9B5CFF]" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* ICON & TEXT */}
                                <span className="relative z-10 flex items-center gap-2">
                                    <item.icon
                                        size={20}
                                        className={`transition-colors duration-300 ${isActive ? "text-pink-400 drop-shadow-[0_0_8px_rgba(255,77,166,0.8)]" : "text-gray-400 group-hover:text-white"
                                            }`}
                                    />

                                    {/* Text Hidden on Mobile (< md), Visible on Desktop */}
                                    <span className={`hidden md:block text-sm font-medium ${isActive ? "text-white" : "text-gray-400"
                                        }`}>
                                        {item.name}
                                    </span>
                                </span>

                                {/* Active Dot (The Bunny Tail) */}
                                {isActive && (
                                    <motion.div
                                        layoutId="bunny-tail"
                                        className="absolute -bottom-1 w-1 h-1 bg-white rounded-full blur-[1px]"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
                <div className="w-px h-6 bg-white/10 mx-2" />
                <LanguageSwitcher />
            </nav>
        </div>
    );
}
