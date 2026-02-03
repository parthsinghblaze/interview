'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause, Edit3, Zap, Code, Info, HelpCircle } from 'lucide-react';
import DSAExplanationModal from '../../components/DSAExplanationModal';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const FactorsVisualizer = () => {
    // Initial number to check
    const [inputNumber, setInputNumber] = useState(24);
    const [isEditing, setIsEditing] = useState(false);
    const [tempInput, setTempInput] = useState('24');
    const [useOptimized, setUseOptimized] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentStepData = { ...steps[currentStep], completed: currentStep === steps.length - 1 };

    // Code snippets
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

    const handleNumberChange = () => {
        const newNum = parseInt(tempInput);
        if (!isNaN(newNum) && newNum > 0 && newNum <= 10000) {
            setInputNumber(newNum);
            setSteps(generateSteps(newNum, useOptimized));
            setCurrentStep(0);
            setIsEditing(false);
            setIsPlaying(false);
        }
    };

    const handleOptimizationToggle = () => {
        const newOptimized = !useOptimized;
        setUseOptimized(newOptimized);
        setSteps(generateSteps(inputNumber, newOptimized));
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleNumberChange();
        }
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

                    {/* LEFT COLUMN: Controller & Info - Matches "Controller on top left" */}
                    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">

                        {/* 1. Controller Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    Factor Finder
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

                            {/* Input Section */}
                            <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-slate-400 font-medium">Target Number</span>
                                    <Zap
                                        size={16}
                                        className={`cursor-pointer transition-colors ${useOptimized ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`}
                                        onClick={handleOptimizationToggle}
                                        width={16}
                                        aria-label="Toggle Optimization"
                                    />
                                </div>

                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={tempInput}
                                            onChange={(e) => setTempInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="flex-1 bg-slate-900 border border-blue-500/50 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-lg"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleNumberChange}
                                            className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 font-medium transition-colors"
                                        >
                                            Go
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between group cursor-pointer" onClick={() => setIsEditing(true)}>
                                        <span className="text-4xl font-bold font-mono tracking-tight text-white group-hover:text-blue-300 transition-colors">
                                            {inputNumber}
                                        </span>
                                        <Edit3 className="text-slate-500 group-hover:text-white transition-colors" size={20} />
                                    </div>
                                )}

                                <div className="mt-3 flex items-center justify-between text-xs">
                                    <span className={`px-2 py-1 rounded-full border ${useOptimized ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10' : 'border-slate-600 text-slate-400'}`}>
                                        {useOptimized ? 'Optimized O(√n)' : 'Simple O(n)'}
                                    </span>
                                    <span className="text-slate-500 font-mono">
                                        Max Check: {Math.floor(currentStepData.limit)}
                                    </span>
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

                        {/* 2. Step Description & Code Snippet (Compact) */}
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
                                            lineProps={(lineNumber) => {
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

                    {/* RIGHT COLUMN: Visualization - Takes remaining space */}
                    <div className="flex flex-col gap-6">

                        {/* 1. Main Animation Stage */}
                        <div className="min-h-[500px] lg:flex-grow bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-4 md:p-8 relative overflow-hidden flex flex-col items-center">
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

                            <div className="flex-1 w-full flex items-center justify-center relative z-10">
                                <AnimatePresence mode="wait">
                                    {currentStepData.checking !== null ? (
                                        <motion.div
                                            key="checking"
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.9, opacity: 0 }}
                                            className="relative z-10 w-full max-w-2xl"
                                        >
                                            {/* Division Visualizer */}
                                            <div className="flex flex-col items-center gap-8">
                                                <div className="flex items-center gap-6 md:gap-12">
                                                    {/* Dividend */}
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-slate-400 text-[10px] md:text-xs font-mono uppercase tracking-widest">Dividend</span>
                                                        <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-2xl">
                                                            <span className="text-3xl md:text-5xl font-bold text-white">{currentStepData.number}</span>
                                                        </div>
                                                    </div>

                                                    {/* Operator */}
                                                    <span className="text-2xl md:text-4xl text-slate-600 font-light">÷</span>

                                                    {/* Divisor */}
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-slate-400 text-[10px] md:text-xs font-mono uppercase tracking-widest">Divisor</span>
                                                        <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl bg-blue-600/20 border border-blue-500/50 flex items-center justify-center shadow-2xl shadow-blue-500/10">
                                                            <span className="text-3xl md:text-5xl font-bold text-blue-400">{currentStepData.checking}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Connector Line */}
                                                <div className="h-12 w-0.5 bg-gradient-to-b from-slate-700 to-transparent"></div>

                                                {/* Result Area */}
                                                {currentStepData.quotient !== undefined && (
                                                    <motion.div
                                                        initial={{ y: 20, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        className="grid grid-cols-2 gap-4 w-full max-w-md"
                                                    >
                                                        <div className="bg-slate-800/80 p-4 rounded-xl border border-white/5 text-center">
                                                            <div className="text-xs text-slate-500 mb-1">Quotient</div>
                                                            <div className="text-2xl font-bold text-white">{currentStepData.quotient}</div>
                                                        </div>
                                                        <div className={`bg-slate-800/80 p-4 rounded-xl border ${currentStepData.remainder === 0 ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'} text-center transition-colors duration-500`}>
                                                            <div className="text-xs text-slate-500 mb-1">Remainder</div>
                                                            <div className={`text-2xl font-bold ${currentStepData.remainder === 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                                {currentStepData.remainder}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {/* Status Badge */}
                                                {currentStepData.isDivisible !== null && (
                                                    <motion.div
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        className={`px-6 py-2 rounded-full font-bold text-lg border backdrop-blur-md ${currentStepData.isDivisible
                                                            ? 'bg-green-500/20 border-green-500/50 text-green-300 shadow-lg shadow-green-500/20'
                                                            : 'bg-red-500/20 border-red-500/50 text-red-300'
                                                            }`}
                                                    >
                                                        {currentStepData.isDivisible ? 'Factor Found!' : 'Not a Factor'}
                                                    </motion.div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div className="text-center text-slate-500">
                                            <Play size={48} className="mx-auto mb-4 opacity-20" />
                                            <p>Start the visualization to see the division process.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* 2. Factors Found Grid (Bottom) */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-200">Factors Found</h3>
                                <span className="text-slate-500 text-sm">{currentStepData.factors.length} items</span>
                            </div>

                            <div className="flex-1 overflow-x-auto custom-scrollbar">
                                {currentStepData.factors.length === 0 ? (
                                    <div className="h-full min-h-[4rem] flex items-center justify-center text-slate-600 font-mono text-sm border-2 border-dashed border-slate-800 rounded-xl">
                                        Waiting for factors...
                                    </div>
                                ) : (
                                    <div className="flex flex-nowrap gap-2 pb-4">
                                        <AnimatePresence>
                                            {currentStepData.factors.map((factor, idx) => (
                                                <motion.div
                                                    key={`${factor}-${idx}`}
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className={`w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center rounded-xl font-bold text-lg border transition-colors ${factor === currentStepData.newFactor || factor === currentStepData.newPair
                                                        ? 'bg-green-500 text-white border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)] z-10'
                                                        : 'bg-slate-800 text-blue-300 border-white/5'
                                                        }`}
                                                >
                                                    {factor}
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            </main>

            <DSAExplanationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Factor Finder"
                description="Identify all integers that divide a number without leaving a remainder."
                concept="Factors are numbers you multiply together to get another number. The optimized algorithm only checks divisors up to the square root of N, as factors always come in pairs (one <= √N and one >= √N)."
                efficiency="The naive approach checks all numbers up to N, but the optimized approach only checks up to √N, making it significantly faster for large numbers."
                useCases={[
                    "Cryptography (RSA algorithm relies on prime factorization)",
                    "Finding the Greatest Common Divisor (GCD)",
                    "Simplified fraction calculation"
                ]}
                timeComplexity="O(√n)"
                spaceComplexity="O(k)"
                complexityNotes="n = input number, k = number of factors found"
                interviewTips={[
                    "Always mention the Square Root optimization (√N) for extra points.",
                    "Explain that factors come in pairs (i, n/i).",
                    "Handle perfect squares as a special case where the pair elements are identical."
                ]}
                color="green"
            />
        </div>
    );
};

export default FactorsVisualizer;
