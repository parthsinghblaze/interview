'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, CheckCircle, XCircle, Loader } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
    line: number;
    description: string;
    message: string;
    state?: string;
    value?: any;
    output?: string;
    chain?: string[];
    parallel?: any[];
    error?: string;
    promises?: any[];
    httpStatus?: number;
}

interface Example {
    title: string;
    code: string;
    steps: Step[];
    explanation: string;
}

const PromisesVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples: Example[] = [
        {
            title: 'Promise States',
            code: `const promise = new Promise((resolve, reject) => {
  // Pending state
  setTimeout(() => {
    resolve('Success!'); // Fulfilled
    // or reject('Error!'); // Rejected
  }, 1000);
});

promise.then(result => {
  console.log(result);
}).catch(error => {
  console.log(error);
});`,
            steps: [
                {
                    line: 1,
                    description: 'Promise is created - starts in PENDING state',
                    state: 'pending',
                    value: null,
                    message: 'Promise is working...'
                },
                {
                    line: 2,
                    description: 'Executor function runs immediately',
                    state: 'pending',
                    value: null,
                    message: 'Waiting for async operation...'
                },
                {
                    line: 4,
                    description: 'resolve() is called - Promise transitions to FULFILLED',
                    state: 'fulfilled',
                    value: 'Success!',
                    message: 'Promise resolved successfully!'
                },
                {
                    line: 9,
                    description: '.then() handler executes with the resolved value',
                    state: 'fulfilled',
                    value: 'Success!',
                    output: 'Success!',
                    message: 'Value passed to then() handler'
                }
            ],
            explanation: 'A Promise has 3 states: Pending (initial), Fulfilled (success), or Rejected (error)'
        },
        {
            title: 'Promise Chaining',
            code: `fetch('/api/user')
  .then(response => response.json())
  .then(user => {
    console.log(user.name);
    return fetch('/api/posts');
  })
  .then(response => response.json())
  .then(posts => {
    console.log(posts);
  })
  .catch(error => {
    console.log('Error:', error);
  });`,
            steps: [
                {
                    line: 1,
                    description: 'First fetch returns a Promise',
                    state: 'pending',
                    chain: ['fetch /api/user'],
                    message: 'Initial request...'
                },
                {
                    line: 2,
                    description: 'First .then() processes response, returns another Promise',
                    state: 'fulfilled',
                    chain: ['fetch /api/user ✓', 'response.json()'],
                    message: 'Parsing response...'
                },
                {
                    line: 3,
                    description: 'User data received, logging name',
                    state: 'fulfilled',
                    chain: ['fetch /api/user ✓', 'response.json() ✓'],
                    output: 'John Doe',
                    message: 'Got user data!'
                },
                {
                    line: 5,
                    description: 'Returning new Promise in .then() continues the chain',
                    state: 'pending',
                    chain: ['fetch /api/user ✓', 'response.json() ✓', 'fetch /api/posts'],
                    message: 'Fetching posts...'
                },
                {
                    line: 7,
                    description: 'Processing posts response',
                    state: 'fulfilled',
                    chain: ['fetch /api/user ✓', 'response.json() ✓', 'fetch /api/posts ✓', 'response.json()'],
                    message: 'Parsing posts...'
                },
                {
                    line: 8,
                    description: 'Final posts data logged',
                    state: 'fulfilled',
                    chain: ['fetch /api/user ✓', 'response.json() ✓', 'fetch /api/posts ✓', 'response.json() ✓'],
                    output: '[Post 1, Post 2, ...]',
                    message: 'Chain complete!'
                }
            ],
            explanation: 'Each .then() returns a new Promise, allowing sequential async operations'
        },
        {
            title: 'Promise.all()',
            code: `const promise1 = fetch('/api/user');
const promise2 = fetch('/api/posts');
const promise3 = fetch('/api/comments');

Promise.all([promise1, promise2, promise3])
  .then(results => {
    console.log('All done!', results);
  })
  .catch(error => {
    console.log('One failed!', error);
  });`,
            steps: [
                {
                    line: 1,
                    description: 'Creating three independent Promises',
                    promises: [
                        { name: 'user', state: 'pending' },
                        { name: 'posts', state: 'pending' },
                        { name: 'comments', state: 'pending' }
                    ],
                    message: 'All promises running in parallel...'
                },
                {
                    line: 5,
                    description: 'Promise.all() waits for ALL to resolve',
                    promises: [
                        { name: 'user', state: 'fulfilled' },
                        { name: 'posts', state: 'pending' },
                        { name: 'comments', state: 'pending' }
                    ],
                    message: 'User data received, waiting for others...'
                },
                {
                    line: 5,
                    description: 'Second promise resolves',
                    promises: [
                        { name: 'user', state: 'fulfilled' },
                        { name: 'posts', state: 'fulfilled' },
                        { name: 'comments', state: 'pending' }
                    ],
                    message: 'Posts received, waiting for comments...'
                },
                {
                    line: 6,
                    description: 'All promises fulfilled - .then() executes with array of results',
                    promises: [
                        { name: 'user', state: 'fulfilled' },
                        { name: 'posts', state: 'fulfilled' },
                        { name: 'comments', state: 'fulfilled' }
                    ],
                    output: '[userData, postsData, commentsData]',
                    message: 'All complete!'
                }
            ],
            explanation: 'Promise.all() waits for ALL promises to succeed, or fails if ANY fails'
        },
        {
            title: 'Error Handling',
            code: `fetch('/api/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('HTTP error');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.log('Caught:', error.message);
  })
  .finally(() => {
    console.log('Cleanup done');
  });`,
            steps: [
                {
                    line: 1,
                    description: 'fetch() initiates request',
                    state: 'pending',
                    message: 'Making request...'
                },
                {
                    line: 3,
                    description: 'Response received, but status is 404',
                    state: 'fulfilled',
                    message: 'Got response (404)',
                    httpStatus: 404
                },
                {
                    line: 4,
                    description: 'Throwing error - Promise chain skips to .catch()',
                    state: 'rejected',
                    error: 'HTTP error',
                    message: 'Error thrown!'
                },
                {
                    line: 11,
                    description: '.catch() handles the error',
                    state: 'rejected',
                    error: 'HTTP error',
                    output: 'Caught: HTTP error',
                    message: 'Error handled'
                },
                {
                    line: 14,
                    description: '.finally() runs regardless of success or failure',
                    state: 'rejected',
                    output: 'Cleanup done',
                    message: 'Cleanup complete'
                }
            ],
            explanation: 'Errors propagate to .catch(), and .finally() always executes'
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

    const getStateIcon = (state: string) => {
        switch (state) {
            case 'pending': return <Loader className="text-blue-400 animate-spin" size={24} />;
            case 'fulfilled': return <CheckCircle className="text-green-400" size={24} />;
            case 'rejected': return <XCircle className="text-red-400" size={24} />;
            default: return null;
        }
    };

    const getStateColor = (state: string) => {
        switch (state) {
            case 'pending': return 'border-blue-500 bg-blue-500/10';
            case 'fulfilled': return 'border-green-500 bg-green-500/10';
            case 'rejected': return 'border-red-500 bg-red-500/10';
            default: return 'border-slate-500 bg-slate-500/10';
        }
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
                            <Clock className="text-orange-400" size={40} />
                            <h1 className="text-3xl font-bold">Promises</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Handle asynchronous operations with elegant Promise API
                        </p>
                    </div>

                    {/* Interview Definition */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-orange-400" size={22} />
                            <h3 className="text-base font-bold text-orange-400 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "A Promise represents the result of an async operation with three states: pending (initial), fulfilled (success), or rejected (error)."
                        </p>
                    </div>

                    {/* Simple Explanation */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-green-400" size={22} />
                            <h3 className="text-base font-bold text-green-400 uppercase">Simple Explanation</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            Like ordering food online: you get an order confirmation (pending), then your food arrives (fulfilled) or order is cancelled (rejected).
                        </p>
                    </div>

                    {/* Key Points */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-blue-400" size={22} />
                            <h3 className="text-base font-bold text-blue-400 uppercase">Three States</h3>
                        </div>
                        <ul className="space-y-3 text-slate-200 text-base">
                            <li className="flex items-start gap-2">
                                <Loader className="text-blue-400 mt-1 animate-spin" size={18} />
                                <div>
                                    <strong className="text-blue-400">Pending:</strong> Initial state
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="text-green-400 mt-1" size={18} />
                                <div>
                                    <strong className="text-green-400">Fulfilled:</strong> Success
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <XCircle className="text-red-400 mt-1" size={18} />
                                <div>
                                    <strong className="text-red-400">Rejected:</strong> Failure
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Promise Methods */}
                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase">Key Methods</h4>
                        <ul className="space-y-2 text-slate-400 text-xs">
                            <li>• then() - Handle success</li>
                            <li>• catch() - Handle errors</li>
                            <li>• finally() - Always runs</li>
                            <li>• Promise.all() - Wait for all</li>
                            <li>• Promise.race() - First wins</li>
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
                                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30'
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
                            <Code className="text-orange-400" size={20} />
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
                                            backgroundColor: isCurrentLine ? 'rgba(249, 115, 22, 0.15)' : undefined,
                                            borderLeft: isCurrentLine ? '3px solid #f97316' : '3px solid transparent',
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
                    <div className="flex-1 bg-slate-900 px-8 py-6 overflow-y-auto border-t border-slate-700">
                        <div className="max-w-5xl mx-auto">
                            {/* Controls */}
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold">Interactive Visualization</h3>
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
                                            className="p-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
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
                                    {/* Description */}
                                    <div className="bg-slate-950/50 rounded-xl p-6 border-2 border-slate-700">
                                        <p className="text-lg text-slate-100 leading-relaxed">
                                            {currentStepData.description}
                                        </p>
                                    </div>

                                    {/* Promise State Visualization */}
                                    {currentStepData.state && (
                                        <div className={`border-2 rounded-2xl p-6 ${getStateColor(currentStepData.state)}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    {getStateIcon(currentStepData.state)}
                                                    <div>
                                                        <div className="text-xl font-bold text-white uppercase">
                                                            {currentStepData.state}
                                                        </div>
                                                        <div className="text-slate-400 text-sm">{currentStepData.message}</div>
                                                    </div>
                                                </div>
                                                {currentStepData.value && (
                                                    <div className="bg-slate-950 rounded-lg px-5 py-2 border border-slate-700">
                                                        <div className="text-xs text-slate-500">Value:</div>
                                                        <div className="font-mono text-green-400">{currentStepData.value}</div>
                                                    </div>
                                                )}
                                                {currentStepData.error && (
                                                    <div className="bg-slate-950 rounded-lg px-5 py-2 border border-red-500">
                                                        <div className="text-xs text-slate-500">Error:</div>
                                                        <div className="font-mono text-red-400">{currentStepData.error}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Promise Chain Visualization */}
                                    {currentStepData.chain && (
                                        <div className="bg-slate-950 rounded-xl p-6 border border-slate-700">
                                            <h4 className="text-base font-semibold text-orange-400 mb-4">Promise Chain:</h4>
                                            <div className="flex flex-wrap items-center gap-3">
                                                {currentStepData.chain.map((item: any, idx: number) => (
                                                    <React.Fragment key={idx}>
                                                        <div className={`px-4 py-2 rounded-lg text-sm ${item.includes('✓')
                                                            ? 'bg-green-500/20 text-green-400 border border-green-500'
                                                            : 'bg-blue-500/20 text-blue-400 border border-blue-500'
                                                            }`}>
                                                            {item}
                                                        </div>
                                                        {idx < (currentStepData as any).chain.length - 1 && (
                                                            <span className="text-slate-600">→</span>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Promise.all Visualization */}
                                    {(currentStepData as any).promises && (
                                        <div className="bg-slate-950 rounded-xl p-6 border border-slate-700">
                                            <h4 className="text-base font-semibold text-orange-400 mb-4">Promises Status:</h4>
                                            <div className="grid grid-cols-3 gap-4">
                                                {(currentStepData as any).promises.map((promise: any, idx: number) => (
                                                    <div key={idx} className={`p-4 rounded-lg border-2 ${getStateColor(promise.state)}`}>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-semibold text-sm">{promise.name}</span>
                                                            {getStateIcon(promise.state)}
                                                        </div>
                                                        <div className="text-xs text-slate-400 uppercase">{promise.state}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Output */}
                                    {(currentStepData as any).output && (
                                        <div className="bg-slate-950 rounded-xl p-5 border border-green-500/30">
                                            <div className="text-sm text-slate-500 mb-2">Console Output:</div>
                                            <div className="font-mono text-green-400 text-base">
                                                &gt; {currentStepData.output}
                                            </div>
                                        </div>
                                    )}

                                    {/* Explanation */}
                                    <div className="mt-6 p-5 bg-orange-500/10 rounded-xl border-2 border-orange-500/30">
                                        <h4 className="text-base font-semibold text-orange-400 mb-2 flex items-center gap-2">
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

export default PromisesVisualizer;
