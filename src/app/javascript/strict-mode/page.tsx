'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Play, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const StrictModeVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Accidental Global Variables',
            code: `// Without strict mode
function badCode() {
  name = 'Parth'; // Whoops! No var/let/const
  console.log(name);
}
badCode(); // Works, creates global variable

// With strict mode
'use strict';
function goodCode() {
  name = 'Parth'; // ReferenceError!
}
goodCode(); // Crashes!`,
            steps: [
                {
                    line: 3,
                    description: 'Without strict mode: forgot var/let/const',
                    data: { mode: 'sloppy', variable: 'name' },
                    highlight: 'problem'
                },
                {
                    line: 6,
                    description: 'JavaScript creates a GLOBAL variable silently',
                    data: { window: { name: 'Parth' }, pollution: true },
                    highlight: 'bad',
                    output: '⚠️ Global pollution'
                },
                {
                    line: 9,
                    description: 'Enable strict mode with "use strict"',
                    data: { mode: 'strict', catchErrors: true },
                    highlight: 'strict'
                },
                {
                    line: 11,
                    description: 'Same code now THROWS an error',
                    data: { error: 'ReferenceError: name is not defined' },
                    highlight: 'error',
                    output: 'ReferenceError! ✅'
                },
                {
                    line: 13,
                    description: 'Function crashes, forcing you to fix the bug',
                    data: { benefit: 'Early error detection' },
                    highlight: 'benefit',
                    output: 'Bug caught early!'
                }
            ],
            explanation: 'Strict mode prevents accidental global variables by throwing errors instead of silently creating them.'
        },
        {
            title: 'Deleting Variables',
            code: `// Without strict mode
var x = 10;
delete x; // Silently fails, x still exists
console.log(x); // 10

// With strict mode
'use strict';
var y = 20;
delete y; // SyntaxError!`,
            steps: [
                {
                    line: 2,
                    description: 'Create a variable x',
                    data: { x: 10 },
                    highlight: 'create'
                },
                {
                    line: 3,
                    description: 'Try to delete x - SILENTLY FAILS',
                    data: { operation: 'delete x', result: false, x: 10 },
                    highlight: 'silent',
                    output: 'No error, but x still exists'
                },
                {
                    line: 4,
                    description: 'x is still 10, delete did nothing',
                    data: { x: 10 },
                    highlight: 'problem',
                    output: '10'
                },
                {
                    line: 7,
                    description: 'Enable strict mode',
                    data: { mode: 'strict' },
                    highlight: 'strict'
                },
                {
                    line: 9,
                    description: 'Same delete now throws SyntaxError',
                    data: { error: 'SyntaxError: Delete of an unqualified identifier' },
                    highlight: 'error',
                    output: 'SyntaxError! ✅'
                }
            ],
            explanation: 'Strict mode throws errors for operations that silently fail in sloppy mode, like deleting variables.'
        },
        {
            title: 'Duplicate Parameters',
            code: `// Without strict mode
function sum(a, b, a) { // Duplicate 'a'!
  return a + b; // Which 'a'?
}
console.log(sum(1, 2, 3)); // 5 (uses last 'a')

// With strict mode
'use strict';
function sum(a, b, a) { // SyntaxError!
  return a + b;
}`,
            steps: [
                {
                    line: 2,
                    description: 'Function has duplicate parameter name "a"',
                    data: { params: ['a', 'b', 'a'], issue: 'duplicate' },
                    highlight: 'problem'
                },
                {
                    line: 3,
                    description: 'Which "a" to use? Last one wins (confusing!)',
                    data: { firstA: 1, lastA: 3, used: 3 },
                    highlight: 'confusing'
                },
                {
                    line: 5,
                    description: 'sum(1, 2, 3) → 3 + 2 = 5',
                    data: { calc: '3 + 2', result: 5 },
                    highlight: 'bad',
                    output: '5 (but confusing!)'
                },
                {
                    line: 8,
                    description: 'Strict mode catches this at parse time',
                    data: { error: 'SyntaxError: Duplicate parameter name' },
                    highlight: 'error',
                    output: 'SyntaxError! ✅'
                }
            ],
            explanation: 'Strict mode prevents duplicate parameter names, catching potential bugs before code runs.'
        },
        {
            title: 'Octal Literals Forbidden',
            code: `// Without strict mode
var octal = 077; // Octal (base 8) = 63 in decimal
console.log(octal); // 63 (confusing!)

// With strict mode
'use strict';
var octal = 077; // SyntaxError!
// Use 0o77 or 63 instead`,
            steps: [
                {
                    line: 2,
                    description: 'Number starting with 0 is octal in sloppy mode',
                    data: { syntax: '077', base: 8, value: 63 },
                    highlight: 'problem'
                },
                {
                    line: 3,
                    description: '077 is interpreted as octal: 7×8 + 7 = 63',
                    data: { calculation: '7×8 + 7', decimal: 63 },
                    highlight: 'confusing',
                    output: '63 (not 77!)'
                },
                {
                    line: 6,
                    description: 'Strict mode forbids old octal syntax',
                    data: { error: 'SyntaxError: Octal literals are not allowed' },
                    highlight: 'error',
                    output: 'SyntaxError! ✅'
                },
                {
                    line: 7,
                    description: 'Modern syntax: use 0o77 for octal',
                    data: { modern: '0o77', value: 63 },
                    highlight: 'solution',
                    output: 'Use 0o77 instead'
                }
            ],
            explanation: 'Strict mode disallows confusing octal literals (077). Use explicit 0o77 syntax instead.'
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
                            <Shield className="text-slate-400" size={48} />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">Strict Mode</h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            Opt-in to a stricter variant of JavaScript that catches common mistakes
                        </p>
                    </motion.div>

                    {/* Definitions Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Interview Definition */}
                        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900 rounded-xl p-6 border border-slate-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="text-slate-400" size={24} />
                                <h3 className="text-lg font-bold text-slate-400">Interview Answer</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                "Strict mode is enabled with 'use strict' and makes JavaScript throw errors for silent failures, bad syntax, and potentially problematic code."
                            </p>
                        </div>

                        {/* Simple Explanation */}
                        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 rounded-xl p-6 border border-blue-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="text-blue-400" size={24} />
                                <h3 className="text-lg font-bold text-blue-400">Simple Explanation</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                Think of strict mode as a spell-checker for JavaScript. Instead of letting typos pass silently, it highlights them so you can fix them!
                            </p>
                        </div>

                        {/* Key Points */}
                        <div className="bg-gradient-to-br from-green-900/40 to-slate-900 rounded-xl p-6 border border-green-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="text-green-400" size={24} />
                                <h3 className="text-lg font-bold text-green-400">Core Concepts</h3>
                            </div>
                            <ul className="space-y-2 text-slate-200 text-sm">
                                <li className="flex gap-2">
                                    <span className="text-green-400">•</span>
                                    <span>Use "use strict" to enable</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-400">•</span>
                                    <span>Catches silent errors</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-green-400">•</span>
                                    <span>Improves performance</span>
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
                                        ? 'bg-slate-600 text-white shadow-lg shadow-slate-500/30'
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
                            <Code className="text-slate-400" />
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
                                    className="p-3 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 rounded-lg transition-colors"
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
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${currentStepData.highlight === 'strict'
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : currentStepData.highlight === 'error'
                                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                            : currentStepData.highlight === 'problem'
                                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                : currentStepData.highlight === 'benefit'
                                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                    : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                                        }`}>
                                        {currentStepData.highlight === 'strict' ? '🛡️ Strict Mode' :
                                            currentStepData.highlight === 'error' ? '❌ Error' :
                                                currentStepData.highlight === 'problem' ? '⚠️ Problem' :
                                                    currentStepData.highlight === 'benefit' ? '✅ Benefit' : '📝 Info'}
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
                                <div className="bg-slate-950 rounded-xl p-6 border border-slate-500/30">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Layers className="text-slate-400" size={20} />
                                        <h4 className="text-lg font-semibold text-slate-400">Current State</h4>
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
                        <div className="mt-8 p-6 bg-slate-500/10 rounded-xl border border-slate-500/30">
                            <h4 className="text-lg font-semibold text-slate-400 mb-2">💡 Key Takeaway</h4>
                            <p className="text-slate-300">{currentEx.explanation}</p>
                        </div>
                    </div>

                    {/* Interview Tips */}
                    <div className="mt-12 bg-gradient-to-r from-slate-800/30 to-slate-700/30 rounded-2xl p-8 border border-slate-500/30">
                        <h3 className="text-2xl font-bold text-white mb-6">🎯 Interview Tips</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-slate-400 mb-3">Common Questions:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• "What is strict mode?"</li>
                                    <li>• "How to enable strict mode?"</li>
                                    <li>• "What errors does it catch?"</li>
                                    <li>• "Can you use it for just one function?"</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-blue-400 mb-3">Real-World Benefits:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• Catches typos (missing var/let/const)</li>
                                    <li>• Prevents global pollution</li>
                                    <li>• Better performance in some engines</li>
                                    <li>• ES6 modules use strict by default</li>
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

export default StrictModeVisualizer;
