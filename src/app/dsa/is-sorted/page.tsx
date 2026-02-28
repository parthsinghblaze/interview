'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    ChevronLeft, ChevronRight, RotateCcw, Play, Pause,
    Code, Info, HelpCircle,
} from 'lucide-react';
import DSAExplanationModal from '../../components/DSAExplanationModal';
import Header from '../../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step {
    description: string;
    currentIndex: number;       // i (left bar of comparison)
    nextIndex: number;          // i+1 (right bar)
    isBroken: boolean;          // true when numbers[i] > numbers[i+1]
    visitedUpTo: number;        // bars left of currentIndex already validated
    array: number[];
    result: boolean | null;     // null = not decided yet
    completed: boolean;
    jsLine: number;
    pyLine: number;
}

// ─── Step Generator ───────────────────────────────────────────────────────────

const generateSteps = (arr: number[]): Step[] => {
    const steps: Step[] = [];

    // init step
    steps.push({
        description: 'Start: begin comparing adjacent pairs from index 0',
        currentIndex: 0,
        nextIndex: 1,
        isBroken: false,
        visitedUpTo: -1,
        array: arr,
        result: null,
        completed: false,
        jsLine: 3,   // for loop header
        pyLine: 3,
    });

    for (let i = 0; i < arr.length - 1; i++) {
        // comparing step
        steps.push({
            description: `Comparing numbers[${i}]=${arr[i]} with numbers[${i + 1}]=${arr[i + 1]}`,
            currentIndex: i,
            nextIndex: i + 1,
            isBroken: false,
            visitedUpTo: i - 1,
            array: arr,
            result: null,
            completed: false,
            jsLine: 5,   // if(numbers[i] > numbers[i+1])
            pyLine: 5,
        });

        if (arr[i] > arr[i + 1]) {
            // out-of-order found
            steps.push({
                description: `${arr[i]} > ${arr[i + 1]}  →  NOT sorted! Return false`,
                currentIndex: i,
                nextIndex: i + 1,
                isBroken: true,
                visitedUpTo: i - 1,
                array: arr,
                result: false,
                completed: true,
                jsLine: 6,   // return false
                pyLine: 6,
            });
            return steps;
        } else {
            steps.push({
                description: `${arr[i]} ≤ ${arr[i + 1]}  →  OK, move to next pair`,
                currentIndex: i + 1,
                nextIndex: i + 2 < arr.length ? i + 2 : i + 1,
                isBroken: false,
                visitedUpTo: i,
                array: arr,
                result: null,
                completed: false,
                jsLine: 3,
                pyLine: 3,
            });
        }
    }

    // All pairs passed
    steps.push({
        description: 'All adjacent pairs are in order  →  Array IS sorted! Return true',
        currentIndex: arr.length - 1,
        nextIndex: arr.length - 1,
        isBroken: false,
        visitedUpTo: arr.length - 1,
        array: arr,
        result: true,
        completed: true,
        jsLine: 10,  // return true
        pyLine: 10,
    });

    return steps;
};

// ─── Component ────────────────────────────────────────────────────────────────

const DEFAULT_ARRAY = [1, 2, 3, 4, 5, 6, 7];

