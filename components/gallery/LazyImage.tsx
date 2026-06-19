'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface LazyImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    className?: string;
}

export function LazyImage({ src, alt, fill, sizes, className }: LazyImageProps) {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '200px', // Pre-load when within 200px of viewport
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref} className="w-full h-full relative">
            {isInView ? (
                <Image
                    src={src}
                    alt={alt}
                    fill={fill}
                    sizes={sizes}
                    className={className}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-black to-neon-blue/20 opacity-80" />
            )}
        </div>
    );
}
