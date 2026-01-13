'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Trash2,
    CheckCircle,
    Circle,
    Mail,
    User,
    Calendar,
    Search,
    Shield,
    Reply
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Message {
    id: string;
    sender_name: string;
    email: string;
    message_body: string;
    is_read: boolean;
    ip_address?: string; // Optional as old messages might not have it
    created_at: string;
}

export function MessagesPageClient() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const supabase = createClient();

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setMessages(data);
        setLoading(false);
    }, [supabase]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const toggleReadStatus = async (id: string, currentStatus: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        setMessages(msgs => msgs.map(m => m.id === id ? { ...m, is_read: !currentStatus } : m));

        const { error } = await supabase
            .from('messages')
            .update({ is_read: !currentStatus })
            .eq('id', id);

        if (error) {
            setMessages(msgs => msgs.map(m => m.id === id ? { ...m, is_read: currentStatus } : m));
            console.error('Error updating status:', error);
        }
    };

    const deleteMessage = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you certain you wish to purge this communication?')) return;

        setMessages(msgs => msgs.filter(m => m.id !== id));

        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting message:', error);
            fetchMessages();
        }
    };

    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedIds(newSet);
    };

    // --- Analytics ---
    const stats = useMemo(() => {
        const total = messages.length;
        const unread = messages.filter(m => !m.is_read).length;
        const today = messages.filter(m => {
            const date = new Date(m.created_at);
            const now = new Date();
            return date.getDate() === now.getDate() &&
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear();
        }).length;
        return { total, unread, today };
    }, [messages]);

    // --- Filtering ---
    const filteredMessages = messages.filter(m => {
        const matchesFilter = filter === 'all' ? true : !m.is_read;
        const matchesSearch =
            m.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.message_body.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // --- Content Editing State ---
    const [isEditingContent, setIsEditingContent] = useState(false);
    const [contentConfig, setContentConfig] = useState<any>({});
    const [isSavingContent, setIsSavingContent] = useState(false);
    const [editorLang, setEditorLang] = useState<'en' | 'ar'>('en');

    const toggleContentEditor = async () => {
        if (!isEditingContent) {
            // Fetch current settings when opening
            const { data } = await supabase.from('site_settings').select('contact_content').single();
            if (data?.contact_content) {
                setContentConfig(data.contact_content);
            } else {
                // Default fallback if DB is empty
                setContentConfig({
                    headline: "Let's Create Magic Together",
                    subheadline: "Have a project in mind? Just want to say hi? I'm always open to discussing new ideas and opportunities.",
                    social_title: "Connect With Me",
                    form_title: "Send a Message",
                    form_btn_text: "Send Message"
                });
            }
        }
        setIsEditingContent(!isEditingContent);
    };

    const saveContentConfig = async () => {
        setIsSavingContent(true);
        const { data: settings } = await supabase.from('site_settings').select('id').single();
        if (settings) {
            const { error } = await supabase
                .from('site_settings')
                .update({ contact_content: contentConfig })
                .eq('id', settings.id);

            if (!error) {
                setIsEditingContent(false);
                // Optional: Show toast
            }
        }
        setIsSavingContent(false);
    };

    if (loading) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin" />
            <p className="text-neon-purple font-black tracking-widest animate-pulse">ESTABLISHING LINK...</p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 relative">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">
                        Comms <span className="text-neon-purple">Channel</span>
                    </h1>
                    <p className="text-gray-400 font-medium">
                        Incoming transmissions from the surface web.
                    </p>
                </div>

                <button
                    onClick={toggleContentEditor}
                    className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-neon-purple hover:text-black hover:border-neon-purple transition-all font-bold text-sm tracking-wide shadow-lg group"
                >
                    <span className="flex items-center gap-2">
                        <MessageSquare size={16} className="group-hover:fill-current" />
                        EDIT PAGE CONTENT
                    </span>
                </button>
            </header>

            {/* --- CONTENT EDITOR OVERLAY --- */}
            <AnimatePresence>
                {isEditingContent && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative z-40 mb-8"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Search size={20} className="text-neon-pink" />
                                Edit Contact Page Text
                            </h3>
                            <div className="flex gap-4 items-center">
                                {/* Language Toggle */}
                                <div className="flex bg-black/50 rounded-lg p-1 border border-white/10">
                                    <button
                                        onClick={() => setEditorLang('en')}
                                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${editorLang === 'en' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        ENGLISH
                                    </button>
                                    <button
                                        onClick={() => setEditorLang('ar')}
                                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${editorLang === 'ar' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        ARABIC
                                    </button>
                                </div>
                                <button
                                    onClick={() => setIsEditingContent(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">
                                    {editorLang === 'en' ? 'Page Headline' : 'Page Headline (Arabic)'}
                                </label>
                                <input
                                    dir={editorLang === 'ar' ? 'rtl' : 'ltr'}
                                    value={contentConfig[editorLang === 'en' ? 'headline' : 'headline_ar'] || ''}
                                    onChange={e => setContentConfig({ ...contentConfig, [editorLang === 'en' ? 'headline' : 'headline_ar']: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-neon-pink outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">
                                    {editorLang === 'en' ? 'Subheadline' : 'Subheadline (Arabic)'}
                                </label>
                                <textarea
                                    dir={editorLang === 'ar' ? 'rtl' : 'ltr'}
                                    value={contentConfig[editorLang === 'en' ? 'subheadline' : 'subheadline_ar'] || ''}
                                    onChange={e => setContentConfig({ ...contentConfig, [editorLang === 'en' ? 'subheadline' : 'subheadline_ar']: e.target.value })}
                                    rows={2}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-neon-pink outline-none resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">
                                    {editorLang === 'en' ? 'Social Section Title' : 'Social Section Title (Arabic)'}
                                </label>
                                <input
                                    dir={editorLang === 'ar' ? 'rtl' : 'ltr'}
                                    value={contentConfig[editorLang === 'en' ? 'social_title' : 'social_title_ar'] || ''}
                                    onChange={e => setContentConfig({ ...contentConfig, [editorLang === 'en' ? 'social_title' : 'social_title_ar']: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-neon-pink outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">
                                    {editorLang === 'en' ? 'Form Title' : 'Form Title (Arabic)'}
                                </label>
                                <input
                                    dir={editorLang === 'ar' ? 'rtl' : 'ltr'}
                                    value={contentConfig[editorLang === 'en' ? 'form_title' : 'form_title_ar'] || ''}
                                    onChange={e => setContentConfig({ ...contentConfig, [editorLang === 'en' ? 'form_title' : 'form_title_ar']: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-neon-pink outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">
                                    {editorLang === 'en' ? 'Form Button Text' : 'Form Button Text (Arabic)'}
                                </label>
                                <input
                                    dir={editorLang === 'ar' ? 'rtl' : 'ltr'}
                                    value={contentConfig[editorLang === 'en' ? 'form_btn_text' : 'form_btn_text_ar'] || ''}
                                    onChange={e => setContentConfig({ ...contentConfig, [editorLang === 'en' ? 'form_btn_text' : 'form_btn_text_ar']: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-neon-pink outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={saveContentConfig}
                                disabled={isSavingContent}
                                className="px-8 py-3 rounded-xl bg-neon-pink text-white font-bold hover:bg-pink-600 transition-colors shadow-[0_0_20px_rgba(255,0,153,0.3)]"
                            >
                                {isSavingContent ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ANALYTICS BAR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between group hover:border-neon-purple/50 transition-colors">
                    <div>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Messages</p>
                        <h2 className="text-3xl font-black text-white mt-1">{stats.total}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-neon-purple/20 flex items-center justify-center text-neon-purple group-hover:scale-110 transition-transform">
                        <MessageSquare size={24} />
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between group hover:border-neon-pink/50 transition-colors">
                    <div>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Unread</p>
                        <h2 className="text-3xl font-black text-white mt-1">{stats.unread}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-neon-pink/20 flex items-center justify-center text-neon-pink group-hover:scale-110 transition-transform">
                        <Circle size={24} fill="currentColor" className="opacity-50" />
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between group hover:border-neon-blue/50 transition-colors">
                    <div>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-wider">Today</p>
                        <h2 className="text-3xl font-black text-white mt-1">{stats.today}</h2>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue group-hover:scale-110 transition-transform">
                        <Calendar size={24} />
                    </div>
                </div>
            </div>

            {/* CONTROLS TOOLBAR */}
            <div className="flex flex-col md:flex-row gap-4 bg-black/40 p-4 rounded-2xl border border-white/10 backdrop-blur-md sticky top-4 z-30">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search frequency..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-neon-purple transition-all"
                    />
                </div>

                {/* Filters */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setFilter('all')}
                        className={`flex-1 px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-neon-purple text-black shadow-[0_0_15px_rgba(155,92,255,0.4)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        ALL
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`flex-1 px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'unread' ? 'bg-neon-pink text-black shadow-[0_0_15px_rgba(255,77,166,0.4)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        UNREAD
                    </button>
                </div>
            </div>

            {/* MESSAGE LIST */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredMessages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            layout
                            onClick={() => toggleExpand(msg.id)}
                            className={`group relative overflow-hidden rounded-[24px] transition-all cursor-pointer border ${!msg.is_read
                                ? 'bg-gradient-to-r from-neon-purple/10 to-transparent border-neon-purple/30 shadow-[0_0_20px_rgba(155,92,255,0.1)]'
                                : 'bg-white/5 border-white/5 hover:bg-white/10'
                                }`}
                        >
                            {/* Unread Indicator Bar */}
                            {!msg.is_read && (
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-neon-purple shadow-[0_0_15px_#9B5CFF]" />
                            )}

                            <div className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">

                                    {/* Sender Info */}
                                    <div className="flex items-start gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold border-2 transition-colors shadow-lg ${!msg.is_read
                                            ? 'bg-neon-purple text-black border-neon-purple shadow-neon-purple/20'
                                            : 'bg-white/5 text-gray-500 border-white/10'
                                            }`}>
                                            {msg.sender_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold mb-1 ${!msg.is_read ? 'text-white' : 'text-gray-400'}`}>
                                                {msg.sender_name}
                                            </h3>
                                            <div className="flex flex-wrap gap-3 text-xs text-gray-500 font-mono items-center">
                                                <span className="flex items-center gap-1 hover:text-white transition-colors">
                                                    <Mail size={12} /> {msg.email}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-gray-700" />
                                                <span className="flex items-center gap-1" title="Origin IP">
                                                    <Shield size={12} /> {msg.ip_address || 'Unknown Origin'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions & Time */}
                                    <div className="flex flex-row md:flex-col items-center md:items-end gap-3 justify-between md:justify-start w-full md:w-auto mt-2 md:mt-0">
                                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                                            <Calendar size={12} />
                                            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                                        </div>

                                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                            <a
                                                href={`mailto:${msg.email}?subject=Re: Message from ${msg.sender_name}`}
                                                className="p-2.5 rounded-xl bg-white/5 hover:bg-neon-blue hover:text-black text-gray-400 transition-all hover:scale-110 shadow-lg"
                                                title="Reply by Email"
                                            >
                                                <Reply size={18} />
                                            </a>
                                            <button
                                                onClick={(e) => toggleReadStatus(msg.id, msg.is_read, e)}
                                                className={`p-2.5 rounded-xl transition-all hover:scale-110 shadow-lg ${msg.is_read
                                                    ? 'bg-white/5 text-gray-400 hover:bg-neon-green hover:text-black'
                                                    : 'bg-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-black'}`}
                                                title={msg.is_read ? "Mark Unread" : "Mark Read"}
                                            >
                                                {msg.is_read ? <Circle size={18} /> : <CheckCircle size={18} />}
                                            </button>
                                            <button
                                                onClick={(e) => deleteMessage(msg.id, e)}
                                                className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500 hover:text-white text-gray-400 transition-all hover:scale-110 shadow-lg"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Body */}
                                <div className={`mt-6 relative transition-all duration-500 ease-spring ${expandedIds.has(msg.id) ? '' : 'max-h-20 overflow-hidden'}`}>
                                    <div className="p-4 rounded-xl bg-black/20 border border-white/5 font-medium text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {msg.message_body}
                                    </div>
                                    {!expandedIds.has(msg.id) && (
                                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none flex items-end justify-center pb-2">
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Click to Expand</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredMessages.length === 0 && (
                    <div className="text-center py-20 opacity-50 space-y-4">
                        <MessageSquare size={48} className="mx-auto text-gray-600" />
                        <p className="text-xl font-bold text-gray-500">No transmissions found.</p>
                        <p className="text-sm text-gray-600">The void is silent.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
