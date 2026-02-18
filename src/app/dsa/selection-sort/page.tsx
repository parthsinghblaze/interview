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
    outerIdx: number;       // i — the boundary of the sorted region
    minIdx: number;         // current min_index
    compareIdx: number;     // j — element being compared (-1 if not comparing)
    swapIndices: number[];  // indices being swapped this step
    sortedUpTo: number;     // everything < sortedUpTo is sorted
    jsLine: number;
    pyLine: number;
    type: 'outer' | 'inner' | 'found-min' | 'swap' | 'complete';
    completed?: boolean;
}

const INITIAL_ARRAY = [2, 4, 5, 7, 1, 3];

const SelectionSortVisualizer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');

    const generateSteps = (): Step[] => {
        const steps: Step[] = [];
        const arr = [...INITIAL_ARRAY];
        const n = arr.length;

        for (let i = 0; i < n; i++) {
            // Outer loop — new pass begins
            steps.push({
                description: `Pass ${i + 1}: Assume arr[${i}] = ${arr[i]} is the minimum`,
                array: [...arr],
                outerIdx: i,
                minIdx: i,
                compareIdx: -1,
                swapIndices: [],
                sortedUpTo: i,
                jsLine: 4,
                pyLine: 3,
                type: 'outer',
            });

            let minIndex = i;

            for (let j = i + 1; j < n; j++) {
                // Comparing step
                steps.push({
                    description: `Compare arr[${j}] = ${arr[j]} with current min arr[${minIndex}] = ${arr[minIndex]}`,
                    array: [...arr],
                    outerIdx: i,
                    minIdx: minIndex,
                    compareIdx: j,
                    swapIndices: [],
                    sortedUpTo: i,
                    jsLine: 6,
                    pyLine: 5,
                    type: 'inner',
                });

                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                    steps.push({
                        description: `New minimum found! arr[${minIndex}] = ${arr[minIndex]} is smaller`,
                        array: [...arr],
                        outerIdx: i,
                        minIdx: minIndex,
                        compareIdx: j,
                        swapIndices: [],
                        sortedUpTo: i,
                        jsLine: 7,
                        pyLine: 6,
                        type: 'found-min',
                    });
                }
            }

            // Swap step
            const didSwap = minIndex !== i;
            steps.push({
                description: didSwap
                    ? `Swap arr[${i}] = ${arr[i]} ↔ arr[${minIndex}] = ${arr[minIndex]}`
                    : `arr[${i}] = ${arr[i]} is already in place, no swap needed`,
                array: [...arr],
                outerIdx: i,
                minIdx: minIndex,
                compareIdx: -1,
                swapIndices: didSwap ? [i, minIndex] : [],
                sortedUpTo: i,
                jsLine: 10,
                pyLine: 9,
                type: 'swap',
            });

            // Perform the swap
            const tmp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = tmp;

            // Show result after swap
            steps.push({
                description: `Position ${i} is now sorted: ${arr[i]}`,
                array: [...arr],
                outerIdx: i,
                minIdx: i,
                compareIdx: -1,
                swapIndices: [],
                sortedUpTo: i + 1,
                jsLine: 10,
                pyLine: 9,
                type: 'outer',
            });
        }

        steps.push({
            description: `✅ Array fully sorted: [${arr.join(', ')}]`,
            array: [...arr],
            outerIdx: n,
            minIdx: -1,
            compareIdx: -1,
            swapIndices: [],
            sortedUpTo: n,
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
        minIdx: 0,
        compareIdx: -1,
        swapIndices: [],
        sortedUpTo: 0,
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
        }, 800);

        if (isPlaying || currentStep > 0) {
            const step = steps[currentStep];
            if (step?.completed) {
                playTone(600, 'sine', 0.1);
                setTimeout(() => playTone(800, 'sine', 0.3), 100);
            } else if (step?.type === 'swap' && step.swapIndices.length > 0) {
                playTone(500, 'triangle', 0.15);
            } else if (step?.type === 'found-min') {
                playTone(440, 'sine', 0.1);
            } else if (step?.type === 'inner') {
                playTone(200, 'sine', 0.05);
            } else {
                playTone(300, 'sine', 0.07);
            }
        }

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps]);

    const handleNext = () => { if (currentStep < steps.length - 1) setCurrentStep(s => s + 1); };
    const handlePrevious = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };
    const handleReset = () => { setCurrentStep(0); setIsPlaying(false); };

    const jsCode = [
        'function selectionSort(nums) {',
        '    const numsLength = nums.length',
        '    ',
        '    for (let i = 0; i < numsLength; i++) {',
        '        let min_index = i',
        '        ',
        '        for (let j = i + 1; j < numsLength; j++) {',
        '            if (nums[j] < nums[min_index]) {',
        '                min_index = j',
        '            }',
        '        }',
        '        ',
        '        const newMinNumber = nums[min_index]',
        '        const oldMinNumber = nums[i]',
        '        nums[i] = newMinNumber',
        '        nums[min_index] = oldMinNumber',
        '    }',
        '    ',
        '    return nums',
        '}',
    ];

    const pyCode = [
        'def selection_sort(nums):',
        '    nums_length = len(nums)',
        '    ',
        '    for i in range(nums_length):',
        '        min_index = i',
        '        ',
        '        for j in range(i + 1, nums_length):',
        '            if nums[j] < nums[min_index]:',
        '                min_index = j',
        '        ',
        '        nums[i], nums[min_index] = \\',
        '            nums[min_index], nums[i]',
        '    ',
        '    return nums',
    ];

    const code = language === 'javascript' ? jsCode : pyCode;
    const activeLine = language === 'javascript' ? currentStepData.jsLine : currentStepData.pyLine;

    // Color logic for each bar
    const getBarStyle = (idx: number) => {
        const { sortedUpTo, outerIdx, minIdx, compareIdx, swapIndices, type } = currentStepData;

        if (type === 'complete') {
            return {
                bar: 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/40',
                label: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
                tag: 'DONE',
            };
        }
        if (swapIndices.includes(idx)) {
            return {
                bar: 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-lg shadow-amber-500/50',
                label: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
                tag: 'SWAP',
            };
        }
        if (idx < sortedUpTo) {
            return {
                bar: 'bg-gradient-to-t from-emerald-700 to-emerald-500 shadow-md shadow-emerald-500/30',
                label: 'bg-emerald-500/10 text-emerald-500 border border-emerald-600/30',
                tag: '✓',
            };
        }
        if (idx === minIdx) {
            return {
                bar: 'bg-gradient-to-t from-orange-600 to-orange-400 shadow-lg shadow-orange-500/50',
                label: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
                tag: 'MIN',
            };
        }
        if (idx === compareIdx) {
            return {
                bar: 'bg-gradient-to-t from-yellow-600 to-yellow-400 shadow-lg shadow-yellow-500/50',
                label: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
                tag: 'CMP',
            };
        }
        if (idx === outerIdx) {
            return {
                bar: 'bg-gradient-to-t from-violet-600 to-violet-400 shadow-md shadow-violet-500/30',
                label: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
                tag: `[${idx}]`,
            };
        }
        return {
            bar: 'bg-gradient-to-t from-slate-600 to-slate-500',
            label: 'bg-slate-800 text-slate-400',
            tag: `[${idx}]`,
        };
    };

    const stepTypeColor: Record<string, string> = {
        outer: 'text-violet-300',
        inner: 'text-yellow-300',
        'found-min': 'text-orange-300',
        swap: 'text-amber-300',
        complete: 'text-green-300',
    };

    const maxVal = Math.max(...INITIAL_ARRAY);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-orange-500/30">
            <Header />

            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-slate-950 to-black pt-20 pb-6 px-4 md:px-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

                <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 relative z-10">

                    {/* ── LEFT COLUMN ── */}
                    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">

                        {/* Controller Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                                    Selection Sort
                                </h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-2 rounded-full bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors"
                                        title="Algorithm Explanation"
                                    >
                                        <HelpCircle size={20} />
                                    </button>
                                    <div className="px-2 py-1 rounded bg-slate-800 border border-white/10 text-xs font-mono text-slate-400">v1.0</div>
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
                                    { color: 'bg-violet-500', label: 'Outer (i)' },
                                    { color: 'bg-orange-500', label: 'Min Index' },
                                    { color: 'bg-yellow-500', label: 'Comparing (j)' },
                                    { color: 'bg-amber-500', label: 'Swapping' },
                                    { color: 'bg-emerald-500', label: 'Sorted' },
                                    { color: 'bg-slate-500', label: 'Unsorted' },
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
                                    className={`p-3 rounded-xl ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-orange-600 hover:bg-orange-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-orange-900/20`}
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
                                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
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
                                <div className="flex items-center gap-2 text-orange-400">
                                    <Code size={18} />
                                    <h3 className="font-bold text-sm uppercase tracking-wider">Algorithm Code</h3>
                                </div>
                                <div className="flex bg-slate-900/80 rounded p-1 border border-white/10">
                                    <button
                                        className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${language === 'javascript' ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                        onClick={() => setLanguage('javascript')}
                                    >JS</button>
                                    <button
                                        className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${language === 'python' ? 'bg-orange-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
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
                                                backgroundColor: lineNumber === activeLine ? 'rgba(251, 146, 60, 0.12)' : undefined,
                                                display: 'block',
                                                width: '100%',
                                                borderLeft: lineNumber === activeLine ? '3px solid #fb923c' : '3px solid transparent',
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
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.07),transparent_70%)] pointer-events-none" />

                            {/* Step Description */}
                            <div className="w-full text-center mb-8 relative z-20">
                                <motion.div
                                    key={currentStepData.description}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-block bg-slate-800/80 border border-orange-500/30 rounded-2xl md:rounded-full px-4 md:px-6 py-2 shadow-lg"
                                >
                                    <p className={`text-sm md:text-lg font-medium flex items-center gap-3 ${stepTypeColor[currentStepData.type] || 'text-white'}`}>
                                        <Info size={18} className="text-orange-400 shrink-0" />
                                        {currentStepData.description}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Bar Chart Visualization */}
                            <div className="flex-1 w-full flex items-end justify-center relative z-10 overflow-x-auto pt-4 pb-10 custom-scrollbar">
                                <LayoutGroup>
                                    <div className="flex gap-3 md:gap-5 items-end px-4 min-w-max">
                                        {currentStepData.array.map((value, idx) => {
                                            const style = getBarStyle(idx);
                                            const heightPct = (value / maxVal) * 220;

                                            return (
                                                <motion.div
                                                    key={value}
                                                    layout
                                                    animate={{
                                                        scale: currentStepData.swapIndices.includes(idx) ? 1.15
                                                            : idx === currentStepData.compareIdx ? 1.1
                                                                : 1,
                                                        opacity: 1,
                                                    }}
                                                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                                                    className="flex flex-col items-center gap-2"
                                                >
                                                    {/* Value label on top */}
                                                    <motion.span
                                                        layout
                                                        className="text-white font-bold text-base md:text-lg"
                                                    >
                                                        {value}
                                                    </motion.span>

                                                    {/* Bar */}
                                                    <motion.div
                                                        layout
                                                        className={`w-12 md:w-16 rounded-t-xl transition-colors duration-200 ${style.bar}`}
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

                            {/* Completion Badge */}
                            <AnimatePresence>
                                {isCompleted && (
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="mt-6 px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-300 rounded-full font-bold text-xl shadow-lg shadow-green-500/20 relative z-20"
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
                                    <span className="text-xl md:text-3xl font-bold text-violet-400">
                                        {currentStepData.outerIdx < INITIAL_ARRAY.length ? currentStepData.outerIdx + 1 : '–'}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Min Index</span>
                                    <span className="text-xl md:text-3xl font-bold text-orange-400">
                                        {currentStepData.minIdx >= 0 ? currentStepData.minIdx : '–'}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Sorted</span>
                                    <span className="text-xl md:text-3xl font-bold text-emerald-400">
                                        {currentStepData.sortedUpTo}/{INITIAL_ARRAY.length}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Complexity</span>
                                    <span className="text-lg md:text-2xl font-bold text-amber-400">O(n²)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <DSAExplanationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Selection Sort"
                description="A simple comparison-based sorting algorithm that repeatedly selects the minimum element and places it in the correct position."
                concept={`Selection Sort divides the array into two parts: sorted (left) and unsorted (right).\n\nIn each pass (i):\n1. Assume arr[i] is the minimum.\n2. Scan the rest of the array (j = i+1 to n-1).\n3. If a smaller element is found, update min_index.\n4. After the inner loop, swap arr[i] with arr[min_index].\n\nRepeat until the entire array is sorted.`}
                efficiency="Selection Sort always performs O(n²) comparisons regardless of input order. It makes at most O(n) swaps, which is useful when writes are expensive."
                useCases={[
                    'Small datasets where simplicity matters',
                    'When memory writes are costly (minimizes swaps)',
                    'Teaching comparison-based sorting concepts',
                ]}
                timeComplexity="O(n²)"
                spaceComplexity="O(1)"
                complexityNotes="n = number of elements. Always O(n²) comparisons even if already sorted — no early exit."
                interviewTips={[
                    'Selection Sort is NOT stable — equal elements may change relative order.',
                    'Compare with Insertion Sort: Insertion is better for nearly-sorted data.',
                    'Mention that it makes at most n-1 swaps, unlike Bubble Sort.',
                    'Ask about stability requirements before choosing Selection Sort.',
                ]}
                color="blue"
            />
        </div>
    );
};

export default SelectionSortVisualizer;
