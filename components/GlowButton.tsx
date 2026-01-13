'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { useTheme } from '@/components/ThemeContext';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
    ({ className, variant = 'primary', children, onClick, ...props }, ref) => {
        const { playSound } = useTheme();

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            playSound('click');
            onClick?.(e);
        }

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                onClick={handleClick}
                className={cn(
                    'relative px-8 py-4 rounded-bunny font-bold text-white transition-colors duration-200 uppercase tracking-wider',
                    // Hide default cursor so custom cursor can take over, or keep default? User asked for magnetic snap on hover.
                    // Usually we allow default cursor unless verified.
                    // 'cursor-none', 
                    variant === 'primary' && 'bg-black border-2 border-neon-pink shadow-[0_0_15px_var(--color-neon-pink)] hover:bg-neon-pink hover:text-black hover:shadow-[0_0_25px_var(--color-neon-pink)]',
                    variant === 'secondary' && 'bg-black border-2 border-neon-purple shadow-[0_0_15px_var(--color-neon-purple)] hover:bg-neon-purple hover:text-black hover:shadow-[0_0_25px_var(--color-neon-purple)]',
                    className
                )}
                {...props as any}
            >
                {children}
            </motion.button>
        );
    }
);
GlowButton.displayName = 'GlowButton';
