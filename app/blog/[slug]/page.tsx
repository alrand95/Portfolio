'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css'; // Cyber-friendly dark theme
import { ArrowLeft, Calendar, Tag, Clock, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';
import { CodeBunny } from '@/components/ui/CodeBunny';

export default function BlogPostPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) return;

            // Try fetching by slug first
            let { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('slug', slug)
                .single();

            // If not found by slug, try by ID (fallback for legacy links)
            if (!data) {
                const { data: idData } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .eq('id', slug)
                    .single();
                data = idData;
            }

            if (data) {
                setPost(data);
                // Increment view count
                await supabase.rpc('increment_blog_view', { post_id: data.id });
            } else {
                // Redirect to 404 or blog listing if not found
                // router.push('/404'); // Or handle gracefully
            }
            setLoading(false);
        };

        fetchPost();
    }, [slug, supabase, router]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-6">
                <CodeBunny pose="floating" primaryColor="#FF4DA6" secondaryColor="#F472B6" />
                <div className="text-center space-y-2">
                    <p className="text-neon-pink animate-pulse font-mono tracking-[0.2em] uppercase font-bold text-sm">Deciphering Runes...</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl font-black text-white mb-4">Memory Not Found</h1>
                <p className="text-gray-400 mb-8">The archives seem to be missing this page.</p>
                <Link href="/blog" className="px-8 py-3 bg-neon-pink text-white rounded-full font-bold hover:bg-neon-pink/80 transition-colors">
                    Return to Library
                </Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-5xl mx-auto">
            {/* Back Navigation */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8"
            >
                <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-neon-pink transition-colors gap-2 group">
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-neon-pink/10 transition-colors">
                        <ArrowLeft size={20} />
                    </div>
                    <span className="font-bold uppercase tracking-widest text-sm">Back to Archives</span>
                </Link>
            </motion.div>

            {/* Header Content */}
            <header className="mb-12 space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap items-center gap-4 text-sm font-bold uppercase tracking-widest text-neon-blue"
                >
                    <span className="bg-neon-blue/10 px-3 py-1 rounded-full border border-neon-blue/20">
                        {post.tags?.[0] || 'Uncategorized'}
                    </span>
                    <span className="flex items-center gap-2 text-gray-500">
                        <Calendar size={14} />
                        {moment(post.published_at).format('MMMM Do, YYYY')}
                    </span>
                    <span className="flex items-center gap-2 text-gray-500">
                        <Clock size={14} />
                        {Math.ceil((post.content?.length || 0) / 1000)} min read
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-black text-white leading-tight"
                >
                    {post.title}
                </motion.h1>
            </header>

            {/* Featured Image */}
            {post.image_url && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative w-full aspect-video rounded-[40px] overflow-hidden mb-16 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                    <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </motion.div>
            )}

            {/* Content Body */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="prose prose-invert prose-lg max-w-none md:prose-xl
                    prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-white
                    prose-p:text-gray-300 prose-p:leading-relaxed
                    prose-a:text-neon-pink prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white prose-strong:font-bold
                    prose-code:text-neon-blue prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-[#282c34] prose-pre:backdrop-blur-md prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:p-4
                    prose-blockquote:border-l-4 prose-blockquote:border-neon-pink prose-blockquote:bg-neon-pink/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic
                    prose-img:rounded-[30px] prose-img:border prose-img:border-white/10 prose-img:shadow-2xl
                    prose-table:border-collapse prose-table:w-full prose-table:my-8
                    prose-th:border prose-th:border-white/10 prose-th:p-4 prose-th:bg-white/5 prose-th:text-white prose-th:font-bold prose-th:text-left
                    prose-td:border prose-td:border-white/10 prose-td:p-4 prose-td:text-gray-300
                    "
            >
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                >
                    {post.content}
                </ReactMarkdown>
            </motion.div>

            {/* Footer / Tags */}
            {post.tags && post.tags.length > 0 && (
                <div className="mt-16 pt-8 border-t border-white/10">
                    <div className="flex flex-wrap gap-3">
                        {post.tags.map((tag: string) => (
                            <Link
                                key={tag}
                                href={`/blog?q=${tag}`}
                                className="px-4 py-2 bg-white/5 rounded-full text-sm font-bold uppercase tracking-wider text-gray-400 hover:bg-neon-pink hover:text-white transition-all transform hover:-translate-y-1"
                            >
                                #{tag}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}
