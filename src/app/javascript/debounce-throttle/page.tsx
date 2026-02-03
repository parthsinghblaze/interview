'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Timer, Zap, Play, Pause } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DebounceThrottleVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [activeTab, setActiveTab] = useState('debounce');

    // Visualization state
    const [events, setEvents] = useState<{ id: number; type: 'trigger' | 'execution'; time: number }[]>([]);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    // Refs for optimization
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const lastExecutionRef = useRef<number>(0);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const examples = [
        {
            id: 'debounce',
            title: 'Debounce',
            icon: <Timer size={20} />,
            color: 'text-blue-400',
            bg: 'bg-blue-400',
            border: 'border-blue-400',
            code: `function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}`,
            explanation: 'Waits for a pause in activity before executing. Resets timer on every new event.',
            interviewPoint: 'Best for search inputs and form validation.'
        },
        {
            id: 'throttle',
            title: 'Throttle',
            icon: <Zap size={20} />,
            color: 'text-purple-400',
            bg: 'bg-purple-400',
            border: 'border-purple-400',
            code: `function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}`,
            explanation: 'Executes at regular intervals regardless of frequency. Ignores events during cooldown.',
            interviewPoint: 'Best for scroll events and button spam prevention.'
        }
    ];

    const currentEx = examples.find(e => e.id === activeTab) || examples[0];

    const triggerEvent = () => {
        const newEvent = { id: Date.now(), type: 'trigger' as const, time: Date.now() };
        setEvents(prev => [...prev, newEvent].slice(-20));

        if (activeTab === 'debounce') {
            if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
            debounceTimeoutRef.current = setTimeout(() => {
                executeFunction();
            }, 1000);
        } else {
            const now = Date.now();
            if (now - lastExecutionRef.current >= 1000) {
                executeFunction();
                lastExecutionRef.current = now;
            }
        }
    };

    const executeFunction = () => {
        setEvents(prev => [...prev, { id: Date.now(), type: 'execution' as const, time: Date.now() }].slice(-20));
    };

    const handleReset = () => {
        setEvents([]);
        lastExecutionRef.current = 0;
        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Header />

            {/* Full Screen Layout */}
            <div className="pt-20 min-h-[calc(100vh-5rem)] flex">

                {/* Left Sidebar - Definitions */}
                <div className="w-80 bg-slate-900 border-r border-slate-700 p-6 overflow-y-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Activity className="text-orange-400" size={40} />
                            <h1 className="text-2xl font-bold leading-tight">Debounce & Throttle</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Optimize performance by controlling function execution frequency.
                        </p>
                    </div>

                    {/* Interview Definition */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-orange-400" size={22} />
                            <h3 className="text-base font-bold text-orange-400 uppercase">Debounce</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "Wait until the user stops typing/acting. If they act again, start the wait over."
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="text-purple-400" size={22} />
                            <h3 className="text-base font-bold text-purple-400 uppercase">Throttle</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "Execute at most once every X milliseconds, even if triggered 100 times."
                        </p>
                    </div>

                    {/* Key Use Cases */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-green-400" size={22} />
                            <h3 className="text-base font-bold text-green-400 uppercase">When to use?</h3>
                        </div>
                        <ul className="space-y-3 text-slate-200 text-base">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <div><strong className="text-blue-400">Search:</strong> Debounce</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <div><strong className="text-purple-400">Scroll:</strong> Throttle</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400 mt-1">•</span>
                                <div><strong className="text-emerald-400">Resize:</strong> Either (context dependent)</div>
                            </li>
                        </ul>
                    </div>

                    {/* Simple Analogy */}
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase">Analogies</h4>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-blue-400 mb-1">Debounce: Elevator Door</p>
                                <p className="text-slate-400 text-[10px] leading-tight">Stays open as long as people keep walking in. Starts closing only after a pause.</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-purple-400 mb-1">Throttle: Traffic Light</p>
                                <p className="text-slate-400 text-[10px] leading-tight">Only allows cars through in cycles, regardless of how many cars wait.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Full Screen Visualizer */}
                <div className="flex-1 flex flex-col bg-slate-950">

                    {/* Example Tabs */}
                    <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
                        <div className="flex gap-2 items-center">
                            {examples.map((ex) => (
                                <button
                                    key={ex.id}
                                    onClick={() => {
                                        setActiveTab(ex.id);
                                        handleReset();
                                    }}
                                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${activeTab === ex.id
                                            ? `${ex.bg} text-white shadow-lg`
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {ex.icon}
                                    {ex.title}
                                </button>
                            ))}
                            <div className="ml-auto flex items-center gap-4">
                                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">1000ms Interval</span>
                            </div>
                        </div>
                    </div>

                    {/* Code Display */}
                    <div className="bg-slate-900/50 flex flex-col" style={{ height: '35vh' }}>
                        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700 bg-slate-900">
                            <div className="flex items-center gap-2">
                                <Code className={currentEx.color} size={20} />
                                <h3 className="text-lg font-bold">{currentEx.title} Implementation</h3>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <SyntaxHighlighter
                                language="javascript"
                                style={atomDark}
                                customStyle={{
                                    margin: 0,
                                    padding: '2rem',
                                    fontSize: '1.1rem',
                                    lineHeight: '1.6',
                                    backgroundColor: 'transparent'
                                }}
                            >
                                {currentEx.code}
                            </SyntaxHighlighter>
                        </div>
                    </div>

                    {/* Interactive Visualization - Takes remaining space */}
                    <div className="flex-1 bg-slate-900 px-8 py-6 flex flex-col border-t border-slate-700 overflow-hidden">
                        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
                            {/* Controls & Action Area */}
                            <div className="flex flex-col items-center gap-6 mb-12">
                                <div className="text-center">
                                    <h3 className="text-xl font-bold mb-2">Visual Stress Test</h3>
                                    <p className="text-slate-400 text-sm italic">Click frantically to see the difference!</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={triggerEvent}
                                        className={`w-40 h-40 rounded-full border-4 ${currentEx.border} flex flex-col items-center justify-center gap-2 group relative overflow-hidden transition-all hover:bg-slate-800`}
                                    >
                                        <div className={`absolute inset-0 ${currentEx.bg} opacity-0 group-active:opacity-20 transition-opacity`} />
                                        <Activity size={48} className={currentEx.color} />
                                        <span className="font-bold text-sm uppercase">Click Here</span>
                                    </motion.button>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={handleReset}
                                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-2 transition-colors text-sm"
                                        >
                                            <RotateCcw size={16} />
                                            Reset Grid
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Stream of Events */}
                            <div className="flex-1 flex flex-col gap-8 min-h-0">
                                {/* Trigger Stream */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-slate-500" />
                                            Raw Events (Input)
                                        </h4>
                                        <span className="text-[10px] text-slate-600">Every click spawns a dot</span>
                                    </div>
                                    <div className="h-20 bg-slate-950/50 rounded-xl border border-slate-800 p-4 flex items-center gap-2 overflow-x-auto no-scrollbar relative">
                                        <AnimatePresence>
                                            {events.filter(e => e.type === 'trigger').map((e) => (
                                                <motion.div
                                                    key={e.id}
                                                    initial={{ scale: 0, opacity: 0, x: 50 }}
                                                    animate={{ scale: 1, opacity: 1, x: 0 }}
                                                    exit={{ scale: 0, opacity: 0 }}
                                                    className="w-4 h-4 rounded-full bg-slate-600 shrink-0 shadow-lg shadow-white/5"
                                                />
                                            ))}
                                        </AnimatePresence>
                                        {events.filter(e => e.type === 'trigger').length === 0 && (
                                            <span className="text-slate-700 text-xs italic mx-auto">Click the button above to start...</span>
                                        )}
                                    </div>
                                </div>

                                {/* Execution Stream */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${currentEx.color}`}>
                                            <div className={`w-2 h-2 rounded-full ${currentEx.bg} animate-pulse`} />
                                            Actual Executions (Function Call)
                                        </h4>
                                        <span className="text-[10px] text-slate-600">{currentEx.id === 'debounce' ? 'Only after 1s pause' : 'At most once per 1s'}</span>
                                    </div>
                                    <div className={`h-20 bg-slate-950/50 rounded-xl border-2 ${currentEx.border} border-opacity-30 p-4 flex items-center gap-2 overflow-x-auto no-scrollbar relative`}>
                                        <AnimatePresence>
                                            {events.filter(e => e.type === 'execution').map((e) => (
                                                <motion.div
                                                    key={e.id}
                                                    initial={{ scale: 0, opacity: 0, y: 20 }}
                                                    animate={{ scale: 1.2, opacity: 1, y: 0 }}
                                                    exit={{ scale: 0, opacity: 0 }}
                                                    className={`w-4 h-4 rounded-full ${currentEx.bg} shrink-0 shadow-lg shadow-current/50`}
                                                />
                                            ))}
                                        </AnimatePresence>
                                        {events.filter(e => e.type === 'execution').length === 0 && (
                                            <span className="text-slate-700 text-xs italic mx-auto">Waiting for {currentEx.title} to trigger execution...</span>
                                        )}
                                    </div>
                                </div>

                                {/* Explanation Box */}
                                <div className={`p-4 rounded-xl border-2 ${currentEx.border} border-opacity-20 shadow-xl bg-opacity-5 ${currentEx.bg}`}>
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded-lg ${currentEx.bg} bg-opacity-20`}>
                                            <Lightbulb className={currentEx.color} size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm mb-1">How it works here:</h4>
                                            <p className="text-slate-400 text-xs leading-relaxed">
                                                {currentEx.explanation} <br />
                                                <span className="text-slate-300 font-medium mt-1 inline-block">Pro-tip: {currentEx.interviewPoint}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default DebounceThrottleVisualizer;
