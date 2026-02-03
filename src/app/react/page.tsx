'use client';

import React from 'react';
import Link from 'next/link';
import {
    Atom,
    Play,
    Zap,
    Clock,
    Layout,
    Layers,
    Shield,
    Database,
    Search as SearchIcon,
    ArrowRight,
    CheckCircle,
    Sparkles,
    MousePointer2,
    Settings,
    Box,
    Globe,
    Lock,
    Cpu,
    Activity,
    Code,
    Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ReactPage() {
    const [searchQuery, setSearchQuery] = React.useState('');

    const concepts = [
        {
            id: 'entry-point',
            title: 'Entry Point & Rendering',
            description: 'Understand strictly where a React application starts its journey from the index.js to the DOM.',
            icon: Play,
            difficulty: 'Easy',
            interviewFrequency: 'High',
            keyPoints: ['ReactDOM.createRoot', 'index.js entry', 'Component Tree Rendering'],
            href: '#',
            color: 'blue'
        },
        {
            id: 'lifecycle',
            title: 'Lifecycle Methods',
            description: 'Master the phases of a component: Mount, Update, and Unmount in both Class and Functional components.',
            icon: Clock,
            difficulty: 'Medium',
            interviewFrequency: 'Very High',
            keyPoints: ['componentDidMount', 'componentWillUnmount', 'useEffect equivalent'],
            href: '/react/lifecycle',
            color: 'purple'
        },
        {
            id: 'hooks-deep-dive',
            title: 'React Hooks API',
            description: 'Deep dive into why hooks were introduced and how they enable state and features in functional components.',
            icon: Sparkles,
            difficulty: 'Medium',
            interviewFrequency: 'Very High',
            keyPoints: ['Standardized logic', 'No more "this"', 'Reusable stateful logic'],
            href: '/react/hooks',
            color: 'cyan'
        },
        {
            id: 'use-memo-callback',
            title: 'useMemo & useCallback',
            description: 'Optimizing performance by memoizing values and functions to prevent unnecessary re-calculations and re-renders.',
            icon: Zap,
            difficulty: 'Hard',
            interviewFrequency: 'Very High',
            keyPoints: ['Expensive calculations', 'Referential equality', 'Dependency arrays'],
            href: '/react/hooks',
            color: 'orange'
        },
        {
            id: 'state-management',
            title: 'Redux & Context API',
            description: 'Managing global state across complex applications using central stores or the native Context provider.',
            icon: Database,
            difficulty: 'Hard',
            interviewFrequency: 'Very High',
            keyPoints: ['One-way data flow', 'A-R-S pattern', 'Prop drilling solution'],
            href: '/react/state-management',
            color: 'emerald'
        },
        {
            id: 'optimization',
            title: 'Performance Optimization',
            description: 'Strategies like Lazy Loading, Code Splitting, and Virtualization to keep React apps lightning fast.',
            icon: Activity,
            difficulty: 'Hard',
            interviewFrequency: 'High',
            keyPoints: ['React.lazy & Suspense', 'Virtual lists', 'Identifying bottlenecks'],
            href: '/react/optimization',
            color: 'rose'
        },
        {
            id: 'advanced-patterns',
            title: 'Advanced Component Patterns',
            description: 'Master HOCs, Render Props, Compound Components, and Custom Hooks for senior-level engineering.',
            icon: Layers,
            difficulty: 'Hard',
            interviewFrequency: 'High',
            keyPoints: ['HOCs', 'Compound Components', 'Render Props'],
            href: '/react/patterns',
            color: 'indigo'
        },
        {
            id: 'use-ref-layout',
            title: 'useRef & useLayoutEffect',
            description: 'Interacting with the DOM directly and handling synchronous layout calculations before paint.',
            icon: MousePointer2,
            difficulty: 'Medium',
            interviewFrequency: 'Medium',
            keyPoints: ['Persisting values', 'DOM references', 'Synchronous reads'],
            href: '/react/hooks',
            color: 'amber'
        },
        {
            id: 'concurrency',
            title: 'useTransition & Concurrency',
            description: 'Marking non-urgent state transitions to keep the UI responsive during heavy updates.',
            icon: Cpu,
            difficulty: 'Hard',
            interviewFrequency: 'Medium',
            keyPoints: ['Concurrent rendering', 'Non-blocking updates', 'UI responsiveness'],
            href: '/react/hooks',
            color: 'blue'
        },
        {
            id: 'security-sessions',
            title: 'Security & Sessions',
            description: 'Managing user sessions safely using LocalStorage, Cookies, and implementing encryption.',
            icon: Shield,
            difficulty: 'Medium',
            interviewFrequency: 'High',
            keyPoints: ['Session storage', 'Auth tokens', 'HTTPS & Encryption'],
            href: '/react/security',
            color: 'slate'
        },
        {
            id: 'caching-api',
            title: 'API Caching Strategies',
            description: 'Storing API responses efficiently to reduce network load and server pressure.',
            icon: Globe,
            difficulty: 'Medium',
            interviewFrequency: 'Medium',
            keyPoints: ['React Query', 'Memory caching', 'Reduced server load'],
            href: '/react/caching',
            color: 'cyan'
        },
        {
            id: 'use-reducer',
            title: 'useReducer',
            description: 'Handling complex state logic with a reducer-based approach, similar to Redux but local.',
            icon: Settings,
            difficulty: 'Medium',
            interviewFrequency: 'Medium',
            keyPoints: ['Complex state', 'Dispatching actions', 'Predictable updates'],
            href: '/react/hooks',
            color: 'purple'
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
                                <Atom className="text-cyan-400 animate-spin-slow" size={48} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                React Interview Masterclass
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
                                From basic rendering to advanced concurrent patterns.
                                Master everything needed for senior React engineering roles.
                            </p>
                        </motion.div>
                    </div>

                    {/* Search Bar Section */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="relative group">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search React topics (e.g. hooks, redux, patterns)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-2xl focus:border-cyan-500 dark:focus:border-cyan-500 outline-none transition-all shadow-sm hover:shadow-md text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Quick Stats */}
                    {!searchQuery && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                            {[
                                { title: 'Hooks', count: '10+', icon: Sparkles, color: 'cyan' },
                                { title: 'Optimization', count: '5 Ways', icon: Activity, color: 'rose' },
                                { title: 'Patterns', count: '8 Key', icon: Layers, color: 'indigo' }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 flex items-center gap-4"
                                >
                                    <div className={`p-3 bg-${stat.color}-500/10 rounded-xl`}>
                                        <stat.icon className={`text-${stat.color}-500`} size={24} />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.count}</div>
                                        <div className="text-sm text-gray-500">{stat.title} Mastered</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

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
                                            <div className="h-full bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 group cursor-pointer flex flex-col">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className={`p-3 bg-${concept.color}-500/10 rounded-xl group-hover:scale-110 transition-transform`}>
                                                        <concept.icon className={`text-${concept.color}-500`} size={28} />
                                                    </div>
                                                    <ArrowRight className="text-gray-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" size={20} />
                                                </div>

                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                                    {concept.title}
                                                </h3>

                                                <p className="text-gray-600 dark:text-slate-400 mb-4 leading-relaxed flex-grow">
                                                    {concept.description}
                                                </p>

                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(concept.difficulty)}`}>
                                                        {concept.difficulty}
                                                    </span>
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
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
                                                        Interview Content Ready
                                                    </span>
                                                    <div className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-semibold text-sm">
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
