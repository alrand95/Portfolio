"use client";

import { AdminSidebar } from "./AdminSidebar";
import { AdminSettingsModal } from "./AdminSettingsModal";
import { AdminValentinePopup } from "./AdminValentinePopup";
import { AdminBirthdayCelebration } from "../celebrations/AdminBirthdayCelebration";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ChevronRight, Settings, Bell, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import { DraggableAdminNav } from "./DraggableAdminNav";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Breadcrumb logic
    const paths = pathname.split("/").filter(Boolean);

    // Clock Logic to avoid Hydration Mismatch
    const [time, setTime] = useState<string>("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        const updateTime = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));

        // Use setTimeout to avoid set-state-in-effect warning
        const timer = setTimeout(() => {
            updateTime();
        }, 0);

        const interval = setInterval(updateTime, 1000);
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-neon-pink selection:text-white overflow-x-hidden">
            {/* 📺 SCANLINE EFFECT */}
            <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] animate-scan" />

            <AdminValentinePopup />
            <AdminBirthdayCelebration />

            {/* 🧬 SIDEBAR (Desktop) */}
            <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* 🎈 DRAGGABLE NAV (Mobile) */}
            <DraggableAdminNav />

            {/* ⚙️ SETTINGS MODAL */}
            <AdminSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            {/* 🚀 MAIN CONTENT */}
            <main
                className={cn(
                    "transition-all duration-500 pr-4 md:pr-8 py-8 min-h-screen",
                    "pl-4 md:pl-0", // Mobile: standard padding
                    isCollapsed ? "md:pl-28" : "md:pl-72" // Desktop: Sidebar offset
                )}
            >
                {/* 🎩 HEADER */}
                <header className="flex items-center justify-between mb-12">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        {paths.map((path, index) => {
                            const url = `/${paths.slice(0, index + 1).join("/")}`;
                            const isLast = index === paths.length - 1;

                            return (
                                <div key={path} className="flex items-center gap-2">
                                    <Link
                                        href={url}
                                        className={cn(
                                            "hover:text-neon-pink transition-colors",
                                            isLast ? "text-neon-pink" : ""
                                        )}
                                    >
                                        {path}
                                    </Link>
                                    {!isLast && <ChevronRight size={10} className="text-gray-700" />}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-4">
                        {/* 🕒 SERVER TIME */}
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full glass border-white/5 text-[10px] font-mono text-gray-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
                            <span>SYS.TIME</span>
                            <span className="text-white font-bold min-w-[50px]">
                                {time || "--:--"} UTC
                            </span>
                        </div>

                        <Link href="/" target="_blank">
                            <button className="w-10 h-10 rounded-full glass border-white/5 flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110 active:scale-95 group" title="View Site">
                                <ExternalLink size={18} className="text-gray-400 group-hover:text-neon-blue" />
                            </button>
                        </Link>

                        <button className="w-10 h-10 rounded-full glass border-white/5 flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110 active:scale-95 group">
                            <Bell size={18} className="text-gray-400 group-hover:text-neon-pink" />
                        </button>

                        {/* Settings Button */}
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="w-10 h-10 rounded-full glass border-white/5 flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110 active:scale-95 group"
                        >
                            <Settings size={18} className="text-gray-400 group-hover:text-neon-blue" />
                        </button>

                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue p-[1.5px] hover:scale-110 transition-transform cursor-pointer">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative">
                                <Image src="/admin-avatar.jpg" alt="Admin" fill className="object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* 🎢 PAGE CONTENT */}
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative z-10"
                >
                    {children}
                </motion.div>

                {/* 🎇 BACKGROUND GLOWS */}
                <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-neon-pink/5 blur-[150px] -z-10 animate-pulse-slow" />
                <div className="fixed bottom-0 left-1/4 w-[800px] h-[800px] bg-neon-purple/5 blur-[150px] -z-10 animate-pulse-slow" />
                <div className="fixed top-1/2 left-0 w-[400px] h-[400px] bg-neon-blue/5 blur-[120px] -z-10" />
            </main>
        </div>
    );
}
