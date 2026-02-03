'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Play, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ModulesVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'ES Modules (ESM) - Import/Export',
            code: `// math.js
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;

export default function subtract(a, b) {
  return a - b;
}

// app.js
import subtract, { add, multiply } from './math.js';

console.log(add(2, 3));      // 5
console.log(multiply(2, 3)); // 6
console.log(subtract(5, 2)); // 3`,
            steps: [
                {
                    line: 2,
                    description: 'Named export: export keyword before declaration',
                    data: { type: 'named export', name: 'add', syntax: 'export const' },
                    highlight: 'export'
                },
                {
                    line: 5,
                    description: 'Default export: one per file, no name needed on import',
                    data: { type: 'default export', function: 'subtract' },
                    highlight: 'export',
                    output: 'export default'
                },
                {
                    line: 10,
                    description: 'Import default (subtract) and named exports { add, multiply }',
                    data: { default: 'subtract', named: ['add', 'multiply'] },
                    highlight: 'import',
                    output: 'Imports loaded'
                },
                {
                    line: 12,
                    description: 'Use imported functions - they work!',
                    data: { results: [5, 6, 3] },
                    highlight: 'execution',
                    output: '5, 6, 3'
                },
                {
                    line: 1,
                    description: 'ESM characteristics: Static, analyzed at parse time, tree-shakeable',
                    data: {
                        static: true,
                        parseTime: 'analyzed before execution',
                        treeShaking: 'unused exports removed'
                    },
                    highlight: 'features',
                    output: 'ES Modules benefits!'
                }
            ],
            explanation: 'ES Modules are the modern JavaScript module system. Static imports, analyzed before execution, enable optimizations.'
        },
        {
            title: 'CommonJS (CJS) - require/module.exports',
            code: `// math.js
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = { add, multiply };

// app.js
const math = require('./math.js');

console.log(math.add(2, 3));      // 5
console.log(math.multiply(2, 3)); // 6`,
            steps: [
                {
                    line: 2,
                    description: 'Regular function declarations',
                    data: { functions: ['add', 'multiply'] },
                    highlight: 'define'
                },
                {
                    line: 10,
                    description: 'Export using module.exports object',
                    data: { exported: { add: 'function', multiply: 'function' } },
                    highlight: 'export',
                    output: 'module.exports = {...}'
                },
                {
                    line: 13,
                    description: 'require() loads the module at RUNTIME',
                    data: { loaded: 'math.js', timing: 'runtime' },
                    highlight: 'import',
                    output: 'Module loaded'
                },
                {
                    line: 15,
                    description: 'Access exports via the returned object',
                    data: { math: { add: 'fn', multiply: 'fn' } },
                    highlight: 'execution',
                    output: '5, 6'
                },
                {
                    line: 1,
                    description: 'CommonJS characteristics: Dynamic, loaded at runtime, synchronous',
                    data: {
                        dynamic: true,
                        loadTime: 'runtime',
                        sync: 'blocking'
                    },
                    highlight: 'features',
                    output: 'CommonJS properties'
                }
            ],
            explanation: 'CommonJS was the original Node.js module system. Dynamic, runtime loading, no tree-shaking.'
        },
        {
            title: 'Key Differences',
            code: `// ESM: Static imports (top-level only)
import fs from 'fs'; // ✅ Works

if (condition) {
  import fs from 'fs'; // ❌ Syntax error!
}

// CommonJS: Dynamic requires (anywhere!)
if (condition) {
  const fs = require('fs'); // ✅ Works
}

// ESM: Live bindings
export let counter = 0;
export function increment() {
  counter++;
}

// CommonJS: Copy of values
let counter = 0;
module.exports = {
  counter,
  increment() { counter++; }
};`,
            steps: [
                {
                    line: 2,
                    description: 'ESM: imports must be at the top level',
                    data: { esm: 'top-level only', location: 'static' },
                    highlight: 'esm'
                },
                {
                    line: 4,
                    description: 'ESM: Cannot conditionally import (syntax error)',
                    data: { error: 'SyntaxError', reason: 'must be top-level' },
                    highlight: 'error',
                    output: '❌ SyntaxError'
                },
                {
                    line: 9,
                    description: 'CommonJS: require() works ANYWHERE, even conditionally',
                    data: { cjs: 'dynamic', location: 'anywhere' },
                    highlight: 'cjs',
                    output: '✅ Works fine'
                },
                {
                    line: 13,
                    description: 'ESM: Live binding - changes reflect in importers',
                    data: { esm: 'live binding', updates: 'automatically' },
                    highlight: 'esm',
                    output: 'counter updates live!'
                },
                {
                    line: 19,
                    description: 'CommonJS: Exports a COPY - changes don\'t reflect',
                    data: { cjs: 'copy', updates: 'not reflected' },
                    highlight: 'cjs',
                    output: 'counter is a copy'
                }
            ],
            explanation: 'ESM is static (analyzed early), CommonJS is dynamic (loaded at runtime). ESM has live bindings, CJS copies values.'
        },
        {
            title: 'Which One to Use?',
            code: `// Modern project (2024+)
// Use ES Modules everywhere!
import express from 'express';
import { readFile } from 'fs/promises';

// package.json
{
  "type": "module" // Treat .js as ESM
}

// Legacy Node.js project
// Use CommonJS
const express = require('express');
const fs = require('fs');

// package.json
{
  // No "type" field = CommonJS default
}`,
            steps: [
                {
                    line: 3,
                    description: 'Modern: Use ESM (import/export)',
                    data: { syntax: 'ESM', year: '2024+', recommended: true },
                    highlight: 'modern'
                },
                {
                    line: 7,
                    description: 'Add "type": "module" to package.json',
                    data: { config: 'type: module', effect: '.js files treated as ESM' },
                    highlight: 'config',
                    output: 'ESM enabled'
                },
                {
                    line: 12,
                    description: 'Legacy: CommonJS still works',
                    data: { syntax: 'CommonJS', support: 'all Node versions' },
                    highlight: 'legacy'
                },
                {
                    line: 16,
                    description: 'No "type" field = CommonJS by default',
                    data: { default: 'CommonJS', backward: 'compatible' },
                    highlight: 'config',
                    output: 'CommonJS default'
                },
                {
                    line: 1,
                    description: 'Recommendation: Use ESM for new projects, browsers love it!',
                    data: {
                        browsers: 'native ESM support',
                        node: 'ESM stable since v14',
                        bundlers: 'Webpack, Vite support ESM'
                    },
                    highlight: 'recommendation',
                    output: 'Use ESM! 🎯'
                }
            ],
            explanation: 'Use ES Modules for new projects. Better for tree-shaking, static analysis, and future-proofing your code.'
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
                            <Package className="text-yellow-400" size={48} />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">ES Modules vs CommonJS</h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            Understanding JavaScript's two module systems: modern ESM vs legacy CJS
                        </p>
                    </motion.div>

                    {/* Definitions Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Interview Definition */}
                        <div className="bg-gradient-to-br from-yellow-900/40 to-slate-900 rounded-xl p-6 border border-yellow-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="text-yellow-400" size={24} />
                                <h3 className="text-lg font-bold text-yellow-400">Interview Answer</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                "ES Modules use import/export and are static. CommonJS uses require/module.exports and is dynamic. ESM is the modern standard."
                            </p>
                        </div>

                        {/* Simple Explanation */}
                        <div className="bg-gradient-to-br from-orange-900/40 to-slate-900 rounded-xl p-6 border border-orange-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="text-orange-400" size={24} />
                                <h3 className="text-lg font-bold text-orange-400">Simple Explanation</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                ESM is like a library catalog (you know what's available before opening books). CJS is like browsing shelves (you see what's there as you go).
                            </p>
                        </div>

                        {/* Key Points */}
                        <div className="bg-gradient-to-br from-amber-900/40 to-slate-900 rounded-xl p-6 border border-amber-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="text-amber-400" size={24} />
                                <h3 className="text-lg font-bold text-amber-400">Core Concepts</h3>
                            </div>
                            <ul className="space-y-2 text-slate-200 text-sm">
                                <li className="flex gap-2">
                                    <span className="text-amber-400">•</span>
                                    <span>ESM: Static, tree-shakeable</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-amber-400">•</span>
                                    <span>CJS: Dynamic, synchronous</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-amber-400">•</span>
                                    <span>ESM is the future!</span>
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
                                        ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/30'
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
                            <Code className="text-yellow-400" />
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
                                    className="p-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 rounded-lg transition-colors"
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
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${currentStepData.highlight === 'export'
                                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                        : currentStepData.highlight === 'import'
                                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                            : currentStepData.highlight === 'esm'
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : currentStepData.highlight === 'cjs'
                                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                    : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                        }`}>
                                        {currentStepData.highlight === 'export' ? '📤 Exporting' :
                                            currentStepData.highlight === 'import' ? '📥 Importing' :
                                                currentStepData.highlight === 'esm' ? '⚡ ESM' :
                                                    currentStepData.highlight === 'cjs' ? '📦 CJS' : '📝 Info'}
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
                                <div className="bg-slate-950 rounded-xl p-6 border border-yellow-500/30">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Layers className="text-yellow-400" size={20} />
                                        <h4 className="text-lg font-semibold text-yellow-400">Current State</h4>
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
                        <div className="mt-8 p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                            <h4 className="text-lg font-semibold text-yellow-400 mb-2">💡 Key Takeaway</h4>
                            <p className="text-slate-300">{currentEx.explanation}</p>
                        </div>
                    </div>

                    {/* Interview Tips */}
                    <div className="mt-12 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-2xl p-8 border border-yellow-500/30">
                        <h3 className="text-2xl font-bold text-white mb-6">🎯 Interview Tips</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-yellow-400 mb-3">Common Questions:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• "Difference between ESM and CommonJS?"</li>
                                    <li>• "Can ESM import CommonJS?"</li>
                                    <li>• "What is tree-shaking?"</li>
                                    <li>• "Which module system should I use?"</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-orange-400 mb-3">Key Facts:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• ESM: Browsers, modern Node.js</li>
                                    <li>• CJS: Legacy Node.js projects</li>
                                    <li>• ESM enables tree-shaking</li>
                                    <li>• Use ESM for new projects!</li>
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

export default ModulesVisualizer;
