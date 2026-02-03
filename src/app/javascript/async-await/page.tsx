'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, CheckCircle, XCircle, Loader } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
    line: number;
    description: string;
    status: string;
    message: string;
    output?: string;
    waiting?: string;
    value?: string;
    time?: string;
    timeline?: any;
    error?: string;
}

interface Example {
    title: string;
    code: string;
    steps: Step[];
    explanation: string;
}

const AsyncAwaitVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples: Example[] = [
        {
            title: 'Basic Async/Await',
            code: `async function fetchUser() {
  console.log('Fetching...');
  
  const response = await fetch('/api/user');
  const user = await response.json();
  
  console.log('User:', user);
  return user;
}

fetchUser();`,
            steps: [
                {
                    line: 1,
                    description: 'async function is declared - it ALWAYS returns a Promise',
                    status: 'info',
                    message: 'Function can use await inside'
                },
                {
                    line: 2,
                    description: 'Function starts executing synchronously',
                    status: 'running',
                    output: 'Fetching...',
                    message: 'Synchronous code runs first'
                },
                {
                    line: 4,
                    description: 'await pauses execution until Promise resolves',
                    status: 'waiting',
                    waiting: 'fetch(/api/user)',
                    message: 'Function paused, waiting for response...'
                },
                {
                    line: 4,
                    description: 'Promise resolved, execution continues with the value',
                    status: 'running',
                    value: 'Response object',
                    message: 'Got response, moving to next line'
                },
                {
                    line: 5,
                    description: 'await again - pauses for JSON parsing',
                    status: 'waiting',
                    waiting: 'response.json()',
                    message: 'Waiting for JSON parsing...'
                },
                {
                    line: 7,
                    description: 'All awaits complete, user data logged',
                    status: 'complete',
                    value: '{ name: "John", age: 30 }',
                    output: 'User: { name: "John", age: 30 }',
                    message: 'Function execution complete!'
                }
            ],
            explanation: 'async/await makes asynchronous code look synchronous and easier to read'
        },
        {
            title: 'Error Handling',
            code: `async function getData() {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.log('Error:', error.message);
    return null;
  }
}`,
            steps: [
                {
                    line: 2,
                    description: 'try block starts - errors will be caught',
                    status: 'running',
                    message: 'Protected code block'
                },
                {
                    line: 3,
                    description: 'await fetch - waiting for response',
                    status: 'waiting',
                    waiting: 'fetch(/api/data)',
                    message: 'Making HTTP request...'
                },
                {
                    line: 5,
                    description: 'Response received but status is 404',
                    status: 'running',
                    value: 'response.ok = false',
                    message: 'Checking response status'
                },
                {
                    line: 6,
                    description: 'Error thrown! Execution jumps to catch block',
                    status: 'error',
                    error: 'Failed to fetch',
                    message: 'Jumping to catch block...'
                },
                {
                    line: 12,
                    description: 'catch block handles the error gracefully',
                    status: 'error-handled',
                    error: 'Failed to fetch',
                    output: 'Error: Failed to fetch',
                    message: 'Error caught and logged'
                },
                {
                    line: 14,
                    description: 'Function returns null as fallback',
                    status: 'complete',
                    value: 'null',
                    message: 'Graceful error handling complete'
                }
            ],
            explanation: 'try/catch with async/await provides clean error handling, just like synchronous code'
        },
        {
            title: 'Sequential vs Parallel',
            code: `// ❌ Sequential (slow)
async function sequential() {
  const user = await fetchUser();    // 1s
  const posts = await fetchPosts();  // 1s
  const comments = await fetchComments(); // 1s
  // Total: 3 seconds
}

// ✅ Parallel (fast)
async function parallel() {
  const [user, posts, comments] = await Promise.all([
    fetchUser(),    // All start together
    fetchPosts(),
    fetchComments()
  ]);
  // Total: 1 second!
}`,
            steps: [
                {
                    line: 3,
                    description: 'Sequential: First await - waiting 1 second',
                    status: 'waiting',
                    timeline: [{ name: 'user', status: 'waiting' }],
                    time: '1s',
                    message: 'Waiting for user...'
                },
                {
                    line: 4,
                    description: 'Sequential: Second await - waiting another 1 second',
                    status: 'waiting',
                    timeline: [
                        { name: 'user', status: 'done' },
                        { name: 'posts', status: 'waiting' }
                    ],
                    time: '2s',
                    message: 'Waiting for posts...'
                },
                {
                    line: 5,
                    description: 'Sequential: Third await - waiting another 1 second',
                    status: 'waiting',
                    timeline: [
                        { name: 'user', status: 'done' },
                        { name: 'posts', status: 'done' },
                        { name: 'comments', status: 'waiting' }
                    ],
                    time: '3s',
                    message: 'Waiting for comments... Total: 3s ⏱️'
                },
                {
                    line: 11,
                    description: 'Parallel: Promise.all() starts ALL requests at once!',
                    status: 'waiting',
                    timeline: [
                        { name: 'user', status: 'waiting' },
                        { name: 'posts', status: 'waiting' },
                        { name: 'comments', status: 'waiting' }
                    ],
                    time: '1s',
                    message: 'All requests running in parallel...'
                },
                {
                    line: 11,
                    description: 'Parallel: ALL complete in just 1 second!',
                    status: 'complete',
                    timeline: [
                        { name: 'user', status: 'done' },
                        { name: 'posts', status: 'done' },
                        { name: 'comments', status: 'done' }
                    ],
                    time: '1s',
                    message: 'Total: 1s - 3x faster! ⚡'
                }
            ],
            explanation: 'Use Promise.all() with await for parallel execution when tasks don\'t depend on each other'
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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'waiting': return <Loader className="text-blue-400 animate-spin" size={24} />;
            case 'complete': return <CheckCircle className="text-green-400" size={24} />;
            case 'error': return <XCircle className="text-red-400" size={24} />;
            case 'error-handled': return <CheckCircle className="text-yellow-400" size={24} />;
            default: return <Sparkles className="text-cyan-400" size={24} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'waiting': return 'border-blue-500 bg-blue-500/10';
            case 'complete': return 'border-green-500 bg-green-500/10';
            case 'error': return 'border-red-500 bg-red-500/10';
            case 'error-handled': return 'border-yellow-500 bg-yellow-500/10';
            default: return 'border-cyan-500 bg-cyan-500/10';
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Header />

            {/* Full Screen Layout */}
            <div className="pt-20 min-h-[calc(100vh-5rem)] flex">

                {/* Left Sidebar */}
                <div className="w-80 bg-slate-900 border-r border-slate-700 p-6 overflow-y-auto">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="text-cyan-400" size={40} />
                            <h1 className="text-3xl font-bold">Async/Await</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Write async code that looks synchronous
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-cyan-400" size={22} />
                            <h3 className="text-base font-bold text-cyan-400 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "'async' makes a function return a Promise. 'await' pauses code until that Promise finishes. Makes async code look like normal code."
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-green-400" size={22} />
                            <h3 className="text-base font-bold text-green-400 uppercase">Simple Explanation</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            'await' is like a pause button. Code stops and waits for something to finish, then continues with the result - no callbacks!
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-purple-400" size={22} />
                            <h3 className="text-base font-bold text-purple-400 uppercase">Key Features</h3>
                        </div>
                        <ul className="space-y-3 text-slate-200 text-base">
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">✨</span>
                                <div>Cleaner than .then() chains</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">🛡️</span>
                                <div>Use try/catch for errors</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">⚡</span>
                                <div>Built on top of Promises</div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase">Remember</h4>
                        <ul className="space-y-2 text-slate-400 text-xs">
                            <li>• async functions return Promises</li>
                            <li>• await only works in async functions</li>
                            <li>• Use Promise.all() for parallel ops</li>
                        </ul>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex-1 flex flex-col bg-slate-950">

                    {/* Example Tabs */}
                    <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
                        <div className="flex gap-2 overflow-x-auto">
                            {examples.map((ex, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => changeExample(idx)}
                                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${currentExample === idx
                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30'
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
                            <Code className="text-cyan-400" size={20} />
                            <h3 className="text-lg font-bold">Code Example</h3>
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
                                            backgroundColor: isCurrentLine ? 'rgba(6, 182, 212, 0.15)' : undefined,
                                            borderLeft: isCurrentLine ? '3px solid #06b6d4' : '3px solid transparent',
                                            paddingLeft: '1rem'
                                        }
                                    };
                                }}
                            >
                                {currentEx.code}
                            </SyntaxHighlighter>
                        </div>
                    </div>

                    {/* Interactive Visualization */}
                    <div className="flex-1 bg-slate-900 px-8 py-6 overflow-y-auto border-t border-slate-700">
                        <div className="max-w-5xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold">Interactive Visualization</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400 text-base">
                                        Step {currentStep + 1} of {currentEx.steps.length}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={handleReset} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                                            <RotateCcw size={20} />
                                        </button>
                                        <button onClick={handlePrevious} disabled={currentStep === 0} className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors">
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button onClick={handleNext} disabled={currentStep === currentEx.steps.length - 1} className="p-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-lg transition-colors">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-slate-950/50 rounded-xl p-6 border-2 border-slate-700">
                                        <p className="text-lg text-slate-100 leading-relaxed">{currentStepData.description}</p>
                                    </div>

                                    <div className={`border-2 rounded-2xl p-6 ${getStatusColor(currentStepData.status)}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                {getStatusIcon(currentStepData.status)}
                                                <div>
                                                    <div className="text-xl font-bold text-white uppercase">
                                                        {currentStepData.status.replace('-', ' ')}
                                                    </div>
                                                    <div className="text-slate-400 text-sm">{currentStepData.message}</div>
                                                </div>
                                            </div>
                                            {currentStepData.time && (
                                                <div className="text-4xl font-bold text-white">{currentStepData.time}</div>
                                            )}
                                        </div>
                                    </div>

                                    {currentStepData.waiting && (
                                        <div className="bg-blue-500/10 border-2 border-blue-500 rounded-xl p-5">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Loader className="animate-spin text-blue-400" size={20} />
                                                <span className="text-blue-400 font-semibold text-sm">Awaiting:</span>
                                            </div>
                                            <div className="font-mono text-base text-blue-200 ml-8">{currentStepData.waiting}</div>
                                        </div>
                                    )}

                                    {currentStepData.timeline && (
                                        <div className="bg-slate-950 rounded-xl p-6 border border-slate-700">
                                            <h4 className="text-base font-semibold text-cyan-400 mb-4">Execution Timeline:</h4>
                                            <div className="flex gap-4 min-h-[80px]">
                                                {currentStepData.timeline.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex flex-col items-center gap-2">
                                                        <div className={`w-28 px-3 py-2 rounded-lg font-semibold text-sm ${item.status === 'done' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                                                            }`}>
                                                            {item.name}
                                                        </div>
                                                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                            {item.status === 'done' && <div className="h-full w-full bg-green-500"></div>}
                                                            {item.status === 'waiting' && <div className="h-full w-1/2 bg-blue-500 animate-pulse"></div>}
                                                        </div>
                                                        <div className="text-slate-400 text-sm">
                                                            {item.status === 'done' ? '✓ Done' : '⏳ Loading...'}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {currentStepData.value && (
                                        <div className="bg-slate-950 rounded-xl p-5 border border-green-500/30">
                                            <div className="text-sm text-slate-500 mb-2">Resolved Value:</div>
                                            <div className="font-mono text-green-400 text-base">{currentStepData.value}</div>
                                        </div>
                                    )}

                                    {currentStepData.error && (
                                        <div className="bg-slate-950 rounded-xl p-5 border border-red-500/30">
                                            <div className="text-sm text-slate-500 mb-2">Error:</div>
                                            <div className="font-mono text-red-400 text-base">{currentStepData.error}</div>
                                        </div>
                                    )}

                                    {currentStepData.output && (
                                        <div className="bg-slate-950 rounded-xl p-5 border border-green-500/30">
                                            <div className="text-sm text-slate-500 mb-2">Console Output:</div>
                                            <div className="font-mono text-green-400 text-base">&gt; {currentStepData.output}</div>
                                        </div>
                                    )}

                                    <div className="mt-6 p-5 bg-cyan-500/10 rounded-xl border-2 border-cyan-500/30">
                                        <h4 className="text-base font-semibold text-cyan-400 mb-2 flex items-center gap-2">
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

export default AsyncAwaitVisualizer;
