'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Edit3, Zap } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FactorsVisualizer = () => {
    // Initial number to check
    const [inputNumber, setInputNumber] = useState(24);
    const [isEditing, setIsEditing] = useState(false);
    const [tempInput, setTempInput] = useState('24');
    const [useOptimized, setUseOptimized] = useState(true);

    // Generate steps for the current number
    const generateSteps = (num: number, optimized = true) => {
        const steps = [
            {
                description: `Finding all factors of ${num}`,
                stage: 'init',
                number: num,
                currentDivisor: null as number | null,
                factors: [] as number[],
                checking: null as number | null,
                isDivisible: null as boolean | null,
                remainder: null as number | null,
                limit: optimized ? Math.sqrt(num) : num,
                quotient: undefined as number | undefined,
                newFactor: undefined as number | undefined,
                newPair: undefined as number | undefined,
                jsLine: 0,
                pyLine: 0,
                optimized: optimized
            }
        ];

        if (optimized) {
            steps.push({
                description: `Optimization: Check divisors from 1 to √${num} ≈ ${Math.floor(Math.sqrt(num))}`,
                stage: 'optimize',
                number: num,
                currentDivisor: null,
                factors: [],
                checking: null,
                isDivisible: null,
                remainder: null,
                limit: Math.sqrt(num),
                quotient: undefined,
                newFactor: undefined,
                newPair: undefined,
                jsLine: 2,
                pyLine: 2,
                optimized: optimized
            });
        }

        const factors: number[] = [];
        const limit = optimized ? Math.sqrt(num) : num;

        for (let i = 1; i <= limit; i++) {
            const remainder = num % i;
            const isDivisible = remainder === 0;

            // Step: Checking divisor
            steps.push({
                description: `Check if ${i} divides ${num}`,
                stage: 'checking',
                number: num,
                currentDivisor: i,
                factors: [...factors],
                checking: i,
                isDivisible: null,
                remainder: null,
                limit: limit,
                quotient: undefined,
                newFactor: undefined,
                newPair: undefined,
                jsLine: 3,
                pyLine: 3,
                optimized: optimized
            });

            // Step: Division result
            steps.push({
                description: `${num} ÷ ${i} = ${Math.floor(num / i)} remainder ${remainder}`,
                stage: 'dividing',
                number: num,
                currentDivisor: i,
                factors: [...factors],
                checking: i,
                isDivisible: isDivisible,
                remainder: remainder,
                quotient: Math.floor(num / i),
                limit: limit,
                newFactor: undefined,
                newPair: undefined,
                jsLine: 3,
                pyLine: 3,
                optimized: optimized
            });

            if (isDivisible) {
                if (optimized) {
                    // Add both factors
                    const pair = num / i;
                    if (i === pair) {
                        factors.push(i);
                        steps.push({
                            description: `${i} is a factor! (${i} × ${i} = ${num})`,
                            stage: 'found',
                            number: num,
                            currentDivisor: i,
                            factors: [...factors],
                            checking: i,
                            isDivisible: true,
                            remainder: 0,
                            quotient: pair,
                            newFactor: i,
                            limit: limit,
                            newPair: undefined,
                            jsLine: 4,
                            pyLine: 4,
                            optimized: optimized
                        });
                    } else {
                        factors.push(i);
                        factors.push(pair);
                        factors.sort((a, b) => a - b);
                        steps.push({
                            description: `Found factor pair: ${i} and ${pair} (${i} × ${pair} = ${num})`,
                            stage: 'found',
                            number: num,
                            currentDivisor: i,
                            factors: [...factors],
                            checking: i,
                            isDivisible: true,
                            remainder: 0,
                            quotient: pair,
                            newFactor: i,
                            newPair: pair,
                            limit: limit,
                            jsLine: 4,
                            pyLine: 4,
                            optimized: optimized
                        });
                    }
                } else {
                    factors.push(i);
                    steps.push({
                        description: `${i} is a factor!`,
                        stage: 'found',
                        number: num,
                        currentDivisor: i,
                        factors: [...factors],
                        checking: i,
                        isDivisible: true,
                        remainder: 0,
                        quotient: num / i,
                        newFactor: i,
                        limit: limit,
                        newPair: undefined,
                        jsLine: 4,
                        pyLine: 4,
                        optimized: optimized
                    });
                }
            } else {
                steps.push({
                    description: `${i} is not a factor (remainder = ${remainder})`,
                    stage: 'not_found',
                    number: num,
                    currentDivisor: i,
                    factors: [...factors],
                    checking: i,
                    isDivisible: false,
                    remainder: remainder,
                    limit: limit,
                    quotient: undefined,
                    newFactor: undefined,
                    newPair: undefined,
                    jsLine: 3,
                    pyLine: 3,
                    optimized: optimized
                });
            }
        }

        // Final result
        steps.push({
            description: `Complete! Found ${factors.length} factor${factors.length !== 1 ? 's' : ''}: [${factors.join(', ')}]`,
            stage: 'result',
            number: num,
            currentDivisor: null,
            factors: factors,
            checking: null,
            isDivisible: null,
            remainder: null,
            // completed: true,
            limit: limit,
            quotient: undefined,
            newFactor: undefined,
            newPair: undefined,
            jsLine: 6,
            pyLine: 6,
            optimized: optimized
        });

        return steps;
    };

    const [steps, setSteps] = useState(generateSteps(inputNumber, useOptimized));
    const [currentStep, setCurrentStep] = useState(0);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');

    const currentStepData = { ...steps[currentStep], completed: currentStep === steps.length - 1 };

    // JavaScript code - Optimized
    const jsCodeOptimized = [
        "function findFactors(num) {",
        "  const factors = [];",
        "  const limit = Math.sqrt(num);",
        "  for (let i = 1; i <= limit; i++) {",
        "    if (num % i === 0) {",
        "      factors.push(i);",
        "      if (i !== num / i) {",
        "        factors.push(num / i);",
        "      }",
        "    }",
        "  }",
        "  return factors.sort((a, b) => a - b);",
        "}"
    ];

    // JavaScript code - Simple
    const jsCodeSimple = [
        "function findFactors(num) {",
        "  const factors = [];",
        "  for (let i = 1; i <= num; i++) {",
        "    if (num % i === 0) {",
        "      factors.push(i);",
        "    }",
        "  }",
        "  return factors;",
        "}"
    ];

    // Python code - Optimized
    const pyCodeOptimized = [
        "def find_factors(num):",
        "    factors = []",
        "    limit = int(num ** 0.5)",
        "    for i in range(1, limit + 1):",
        "        if num % i == 0:",
        "            factors.append(i)",
        "            if i != num // i:",
        "                factors.append(num // i)",
        "    return sorted(factors)"
    ];

    // Python code - Simple
    const pyCodeSimple = [
        "def find_factors(num):",
        "    factors = []",
        "    for i in range(1, num + 1):",
        "        if num % i == 0:",
        "            factors.append(i)",
        "    return factors"
    ];

    const getCode = () => {
        if (language === 'javascript') {
            return useOptimized ? jsCodeOptimized : jsCodeSimple;
        } else {
            return useOptimized ? pyCodeOptimized : pyCodeSimple;
        }
    };

    const code = getCode();
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

    const handleNumberChange = () => {
        const newNum = parseInt(tempInput);
        if (!isNaN(newNum) && newNum > 0 && newNum <= 10000) {
            setInputNumber(newNum);
            setSteps(generateSteps(newNum, useOptimized));
            setCurrentStep(0);
            setIsEditing(false);
        }
    };

    const handleOptimizationToggle = () => {
        const newOptimized = !useOptimized;
        setUseOptimized(newOptimized);
        setSteps(generateSteps(inputNumber, newOptimized));
        setCurrentStep(0);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleNumberChange();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <Header />
            <div className="pt-24 pb-12 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 min-h-screen">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Factors Finder</h1>
                        <p className="text-blue-300">Visual Step-by-Step Algorithm</p>

                        {/* Number Input */}
                        <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
                            {isEditing ? (
                                <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-xl backdrop-blur-sm border border-blue-500/50">
                                    <input
                                        type="number"
                                        value={tempInput}
                                        onChange={(e) => setTempInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="px-4 py-2 rounded-lg bg-slate-900 text-white border border-blue-500 focus:outline-none focus:border-cyan-500 w-32"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleNumberChange}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg shadow-green-600/20"
                                    >
                                        Find
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setTempInput(inputNumber.toString());
                                        }}
                                        className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 bg-slate-800/60 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                    <span className="text-3xl font-bold text-white tracking-tight">{inputNumber}</span>
                                    <div className="w-px h-8 bg-slate-600"></div>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-600/30"
                                    >
                                        <Edit3 size={18} />
                                        <span>Change</span>
                                    </button>
                                </div>
                            )}

                            {/* Optimization Toggle */}
                            <button
                                onClick={handleOptimizationToggle}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all transform hover:scale-105 font-semibold shadow-lg ${useOptimized
                                        ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 shadow-yellow-500/20'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                            >
                                <Zap size={18} className={useOptimized ? 'fill-current' : ''} />
                                {useOptimized ? 'Optimized O(√n)' : 'Simple O(n)'}
                            </button>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Visualization */}
                        <div className="space-y-6">
                            {/* Target Number Display */}
                            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                                <h2 className="text-xl font-semibold text-white mb-4">Target Number</h2>
                                <div className="text-center py-4">
                                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                                        {currentStepData.number}
                                    </div>
                                    {currentStepData.limit && (
                                        <div className="inline-block px-3 py-1 bg-slate-900/50 rounded-full text-sm text-blue-300 border border-blue-500/20 mt-2">
                                            {useOptimized
                                                ? `Checking up to √${inputNumber} ≈ ${Math.floor(currentStepData.limit)}`
                                                : `Checking from 1 to ${inputNumber}`
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Current Check */}
                            {currentStepData.checking !== null && (
                                <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                                    <h2 className="text-xl font-semibold text-white mb-4">Division Check</h2>
                                    <div className="space-y-4">
                                        <div className="bg-slate-900 rounded-lg p-6 border border-slate-700/50">
                                            <div className="text-center mb-6">
                                                <span className="text-4xl font-bold text-white">
                                                    {currentStepData.number}
                                                </span>
                                                <span className="text-3xl text-blue-400 mx-4 font-light">÷</span>
                                                <span className="text-4xl font-bold text-yellow-400">
                                                    {currentStepData.checking}
                                                </span>
                                            </div>

                                            {currentStepData.quotient !== undefined && (
                                                <div className="grid grid-cols-2 gap-4 mt-4">
                                                    <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700">
                                                        <div className="text-xs text-blue-300 uppercase tracking-wider mb-1">Quotient</div>
                                                        <div className="text-2xl font-bold text-white">{currentStepData.quotient}</div>
                                                    </div>
                                                    <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700">
                                                        <div className="text-xs text-blue-300 uppercase tracking-wider mb-1">Remainder</div>
                                                        <div className={`text-2xl font-bold ${currentStepData.remainder === 0 ? 'text-green-400' : 'text-red-400'
                                                            }`}>
                                                            {currentStepData.remainder}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {currentStepData.isDivisible !== null && (
                                                <div className={`mt-6 p-3 rounded-lg text-center font-bold text-lg animate-in fade-in zoom-in-95 ${currentStepData.isDivisible
                                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                    }`}>
                                                    {currentStepData.isDivisible ? '✓ Is a factor!' : '✗ Not a factor'}
                                                </div>
                                            )}

                                            {currentStepData.newPair && (
                                                <div className="mt-4 p-4 bg-blue-500/10 rounded-lg text-center border border-blue-500/30">
                                                    <div className="text-xs text-blue-400 uppercase tracking-widest mb-2">Factor Pair Found</div>
                                                    <div className="text-xl font-bold text-white">
                                                        {currentStepData.checking} × <span className="text-green-400">{currentStepData.newPair}</span> = {currentStepData.number}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Factors Found */}
                            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-white">
                                        Factors Found
                                    </h2>
                                    <div className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">
                                        Count: <span className="text-white font-bold">{currentStepData.factors.length}</span>
                                    </div>
                                </div>

                                {currentStepData.factors.length === 0 ? (
                                    <div className="text-center text-slate-500 py-12 border-2 border-dashed border-slate-700 rounded-xl">
                                        No factors found yet...
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-3">
                                        {currentStepData.factors.map((factor, idx) => (
                                            <div
                                                key={idx}
                                                className={`px-4 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${factor === currentStepData.newFactor || factor === currentStepData.newPair
                                                        ? 'bg-green-500 text-white scale-110 shadow-lg shadow-green-500/50 ring-2 ring-green-300'
                                                        : 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                                                    }`}
                                            >
                                                {factor}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {currentStepData.factors.length > 0 && (
                                    <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700/50">
                                        <p className="text-xs text-blue-400 uppercase tracking-widest mb-2">Sorted List</p>
                                        <p className="text-white font-mono text-sm">
                                            [{currentStepData.factors.join(', ')}]
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Code & Controls */}
                        <div className="space-y-6">
                            {/* Code Display */}
                            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                                    <h2 className="text-xl font-semibold text-white">Algorithm Logic</h2>
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

                                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto border border-slate-800">
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
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-lg">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white mb-2">Current Step</h2>
                                        <p className="text-blue-200 text-lg leading-relaxed">{currentStepData.description}</p>
                                    </div>
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
                                            className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300 ease-out"
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
                                        <div className="p-4 bg-cyan-600 text-white rounded-full group-hover:bg-cyan-500 transition-all transform hover:scale-110 shadow-lg shadow-cyan-500/30">
                                            <Play size={28} className="ml-1" />
                                        </div>
                                        <span className="text-xs text-cyan-400 font-medium">Play</span>
                                    </button>

                                    <button
                                        onClick={handleReset}
                                        className="flex flex-col items-center gap-1 group"
                                    >
                                        <div className="p-3 bg-slate-700 text-white rounded-full group-hover:bg-blue-600 transition-all shadow-lg">
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
                                    <div className="mt-6 p-6 bg-green-500/10 border border-green-500/30 rounded-xl text-center animate-in zoom-in-50">
                                        <p className="text-green-400 font-bold text-2xl mb-1">Calculation Complete!</p>
                                        <p className="text-green-300/80 text-base">
                                            Found a total of <span className="font-bold text-white">{currentStepData.factors.length}</span> individual factors.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Examples & Info */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Algorithm Info */}
                        <div className="bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700">
                            <h2 className="text-xl font-semibold text-white mb-4">About Factors</h2>
                            <div className="text-blue-200 space-y-4 text-sm leading-relaxed">
                                <p>
                                    A <strong>factor</strong> of a number is any integer that divides it perfectly with no remainder.
                                </p>
                                <div className="p-4 bg-slate-900/60 rounded-lg border border-blue-500/20">
                                    <p className="font-bold text-blue-300 mb-2">Why Optimization Matters:</p>
                                    <p className="text-slate-400">
                                        Factors essentially come in pairs. If <code className="text-white">a × b = n</code>, then if <code className="text-white">a ≤ √n</code>, it must be that <code className="text-white">b ≥ √n</code>. This allows us to cut our search space drastically!
                                    </p>
                                </div>
                                <p className="font-mono bg-slate-900 p-3 rounded text-slate-300">
                                    Example: 24 has factors [1, 2, 3, 4, 6, 8, 12, 24]<br />
                                    Pairs: (1,24), (2,12), (3,8), (4,6)
                                </p>
                            </div>
                        </div>

                        {/* Examples */}
                        <div className="bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700">
                            <h2 className="text-xl font-semibold text-white mb-4">Try These Numbers</h2>
                            <div className="grid grid-cols-3 gap-3">
                                {[12, 24, 36, 48, 60, 100, 144, 200, 999].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => {
                                            setInputNumber(num);
                                            setSteps(generateSteps(num, useOptimized));
                                            setCurrentStep(0);
                                            setTempInput(num.toString());
                                        }}
                                        className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-blue-600 
                    transition-all transform hover:scale-105 active:scale-95 font-mono text-sm border border-slate-600 hover:border-blue-400"
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FactorsVisualizer;
