'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, CheckCircle, XCircle, Loader } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AsyncAwaitVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
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
            title: 'Error Handling with try/catch',
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
        },
        {
            title: 'Async/Await vs Promises',
            code: `// With Promises (callback hell)
function withPromises() {
  fetch('/api/user')
    .then(response => response.json())
    .then(user => {
      return fetch(\`/api/posts/\${user.id}\`);
    })
    .then(response => response.json())
    .then(posts => {
      console.log(posts);
    })
    .catch(error => {
      console.log(error);
    });
}

// With Async/Await (clean!)
async function withAsyncAwait() {
  try {
    const response = await fetch('/api/user');
    const user = await response.json();
    
    const postsResponse = await fetch(\`/api/posts/\${user.id}\`);
    const posts = await postsResponse.json();
    
    console.log(posts);
  } catch (error) {
    console.log(error);
  }
}`,
            steps: [
                {
                    line: 3,
                    description: 'Promises: Chained .then() calls can get messy',
                    status: 'info',
                    code: 'promise',
                    message: 'Nested callbacks - harder to read'
                },
                {
                    line: 18,
                    description: 'Async/Await: Looks like synchronous code!',
                    status: 'info',
                    code: 'async',
                    message: 'Linear flow - much clearer'
                },
                {
                    line: 13,
                    description: 'Promises: Error handling with .catch()',
                    status: 'info',
                    code: 'promise',
                    message: 'Separate error handler'
                },
                {
                    line: 27,
                    description: 'Async/Await: Familiar try/catch syntax',
                    status: 'info',
                    code: 'async',
                    message: 'Standard error handling pattern'
                }
            ],
            explanation: 'Async/await is syntactic sugar over Promises - same power, cleaner syntax'
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

            <main className="pt-20 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Sparkles className="text-cyan-400" size={48} />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">Async/Await in JavaScript</h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            Write asynchronous code that looks and behaves like synchronous code
                        </p>
                    </motion.div>

                    {/* Definitions Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Interview Definition */}
                        <div className="bg-gradient-to-br from-cyan-900/40 to-slate-900 rounded-xl p-6 border border-cyan-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="text-cyan-400" size={24} />
                                <h3 className="text-lg font-bold text-cyan-400">Interview Answer</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                "The 'async' keyword makes a function return a Promise. The 'await' keyword pauses the code until that Promise finishes. It makes async code look like normal code."
                            </p>
                        </div>

                        {/* Simple Explanation */}
                        <div className="bg-gradient-to-br from-green-900/40 to-slate-900 rounded-xl p-6 border border-green-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="text-green-400" size={24} />
                                <h3 className="text-lg font-bold text-green-400">Simple Explanation</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                Think of 'await' as a pause button. Your code stops and waits for something to finish (like data from a server), then continues with the result - no callbacks needed!
                            </p>
                        </div>

                        {/* Key Points */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 rounded-xl p-6 border border-purple-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="text-purple-400" size={24} />
                                <h3 className="text-lg font-bold text-purple-400">Key Features</h3>
                            </div>
                            <ul className="space-y-2 text-slate-200 text-sm">
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span>Cleaner than .then() chains</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span>Use try/catch for errors</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span>Built on top of Promises</span>
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
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Code className="text-cyan-400" />
                            <h3 className="text-xl font-bold">Code Example</h3>
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

                    {/* Visualization */}
                    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
                        <h3 className="text-2xl font-bold mb-6">Interactive Visualization</h3>

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
                                    onClick={handleNext}
                                    disabled={currentStep === currentEx.steps.length - 1}
                                    className="p-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-lg transition-colors"
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
                                {/* Description */}
                                <div className="bg-slate-950/50 rounded-xl p-6 border border-slate-700">
                                    <p className="text-xl text-slate-200 leading-relaxed">
                                        {currentStepData.description}
                                    </p>
                                </div>

                                {/* Status Visualization */}
                                <div className={`border-2 rounded-2xl p-8 ${getStatusColor(currentStepData.status)}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {getStatusIcon(currentStepData.status)}
                                            <div>
                                                <div className="text-2xl font-bold text-white uppercase">
                                                    {currentStepData.status.replace('-', ' ')}
                                                </div>
                                                <div className="text-slate-400">{currentStepData.message}</div>
                                            </div>
                                        </div>
                                        {currentStepData.time && (
                                            <div className="text-4xl font-bold text-white">
                                                {currentStepData.time}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Waiting Status */}
                                {currentStepData.waiting && (
                                    <div className="bg-blue-500/10 border-2 border-blue-500 rounded-xl p-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Loader className="animate-spin text-blue-400" size={20} />
                                            <span className="text-blue-400 font-semibold">Awaiting:</span>
                                        </div>
                                        <div className="font-mono text-lg text-blue-200 ml-8">
                                            {currentStepData.waiting}
                                        </div>
                                    </div>
                                )}

                                {/* Timeline Visualization */}
                                {currentStepData.timeline && (
                                    <div className="bg-slate-950 rounded-xl p-6 border border-slate-700">
                                        <h4 className="text-lg font-semibold text-cyan-400 mb-4">Execution Timeline:</h4>
                                        <div className="space-y-3">
                                            {currentStepData.timeline.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4">
                                                    <div className={`w-32 px-4 py-2 rounded-lg font-semibold ${item.status === 'done' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                                                        }`}>
                                                        {item.name}
                                                    </div>
                                                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                        {item.status === 'done' && (
                                                            <div className="h-full w-full bg-green-500"></div>
                                                        )}
                                                        {item.status === 'waiting' && (
                                                            <div className="h-full w-1/2 bg-blue-500 animate-pulse"></div>
                                                        )}
                                                    </div>
                                                    <div className="text-slate-400">
                                                        {item.status === 'done' ? '✓ Done' : '⏳ Loading...'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Value/Error Display */}
                                {currentStepData.value && (
                                    <div className="bg-slate-950 rounded-xl p-6 border border-green-500/30">
                                        <div className="text-sm text-slate-500 mb-2">Resolved Value:</div>
                                        <div className="font-mono text-green-400 text-lg">
                                            {currentStepData.value}
                                        </div>
                                    </div>
                                )}

                                {currentStepData.error && (
                                    <div className="bg-slate-950 rounded-xl p-6 border border-red-500/30">
                                        <div className="text-sm text-slate-500 mb-2">Error:</div>
                                        <div className="font-mono text-red-400 text-lg">
                                            {currentStepData.error}
                                        </div>
                                    </div>
                                )}

                                {/* Output */}
                                {currentStepData.output && (
                                    <div className="bg-slate-950 rounded-xl p-6 border border-green-500/30">
                                        <div className="text-sm text-slate-500 mb-2">Console Output:</div>
                                        <div className="font-mono text-green-400 text-lg">
                                            &gt; {currentStepData.output}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Explanation */}
                        <div className="mt-8 p-6 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
                            <h4 className="text-lg font-semibold text-cyan-400 mb-2">💡 Key Takeaway</h4>
                            <p className="text-slate-300">{currentEx.explanation}</p>
                        </div>
                    </div>

                    {/* Interview Tips */}
                    <div className="mt-12 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-2xl p-8 border border-cyan-500/30">
                        <h3 className="text-2xl font-bold text-white mb-6">🎯 Interview Tips</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-cyan-400 mb-3">Common Questions:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• "What is async/await?"</li>
                                    <li>• "How is it different from Promises?"</li>
                                    <li>• "How do you handle errors?"</li>
                                    <li>• "Can you use await outside async functions?"</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-blue-400 mb-3">Pro Tips:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• async functions always return Promises</li>
                                    <li>• await only works in async functions</li>
                                    <li>• Use Promise.all() for parallel operations</li>
                                    <li>• Sequential awaits = slower execution</li>
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

export default AsyncAwaitVisualizer;
