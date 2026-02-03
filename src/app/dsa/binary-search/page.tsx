'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause, Code, Info, HelpCircle, Search, Target, ArrowDown, ArrowUp } from 'lucide-react';
import DSAExplanationModal from '../../components/DSAExplanationModal';
import Header from '../../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
    description: string;
    low: number;
    high: number;
    mid: number;
    currentIndex: number;
    found: boolean;
    jsLine: number;
    pyLine: number;
    status: 'searching' | 'found' | 'not_found' | 'start';
}

const BinarySearchVisualizer = () => {
    const [arrayInput, setArrayInput] = useState('2, 5, 8, 12, 16, 23, 38, 56, 72, 91');
    const [targetInput, setTargetInput] = useState('23');
    const [isPlaying, setIsPlaying] = useState(false);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const generateSteps = (arrStr: string, targetStr: string): Step[] => {
        // Parse and sort the array because Binary Search requires a sorted array
        const arr = arrStr.split(',')
            .map(n => parseInt(n.trim()))
            .filter(n => !isNaN(n))
            .sort((a, b) => a - b);

        const targetVal = parseInt(targetStr);
        const steps: Step[] = [];

        if (isNaN(targetVal)) return [{
            description: "Please enter a valid target number.",
            low: 0,
            high: 0,
            mid: -1,
            currentIndex: -1,
            found: false,
            jsLine: 0,
            pyLine: 0,
            status: 'not_found'
        }];

        let low = 0;
        let high = arr.length - 1;

        // Initial setup step
        steps.push({
            description: `Searching for ${targetVal}. Initializing low = 0, high = ${high}.`,
            low,
            high,
            mid: -1,
            currentIndex: -1,
            found: false,
            jsLine: 2,
            pyLine: 2,
            status: 'start'
        });

        while (low <= high) {
            const mid = Math.floor((low + high) / 2);

            // Mid calculation step
            steps.push({
                description: `Calculate mid-point: mid = floor((low + high) / 2) = ${mid}. Inspecting value ${arr[mid]}.`,
                low,
                high,
                mid,
                currentIndex: mid,
                found: false,
                jsLine: 4,
                pyLine: 4,
                status: 'searching'
            });

            if (arr[mid] === targetVal) {
                // Found it step
                steps.push({
                    description: `Success! ${arr[mid]} matches the target value at index ${mid}.`,
                    low,
                    high,
                    mid,
                    currentIndex: mid,
                    found: true,
                    jsLine: 6,
                    pyLine: 6,
                    status: 'found'
                });
                return steps;
            }

            if (arr[mid] < targetVal) {
                // Move low step
                steps.push({
                    description: `${arr[mid]} is smaller than target ${targetVal}. Target must be in the right half. Update low = mid + 1.`,
                    low,
                    high,
                    mid,
                    currentIndex: mid,
                    found: false,
                    jsLine: 9,
                    pyLine: 8,
                    status: 'searching'
                });
                low = mid + 1;
            } else {
                // Move high step
                steps.push({
                    description: `${arr[mid]} is larger than target ${targetVal}. Target must be in the left half. Update high = mid - 1.`,
                    low,
                    high,
                    mid,
                    currentIndex: mid,
                    found: false,
                    jsLine: 11,
                    pyLine: 10,
                    status: 'searching'
                });
                high = mid - 1;
            }
        }

        // Not found step
        steps.push({
            description: `Scan complete: low (${low}) is now greater than high (${high}). Target not found in the array.`,
            low,
            high,
            mid: -1,
            currentIndex: -1,
            found: false,
            jsLine: 14,
            pyLine: 12,
            status: 'not_found'
        });

        return steps;
    };

    const [steps, setSteps] = useState<Step[]>([]);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        setSteps(generateSteps(arrayInput, targetInput));
        setCurrentStep(0);
        setIsPlaying(false);
    }, [arrayInput, targetInput]);

    const currentStepData = steps[currentStep] || {
        description: "Initializing...",
        low: 0,
        high: 0,
        mid: -1,
        currentIndex: -1,
        found: false,
        jsLine: 0,
        pyLine: 0,
        status: 'start'
    };

    const parsedArray = arrayInput.split(',')
        .map(n => parseInt(n.trim()))
        .filter(n => !isNaN(n))
        .sort((a, b) => a - b);

    const jsCode = [
        "function binarySearch(arr, target) {",
        "  let low = 0, high = arr.length - 1;",
        "  while (low <= high) {",
        "    let mid = Math.floor((low + high) / 2);",
        "    if (arr[mid] === target) {",
        "      return mid;",
        "    }",
        "    if (arr[mid] < target) {",
        "      low = mid + 1;",
        "    } else {",
        "      high = mid - 1;",
        "    }",
        "  }",
        "  return -1;",
        "}"
    ];

    const pyCode = [
        "def binary_search(arr, target):",
        "    low, high = 0, len(arr) - 1",
        "    while low <= high:",
        "        mid = (low + high) // 2",
        "        if arr[mid] == target:",
        "            return mid",
        "        elif arr[mid] < target:",
        "            low = mid + 1",
        "        else:",
        "            high = mid - 1",
        "    return -1"
    ];

    const code = language === 'javascript' ? jsCode : pyCode;
    const currentLine = language === 'javascript' ? currentStepData.jsLine : currentStepData.pyLine;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && currentStep < steps.length - 1) {
            interval = setInterval(() => {
                setCurrentStep(prev => prev + 1);
            }, 1000);
        } else {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps.length]);

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

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
            <Header />

            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pt-20 pb-6 px-4 md:px-6">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

                <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 relative z-10">

                    {/* Controls & Code */}
                    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    Binary Search
                                </h1>
                                <button onClick={() => setIsModalOpen(true)} className="p-2 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                                    <HelpCircle size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                                            <Target size={12} className="text-blue-400" /> Target Value
                                        </span>
                                    </div>
                                    <input
                                        type="number"
                                        value={targetInput}
                                        onChange={(e) => setTargetInput(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xl font-bold text-blue-400 outline-none focus:border-blue-500/50 transition-all"
                                        placeholder="Enter target..."
                                    />
                                </div>

                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">
                                        Sorted Input Array (Auto-sorted)
                                    </span>
                                    <input
                                        type="text"
                                        value={arrayInput}
                                        onChange={(e) => setArrayInput(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 font-mono text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                                        placeholder="e.g. 5, 12, 2, 8"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                <button onClick={handleReset} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center justify-center font-bold"><RotateCcw size={20} /></button>
                                <button onClick={handlePrevious} disabled={currentStep === 0} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center font-bold"><ChevronLeft size={24} /></button>
                                <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStepData.found} className={`p-3 rounded-xl ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-blue-900/20`}>
                                    {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                                </button>
                                <button onClick={handleNext} disabled={currentStepData.found || currentStep === steps.length - 1} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center font-bold"><ChevronRight size={24} /></button>
                            </div>
                        </div>

                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex-1 flex flex-col min-h-[350px]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-blue-400">
                                    <Code size={18} />
                                    <h3 className="font-bold text-sm uppercase tracking-wider">Implementation</h3>
                                </div>
                                <div className="flex bg-slate-800 rounded p-1">
                                    <button className={`px-2 py-0.5 text-[10px] rounded ${language === 'javascript' ? 'bg-blue-600 text-white' : 'text-slate-500'}`} onClick={() => setLanguage('javascript')}>JS</button>
                                    <button className={`px-2 py-0.5 text-[10px] rounded ${language === 'python' ? 'bg-blue-600 text-white' : 'text-slate-500'}`} onClick={() => setLanguage('python')}>PY</button>
                                </div>
                            </div>
                            <div className="flex-1 rounded-xl overflow-hidden border border-slate-700/50 bg-[#1e1e1e] relative">
                                <div className="absolute inset-0 overflow-auto custom-scrollbar">
                                    <SyntaxHighlighter
                                        language={language}
                                        style={atomDark}
                                        showLineNumbers={true}
                                        wrapLines={true}
                                        customStyle={{ margin: 0, padding: '1rem', backgroundColor: '#1e1e1e', fontSize: '0.85rem' }}
                                        lineProps={(lineNumber: number) => ({
                                            style: {
                                                backgroundColor: lineNumber === currentLine ? 'rgba(59, 130, 246, 0.15)' : undefined,
                                                display: 'block',
                                                width: '100%',
                                                borderLeft: lineNumber === currentLine ? '3px solid #3b82f6' : '3px solid transparent'
                                            }
                                        })}
                                    >
                                        {code.join('\n')}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visualization Area */}
                    <div className="flex flex-col gap-6">

                        {/* Status Message */}
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6">
                            <motion.div
                                key={currentStepData.description}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 text-blue-100 italic"
                            >
                                <div className="p-2 bg-blue-500/20 rounded-full"><Info size={20} className="text-blue-400" /></div>
                                <span className="text-lg">{currentStepData.description}</span>
                            </motion.div>
                        </div>

                        <div className="min-h-[400px] lg:flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-4 md:p-8 items-center justify-center relative overflow-visible">
                            <div className="text-xs text-slate-500 uppercase tracking-widest mb-12 relative z-20">Searching in Half-Intervals</div>

                            <div className="w-full overflow-x-auto pt-12 pb-8 custom-scrollbar">
                                <div className="flex gap-3 justify-start md:justify-center items-end min-w-max px-4 h-64 relative z-20">
                                    {parsedArray.map((val: number, idx: number) => {
                                        const isMid = idx === currentStepData.mid;
                                        const isLow = idx === currentStepData.low;
                                        const isHigh = idx === currentStepData.high;
                                        const inRange = idx >= currentStepData.low && idx <= currentStepData.high;
                                        const isTarget = currentStepData.found && idx === currentStepData.currentIndex;

                                        return (
                                            <div key={idx} className="flex flex-col items-center gap-4 relative">
                                                {/* Pointers */}
                                                <div className="h-20 flex flex-col justify-end gap-1">
                                                    {isMid && (
                                                        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center">
                                                            <span className="text-[10px] font-black text-amber-400 uppercase">Mid</span>
                                                            <ArrowDown size={14} className="text-amber-400" />
                                                        </motion.div>
                                                    )}
                                                    <div className="flex gap-2">
                                                        {isLow && (
                                                            <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-center">
                                                                <span className="text-[8px] font-black text-emerald-400 uppercase">L</span>
                                                                <ArrowDown size={10} className="text-emerald-400" />
                                                            </motion.div>
                                                        )}
                                                        {isHigh && (
                                                            <motion.div initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col items-center">
                                                                <span className="text-[8px] font-black text-rose-400 uppercase">H</span>
                                                                <ArrowDown size={10} className="text-rose-400" />
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Bar/Box */}
                                                <motion.div
                                                    animate={{
                                                        scale: isMid ? 1.2 : 1,
                                                        opacity: inRange ? 1 : 0.2
                                                    }}
                                                    className={`w-14 md:w-16 h-16 rounded-2xl flex items-center justify-center border-2 text-xl font-bold transition-all duration-300 ${isTarget ? 'bg-blue-500 border-blue-300 text-white shadow-[0_0_30px_rgba(59,130,246,0.6)]' :
                                                        isMid ? 'bg-amber-500/20 border-amber-500 text-amber-400' :
                                                            inRange ? 'bg-slate-800 border-blue-500/30 text-slate-200' :
                                                                'bg-slate-900 border-white/5 text-slate-700'
                                                        }`}
                                                >
                                                    {val}
                                                </motion.div>

                                                <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Background decoration */}
                            <div className="absolute top-1/2 left-0 w-full h-px bg-blue-500/10 pointer-events-none"></div>
                        </div>

                        {/* Complexity Stats */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-4">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Time Complexity</span>
                                    <span className="text-xl md:text-2xl font-black text-blue-400">O(log n)</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-4">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Space Complexity</span>
                                    <span className="text-xl md:text-2xl font-black text-cyan-400">O(1)</span>
                                </div>
                                <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-4">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Status</span>
                                    <span className={`text-xs md:text-sm font-black uppercase tracking-widest ${currentStepData.status === 'found' ? 'text-emerald-400' :
                                        currentStepData.status === 'not_found' ? 'text-rose-400' :
                                            'text-amber-400'
                                        }`}>{currentStepData.status.replace('_', ' ')}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <DSAExplanationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Binary Search Algorithm"
                description="The ultimate efficient search method for sorted datasets."
                concept="Instead of checking every element one by one (Linear Search), Binary Search looks at the middle element. If the target is smaller, it discards the right half. If the target is larger, it discards the left half. It repeats this until the element is found or the range is empty."
                efficiency="With a time complexity of O(log n), Binary Search is incredibly fast. For example, to search through 4 billion items, it only takes at most 32 comparisons!"
                useCases={[
                    "Searching in sorted databases",
                    "Finding values in an array with millions of records",
                    "Implementing 'Auto-correct' or dictionary suggestions",
                    "Game development for quick range checks"
                ]}
                timeComplexity="O(log n)"
                spaceComplexity="O(1)"
                complexityNotes="Logarithmic time means the search time increases very slowly as the input size grows."
                interviewTips={[
                    "CRITICAL: Always mention the array MUST BE SORTED first.",
                    "Mention that it's a 'Divide and Conquer' strategy.",
                    "Be prepared to explain the difference between iterative and recursive implementations.",
                    "Common edge case: When calculates mid, use 'low + (high - low) / 2' in languages with fixed integer sizes to avoid overflow."
                ]}
                color="blue"
            />
        </div>
    );
};

export default BinarySearchVisualizer;
