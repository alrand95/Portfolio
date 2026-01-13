"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface BoingButtonProps extends HTMLMotionProps<"button"> {
    variant?: "pink" | "purple";
    children: React.ReactNode;
}

export function BoingButton({ variant = "pink", className, children, ...props }: BoingButtonProps) {
    const isPink = variant === "pink";

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.85, rotate: isPink ? -2 : 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={cn(
                "relative group px-10 py-5 rounded-full font-black uppercase tracking-widest text-white overflow-hidden",
                "border-2 transition-all duration-300",
                isPink
                    ? "border-neon-pink bg-neon-pink/10 hover:shadow-[0_0_40px_rgba(255,77,166,0.6)]"
                    : "border-neon-purple bg-neon-purple/10 hover:shadow-[0_0_40px_rgba(155,92,255,0.6)]",
                className
            )}
            {...props}
        >
            {/* Fill Effect */}
            <div className={cn(
                "absolute inset-0 w-0 transition-all duration-300 ease-out group-hover:w-full opacity-20",
                isPink ? "bg-neon-pink" : "bg-neon-purple"
            )} />

            {/* Text Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
}
