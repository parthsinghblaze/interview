'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Play, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ClosuresVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Basic Closure Example',
            code: `function outer() {
  let count = 0;
  
  function inner() {
    count++;
    return count;
  }
  
  return inner;
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2`,
            steps: [
                {
                    line: 1,
                    description: 'outer() function is defined with variable "count"',
                    scope: { outer: { count: 0 }, inner: null },
                    highlight: 'outer'
                },
                {
                    line: 4,
                    description: 'inner() function is created - it "closes over" count variable',
                    scope: { outer: { count: 0 }, inner: 'has access to count' },
                    highlight: 'closure'
                },
                {
                    line: 9,
                    description: 'outer() returns inner function - but count is still accessible!',
                    scope: { outer: { count: 0 }, inner: 'remembers count' },
                    highlight: 'return'
                },
                {
                    line: 12,
                    description: 'First call to counter() - count becomes 1',
                    scope: { outer: { count: 1 }, inner: 'still has access' },
                    highlight: 'execution',
                    output: '1'
                },
                {
                    line: 13,
                    description: 'Second call to counter() - count becomes 2 (state preserved!)',
                    scope: { outer: { count: 2 }, inner: 'still has access' },
                    highlight: 'execution',
                    output: '2'
                }
            ],
            explanation: 'Closure allows inner() to remember and access count even after outer() has finished executing'
        },
        {
            title: 'Private Variables Pattern',
            code: `function createBankAccount(initial) {
  let balance = initial; // private!
  
  return {
    deposit(amount) {
      balance += amount;
      return balance;
    },
    withdraw(amount) {
      balance -= amount;
      return balance;
    },
    getBalance() {
      return balance;
    }
  };
}

const account = createBankAccount(100);
account.deposit(50);  // 150
account.withdraw(30); // 120
console.log(account.balance); // undefined`,
            steps: [
                {
                    line: 2,
                    description: 'balance variable is private - not accessible outside',
                    scope: { balance: 100 },
                    highlight: 'private'
                },
                {
                    line: 5,
                    description: 'deposit() creates closure - can access balance',
                    scope: { balance: 100, methods: 'created' },
                    highlight: 'closure'
                },
                {
                    line: 20,
                    description: 'deposit(50) - balance is accessed and modified',
                    scope: { balance: 150 },
                    highlight: 'execution',
                    output: '150'
                },
                {
                    line: 21,
                    description: 'withdraw(30) - balance updated again',
                    scope: { balance: 120 },
                    highlight: 'execution',
                    output: '120'
                },
                {
                    line: 22,
                    description: 'account.balance is undefined - balance is truly private!',
                    scope: { balance: 120 },
                    highlight: 'private',
                    output: 'undefined'
                }
            ],
            explanation: 'Closures enable data privacy - balance cannot be accessed directly, only through methods'
        },
        {
            title: 'Loop Closure Problem (var)',
            code: `for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
// Output: 3, 3, 3 (Not 0, 1, 2!)`,
            steps: [
                {
                    line: 1,
                    description: 'Loop runs 3 times, creating 3 setTimeout callbacks',
                    scope: { i: 'shared reference', callbacks: 3 },
                    highlight: 'loop'
                },
                {
                    line: 2,
                    description: 'Each callback closes over the SAME variable i (not its value)',
                    scope: { i: 'shared', callbacks: 'all reference same i' },
                    highlight: 'closure'
                },
                {
                    line: 5,
                    description: 'Loop finishes - i is now 3',
                    scope: { i: 3, callbacks: 'waiting to execute' },
                    highlight: 'loop-end'
                },
                {
                    line: 3,
                    description: 'After 1 second, all callbacks run - all log the current value of i (3)',
                    scope: { i: 3 },
                    highlight: 'execution',
                    output: '3, 3, 3'
                }
            ],
            explanation: 'var creates ONE shared variable - all closures reference the same i'
        },
        {
            title: 'Loop Solution (let)',
            code: `for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
// Output: 0, 1, 2 ✅`,
            steps: [
                {
                    line: 1,
                    description: 'let creates a NEW variable for each iteration',
                    scope: { iterations: [{ i: 0 }, { i: 1 }, { i: 2 }] },
                    highlight: 'loop'
                },
                {
                    line: 2,
                    description: 'Each callback closes over its OWN copy of i',
                    scope: {
                        callbacks: [
                            { i: 0 },
                            { i: 1 },
                            { i: 2 }
                        ]
                    },
                    highlight: 'closure'
                },
                {
                    line: 3,
                    description: 'After 1 second, each callback logs its own captured value',
                    scope: { outputs: [0, 1, 2] },
                    highlight: 'execution',
                    output: '0, 1, 2'
                }
            ],
            explanation: 'let creates block scope - each iteration gets its own variable, fixing the closure issue'
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
                            <Lock className="text-purple-400" size={48} />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">JavaScript Closures</h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            Functions that remember variables from their outer scope
                        </p>
                    </motion.div>

                    {/* Definitions Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Interview Definition */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 rounded-xl p-6 border border-purple-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="text-purple-400" size={24} />
                                <h3 className="text-lg font-bold text-purple-400">Interview Answer</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                "A closure is when a function remembers variables from outside, even after the outer function has finished running."
                            </p>
                        </div>

                        {/* Simple Explanation */}
                        <div className="bg-gradient-to-br from-green-900/40 to-slate-900 rounded-xl p-6 border border-green-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="text-green-400" size={24} />
                                <h3 className="text-lg font-bold text-green-400">Simple Explanation</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                A closure is like a backpack that a function carries around. It contains all the variables that were in scope when the function was created, even if the original context is gone.
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
                                    <span>Functions remember outer scope</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>Enable data privacy</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>Power factory functions</span>
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
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
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
                            <Code className="text-purple-400" />
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
                                    className="p-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg transition-colors"
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
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${currentStepData.highlight === 'closure'
                                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                        : currentStepData.highlight === 'execution'
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : currentStepData.highlight === 'private'
                                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        }`}>
                                        {currentStepData.highlight === 'closure' ? '🔒 Closure Created' :
                                            currentStepData.highlight === 'execution' ? '▶️ Executing' :
                                                currentStepData.highlight === 'private' ? '🔐 Private Access' : '📝 Definition'}
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

                                {/* Scope Visualization */}
                                <div className="bg-slate-950 rounded-xl p-6 border border-purple-500/30">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Layers className="text-purple-400" size={20} />
                                        <h4 className="text-lg font-semibold text-purple-400">Scope & Memory</h4>
                                    </div>
                                    <div className="font-mono text-sm">
                                        <pre className="text-cyan-400">
                                            {JSON.stringify(currentStepData.scope, null, 2)}
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
                        <div className="mt-8 p-6 bg-purple-500/10 rounded-xl border border-purple-500/30">
                            <h4 className="text-lg font-semibold text-purple-400 mb-2">💡 Key Takeaway</h4>
                            <p className="text-slate-300">{currentEx.explanation}</p>
                        </div>
                    </div>

                    {/* Interview Tips */}
                    <div className="mt-12 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/30">
                        <h3 className="text-2xl font-bold text-white mb-6">🎯 Interview Tips</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-purple-400 mb-3">Common Questions:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• "What is a closure?"</li>
                                    <li>• "Explain closures with an example"</li>
                                    <li>• "What are practical uses of closures?"</li>
                                    <li>• "Difference between closure and scope?"</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-pink-400 mb-3">Real-World Uses:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• Data privacy & encapsulation</li>
                                    <li>• Factory functions & modules</li>
                                    <li>• Event handlers & callbacks</li>
                                    <li>• Partial application & currying</li>
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

export default ClosuresVisualizer;
