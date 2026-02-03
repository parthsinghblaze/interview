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
    AlertCircle,
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
            code: `// Prevents re-filtering 10,000 items on every small UI tweak
const filteredData = useMemo(() => {
  console.log("🔥 Filtering Heavy Dataset...");
  return largeDataset.filter(item => 
    item.tags.includes(activeFilter)
  );
}, [largeDataset, activeFilter]);`,
            interviewAnswer: "useMemo is a performance optimization hook that returns a memoized value. It only recalculates the value when one of its dependencies changes, preventing expensive computations (like heavy filtering or data transformation) from running on every render.",
            simpleExplanation: "Think of it like a smart 'Cache'. If you've already calculated the results for 'Filter: Electronics', it will just grab the old result from the shelf until you change the filter to 'Fashion'.",
            rememberPoints: [
                "Only for performance optimization",
                "Referential equality for objects/arrays to prevent child re-renders",
                "Don't wrap everything in useMemo; only use for heavy logic"
            ],
            steps: [
                {
                    line: 2,
                    description: 'React detects the useMemo slot for this component.',
                    badge: '🔍 Checking Memory',
                    visual: 'memory_check',
                    data: { slot: 'Hook_Slot_0', deps_snapshot: '[data, "elec"]' }
                },
                {
                    line: 3,
                    description: 'Dependencies compared. Snapshot changed? Triggering calculation.',
                    badge: '⚙️ Processing',
                    visual: 'calculating',
                    data: { computeTime: '45ms', itemsCount: '10,000' }
                },
                {
                    line: 6,
                    description: 'Result is cached. On next render, if [data, filter] match, this block is skipped.',
                    badge: '💾 Cached',
                    visual: 'stored',
                    data: { value: 'Array(84)', status: 'Saved' }
                }
            ],
            takeaway: "Use useMemo when a calculation is noticeably slow or when passing new object/array instances to memoized children."
        },
        useCallback: {
            title: 'useCallback',
            subtitle: 'Stable Function References',
            code: `// Keeps the function identity stable across renders
const handleToggle = useCallback((id) => {
  setItems(prev => prev.map(item => 
    item.id === id ? { ...item, done: !item.done } : item
  ));
}, [setItems]); // stable dependency

// Child only re-renders if handleToggle identity changes
<OptimizedListItem onToggle={handleToggle} />`,
            interviewAnswer: "useCallback returns a memoized version of the callback function that only changes if one of the dependencies has changed. It's essentially useMemo for function instances. Its primary purpose is to maintain referential identity to prevent unnecessary re-renders of child components wrapped in React.memo.",
            simpleExplanation: "Like giving your child an ID card. Even if you change your clothes (parent re-renders), the child recognizes the ID card is the same and doesn't get confused (re-render).",
            rememberPoints: [
                "Memoizes the function instance, not the logic result",
                "Useless unless the child component uses React.memo",
                "Prevents 'Effect infinite loops' when functions are in dependency arrays"
            ],
            steps: [
                {
                    line: 2,
                    description: 'React stores the function reference (memory address) in its hook store.',
                    badge: '⚓ Pinning Ref',
                    visual: 'ref_create',
                    data: { fn_addr: '0x12a4f', deps: 'none' }
                },
                {
                    line: 9,
                    description: 'Parent re-renders. React compares dependencies; finds them identical.',
                    badge: '🎯 Identity Match',
                    visual: 'ref_stable',
                    data: { returned_ref: '0x12a4f (Original)', status: 'Stable' }
                },
                {
                    line: 9,
                    description: 'Child sees identical reference. Skips its own re-rendering process.',
                    badge: '🚀 Performance Gain',
                    visual: 'skipping',
                    data: { component: 'OptimizedListItem', action: 'Memo_Skip' }
                }
            ],
            takeaway: "useCallback is almost always paired with React.memo on the child being passed the function."
        },
        useReducer: {
            title: 'useReducer',
            subtitle: 'Complex State Management',
            code: `// Consolidates logic into a central reducer function
const [state, dispatch] = useReducer((state, action) => {
  switch (action.type) {
    case 'add': return { ...state, cart: [...state.cart, action.item] };
    case 'clear': return { ...state, cart: [] };
    default: return state;
  }
}, { cart: [], total: 0 });

dispatch({ type: 'add', item: { name: 'React Book' } });`,
            interviewAnswer: "useReducer is a hook for managing complex state logic. It follows the Redux pattern: you dispatch an 'action' to a 'reducer' function which calculates the new state. This decouples the 'how' state changes from the component's event handlers.",
            simpleExplanation: "Like a restaurant ordering system. You (the user) give a ticket (action) to the counter. The kitchen (reducer) decides how to update the inventory (state) based on that ticket.",
            rememberPoints: [
                "Perfect for state objects with multiple related sub-values",
                "Keeps logic outside the component for better testing",
                "Standardizes state transitions via action types"
            ],
            steps: [
                {
                    line: 2,
                    description: 'The Reducer function is registered as the "brain" for this state.',
                    badge: '⚡ Mapping Brain',
                    visual: 'reducer_ready',
                    data: { current: 'Initial State' }
                },
                {
                    line: 9,
                    description: 'Dispatch launches an action object into the React pipeline.',
                    badge: '📣 Dispatching',
                    visual: 'action_sent',
                    data: { type: 'add', payload: '...' }
                },
                {
                    line: 3,
                    description: 'Reducer receives state+action, calculates the new immutable state object.',
                    badge: '⚙️ Transforming',
                    visual: 'state_transformed',
                    data: { old_len: 0, new_len: 1 }
                }
            ],
            takeaway: "If you have 3+ useStates that always change together, useReducer is your best friend."
        },
        useRef: {
            title: 'useRef',
            subtitle: 'Mutable Box & DOM Reference',
            code: `// 1. Accessing DOM elements directly
const videoRef = useRef(null);
const handlePlay = () => videoRef.current.play();

// 2. Mutable instance variables (doesn't trigger render)
const timerId = useRef(0);
useEffect(() => {
  timerId.current = setInterval(() => { ... }, 1000);
  return () => clearInterval(timerId.current);
}, []);`,
            interviewAnswer: "useRef returns a persistent, mutable object whose .current property can hold any value. Unlike state, changing a ref's value does not trigger a re-render. It is primarily used for direct DOM access or storing values that need to persist but don't impact the UI.",
            simpleExplanation: "A 'secret pocket'. You can put things in it and change them whenever you want, but React won't rebuild the entire UI just because you changed what's in your pocket.",
            rememberPoints: [
                "Modifying .current is a Side Effect (do it in useEffect)",
                "Persistent across all re-renders of the component",
                "Useful for 'Previous Value' tracking"
            ],
            steps: [
                {
                    line: 2,
                    description: 'React creates an object { current: null }. This object stays alive as long as the component does.',
                    badge: '📦 Box Created',
                    visual: 'ref_init',
                    data: { addr: 'Ref_Object_ID', value: 'null' }
                },
                {
                    line: 3,
                    description: 'On Mount, React assigns the real HTML element to the .current property.',
                    badge: '🔗 DOM Linked',
                    visual: 'ref_mutate',
                    data: { current: '<video />', element: 'Attached' }
                },
                {
                    line: 10,
                    description: 'Updating .current. The value changes instantly, but the UI component is not notified to refresh.',
                    badge: '🖊️ Silent Update',
                    visual: 'ref_update',
                    data: { timerId: '124', reRender: 'Skipped' }
                }
            ],
            takeaway: "Use useRef for DOM access or values that don't need to be displayed on screen."
        },
        useTransition: {
            title: 'useTransition',
            subtitle: 'Interruptible Render Updates',
            code: `const [isPending, startTransition] = useTransition();

const handleSearch = (e) => {
  // Urgent: Update the input text immediately
  setText(e.target.value);

  // Non-urgent: Filter the massive list in the background
  startTransition(() => {
    setFilteredList(hugeDataset.filter(...));
  });
};`,
            interviewAnswer: "useTransition is a Concurrent React hook that lets you mark state updates as 'transitions'. This tells React they are non-urgent and can be interrupted by higher-priority updates (like typing). It prevents 'input lag' during heavy re-renders.",
            simpleExplanation: "Like a waiter taking your drink order (urgent) versus the kitchen cooking a 7-course meal (transition). You get your water immediately while the heavy work happens in the background.",
            rememberPoints: [
                "Keeps the UI responsive during massive data processing",
                "Provides an 'isPending' flag to show loading spinners",
                "Only use for CPU-heavy rendering, not network requests"
            ],
            steps: [
                {
                    line: 1,
                    description: 'React prepares a secondary background rendering pipeline.',
                    badge: '💤 Scheduler Ready',
                    visual: 'wait',
                    data: { priority: 'Default', isPending: false }
                },
                {
                    line: 8,
                    description: 'Update is marked. isPending becomes true. React stays on the current screen.',
                    badge: '⏳ Preparing',
                    visual: 'loading',
                    data: { isPending: true, mode: 'Concurrent' }
                },
                {
                    line: 9,
                    description: 'React works on the new UI in memory. If a user types again, this work is PAUSED or RESTARTED.',
                    badge: '🏗️ Low Priority',
                    visual: 'rendering',
                    data: { interruption: 'Allowed', cpu_usage: 'Deferred' }
                }
            ],
            takeaway: "useTransition is what makes modern React apps feel fast even with massive amounts of data."
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

                {/* Left Sidebar - Definitions & Theory */}
                <div className="w-80 bg-slate-900 border-r border-slate-700 p-6 overflow-y-auto lg:h-[calc(100vh-5rem)]">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Boxes className="text-cyan-400" size={40} />
                            <h1 className="text-3xl font-bold">Hook Lab</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Step inside the internal engine of React Hooks.
                        </p>
                    </div>

                    {/* Interview Answer */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-cyan-400" size={22} />
                            <h3 className="text-base font-bold text-cyan-400 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "{currentHook.interviewAnswer}"
                        </p>
                    </div>

                    {/* Simple Explanation */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-yellow-400" size={22} />
                            <h3 className="text-base font-bold text-yellow-400 uppercase">Simple Explanation</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            {currentHook.simpleExplanation}
                        </p>
                    </div>

                    {/* Remember Section */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-purple-400" size={22} />
                            <h3 className="text-base font-bold text-purple-400 uppercase">Remember</h3>
                        </div>
                        <ul className="space-y-3 text-slate-200 text-base">
                            {currentHook.rememberPoints.map((point: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-purple-400 mt-1">•</span>
                                    <div>{point}</div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Rules of Hooks */}
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase flex items-center gap-2">
                            <AlertTriangle size={16} /> Rules of Hooks
                        </h4>
                        <ul className="space-y-2 text-slate-400 text-xs">
                            <li>• Only at the Top Level</li>
                            <li>• Only in React Functions</li>
                        </ul>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-700">
                        <Link href="/react">
                            <div className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">
                                <ChevronLeft size={16} /> Back to React
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
