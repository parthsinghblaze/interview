'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Split, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CurryingVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Basic Example',
            code: `// Normal function
function add(a, b, c) {
  return a + b + c;
}

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
                    description: 'Normal function takes all 3 parameters at once.',
                    data: { type: 'normal', arity: 3 },
                    highlight: 'normal'
                },
                {
                    line: 7,
                    description: 'Curried version: First call with (1), returns a function waiting for (b).',
                    data: { a: 1, returns: 'function(b)' },
                    highlight: 'curry'
                },
                {
                    line: 8,
                    description: 'Second call with (2), returns a function waiting for (c).',
                    data: { a: 1, b: 2, returns: 'function(c)' },
                    highlight: 'curry'
                },
                {
                    line: 9,
                    description: 'Third call with (3), finally returns the result: 1 + 2 + 3 = 6.',
                    data: { a: 1, b: 2, c: 3, result: 6 },
                    highlight: 'execution',
                    output: '6'
                }
            ],
            explanation: 'Currying transforms a multi-argument function into a sequence of single-argument functions.'
        },
        {
            title: 'Partial Application',
            code: `function multiply(a) {
  return function(b) {
    return a * b;
  };
}

const double = multiply(2); // "Fixed" a=2
const triple = multiply(3); // "Fixed" a=3

console.log(double(5));  // 10
console.log(triple(5));  // 15`,
            steps: [
                {
                    line: 8,
                    description: 'double = multiply(2) - We "partially apply" a=2. It returns a specialized function.',
                    data: { a: 2, function: 'double(b)' },
                    highlight: 'partial'
                },
                {
                    line: 9,
                    description: 'triple = multiply(3) - We partially apply a=3. Another specialized function.',
                    data: { a: 3, function: 'triple(b)' },
                    highlight: 'partial'
                },
                {
                    line: 11,
                    description: 'Calling double(5) uses the "fixed" a=2. Result: 2 * 5 = 10.',
                    data: { a: 2, b: 5, result: 10 },
                    highlight: 'execution',
                    output: '10'
                },
                {
                    line: 12,
                    description: 'Calling triple(5) uses the "fixed" a=3. Result: 3 * 5 = 15.',
                    data: { a: 3, b: 5, result: 15 },
                    highlight: 'execution',
                    output: '15'
                }
            ],
            explanation: 'Partial application fixes some arguments, creating specialized versions of a function.'
        },
        {
            title: 'Real-World: Logger',
            code: `const logger = (level) => (message) => (time) => {
  return \`[\${time}] [\${level}] \${message}\`;
};

const infoLog = logger('INFO');
const errorLog = logger('ERROR');

console.log(infoLog('App Started')('10:00 AM'));
console.log(errorLog('DB Error')('10:05 AM'));`,
            steps: [
                {
                    line: 5,
                    description: 'Create infoLog by currying the logger with "INFO".',
                    data: { level: 'INFO' },
                    highlight: 'curry'
                },
                {
                    line: 6,
                    description: 'Create errorLog by currying the logger with "ERROR".',
                    data: { level: 'ERROR' },
                    highlight: 'curry'
                },
                {
                    line: 8,
                    description: 'Use the specialized infoLog. Pass message then time.',
                    data: { level: 'INFO', msg: 'App Started', time: '10:00 AM' },
                    highlight: 'execution',
                    output: '[10:00 AM] [INFO] App Started'
                }
            ],
            explanation: 'Currying is excellent for configuration and reducing repetitive arguments.'
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
                            <Split className="text-pink-400" size={40} />
                            <h1 className="text-3xl font-bold">Currying</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Sequence of single-argument functions.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-pink-400" size={22} />
                            <h3 className="text-base font-bold text-pink-400 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "Currying is transforming a function with multiple arguments into nested functions that each take one argument."
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-purple-400" size={22} />
                            <h3 className="text-base font-bold text-purple-400 uppercase">Simple Explanation</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            Like ordering a complex coffee: first you pick the size, then the bean, then the milk. Each step returns a new state of your order.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-blue-400" size={22} />
                            <h3 className="text-base font-bold text-blue-400 uppercase">Benefits</h3>
                        </div>
                        <ul className="space-y-3 text-slate-200 text-base">
                            <li className="flex items-start gap-2">
                                <span className="text-pink-400 mt-1">•</span>
                                <div><strong className="text-pink-400">Reusability:</strong> Create specialized functions.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">•</span>
                                <div><strong className="text-purple-400">Partial App:</strong> Fix arguments early.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">•</span>
                                <div><strong className="text-blue-400">Readability:</strong> Clearer logic paths.</div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase">Pro Tip</h4>
                        <p className="text-slate-400 text-xs">
                            It relies on Closures! Each nested function "remembers" the arguments from its parent functions.
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
                    <div className="bg-slate-900/50 flex flex-col" style={{ height: '35vh' }}>
                        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-700 bg-slate-900">
                            <Code className="text-pink-400" size={20} />
                            <h3 className="text-lg font-bold">Currying in Action</h3>
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
                                            backgroundColor: isCurrentLine ? 'rgba(236, 72, 153, 0.15)' : undefined,
                                            borderLeft: isCurrentLine ? '3px solid #ec4899' : '3px solid transparent',
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
                                <h3 className="text-xl font-bold">Step-by-Step Visualization</h3>
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
                                        <button onClick={handleNext} disabled={currentStep === currentEx.steps.length - 1} className="p-3 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 rounded-lg transition-colors">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Current Step Display */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-slate-950/50 rounded-xl p-6 border-2 border-slate-700">
                                        <p className="text-lg text-slate-100 leading-relaxed">{currentStepData.description}</p>
                                    </div>

                                    {/* Data Visualization */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-slate-950 rounded-xl p-6 border border-pink-500/30">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Layers className="text-pink-400" size={20} />
                                                <h4 className="text-base font-semibold text-pink-400">Captured Arguments</h4>
                                            </div>
                                            <div className="space-y-2">
                                                {Object.entries(currentStepData.data).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between items-center bg-slate-900 px-3 py-2 rounded border border-slate-800">
                                                        <span className="text-xs text-slate-500 font-mono uppercase tracking-tighter">{key}</span>
                                                        <span className="text-sm text-pink-300 font-mono font-bold">{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {currentStepData.output && (
                                            <div className="bg-slate-950 rounded-xl p-6 border border-green-500/30 flex flex-col justify-center items-center">
                                                <div className="text-xs text-slate-500 mb-2 uppercase tracking-widest font-bold">Final Output</div>
                                                <div className="text-3xl font-mono text-green-400 font-bold drop-shadow-lg">
                                                    {currentStepData.output}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 p-5 bg-pink-500/10 rounded-xl border-2 border-pink-500/30">
                                        <h4 className="text-base font-semibold text-pink-400 mb-2 flex items-center gap-2">
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

export default CurryingVisualizer;
