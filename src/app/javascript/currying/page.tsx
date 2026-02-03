'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Split, Play, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CurryingVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Basic Currying Example',
            code: `// Normal function
function add(a, b, c) {
  return a + b + c;
}
add(1, 2, 3); // 6

// Curried version
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

curriedAdd(1)(2)(3); // 6`,
            steps: [
                {
                    line: 2,
                    description: 'Normal function takes 3 parameters at once',
                    data: { type: 'normal', arity: 3 },
                    highlight: 'normal'
                },
                {
                    line: 8,
                    description: 'Curried version: First call with (1), returns a function',
                    data: { a: 1, returned: 'function(b)' },
                    highlight: 'curry',
                    output: 'function'
                },
                {
                    line: 9,
                    description: 'Second call with (2), returns another function',
                    data: { a: 1, b: 2, returned: 'function(c)' },
                    highlight: 'curry',
                    output: 'function'
                },
                {
                    line: 10,
                    description: 'Third call with (3), finally returns the result',
                    data: { a: 1, b: 2, c: 3, result: 6 },
                    highlight: 'execution',
                    output: '6'
                },
                {
                    line: 16,
                    description: 'Each () calls one function in the chain',
                    data: { calls: 3, result: 6 },
                    highlight: 'output',
                    output: '6'
                }
            ],
            explanation: 'Currying transforms a function with multiple arguments into a sequence of functions, each taking a single argument.'
        },
        {
            title: 'Partial Application',
            code: `function multiply(a) {
  return function(b) {
    return a * b;
  };
}

const double = multiply(2);
const triple = multiply(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15`,
            steps: [
                {
                    line: 1,
                    description: 'Create a curried multiply function',
                    data: { function: 'multiply', params: 'a, then b' },
                    highlight: 'curry'
                },
                {
                    line: 7,
                    description: 'double = multiply(2) - partially apply with a=2',
                    data: { a: 2, waiting: 'for b' },
                    highlight: 'partial',
                    output: 'function(b) { return 2 * b }'
                },
                {
                    line: 8,
                    description: 'triple = multiply(3) - partially apply with a=3',
                    data: { a: 3, waiting: 'for b' },
                    highlight: 'partial',
                    output: 'function(b) { return 3 * b }'
                },
                {
                    line: 10,
                    description: 'double(5) → 2 * 5 = 10',
                    data: { a: 2, b: 5, result: 10 },
                    highlight: 'execution',
                    output: '10'
                },
                {
                    line: 11,
                    description: 'triple(5) → 3 * 5 = 15',
                    data: { a: 3, b: 5, result: 15 },
                    highlight: 'execution',
                    output: '15'
                }
            ],
            explanation: 'Partial application "fixes" some arguments, creating specialized functions. Currying enables this pattern.'
        },
        {
            title: 'Generic Curry Helper',
            code: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...nextArgs) {
        return curried(...args, ...nextArgs);
      };
    }
  };
}

