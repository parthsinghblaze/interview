'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const GeneratorsVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Basic Generator Function',
            code: `function* simpleGenerator() {
  console.log('Start');
  yield 1;
  console.log('Middle');
  yield 2;
  console.log('End');
  yield 3;
}

const gen = simpleGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }`,
            steps: [
                {
                    line: 1,
                    description: 'function* declares a generator (note the asterisk)',
                    data: { type: 'generator', paused: true },
                    highlight: 'definition'
                },
                {
                    line: 10,
                    description: 'Calling simpleGenerator() returns a generator object',
                    data: { gen: 'Generator object', state: 'suspended' },
                    highlight: 'create',
                    output: 'Generator {}'
                },
                {
                    line: 11,
                    description: 'First next() - runs until first yield',
                    data: { log: 'Start', yield: 1, paused: 'at line 3' },
                    highlight: 'yield',
                    output: '{ value: 1, done: false }'
                },
                {
                    line: 12,
                    description: 'Second next() - resumes, runs to second yield',
                    data: { log: 'Middle', yield: 2, paused: 'at line 5' },
                    highlight: 'yield',
                    output: '{ value: 2, done: false }'
                },
                {
                    line: 13,
                    description: 'Third next() - resumes, runs to third yield',
                    data: { log: 'End', yield: 3, paused: 'at line 7' },
                    highlight: 'yield',
                    output: '{ value: 3, done: false }'
                },
                {
                    line: 14,
                    description: 'Fourth next() - no more yields, generator done',
                    data: { state: 'completed', done: true },
                    highlight: 'done',
                    output: '{ value: undefined, done: true }'
                }
            ],
            explanation: 'Generators can pause (yield) and resume execution. Call next() to get the next value.'
        },
        {
            title: 'ID Generator (Practical Use)',
            code: `function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const gen = idGenerator();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // 3`,
            steps: [
                {
                    line: 2,
                    description: 'Initialize id counter to 1',
                    data: { id: 1 },
                    highlight: 'init'
                },
                {
                    line: 3,
                    description: 'Infinite loop! But generators can handle this',
                    data: { loop: 'infinite', safe: true },
                    highlight: 'loop'
                },
                {
                    line: 8,
                    description: 'First next() - yield 1, then increment to 2',
                    data: { yielded: 1, idAfter: 2 },
                    highlight: 'yield',
                    output: '1'
                },
                {
                    line: 9,
                    description: 'Second next() - yield 2, then increment to 3',
                    data: { yielded: 2, idAfter: 3 },
                    highlight: 'yield',
                    output: '2'
                },
                {
                    line: 10,
                    description: 'Third next() - yield 3, then increment to 4',
                    data: { yielded: 3, idAfter: 4 },
                    highlight: 'yield',
                    output: '3'
                },
                {
                    line: 7,
                    description: 'Generator maintains state between calls!',
                    data: { currentId: 4, callCount: 3, infinite: true },
                    highlight: 'state',
                    output: 'State preserved!'
                }
            ],
            explanation: 'Generators are perfect for infinite sequences. They only compute values when needed (lazy evaluation).'
        },
        {
            title: 'Two-Way Communication',
            code: `function* twoWay() {
  const name = yield 'What is your name?';
  const age = yield \`Hello \${name}, how old are you?\`;
  return \`\${name} is \${age} years old\`;
}

const gen = twoWay();
console.log(gen.next());           // { value: 'What is your name?', done: false }
console.log(gen.next('Parth'));    // { value: 'Hello Parth, how old are you?', done: false }
console.log(gen.next(25));         // { value: 'Parth is 25 years old', done: true }`,
            steps: [
                {
                    line: 7,
                    description: 'First next() - no input, yield the question',
                    data: { phase: 'ask name', input: null },
                    highlight: 'yield',
                    output: 'What is your name?'
                },
                {
                    line: 8,
                    description: 'Second next("Parth") - send "Parth" as name',
                    data: { name: 'Parth', phase: 'ask age' },
                    highlight: 'input',
                    output: 'Hello Parth, how old are you?'
                },
                {
                    line: 9,
                    description: 'Third next(25) - send 25 as age, function returns',
                    data: { name: 'Parth', age: 25, done: true },
                    highlight: 'return',
                    output: 'Parth is 25 years old'
                },
                {
                    line: 4,
                    description: 'You can pass values INTO generators with next(value)',
                    data: { communication: 'bi-directional' },
                    highlight: 'summary',
                    output: 'Two-way flow!'
                }
            ],
            explanation: 'Generators support two-way communication! yield sends values OUT, next(value) sends values IN.'
        },
        {
            title: 'Custom Iterator Protocol',
            code: `const range = {
  from: 1,
  to: 5,
  
  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i++) {
      yield i;
    }
  }
};

// Now you can use for...of
for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}`,
            steps: [
                {
                    line: 1,
                    description: 'Create a custom range object',
                    data: { from: 1, to: 5 },
                    highlight: 'object'
                },
                {
                    line: 5,
                    description: 'Implement Symbol.iterator as a generator',
                    data: { method: 'generator', iterable: true },
                    highlight: 'iterator'
                },
                {
                    line: 13,
                    description: 'for...of automatically calls next() repeatedly',
                    data: { loop: 'for...of', auto: true },
                    highlight: 'loop'
                },
                {
                    line: 7,
                    description: 'Iteration 1: yield 1',
                    data: { i: 1 },
                    highlight: 'yield',
                    output: '1'
                },
                {
                    line: 7,
                    description: 'Iterations 2-5: yield 2, 3, 4, 5',
                    data: { values: [2, 3, 4, 5] },
                    highlight: 'yield',
                    output: '2, 3, 4, 5'
                },
                {
                    line: 13,
                    description: 'Any object with Symbol.iterator is iterable!',
                    data: { iterable: true, customRange: true },
                    highlight: 'summary',
                    output: 'Custom iteration complete!'
                }
            ],
            explanation: 'Generators make it easy to create custom iterables. Just implement Symbol.iterator as a generator!'
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
                            <Play className="text-rose-400" size={48} />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">Generators & Iterators</h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            Functions that can pause and resume execution using yield
                        </p>
                    </motion.div>

                    {/* Definitions Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Interview Definition */}
                        <div className="bg-gradient-to-br from-rose-900/40 to-slate-900 rounded-xl p-6 border border-rose-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="text-rose-400" size={24} />
                                <h3 className="text-lg font-bold text-rose-400">Interview Answer</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                "A generator is a special function that can pause execution using yield and resume later. It returns an iterator object."
                            </p>
                        </div>

                        {/* Simple Explanation */}
                        <div className="bg-gradient-to-br from-pink-900/40 to-slate-900 rounded-xl p-6 border border-pink-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="text-pink-400" size={24} />
                                <h3 className="text-lg font-bold text-pink-400">Simple Explanation</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                Think of a generator as a video game save point. You can pause the game (yield), do something else, then resume exactly where you left off!
                            </p>
                        </div>

                        {/* Key Points */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 rounded-xl p-6 border border-purple-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="text-purple-400" size={24} />
                                <h3 className="text-lg font-bold text-purple-400">Core Concepts</h3>
                            </div>
                            <ul className="space-y-2 text-slate-200 text-sm">
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span>Use function* syntax</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span>yield pauses execution</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span>next() resumes execution</span>
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
                                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30'
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
                            <Code className="text-rose-400" />
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
                                    className="p-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 rounded-lg transition-colors"
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
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${currentStepData.highlight === 'yield'
                                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                        : currentStepData.highlight === 'create'
                                            ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                                            : currentStepData.highlight === 'input'
                                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                : currentStepData.highlight === 'done'
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        }`}>
                                        {currentStepData.highlight === 'yield' ? '⏸️ Yielding' :
                                            currentStepData.highlight === 'create' ? '🏗️ Creating' :
                                                currentStepData.highlight === 'input' ? '📨 Receiving' :
                                                    currentStepData.highlight === 'done' ? '✅ Done' : '📝 Info'}
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
                                <div className="bg-slate-950 rounded-xl p-6 border border-rose-500/30">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Layers className="text-rose-400" size={20} />
                                        <h4 className="text-lg font-semibold text-rose-400">Current State</h4>
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
                        <div className="mt-8 p-6 bg-rose-500/10 rounded-xl border border-rose-500/30">
                            <h4 className="text-lg font-semibold text-rose-400 mb-2">💡 Key Takeaway</h4>
                            <p className="text-slate-300">{currentEx.explanation}</p>
                        </div>
                    </div>

                    {/* Interview Tips */}
                    <div className="mt-12 bg-gradient-to-r from-rose-900/30 to-pink-900/30 rounded-2xl p-8 border border-rose-500/30">
                        <h3 className="text-2xl font-bold text-white mb-6">🎯 Interview Tips</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-rose-400 mb-3">Common Questions:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• "What is a generator function?"</li>
                                    <li>• "Difference between return and yield?"</li>
                                    <li>• "How do generators maintain state?"</li>
                                    <li>• "When to use generators?"</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-pink-400 mb-3">Real-World Uses:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• Infinite sequences (IDs, pagination)</li>
                                    <li>• Loading data in chunks</li>
                                    <li>• Custom iterators</li>
                                    <li>• Async/await (built on generators)</li>
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

export default GeneratorsVisualizer;
