'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Play,
    Pause,
    Code,
    HelpCircle,
    ArrowRight,
    Braces,
    Database,
    Clock,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import Header from '../../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DSAExplanationModal from '../../components/DSAExplanationModal';

const ValidParenthesesVisualizer = () => {
    const [input, setInput] = useState('({[]})');
    const [isPlaying, setIsPlaying] = useState(false);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
    const [isModalOpen, setIsModalOpen] = useState(false);

    interface Step {
        description: string;
        stack: string[];
        currentChar: string | null;
        currentIndex: number;
        isValid: boolean | null;
        jsLine: number;
        pyLine: number;
        completed?: boolean;
    }

    const generateSteps = (s: string): Step[] => {
        const steps: Step[] = [];
        const stack: string[] = [];
        const map: { [key: string]: string } = {
            ')': '(',
            '}': '{',
            ']': '['
        };

        // Initial State
        steps.push({
            description: "Start: Initialize an empty stack to track opening symbols.",
            stack: [],
            currentChar: null,
            currentIndex: -1,
            isValid: null,
            jsLine: 1,
            pyLine: 1
        });

        for (let i = 0; i < s.length; i++) {
            const char = s[i];

            steps.push({
                description: `Scan character at index ${i}: "${char}"`,
                stack: [...stack],
                currentChar: char,
                currentIndex: i,
                isValid: null,
                jsLine: 3,
                pyLine: 4
            });

            if (char === '(' || char === '{' || char === '[') {
                stack.push(char);
                steps.push({
                    description: `Opening symbol "${char}" detected. Pushing to stack.`,
                    stack: [...stack],
                    currentChar: char,
                    currentIndex: i,
                    isValid: null,
                    jsLine: 5,
                    pyLine: 6
                });
            } else if (char === ')' || char === '}' || char === ']') {
                const top = stack.pop();
                const matches = top === map[char];

                if (!matches) {
                    steps.push({
                        description: `Closing symbol "${char}" does not match top of stack "${top || 'empty'}". Sequence is INVALID.`,
                        stack: [...stack],
                        currentChar: char,
                        currentIndex: i,
                        isValid: false,
                        jsLine: 8,
                        pyLine: 9
                    });
                    return steps;
                }

                steps.push({
                    description: `Closing symbol "${char}" matches top "${top}". Popping from stack.`,
                    stack: [...stack],
                    currentChar: char,
                    currentIndex: i,
                    isValid: null,
                    jsLine: 10,
                    pyLine: 11
                });
            }
        }

        const finalValid = stack.length === 0;
        steps.push({
            description: finalValid
                ? "Scan complete. Stack is empty. Sequence is VALID!"
                : "Scan complete. Stack is NOT empty. Sequence is INVALID.",
            stack: [...stack],
            currentChar: null,
            currentIndex: s.length,
            isValid: finalValid,
            jsLine: 14,
            pyLine: 13,
            completed: true
        });

        return steps;
    };

    const [steps, setSteps] = useState(generateSteps(input));
    const [currentStep, setCurrentStep] = useState(0);
    const currentStepData = { ...steps[currentStep], completed: currentStep === steps.length - 1 };

    useEffect(() => {
        setSteps(generateSteps(input));
        setCurrentStep(0);
        setIsPlaying(false);
    }, [input]);

    const jsCode = [
        "function isValid(s) {",
        "  const stack = [];",
        "  for (let char of s) {",
        "    if (['(', '{', '['].includes(char)) {",
        "      stack.push(char);",
        "    } else {",
        "      const top = stack.pop();",
        "      if (char === ')' && top !== '(') return false;",
        "      if (char === '}' && top !== '{') return false;",
        "      if (char === ']' && top !== '[') return false;",
        "    }",
        "  }",
        "  return stack.length === 0;",
        "}"
    ];

    const pyCode = [
        "def isValid(s):",
        "    stack = []",
        "    mapping = {')': '(', '}': '{', ']': '['}",
        "    for char in s:",
        "        if char in mapping.values():",
        "            stack.append(char)",
        "        elif char in mapping.keys():",
        "            if not stack or mapping[char] != stack.pop():",
        "                return False",
        "        else:",
        "            continue",
        "    return not stack"
    ];

    const code = language === 'javascript' ? jsCode : pyCode;
    const currentLine = language === 'javascript' ? currentStepData.jsLine : currentStepData.pyLine;

    const handleNext = () => { if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1); };
    const handlePrevious = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
    const handleReset = () => { setCurrentStep(0); setIsPlaying(false); };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && currentStep < steps.length - 1) {
            interval = setInterval(() => {
                setCurrentStep(prev => prev + 1);
            }, 800);
        } else if (currentStep >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps.length]);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-indigo-500/30">
            <Header />

            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-black pt-20 pb-6 px-4 md:px-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

                <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 relative z-10">

                    {/* LEFT COLUMN */}
                    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">

                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    Valid Parentheses
                                </h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-2 rounded-full bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                                    >
                                        <HelpCircle size={20} />
                                    </button>
                                    <div className="px-2 py-1 rounded bg-slate-800 border border-white/10 text-xs font-mono text-slate-400">
                                        v1.0
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6 space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 text-left block">
                                    Input Sequence
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 font-mono text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                        placeholder="e.g. ({[]})"
                                    />
                                    <Braces className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 mb-6">
                                <button onClick={handleReset} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center justify-center"><RotateCcw size={20} /></button>
                                <button onClick={handlePrevious} disabled={currentStep === 0} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"><ChevronLeft size={24} /></button>
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    disabled={currentStepData.completed}
                                    className={`p-3 rounded-xl ${isPlaying ? 'bg-purple-600 hover:bg-purple-500' : 'bg-indigo-600 hover:bg-indigo-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-indigo-900/20`}
                                >
                                    {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                                </button>
                                <button onClick={handleNext} disabled={currentStepData.completed} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"><ChevronRight size={24} /></button>
                            </div>

                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex-1 flex flex-col min-h-[400px]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-indigo-400">
                                    <Code size={18} />
                                    <h3 className="font-bold text-sm uppercase tracking-wider">Algorithm</h3>
                                </div>
                                <div className="flex bg-slate-800 rounded p-1 border border-white/5">
                                    <button className={`px-2 py-1 text-[10px] font-bold rounded ${language === 'javascript' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`} onClick={() => setLanguage('javascript')}>JS</button>
                                    <button className={`px-2 py-1 text-[10px] font-bold rounded ${language === 'python' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`} onClick={() => setLanguage('python')}>PY</button>
                                </div>
                            </div>
                            <div className="flex-1 rounded-xl overflow-hidden border border-white/5 bg-[#1e1e1e]">
                                <SyntaxHighlighter
                                    language={language}
                                    style={atomDark}
                                    showLineNumbers={true}
                                    wrapLines={true}
                                    lineProps={(lineNumber: number) => ({
                                        style: {
                                            display: 'block',
                                            width: '100%',
                                            backgroundColor: lineNumber === currentLine ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                            borderLeft: lineNumber === currentLine ? '3px solid #6366f1' : '3px solid transparent'
                                        }
                                    })}
                                    customStyle={{ margin: 0, padding: '1rem', height: '100%', fontSize: '0.8rem' }}
                                >
                                    {code.join('\n')}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col gap-6 text-left">

                        <div className="min-h-[600px] lg:flex-grow bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-4 md:p-8 relative flex flex-col items-center justify-center overflow-visible">

                            {/* Narrator */}
                            <div className="absolute top-8 left-0 right-0 flex justify-center z-20">
                                <motion.div
                                    key={currentStepData.description}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="px-4 md:px-6 py-2 bg-slate-800/90 border border-indigo-500/30 rounded-2xl md:rounded-full text-indigo-100 font-medium shadow-2xl backdrop-blur-md flex items-center gap-3 text-sm md:text-base max-w-[90%]"
                                >
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                                    {currentStepData.description}
                                </motion.div>
                            </div>

                            {/* Main Stage: String & Stack */}
                            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-12">

                                {/* Input String Visualization */}
                                <div className="flex flex-col items-center gap-4 w-full">
                                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">Input Array Scan</div>
                                    <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
                                        <div className="flex gap-2 justify-start md:justify-center min-w-max px-4">
                                            {input.split('').map((char, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    animate={{
                                                        backgroundColor: currentStepData.currentIndex === idx ? '#6366f1' : 'transparent',
                                                        borderColor: currentStepData.currentIndex === idx ? '#818cf8' : 'rgba(255,255,255,0.1)',
                                                        scale: currentStepData.currentIndex === idx ? 1.1 : 1,
                                                        opacity: currentStepData.currentIndex > idx ? 0.3 : 1
                                                    }}
                                                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 flex items-center justify-center text-lg md:text-xl font-bold font-mono transition-colors"
                                                >
                                                    {char}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-[1fr_2px_1fr] gap-12 items-center w-full">
                                    {/* Action Area */}
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <AnimatePresence mode="wait">
                                            {currentStepData.currentChar && (
                                                <motion.div
                                                    key={currentStepData.currentIndex}
                                                    initial={{ y: 50, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: -50, opacity: 0 }}
                                                    className="flex flex-col items-center gap-4"
                                                >
                                                    <div className="text-sm font-bold text-slate-400">Processing Character</div>
                                                    <div className="w-20 h-20 bg-indigo-500 text-slate-950 text-4xl font-bold rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50">
                                                        {currentStepData.currentChar}
                                                    </div>
                                                </motion.div>
                                            )}
                                            {currentStepData.completed && (
                                                <motion.div
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="flex flex-col items-center gap-4"
                                                >
                                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Final Status</div>
                                                    {currentStepData.isValid ? (
                                                        <div className="flex flex-col items-center text-green-400 animate-bounce">
                                                            <CheckCircle2 size={64} />
                                                            <span className="text-2xl font-black mt-2">VALID</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center text-rose-500 animate-shake">
                                                            <XCircle size={64} />
                                                            <span className="text-2xl font-black mt-2">INVALID</span>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-40 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block"></div>

                                    {/* Stack Visualization */}
                                    <div className="flex flex-col items-center gap-4 min-h-[300px]">
                                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">LIFO Stack Memory</div>
                                        <div className="relative w-32 h-64 border-2 border-slate-700 border-t-0 rounded-b-3xl bg-slate-900/40 p-2 flex flex-col-reverse justify-start items-center gap-2 overflow-y-auto">
                                            <AnimatePresence>
                                                {currentStepData.stack.map((char, idx) => (
                                                    <motion.div
                                                        key={`stack-${idx}-${char}`}
                                                        initial={{ y: -100, opacity: 0, scale: 0.5 }}
                                                        animate={{ y: 0, opacity: 1, scale: 1 }}
                                                        exit={{ x: 100, opacity: 0, scale: 0.5 }}
                                                        className="w-full h-12 bg-indigo-500/10 border border-indigo-500/50 text-indigo-400 font-bold rounded-xl flex items-center justify-center text-xl shrink-0"
                                                    >
                                                        {char}
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                            {currentStepData.stack.length === 0 && (
                                                <div className="text-slate-700 italic text-[10px] absolute bottom-8">Stack Empty</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-800/40 rounded-2xl p-3 border border-white/5 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-1">
                                        <ArrowRight className="text-indigo-400" size={14} />
                                        <span className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">Current Index</span>
                                    </div>
                                    <span className="text-xl font-bold text-indigo-400">{currentStepData.currentIndex === -1 ? 'None' : currentStepData.currentIndex}</span>
                                </div>
                                <div className="bg-slate-800/40 rounded-2xl p-3 border border-white/5 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Database className="text-purple-400" size={14} />
                                        <span className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">Stack Height</span>
                                    </div>
                                    <span className="text-xl font-bold text-purple-400">{currentStepData.stack.length} Elements</span>
                                </div>
                                <div className="bg-slate-800/40 rounded-2xl p-3 border border-white/5 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className="text-cyan-400" size={14} />
                                        <span className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">Time Complexity</span>
                                    </div>
                                    <span className="text-xl font-bold text-cyan-400">O(N)</span>
                                </div>
                                <div className="bg-slate-800/40 rounded-2xl p-3 border border-white/5 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Database className="text-amber-400" size={14} />
                                        <span className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter">Space Complexity</span>
                                    </div>
                                    <span className="text-xl font-bold text-amber-400">O(N)</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <DSAExplanationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Valid Parentheses"
                description="Determine if an input string of symbols is balanced and properly nested."
                concept="This problem is perfectly solved using a Stack (LIFO). We push every opening symbol onto the stack. When a closing symbol appears, it must match the most recently pushed opening symbol (the top of the stack)."
                efficiency="We process the string in a single pass ($O(N)$) and use a stack to store up to all symbols in the worst case ($O(N)$)."
                useCases={[
                    "Syntax highlighting in code editors",
                    "Compiler parsing and validation",
                    "HTML/XML tag balancing",
                    "Mathematical expression verification"
                ]}
                timeComplexity="O(N)"
                spaceComplexity="O(N)"
                complexityNotes="N is the length of the string. We visit each character once and maintain a stack for tracking open brackets."
                interviewTips={[
                    "Always mention the Stack data structure immediately - it's the standard solution.",
                    "Explain why a Queue wouldn't work (we need to match the *last* seen opening bracket).",
                    "Check for edge cases like starting with a closing bracket or an uneven number of symbols.",
                    "Mention that a Map/Dictionary is useful for mapping closing brackets to their open counterparts."
                ]}
                color="blue"
            />
        </div>
    );
};

export default ValidParenthesesVisualizer;
