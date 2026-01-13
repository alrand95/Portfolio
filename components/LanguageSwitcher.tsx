"use client";

import { useLanguage } from "@/lib/i18n/context";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ className }: { className?: string }) {
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ar" : "en");
    };

    return (
        <button
            onClick={toggleLanguage}
            className={`group relative flex items-center gap-2 px-3 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all hover:border-pink-500/50 ${className}`}
        >
            <Globe size={16} className="text-gray-400 group-hover:text-pink-400 transition-colors" />
            <span className="text-sm font-medium text-gray-300 group-hover:text-white uppercase">
                {language === "en" ? "EN" : "AR"}
            </span>
        </button>
    );
}
