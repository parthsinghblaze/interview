'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointerClick, Play, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const EventDelegationVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'The Problem: Multiple Listeners',
            code: `<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

// ❌ BAD: Attach a listener to EACH item
const items = document.querySelectorAll('li');
items.forEach(item => {
  item.addEventListener('click', (e) => {
    console.log(e.target.textContent);
  });
});

// If you have 1000 items = 1000 listeners! 😱`,
            steps: [
                {
                    line: 8,
                    description: 'Select all <li> elements from the DOM',
                    data: { selected: 3, type: 'NodeList' },
                    highlight: 'dom'
                },
                {
                    line: 9,
                    description: 'Loop through each item',
                    data: { looping: true, total: 3 },
                    highlight: 'loop'
                },
                {
                    line: 10,
                    description: 'Attach a separate click listener to Item 1',
                    data: { item: 'Item 1', listeners: 1 },
                    highlight: 'listener',
                    output: 'Listener added to Item 1'
                },
                {
                    line: 10,
                    description: 'Attach a separate click listener to Item 2',
                    data: { item: 'Item 2', listeners: 2 },
                    highlight: 'listener',
                    output: 'Listener added to Item 2'
                },
                {
                    line: 10,
                    description: 'Attach a separate click listener to Item 3',
                    data: { item: 'Item 3', listeners: 3 },
                    highlight: 'listener',
                    output: 'Listener added to Item 3'
                },
                {
                    line: 14,
                    description: 'Problem: With 1000 items, you create 1000 separate listeners!',
                    data: { totalItems: 1000, totalListeners: 1000, memory: 'High' },
                    highlight: 'problem',
                    output: '⚠️ Memory waste!'
                }
            ],
            explanation: 'Attaching individual listeners to many elements wastes memory and is inefficient. Event delegation solves this!'
        },
        {
            title: 'The Solution: Event Delegation',
            code: `<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

// ✅ GOOD: Attach ONE listener to the parent
const list = document.getElementById('list');
list.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    console.log(e.target.textContent);
  }
});

// Only 1 listener, works for all items! ✨`,
            steps: [
                {
                    line: 8,
                    description: 'Select the PARENT element (the <ul>)',
                    data: { selected: 'ul#list', type: 'parent' },
                    highlight: 'dom'
                },
                {
                    line: 9,
                    description: 'Attach ONE click listener to the parent',
                    data: { listeners: 1, coverage: 'all children' },
                    highlight: 'delegation',
                    output: 'Single listener on parent'
                },
                {
                    line: 10,
                    description: 'User clicks "Item 2" - event bubbles up to parent',
                    data: { clicked: 'Item 2', bubbling: 'to ul' },
                    highlight: 'bubble'
                },
                {
                    line: 10,
                    description: 'Check if clicked element is an <li>',
                    data: { target: 'Item 2', tagName: 'LI', match: true },
                    highlight: 'check'
                },
                {
                    line: 11,
                    description: 'Condition passes! Execute the handler',
                    data: { target: 'Item 2' },
                    highlight: 'execution',
                    output: 'Item 2'
                },
                {
                    line: 15,
                    description: 'Works for ANY number of items with just 1 listener!',
                    data: { totalItems: '∞', totalListeners: 1, memory: 'Low' },
                    highlight: 'solution',
                    output: '✅ Efficient!'
                }
            ],
            explanation: 'Event delegation uses event bubbling. One listener on the parent catches events from all children.'
        },
        {
            title: 'Event: target vs currentTarget',
            code: `<ul id="list">
  <li><span>Item 1</span></li>
</ul>

const list = document.getElementById('list');
list.addEventListener('click', (e) => {
  console.log('target:', e.target);         // The element clicked
  console.log('currentTarget:', e.currentTarget); // Where listener is
});

// User clicks <span> inside <li>`,
            steps: [
                {
                    line: 6,
                    description: 'User clicks the <span> element',
                    data: { clicked: '<span>Item 1</span>' },
                    highlight: 'click'
                },
                {
                    line: 7,
                    description: 'e.target = the actual element that was clicked',
                    data: { target: '<span>' },
                    highlight: 'target',
                    output: '<span>Item 1</span>'
                },
                {
                    line: 8,
                    description: 'e.currentTarget = where the listener is attached',
                    data: { currentTarget: '<ul id="list">' },
                    highlight: 'currentTarget',
                    output: '<ul id="list">'
                },
                {
                    line: 10,
                    description: 'target can be ANY child, currentTarget is always the parent',
                    data: {
                        target: 'varies (span, li, etc)',
                        currentTarget: 'always ul'
                    },
                    highlight: 'comparison',
                    output: 'Different!'
                }
            ],
            explanation: 'e.target is where the click happened. e.currentTarget is where the listener is attached.'
        },
        {
            title: 'Capturing vs Bubbling',
            code: `<div id="parent">
  <button id="child">Click me</button>
</div>

// Bubbling (default): child → parent
parent.addEventListener('click', () => {
  console.log('Parent bubble');
}, false);

child.addEventListener('click', () => {
  console.log('Child bubble');
}, false);

// Capturing: parent → child
parent.addEventListener('click', () => {
  console.log('Parent capture');
}, true);

// Click order: Parent capture → Child bubble → Parent bubble`,
            steps: [
                {
                    line: 2,
                    description: 'User clicks the <button>',
                    data: { clicked: 'child button' },
                    highlight: 'click'
                },
                {
                    line: 16,
                    description: 'Phase 1 (CAPTURE): Event goes DOWN from parent to child',
                    data: { phase: 'Capture', direction: 'parent → child' },
                    highlight: 'capture',
                    output: 'Parent capture'
                },
                {
                    line: 11,
                    description: 'Phase 2 (TARGET): Event reaches the clicked element',
                    data: { phase: 'Target', element: 'button' },
                    highlight: 'target',
                    output: 'Child bubble'
                },
                {
                    line: 7,
                    description: 'Phase 3 (BUBBLE): Event goes UP from child to parent',
                    data: { phase: 'Bubble', direction: 'child → parent' },
                    highlight: 'bubble',
                    output: 'Parent bubble'
                },
                {
                    line: 20,
                    description: 'Full execution order based on phases',
                    data: {
                        order: ['Parent capture', 'Child bubble', 'Parent bubble']
                    },
                    highlight: 'summary',
                    output: 'Capture → Target → Bubble'
                }
            ],
            explanation: 'Events have 3 phases: Capture (down), Target (element), Bubble (up). Most code uses bubbling (default).'
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
                            <MousePointerClick className="text-cyan-400" size={48} />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">Event Delegation</h1>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            Use event bubbling to handle events efficiently with a single listener
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
                                "Event delegation is a pattern where you attach a single event listener to a parent element to manage events for all its children using event bubbling."
                            </p>
                        </div>

                        {/* Simple Explanation */}
                        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 rounded-xl p-6 border border-blue-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <Lightbulb className="text-blue-400" size={24} />
                                <h3 className="text-lg font-bold text-blue-400">Simple Explanation</h3>
                            </div>
                            <p className="text-slate-200 leading-relaxed">
                                Instead of hiring a security guard for each room, hire one for the building entrance. They can handle visitors to any room!
                            </p>
                        </div>

                        {/* Key Points */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 rounded-xl p-6 border border-purple-500/30">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="text-purple-400" size={24} />
                                <h3 className="text-lg font-bold text-purple-400">Core Concepts</h3>
                            </div>
                            <ul className="space-y-2 text-slate-200 text-sm">
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span>One listener for many elements</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span>Uses event bubbling</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-purple-400">•</span>
                                    <span>Works for dynamic content</span>
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
                                {/* Line Number */}
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${currentStepData.highlight === 'delegation'
                                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                        : currentStepData.highlight === 'bubble'
                                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                            : currentStepData.highlight === 'capture'
                                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                : currentStepData.highlight === 'execution'
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : currentStepData.highlight === 'problem'
                                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                        : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                                        }`}>
                                        {currentStepData.highlight === 'delegation' ? '✨ Delegating' :
                                            currentStepData.highlight === 'bubble' ? '↗️ Bubbling' :
                                                currentStepData.highlight === 'capture' ? '↘️ Capturing' :
                                                    currentStepData.highlight === 'execution' ? '▶️ Executing' :
                                                        currentStepData.highlight === 'problem' ? '⚠️ Problem' : '📝 Info'}
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
                                <div className="bg-slate-950 rounded-xl p-6 border border-cyan-500/30">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Layers className="text-cyan-400" size={20} />
                                        <h4 className="text-lg font-semibold text-cyan-400">Current State</h4>
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
                                    <li>• "What is event delegation?"</li>
                                    <li>• "Explain event bubbling"</li>
                                    <li>• "target vs currentTarget?"</li>
                                    <li>• "When to use delegation?"</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-blue-400 mb-3">Real-World Uses:</h4>
                                <ul className="space-y-2 text-slate-300">
                                    <li>• Lists with many items</li>
                                    <li>• Dynamically added elements</li>
                                    <li>• Table row click handlers</li>
                                    <li>• Navigation menus</li>
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

export default EventDelegationVisualizer;
