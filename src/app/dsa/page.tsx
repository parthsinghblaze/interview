'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Maximize2, Calculator, Split, Play, Clock, Database, ChevronRight, Search as SearchIcon, RefreshCw, Hash, LayoutGrid, Braces, Binary, MoveHorizontal, SortDesc, Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function DSAPage() {
    const [searchQuery, setSearchQuery] = React.useState('');
    const algorithms = [
        {
            id: 'find-max',
            title: 'Find Maximum Number',
            description: 'Learn how to find the maximum element in an array using linear search.',
            icon: Maximize2,
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            techniques: ['Linear Search', 'Iteration', 'Comparison'],
            learning: 'Understanding iteration, comparison operations, and array traversal.',
            href: '/dsa/find-max',
            color: 'blue'
        },
        {
            id: 'array-rotation',
            title: 'Array Rotation',
            description: 'Master Left and Right array rotation using linear and optimized reversal techniques.',
            icon: RefreshCw,
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            techniques: ['Reversal Algorithm', 'Circular Buffer', 'In-place'],
            learning: 'Array manipulation, in-place algorithms, and index mapping.',
            href: '/dsa/array-rotation',
            color: 'purple'
        },
        {
            id: 'armstrong',
            title: 'Armstrong Number Checker',
            description: 'Check if a number is an Armstrong number with digit manipulation.',
            icon: Calculator,
            timeComplexity: 'O(log n)',
            spaceComplexity: 'O(1)',
            techniques: ['Modulo Arithmetic', 'Digit Extraction', 'Powers'],
            learning: 'Number manipulation, mathematical computations, and validation logic.',
            href: '/dsa/armstrong',
            color: 'purple'
        },
        {
            id: 'factors',
            title: 'Factors Finder',
            description: 'Find all factors of a number with optimized O(√n) algorithm.',
            icon: Split,
            timeComplexity: 'O(√n)',
            spaceComplexity: 'O(1)',
            techniques: ['Math Optimization', 'Divisibility', 'Loops'],
            learning: 'Algorithm optimization, mathematical properties, and efficiency.',
            href: '/dsa/factors',
            color: 'green'
        },
        {
            id: 'frequency-counter',
            title: 'Duplicate Frequency',
            description: 'Analyze character frequencies in a string using a high-performance Hash Map approach.',
            icon: Hash,
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(k)',
            techniques: ['Hash Map', 'String Traversal', 'Frequency Counting'],
            learning: 'Data structures, hash tables, and linear time complexity.',
            href: '/dsa/frequency-counter',
            color: 'rose'
        },
        {
            id: 'spiral-matrix',
            title: 'Spiral Matrix',
            description: 'Traverse a 2D matrix in a spiral clock-wise order, mastering boundary management.',
            icon: LayoutGrid,
            timeComplexity: 'O(m*n)',
            spaceComplexity: 'O(1)',
            techniques: ['2D Arrays', 'Boundary Shrinking', 'Matrix Traversal'],
            learning: 'Matrix manipulation, boundary condition handling, and complex loops.',
            href: '/dsa/spiral-matrix',
            color: 'rose'
        },
        {
            id: 'valid-parentheses',
            title: 'Valid Parentheses',
            description: 'Check if a sequence of parentheses, brackets, and braces is logically balanced using a stack.',
            icon: Braces,
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            techniques: ['Stacks', 'LIFO', 'Pattern Matching'],
            learning: 'Linear data structures, balanced sequence logic, and last-in-first-out processing.',
            href: '/dsa/valid-parentheses',
            color: 'blue'
        },
        {
            id: 'two-sum',
            title: 'Two Sum',
            description: 'Find two numbers in an array that add up to a specific target sum using an optimized Hash Map.',
            icon: Hash,
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            techniques: ['Hash Map', 'Target Complement', 'Optimization'],
            learning: 'Data structures, hash tables, and one-pass search algorithms.',
            href: '/dsa/two-sum',
            color: 'green'
        },
        {
            id: 'binary-search',
            title: 'Binary Search',
            description: 'Efficiently find an element in a sorted array by repeatedly dividing the search interval in half.',
            icon: SearchIcon,
            timeComplexity: 'O(log n)',
            spaceComplexity: 'O(1)',
            techniques: ['Divide & Conquer', 'Sorted Search', 'Iteration'],
            learning: 'Logarithmic time complexity, boundary management, and search efficiency.',
            href: '/dsa/binary-search',
            color: 'blue'
        },
        {
            id: 'recursion-types',
            title: 'Head vs Tail Recursion',
            description: 'Visualize the difference between Head and Tail recursion and how they affect the call stack.',
            icon: RefreshCw,
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            techniques: ['Recursion', 'Call Stack', 'Tail Call Optimization'],
            learning: 'Execution flow of recursive calls and stack unwinding behavior.',
            href: '/dsa/recursion-types',
            color: 'indigo'
        },
        {
            id: 'number-frequency',
            title: 'Find Duplicate Number Count',
            description: 'Count frequency of numbers from one array in another using Arrays or HashMaps for O(1) lookups.',
            icon: Binary,
            timeComplexity: 'O(n+m)',
            spaceComplexity: 'O(k)',
            techniques: ['HashMap', 'Frequency Array', 'Dictionary'],
            learning: 'Optimizing range queries, handling large number ranges with Maps vs Arrays.',
            href: '/dsa/number-frequency',
            color: 'blue'
        },
        {
            id: 'reverse-array',
            title: 'Reverse Array (Recursion)',
            description: 'Reverse an array in-place using a recursive two-pointer approach.',
            icon: MoveHorizontal,
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            techniques: ['Recursion', 'Two Pointers', 'In-place Swap'],
            learning: 'Recursive state maintenance and in-place memory manipulation.',
            href: '/dsa/reverse-array',
            color: 'purple'
        },
        {
            id: 'palindrome-recursion',
            title: 'Palindrome Recursion',
            description: 'Check if a string is a palindrome using recursive character comparison.',
            icon: RefreshCw,
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            techniques: ['Recursion', 'String Manipulation', 'Base Cases'],
            learning: 'Recursive stack unwinding and string processing patterns.',
            href: '/dsa/palindrome-recursion',
            color: 'purple'
        },
        {
            id: 'selection-sort',
            title: 'Selection Sort',
            description: 'Sort an array by repeatedly selecting the minimum element and placing it in the correct position.',
            icon: SortDesc,
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(1)',
            techniques: ['Comparison Sort', 'In-place', 'Nested Loops'],
            learning: 'Nested iteration, minimum tracking, and in-place swapping patterns.',
            href: '/dsa/selection-sort',
            color: 'rose'
        },
        {
            id: 'bubble-sort',
            title: 'Bubble Sort',
            description: 'Sort an array by repeatedly swapping adjacent elements that are in the wrong order, bubbling the largest to the end.',
            icon: Waves,
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(1)',
            techniques: ['Comparison Sort', 'Adjacent Swaps', 'Stable Sort'],
            learning: 'Nested loops, adjacent comparisons, and how large values bubble to the top.',
            href: '/dsa/bubble-sort',
            color: 'rose'
        }
    ];

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
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                Data Structures & Algorithms
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
                                Core concepts that power efficient software. Master these foundational algorithms through interactive visualization to ace your technical interviews.
                            </p>
                        </motion.div>
                    </div>

                    {/* Search Bar Section */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="relative group">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search algorithms (e.g. factors, armstrong)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-800 rounded-2xl focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Featured: Complexity Section */}
                    {!searchQuery && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-16"
                        >
                            <Link href="/dsa/complexity">
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-2xl p-8 border border-blue-200 dark:border-blue-500/30 hover:border-blue-300 dark:hover:border-blue-400/50 transition-all hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 cursor-pointer group">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Clock className="text-blue-600 dark:text-blue-400" size={32} />
                                                <Database className="text-purple-600 dark:text-purple-400" size={32} />
                                            </div>
                                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                                Understanding Time & Space Complexity
                                            </h2>
                                            <p className="text-gray-600 dark:text-blue-200 text-lg mb-4">
                                                Master Big O notation with interactive visualizations and real-world examples.
                                                Learn how to analyze algorithm efficiency and make better coding decisions.
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full text-sm">Big O Notation</span>
                                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full text-sm">Interactive Charts</span>
                                                <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 rounded-full text-sm">Real Examples</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-600 dark:text-white font-semibold text-lg group-hover:gap-4 transition-all">
                                            Learn Complexity
                                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )}

                    {/* Available Algorithms Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                        <AnimatePresence>
                            {algorithms
                                .filter(algo =>
                                    algo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    algo.techniques.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
                                )
                                .map((algo, idx) => (
                                    <motion.div
                                        key={algo.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                                    >
                                        {/* Card Header */}
                                        <div className={`p-6 bg-gradient-to-br ${algo.color === 'blue' ? 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/10' :
                                            algo.color === 'purple' ? 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/10' :
                                                algo.color === 'rose' ? 'from-rose-50 to-orange-50 dark:from-rose-900/20 dark:to-orange-900/10' :
                                                    'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10'
                                            }`}>
                                            <div className="flex justify-between items-start">
                                                <div className={`p-3 rounded-xl ${algo.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-300' :
                                                    algo.color === 'purple' ? 'bg-purple-100 text-purple-600 dark:bg-purple-800/50 dark:text-purple-300' :
                                                        algo.color === 'rose' ? 'bg-rose-100 text-rose-600 dark:bg-rose-800/50 dark:text-rose-300' :
                                                            'bg-emerald-100 text-emerald-600 dark:bg-emerald-800/50 dark:text-emerald-300'
                                                    }`}>
                                                    <algo.icon size={32} />
                                                </div>
                                                <span className="flex items-center gap-1 text-xs font-mono font-medium text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-black/20 px-2 py-1 rounded">
                                                    <Clock size={12} /> {algo.timeComplexity}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">{algo.title}</h3>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-6 flex-grow flex flex-col">
                                            <p className="text-gray-600 dark:text-slate-400 mb-6 flex-grow">
                                                {algo.description}
                                            </p>

                                            <div className="space-y-4 mb-6">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wide opacity-80">Key Concepts</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {algo.techniques.map((tech) => (
                                                            <span key={tech} className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs rounded-md">
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wide opacity-80">What You'll Learn</h4>
                                                    <p className="text-sm text-gray-600 dark:text-slate-400">
                                                        {algo.learning}
                                                    </p>
                                                </div>
                                            </div>

                                            <Link
                                                href={algo.href}
                                                className={`w-full py-3 rounded-lg font-semibold text-center flex items-center justify-center gap-2 transition-all group ${algo.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20' :
                                                    algo.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20' :
                                                        algo.color === 'rose' ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20' :
                                                            'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                                                    } shadow-lg`}
                                            >
                                                <Play size={18} className="fill-current" /> Try Visualizer
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                        </AnimatePresence>
                    </div>

                    {/* No Results Fallback */}
                    {algorithms.filter(algo =>
                        algo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        algo.techniques.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
                    ).length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-800 mb-20"
                            >
                                <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <SearchIcon className="text-gray-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No algorithms found</h3>
                                <p className="text-gray-600 dark:text-slate-400">Try searching with a different keyword or browse our categories.</p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear Search
                                </button>
                            </motion.div>
                        )}

                    {/* Coming Soon Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-gray-100 dark:border-slate-800 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">More Algorithms Coming Soon</h3>
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            {['Binary Search', 'Bubble Sort', 'Merge Sort', 'Quick Sort', 'Linked Lists', 'Binary Trees', 'Graph Traversal'].map((item) => (
                                <span key={item} className="px-4 py-2 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-400 rounded-full border border-gray-200 dark:border-slate-700 text-sm">
                                    {item}
                                </span>
                            ))}
                        </div>
                        <div className="max-w-xl mx-auto">
                            <p className="text-gray-500 dark:text-slate-500 mb-6">
                                We're constantly working on adding more visualizations. Subscribe to get notified when new algorithms are released.
                            </p>
                            <form className="flex gap-2 max-w-sm mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                                <button className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg hover:opacity-90 transition-opacity">
                                    Notify
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
