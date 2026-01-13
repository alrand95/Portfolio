'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowButton } from '@/components/GlowButton';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Upload, Search, LayoutGrid, Filter, Edit, Trash2, Image as ImageIcon, Info, X, Plus } from 'lucide-react';

export function GalleryPageClient() {
    const supabase = createClient();
    const [items, setItems] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [editingTags, setEditingTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [availableTags, setAvailableTags] = useState<string[]>([]);

    const fetchItems = useCallback(async () => {
        const { data } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false });
        if (data) setItems(data);

        // Extract tags
        const tags = new Set<string>();
        data?.forEach((item: any) => item.tags?.forEach((t: string) => tags.add(t)));
        setAvailableTags(Array.from(tags));
    }, [supabase]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleAddTag = (tag: string) => {
        if (!editingTags.includes(tag)) setEditingTags([...editingTags, tag]);
    };

    const handleRemoveTag = (tag: string) => {
        setEditingTags(editingTags.filter(t => t !== tag));
    };

    const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (tagInput.trim()) {
                handleAddTag(tagInput.trim());
                setTagInput('');
            }
        }
    };


    // Handle File Upload
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);

        const files = Array.from(e.target.files);

        for (const file of files) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage.from('gallery-images').upload(filePath, file);

            if (uploadError) {
                alert(`Error uploading ${file.name}: ${uploadError.message}`);
                continue;
            }

            const { data: { publicUrl } } = supabase.storage.from('gallery-images').getPublicUrl(filePath);

            await supabase.from('gallery_items').insert({
                image_url: publicUrl,
                title: file.name.split('.')[0],
                caption: '',
                tags: []
            });
        }

        setUploading(false);
        fetchItems();
    };

    const handleSaveDetails = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updates = {
            title: formData.get('title'),
            caption: formData.get('caption'),
            tags: editingTags,
        };

        const { error } = await supabase.from('gallery_items').update(updates).eq('id', selectedItem.id);
        if (!error) {
            setSelectedItem(null);
            fetchItems();
        } else {
            alert('Failed to update: ' + error.message);
        }
    };

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!confirm('Delete this artwork?')) return;

        const { error: dbError } = await supabase.from('gallery_items').delete().eq('id', id);
        if (dbError) {
            alert('Delete failed');
            return;
        }

        const path = imageUrl.split('gallery-images/').pop();
        if (path) {
            await supabase.storage.from('gallery-images').remove([path]);
        }

        fetchItems();
    };

    const filteredItems = items.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-12">
            {/* 🎩 PAGE HEADER */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                        Visual <span className="text-neon-blue">Database</span>
                    </h1>
                    <p className="text-gray-400 font-medium italic">Curating the aesthetic dimension of the void.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <input type="file" multiple onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                        <GlowButton
                            variant="secondary"
                            className={cn(
                                "h-14 px-8 rounded-full shadow-[0_0_20px_rgba(75,208,255,0.3)] hover:scale-105 transition-transform",
                                uploading && "opacity-50"
                            )}
                        >
                            {uploading ? 'Syphoning Data...' : <><Upload className="inline mr-2" /> Inject Assets</>}
                        </GlowButton>
                    </div>
                </div>
            </header>

            {/* 🔍 FILTERS & TOOLS */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-blue transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search the archives..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 pl-14 pr-6 glass rounded-full border-white/5 focus:border-neon-blue/50 outline-none text-white font-medium"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="w-14 h-14 flex items-center justify-center glass rounded-full text-neon-blue border-neon-blue/30 shadow-[0_0_15px_rgba(75,208,255,0.1)]">
                        <LayoutGrid size={24} />
                    </button>
                    <button className="w-14 h-14 flex items-center justify-center glass rounded-full text-gray-500 hover:text-white transition-colors">
                        <Filter size={24} />
                    </button>
                </div>
            </div>

            {/* 🖼️ GALLERY GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {filteredItems.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <div className="group relative aspect-square glass rounded-[40px] overflow-hidden border-white/5 hover:border-neon-blue/50 transition-all duration-500">
                            <Image src={item.image_url} alt={item.title || 'Art'} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />

                            {/* Overlay Details */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <h3 className="text-white font-black uppercase text-lg mb-1 truncate">{item.title}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    {item.tags?.slice(0, 2).map((tag: string) => (
                                        <span key={tag} className="text-[10px] font-black uppercase tracking-widest text-neon-blue/80 bg-neon-blue/10 px-2 py-0.5 rounded-full border border-neon-blue/20">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedItem(item)}
                                        className="flex-1 h-12 flex items-center justify-center glass rounded-2xl bg-white/10 hover:bg-neon-blue hover:text-black transition-all font-black uppercase text-[10px] tracking-widest"
                                    >
                                        <Edit size={16} className="mr-2" /> Configure
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id, item.image_url)}
                                        className="w-12 h-12 flex items-center justify-center glass rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {filteredItems.length === 0 && !uploading && (
                    <div className="col-span-full py-40 text-center glass rounded-[60px] border-dashed border-white/10 flex flex-col items-center justify-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-gray-700">
                            <ImageIcon size={40} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-black uppercase tracking-tighter text-white/50">Archives Empty</p>
                            <p className="text-gray-600 text-sm font-medium italic">No visual artifacts detected in this sector.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* 🎨 ASSET EDITOR MODAL */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-4xl glass border-white/10 rounded-[60px] overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(75,208,255,0.2)]"
                        >
                            {/* Preview Area */}
                            <div className="md:w-1/2 aspect-square relative bg-black/40">
                                <Image src={selectedItem.image_url} alt={selectedItem.title} fill className="object-contain" />
                                <div className="absolute top-8 left-8 p-3 glass rounded-2xl text-neon-blue">
                                    <Info size={24} />
                                </div>
                            </div>

                            {/* Form Area */}
                            <div className="md:w-1/2 p-12 flex flex-col">
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Metadata <span className="text-neon-blue">Sync</span></h2>
                                    <button onClick={() => setSelectedItem(null)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                                        <X size={24} className="text-gray-500" />
                                    </button>
                                </div>

                                <form onSubmit={handleSaveDetails} className="space-y-8 flex-1">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue">Asset Designation</label>
                                        <input
                                            name="title"
                                            defaultValue={selectedItem.title}
                                            className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:border-neon-blue focus:bg-white/10 outline-none transition-all font-bold"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue">Transmission Context (Caption)</label>
                                        <textarea
                                            name="caption"
                                            defaultValue={selectedItem.caption}
                                            rows={3}
                                            className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:border-neon-blue focus:bg-white/10 outline-none transition-all leading-relaxed"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neon-blue">System Tags</label>
                                        <div className="flex flex-col gap-3">
                                            {/* Active Tags */}
                                            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 glass bg-white/5 border border-white/10 rounded-2xl">
                                                {editingTags.map(tag => (
                                                    <span key={tag} className="flex items-center gap-1 pl-3 pr-1 py-1 bg-neon-blue/20 text-neon-blue text-xs font-bold uppercase rounded-full border border-neon-blue/30">
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveTag(tag)}
                                                            className="p-0.5 hover:bg-neon-blue/20 rounded-full transition-colors"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </span>
                                                ))}
                                                <input
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyDown={handleTagInputKeyDown}
                                                    className="flex-1 bg-transparent border-none outline-none text-white text-sm min-w-[100px] px-2"
                                                    placeholder="Type & Enter..."
                                                />
                                            </div>

                                            {/* Suggestions */}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                <span className="text-gray-500 text-xs font-medium self-center mr-2">Quick Add:</span>
                                                {availableTags.filter(t => !editingTags.includes(t)).slice(0, 10).map(tag => (
                                                    <button
                                                        type="button"
                                                        key={tag}
                                                        onClick={() => handleAddTag(tag)}
                                                        className="flex items-center gap-1 px-3 py-1.5 glass bg-white/5 hover:bg-neon-blue/20 border border-white/10 hover:border-neon-blue/50 rounded-full text-xs text-gray-400 hover:text-white transition-all group"
                                                    >
                                                        <Plus size={10} className="group-hover:text-neon-blue" /> {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-10">
                                        <GlowButton type="submit" variant="secondary" className="w-full h-16 rounded-full text-lg shadow-[0_0_30px_rgba(75,208,255,0.2)]">
                                            Apply Matrix Updates
                                        </GlowButton>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
