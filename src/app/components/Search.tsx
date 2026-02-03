'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Command, CornerDownLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const searchData = [
    // Categories
    { title: 'Data Structures & Algorithms', category: 'Category', href: '/dsa', id: 'dsa' },
    { title: 'JavaScript', category: 'Category', href: '/javascript', id: 'javascript' },
    { title: 'React Engineering', category: 'Category', href: '/react', id: 'react' },
    { title: 'Next.js 15+', category: 'Category', href: '/nextjs', id: 'nextjs' },
    { title: 'Node.js', category: 'Category', href: '#', id: 'nodejs', status: 'coming-soon' },
    { title: 'Database', category: 'Category', href: '#', id: 'database', status: 'coming-soon' },

    // DSA Topics
    { title: 'Find Maximum Number', category: 'DSA', href: '/dsa/find-max', id: 'find-max' },
    { title: 'Array Rotation', category: 'DSA', href: '/dsa/array-rotation', id: 'array-rotation' },
    { title: 'Spiral Matrix', category: 'DSA', href: '/dsa/spiral-matrix', id: 'spiral-matrix' },
    { title: 'Duplicate Frequency', category: 'DSA', href: '/dsa/frequency-counter', id: 'frequency-counter' },
    { title: 'Armstrong Number Checker', category: 'DSA', href: '/dsa/armstrong', id: 'armstrong' },
    { title: 'Factors Finder', category: 'DSA', href: '/dsa/factors', id: 'factors' },
    { title: 'Valid Parentheses (Sequence Check)', category: 'DSA', href: '/dsa/valid-parentheses', id: 'valid-parentheses' },
    { title: 'Time & Space Complexity', category: 'DSA', href: '/dsa/complexity', id: 'complexity' },

    // JavaScript Topics
    { title: 'Hoisting', category: 'JavaScript', href: '/javascript/hoisting', id: 'hoisting' },
    { title: 'Closures', category: 'JavaScript', href: '/javascript/closures', id: 'closures' },
    { title: 'Event Loop', category: 'JavaScript', href: '/javascript/event-loop', id: 'event-loop' },
    { title: 'Promises', category: 'JavaScript', href: '/javascript/promises', id: 'promises' },
    { title: 'Async/Await', category: 'JavaScript', href: '/javascript/async-await', id: 'async-await' },
    { title: 'The "this" Keyword', category: 'JavaScript', href: '/javascript/this-keyword', id: 'this-keyword' },
    { title: 'Prototypes & Inheritance', category: 'JavaScript', href: '/javascript/prototypes', id: 'prototypes' },
    { title: 'Debounce & Throttle', category: 'JavaScript', href: '/javascript/debounce-throttle', id: 'debounce-throttle' },
    { title: 'Higher-Order Functions', category: 'JavaScript', href: '/javascript/higher-order-functions', id: 'higher-order-functions' },
    { title: 'Function Currying', category: 'JavaScript', href: '/javascript/currying', id: 'currying' },
    { title: 'Event Delegation', category: 'JavaScript', href: '/javascript/event-delegation', id: 'event-delegation' },
    { title: 'Spread & Rest Operators', category: 'JavaScript', href: '/javascript/spread-rest', id: 'spread-rest' },
    { title: 'Generators & Iterators', category: 'JavaScript', href: '/javascript/generators', id: 'generators' },
    { title: 'Strict Mode', category: 'JavaScript', href: '/javascript/strict-mode', id: 'strict-mode' },
    { title: 'ES Modules vs CJS', category: 'JavaScript', href: '/javascript/modules', id: 'modules' },
    { title: 'Garbage Collection', category: 'JavaScript', href: '/javascript/garbage-collection', id: 'garbage-collection' },
    { title: 'Map, Set & WeakMap', category: 'JavaScript', href: '/javascript/map-set', id: 'map-set' },

    // React Topics
    { title: 'Lifecycle Methods', category: 'React', href: '/react/lifecycle', id: 'react-lifecycle' },
    { title: 'Hooks API (useMemo, useCallback)', category: 'React', href: '/react/hooks', id: 'react-hooks' },
    { title: 'Redux & Context API', category: 'React', href: '/react/state-management', id: 'react-state' },
    { title: 'Performance Optimization', category: 'React', href: '/react/optimization', id: 'react-optimization' },
    { title: 'HOCs & Patterns', category: 'React', href: '/react/patterns', id: 'react-patterns' },

    // Next.js Topics
    { title: 'Server-Side Rendering (SSR)', category: 'Next.js', href: '/nextjs/ssr', id: 'nextjs-ssr' },
    { title: 'Static Site Generation (SSG)', category: 'Next.js', href: '/nextjs/ssr', id: 'nextjs-ssg' },
    { title: 'App Router Architecture', category: 'Next.js', href: '/nextjs/routing', id: 'nextjs-routing' },
    { title: 'React Server Components (RSC)', category: 'Next.js', href: '/nextjs/routing', id: 'nextjs-rsc' },
];

