'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const HigherOrderFunctionsVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Map: Transform',
            code: `const numbers = [1, 2, 3, 4];

const doubled = numbers.map(num => num * 2);

console.log(doubled); // [2, 4, 6, 8]`,
            steps: [
                {
                    line: 1,
                    description: 'Start with an array of numbers',
                    data: { numbers: [1, 2, 3, 4], current: null },
                    highlight: 'input'
                },
                {
                    line: 3,
                    description: 'Transform 1 → 2 (1 * 2)',
                    data: { processing: 1, result: [2] },
                    highlight: 'execution',
                    output: '2'
                },
                {
                    line: 3,
                    description: 'Transform 2 → 4 (2 * 2)',
                    data: { processing: 2, result: [2, 4] },
                    highlight: 'execution',
                    output: '4'
                },
                {
                    line: 3,
                    description: 'Transform 3 → 6 (3 * 2)',
                    data: { processing: 3, result: [2, 4, 6] },
                    highlight: 'execution',
                    output: '6'
                },
                {
                    line: 3,
                    description: 'Transform 4 → 8 (4 * 2)',
                    data: { processing: 4, result: [2, 4, 6, 8] },
                    highlight: 'execution',
                    output: '8'
                },
                {
                    line: 5,
                    description: 'map() returns a NEW array with transformed values',
                    data: { doubled: [2, 4, 6, 8] },
                    highlight: 'output',
                    output: '[2, 4, 6, 8]'
                }
            ],
            explanation: 'map() creates a NEW array by applying a function to each element. Original array is unchanged.'
        },
        {
            title: 'Filter: Select',
            code: `const numbers = [1, 2, 3, 4, 5, 6];

const evens = numbers.filter(num => num % 2 === 0);

console.log(evens); // [2, 4, 6]`,
            steps: [
                {
                    line: 1,
                    description: 'Start with an array of numbers',
                    data: { numbers: [1, 2, 3, 4, 5, 6] },
                    highlight: 'input'
                },
                {
                    line: 3,
                    description: 'Test 1: 1 % 2 === 0? → false (skip)',
                    data: { testing: 1, passed: [] },
                    highlight: 'execution',
                    output: 'Skip'
                },
                {
                    line: 3,
                    description: 'Test 2: 2 % 2 === 0? → true (keep)',
                    data: { testing: 2, passed: [2] },
                    highlight: 'execution',
                    output: 'Keep'
                },
                {
                    line: 3,
                    description: 'Test 3: 3 % 2 === 0? → false (skip)',
                    data: { testing: 3, passed: [2] },
                    highlight: 'execution',
                    output: 'Skip'
                },
                {
                    line: 3,
                    description: 'Test 4: 4 % 2 === 0? → true (keep)',
                    data: { testing: 4, passed: [2, 4] },
                    highlight: 'execution',
                    output: 'Keep'
                },
                {
                    line: 3,
                    description: 'Test 6: 6 % 2 === 0? → true (keep)',
                    data: { testing: 6, passed: [2, 4, 6] },
                    highlight: 'execution',
                    output: 'Keep'
                },
                {
                    line: 5,
                    description: 'filter() returns NEW array with only passing elements',
                    data: { evens: [2, 4, 6] },
                    highlight: 'output',
                    output: '[2, 4, 6]'
                }
            ],
            explanation: 'filter() creates a NEW array with only elements that pass the test.'
        },
        {
            title: 'Reduce: Combine',
            code: `const numbers = [1, 2, 3, 4];

const sum = numbers.reduce((acc, curr) => {
  return acc + curr;
}, 0);

console.log(sum); // 10`,
            steps: [
                {
                    line: 1,
                    description: 'Start with array',
                    data: { numbers: [1, 2, 3, 4] },
                    highlight: 'input'
                },
                {
                    line: 5,
                    description: 'Initialize accumulator to 0',
                    data: { accumulator: 0, current: null },
                    highlight: 'reduce'
                },
                {
                    line: 4,
                    description: 'Iteration 1: 0 + 1 = 1',
                    data: { acc: 0, curr: 1, result: 1 },
                    highlight: 'execution',
                    output: '1'
                },
                {
                    line: 4,
                    description: 'Iteration 2: 1 + 2 = 3',
                    data: { acc: 1, curr: 2, result: 3 },
                    highlight: 'execution',
                    output: '3'
                },
                {
                    line: 4,
                    description: 'Iteration 3: 3 + 3 = 6',
                    data: { acc: 3, curr: 3, result: 6 },
                    highlight: 'execution',
                    output: '6'
                },
                {
                    line: 4,
                    description: 'Iteration 4: 6 + 4 = 10',
                    data: { acc: 6, curr: 4, result: 10 },
                    highlight: 'execution',
                    output: '10'
                },
                {
                    line: 7,
                    description: 'reduce() returns final accumulated value',
                    data: { sum: 10 },
                    highlight: 'output',
                    output: '10'
                }
            ],
            explanation: 'reduce() combines array elements into a single value.'
        },
        {
            title: 'Chaining',
            code: `const numbers = [1, 2, 3, 4, 5, 6];

const result = numbers
  .filter(n => n % 2 === 0)  // [2, 4, 6]
  .map(n => n * 3)           // [6, 12, 18]
  .reduce((sum, n) => sum + n, 0); // 36

console.log(result); // 36`,
            steps: [
                {
                    line: 1,
                    description: 'Start with array [1, 2, 3, 4, 5, 6]',
                    data: { input: [1, 2, 3, 4, 5, 6] },
                    highlight: 'input'
                },
                {
                    line: 4,
                    description: 'Step 1: filter() returns only even numbers',
                    data: { afterFilter: [2, 4, 6] },
                    highlight: 'filter',
                    output: '[2, 4, 6]'
                },
                {
                    line: 5,
                    description: 'Step 2: map() multiplies each by 3',
                    data: { afterMap: [6, 12, 18] },
                    highlight: 'map',
                    output: '[6, 12, 18]'
                },
                {
                    line: 6,
                    description: 'Step 3: reduce() sums all values',
                    data: { afterReduce: 36 },
                    highlight: 'reduce',
                    output: '36'
                },
                {
                    line: 8,
                    description: 'Final result after chaining all operations',
                    data: { result: 36 },
                    highlight: 'output',
                    output: '36'
                }
            ],
            explanation: 'Methods can be chained because map() and filter() return new arrays.'
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

            <div className="pt-20 min-h-[calc(100vh-5rem)] flex">

                {/* Left Sidebar */}
                <div className="w-80 bg-slate-900 border-r border-slate-700 p-6 overflow-y-auto">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Zap className="text-emerald-400" size={40} />
                            <h1 className="text-3xl font-bold">Higher-Order</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Functions that accept or return functions
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-emerald-400" size={22} />
                            <h3 className="text-base font-bold text-emerald-400 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "A higher-order function takes functions as arguments or returns a function. Examples: map(), filter(), reduce()."
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-blue-400" size={22} />
                            <h3 className="text-base font-bold text-blue-400 uppercase">Simple Explanation</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            Think of assembly lines. You give raw data and instructions (functions), they process everything automatically.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-purple-400" size={22} />
                            <h3 className="text-base font-bold text-purple-400 uppercase">Core Methods</h3>
                        </div>
                        <ul className="space-y-3 text-slate-200 text-base">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400 mt-1">🗺️</span>
                                <div>
                                    <strong className="text-emerald-400">map():</strong> Transform each element
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">🔍</span>
                                <div>
                                    <strong className="text-blue-400">filter():</strong> Select elements
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">➕</span>
                                <div>
                                    <strong className="text-purple-400">reduce():</strong> Combine to one value
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase">Remember</h4>
                        <p className="text-slate-400 text-xs">
                            These methods don't mutate the original array - they return NEW arrays!
                        </p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex-1 flex flex-col bg-slate-950">

                    {/* Example Tabs */}
                    <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
                        <div className="flex gap-2 overflow-x-auto">
                            {examples.map((ex, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => changeExample(idx)}
                                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${currentExample === idx
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
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
                            <Code className="text-emerald-400" size={20} />
                            <h3 className="text-lg font-bold">Code Example</h3>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <SyntaxHighlighter
                                language="javascript"
                                style={atomDark}
                                customStyle={{
                                    margin: 0,
                                    padding: '2rem',
                                    fontSize: '1.1rem',
                                    lineHeight: '1.8',
                                    backgroundColor: 'transparent'
                                }}
                            >
                                {currentEx.code}
                            </SyntaxHighlighter>
                        </div>
                    </div>

                    {/* Visualization */}
                    <div className="flex-1 bg-slate-900 px-8 py-6 overflow-y-auto border-t border-slate-700">
                        <div className="max-w-5xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold">Step-by-Step Execution</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400 text-base">
                                        Step {currentStep + 1} of {currentEx.steps.length}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={handleReset} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                                            <RotateCcw size={20} />
                                        </button>
                                        <button onClick={handlePrevious} disabled={currentStep === 0} className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors">
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button onClick={handleNext} disabled={currentStep === currentEx.steps.length - 1} className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg transition-colors">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${currentStepData.highlight === 'map' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                currentStepData.highlight === 'filter' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                    currentStepData.highlight === 'reduce' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                                        currentStepData.highlight === 'execution' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                            'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                            }`}>
                                            {currentStepData.highlight === 'map' ? '🗺️ Mapping' :
                                                currentStepData.highlight === 'filter' ? '🔍 Filtering' :
                                                    currentStepData.highlight === 'reduce' ? '➕ Reducing' :
                                                        currentStepData.highlight === 'execution' ? '▶️ Processing' : '📝 Data'}
                                        </span>
                                        <span className="text-xl font-bold text-white">Line {currentStepData.line}</span>
                                    </div>

                                    <div className="bg-slate-950/50 rounded-xl p-6 border-2 border-slate-700">
                                        <p className="text-lg text-slate-100 leading-relaxed">{currentStepData.description}</p>
                                    </div>

                                    <div className="bg-slate-950 rounded-xl p-6 border border-emerald-500/30">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Layers className="text-emerald-400" size={20} />
                                            <h4 className="text-base font-semibold text-emerald-400">Current State</h4>
                                        </div>
                                        <div className="font-mono text-sm">
                                            <pre className="text-cyan-400">{JSON.stringify(currentStepData.data, null, 2)}</pre>
                                        </div>
                                    </div>

                                    {currentStepData.output && (
                                        <div className="flex items-center gap-4">
                                            <span className="text-slate-400 text-sm">Output:</span>
                                            <div className="px-5 py-2 rounded-xl font-mono text-base font-bold bg-green-500/20 text-green-400 border-2 border-green-500">
                                                {currentStepData.output}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6 p-5 bg-emerald-500/10 rounded-xl border-2 border-emerald-500/30">
                                        <h4 className="text-base font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                                            <span>💡</span> Key Takeaway
                                        </h4>
                                        <p className="text-slate-300 text-base">{currentEx.explanation}</p>
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

export default HigherOrderFunctionsVisualizer;
