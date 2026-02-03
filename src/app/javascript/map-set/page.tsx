'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Play, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MapSetVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Map: Key-Value Pairs (любой тип)',
            code: `// Objects can only have string/symbol keys
const obj = { '1': 'one' };

// Map can have ANY type as key!
const map = new Map();

map.set(1, 'number key');        // number key
map.set('1', 'string key');      // string key
map.set(true, 'boolean key');    // boolean key

console.log(map.get(1));    // 'number key'
console.log(map.get('1'));  // 'string key'
console.log(map.size);      // 3`,
            steps: [
                {
                    line: 2,
                    description: 'Objects convert all keys to strings',
                    data: { obj: { '1': 'one' }, keyType: 'string only' },
                    highlight: 'limitation',
                    output: 'Keys are always strings'
                },
                {
                    line: 5,
                    description: 'Create a new Map',
                    data: { map: 'empty Map', size: 0 },
                    highlight: 'create'
                },
                {
                    line: 7,
                    description: 'Add entry with NUMBER key (1)',
                    data: { key: 1, value: 'number key', type: 'number' },
                    highlight: 'set',
                    output: 'Number key allowed!'
                },
                {
                    line: 8,
                    description: 'Add entry with STRING key ("1") - different!',
                    data: { key: '1', value: 'string key', type: 'string' },
                    highlight: 'set',
                    output: 'Different from number 1'
                },
                {
                    line: 9,
                    description: 'Add entry with BOOLEAN key (true)',
                    data: { key: true, value: 'boolean key', type: 'boolean' },
                    highlight: 'set',
                    output: 'Boolean key works too!'
                },
                {
                    line: 11,
                    description: 'Retrieve value by NUMBER key 1',
                    data: { key: 1, value: 'number key' },
                    highlight: 'get',
                    output: 'number key'
                },
                {
                    line: 13,
                    description: 'map.size gives the count of entries',
                    data: { size: 3, entries: ['1→...', '"1"→...', 'true→...'] },
                    highlight: 'size',
                    output: '3'
                }
            ],
            explanation: 'Map allows ANY type as key (numbers, booleans, objects!). Objects only allow strings/symbols.'
        },
        {
            title: 'Set: Unique Values Only',
            code: `const set = new Set();

set.add(1);
set.add(2);
set.add(2); // Duplicate, ignored!
set.add(3);

console.log(set.size);      // 3 (not 4)
console.log(set.has(2));    // true
console.log(set.has(99));   // false

// Remove duplicates from array
const arr = [1, 2, 2, 3, 3, 3, 4];
const unique = [...new Set(arr)];
console.log(unique); // [1, 2, 3, 4]`,
            steps: [
                {
                    line: 1,
                    description: 'Create a new Set (collection of unique values)',
                    data: { set: '[]', size: 0 },
                    highlight: 'create'
                },
                {
                    line: 3,
                    description: 'Add 1 to the set',
                    data: { set: [1], size: 1 },
                    highlight: 'add',
                    output: 'Added 1'
                },
                {
                    line: 4,
                    description: 'Add 2 to the set',
                    data: { set: [1, 2], size: 2 },
                    highlight: 'add',
                    output: 'Added 2'
                },
                {
                    line: 5,
                    description: 'Try to add 2 again - IGNORED (already exists)',
                    data: { set: [1, 2], size: 2, duplicate: true },
                    highlight: 'duplicate',
                    output: 'Duplicate ignored'
                },
                {
                    line: 6,
                    description: 'Add 3 to the set',
                    data: { set: [1, 2, 3], size: 3 },
                    highlight: 'add',
                    output: 'Added 3'
                },
                {
                    line: 8,
                    description: 'set.size returns count of UNIQUE values',
                    data: { size: 3 },
                    highlight: 'size',
                    output: '3'
                },
                {
                    line: 14,
                    description: 'Use Set to remove duplicates from array!',
                    data: { arr: [1, 2, 2, 3, 3, 3, 4], unique: [1, 2, 3, 4] },
                    highlight: 'trick',
                    output: '[1, 2, 3, 4]'
                }
            ],
            explanation: 'Set stores only UNIQUE values. Perfect for removing duplicates or checking membership quickly!'
        },
        {
            title: 'WeakMap: Garbage Collection Friendly',
            code: `let user = { name: 'Parth' };

// Regular Map prevents garbage collection
const map = new Map();
map.set(user, 'some data');
user = null; // user object STAYS in memory (Map holds it)

// WeakMap allows garbage collection!
const weakMap = new WeakMap();
let person = { name: 'John' };
weakMap.set(person, 'metadata');
person = null; // person can be GC'd! ✅

// WeakMap has limited methods (no size, no iteration)`,
            steps: [
                {
                    line: 1,
                    description: 'Create an object',
                    data: { user: { name: 'Parth' } },
                    highlight: 'create'
                },
                {
                    line: 5,
                    description: 'Store in regular Map',
                    data: { map: '{ user → "some data" }', refs: 2 },
                    highlight: 'map'
                },
                {
                    line: 6,
                    description: 'Set user to null, but Map STILL holds reference',
                    data: { user: null, mapStillHas: true, canGC: false },
                    highlight: 'leak',
                    output: '⚠️ Memory NOT freed'
                },
                {
                    line: 9,
                    description: 'Create WeakMap instead',
                    data: { weakMap: 'empty', type: 'WeakMap' },
                    highlight: 'weakmap'
                },
                {
                    line: 11,
                    description: 'Store in WeakMap (WEAK reference)',
                    data: { weakMap: '{ person → "metadata" }', weak: true },
                    highlight: 'weakmap',
                    output: 'Weak reference'
                },
                {
                    line: 12,
                    description: 'Set person to null - can be garbage collected!',
                    data: { person: null, weakMapHas: 'weak ref only', canGC: true },
                    highlight: 'gc',
                    output: '✅ Memory CAN be freed'
                },
                {
                    line: 14,
                    description: 'WeakMap limitations: no size, forEach, or keys()',
                    data: {
                        methods: ['get', 'set', 'has', 'delete'],
                        noSize: true,
                        noIteration: true
                    },
                    highlight: 'limitation',
                    output: 'Limited methods'
                }
            ],
            explanation: 'WeakMap uses weak references. When the key object is no longer used elsewhere, it can be garbage collected. Great for caching/metadata!'
        },
        {
            title: 'Common Use Cases',
            code: `// Use Case 1: Map for object keys
const userRoles = new Map();
const admin = { name: 'Admin' };
const guest = { name: 'Guest' };
userRoles.set(admin, 'administrator');
userRoles.set(guest, 'viewer');

// Use Case 2: Set for unique tags
const tags = new Set();
tags.add('javascript');
tags.add('react');
tags.add('javascript'); // Ignored
console.log([...tags]); // ['javascript', 'react']

// Use Case 3: WeakMap for private data
const privateData = new WeakMap();
class User {
  constructor(name) {
    privateData.set(this, { password: 'secret' });
    this.name = name;
  }
  getPassword() {
    return privateData.get(this).password;
  }
}`,
            steps: [
                {
                    line: 2,
                    description: 'Use Map when you need object keys',
                    data: { useCase: 'object as keys', solution: 'Map' },
                    highlight: 'map',
                    output: 'Map for object keys'
                },
                {
                    line: 8,
                    description: 'Use Set to store unique values',
                    data: { useCase: 'unique collection', solution: 'Set' },
                    highlight: 'set',
                    output: 'Set for uniqueness'
                },
                {
                    line: 12,
                    description: 'Set automatically removes duplicates',
                    data: { added: ['javascript', 'react', 'javascript'], unique: ['javascript', 'react'] },
                    highlight: 'set',
                    output: '["javascript", "react"]'
                },
                {
                    line: 15,
                    description: 'Use WeakMap for private/metadata storage',
                    data: { useCase: 'private data', solution: 'WeakMap' },
                    highlight: 'weakmap',
                    output: 'WeakMap for metadata'
                },
                {
                    line: 18,
                    description: 'Store private data using object instance as key',
                    data: { key: 'this', value: { password: 'secret' } },
                    highlight: 'weakmap',
                    output: 'Private data stored'
                },
                {
                    line: 22,
                    description: 'When User instance is deleted, private data is auto-collected',
                    data: { benefit: 'automatic cleanup', gc: true },
                    highlight: 'gc',
                    output: '✅ No memory leaks'
                }
            ],
            explanation: 'Map: object keys. Set: unique values. WeakMap: metadata that should be auto-cleaned with the object.'
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
                            <Database className="text-teal-400" size={48} />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">Map, Set & WeakMap</h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            Modern JavaScript data structures for efficient key-value storage and unique collections
                        </p>
                    </motion.div>

                    {/* Definitions Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                        {/* Interview Definition */}
                        <div className="bg-gradient-to-br from-teal-900/40 to-slate-900 rounded-xl p-6 border border-teal-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="text-teal-400" size={24} />
                                <h3 className="text-lg font-bold text-teal-400">Interview Answer</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                "Map stores key-value pairs with any type as key. Set stores unique values. WeakMap is like Map but with weak references for garbage collection."
                            </p>
                        </div>

                        {/* Simple Explanation */}
                        <div className="bg-gradient-to-br from-cyan-900/40 to-slate-900 rounded-xl p-6 border border-cyan-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="text-cyan-400" size={24} />
                                <h3 className="text-lg font-bold text-cyan-400">Simple Explanation</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                Map is a dictionary (word → definition). Set is a guest list (no duplicates). WeakMap is sticky notes that disappear when the item is thrown away.
                            </p>
                        </div>

                        {/* Key Points */}
                        <div className="bg-gradient-to-br from-sky-900/40 to-slate-900 rounded-xl p-6 border border-sky-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="text-sky-400" size={24} />
                                <h3 className="text-lg font-bold text-sky-400">Core Concepts</h3>
                            </div>
                            <ul className="space-y-2 text-slate-200 text-sm">
                                <li className="flex gap-2">
                                    <span className="text-sky-400">•</span>
                                    <span>Map: any key type</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-sky-400">•</span>
                                    <span>Set: unique values</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-sky-400">•</span>
                                    <span>WeakMap: GC-friendly</span>
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
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Code className="text-teal-400" />
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
                                    className="p-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 rounded-lg transition-colors"
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
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${currentStepData.highlight === 'map'
                                        ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                                        : currentStepData.highlight === 'set'
                                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                            : currentStepData.highlight === 'weakmap'
                                                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                                : currentStepData.highlight === 'gc'
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        }`}>
                                        {currentStepData.highlight === 'map' ? '🗺️ Map' :
                                            currentStepData.highlight === 'set' ? '📦 Set' :
                                                currentStepData.highlight === 'weakmap' ? '🔗 WeakMap' :
                                                    currentStepData.highlight === 'gc' ? '🗑️ GC' : '📝 Info'}
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
                                <div className="bg-slate-950 rounded-xl p-6 border border-teal-500/30">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Layers className="text-teal-400" size={20} />
                                        <h4 className="text-lg font-semibold text-teal-400">Current State</h4>
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
                        <div className="mt-8 p-6 bg-teal-500/10 rounded-xl border border-teal-500/30">
                            <h4 className="text-lg font-semibold text-teal-400 mb-2">💡 Key Takeaway</h4>
                            <p className="text-slate-300">{currentEx.explanation}</p>
                        </div>
                    </div>

                    {/* Interview Tips */}
                    <div className="mt-12 bg-gradient-to-r from-teal-900/30 to-cyan-900/30 rounded-2xl p-8 border border-teal-500/30">
                        <h3 className="text-2xl font-bold text-white mb-6">🎯 Interview Tips</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-semibold text-teal-400 mb-3">Common Questions:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• "Map vs Object?"</li>
                                    <li>• "When to use Set?"</li>
                                    <li>• "What is WeakMap?"</li>
                                    <li>• "WeakMap vs Map difference?"</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-cyan-400 mb-3">Quick Reference:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• Map: any key type, iterable</li>
                                    <li>• Set: unique values, iterable</li>
                                    <li>• WeakMap: object keys only, no iteration</li>
                                    <li>• WeakSet: object values only, no iteration</li>
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

export default MapSetVisualizer;
