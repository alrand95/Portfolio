"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { adminNavItems } from "./AdminSidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function DraggableAdminNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const constraintsRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    // Load saved position
    useEffect(() => {
        const timer = setTimeout(() => {
            const savedPos = localStorage.getItem("adminNavPos");
            if (savedPos) {
                setPosition(JSON.parse(savedPos));
            }
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Save position on drag end
    const handleDragEnd = (_: any, info: any) => {
        const newPos = { x: position.x + info.offset.x, y: position.y + info.offset.y };
        setPosition(newPos);
        localStorage.setItem("adminNavPos", JSON.stringify(newPos));
    };

    return (
        <>
            <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[60] md:hidden" />

            <motion.div
                drag
                dragMomentum={false}
                dragConstraints={constraintsRef}
                onDragEnd={handleDragEnd}
                initial={false}
                // We use style for position to allow Framer Motion's drag system to work naturally with react state
                // However, for simplicity in this specific "floating" context relative to viewport, 
                // we'll rely on fixed positioning and let the user place it.
                // Resetting to bottom-right default if no position saved is tricky with pure drag, 
                // so we'll start fixed and let drag transform it.
                className="fixed bottom-6 right-6 z-[70] md:hidden touch-none"
            >
                <div className="relative flex flex-col-reverse items-end">

                    {/* TOGGLE BUTTON */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue p-[2px] shadow-[0_0_20px_rgba(255,77,166,0.4)]"
                    >
                        <div className="w-full h-full rounded-full bg-black glass flex items-center justify-center">
                            {isOpen ? (
                                <X className="text-white" size={24} />
                            ) : (
                                // Mini Bunny Logo
                                <div className="relative">
                                    <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                                        <span className="text-[10px] font-black text-white">B</span>
                                    </div>
                                    <div className="absolute -top-2 left-0 w-1 h-3 bg-neon-pink rounded-full -rotate-12" />
                                    <div className="absolute -top-2 right-0 w-1 h-3 bg-neon-blue rounded-full rotate-12" />
                                </div>
                            )}
                        </div>
                    </motion.button>

                    {/* EXPANDABLE MENU */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: -16 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                className="mb-4 flex flex-col gap-2 items-end origin-bottom"
                            >
                                {adminNavItems.map((item) => {
                                    const isActive = pathname === item.url;
                                    return (
                                        <Link key={item.name} href={item.url} onClick={() => setIsOpen(false)}>
                                            <div className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-2xl glass border border-white/10 backdrop-blur-xl shadow-lg transition-all active:scale-95",
                                                isActive ? "bg-white/10 border-white/20" : "hover:bg-white/10"
                                            )}>
                                                <span className={cn(
                                                    "text-xs font-bold uppercase tracking-widest",
                                                    isActive ? "text-white" : "text-gray-400"
                                                )}>
                                                    {item.name}
                                                </span>
                                                <div className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center",
                                                    item.color === "pink" && "bg-neon-pink/10 text-neon-pink",
                                                    item.color === "blue" && "bg-neon-blue/10 text-neon-blue",
                                                    item.color === "purple" && "bg-neon-purple/10 text-neon-purple",
                                                    item.color === "yellow" && "bg-yellow-400/10 text-yellow-400"
                                                )}>
                                                    <item.icon size={16} />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </>
    );
}
