"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    PenTool,
    Image as ImageIcon,
    MessageSquare,
    UserCircle,
    ExternalLink,
    ChevronRight,
    LogOut,
    Palette,
    Layers,
    Share2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export const adminNavItems = [
    { name: "Dashboard", url: "/admin", icon: LayoutDashboard, color: "pink" },
    { name: "Blog Posts", url: "/admin/blog", icon: PenTool, color: "blue" },
    { name: "Gallery", url: "/admin/gallery", icon: ImageIcon, color: "purple" },
    { name: "Profile", url: "/admin/profile", icon: UserCircle, color: "yellow" },
    { name: "Appearance", url: "/admin/appearance", icon: Palette, color: "pink" },

    { name: "Messages", url: "/admin/messages", icon: MessageSquare, color: "pink" },
];

interface AdminSidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (val: boolean) => void;
}

export function AdminSidebar({ isCollapsed, setIsCollapsed }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={cn(
                "fixed left-4 top-4 bottom-4 glass rounded-[40px] z-50 transition-all duration-500 hidden md:flex flex-col items-center py-8 border-white/5",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* 🚀 LOGO / BRANDING */}
            <div className="mb-12 px-2 flex items-center justify-center">
                <div className="relative group cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
                    <div className="w-12 h-12 bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,77,166,0.3)] group-hover:scale-110 transition-all">
                        <span className="text-white font-black text-2xl tracking-tighter">B</span>
                    </div>
                    {/* Bunny Ears for Logo */}
                    <motion.div
                        initial={false}
                        animate={isCollapsed ? { scale: 0.8, opacity: 0.5 } : { scale: 1, opacity: 1 }}
                        className="absolute -top-3 left-0 right-0 flex justify-center gap-1 transition-opacity"
                    >
                        <div className="w-1.5 h-4 bg-neon-pink rounded-full -rotate-12 shadow-[0_0_10px_#FF4DA6]" />
                        <div className="w-1.5 h-4 bg-neon-purple rounded-full rotate-12 shadow-[0_0_10px_#9B5CFF]" />
                    </motion.div>
                </div>
            </div>

            {/* 🧭 NAVIGATION */}
            <nav className="flex-1 w-full px-3 space-y-3">
                {adminNavItems.map((item) => {
                    const isActive = pathname === item.url;

                    return (
                        <Link key={item.name} href={item.url}>
                            <div
                                className={cn(
                                    "relative flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 group overflow-hidden",
                                    isActive ? "bg-white/10" : "hover:bg-white/5"
                                )}
                                onMouseEnter={() => setHoveredTab(item.name)}
                                onMouseLeave={() => setHoveredTab(null)}
                            >
                                {/* Active Indicator Glow & Bar */}
                                {isActive && (
                                    <>
                                        <motion.div
                                            layoutId="admin-active-bg"
                                            className={cn(
                                                "absolute inset-0 rounded-2xl border",
                                                item.color === "pink" && "border-neon-pink/30 bg-neon-pink/5",
                                                item.color === "blue" && "border-neon-blue/30 bg-neon-blue/5",
                                                item.color === "purple" && "border-neon-purple/30 bg-neon-purple/5",
                                                item.color === "yellow" && "border-yellow-400/30 bg-yellow-400/5",
                                            )}
                                        />
                                        <motion.div
                                            layoutId="admin-active-bar"
                                            className={cn(
                                                "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full",
                                                item.color === "pink" && "bg-neon-pink shadow-[0_0_10px_#FF4DA6]",
                                                item.color === "blue" && "bg-neon-blue shadow-[0_0_10px_#4BD0FF]",
                                                item.color === "purple" && "bg-neon-purple shadow-[0_0_10px_#9B5CFF]",
                                                item.color === "yellow" && "bg-yellow-400 shadow-[0_0_10px_#FACC15]",
                                            )}
                                        />
                                    </>
                                )}

                                <div className={cn(
                                    "relative z-10 transition-all duration-300",
                                    isActive ? (
                                        item.color === "pink" ? "text-neon-pink drop-shadow-[0_0_8px_#FF4DA6]" :
                                            item.color === "blue" ? "text-neon-blue drop-shadow-[0_0_8px_#4BD0FF]" :
                                                item.color === "purple" ? "text-neon-purple drop-shadow-[0_0_8px_#9B5CFF]" :
                                                    "text-yellow-400 drop-shadow-[0_0_8px_#FACC15]"
                                    ) : "text-gray-500 group-hover:text-white"
                                )}>
                                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                </div>

                                {/* Tooltip for Collapsed State */}
                                {isCollapsed && hoveredTab === item.name && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="absolute left-full ml-4 px-3 py-1.5 glass rounded-lg border-white/10 z-50 whitespace-nowrap"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                            {item.name}
                                        </span>
                                        {/* Little Arrow */}
                                        <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-4 border-transparent border-r-white/10" />
                                    </motion.div>
                                )}

                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn(
                                            "relative z-10 font-black uppercase text-[10px] tracking-[0.2em] transition-colors",
                                            isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"
                                        )}
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* ⚙️ FOOTER ACTIONS & PROFILE */}
            <div className="w-full px-3 space-y-2 mt-auto">
                <div className={cn(
                    "relative p-3 rounded-2xl bg-white/5 border border-white/5 transition-all overflow-hidden group",
                    isCollapsed ? "items-center justify-center flex" : "flex items-center gap-3"
                )}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue p-[1.5px] shrink-0">
                        <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
                            <Image src="/admin-avatar.jpg" alt="Admin" fill className="object-cover" />
                        </div>
                    </div>

                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <h4 className="text-sm font-bold text-white truncate">Bunny Admin</h4>
                            <p className="text-[10px] text-gray-400 font-mono">ID: #88-BUNNY</p>
                        </div>
                    )}

                    {/* Verified Badge */}
                    <div className={cn(
                        "absolute top-2 w-2 h-2 rounded-full bg-green-500 border border-black",
                        isCollapsed ? "right-2" : "right-3 top-1/2 -translate-y-1/2"
                    )} />
                </div>

                {!isCollapsed && (
                    <div className="px-4 py-2 flex items-center justify-between text-[10px] font-mono text-gray-600">
                        <span>v1.0.2</span>
                        <span>Stable</span>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-red-500/10 transition-all group mt-4"
                >
                    <LogOut size={20} className="text-gray-500 group-hover:text-red-400" />
                    {!isCollapsed && <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest group-hover:text-red-400">Logout</span>}
                </button>
            </div>
        </motion.aside>
    );
}


