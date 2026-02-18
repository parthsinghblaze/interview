'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft, ChevronRight, RotateCcw, Play, Pause,
    Code, Info, HelpCircle, Layers, ArrowDown, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../../components/Header';
import DSAExplanationModal from '../../components/DSAExplanationModal';

interface Step {
    description: string;
    stack: { name: string; count: number }[];
    output: string[];
    jsLine: number;
    pyLine: number;
    type: 'call' | 'print' | 'return' | 'base';
    activeCallIndex: number;
}

const RecursionVisualizer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [recursionType, setRecursionType] = useState<'head' | 'tail'>('tail');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [language, setLanguage] = useState<'javascript' | 'python'>('python');

    const generateSteps = (type: 'head' | 'tail'): Step[] => {
        const steps: Step[] = [];
        let output: string[] = [];
        let stack: { name: string; count: number }[] = [];

        if (type === 'tail') {
            // Tail Recursion (Work before call)
            // Initial call
            steps.push({
                description: "Starting returnName(). count = 0",
                stack: [],
                output: [],
                jsLine: 1,
                pyLine: 1,
                type: 'call',
                activeCallIndex: -1
            });

            for (let i = 0; i <= 4; i++) {
                // Check base case
                steps.push({
                    description: `Check base case: is count (${i}) == 4?`,
                    stack: [...stack, { name: 'returnName', count: i }],
                    output: [...output],
                    jsLine: 2,
                    pyLine: 4,
                    type: 'base',
                    activeCallIndex: i
                });

                if (i === 4) {
                    steps.push({
                        description: "Base case reached. Returning...",
                        stack: [...stack, { name: 'returnName', count: i }],
                        output: [...output],
                        jsLine: 3,
                        pyLine: 5,
                        type: 'return',
                        activeCallIndex: i
                    });
                    break;
                }

                // Print
                output.push("parth");
                steps.push({
                    description: `Print "parth" (Work done BEFORE recursive call).`,
                    stack: [...stack, { name: 'returnName', count: i }],
                    output: [...output],
                    jsLine: 5,
                    pyLine: 7,
                    type: 'print',
                    activeCallIndex: i
                });

                // Recurse
                stack.push({ name: 'returnName', count: i });
                steps.push({
                    description: `Recursive call: returnName() with count = ${i + 1}`,
                    stack: [...stack],
                    output: [...output],
                    jsLine: 7,
                    pyLine: 9,
                    type: 'call',
                    activeCallIndex: i
                });
            }

            // Unwinding
            for (let i = 3; i >= 0; i--) {
                stack.pop();
                steps.push({
                    description: `Returning from call where count was ${i}.`,
                    stack: [...stack],
                    output: [...output],
                    jsLine: 8,
                    pyLine: 10,
                    type: 'return',
                    activeCallIndex: i
                });
            }

        } else {
            // Head Recursion (Work after call)
            steps.push({
                description: "Starting returnName(). count = 0",
                stack: [],
                output: [],
                jsLine: 1,
                pyLine: 1,
                type: 'call',
                activeCallIndex: -1
            });

            const recurseHead = (i: number) => {
                // Base check
                steps.push({
                    description: `Check base case: is count (${i}) == 4?`,
                    stack: [...stack, { name: 'returnName', count: i }],
                    output: [...output],
                    jsLine: 2,
                    pyLine: 16,
                    type: 'base',
                    activeCallIndex: i
                });

                if (i === 4) {
                    steps.push({
                        description: "Base case reached. Returning...",
                        stack: [...stack, { name: 'returnName', count: i }],
                        output: [...output],
                        jsLine: 3,
                        pyLine: 17,
                        type: 'return',
                        activeCallIndex: i
                    });
                    return;
                }

                // Recurse FIRST
                stack.push({ name: 'returnName', count: i });
                steps.push({
                    description: `Recursive call FIRST: returnName() with count = ${i + 1}`,
                    stack: [...stack],
                    output: [...output],
                    jsLine: 6,
                    pyLine: 20,
                    type: 'call',
                    activeCallIndex: i
                });

                recurseHead(i + 1);

                // Print AFTER return
                output.push("parth");
                steps.push({
                    description: `Back in call where count was ${i}. Now Printing "parth" (Work done AFTER recursion returned).`,
                    stack: [...stack],
                    output: [...output],
                    jsLine: 7,
                    pyLine: 21,
                    type: 'print',
                    activeCallIndex: i
                });

                stack.pop();
                steps.push({
                    description: `Returning from call where count was ${i}.`,
                    stack: [...stack],
                    output: [...output],
                    jsLine: 8,
                    pyLine: 22,
                    type: 'return',
                    activeCallIndex: i
                });
            };

            recurseHead(0);
        }

        return steps;
    };

    const [steps, setSteps] = useState<Step[]>([]);

    useEffect(() => {
        setSteps(generateSteps(recursionType));
        setCurrentStep(0);
        setIsPlaying(false);
    }, [recursionType]);

    const currentStepData = steps[currentStep] || {
        description: "Initializing...",
        stack: [],
        output: [],
        jsLine: 0,
        pyLine: 0,
        type: 'call',
        activeCallIndex: -1
    };

    const playTone = (freq: number, type: 'sine' | 'square' | 'triangle' = 'sine', duration: number = 0.1) => {
        try {
            const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.onended = () => ctx.close();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) { }
    };

    useEffect(() => {
        if (!isPlaying || currentStep >= steps.length - 1) {
            setIsPlaying(false);
            return;
        }

        const interval = setInterval(() => {
            setCurrentStep(prev => prev + 1);
        }, 800);

        const step = steps[currentStep];
        if (step.type === 'call') playTone(400, 'sine', 0.1);
        else if (step.type === 'print') playTone(600, 'triangle', 0.1);
        else if (step.type === 'return') playTone(300, 'sine', 0.1);

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps]);

    const tailCodePy = [
        "count = 0",
        "def returnName():",
        "    global count",
        "    if count == 4:",
        "        return",
        "    ",
        "    print(\"parth\")",
        "    count += 1",
        "    returnName()",
        "    "
    ];

    const headCodePy = [
        "count = 0",
        "def returnName():",
        "    global count",
        "    if count == 4:",
        "        return",
        "    ",
        "    count += 1",
        "    returnName()",
        "    print(\"parth\")",
        "    "
    ];

    const tailCodeJs = [
        "let count = 0;",
        "function returnName() {",
        "    if (count === 4) {",
        "        return;",
        "    }",
        "    console.log(\"parth\");",
        "    count++;",
        "    returnName();",
        "}"
    ];

    const headCodeJs = [
        "let count = 0;",
        "function returnName() {",
        "    if (count === 4) {",
        "        return;",
        "    }",
        "    count++;",
        "    returnName();",
        "    console.log(\"parth\");",
        "}"
    ];

    const code = language === 'python'
        ? (recursionType === 'tail' ? tailCodePy : headCodePy)
        : (recursionType === 'tail' ? tailCodeJs : headCodeJs);

    const activeLine = language === 'python' ? currentStepData.pyLine : currentStepData.jsLine;

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
            <Header />
            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black pt-20 pb-6 px-4 md:px-6">
                <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-6 relative z-10">

                    {/* Left Column */}
                    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto custom-scrollbar">
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Recursion Types</h1>
                                <button onClick={() => setIsModalOpen(true)} className="p-2 rounded-full bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors">
                                    <HelpCircle size={20} />
                                </button>
                            </div>

                            <div className="flex bg-slate-800 rounded-xl p-1 mb-6">
                                <button
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${recursionType === 'tail' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                                    onClick={() => setRecursionType('tail')}
                                >
                                    Tail Recursion
                                </button>
                                <button
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${recursionType === 'head' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                                    onClick={() => setRecursionType('head')}
                                >
                                    Head Recursion
                                </button>
                            </div>

                            <div className="grid grid-cols-4 gap-2 mb-6">
                                <button onClick={() => { setCurrentStep(0); setIsPlaying(false); }} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center justify-center font-bold"><RotateCcw size={20} /></button>
                                <button
                                    onClick={() => { setIsPlaying(false); setCurrentStep(prev => Math.max(0, prev - 1)); }}
                                    disabled={currentStep === 0}
                                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center font-bold"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className={`p-3 rounded-xl ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-indigo-900/20`}
                                >
                                    {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                                </button>
                                <button
                                    onClick={() => { setIsPlaying(false); setCurrentStep(prev => Math.min(steps.length - 1, prev + 1)); }}
                                    disabled={currentStep === steps.length - 1}
                                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center font-bold"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Code View */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex-1 flex flex-col min-h-[400px]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-indigo-400">
                                    <Code size={18} />
                                    <h3 className="font-bold text-sm uppercase tracking-wider">Implementation</h3>
                                </div>
                                <div className="flex bg-slate-800 rounded p-1">
                                    <button className={`px-2 py-0.5 text-[10px] rounded ${language === 'javascript' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`} onClick={() => setLanguage('javascript')}>JS</button>
                                    <button className={`px-2 py-0.5 text-[10px] rounded ${language === 'python' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`} onClick={() => setLanguage('python')}>PY</button>
                                </div>
                            </div>
                            <div className="flex-1 rounded-xl overflow-hidden border border-slate-700/50 bg-[#1e1e1e] relative">
                                <SyntaxHighlighter
                                    language={language}
                                    style={atomDark}
                                    showLineNumbers={true}
                                    wrapLines={true}
                                    customStyle={{ margin: 0, padding: '1rem', backgroundColor: 'transparent', fontSize: '0.9rem' }}
                                    lineProps={(lineNumber: number) => ({
                                        style: {
                                            backgroundColor: lineNumber === activeLine ? 'rgba(99, 102, 241, 0.2)' : undefined,
                                            display: 'block',
                                            width: '100%',
                                            borderLeft: lineNumber === activeLine ? '3px solid #6366f1' : '3px solid transparent'
                                        }
                                    })}
                                >
                                    {code.join('\n')}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-6">
                        {/* Description */}
                        <div className="bg-indigo-900/20 backdrop-blur-sm border border-indigo-500/20 rounded-3xl p-6">
                            <motion.div
                                key={currentStepData.description}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 text-indigo-100 italic"
                            >
                                <div className="p-2 bg-indigo-500/20 rounded-full"><Info size={20} className="text-indigo-400" /></div>
                                <span className="text-lg">{currentStepData.description}</span>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1">
                            {/* Call Stack / Tree Visual */}
                            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 flex flex-col relative overflow-hidden">
                                <div className="flex items-center gap-2 mb-8 text-indigo-400 opacity-60">
                                    <Layers size={20} />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Recursion Tree / Call Stack</h3>
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <div className="relative flex flex-col items-center gap-6">
                                        {[0, 1, 2, 3, 4].map((level) => {
                                            const isActive = currentStepData.activeCallIndex === level;
                                            const isStacked = currentStepData.stack.some(s => s.count === level);
                                            const isProcessed = !isActive && !isStacked && currentStep > 0;

                                            // Logic for whether to show the node
                                            // Tail: shows as we go down.
                                            // Head: shows as we go down, stays till we come up.
                                            const shouldShow = isActive || isStacked || (currentStep > 0 && level <= Math.max(...steps.slice(0, currentStep + 1).map(s => s.activeCallIndex)));

                                            return (
                                                <AnimatePresence key={level}>
                                                    {shouldShow && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            className="flex flex-col items-center group"
                                                        >
                                                            {level > 0 && (
                                                                <div className="w-px h-6 bg-gradient-to-b from-indigo-500/50 to-indigo-500/20 mb-2"></div>
                                                            )}
                                                            <div className={`
                                                                relative w-32 py-3 rounded-2xl border-2 flex flex-col items-center transition-all duration-300
                                                                ${isActive ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.4)] scale-110 z-20' :
                                                                    isStacked ? 'bg-slate-800 border-indigo-500/30 text-indigo-200' :
                                                                        'bg-slate-900/50 border-white/5 text-slate-600 opacity-40'}
                                                            `}>
                                                                <span className="text-[10px] font-black uppercase tracking-tighter mb-1 opacity-60">Call Level {level}</span>
                                                                <span className="font-mono font-bold">
                                                                    returnName({level})
                                                                </span>

                                                                {isActive && (
                                                                    <motion.div
                                                                        layoutId="activePointer"
                                                                        className="absolute -right-12 top-1/2 -translate-y-1/2 text-indigo-400"
                                                                    >
                                                                        <ChevronLeft className="animate-pulse" />
                                                                    </motion.div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Terminal / Output */}
                            <div className="bg-slate-950 border border-white/10 rounded-3xl p-8 flex flex-col shadow-inner">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-2 text-emerald-400 opacity-60">
                                        <Terminal size={20} />
                                        <h3 className="text-xs font-black uppercase tracking-widest">Global Output</h3>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-rose-500/20"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-500/20"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/20"></div>
                                    </div>
                                </div>

                                <div className="flex-1 font-mono text-lg space-y-2 overflow-y-auto custom-scrollbar">
                                    <AnimatePresence mode="popLayout">
                                        {currentStepData.output.map((line, idx) => (
                                            <motion.div
                                                key={`${idx}-${line}`}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center gap-4 text-emerald-400"
                                            >
                                                <span className="text-emerald-900 select-none">{">"}</span>
                                                <span className="text-white bg-emerald-500/10 px-2 py-0.5 rounded italic">"{line}"</span>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {currentStepData.output.length === 0 && (
                                        <div className="text-slate-800 italic text-sm">Waiting for execution...</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Complexity Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-4">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Time Complexity</span>
                                    <span className="text-xl font-black text-indigo-400">O(n)</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-4">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Space Complexity</span>
                                    <span className="text-xl font-black text-cyan-400">O(n)</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-4">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Recursion Depth</span>
                                    <span className="text-xl font-black text-amber-400">5</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-4">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Stack Usage</span>
                                    <span className="text-sm font-black text-emerald-400 uppercase tracking-widest">
                                        {currentStepData.stack.length > 0 ? `${currentStepData.stack.length} Active` : 'Idle'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <DSAExplanationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Recursion: Head vs Tail"
                description="The core difference lies in WHEN the 'main work' happens relative to the recursive call."
                concept="Recursion is a process where a function calls itself. \n\n1. **Tail Recursion**: The work (like printing) is done BEFORE the recursive call. The call is the 'tail' (last thing). \n2. **Head Recursion**: The recursive call is done FIRST. The work is done AFTER the call returns, as the stack unwinds."
                efficiency="Tail recursion is often preferred because modern compilers can optimize it to a simple loop (Tail Call Optimization), saving memory. Head recursion requires the stack to grow fully before any work is finished."
                useCases={[
                    "Tree traversals (Pre-order vs Post-order)",
                    "Factorial calculation",
                    "Depth First Search",
                    "Backtracking algorithms"
                ]}
                timeComplexity="O(n)"
                spaceComplexity="O(n) - due to stack depth"
                complexityNotes="Even though time is linear, the 'space' is linear too because each call adds a frame to the computer's memory (the Stack)."
                interviewTips={[
                    "Always define a CLEAR base case to avoid Infinite Recursion (Stack Overflow).",
                    "Mention 'Tail Call Optimization' (TCO) if the interviewer asks about recursion vs iteration.",
                    "If you can do it with a loop, it's usually safer and and more memory-efficient.",
                    "Head recursion is common in post-order tree processing."
                ]}
                color="purple"
            />
        </div>
    );
};

export default RecursionVisualizer;
