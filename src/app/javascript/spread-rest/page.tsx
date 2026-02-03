'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SpreadRestVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Spread: Arrays',
            code: `const arr1 = [1, 2];
const arr2 = [3, 4];

// Spread expands into individual elements
const combined = [...arr1, ...arr2];

console.log(combined); // [1, 2, 3, 4]`,
            steps: [
                {
                    line: 1,
                    description: 'We have two separate arrays in memory.',
                    data: { arr1: [1, 2], arr2: [3, 4] },
                    highlight: 'input'
                },
                {
                    line: 5,
                    description: '...arr1 "explodes" the array into: 1, 2. Same for ...arr2.',
                    data: { expanding: 'arr1, arr2', items: '1, 2, 3, 4' },
                    highlight: 'spread'
                },
                {
                    line: 5,
                    description: 'They are collected into a BRAND NEW array literal [].',
                    data: { result: [1, 2, 3, 4] },
                    highlight: 'execution',
                    output: '[1, 2, 3, 4]'
                }
            ],
            explanation: 'Spread operator (...) unpacks an iterable into individual elements. Ideal for merging.'
        },
        {
            title: 'Spread: Shallow Copy',
            code: `const user = { name: 'Parth' };
const clone = { ...user, age: 25 };

clone.name = 'John';
console.log(user.name); // 'Parth'`,
            steps: [
                {
                    line: 2,
                    description: 'Creating "clone" by spreading "user" and adding "age".',
                    data: { user: { name: 'Parth' }, clone: 'pending' },
                    highlight: 'spread'
                },
                {
                    line: 2,
                    description: 'The clone is a NEW object. Top-level props are copied by value.',
                    data: { user: { name: 'Parth' }, clone: { name: 'Parth', age: 25 } },
                    highlight: 'execution'
                },
                {
                    line: 5,
                    description: 'Changing clone.name does NOT affect user.name.',
                    data: { user_name: 'Parth', clone_name: 'John' },
                    highlight: 'check',
                    output: "'Parth'"
                }
            ],
            explanation: 'Spread creates a SHALLOW copy. Primitive values are copied, but nested objects are still references!'
        },
        {
            title: 'Rest: Function Args',
            code: `function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

sum(1, 2, 3); // 6`,
            steps: [
                {
                    line: 5,
                    description: 'Calling sum with 3 separate arguments.',
                    data: { args: '1, 2, 3' },
                    highlight: 'call'
                },
                {
                    line: 1,
                    description: 'The "rest" parameter ...numbers catches them all into a REAL array.',
                    data: { numbers: [1, 2, 3], type: 'Array' },
                    highlight: 'rest'
                },
                {
                    line: 2,
                    description: 'Since it is a real array, we can use .reduce() or .map() directly.',
                    data: { result: 6 },
                    highlight: 'execution',
                    output: '6'
                }
            ],
            explanation: 'Rest parameters collect "the rest" of the arguments into a single array.'
        },
        {
            title: 'Rest: Destructuring',
            code: `const [first, ...others] = [10, 20, 30];

console.log(others); // [20, 30]`,
            steps: [
                {
                    line: 1,
                    description: 'Extract index 0 into "first".',
                    data: { first: 10 },
                    highlight: 'destructure'
                },
                {
                    line: 1,
                    description: 'The rest operator ...others gathers everything else.',
                    data: { first: 10, others: [20, 30] },
                    highlight: 'rest',
                    output: '[20, 30]'
                }
            ],
            explanation: 'In destructuring, rest must always be the LAST element.'
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
                            <Box className="text-indigo-400" size={40} />
                            <h1 className="text-3xl font-bold">Spread & Rest</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            The versatile triple dot (...) utility.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-indigo-400" size={22} />
                            <h3 className="text-base font-bold text-indigo-400 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "Spread expands elements into individuals (unpacking). Rest collects individuals into an array (packing). Same syntax, opposite functions."
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-purple-400" size={22} />
                            <h3 className="text-base font-bold text-purple-400 uppercase">Simple Explanation</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            Spread is like emptying a bag of marbles onto the floor. Rest is like scooping them all back into a jar.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-blue-400" size={22} />
                            <h3 className="text-base font-bold text-blue-400 uppercase">Usage Rules</h3>
                        </div>
                        <ul className="space-y-3 text-slate-200 text-base">
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-400 mt-1">📤</span>
                                <div><strong className="text-indigo-400">Spread:</strong> Anywhere an iterable is expected.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">📥</span>
                                <div><strong className="text-purple-400">Rest:</strong> ONLY as the last argument or pattern element.</div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-400 mb-2">Memory Tip</h4>
                        <p className="text-slate-400 text-xs">
                            Objects/Arrays created via spread are NEW references. It's a very common way to maintain immutability in React state!
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
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
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
                            <Code className="text-indigo-400" size={20} />
                            <h3 className="text-lg font-bold">Code Mechanics</h3>
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
                                            backgroundColor: isCurrentLine ? 'rgba(99, 102, 241, 0.15)' : undefined,
                                            borderLeft: isCurrentLine ? '3px solid #6366f1' : '3px solid transparent',
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
                                <h3 className="text-2xl font-bold tracking-tight text-indigo-400">Memory Visualizer</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400 text-base font-mono">
                                        Step {currentStep + 1} of {currentEx.steps.length}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={handleReset} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                                            <RotateCcw size={20} />
                                        </button>
                                        <button onClick={handlePrevious} disabled={currentStep === 0} className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors">
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button onClick={handleNext} disabled={currentStep === currentEx.steps.length - 1} className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Current Step Display */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentExample + '-' + currentStep}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-8 flex-1 flex flex-col"
                                >
                                    <div className="bg-slate-950/80 rounded-2xl p-6 border-l-8 border-indigo-500 shadow-2xl">
                                        <p className="text-xl text-slate-100 leading-relaxed font-semibold">{currentStepData.description}</p>
                                    </div>

                                    {/* Visual Expansion Area */}
                                    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950/40 rounded-3xl border border-slate-800 relative">

                                        {/* Simplified Memory Box */}
                                        <div className="flex items-center gap-12">
                                            {/* Source */}
                                            <motion.div
                                                animate={{
                                                    opacity: currentStepData.highlight === 'spread' ? 0.3 : 1,
                                                    scale: currentStepData.highlight === 'input' ? 1.1 : 1
                                                }}
                                                className="w-40 h-40 bg-slate-900 rounded-3xl border-4 border-slate-700 flex items-center justify-center p-4 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                                            >
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 absolute top-4">Source</div>
                                                <span className="font-mono text-indigo-400 font-bold break-all">
                                                    {JSON.stringify((currentStepData.data as any)[Object.keys(currentStepData.data)[0]])}
                                                </span>
                                            </motion.div>

                                            {/* Action Arrow */}
                                            <div className="flex flex-col items-center gap-2">
                                                <motion.div
                                                    animate={{ x: currentStepData.highlight === 'spread' ? [0, 50, 0] : 0 }}
                                                    className="p-3 bg-indigo-500/20 rounded-full border border-indigo-500/50"
                                                >
                                                    <ChevronRight size={32} className="text-indigo-400" />
                                                </motion.div>
                                                <span className="text-[10px] font-bold text-slate-600 tracking-[0.2em] uppercase">...</span>
                                            </div>

                                            {/* Target */}
                                            <motion.div
                                                animate={{
                                                    borderColor: currentStepData.highlight === 'execution' || currentStepData.highlight === 'rest' ? '#818cf8' : '#334155',
                                                    scale: currentStepData.highlight === 'execution' || currentStepData.highlight === 'rest' ? 1.1 : 1
                                                }}
                                                className="w-40 h-40 bg-slate-900 rounded-3xl border-4 border-dashed border-slate-700 flex items-center justify-center p-4 text-center relative shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                                            >
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 absolute top-4">Result</div>
                                                {currentStepData.output ? (
                                                    <span className="font-mono text-green-400 font-bold break-all animate-in fade-in zoom-in duration-500">
                                                        {currentStepData.output}
                                                    </span>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full border-2 border-slate-800 animate-pulse" />
                                                )}
                                            </motion.div>
                                        </div>

                                        {/* State Inspection Table */}
                                        <div className="mt-12 w-full max-w-md bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                                            <div className="bg-slate-900 px-4 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-widest">Memory Stack</div>
                                            <div className="p-4 space-y-2">
                                                {Object.entries(currentStepData.data).map(([k, v]) => (
                                                    <div key={k} className="flex justify-between items-center bg-slate-900 px-4 py-3 rounded-lg border border-slate-800">
                                                        <span className="text-xs font-mono text-indigo-400 font-bold">{k}:</span>
                                                        <span className="text-xs font-mono text-slate-300 truncate max-w-[200px]">{JSON.stringify(v)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-indigo-500/10 rounded-2xl border-2 border-indigo-500/30">
                                        <h4 className="text-base font-bold text-indigo-400 mb-2 flex items-center gap-2">
                                            <span>💡</span> Pattern Logic
                                        </h4>
                                        <p className="text-slate-300 text-base leading-relaxed">{currentEx.explanation}</p>
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

export default SpreadRestVisualizer;