function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);
console.log(curriedSum(1)(2)(3));   // 6
console.log(curriedSum(1, 2)(3));   // 6
console.log(curriedSum(1)(2, 3));   // 6`,
            steps: [
                {
                    line: 1,
                    description: 'Generic curry() function that can curry ANY function',
                    data: { input: 'any function' },
                    highlight: 'curry'
                },
                {
                    line: 17,
                    description: 'Convert sum() into a curried version',
                    data: { original: 'sum(a,b,c)', curried: 'curriedSum' },
                    highlight: 'curry'
                },
                {
                    line: 18,
                    description: 'Call with one argument at a time: (1)(2)(3)',
                    data: { args: [1, 2, 3], method: 'one by one' },
                    highlight: 'execution',
                    output: '6'
                },
                {
                    line: 19,
                    description: 'Mix it up: (1, 2)(3) - two args then one',
                    data: { args: [1, 2, 3], method: 'mixed' },
                    highlight: 'execution',
                    output: '6'
                },
                {
                    line: 20,
                    description: 'Another mix: (1)(2, 3) - one arg then two',
                    data: { args: [1, 2, 3], method: 'mixed' },
                    highlight: 'execution',
                    output: '6'
                }
            ],
            explanation: 'A curry helper checks if all arguments are provided. If not, it returns a function waiting for more arguments.'
        },
        {
            title: 'Real-World: Event Handler',
            code: `function logger(level) {
  return function(message) {
    return function(timestamp) {
      console.log(\`[\${timestamp}] [\${level}] \${message}\`);
    };
  };
}

const errorLogger = logger('ERROR');
const infoLogger = logger('INFO');

// Later in your code...
errorLogger('Database connection failed')(Date.now());
// [1706920800000] [ERROR] Database connection failed

infoLogger('User logged in')(Date.now());
// [1706920800000] [INFO] User logged in`,
            steps: [
                {
                    line: 1,
                    description: 'Create a curry function for logging',
                    data: { params: ['level', 'message', 'timestamp'] },
                    highlight: 'curry'
                },
                {
                    line: 9,
                    description: 'Pre-configure error logger with level="ERROR"',
                    data: { level: 'ERROR', waiting: 'message, timestamp' },
                    highlight: 'partial',
                    output: 'function(message)'
                },
                {
                    line: 10,
                    description: 'Pre-configure info logger with level="INFO"',
                    data: { level: 'INFO', waiting: 'message, timestamp' },
                    highlight: 'partial',
                    output: 'function(message)'
                },
                {
                    line: 13,
                    description: 'Use errorLogger with message and timestamp',
                    data: {
                        level: 'ERROR',
                        message: 'Database connection failed',
                        timestamp: 'now'
                    },
                    highlight: 'execution',
                    output: '[timestamp] [ERROR] Database connection failed'
                },
                {
                    line: 16,
                    description: 'Use infoLogger with different message',
                    data: {
                        level: 'INFO',
                        message: 'User logged in',
                        timestamp: 'now'
                    },
                    highlight: 'execution',
                    output: '[timestamp] [INFO] User logged in'
                }
            ],
            explanation: 'Currying lets you create specialized functions (errorLogger, infoLogger) from a generic function, reducing repetition.'
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
                            <Split className="text-pink-400" size={48} />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">Function Currying</h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            Transform multi-argument functions into a sequence of single-argument functions
                        </p>
                    </motion.div>

                    {/* Definitions Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Interview Definition */}
                        <div className="bg-gradient-to-br from-pink-900/40 to-slate-900 rounded-xl p-6 border border-pink-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="text-pink-400" size={24} />
                                <h3 className="text-lg font-bold text-pink-400">Interview Answer</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                "Currying is a technique where a function with multiple arguments is transformed into a series of functions, each taking a single argument."
                            </p>
                        </div>

                        {/* Simple Explanation */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 rounded-xl p-6 border border-purple-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="text-purple-400" size={24} />
                                <h3 className="text-lg font-bold text-purple-400">Simple Explanation</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                Imagine ordering a sandwich. Instead of saying "I want bread, cheese, and tomato" all at once, you say "bread" first, then "cheese", then "tomato". Each choice leads to the next step.
                            </p>
                        </div>

                        {/* Key Points */}
                        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 rounded-xl p-6 border border-blue-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="text-blue-400" size={24} />
                                <h3 className="text-lg font-bold text-blue-400">Core Concepts</h3>
                            </div>
                            <ul className="space-y-2 text-slate-200 text-sm">
                                <li className="flex gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>One argument per function</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>Returns a function until done</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>Enables partial application</span>
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
                                        ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/30'
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
                            <Code className="text-pink-400" />
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
                                    className="p-3 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 rounded-lg transition-colors"
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
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${currentStepData.highlight === 'curry'
                                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                                        : currentStepData.highlight === 'partial'
                                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                            : currentStepData.highlight === 'execution'
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        }`}>
                                        {currentStepData.highlight === 'curry' ? '🔗 Currying' :
                                            currentStepData.highlight === 'partial' ? '⚙️ Partial' :
                                                currentStepData.highlight === 'execution' ? '▶️ Executing' : '📝 Definition'}
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
                                <div className="bg-slate-950 rounded-xl p-6 border border-pink-500/30">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Layers className="text-pink-400" size={20} />
                                        <h4 className="text-lg font-semibold text-pink-400">Current State</h4>
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
                        <div className="mt-8 p-6 bg-pink-500/10 rounded-xl border border-pink-500/30">
                            <h4 className="text-lg font-semibold text-pink-400 mb-2">💡 Key Takeaway</h4>
                            <p className="text-slate-300">{currentEx.explanation}</p>
                        </div>
                    </div>

                    {/* Interview Tips */}
                    <div className="mt-12 bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-2xl p-8 border border-pink-500/30">
                        <h3 className="text-2xl font-bold text-white mb-6">🎯 Interview Tips</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-pink-400 mb-3">Common Questions:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• "What is currying?"</li>
                                    <li>• "Difference between currying and partial application?"</li>
                                    <li>• "Why use currying?"</li>
                                    <li>• "Implement a curry function"</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-purple-400 mb-3">Real-World Uses:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• Create reusable functions</li>
                                    <li>• Event handler factories</li>
                                    <li>• Configuration functions</li>
                                    <li>• Functional programming patterns</li>
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

export default CurryingVisualizer;
