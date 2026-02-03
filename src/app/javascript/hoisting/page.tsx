'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Play, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const HoistingVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const examples = [
        {
            title: 'Variable Hoisting with var',
            code: `console.log(x); // undefined
var x = 5;
console.log(x); // 5`,
            hoistedCode: `var x; // hoisted to top
console.log(x); // undefined
x = 5;
console.log(x); // 5`,
            steps: [
                { line: 1, description: 'Declaration "var x" is hoisted to the top', phase: 'hoisting', value: 'undefined' },
                { line: 2, description: 'console.log(x) executes - x is declared but not initialized', phase: 'execution', value: 'undefined' },
                { line: 3, description: 'x is assigned the value 5', phase: 'execution', value: '5' },
                { line: 4, description: 'console.log(x) now prints 5', phase: 'execution', value: '5' }
            ],
            explanation: 'var declarations are hoisted but initialized with undefined'
        },
        {
            title: 'let/const - Temporal Dead Zone',
            code: `console.log(y); // ReferenceError
let y = 10;`,
            hoistedCode: `// let y; Created but in TDZ
console.log(y); // ❌ ReferenceError
let y = 10; // Initialization`,
            steps: [
                { line: 1, description: 'let y is hoisted but enters Temporal Dead Zone (TDZ)', phase: 'hoisting', value: 'TDZ' },
                { line: 2, description: 'Accessing y before initialization throws ReferenceError', phase: 'execution', value: 'Error!' },
                { line: 3, description: 'TDZ ends when y is initialized with 10', phase: 'execution', value: '10' }
            ],
            explanation: 'let/const are hoisted but cannot be accessed before declaration (TDZ)'
        },
        {
            title: 'Function Hoisting',
            code: `sayHello(); // "Hello!"
function sayHello() {
  console.log("Hello!");
}`,
            hoistedCode: `function sayHello() {
  console.log("Hello!");
} // Entire function hoisted
sayHello(); // ✅ Works!`,
            steps: [
                { line: 1, description: 'Entire function declaration is hoisted to the top', phase: 'hoisting', value: 'function' },
                { line: 2, description: 'Function can be called before its declaration in code', phase: 'execution', value: '"Hello!"' }
            ],
            explanation: 'Function declarations are fully hoisted - both name and body'
        },
        {
            title: 'Function Expression (Not Hoisted)',
            code: `greet(); // TypeError
var greet = function() {
  console.log("Hi!");
};`,
            hoistedCode: `var greet; // Only var hoisted
greet(); // ❌ TypeError: not a function
greet = function() {
  console.log("Hi!");
};`,
            steps: [
                { line: 1, description: 'Only var declaration is hoisted, not the function', phase: 'hoisting', value: 'undefined' },
                { line: 2, description: 'greet is undefined, cannot be called as a function', phase: 'execution', value: 'TypeError!' },
                { line: 3, description: 'Function is assigned to greet', phase: 'execution', value: 'function' }
            ],
            explanation: 'Function expressions are NOT hoisted like function declarations'
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
        setIsPlaying(false);
    };

    const changeExample = (index: number) => {
        setCurrentExample(index);
        setCurrentStep(0);
        setIsPlaying(false);
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
                            <ArrowUp className="text-blue-400" size={48} />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">JavaScript Hoisting</h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            Understand how JavaScript moves declarations to the top before execution
                        </p>
                    </motion.div>

                    {/* Definitions Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Interview Definition */}
                        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 rounded-xl p-6 border border-blue-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="text-blue-400" size={24} />
                                <h3 className="text-lg font-bold text-blue-400">Interview Answer</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                "Before running your code, JavaScript first reads all variable and function declarations and moves them to the top. This is called hoisting."
                            </p>
                        </div>

                        {/* Simple Explanation */}
                        <div className="bg-gradient-to-br from-green-900/40 to-slate-900 rounded-xl p-6 border border-green-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="text-green-400" size={24} />
                                <h3 className="text-lg font-bold text-green-400">Simple Explanation</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                Before your code runs, JavaScript reads through it and "lifts" all variable and function declarations to the top. It's like JavaScript saying "Let me note down all the names first, then run the code."
                            </p>
                        </div>

                        {/* Key Points */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 rounded-xl p-6 border border-purple-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="text-purple-400" size={24} />
                                <h3 className="text-lg font-bold text-purple-400">Remember</h3>
                            </div>
                            <ul className="space-y-2 text-slate-200 text-sm">
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span><strong>var</strong>: hoisted as undefined</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span><strong>let/const</strong>: hoisted with TDZ</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span><strong>Functions</strong>: fully hoisted</span>
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
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {ex.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Visualizer */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

                        {/* Left: Original Code */}
                        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700">
                            <div className="flex items-center gap-2 mb-4">
                                <Code className="text-red-400" />
                                <h3 className="text-xl font-bold">Original Code</h3>
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

                        {/* Right: After Hoisting */}
                        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700">
                            <div className="flex items-center gap-2 mb-4">
                                <ArrowUp className="text-green-400" />
                                <h3 className="text-xl font-bold">After Hoisting</h3>
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
                                    {currentEx.hoistedCode}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>

                    {/* Step-by-Step Execution */}
                    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
                        <h3 className="text-2xl font-bold mb-6">Step-by-Step Execution</h3>

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
                                    className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg transition-colors"
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
                                {/* Phase Badge */}
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${currentStepData.phase === 'hoisting'
                                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        }`}>
                                        {currentStepData.phase === 'hoisting' ? '🔄 Hoisting Phase' : '▶️ Execution Phase'}
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

                                {/* Value Display */}
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400">Current Value:</span>
                                    <div className={`px-6 py-3 rounded-xl font-mono text-lg font-bold ${currentStepData.value.includes('Error') || currentStepData.value === 'TDZ'
                                        ? 'bg-red-500/20 text-red-400 border-2 border-red-500'
                                        : currentStepData.value === 'undefined'
                                            ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500'
                                            : 'bg-green-500/20 text-green-400 border-2 border-green-500'
                                        }`}>
                                        {currentStepData.value}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Explanation */}
                        <div className="mt-8 p-6 bg-blue-500/10 rounded-xl border border-blue-500/30">
                            <h4 className="text-lg font-semibold text-blue-400 mb-2">💡 Key Takeaway</h4>
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
                                    <li>• "What is hoisting in JavaScript?"</li>
                                    <li>• "Difference between var, let, and const hoisting?"</li>
                                    <li>• "What is the Temporal Dead Zone?"</li>
                                    <li>• "Can you call a function before declaring it?"</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-pink-400 mb-3">Best Practices:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• Always declare variables at the top of scope</li>
                                    <li>• Use let/const instead of var</li>
                                    <li>• Declare functions before using them</li>
                                    <li>• Avoid relying on hoisting behavior</li>
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

export default HoistingVisualizer;
