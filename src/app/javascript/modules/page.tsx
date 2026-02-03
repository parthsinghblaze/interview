'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers, ShieldCheck, BoxSelect } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ModulesVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'ES Modules (ESM)',
            code: `// Modern Standard (Browsers/Tools)
import { add } from './math.js';
import subtract from './math.js';

console.log(add(10, 5));`,
            steps: [
                {
                    line: 2,
                    description: 'Named Import: Only takes exactly what is needed. Great for tree-shaking.',
                    data: { mode: 'ESM', type: 'Static', binding: 'Live' },
                    highlight: 'esm'
                },
                {
                    line: 3,
                    description: 'Default Import: The primary export of the module.',
                    data: { export: 'default', alias: 'allowed' },
                    highlight: 'esm'
                },
                {
                    line: 1,
                    description: 'ESM is STATIC. It is analyzed before code runs. No imports inside IF blocks!',
                    data: { parsed: 'At Parse Time', conditional: 'Not allowed' },
                    highlight: 'import',
                    output: 'Analyzed...'
                }
            ],
            explanation: 'ES Modules are the official standard. They support tree-shaking (removing unused code) and are loaded asynchronously.'
        },
        {
            title: 'CommonJS (CJS)',
            code: `// Legacy Node.js Standard
const { add } = require('./math.js');
const sub = require('./math.js');

console.log(add(10, 5));`,
            steps: [
                {
                    line: 2,
                    description: 'require() is just a function. It can be called anywhere (even inside if/else).',
                    data: { mode: 'CommonJS', type: 'Dynamic', binding: 'Copy' },
                    highlight: 'cjs'
                },
                {
                    line: 2,
                    description: 'CJS is SYNCHRONOUS. It blocks the thread until the library is loaded.',
                    data: { loading: 'Blocking', execution: 'Runtime' },
                    highlight: 'import',
                    output: 'Loaded sync'
                }
            ],
            explanation: 'CommonJS was built for servers where disks are fast. It wraps code in a function before execution.'
        },
        {
            title: 'Live Binding (ESM)',
            code: `// ESM: Importer sees changes
import { count, inc } from './counter.js';

console.log(count); // 0
inc();
console.log(count); // 1 (Live!)`,
            steps: [
                {
                    line: 2,
                    description: 'Importing a variable and a function that modifies it.',
                    data: { count: 0 },
                    highlight: 'esm'
                },
                {
                    line: 5,
                    description: 'After calling inc(), the internal variable in counter.js changes.',
                    data: { count: 'Updating...' },
                    highlight: 'execution'
                },
                {
                    line: 6,
                    description: 'In ESM, the importer sees the NEW value. It is a LIVE connection.',
                    data: { count: 1 },
                    highlight: 'execution',
                    output: '1 (Live)'
                }
            ],
            explanation: 'ESM creates live bindings. CJS exports a copy of the primitive, so changes might not reflect.'
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
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Package className="text-yellow-400" size={40} />
                            <h1 className="text-3xl font-bold font-heading">Modules</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Organizing JS at scale.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-yellow-400" size={22} />
                            <h3 className="text-base font-bold text-yellow-500 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "ESM (import/export) is static and tree-shakeable. CJS (require/exports) is dynamic and synchronous. ESM is the modern standard used in browsers and new Node.js apps."
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-orange-400" size={22} />
                            <h3 className="text-base font-bold text-orange-400 uppercase">Simple Explanation</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            Think of Modules as separate rooms. CJS is like knocking and asking for tools. ESM is like having a glass wall where you see exactly which tools are there before you even enter.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-amber-400" size={22} />
                            <h3 className="text-base font-bold text-amber-400 uppercase">Comparison</h3>
                        </div>
                        <ul className="space-y-4 text-slate-200 text-sm">
                            <li className="flex items-start gap-2 bg-slate-800/50 p-2 rounded">
                                <span className="text-yellow-400 font-bold">ESM:</span>
                                <div>Best for Browsers & Vite. Static/Fast.</div>
                            </li>
                            <li className="flex items-start gap-2 bg-slate-800/50 p-2 rounded">
                                <span className="text-orange-400 font-bold">CJS:</span>
                                <div>Best for Legacy Node. Dynamic/Simple.</div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Config Tip</h4>
                        <p className="text-slate-400 text-xs">
                            Add <code className="text-yellow-400">"type": "module"</code> to package.json to use ESM in Node.js files.
                        </p>
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
                    <div className="bg-slate-900/50 flex flex-col" style={{ height: '35vh' }}>
                        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-700 bg-slate-900">
                            <Code className="text-yellow-400" size={20} />
                            <h3 className="text-lg font-bold">Import Strategy</h3>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <SyntaxHighlighter
                                language="javascript"
                                style={atomDark}
                                showLineNumbers={true}
                                customStyle={{
                                    margin: 0,
                                    padding: '2rem',
                                    fontSize: '1.2rem',
                                    lineHeight: '1.8',
                                    backgroundColor: 'transparent'
                                }}
                                lineProps={(lineNumber: number) => {
                                    const isCurrentLine = lineNumber === currentStepData.line;
                                    return {
                                        style: {
                                            backgroundColor: isCurrentLine ? 'rgba(234, 179, 8, 0.15)' : undefined,
                                            borderLeft: isCurrentLine ? '3px solid #eab308' : '3px solid transparent',
                                            paddingLeft: '1rem'
                                        }
                                    };
                                }}
                            >
                                {currentEx.code}
                            </SyntaxHighlighter>
                        </div>
                    </div>

                    {/* Interactive Visualization - Takes remaining space */}
                    <div className="flex-1 bg-slate-900 px-8 py-6 border-t border-slate-700 overflow-y-auto">
                        <div className="max-w-5xl mx-auto h-full flex flex-col">
                            {/* Controls */}
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold tracking-tight text-yellow-500">Module Dependency Map</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400 text-base font-mono">
                                        Step {currentStep + 1}/{currentEx.steps.length}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={handleReset} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                                            <RotateCcw size={20} />
                                        </button>
                                        <button onClick={handlePrevious} disabled={currentStep === 0} className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors">
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button onClick={handleNext} disabled={currentStep === currentEx.steps.length - 1} className="p-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 rounded-lg transition-colors">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Current Step Display */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentExample + '-' + currentStep}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="space-y-6 flex-1 flex flex-col"
                                >
                                    <div className="bg-slate-950 px-8 py-6 rounded-3xl border border-yellow-500/20 shadow-2xl">
                                        <p className="text-xl text-slate-100 leading-relaxed font-semibold">{currentStepData.description}</p>
                                    </div>

                                    {/* Visual Dependency Diagram */}
                                    <div className="flex-1 bg-slate-950 rounded-[40px] border border-slate-800 flex items-center justify-center p-12 relative overflow-hidden ring-4 ring-slate-900/50">

                                        <div className="grid grid-cols-2 gap-24 items-center">
                                            {/* Source Module */}
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-800">Exporting Module</div>
                                                <motion.div
                                                    animate={{
                                                        boxShadow: currentStepData.highlight === 'export' || currentStepData.highlight === 'esm' ? '0 0 40px rgba(234, 179, 8, 0.2)' : 'none',
                                                        borderColor: currentStepData.highlight === 'export' || currentStepData.highlight === 'esm' ? '#eab308' : '#334155'
                                                    }}
                                                    className="w-48 h-48 bg-slate-900 rounded-[32px] border-4 flex flex-col p-6 items-center justify-center relative"
                                                >
                                                    <ShieldCheck className="text-yellow-400 absolute -top-4 -right-4" size={32} />
                                                    <div className="w-12 h-2 bg-slate-800 rounded mb-2" />
                                                    <div className="w-20 h-2 bg-slate-800 rounded mb-2 opacity-50" />
                                                    <div className="w-16 h-2 bg-slate-800 rounded" />
                                                    <div className="mt-4 text-xs font-mono text-yellow-500 font-bold">math.js</div>
                                                </motion.div>
                                            </div>

                                            {/* Link */}
                                            <div className="relative">
                                                <motion.div
                                                    animate={{
                                                        width: currentStepData.highlight === 'import' || currentStepData.highlight === 'execution' ? [0, 80] : 0,
                                                        opacity: currentStepData.highlight === 'import' || currentStepData.highlight === 'execution' ? 1 : 0
                                                    }}
                                                    className="h-1 bg-yellow-400 absolute top-1/2 left-0 -translate-y-1/2 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.5)]"
                                                />
                                            </div>

                                            {/* Consumer Module */}
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-800">Consumer App</div>
                                                <motion.div
                                                    animate={{
                                                        boxShadow: currentStepData.highlight === 'import' || currentStepData.highlight === 'execution' ? '0 0 40px rgba(168, 85, 247, 0.2)' : 'none',
                                                        borderColor: currentStepData.highlight === 'import' || currentStepData.highlight === 'execution' ? '#a855f7' : '#334155'
                                                    }}
                                                    className="w-48 h-48 bg-slate-900 rounded-[32px] border-4 flex flex-col p-6 items-center justify-center relative"
                                                >
                                                    <BoxSelect className="text-purple-400 absolute -top-4 -right-4" size={32} />
                                                    <div className="flex gap-1 mb-2">
                                                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                                                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                                                    </div>
                                                    <div className="w-32 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center">
                                                        {currentStepData.output ? (
                                                            <span className="text-green-400 font-mono text-xl font-bold animate-pulse">{currentStepData.output}</span>
                                                        ) : (
                                                            <div className="w-8 h-2 bg-slate-700 rounded animate-pulse" />
                                                        )}
                                                    </div>
                                                    <div className="mt-4 text-xs font-mono text-purple-400 font-bold">app.js</div>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                                            <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">Module Protocol</div>
                                            <div className="space-y-1">
                                                {Object.entries(currentStepData.data).map(([k, v]) => (
                                                    <div key={k} className="flex justify-between text-xs font-mono text-yellow-300">
                                                        <span className="text-slate-600">{k}:</span>
                                                        <span>{String(v)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-orange-500/10 p-4 rounded-2xl border border-orange-500/30 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                                                <Lightbulb className="text-orange-400" size={20} />
                                            </div>
                                            <p className="text-slate-400 text-xs italic">{currentEx.explanation}</p>
                                        </div>
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

export default ModulesVisualizer;
