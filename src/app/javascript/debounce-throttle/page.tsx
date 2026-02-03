'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, Timer, Zap } from 'lucide-react';
import Link from 'next/link';

export default function DebounceThrottlePage() {
    const [debounceCount, setDebounceCount] = useState(0);
    const [throttleCount, setThrottleCount] = useState(0);
    const [normalCount, setNormalCount] = useState(0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            <Header />

            <main className="pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-8">
                        <Link
                            href="/javascript"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to JavaScript
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center p-3 mb-4 bg-orange-100 dark:bg-orange-900/30 rounded-2xl">
                            <Activity className="text-orange-600 dark:text-orange-400" size={40} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Debounce & Throttle
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            Two powerful techniques to limit how often a function is executed. Essential for performance optimization in real-world applications.
                        </p>
                    </div>

                    {/* The Problem */}
                    <div className="mb-16 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-3xl p-8 border-2 border-red-200 dark:border-red-500/30">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            ⚠️ The Problem
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-slate-300 mb-4 leading-relaxed">
                            Imagine a search box that makes an API call on every keystroke. If you type "JavaScript" (10 characters), that's 10 API calls in rapid succession!
                        </p>
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6">
                            <pre className="text-sm font-mono text-slate-300">
                                {`input.addEventListener('input', (e) => {
  fetchSearchResults(e.target.value); // Called 10 times! 😱
});

// User types: J a v a S c r i p t
// API calls:  1 2 3 4 5 6 7 8 9 10`}
                            </pre>
                        </div>
                        <p className="text-gray-600 dark:text-slate-400 mt-4">
                            This wastes bandwidth, increases server load, and can cause UI lag!
                        </p>
                    </div>

                    {/* Debounce */}
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Timer className="text-blue-600 dark:text-blue-400" size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Debounce: "Wait until they stop"
                            </h2>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800">
                            <p className="text-lg text-gray-700 dark:text-slate-300 mb-6 leading-relaxed">
                                <strong>Debouncing</strong> waits for a pause in activity before executing the function. If the function is called again before the timer expires, the timer resets.
                            </p>

                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-6 border border-blue-200 dark:border-blue-500/30">
                                <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-3">
                                    Simple Analogy: Elevator Door
                                </h4>
                                <p className="text-gray-700 dark:text-slate-300">
                                    An elevator door starts closing, but if someone presses the button, it reopens and waits again. It only closes when no one has pressed the button for a few seconds.
                                </p>
                            </div>

                            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Implementation:</h4>
                            <div className="bg-slate-900 rounded-xl p-6 mb-6">
                                <pre className="text-sm font-mono text-slate-300">
                                    {`function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId); // Cancel previous timer
    
    timeoutId = setTimeout(() => {
      func.apply(this, args); // Execute after delay
    }, delay);
  };
}

// Usage
const searchInput = document.getElementById('search');
const debouncedSearch = debounce(fetchSearchResults, 500);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value); // Only calls API after 500ms of no typing
});`}
                                </pre>
                            </div>

                            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-500/30">
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                    ✅ <strong>Best for:</strong> Search inputs, form validation, window resize events, auto-save features
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Throttle */}
                    <div className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Zap className="text-purple-600 dark:text-purple-400" size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Throttle: "Execute at regular intervals"
                            </h2>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800">
                            <p className="text-lg text-gray-700 dark:text-slate-300 mb-6 leading-relaxed">
                                <strong>Throttling</strong> ensures a function is called at most once in a specified time period, regardless of how many times the event fires.
                            </p>

                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 mb-6 border border-purple-200 dark:border-purple-500/30">
                                <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-3">
                                    Simple Analogy: Traffic Light
                                </h4>
                                <p className="text-gray-700 dark:text-slate-300">
                                    No matter how many cars arrive, the light only changes every 60 seconds. Cars that arrive during the red light must wait for the next cycle.
                                </p>
                            </div>

                            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Implementation:</h4>
                            <div className="bg-slate-900 rounded-xl p-6 mb-6">
                                <pre className="text-sm font-mono text-slate-300">
                                    {`function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args); // Execute immediately
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false; // Allow next execution after limit
      }, limit);
    }
  };
}

// Usage
const handleScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 1000);

window.addEventListener('scroll', handleScroll); 
// Logs at most once per second while scrolling`}
                                </pre>
                            </div>

                            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-500/30">
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                    ✅ <strong>Best for:</strong> Scroll events, mouse movement tracking, button spam prevention, game loop updates
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            Quick Comparison
                        </h2>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800 overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200 dark:border-slate-700">
                                        <th className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white">Feature</th>
                                        <th className="text-left py-4 px-4 font-bold text-blue-600 dark:text-blue-400">Debounce</th>
                                        <th className="text-left py-4 px-4 font-bold text-purple-600 dark:text-purple-400">Throttle</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-700 dark:text-slate-300">
                                    <tr className="border-b border-gray-100 dark:border-slate-800">
                                        <td className="py-4 px-4 font-medium">When it executes</td>
                                        <td className="py-4 px-4">After a pause in events</td>
                                        <td className="py-4 px-4">At regular intervals</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 dark:border-slate-800">
                                        <td className="py-4 px-4 font-medium">First call</td>
                                        <td className="py-4 px-4">Waits for delay</td>
                                        <td className="py-4 px-4">Executes immediately</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 dark:border-slate-800">
                                        <td className="py-4 px-4 font-medium">Subsequent calls</td>
                                        <td className="py-4 px-4">Resets timer</td>
                                        <td className="py-4 px-4">Ignored if in cooldown</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 dark:border-slate-800">
                                        <td className="py-4 px-4 font-medium">Use case</td>
                                        <td className="py-4 px-4">Search, Resize, Validation</td>
                                        <td className="py-4 px-4">Scroll, Mouse move, Infinite scroll</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Visual Timeline */}
                    <div className="mb-16 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Visual Timeline (10 rapid events)
                        </h2>
                        <div className="space-y-8">
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white mb-3">Without optimization:</h4>
                                <div className="flex gap-1">
                                    {Array(10).fill(0).map((_, i) => (
                                        <div key={i} className="flex-1 h-12 bg-red-500 rounded flex items-center justify-center text-white text-xs">
                                            ✕
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-slate-500 mt-2">10 executions</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-3">With Debounce (500ms):</h4>
                                <div className="flex gap-1">
                                    {Array(10).fill(0).map((_, i) => (
                                        <div key={i} className={`flex-1 h-12 rounded flex items-center justify-center text-xs ${i === 9 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-400'
                                            }`}>
                                            {i === 9 ? '✓' : '○'}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-slate-500 mt-2">1 execution (only after all events stop)</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-3">With Throttle (300ms):</h4>
                                <div className="flex gap-1">
                                    {Array(10).fill(0).map((_, i) => (
                                        <div key={i} className={`flex-1 h-12 rounded flex items-center justify-center text-xs ${i % 3 === 0 ? 'bg-purple-500 text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-400'
                                            }`}>
                                            {i % 3 === 0 ? '✓' : '○'}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-slate-500 mt-2">4 executions (every 300ms)</p>
                            </div>
                        </div>
                    </div>

                    {/* Interview Tips */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-3xl p-8 border border-yellow-200 dark:border-yellow-500/30">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            💡 Common Interview Questions
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">❓ When to use debounce vs throttle?</h4>
                                <p className="text-sm text-gray-600 dark:text-slate-400">
                                    Use debounce when you want the final value (search, form validation). Use throttle when you want periodic updates (scroll position, progress).
                                </p>
                            </div>
                            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">❓ Can you use both together?</h4>
                                <p className="text-sm text-gray-600 dark:text-slate-400">
                                    Rarely needed, but yes! For example, track scroll position periodically (throttle) but save to localStorage only after scrolling stops (debounce).
                                </p>
                            </div>
                            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">❓ What about leading vs trailing?</h4>
                                <p className="text-sm text-gray-600 dark:text-slate-400">
                                    Leading: execute immediately on first call. Trailing: execute after delay. Lodash's debounce/throttle support both options.
                                </p>
                            </div>
                            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">❓ Performance benefit?</h4>
                                <p className="text-sm text-gray-600 dark:text-slate-400">
                                    Can reduce function calls by 90%+! Critical for heavy operations like API calls, DOM manipulation, or complex calculations.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
