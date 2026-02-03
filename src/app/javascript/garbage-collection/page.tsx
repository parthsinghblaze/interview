'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Play, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const GarbageCollectionVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Reference Counting Basics',
            code: `let user = { name: 'Parth' }; // Reference count: 1

let admin = user; // Reference count: 2

user = null;  // Reference count: 1 (admin still points)
admin = null; // Reference count: 0 → GARBAGE COLLECTED!`,
            steps: [
                {
                    line: 1,
                    description: 'Create object, user variable references it',
                    data: { object: '{ name: "Parth" }', references: 1 },
                    highlight: 'create',
                    output: 'Ref count: 1'
                },
                {
                    line: 3,
                    description: 'admin also references the same object',
                    data: { object: '{ name: "Parth" }', references: 2, pointers: ['user', 'admin'] },
                    highlight: 'reference',
                    output: 'Ref count: 2'
                },
                {
                    line: 5,
                    description: 'Set user to null - removes one reference',
                    data: { object: '{ name: "Parth" }', references: 1, pointers: ['admin'] },
                    highlight: 'remove',
                    output: 'Ref count: 1 (still alive)'
                },
                {
                    line: 6,
                    description: 'Set admin to null - NO MORE REFERENCES!',
                    data: { object: '{ name: "Parth" }', references: 0, pointers: [] },
                    highlight: 'unreachable',
                    output: 'Ref count: 0'
                },
                {
                    line: 6,
                    description: 'Garbage collector automatically frees the memory',
                    data: { collected: true, memory: 'freed' },
                    highlight: 'gc',
                    output: '🗑️ Garbage collected!'
                }
            ],
            explanation: 'When an object has zero references (unreachable), the garbage collector automatically removes it from memory.'
        },
        {
            title: 'Circular References Problem',
            code: `function marry(man, woman) {
  woman.husband = man;
  man.wife = woman;
  
  return { man, woman };
}

let family = marry({ name: 'John' }, { name: 'Ann' });

// Circular reference: John → Ann → John

family = null; // Both become unreachable → GC collects them!`,
            steps: [
                {
                    line: 2,
                    description: 'woman.husband points to man',
                    data: { woman: { husband: 'man' }, man: {} },
                    highlight: 'circular'
                },
                {
                    line: 3,
                    description: 'man.wife points to woman (circular!)',
                    data: { woman: { husband: 'man' }, man: { wife: 'woman' } },
                    highlight: 'circular',
                    output: 'Circular reference created'
                },
                {
                    line: 8,
                    description: 'family references both objects',
                    data: { family: { man: 'obj', woman: 'obj' }, reachable: true },
                    highlight: 'reference'
                },
                {
                    line: 12,
                    description: 'Set family to null - objects become unreachable',
                    data: { family: null, man: 'unreachable', woman: 'unreachable' },
                    highlight: 'unreachable',
                    output: 'Both unreachable'
                },
                {
                    line: 12,
                    description: 'Modern GC uses reachability, not reference counting!',
                    data: { algorithm: 'mark-and-sweep', result: 'both collected' },
                    highlight: 'gc',
                    output: '✅ Both garbage collected'
                }
            ],
            explanation: 'Modern JavaScript uses Mark-and-Sweep algorithm. It checks REACHABILITY from roots, not reference counts. Circular references are handled correctly!'
        },
        {
            title: 'Reachability Roots',
            code: `// These are ROOTS (always reachable):
// 1. Global variables
var globalVar = { data: 'global' };

// 2. Currently executing function's local variables
function activeFunction() {
  let localVar = { data: 'local' };
  // localVar is a ROOT while function executes
}

// 3. Call stack
// 4. Global this (window in browsers)

// If object is reachable from ANY root → KEPT
// Otherwise → GARBAGE COLLECTED`,
            steps: [
                {
                    line: 3,
                    description: 'Global variables are ROOTS (always reachable)',
                    data: { root: 'globalVar', type: 'global', reachable: true },
                    highlight: 'root',
                    output: 'ROOT: global'
                },
                {
                    line: 7,
                    description: 'Local variables in active functions are ROOTS',
                    data: { root: 'localVar', type: 'local', reachable: true },
                    highlight: 'root',
                    output: 'ROOT: local (while active)'
                },
                {
                    line: 8,
                    description: 'When function ends, local variables lose root status',
                    data: { localVar: 'out of scope', root: false },
                    highlight: 'unreachable',
                    output: 'No longer a root'
                },
                {
                    line: 13,
                    description: 'GC starts from roots and marks reachable objects',
                    data: { algorithm: 'mark-and-sweep', phase: 'mark' },
                    highlight: 'gc'
                },
                {
                    line: 14,
                    description: 'Unreachable objects are swept (collected)',
                    data: { unmarked: 'collected', marked: 'kept' },
                    highlight: 'gc',
                    output: 'Unreachable → collected'
                }
            ],
            explanation: 'GC starts from "roots" (globals, active locals, call stack) and marks everything reachable. Unmarked objects are garbage collected.'
        },
        {
            title: 'Memory Leaks to Avoid',
            code: `// ❌ BAD: Forgotten timers
let data = new Array(1000000);
setInterval(() => {
  console.log(data.length); // data never released!
}, 1000);

// ✅ GOOD: Clear timers
let timerId = setInterval(() => {
  console.log('tick');
}, 1000);
clearInterval(timerId); // Release reference

// ❌ BAD: Forgotten event listeners
element.addEventListener('click', function handler() {
  largeData.process(); // largeData stays in memory!
});

// ✅ GOOD: Remove listeners
element.removeEventListener('click', handler);`,
            steps: [
                {
                    line: 2,
                    description: 'Create large array in memory',
                    data: { data: 'Array(1000000)', memory: '~8MB' },
                    highlight: 'create'
                },
                {
                    line: 3,
                    description: 'setInterval references data in closure',
                    data: { closure: 'references data', interval: 'never stops' },
                    highlight: 'leak',
                    output: '⚠️ Memory leak!'
                },
                {
                    line: 4,
                    description: 'data can NEVER be collected (leak!)',
                    data: { reachable: true, reason: 'setInterval closure' },
                    highlight: 'leak',
                    output: 'Data stuck in memory'
                },
                {
                    line: 11,
                    description: 'clearInterval removes the reference',
                    data: { timer: 'stopped', closure: 'released' },
                    highlight: 'fix',
                    output: '✅ Memory can be freed'
                },
                {
                    line: 19,
                    description: 'removeEventListener also releases closure references',
                    data: { listener: 'removed', largeData: 'can be collected' },
                    highlight: 'fix',
                    output: '✅ Prevents leak'
                }
            ],
            explanation: 'Common leaks: forgotten timers, event listeners, and closures holding large data. Always clean up resources!'
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
                            <Trash2 className="text-red-400" size={48} />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">Garbage Collection</h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            How JavaScript automatically manages memory and prevents leaks
                        </p>
                    </motion.div>

                    {/* Definitions Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Interview Definition */}
                        <div className="bg-gradient-to-br from-red-900/40 to-slate-900 rounded-xl p-6 border border-red-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="text-red-400" size={24} />
                                <h3 className="text-lg font-bold text-red-400">Interview Answer</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                "Garbage collection is automatic memory management. JavaScript uses mark-and-sweep algorithm to find and free unreachable objects."
                            </p>
                        </div>

                        {/* Simple Explanation */}
                        <div className="bg-gradient-to-br from-orange-900/40 to-slate-900 rounded-xl p-6 border border-orange-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="text-orange-400" size={24} />
                                <h3 className="text-lg font-bold text-orange-400">Simple Explanation</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                Think of your room. If you can't reach something anymore (it's behind the closet), you eventually throw it out. That's garbage collection!
                            </p>
                        </div>

                        {/* Key Points */}
                        <div className="bg-gradient-to-br from-yellow-900/40 to-slate-900 rounded-xl p-6 border border-yellow-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="text-yellow-400" size={24} />
                                <h3 className="text-lg font-bold text-yellow-400">Core Concepts</h3>
                            </div>
                            <ul className="space-y-2 text-slate-200 text-sm">
                                <li className="flex gap-2">
                                    <span className="text-yellow-400">•</span>
                                    <span>Automatic memory management</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-yellow-400">•</span>
                                    <span>Mark-and-sweep algorithm</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-yellow-400">•</span>
                                    <span>Reachability-based</span>
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
                                        ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
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
                            <Code className="text-red-400" />
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
                                    className="p-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-lg transition-colors"
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
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${currentStepData.highlight === 'gc'
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        : currentStepData.highlight === 'unreachable'
                                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                            : currentStepData.highlight === 'leak'
                                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                : currentStepData.highlight === 'fix'
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        }`}>
                                        {currentStepData.highlight === 'gc' ? '🗑️ Collecting' :
                                            currentStepData.highlight === 'unreachable' ? '🚫 Unreachable' :
                                                currentStepData.highlight === 'leak' ? '⚠️ Leak' :
                                                    currentStepData.highlight === 'fix' ? '✅ Fixed' : '📝 Info'}
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
                                <div className="bg-slate-950 rounded-xl p-6 border border-red-500/30">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Layers className="text-red-400" size={20} />
                                        <h4 className="text-lg font-semibold text-red-400">Current State</h4>
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
                        <div className="mt-8 p-6 bg-red-500/10 rounded-xl border border-red-500/30">
                            <h4 className="text-lg font-semibold text-red-400 mb-2">💡 Key Takeaway</h4>
                            <p className="text-slate-300">{currentEx.explanation}</p>
                        </div>
                    </div>

                    {/* Interview Tips */}
                    <div className="mt-12 bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-2xl p-8 border border-red-500/30">
                        <h3 className="text-2xl font-bold text-white mb-6">🎯 Interview Tips</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-red-400 mb-3">Common Questions:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• "How does garbage collection work?"</li>
                                    <li>• "What is mark-and-sweep?"</li>
                                    <li>• "What causes memory leaks?"</li>
                                    <li>• "How to prevent leaks?"</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-orange-400 mb-3">Leak Prevention:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• Clear timers (setInterval/setTimeout)</li>
                                    <li>• Remove event listeners</li>
                                    <li>• Avoid global variables</li>
                                    <li>• Use WeakMap for caching</li>
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

export default GarbageCollectionVisualizer;