const IsSortedVisualizer = () => {

    // ── Array editing state ────────────────────────────────────────────────────
    const [liveArray, setLiveArray] = useState<number[]>(DEFAULT_ARRAY);
    const [inputText, setInputText] = useState(DEFAULT_ARRAY.join(', '));
    const [inputError, setInputError] = useState<string | null>(null);
    const [inputFocused, setInputFocused] = useState(false);

    // ── Visualizer state ───────────────────────────────────────────────────────
    const [steps, setSteps] = useState<Step[]>(() => generateSteps(DEFAULT_ARRAY));
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const stepData = steps[currentStep];
    const isCompleted = stepData.completed;

    // ── Parse & apply ──────────────────────────────────────────────────────────
    const parseAndApply = useCallback(() => {
        const parts = inputText.split(',').map(s => s.trim()).filter(Boolean);
        const nums = parts.map(Number);

        if (parts.length === 0 || nums.some(isNaN)) {
            setInputError('Enter comma-separated numbers, e.g. 1, 2, 3, 4, 5');
            return;
        }
        if (nums.length < 2) {
            setInputError('Need at least 2 numbers to check sorting');
            return;
        }
        if (nums.some(n => n < 0 || n > 200)) {
            setInputError('Use numbers between 0 and 200 for best display');
            return;
        }

        setInputError(null);
        setLiveArray(nums);
        setSteps(generateSteps(nums));
        setCurrentStep(0);
        setIsPlaying(false);
    }, [inputText]);

    // ── Code ──────────────────────────────────────────────────────────────────
    const arrLiteral = `[${liveArray.join(', ')}]`;
    const resultStr = stepData.result === null ? '...' : stepData.result ? 'true' : 'false';

    const jsCode = [
        `const numbers = ${arrLiteral};`,
        '',
        'function isSorted(numbers) {',
        '    for (let i = 0; i < numbers.length - 1; i++) {',
        '        console.log("i", numbers[i], numbers[i + 1]);',
        '        if (numbers[i] > numbers[i + 1]) {',
        '            return false;',
        '        }',
        '    }',
        '    return true;',
        '}',
        '',
        `console.log(isSorted(numbers)); // ${resultStr}`,
    ];

    const pyCode = [
        `numbers = ${arrLiteral}`,
        '',
        'def is_sorted(numbers):',
        '    for i in range(len(numbers) - 1):',
        '        print("i", numbers[i], numbers[i + 1])',
        '        if numbers[i] > numbers[i + 1]:',
        '            return False',
        '    return True',
        '',
        `print(is_sorted(numbers))  # ${resultStr}`,
    ];

    const code = language === 'javascript' ? jsCode : pyCode;
    const currentLine = language === 'javascript' ? stepData.jsLine : stepData.pyLine;

    // ── Sound ─────────────────────────────────────────────────────────────────
    const playTone = (freq: number, type: OscillatorType = 'sine', duration = 0.1) => {
        try {
            const AC = window.AudioContext || (window as any).webkitAudioContext;
            if (!AC) return;
            const ctx = new AC();
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
        } catch { /* ignore */ }
    };

    // ── Playback ──────────────────────────────────────────────────────────────
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
            const s = steps[currentStep];
            if (s.completed && s.result === true) {
                playTone(600, 'sine', 0.1);
                setTimeout(() => playTone(800, 'sine', 0.3), 100);
            } else if (s.completed && s.result === false) {
                playTone(180, 'square', 0.15);
            } else if (s.isBroken) {
                playTone(150, 'square', 0.1);
            } else {
                playTone(300, 'sine', 0.05);
            }
        }

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps]);

    // ── Bar styling ───────────────────────────────────────────────────────────
    const maxVal = Math.max(...liveArray, 1);
    const barHeight = (v: number) => Math.max(30, Math.round((v / maxVal) * 200));

    const getBarClass = (idx: number) => {
        const { currentIndex, nextIndex, isBroken, visitedUpTo, completed, result } = stepData;

        if (completed && result === true) return 'from-emerald-600 to-emerald-400 shadow-lg shadow-emerald-500/50';
        if (completed && result === false) {
            if (idx === currentIndex || idx === nextIndex) return 'from-red-600 to-red-400 shadow-lg shadow-red-500/50';
            if (idx <= visitedUpTo) return 'from-emerald-700 to-emerald-500';
            return 'from-slate-600 to-slate-500';
        }

        if (idx === currentIndex || idx === nextIndex) {
            return isBroken
                ? 'from-red-600 to-red-400 shadow-lg shadow-red-500/50'
                : 'from-sky-500 to-sky-300 shadow-lg shadow-sky-500/40';
        }
        if (idx <= visitedUpTo) return 'from-emerald-700 to-emerald-500';
        return 'from-teal-700 to-teal-500';
    };

    const getLabelClass = (idx: number) => {
        const { currentIndex, nextIndex, isBroken, visitedUpTo, completed, result } = stepData;

        if (completed && result === true) return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        if (completed && result === false) {
            if (idx === currentIndex || idx === nextIndex) return 'bg-red-500/20 text-red-400 border border-red-500/30';
        }
        if (idx === currentIndex || idx === nextIndex) {
            return isBroken
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-sky-500/20 text-sky-300 border border-sky-500/30';
        }
        if (idx <= visitedUpTo) return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
        return 'bg-slate-800 text-slate-400';
    };

    const getLabel = (idx: number) => {
        const { currentIndex, nextIndex, isBroken, visitedUpTo, completed, result } = stepData;
        if (completed && result === true) return '✓';
        if (idx === currentIndex && isBroken) return 'ERR';
        if (idx === nextIndex && isBroken) return 'ERR';
        if (idx === currentIndex) return '[i]';
        if (idx === nextIndex) return '[i+1]';
        if (idx <= visitedUpTo) return '✓';
        return `[${idx}]`;
    };

    // ── Connector arrow between compared pair ─────────────────────────────────
    const showConnector = !stepData.completed &&
        stepData.nextIndex < stepData.array.length &&
        stepData.nextIndex !== stepData.currentIndex;

    // ── Result banner ──────────────────────────────────────────────────────────
    const resultBanner = stepData.completed
        ? stepData.result === true
            ? { label: '✅  Array IS Sorted', cls: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-emerald-500/20' }
            : { label: '❌  Array is NOT Sorted', cls: 'bg-red-500/20 border-red-500/50 text-red-300 shadow-red-500/20' }
        : null;

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-teal-500/30">
            <Header />

            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-950 to-black pt-20 pb-6 px-4 md:px-6">
                {/* Background decoration */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none" />

                <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 relative z-10">

                    {/* ── LEFT COLUMN ───────────────────────────────────────── */}
                    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">

                        {/* Controller Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">

                            {/* Title row */}
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                                    Is Array Sorted?
                                </h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-2 rounded-full bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-colors"
                                        title="Algorithm Explanation"
                                    >
                                        <HelpCircle size={20} />
                                    </button>
                                    <div className="px-2 py-1 rounded bg-slate-800 border border-white/10 text-xs font-mono text-slate-400">
                                        v1.0
                                    </div>
                                </div>
                            </div>

                            {/* Editable Input Array */}
                            <div className={`bg-slate-800/50 rounded-2xl p-4 border transition-all duration-200 mb-4 ${inputError ? 'border-red-500/50' : inputFocused ? 'border-teal-500/50' : 'border-white/5'
                                }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-slate-400 font-medium">Input Array</span>
                                    <span className="text-xs text-slate-500 font-mono">{liveArray.length} elements</span>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={e => { setInputText(e.target.value); setInputError(null); }}
                                        onFocus={() => setInputFocused(true)}
                                        onBlur={() => setInputFocused(false)}
                                        onKeyDown={e => e.key === 'Enter' && parseAndApply()}
                                        placeholder="e.g. 1, 2, 3, 4, 5"
                                        className="flex-1 min-w-0 bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 font-mono text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/60 transition-colors"
                                    />
                                    <button
                                        onClick={parseAndApply}
                                        className="shrink-0 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 active:scale-95 text-white text-xs font-bold tracking-wide transition-all shadow-lg shadow-teal-900/40"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {inputError ? (
                                    <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                                        <span>⚠</span> {inputError}
                                    </p>
                                ) : (
                                    <p className="mt-2 text-[10px] text-slate-600">Separate numbers with commas · Press Enter or Apply</p>
                                )}
                            </div>

                            {/* Playback Controls */}
                            <div className="grid grid-cols-4 gap-2">
                                <button
                                    onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
                                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center justify-center"
                                    title="Reset"
                                >
                                    <RotateCcw size={20} />
                                </button>
                                <button
                                    onClick={() => { if (currentStep > 0) setCurrentStep(s => s - 1); }}
                                    disabled={currentStep === 0}
                                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"
                                    title="Previous Step"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={() => setIsPlaying(p => !p)}
                                    disabled={isCompleted}
                                    className={`p-3 rounded-xl ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-teal-600 hover:bg-teal-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-teal-900/30`}
                                    title={isPlaying ? 'Pause' : 'Play'}
                                >
                                    {isPlaying
                                        ? <Pause size={24} className="fill-current" />
                                        : <Play size={24} className="fill-current ml-1" />}
                                </button>
                                <button
                                    onClick={() => { if (currentStep < steps.length - 1) setCurrentStep(s => s + 1); }}
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
                                    <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-500"
                                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Code Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex-1 flex flex-col min-h-[300px]">
                            <div className="flex items-center gap-2 mb-4 text-teal-400">
                                <Code size={18} />
                                <h3 className="font-bold text-sm uppercase tracking-wider">Algorithm Code</h3>
                            </div>

                            <div className="relative flex-1 min-h-0 flex flex-col">
                                {/* Language Toggle */}
                                <div className="absolute top-0 right-0 p-2 z-10 w-full flex justify-end pointer-events-none">
                                    <div className="flex bg-slate-900/80 rounded p-1 border border-white/10 backdrop-blur-sm pointer-events-auto">
                                        <button
                                            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${language === 'javascript' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                            onClick={() => setLanguage('javascript')}
                                        >JS</button>
                                        <button
                                            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${language === 'python' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
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
                                                fontSize: '0.85rem',
                                                lineHeight: '1.6',
                                                backgroundColor: '#1e1e1e',
                                                fontFamily: 'var(--font-mono)',
                                            }}
                                            lineNumberStyle={{ minWidth: '2em', paddingRight: '1em', color: '#6e7681', textAlign: 'right' }}
                                            lineProps={(lineNumber: number) => {
                                                const isActive = lineNumber === currentLine + 1;
                                                return {
                                                    style: {
                                                        backgroundColor: isActive ? 'rgba(20,184,166,0.15)' : undefined,
                                                        display: 'block',
                                                        width: '100%',
                                                        borderLeft: isActive ? '3px solid #14b8a6' : '3px solid transparent',
                                                        paddingLeft: '1rem',
                                                    },
                                                };
                                            }}
                                        >
                                            {code.join('\n')}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN ──────────────────────────────────────── */}
                    <div className="flex flex-col gap-6">

                        {/* Visualization Stage */}
                        <div className="min-h-[500px] lg:flex-grow bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-4 md:p-8 relative overflow-visible flex flex-col items-center">

                            {/* Step description */}
                            <div className="w-full text-center mb-8 relative z-20">
                                <motion.div
                                    key={stepData.description}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-block bg-slate-800/80 border border-teal-500/30 rounded-2xl md:rounded-full px-4 md:px-6 py-2 shadow-lg"
                                >
                                    <p className="text-sm md:text-lg font-medium text-teal-100 flex items-center gap-3">
                                        <Info size={18} className="text-teal-400 shrink-0" />
                                        {stepData.description}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Radial glow */}
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.07),transparent_70%)] pointer-events-none" />

                            {/* Bar Chart */}
                            <div className="flex-1 w-full flex items-center justify-center relative z-10 overflow-x-auto pt-10 pb-8 custom-scrollbar">
                                <div className="flex gap-3 md:gap-5 items-end px-4 min-w-max">
                                    <AnimatePresence>
                                        {stepData.array.map((value, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{
                                                    scale: (idx === stepData.currentIndex || idx === stepData.nextIndex) ? 1.12 : 1,
                                                    opacity: 1,
                                                }}
                                                className="flex flex-col items-center gap-2"
                                            >
                                                {/* Bar */}
                                                <div
                                                    className={`w-12 md:w-16 rounded-t-xl flex items-end justify-center pb-2 transition-all duration-300 bg-gradient-to-t ${getBarClass(idx)}`}
                                                    style={{ height: `${barHeight(value)}px` }}
                                                >
                                                    <span className="text-white font-bold text-sm md:text-lg">{value}</span>
                                                </div>

                                                {/* Label */}
                                                <div className={`text-[9px] md:text-xs font-mono px-1 md:px-2 py-0.5 rounded whitespace-nowrap ${getLabelClass(idx)}`}>
                                                    {getLabel(idx)}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Comparison arrow hint */}
                            {showConnector && (
                                <motion.div
                                    key={`conn-${stepData.currentIndex}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`mt-2 px-5 py-2 rounded-full text-xs font-semibold border ${stepData.isBroken
                                            ? 'bg-red-500/10 border-red-500/30 text-red-300'
                                            : 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                                        }`}
                                >
                                    {stepData.isBroken
                                        ? `numbers[${stepData.currentIndex}] (${stepData.array[stepData.currentIndex]}) > numbers[${stepData.nextIndex}] (${stepData.array[stepData.nextIndex]}) ← out of order!`
                                        : `numbers[${stepData.currentIndex}] (${stepData.array[stepData.currentIndex]}) ≤ numbers[${stepData.nextIndex}] (${stepData.array[stepData.nextIndex]}) ← OK`
                                    }
                                </motion.div>
                            )}

                            {/* Result badge */}
                            {resultBanner && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className={`mt-6 px-8 py-4 border rounded-full font-bold text-2xl shadow-lg ${resultBanner.cls} relative z-20`}
                                >
                                    {resultBanner.label}
                                </motion.div>
                            )}
                        </div>

                        {/* Stats Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl sticky bottom-4 lg:relative lg:bottom-0">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Comparing</span>
                                    <span className="text-base md:text-xl font-bold text-sky-400 font-mono">
                                        {stepData.completed ? '—' : `[${stepData.currentIndex}] vs [${stepData.nextIndex}]`}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Checked</span>
                                    <span className="text-xl md:text-3xl font-bold text-teal-400">
                                        {stepData.visitedUpTo + 1}/{liveArray.length}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Result</span>
                                    <span className={`text-xl md:text-2xl font-bold ${stepData.result === null ? 'text-slate-500' :
                                            stepData.result ? 'text-emerald-400' : 'text-red-400'
                                        }`}>
                                        {stepData.result === null ? '...' : stepData.result ? 'true' : 'false'}
                                    </span>
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
                title="Is Array Sorted?"
                description="A single-pass linear scan that checks whether every adjacent pair of elements is in non-decreasing order."
                concept="Loop through the array comparing each element with its immediate neighbor. The moment we find a pair where numbers[i] > numbers[i+1], we know the array is NOT sorted and return false immediately (early exit). If the loop completes without finding such a pair, the array IS sorted and we return true."
                efficiency="Because we exit as soon as an inversion is found, the best case is O(1) (first pair is out of order). The worst & average case is O(n) — a single full traversal. No extra space is used."
                useCases={[
                    'Validating pre-sorted input before running binary search',
                    'Checking if a stream of sensor readings is monotonically increasing',
                    'Input sanitization in sorting benchmarks',
                ]}
                timeComplexity="O(n)"
                spaceComplexity="O(1)"
                complexityNotes="Best case O(1) with early exit. Worst case O(n-1) comparisons when the array is sorted."
                interviewTips={[
                    'Ask whether "sorted" means ascending, descending, or both — clarify the requirement.',
                    'Mention the early-exit optimisation: return false as soon as one inversion is found.',
                    'Discuss descending sort: change the condition to numbers[i] < numbers[i+1].',
                    'Edge cases: empty array and single-element array are always considered sorted.',
                ]}
                color="green"
            />
        </div>
    );
};

export default IsSortedVisualizer;
