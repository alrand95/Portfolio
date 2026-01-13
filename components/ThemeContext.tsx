"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { HeroContent } from '@/types/hero';

export type ThemeConfig = {
    primary_color: string;
    glass_opacity: number;
    border_radius: string;
    font?: string;
    hero_content?: HeroContent;
    enable_animations?: boolean;
    enable_notifications?: boolean;
    event_popup?: {
        enabled: boolean;
        title: string;
        message: string;
        pages: string[];
    };
};

type ThemeContextType = {
    theme: ThemeConfig;
    updateTheme: (newTheme: Partial<ThemeConfig>) => void;
    playSound: (type: 'click' | 'success' | 'hover') => void;
};

export const defaultTheme: ThemeConfig = {
    primary_color: '#FF4DA6',
    glass_opacity: 0.7,
    border_radius: '30px',
    enable_animations: true,
    enable_notifications: true,
    event_popup: {
        enabled: false,
        title: 'Incoming Event',
        message: '',
        pages: []
    }
};

const ThemeContext = createContext<ThemeContextType>({
    theme: defaultTheme,
    updateTheme: () => { },
    playSound: () => { },
});

export function ThemeProvider({
    children,
    initialTheme
}: {
    children: React.ReactNode,
    initialTheme?: ThemeConfig
}) {
    const [theme, setTheme] = useState<ThemeConfig>(initialTheme || defaultTheme);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-neon-pink', theme.primary_color);
        root.style.setProperty('--radius-bunny', theme.border_radius);
        root.style.setProperty('--glass-opacity', theme.glass_opacity.toString());
    }, [theme]);

    const updateTheme = (newTheme: Partial<ThemeConfig>) => {
        setTheme(prev => ({ ...prev, ...newTheme }));
    };

    const playSound = (type: 'click' | 'success' | 'hover') => {
        if (!theme.enable_notifications) return;
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;

            if (type === 'click') {
                // High pitch "pop"
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            } else if (type === 'hover') {
                // Very subtle tick
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(200, now);
                gain.gain.setValueAtTime(0.02, now);
                gain.gain.linearRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === 'success') {
                // Quick ascending major trill
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now); // A4
                osc.frequency.setValueAtTime(554.37, now + 0.1); // C#5
                osc.frequency.setValueAtTime(659.25, now + 0.2); // E5
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.linearRampToValueAtTime(0.0, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
            }
        } catch (e) {
            // Ignore auto-play strictness errors
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme, playSound }}>
            <MotionConfig transition={theme.enable_animations === false ? { duration: 0 } : undefined}>
                {children}
            </MotionConfig>
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
