'use client';

import React, { useState } from 'react';
import {
    Play,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Code,
    BookOpen,
    Lightbulb,
    AlertCircle,
    Activity,
    Layers,
    Cpu,
    ArrowRight,
    Terminal,
    Database,
    Zap,
    CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const EntryPointPage = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const renderingData = [
        {
            title: 'The HTML Skeleton',
            subtitle: 'Phase 0: The Container',
            description: 'Before React even loads, the browser serves a nearly empty HTML file. There is usually a single <div> with an id like "root". This is the "landing pad" for React.',
            badge: 'HTML',
            code: `<!-- public/index.html -->
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>`,
            interviewAnswer: "React applications are 'Single Page Applications' (SPAs). They start with a minimal HTML shell and rely on a specific DOM element to serve as the mounting point for the entire UI tree.",
            simpleExplanation: "Think of the HTML file as an empty stage. React is the production crew that arrives later and builds the entire set inside that empty space.",
            rememberPoints: ['Single entry <div>', 'Script tag for JS bundle', 'Empty initial DOM'],
            data: { element: '#root', status: 'Waiting...' }
        },
        {
            title: 'The createRoot Handshake',
            subtitle: 'Phase 1: Bootstrapping',
            description: 'In modern React (v18+), we use ReactDOM.createRoot. This creates a specialized "root" object linked to our HTML element, giving React control over that part of the DOM.',
            badge: 'JavaScript',
            code: `import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(<App />);`,
            interviewAnswer: "ReactDOM.createRoot is the entry point API that enables Concurrent React features. It connects the React virtual world with the browser's physical DOM.",
            simpleExplanation: "This is React introducing itself to the browser. 'Hi, I'm taking over this div now. I'll handle all the updates from here on out.'",
            rememberPoints: ['Transition to v18 API', 'root.render() starts execution', 'Virtual DOM initialization'],
            data: { api: 'ReactDOM v18', target: 'div#root' }
        },
        {
            title: 'Triggering a Render',
            subtitle: 'Phase 2: The Request',
            description: 'A render is triggered by two things: the initial root.render() call, or a change in state (useState/useReducer) within a component.',
            badge: 'Logic',
            code: `// This starts the process
root.render(<App />);

// Or inside a component:
const [val, setVal] = useState(0);
setVal(1); // Trigger!`,
            interviewAnswer: "Rendering isn't just updating the screen; it's React calling your components to determine what the UI should look like. It's a calculated decision, not a paint job.",
            simpleExplanation: "A trigger is like someone calling 'Action!' on a movie set. It tells everyone they need to get into position because something changed.",
            rememberPoints: ['Initial render', 'State updates', 'Prop changes (cascading)'],
            data: { trigger: 'State Change', priority: 'High' }
        },
        {
            title: 'Reconciliation (The Diff)',
            subtitle: 'Phase 3: Render (Virtual DOM)',
            description: 'React calls your components and builds a new "Virtual DOM" tree. It then compares this new tree with the old one to find exactly what changed. This is the "Diffing Algorithm".',
            badge: 'Engine',
            code: `// Old Tree: <h1>Hello</h1>
// New Tree: <h1>Hello World</h1>

// React finds the difference: 
// Only the text "World" needs to change.`,
            interviewAnswer: "The render phase is 'Pure'. React calculates the differences between the Virtual DOM snapshots. This phase is fast and can even be paused in Concurrent Mode.",
            simpleExplanation: "Think of an architect looking at two blueprints. Instead of tearing down the whole house, they just mark the specific wall that needs to be moved.",
            rememberPoints: ['No DOM changes yet', 'Virtual DOM comparison', 'Diffing algorithm'],
            data: { diffFound: '1 Node', complexity: 'O(n)' }
        },
        {
            title: 'The Commit Phase',
            subtitle: 'Phase 4: DOM Mutation',
            description: 'Finally, React applies only the necessary changes to the real DOM. This is where the browser actually updates what the user sees on the screen.',
            badge: 'Browser',
            code: `// React does the heavy lifting:
document.getElementById('title')
  .textContent = 'Hello World';`,
            interviewAnswer: "The Commit phase is synchronous. React applies the calculated 'patches' to the DOM. Once done, the browser repaints the screen.",
            simpleExplanation: "This is the construction crew finally picking up the hammers and actually fixing that specific wall marked on the blueprint.",
            rememberPoints: ['Real DOM update', 'Synchronous execution', 'Layout & Paint follows'],
            data: { status: 'Live', domNodes: '+1' }
        }
    ];

    const step = renderingData[currentStep];

    const handleNext = () => {
        if (currentStep < renderingData.length - 1) setCurrentStep(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
            <Header />

            <div className="pt-20 min-h-[calc(100vh-5rem)] flex flex-col lg:row">
                <div className="flex flex-col lg:flex-row flex-1">

                    {/* Left Sidebar - Theory */}
                    <div className="w-80 bg-slate-900 border-r border-slate-700 p-6 overflow-y-auto lg:h-[calc(100vh-5rem)]">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Play className="text-blue-400" size={40} />
                                <h1 className="text-3xl font-bold">Entry & Render</h1>
                            </div>
                            <p className="text-slate-400 text-sm font-medium">
                                The lifecycle of a React app from bootup to DOM paint.
                            </p>
                        </div>

                        {/* Interview Answer */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <BookOpen className="text-blue-400" size={22} />
                                <h3 className="text-base font-bold text-blue-400 uppercase">Interview Answer</h3>
                            </div>
                            <p className="text-slate-200 text-base leading-relaxed">
                                {step.interviewAnswer}
                            </p>
                        </div>

                        {/* Simple Explanation */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Lightbulb className="text-yellow-400" size={22} />
                                <h3 className="text-base font-bold text-yellow-400 uppercase">Simple Analogy</h3>
                            </div>
                            <p className="text-slate-200 text-base leading-relaxed">
                                {step.simpleExplanation}
                            </p>
                        </div>

                        {/* Remember Section */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertCircle className="text-purple-400" size={22} />
                                <h3 className="text-base font-bold text-purple-400 uppercase">Remember</h3>
                            </div>
                            <ul className="space-y-3 text-slate-200 text-base">
                                {step.rememberPoints.map((point, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-purple-400 mt-1">•</span>
                                        <div>{point}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-700">
                            <Link href="/react">
                                <div className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest">
                                    <ChevronLeft size={16} /> Back to React
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Main Stage */}
                    <div className="flex-1 bg-slate-950 flex flex-col overflow-hidden">

                        {/* Progress Stepper */}
                        <div className="bg-slate-900 border-b border-white/5 p-4 flex gap-3 overflow-x-auto no-scrollbar">
                            {renderingData.map((d, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentStep(idx)}
                                    className={`px-6 py-3 rounded-2xl font-black text-xs transition-all border ${currentStep === idx
                                        ? 'bg-blue-600 border-blue-400 text-white shadow-2xl'
                                        : 'bg-slate-800 border-white/5 text-slate-500 hover:text-slate-300'}`}
                                >
                                    {d.badge}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 overflow-hidden">

                            {/* Editor Area */}
                            <div className="xl:col-span-5 flex flex-col border-r border-white/5 bg-slate-900/20">
                                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
                                    <div className="flex items-center gap-2">
                                        <Code className="text-slate-600" size={18} />
                                        <span className="text-xs font-black uppercase text-slate-500 tracking-widest">Code Implementation</span>
                                    </div>
                                    <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.1em]">{step.subtitle}</span>
                                </div>
                                <div className="flex-1 overflow-auto bg-[#0a0f1d] p-10">
                                    <SyntaxHighlighter
                                        language="javascript"
                                        style={atomDark}
                                        customStyle={{ margin: 0, padding: 0, fontSize: '1.2rem', backgroundColor: 'transparent' }}
                                    >
                                        {step.code}
                                    </SyntaxHighlighter>
                                </div>

                                {/* Controls */}
                                <div className="p-8 bg-slate-900 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex gap-3">
                                        <button onClick={() => setCurrentStep(0)} className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all"><RotateCcw size={20} /></button>
                                        <button onClick={handlePrev} disabled={currentStep === 0} className="p-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-20 rounded-2xl transition-all"><ChevronLeft size={20} /></button>
                                        <button onClick={handleNext} disabled={currentStep === renderingData.length - 1} className="p-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 rounded-2xl transition-all shadow-xl shadow-blue-900/30"><ChevronRight size={20} /></button>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1">Pipeline</div>
                                        <div className="text-2xl font-black text-blue-500">{currentStep + 1} <span className="text-slate-700 text-sm">/ {renderingData.length}</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Engine Stage */}
                            <div className="xl:col-span-7 flex flex-col bg-slate-950 p-12 overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="space-y-10"
                                    >
                                        {/* Status Bar */}
                                        <div className="flex items-center gap-6">
                                            <div className="px-6 py-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-black uppercase tracking-widest">
                                                {step.badge} Module
                                            </div>
                                            <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent" />
                                        </div>

                                        {/* Heading */}
                                        <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10">
                                            <h2 className="text-4xl font-black text-slate-100 tracking-tighter mb-4">{step.title}</h2>
                                            <p className="text-xl text-slate-400 leading-relaxed font-medium">
                                                {step.description}
                                            </p>
                                        </div>

                                        {/* Engine Visualization */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                            {/* Memory Stack */}
                                            <div className="p-10 rounded-[2.5rem] bg-slate-900/50 border border-white/10">
                                                <h4 className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-8 border-b border-blue-500/10 pb-4">
                                                    <Database size={14} /> Bridge Data
                                                </h4>
                                                <div className="space-y-4">
                                                    {Object.entries(step.data).map(([key, val]) => (
                                                        <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-white/5">
                                                            <span className="text-slate-600 text-[10px] font-black uppercase">{key}</span>
                                                            <span className="font-mono font-bold text-sm text-blue-400">{val}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Final Result */}
                                            <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 shadow-3xl flex flex-col justify-center items-center text-center">
                                                <h4 className="text-[10px] font-black text-blue-100/60 uppercase tracking-widest mb-6">Execution Result</h4>
                                                <div className="text-5xl font-black tracking-tighter text-white drop-shadow-2xl">
                                                    {step.data.status || 'READY'}
                                                </div>
                                                <div className="mt-8">
                                                    <Zap className="text-blue-200 opacity-50 animate-pulse" size={40} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pro Tip */}
                                        <div className="p-8 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex gap-6 items-start">
                                            <div className="p-3 bg-emerald-500 text-white rounded-xl">
                                                <CheckCircle size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">Senior Takeaway</h4>
                                                <p className="text-slate-300 font-bold leading-relaxed">
                                                    Always specify that React 18 introduced `createRoot` to enable **Concurrent Rendering**, allowing React to interrupt a render to stay responsive!
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default EntryPointPage;
