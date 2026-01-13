'use client';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export const MagneticCursor = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isVisible, setIsVisible] = useState(false);

    // Smooth physics for the "Mascot" feeling
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveMouse = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible && e.clientX !== 0) setIsVisible(true);
        };

        window.addEventListener('mousemove', moveMouse);
        return () => window.removeEventListener('mousemove', moveMouse);
    }, [mouseX, mouseY, isVisible]);

    if (!isVisible) return null;

    return (
        <>
            {/* Main Cursor Dot */}
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full mix-blend-difference pointer-events-none z-[9999]"
                style={{
                    left: smoothX,
                    top: smoothY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />
            {/* Neon Ring / Bunny Tracker */}
            <motion.div
                className="fixed top-0 left-0 w-12 h-12 rounded-full border-2 border-neon-pink pointer-events-none z-[9998]"
                style={{
                    left: smoothX,
                    top: smoothY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                transition={{ delay: 0.1 }} // Slight lag handled by spring diff, but here matched to same spring
            >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full shadow-[0_0_10px_var(--color-neon-pink)]" />
            </motion.div>
        </>
    );
};
