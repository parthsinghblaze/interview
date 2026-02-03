'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers } from 'lucide-react';
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
                    line: 6,
                    description: 'Loop finishes - i is now 3',
                    scope: { i: 3, callbacks: 'all waiting' },
                    highlight: 'loop'
                },
                {
                    line: 6,
                    description: 'All callbacks execute - they all see i = 3!',
                    scope: { i: 3 },
                    highlight: 'execution',
                    output: '3, 3, 3'
                }
            ],
            explanation: 'All callbacks share the same i variable, not separate copies. When they execute, i is already 3!'
        },
        {
            title: 'Loop Closure Fix (let)',
            code: `for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
// Output: 0, 1, 2 (Correct!)`,
            steps: [
                {
                    line: 1,
                    description: 'let creates a NEW i for each iteration',
                    scope: { iteration: 'each has own i' },
                    highlight: 'fix'
                },
                {
                    line: 2,
                    description: 'Each callback closes over its OWN copy of i',
                    scope: { callback0: 'i=0', callback1: 'i=1', callback2: 'i=2' },
                    highlight: 'closure'
                },
                {
                    line: 6,
                    description: 'Callbacks execute with their respective i values',
                    scope: { outputs: [0, 1, 2] },
                    highlight: 'execution',
                    output: '0, 1, 2'
                }
            ],
            explanation: 'let creates a new binding for each iteration, so each callback captures its own i value'
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
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Lock className="text-purple-400" size={40} />
                            <h1 className="text-3xl font-bold">Closures</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Functions that remember variables from their outer scope
                        </p>
                    </div>

                    {/* Interview Definition */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-purple-400" size={22} />
                            <h3 className="text-base font-bold text-purple-400 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "A closure is a function that has access to variables in its outer (enclosing) scope, even after the outer function has returned."
                        </p>
                    </div>

                    {/* Simple Explanation */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-yellow-400" size={22} />
                            <h3 className="text-base font-bold text-yellow-400 uppercase">Simple Explanation</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            Think of a closure like a backpack. When a function is created, it packs variables from its surroundings into a backpack and carries them wherever it goes!
                        </p>
                    </div>

                    {/* Key Points */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-cyan-400" size={22} />
                            <h3 className="text-base font-bold text-cyan-400 uppercase">Remember</h3>
                        </div>
                        <ul className="space-y-3 text-slate-200 text-base">
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <div>
                                    <strong className="text-purple-400">Lexical Scope:</strong> functions remember where they were defined
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <div>
                                    <strong className="text-green-400">Data Privacy:</strong> create private variables
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">•</span>
                                <div>
                                    <strong className="text-blue-400">State Preservation:</strong> maintain state between calls
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Common Use Cases */}
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase">Common Use Cases</h4>
                        <ul className="space-y-2 text-slate-400 text-xs">
                            <li>• Data privacy/encapsulation</li>
                            <li>• Event handlers & callbacks</li>
                            <li>• Factory functions</li>
                            <li>• Partial application & currying</li>
                        </ul>
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
                    <div className="bg-slate-900/50 flex flex-col" style={{ height: '40vh' }}>
                        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-700 bg-slate-900">
                            <Code className="text-purple-400" size={20} />
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

                    {/* Step-by-Step Execution - Takes remaining space */}
                    <div className="flex-1 bg-slate-900 px-8 py-6 overflow-y-auto border-t border-slate-700">
                        <div className="max-w-5xl mx-auto">
                            {/* Controls */}
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold">Step-by-Step Execution</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400 text-base">
                                        Step {currentStep + 1} of {currentEx.steps.length}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleReset}
                                            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                                            title="Reset"
                                        >
                                            <RotateCcw size={20} />
                                        </button>
                                        <button
                                            onClick={handlePrevious}
                                            disabled={currentStep === 0}
                                            className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                                            title="Previous"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={currentStep === currentEx.steps.length - 1}
                                            className="p-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                                            title="Next"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Current Step Display */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    {/* Phase Badge & Line */}
                                    <div className="flex items-center gap-6">
                                        <span className={`px-5 py-2.5 rounded-xl text-sm font-bold ${currentStepData.highlight === 'closure'
                                            ? 'bg-purple-500/20 text-purple-400 border-2 border-purple-500/50'
                                            : currentStepData.highlight === 'execution'
                                                ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500/50'
                                                : currentStepData.highlight === 'private'
                                                    ? 'bg-red-500/20 text-red-400 border-2 border-red-500/50'
                                                    : 'bg-green-500/20 text-green-400 border-2 border-green-500/50'
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
                                    <div className="bg-slate-800/50 rounded-2xl p-6 border-2 border-slate-700">
                                        <p className="text-lg text-slate-100 leading-relaxed">
                                            {currentStepData.description}
                                        </p>
                                    </div>

                                    {/* Scope Visualization */}
                                    <div className="bg-slate-950 rounded-xl p-6 border-2 border-purple-500/30">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Layers className="text-purple-400" size={20} />
                                            <h4 className="text-base font-semibold text-purple-400">Scope Chain</h4>
                                        </div>
                                        <div className="font-mono text-sm">
                                            <pre className="text-cyan-400">
                                                {JSON.stringify(currentStepData.scope, null, 2)}
                                            </pre>
                                        </div>
                                    </div>

                                    {/* Output if exists */}
                                    {currentStepData.output && (
                                        <div className="flex items-center gap-6">
                                            <span className="text-base text-slate-400 font-medium">Output:</span>
                                            <div className="px-6 py-3 rounded-xl font-mono text-xl font-bold bg-green-500/20 text-green-400 border-2 border-green-500">
                                                {currentStepData.output}
                                            </div>
                                        </div>
                                    )}

                                    {/* Explanation */}
                                    <div className="mt-6 p-5 bg-purple-500/10 rounded-xl border-2 border-purple-500/30">
                                        <h4 className="text-base font-semibold text-purple-400 mb-2 flex items-center gap-2">
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

export default ClosuresVisualizer;
