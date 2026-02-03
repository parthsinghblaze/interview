'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause, Code, Info, HelpCircle } from 'lucide-react';
import DSAExplanationModal from '../../components/DSAExplanationModal';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DSAVisualizer = () => {
    // Sample array to visualize
    const initialArray = [3, 7, 2, 9, 1, 5, 8, 4];
    const [isPlaying, setIsPlaying] = useState(false);

    // Generate steps for the algorithm
    const generateSteps = (arr: number[]) => {
        const steps = [];

        // Initial step
        steps.push({
            description: 'Start: Initialize max with first element',
            currentIndex: 0,
            maxIndex: 0,
            maxValue: arr[0],
            comparing: -1,
            array: arr,
            jsLine: 1,
            pyLine: 1
        });

        // Iterate through array
        for (let i = 1; i < arr.length; i++) {
            // Comparing step
            steps.push({
                description: `Compare ${arr[i]} with current max ${arr[steps[steps.length - 1].maxIndex]}`,
                currentIndex: i,
                maxIndex: steps[steps.length - 1].maxIndex,
                maxValue: steps[steps.length - 1].maxValue,
                comparing: i,
                array: arr,
                jsLine: 2,
                pyLine: 2
            });

            // Update or keep max
            if (arr[i] > steps[steps.length - 1].maxValue) {
                steps.push({
                    description: `${arr[i]} is greater! Update max`,
                    currentIndex: i,
                    maxIndex: i,
                    maxValue: arr[i],
                    comparing: -1,
                    array: arr,
                    jsLine: 3,
                    pyLine: 3
                });
            } else {
                steps.push({
                    description: `${arr[i]} is not greater. Keep current max`,
                    currentIndex: i,
                    maxIndex: steps[steps.length - 1].maxIndex,
                    maxValue: steps[steps.length - 1].maxValue,
                    comparing: -1,
                    array: arr,
                    jsLine: 2,
                    pyLine: 2
                });
            }
        }

        // Final step
        steps.push({
            description: `Complete! Maximum value is ${steps[steps.length - 1].maxValue}`,
            currentIndex: arr.length - 1,
            maxIndex: steps[steps.length - 1].maxIndex,
            maxValue: steps[steps.length - 1].maxValue,
            comparing: -1,
            array: arr,
            completed: true,
            jsLine: 4,
            pyLine: 4
        });

        return steps;
    };

    const [steps] = useState(generateSteps(initialArray));
    const [currentStep, setCurrentStep] = useState(0);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentStepData = { ...steps[currentStep], completed: currentStep === steps.length - 1 };

    // JavaScript code
    const jsCode = [
        "function findMax(arr) {",
        "  let max = arr[0];",
        "  for (let i = 1; i < arr.length; i++) {",
        "    if (arr[i] > max) {",
        "      max = arr[i];",
        "    }",
        "  }",
        "  return max;",
        "}"
    ];

    // Python code
    const pyCode = [
        "def find_max(arr):",
        "    max_val = arr[0]",
        "    for num in arr[1:]:",
        "        if num > max_val:",
        "            max_val = num",
        "    return max_val"
    ];

    const code = language === 'javascript' ? jsCode : pyCode;
    const currentLine = language === 'javascript' ? currentStepData.jsLine : currentStepData.pyLine;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
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
        setIsPlaying(false);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && currentStep < steps.length - 1) {
            interval = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev >= steps.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 800);
        } else if (currentStep >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps.length]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-blue-500/30">
            <Header />

            {/* Main Content Area - Full Screen Layout */}
            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pt-20 pb-6 px-4 md:px-6">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

                <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 relative z-10">

                    {/* LEFT COLUMN: Controller & Code */}
                    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">

                        {/* 1. Controller Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    Find Maximum
                                </h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-2 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                        title="Algorithm Explanation"
                                    >
                                        <HelpCircle size={20} />
                                    </button>
                                    <div className="px-2 py-1 rounded bg-slate-800 border border-white/10 text-xs font-mono text-slate-400">
                                        v2.0
                                    </div>
                                </div>
                            </div>

                            {/* Array Display */}
                            <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-slate-400 font-medium">Input Array</span>
                                    <span className="text-xs text-slate-500 font-mono">{initialArray.length} elements</span>
                                </div>
                                <div className="font-mono text-lg text-white">
                                    [{initialArray.join(', ')}]
                                </div>
                            </div>

                            {/* Playback Controls */}
                            <div className="grid grid-cols-4 gap-2">
                                <button
                                    onClick={handleReset}
                                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center justify-center"
                                    title="Reset"
                                >
                                    <RotateCcw size={20} />
                                </button>
                                <button
                                    onClick={handlePrevious}
                                    disabled={currentStep === 0}
                                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"
                                    title="Previous Step"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={togglePlay}
                                    disabled={currentStepData.completed}
                                    className={`p-3 rounded-xl ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-blue-900/20`}
                                    title={isPlaying ? "Pause" : "Play"}
                                >
                                    {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={currentStepData.completed}
                                    className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"
                                    title="Next Step"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-6">
                                <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                                    <span>Progress</span>
                                    <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Code Display */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex-1 flex flex-col min-h-[300px]">
                            <div className="flex items-center gap-2 mb-4 text-blue-400">
                                <Code size={18} />
                                <h3 className="font-bold text-sm uppercase tracking-wider">Algorithm Code</h3>
                            </div>

                            <div className="relative flex-1 min-h-0 flex flex-col">
                                <div className="absolute top-0 right-0 p-2 z-10 w-full flex justify-end pointer-events-none">
                                    <div className="flex bg-slate-900/80 rounded p-1 border border-white/10 backdrop-blur-sm pointer-events-auto">
                                        <button
                                            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${language === 'javascript' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                            onClick={() => setLanguage('javascript')}
                                        >JS</button>
                                        <button
                                            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${language === 'python' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                            onClick={() => setLanguage('python')}
                                        >PY</button>
                                    </div>
                                </div>

                                <div className="flex-1 rounded-xl overflow-hidden border border-slate-700/50 shadow-inner bg-[#1e1e1e] relative">
                                    <div className="absolute inset-0 overflow-auto custom-scrollbar">
                                        <SyntaxHighlighter
                                            language={language}
                                            style={atomDark}
                                            showLineNumbers={true}
                                            wrapLines={true}
                                            customStyle={{
                                                margin: 0,
                                                padding: '1.5rem',
                                                minHeight: '100%',
                                                fontSize: '0.9rem',
                                                lineHeight: '1.6',
                                                backgroundColor: '#1e1e1e',
                                                fontFamily: 'var(--font-mono)'
                                            }}
                                            lineNumberStyle={{ minWidth: '2em', paddingRight: '1em', color: '#6e7681', textAlign: 'right' }}
                                            lineProps={(lineNumber: number) => {
                                                const isCurrentLine = lineNumber === currentLine + 1;
                                                return {
                                                    style: {
                                                        backgroundColor: isCurrentLine ? 'rgba(59, 130, 246, 0.15)' : undefined,
                                                        display: 'block',
                                                        width: '100%',
                                                        borderLeft: isCurrentLine ? '3px solid #3b82f6' : '3px solid transparent',
                                                        paddingLeft: '1rem'
                                                    }
                                                };
                                            }}
                                        >
                                            {code.join('\n')}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Visualization */}
                    <div className="flex flex-col gap-6">

                        {/* 1. Main Animation Stage */}
                        <div className="min-h-[500px] lg:flex-grow bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-4 md:p-8 relative overflow-visible flex flex-col items-center">
                            {/* Step Description Header */}
                            <div className="w-full text-center mb-8 relative z-20">
                                <motion.div
                                    key={currentStepData.description}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-block bg-slate-800/80 border border-blue-500/30 rounded-2xl md:rounded-full px-4 md:px-6 py-2 shadow-lg"
                                >
                                    <p className="text-sm md:text-xl font-medium text-blue-100 flex items-center gap-3">
                                        <Info size={18} className="text-blue-400 shrink-0" />
                                        {currentStepData.description}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none"></div>

                            {/* Array Visualization */}
                            <div className="flex-1 w-full flex items-center justify-center relative z-10 overflow-x-auto pt-10 pb-8 custom-scrollbar">
                                <div className="flex gap-2 md:gap-3 items-end px-4 min-w-max">
                                    {currentStepData.array.map((value, idx) => {
                                        const isMax = idx === currentStepData.maxIndex;
                                        const isComparing = idx === currentStepData.comparing;
                                        const isVisited = idx < currentStepData.currentIndex;

                                        return (
                                            <motion.div
                                                key={idx}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{
                                                    scale: isComparing ? 1.15 : (isMax ? 1.1 : 1),
                                                    opacity: 1
                                                }}
                                                className="flex flex-col items-center gap-2"
                                            >
                                                {/* Bar */}
                                                <div
                                                    className={`w-12 md:w-20 rounded-t-xl flex items-end justify-center pb-2 transition-all duration-300 ${isMax
                                                        ? 'bg-gradient-to-t from-green-600 to-green-400 shadow-lg shadow-green-500/50'
                                                        : isComparing
                                                            ? 'bg-gradient-to-t from-yellow-600 to-yellow-400 shadow-lg shadow-yellow-500/50'
                                                            : isVisited
                                                                ? 'bg-gradient-to-t from-slate-600 to-slate-500'
                                                                : 'bg-gradient-to-t from-blue-600 to-blue-400'
                                                        }`}
                                                    style={{ height: `${value * 20}px` }}
                                                >
                                                    <span className="text-white font-bold text-lg md:text-xl">{value}</span>
                                                </div>

                                                {/* Label */}
                                                <div className={`text-[10px] md:text-xs font-mono px-1 md:px-2 py-0.5 md:py-1 rounded ${isMax
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : isComparing
                                                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                        : 'bg-slate-800 text-slate-400'
                                                    }`}>
                                                    {isMax ? 'MAX' : isComparing ? 'CURR' : `[${idx}]`}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Completion Badge */}
                            {currentStepData.completed && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="mt-8 px-6 py-3 bg-green-500/20 border border-green-500/50 text-green-300 rounded-full font-bold text-xl shadow-lg shadow-green-500/20 relative z-20"
                                >
                                    Algorithm Complete! Maximum = {currentStepData.maxValue}
                                </motion.div>
                            )}
                        </div>

                        {/* 2. Stats Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl sticky bottom-4 lg:relative lg:bottom-0">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Current Max</span>
                                    <span className="text-xl md:text-3xl font-bold text-green-400">{currentStepData.maxValue}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Position</span>
                                    <span className="text-xl md:text-3xl font-bold text-blue-400">{currentStepData.currentIndex + 1}/{currentStepData.array.length}</span>
                                </div>
                                <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Complexity</span>
                                    <span className="text-lg md:text-2xl font-bold text-cyan-400">O(n)</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </main>

            <DSAExplanationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Find Maximum Number"
                description="The fundamental linear search algorithm to find the largest element in an array."
                concept="Linear search iterates through the array once, keeping track of the largest value seen so far. It initializes the maximum with the first element and updates it whenever a larger element is found."
                efficiency="This is the most direct way to find the maximum in an unsorted array. It requires visiting every element exactly once."
                useCases={[
                    "Finding the highest score in a list",
                    "Locating the maximum value in a raw dataset",
                    "Basic building block for more complex sorting or selection algorithms"
                ]}
                timeComplexity="O(n)"
                spaceComplexity="O(1)"
                complexityNotes="n = Number of elements in the array"
                interviewTips={[
                    "Ask if the array can be empty (handle edge cases).",
                    "Discuss what to return if the array is empty (e.g., -Infinity or an Error).",
                    "Mention that for sorted arrays, this could be O(1) by simply checking the last element."
                ]}
                color="blue"
            />
        </div>
    );
};

export default DSAVisualizer;
