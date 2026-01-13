"use client";

import { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function AdminValentinePopup() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Strict Date Check: Feb 14 (Month is 0-indexed, so 1 is Feb)
        const now = new Date();
        const isValentine = now.getDate() === 14 && now.getMonth() === 1;

        if (isValentine || true) { // Forced TRUE for verification
            setIsVisible(true);
        }
    }, []);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="fixed bottom-10 right-10 z-[200] bg-black/60 border border-pink-500/50 backdrop-blur-xl p-6 rounded-3xl shadow-[0_0_30px_rgba(236,72,153,0.3)] flex items-center gap-4 max-w-sm pointer-events-auto"
            >
                {/* Icon */}
                <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-1 rounded-2xl shadow-lg relative w-12 h-12 overflow-hidden flex-shrink-0">
                    <Image
                        src="/valentine-icon.png"
                        alt="Valentine Icon"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Text */}
                <div className="pr-4">
                    <h4 className="text-white font-bold text-lg leading-tight font-sans tracking-wide">Happy Valentine&apos;s Day</h4>
                    <p className="text-pink-200 text-sm mt-1 font-medium">My Dear Love 💖</p>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute -top-3 -right-3 bg-white text-black rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
                >
                    <X size={14} strokeWidth={3} />
                </button>
            </motion.div>
        </AnimatePresence>
    );
}
