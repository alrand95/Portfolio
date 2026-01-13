"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from 'react';

interface Project {
    id: string;
    title: string;
    category: string;
    slug: string;
    image_url?: string;
}

interface FeaturedProjectCardProps {
    project: Project;
    index: number;
}

export function FeaturedProjectCard({ project, index }: FeaturedProjectCardProps) {
    const [floatDuration, setFloatDuration] = useState(5);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFloatDuration(4 + Math.random() * 2);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            // Antigravity Float Animation
            animate={{ y: [0, -15, 0] }}
            transition={{
                duration: floatDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5 // Stagger floats
            }}
            className="w-full"
        >
            <Link href={`/work/${project.slug || project.id}`} className="block group relative">
                <div className="relative aspect-[4/5] md:aspect-square w-full rounded-[40px] overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-500 group-hover:border-neon-pink group-hover:shadow-[0_0_40px_rgba(255,77,166,0.3)]">

                    {/* Image */}
                    {project.image_url ? (
                        <Image
                            src={project.image_url}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-4xl">
                            🐰
                        </div>
                    )}

                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end opacity-80 group-hover:opacity-100 transition-opacity">
                        <span className="text-neon-pink text-xs font-bold tracking-[0.2em] uppercase mb-2">
                            {project.category || "Project"}
                        </span>
                        <h3 className="text-3xl font-bold text-white leading-none group-hover:text-neon-pink transition-colors font-[family-name:var(--font-baloo)]">
                            {project.title}
                        </h3>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
