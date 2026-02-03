'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu,
    Code,
    ArrowRight,
    CheckCircle,
    Sparkles,
    Zap,
    Shield,
    Box,
    Search as SearchIcon,
    ChevronRight,
    Type
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TypeScriptPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const topics = [
        {
            id: 'interfaces',
            title: 'Interfaces',
            description: 'Define the shape of objects and see how they are completely removed in the compiled JavaScript.',
            icon: Shield,
            difficulty: 'Easy',
            category: 'Foundations',
            points: ['Shape definition', 'Zero runtime cost', 'Declaration merging'],
            href: '/typescript/interfaces',
            color: 'blue'
        },
        {
            id: 'enums',
            title: 'Enums',
            description: 'See how named constants transform into complex JavaScript objects or simplified values.',
            icon: Box,
            difficulty: 'Medium',
            category: 'Constants',
            points: ['Numeric Enums', 'String Enums', 'Reverse mapping'],
            href: '/typescript/enums',
            color: 'purple'
        },
        {
            id: 'generics',
            title: 'Generics',
            description: 'Create reusable components that work with a variety of types while maintaining type safety.',
            icon: Cpu,
            difficulty: 'Hard',
            category: 'Advanced',
            points: ['Type variables', 'Constraints', 'Utility types'],
            href: '/typescript/generics',
            color: 'emerald'
        },
        {
            id: 'unions-intersections',
            title: 'Unions & Intersections',
            description: 'Combine multiple types into one or choice between several types using type algebra.',
            icon: Type,
            difficulty: 'Medium',
            category: 'Type Logic',
            points: ['OR types (|)', 'AND types (&)', 'Discriminated unions'],
            href: '/typescript/unions-intersections',
            color: 'cyan'
        },
        {
            id: 'classes',
            title: 'Classes & Modifiers',
            description: 'Understand how public, private, and protected modifiers work in TS vs JS private fields.',
            icon: Zap,
            difficulty: 'Medium',
            category: 'OOP',
            points: ['Access modifiers', 'Abstract classes', 'Implements'],
            href: '/typescript/classes',
            color: 'orange'
        },
        {
            id: 'type-guards',
            title: 'Type Guards',
            description: 'Learn how to narrow down types within conditional blocks using typeof, instanceof, and predicates.',
            icon: Sparkles,
            difficulty: 'Medium',
            category: 'Narrowing',
            points: ['Narrowing', 'User-defined predicates', 'Control flow analysis'],
            href: '/typescript/type-guards',
            color: 'pink'
        },
        {
            id: 'utility-types',
            title: 'Utility Types',
            description: 'Leverage built-in global types like Partial, Readonly, Pick, and Omit to transform types.',
            icon: Code,
            difficulty: 'Easy',
            category: 'Transformation',
            points: ['Partial/Required', 'Pick/Omit', 'Record'],
            href: '/typescript/utility-types',
            color: 'indigo'
        },
        {
            id: 'mapped-types',
            title: 'Mapped Types',
            description: 'Create new types based on the properties of an existing type using a mapping syntax.',
            icon: Repeat,
            difficulty: 'Hard',
            category: 'Metaprogramming',
            points: ['Keyof operator', 'Property transformation', 'Template literals'],
            href: '/typescript/mapped-types',
            color: 'rose'
        }
    ];

    const filteredTopics = topics.filter(topic =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.points.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10';
            case 'Medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10';
            case 'Hard': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10';
            default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-500/10';
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
                            <div className="inline-flex items-center justify-center p-3 mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                                <Cpu className="text-blue-600 dark:text-blue-400" size={40} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                TypeScript Mastery
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
                                Go beyond "any". Understand how TypeScript provides safety during development and what actually happens when it compiles to JavaScript.
                            </p>
                        </motion.div>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="relative group">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search TypeScript topics (e.g. generics, interfaces)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-2xl focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Compilation Visualizer Callout */}
                    {!searchQuery && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <Cpu size={200} />
                            </div>
                            <div className="relative z-10 md:flex items-center justify-between gap-12">
                                <div className="flex-1">
                                    <h2 className="text-3xl font-bold mb-4">TypeScript Compilation Visualizer</h2>
                                    <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                                        The biggest "Aha!" moment in TypeScript is realizing it's just a type-checker.
                                        Every topic includes a visualizer showing the <strong>TS Input</strong> vs <strong>JS Output</strong>.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                                            <CheckCircle size={14} className="text-blue-300" /> No Runtime overhead
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                                            <CheckCircle size={14} className="text-blue-300" /> Erasure of types
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                                            <CheckCircle size={14} className="text-blue-300" /> Predictable JS
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 md:mt-0">
                                    <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-lg hover:-translate-y-1">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredTopics.map((topic, idx) => (
                                <motion.div
                                    key={topic.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link href={topic.href}>
                                        <div className="h-full bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`p-3 rounded-xl bg-gray-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors`}>
                                                    <topic.icon className={`text-${topic.color}-600 dark:text-${topic.color}-400`} size={28} />
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(topic.difficulty)}`}>
                                                    {topic.difficulty}
                                                </div>
                                            </div>

                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                                                {topic.title}
                                            </h3>

                                            <p className="text-gray-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                                                {topic.description}
                                            </p>

                                            <div className="space-y-2 mb-6">
                                                {topic.points.map((point, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-500">
                                                        <ChevronRight size={12} className="text-blue-500" />
                                                        {point}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-blue-600 dark:text-blue-400 font-bold text-sm">
                                                View Visualizer
                                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* No Results */}
                    {filteredTopics.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <SearchIcon className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No TypeScript topics found</h3>
                            <button
                                onClick={() => setSearchQuery('')}
                                className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Clear Search
                            </button>
                        </motion.div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}

// Helper icons missing in imports
function Repeat(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m17 2 4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="m7 22-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
    )
}
