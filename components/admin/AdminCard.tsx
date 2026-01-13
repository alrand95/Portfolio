"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AdminCardProps {
    children: React.ReactNode;
    title?: string;
    className?: string;
    icon?: React.ReactNode;
    glowColor?: "pink" | "blue" | "purple" | "yellow" | "green";
}

export function AdminCard({ children, title, className, icon, glowColor = "pink" }: AdminCardProps) {
    const glowStyles = {
        pink: "hover:border-neon-pink/50 hover:shadow-[0_0_20px_rgba(255,77,166,0.15)]",
        blue: "hover:border-neon-blue/50 hover:shadow-[0_0_20px_rgba(75,208,255,0.15)]",
        purple: "hover:border-neon-purple/50 hover:shadow-[0_0_20px_rgba(155,92,255,0.15)]",
        yellow: "hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]",
        green: "hover:border-neon-green/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "glass rounded-[32px] p-6 transition-all duration-300 group",
                glowStyles[glowColor],
                className
            )}
        >
            {(title || icon) && (
                <div className="flex items-center gap-4 mb-6">
                    {icon && (
                        <div className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center bg-black/40",
                            glowColor === "pink" && "text-neon-pink",
                            glowColor === "blue" && "text-neon-blue",
                            glowColor === "purple" && "text-neon-purple",
                            glowColor === "yellow" && "text-yellow-400",
                            glowColor === "green" && "text-neon-green"
                        )}>
                            {icon}
                        </div>
                    )}
                    {title && <h3 className="text-xl font-bold text-white/90">{title}</h3>}
                </div>
            )}
            {children}
        </motion.div>
    );
}
