'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const DSAVisualizer = () => {
    // Sample array to visualize
    const initialArray = [3, 7, 2, 9, 1, 5, 8, 4];

    // Algorithm steps
    const steps = [
        {
            description: "Initialize: Set max to first element",
            currentIndex: 0,
            maxIndex: 0,
            maxValue: initialArray[0],
            comparing: null,
            jsLine: 1,
            pyLine: 1
        },
        ...initialArray.slice(1).map((_, idx) => {
            const actualIdx = idx + 1;
            const prevMax = Math.max(...initialArray.slice(0, actualIdx));
            const prevMaxIdx = initialArray.indexOf(prevMax);
            const currentValue = initialArray[actualIdx];

            return {
                description: `Compare arr[${actualIdx}] (${currentValue}) with current max (${prevMax})`,
                currentIndex: actualIdx,
                maxIndex: currentValue > prevMax ? actualIdx : prevMaxIdx,
                maxValue: Math.max(currentValue, prevMax),
                comparing: actualIdx,
                jsLine: currentValue > prevMax ? 3 : 2,
                pyLine: currentValue > prevMax ? 3 : 2
            };
        }),
        {
            description: `Algorithm Complete! Maximum value is ${Math.max(...initialArray)}`,
            currentIndex: initialArray.length - 1,
            maxIndex: initialArray.indexOf(Math.max(...initialArray)),
            maxValue: Math.max(...initialArray),
            comparing: null,
            completed: true,
            jsLine: 5,
            pyLine: 5
        }
    ];

    const [currentStep, setCurrentStep] = useState(0);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');

    const currentStepData = steps[currentStep];

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
        "    for i in range(1, len(arr)):",
        "        if arr[i] > max_val:",
        "            max_val = arr[i]",
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
    };

    const handleAutoPlay = () => {
        let step = currentStep;
        const interval = setInterval(() => {
            step++;
            if (step >= steps.length) {
                clearInterval(interval);
            } else {
                setCurrentStep(step);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <Header />

            <div className="pt-24 pb-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Find Maximum Number</h1>
                        <p className="text-purple-300">Detailed Step-by-Step Visualization</p>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Visualization */}
                        <div className="space-y-6">
                            {/* Array Visualization */}
                            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                                <h2 className="text-xl font-semibold text-white mb-4">Array Visualization</h2>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    {initialArray.map((value, idx) => (
                                        <div
                                            key={idx}
                                            className={`
                        relative w-14 h-14 md:w-16 md:h-16 flex flex-col items-center justify-center rounded-lg
                        transition-all duration-300 transform border-2
                        ${idx === currentStepData.maxIndex
                                                    ? 'bg-green-500/20 border-green-500 scale-110 shadow-lg shadow-green-500/30'
                                                    : idx === currentStepData.comparing
                                                        ? 'bg-yellow-500/20 border-yellow-500 scale-105 shadow-lg shadow-yellow-500/30'
                                                        : idx <= currentStepData.currentIndex
                                                            ? 'bg-slate-700 border-slate-600'
                                                            : 'bg-slate-800 border-slate-700 opacity-50'
                                                }
                      `}
                                        >
                                            <span className="text-xs text-slate-400 absolute -top-6">
                                                {idx}
                                            </span>
                                            <span className={`text-xl font-bold ${idx === currentStepData.maxIndex ? 'text-green-400' :
                                                    idx === currentStepData.comparing ? 'text-yellow-400' : 'text-white'
                                                }`}>{value}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Legend */}
                                <div className="flex gap-4 justify-center mt-8 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-slate-300">Current Max</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <span className="text-slate-300">Comparing</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                                        <span className="text-slate-300">Visited</span>
                                    </div>
                                </div>
                            </div>

                            {/* Current State Info */}
                            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                                <h2 className="text-xl font-semibold text-white mb-4">Current State</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                                        <span className="text-purple-300 font-mono">Current Index [i]</span>
                                        <span className="text-white font-mono font-bold text-lg">{currentStepData.currentIndex}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                                        <span className="text-purple-300 font-mono">Max Value</span>
                                        <span className="text-green-400 font-mono font-bold text-2xl">{currentStepData.maxValue}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                                        <span className="text-purple-300 font-mono">Max Index</span>
                                        <span className="text-white font-mono font-bold text-lg">{currentStepData.maxIndex}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Code & Controls */}
                        <div className="space-y-6">
                            {/* Code Display */}
                            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-white">Algorithm Code</h2>
                                    <div className="flex bg-slate-900 rounded-lg p-1">
                                        <button
                                            onClick={() => setLanguage('javascript')}
                                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${language === 'javascript'
                                                    ? 'bg-yellow-500 text-slate-900 shadow-md'
                                                    : 'text-slate-400 hover:text-white'
                                                }`}
                                        >
                                            JavaScript
                                        </button>
                                        <button
                                            onClick={() => setLanguage('python')}
                                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${language === 'python'
                                                    ? 'bg-blue-500 text-white shadow-md'
                                                    : 'text-slate-400 hover:text-white'
                                                }`}
                                        >
                                            Python
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm overflow-x-auto border border-slate-800">
                                    {code.map((line, idx) => (
                                        <div
                                            key={idx}
                                            className={`
                        py-1 px-3 rounded pointer-events-none transition-all duration-200
                        ${idx === currentLine
                                                    ? 'bg-white/10 border-l-2 border-yellow-500 ml-[-2px]'
                                                    : 'border-l-2 border-transparent'
                                                }
                      `}
                                        >
                                            <span className="text-slate-600 mr-4 w-6 inline-block text-right select-none">{idx + 1}</span>
                                            <span className={idx === currentLine ? 'text-yellow-100 font-medium' : 'text-slate-400'}>
                                                {line}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Step Description */}
                            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                                <h2 className="text-xl font-semibold text-white mb-3">Analysis</h2>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-500/10 rounded-lg">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                    </div>
                                    <p className="text-purple-200 text-lg leading-relaxed">{currentStepData.description}</p>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">

                                {/* Progress Bar */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-400 text-sm font-medium">Progress</span>
                                        <span className="text-white text-sm font-medium">
                                            {Math.round(((currentStep + 1) / steps.length) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300 ease-out"
                                            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={currentStep === 0}
                                        className="flex flex-col items-center gap-1 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="p-3 bg-slate-700 text-white rounded-full group-hover:bg-slate-600 transition-all shadow-lg">
                                            <ChevronLeft size={24} />
                                        </div>
                                        <span className="text-xs text-slate-400">Prev</span>
                                    </button>

                                    <button
                                        onClick={handleAutoPlay}
                                        disabled={currentStep === steps.length - 1}
                                        className="flex flex-col items-center gap-1 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="p-4 bg-blue-600 text-white rounded-full group-hover:bg-blue-500 transition-all transform hover:scale-110 shadow-lg shadow-blue-500/30">
                                            <Play size={28} className="ml-1" />
                                        </div>
                                        <span className="text-xs text-blue-400 font-medium">Play</span>
                                    </button>

                                    <button
                                        onClick={handleReset}
                                        className="flex flex-col items-center gap-1 group"
                                    >
                                        <div className="p-3 bg-slate-700 text-white rounded-full group-hover:bg-purple-600 transition-all shadow-lg">
                                            <RotateCcw size={24} />
                                        </div>
                                        <span className="text-xs text-slate-400">Reset</span>
                                    </button>

                                    <button
                                        onClick={handleNext}
                                        disabled={currentStep === steps.length - 1}
                                        className="flex flex-col items-center gap-1 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="p-3 bg-slate-700 text-white rounded-full group-hover:bg-slate-600 transition-all shadow-lg">
                                            <ChevronRight size={24} />
                                        </div>
                                        <span className="text-xs text-slate-400">Next</span>
                                    </button>
                                </div>

                                {/* Completion Badge */}
                                {currentStepData.completed && (
                                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-center animate-in fade-in slide-in-from-bottom-4">
                                        <p className="text-green-400 font-bold text-lg">Algorithm Completed Successfully</p>
                                        <p className="text-green-300/80 text-sm mt-1">
                                            The maximum value found is {currentStepData.maxValue} at index {currentStepData.maxIndex}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Complexity Analysis */}
                    <div className="mt-8 bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700">
                        <h2 className="text-xl font-semibold text-white mb-6">Complexity Analysis</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-500/20 rounded-md text-blue-400 font-mono text-sm font-bold">O(n)</div>
                                    <p className="text-slate-300 font-medium">Time Complexity</p>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    The algorithm iterates through the array exactly once, performing constant time operations at each step.
                                </p>
                            </div>

                            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-purple-500/20 rounded-md text-purple-400 font-mono text-sm font-bold">O(1)</div>
                                    <p className="text-slate-300 font-medium">Space Complexity</p>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Only a few variables (max, current index) are used regardless of the input size, so space usage is constant.
                                </p>
                            </div>

                            <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-green-500/20 rounded-md text-green-400 font-mono text-sm font-bold">{initialArray.length}</div>
                                    <p className="text-slate-300 font-medium">Elements Processed</p>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    This visualization processes an array of fixed size for demonstration purposes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DSAVisualizer;
