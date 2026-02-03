'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers, XCircle, CheckCircle2 } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const StrictModeVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Global Variables',
            code: `"use strict";

function createGlobal() {
  x = 10; // ReferenceError in strict mode
}

createGlobal();`,
            steps: [
                {
                    line: 1,
                    description: 'Enabling "use strict" at the top of the file/function.',
                    data: { mode: 'STRICT' },
                    highlight: 'strict'
                },
                {
                    line: 4,
                    description: 'Assigning a value to an undeclared variable "x".',
                    data: { variable: 'x', declared: false },
                    highlight: 'problem'
                },
                {
                    line: 4,
                    description: 'Strict mode throws a ReferenceError. In sloppy mode, this would create window.x.',
                    data: { error: 'ReferenceError: x is not defined' },
                    highlight: 'error',
                    output: 'ReferenceError'
                }
            ],
            explanation: 'Strict mode prevents accidental global variables by throwing errors for undeclared assignments.'
        },
        {
            title: 'Duplicate Params',
            code: `"use strict";

function sum(a, b, a) { // SyntaxError
  return a + b + a;
}`,
            steps: [
                {
                    line: 3,
                    description: 'Defining a function with duplicate parameter names.',
                    data: { params: ['a', 'b', 'a'], duplicate: 'a' },
                    highlight: 'problem'
                },
                {
                    line: 3,
                    description: 'Strict mode catches this at parse time. It is a SyntaxError.',
                    data: { error: 'SyntaxError: Duplicate parameter name not allowed' },
                    highlight: 'error',
                    output: 'SyntaxError'
                }
            ],
            explanation: 'Sloppy mode allows duplicates (last one wins), which is highly confusing and bug-prone.'
        },
        {
            title: 'Read-Only Props',
            code: `"use strict";

const obj = {};
Object.defineProperty(obj, 'x', { 
  value: 42, 
  writable: false 
});

obj.x = 9; // TypeError in strict mode`,
            steps: [
                {
                    line: 3,
                    description: 'Create an object with a non-writable (read-only) property "x".',
                    data: { x: 42, writable: false },
                    highlight: 'setup'
                },
                {
                    line: 9,
                    description: 'Attempting to change a read-only property.',
                    data: { target: 9, status: 'BLOCKED' },
                    highlight: 'problem'
                },
                {
                    line: 9,
                    description: 'Strict mode throws a TypeError. Sloppy mode would just ignore the change silently!',
                    data: { error: 'TypeError: Cannot assign to read only property' },
                    highlight: 'error',
                    output: 'TypeError'
                }
            ],
            explanation: 'Strict mode ensures that failed assignments to read-only properties throw errors instead of failing silently.'
        }
    ];

    const currentEx = examples[currentExample];
    const currentStepData = currentEx.steps[currentStep];

    const handleNext = () => {
        if (currentStep < currentEx.steps.length - 1) {
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

    const changeExample = (index: number) => {
        setCurrentExample(index);
        setCurrentStep(0);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Header />

            {/* Full Screen Layout */}
            <div className="pt-20 min-h-[calc(100vh-5rem)] flex">

                {/* Left Sidebar - Definitions */}
                <div className="w-80 bg-slate-900 border-r border-slate-700 p-6 overflow-y-auto">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="text-green-400" size={40} />
                            <h1 className="text-3xl font-bold">Strict Mode</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Opt-in to a cleaner, safer JavaScript.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-green-400" size={22} />
                            <h3 className="text-base font-bold text-green-400 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "Strict Mode is a way to opt-in to a restricted variant of JavaScript. It converts silent errors into throw errors and fixes mistakes that make it difficult for engines to optimize."
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-yellow-400" size={22} />
                            <h3 className="text-base font-bold text-yellow-400 uppercase">Simple Explanation</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            It's like having a strict teacher. Instead of letting you turn in messy homework, they make you fix every typo before they'll even look at it.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-red-400" size={22} />
                            <h3 className="text-base font-bold text-red-400 uppercase">Key Protections</h3>
                        </div>
                        <ul className="space-y-3 text-slate-200 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">•</span>
                                <div><strong className="text-red-400">Globals:</strong> No undeclared variables.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">•</span>
                                <div><strong className="text-red-400">Silent Fails:</strong> Read-only errors throw.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-400 mt-1">•</span>
                                <div><strong className="text-red-400">This Binding:</strong> Undefined instead of window.</div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase">Did you know?</h4>
                        <p className="text-slate-400 text-xs">
                            ES6 Modules and Classes are ALWAYS in Strict Mode by default. You don't even need to write the string!
                        </p>
                    </div>
                </div>

                {/* Right Side - Full Screen Visualizer */}
                <div className="flex-1 flex flex-col bg-slate-950">

                    {/* Example Tabs */}
                    <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
                        <div className="flex gap-2 overflow-x-auto">
                            {examples.map((ex, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => changeExample(idx)}
                                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${currentExample === idx
                                            ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {ex.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Code Display */}
                    <div className="bg-slate-900/50 flex flex-col" style={{ height: '35vh' }}>
                        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-700 bg-slate-900">
                            <Code className="text-green-400" size={20} />
                            <h3 className="text-lg font-bold">Safety Checks</h3>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <SyntaxHighlighter
                                language="javascript"
                                style={atomDark}
                                showLineNumbers={true}
                                customStyle={{
                                    margin: 0,
                                    padding: '2rem',
                                    fontSize: '1.2rem',
                                    lineHeight: '1.8',
                                    backgroundColor: 'transparent'
                                }}
                                lineProps={(lineNumber: number) => {
                                    const isCurrentLine = lineNumber === currentStepData.line;
                                    return {
                                        style: {
                                            backgroundColor: isCurrentLine ? 'rgba(34, 197, 94, 0.15)' : undefined,
                                            borderLeft: isCurrentLine ? '3px solid #22c55e' : '3px solid transparent',
                                            paddingLeft: '1rem'
                                        }
                                    };
                                }}
                            >
                                {currentEx.code}
                            </SyntaxHighlighter>
                        </div>
                    </div>

                    {/* Interactive Visualization - Takes remaining space */}
                    <div className="flex-1 bg-slate-900 px-8 py-6 border-t border-slate-700 overflow-y-auto">
                        <div className="max-w-5xl mx-auto h-full flex flex-col">
                            {/* Controls */}
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold tracking-tight text-green-400 flex items-center gap-2">
                                    <Shield size={20} /> Runtime Guard
                                </h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400 text-base font-mono">
                                        Step {currentStep + 1}/{currentEx.steps.length}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={handleReset} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                                            <RotateCcw size={20} />
                                        </button>
                                        <button onClick={handlePrevious} disabled={currentStep === 0} className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors">
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button onClick={handleNext} disabled={currentStep === currentEx.steps.length - 1} className="p-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg transition-colors shadow-lg shadow-green-500/20">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Current Step Display */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentExample + currentStep}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    className="space-y-6 flex-1 flex flex-col"
                                >
                                    <div className="bg-slate-950/80 rounded-2xl p-6 border-2 border-slate-800 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500 group-hover:w-2 transition-all" />
                                        <p className="text-lg text-slate-100 leading-relaxed pl-2">{currentStepData.description}</p>
                                    </div>

                                    {/* Console / Engine Visualization */}
                                    <div className="flex-1 flex items-center justify-center p-8 bg-slate-950 rounded-3xl border border-slate-800 relative shadow-inner">

                                        <div className="grid grid-cols-2 gap-12 w-full max-w-2xl text-center">
                                            {/* Sloppy Mode Column */}
                                            <div className="flex flex-col items-center gap-4 opacity-40">
                                                <div className="text-[10px] uppercase font-bold text-slate-600 tracking-widest">Sloppy Mode (Default)</div>
                                                <div className="w-full aspect-square rounded-2xl border-2 border-slate-800 bg-slate-900/50 flex items-center justify-center relative">
                                                    <CheckCircle2 className="text-slate-700" size={48} />
                                                    <div className="absolute -bottom-2 bg-slate-800 px-3 py-1 rounded text-[10px] text-slate-500">Silent Success?</div>
                                                </div>
                                            </div>

                                            {/* Strict Mode Column */}
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="text-[10px] uppercase font-bold text-green-500 tracking-widest animate-pulse">Strict Mode (Active)</div>
                                                <motion.div
                                                    animate={{
                                                        borderColor: currentStepData.highlight === 'error' ? '#ef4444' : '#22c55e',
                                                        backgroundColor: currentStepData.highlight === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.05)'
                                                    }}
                                                    className="w-full aspect-square rounded-2xl border-4 flex items-center justify-center relative shadow-2xl"
                                                >
                                                    {currentStepData.highlight === 'error' ? (
                                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                            <XCircle className="text-red-500" size={64} />
                                                        </motion.div>
                                                    ) : (
                                                        <CheckCircle2 className="text-green-500" size={64} />
                                                    )}

                                                    {currentStepData.output && (
                                                        <motion.div
                                                            initial={{ y: 20, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            className="absolute -bottom-4 bg-red-600 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xl"
                                                        >
                                                            {currentStepData.output}!
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* Engine Info Box */}
                                        <div className="absolute top-4 right-4 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                                            <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Engine State</div>
                                            <div className="font-mono text-[10px] text-green-400">
                                                {Object.entries(currentStepData.data).map(([k, v]) => (
                                                    <div key={k}>{k}: {String(v)}</div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-green-500/10 rounded-2xl border border-green-500/30">
                                        <h4 className="text-sm font-bold text-green-400 mb-2 flex items-center gap-2 uppercase tracking-tight">
                                            <Lightbulb size={16} /> Why it matters
                                        </h4>
                                        <p className="text-slate-400 text-sm leading-relaxed italic">{currentEx.explanation}</p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default StrictModeVisualizer;
