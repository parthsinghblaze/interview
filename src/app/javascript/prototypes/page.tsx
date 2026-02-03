'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Link2, Users } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const PrototypesVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Prototype Chain',
            code: `const person = { name: 'John' };

// Search for toString():
// 1. Check person {}
// 2. Check person.__proto__ (Object.prototype)
// 3. Find toString() in Object.prototype!

console.log(person.toString());`,
            steps: [
                {
                    line: 1,
                    description: 'Start with a simple object. JS automatically links it to Object.prototype.',
                    data: { object: 'person', properties: ['name'], proto: 'Object.prototype' },
                    highlight: 'object'
                },
                {
                    line: 4,
                    description: 'Looking for "toString". Step 1: Check the object itself. Not found.',
                    data: { searching: 'toString', location: 'person', found: false },
                    highlight: 'searching'
                },
                {
                    line: 5,
                    description: 'Step 2: Follow the __proto__ link to Object.prototype.',
                    data: { searching: 'toString', location: 'Object.prototype', found: 'Checking...' },
                    highlight: 'link'
                },
                {
                    line: 6,
                    description: 'Step 3: Found in Object.prototype! The chain search stops here.',
                    data: { searching: 'toString', location: 'Object.prototype', found: true },
                    highlight: 'found',
                    output: "'[object Object]'"
                }
            ],
            explanation: 'JavaScript searches up the prototype chain until it finds the property or reaches null.'
        },
        {
            title: 'Shared Methods',
            code: `function User(name) {
  this.name = name;
}

// Fixed once in memory
User.prototype.greet = function() {
  return "Hi, I'm " + this.name;
};

const user1 = new User('Alice');
const user2 = new User('Bob');

console.log(user1.greet === user2.greet); // true`,
            steps: [
                {
                    line: 6,
                    description: 'Methods on .prototype are SHARED. They exist once in memory.',
                    data: { memory: '1 function icon' },
                    highlight: 'proto'
                },
                {
                    line: 10,
                    description: 'user1 and user2 both point to the SAME greet function via __proto__.',
                    data: { user1_proto: 'User.prototype', user2_proto: 'User.prototype' },
                    highlight: 'shared'
                },
                {
                    line: 13,
                    description: 'Identity check returns true. Memory efficient!',
                    data: { equality: true },
                    highlight: 'check',
                    output: 'true'
                }
            ],
            explanation: 'Attaching methods to the prototype is much more efficient than recreating them in the constructor.'
        },
        {
            title: '__proto__ vs prototype',
            code: `function Person() {}

const p = new Person();

console.log(p.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true`,
            steps: [
                {
                    line: 3,
                    description: "p.__proto__ is the actual link used for searching.",
                    data: { object: 'p', link: 'Person.prototype' },
                    highlight: 'link'
                },
                {
                    line: 1,
                    description: "Person.prototype is the 'blueprint' object for new instances.",
                    data: { function: 'Person', blueprint: 'Person.prototype' },
                    highlight: 'proto'
                }
            ],
            explanation: '__proto__ is the link on EVERY object. .prototype is ONLY on functions.'
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
                            <Layers className="text-purple-400" size={40} />
                            <h1 className="text-3xl font-bold">Prototypes</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            The backbone of inheritance in JavaScript.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-purple-400" size={22} />
                            <h3 className="text-base font-bold text-purple-400 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "Prototypes are objects from which other objects inherit properties. Every object has a hidden [[Prototype]] property, usually accessible via __proto__."
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-blue-400" size={22} />
                            <h3 className="text-base font-bold text-blue-400 uppercase">Simple Explanation</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            Think of it as a "backup object". If JS can't find a property on your object, it looks in the backup (prototype) and keeps going up the chain.
                        </p>
                    </div>

                    {/* Key Distinction */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-pink-400" size={22} />
                            <h3 className="text-base font-bold text-pink-400 uppercase">The Chain</h3>
                        </div>
                        <ul className="space-y-4 text-slate-200 text-sm">
                            <li className="flex items-start gap-2">
                                <div className="p-1 bg-slate-800 rounded">1.</div>
                                <div><strong className="text-pink-400">Object Instance:</strong> Check local props.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="p-1 bg-slate-800 rounded">2.</div>
                                <div><strong className="text-pink-400">Prototype:</strong> Check parent methods.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="p-1 bg-slate-800 rounded">3.</div>
                                <div><strong className="text-pink-400">Object.prototype:</strong> The ultimate base.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="p-1 bg-slate-800 rounded">4.</div>
                                <div><strong className="text-pink-400 text-xs">null:</strong> Search stops here.</div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase">__proto__ vs .prototype</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Link2 size={12} className="text-blue-400" />
                                <span className="text-[10px] text-slate-300">__proto__: Link on ALL objects</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={12} className="text-purple-400" />
                                <span className="text-[10px] text-slate-300">.prototype: Blueprint on FUNCTIONS</span>
                            </div>
                        </div>
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
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
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
                            <Code className="text-purple-400" size={20} />
                            <h3 className="text-lg font-bold">Prototype Logic</h3>
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
                                    lineHeight: '1.6',
                                    backgroundColor: 'transparent'
                                }}
                                lineProps={(lineNumber: number) => {
                                    const isCurrentLine = lineNumber === currentStepData.line;
                                    return {
                                        style: {
                                            backgroundColor: isCurrentLine ? 'rgba(168, 85, 247, 0.15)' : undefined,
                                            borderLeft: isCurrentLine ? '3px solid #a855f7' : '3px solid transparent',
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
                                <h3 className="text-xl font-bold tracking-tight">Inheritance Inspector</h3>
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
                                        <button onClick={handleNext} disabled={currentStep === currentEx.steps.length - 1} className="p-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg transition-colors">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Current Step Display */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6 flex-1 flex flex-col"
                                >
                                    <div className="bg-slate-950/50 rounded-xl p-6 border-2 border-slate-700">
                                        <p className="text-lg text-slate-100 leading-relaxed">{currentStepData.description}</p>
                                    </div>

                                    {/* Visual Chain Diagram */}
                                    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8 bg-slate-950/30 rounded-2xl border border-dashed border-slate-700 overflow-hidden relative">

                                        <div className="flex flex-col items-center gap-4">
                                            {/* Instance */}
                                            <motion.div
                                                animate={{ scale: currentStepData.highlight === 'object' ? 1.05 : 1 }}
                                                className={`w-48 p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${currentStepData.highlight === 'object' ? 'border-purple-400 bg-purple-400/10 shadow-lg shadow-purple-500/20' : 'border-slate-700 bg-slate-900'}`}
                                            >
                                                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Object Instance</div>
                                                <div className="text-sm font-bold truncate px-2">{currentEx.title === 'Prototype Chain' ? 'person' : 'user1'}</div>
                                            </motion.div>

                                            <div className="w-0.5 h-8 bg-slate-700 relative">
                                                <ChevronRight className="rotate-90 absolute -bottom-2 -left-[7px] text-slate-700" size={16} />
                                            </div>

                                            {/* Prototype */}
                                            <motion.div
                                                animate={{ scale: currentStepData.highlight === 'proto' || currentStepData.highlight === 'link' ? 1.05 : 1 }}
                                                className={`w-48 p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${currentStepData.highlight === 'proto' || currentStepData.highlight === 'link' ? 'border-purple-400 bg-purple-400/10 shadow-lg shadow-purple-500/20' : 'border-slate-700 bg-slate-900 font-mono'}`}
                                            >
                                                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Prototype</div>
                                                <div className="text-xs font-bold">{currentEx.title === 'Prototype Chain' ? 'Object.prototype' : 'User.prototype'}</div>
                                            </motion.div>

                                            <div className="w-0.5 h-8 bg-slate-700 relative">
                                                <ChevronRight className="rotate-90 absolute -bottom-2 -left-[7px] text-slate-700" size={16} />
                                            </div>

                                            {/* Base / Null */}
                                            <div className="w-48 p-4 rounded-xl border-2 border-slate-700 bg-slate-900 flex flex-col items-center gap-2 opacity-40">
                                                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Base</div>
                                                <div className="text-xs font-bold">{currentEx.title === 'Prototype Chain' ? 'null' : 'Object.prototype'}</div>
                                            </div>
                                        </div>

                                        {/* Searching Overlay */}
                                        {currentStepData.highlight === 'searching' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute top-4 right-4 bg-orange-500/20 border border-orange-500/50 p-3 rounded-lg flex items-center gap-3"
                                            >
                                                <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                                                <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Searching Property...</span>
                                            </motion.div>
                                        )}

                                        {(currentStepData as any).output && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="mt-8 bg-green-500/20 border-2 border-green-500 py-3 px-8 rounded-full font-mono text-green-400 shadow-xl"
                                            >
                                                Found! Result: {(currentStepData as any).output}
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                        <h4 className="text-xs font-bold text-purple-400 mb-2 uppercase flex items-center gap-2">
                                            <span>💡</span> Deep Dive
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

export default PrototypesVisualizer;
