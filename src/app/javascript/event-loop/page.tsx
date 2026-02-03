'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Repeat, Play, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Pause } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const EventLoopVisualizer = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const code = `console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise');
});

console.log('End');`;

    const steps = [
        {
            line: 1,
            description: 'console.log("Start") is pushed to Call Stack',
            callStack: ['console.log("Start")'],
            taskQueue: [],
            microtaskQueue: [],
            output: [],
            executing: 'callStack'
        },
        {
            line: 1,
            description: '"Start" is logged and removed from Call Stack',
            callStack: [],
            taskQueue: [],
            microtaskQueue: [],
            output: ['Start'],
            executing: 'output'
        },
        {
            line: 3,
            description: 'setTimeout is called - callback goes to Task Queue (Web API)',
            callStack: [],
            taskQueue: ['setTimeout callback'],
            microtaskQueue: [],
            output: ['Start'],
            executing: 'taskQueue'
        },
        {
            line: 7,
            description: 'Promise.then() - callback goes to Microtask Queue',
            callStack: [],
            taskQueue: ['setTimeout callback'],
            microtaskQueue: ['Promise callback'],
            output: ['Start'],
            executing: 'microtaskQueue'
        },
        {
            line: 11,
            description: 'console.log("End") is pushed to Call Stack',
            callStack: ['console.log("End")'],
            taskQueue: ['setTimeout callback'],
            microtaskQueue: ['Promise callback'],
            output: ['Start'],
            executing: 'callStack'
        },
        {
            line: 11,
            description: '"End" is logged and removed from Call Stack',
            callStack: [],
            taskQueue: ['setTimeout callback'],
            microtaskQueue: ['Promise callback'],
            output: ['Start', 'End'],
            executing: 'output'
        },
        {
            line: 8,
            description: 'Call Stack empty! Event Loop checks Microtask Queue FIRST',
            callStack: [],
            taskQueue: ['setTimeout callback'],
            microtaskQueue: ['Promise callback'],
            output: ['Start', 'End'],
            executing: 'eventLoop'
        },
        {
            line: 8,
            description: 'Promise callback moved to Call Stack',
            callStack: ['Promise callback'],
            taskQueue: ['setTimeout callback'],
            microtaskQueue: [],
            output: ['Start', 'End'],
            executing: 'callStack'
        },
        {
            line: 8,
            description: '"Promise" is logged',
            callStack: [],
            taskQueue: ['setTimeout callback'],
            microtaskQueue: [],
            output: ['Start', 'End', 'Promise'],
            executing: 'output'
        },
        {
            line: 4,
            description: 'Now Event Loop checks Task Queue',
            callStack: [],
            taskQueue: ['setTimeout callback'],
            microtaskQueue: [],
            output: ['Start', 'End', 'Promise'],
            executing: 'eventLoop'
        },
        {
            line: 4,
            description: 'setTimeout callback moved to Call Stack',
            callStack: ['setTimeout callback'],
            taskQueue: [],
            microtaskQueue: [],
            output: ['Start', 'End', 'Promise'],
            executing: 'callStack'
        },
        {
            line: 4,
            description: '"Timeout" is logged - Execution complete!',
            callStack: [],
            taskQueue: [],
            microtaskQueue: [],
            output: ['Start', 'End', 'Promise', 'Timeout'],
            executing: 'output'
        }
    ];

    const currentStepData = steps[currentStep];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
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

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && currentStep < steps.length - 1) {
            interval = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev >= steps.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1500);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStep]);

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
                            <Repeat className="text-green-400" size={48} />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">JavaScript Event Loop</h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            How JavaScript handles asynchronous code in a single-threaded environment
                        </p>
                    </motion.div>

                    {/* Definitions Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Interview Definition */}
                        <div className="bg-gradient-to-br from-green-900/40 to-slate-900 rounded-xl p-6 border border-green-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="text-green-400" size={24} />
                                <h3 className="text-lg font-bold text-green-400">Interview Answer</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                "The Event Loop allows JavaScript to handle asynchronous tasks in a single-threaded environment. It continuously monitors the Call Stack and executes tasks in this order: 1) Synchronous code (Call Stack), 2) Microtasks (Promises, queueMicrotask), 3) Macrotasks (setTimeout, setInterval, I/O). This ensures microtasks always complete before the next macrotask runs."
                            </p>
                        </div>

                        {/* Simple Explanation */}
                        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 rounded-xl p-6 border border-blue-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="text-blue-400" size={24} />
                                <h3 className="text-lg font-bold text-blue-400">Simple Explanation</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                Think of it like a restaurant: the Call Stack is the chef cooking one dish at a time. The Event Loop is like a waiter checking if the chef is free to start the next order from the queue.
                            </p>
                        </div>

                        {/* Key Points */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 rounded-xl p-6 border border-purple-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="text-purple-400" size={24} />
                                <h3 className="text-lg font-bold text-purple-400">Key Components</h3>
                            </div>
                            <ul className="space-y-2 text-slate-200 text-sm">
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span><strong>Call Stack</strong>: Current execution</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span><strong>Microtask Queue</strong>: Promises</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span><strong>Task Queue</strong>: setTimeout, events</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Code Display */}
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Code className="text-green-400" />
                            <h3 className="text-xl font-bold">Example Code</h3>
                        </div>
                        <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-700">
                            <SyntaxHighlighter
                                language="javascript"
                                style={atomDark}
                                showLineNumbers={true}
                                customStyle={{
                                    margin: 0,
                                    padding: '1.5rem',
                                    fontSize: '0.95rem',
                                    backgroundColor: '#0f172a'
                                }}
                                lineProps={(lineNumber: number) => {
                                    const isCurrentLine = lineNumber === currentStepData.line;
                                    return {
                                        style: {
                                            backgroundColor: isCurrentLine ? 'rgba(34, 197, 94, 0.15)' : undefined,
                                            borderLeft: isCurrentLine ? '3px solid #22c55e' : '3px solid transparent',
                                            paddingLeft: '1rem'
                                        }
                                    };
                                }}
                            >
                                {code}
                            </SyntaxHighlighter>
                        </div>
                    </div>

                    {/* Event Loop Visualization */}
                    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 mb-8">
                        <h3 className="text-2xl font-bold mb-6">Real-Time Visualization</h3>

                        {/* Controls */}
                        <div className="flex items-center justify-between mb-8">
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
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className={`p-3 ${isPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'} rounded-lg transition-colors`}
                                >
                                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={currentStep === steps.length - 1}
                                    className="p-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                            <div className="text-slate-400">
                                Step {currentStep + 1} of {steps.length}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-700 mb-8">
                            <p className="text-xl text-slate-200 leading-relaxed">
                                {currentStepData.description}
                            </p>
                        </div>

                        {/* Visual Components */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                            {/* Call Stack */}
                            <div className={`bg-slate-950 rounded-xl p-6 border-2 transition-all ${currentStepData.executing === 'callStack'
                                ? 'border-yellow-500 shadow-lg shadow-yellow-500/30'
                                : 'border-slate-700'
                                }`}>
                                <h4 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                                    <span>📚</span> Call Stack
                                </h4>
                                <div className="space-y-2 min-h-[100px]">
                                    {currentStepData.callStack.length === 0 ? (
                                        <div className="text-slate-600 italic text-center py-4">Empty</div>
                                    ) : (
                                        currentStepData.callStack.map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 text-sm text-yellow-200"
                                            >
                                                {item}
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Microtask Queue */}
                            <div className={`bg-slate-950 rounded-xl p-6 border-2 transition-all ${currentStepData.executing === 'microtaskQueue'
                                ? 'border-purple-500 shadow-lg shadow-purple-500/30'
                                : 'border-slate-700'
                                }`}>
                                <h4 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                                    <span>⚡</span> Microtask Queue
                                </h4>
                                <div className="space-y-2 min-h-[100px]">
                                    {currentStepData.microtaskQueue.length === 0 ? (
                                        <div className="text-slate-600 italic text-center py-4">Empty</div>
                                    ) : (
                                        currentStepData.microtaskQueue.map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                className="bg-purple-500/20 border border-purple-500 rounded-lg p-3 text-sm text-purple-200"
                                            >
                                                {item}
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Task Queue */}
                            <div className={`bg-slate-950 rounded-xl p-6 border-2 transition-all ${currentStepData.executing === 'taskQueue'
                                ? 'border-blue-500 shadow-lg shadow-blue-500/30'
                                : 'border-slate-700'
                                }`}>
                                <h4 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                                    <span>⏱️</span> Task Queue
                                </h4>
                                <div className="space-y-2 min-h-[100px]">
                                    {currentStepData.taskQueue.length === 0 ? (
                                        <div className="text-slate-600 italic text-center py-4">Empty</div>
                                    ) : (
                                        currentStepData.taskQueue.map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                className="bg-blue-500/20 border border-blue-500 rounded-lg p-3 text-sm text-blue-200"
                                            >
                                                {item}
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Console Output */}
                            <div className={`bg-slate-950 rounded-xl p-6 border-2 transition-all ${currentStepData.executing === 'output'
                                ? 'border-green-500 shadow-lg shadow-green-500/30'
                                : 'border-slate-700'
                                }`}>
                                <h4 className="text-lg font-bold text-green-400 mb-4 flex items-center gap-2">
                                    <span>📤</span> Console Output
                                </h4>
                                <div className="space-y-2 min-h-[100px] font-mono">
                                    {currentStepData.output.length === 0 ? (
                                        <div className="text-slate-600 italic text-center py-4">-</div>
                                    ) : (
                                        currentStepData.output.map((item, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ y: -10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="text-green-400 text-sm"
                                            >
                                                &gt; {item}
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Execution Order Diagram */}
                    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700 mb-8">
                        <h3 className="text-2xl font-bold mb-6">Execution Order</h3>
                        <div className="bg-slate-950 rounded-xl p-8 border border-slate-700">
                            <div className="flex items-center justify-between max-w-4xl mx-auto">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-yellow-500/20 border-2 border-yellow-500 rounded-full flex items-center justify-center mb-3">
                                        <span className="text-3xl">1</span>
                                    </div>
                                    <div className="text-yellow-400 font-semibold">Call Stack</div>
                                    <div className="text-xs text-slate-500">Execute current</div>
                                </div>

                                <div className="text-slate-600 text-3xl">→</div>

                                <div className="text-center">
                                    <div className="w-24 h-24 bg-purple-500/20 border-2 border-purple-500 rounded-full flex items-center justify-center mb-3">
                                        <span className="text-3xl">2</span>
                                    </div>
                                    <div className="text-purple-400 font-semibold">Microtasks</div>
                                    <div className="text-xs text-slate-500">Promises first!</div>
                                </div>

                                <div className="text-slate-600 text-3xl">→</div>

                                <div className="text-center">
                                    <div className="w-24 h-24 bg-blue-500/20 border-2 border-blue-500 rounded-full flex items-center justify-center mb-3">
                                        <span className="text-3xl">3</span>
                                    </div>
                                    <div className="text-blue-400 font-semibold">Tasks</div>
                                    <div className="text-xs text-slate-500">setTimeout</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interview Tips */}
                    <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-2xl p-8 border border-green-500/30">
                        <h3 className="text-2xl font-bold text-white mb-6">🎯 Interview Tips</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-green-400 mb-3">Common Questions:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• "Explain the Event Loop"</li>
                                    <li>• "What's the difference between microtasks and macrotasks?"</li>
                                    <li>• "How does JavaScript handle async code?"</li>
                                    <li>• "Why do Promises execute before setTimeout?"</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-blue-400 mb-3">Remember:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• JavaScript is single-threaded</li>
                                    <li>• Microtasks have higher priority</li>
                                    <li>• Event Loop waits for empty Call Stack</li>
                                    <li>• Promise callbacks are microtasks</li>
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

export default EventLoopVisualizer;
