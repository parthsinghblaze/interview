'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers, Fingerprint, Search } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MapSetVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Map: Object Keys',
            code: `const map = new Map();
const user = { id: 1 };

map.set(user, 'Admin');
console.log(map.get(user)); // 'Admin'`,
            steps: [
                {
                    line: 1,
                    description: 'Creating a new Map instance.',
                    data: { type: 'Map', size: 0 },
                    highlight: 'create'
                },
                {
                    line: 2,
                    description: 'In an Object, keys must be strings. Map allows anything, even an actual OBJECT.',
                    data: { userObj: '{ id: 1 }' },
                    highlight: 'setup'
                },
                {
                    line: 4,
                    description: 'Setting a value using the user object as the key.',
                    data: { key: 'Reference to UserObj', value: 'Admin' },
                    highlight: 'set'
                },
                {
                    line: 5,
                    description: 'Retrieve the value. It works because the reference is the same.',
                    data: { result: 'Admin' },
                    highlight: 'get',
                    output: 'Admin'
                }
            ],
            explanation: 'Maps allow keys of any type, maintain insertion order, and have better performance for frequent additions/removals.'
        },
        {
            title: 'Set: Uniqueness',
            code: `const set = new Set([1, 2, 2, 3]);

set.add(4);
set.add(1); // Ignored
console.log(set.size); // 4`,
            steps: [
                {
                    line: 1,
                    description: 'Initializing a Set with an array. Duplicates (the second 2) are removed instantly.',
                    data: { input: [1, 2, 2, 3], internal: [1, 2, 3] },
                    highlight: 'create'
                },
                {
                    line: 3,
                    description: 'Adding a new value 4.',
                    data: { items: [1, 2, 3, 4] },
                    highlight: 'add'
                },
                {
                    line: 4,
                    description: 'Adding 1 again. Sets automatically enforce uniqueness.',
                    data: { items: [1, 2, 3, 4], duplicate: 'Blocked' },
                    highlight: 'add',
                    output: 'Blocked'
                }
            ],
            explanation: 'Sets are collections of unique values. They are highly efficient for checking if an item exists (O(1)).'
        },
        {
            title: 'WeakMap: Caching',
            code: `let obj = { data: 'heavy' };
const cache = new WeakMap();

cache.set(obj, 'processed_result');
obj = null; // Object + Cache both GC'd`,
            steps: [
                {
                    line: 1,
                    description: 'Creating an object we want to cache data for.',
                    data: { obj: 'Ref A' },
                    highlight: 'setup'
                },
                {
                    line: 4,
                    description: 'Storing data in a WeakMap with the object as a key. This is a WEAK reference.',
                    data: { cache: '{ Ref A -> "processed" }' },
                    highlight: 'set'
                },
                {
                    line: 5,
                    description: 'Nullifying the variable. Because the Map reference is weak, the object CAN be garbage collected.',
                    data: { obj: null, cache: 'Cleaned automatically' },
                    highlight: 'gc',
                    output: 'Memory Freed'
                }
            ],
            explanation: 'WeakMap only allows objects as keys and doesn\'t prevent garbage collection if the key is the only reference left.'
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
                            <Database className="text-teal-400" size={40} />
                            <h1 className="text-3xl font-bold font-heading">Map & Set</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Advanced collections for modern JS.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-teal-400" size={22} />
                            <h3 className="text-base font-bold text-teal-400 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "Map is a collection of keyed data items, similar to an Object but allowing any type of keys. Set is a collection of unique values where each value may occur only once."
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Fingerprint className="text-cyan-400" size={22} />
                            <h3 className="text-base font-bold text-cyan-400 uppercase">Key Benefits</h3>
                        </div>
                        <ul className="space-y-3 text-slate-200 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-teal-400 font-bold">•</span>
                                <div><strong className="text-teal-400">Map vs Object:</strong> Maps preserve order and sizes are easier to get.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 font-bold">•</span>
                                <div><strong className="text-cyan-400">Set vs Array:</strong> Checking for existence in a Set is extremely fast (O(1)).</div>
                            </li>
                        </ul>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Search className="text-purple-400" size={22} />
                            <h3 className="text-base font-bold text-purple-400 uppercase">Weak Variations</h3>
                        </div>
                        <p className="text-slate-200 text-xs leading-relaxed italic">
                            WeakMap/WeakSet use weak references, meaning they don't block the Garbage Collector from deleting items if they are no longer in use.
                        </p>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-widest">Performance</h4>
                        <p className="text-slate-400 text-xs">
                            Use Map for large datasets and frequent updates. Use Set for unique IDs/tags lists.
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
                                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30'
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
                            <Code className="text-teal-400" size={20} />
                            <h3 className="text-lg font-bold">Data Management</h3>
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
                                            backgroundColor: isCurrentLine ? 'rgba(20, 184, 166, 0.15)' : undefined,
                                            borderLeft: isCurrentLine ? '3px solid #14b8a6' : '3px solid transparent',
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
                                <h3 className="text-xl font-bold tracking-tight text-teal-400">Memory Structure</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400 text-sm font-mono bg-slate-950 px-3 py-1 rounded-full">
                                        Step {currentStep + 1}/{currentEx.steps.length}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={handleReset} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700">
                                            <RotateCcw size={20} />
                                        </button>
                                        <button onClick={handlePrevious} disabled={currentStep === 0} className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors border border-slate-700">
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button onClick={handleNext} disabled={currentStep === currentEx.steps.length - 1} className="p-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 rounded-lg transition-colors shadow-lg shadow-teal-500/20">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Current Step Display */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentExample + '-' + currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6 flex-1 flex flex-col"
                                >
                                    <div className="bg-slate-950/80 rounded-2xl p-6 border-2 border-slate-800 shadow-2xl">
                                        <p className="text-lg text-slate-100 leading-relaxed font-heading">{currentStepData.description}</p>
                                    </div>

                                    {/* Visual Representation */}
                                    <div className="flex-1 bg-slate-950 p-8 rounded-[40px] border border-slate-800 relative shadow-inner flex flex-col items-center justify-center overflow-hidden">

                                        {/* Container Ring */}
                                        <motion.div
                                            animate={{
                                                borderColor: currentStepData.highlight === 'create' ? '#14b8a6' : '#334155',
                                                scale: currentStepData.highlight === 'create' ? 1.05 : 1
                                            }}
                                            className="w-full max-w-2xl min-h-[300px] border-4 border-dashed rounded-[50px] flex flex-wrap gap-4 p-12 items-center justify-center relative bg-slate-900/40"
                                        >
                                            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em]">Storage Space</div>

                                            {/* Entity Visualization */}
                                            {(currentStepData.data as any).items?.map((item: any, i: number) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="w-20 h-20 bg-teal-500/20 border-2 border-teal-500/50 rounded-2xl flex items-center justify-center text-teal-400 font-bold font-mono text-xl shadow-lg shadow-teal-500/10"
                                                >
                                                    {item}
                                                </motion.div>
                                            ))}

                                            {(currentStepData.data as any).key && (
                                                <div className="flex items-center gap-6">
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="w-32 h-32 bg-cyan-500/10 border-2 border-cyan-500/50 rounded-full flex items-center justify-center text-[10px] font-bold text-cyan-400 p-4 text-center"
                                                    >
                                                        {(currentStepData.data as any).key}
                                                    </motion.div>
                                                    <ChevronRight className="text-slate-700" size={32} />
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="w-32 h-32 bg-teal-500/10 border-2 border-teal-500/50 rounded-3xl flex items-center justify-center text-xl font-bold text-teal-400 font-mono"
                                                    >
                                                        {(currentStepData.data as any).value}
                                                    </motion.div>
                                                </div>
                                            )}

                                            {/* Empty State */}
                                            {(!(currentStepData.data as any).items && !(currentStepData.data as any).key) && (
                                                <div className="text-slate-700 italic text-sm">Waiting for data...</div>
                                            )}

                                            {/* Status Overlay */}
                                            {currentStepData.output && (
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    className="absolute -bottom-4 bg-teal-600 text-white px-6 py-2 rounded-full font-bold text-sm shadow-xl"
                                                >
                                                    {currentStepData.output}
                                                </motion.div>
                                            )}
                                        </motion.div>

                                        {/* State Inspection Table */}
                                        <div className="mt-8 w-full max-w-md bg-slate-900 rounded-xl border border-slate-800 p-4 overflow-hidden">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase">System Context</span>
                                                <Layers size={14} className="text-teal-400" />
                                            </div>
                                            <div className="space-y-1">
                                                {Object.entries(currentStepData.data).map(([k, v]) => (
                                                    <div key={k} className="flex justify-between text-[11px] font-mono">
                                                        <span className="text-slate-600">{k}:</span>
                                                        <span className="text-teal-300 truncate max-w-[250px]">{String(v)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-teal-500/10 rounded-xl border border-teal-500/20">
                                        <h4 className="text-xs font-bold text-teal-400 mb-1 flex items-center gap-2">
                                            <Lightbulb size={16} /> Data Architecture
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

export default MapSetVisualizer;
