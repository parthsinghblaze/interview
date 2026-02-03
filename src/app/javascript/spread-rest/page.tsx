'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Play, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SpreadRestVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Spread: Expanding Arrays',
            code: `const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Spread expands array into individual elements
const combined = [...arr1, ...arr2];

console.log(combined); // [1, 2, 3, 4, 5, 6]`,
            steps: [
                {
                    line: 1,
                    description: 'Start with two separate arrays',
                    data: { arr1: [1, 2, 3], arr2: [4, 5, 6] },
                    highlight: 'input'
                },
                {
                    line: 5,
                    description: '...arr1 expands to: 1, 2, 3',
                    data: { expanding: 'arr1', result: '1, 2, 3' },
                    highlight: 'spread',
                    output: '1, 2, 3'
                },
                {
                    line: 5,
                    description: '...arr2 expands to: 4, 5, 6',
                    data: { expanding: 'arr2', result: '4, 5, 6' },
                    highlight: 'spread',
                    output: '4, 5, 6'
                },
                {
                    line: 5,
                    description: 'Combine all elements into a NEW array',
                    data: { combined: [1, 2, 3, 4, 5, 6] },
                    highlight: 'combine',
                    output: '[1, 2, 3, 4, 5, 6]'
                }
            ],
            explanation: 'Spread operator (...) expands an array into individual elements. Perfect for combining arrays!'
        },
        {
            title: 'Spread: Shallow Copy Objects',
            code: `const person = {
  name: 'Parth',
  age: 25
};

// Create a shallow copy
const clone = { ...person };

clone.name = 'John';
console.log(person.name); // 'Parth' (unchanged)
console.log(clone.name);  // 'John'`,
            steps: [
                {
                    line: 1,
                    description: 'Original object with name and age',
                    data: { person: { name: 'Parth', age: 25 } },
                    highlight: 'input'
                },
                {
                    line: 6,
                    description: '{ ...person } creates a NEW object with copied properties',
                    data: { clone: { name: 'Parth', age: 25 }, memory: 'different' },
                    highlight: 'spread',
                    output: 'New object created'
                },
                {
                    line: 8,
                    description: 'Modify clone.name to "John"',
                    data: { clone: { name: 'John', age: 25 } },
                    highlight: 'modify'
                },
                {
                    line: 9,
                    description: 'Original person.name is unchanged',
                    data: { person: { name: 'Parth', age: 25 } },
                    highlight: 'check',
                    output: 'Parth'
                },
                {
                    line: 10,
                    description: 'Clone has the new value',
                    data: { clone: { name: 'John', age: 25 } },
                    highlight: 'check',
                    output: 'John'
                }
            ],
            explanation: 'Spread creates a SHALLOW copy. Top-level properties are copied, but nested objects are still references.'
        },
        {
            title: 'Rest: Collecting Function Arguments',
            code: `// Old way (arguments object)
function oldSum() {
  const args = Array.from(arguments);
  return args.reduce((sum, n) => sum + n, 0);
}

// Modern way (rest parameters)
function sum(...numbers) {
  return numbers.reduce((sum, n) => sum + n, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15`,
            steps: [
                {
                    line: 8,
                    description: '...numbers collects ALL arguments into a real array',
                    data: { syntax: '...numbers', result: 'array' },
                    highlight: 'rest'
                },
                {
                    line: 12,
                    description: 'Call sum with 5 arguments: 1, 2, 3, 4, 5',
                    data: { arguments: [1, 2, 3, 4, 5] },
                    highlight: 'call'
                },
                {
                    line: 8,
                    description: 'Rest operator collects them into numbers array',
                    data: { numbers: [1, 2, 3, 4, 5] },
                    highlight: 'rest',
                    output: '[1, 2, 3, 4, 5]'
                },
                {
                    line: 9,
                    description: 'Use array methods on the collected arguments',
                    data: { operation: 'reduce', result: 15 },
                    highlight: 'execution',
                    output: '15'
                }
            ],
            explanation: 'Rest operator collects multiple values into an array. Great for functions with variable arguments!'
        },
        {
            title: 'Rest: Destructuring Arrays',
            code: `const numbers = [1, 2, 3, 4, 5];

// Get first, second, and REST
const [first, second, ...rest] = numbers;

console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]`,
            steps: [
                {
                    line: 1,
                    description: 'Start with an array of 5 numbers',
                    data: { numbers: [1, 2, 3, 4, 5] },
                    highlight: 'input'
                },
                {
                    line: 4,
                    description: 'Destructure: first gets index 0',
                    data: { first: 1 },
                    highlight: 'destructure',
                    output: '1'
                },
                {
                    line: 4,
                    description: 'Destructure: second gets index 1',
                    data: { second: 2 },
                    highlight: 'destructure',
                    output: '2'
                },
                {
                    line: 4,
                    description: '...rest collects REMAINING elements',
                    data: { rest: [3, 4, 5] },
                    highlight: 'rest',
                    output: '[3, 4, 5]'
                },
                {
                    line: 6,
                    description: 'All values extracted successfully',
                    data: {
                        first: 1,
                        second: 2,
                        rest: [3, 4, 5]
                    },
                    highlight: 'output',
                    output: '1, 2, [3,4,5]'
                }
            ],
            explanation: 'Rest in destructuring collects remaining elements. Must be the LAST element in the pattern.'
        },
        {
            title: 'Rest: Destructuring Objects',
            code: `const user = {
  name: 'Parth',
  age: 25,
  city: 'Mumbai',
  country: 'India'
};

const { name, age, ...location } = user;

console.log(name);     // 'Parth'
console.log(age);      // 25
console.log(location); // { city: 'Mumbai', country: 'India' }`,
            steps: [
                {
                    line: 1,
                    description: 'Original user object with 4 properties',
                    data: { user: { name: 'Parth', age: 25, city: 'Mumbai', country: 'India' } },
                    highlight: 'input'
                },
                {
                    line: 8,
                    description: 'Extract name property',
                    data: { name: 'Parth' },
                    highlight: 'destructure',
                    output: 'Parth'
                },
                {
                    line: 8,
                    description: 'Extract age property',
                    data: { age: 25 },
                    highlight: 'destructure',
                    output: '25'
                },
                {
                    line: 8,
                    description: '...location collects REMAINING properties',
                    data: { location: { city: 'Mumbai', country: 'India' } },
                    highlight: 'rest',
                    output: '{ city: "Mumbai", country: "India" }'
                },
                {
                    line: 10,
                    description: 'Now we have separated data into logical groups',
                    data: {
                        personal: { name: 'Parth', age: 25 },
                        location: { city: 'Mumbai', country: 'India' }
                    },
                    highlight: 'output',
                    output: 'Successfully split!'
                }
            ],
            explanation: 'Rest in object destructuring collects remaining properties into a new object. Great for splitting data!'
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
                            <Box className="text-indigo-400" size={48} />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">Spread & Rest Operators</h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            The "..." operator - expand elements with spread, collect them with rest
                        </p>
                    </motion.div>

                    {/* Definitions Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Interview Definition */}
                        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 rounded-xl p-6 border border-indigo-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="text-indigo-400" size={24} />
                                <h3 className="text-lg font-bold text-indigo-400">Interview Answer</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                "The spread operator (...) expands elements of an iterable. The rest operator (...) collects multiple elements into an array. Same syntax, opposite purposes!"
                            </p>
                        </div>

                        {/* Simple Explanation */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 rounded-xl p-6 border border-purple-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="text-purple-400" size={24} />
                                <h3 className="text-lg font-bold text-purple-400">Simple Explanation</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                Spread is like unpacking a suitcase (items come out). Rest is like packing a suitcase (items go in).
                            </p>
                        </div>

                        {/* Key Points */}
                        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 rounded-xl p-6 border border-blue-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="text-blue-400" size={24} />
                                <h3 className="text-lg font-bold text-blue-400">Core Concepts</h3>
                            </div>
                            <ul className="space-y-2 text-slate-200 text-sm">
                                <li className="flex gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>Spread: expands/unpacks</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>Rest: collects/packs</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>Both use ... syntax</span>
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
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Code className="text-indigo-400" />
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
                                    className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-colors"
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
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${currentStepData.highlight === 'spread'
                                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                        : currentStepData.highlight === 'rest'
                                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                            : currentStepData.highlight === 'destructure'
                                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                : currentStepData.highlight === 'execution'
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                        }`}>
                                        {currentStepData.highlight === 'spread' ? '📤 Spreading' :
                                            currentStepData.highlight === 'rest' ? '📥 Resting' :
                                                currentStepData.highlight === 'destructure' ? '🔓 Destructuring' :
                                                    currentStepData.highlight === 'execution' ? '▶️ Executing' : '📝 Input'}
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
                                <div className="bg-slate-950 rounded-xl p-6 border border-indigo-500/30">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Layers className="text-indigo-400" size={20} />
                                        <h4 className="text-lg font-semibold text-indigo-400">Current State</h4>
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
                        <div className="mt-8 p-6 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
                            <h4 className="text-lg font-semibold text-indigo-400 mb-2">💡 Key Takeaway</h4>
                            <p className="text-slate-300">{currentEx.explanation}</p>
                        </div>
                    </div>

                    {/* Interview Tips */}
                    <div className="mt-12 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-2xl p-8 border border-indigo-500/30">
                        <h3 className="text-2xl font-bold text-white mb-6">🎯 Interview Tips</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-indigo-400 mb-3">Common Questions:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• "Difference between spread and rest?"</li>
                                    <li>• "Is spread a deep or shallow copy?"</li>
                                    <li>• "Where can you use ...?"</li>
                                    <li>• "Rest parameter vs arguments?"</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-purple-400 mb-3">Real-World Uses:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• Copying arrays/objects</li>
                                    <li>• Merging data structures</li>
                                    <li>• Function parameters</li>
                                    <li>• Destructuring patterns</li>
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

export default SpreadRestVisualizer;
