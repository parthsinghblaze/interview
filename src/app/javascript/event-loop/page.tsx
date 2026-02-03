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

            {/* Full Screen Layout */}
            <div className="pt-20 min-h-[calc(100vh-5rem)] flex">

                {/* Left Sidebar - Definitions */}
                <div className="w-80 bg-slate-900 border-r border-slate-700 p-6 overflow-y-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Repeat className="text-green-400" size={40} />
                            <h1 className="text-3xl font-bold">Event Loop</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            How JavaScript handles async code in a single thread
                        </p>
                    </div>

                    {/* Interview Definition */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-green-400" size={22} />
                            <h3 className="text-base font-bold text-green-400 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "The Event Loop continuously monitors the Call Stack and executes tasks in order: 1) Synchronous code, 2) Microtasks (Promises), 3) Macrotasks (setTimeout)."
                        </p>
                    </div>

                    {/* Simple Explanation */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-blue-400" size={22} />
                            <h3 className="text-base font-bold text-blue-400 uppercase">Simple Explanation</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            Think of a chef (Call Stack) cooking one dish at a time. A waiter (Event Loop) checks if the chef is free, then brings orders from the priority queue (Promises first, then timeouts).
                        </p>
                    </div>

                    {/* Key Points */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-purple-400" size={22} />
                            <h3 className="text-base font-bold text-purple-400 uppercase">Key Components</h3>
                        </div>
                        <ul className="space-y-3 text-slate-200 text-base">
                            <li className="flex items-start gap-2">
                                <span className="text-yellow-400 mt-1">📚</span>
                                <div>
                                    <strong className="text-yellow-400">Call Stack:</strong> Current execution
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">⚡</span>
                                <div>
                                    <strong className="text-purple-400">Microtasks:</strong> Promises (priority!)
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">⏱️</span>
                                <div>
                                    <strong className="text-blue-400">Tasks:</strong> setTimeout, events
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Execution Order */}
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase">Priority Order</h4>
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-yellow-400">
                                <span className="font-bold">1.</span> Call Stack (sync)
                            </div>
                            <div className="flex items-center gap-2 text-purple-400">
                                <span className="font-bold">2.</span> Microtasks (Promises)
                            </div>
                            <div className="flex items-center gap-2 text-blue-400">
                                <span className="font-bold">3.</span> Tasks (setTimeout)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Full Screen Visualizer */}
                <div className="flex-1 flex flex-col bg-slate-950">

                    {/* Code Display */}
                    <div className="bg-slate-900/50 flex flex-col" style={{ height: '35vh' }}>
                        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-700 bg-slate-900">
                            <Code className="text-green-400" size={20} />
                            <h3 className="text-lg font-bold">Example Code</h3>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <SyntaxHighlighter
                                language="javascript"
                                style={atomDark}
                                showLineNumbers={true}
                                customStyle={{
                                    margin: 0,
                                    padding: '2rem',
                                    fontSize: '1.1rem',
                                    lineHeight: '1.8',
                                    backgroundColor: 'transparent'
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

                    {/* Real-Time Visualization - Takes remaining space */}
                    <div className="flex-1 bg-slate-900 px-8 py-6 overflow-y-auto border-t border-slate-700">
                        <div className="max-w-6xl mx-auto">
                            {/* Controls */}
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold">Real-Time Visualization</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400 text-base">
                                        Step {currentStep + 1} of {steps.length}
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
                                            onClick={() => setIsPlaying(!isPlaying)}
                                            className={`p-3 ${isPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'} rounded-lg transition-colors`}
                                            title={isPlaying ? 'Pause' : 'Play'}
                                        >
                                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={currentStep === steps.length - 1}
                                            className="p-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                                            title="Next"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-slate-950/50 rounded-xl p-6 border-2 border-slate-700 mb-6">
                                <p className="text-lg text-slate-100 leading-relaxed">
                                    {currentStepData.description}
                                </p>
                            </div>

                            {/* Visual Components Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Call Stack */}
                                <div className={`bg-slate-950 rounded-xl p-5 border-2 transition-all ${currentStepData.executing === 'callStack'
                                        ? 'border-yellow-500 shadow-lg shadow-yellow-500/30'
                                        : 'border-slate-700'
                                    }`}>
                                    <h4 className="text-base font-bold text-yellow-400 mb-3 flex items-center gap-2">
                                        <span>📚</span> Call Stack
                                    </h4>
                                    <div className="space-y-2 min-h-[80px]">
                                        {currentStepData.callStack.length === 0 ? (
                                            <div className="text-slate-600 italic text-center py-3 text-sm">Empty</div>
                                        ) : (
                                            currentStepData.callStack.map((item, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-2 text-xs text-yellow-200"
                                                >
                                                    {item}
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Microtask Queue */}
                                <div className={`bg-slate-950 rounded-xl p-5 border-2 transition-all ${currentStepData.executing === 'microtaskQueue'
                                        ? 'border-purple-500 shadow-lg shadow-purple-500/30'
                                        : 'border-slate-700'
                                    }`}>
                                    <h4 className="text-base font-bold text-purple-400 mb-3 flex items-center gap-2">
                                        <span>⚡</span> Microtask
                                    </h4>
                                    <div className="space-y-2 min-h-[80px]">
                                        {currentStepData.microtaskQueue.length === 0 ? (
                                            <div className="text-slate-600 italic text-center py-3 text-sm">Empty</div>
                                        ) : (
                                            currentStepData.microtaskQueue.map((item, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ x: 20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    className="bg-purple-500/20 border border-purple-500 rounded-lg p-2 text-xs text-purple-200"
                                                >
                                                    {item}
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Task Queue */}
                                <div className={`bg-slate-950 rounded-xl p-5 border-2 transition-all ${currentStepData.executing === 'taskQueue'
                                        ? 'border-blue-500 shadow-lg shadow-blue-500/30'
                                        : 'border-slate-700'
                                    }`}>
                                    <h4 className="text-base font-bold text-blue-400 mb-3 flex items-center gap-2">
                                        <span>⏱️</span> Task Queue
                                    </h4>
                                    <div className="space-y-2 min-h-[80px]">
                                        {currentStepData.taskQueue.length === 0 ? (
                                            <div className="text-slate-600 italic text-center py-3 text-sm">Empty</div>
                                        ) : (
                                            currentStepData.taskQueue.map((item, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ x: 20, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    className="bg-blue-500/20 border border-blue-500 rounded-lg p-2 text-xs text-blue-200"
                                                >
                                                    {item}
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Console Output */}
                                <div className={`bg-slate-950 rounded-xl p-5 border-2 transition-all ${currentStepData.executing === 'output'
                                        ? 'border-green-500 shadow-lg shadow-green-500/30'
                                        : 'border-slate-700'
                                    }`}>
                                    <h4 className="text-base font-bold text-green-400 mb-3 flex items-center gap-2">
                                        <span>📤</span> Output
                                    </h4>
                                    <div className="space-y-1 min-h-[80px] font-mono text-xs">
                                        {currentStepData.output.length === 0 ? (
                                            <div className="text-slate-600 italic text-center py-3">-</div>
                                        ) : (
                                            currentStepData.output.map((item, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ y: -10, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    className="text-green-400"
                                                >
                                                    &gt; {item}
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Key Takeaway */}
                            <div className="mt-6 p-5 bg-green-500/10 rounded-xl border-2 border-green-500/30">
                                <h4 className="text-base font-semibold text-green-400 mb-2 flex items-center gap-2">
                                    <span>💡</span> Why This Order?
                                </h4>
                                <p className="text-slate-300 text-base">
                                    The Event Loop checks for empty Call Stack, then processes ALL microtasks before ANY macrotasks.
                                    That's why "Promise" prints before "Timeout" even though setTimeout was called first!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default EventLoopVisualizer;
