'use client';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Loader2, Pin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import moment from 'moment';
import { ParticleTextEffect } from "@/components/ui/particle-text-effect";
import { ParallaxCard } from "@/components/ParallaxCard";
import { CodeBunny } from "@/components/ui/CodeBunny";

const POSTS_PER_PAGE = 6;

export default function BlogPage() {
    const [allPosts, setAllPosts] = useState<any[]>([]);
    // visiblePosts is now derived via useMemo
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [displayCount, setDisplayCount] = useState(POSTS_PER_PAGE);
    const supabase = createClient();

    useEffect(() => {
        const fetchPosts = async () => {
            // Fetch ONLY published posts
            const { data } = await supabase
                .from('blog_posts')
                .select('*')
                .not('published_at', 'is', null) // Only published
                .order('is_pinned', { ascending: false })
                .order('published_at', { ascending: false });

            if (data) {
                setAllPosts(data);
            }
            setLoading(false);
        };
        fetchPosts();
    }, [supabase]);

    // Handle Search & Pagination updates
    const visiblePosts = useMemo(() => {
        let filtered = allPosts;
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            filtered = allPosts.filter(p =>
                p.title.toLowerCase().includes(lowerQ) ||
                p.tags?.some((t: string) => t.toLowerCase().includes(lowerQ))
            );
        }
        return filtered.slice(0, displayCount);
    }, [searchQuery, displayCount, allPosts]);

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + POSTS_PER_PAGE);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-6">
                <CodeBunny pose="floating" primaryColor="#FF4DA6" secondaryColor="#F472B6" />
                <p className="text-neon-pink animate-pulse font-mono tracking-[0.2em] uppercase font-bold text-sm">Deciphering Runes...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-32 pb-32 px-4 md:px-8 max-w-7xl mx-auto">

            {/* 1. Page Header (The "Intro") */}
            <div className="text-center mb-16 max-w-3xl mx-auto space-y-8 relative">
                {/* Decorative Peeking Bunny */}
                <div className="absolute -top-24 -right-12 md:-right-24 rotate-12 opacity-80 pointer-events-none hidden md:block">
                    <CodeBunny pose="peeking" className="w-32 h-32" />
                </div>

                <div>
                    <div className="mb-8">
                        <ParticleTextEffect words={["BUNNY", "BRAINWAVES", "DIARY", "MAGIC"]} />
                    </div>
                    <p className="text-gray-300 text-xl font-medium tracking-wide">Thoughts, tutorials, and sparkly ideas.</p>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-lg mx-auto group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neon-pink">
                        <Search size={24} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for magic..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 backdrop-blur-md border-2 border-white/20 rounded-full py-4 pl-14 pr-6 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-neon-pink focus:shadow-[0_0_20px_var(--color-neon-pink)] transition-all"
                    />
                </div>
            </div>

            {/* 2. The Masonry Grid (Same as Gallery) */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                <AnimatePresence>
                    {visiblePosts.map((post, i) => (
                        <div key={post.id} className="break-inside-avoid">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                            >
                                <Link href={`/blog/${post.slug || post.id}`} className="block group">
                                    <ParallaxCard className="bg-black/80 backdrop-blur-sm border-white/5 hover:border-neon-pink/50 transition-colors">
                                        <div className="flex flex-col h-full relative">

                                            {/* The "Cute" Date Sticker - Re-added on top of Parallax Card */}
                                            <div className="absolute top-4 left-4 bg-neon-pink text-white font-[family-name:var(--font-baloo)] font-bold px-4 py-1.5 rounded-full -rotate-3 shadow-lg z-20 pointer-events-none">
                                                {moment(post.published_at).format('MMM DD')}
                                            </div>

                                            {/* Pinned Badge */}
                                            {post.is_pinned && (
                                                <div className="absolute top-4 right-4 bg-neon-blue text-black font-bold px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(75,208,255,0.5)] z-20 pointer-events-none flex items-center gap-1 animate-pulse">
                                                    <Pin size={12} className="fill-current" />
                                                    <span className="text-[10px] uppercase tracking-wider">Pinned</span>
                                                </div>
                                            )}

                                            <div className="w-full aspect-video bg-gray-900 rounded-[30px] mb-6 relative overflow-hidden flex-shrink-0">
                                                {post.image_url ? (
                                                    <Image
                                                        src={post.image_url}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-700">
                                                        🥕
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>

                                            <div className="px-2 pb-4 flex flex-col flex-grow">
                                                <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-neon-pink transition-colors">
                                                    {post.title}
                                                </h3>

                                                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                                    {post.excerpt || (post.content ? post.content.substring(0, 100) + '...' : 'No preview available.')}
                                                </p>

                                                {post.tags && (
                                                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                                                        {post.tags.map((t: string) => (
                                                            <span key={t} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-neon-blue uppercase tracking-wider group-hover:bg-neon-blue group-hover:text-black transition-colors">
                                                                #{t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </ParallaxCard>
                                </Link>
                            </motion.div>
                        </div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Empty State */}
            {visiblePosts.length === 0 && !loading && (
                <div className="text-center py-20 col-span-full">
                    <p className="text-gray-500 text-xl">No memories found matching your vibes. 🌑</p>
                </div>
            )}

            {/* 4. The "Load More" Interaction */}
            {visiblePosts.length < allPosts.length && (
                <div className="text-center mt-16">
                    <button
                        onClick={handleLoadMore}
                        className="group relative px-8 py-4 rounded-full bg-white/5 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-neon-pink hover:border-neon-pink hover:shadow-[0_0_30px_#FF4DA6] transition-all duration-300"
                    >
                        <span className="flex items-center gap-2">
                            Load More Memories <Loader2 className="group-hover:animate-spin" size={16} />
                        </span>
                    </button>
                </div>
            )}

        </main>
    );
}
