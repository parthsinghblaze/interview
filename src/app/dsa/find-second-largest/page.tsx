'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause, Code, Info, HelpCircle } from 'lucide-react';
import DSAExplanationModal from '../../components/DSAExplanationModal';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Step {
    description: string;
    phase: 'find-large' | 'find-second' | 'done';
    currentIndex: number;
    largeIndex: number;
    largeValue: number;
    secondLargeIndex: number;
    secondLargeValue: number;
    comparing: number;
    array: number[];
    completed?: boolean;
    jsLine: number;
    pyLine: number;
}

// ─── Algorithm Step Generator ─────────────────────────────────────────────────

const generateSteps = (arr: number[]): Step[] => {
    const steps: Step[] = [];
    let largeIdx = 0;
    let secondLargeIdx = 0;

    // ── Phase 1: find the large ──────────────────────────────────────────────
    steps.push({
        description: 'Phase 1 – Init: set large = numbers[0]',
        phase: 'find-large',
        currentIndex: 0,
        largeIndex: 0,
        largeValue: arr[0],
        secondLargeIndex: 0,
        secondLargeValue: arr[0],
        comparing: -1,
        array: arr,
        jsLine: 2,   // let large = numbers[0]
        pyLine: 2,
    });

    for (let i = 0; i < arr.length; i++) {
        const prev = steps[steps.length - 1];

        // comparing step
        steps.push({
            description: `Phase 1 – Comparing numbers[${i}]=${arr[i]} with large=${prev.largeValue}`,
            phase: 'find-large',
            currentIndex: i,
            largeIndex: prev.largeIndex,
            largeValue: prev.largeValue,
            secondLargeIndex: prev.secondLargeIndex,
            secondLargeValue: prev.secondLargeValue,
            comparing: i,
            array: arr,
            jsLine: 4,   // if(numbers[i] > large)
            pyLine: 4,
        });

        if (arr[i] > prev.largeValue) {
            largeIdx = i;
            steps.push({
                description: `Phase 1 – ${arr[i]} > ${prev.largeValue}! Update large = ${arr[i]}`,
                phase: 'find-large',
                currentIndex: i,
                largeIndex: i,
                largeValue: arr[i],
                secondLargeIndex: prev.secondLargeIndex,
                secondLargeValue: prev.secondLargeValue,
                comparing: -1,
                array: arr,
                jsLine: 5,   // large = numbers[i]
                pyLine: 5,
            });
        } else {
            steps.push({
                description: `Phase 1 – ${arr[i]} ≤ ${prev.largeValue}. Keep large = ${prev.largeValue}`,
                phase: 'find-large',
                currentIndex: i,
                largeIndex: prev.largeIndex,
                largeValue: prev.largeValue,
                secondLargeIndex: prev.secondLargeIndex,
                secondLargeValue: prev.secondLargeValue,
                comparing: -1,
                array: arr,
                jsLine: 4,
                pyLine: 4,
            });
        }
    }

    const afterPhase1 = steps[steps.length - 1];
    const finalLargeIdx = afterPhase1.largeIndex;
    const finalLargeValue = afterPhase1.largeValue;

    // ── Phase 2: find the second large ──────────────────────────────────────
    steps.push({
        description: `Phase 1 complete! large = ${finalLargeValue}. Starting Phase 2 – find second largest`,
        phase: 'find-second',
        currentIndex: 0,
        largeIndex: finalLargeIdx,
        largeValue: finalLargeValue,
        secondLargeIndex: 0,
        secondLargeValue: arr[0],
        comparing: -1,
        array: arr,
        jsLine: 9,   // let secondLarge = numbers[0]
        pyLine: 9,
    });

    secondLargeIdx = 0;
    let secondLargeValue = arr[0];

    for (let i = 0; i < arr.length; i++) {
        const prev = steps[steps.length - 1];

        steps.push({
            description: `Phase 2 – Comparing numbers[${i}]=${arr[i]} with secondLarge=${prev.secondLargeValue} (large=${finalLargeValue})`,
            phase: 'find-second',
            currentIndex: i,
            largeIndex: finalLargeIdx,
            largeValue: finalLargeValue,
            secondLargeIndex: prev.secondLargeIndex,
            secondLargeValue: prev.secondLargeValue,
            comparing: i,
            array: arr,
            jsLine: 11,  // if(numbers[i] > secondLarge && numbers[i] !== large)
            pyLine: 11,
        });

        if (arr[i] > secondLargeValue && arr[i] !== finalLargeValue) {
            secondLargeIdx = i;
            secondLargeValue = arr[i];
            steps.push({
                description: `Phase 2 – ${arr[i]} qualifies! Update secondLarge = ${arr[i]}`,
                phase: 'find-second',
                currentIndex: i,
                largeIndex: finalLargeIdx,
                largeValue: finalLargeValue,
                secondLargeIndex: i,
                secondLargeValue: arr[i],
                comparing: -1,
                array: arr,
                jsLine: 12,  // secondLarge = numbers[i]
                pyLine: 12,
            });
        } else {
            const reason = arr[i] === finalLargeValue
                ? `${arr[i]} equals large – skip`
                : `${arr[i]} ≤ ${prev.secondLargeValue} – skip`;
            steps.push({
                description: `Phase 2 – ${reason}. Keep secondLarge = ${secondLargeValue}`,
                phase: 'find-second',
                currentIndex: i,
                largeIndex: finalLargeIdx,
                largeValue: finalLargeValue,
                secondLargeIndex: secondLargeIdx,
                secondLargeValue: secondLargeValue,
                comparing: -1,
                array: arr,
                jsLine: 11,
                pyLine: 11,
            });
        }
    }

    // Final step
    steps.push({
        description: `Complete! Second Largest = ${secondLargeValue}`,
        phase: 'done',
        currentIndex: arr.length - 1,
        largeIndex: finalLargeIdx,
        largeValue: finalLargeValue,
        secondLargeIndex: secondLargeIdx,
        secondLargeValue: secondLargeValue,
        comparing: -1,
        array: arr,
        completed: true,
        jsLine: 17,  // return secondLarge
        pyLine: 16,
    });

    return steps;
};

