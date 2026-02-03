'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause, Edit3, Code, Info, HelpCircle } from 'lucide-react';
import DSAExplanationModal from '../../components/DSAExplanationModal';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ArmstrongVisualizer = () => {
    // Initial number to check
    const [inputNumber, setInputNumber] = useState(153);
    const [isEditing, setIsEditing] = useState(false);
    const [tempInput, setTempInput] = useState('153');
    const [isPlaying, setIsPlaying] = useState(false);

    // Generate steps for Armstrong number check
    const generateSteps = (num: number) => {
        const steps = [];
        const numStr = num.toString();
        const digits = numStr.split('').map(Number);
        const n = digits.length;

        // Initial step
        steps.push({
            description: `Checking if ${num} is an Armstrong number`,
            stage: 'init',
            number: num,
            digits: [],
            powers: [],
            sum: 0,
            currentDigit: null,
            highlightDigit: -1,
            isArmstrong: null,
            jsLine: 0,
            pyLine: 0
        });

        // Extract digits
        steps.push({
            description: `Number has ${n} digits: [${digits.join(', ')}]`,
            stage: 'extract',
            number: num,
            digits: digits,
            powers: [],
            sum: 0,
            currentDigit: null,
            highlightDigit: -1,
            isArmstrong: null,
            jsLine: 1,
            pyLine: 1
        });

        let sum = 0;
        const powers: number[] = [];

        // Calculate powers for each digit
        for (let i = 0; i < digits.length; i++) {
            const digit = digits[i];
            const power = Math.pow(digit, n);

            steps.push({
                description: `Calculating ${digit}^${n} = ${power}`,
                stage: 'calculating',
                number: num,
                digits: digits,
                powers: [...powers],
                sum: sum,
                currentDigit: digit,
                highlightDigit: i,
                isArmstrong: null,
                jsLine: 2,
                pyLine: 2
            });

            powers.push(power);
            sum += power;

            steps.push({
                description: `Sum = ${sum} (added ${power})`,
                stage: 'summing',
                number: num,
                digits: digits,
                powers: [...powers],
                sum: sum,
                currentDigit: null,
                highlightDigit: i,
                isArmstrong: null,
                jsLine: 3,
                pyLine: 3
            });
        }

        // Final check
        const isArmstrong = sum === num;
        steps.push({
            description: isArmstrong
                ? `${num} = ${sum} ✓ It's an Armstrong number!`
                : `${num} ≠ ${sum} ✗ Not an Armstrong number`,
            stage: 'result',
            number: num,
            digits: digits,
            powers: powers,
            sum: sum,
            currentDigit: null,
            highlightDigit: -1,
            isArmstrong: isArmstrong,
            jsLine: 4,
            pyLine: 4
        });

        return steps;
    };

    const [steps, setSteps] = useState(generateSteps(inputNumber));
    const [currentStep, setCurrentStep] = useState(0);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const currentStepData = { ...steps[currentStep], completed: currentStep === steps.length - 1 };

    // JavaScript code
    const jsCode = [
        "function isArmstrong(num) {",
        "  const digits = num.toString().split('').map(Number);",
        "  const n = digits.length;",
        "  const sum = digits.reduce((acc, d) => acc + Math.pow(d, n), 0);",
        "  return sum === num;",
        "}"
    ];

    // Python code
    const pyCode = [
        "def is_armstrong(num):",
        "    digits = [int(d) for d in str(num)]",
        "    n = len(digits)",
        "    sum_powers = sum(d ** n for d in digits)",
        "    return sum_powers == num"
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

    const handleNumberChange = () => {
        const newNum = parseInt(tempInput);
        if (!isNaN(newNum) && newNum > 0 && newNum <= 100000) {
            setInputNumber(newNum);
            setSteps(generateSteps(newNum));
            setCurrentStep(0);
            setIsEditing(false);
            setIsPlaying(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleNumberChange();
        }
    };

    return (
        <div className="h-screen bg-slate-950 text-white overflow-hidden flex flex-col font-sans selection:bg-purple-500/30">
            <Header />

            {/* Main Content Area - Full Screen Layout */}
            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-black pt-20 pb-6 px-6 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

                <div className="h-full w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 relative z-10">

                    {/* LEFT COLUMN: Controller & Code */}
                    <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">

                        {/* 1. Controller Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Armstrong Checker
                                </h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-2 rounded-full bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
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
                                </div>

                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={tempInput}
                                            onChange={(e) => setTempInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            className="flex-1 bg-slate-900 border border-purple-500/50 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500/50 font-mono text-lg"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleNumberChange}
                                            className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-4 font-medium transition-colors"
                                        >
                                            Go
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between group cursor-pointer" onClick={() => setIsEditing(true)}>
                                        <span className="text-4xl font-bold font-mono tracking-tight text-white group-hover:text-purple-300 transition-colors">
                                            {inputNumber}
                                        </span>
                                        <Edit3 className="text-slate-500 group-hover:text-white transition-colors" size={20} />
                                    </div>
                                )}

                                {currentStepData.isArmstrong !== null && (
                                    <div className={`mt-3 px-3 py-1 rounded-full text-center text-sm font-semibold ${currentStepData.isArmstrong
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        }`}>
                                        {currentStepData.isArmstrong ? '✓ Armstrong Number' : '✗ Not Armstrong'}
                                    </div>
                                )}
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
                                    className={`p-3 rounded-xl ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-purple-600 hover:bg-purple-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-purple-900/20`}
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
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Code Display */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex-1 flex flex-col min-h-[300px]">
                            <div className="flex items-center gap-2 mb-4 text-purple-400">
                                <Code size={18} />
                                <h3 className="font-bold text-sm uppercase tracking-wider">Algorithm Code</h3>
                            </div>

                            <div className="relative flex-1 min-h-0 flex flex-col">
                                <div className="absolute top-0 right-0 p-2 z-10 w-full flex justify-end pointer-events-none">
                                    <div className="flex bg-slate-900/80 rounded p-1 border border-white/10 backdrop-blur-sm pointer-events-auto">
                                        <button
                                            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${language === 'javascript' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                            onClick={() => setLanguage('javascript')}
                                        >JS</button>
                                        <button
                                            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${language === 'python' ? 'bg-purple-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
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
                                                        backgroundColor: isCurrentLine ? 'rgba(168, 85, 247, 0.15)' : undefined,
                                                        display: 'block',
                                                        width: '100%',
                                                        borderLeft: isCurrentLine ? '3px solid #a855f7' : '3px solid transparent',
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
                    <div className="h-full flex flex-col gap-6 overflow-hidden">

                        {/* 1. Main Animation Stage */}
                        <div className="flex-grow bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center">
                            {/* Step Description Header */}
                            <div className="w-full text-center mb-8 relative z-20">
                                <motion.div
                                    key={currentStepData.description}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-block bg-slate-800/80 border border-purple-500/30 rounded-full px-6 py-2 shadow-lg"
                                >
                                    <p className="text-lg md:text-xl font-medium text-purple-100 flex items-center gap-3">
                                        <Info size={20} className="text-purple-400" />
                                        {currentStepData.description}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent_70%)] pointer-events-none"></div>

                            {/* Digit Breakdown & Calculation */}
                            <div className="flex-1 w-full flex items-center justify-center relative z-10">
                                <div className="max-w-4xl w-full">
                                    {/* Digits Display */}
                                    {currentStepData.digits.length > 0 && (
                                        <div className="flex justify-center gap-4 mb-12">
                                            {currentStepData.digits.map((digit, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{
                                                        scale: idx === currentStepData.highlightDigit ? 1.15 : 1,
                                                        opacity: 1
                                                    }}
                                                    className={`relative flex flex-col items-center p-4 rounded-xl transition-all duration-300 min-w-[5rem] ${idx === currentStepData.highlightDigit
                                                        ? 'bg-purple-500/30 border-2 border-purple-400 shadow-lg shadow-purple-500/50 z-10'
                                                        : currentStepData.powers[idx] !== undefined
                                                            ? 'bg-slate-700/50 border border-slate-600'
                                                            : 'bg-slate-800/50 border border-slate-700'
                                                        }`}
                                                >
                                                    <span className="text-4xl font-bold text-white mb-2">{digit}</span>
                                                    {currentStepData.powers[idx] !== undefined && (
                                                        <>
                                                            <div className="text-xs text-purple-400 mb-1">
                                                                {digit}<sup>{currentStepData.digits.length}</sup>
                                                            </div>
                                                            <div className="text-lg font-bold text-cyan-400">
                                                                = {currentStepData.powers[idx]}
                                                            </div>
                                                        </>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Sum Display */}
                                    {currentStepData.sum > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center bg-slate-800/70 border border-purple-500/30 rounded-2xl p-6"
                                        >
                                            <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">Running Sum</div>
                                            <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                                {currentStepData.sum}
                                            </div>
                                            {currentStepData.powers.length > 0 && (
                                                <div className="text-sm text-slate-500 mt-2 font-mono">
                                                    {currentStepData.powers.join(' + ')}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* Result Badge */}
                                    {currentStepData.isArmstrong !== null && (
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className={`mt-8 px-8 py-4 rounded-full font-bold text-2xl border backdrop-blur-md text-center ${currentStepData.isArmstrong
                                                ? 'bg-green-500/20 border-green-500/50 text-green-300 shadow-lg shadow-green-500/20'
                                                : 'bg-red-500/20 border-red-500/50 text-red-300'
                                                }`}
                                        >
                                            {currentStepData.isArmstrong
                                                ? `✓ ${inputNumber} is an Armstrong Number!`
                                                : `✗ ${inputNumber} is NOT an Armstrong Number`}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. Info Panel */}
                        <div className="h-32 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                            <div className="grid grid-cols-3 gap-4 h-full">
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5">
                                    <span className="text-xs text-slate-500 uppercase tracking-widest mb-1">Number</span>
                                    <span className="text-3xl font-bold text-purple-400">{inputNumber}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5">
                                    <span className="text-xs text-slate-500 uppercase tracking-widest mb-1">Digits</span>
                                    <span className="text-3xl font-bold text-pink-400">{currentStepData.digits.length || '-'}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5">
                                    <span className="text-xs text-slate-500 uppercase tracking-widest mb-1">Complexity</span>
                                    <span className="text-2xl font-bold text-cyan-400">O(d)</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </main>

            <DSAExplanationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Armstrong Number"
                description="Determine if a number equals the sum of its own digits each raised to the power of the number of digits."
                concept="An Armstrong number (or narcissistic number) of 3 digits is an integer such that the sum of the cubes of its digits is equal to the number itself. For example, 371 is an Armstrong number because 3³ + 7³ + 1³ = 371."
                efficiency="The algorithm extracts each digit, calculates its power, and adds it to a sum. This is a linear process relative to the number of digits."
                useCases={[
                    "Number theory exploration",
                    "Computer science education for basic loops",
                    "Input validation and digit manipulation practice"
                ]}
                timeComplexity="O(d)"
                spaceComplexity="O(d)"
                complexityNotes="d = Number of digits in the number"
                interviewTips={[
                    "Clarify the definition of Armstrong numbers for different digit counts (power of N).",
                    "Discuss efficient ways to extract digits (modulo vs string conversion).",
                    "Mention potential overflow issues with very large numbers."
                ]}
                color="purple"
            />
        </div>
    );
};

export default ArmstrongVisualizer;
