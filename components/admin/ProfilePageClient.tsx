'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { GlowButton } from '@/components/GlowButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Save, Upload, User, Briefcase, Zap, Globe, FileText, ChevronRight, X, Share2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { AdminCard } from '@/components/admin/AdminCard';
import { cn } from '@/lib/utils';

export function ProfilePageClient() {
    const [activeTab, setActiveTab] = useState('general');
    const [profile, setProfile] = useState<any>({});
    const [editorLang, setEditorLang] = useState<'en' | 'ar'>('en');
    const [experience, setExperience] = useState<any[]>([]);
    const [skills, setSkills] = useState<any[]>([]);
    const [socials, setSocials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // Profile
            let { data: profileData, error: profileError } = await supabase.from('profile_settings').select('*').maybeSingle();

            if (profileError && profileError.code !== 'PGRST116') {
                console.error('Error fetching profile:', profileError);
            }

            if (!profileData) {
                // Attempt to create a new profile if none exists
                const { data: newProfile, error: createError } = await supabase
                    .from('profile_settings')
                    .insert({})
                    .select()
                    .single();

                if (createError) {
                    console.error('Error creating profile:', createError);
                } else {
                    profileData = newProfile;
                }
            }
            setProfile(profileData || {});

            // Experience
            const { data: expData, error: expError } = await supabase.from('experience_timeline').select('*').order('sort_order', { ascending: true });
            if (expError) console.error('Experience fetch error:', expError);
            setExperience(expData || []);

            // Skills
            const { data: skillData, error: skillError } = await supabase.from('skills').select('*').order('created_at', { ascending: true });
            if (skillError) console.error('Skills fetch error:', skillError);
            setSkills(skillData || []);

            // Socials
            const { data: socialData, error: socialError } = await supabase.from('social_links').select('*').order('created_at', { ascending: true });
            if (socialError) console.error('Socials fetch error:', socialError);
            setSocials(socialData || []);

        } catch (error) {
            console.error('Unexpected error in fetchData:', error);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleProfileSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!profile?.id) {
                // If no ID, attempt insert first
                const { data: newProfile, error: insertError } = await supabase
                    .from('profile_settings')
                    .insert(profile)
                    .select()
                    .single();

                if (insertError) throw insertError;

                setProfile(newProfile);
                alert('Profile created successfully!');
                return;
            }

            const { error } = await supabase.from('profile_settings').update(profile).eq('id', profile.id);
            if (error) throw error;

            alert('Profile updated!');
        } catch (error: any) {
            console.error('Save error:', error);
            alert('Error saving profile: ' + (error.message || 'Unknown error'));
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar_url' | 'resume_pdf_url') => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        const path = `profile/${Date.now()}-${file.name}`;

        const { error } = await supabase.storage.from('profile-assets').upload(path, file);
        if (error) {
            alert('Upload failed: ' + error.message);
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from('profile-assets').getPublicUrl(path);
        setProfile({ ...profile, [field]: publicUrl });
    };

    const addExperience = async () => {
        await supabase.from('experience_timeline').insert({ role: 'New Role', company: 'New Company', type: 'work' });
        fetchData();
    };

    const updateExperience = async (id: string, updates: any) => {
        const { error } = await supabase.from('experience_timeline').update(updates).eq('id', id);
        if (!error) {
            setExperience(experience.map(e => e.id === id ? { ...e, ...updates } : e));
        }
    };

    const deleteExperience = async (id: string) => {
        await supabase.from('experience_timeline').delete().eq('id', id);
        fetchData();
    };

    const addSkill = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const input = e.currentTarget; // Capture reference before async
            const name = input.value;
            if (name) {
                await supabase.from('skills').insert({ name });
                input.value = '';
                fetchData();
            }
        }
    };

    const deleteSkill = async (id: string) => {
        await supabase.from('skills').delete().eq('id', id);
        fetchData();
    };

    // --- Social Media Handlers ---

    const addSocial = async () => {
        await supabase.from('social_links').insert({
            platform: 'New Platform',
            url: 'https://',
            is_active: true
        });
        fetchData();
    };

    const updateSocial = async (id: string, updates: any) => {
        const { error } = await supabase.from('social_links').update(updates).eq('id', id);
        if (!error) {
            setSocials(socials.map(s => s.id === id ? { ...s, ...updates } : s));
        }
    };

    const deleteSocial = async (id: string) => {
        if (!confirm('Are you sure you want to delete this link?')) return;
        await supabase.from('social_links').delete().eq('id', id);
        fetchData();
    };

    const handleSocialIconUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        // eslint-disable-next-line react-hooks/purity
        const path = `socials/${Date.now()}-${file.name}`;

        const { error } = await supabase.storage.from('profile-assets').upload(path, file);
        if (error) {
            alert('Upload failed: ' + error.message);
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from('profile-assets').getPublicUrl(path);
        updateSocial(id, { icon_url: publicUrl });
    };



    const tabs = [
        { id: 'general', label: 'Identity', icon: User, color: 'yellow' },
        { id: 'experience', label: 'Timeline', icon: Briefcase, color: 'blue' },
        { id: 'skills', label: 'Abilities', icon: Zap, color: 'pink' },
        { id: 'socials', label: 'Network', icon: Share2, color: 'green' },
    ];

    return (
        <div className="space-y-12">
            {/* 🎩 PAGE HEADER */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-2">
                        Subsystem <span className="text-yellow-400">Profile</span>
                    </h1>
                    <p className="text-gray-400 font-medium italic text-sm md:text-base">Calibrating the core identity parameters.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 glass rounded-2xl md:rounded-full p-2 border-white/5 w-full md:w-auto">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "px-4 md:px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 flex-1 md:flex-none justify-center whitespace-nowrap",
                                    isActive
                                        ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                        : "text-gray-500 hover:text-gray-300"
                                )}
                            >
                                <tab.icon size={14} className={isActive ? (tab.color === 'yellow' ? 'text-yellow-400' : tab.color === 'blue' ? 'text-neon-blue' : tab.color === 'pink' ? 'text-neon-pink' : 'text-green-400') : ''} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </header>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'general' && (
                        <div className="max-w-4xl">
                            <AdminCard glowColor="yellow">
                                <form onSubmit={handleProfileSave} className="space-y-10">
                                    <div className="flex flex-col md:flex-row gap-12 items-start">
                                        <div className="relative group shrink-0">
                                            <div className="w-48 h-48 rounded-[40px] bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-yellow-400/50 relative">
                                                {profile.avatar_url ? (
                                                    <Image src={profile.avatar_url} alt="Profile Avatar" fill className="object-cover transition-transform group-hover:scale-110" />
                                                ) : (
                                                    <User size={48} className="text-gray-700" />
                                                )}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                    <Upload size={24} className="text-yellow-400" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Upload Avatar</span>
                                                </div>
                                                <input type="file" onChange={(e) => handleFileUpload(e, 'avatar_url')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                            </div>
                                            <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_#FACC15]">
                                                <Globe size={20} />
                                            </div>
                                        </div>

                                        <div className="flex-1 w-full space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {/* Language Toggle */}
                                                <div className="md:col-span-2 flex justify-end">
                                                    <div className="flex bg-black/50 rounded-lg p-1 border border-white/10">
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditorLang('en')}
                                                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${editorLang === 'en' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                        >
                                                            ENGLISH
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditorLang('ar')}
                                                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${editorLang === 'ar' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                        >
                                                            ARABIC
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-yellow-400/70 ml-2">
                                                        {editorLang === 'en' ? 'Pilot Designation' : 'Pilot Designation (Arabic)'}
                                                    </label>
                                                    <input
                                                        dir={editorLang === 'ar' ? 'rtl' : 'ltr'}
                                                        placeholder={editorLang === 'en' ? "Full Name" : "الاسم الكامل"}
                                                        value={profile[editorLang === 'en' ? 'full_name' : 'full_name_ar'] || ''}
                                                        onChange={(e) => setProfile({ ...profile, [editorLang === 'en' ? 'full_name' : 'full_name_ar']: e.target.value })}
                                                        className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-yellow-400/50 outline-none font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-yellow-400/70 ml-2">
                                                        {editorLang === 'en' ? 'Current Role' : 'Current Role (Arabic)'}
                                                    </label>
                                                    <input
                                                        dir={editorLang === 'ar' ? 'rtl' : 'ltr'}
                                                        placeholder={editorLang === 'en' ? "Job Title" : "المسمى الوظيفي"}
                                                        value={profile[editorLang === 'en' ? 'job_title' : 'job_title_ar'] || ''}
                                                        onChange={(e) => setProfile({ ...profile, [editorLang === 'en' ? 'job_title' : 'job_title_ar']: e.target.value })}
                                                        className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-yellow-400/50 outline-none font-bold placeholder:font-normal"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-yellow-400/70 ml-2">
                                                    {editorLang === 'en' ? 'Bio-Data (About)' : 'Bio-Data (Arabic)'}
                                                </label>
                                                <textarea
                                                    dir={editorLang === 'ar' ? 'rtl' : 'ltr'}
                                                    placeholder={editorLang === 'en' ? "Tell the world about your cosmic journey..." : "أخبر العالم عن رحلتك الكونية..."}
                                                    value={profile[editorLang === 'en' ? 'about_bio' : 'about_bio_ar'] || ''}
                                                    onChange={(e) => setProfile({ ...profile, [editorLang === 'en' ? 'about_bio' : 'about_bio_ar']: e.target.value })}
                                                    rows={4}
                                                    className="w-full glass bg-white/5 p-4 rounded-2xl text-white outline-none border border-white/10 focus:border-yellow-400/50 leading-relaxed"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-yellow-400/70 ml-2">Comms Channel (Email)</label>
                                            <input
                                                placeholder="Email Address"
                                                value={profile.email || ''}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                className="w-full glass bg-white/5 p-4 rounded-2xl text-white outline-none border border-white/10 focus:border-yellow-400/50"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-yellow-400/70 ml-2">Direct Signal (Phone)</label>
                                            <input
                                                placeholder="Phone Number"
                                                value={profile.phone || ''}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                className="w-full glass bg-white/5 p-4 rounded-2xl text-white outline-none border border-white/10 focus:border-yellow-400/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-8 glass bg-white/[0.02] border-white/5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center text-neon-blue">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">Professional Dossier (Resume)</p>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                    {profile.resume_pdf_url ? 'Active Signal: Connected' : 'No signal detected'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="relative group z-10">
                                            <input type="file" onChange={(e) => handleFileUpload(e, 'resume_pdf_url')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                            <GlowButton type="button" variant="secondary" className="px-8 h-12 rounded-full text-[10px] uppercase font-black tracking-widest bg-neon-blue shadow-[0_0_15px_rgba(75,208,255,0.3)]">
                                                Update Dossier
                                            </GlowButton>
                                        </div>
                                        <div className="absolute right-0 top-0 w-32 h-full bg-neon-blue/5 skew-x-[-20deg] translate-x-10" />
                                    </div>

                                    <div className="pt-6">
                                        <GlowButton type="submit" className="w-full h-16 rounded-full text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                            Synchronize Identity
                                        </GlowButton>
                                    </div>
                                </form>
                            </AdminCard>
                        </div>
                    )}

                    {activeTab === 'experience' && (
                        <div className="max-w-4xl space-y-6">
                            {experience.map((exp, i) => (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <AdminCard glowColor="blue" className="group">
                                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                                            <div className="flex-1 space-y-6">
                                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                    <input
                                                        value={exp.role}
                                                        onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                                                        className="bg-transparent font-black text-white text-2xl outline-none focus:text-neon-blue transition-colors flex-1"
                                                        placeholder="Mission Title / Role"
                                                    />
                                                    <div className="flex glass rounded-full p-1 border-white/10 shrink-0">
                                                        <button
                                                            onClick={() => updateExperience(exp.id, { type: 'work' })}
                                                            className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", exp.type === 'work' ? "bg-white/10 text-white" : "text-gray-600")}
                                                        >
                                                            Work
                                                        </button>
                                                        <button
                                                            onClick={() => updateExperience(exp.id, { type: 'education' })}
                                                            className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", exp.type === 'education' ? "bg-white/10 text-white" : "text-gray-600")}
                                                        >
                                                            Learning
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Base of Operations</label>
                                                        <input
                                                            value={exp.company}
                                                            onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                                                            className="w-full glass bg-white/5 border border-white/5 rounded-xl p-3 text-neon-pink font-bold outline-none focus:border-neon-pink/50"
                                                            placeholder="Organization"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Mission Duration</label>
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                value={exp.start_date || ''}
                                                                onChange={(e) => updateExperience(exp.id, { start_date: e.target.value })}
                                                                className="flex-1 glass bg-white/5 border border-white/5 rounded-xl p-3 text-white text-sm outline-none focus:border-neon-blue/50"
                                                                placeholder="Start"
                                                            />
                                                            <ChevronRight size={14} className="text-gray-700" />
                                                            <input
                                                                value={exp.end_date || ''}
                                                                onChange={(e) => updateExperience(exp.id, { end_date: e.target.value })}
                                                                className="flex-1 glass bg-white/5 border border-white/5 rounded-xl p-3 text-white text-sm outline-none focus:border-neon-blue/50"
                                                                placeholder="End"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => deleteExperience(exp.id)}
                                                className="w-full md:w-12 h-12 flex items-center justify-center glass rounded-2xl text-gray-700 hover:text-red-500 hover:bg-red-500/10 transition-all shrink-0 md:mt-1 self-end md:self-auto"
                                            >
                                                <Trash2 size={20} />
                                                <span className="md:hidden ml-2 font-bold uppercase text-xs">Remove Mission</span>
                                            </button>
                                        </div>
                                    </AdminCard>
                                </motion.div>
                            ))}
                            <GlowButton onClick={addExperience} variant="secondary" className="w-full h-16 rounded-[30px] border-dashed border-white/10 hover:border-neon-blue/40 text-gray-500 hover:text-neon-blue transition-all">
                                <Plus className="inline mr-2" /> Initialize New Mission Record
                            </GlowButton>
                        </div>
                    )}

                    {activeTab === 'skills' && (
                        <div className="max-w-4xl space-y-12">
                            <AdminCard glowColor="pink">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xl font-black uppercase tracking-tighter text-white">Download <span className="text-neon-pink">Abilities</span></h3>
                                        <p className="text-gray-500 text-sm italic">Inject new skill protocols into the central core.</p>
                                    </div>
                                    <div className="relative group">
                                        <Plus className="absolute left-5 top-1/2 -translate-y-1/2 text-neon-pink" size={20} />
                                        <input
                                            onKeyDown={addSkill}
                                            placeholder="Type ability designation and press Enter..."
                                            className="w-full h-16 pl-14 pr-6 glass bg-white/5 border border-white/10 rounded-full text-white outline-none focus:border-neon-pink/50 focus:bg-white/10 transition-all font-bold tracking-wide"
                                        />
                                    </div>
                                </div>
                            </AdminCard>

                            <div className="flex flex-wrap gap-4">
                                {skills.map((skill, i) => (
                                    <motion.div
                                        key={skill.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        className="relative group"
                                    >
                                        <div className="glass px-6 py-3 rounded-full text-white font-black uppercase text-[10px] tracking-[0.2em] border-white/10 group-hover:border-neon-pink group-hover:shadow-[0_0_15px_rgba(255,77,166,0.2)] transition-all flex items-center gap-4">
                                            {skill.name}
                                            <button
                                                onClick={() => deleteSkill(skill.id)}
                                                className="text-gray-700 hover:text-red-500 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'socials' && (
                        <div className="max-w-4xl space-y-8">
                            <AdminCard glowColor="green">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-black uppercase tracking-tighter text-white">Network <span className="text-green-400">Uplink</span></h3>
                                    <p className="text-gray-500 text-sm italic">Manage external communication frequencies.</p>
                                </div>
                            </AdminCard>

                            <div className="grid gap-6">
                                {socials.map((social, i) => (
                                    <motion.div
                                        key={social.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <AdminCard glowColor="green" className="group">
                                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                                {/* Icon Upload */}
                                                <div className="relative group/icon shrink-0">
                                                    <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover/icon:border-green-400/50 relative">
                                                        {social.icon_url ? (
                                                            <Image src={social.icon_url} alt="Social Icon" fill className="object-cover" />
                                                        ) : (
                                                            <Share2 size={24} className="text-gray-600" />
                                                        )}
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/icon:opacity-100 transition-opacity flex flex-col items-center justify-center">
                                                            <ImageIcon size={20} className="text-green-400" />
                                                        </div>
                                                        <input
                                                            type="file"
                                                            onChange={(e) => handleSocialIconUpload(e, social.id)}
                                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                            accept="image/*"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Inputs */}
                                                <div className="flex-1 w-full grid md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Platform Name</label>
                                                        <input
                                                            value={social.platform}
                                                            onChange={(e) => updateSocial(social.id, { platform: e.target.value })}
                                                            className="w-full glass bg-white/5 border border-white/5 rounded-xl p-3 text-white font-bold outline-none focus:border-green-400/50"
                                                            placeholder="e.g., Instagram"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Link URL</label>
                                                        <div className="relative">
                                                            <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                                            <input
                                                                value={social.url}
                                                                onChange={(e) => updateSocial(social.id, { url: e.target.value })}
                                                                className="w-full glass bg-white/5 border border-white/5 rounded-xl p-3 pl-10 text-neon-blue text-sm outline-none focus:border-green-400/50"
                                                                placeholder="https://..."
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <button
                                                    onClick={() => deleteSocial(social.id)}
                                                    className="w-12 h-12 flex items-center justify-center glass rounded-2xl text-gray-700 hover:text-red-500 hover:bg-red-500/10 transition-all shrink-0"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </AdminCard>
                                    </motion.div>
                                ))}
                            </div>

                            <GlowButton onClick={addSocial} variant="secondary" className="w-full h-16 rounded-[30px] border-dashed border-white/10 hover:border-green-400/40 text-gray-500 hover:text-green-400 transition-all">
                                <Plus className="inline mr-2" /> Establish New Connection
                            </GlowButton>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
