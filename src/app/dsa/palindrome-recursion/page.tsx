'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft, ChevronRight, RotateCcw, Play, Pause,
    Code, Info, HelpCircle, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../../components/Header';
import DSAExplanationModal from '../../components/DSAExplanationModal';

interface StackFrame {
    args: string;
    start: number;
    end: number;
}

interface Step {
    description: string;
    stack: StackFrame[];
    leftIdx: number;
    rightIdx: number;
    result: boolean | null;
    jsLine: number;
    pyLine: number;
    type: 'call' | 'base' | 'check' | 'return' | 'complete';
    completed?: boolean;
}

const TEXT = 'racecar';

const PalindromeRecursionVisualizer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');

    const generateSteps = (): Step[] => {
        const steps: Step[] = [];
        const stack: StackFrame[] = [];

        const recurse = (start: number, end: number): boolean => {
            const frame: StackFrame = { args: `start=${start}, end=${end}`, start, end };

            // Function call step
            steps.push({
                description: `Call palindrom("${TEXT}", ${start}, ${end})`,
                stack: [...stack, frame],
                leftIdx: start,
                rightIdx: end,
                result: null,
                jsLine: 1,
                pyLine: 1,
                type: 'call',
            });

            // Base case check
            steps.push({
                description: `Is start (${start}) > end (${end})? ${start > end ? 'Yes → True' : 'No → continue'}`,
                stack: [...stack, frame],
                leftIdx: start,
                rightIdx: end,
                result: null,
                jsLine: 2,
                pyLine: 2,
                type: 'base',
            });

            if (start > end) {
                steps.push({
                    description: `Base case met! All characters matched → return True`,
                    stack: [...stack, frame],
                    leftIdx: start,
                    rightIdx: end,
                    result: true,
                    jsLine: 3,
                    pyLine: 3,
                    type: 'return',
                });
                return true;
            }

            // Character comparison
            const leftChar = TEXT[start];
            const rightChar = TEXT[end];
            const match = leftChar === rightChar;

            steps.push({
                description: `Compare "${leftChar}" (idx ${start}) with "${rightChar}" (idx ${end}) → ${match ? 'Match! ✓' : 'Mismatch! ✗'}`,
                stack: [...stack, frame],
                leftIdx: start,
                rightIdx: end,
                result: null,
                jsLine: 5,
                pyLine: 5,
                type: 'check',
            });

            if (!match) {
                steps.push({
                    description: `Mismatch found! "${leftChar}" ≠ "${rightChar}" → return False`,
                    stack: [...stack, frame],
                    leftIdx: start,
                    rightIdx: end,
                    result: false,
                    jsLine: 8,
                    pyLine: 8,
                    type: 'return',
                });
                return false;
            }

            // Recurse
            stack.push(frame);
            steps.push({
                description: `Match! Recurse inward → palindrom("${TEXT}", ${start + 1}, ${end - 1})`,
                stack: [...stack],
                leftIdx: start,
                rightIdx: end,
                result: null,
                jsLine: 6,
                pyLine: 6,
                type: 'call',
            });

            const res = recurse(start + 1, end - 1);
            stack.pop();

            steps.push({
                description: `Returning ${res} from call (start=${start}) back to caller`,
                stack: [...stack],
                leftIdx: start,
                rightIdx: end,
                result: res,
                jsLine: 6,
                pyLine: 6,
                type: 'return',
            });

            return res;
        };

        recurse(0, TEXT.length - 1);

        steps.push({
            description: `✅ Execution complete! "${TEXT}" is a palindrome → True`,
            stack: [],
            leftIdx: -1,
            rightIdx: -1,
            result: true,
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
        stack: [],
        leftIdx: 0,
        rightIdx: TEXT.length - 1,
        result: null,
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
        }, 800);

        if (isPlaying || currentStep > 0) {
            const step = steps[currentStep];
            if (step?.completed) {
                playTone(600, 'sine', 0.1);
                setTimeout(() => playTone(800, 'sine', 0.3), 100);
            } else if (step?.type === 'check') {
                playTone(step.result === false ? 200 : 500, 'triangle', 0.1);
            } else if (step?.type === 'call') {
                playTone(400, 'sine', 0.08);
            } else if (step?.type === 'return') {
                playTone(300, 'sine', 0.08);
            }
        }

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps]);

    const handleNext = () => { if (currentStep < steps.length - 1) setCurrentStep(s => s + 1); };
    const handlePrevious = () => { if (currentStep > 0) setCurrentStep(s => s - 1); };
    const handleReset = () => { setCurrentStep(0); setIsPlaying(false); };

    const codeJs = [
        'function palindrom(text, start, end) {',
        '  if (start > end) {',
        '    return true;',
        '  }',
        '  if (text[start] === text[end]) {',
        '    return palindrom(text, start + 1, end - 1);',
        '  }',
        '  return false;',
        '}',
    ];

    const codePy = [
        'def palindrom(text, start, end):',
        '    if start > end:',
        '        return True',
        '    ',
        '    if text[start] == text[end]:',
        '        return palindrom(text, start + 1, end - 1)',
        '    ',
        '    return False',
    ];

    const code = language === 'javascript' ? codeJs : codePy;
    const activeLine = language === 'javascript' ? currentStepData.jsLine : currentStepData.pyLine;

    const stepTypeColor: Record<string, string> = {
        call: 'text-fuchsia-300',
        base: 'text-amber-300',
        check: 'text-cyan-300',
        return: 'text-emerald-300',
        complete: 'text-green-300',
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-fuchsia-500/30">
            <Header />

            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900/20 via-slate-950 to-black pt-20 pb-6 px-4 md:px-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />

                <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 relative z-10">

                    {/* ── LEFT COLUMN ── */}
                    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">

                        {/* Controller Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                                    Palindrome Recursion
                                </h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-2 rounded-full bg-fuchsia-500/10 text-fuchsia-400 hover:bg-fuchsia-500/20 transition-colors"
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
                                    <span className="text-sm text-slate-400 font-medium">Input String</span>
                                    <span className="text-xs text-slate-500 font-mono">{TEXT.length} chars</span>
                                </div>
                                <div className="font-mono text-lg text-white tracking-widest">"{TEXT}"</div>
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
                                    className={`p-3 rounded-xl ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-fuchsia-600 hover:bg-fuchsia-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-fuchsia-900/20`}
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
                                        className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-500"
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
                                <div className="flex items-center gap-2 text-fuchsia-400">
                                    <Code size={18} />
                                    <h3 className="font-bold text-sm uppercase tracking-wider">Algorithm Code</h3>
                                </div>
                                <div className="flex bg-slate-900/80 rounded p-1 border border-white/10">
                                    <button
                                        className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${language === 'javascript' ? 'bg-fuchsia-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                        onClick={() => setLanguage('javascript')}
                                    >JS</button>
                                    <button
                                        className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${language === 'python' ? 'bg-fuchsia-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
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
                                                backgroundColor: lineNumber === activeLine ? 'rgba(232, 121, 249, 0.15)' : undefined,
                                                display: 'block',
                                                width: '100%',
                                                borderLeft: lineNumber === activeLine ? '3px solid #e879f9' : '3px solid transparent',
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
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(232,121,249,0.08),transparent_70%)] pointer-events-none" />

                            {/* Step Description */}
                            <div className="w-full text-center mb-8 relative z-20">
                                <motion.div
                                    key={currentStepData.description}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-block bg-slate-800/80 border border-fuchsia-500/30 rounded-2xl md:rounded-full px-4 md:px-6 py-2 shadow-lg"
                                >
                                    <p className={`text-sm md:text-lg font-medium flex items-center gap-3 ${stepTypeColor[currentStepData.type] || 'text-white'}`}>
                                        <Info size={18} className="text-fuchsia-400 shrink-0" />
                                        {currentStepData.description}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Character Boxes */}
                            <div className="flex gap-2 md:gap-3 mb-10 flex-wrap justify-center relative z-10">
                                {TEXT.split('').map((char, idx) => {
                                    const isLeft = idx === currentStepData.leftIdx;
                                    const isRight = idx === currentStepData.rightIdx;
                                    const isBetween =
                                        currentStepData.leftIdx >= 0 &&
                                        currentStepData.rightIdx >= 0 &&
                                        idx > currentStepData.leftIdx &&
                                        idx < currentStepData.rightIdx;
                                    const isOutside =
                                        currentStepData.leftIdx >= 0 &&
                                        (idx < currentStepData.leftIdx || idx > currentStepData.rightIdx);

                                    let boxClass = 'bg-slate-800 border-slate-600 text-slate-400';
                                    if (isLeft || isRight) {
                                        if (currentStepData.result === false) {
                                            boxClass = 'bg-red-500/20 border-red-500 text-red-300 shadow-lg shadow-red-500/30';
                                        } else {
                                            boxClass = 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-200 shadow-lg shadow-fuchsia-500/30';
                                        }
                                    } else if (isOutside) {
                                        boxClass = 'bg-emerald-500/10 border-emerald-600/50 text-emerald-400';
                                    } else if (isBetween) {
                                        boxClass = 'bg-slate-700/50 border-slate-500 text-slate-300';
                                    }

                                    return (
                                        <motion.div
                                            key={idx}
                                            animate={{ scale: (isLeft || isRight) ? 1.2 : 1 }}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                            className="flex flex-col items-center gap-1"
                                        >
                                            <div className={`w-10 h-12 md:w-14 md:h-16 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-xl md:text-2xl transition-all duration-300 ${boxClass}`}>
                                                {char}
                                            </div>
                                            <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                                            {isLeft && <span className="text-[9px] font-bold text-fuchsia-400 uppercase tracking-wider">L</span>}
                                            {isRight && !isLeft && <span className="text-[9px] font-bold text-pink-400 uppercase tracking-wider">R</span>}
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Call Stack */}
                            <div className="w-full max-w-2xl relative z-10">
                                <div className="flex items-center gap-2 mb-4 text-fuchsia-400/70">
                                    <Layers size={16} />
                                    <span className="text-xs font-black uppercase tracking-widest">Call Stack</span>
                                    <span className="ml-auto text-xs font-mono text-slate-500">{currentStepData.stack.length} frame{currentStepData.stack.length !== 1 ? 's' : ''}</span>
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
                                                        key={`${frame.start}-${frame.end}`}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        className={`flex items-center justify-between rounded-xl px-4 py-3 border transition-all ${isTop
                                                            ? 'bg-fuchsia-500/15 border-fuchsia-500/40 shadow-md shadow-fuchsia-500/10'
                                                            : 'bg-slate-800/60 border-white/5'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${isTop ? 'bg-fuchsia-500/30 border-fuchsia-400 text-fuchsia-200' : 'bg-slate-700 border-slate-600 text-slate-400'}`}>
                                                                {currentStepData.stack.length - 1 - i}
                                                            </div>
                                                            <div>
                                                                <span className="font-mono text-sm font-bold text-fuchsia-200">palindrom</span>
                                                                <span className="font-mono text-xs text-slate-400 ml-1">({frame.args})</span>
                                                            </div>
                                                        </div>
                                                        {isTop && (
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-fuchsia-400 bg-fuchsia-500/20 px-2 py-0.5 rounded animate-pulse">
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
                                    ✅ "{TEXT}" is a Palindrome!
                                </motion.div>
                            )}
                        </div>

                        {/* Stats Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Stack Depth</span>
                                    <span className="text-xl md:text-3xl font-bold text-fuchsia-400">{currentStepData.stack.length}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Left Ptr</span>
                                    <span className="text-xl md:text-3xl font-bold text-pink-400">{currentStepData.leftIdx >= 0 ? currentStepData.leftIdx : '–'}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Right Ptr</span>
                                    <span className="text-xl md:text-3xl font-bold text-pink-400">{currentStepData.rightIdx >= 0 ? currentStepData.rightIdx : '–'}</span>
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
                title="Recursion: Palindrome"
                description="Checking for palindrome using recursion involves comparing outer characters and recursing inward."
                concept={`A palindrome reads the same forwards and backwards.\n\nWe compare the first and last characters. If they match, we recurse on the substring between them.\nBase cases:\n1. start > end (empty or single char) → True.\n2. Mismatch found → False.`}
                efficiency="Time: O(n/2) which is O(n). Space: O(n/2) stack frames which is O(n)."
                useCases={['String processing', 'Checking symmetry', 'Parser logic']}
                timeComplexity="O(n)"
                spaceComplexity="O(n) - due to stack depth"
                complexityNotes="Even though time is linear, space is linear too because each call adds a frame to the call stack."
                interviewTips={[
                    'Watch out for off-by-one errors with indices.',
                    'Consider empty strings as palindromes.',
                    'Can be done iteratively with two pointers for O(1) space.',
                ]}
                color="purple"
            />
        </div>
    );
};

export default PalindromeRecursionVisualizer;
