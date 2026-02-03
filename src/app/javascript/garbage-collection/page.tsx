'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers, Cpu, Database } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const GarbageCollectionVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Mark & Sweep',
            code: `let user = { name: 'Parth' }; // Root → User
let admin = user;             // Root → Admin → User

user = null;  // Still reachable via admin
admin = null; // Unreachable! Sweep!`,
            steps: [
                {
                    line: 1,
                    description: 'The "user" variable points to an object in the heap. It is a "Root".',
                    data: { heap: ['Object {name: "Parth"}'], roots: ['user'] },
                    highlight: 'setup'
                },
                {
                    line: 2,
                    description: 'Now two variables point to the same memory address.',
                    data: { heap: ['Object {name: "Parth"}'], roots: ['user', 'admin'] },
                    highlight: 'setup'
                },
                {
                    line: 4,
                    description: 'Setting user to null. The object is STILL reachable through "admin".',
                    data: { heap: ['Object {name: "Parth"}'], roots: ['admin'] },
                    highlight: 'process'
                },
                {
                    line: 5,
                    description: 'Setting admin to null. The object is now UNREACHABLE from any root.',
                    data: { heap: ['Object {name: "Parth"}'], roots: [], status: 'MARKED_FOR_SWEEP' },
                    highlight: 'unreachable',
                    output: 'Unreachable'
                },
                {
                    line: 5,
                    description: 'The Garbage Collector clears the memory during the next sweep cycle.',
                    data: { heap: [], roots: [], freed: '8 bytes' },
                    highlight: 'gc',
                    output: 'Collected'
                }
            ],
            explanation: 'Modern GC starts from roots (global, stack) and marks everything reachable. Anything unmarked is swept away.'
        },
        {
            title: 'Circular References',
            code: `function marry(man, woman) {
  man.wife = woman;
  woman.husband = man;
  return { man, woman };
}

let family = marry({name: "John"}, {name: "Ann"});
family = null; // Whole island is unreachable`,
            steps: [
                {
                    line: 8,
                    description: 'We have a circular connection between John and Ann.',
                    data: { island: 'John <--> Ann', root: 'family' },
                    highlight: 'circular'
                },
                {
                    line: 9,
                    description: 'Setting family to null. Though John and Ann point to each other, NOTHING points to them from outside.',
                    data: { island: 'John <--> Ann', root: null },
                    highlight: 'unreachable'
                },
                {
                    line: 9,
                    description: 'Because the "island" is unreachable from the Global Root, GC clears everything.',
                    data: { freed: 'Both objects' },
                    highlight: 'gc',
                    output: 'Cleaned'
                }
            ],
            explanation: 'Old "Reference Counting" would fail here (ref count is 1), but modern JS "Mark-and-Sweep" handles circularities perfectly.'
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
                            <Trash2 className="text-rose-500" size={40} />
                            <h1 className="text-3xl font-bold font-heading uppercase tracking-tighter">Garbage</h1>
                        </div>
                        <p className="text-slate-400 text-sm italic">
                            Automatic memory management.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-rose-400" size={22} />
                            <h3 className="text-base font-bold text-rose-500 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed">
                            "JS uses an automatic memory management system called Garbage Collection. Its primary algorithm is Mark-and-Sweep, which determines reachability from the Root objects (Global scope, call stack, etc)."
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Cpu className="text-blue-400" size={22} />
                            <h3 className="text-base font-bold text-blue-400 uppercase">How It Works</h3>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed">
                            1. **Mark Phase**: Traverses all objects from the root and marks them as 'reachable'. <br />
                            2. **Sweep Phase**: Reclaims memory from all unmarked objects.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-yellow-400" size={22} />
                            <h3 className="text-base font-bold text-yellow-400 uppercase">Common Leaks</h3>
                        </div>
                        <ul className="space-y-2 text-slate-200 text-xs">
                            <li className="flex items-start gap-2">• Global Variables (accidental)</li>
                            <li className="flex items-start gap-2">• Forgotten setInterval()</li>
                            <li className="flex items-start gap-2">• Detached DOM nodes</li>
                            <li className="flex items-start gap-2">• Unremoved Event Listeners</li>
                        </ul>
                    </div>

                    <div className="bg-rose-500/10 rounded-xl p-4 border border-rose-500/20">
                        <h4 className="text-[10px] font-bold text-rose-400 mb-2 uppercase tracking-widest">Performance</h4>
                        <p className="text-slate-400 text-xs">
                            GC pauses execution (Stop-the-world). Modern engines use Incremental GC to minimize lag.
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
                                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30 font-bold'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 font-normal'
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
                            <h3 className="text-lg font-bold">Memory Ops</h3>
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
                                <h3 className="text-xl font-bold tracking-tight text-rose-500 flex items-center gap-2">
                                    <Database size={20} /> Heap Visualizer
                                </h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400 text-base font-mono bg-black/20 px-3 py-1 rounded">
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
                                    <div className="bg-slate-950/80 rounded-2xl p-6 border-l-4 border-rose-600 shadow-2xl">
                                        <p className="text-lg text-slate-100 leading-relaxed font-heading">{currentStepData.description}</p>
                                    </div>

                                    {/* Visual Representation of Heap and Roots */}
                                    <div className="flex-1 bg-slate-950 p-8 rounded-[40px] border border-slate-800 relative shadow-inner flex gap-12">

                                        {/* Roots Column */}
                                        <div className="flex flex-col gap-6 w-1/3">
                                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center px-4 py-1 bg-slate-900 rounded-full border border-slate-800">Roots (Stack/Global)</h4>
                                            <div className="flex-1 flex flex-col gap-4 justify-center">
                                                {['user', 'admin', 'family'].map((r) => {
                                                    const isActive = (currentStepData.data as any).roots?.includes(r) || (currentStepData.data as any).root === r;
                                                    return (
                                                        <motion.div
                                                            key={r}
                                                            animate={{
                                                                opacity: isActive ? 1 : 0.2,
                                                                scale: isActive ? 1 : 0.9,
                                                                x: isActive ? 10 : 0
                                                            }}
                                                            className={`p-4 rounded-xl border-2 font-mono text-sm flex items-center justify-between ${isActive ? 'border-blue-500 bg-blue-500/10 text-blue-200' : 'border-slate-800 bg-slate-900 text-slate-600'
                                                                }`}
                                                        >
                                                            <span>{r}</span>
                                                            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-blue-400 animate-pulse' : 'bg-slate-800'}`} />
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Heap Column */}
                                        <div className="flex-1 flex flex-col gap-6">
                                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center px-4 py-1 bg-slate-900 rounded-full border border-slate-800">Managed Heap</h4>
                                            <div className="flex-1 border-2 border-dashed border-slate-800 rounded-3xl relative p-8 flex items-center justify-center">

                                                <AnimatePresence>
                                                    {((currentStepData.data as any).heap?.length > 0 || (currentStepData.data as any).island) && (
                                                        <motion.div
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{
                                                                scale: 1,
                                                                opacity: 1,
                                                                backgroundColor: (currentStepData.data as any).status === 'MARKED_FOR_SWEEP' ? 'rgba(225, 29, 72, 0.4)' : 'rgba(34, 197, 94, 0.1)'
                                                            }}
                                                            exit={{ scale: 1.5, opacity: 0, filter: 'blur(20px)' }}
                                                            transition={{ duration: 0.5 }}
                                                            className="w-48 h-48 rounded-[3rem] border-4 border-rose-500 flex flex-col items-center justify-center p-6 text-center shadow-[0_0_50px_rgba(225,29,72,0.2)]"
                                                        >
                                                            <div className="text-[10px] text-rose-300 font-bold uppercase mb-2">Memory Block</div>
                                                            <span className="text-white font-mono text-xs">{(currentStepData.data as any).island || (currentStepData.data as any).heap[0]}</span>
                                                            {(currentStepData.data as any).status === 'MARKED_FOR_SWEEP' && (
                                                                <motion.div
                                                                    animate={{ opacity: [1, 0, 1] }}
                                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                                    className="mt-4 px-2 py-1 bg-red-600 rounded text-[10px] font-bold"
                                                                >
                                                                    UNREACHABLE
                                                                </motion.div>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Labels */}
                                                {currentStepData.output && (
                                                    <motion.div
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        className="absolute bottom-8 right-8 bg-black/60 px-4 py-2 rounded-lg border border-rose-500 text-rose-500 font-bold text-sm tracking-widest uppercase shadow-2xl"
                                                    >
                                                        {currentStepData.output}
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="p-5 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                        <h4 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                                            <Lightbulb size={18} /> Engine Wisdom
                                        </h4>
                                        <p className="text-slate-400 text-sm leading-relaxed italic">{currentEx.explanation}</p>
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

export default GarbageCollectionVisualizer;
