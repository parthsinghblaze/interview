'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft, ChevronRight, RotateCcw, Play, Pause,
    Code, Info, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../../components/Header';
import DSAExplanationModal from '../../components/DSAExplanationModal';

interface Step {
    description: string;
    array: number[];
    outerIdx: number;       // i
    compareIdx: number;     // j — left of the pair being compared
    swapIndices: number[];  // [j, j+1] when a swap happens
    sortedFrom: number;     // everything >= sortedFrom is sorted
    jsLine: number;
    pyLine: number;
    type: 'outer' | 'compare' | 'swap' | 'no-swap' | 'complete';
    completed?: boolean;
}

const INITIAL_ARRAY = [3, 4, 5, 1, 2, 8, 6, 7];

const BubbleSortVisualizer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');

    const generateSteps = (): Step[] => {
        const steps: Step[] = [];
        const arr = [...INITIAL_ARRAY];
        const n = arr.length;

        for (let i = 0; i < n; i++) {
            // Outer loop start — inner loop will only go up to n-1-i
            steps.push({
                description: `Pass ${i + 1}: Inner loop runs j = 0 to ${n - 2 - i} (skipping ${i} sorted element${i === 1 ? '' : 's'} at the end)`,
                array: [...arr],
                outerIdx: i,
                compareIdx: -1,
                swapIndices: [],
                sortedFrom: n - i,
                jsLine: 2,
                pyLine: 2,
                type: 'outer',
            });

            // Optimized: j < n - 1 - i  →  skip the already-sorted tail
            for (let j = 0; j < n - 1 - i; j++) {
                // Compare step
                steps.push({
                    description: `Compare arr[${j}] = ${arr[j]} with arr[${j + 1}] = ${arr[j + 1]}`,
                    array: [...arr],
                    outerIdx: i,
                    compareIdx: j,
                    swapIndices: [],
                    sortedFrom: n - i,
                    jsLine: 5,
                    pyLine: 4,
                    type: 'compare',
                });

                if (arr[j] > arr[j + 1]) {
                    // Swap step
                    const tmp = arr[j + 1];
                    arr[j + 1] = arr[j];
                    arr[j] = tmp;

                    steps.push({
                        description: `${arr[j + 1]} > ${arr[j]} → Swap! arr[${j}] ↔ arr[${j + 1}]`,
                        array: [...arr],
                        outerIdx: i,
                        compareIdx: j,
                        swapIndices: [j, j + 1],
                        sortedFrom: n - i,
                        jsLine: 7,
                        pyLine: 6,
                        type: 'swap',
                    });
                } else {
                    steps.push({
                        description: `${arr[j]} ≤ ${arr[j + 1]} → No swap needed`,
                        array: [...arr],
                        outerIdx: i,
                        compareIdx: j,
                        swapIndices: [],
                        sortedFrom: n - i,
                        jsLine: 5,
                        pyLine: 4,
                        type: 'no-swap',
                    });
                }
            }

            // Mark one more element as sorted after each pass
            steps.push({
                description: `End of pass ${i + 1}: arr[${n - 1 - i}] = ${arr[n - 1 - i]} is now in its final sorted position`,
                array: [...arr],
                outerIdx: i,
                compareIdx: -1,
                swapIndices: [],
                sortedFrom: n - i - 1,
                jsLine: 2,
                pyLine: 2,
                type: 'outer',
            });
        }

        steps.push({
            description: `✅ Array fully sorted: [${arr.join(', ')}]`,
            array: [...arr],
            outerIdx: n,
            compareIdx: -1,
            swapIndices: [],
            sortedFrom: 0,
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
        outerIdx: 0,
        compareIdx: -1,
        swapIndices: [],
        sortedFrom: INITIAL_ARRAY.length,
        jsLine: 0,
        pyLine: 0,
        type: 'outer',
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
        }, 700);

        if (isPlaying || currentStep > 0) {
            const step = steps[currentStep];
            if (step?.completed) {
                playTone(600, 'sine', 0.1);
                setTimeout(() => playTone(800, 'sine', 0.3), 100);
            } else if (step?.type === 'swap') {
                playTone(520, 'triangle', 0.15);
            } else if (step?.type === 'compare') {
                playTone(220, 'sine', 0.05);
            } else if (step?.type === 'outer') {
                playTone(350, 'sine', 0.08);
            }
        }

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps]);

    const handleNext = () => { if (currentStep < steps.length - 1) setCurrentStep(s => s + 1); };
    const handlePrevious = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };
    const handleReset = () => { setCurrentStep(0); setIsPlaying(false); };

    const jsCode = [
        'function bubbleSort(arr) {',
        '    for (let i = 0; i < arr.length; i++) {',
        '        for (let j = 0; j < arr.length - 1 - i; j++) {',
        '            ',
        '            if (arr[j] > arr[j + 1]) {',
        '                ',
        '                const smallValue = arr[j + 1]',
        '                const largeValue = arr[j]',
        '                arr[j + 1] = largeValue',
        '                arr[j] = smallValue',
        '            }',
        '        }',
        '    }',
        '    return arr',
        '}',
    ];

    const pyCode = [
        'def bubble_sort(arr):',
        '    for i in range(len(arr)):',
        '        for j in range(len(arr) - 1 - i):',
        '            ',
        '            if arr[j] > arr[j + 1]:',
        '                arr[j], arr[j + 1] = \\',
        '                    arr[j + 1], arr[j]',
        '    return arr',
    ];

    const code = language === 'javascript' ? jsCode : pyCode;
    const activeLine = language === 'javascript' ? currentStepData.jsLine : currentStepData.pyLine;

    const getBarStyle = (idx: number) => {
        const { sortedFrom, compareIdx, swapIndices, type } = currentStepData;

        if (type === 'complete') {
            return {
                bar: 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/40',
                label: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
                tag: '✓',
            };
        }
        if (swapIndices.includes(idx)) {
            return {
                bar: 'bg-gradient-to-t from-rose-600 to-rose-400 shadow-lg shadow-rose-500/50',
                label: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
                tag: 'SWAP',
            };
        }
        if (idx >= sortedFrom) {
            return {
                bar: 'bg-gradient-to-t from-emerald-700 to-emerald-500 shadow-md shadow-emerald-500/30',
                label: 'bg-emerald-500/10 text-emerald-500 border border-emerald-600/30',
                tag: '✓',
            };
        }
        if (idx === compareIdx || idx === compareIdx + 1) {
            return {
                bar: 'bg-gradient-to-t from-yellow-600 to-yellow-400 shadow-lg shadow-yellow-500/50',
                label: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
                tag: idx === compareIdx ? 'j' : 'j+1',
            };
        }
        return {
            bar: 'bg-gradient-to-t from-sky-700 to-sky-500',
            label: 'bg-slate-800 text-slate-400',
            tag: `[${idx}]`,
        };
    };

    const stepTypeColor: Record<string, string> = {
        outer: 'text-sky-300',
        compare: 'text-yellow-300',
        swap: 'text-rose-300',
        'no-swap': 'text-slate-300',
        complete: 'text-green-300',
    };

    const maxVal = Math.max(...INITIAL_ARRAY);
    const swapCount = steps.slice(0, currentStep + 1).filter(s => s.type === 'swap').length;
    const passNum = currentStepData.outerIdx < INITIAL_ARRAY.length ? currentStepData.outerIdx + 1 : '–';
    const sortedCount = INITIAL_ARRAY.length - currentStepData.sortedFrom;

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-rose-500/30">
            <Header />

            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900/20 via-slate-950 to-black pt-20 pb-6 px-4 md:px-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />

                <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 relative z-10">

                    {/* ── LEFT COLUMN ── */}
                    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">

                        {/* Controller Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                                    Bubble Sort
                                </h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-2 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
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

                            {/* Legend */}
                            <div className="grid grid-cols-2 gap-2 mb-6">
                                {[
                                    { color: 'bg-yellow-500', label: 'Comparing (j, j+1)' },
                                    { color: 'bg-rose-500', label: 'Swapping' },
                                    { color: 'bg-emerald-500', label: 'Sorted (bubbled up)' },
                                    { color: 'bg-sky-500', label: 'Unsorted' },
                                ].map(({ color, label }) => (
                                    <div key={label} className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${color} shrink-0`} />
                                        <span className="text-xs text-slate-400">{label}</span>
                                    </div>
                                ))}
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
                                    className={`p-3 rounded-xl ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-rose-600 hover:bg-rose-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-rose-900/20`}
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
                                        className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
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
                                <div className="flex items-center gap-2 text-rose-400">
                                    <Code size={18} />
                                    <h3 className="font-bold text-sm uppercase tracking-wider">Algorithm Code</h3>
                                </div>
                                <div className="flex bg-slate-900/80 rounded p-1 border border-white/10">
                                    <button
                                        className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${language === 'javascript' ? 'bg-rose-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                        onClick={() => setLanguage('javascript')}
                                    >JS</button>
                                    <button
                                        className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${language === 'python' ? 'bg-rose-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
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
                                                backgroundColor: lineNumber === activeLine ? 'rgba(244, 63, 94, 0.12)' : undefined,
                                                display: 'block',
                                                width: '100%',
                                                borderLeft: lineNumber === activeLine ? '3px solid #f43f5e' : '3px solid transparent',
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
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.07),transparent_70%)] pointer-events-none" />

                            {/* Step Description */}
                            <div className="w-full text-center mb-8 relative z-20">
                                <motion.div
                                    key={currentStepData.description}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-block bg-slate-800/80 border border-rose-500/30 rounded-2xl md:rounded-full px-4 md:px-6 py-2 shadow-lg"
                                >
                                    <p className={`text-sm md:text-lg font-medium flex items-center gap-3 ${stepTypeColor[currentStepData.type] || 'text-white'}`}>
                                        <Info size={18} className="text-rose-400 shrink-0" />
                                        {currentStepData.description}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Bar Chart */}
                            <div className="flex-1 w-full flex items-end justify-center relative z-10 overflow-x-auto pt-4 pb-10 custom-scrollbar">
                                <LayoutGroup>
                                    <div className="flex gap-2 md:gap-4 items-end px-4 min-w-max">
                                        {currentStepData.array.map((value, idx) => {
                                            const style = getBarStyle(idx);
                                            const heightPct = (value / maxVal) * 220;
                                            const isActive = currentStepData.swapIndices.includes(idx) ||
                                                idx === currentStepData.compareIdx ||
                                                idx === currentStepData.compareIdx + 1;

                                            return (
                                                <motion.div
                                                    key={value}
                                                    layout
                                                    animate={{
                                                        scale: isActive ? 1.12 : 1,
                                                        opacity: 1,
                                                    }}
                                                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                                                    className="flex flex-col items-center gap-2"
                                                >
                                                    {/* Value on top */}
                                                    <motion.span layout className="text-white font-bold text-base md:text-lg">
                                                        {value}
                                                    </motion.span>

                                                    {/* Bar */}
                                                    <motion.div
                                                        layout
                                                        className={`w-10 md:w-14 rounded-t-xl transition-colors duration-200 ${style.bar}`}
                                                        style={{ height: `${heightPct}px` }}
                                                    />

                                                    {/* Index label */}
                                                    <div className={`text-[10px] md:text-xs font-mono px-1 md:px-2 py-0.5 md:py-1 rounded ${style.label}`}>
                                                        {style.tag}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </LayoutGroup>
                            </div>

                            {/* Swap arrow indicator */}
                            <AnimatePresence>
                                {currentStepData.type === 'swap' && currentStepData.swapIndices.length === 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center gap-3 mb-4 px-5 py-3 bg-rose-500/15 border border-rose-500/40 rounded-2xl"
                                    >
                                        <span className="font-mono font-bold text-rose-300 text-lg">
                                            arr[{currentStepData.swapIndices[0]}] = {currentStepData.array[currentStepData.swapIndices[0]]}
                                        </span>
                                        <span className="text-rose-400 text-xl">⇄</span>
                                        <span className="font-mono font-bold text-rose-300 text-lg">
                                            arr[{currentStepData.swapIndices[1]}] = {currentStepData.array[currentStepData.swapIndices[1]]}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Completion Badge */}
                            <AnimatePresence>
                                {isCompleted && (
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="mt-4 px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-300 rounded-full font-bold text-xl shadow-lg shadow-green-500/20 relative z-20"
                                    >
                                        ✅ Sorted: [{currentStepData.array.join(', ')}]
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Stats Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Pass (i)</span>
                                    <span className="text-xl md:text-3xl font-bold text-sky-400">{passNum}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Swaps Made</span>
                                    <span className="text-xl md:text-3xl font-bold text-rose-400">{swapCount}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Sorted</span>
                                    <span className="text-xl md:text-3xl font-bold text-emerald-400">
                                        {sortedCount}/{INITIAL_ARRAY.length}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Complexity</span>
                                    <span className="text-lg md:text-2xl font-bold text-pink-400">O(n²)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <DSAExplanationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Bubble Sort"
                description="A simple comparison-based algorithm that repeatedly swaps adjacent elements if they are in the wrong order, bubbling the largest value to the end each pass."
                concept={`Bubble Sort works with two nested loops:\n\nOuter loop (i): Runs n passes over the array.\nInner loop (j): Runs from 0 to n-2-i — skipping the last i elements that are already sorted.\n\nKey insight: After pass i, the i largest elements have bubbled to their correct positions at the right end. There is no need to re-compare them.\n\nIf arr[j] > arr[j+1], swap them.\nAfter n passes, the array is fully sorted.`}
                efficiency="Bubble Sort always performs O(n²) comparisons in the basic form. An optimized version can exit early if no swaps occur in a pass (already sorted)."
                useCases={[
                    'Teaching sorting concepts due to simplicity',
                    'Small datasets where performance is not critical',
                    'Detecting nearly-sorted arrays (with early-exit optimization)',
                ]}
                timeComplexity="O(n²)"
                spaceComplexity="O(1)"
                complexityNotes="n = number of elements. Best case with early-exit optimization: O(n) for already-sorted input."
                interviewTips={[
                    'Bubble Sort is STABLE — equal elements maintain their relative order.',
                    'Mention the early-exit optimization: if no swap in a pass, array is sorted.',
                    'Compare with Selection Sort: Bubble makes more swaps but is stable.',
                    'Rarely used in practice — Merge Sort or Quick Sort are preferred.',
                ]}
                color="blue"
            />
        </div>
    );
};

export default BubbleSortVisualizer;
