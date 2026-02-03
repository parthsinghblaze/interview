'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers, PauseCircle, PlayCircle } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const GeneratorsVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Basic Yield',
            code: `function* myGen() {
  yield 'Step 1';
  yield 'Step 2';
  return 'Finished';
}

const gen = myGen();
console.log(gen.next()); // { value: 'Step 1', done: false }`,
            steps: [
                {
                    line: 1,
                    description: 'Declaring a generator function with the * syntax.',
                    data: { type: 'GeneratorFunction', state: 'Ready' },
                    highlight: 'definition'
                },
                {
                    line: 7,
                    description: 'Calling the function returns an iterator (gen), but code DOES NOT run yet.',
                    data: { state: 'Suspended (Start)' },
                    highlight: 'create'
                },
                {
                    line: 2,
                    description: 'First next() runs to the first yield. The value "Step 1" is sent out.',
                    data: { yieldValue: 'Step 1', done: false },
                    highlight: 'yield',
                    output: "{ value: 'Step 1', done: false }"
                }
            ],
            explanation: 'Generators can pause execution. yield sends a value out and suspends the function.'
        },
        {
            title: 'Infinite ID Gen',
            code: `function* idMaker() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const gen = idMaker();`,
            steps: [
                {
                    line: 2,
                    description: 'Initialize a local variable "id".',
                    data: { id: 1 },
                    highlight: 'init'
                },
                {
                    line: 4,
                    description: 'Yield the current ID and increment. The while(true) is safe because we pause!',
                    data: { yielded: 1, nextId: 2 },
                    highlight: 'yield',
                    output: '1'
                },
                {
                    line: 4,
                    description: 'Calling next() again resumes precisely where it left off.',
                    data: { yielded: 2, nextId: 3 },
                    highlight: 'yield',
                    output: '2'
                }
            ],
            explanation: 'Generators are perfect for lazy sequences. They only compute the next value when requested.'
        },
        {
            title: 'Two-Way Comms',
            code: `function* chat() {
  const reply = yield 'Pick a color';
  return \`You picked \${reply}\`;
}

const g = chat();
g.next(); // Ask
g.next('Blue'); // Answer`,
            steps: [
                {
                    line: 2,
                    description: 'First next() yields the question to the caller.',
                    data: { out: 'Pick a color' },
                    highlight: 'yield',
                    output: 'Pick a color'
                },
                {
                    line: 8,
                    description: 'next("Blue") sends "Blue" BACK into the generator. It becomes the result of yield!',
                    data: { input: 'Blue', assignedTo: 'reply' },
                    highlight: 'input'
                },
                {
                    line: 3,
                    description: 'The function finishes with a return value.',
                    data: { final: 'You picked Blue', done: true },
                    highlight: 'return',
                    output: 'You picked Blue'
                }
            ],
            explanation: 'yield sends data OUT. next(value) sends data IN. This enables complex async flows.'
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
                            <PlayCircle className="text-rose-400" size={40} />
                            <h1 className="text-3xl font-bold font-heading">Generators</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Functions that pause and resume.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-rose-400" size={22} />
                            <h3 className="text-base font-bold text-rose-400 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "Generators are a special class of functions that can be exited and later re-entered. Their context (variable bindings) is saved across re-entrancies."
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-pink-400" size={22} />
                            <h3 className="text-base font-bold text-pink-400 uppercase">Simple Explanation</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            Think of a normal function as a 100m sprint. A generator is a hike where you can stop to take a photo (yield), set down your pack, and continue later.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-purple-400" size={22} />
                            <h3 className="text-base font-bold text-purple-400 uppercase">Key Syntax</h3>
                        </div>
                        <ul className="space-y-3 text-slate-200 text-base">
                            <li className="flex items-start gap-2">
                                <span className="text-rose-400 mt-1">🏷️</span>
                                <div><strong className="text-rose-400">function*:</strong> The asterisk defines it.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-pink-400 mt-1">⏸️</span>
                                <div><strong className="text-pink-400">yield:</strong> Pauses and sends a value out.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">▶️</span>
                                <div><strong className="text-purple-400">next():</strong> Resumes the execution.</div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase">Protocol</h4>
                        <p className="text-slate-400 text-[10px] uppercase tracking-wider">
                            Value: Result | Done: Boolean
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
                                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30'
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
                            <Code className="text-rose-400" size={20} />
                            <h3 className="text-lg font-bold">Generator Lifecycle</h3>
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
                                            backgroundColor: isCurrentLine ? 'rgba(225, 29, 72, 0.15)' : undefined,
                                            borderLeft: isCurrentLine ? '3px solid #e11d48' : '3px solid transparent',
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
                                <h3 className="text-xl font-bold tracking-tight text-rose-400">Execution Timeline</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400 text-base font-mono bg-slate-950 px-3 py-1 rounded">
                                        Step {currentStep + 1}/{currentEx.steps.length}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={handleReset} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
                                            <RotateCcw size={20} />
                                        </button>
                                        <button onClick={handlePrevious} disabled={currentStep === 0} className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors border border-slate-700">
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button onClick={handleNext} disabled={currentStep === currentEx.steps.length - 1} className="p-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 rounded-lg transition-colors shadow-lg shadow-rose-500/20">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Current Step Display */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentExample + '-' + currentStep}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6 flex-1 flex flex-col"
                                >
                                    <div className="bg-slate-950/80 rounded-2xl p-6 border-2 border-slate-800 shadow-2xl">
                                        <p className="text-lg text-slate-100 leading-relaxed font-heading">{currentStepData.description}</p>
                                    </div>

                                    {/* Generator State Visualization */}
                                    <div className="flex-1 bg-slate-950 p-8 rounded-3xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">

                                        <div className="flex items-center gap-16 relative z-10">
                                            {/* Generator Object */}
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Generator (gen.next())</div>
                                                <motion.div
                                                    animate={{
                                                        scale: currentStepData.highlight === 'yield' || currentStepData.highlight === 'input' ? 1.1 : 1,
                                                        rotateY: currentStepData.highlight === 'yield' ? 180 : 0
                                                    }}
                                                    className="w-32 h-32 bg-rose-600 rounded-3xl flex items-center justify-center shadow-2xl relative"
                                                >
                                                    {currentStepData.highlight === 'yield' ? <PauseCircle size={48} className="rotate-180" /> : <PlayCircle size={48} />}
                                                </motion.div>
                                            </div>

                                            {/* Value Stream */}
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="h-0.5 w-32 bg-slate-800 relative">
                                                    <motion.div
                                                        animate={{
                                                            left: currentStepData.highlight === 'yield' ? '100%' : '0%',
                                                            opacity: currentStepData.highlight === 'yield' ? 1 : 0
                                                        }}
                                                        className="absolute -top-1.5 w-4 h-4 rounded-full bg-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.8)]"
                                                    />
                                                </div>
                                                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em]">{currentStepData.highlight === 'yield' ? 'Yielding' : 'Waiting'}</div>
                                            </div>

                                            {/* Result Object */}
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Yielded Value</div>
                                                <motion.div
                                                    animate={{
                                                        borderColor: currentStepData.output ? '#f43f5e' : '#334155'
                                                    }}
                                                    className="w-48 h-24 bg-slate-900 rounded-2xl border-2 flex items-center justify-center p-4 text-center shadow-inner"
                                                >
                                                    {currentStepData.output ? (
                                                        <span className="font-mono text-rose-400 font-bold text-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
                                                            {currentStepData.output}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-700 text-xs italic">Awaiting call...</span>
                                                    )}
                                                </motion.div>
                                            </div>
                                        </div>

                                        {/* State Inspection Stack */}
                                        <div className="mt-12 w-full max-w-sm bg-slate-900/50 rounded-xl border border-slate-800 p-4">
                                            <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
                                                <span className="text-[10px] uppercase font-bold text-slate-500">Iterator Context</span>
                                                <Layers size={14} className="text-rose-400" />
                                            </div>
                                            <div className="space-y-2">
                                                {Object.entries(currentStepData.data).map(([k, v]) => (
                                                    <div key={k} className="flex justify-between text-xs font-mono">
                                                        <span className="text-slate-600">{k}:</span>
                                                        <span className="text-rose-300">{String(v)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-rose-500/10 rounded-xl border border-rose-500/20">
                                        <h4 className="text-sm font-bold text-rose-400 mb-1 flex items-center gap-2">
                                            <AlertCircle size={16} /> Pro Tip
                                        </h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">{currentEx.explanation}</p>
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

export default GeneratorsVisualizer;
