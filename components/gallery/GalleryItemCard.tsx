'use client';
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ParallaxCard } from '@/components/ParallaxCard';
import { LazyImage } from './LazyImage';

interface GalleryItemCardProps {
    art: any;
    onSelect: (art: any) => void;
}

export const GalleryItemCard = React.memo(({ art, onSelect }: GalleryItemCardProps) => {
    const handleSelect = useCallback(() => {
        onSelect(art);
    }, [art, onSelect]);

    return (
        <div className="break-inside-avoid">
            <motion.div
                onClick={handleSelect}
                className="cursor-pointer group"
                whileTap={{ scale: 0.98 }}
            >
                <ParallaxCard className="bg-black/90 border-white/5 hover:border-neon-pink/50 transition-colors">
                    <div className="flex flex-col h-full">
                        <div className="w-full aspect-square bg-gray-900 rounded-[30px] mb-6 relative overflow-hidden group-hover:shadow-lg group-hover:shadow-neon-pink/20 transition-all shimmer-bg">
                            {art.image_url ? (
                                <LazyImage
                                    src={art.image_url}
                                    alt={art.caption || 'Gallery Image'}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-black to-neon-blue/20 opacity-80" />
                            )}
                        </div>

                        {art.caption && (
                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-pink transition-colors">
                                {art.caption}
                            </h3>
                        )}

                        {art.tags && art.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {art.tags.map((t: string) => (
                                    <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-neon-blue uppercase tracking-wider">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </ParallaxCard>
            </motion.div>
        </div>
    );
});

GalleryItemCard.displayName = 'GalleryItemCard';
