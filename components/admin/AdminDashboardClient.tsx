'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    PenTool,
    Image as ImageIcon,
    MessageSquare,
    UserCircle,
    TrendingUp,
    Users,
    Eye,
    Activity,
    Globe,
    Palette,
    LogOut
} from 'lucide-react';
import Link from 'next/link';
import { AdminCard } from '@/components/admin/AdminCard';
import { formatDistanceToNow } from 'date-fns';
import { QuickActions } from '@/components/admin/QuickActions';

interface SystemLog {
    action: string;
    target: string;
    time: string;
    timestamp: string;
    status: 'Success' | 'Pending';
    user: 'System' | 'Admin' | 'Visitor';
}

interface AdminDashboardClientProps {
    initialStats: any[];
    recentPosts: any[];
    recentPages: any[];
    recentMessages: any[];
}

export function AdminDashboardClient({
    initialStats,
    recentPosts,
    recentPages,
    recentMessages
}: AdminDashboardClientProps) {
    const [stats] = useState(initialStats);
    const supabase = createClient();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    // Process logs
    const combinedLogs: SystemLog[] = [];

    recentPosts?.forEach(p => combinedLogs.push({
        action: 'New Post Created',
        target: p.title,
        time: formatDistanceToNow(new Date(p.created_at), { addSuffix: true }),
        timestamp: p.created_at,
        status: 'Success',
        user: 'Admin'
    }));

    recentPages?.forEach(p => combinedLogs.push({
        action: 'Page Updated',
        target: p.title,
        time: formatDistanceToNow(new Date(p.updated_at), { addSuffix: true }),
        timestamp: p.updated_at,
        status: 'Success',
        user: 'Admin'
    }));

    recentMessages?.forEach((m: any) => combinedLogs.push({
        action: 'Incoming Signal',
        target: `From: ${m.name}`,
        time: formatDistanceToNow(new Date(m.created_at), { addSuffix: true }),
        timestamp: m.created_at,
        status: 'Pending',
        user: 'Visitor'
    }));

    // Sort by timestamp desc and take top 5
    const logs = combinedLogs
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

    const tools = [
        {
            title: 'Blog Manager',
            description: 'Write, edit, and publish tales from the void.',
            icon: <PenTool size={32} />,
            href: '/admin/blog',
            color: 'pink' as const,
        },
        {
            title: 'Gallery Manager',
            description: 'Upload and curate the visual database.',
            icon: <ImageIcon size={32} />,
            href: '/admin/gallery',
            color: 'blue' as const,
        },
        {
            title: 'Profile Manager',
            description: 'Update Bio, Resume, Skills, and Experience.',
            icon: <UserCircle size={32} />,
            href: '/admin/profile',
            color: 'yellow' as const,
        },
        {
            title: 'Visual Appearance',
            description: 'Customize theme colors, fonts, and layout.',
            icon: <Palette size={32} />,
            href: '/admin/appearance',
            color: 'green' as const,
        },
    ];

    // Icon mapping for stats
    const iconMap: Record<string, any> = {
        Globe,
        ImageIcon,
        PenTool,
        MessageSquare,
        Users, // Added Users icon
        Palette
    };

    return (
        <div className="space-y-12">
            {/* 👑 WELCOME HEADER - Simplified */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
                        Mission <span className="text-neon-pink">Control</span>
                    </h1>
                    <p className="text-gray-400 font-medium">System Status: <span className="text-neon-blue font-bold">OPTIMAL</span></p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest border border-red-500/20"
                >
                    <LogOut size={16} />
                    Abort / Logout
                </button>
            </header>

            {/* QUICK ACTIONS ROW */}
            <QuickActions stats={stats} />

            {/* 📊 STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                    const Icon = iconMap[stat.icon];
                    return (
                        <AdminCard key={stat.label} glowColor={stat.color as any}>
                            <div className="flex justify-between items-start">
                                <div className="z-10 relative">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">{stat.label}</p>
                                    <h4 className="text-3xl font-black text-white tracking-tight">{stat.value}</h4>
                                </div>

                                <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${stat.color === 'pink' ? 'text-neon-pink' :
                                    stat.color === 'blue' ? 'text-neon-blue' :
                                        stat.color === 'purple' ? 'text-neon-purple' :
                                            stat.color === 'green' ? 'text-neon-green' : 'text-yellow-400' // Added green check
                                    }`}>
                                    {Icon && <Icon size={24} />}
                                </div>
                            </div>

                            {/* Decorative Chart Line Simulation */}
                            <div className="mt-6 flex items-end gap-1 h-8 opacity-50">
                                {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4, 0.7].map((h, k) => (
                                    <div
                                        key={k}
                                        className={`w-full rounded-t-sm ${stat.color === 'pink' ? 'bg-neon-pink' :
                                            stat.color === 'blue' ? 'bg-neon-blue' :
                                                stat.color === 'purple' ? 'bg-neon-purple' :
                                                    stat.color === 'green' ? 'bg-neon-green' : 'bg-yellow-400' // Added green check
                                            }`}
                                        style={{ height: `${h * 100}%` }}
                                    />
                                ))}
                            </div>
                        </AdminCard>
                    );
                })}
            </div>

            {/* 🛠️ SUBSYSTEMS GRID */}
            <section>
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-xl font-bold uppercase tracking-widest text-white/50">Core Subsystems</h2>
                    <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tools.map((tool, i) => (
                        <Link key={tool.title} href={tool.href} className="block group h-full">
                            <AdminCard
                                title={tool.title}
                                icon={tool.icon}
                                glowColor={tool.color}
                                className="h-full hover:scale-[1.02] transition-transform duration-300"
                            >
                                <p className="text-gray-400 text-sm leading-relaxed mb-6">{tool.description}</p>
                                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                    <span className="text-xs font-black uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">Access Tool</span>
                                    <div className={`text-${tool.color === 'pink' ? 'neon-pink' : tool.color === 'blue' ? 'neon-blue' : 'yellow-400'}`}>
                                        <TrendingUp size={16} className="rotate-45" />
                                    </div>
                                </div>
                            </AdminCard>
                        </Link>
                    ))}
                </div>
            </section>

            {/* 📑 RECENT LOGS */}
            <section>
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-xl font-bold uppercase tracking-widest text-white/50">Live Feed</h2>
                    <div className="h-px flex-1 bg-white/10" />
                    <div className="animate-pulse w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_red]" />
                </div>

                <div className="glass p-1 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="bg-black/40 p-6 backdrop-blur-md">
                        <div className="space-y-1 font-mono text-sm max-h-[300px] overflow-y-auto custom-scrollbar">
                            {logs.length > 0 ? logs.map((log, i) => (
                                <div key={i} className="flex items-start gap-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-lg">
                                    <span className="text-gray-600 text-[10px] w-20 pt-1">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold uppercase tracking-wider ${log.action.includes('Post') ? 'text-neon-purple' :
                                                log.action.includes('Signal') ? 'text-yellow-400' : 'text-neon-blue'
                                                }`}>
                                                [{log.action}]
                                            </span>
                                            <span className="text-gray-500 text-xs">by {log.user}</span>
                                        </div>
                                        <p className="text-white/80 mt-1">{log.target}</p>
                                    </div>
                                    <div className={`w-1.5 h-1.5 rounded-full mt-2 ${log.status === 'Success' ? 'bg-neon-green shadow-neon-green' : 'bg-yellow-400 shadow-yellow-400'}`} />
                                </div>
                            )) : (
                                <div className="text-center text-gray-500 py-4 italic">:: NO SIGNAL DETECTED ::</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
