"use client";

import { useState, useEffect } from 'react';
import { AdminCard } from '@/components/admin/AdminCard';
import { GlowButton } from '@/components/GlowButton';
import { createClient } from '@/lib/supabase/client';
import { useTheme, ThemeConfig, defaultTheme } from '@/components/ThemeContext';
import { Palette, Save, RotateCcw, LayoutTemplate, Type, Zap, Bell, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

export function AppearancePageClient() {
    const { theme, updateTheme } = useTheme();
    const [localConfig, setLocalConfig] = useState<ThemeConfig>(theme);
    const [editorLang, setEditorLang] = useState<'en' | 'ar'>('en');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const supabase = createClient();

    // Sync local state with global theme when it loads initially
    useEffect(() => {
        setLocalConfig(theme);
    }, [theme]);

    const handleChange = (key: keyof ThemeConfig, value: any) => {
        const newConfig = { ...localConfig, [key]: value };
        setLocalConfig(newConfig);
        updateTheme(newConfig); // Instant visual feedback
    };

    const handleReset = () => {
        setLocalConfig(defaultTheme);
        updateTheme(defaultTheme);
    };

    const saveSettings = async () => {
        setLoading(true);
        setSuccess(false);
        try {
            // Get the singleton settings row
            const { data: settings } = await supabase.from('site_settings').select('id').single();

            if (settings) {
                const { error } = await supabase
                    .from('site_settings')
                    .update({ theme_config: localConfig })
                    .eq('id', settings.id);

                if (error) throw error;
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (e) {
            console.error("Error saving theme:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">
                        Visual <span className="text-neon-pink">Appearance</span>
                    </h1>
                    <p className="text-gray-400 font-medium">Customize the global look and feel of your portfolio.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button
                        onClick={handleReset}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/10 transition-colors text-sm font-bold text-gray-400 whitespace-nowrap"
                    >
                        <RotateCcw size={16} />
                        RESET
                    </button>
                    <GlowButton onClick={saveSettings} disabled={loading} color="pink" className="flex-1 md:flex-none justify-center">
                        {loading ? 'SAVING...' : success ? 'SAVED!' : 'PUBLISH'}
                    </GlowButton>
                </div>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* 🎨 CONTROLS */}
                <div className="lg:col-span-1 space-y-6">
                    <AdminCard title="Brand Colors" icon={<Palette className="text-neon-pink" />} glowColor="pink">
                        <div className="space-y-4 mt-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Primary Accent</label>
                                <div className="flex gap-2 flex-wrap">
                                    {['#FF4DA6', '#9B5CFF', '#4BD0FF', '#FACC15', '#FF5C5C'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => handleChange('primary_color', color)}
                                            className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${localConfig.primary_color === color ? 'border-white scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}60` }}
                                        />
                                    ))}
                                    <input
                                        type="color"
                                        value={localConfig.primary_color}
                                        onChange={(e) => handleChange('primary_color', e.target.value)}
                                        className="w-10 h-10 rounded-full bg-transparent cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Glass Opacity</label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1"
                                    step="0.05"
                                    value={localConfig.glass_opacity}
                                    onChange={(e) => handleChange('glass_opacity', parseFloat(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-pink"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Glass</span>
                                    <span>Solid</span>
                                </div>
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Interface" icon={<LayoutTemplate className="text-neon-blue" />} glowColor="blue">
                        <div className="space-y-4 mt-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Corner Radius</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['0px', '12px', '20px', '30px', '50px'].map((radius) => (
                                        <button
                                            key={radius}
                                            onClick={() => handleChange('border_radius', radius)}
                                            className={`px-3 py-2 rounded-lg glass text-xs font-bold transition-all ${localConfig.border_radius === radius ? 'bg-white/20 border-white/40 text-white' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            {radius}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Global Event Popup" icon={<Bell className="text-neon-pink" />} glowColor="pink">
                        <div className="space-y-4 mt-4">
                            {/* Enable Toggle */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                <span className="text-sm font-bold text-white">Enable Popup</span>
                                <button
                                    onClick={() => handleChange('event_popup', { ...localConfig.event_popup, enabled: !localConfig.event_popup?.enabled })}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${localConfig.event_popup?.enabled ? 'bg-neon-pink' : 'bg-white/10'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${localConfig.event_popup?.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            {/* Title Input */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Popup Title</label>
                                <input
                                    value={localConfig.event_popup?.title || ''}
                                    onChange={(e) => handleChange('event_popup', { ...localConfig.event_popup, title: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-neon-pink/50 outline-none font-black uppercase tracking-wider"
                                    placeholder="INCOMING EVENT"
                                />
                            </div>

                            {/* Message Input */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Message</label>
                                <textarea
                                    value={localConfig.event_popup?.message || ''}
                                    onChange={(e) => handleChange('event_popup', { ...localConfig.event_popup, message: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-neon-pink/50 outline-none resize-none"
                                    rows={3}
                                    placeholder="e.g. Special Holiday Sale! 50% Off..."
                                />
                            </div>

                            {/* Page Selection */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Active Pages</label>
                                <div className="space-y-2">
                                    {[
                                        { img: 'About', path: '/about' },
                                        { img: 'Gallery', path: '/gallery' },
                                        { img: 'Contact', path: '/contact' }
                                    ].map((page) => {
                                        const isActive = localConfig.event_popup?.pages?.includes(page.path);
                                        return (
                                            <button
                                                key={page.path}
                                                onClick={() => {
                                                    const currentPages = localConfig.event_popup?.pages || [];
                                                    const newPages = isActive
                                                        ? currentPages.filter(p => p !== page.path)
                                                        : [...currentPages, page.path];
                                                    handleChange('event_popup', { ...localConfig.event_popup, pages: newPages });
                                                }}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${isActive ? 'bg-neon-pink/10 border-neon-pink text-white' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}
                                            >
                                                <span className="text-sm font-bold">{page.img}</span>
                                                {isActive && <Check size={14} className="text-neon-pink" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Behavior" icon={<Zap className="text-yellow-400" />} glowColor="yellow">
                        <div className="space-y-4 mt-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${localConfig.enable_animations !== false ? 'bg-neon-pink/20 text-neon-pink' : 'bg-white/5 text-gray-500'}`}>
                                        <Zap size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Animations</p>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500">Motion Effects</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleChange('enable_animations', localConfig.enable_animations === false ? true : false)}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${localConfig.enable_animations !== false ? 'bg-neon-pink' : 'bg-white/10'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${localConfig.enable_animations !== false ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${localConfig.enable_notifications !== false ? 'bg-neon-blue/20 text-neon-blue' : 'bg-white/5 text-gray-500'}`}>
                                        <Bell size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Notifications</p>
                                        <p className="text-[10px] uppercase tracking-wider text-gray-500">System Sounds</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleChange('enable_notifications', localConfig.enable_notifications === false ? true : false)}
                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${localConfig.enable_notifications !== false ? 'bg-neon-blue' : 'bg-white/10'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${localConfig.enable_notifications !== false ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>
                    </AdminCard>
                </div>

                {/* 👁️ PREVIEW */}
                <div className="lg:col-span-2 space-y-8">
                    {/* HERO EDITOR CARD */}
                    <AdminCard title="Hero Text Content" icon={<Type className="text-yellow-400" />} glowColor="yellow">
                        <div className="flex justify-end px-6 pt-4">
                            {/* Language Toggle for Editor */}
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
                        </div>

                        <div className="space-y-6 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title Prefix */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            {editorLang === 'en' ? 'Title Prefix' : 'Title Prefix (Arabic)'}
                                        </label>
                                        <span className={`text-xs ${(localConfig.hero_content?.[editorLang === 'en' ? 'title_prefix' : 'title_prefix_ar']?.length || 0) > 15 ? 'text-red-500' : 'text-gray-600'}`}>
                                            {localConfig.hero_content?.[editorLang === 'en' ? 'title_prefix' : 'title_prefix_ar']?.length || 0}/15
                                        </span>
                                    </div>
                                    <input
                                        dir={editorLang === 'ar' ? 'rtl' : 'ltr'}
                                        value={localConfig.hero_content?.[editorLang === 'en' ? 'title_prefix' : 'title_prefix_ar'] || ''}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 15) {
                                                const key = editorLang === 'en' ? 'title_prefix' : 'title_prefix_ar';
                                                handleChange('hero_content', { ...localConfig.hero_content, [key]: e.target.value });
                                            }
                                        }}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-yellow-400/50 outline-none"
                                        placeholder={editorLang === 'en' ? "Every" : "كل"}
                                    />
                                </div>

                                {/* Title Highlight */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            {editorLang === 'en' ? 'Highlight Word' : 'Highlight Word (Arabic)'}
                                        </label>
                                        <span className={`text-xs ${(localConfig.hero_content?.[editorLang === 'en' ? 'title_highlight' : 'title_highlight_ar']?.length || 0) > 15 ? 'text-red-500' : 'text-gray-600'}`}>
                                            {localConfig.hero_content?.[editorLang === 'en' ? 'title_highlight' : 'title_highlight_ar']?.length || 0}/15
                                        </span>
                                    </div>
                                    <input
                                        dir={editorLang === 'ar' ? 'rtl' : 'ltr'}
                                        value={localConfig.hero_content?.[editorLang === 'en' ? 'title_highlight' : 'title_highlight_ar'] || ''}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 15) {
                                                const key = editorLang === 'en' ? 'title_highlight' : 'title_highlight_ar';
                                                handleChange('hero_content', { ...localConfig.hero_content, [key]: e.target.value });
                                            }
                                        }}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-neon-pink font-bold focus:border-neon-pink/50 outline-none"
                                        placeholder={editorLang === 'en' ? "Pixel" : "بكسل"}
                                    />
                                </div>

                                {/* Subtitle */}
                                <div className="space-y-2 md:col-span-2">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            {editorLang === 'en' ? 'Subtitle / Slogan' : 'Subtitle (Arabic)'}
                                        </label>
                                        <span className={`text-xs ${(localConfig.hero_content?.[editorLang === 'en' ? 'subtitle' : 'subtitle_ar']?.length || 0) > 40 ? 'text-red-500' : 'text-gray-600'}`}>
                                            {localConfig.hero_content?.[editorLang === 'en' ? 'subtitle' : 'subtitle_ar']?.length || 0}/40
                                        </span>
                                    </div>
                                    <input
                                        dir={editorLang === 'ar' ? 'rtl' : 'ltr'}
                                        value={localConfig.hero_content?.[editorLang === 'en' ? 'subtitle' : 'subtitle_ar'] || ''}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 40) {
                                                const key = editorLang === 'en' ? 'subtitle' : 'subtitle_ar';
                                                handleChange('hero_content', { ...localConfig.hero_content, [key]: e.target.value });
                                            }
                                        }}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-yellow-400/50 outline-none"
                                        placeholder={editorLang === 'en' ? "Carries A Spark" : "يحمل شرارة"}
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2 md:col-span-2">
                                    <div className="flex justify-between">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            {editorLang === 'en' ? 'Description' : 'Description (Arabic)'}
                                        </label>
                                        <span className={`text-xs ${(localConfig.hero_content?.[editorLang === 'en' ? 'description' : 'description_ar']?.length || 0) > 100 ? 'text-red-500' : 'text-gray-600'}`}>
                                            {localConfig.hero_content?.[editorLang === 'en' ? 'description' : 'description_ar']?.length || 0}/100
                                        </span>
                                    </div>
                                    <textarea
                                        dir={editorLang === 'ar' ? 'rtl' : 'ltr'}
                                        value={localConfig.hero_content?.[editorLang === 'en' ? 'description' : 'description_ar'] || ''}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 100) {
                                                const key = editorLang === 'en' ? 'description' : 'description_ar';
                                                handleChange('hero_content', { ...localConfig.hero_content, [key]: e.target.value });
                                            }
                                        }}
                                        rows={3}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-gray-300 focus:border-yellow-400/50 outline-none resize-none"
                                        placeholder={editorLang === 'en' ? "Brief introduction..." : "مقدمة مختصرة..."}
                                    />
                                </div>
                            </div>
                        </div>
                    </AdminCard>

                    <div className="sticky top-8">
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-xl font-bold text-white">Live Preview</h2>
                            <div className="px-2 py-0.5 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-[10px] font-black uppercase tracking-widest animate-pulse">
                                Active
                            </div>
                        </div>

                        {/* Preview Container simulating the site */}
                        <div className="w-full aspect-video rounded-[30px] border border-white/10 overflow-hidden relative group">
                            {/* Background */}
                            <div className="absolute inset-0 bg-black">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-pink/10 blur-[120px]" style={{ backgroundColor: `${localConfig.primary_color}15` }} />
                            </div>

                            {/* Fake UI */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center">
                                <motion.div
                                    layout
                                    className="w-full max-w-md p-8 glass mb-6 border border-white/10"
                                    style={{
                                        borderRadius: localConfig.border_radius,
                                        backdropFilter: `blur(${20 * localConfig.glass_opacity}px)`
                                    }}
                                >
                                    <div className="w-16 h-16 rounded-full mb-4 flex items-center justify-center text-white font-bold text-2xl"
                                        style={{
                                            backgroundColor: localConfig.primary_color,
                                            boxShadow: `0 0 30px ${localConfig.primary_color}60`
                                        }}>
                                        B
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {localConfig.hero_content?.title_prefix || "Every"} <span style={{ color: localConfig.primary_color }}>{localConfig.hero_content?.title_highlight || "Pixel"}</span>
                                    </h3>
                                    <p className="text-white font-bold text-xl mb-4">{localConfig.hero_content?.subtitle || "Carries A Spark"}</p>
                                    <p className="text-gray-400 mb-6 text-sm">{localConfig.hero_content?.description || "Description text..."}</p>
                                    <button
                                        className="px-6 py-3 rounded-full font-bold text-black transition-transform hover:scale-105"
                                        style={{ backgroundColor: localConfig.primary_color }}
                                    >
                                        My Button
                                    </button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
