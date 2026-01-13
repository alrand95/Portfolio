'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Trash2, Edit, Plus, FileText, Calendar, Tag, Eye,
    Upload, Image as ImageIcon, Link as LinkIcon, Loader2, Save,
    ChevronLeft, Settings, Globe, Clock, Search, Bold, Italic, Code, Quote, List, Pin
} from 'lucide-react';
import { AdminCard } from '@/components/admin/AdminCard';
import { GlowButton } from '@/components/GlowButton';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';

// -----------------------------------------------------------------------------
// 🛠️ TYPES
// -----------------------------------------------------------------------------
interface BlogPost {
    id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image_url: string;
    tags: string[];
    published_at: string | null;
    is_pinned?: boolean;
    created_at?: string;
    views?: number;
}

const EMPTY_POST: BlogPost = {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image_url: '',
    tags: [],

    published_at: null,
    is_pinned: false
};

// -----------------------------------------------------------------------------
// 🚀 COMPONENT
// -----------------------------------------------------------------------------
export function BlogPageClient() {
    // 🌍 STATE
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState<BlogPost>(EMPTY_POST);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showMobileSettings, setShowMobileSettings] = useState(false);
    const [mounted, setMounted] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const supabase = createClient();
    const router = useRouter();

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching posts:', error);
        } else {
            setPosts(data || []);
        }
        setLoading(false);
    }, [supabase]);

    // 🔄 FETCH DATA
    useEffect(() => {
        setMounted(true);
        fetchPosts();
    }, [fetchPosts]);

    // 💾 SAVE POST
    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSaving(true);

        // Sanitize Payload: Only send fields that definitely exist in the DB schema
        const timestamp = new Date().toISOString();
        const postData = {
            title: currentPost.title,
            content: currentPost.content,
            slug: currentPost.slug || currentPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            image_url: currentPost.image_url,
            tags: currentPost.tags || [],
            published_at: currentPost.published_at,
            is_pinned: currentPost.is_pinned || false,
            updated_at: timestamp
        };

        let error;
        if (currentPost.id) {
            // Update
            const { error: updateError } = await supabase
                .from('blog_posts')
                .update(postData)
                .eq('id', currentPost.id);
            error = updateError;
        } else {
            // Insert
            const { error: insertError } = await supabase
                .from('blog_posts')
                .insert([postData]);
            error = insertError;
        }

        if (error) {
            alert(`Failed to save: ${error.message}`);
        } else {
            setIsEditorOpen(false);
            fetchPosts();
        }
        setIsSaving(false);
    };

    // 🗑️ DELETE POST
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this tale forever?')) return;

        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) {
            alert(`Failed to delete: ${error.message}`);
        } else {
            setPosts(prev => prev.filter(p => p.id !== id));
        }
    };

    // 🖼️ IMAGE UPLOAD
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'cover' | 'content') => {
        if (!e.target.files?.length) return;
        setIsUploading(true);

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // 1. Upload
        const { error: uploadError } = await supabase.storage.from('blog_images').upload(filePath, file);

        if (uploadError) {
            // Try fallback
            const { error: fallbackError } = await supabase.storage.from('gallery-images').upload(filePath, file);
            if (fallbackError) {
                alert('Upload failed: ' + fallbackError.message);
                setIsUploading(false);
                return;
            }
        }

        // 2. Get URL
        // Try getting from primary
        let { data: { publicUrl } } = supabase.storage.from('blog_images').getPublicUrl(filePath);

        // If upload was strictly to fallback, use that url
        if (uploadError) {
            const { data: { publicUrl: fallbackUrl } } = supabase.storage.from('gallery-images').getPublicUrl(filePath);
            publicUrl = fallbackUrl;
        }

        // 3. Apply
        if (target === 'cover') {
            setCurrentPost(prev => ({ ...prev, image_url: publicUrl }));
        } else {
            const markdownImage = `![Image](${publicUrl})`;
            navigator.clipboard.writeText(markdownImage);
            alert('Image uploaded! Markdown copied to clipboard.');
        }

        setIsUploading(false);
    };

    // -------------------------------------------------------------------------
    // 🎨 RENDER
    // -------------------------------------------------------------------------
    return (
        <div className="space-y-8">

            {/* 🎩 DASHBOARD HEADER */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                        Tales <span className="text-neon-pink">Admin</span>
                    </h1>
                    <p className="text-gray-400 font-medium italic">Manage your digital chronicles.</p>
                </div>
                <div className="flex gap-4">
                    <div className="hidden md:flex flex-col items-end justify-center pr-4 border-r border-white/10">
                        <span className="text-2xl font-black text-white leading-none">{posts.length}</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Tales</span>
                    </div>
                    <GlowButton
                        onClick={() => { setCurrentPost(EMPTY_POST); setIsEditorOpen(true); }}
                        className="h-12 md:h-14 px-4 md:px-8 w-full md:w-auto text-xs md:text-sm whitespace-nowrap rounded-full shadow-[0_0_20px_rgba(255,77,166,0.3)] flex items-center justify-center"
                    >
                        <Plus className="inline mr-2" size={16} />
                        <span className="md:hidden">New Tale</span>
                        <span className="hidden md:inline">Manifest New Tale</span>
                    </GlowButton>
                </div>
            </header>

            {/* 📋 POST LIST */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 className="animate-spin text-neon-pink w-12 h-12" />
                    </div>
                ) : (
                    <AnimatePresence>
                        {posts.map((post) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                layout
                            >
                                <AdminCard className="group hover:bg-white/[0.03] transition-colors border-white/5 data-[state=published]:border-neon-pink/20">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                                        <div className="flex items-center gap-4 sm:gap-6 overflow-hidden w-full sm:w-auto">
                                            {/* Status Dot */}
                                            <div className={cn(
                                                "w-3 h-3 rounded-full shrink-0 shadow-[0_0_10px_currentColor]",
                                                post.published_at ? "bg-neon-pink text-neon-pink" : "bg-gray-600 text-gray-600"
                                            )} />

                                            {/* Image Thumbnail */}
                                            <div className="relative w-16 h-16 rounded-xl bg-black/40 border border-white/10 overflow-hidden shrink-0">
                                                {post.image_url ? (
                                                    <Image src={post.image_url} alt="Thumbnail" fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                        <ImageIcon size={20} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-lg font-bold text-white truncate group-hover:text-neon-blue transition-colors">
                                                    {post.title || 'Untitled Draft'}
                                                </h3>
                                                <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Just now'}
                                                    </span>
                                                    {post.published_at && (
                                                        <span className="text-neon-pink font-bold uppercase tracking-wider">Published</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                                            <button
                                                onClick={() => { setCurrentPost(post); setIsEditorOpen(true); }}
                                                className="w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center hover:bg-neon-blue hover:text-black transition-all"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => post.id && handleDelete(post.id)}
                                                className="w-10 h-10 rounded-full glass border-white/10 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </AdminCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* ✏️ FULL SCREEN EDITOR OVERLAY */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isEditorOpen && (
                        <div className="relative z-[9999]">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[200]"
                                onClick={() => { if (confirm('Discard unsaved changes?')) setIsEditorOpen(false); }}
                            />

                            {/* Modal Container */}
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed inset-0 z-[210] flex flex-col bg-[#050505]"
                            >
                                {/* 1. EDITOR HEADER */}
                                <div className="h-auto md:h-20 border-b border-white/10 bg-black/50 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-12 py-4 md:py-0 shrink-0 gap-4">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <button
                                            onClick={() => setIsEditorOpen(false)}
                                            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <div>
                                            <input
                                                value={currentPost.title || ''}
                                                onChange={(e) => setCurrentPost(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="Enter Tale Title..."
                                                className="bg-transparent text-lg md:text-2xl font-black text-white placeholder-gray-700 outline-none w-full md:w-[500px]"
                                            />
                                            <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                                                <span className="text-neon-pink">slug:</span>
                                                <input
                                                    value={currentPost.slug || ''}
                                                    onChange={(e) => setCurrentPost(prev => ({ ...prev, slug: e.target.value }))}
                                                    placeholder="auto-generated-slug"
                                                    className="bg-transparent outline-none text-gray-400 focus:text-white transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-end">
                                        <button
                                            onClick={() => setShowMobileSettings(!showMobileSettings)}
                                            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-all"
                                        >
                                            <Settings size={14} />
                                        </button>

                                        <button
                                            onClick={() => setShowPreview(!showPreview)}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
                                                showPreview
                                                    ? "bg-neon-blue text-black border-neon-blue shadow-[0_0_15px_rgba(75,208,255,0.4)]"
                                                    : "border-white/20 text-gray-400 hover:text-white"
                                            )}
                                        >
                                            {showPreview ? <Edit size={14} /> : <Eye size={14} />}
                                            <span className="hidden md:inline">{showPreview ? 'Edit' : 'Preview'}</span>
                                        </button>

                                        <button
                                            onClick={() => handleSave()}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-6 py-2 rounded-full bg-neon-pink text-white text-xs font-bold uppercase tracking-widest hover:bg-neon-pink/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,77,166,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex-1 md:flex-none justify-center"
                                        >
                                            {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                            {isSaving ? 'Syncing...' : 'Save'}
                                        </button>
                                    </div>
                                </div>

                                {/* 2. EDITOR BODY */}
                                <div className="flex-1 flex overflow-hidden">

                                    {/* LEFT: MAIN CONTENT */}
                                    <div className="flex-1 overflow-y-auto p-4 md:p-12 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                                        <div className="w-full space-y-8 min-h-screen">

                                            {/* Cover Image Uploader */}
                                            <div className="aspect-video w-full rounded-[32px] border-2 border-dashed border-white/10 bg-white/[0.02] hover:border-neon-pink/30 hover:bg-neon-pink/[0.02] transition-all relative group overflow-hidden flex items-center justify-center cursor-pointer">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => handleImageUpload(e, 'cover')}
                                                />
                                                {currentPost.image_url ? (
                                                    <Image src={currentPost.image_url} alt="Cover" fill className="object-cover" />
                                                ) : (
                                                    <div className="text-center group-hover:scale-110 transition-transform">
                                                        {isUploading ? <Loader2 className="animate-spin mb-2 mx-auto text-neon-pink" /> : <ImageIcon className="mb-2 mx-auto text-gray-600 group-hover:text-neon-pink" size={32} />}
                                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Set Cover Artifact</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content Editor / Preview */}
                                            {/* Preview Mode */}
                                            {showPreview && (
                                                <article className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-p:text-gray-300 prose-a:text-neon-pink">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        rehypePlugins={[rehypeHighlight]}
                                                    >
                                                        {currentPost.content}
                                                    </ReactMarkdown>
                                                </article>
                                            )}
                                            {!showPreview && (
                                                <div className="sticky top-0 z-10 flex items-center gap-1 mb-4 p-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 overflow-x-auto no-scrollbar shadow-lg">
                                                    {[
                                                        { icon: Bold, label: 'Bold (Ctrl+B)', token: '**' },
                                                        { icon: Italic, label: 'Italic (Ctrl+I)', token: '_' },
                                                        { icon: Code, label: 'Code', token: '`' },
                                                        { icon: Quote, label: 'Quote', prefix: '> ' },
                                                        { icon: List, label: 'List', prefix: '- ' },
                                                        { icon: LinkIcon, label: 'Link (Ctrl+K)', template: '[text](url)' },
                                                        { icon: ImageIcon, label: 'Image', template: '![alt](url)' },
                                                    ].map((action, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => {
                                                                const textarea = textareaRef.current;
                                                                if (!textarea) return;

                                                                const start = textarea.selectionStart;
                                                                const end = textarea.selectionEnd;
                                                                const text = textarea.value;
                                                                const selection = text.substring(start, end);

                                                                let newText = '';
                                                                let newCursorPos = 0;

                                                                if (action.template) {
                                                                    newText = text.substring(0, start) + action.template + text.substring(end);
                                                                    newCursorPos = start + 2; // Position in 'text' or 'alt'
                                                                } else if (action.prefix) {
                                                                    newText = text.substring(0, start) + action.prefix + selection + text.substring(end);
                                                                    newCursorPos = end + action.prefix.length;
                                                                } else if (action.token) {
                                                                    newText = text.substring(0, start) + action.token + selection + action.token + text.substring(end);
                                                                    newCursorPos = end + action.token.length * 2;
                                                                }

                                                                setCurrentPost(prev => ({ ...prev, content: newText }));

                                                                // Restore focus and cursor (needs timeout for React render)
                                                                setTimeout(() => {
                                                                    textarea.focus();
                                                                    textarea.setSelectionRange(newCursorPos, newCursorPos);
                                                                }, 0);
                                                            }}
                                                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                                            title={action.label}
                                                        >
                                                            <action.icon size={16} />
                                                        </button>
                                                    ))}
                                                    <div className="w-[1px] h-6 bg-white/10 mx-2" />
                                                    <span className="text-[10px] text-gray-500 font-mono uppercase">Markdown Supported</span>
                                                </div>
                                            )}

                                            {/* Text Area with Paste Handler */}
                                            {!showPreview && (
                                                <textarea
                                                    ref={textareaRef}
                                                    id="editor-textarea"
                                                    value={currentPost.content || ''}
                                                    onChange={(e) => setCurrentPost(prev => ({ ...prev, content: e.target.value }))}
                                                    onKeyDown={(e) => {
                                                        const textarea = e.currentTarget;
                                                        const start = textarea.selectionStart;
                                                        const end = textarea.selectionEnd;
                                                        const text = textarea.value;
                                                        const selection = text.substring(start, end);

                                                        let token = '';
                                                        let template = '';

                                                        if ((e.ctrlKey || e.metaKey) && e.key === 'b') { token = '**'; }
                                                        else if ((e.ctrlKey || e.metaKey) && e.key === 'i') { token = '_'; }
                                                        else if ((e.ctrlKey || e.metaKey) && e.key === 'k') { template = '[text](url)'; }

                                                        if (token || template) {
                                                            e.preventDefault();
                                                            let newText = '';
                                                            let newCursorPos = 0;

                                                            if (template) {
                                                                newText = text.substring(0, start) + template + text.substring(end);
                                                                newCursorPos = start + 2;
                                                            } else {
                                                                newText = text.substring(0, start) + token + selection + token + text.substring(end);
                                                                newCursorPos = end + token.length * 2;
                                                            }

                                                            setCurrentPost(prev => ({ ...prev, content: newText }));
                                                            setTimeout(() => {
                                                                textarea.focus();
                                                                textarea.setSelectionRange(newCursorPos, newCursorPos);
                                                            }, 0);
                                                        }
                                                    }}
                                                    onPaste={async (e) => {
                                                        const items = e.clipboardData.items;
                                                        for (const item of items) {
                                                            if (item.type.indexOf('image') === 0) {
                                                                e.preventDefault();
                                                                const file = item.getAsFile();
                                                                if (!file) return;

                                                                // Upload logic (reusing existing logic but customized for inline)
                                                                const fileExt = file.name.split('.').pop();
                                                                const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                                                                const filePath = `${fileName}`;

                                                                try {
                                                                    // Optimistic loading state could go here
                                                                    const textarea = e.currentTarget;
                                                                    const start = textarea.selectionStart;
                                                                    const text = textarea.value;
                                                                    const placeholder = `![Uploading ${file.name}...]()...`;

                                                                    setCurrentPost(prev => ({
                                                                        ...prev,
                                                                        content: text.substring(0, start) + placeholder + text.substring(start)
                                                                    }));

                                                                    const { error: uploadError } = await supabase.storage
                                                                        .from('blog_images')
                                                                        .upload(filePath, file);

                                                                    if (uploadError) throw uploadError;

                                                                    const { data: { publicUrl } } = supabase.storage
                                                                        .from('blog_images')
                                                                        .getPublicUrl(filePath);

                                                                    // Replace placeholder
                                                                    setCurrentPost(prev => ({
                                                                        ...prev,
                                                                        content: prev.content.replace(placeholder, `![Image](${publicUrl})`)
                                                                    }));

                                                                } catch (error) {
                                                                    console.error('Paste upload failed:', error);
                                                                    alert('Failed to upload pasted image');
                                                                }
                                                            }
                                                        }
                                                    }}
                                                    placeholder="# Begin your transmission..."
                                                    className="w-full min-h-[85vh] bg-transparent text-gray-200 text-lg leading-relaxed outline-none placeholder-gray-700 font-mono resize-none focus:outline-none"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* RIGHT: SIDEBAR (Responsive) */}
                                    <div className={cn(
                                        "fixed inset-y-0 right-0 z-[220] w-80 bg-[#0a0a0c] lg:bg-black/20 backdrop-blur-md border-l border-white/10 p-6 overflow-y-auto transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:block lg:z-auto",
                                        showMobileSettings ? "translate-x-0" : "translate-x-full"
                                    )}>
                                        <div className="flex items-center justify-between lg:hidden mb-6">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Settings</h3>
                                            <button onClick={() => setShowMobileSettings(false)}>
                                                <X size={20} className="text-gray-400" />
                                            </button>
                                        </div>
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6">Metadata</h3>

                                        <div className="space-y-6">

                                            {/* 1. PUBLISHING CONTROL */}
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!currentPost.published_at}
                                                            onChange={(e) => setCurrentPost(prev => ({
                                                                ...prev,
                                                                published_at: e.target.checked ? (prev.published_at || new Date().toISOString()) : null
                                                            }))}
                                                            className="sr-only"
                                                        />
                                                        <div className={cn(
                                                            "w-10 h-6 rounded-full transition-colors",
                                                            currentPost.published_at ? "bg-neon-pink" : "bg-gray-700"
                                                        )} />
                                                        <div className={cn(
                                                            "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                                                            currentPost.published_at ? "translate-x-4" : "translate-x-0"
                                                        )} />
                                                    </div>
                                                </label>
                                            </div>

                                            {/* Pin to Top */}
                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                <span className="text-sm font-bold text-white flex items-center gap-2">
                                                    <Pin size={14} className={currentPost.is_pinned ? "text-neon-blue" : "text-gray-500"} />
                                                    Pin to Top
                                                </span>
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!currentPost.is_pinned}
                                                            onChange={(e) => setCurrentPost(prev => ({
                                                                ...prev,
                                                                is_pinned: e.target.checked
                                                            }))}
                                                            className="sr-only"
                                                        />
                                                        <div className={cn(
                                                            "w-10 h-6 rounded-full transition-colors",
                                                            currentPost.is_pinned ? "bg-neon-blue" : "bg-gray-700"
                                                        )} />
                                                        <div className={cn(
                                                            "absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform",
                                                            currentPost.is_pinned ? "translate-x-4" : "translate-x-0"
                                                        )} />
                                                    </div>
                                                </label>
                                            </div>

                                            {/* Date Picker */}
                                            {currentPost.published_at && (
                                                <div className="pt-4 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
                                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                                                        Publish Date (UTC)
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        value={new Date(currentPost.published_at).toISOString().slice(0, 16)}
                                                        onChange={(e) => setCurrentPost(prev => ({
                                                            ...prev,
                                                            published_at: new Date(e.target.value).toISOString()
                                                        }))}
                                                        className="w-full bg-black/20 rounded-lg border border-white/10 p-2 text-xs text-white outline-none focus:border-neon-pink/50 font-mono"
                                                    />
                                                </div>
                                            )}

                                            {/* Slug Override */}
                                            <div className="pt-4 border-t border-white/5">
                                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                                                    URL Slug
                                                </label>
                                                <input
                                                    type="text"
                                                    value={currentPost.slug || ''}
                                                    onChange={(e) => setCurrentPost(prev => ({
                                                        ...prev,
                                                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-')
                                                    }))}
                                                    placeholder="auto-generated-from-title"
                                                    className="w-full bg-black/20 rounded-lg border border-white/10 p-2 text-xs text-gray-300 outline-none focus:border-neon-pink/50 font-mono placeholder-gray-700"
                                                />
                                            </div>
                                        </div>

                                        {/* 2. STATS & INFO */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                                <div className="text-[10px] font-bold uppercase text-gray-500 mb-1 flex items-center gap-1">
                                                    <Clock size={10} /> Reading Time
                                                </div>
                                                <div className="text-2xl font-black text-white">
                                                    {Math.ceil(currentPost.content.split(/\s+/).length / 200)} <span className="text-xs font-medium text-gray-400">min</span>
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                                                <div className="text-[10px] font-bold uppercase text-gray-500 mb-1">
                                                    Word Count
                                                </div>
                                                <div className="text-2xl font-black text-white">
                                                    {currentPost.content.trim().length === 0 ? 0 : currentPost.content.trim().split(/\s+/).length}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 3. SEO PREVIEW */}
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1">
                                                <Search size={12} /> SEO / Social Preview
                                            </label>
                                            <div className="bg-[#0f0f11] rounded-xl border border-white/10 p-3 overflow-hidden group hover:border-white/20 transition-colors">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-[10px] text-white font-bold">B</div>
                                                    <div>
                                                        <div className="text-[10px] text-gray-300 leading-none">Bunny Portfolio</div>
                                                        <div className="text-[8px] text-gray-600 leading-none mt-0.5">bunny.net/blog/{currentPost.slug || 'slug'}</div>
                                                    </div>
                                                </div>
                                                <div className="text-sm font-bold text-neon-blue mb-1 truncate">
                                                    {currentPost.title || 'Your Awesome Title'}
                                                </div>
                                                <div className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
                                                    {currentPost.excerpt || currentPost.content.slice(0, 150) || 'Write some content to see how it looks nicely in search results...'}
                                                </div>
                                                {currentPost.image_url && (
                                                    <div className="mt-3 rounded-lg overflow-hidden h-24 relative opacity-80 group-hover:opacity-100 transition-opacity">
                                                        <Image src={currentPost.image_url} alt="" fill className="object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 4. CONTENT METADATA */}
                                        <div className="space-y-4 pt-4 border-t border-white/10">
                                            {/* Excerpt */}
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Excerpt</label>
                                                <textarea
                                                    value={currentPost.excerpt || ''}
                                                    onChange={(e) => setCurrentPost(prev => ({ ...prev, excerpt: e.target.value }))}
                                                    rows={3}
                                                    className="w-full bg-white/5 rounded-xl border border-white/10 p-3 text-sm text-gray-300 outline-none focus:border-neon-blue/50 transition-colors resize-none"
                                                    placeholder="Brief summary for cards and SEO..."
                                                />
                                            </div>

                                            {/* Tags */}
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Tags</label>
                                                <div className="w-full bg-white/5 rounded-xl border border-white/10 p-2 flex flex-wrap gap-2 focus-within:border-neon-blue/50 transition-colors min-h-[50px]">
                                                    {currentPost.tags.map((tag, index) => (
                                                        <span key={index} className="flex items-center gap-1 px-3 py-1 bg-neon-pink/10 text-neon-pink rounded-full text-xs font-bold border border-neon-pink/20">
                                                            {tag}
                                                            <button
                                                                onClick={() => setCurrentPost(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }))}
                                                                className="hover:text-white transition-colors"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                    <input
                                                        type="text"
                                                        placeholder={currentPost.tags.length === 0 ? "Add tags..." : ""}
                                                        className="bg-transparent outline-none text-sm text-gray-300 placeholder-gray-600 min-w-[80px] flex-1 py-1 px-1"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' || e.key === ',') {
                                                                e.preventDefault();
                                                                const val = e.currentTarget.value.trim();
                                                                if (val && !currentPost.tags.includes(val)) {
                                                                    setCurrentPost(prev => ({ ...prev, tags: [...prev.tags, val] }));
                                                                    e.currentTarget.value = '';
                                                                }
                                                            } else if (e.key === 'Backspace' && e.currentTarget.value === '' && currentPost.tags.length > 0) {
                                                                setCurrentPost(prev => ({ ...prev, tags: prev.tags.slice(0, -1) }));
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>    <p className="text-[10px] text-gray-600 mt-2 font-mono">Press Enter or Comma to add tag</p>
                                    </div>

                                    {/* Helpers */}
                                    <div className="pt-6 border-t border-white/10">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-4">Quick Actions</label>
                                        <button
                                            onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                                            className="w-full flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-neon-pink hover:text-white transition-colors text-xs font-bold uppercase mb-2"
                                        >
                                            <Upload size={14} /> Upload Image
                                        </button>
                                    </div>
                                </div>

                                {/* Mobile Backdrop for Sidebar */}
                                {showMobileSettings && (
                                    <div
                                        className="fixed inset-0 bg-black/50 z-[215] lg:hidden backdrop-blur-sm"
                                        onClick={() => setShowMobileSettings(false)}
                                    />
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
