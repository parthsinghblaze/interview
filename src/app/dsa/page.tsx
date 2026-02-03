'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Maximize2, Calculator, Split, Play, Clock, Database, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function DSAPage() {
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

                    {/* Available Algorithms Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                        {algorithms.map((algo, idx) => (
                            <motion.div
                                key={algo.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.15, duration: 0.5 }}
                                className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                {/* Card Header */}
                                <div className={`p-6 bg-gradient-to-br ${algo.color === 'blue' ? 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/10' :
                                    algo.color === 'purple' ? 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/10' :
                                        'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10'
                                    }`}>
                                    <div className="flex justify-between items-start">
                                        <div className={`p-3 rounded-xl ${algo.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-300' :
                                            algo.color === 'purple' ? 'bg-purple-100 text-purple-600 dark:bg-purple-800/50 dark:text-purple-300' :
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
                                                'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                                            } shadow-lg`}
                                    >
                                        <Play size={18} className="fill-current" /> Try Visualizer
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>

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
