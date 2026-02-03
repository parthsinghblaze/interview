'use client';

import React, { useState } from 'react';
import {
    Clock,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Code,
    BookOpen,
    Lightbulb,
    AlertCircle,
    Layers,
    Activity,
    Zap,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const LifecyclePage = () => {
    const [currentPhase, setCurrentPhase] = useState<'mount' | 'update' | 'unmount'>('mount');
    const [currentStep, setCurrentStep] = useState(0);

    const lifecycleData = {
        mount: {
            title: 'Mounting Phase',
            subtitle: 'Inserting into the DOM',
            steps: [
                {
                    line: 'Constructor / Lazy Init',
                    desc: 'Component is instantiated. State is initialized and default props are merged.',
                    badge: '🛠️ Creation'
                },
                {
                    line: 'Render',
                    desc: 'React calls the component function. It determines what the UI should look like.',
                    badge: '🎨 Rendering'
                },
                {
                    line: 'React Updates DOM',
                    desc: 'React takes the virtual DOM and calculates the minimum changes needed for the real DOM.',
                    badge: '🔗 DOM Sync'
                },
                {
                    line: 'componentDidMount / useEffect',
                    desc: 'Component is now LIVE in the browser. Perfect for API calls or subscriptions.',
                    badge: '🚀 Live'
                }
            ],
            code: `useEffect(() => {
  console.log("Mounted!");
  // Fetch data here
}, []); // Empty deps = Mount only`,
            takeaway: "Mounting is the birth of the component. Use it for data fetching that only needs to happen once."
        },
        update: {
            title: 'Updating Phase',
            subtitle: 'Reacting to Changes',
            steps: [
                {
                    line: 'New Props / setState',
                    desc: 'Something changed! Either the parent passed new props or the component updated its own state.',
                    badge: 'Trigger'
                },
                {
                    line: 'Render (Re-render)',
                    desc: 'React re-runs the function to see what changed in the UI based on the new data.',
                    badge: 'Comparing'
                },
                {
                    line: 'componentDidUpdate / useEffect',
                    desc: 'The DOM has been updated. Use this to react to specific prop changes.',
                    badge: 'Re-synced'
                }
            ],
            code: `useEffect(() => {
  console.log("Updated!");
}, [count]); // Runs when 'count' changes`,
            takeaway: "Updates happen frequently. Always optimize your re-renders and use dependency arrays wisely."
        },
        unmount: {
            title: 'Unmounting Phase',
            subtitle: 'Cleaning Up',
            steps: [
                {
                    line: 'componentWillUnmount / Cleanup',
                    desc: 'The component is about to be destroyed. Clean up timers, listeners, and intervals.',
                    badge: 'Cleaning'
                },
                {
                    line: 'Removed from DOM',
                    desc: 'The component is gone. Memory is freed up by the garbage collector.',
                    badge: 'Destroyed'
                }
            ],
            code: `useEffect(() => {
  return () => {
    console.log("Cleanup/Unmount!");
    // clearTimer(id);
  };
}, []);`,
            takeaway: "Forgetting cleanups leads to memory leaks! Always close subscriptions and clear intervals."
        }
    };

    const activeData = lifecycleData[currentPhase];

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30">
            <Header />

            <div className="pt-20 min-h-[calc(100vh-5rem)] flex flex-col lg:flex-row">

                {/* Theory Sidebar */}
                <div className="w-80 bg-slate-900 border-r border-slate-700 p-6 overflow-y-auto lg:h-[calc(100vh-5rem)]">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <Clock className="text-purple-400" size={40} />
                            <h1 className="text-3xl font-bold">Lifecycle</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            The journey of a component from birth (Mount) to death (Unmount).
                        </p>
                    </div>

                    {/* Interview Answer */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-purple-400" size={22} />
                            <h3 className="text-base font-bold text-purple-400 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "Lifecycle methods are special hooks that allow us to run code at specific points in a component's existence. In modern React, most of these are handled by the useEffect hook."
                        </p>
                    </div>

                    {/* Simple Explanation */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-amber-400" size={22} />
                            <h3 className="text-base font-bold text-amber-400 uppercase">Simple Analogy</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            Think of a component like a stage play: **Mount** is setting up the stage, **Update** is changing scenes, and **Unmount** is taking down the stage when the show is over.
                        </p>
                    </div>

                    {/* Pro Tip Section */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Activity className="text-emerald-400" size={22} />
                            <h3 className="text-base font-bold text-emerald-400 uppercase">Pro Tip</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            Always mention that `useEffect` with an empty array acts like `componentDidMount` AND the cleanup return like `componentWillUnmount`.
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-700">
                        <Link href="/react">
                            <div className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">
                                <ChevronLeft size={16} /> Back to React
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Visualizer Area */}
                <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">

                    {/* Phase Tabs */}
                    <div className="bg-slate-900 border-b border-white/5 p-4 flex gap-4 overflow-x-auto no-scrollbar">
                        {(['mount', 'update', 'unmount'] as const).map((phase) => (
                            <button
                                key={phase}
                                onClick={() => { setCurrentPhase(phase); setCurrentStep(0); }}
                                className={`px-8 py-3 rounded-2xl font-black uppercase text-xs tracking-widest transition-all ${currentPhase === phase
                                    ? 'bg-purple-600 text-white shadow-xl shadow-purple-900/40'
                                    : 'bg-slate-800 text-slate-500 hover:text-slate-300'}`}
                            >
                                {phase}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 overflow-hidden">

                        {/* Code Aspect */}
                        <div className="flex flex-col border-r border-white/5 bg-slate-900/30">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Code className="text-slate-600" size={18} />
                                    <span className="text-xs font-black uppercase text-slate-500 tracking-widest">Implementation</span>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto bg-[#0a0f1d] p-8">
                                <SyntaxHighlighter
                                    language="javascript"
                                    style={atomDark}
                                    customStyle={{ margin: 0, padding: 0, fontSize: '1.2rem', backgroundColor: 'transparent' }}
                                >
                                    {activeData.code}
                                </SyntaxHighlighter>
                            </div>
                            <div className="p-8 bg-purple-600/10 border-t border-white/5">
                                <p className="text-purple-400 font-bold italic">
                                    "{activeData.takeaway}"
                                </p>
                            </div>
                        </div>

                        {/* Step Visualizer */}
                        <div className="p-10 bg-slate-950 overflow-y-auto">
                            <div className="space-y-6">
                                <div className="flex flex-col gap-2 mb-8">
                                    <h2 className="text-3xl font-black tracking-tight">{activeData.title}</h2>
                                    <p className="text-slate-500 uppercase text-xs font-bold tracking-widest">{activeData.subtitle}</p>
                                </div>

                                <div className="space-y-4">
                                    {activeData.steps.map((step, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="p-6 rounded-3xl bg-slate-900 border border-white/5 flex flex-col md:flex-row md:items-center gap-6 group hover:border-purple-500/30 transition-all cursor-default"
                                        >
                                            <div className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest shrink-0 text-center">
                                                {step.badge}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-100 mb-1">{step.line}</h4>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-12 p-8 rounded-[2.5rem] bg-indigo-600 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute -bottom-10 -right-10 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                                        <Zap size={140} />
                                    </div>
                                    <h4 className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-4">Pro Interview Tip</h4>
                                    <p className="text-xl font-bold text-white relative z-10">
                                        Always mention that useEffect with an empty array acts like componentDidMount AND the cleanup return like componentWillUnmount.
                                    </p>
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

export default LifecyclePage;
