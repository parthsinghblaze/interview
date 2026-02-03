'use client';

import React, { useState } from 'react';
import {
    Sparkles,
    Zap,
    Clock,
    Database,
    Shield,
    Activity,
    Code,
    Terminal,
    HelpCircle,
    ArrowRight,
    Play,
    Cpu,
    CheckCircle,
    RotateCcw,
    Layout,
    Layers,
    AlertTriangle,
    Info,
    Smartphone,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Lightbulb,
    Boxes,
    HardDrive,
    Eye,
    History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ReactHooksPage = () => {
    const [activeHook, setActiveHook] = useState('useMemo');
    const [currentStep, setCurrentStep] = useState(0);

    const hooksData: { [key: string]: any } = {
        useMemo: {
            title: 'useMemo',
            subtitle: 'Memoize Expensive Calculations',
            code: `const memoizedValue = useMemo(() => {
  return heavyWeightProcess(a, b);
}, [a, b]);`,
            interviewAnswer: "useMemo is a React Hook that lets you cache the result of a calculation between re-renders. It only recomputes the memoized value when one of the dependencies has changed.",
            simpleExplanation: "Think of it like a calculator with a 'memory' button. If you've already done 5 + 5 once, it gives you 10 from memory instead of doing the math again, until you change the numbers.",
            rememberPoints: [
                "Only for performance optimization",
                "Referential equality for objects/arrays",
                "Doesn't run on every render"
            ],
            steps: [
                {
                    line: 1,
                    description: 'React detects useMemo and checks its internal Hook store.',
                    badge: '🔍 Scanning Cache',
                    visual: 'memory_check',
                    data: { cache: 'Empty', dependencies: { a: 10, b: 20 } }
                },
                {
                    line: 2,
                    description: 'Function executes because cache is empty or dependencies changed.',
                    badge: '⚙️ Processing',
                    visual: 'calculating',
                    data: { result: '300', status: 'Caching...' }
                },
                {
                    line: 3,
                    description: 'Result is saved in React\'s internal memory linked to this component.',
                    badge: '💾 Saved',
                    visual: 'stored',
                    data: { memorySlot: 'Slot_A1', value: '300' }
                }
            ],
            takeaway: "Use useMemo when computing values is expensive or when passing objects/arrays to memoized children."
        },
        useCallback: {
            title: 'useCallback',
            subtitle: 'Stable Function References',
            code: `const handleAction = useCallback(() => {
  doSomething(data);
}, [data]);`,
            interviewAnswer: "useCallback is a hook that returns a memoized version of the callback that only changes if one of the dependencies has changed. It is useful for passing stable functions to optimized child components.",
            simpleExplanation: "Like giving someone a specific instruction sheet. You only write a 'new' sheet if the instructions actually change. Otherwise, they keep the exact same sheet, saving them from getting confused by new copies.",
            rememberPoints: [
                "Memoizes the function instance, not the result",
                "Prevents unnecessary re-renders of React.memo children",
                "Essential for stability in dependency arrays"
            ],
            steps: [
                {
                    line: 1,
                    description: 'useCallback creates a function and stores its reference.',
                    badge: '⚓ Creating Ref',
                    visual: 'ref_create',
                    data: { handleAction: 'Function_Ref_001', dependencies: 'v1' }
                },
                {
                    line: 3,
                    description: 'On re-render, dependencies are compared. If unchanged, the SAME reference is returned.',
                    badge: '🎯 Cache Hit',
                    visual: 'ref_stable',
                    data: { returned: 'Function_Ref_001 (Same)', status: 'Stable' }
                }
            ],
            takeaway: "useCallback is nearly always used in pair with React.memo on child components."
        },
        useReducer: {
            title: 'useReducer',
            subtitle: 'State Logic Decoupling',
            code: `const [state, dispatch] = useReducer(reducer, { count: 0 });

dispatch({ type: 'increment' });`,
            interviewAnswer: "useReducer is an alternative to useState that is preferable when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.",
            simpleExplanation: "Like a bank teller. You don't walk in and change the computer yourself. You hand a 'slip' (action) to the teller (reducer), who then updates the bank's vault (state).",
            rememberPoints: [
                "Better for complex state",
                "Decouples 'how' to update from 'what' triggered it",
                "Easy to test in isolation"
            ],
            steps: [
                {
                    line: 1,
                    description: 'Initial state and reducer are registered in the component.',
                    badge: '⚡ Initialization',
                    visual: 'reducer_ready',
                    data: { state: { count: 0 } }
                },
                {
                    line: 3,
                    description: 'Action is dispatched. It travels to the reducer function.',
                    badge: '📣 Dispatch',
                    visual: 'action_sent',
                    data: { action: 'increment' }
                },
                {
                    line: 1,
                    description: 'Reducer calculates new state based on current state and action.',
                    badge: '⚙️ Reducing',
                    visual: 'state_transformed',
                    data: { old: 0, new: 1 }
                }
            ],
            takeaway: "If your useState becomes a mess of multiple handlers, move to useReducer."
        },
        useRef: {
            title: 'useRef',
            subtitle: 'Direct DOM & Mutable Storage',
            code: `const myRef = useRef(initial);

// myRef.current = newValue;`,
            interviewAnswer: "useRef returns a mutable ref object whose .current property is initialized to the passed argument. The returned object will persist for the full lifetime of the component and changing it does not trigger a re-render.",
            simpleExplanation: "Think of it like a hidden drawer in your desk. You can put things in it and change them anytime, but nobody else in the room (the UI) notices until you choose to show them.",
            rememberPoints: [
                "Changing it NEVER triggers a re-render",
                "Accessing DOM elements directly",
                "Persisting values between renders"
            ],
            steps: [
                {
                    line: 1,
                    description: 'React creates a persistent object { current: initial }.',
                    badge: '📦 Allocation',
                    visual: 'ref_init',
                    data: { current: 'initial' }
                },
                {
                    line: 3,
                    description: 'Mutation occurs. ref.current changes, but component state remains still.',
                    badge: '🖊️ Mutating',
                    visual: 'ref_mutate',
                    data: { current: 'new_value', reRender: 'No' }
                }
            ],
            takeaway: "Use useRef for DOM access or keeping values that shouldn't affect the UI cycle."
        },
        useTransition: {
            title: 'useTransition',
            subtitle: 'Non-blocking State Updates',
            code: `const [isPending, startTransition] = useTransition();

startTransition(() => {
  setItems(hugeList); // Non-urgent
});`,
            interviewAnswer: "useTransition is a React Hook that lets you update the state without blocking the UI. It marks a state transition as non-urgent, allowing regular updates to interrupt it.",
            simpleExplanation: "Like a restaurant taking your order. They acknowledge you immediately, but the heavy food (blocking update) happens in the background while you can still talk and drink water.",
            rememberPoints: [
                "Keep UI responsive during heavy renders",
                "Adds user feedback via isPending",
                "Only for state updates that slow down the UI"
            ],
            steps: [
                {
                    line: 1,
                    description: 'Hooks provides a pending flag and a transition scheduler.',
                    badge: '💤 Idle',
                    visual: 'wait',
                    data: { isPending: false }
                },
                {
                    line: 3,
                    description: 'Low-priority update is scheduled. isPending becomes true.',
                    badge: '⏳ Pending',
                    visual: 'loading',
                    data: { isPending: true }
                },
                {
                    line: 5,
                    description: 'React renders in background. User can still interact with other elements.',
                    badge: '🏗️ Background',
                    visual: 'rendering',
                    data: { isPending: true, priority: 'Low' }
                }
            ],
            takeaway: "useTransition is the key to preventing 'jank' in modern high-performance React apps."
        }
    };

    const currentHook = hooksData[activeHook];
    const currentStepData = currentHook.steps[currentStep];

    const handleNext = () => {
        if (currentStep < currentHook.steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleReset = () => {
        setCurrentStep(0);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500/30">
            <Header />

            <div className="pt-20 min-h-[calc(100vh-5rem)] flex flex-col lg:flex-row">

                {/* Sidebar - Definitions & Theory */}
                <div className="w-full lg:w-[400px] bg-slate-900 border-r border-white/5 flex flex-col overflow-y-auto lg:h-[calc(100vh-5rem)]">
                    <div className="p-8 space-y-8">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <Boxes className="text-cyan-400" size={32} />
                                <h1 className="text-3xl font-black tracking-tight">Hook Lab</h1>
                            </div>
                            <p className="text-slate-500 font-medium">Step inside the internal engine of React Hooks.</p>
                        </div>

                        {/* Interview Answer */}
                        <div className="p-6 rounded-3xl bg-slate-800/40 border border-white/5 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="text-cyan-400" size={18} />
                                <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest">Interview Answer</h3>
                            </div>
                            <p className="text-slate-100 text-sm leading-relaxed font-semibold italic">
                                "{currentHook.interviewAnswer}"
                            </p>
                        </div>

                        {/* Simple Explanation */}
                        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="text-amber-400" size={18} />
                                <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest">Simple Explanation</h3>
                            </div>
                            <p className="text-amber-100/80 text-sm leading-relaxed font-bold">
                                {currentHook.simpleExplanation}
                            </p>
                        </div>

                        {/* Remember Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Activity className="text-emerald-400" size={18} />
                                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">Remember</h3>
                            </div>
                            <div className="grid gap-3">
                                {currentHook.rememberPoints.map((point: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 font-bold">
                                        <CheckCircle className="text-emerald-500 shrink-0" size={14} />
                                        {point}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Rules of Hooks */}
                        <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20">
                            <h3 className="text-xs font-black text-red-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <AlertTriangle size={16} /> Strict Rules
                            </h3>
                            <ul className="space-y-3 text-[11px] text-slate-500 font-bold uppercase tracking-wide">
                                <li>• Only at the Top Level</li>
                                <li>• Only in React Functions</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-auto p-8 border-t border-white/5">
                        <Link href="/react">
                            <div className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-[0.2em]">
                                <ChevronLeft size={16} /> Back to Dashboard
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Main Visualizer Area */}
                <div className="flex-1 bg-slate-950 flex flex-col overflow-hidden">

                    {/* Top Hook Navigator */}
                    <div className="bg-slate-900/50 border-b border-white/5 p-4 flex gap-2 overflow-x-auto no-scrollbar">
                        {Object.keys(hooksData).map((key) => (
                            <button
                                key={key}
                                onClick={() => { setActiveHook(key); setCurrentStep(0); }}
                                className={`px-6 py-2.5 rounded-2xl font-black text-xs font-mono transition-all border ${activeHook === key ? 'bg-cyan-600 border-cyan-400 text-white shadow-xl shadow-cyan-900/40 translate-y-[-2px]' : 'bg-slate-800 border-white/5 text-slate-500 hover:text-slate-300'}`}
                            >
                                {key}()
                            </button>
                        ))}
                    </div>

                    {/* Stage Wrapper */}
                    <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 overflow-hidden">

                        {/* Left Stage: Code & Control */}
                        <div className="xl:col-span-5 flex flex-col border-r border-white/5 bg-slate-900/30">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Code className="text-slate-600" size={18} />
                                    <span className="text-xs font-black uppercase text-slate-500 tracking-widest">Example Syntax</span>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                    {currentHook.subtitle}
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto bg-[#0a0f1d] p-6 shadow-inner">
                                <SyntaxHighlighter
                                    language="javascript"
                                    style={atomDark}
                                    customStyle={{ margin: 0, padding: 0, fontSize: '1.2rem', backgroundColor: 'transparent' }}
                                >
                                    {currentHook.code}
                                </SyntaxHighlighter>
                            </div>

                            {/* Controls */}
                            <div className="p-8 bg-slate-900 border-t border-white/5 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <button onClick={handleReset} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all shadow-lg"><RotateCcw size={20} /></button>
                                    <button onClick={handlePrevious} disabled={currentStep === 0} className="p-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-20 rounded-2xl transition-all shadow-lg"><ChevronLeft size={20} /></button>
                                    <button onClick={handleNext} disabled={currentStep === currentHook.steps.length - 1} className="p-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-20 rounded-2xl transition-all shadow-xl shadow-cyan-900/20"><ChevronRight size={20} /></button>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Step Progression</div>
                                    <div className="text-lg font-black text-cyan-500">{currentStep + 1} / {currentHook.steps.length}</div>
                                </div>
                            </div>
                        </div>

                        {/* Right Stage: Visual Engine */}
                        <div className="xl:col-span-7 flex flex-col bg-slate-950 p-10 overflow-auto">
                            <div className="max-w-3xl mx-auto w-full space-y-10">

                                {/* Current Phase Narrative */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="px-6 py-2 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-black uppercase tracking-widest shadow-lg shadow-cyan-900/10">
                                                {currentStepData.badge}
                                            </div>
                                            <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
                                        </div>

                                        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 shadow-3xl">
                                            <p className="text-2xl font-bold text-slate-100 leading-relaxed tracking-tight">
                                                {currentStepData.description}
                                            </p>
                                        </div>

                                        {/* THE VISUAL CORE */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                            {/* Data Engine View */}
                                            <div className="p-8 rounded-[2rem] bg-slate-900/50 border border-white/10 relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                                    <HardDrive size={64} className="text-emerald-400" />
                                                </div>
                                                <h4 className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6 border-b border-emerald-500/20 pb-4">
                                                    <HardDrive size={14} /> Hook Memory Stack
                                                </h4>
                                                <div className="space-y-4">
                                                    {Object.entries(currentStepData.data).map(([key, val]: [string, any]) => (
                                                        <div key={key} className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-950 border border-white/5">
                                                            <span className="text-slate-500 font-black uppercase tracking-tighter">{key}</span>
                                                            <span className="text-slate-100 font-mono font-bold">{String(val)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Interaction View */}
                                            <div className="p-8 rounded-[2rem] bg-indigo-600 shadow-2xl relative flex flex-col justify-center items-center text-center">
                                                <div className="absolute bottom-0 right-0 p-6 opacity-20">
                                                    <Eye size={120} />
                                                </div>
                                                <h4 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4">Final Observation</h4>
                                                <div className="text-5xl font-black tracking-tighter text-white drop-shadow-2xl">
                                                    {currentStepData.visual === 'calculating' ? '300' :
                                                        currentStepData.visual === 'Stored' ? 'Slot_A' :
                                                            activeHook === 'useRef' ? 'Mutated' :
                                                                currentStepData.badge.split(' ')[1] || 'Ready'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Strategy Insight */}
                                        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-cyan-600/10 to-blue-600/10 border border-cyan-500/20 flex gap-6 items-start">
                                            <div className="p-3 bg-cyan-500 text-white rounded-2xl shadow-xl">
                                                <Terminal size={24} />
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-black text-cyan-500 uppercase tracking-widest">Engineering Takeaway</h4>
                                                <p className="text-slate-400 font-bold leading-relaxed pr-6">
                                                    {currentHook.takeaway}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ReactHooksPage;
