'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Edit3 } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ArmstrongVisualizer = () => {
    // Initial number to check
    const [inputNumber, setInputNumber] = useState(153);
    const [isEditing, setIsEditing] = useState(false);
    const [tempInput, setTempInput] = useState('153');

    // Generate steps for the current number
    const generateSteps = (num: number) => {
        const numStr = num.toString();
        const digits = numStr.split('').map(Number);
        const numDigits = digits.length;

        const steps = [
            {
                description: `Starting: Check if ${num} is an Armstrong number`,
                stage: 'init',
                number: num,
                digits: [] as number[],
                numDigits: 0,
                powers: [] as number[],
                sum: 0,
                highlightDigit: null as number | null,
                currentDigit: null as number | null,
                currentPower: null as number | null,
                isArmstrong: null as boolean | null,
                completed: false,
                jsLine: 0,
                pyLine: 0
            },
            {
                description: `Extract digits from ${num}: [${digits.join(', ')}]`,
                stage: 'extract',
                number: num,
                digits: digits,
                numDigits: numDigits,
                powers: [] as number[],
                sum: 0,
                highlightDigit: null,
                currentDigit: null,
                currentPower: null,
                isArmstrong: null,
                completed: false,
                jsLine: 2,
                pyLine: 2
            },
            {
                description: `Count number of digits: ${numDigits}`,
                stage: 'count',
                number: num,
                digits: digits,
                numDigits: numDigits,
                powers: [] as number[],
                sum: 0,
                highlightDigit: null,
                currentDigit: null,
                currentPower: null,
                isArmstrong: null,
                completed: false,
                jsLine: 3,
                pyLine: 3
            }
        ];

        // Add steps for each digit calculation
        let runningSum = 0;
        digits.forEach((digit, idx) => {
            const power = Math.pow(digit, numDigits);
            runningSum += power;

            steps.push({
                description: `Calculate ${digit}^${numDigits} = ${power}`,
                stage: 'calculate',
                number: num,
                digits: digits,
                numDigits: numDigits,
                powers: digits.slice(0, idx + 1).map(d => Math.pow(d, numDigits)),
                currentDigit: digit,
                currentPower: power,
                highlightDigit: idx,
                sum: runningSum,
                isArmstrong: null,
                completed: false,
                jsLine: 5,
                pyLine: 5
            });
        });

        // Final comparison
        const isArmstrong = runningSum === num;
        steps.push({
            description: `Sum = ${runningSum}. ${isArmstrong ? `${runningSum} = ${num}. ✓ Armstrong Number!` : `${runningSum} ≠ ${num}. ✗ Not an Armstrong Number`}`,
            stage: 'result',
            number: num,
            digits: digits,
            numDigits: numDigits,
            powers: digits.map(d => Math.pow(d, numDigits)),
            sum: runningSum,
            isArmstrong: isArmstrong,
            completed: true,
            highlightDigit: null,
            currentDigit: null,
            currentPower: null,
            jsLine: 8,
            pyLine: 7
        });

        return steps;
    };

    const [steps, setSteps] = useState(generateSteps(inputNumber));
    const [currentStep, setCurrentStep] = useState(0);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');

    const currentStepData = steps[currentStep];

    // JavaScript code
    const jsCode = [
        "function isArmstrong(num) {",
        "  const numStr = num.toString();",
        "  const digits = numStr.split('').map(Number);",
        "  const numDigits = digits.length;",
        "  let sum = 0;",
        "  for (let digit of digits) {",
        "    sum += Math.pow(digit, numDigits);",
        "  }",
        "  return sum === num;",
        "}"
    ];

    // Python code
    const pyCode = [
        "def is_armstrong(num):",
        "    num_str = str(num)",
        "    digits = [int(d) for d in num_str]",
        "    num_digits = len(digits)",
        "    total = 0",
        "    for digit in digits:",
        "        total += digit ** num_digits",
        "    return total == num"
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
        }, 1500);
    };

    const handleNumberChange = () => {
        const newNum = parseInt(tempInput);
        if (!isNaN(newNum) && newNum > 0 && newNum < 1000000) {
            setInputNumber(newNum);
            const newSteps = generateSteps(newNum);
            setSteps(newSteps);
            setCurrentStep(0);
            setIsEditing(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleNumberChange();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <Header />
            <div className="pt-24 pb-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 min-h-screen">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Armstrong Number Checker</h1>
                        <p className="text-purple-300">Visual Step-by-Step Algorithm</p>

                        {/* Number Input */}
                        <div className="mt-6 flex items-center justify-center gap-3">
                            {isEditing ? (
                                <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-xl backdrop-blur-sm border border-purple-500/50">
                                    <input
                                        type="number"
                                        value={tempInput}
                                        onChange={(e) => setTempInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="px-4 py-2 rounded-lg bg-slate-900 text-white border border-purple-500 focus:outline-none focus:border-pink-500 w-32"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleNumberChange}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg shadow-green-600/20"
                                    >
                                        Check
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
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-purple-600/30"
                                    >
                                        <Edit3 size={18} />
                                        <span>Change</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Visualization */}
                        <div className="space-y-6">
                            {/* Number Breakdown */}
                            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                                <h2 className="text-xl font-semibold text-white mb-4">Number Breakdown</h2>
                                <div className="text-center py-4">
                                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                                        {currentStepData.number}
                                    </div>
                                    <div className="text-sm text-purple-300 font-medium uppercase tracking-wider">
                                        {currentStepData.numDigits > 0 && `${currentStepData.numDigits} digit${currentStepData.numDigits > 1 ? 's' : ''}`}
                                    </div>
                                </div>
                            </div>

                            {/* Digits Visualization */}
                            {currentStepData.digits.length > 0 && (
                                <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                                    <h2 className="text-xl font-semibold text-white mb-6">Power Calculation</h2>
                                    <div className="flex flex-wrap gap-4 justify-center">
                                        {currentStepData.digits.map((digit, idx) => (
                                            <div
                                                key={idx}
                                                className={`
                          relative flex flex-col items-center p-4 rounded-xl transition-all duration-300 min-w-[5rem]
                          ${idx === currentStepData.highlightDigit
                                                        ? 'bg-yellow-500 text-slate-900 scale-110 shadow-lg shadow-yellow-500/50 z-10'
                                                        : currentStepData.powers[idx] !== undefined
                                                            ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                                                            : 'bg-slate-700 text-slate-300'
                                                    }
                        `}
                                            >
                                                <span className="text-[10px] uppercase font-bold opacity-60 mb-1">Index {idx}</span>
                                                <div className="flex items-start">
                                                    <span className="text-3xl font-bold">{digit}</span>
                                                    {currentStepData.numDigits > 0 && (
                                                        <span className="text-xs font-bold -mt-0.5 ml-0.5 opacity-80">
                                                            {currentStepData.numDigits}
                                                        </span>
                                                    )}
                                                </div>

                                                {currentStepData.powers[idx] !== undefined && (
                                                    <div className="mt-2 pt-2 border-t border-white/20 w-full text-center">
                                                        <span className="text-lg font-bold">
                                                            {currentStepData.powers[idx]}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Legend */}
                                    {currentStepData.stage === 'calculate' && (
                                        <div className="flex gap-6 justify-center mt-8 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                                </span>
                                                <span className="text-white">Calculating</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                                <span className="text-white">Calculated</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-slate-700 rounded-full"></div>
                                                <span className="text-slate-400">Pending</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Current Calculation Detail */}
                            {currentStepData.stage === 'calculate' && (
                                <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                                    <h2 className="text-xl font-semibold text-white mb-4">Current Step</h2>
                                    <div className="bg-slate-900 rounded-lg p-6 border border-slate-700/50">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-yellow-400 mb-2 font-mono">
                                                {currentStepData.currentDigit}^{currentStepData.numDigits} = {currentStepData.currentPower}
                                            </div>
                                            <div className="text-slate-400 text-sm mt-3 flex justify-center items-center gap-2">
                                                Current Running Sum: <span className="text-white font-bold text-lg">{currentStepData.sum}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Sum Verification */}
                            {currentStepData.sum > 0 && (
                                <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                                    <h2 className="text-xl font-semibold text-white mb-4">Sum Verification</h2>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                                            <span className="text-purple-300 font-medium">Total Sum of Powers</span>
                                            <span className="text-white font-mono font-bold text-2xl">{currentStepData.sum}</span>
                                        </div>

                                        {currentStepData.stage === 'result' && (
                                            <div className="flex justify-between items-center p-4 bg-slate-700/50 rounded-lg border border-slate-600/50">
                                                <span className="text-purple-300 font-medium">Original Number</span>
                                                <span className="text-white font-mono font-bold text-2xl">{currentStepData.number}</span>
                                            </div>
                                        )}

                                        {currentStepData.powers.length > 0 && (
                                            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700/50 mt-4">
                                                <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Equation</p>
                                                <p className="text-white font-mono text-base break-all leading-relaxed">
                                                    {currentStepData.powers.join(' + ')} = <span className="text-green-400 font-bold">{currentStepData.sum}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Code & Controls */}
                        <div className="space-y-6">
                            {/* Code Display */}
                            <div className="bg-slate-800 rounded-xl p-6 shadow-xl border border-slate-700">
                                <div className="flex justify-between items-center mb-4">
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
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-indigo-500/10 rounded-lg">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white mb-2">Current Step</h2>
                                        <p className="text-purple-200 text-lg leading-relaxed">{currentStepData.description}</p>
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
                                            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300 ease-out"
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
                                        <div className="p-4 bg-purple-600 text-white rounded-full group-hover:bg-purple-500 transition-all transform hover:scale-110 shadow-lg shadow-purple-500/30">
                                            <Play size={28} className="ml-1" />
                                        </div>
                                        <span className="text-xs text-purple-400 font-medium">Play</span>
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

                                {/* Result Badge */}
                                {currentStepData.completed && (
                                    <div className={`mt-6 p-6 rounded-xl text-center border-2 animate-in zoom-in-50 duration-300 ${currentStepData.isArmstrong
                                        ? 'bg-green-500/10 border-green-500/50'
                                        : 'bg-red-500/10 border-red-500/50'
                                        }`}>
                                        <p className={`font-black text-2xl mb-2 ${currentStepData.isArmstrong ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            {currentStepData.isArmstrong ? 'Armstrong Number Confirmed!' : 'Not an Armstrong Number'}
                                        </p>
                                        <div className={`text-base font-mono inline-block px-3 py-1 rounded bg-black/20 ${currentStepData.isArmstrong ? 'text-green-300' : 'text-red-300'
                                            }`}>
                                            {currentStepData.sum} {currentStepData.isArmstrong ? '=' : '≠'} {currentStepData.number}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Examples & Info */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Algorithm Info */}
                        <div className="bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700">
                            <h2 className="text-xl font-semibold text-white mb-4">About Armstrong Numbers</h2>
                            <div className="text-purple-200 space-y-4 text-sm leading-relaxed">
                                <p>
                                    An <strong className="text-purple-100">Armstrong number</strong> (also known as a narcissistic number) is a number that is the sum of its own digits each raised to the power of the number of digits.
                                </p>
                                <div className="bg-slate-900/60 p-4 rounded-lg border border-purple-500/20">
                                    <p className="font-mono text-purple-300 mb-2 font-bold">Example: 153</p>
                                    <p className="font-mono text-slate-300">
                                        1³ + 5³ + 3³ = 1 + 125 + 27 = <span className="text-green-400 font-bold">153</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Examples */}
                        <div className="bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700">
                            <h2 className="text-xl font-semibold text-white mb-4">Try These Numbers</h2>
                            <div className="grid grid-cols-3 gap-3">
                                {[0, 1, 153, 370, 371, 407, 1634, 9474, 123].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => {
                                            setInputNumber(num);
                                            setSteps(generateSteps(num));
                                            setCurrentStep(0);
                                            setTempInput(num.toString());
                                        }}
                                        className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-purple-600 
                    transition-all transform hover:scale-105 active:scale-95 font-mono text-sm border border-slate-600 hover:border-purple-400"
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

export default ArmstrongVisualizer;
