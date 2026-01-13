'use client';
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { ParallaxCard } from "@/components/ParallaxCard";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Filter, ChevronDown, Check } from "lucide-react";

export default function GalleryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [showCollectionMenu, setShowCollectionMenu] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function fetchGallery() {
            // Fetch gallery items from Supabase
            const { data } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false });
            if (data) setItems(data);
            setLoading(false);
        }
        fetchGallery();
    }, []);

    const handleNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!selectedItem) return;
        const currentIndex = items.findIndex(item => item.id === selectedItem.id);
        const nextIndex = (currentIndex + 1) % items.length;
        setSelectedItem(items[nextIndex]);
    }, [items, selectedItem]);

    const handlePrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!selectedItem) return;
        const currentIndex = items.findIndex(item => item.id === selectedItem.id);
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        setSelectedItem(items[prevIndex]);
    }, [items, selectedItem]);


    useEffect(() => {
        if (!selectedItem) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') setSelectedItem(null);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedItem, handleNext, handlePrev]);

    const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x < -50) {
            handleNext();
        } else if (info.offset.x > 50) {
            handlePrev();
        }
    };

    // Derive unique tags for the filter menu
    const uniqueTags = Array.from(new Set(items.flatMap(item => item.tags || []))).sort();

    // Filter items based on selectedTag
    const filteredItems = selectedTag
        ? items.filter(item => item.tags && item.tags.includes(selectedTag))
        : items;

    if (loading) return <div className="min-h-screen pt-32 flex justify-center text-neon-pink animate-pulse">Summoning Art...</div>;

    return (
        <main className="min-h-screen pt-32 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="relative mb-16 max-w-7xl mx-auto px-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
                <div className="hidden md:block" />
                <div className="text-center">
                    <h1 className="text-6xl md:text-8xl font-[family-name:var(--font-baloo)] text-white mb-4 uppercase tracking-tighter drop-shadow-lg">
                        My <span className="text-neon-pink">Carrot</span> Patch
                    </h1>
                    <p className="text-gray-400 text-xl font-medium tracking-wide">Growing digital dreams, one line at a time.</p>
                </div>

                {/* Collection Button */}
                <div className="mt-8 flex justify-center md:mt-0 md:justify-end z-30">
                    <div className="relative text-left">
                        <button
                            onClick={() => setShowCollectionMenu(!showCollectionMenu)}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neon-pink/50 rounded-full backdrop-blur-md transition-all group"
                        >
                            <Filter size={18} className="text-neon-pink group-hover:scale-110 transition-transform" />
                            <span className="text-white font-bold uppercase tracking-wider text-sm">
                                {selectedTag || 'Collection'}
                            </span>
                            <ChevronDown size={16} className={`text-gray-400 transition-transform ${showCollectionMenu ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {showCollectionMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute left-0 md:left-auto md:right-0 mt-3 w-56 bg-black/90 border border-white/10 rounded-2xl shadow-xl shadow-neon-pink/10 backdrop-blur-xl overflow-hidden z-40"
                                >
                                    <div className="p-2 space-y-1">
                                        <button
                                            onClick={() => { setSelectedTag(null); setShowCollectionMenu(false); }}
                                            className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm font-medium transition-colors ${!selectedTag ? 'bg-neon-pink/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            <span>All Artwork</span>
                                            {!selectedTag && <Check size={14} className="text-neon-pink" />}
                                        </button>

                                        <div className="h-px bg-white/10 my-1" />

                                        {uniqueTags.map(tag => (
                                            <button
                                                key={tag as string}
                                                onClick={() => { setSelectedTag(tag as string); setShowCollectionMenu(false); }}
                                                className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedTag === tag ? 'bg-neon-pink/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                            >
                                                <span className="capitalize">{tag as string}</span>
                                                {selectedTag === tag && <Check size={14} className="text-neon-pink" />}
                                            </button>
                                        ))}

                                        {uniqueTags.length === 0 && (
                                            <div className="px-4 py-2 text-xs text-gray-600 italic">No collections found</div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Masonry Layout matching Work Page */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {filteredItems.length === 0 && <p className="text-center text-gray-500 col-span-full">No artwork planted yet.</p>}

                {filteredItems.map((art) => (
                    <div key={art.id} className="break-inside-avoid">
                        <motion.div
                            layoutId={`card-${art.id}`}
                            onClick={() => setSelectedItem(art)}
                            className="cursor-pointer"
                        >
                            <ParallaxCard className="bg-black/80 backdrop-blur-sm border-white/5 hover:border-neon-pink/50 transition-colors">
                                <div className="flex flex-col h-full">
                                    <div className="w-full aspect-auto bg-gray-900 rounded-[30px] mb-6 relative overflow-hidden">
                                        {art.image_url ? (
                                            <Image
                                                src={art.image_url}
                                                alt={art.caption || 'Gallery Image'}
                                                width={500}
                                                height={500}
                                                className="w-full h-auto object-cover"
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
                ))}
            </div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {selectedItem && (

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            layoutId={`card-${selectedItem.id}`}
                            className="w-full max-w-6xl h-[85vh] bg-black rounded-[32px] border border-white/10 relative overflow-hidden flex flex-col shadow-2xl shadow-neon-purple/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative w-full flex-1 overflow-hidden group bg-black/50">
                                <motion.div
                                    className="relative w-full h-full"
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.2}
                                    onDragEnd={onDragEnd}
                                >
                                    {selectedItem.image_url && (
                                        <Image
                                            src={selectedItem.image_url}
                                            alt={selectedItem.caption || 'Full View'}
                                            fill
                                            className="object-contain pointer-events-none"
                                            draggable={false}
                                        />
                                    )}
                                </motion.div>

                                {/* Navigation Buttons - Always visible on mobile, hover on desktop */}
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-neon-pink text-white rounded-full p-2 md:p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all transform active:scale-95 md:hover:scale-110 z-10"
                                >
                                    <ChevronLeft size={24} className="md:w-8 md:h-8" />
                                </button>

                                <button
                                    onClick={handleNext}
                                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-neon-pink text-white rounded-full p-2 md:p-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all transform active:scale-95 md:hover:scale-110 z-10"
                                >
                                    <ChevronRight size={24} className="md:w-8 md:h-8" />
                                </button>
                            </div>

                            {/* Caption - Optional, displays at bottom */}
                            {selectedItem.caption && (
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-6 text-center">
                                    <p className="text-xl text-white font-medium">{selectedItem.caption}</p>
                                </div>
                            )}

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 bg-black/50 hover:bg-neon-pink hover:text-white text-white rounded-full p-2 transition-all z-20"
                            >
                                <X size={24} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
