'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Play, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, X } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const HoistingVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

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
                            <ArrowUp className="text-blue-400" size={40} />
                            <h1 className="text-3xl font-bold">Hoisting</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            How JavaScript moves declarations to the top before execution
                        </p>
                    </div>

                    {/* Interview Definition */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-blue-400" size={22} />
                            <h3 className="text-base font-bold text-blue-400 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "Before running your code, JavaScript first reads all variable and function declarations and moves them to the top. This is called hoisting."
                        </p>
                    </div>

                    {/* Simple Explanation */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-yellow-400" size={22} />
                            <h3 className="text-base font-bold text-yellow-400 uppercase">Simple Explanation</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            Before your code runs, JavaScript reads through it and "lifts" all variable and function declarations to the top. It's like JavaScript saying "Let me note down all the names first, then run the code."
                        </p>
                    </div>

                    {/* Key Points */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-purple-400" size={22} />
                            <h3 className="text-base font-bold text-purple-400 uppercase">Remember</h3>
                        </div>
                        <ul className="space-y-3 text-slate-200 text-base">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <div>
                                    <strong className="text-blue-400">var:</strong> hoisted as undefined
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <div>
                                    <strong className="text-yellow-400">let/const:</strong> hoisted with TDZ
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <div>
                                    <strong className="text-green-400">Functions:</strong> fully hoisted
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Best Practices */}
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase">Best Practices</h4>
                        <ul className="space-y-2 text-slate-400 text-xs">
                            <li>• Declare variables at the top</li>
                            <li>• Use let/const over var</li>
                            <li>• Don't rely on hoisting</li>
                            <li>• Declare before using</li>
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
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {ex.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Code Comparison */}
                    <div className="grid grid-cols-2 gap-0 border-b border-slate-700" style={{ height: '40vh' }}>
                        {/* Original Code */}
                        <div className="border-r border-slate-700 bg-slate-900/50 flex flex-col">
                            <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-700 bg-slate-900">
                                <Code className="text-red-400" size={20} />
                                <h3 className="text-lg font-bold">Original Code</h3>
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

                        {/* After Hoisting */}
                        <div className="bg-slate-900/30 flex flex-col">
                            <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-700 bg-slate-900">
                                <ArrowUp className="text-green-400" size={20} />
                                <h3 className="text-lg font-bold">After Hoisting</h3>
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
                                    {currentEx.hoistedCode}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>

                    {/* Step-by-Step Execution - Takes remaining space */}
                    <div className="flex-1 bg-slate-900 px-8 py-6 overflow-y-auto">
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
                                            className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
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
                                        <span className={`px-5 py-2.5 rounded-xl text-sm font-bold ${currentStepData.phase === 'hoisting'
                                            ? 'bg-purple-500/20 text-purple-400 border-2 border-purple-500/50'
                                            : 'bg-blue-500/20 text-blue-400 border-2 border-blue-500/50'
                                            }`}>
                                            {currentStepData.phase === 'hoisting' ? '🔄 Hoisting Phase' : '▶️ Execution Phase'}
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

                                    {/* Value Display */}
                                    <div className="flex items-center gap-6">
                                        <span className="text-base text-slate-400 font-medium">Current Value:</span>
                                        <div className={`px-6 py-3 rounded-xl font-mono text-xl font-bold ${currentStepData.value.includes('Error') || currentStepData.value === 'TDZ'
                                            ? 'bg-red-500/20 text-red-400 border-2 border-red-500'
                                            : currentStepData.value === 'undefined'
                                                ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500'
                                                : 'bg-green-500/20 text-green-400 border-2 border-green-500'
                                            }`}>
                                            {currentStepData.value}
                                        </div>
                                    </div>

                                    {/* Explanation */}
                                    <div className="mt-6 p-5 bg-blue-500/10 rounded-xl border-2 border-blue-500/30">
                                        <h4 className="text-base font-semibold text-blue-400 mb-2 flex items-center gap-2">
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

export default HoistingVisualizer;