// ─── Component ───────────────────────────────────────────────────────────────

const DEFAULT_ARRAY = [10, 9, 8, 12, 44];

const FindSecondLargestVisualizer = () => {
    // ── Array editing state ───────────────────────────────────────────────────
    const [liveArray, setLiveArray] = useState<number[]>(DEFAULT_ARRAY);
    const [inputText, setInputText] = useState(DEFAULT_ARRAY.join(', '));
    const [inputError, setInputError] = useState<string | null>(null);
    const [inputFocused, setInputFocused] = useState(false);

    // ── Visualizer state ──────────────────────────────────────────────────────
    const [steps, setSteps] = useState<Step[]>(() => generateSteps(DEFAULT_ARRAY));
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const stepData = steps[currentStep];
    const isCompleted = currentStep === steps.length - 1;

    // ── Parse & apply user input ──────────────────────────────────────────────
    const parseAndApply = useCallback(() => {
        const parts = inputText.split(',').map(s => s.trim()).filter(Boolean);
        const nums = parts.map(Number);

        if (parts.length === 0 || nums.some(isNaN)) {
            setInputError('Enter comma-separated numbers, e.g. 10, 9, 8, 12, 44');
            return;
        }
        if (nums.length < 2) {
            setInputError('Need at least 2 numbers to find a second largest');
            return;
        }
        if (nums.some(n => n <= 0 || n > 200)) {
            setInputError('Use positive numbers ≤ 200 for best display');
            return;
        }

        setInputError(null);
        setLiveArray(nums);
        setSteps(generateSteps(nums));
        setCurrentStep(0);
        setIsPlaying(false);
    }, [inputText]);

    // ── Code (reflect live array) ─────────────────────────────────────────────

    const arrLiteral = `[${liveArray.join(', ')}]`;
    const secondLargestResult = stepData.secondLargeValue;

    const jsCode = [
        `const numbers = ${arrLiteral};`,
        '',
        'function findSecondLargestNumber(numbers) {',
        '    let large = numbers[0];',
        '    let secondLarge = numbers[0];',
        '',
        '    // Pass 1: find the largest',
        '    for (let i = 0; i < numbers.length; i++) {',
        '        if (numbers[i] > large) {',
        '            large = numbers[i];',
        '        }',
        '    }',
        '',
        '    // Pass 2: find the second largest',
        '    for (let i = 0; i < numbers.length; i++) {',
        '        if (numbers[i] > secondLarge && numbers[i] !== large) {',
        '            secondLarge = numbers[i];',
        '        }',
        '    }',
        '',
        '    return secondLarge;',
        '}',
        '',
        `console.log(findSecondLargestNumber(numbers)); // ${secondLargestResult}`,
    ];

    const pyCode = [
        `numbers = ${arrLiteral}`,
        '',
        'def find_second_largest(numbers):',
        '    large = numbers[0]',
        '    second_large = numbers[0]',
        '',
        '    # Pass 1: find the largest',
        '    for num in numbers:',
        '        if num > large:',
        '            large = num',
        '',
        '    # Pass 2: find the second largest',
        '    for num in numbers:',
        '        if num > second_large and num != large:',
        '            second_large = num',
        '',
        '    return second_large',
        '',
        `print(find_second_largest(numbers))  # ${secondLargestResult}`,
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
            if (s.completed) {
                playTone(600, 'sine', 0.1);
                setTimeout(() => playTone(800, 'sine', 0.3), 100);
            } else if (s.comparing !== -1) {
                playTone(200, 'sine', 0.05);
            } else if (s.description.includes('Update')) {
                playTone(440, 'triangle', 0.1);
            }
        }

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps]);

    // ── Bar colour helper ─────────────────────────────────────────────────────

    // Scale bar height relative to max value in the live array
    const maxVal = Math.max(...liveArray);
    const barHeight = (value: number) => Math.max(30, Math.round((value / maxVal) * 200));

    const getBarClass = (idx: number) => {
        const isLarge = idx === stepData.largeIndex && stepData.largeValue === stepData.array[idx];
        const isSecond = idx === stepData.secondLargeIndex && !isLarge;
        const isComparing = idx === stepData.comparing;

        if (stepData.phase === 'find-large') {
            if (isLarge) return 'from-amber-600 to-amber-400 shadow-lg shadow-amber-500/50';
            if (isComparing) return 'from-yellow-600 to-yellow-400 shadow-lg shadow-yellow-500/50';
            if (idx < stepData.currentIndex) return 'from-slate-600 to-slate-500';
            return 'from-violet-600 to-violet-400';
        }

        // Phase 2 or done
        if (isLarge) return 'from-amber-600 to-amber-400 shadow-lg shadow-amber-500/50';
        if (isSecond) return 'from-green-600 to-green-400 shadow-lg shadow-green-500/50';
        if (isComparing) return 'from-sky-600 to-sky-400 shadow-lg shadow-sky-500/50';
        if (idx < stepData.currentIndex) return 'from-slate-600 to-slate-500';
        return 'from-violet-600 to-violet-400';
    };

    const getLabelClass = (idx: number) => {
        const isLarge = idx === stepData.largeIndex && stepData.largeValue === stepData.array[idx];
        const isSecond = idx === stepData.secondLargeIndex && !isLarge;
        const isComparing = idx === stepData.comparing;

        if (stepData.phase === 'find-large') {
            if (isLarge) return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
            if (isComparing) return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
            return 'bg-slate-800 text-slate-400';
        }
        if (isLarge) return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
        if (isSecond) return 'bg-green-500/20 text-green-400 border border-green-500/30';
        if (isComparing) return 'bg-sky-500/20 text-sky-400 border border-sky-500/30';
        return 'bg-slate-800 text-slate-400';
    };

    const getLabel = (idx: number) => {
        const isLarge = idx === stepData.largeIndex && stepData.largeValue === stepData.array[idx];
        const isSecond = idx === stepData.secondLargeIndex && !isLarge;
        const isComparing = idx === stepData.comparing;

        if (stepData.phase === 'find-large') {
            if (isLarge) return 'LARGE';
            if (isComparing) return 'CURR';
            return `[${idx}]`;
        }
        if (isLarge) return 'LARGE';
        if (isSecond) return '2nd';
        if (isComparing) return 'CURR';
        return `[${idx}]`;
    };

    // ── Phase badge ───────────────────────────────────────────────────────────

    const phaseBadge = stepData.phase === 'find-large'
        ? { label: 'Pass 1 – Find Largest', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' }
        : stepData.phase === 'find-second'
            ? { label: 'Pass 2 – Find 2nd Largest', color: 'bg-sky-500/20 text-sky-300 border-sky-500/40' }
            : { label: 'Complete!', color: 'bg-green-500/20 text-green-300 border-green-500/40' };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-violet-500/30">
            <Header />

            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-950 to-black pt-20 pb-6 px-4 md:px-6">
                {/* Background decoration */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none" />

                <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 relative z-10">

                    {/* ── LEFT COLUMN ───────────────────────────────────────── */}
                    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">

                        {/* Controller Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                    Find 2nd Largest
                                </h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-2 rounded-full bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors"
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
                            <div className={`bg-slate-800/50 rounded-2xl p-4 border transition-all duration-200 mb-4 ${inputError ? 'border-red-500/50' : inputFocused ? 'border-violet-500/50' : 'border-white/5'
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
                                        placeholder="e.g. 10, 9, 8, 12, 44"
                                        className="flex-1 min-w-0 bg-slate-900/70 border border-white/10 rounded-xl px-3 py-2 font-mono text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/60 transition-colors"
                                    />
                                    <button
                                        onClick={parseAndApply}
                                        className="shrink-0 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-xs font-bold tracking-wide transition-all shadow-lg shadow-violet-900/40"
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

                            {/* Phase indicator */}
                            <div className={`mb-4 px-3 py-2 rounded-xl border text-sm font-semibold text-center transition-all duration-300 ${phaseBadge.color}`}>
                                {phaseBadge.label}
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
                                    className={`p-3 rounded-xl ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-violet-600 hover:bg-violet-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-violet-900/30`}
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
                                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Code Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex-1 flex flex-col min-h-[300px]">
                            <div className="flex items-center gap-2 mb-4 text-violet-400">
                                <Code size={18} />
                                <h3 className="font-bold text-sm uppercase tracking-wider">Algorithm Code</h3>
                            </div>

                            <div className="relative flex-1 min-h-0 flex flex-col">
                                {/* Language Toggle */}
                                <div className="absolute top-0 right-0 p-2 z-10 w-full flex justify-end pointer-events-none">
                                    <div className="flex bg-slate-900/80 rounded p-1 border border-white/10 backdrop-blur-sm pointer-events-auto">
                                        <button
                                            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${language === 'javascript' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                            onClick={() => setLanguage('javascript')}
                                        >JS</button>
                                        <button
                                            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${language === 'python' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
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
                                                        backgroundColor: isActive ? 'rgba(139, 92, 246, 0.15)' : undefined,
                                                        display: 'block',
                                                        width: '100%',
                                                        borderLeft: isActive ? '3px solid #8b5cf6' : '3px solid transparent',
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
                                    className="inline-block bg-slate-800/80 border border-violet-500/30 rounded-2xl md:rounded-full px-4 md:px-6 py-2 shadow-lg"
                                >
                                    <p className="text-sm md:text-lg font-medium text-violet-100 flex items-center gap-3">
                                        <Info size={18} className="text-violet-400 shrink-0" />
                                        {stepData.description}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Radial glow */}
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.07),transparent_70%)] pointer-events-none" />

                            {/* Bar Chart */}
                            <div className="flex-1 w-full flex items-center justify-center relative z-10 overflow-x-auto pt-10 pb-8 custom-scrollbar">
                                <div className="flex gap-4 md:gap-6 items-end px-4 min-w-max">
                                    <AnimatePresence>
                                        {stepData.array.map((value, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{
                                                    scale: idx === stepData.comparing ? 1.15 : 1,
                                                    opacity: 1,
                                                }}
                                                className="flex flex-col items-center gap-2"
                                            >
                                                {/* Bar */}
                                                <div
                                                    className={`w-14 md:w-20 rounded-t-xl flex items-end justify-center pb-2 transition-all duration-300 bg-gradient-to-t ${getBarClass(idx)}`}
                                                    style={{ height: `${barHeight(value)}px` }}
                                                >
                                                    <span className="text-white font-bold text-base md:text-xl">{value}</span>
                                                </div>

                                                {/* Label */}
                                                <div className={`text-[10px] md:text-xs font-mono px-1 md:px-2 py-0.5 md:py-1 rounded ${getLabelClass(idx)}`}>
                                                    {getLabel(idx)}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Completion Badge */}
                            {isCompleted && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="mt-6 flex flex-col items-center gap-3 relative z-20"
                                >
                                    <div className="px-6 py-3 bg-amber-500/20 border border-amber-500/50 text-amber-300 rounded-full font-bold text-xl shadow-lg shadow-amber-500/20">
                                        Largest = {stepData.largeValue}
                                    </div>
                                    <div className="px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-300 rounded-full font-bold text-xl shadow-lg shadow-green-500/20">
                                        2nd Largest = {stepData.secondLargeValue}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Stats Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl sticky bottom-4 lg:relative lg:bottom-0">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Largest</span>
                                    <span className="text-xl md:text-3xl font-bold text-amber-400">{stepData.largeValue}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">2nd Largest</span>
                                    <span className="text-xl md:text-3xl font-bold text-green-400">{stepData.secondLargeValue}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Phase</span>
                                    <span className="text-sm md:text-base font-bold text-violet-400 text-center">
                                        {stepData.phase === 'find-large' ? 'Pass 1' : stepData.phase === 'find-second' ? 'Pass 2' : 'Done'}
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
                title="Find Second Largest Number"
                description="A classic two-pass linear scan algorithm to find the second largest unique element in an unsorted array."
                concept="The algorithm runs two separate loops. Pass 1 iterates the entire array to determine the absolute maximum. Pass 2 iterates again to find the largest value that is strictly less than the maximum found in Pass 1. This guarantees correctness even when duplicate values exist."
                efficiency="Two full iterations are performed, giving O(2n) which simplifies to O(n). Only two variables (large, secondLarge) are used for tracking, so space is O(1)."
                useCases={[
                    'Finding the runner-up score in a leaderboard',
                    'Selecting the second highest bid in an auction',
                    'Ranking algorithms where duplicates must be handled',
                ]}
                timeComplexity="O(n)"
                spaceComplexity="O(1)"
                complexityNotes="n = Number of elements in the array. Two passes are made but constant (O(1)) extra space is used."
                interviewTips={[
                    'Ask whether the array can contain duplicates – this algorithm handles them correctly via the !== check.',
                    'Discuss a single-pass alternative that tracks both max and secondMax simultaneously.',
                    'Ask about edge cases: empty array, single element, all identical elements.',
                    'Mention that sorting O(n log n) also works but is suboptimal here.',
                ]}
                color="purple"
            />
        </div>
    );
};

export default FindSecondLargestVisualizer;
