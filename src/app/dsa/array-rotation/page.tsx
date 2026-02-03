'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Play,
    Pause,
    Edit3,
    Code,
    Info,
    Zap,
    MoveLeft,
    HelpCircle
} from 'lucide-react';
import DSAExplanationModal from '../../components/DSAExplanationModal';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ArrayRotationVisualizer = () => {
    // Initial State
    const [inputArray, setInputArray] = useState([1, 2, 3, 4, 5]);
    const [kValue, setKValue] = useState(2);
    const [rotationType, setRotationType] = useState<'right' | 'left' | 'optimized'>('right');
    const [isEditing, setIsEditing] = useState(false);
    const [tempArrayInput, setTempArrayInput] = useState('1, 2, 3, 4, 5');
    const [tempKInput, setTempKInput] = useState('2');
    const [isPlaying, setIsPlaying] = useState(false);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Step Generation
    const generateSteps = (arr: number[], k: number, type: 'right' | 'left' | 'optimized') => {
        const steps = [];
        const n = arr.length;
        const actualK = k % n;
        let currentArr = [...arr];

        if (type === 'right') {
            steps.push({
                description: `Initial Array: [${currentArr.join(', ')}], K = ${k} (${k} % ${n} = ${actualK} rotations)`,
                array: [...currentArr],
                movingIndex: -1,
                targetIndex: -1,
                highlighted: [],
                jsLine: 1,
                pyLine: 1
            });

            for (let i = 0; i < actualK; i++) {
                const lastIdx = currentArr.length - 1;
                const lastVal = currentArr[lastIdx];

                // Step: Pick last
                steps.push({
                    description: `Rotation ${i + 1}: Take last element ${lastVal}`,
                    array: [...currentArr],
                    movingIndex: lastIdx,
                    targetIndex: -1,
                    highlighted: [lastIdx],
                    jsLine: 3,
                    pyLine: 3
                });

                // Step: Move to front
                currentArr.pop();
                currentArr.unshift(lastVal);
                steps.push({
                    description: `Move ${lastVal} to the front`,
                    array: [...currentArr],
                    movingIndex: 0,
                    targetIndex: 0,
                    highlighted: [0],
                    jsLine: 4,
                    pyLine: 4
                });
            }
        } else if (type === 'left') {
            steps.push({
                description: `Initial Array: [${currentArr.join(', ')}], K = ${k} (${k} % ${n} = ${actualK} rotations)`,
                array: [...currentArr],
                movingIndex: -1,
                targetIndex: -1,
                highlighted: [],
                jsLine: 1,
                pyLine: 1
            });

            for (let i = 0; i < actualK; i++) {
                const firstVal = currentArr[0];

                // Step: Pick first
                steps.push({
                    description: `Rotation ${i + 1}: Take first element ${firstVal}`,
                    array: [...currentArr],
                    movingIndex: 0,
                    targetIndex: -1,
                    highlighted: [0],
                    jsLine: 3,
                    pyLine: 3
                });

                // Step: Move to end
                currentArr.shift();
                currentArr.push(firstVal);
                steps.push({
                    description: `Move ${firstVal} to the end`,
                    array: [...currentArr],
                    movingIndex: currentArr.length - 1,
                    targetIndex: currentArr.length - 1,
                    highlighted: [currentArr.length - 1],
                    jsLine: 4,
                    pyLine: 4
                });
            }
        } else {
            // Optimized Reversal
            steps.push({
                description: `Initial Array: [${currentArr.join(', ')}], K = ${k} (${k} % ${n} = ${actualK})`,
                array: [...currentArr],
                movingIndex: -1,
                targetIndex: -1,
                highlighted: [],
                jsLine: 1,
                pyLine: 1
            });

            // Reversal helper for steps
            const reverse = (l: number, r: number, desc: string, jsLine: number, pyLine: number) => {
                const subArr = currentArr.slice(l, r + 1).reverse();
                for (let i = 0; i < subArr.length; i++) {
                    currentArr[l + i] = subArr[i];
                }
                steps.push({
                    description: desc,
                    array: [...currentArr],
                    movingIndex: -1,
                    targetIndex: -1,
                    highlighted: Array.from({ length: r - l + 1 }, (_, i) => l + i),
                    jsLine,
                    pyLine
                });
            };

            reverse(0, n - 1, "Step 1: Reverse the entire array", 2, 7);
            reverse(0, actualK - 1, `Step 2: Reverse first K (${actualK}) elements`, 3, 8);
            reverse(actualK, n - 1, `Step 3: Reverse remaining ${n - actualK} elements`, 4, 9);
        }

        steps.push({
            description: `Rotation complete! Result: [${currentArr.join(', ')}]`,
            array: [...currentArr],
            movingIndex: -1,
            targetIndex: -1,
            highlighted: [],
            completed: true,
            jsLine: type === 'optimized' ? 5 : 6,
            pyLine: type === 'optimized' ? 10 : 5
        });

        return steps;
    };

    const [steps, setSteps] = useState(generateSteps(inputArray, kValue, rotationType));
    const [currentStep, setCurrentStep] = useState(0);

    const currentStepData = { ...steps[currentStep], completed: currentStep === steps.length - 1 };

    // Code Snippets
    const jsRight = [
        "function rotateRight(arr, k) {",
        "  k = k % arr.length;",
        "  for (let i = 0; i < k; i++) {",
        "    let last = arr.pop();",
        "    arr.unshift(last);",
        "  }",
        "  return arr;",
        "}"
    ];

    const jsLeft = [
        "function rotateLeft(arr, k) {",
        "  k = k % arr.length;",
        "  for (let i = 0; i < k; i++) {",
        "    let first = arr.shift();",
        "    arr.push(first);",
        "  }",
        "  return arr;",
        "}"
    ];

    const jsOptimized = [
        "function rotate(nums, k) {",
        "  k %= nums.length;",
        "  reverse(nums, 0, nums.length - 1);",
        "  reverse(nums, 0, k - 1);",
        "  reverse(nums, k, nums.length - 1);",
        "}"
    ];

    const pyRight = [
        "def rotate_right(nums, k):",
        "    k = k % len(nums)",
        "    for _ in range(k):",
        "        last = nums.pop()",
        "        nums.insert(0, last)",
        "    return nums"
    ];

    const pyLeft = [
        "def rotate_left(nums, k):",
        "    k = k % len(nums)",
        "    for _ in range(k):",
        "        first = nums.pop(0)",
        "        nums.append(first)",
        "    return nums"
    ];

    const pyOptimized = [
        "def rotate(nums, k):",
        "    n = len(nums)",
        "    k %= n",
        "    def rev(l, r):",
        "        while l < r:",
        "            nums[l], nums[r] = nums[r], nums[l]",
        "            l, r = l+1, r-1",
        "    rev(0, n-1)",
        "    rev(0, k-1)",
        "    rev(k, n-1)"
    ];

    const getCode = () => {
        if (rotationType === 'right') return language === 'javascript' ? jsRight : pyRight;
        if (rotationType === 'left') return language === 'javascript' ? jsLeft : pyLeft;
        return language === 'javascript' ? jsOptimized : pyOptimized;
    };

    const code = getCode();
    const currentLine = language === 'javascript' ? currentStepData.jsLine : currentStepData.pyLine;

    // Controls
    const handleNext = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const handlePrevious = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const handleReset = () => {
        setCurrentStep(0);
        setIsPlaying(false);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && currentStep < steps.length - 1) {
            interval = setInterval(handleNext, 1000);
        } else if (currentStep >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStep]);

    const handleInputChange = () => {
        const newArr = tempArrayInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        const newK = parseInt(tempKInput);
        if (newArr.length > 0 && !isNaN(newK)) {
            setInputArray(newArr);
            setKValue(newK);
            setSteps(generateSteps(newArr, newK, rotationType));
            setCurrentStep(0);
            setIsEditing(false);
            setIsPlaying(false);
        }
    };

    const handleTypeChange = (type: 'right' | 'left' | 'optimized') => {
        setRotationType(type);
        setSteps(generateSteps(inputArray, kValue, type));
        setCurrentStep(0);
        setIsPlaying(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-indigo-500/30">
            <Header />

            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black pt-20 pb-6 px-4 md:px-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

                <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 relative z-10">

                    {/* LEFT COLUMN: Controller & Code */}
                    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">

                        {/* 1. Controller Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                    Array Rotation
                                </h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-2 rounded-full bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                                        title="Algorithm Explanation"
                                    >
                                        <HelpCircle size={20} />
                                    </button>
                                    <div className="px-2 py-1 rounded bg-slate-800 border border-white/10 text-xs font-mono text-slate-400">
                                        v2.0
                                    </div>
                                </div>
                            </div>

                            {/* Mode Selection */}
                            <div className="flex bg-slate-800/50 p-1 rounded-xl mb-6 border border-white/5">
                                <button
                                    onClick={() => handleTypeChange('right')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${rotationType === 'right' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Right
                                </button>
                                <button
                                    onClick={() => handleTypeChange('left')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${rotationType === 'left' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Left
                                </button>
                                <button
                                    onClick={() => handleTypeChange('optimized')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${rotationType === 'optimized' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    Optimized
                                </button>
                            </div>

                            {/* Input Section */}
                            <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-slate-400 font-medium">Input Config</span>
                                    <Zap size={14} className={rotationType === 'optimized' ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} />
                                </div>

                                {isEditing ? (
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={tempArrayInput}
                                            onChange={(e) => setTempArrayInput(e.target.value)}
                                            placeholder="1, 2, 3, 4, 5"
                                            className="w-full bg-slate-900 border border-indigo-500/50 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono text-sm"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={tempKInput}
                                                onChange={(e) => setTempKInput(e.target.value)}
                                                placeholder="K"
                                                className="w-20 bg-slate-900 border border-indigo-500/50 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono text-sm"
                                            />
                                            <button
                                                onClick={handleInputChange}
                                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 font-medium transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between group cursor-pointer" onClick={() => setIsEditing(true)}>
                                        <div className="flex flex-col">
                                            <span className="text-xl font-bold font-mono tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                                                [{inputArray.join(', ')}]
                                            </span>
                                            <span className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">K = {kValue}</span>
                                        </div>
                                        <Edit3 className="text-slate-500 group-hover:text-white transition-colors" size={20} />
                                    </div>
                                )}
                            </div>

                            {/* Playback Controls */}
                            <div className="grid grid-cols-4 gap-2">
                                <button onClick={handleReset} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center justify-center"><RotateCcw size={20} /></button>
                                <button onClick={handlePrevious} disabled={currentStep === 0} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"><ChevronLeft size={24} /></button>
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    disabled={currentStepData.completed}
                                    className={`p-3 rounded-xl ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-indigo-900/20`}
                                >
                                    {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                                </button>
                                <button onClick={handleNext} disabled={currentStepData.completed} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"><ChevronRight size={24} /></button>
                            </div>

                            {/* Progress */}
                            <div className="mt-6">
                                <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                                    <span>Progress</span>
                                    <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Code Display */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex-1 flex flex-col min-h-[300px]">
                            <div className="flex items-center gap-2 mb-4 text-indigo-400">
                                <Code size={18} />
                                <h3 className="font-bold text-sm uppercase tracking-wider">Algorithm Code</h3>
                            </div>

                            <div className="relative flex-1 min-h-0 flex flex-col">
                                <div className="absolute top-0 right-0 p-2 z-10 w-full flex justify-end pointer-events-none">
                                    <div className="flex bg-slate-900/80 rounded p-1 border border-white/10 backdrop-blur-sm pointer-events-auto">
                                        <button className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${language === 'javascript' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`} onClick={() => setLanguage('javascript')}>JS</button>
                                        <button className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${language === 'python' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`} onClick={() => setLanguage('python')}>PY</button>
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
                                                const isCurrentLine = lineNumber === currentLine;
                                                return {
                                                    style: {
                                                        backgroundColor: isCurrentLine ? 'rgba(99, 102, 241, 0.15)' : undefined,
                                                        display: 'block',
                                                        width: '100%',
                                                        borderLeft: isCurrentLine ? '3px solid #6366f1' : '3px solid transparent',
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

                        {/* 1. Animation Stage */}
                        <div className="min-h-[500px] lg:flex-grow bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-4 md:p-8 relative overflow-visible flex flex-col items-center">
                            {/* Step Description */}
                            <div className="w-full text-center mb-8 relative z-20">
                                <motion.div
                                    key={currentStepData.description}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-block bg-slate-800/80 border border-indigo-500/30 rounded-2xl md:rounded-full px-4 md:px-6 py-2 shadow-lg"
                                >
                                    <p className="text-sm md:text-xl font-medium text-indigo-100 flex items-center gap-3">
                                        <Info size={18} className="text-indigo-400 shrink-0" />
                                        {currentStepData.description}
                                    </p>
                                </motion.div>
                            </div>

                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05),transparent_70%)] pointer-events-none"></div>

                            {/* Array Visualizer */}
                            <div className="flex-1 w-full flex items-center justify-center relative z-10 overflow-x-auto pt-10 pb-8 custom-scrollbar">
                                <div className="flex gap-4 min-w-max px-4">
                                    {(currentStepData.array as number[]).map((val, idx) => {
                                        const isHighlighted = ((currentStepData as any).highlighted || []).includes(idx);
                                        const isMoving = (currentStepData as any).movingIndex === idx;

                                        return (
                                            <motion.div
                                                key={idx}
                                                layout
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{
                                                    scale: isHighlighted || isMoving ? 1.15 : 1,
                                                    opacity: 1,
                                                }}
                                                className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 flex flex-col items-center justify-center shadow-2xl relative transition-all duration-300 ${isHighlighted
                                                    ? 'bg-indigo-600/30 border-indigo-400 border-dashed'
                                                    : isMoving
                                                        ? 'bg-amber-600/30 border-amber-400'
                                                        : 'bg-slate-800 border-white/5'}`}
                                            >
                                                <span className="text-2xl md:text-3xl font-bold font-mono text-white">{val}</span>
                                                <span className="absolute -bottom-6 text-[10px] text-slate-600 font-bold uppercase tracking-tighter">idx: {idx}</span>
                                                {isMoving && (
                                                    <motion.div
                                                        layoutId="zap"
                                                        className="absolute -top-10 text-amber-400"
                                                    >
                                                        <Zap size={24} fill="currentColor" />
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Completion Message */}
                            {(currentStepData as any).completed && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="mt-8 px-8 py-4 bg-green-500/10 border border-green-500/50 text-green-300 rounded-full font-bold text-xl shadow-lg relative z-20"
                                >
                                    Rotation Finished!
                                </motion.div>
                            )}
                        </div>

                        {/* 2. Stats Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl sticky bottom-4 lg:relative lg:bottom-0">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-xs text-slate-500 uppercase tracking-widest mb-1">Rotation</span>
                                    <span className="text-xl md:text-3xl font-bold text-indigo-400 capitalize">{rotationType}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-xs text-slate-500 uppercase tracking-widest mb-1">K Value</span>
                                    <span className="text-xl md:text-3xl font-bold text-purple-400">{kValue}</span>
                                </div>
                                <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-xs text-slate-500 uppercase tracking-widest mb-1">Complexity</span>
                                    <span className="text-lg md:text-2xl font-bold text-cyan-400">O({rotationType === 'optimized' ? 'n' : 'n·k'})</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <DSAExplanationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Array Rotation"
                description="Shift array elements by K positions using linear or optimized reversal techniques."
                concept="Rotation involves moving elements from the end to the front (Right Rotate) or front to end (Left Rotate). While simple shifting is easy to understand, the 'Reversal Algorithm' is the gold standard for performance."
                efficiency="The simple approach takes O(n*k) time if done element-by-element, or O(n) with O(n) space. The Reversal Algorithm achieves O(n) time with only O(1) extra space."
                useCases={[
                    "Circular buffers in low-level systems",
                    "Infinite scrolling carousels in UI development",
                    "Scheduling algorithms in operating systems"
                ]}
                timeComplexity="O(n)"
                spaceComplexity="O(1)"
                complexityNotes="n = array length, k = number of rotations"
                interviewTips={[
                    "Ask if the rotation should be in-place (memory constraints).",
                    "Always normalize K using k = k % n to handle cases where K > N.",
                    "The Reversal Algorithm (Reverse All -> Reverse first K -> Reverse Rest) is a common high-level interview question."
                ]}
                color="purple"
            />
        </div>
    );
};

export default ArrayRotationVisualizer;
