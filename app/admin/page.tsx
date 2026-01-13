import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';
import { requireAdmin } from '@/lib/auth/admin';
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
import { QuickActions } from '@/components/admin/QuickActions'; // Imported

interface SystemLog {
    action: string;
    target: string;
    time: string;
    timestamp: string; // for sorting
    status: 'Success' | 'Pending';
    user: 'System' | 'Admin' | 'Visitor';
}

export default async function AdminDashboard() {
    // CRITICAL SECURITY: Server-side authentication check
    await requireAdmin();

    const supabase = await createClient();

    // Fetch initial data server-side
    const [
        { count: postCount },
        { count: galleryCount },
        { count: pageCount },
        { count: msgCount },
        { count: visitCount } // Destructure new count using array index matching
    ] = await Promise.all([
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
        supabase.from('pages').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('site_visits').select('*', { count: 'exact', head: true }) // Added visit count
    ]);

    const stats = [
        { label: "Total Pages", value: pageCount || 0, icon: "Globe", color: "pink", change: "System Core" },
        { label: "Media Assets", value: galleryCount || 0, icon: "ImageIcon", color: "blue", change: "Visual DB" },
        { label: "Blog Posts", value: postCount || 0, icon: "PenTool", color: "purple", change: "Content Feed" },
        { label: "Messages", value: msgCount || 0, icon: "MessageSquare", color: "yellow", change: "Inbox" },
        { label: "Unique Visitors", value: visitCount || 0, icon: "Users", color: "green", change: "Traffic" },
    ];

    // Fetch recent activity
    const { data: recentPosts } = await supabase.from('blog_posts').select('title, created_at').order('created_at', { ascending: false }).limit(3);
    const { data: recentPages } = await supabase.from('pages').select('title, updated_at').order('updated_at', { ascending: false }).limit(3);
    const { data: recentMsgs } = await supabase.from('messages').select('sender_name as name, created_at').order('created_at', { ascending: false }).limit(3);

    // Render client component with server-fetched data
    return <AdminDashboardClient
        initialStats={stats}
        recentPosts={recentPosts || []}
        recentPages={recentPages || []}
        recentMessages={recentMsgs || []}
    />;
}
