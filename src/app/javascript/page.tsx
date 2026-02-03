'use client';

import React from 'react';
import Link from 'next/link';
import {
    ArrowUp,
    Lock,
    Repeat,
    Clock,
    Sparkles,
    ArrowRight,
    CheckCircle,
    Code,
    Search as SearchIcon,
    Target,
    Layers,
    Activity,
    Zap,
    Split,
    MousePointerClick,
    Box,
    Play,
    Shield,
    Package,
    Trash2,
    Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function JavaScriptPage() {
    const [searchQuery, setSearchQuery] = React.useState('');
    const concepts = [
        {
            id: 'hoisting',
            title: 'Hoisting',
            description: 'Understanding how JavaScript moves declarations to the top of their scope before code execution.',
            icon: ArrowUp,
            difficulty: 'Medium',
            interviewFrequency: 'Very High',
            keyPoints: ['Variable hoisting', 'Function hoisting', 'Temporal Dead Zone'],
            href: '/javascript/hoisting',
            color: 'blue',
            active: true
        },
        {
            id: 'closures',
            title: 'Closures',
            description: 'Learn how functions remember variables from their outer scope even after the outer function has returned.',
            icon: Lock,
            difficulty: 'Hard',
            interviewFrequency: 'Very High',
            keyPoints: ['Lexical scope', 'Function bundling', 'Private variables'],
            href: '/javascript/closures',
            color: 'purple',
            active: true
        },
        {
            id: 'event-loop',
            title: 'Event Loop',
            description: 'Master JavaScript\'s single-threaded asynchronous execution model and the call stack.',
            icon: Repeat,
            difficulty: 'Hard',
            interviewFrequency: 'High',
            keyPoints: ['Call stack', 'Task queue', 'Microtasks'],
            href: '/javascript/event-loop',
            color: 'green',
            active: true
        },
        {
            id: 'promises',
            title: 'Promises',
            description: 'Handle asynchronous operations elegantly with JavaScript Promises and their states.',
            icon: Clock,
            difficulty: 'Medium',
            interviewFrequency: 'Very High',
            keyPoints: ['Pending', 'Fulfilled', 'Rejected', 'Chaining'],
            href: '/javascript/promises',
            color: 'orange',
            active: true
        },
        {
            id: 'async-await',
            title: 'Async/Await',
            description: 'Write asynchronous code that looks synchronous using modern async/await syntax.',
            icon: Sparkles,
            difficulty: 'Medium',
            interviewFrequency: 'Very High',
            keyPoints: ['Async functions', 'Await keyword', 'Error handling'],
            href: '/javascript/async-await',
            color: 'cyan',
            active: true
        },
        {
            id: 'this-keyword',
            title: 'The "this" Keyword',
            description: 'Master how "this" is determined by call-site and how to explicitly bind it using call, apply, and bind.',
            icon: Target,
            difficulty: 'Medium',
            interviewFrequency: 'Very High',
            keyPoints: ['Implicit binding', 'Explicit binding', 'Arrow functions', 'New binding'],
            href: '/javascript/this-keyword',
            color: 'blue',
            active: true
        },
        {
            id: 'prototypes',
            title: 'Prototypes & Inheritance',
            description: 'Understand the prototype chain, shadow properties, and how JavaScript implements inheritance.',
            icon: Layers,
            difficulty: 'Hard',
            interviewFrequency: 'High',
            keyPoints: ['__proto__ vs prototype', 'Prototypal chain', 'Object.create'],
            href: '/javascript/prototypes',
            color: 'purple',
            active: true
        },
        {
            id: 'debounce-throttle',
            title: 'Debounce & Throttle',
            description: 'Optimize performance by controlling how many times a function can be executed over time.',
            icon: Activity,
            difficulty: 'Medium',
            interviewFrequency: 'High',
            keyPoints: ['Search inputs', 'Window resizing', 'Callback optimization'],
            href: '/javascript/debounce-throttle',
            color: 'orange',
            active: true
        },
        {
            id: 'higher-order-functions',
            title: 'Higher-Order Functions',
            description: 'Functions that take other functions as arguments or return them. Master Map, Filter, and Reduce.',
            icon: Zap,
            difficulty: 'Easy',
            interviewFrequency: 'Very High',
            keyPoints: ['Map', 'Filter', 'Reduce', 'Function composition'],
            href: '/javascript/higher-order-functions',
            color: 'emerald',
            active: true
        },
        {
            id: 'currying',
            title: 'Function Currying',
            description: 'Transform a function with multiple arguments into a sequence of functions with single arguments.',
            icon: Split,
            difficulty: 'Medium',
            interviewFrequency: 'Medium',
            keyPoints: ['Partial application', 'Arity', 'Closure usage'],
            href: '/javascript/currying',
            color: 'pink',
            active: true
        },
        {
            id: 'event-delegation',
            title: 'Event Delegation',
            description: 'Efficiently handle events by exploiting event bubbling and attaching a single listener to a parent.',
            icon: MousePointerClick,
            difficulty: 'Easy',
            interviewFrequency: 'High',
            keyPoints: ['Bubbling', 'Capturing', 'Target vs CurrentTarget'],
            href: '/javascript/event-delegation',
            color: 'cyan',
            active: true
        },
        {
            id: 'spread-rest',
            title: 'Spread & Rest Operators',
            description: 'Master the "..." operator for expanding arrays into elements or collecting elements into arrays.',
            icon: Box,
            difficulty: 'Easy',
            interviewFrequency: 'Very High',
            keyPoints: ['Shallow copy', 'Destructuring', 'Parameter collection'],
            href: '/javascript/spread-rest',
            color: 'indigo',
            active: true
        },
        {
            id: 'generators',
            title: 'Generators & Iterators',
            description: 'Functions that can be paused and resumed, allowing for powerful sequence generation and custom iteration.',
            icon: Play,
            difficulty: 'Hard',
            interviewFrequency: 'Medium',
            keyPoints: ['Yield keyword', 'next() method', 'Symbol.iterator'],
            href: '/javascript/generators',
            color: 'rose',
            active: true
        },
        {
            id: 'strict-mode',
            title: 'Strict Mode',
            description: 'Opt-in to a restricted variant of JavaScript that catches common coding errors and improves performance.',
            icon: Shield,
            difficulty: 'Easy',
            interviewFrequency: 'Medium',
            keyPoints: ['Silent errors', 'Global variables', 'Securing JS'],
            href: '/javascript/strict-mode',
            color: 'slate',
            active: true
        },
        {
            id: 'modules',
            title: 'ES Modules vs CJS',
            description: 'Understand the differences between modern ES Modules (import/export) and CommonJS (require).',
            icon: Package,
            difficulty: 'Medium',
            interviewFrequency: 'High',
            keyPoints: ['Static vs Dynamic', 'Tree shaking', 'Browser support'],
            href: '/javascript/modules',
            color: 'yellow',
            active: true
        },
        {
            id: 'garbage-collection',
            title: 'Garbage Collection',
            description: 'How JavaScript automatically allocates and frees memory, and how to avoid memory leaks.',
            icon: Trash2,
            difficulty: 'Hard',
            interviewFrequency: 'Medium',
            keyPoints: ['Mark and Sweep', 'Reference counting', 'Memory leaks'],
            href: '/javascript/garbage-collection',
            color: 'red',
            active: true
        },
        {
            id: 'weakmap-weakset',
            title: 'Map, Set & WeakMap',
            description: 'Advanced data structures in JavaScript and when to use WeakMap for memory-safe object storage.',
            icon: Database,
            difficulty: 'Medium',
            interviewFrequency: 'Medium',
            keyPoints: ['Key types', 'Garbage collection', 'Iteration'],
            href: '/javascript/weakmap-weakset',
            color: 'amber',
            active: true
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
                                <Code className="text-yellow-400" size={48} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                JavaScript Core Concepts
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
                                Master the fundamental JavaScript concepts that every developer must know.
                                Interactive visualizations make complex topics simple and interview-ready.
                            </p>
                        </motion.div>
                    </div>

                    {/* Search Bar Section */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="relative group">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search concepts (e.g. event loop, closures)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-2xl focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Why These Topics Matter */}
                    {!searchQuery && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-16 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl p-8 border border-yellow-200 dark:border-yellow-500/30"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Sparkles className="text-yellow-600 dark:text-yellow-400" />
                                Why Master These Concepts?
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4 text-gray-600 dark:text-slate-300">
                                <div className="flex gap-3">
                                    <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1" size={20} />
                                    <p>These are the <strong>most frequently asked</strong> JavaScript interview questions</p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1" size={20} />
                                    <p>Understanding these concepts is <strong>crucial for writing efficient code</strong></p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1" size={20} />
                                    <p>Foundation for <strong>advanced JavaScript patterns</strong> and frameworks</p>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0 mt-1" size={20} />
                                    <p>Demonstrates <strong>deep understanding</strong> of how JavaScript works internally</p>
                                </div>
                            </div>
                        </motion.div>
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
                                            <div className="h-full bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group cursor-pointer">
                                                {/* Icon & Title */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className={`p-3 bg-${concept.color}-500/10 rounded-xl group-hover:scale-110 transition-transform`}>
                                                        <concept.icon className={`text-${concept.color}-500`} size={28} />
                                                    </div>
                                                    <ArrowRight className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
                                                </div>

                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {concept.title}
                                                </h3>

                                                <p className="text-gray-600 dark:text-slate-400 mb-4 leading-relaxed">
                                                    {concept.description}
                                                </p>

                                                {/* Badges */}
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(concept.difficulty)}`}>
                                                        {concept.difficulty}
                                                    </span>
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                                                        {concept.interviewFrequency}
                                                    </span>
                                                </div>

                                                {/* Key Points */}
                                                <div className="space-y-2">
                                                    <div className="text-xs font-semibold text-gray-500 dark:text-slate-500 uppercase tracking-wider">
                                                        Key Concepts:
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {concept.keyPoints.map((point, i) => (
                                                            <span
                                                                key={i}
                                                                className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 px-2 py-1 rounded"
                                                            >
                                                                {point}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Interactive Badge */}
                                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                                                        Interactive Visualizer
                                                    </span>
                                                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                                                        Learn Now
                                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                        </AnimatePresence>
                    </div>

                    {/* No Results Fallback */}
                    {concepts.filter(concept =>
                        concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        concept.keyPoints.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-800"
                            >
                                <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <SearchIcon className="text-gray-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No concepts found</h3>
                                <p className="text-gray-600 dark:text-slate-400">Try searching with a different keyword like "closures" or "async".</p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear Search
                                </button>
                            </motion.div>
                        )}

                    {/* Study Tips */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mt-16 bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-slate-700 shadow-lg"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">📚 Study Tips for Interviews</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">Before the Interview:</h3>
                                <ul className="space-y-2 text-gray-600 dark:text-slate-300">
                                    <li className="flex gap-2">
                                        <span className="text-blue-600 dark:text-blue-400">•</span>
                                        Practice explaining each concept in simple terms
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-blue-600 dark:text-blue-400">•</span>
                                        Write code examples from memory
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-blue-600 dark:text-blue-400">•</span>
                                        Understand real-world use cases
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-3">During the Interview:</h3>
                                <ul className="space-y-2 text-gray-600 dark:text-slate-300">
                                    <li className="flex gap-2">
                                        <span className="text-purple-600 dark:text-purple-400">•</span>
                                        Start with a simple definition
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-purple-600 dark:text-purple-400">•</span>
                                        Provide a code example
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-purple-600 dark:text-purple-400">•</span>
                                        Discuss practical applications
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
