'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft, ChevronRight, RotateCcw, Play, Pause,
    Code, Info, HelpCircle, ArrowLeftRight, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../../components/Header';
import DSAExplanationModal from '../../components/DSAExplanationModal';

interface StackFrame {
    start: number;
    last: number;
}

interface Step {
    description: string;
    array: number[];
    start: number;
    last: number;
    activeIndices: number[];
    swappedIndices: number[];
    stack: StackFrame[];
    jsLine: number;
    pyLine: number;
    type: 'call' | 'check' | 'swap' | 'return' | 'complete';
    completed?: boolean;
}

const INITIAL_ARRAY = [1, 2, 3, 4, 5, 6, 7];

const ReverseArrayVisualizer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');

    const generateSteps = (): Step[] => {
        const steps: Step[] = [];
        const arr = [...INITIAL_ARRAY];
        const callStack: StackFrame[] = [];

        const recurse = (s: number, l: number) => {
            // 1. Function call
            callStack.push({ start: s, last: l });
            steps.push({
                description: `Call reverseArray(arr, ${s}, ${l})`,
                array: [...arr],
                start: s,
                last: l,
                activeIndices: [],
                swappedIndices: [],
                stack: [...callStack],
                jsLine: 1,
                pyLine: 1,
                type: 'call',
            });

            // 2. Base case check
            steps.push({
                description: `Is start (${s}) ≥ last (${l})? ${s >= l ? 'Yes → base case reached' : 'No → continue'}`,
                array: [...arr],
                start: s,
                last: l,
                activeIndices: [],
                swappedIndices: [],
                stack: [...callStack],
                jsLine: 3,
                pyLine: 2,
                type: 'check',
            });

            if (s >= l) {
                steps.push({
                    description: `Base case! start (${s}) ≥ last (${l}) → return, done reversing`,
                    array: [...arr],
                    start: s,
                    last: l,
                    activeIndices: [],
                    swappedIndices: [],
                    stack: [...callStack],
                    jsLine: 4,
                    pyLine: 3,
                    type: 'return',
                });
                callStack.pop();
                return;
            }

            // 3. Highlight elements to swap
            steps.push({
                description: `Preparing to swap arr[${s}] = ${arr[s]} ↔ arr[${l}] = ${arr[l]}`,
                array: [...arr],
                start: s,
                last: l,
                activeIndices: [s, l],
                swappedIndices: [],
                stack: [...callStack],
                jsLine: 7,
                pyLine: 6,
                type: 'check',
            });

            // 4. Perform swap
            const temp = arr[s];
            arr[s] = arr[l];
            arr[l] = temp;

            steps.push({
                description: `Swapped! arr[${s}] = ${arr[s]}, arr[${l}] = ${arr[l]}`,
                array: [...arr],
                start: s,
                last: l,
                activeIndices: [s, l],
                swappedIndices: [s, l],
                stack: [...callStack],
                jsLine: 9,
                pyLine: 8,
                type: 'swap',
            });

            // 5. Recurse
            steps.push({
                description: `Recurse inward → reverseArray(arr, ${s + 1}, ${l - 1})`,
                array: [...arr],
                start: s,
                last: l,
                activeIndices: [],
                swappedIndices: [],
                stack: [...callStack],
                jsLine: 11,
                pyLine: 9,
                type: 'call',
            });

            recurse(s + 1, l - 1);

            // 6. Return bubble-up
            steps.push({
                description: `Returning from call (start=${s}, last=${l})`,
                array: [...arr],
                start: s,
                last: l,
                activeIndices: [],
                swappedIndices: [],
                stack: [...callStack],
                jsLine: 11,
                pyLine: 9,
                type: 'return',
            });
            callStack.pop();
        };

        recurse(0, INITIAL_ARRAY.length - 1);

        steps.push({
            description: `✅ Array fully reversed! [${arr.join(', ')}]`,
            array: [...arr],
            start: -1,
            last: -1,
            activeIndices: [],
            swappedIndices: arr.map((_, i) => i),
            stack: [],
            jsLine: 0,
            pyLine: 0,
            type: 'complete',
            completed: true,
        });

        return steps;
    };

    const [steps, setSteps] = useState<Step[]>([]);

    useEffect(() => {
        setSteps(generateSteps());
        setCurrentStep(0);
        setIsPlaying(false);
    }, []);

    const currentStepData: Step = steps[currentStep] || {
        description: 'Initializing...',
        array: INITIAL_ARRAY,
        start: 0,
        last: INITIAL_ARRAY.length - 1,
        activeIndices: [],
        swappedIndices: [],
        stack: [],
        jsLine: 0,
        pyLine: 0,
        type: 'call',
    };

    const isCompleted = currentStepData.completed === true;

    const playTone = (freq: number, type: 'sine' | 'square' | 'triangle' = 'sine', duration = 0.1) => {
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
        if ((!isPlaying && currentStep === 0) || currentStep >= steps.length) return;

        const interval = setInterval(() => {
            if (isPlaying && currentStep < steps.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else if (currentStep >= steps.length - 1) {
                setIsPlaying(false);
            }
        }, 900);

        if (isPlaying || currentStep > 0) {
            const step = steps[currentStep];
            if (step?.completed) {
                playTone(600, 'sine', 0.1);
                setTimeout(() => playTone(800, 'sine', 0.3), 100);
            } else if (step?.type === 'swap') {
                playTone(500, 'triangle', 0.15);
            } else if (step?.type === 'call') {
                playTone(350, 'sine', 0.08);
            } else if (step?.type === 'return') {
                playTone(250, 'sine', 0.08);
            } else {
                playTone(200, 'sine', 0.05);
            }
        }

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps]);

    const handleNext = () => { if (currentStep < steps.length - 1) setCurrentStep(s => s + 1); };
    const handlePrevious = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };
    const handleReset = () => { setCurrentStep(0); setIsPlaying(false); };

    const jsCode = [
        'function reverseArray(array, start, last) {',
        '  ',
        '  if (start >= last) {',
        '    return array;',
        '  }',
        '  ',
        '  const temp = array[start];',
        '  array[start] = array[last];',
        '  array[last] = temp;',
        '  ',
        '  return reverseArray(array, start + 1, last - 1);',
        '}',
    ];

    const pyCode = [
        'def reverse_array(array, start, last):',
        '    if start >= last:',
        '        return array',
        '    ',
        '    temp = array[start]',
        '    array[start] = array[last]',
        '    array[last] = temp',
        '    ',
        '    return reverse_array(array, start + 1, last - 1)',
    ];

    const code = language === 'javascript' ? jsCode : pyCode;
    const activeLine = language === 'javascript' ? currentStepData.jsLine : currentStepData.pyLine;

    const stepTypeColor: Record<string, string> = {
        call: 'text-cyan-300',
        check: 'text-amber-300',
        swap: 'text-emerald-300',
        return: 'text-blue-300',
        complete: 'text-green-300',
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-cyan-500/30">
            <Header />

            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-black pt-20 pb-6 px-4 md:px-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 relative z-10">

                    {/* ── LEFT COLUMN ── */}
                    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">

                        {/* Controller Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                    Reverse Array Recursion
                                </h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-2 rounded-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                                        title="Algorithm Explanation"
                                    >
                                        <HelpCircle size={20} />
                                    </button>
                                    <div className="px-2 py-1 rounded bg-slate-800 border border-white/10 text-xs font-mono text-slate-400">v2.0</div>
                                </div>
                            </div>

                            {/* Input Display */}
                            <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-slate-400 font-medium">Input Array</span>
                                    <span className="text-xs text-slate-500 font-mono">{INITIAL_ARRAY.length} elements</span>
                                </div>
                                <div className="font-mono text-lg text-white">[{INITIAL_ARRAY.join(', ')}]</div>
                            </div>

                            {/* Playback Controls */}
                            <div className="grid grid-cols-4 gap-2">
                                <button
                                    onClick={handleReset}
                                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center justify-center"
                                    title="Reset"
                                >
                                    <RotateCcw size={20} />
                                </button>
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentStep === 0}
                                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"
                                    title="Previous Step"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    disabled={isCompleted}
                                    className={`p-3 rounded-xl ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-cyan-600 hover:bg-cyan-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-cyan-900/20`}
                                    title={isPlaying ? 'Pause' : 'Play'}
                                >
                                    {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={isCompleted}
                                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"
                                    title="Next Step"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-6">
                                <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                                    <span>Progress</span>
                                    <span>{Math.round(((currentStep + 1) / Math.max(steps.length, 1)) * 100)}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentStep + 1) / Math.max(steps.length, 1)) * 100}%` }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Code Display */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex-1 flex flex-col min-h-[300px]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-cyan-400">
                                    <Code size={18} />
                                    <h3 className="font-bold text-sm uppercase tracking-wider">Algorithm Code</h3>
                                </div>
                                <div className="flex bg-slate-900/80 rounded p-1 border border-white/10">
                                    <button
                                        className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${language === 'javascript' ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                        onClick={() => setLanguage('javascript')}
                                    >JS</button>
                                    <button
                                        className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${language === 'python' ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                        onClick={() => setLanguage('python')}
                                    >PY</button>
                                </div>
                            </div>

                            <div className="flex-1 rounded-xl overflow-hidden border border-slate-700/50 shadow-inner bg-[#1e1e1e] relative">
                                <div className="absolute inset-0 overflow-auto custom-scrollbar">
                                    <SyntaxHighlighter
                                        language={language}
                                        style={atomDark}
                                        showLineNumbers={true}
                                        wrapLines={true}
                                        customStyle={{
                                            margin: 0,
                                            padding: '1.5rem',
                                            minHeight: '100%',
                                            fontSize: '0.9rem',
                                            lineHeight: '1.6',
                                            backgroundColor: '#1e1e1e',
                                        }}
                                        lineNumberStyle={{ minWidth: '2em', paddingRight: '1em', color: '#6e7681', textAlign: 'right' }}
                                        lineProps={(lineNumber: number) => ({
                                            style: {
                                                backgroundColor: lineNumber === activeLine ? 'rgba(34, 211, 238, 0.12)' : undefined,
                                                display: 'block',
                                                width: '100%',
                                                borderLeft: lineNumber === activeLine ? '3px solid #22d3ee' : '3px solid transparent',
                                                paddingLeft: '1rem',
                                            },
                                        })}
                                    >
                                        {code.join('\n')}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN ── */}
                    <div className="flex flex-col gap-6">

                        {/* Main Visualization Stage */}
                        <div className="min-h-[500px] lg:flex-grow bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-4 md:p-8 relative overflow-visible flex flex-col items-center">
                            {/* Radial glow */}
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.07),transparent_70%)] pointer-events-none" />

                            {/* Step Description */}
                            <div className="w-full text-center mb-8 relative z-20">
                                <motion.div
                                    key={currentStepData.description}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-block bg-slate-800/80 border border-cyan-500/30 rounded-2xl md:rounded-full px-4 md:px-6 py-2 shadow-lg"
                                >
                                    <p className={`text-sm md:text-lg font-medium flex items-center gap-3 ${stepTypeColor[currentStepData.type] || 'text-white'}`}>
                                        <Info size={18} className="text-cyan-400 shrink-0" />
                                        {currentStepData.description}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Array Visualization */}
                            <div className="flex gap-2 md:gap-3 mb-12 flex-wrap justify-center relative z-10">
                                {currentStepData.array.map((val, idx) => {
                                    const isStart = idx === currentStepData.start;
                                    const isLast = idx === currentStepData.last;
                                    const isActive = currentStepData.activeIndices.includes(idx);
                                    const isSwapped = currentStepData.swappedIndices.includes(idx);
                                    const isInRange =
                                        currentStepData.start >= 0 &&
                                        idx >= currentStepData.start &&
                                        idx <= currentStepData.last;

                                    let boxClass = 'bg-slate-800 border-slate-600 text-slate-400';
                                    if (isSwapped && currentStepData.type === 'complete') {
                                        boxClass = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20';
                                    } else if (isActive && currentStepData.type === 'swap') {
                                        boxClass = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/30';
                                    } else if (isActive) {
                                        boxClass = 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/30';
                                    } else if (isInRange) {
                                        boxClass = 'bg-slate-700/60 border-slate-500 text-slate-300';
                                    }

                                    return (
                                        <motion.div
                                            key={idx}
                                            layout
                                            animate={{ scale: isActive ? 1.2 : 1 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                            className="flex flex-col items-center gap-1"
                                        >
                                            <div className={`w-11 h-14 md:w-14 md:h-18 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-xl md:text-2xl transition-all duration-300 ${boxClass}`}>
                                                {val}
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                                            {isStart && currentStepData.start >= 0 && (
                                                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">S</span>
                                            )}
                                            {isLast && !isStart && currentStepData.last >= 0 && (
                                                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider">L</span>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Swap Arrow */}
                            <AnimatePresence>
                                {currentStepData.type === 'swap' && currentStepData.activeIndices.length === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-3 mb-6 px-5 py-3 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl"
                                    >
                                        <span className="font-mono font-bold text-emerald-300 text-lg">
                                            arr[{currentStepData.activeIndices[0]}]
                                        </span>
                                        <ArrowLeftRight size={20} className="text-emerald-400" />
                                        <span className="font-mono font-bold text-emerald-300 text-lg">
                                            arr[{currentStepData.activeIndices[1]}]
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Call Stack */}
                            <div className="w-full max-w-2xl relative z-10">
                                <div className="flex items-center gap-2 mb-4 text-cyan-400/70">
                                    <Layers size={16} />
                                    <span className="text-xs font-black uppercase tracking-widest">Call Stack</span>
                                    <span className="ml-auto text-xs font-mono text-slate-500">
                                        {currentStepData.stack.length} frame{currentStepData.stack.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <AnimatePresence>
                                        {currentStepData.stack.length === 0 ? (
                                            <div className="text-center text-slate-600 italic text-sm py-4">Stack is empty</div>
                                        ) : (
                                            [...currentStepData.stack].reverse().map((frame, i) => {
                                                const isTop = i === 0;
                                                return (
                                                    <motion.div
                                                        key={`${frame.start}-${frame.last}`}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        className={`flex items-center justify-between rounded-xl px-4 py-3 border transition-all ${isTop
                                                            ? 'bg-cyan-500/15 border-cyan-500/40 shadow-md shadow-cyan-500/10'
                                                            : 'bg-slate-800/60 border-white/5'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${isTop ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200' : 'bg-slate-700 border-slate-600 text-slate-400'}`}>
                                                                {currentStepData.stack.length - 1 - i}
                                                            </div>
                                                            <div>
                                                                <span className="font-mono text-sm font-bold text-cyan-200">reverseArray</span>
                                                                <span className="font-mono text-xs text-slate-400 ml-1">(arr, {frame.start}, {frame.last})</span>
                                                            </div>
                                                        </div>
                                                        {isTop && (
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded animate-pulse">
                                                                Active
                                                            </span>
                                                        )}
                                                    </motion.div>
                                                );
                                            })
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Completion Badge */}
                            {isCompleted && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="mt-8 px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-300 rounded-full font-bold text-xl shadow-lg shadow-green-500/20 relative z-20"
                                >
                                    ✅ Array Reversed: [{currentStepData.array.join(', ')}]
                                </motion.div>
                            )}
                        </div>

                        {/* Stats Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Stack Depth</span>
                                    <span className="text-xl md:text-3xl font-bold text-cyan-400">{currentStepData.stack.length}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Start Ptr</span>
                                    <span className="text-xl md:text-3xl font-bold text-emerald-400">{currentStepData.start >= 0 ? currentStepData.start : '–'}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Last Ptr</span>
                                    <span className="text-xl md:text-3xl font-bold text-blue-400">{currentStepData.last >= 0 ? currentStepData.last : '–'}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Complexity</span>
                                    <span className="text-lg md:text-2xl font-bold text-cyan-400">O(n)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <DSAExplanationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Reverse Array using Recursion"
                description="Reversing an array by swapping elements from both ends moving towards the center."
                concept={`The algorithm uses two pointers, 'start' and 'last'. In each recursive step:\n1. If start ≥ last → base case, stop.\n2. Swap arr[start] with arr[last].\n3. Recurse with (start+1, last-1) until pointers meet or cross.`}
                efficiency="Recursive approach adds stack overhead compared to iterative two-pointer approach."
                useCases={['Palindrome checking', 'Data processing streams', 'In-place array manipulations']}
                timeComplexity="O(n)"
                spaceComplexity="O(n) - due to recursion stack"
                complexityNotes="Iterative approach would be O(1) space. Each recursive call handles one swap."
                interviewTips={[
                    'Mention the difference between Iterative vs Recursive space complexity.',
                    'Be careful with base cases (even vs odd length arrays).',
                    'This is an in-place algorithm (modifies original array).',
                ]}
                color="blue"
            />
        </div>
    );
};

export default ReverseArrayVisualizer;