export default function Search() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const filteredResults = query.trim() === ''
        ? []
        : searchData.filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (href: string, status?: string) => {
        if (status === 'coming-soon') return;
        router.push(href);
        setIsOpen(false);
        setQuery('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredResults.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
        } else if (e.key === 'Enter') {
            if (filteredResults[selectedIndex]) {
                handleSelect(filteredResults[selectedIndex].href, filteredResults[selectedIndex].status);
            }
        }
    };

    return (
        <>
            {/* Search Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="group flex items-center justify-center p-3 sm:px-4 bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
                aria-label="Search topics"
            >
                <SearchIcon size={20} className="group-hover:text-blue-500 transition-colors" />
                <div className="hidden sm:flex items-center gap-1 ml-3 px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-700 text-[10px] font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                    <Command size={10} /> K
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                        />

                        {/* Search Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden"
                            ref={searchRef}
                        >
                            {/* Input Area */}
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-slate-800">
                                <SearchIcon size={22} className="text-gray-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setSelectedIndex(0);
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search topic or category..."
                                    className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white text-lg placeholder:text-gray-400"
                                />
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 px-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-xs font-medium"
                                >
                                    ESC
                                </button>
                            </div>

                            {/* Results Area */}
                            <div className="max-h-[60vh] overflow-y-auto p-2">
                                {query.trim() === '' ? (
                                    <div className="p-8 text-center">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <SearchIcon size={24} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Search</h3>
                                        <p className="text-gray-500 dark:text-slate-400 max-w-xs mx-auto mt-2">
                                            Find algorithms, JavaScript concepts, and more in seconds.
                                        </p>
                                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                                            {['Event Loop', 'Hoisting', 'Find Max', 'Complexity'].map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => setQuery(tag)}
                                                    className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : filteredResults.length > 0 ? (
                                    <div className="divide-y divide-gray-100 dark:divide-slate-800">
                                        {filteredResults.map((item, index) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleSelect(item.href, item.status)}
                                                onMouseEnter={() => setSelectedIndex(index)}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20 shadow-sm' : ''
                                                    } ${item.status === 'coming-soon' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-lg ${index === selectedIndex ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>
                                                        {item.category === 'JavaScript' && <SearchIcon size={18} />}
                                                        {item.category === 'DSA' && <SearchIcon size={18} />}
                                                        {item.category === 'Category' && <SearchIcon size={18} />}
                                                    </div>
                                                    <div className="text-left">
                                                        <div className={`font-semibold ${index === selectedIndex ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                                                            {item.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-slate-400">
                                                            {item.category} {item.status === 'coming-soon' && '• Coming Soon'}
                                                        </div>
                                                    </div>
                                                </div>
                                                {index === selectedIndex && item.status !== 'coming-soon' && (
                                                    <div className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 animate-pulse">
                                                        <span>Open</span>
                                                        <CornerDownLeft size={14} />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 dark:text-slate-400">
                                        No results found for "<span className="text-gray-900 dark:text-white font-medium">{query}</span>"
                                    </div>
                                )}
                            </div>

                            {/* Footer Area */}
                            <div className="px-5 py-3 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-800 flex justify-between items-center text-[10px] font-medium text-gray-500 dark:text-slate-500 uppercase tracking-widest">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px]">↵</kbd>
                                        <span>Select</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px]">↑↓</kbd>
                                        <span>Navigate</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px]">ESC</kbd>
                                    <span>Close</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
