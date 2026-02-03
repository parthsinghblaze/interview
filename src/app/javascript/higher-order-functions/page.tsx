'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Play, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const HigherOrderFunctionsVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Map: Transform Every Element',
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
                    description: 'map() calls the function for each element',
                    data: { processing: 1, result: [] },
                    highlight: 'map',
                    output: null
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
            title: 'Filter: Select Specific Elements',
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
                    description: 'filter() tests each element with a condition',
                    data: { testing: 1, passed: [] },
                    highlight: 'filter'
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
                    description: 'Test 5: 5 % 2 === 0? → false (skip)',
                    data: { testing: 5, passed: [2, 4] },
                    highlight: 'execution',
                    output: 'Skip'
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
                    description: 'filter() returns a NEW array with only passing elements',
                    data: { evens: [2, 4, 6] },
                    highlight: 'output',
                    output: '[2, 4, 6]'
                }
            ],
            explanation: 'filter() creates a NEW array with only elements that pass the test. Elements that return false are excluded.'
        },
        {
            title: 'Reduce: Combine Into Single Value',
            code: `const numbers = [1, 2, 3, 4];

const sum = numbers.reduce((accumulator, current) => {
  return accumulator + current;
}, 0); // 0 is initial value

console.log(sum); // 10`,
            steps: [
                {
                    line: 1,
                    description: 'Start with an array of numbers',
                    data: { numbers: [1, 2, 3, 4] },
                    highlight: 'input'
                },
                {
                    line: 5,
                    description: 'Initialize accumulator to 0 (starting value)',
                    data: { accumulator: 0, current: null },
                    highlight: 'reduce'
                },
                {
                    line: 4,
                    description: 'Iteration 1: 0 + 1 = 1',
                    data: { accumulator: 0, current: 1, result: 1 },
                    highlight: 'execution',
                    output: '1'
                },
                {
                    line: 4,
                    description: 'Iteration 2: 1 + 2 = 3',
                    data: { accumulator: 1, current: 2, result: 3 },
                    highlight: 'execution',
                    output: '3'
                },
                {
                    line: 4,
                    description: 'Iteration 3: 3 + 3 = 6',
                    data: { accumulator: 3, current: 3, result: 6 },
                    highlight: 'execution',
                    output: '6'
                },
                {
                    line: 4,
                    description: 'Iteration 4: 6 + 4 = 10',
                    data: { accumulator: 6, current: 4, result: 10 },
                    highlight: 'execution',
                    output: '10'
                },
                {
                    line: 7,
                    description: 'reduce() returns the final accumulated value',
                    data: { sum: 10 },
                    highlight: 'output',
                    output: '10'
                }
            ],
            explanation: 'reduce() "reduces" an array to a single value by applying a function that combines elements. Great for sums, products, or building objects.'
        },
        {
            title: 'Chaining Methods Together',
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
                    description: 'Step 3: reduce() sums all values (6 + 12 + 18)',
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
            explanation: 'Methods can be chained because map() and filter() return new arrays. Each method passes its result to the next.'
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

            <main className="pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Zap className="text-emerald-400" size={48} />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">Higher-Order Functions</h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            Functions that accept other functions as arguments or return functions
                        </p>
                    </motion.div>

                    {/* Definitions Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Interview Definition */}
                        <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 rounded-xl p-6 border border-emerald-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="text-emerald-400" size={24} />
                                <h3 className="text-lg font-bold text-emerald-400">Interview Answer</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                "A higher-order function is a function that either takes one or more functions as arguments, or returns a function as its result."
                            </p>
                        </div>

                        {/* Simple Explanation */}
                        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 rounded-xl p-6 border border-blue-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="text-blue-400" size={24} />
                                <h3 className="text-lg font-bold text-blue-400">Simple Explanation</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                Think of higher-order functions as assembly lines. You give them raw materials (data) and instructions (functions), and they process everything automatically.
                            </p>
                        </div>

                        {/* Key Points */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 rounded-xl p-6 border border-purple-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="text-purple-400" size={24} />
                                <h3 className="text-lg font-bold text-purple-400">Core Methods</h3>
                            </div>
                            <ul className="space-y-2 text-slate-200 text-sm">
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span>map() - Transform each element</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span>filter() - Select elements</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span>reduce() - Combine to one value</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Example Tabs */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-3">
                            {examples.map((ex, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => changeExample(idx)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${currentExample === idx
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
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Code className="text-emerald-400" />
                            <h3 className="text-xl font-bold">Code Example</h3>
                        </div>
                        <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-700">
                            <SyntaxHighlighter
                                language="javascript"
                                style={atomDark}
                                customStyle={{
                                    margin: 0,
                                    padding: '1.5rem',
                                    fontSize: '0.95rem',
                                    backgroundColor: '#0f172a'
                                }}
                            >
                                {currentEx.code}
                            </SyntaxHighlighter>
                        </div>
                    </div>

                    {/* Step-by-Step Execution */}
                    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
                        <h3 className="text-2xl font-bold mb-6">Step-by-Step Visualization</h3>

                        {/* Controls */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex gap-3">
                                <button
                                    onClick={handleReset}
                                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    <RotateCcw size={20} />
                                </button>
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentStep === 0}
                                    className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={currentStep === currentEx.steps.length - 1}
                                    className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                            <div className="text-slate-400">
                                Step {currentStep + 1} of {currentEx.steps.length}
                            </div>
                        </div>

                        {/* Current Step Display */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {/* Line Number */}
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${currentStepData.highlight === 'map'
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : currentStepData.highlight === 'filter'
                                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                            : currentStepData.highlight === 'reduce'
                                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                : currentStepData.highlight === 'execution'
                                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                        }`}>
                                        {currentStepData.highlight === 'map' ? '🗺️ Mapping' :
                                            currentStepData.highlight === 'filter' ? '🔍 Filtering' :
                                                currentStepData.highlight === 'reduce' ? '➕ Reducing' :
                                                    currentStepData.highlight === 'execution' ? '▶️ Processing' : '📝 Data'}
                                    </span>
                                    <span className="text-2xl font-bold text-white">
                                        Line {currentStepData.line}
                                    </span>
                                </div>

                                {/* Description */}
                                <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-700">
                                    <p className="text-xl text-slate-200 leading-relaxed">
                                        {currentStepData.description}
                                    </p>
                                </div>

                                {/* Data Visualization */}
                                <div className="bg-slate-950 rounded-xl p-6 border border-emerald-500/30">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Layers className="text-emerald-400" size={20} />
                                        <h4 className="text-lg font-semibold text-emerald-400">Current State</h4>
                                    </div>
                                    <div className="font-mono text-sm">
                                        <pre className="text-cyan-400">
                                            {JSON.stringify(currentStepData.data, null, 2)}
                                        </pre>
                                    </div>
                                </div>

                                {/* Output if exists */}
                                {currentStepData.output && (
                                    <div className="flex items-center gap-4">
                                        <span className="text-slate-400">Output:</span>
                                        <div className="px-6 py-3 rounded-xl font-mono text-lg font-bold bg-green-500/20 text-green-400 border-2 border-green-500">
                                            {currentStepData.output}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Explanation */}
                        <div className="mt-8 p-6 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                            <h4 className="text-lg font-semibold text-emerald-400 mb-2">💡 Key Takeaway</h4>
                            <p className="text-slate-300">{currentEx.explanation}</p>
                        </div>
                    </div>

                    {/* Interview Tips */}
                    <div className="mt-12 bg-gradient-to-r from-emerald-900/30 to-blue-900/30 rounded-2xl p-8 border border-emerald-500/30">
                        <h3 className="text-2xl font-bold text-white mb-6">🎯 Interview Tips</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-emerald-400 mb-3">Common Questions:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• "Explain map, filter, reduce"</li>
                                    <li>• "When to use forEach vs map?"</li>
                                    <li>• "What is a higher-order function?"</li>
                                    <li>• "Can you chain array methods?"</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-blue-400 mb-3">Real-World Uses:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• Data transformation (APIs)</li>
                                    <li>• Filtering search results</li>
                                    <li>• Calculating totals/averages</li>
                                    <li>• Processing form data</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HigherOrderFunctionsVisualizer;
