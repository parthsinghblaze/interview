'use client';

import React from 'react';
import Link from 'next/link';
import {
    Activity,
    ArrowRight,
    Globe,
    Zap,
    Layout,
    Layers,
    Server,
    Search as SearchIcon,
    Code,
    Sparkles,
    Database,
    Clock,
    Shield,
    Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function NextJSPage() {
    const [searchQuery, setSearchQuery] = React.useState('');

    const concepts = [
        {
            id: 'ssr',
            title: 'Server-Side Rendering (SSR)',
            description: 'Rendering React pages on the server instead of the browser for SEO and massive performance gains.',
            icon: Server,
            difficulty: 'Medium',
            interviewFrequency: 'Very High',
            keyPoints: ['getServerSideProps', 'Dynamic fetching', 'Better SEO', 'First Contentful Paint'],
            href: '/nextjs/ssr',
            color: 'blue'
        },
        {
            id: 'ssg',
            title: 'Static Site Generation (SSG)',
            description: 'Pre-rendering pages at build time. Ideal for blogs and high-performance unchanging content.',
            icon: Zap,
            difficulty: 'Easy',
            interviewFrequency: 'High',
            keyPoints: ['getStaticProps', 'Build-time rendering', 'Speed of static files'],
            href: '/nextjs/ssr',
            color: 'orange'
        },
        {
            id: 'isr',
            title: 'Incremental Static Regeneration',
            description: 'Update static content after the site is built without needing a full rebuild.',
            icon: Clock,
            difficulty: 'Hard',
            interviewFrequency: 'Medium',
            keyPoints: ['revalidate', 'Stale-while-revalidate', 'Dynamic static content'],
            href: '/nextjs/ssr',
            color: 'purple'
        },
        {
            id: 'routing',
            title: 'App Router vs Pages Router',
            description: 'Master the core architectural shift in Next.js 13+ with Server Components and layouts.',
            icon: Layout,
            difficulty: 'Medium',
            interviewFrequency: 'Very High',
            keyPoints: ['Folder-based routing', 'layout.js', 'Server Components by default'],
            href: '/nextjs/routing',
            color: 'cyan'
        },
        {
            id: 'server-components',
            title: 'React Server Components',
            description: 'Reduce client-side bundle size by shifting logic and data fetching to the server.',
            icon: Layers,
            difficulty: 'Hard',
            interviewFrequency: 'High',
            keyPoints: ['Streaming', 'No JS on client', 'Direct DB access'],
            href: '/nextjs/routing',
            color: 'emerald'
        },
        {
            id: 'api-routes',
            title: 'API Routes & Route Handlers',
            description: 'Building full-stack applications with serverless backend logic directly in Next.js.',
            icon: Database,
            difficulty: 'Easy',
            interviewFrequency: 'High',
            keyPoints: ['route.js', 'Serverless execution', 'HTTP methods'],
            href: '/nextjs/api-routes',
            color: 'indigo'
        },
        {
            id: 'optimization',
            title: 'Image & Font Optimization',
            description: 'Next-level asset handling with automatic lazy loading, resizing, and layout shift prevention.',
            icon: Activity,
            difficulty: 'Easy',
            interviewFrequency: 'Medium',
            keyPoints: ['next/image', 'Cumulative Layout Shift', 'Custom fonts'],
            href: '/nextjs/optimization',
            color: 'rose'
        },
        {
            id: 'middleware',
            title: 'Edge Middleware',
            description: 'Execute logic before a request is completed for authentication and redirects at the edge.',
            icon: Shield,
            difficulty: 'Hard',
            interviewFrequency: 'Medium',
            keyPoints: ['Edge runtime', 'Bot protection', 'A/B testing'],
            href: '/nextjs/middleware',
            color: 'slate'
        }
    ];

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-400 bg-green-500/20';
            case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
            case 'Hard': return 'text-red-400 bg-red-500/20';
            default: return 'text-gray-400 bg-gray-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            <Header />

            <main className="pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Globe className="text-white bg-black dark:bg-white dark:text-black rounded-full p-2" size={48} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                Next.js Engineering
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
                                Master the framework of the web. Explore Server Components,
                                complex caching strategies, and ultra-fast rendering patterns.
                            </p>
                        </motion.div>
                    </div>

                    {/* Search Bar Section */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="relative group">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search Next.js topics (e.g. SSR, middleware, server components)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 focus:border-black dark:focus:border-white outline-none transition-all shadow-sm hover:shadow-md text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Concepts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {concepts
                                .filter(concept =>
                                    concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    concept.keyPoints.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
                                )
                                .map((concept, idx) => (
                                    <motion.div
                                        key={concept.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Link href={concept.href}>
                                            <div className="h-full bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-slate-800 hover:border-black dark:hover:border-white transition-all duration-300 hover:shadow-xl group cursor-pointer flex flex-col">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className={`p-3 bg-${concept.color}-500/10 rounded-xl group-hover:scale-110 transition-transform`}>
                                                        <concept.icon className={`text-${concept.color}-500`} size={28} />
                                                    </div>
                                                    <ArrowRight className="text-gray-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-1 transition-all" size={20} />
                                                </div>

                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-black dark:group-hover:text-white transition-colors">
                                                    {concept.title}
                                                </h3>

                                                <p className="text-gray-600 dark:text-slate-400 mb-4 leading-relaxed flex-grow">
                                                    {concept.description}
                                                </p>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(concept.difficulty)}`}>
                                                        {concept.difficulty}
                                                    </span>
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400">
                                                        {concept.interviewFrequency}
                                                    </span>
                                                </div>

                                                <div className="space-y-2 mb-6">
                                                    <div className="flex flex-wrap gap-2">
                                                        {concept.keyPoints.map((point, i) => (
                                                            <span
                                                                key={i}
                                                                className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2 py-1 rounded border border-gray-200 dark:border-slate-700"
                                                            >
                                                                {point}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest">
                                                        Next Level SEO Ready
                                                    </span>
                                                    <div className="flex items-center gap-1 text-gray-900 dark:text-white font-semibold text-sm">
                                                        Explore
                                                        <ArrowRight size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                        </AnimatePresence>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
