'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointerClick, RotateCcw, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, Layers } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const EventDelegationVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'The Solution: Delegation',
            code: `<ul id="parent-list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

// Attach only ONE listener to the parent
const list = document.getElementById('parent-list');

list.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    console.log('Clicked:', event.target.textContent);
  }
});`,
            steps: [
                {
                    line: 2,
                    description: 'We have a list with multiple children. Instead of 3 listeners, we want 1.',
                    data: { element: 'ul#parent-list', children: 3 },
                    highlight: 'dom'
                },
                {
                    line: 10,
                    description: 'The parent listens for clicks. When a child (LI) is clicked, the event bubbled up.',
                    data: { listener: 'attached to UL', phase: 'bubbling' },
                    highlight: 'delegation'
                },
                {
                    line: 11,
                    description: 'We check event.target to see which specific child was actually clicked.',
                    data: { target: 'LI (Item 2)', matchesCriteria: true },
                    highlight: 'execution',
                    output: 'Clicked: Item 2'
                }
            ],
            explanation: 'Event delegation uses bubbling to catch child events at the parent level. One listener handles everything.'
        },
        {
            title: 'target vs currentTarget',
            code: `<ul id="list">
  <li><span>Inside Span</span></li>
</ul>

list.addEventListener('click', (e) => {
  console.log('target:', e.target);
  console.log('currentTarget:', e.currentTarget);
});`,
            steps: [
                {
                    line: 6,
                    description: 'e.target is the specific element that received the click (the span).',
                    data: { target: '<span>' },
                    highlight: 'target'
                },
                {
                    line: 7,
                    description: 'e.currentTarget is the element where the listener is attached (the ul).',
                    data: { currentTarget: '<ul>' },
                    highlight: 'currentTarget'
                }
            ],
            explanation: 'target = the clicked item. currentTarget = the listener owner.'
        },
        {
            title: 'Bubbling vs Capturing',
            code: `// Bubbling (Up: Child -> Parent)
parent.addEventListener('click', () => {}, false);

// Capturing (Down: Parent -> Child)
parent.addEventListener('click', () => {}, true);`,
            steps: [
                {
                    line: 2,
                    description: 'Default behavior. Event travels from target UP to the window.',
                    data: { direction: 'Child ↗️ Parent', mode: 'Bubbling' },
                    highlight: 'bubble'
                },
                {
                    line: 5,
                    description: 'Set useCapture to true. Event travels from window DOWN to the target.',
                    data: { direction: 'Parent ↘️ Child', mode: 'Capturing' },
                    highlight: 'capture'
                }
            ],
            explanation: 'Capturing happens first (trickle down), then Bubbling (bubble up).'
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
                            <MousePointerClick className="text-cyan-400" size={40} />
                            <h1 className="text-3xl font-bold">Delegation</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Manage events efficiently using bubbling.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-cyan-400" size={22} />
                            <h3 className="text-base font-bold text-cyan-400 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "Event delegation is a pattern where a single event listener is attached to a parent element to handle events for all children, exploiting event bubbling."
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-blue-400" size={22} />
                            <h3 className="text-base font-bold text-blue-400 uppercase">Simple Explanation</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            Instead of giving 10 children their own whistle, give the teacher one whistle to watch them all!
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-purple-400" size={22} />
                            <h3 className="text-base font-bold text-purple-400 uppercase">Phases</h3>
                        </div>
                        <ul className="space-y-3 text-slate-200 text-base">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400 mt-1">1.</span>
                                <div><strong className="text-purple-400">Capturing:</strong> Parent down to child.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 mt-1">2.</span>
                                <div><strong className="text-blue-400">Target:</strong> Reaches actual element.</div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-cyan-400 mt-1">3.</span>
                                <div><strong className="text-cyan-400">Bubbling:</strong> Child back up to parent.</div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-400 mb-2 uppercase tracking-tight">Memory Benefit</h4>
                        <p className="text-slate-400 text-xs">
                            Huge memory savings! 1,000 items with 1,000 listeners vs 1,000 items with 1 listener.
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
                    <div className="bg-slate-900/50 flex flex-col" style={{ height: '35vh' }}>
                        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-700 bg-slate-900">
                            <Code className="text-cyan-400" size={20} />
                            <h3 className="text-lg font-bold">Execution Flow</h3>
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
                                            backgroundColor: isCurrentLine ? 'rgba(34, 211, 238, 0.15)' : undefined,
                                            borderLeft: isCurrentLine ? '3px solid #22d3ee' : '3px solid transparent',
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
                        <div className="max-w-5xl mx-auto h-full flex flex-col">
                            {/* Controls */}
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold tracking-tight text-cyan-400">Event Stream Visualizer</h3>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400 text-base font-mono">
                                        Step {currentStep + 1}/{currentEx.steps.length}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={handleReset} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors shadow-inner">
                                            <RotateCcw size={20} />
                                        </button>
                                        <button onClick={handlePrevious} disabled={currentStep === 0} className="p-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors">
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button onClick={handleNext} disabled={currentStep === currentEx.steps.length - 1} className="p-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-lg transition-colors shadow-lg shadow-cyan-500/20">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Current Step Display */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentExample + currentStep}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    className="space-y-6 flex-1 flex flex-col"
                                >
                                    <div className="bg-slate-950/50 rounded-xl p-6 border-b-4 border-cyan-500/50 shadow-xl">
                                        <p className="text-lg text-slate-100 leading-relaxed font-medium">{currentStepData.description}</p>
                                    </div>

                                    {/* Event Visualizer Box */}
                                    <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-950/40 rounded-3xl border border-slate-800 relative overflow-hidden">

                                        {/* Simplified DOM Tree */}
                                        <div className="flex flex-col items-center gap-8">
                                            {/* Parent */}
                                            <motion.div
                                                animate={{
                                                    borderColor: currentStepData.highlight === 'delegation' || currentStepData.highlight === 'bubble' || currentStepData.highlight === 'capture' ? '#22d3ee' : '#334155',
                                                    scale: currentStepData.highlight === 'delegation' ? 1.05 : 1
                                                }}
                                                className="w-64 h-24 rounded-2xl border-4 flex flex-col items-center justify-center bg-slate-900 shadow-2xl relative z-10"
                                            >
                                                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-tighter mb-1">Parent (UL) Listener Attached</div>
                                                <div className="w-4 h-4 rounded-full bg-cyan-500/50 absolute -top-2 -right-2 animate-pulse" />
                                            </motion.div>

                                            {/* Connector */}
                                            <div className="relative h-12">
                                                <motion.div
                                                    animate={{
                                                        height: currentStepData.highlight === 'bubble' ? [0, 48] : currentStepData.highlight === 'capture' ? [48, 0] : 48,
                                                        opacity: currentStepData.highlight === 'bubble' || currentStepData.highlight === 'capture' ? 1 : 0.2
                                                    }}
                                                    className="w-1 bg-cyan-400 absolute left-1/2 -translate-x-1/2"
                                                />
                                            </div>

                                            {/* Child */}
                                            <motion.div
                                                animate={{
                                                    borderColor: currentStepData.highlight === 'execution' || currentStepData.highlight === 'target' ? '#22d3ee' : '#334155',
                                                    y: currentStepData.highlight === 'execution' ? [0, -5, 0] : 0
                                                }}
                                                className="w-48 h-16 rounded-xl border-4 flex items-center justify-center bg-slate-900 z-10"
                                            >
                                                <div className="text-sm font-bold text-slate-400">Child (LI) Clicked</div>
                                            </motion.div>
                                        </div>

                                        {/* Animated Event Particle */}
                                        {currentStepData.highlight === 'bubble' && (
                                            <motion.div
                                                initial={{ y: 80, opacity: 0 }}
                                                animate={{ y: -60, opacity: 1 }}
                                                transition={{ duration: 0.8, repeat: Infinity }}
                                                className="absolute w-8 h-8 rounded-full bg-cyan-400/30 blur-sm z-0"
                                            />
                                        )}
                                        {currentStepData.highlight === 'capture' && (
                                            <motion.div
                                                initial={{ y: -80, opacity: 0 }}
                                                animate={{ y: 80, opacity: 1 }}
                                                transition={{ duration: 0.8, repeat: Infinity }}
                                                className="absolute w-8 h-8 rounded-full bg-purple-400/30 blur-sm z-0"
                                            />
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                                            <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">Event State</div>
                                            <div className="space-y-1">
                                                {Object.entries(currentStepData.data).map(([k, v]) => (
                                                    <div key={k} className="flex justify-between text-xs font-mono text-cyan-300">
                                                        <span className="text-slate-600">{k}:</span>
                                                        <span>{String(v)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {(currentStepData as any).output && (
                                            <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/50 flex flex-col justify-center items-center text-center">
                                                <div className="text-[10px] uppercase font-bold text-green-500 mb-1">Execution Log</div>
                                                <div className="text-green-400 font-bold font-mono underline decoration-wavy">
                                                    {(currentStepData as any).output}
                                                </div>
                                            </div>
                                        )}
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

export default EventDelegationVisualizer;
