'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Terminal,
    Cpu,
    Zap,
    Clock,
    Activity,
    Server,
    Database,
    ChevronRight,
    Search,
    BookOpen,
    Lightbulb,
    ArrowRight,
    CircleDot,
    Timer,
    History,
    Shield,
    Layers,
    FileCode,
    MessageSquare,
    Workflow,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NodeJSVisualizer = () => {
    const [selectedQuestion, setSelectedQuestion] = useState(0);
    const [activeStep, setActiveStep] = useState(0);

    const questions = [
        {
            id: 'event-loop',
            category: 'Core Concepts',
            title: "What is the Event Loop in Node.js?",
            explanation: "The Event Loop is the mechanism that allows Node.js to perform non-blocking operations despite JavaScript being single-threaded. It delegates operations to the system kernel and picks up the callbacks in phases.",
            analogy: "Think of the Event Loop as a waiter in a restaurant. They take an order (async op), give it to the kitchen (kernel), and move to the next table, only coming back to deliver the food (callback) when it's ready.",
            phases: [
                { name: 'Timers', icon: Timer, color: 'text-blue-400', bg: 'bg-blue-500/10', description: 'executes setTimeout/setInterval callbacks' },
                { name: 'I/O Callbacks', icon: Activity, color: 'text-green-400', bg: 'bg-green-500/10', description: 'executes deferred I/O callbacks' },
                { name: 'Poll', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10', description: 'retrieves new I/O events' },
                { name: 'Check', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10', description: 'executes setImmediate callbacks' },
                { name: 'Close', icon: CircleDot, color: 'text-red-400', bg: 'bg-red-500/10', description: 'executes close event callbacks' }
            ],
            visualizationType: 'loop'
        },
        {
            id: 'nexttick-setimmediate',
            category: 'Core Concepts',
            title: "process.nextTick() vs setImmediate()",
            explanation: "process.nextTick() executes callbacks immediately after the current operation completes, before the Event Loop continues. setImmediate() executes callbacks in the next iteration of the Event Loop (Check phase).",
            analogy: "nextTick is like cutting the line to be first after the current person. setImmediate is like getting a ticket for the next available slot in the next round.",
            comparison: [
                { name: 'process.nextTick()', timing: 'Immediately after current operation', priority: 'High', color: 'blue' },
                { name: 'setImmediate()', timing: 'Next iteration (Check phase)', priority: 'Standard', color: 'purple' }
            ],
            visualizationType: 'timeline'
        },
        {
            id: 'streams',
            category: 'Core Concepts',
            title: "Explain Streams in Node.js",
            explanation: "Streams are objects that let you read or write data in chunks rather than all at once. Memory efficient for large files, can start processing before all data arrives.",
            analogy: "Watching a video on YouTube (stream) vs downloading the whole file before watching.",
            types: [
                { name: 'Readable', desc: 'Source of data (e.g. fs.createReadStream)', color: 'text-blue-400' },
                { name: 'Writable', desc: 'Destination for data (e.g. fs.createWriteStream)', color: 'text-green-400' },
                { name: 'Duplex', desc: 'Both Readable & Writable (e.g. Sockets)', color: 'text-purple-400' },
                { name: 'Transform', desc: 'Modifies data as it passes through (e.g. Gzip)', color: 'text-yellow-400' }
            ],
            visualizationType: 'streams'
        },
        {
            id: 'middleware',
            category: 'Express.js',
            title: "What is Middleware in Express?",
            explanation: "Functions that have access to request, response, and next objects. They execute in sequence.",
            analogy: "Security check at an airport: each gate (middleware) checks your passport/bags before you reach the plane (route).",
            visualizationType: 'placeholder'
        },
        {
            id: 'callback-hell',
            category: 'Async',
            title: "How to avoid Callback Hell?",
            explanation: "Callback hell occurs with nested callbacks. Avoid it using Promises, async/await, or modularization.",
            analogy: "A pyramid of doom where code moves right instead of down.",
            visualizationType: 'placeholder'
        }
    ];

    const currentQ = questions[selectedQuestion];

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-green-500/30">
            <Header />

            <div className="pt-20 flex flex-col lg:flex-row h-[calc(100vh-5rem)] divide-x divide-slate-800">

                {/* Left Sidebar: Questions (20% width) */}
                <aside className="w-full lg:w-[20%] bg-slate-900 overflow-y-auto no-scrollbar flex flex-col">
                    <div className="p-6 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <Server className="text-green-400" size={20} />
                            </div>
                            <h2 className="text-lg font-bold tracking-tight">Questions</h2>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex-1 p-3 space-y-1">
                        {questions.map((q, idx) => (
                            <button
                                key={q.id}
                                onClick={() => {
                                    setSelectedQuestion(idx);
                                    setActiveStep(0);
                                }}
                                className={`w-full text-left p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${selectedQuestion === idx
                                    ? 'bg-green-500/10 border border-green-500/20'
                                    : 'hover:bg-slate-800/50 border border-transparent'
                                    }`}
                            >
                                <div className="flex flex-col gap-1.5">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedQuestion === idx ? 'text-green-400' : 'text-slate-600'
                                        }`}>
                                        {q.category}
                                    </span>
                                    <h3 className={`text-sm font-bold leading-snug transition-colors ${selectedQuestion === idx ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                                        }`}>
                                        {q.title}
                                    </h3>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="p-4 mt-auto">
                        <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/50 text-[10px] text-slate-500 italic">
                            Mastering these core concepts is essential for Node.js developers.
                        </div>
                    </div>
                </aside>

                {/* Right Content Area (80% width) */}
                <main className="flex-1 bg-slate-950 overflow-y-auto no-scrollbar flex flex-col">
                    {/* Top Row: Definition */}
                    <div className="p-10 lg:p-14 border-b border-slate-800 relative overflow-hidden flex-none">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 blur-[100px] rounded-full pointer-events-none" />

                        <motion.div
                            key={currentQ.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-5xl relative z-10"
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                                <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em]">Module Breakdown</span>
                            </div>

                            <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter leading-tight mb-8">
                                {currentQ.title}
                            </h1>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                                <div className="lg:col-span-8 space-y-6">
                                    <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl backdrop-blur-sm relative group">
                                        <div className="absolute -top-3 -right-3 p-3 bg-green-600/20 rounded-2xl border border-green-500/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <BookOpen className="text-green-400" size={20} />
                                        </div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-1 bg-green-500 rounded-full" />
                                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Concept Definition</span>
                                        </div>
                                        <p className="text-xl lg:text-2xl text-slate-200 leading-relaxed font-semibold">
                                            {currentQ.explanation}
                                        </p>
                                    </div>
                                </div>

                                <div className="lg:col-span-4 space-y-6">
                                    <div className="p-6 bg-green-500/5 rounded-3xl border border-green-500/20 shadow-xl overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <Lightbulb size={64} className="text-green-400" />
                                        </div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <Zap className="text-yellow-400" size={18} />
                                            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">The Analogy</span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed italic font-medium">
                                            "{currentQ.analogy}"
                                        </p>
                                    </div>
                                    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-3xl">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Activity className="text-green-400" size={14} />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Technical Tags</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {['Non-blocking', 'Asynchronous', 'Libuv', 'Single-threaded'].map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-slate-800 rounded-md text-[9px] font-bold text-slate-400 border border-slate-700/50">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Row: Visualization */}
                    <div className="flex-1 p-10 lg:p-14 flex flex-col bg-slate-950/30 relative">
                        <div className="flex items-center justify-between mb-10 z-10">
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                    <Workflow className="text-green-400" size={28} />
                                    Visual Execution Engine
                                </h3>
                                <p className="text-slate-500 text-xs mt-1 uppercase tracking-[0.2em] font-black">Live Logic Simulation v1.0</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl transition-all active:scale-95 border border-slate-700 shadow-xl">
                                    <History size={20} />
                                </button>
                                <button className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-green-500/30 flex items-center gap-3 active:scale-95 text-sm">
                                    START SIMULATION
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800/50 p-12 flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentQ.id}
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="w-full max-w-4xl relative z-10"
                                >
                                    {currentQ.visualizationType === 'loop' && <EventLoopVisual phases={currentQ.phases} />}
                                    {currentQ.visualizationType === 'timeline' && <TimelineVisual comparison={currentQ.comparison} />}
                                    {currentQ.visualizationType === 'streams' && <StreamsVisual types={currentQ.types} />}
                                    {currentQ.visualizationType === 'placeholder' && (
                                        <div className="flex flex-col items-center gap-6 p-20 bg-slate-900/50 rounded-[3rem] border border-slate-800 border-dashed">
                                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center animate-pulse">
                                                <Activity className="text-slate-600" size={40} />
                                            </div>
                                            <div className="text-center space-y-2">
                                                <h4 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Visualization Coming Soon</h4>
                                                <p className="text-slate-600 text-sm max-w-xs">Our engineers are building a custom interactive model for this concept.</p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950/50 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-white/5 shadow-2xl">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Engine State: Operational</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

const EventLoopVisual = ({ phases }: any) => {
    const [activePhase, setActivePhase] = useState(0);

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-full h-[380px] flex items-center justify-center">
                <div className="absolute w-36 h-36 bg-green-500/5 rounded-full border-2 border-green-500/30 flex items-center justify-center z-0 animate-pulse" />
                <div className="absolute w-28 h-28 bg-green-600/10 rounded-full border-4 border-green-500 flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.3)] z-50">
                    <div className="flex flex-col items-center">
                        <Terminal className="text-green-500 mb-1" size={24} />
                        <span className="text-sm font-black text-white italic tracking-tighter uppercase">libuv</span>
                    </div>
                </div>

                {phases.map((phase: any, idx: number) => {
                    const angle = (idx * (360 / phases.length) - 90) * (Math.PI / 180);
                    const x = Math.cos(angle) * 170;
                    const y = Math.sin(angle) * 170;

                    return (
                        <motion.div
                            key={phase.name}
                            initial={{ x: 0, y: 0, opacity: 0 }}
                            animate={{ x, y, opacity: 1 }}
                            whileHover={{ scale: 1.05 }}
                            className={`absolute w-44 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${activePhase === idx
                                ? 'border-green-500 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.2)] scale-110 z-20'
                                : 'border-slate-800 bg-slate-900/80 opacity-60'
                                }`}
                            onClick={() => setActivePhase(idx)}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-1.5 rounded-lg ${phase.bg}`}>
                                    <phase.icon className={phase.color} size={16} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-white">{phase.name}</span>
                            </div>
                            <p className="text-[9px] text-slate-500 leading-tight font-medium">
                                {phase.description}
                            </p>
                        </motion.div>
                    );
                })}

                <svg className="absolute w-full h-full -z-10 opacity-10" viewBox="0 0 500 500">
                    <circle cx="250" cy="250" r="170" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="10 10" />
                </svg>

                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[340px] h-[340px] rounded-full pointer-events-none"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-green-400 rounded-full shadow-[0_0_20px_#22c55e] border-4 border-slate-950" />
                </motion.div>
            </div>
        </div>
    );
};

const TimelineVisual = ({ comparison }: any) => {
    return (
        <div className="flex flex-col items-center gap-12 w-full p-6">
            <div className="w-full space-y-6">
                <div className="p-8 bg-slate-900 border-2 border-blue-500/30 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                    <div className="absolute -top-3 left-10 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl">
                        Main Execution Thread
                    </div>
                    <div className="flex items-center justify-between relative z-10">
                        <div className="space-y-3">
                            <h4 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                <Cpu className="text-blue-400" size={28} />
                                User Code (Synchronous)
                            </h4>
                            <p className="text-sm text-slate-400 max-w-lg font-medium">The CPU executes your JavaScript line-by-line. High-priority microtasks follow immediately after.</p>
                        </div>
                        <div className="hidden lg:flex gap-2">
                            {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-12 bg-blue-500/20 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center h-12">
                    <div className="w-0.5 h-full bg-gradient-to-b from-blue-500 to-green-500 relative">
                        <motion.div
                            animate={{ y: [0, 48, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -left-1 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_10px_white]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {comparison.map((item: any, idx: number) => (
                        <motion.div
                            key={item.name}
                            initial={{ x: idx === 0 ? -20 : 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className={`p-8 rounded-[2.5rem] border-2 relative overflow-hidden group ${idx === 0 ? 'bg-green-600/5 border-green-500/30' : 'bg-purple-600/5 border-purple-500/30'
                                }`}
                        >
                            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform`}>
                                {idx === 0 ? <Zap size={80} /> : <Clock size={80} />}
                            </div>

                            <div className="flex flex-col gap-6 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-xl ${idx === 0 ? 'bg-green-600 shadow-green-600/20' : 'bg-purple-600 shadow-purple-600/20'
                                        }`}>
                                        Priority: {item.priority}
                                    </div>
                                    <CheckCircle2 className={idx === 0 ? 'text-green-500' : 'text-purple-500'} size={20} />
                                </div>
                                <h4 className="text-2xl lg:text-3xl font-black text-white">{item.name}</h4>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Runtime Window</span>
                                    <p className="text-sm lg:text-base text-slate-200 font-bold leading-relaxed">{item.timing}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-full bg-slate-800/50 skew-x-12 translate-x-10 pointer-events-none" />
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-2 bg-green-500/10 rounded-xl">
                        <Activity className="text-green-400" size={20} />
                    </div>
                    <h5 className="text-sm font-black text-white uppercase tracking-[0.2em]">Execution Stack Order</h5>
                </div>
                <div className="flex flex-wrap items-center gap-4 overflow-x-auto no-scrollbar py-2">
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-500/10 rounded-xl border border-blue-500/30">
                        <span className="text-xs font-bold text-white uppercase italic tracking-tighter">Main()</span>
                    </div>
                    <ArrowRight className="text-slate-700 shrink-0" size={16} />
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-green-500/20 rounded-xl border border-green-500/40 transform hover:-translate-y-1 transition-transform">
                        <Zap className="text-green-400 shrink-0" size={14} />
                        <span className="text-xs font-black text-green-400 uppercase">nextTick</span>
                    </div>
                    <ArrowRight className="text-slate-700 shrink-0" size={16} />
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-800 rounded-xl border border-slate-700">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Promises</span>
                    </div>
                    <ArrowRight className="text-slate-700 shrink-0" size={16} />
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-purple-500/20 rounded-xl border border-purple-500/40 transform hover:-translate-y-1 transition-transform">
                        <Clock className="text-purple-400 shrink-0" size={14} />
                        <span className="text-xs font-black text-purple-400 uppercase">setImmediate</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StreamsVisual = ({ types }: any) => {
    const [isStreaming, setIsStreaming] = useState(false);
    const chunks = Array.from({ length: 8 }, (_, i) => i);

    return (
        <div className="flex flex-col items-center gap-12 w-full p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                {/* Traditional Buffering (The Wrong Way for Big Data) */}
                <div className="p-8 bg-red-500/5 border-2 border-red-500/20 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute -top-3 left-10 px-4 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl">
                        Traditional Buffering
                    </div>
                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-red-400 uppercase tracking-widest">Memory Usage</span>
                            <AlertTriangle className="text-red-500" size={20} />
                        </div>
                        <div className="h-24 w-full bg-slate-900 rounded-2xl border border-red-500/20 flex items-center justify-center relative overflow-hidden">
                            {!isStreaming ? (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: '80%' }}
                                    className="absolute bottom-0 inset-x-0 bg-red-500/20 flex items-center justify-center"
                                >
                                    <span className="text-[10px] font-black text-red-500 uppercase">Loading entire 1GB file...</span>
                                </motion.div>
                            ) : (
                                <div className="text-[10px] font-black text-slate-600 uppercase">Waiting...</div>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Loads the <span className="text-red-400 font-bold">entire content</span> into RAM before processing. Crashes with large files.
                        </p>
                    </div>
                </div>

                {/* Node.js Streaming (The Efficient Way) */}
                <div className="p-8 bg-green-500/5 border-2 border-green-500/20 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute -top-3 left-10 px-4 py-1.5 bg-green-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-2xl">
                        Node.js Streaming
                    </div>
                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-green-400 uppercase tracking-widest">Constant RAM</span>
                            <Zap className="text-green-500" size={20} />
                        </div>
                        <div className="h-24 w-full bg-slate-900 rounded-2xl border border-green-500/20 flex items-center justify-center gap-2 px-4 overflow-hidden relative">
                            {isStreaming ? (
                                <div className="flex gap-1">
                                    {chunks.map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                x: [100, -300],
                                                opacity: [0, 1, 1, 0]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: i * 0.25,
                                                ease: "linear"
                                            }}
                                            className="w-8 h-8 bg-green-500/20 border border-green-500/40 rounded-lg flex items-center justify-center shrink-0"
                                        >
                                            <div className="w-4 h-1 bg-green-500/40 rounded-full" />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-[10px] font-black text-slate-600 uppercase">Ready to Stream</div>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            Processes data <span className="text-green-400 font-bold">chunk-by-chunk</span>. Uses minimal memory regardless of file size.
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col gap-6">
                <button
                    onClick={() => setIsStreaming(!isStreaming)}
                    className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest transition-all ${isStreaming ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-green-600 text-white shadow-lg shadow-green-500/20'
                        }`}
                >
                    {isStreaming ? 'STOP STREAMING' : 'DEMONSTRATE STREAM PIPELINE'}
                </button>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {types.map((type: any) => (
                        <div key={type.name} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl group hover:border-slate-700 transition-colors">
                            <div className={`text-[10px] font-black uppercase mb-1 ${type.color}`}>{type.name}</div>
                            <div className="text-[9px] text-slate-500 leading-tight font-medium uppercase tracking-tighter">{type.desc}</div>
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-slate-900 border border-slate-800 rounded-[2rem] w-full flex flex-col items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 p-4 opacity-5">
                        <Activity size={100} className="text-green-500" />
                    </div>
                    <div className="flex items-center gap-3 w-full">
                        <Layers size={18} className="text-slate-500" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pipeline Visualization (source.pipe(dest))</span>
                    </div>

                    <div className="flex items-center gap-4 w-full justify-center">
                        <div className="w-20 h-20 bg-blue-500/10 border-2 border-blue-500/30 rounded-2xl flex flex-col items-center justify-center">
                            <FileCode className="text-blue-400" size={24} />
                            <span className="text-[8px] font-black text-blue-500 mt-1">FILE</span>
                        </div>

                        <div className="flex-1 h-3 bg-slate-800 rounded-full relative overflow-hidden border border-white/5">
                            {isStreaming && (
                                <motion.div
                                    animate={{ x: [-20, 400] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-green-500/40 to-transparent"
                                />
                            )}
                        </div>

                        <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500/30 rounded-2xl flex flex-col items-center justify-center">
                            <Server className="text-green-400" size={24} />
                            <span className="text-[8px] font-black text-green-500 mt-1">HTTP</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NodeJSVisualizer;
