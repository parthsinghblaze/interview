'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause, Code, Info, HelpCircle, Hash, Target } from 'lucide-react';
import DSAExplanationModal from '../../components/DSAExplanationModal';
import Header from '../../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Step {
    description: string;
    currentIndex: number;
    map: { [key: number]: number };
    found: boolean;
    pair: number[];
    jsLine: number;
    pyLine: number;
    checkingComplement?: number;
}

const TwoSumVisualizer = () => {
    const [arrayInput, setArrayInput] = useState('2, 7, 11, 15, 3, 6');
    const [targetInput, setTargetInput] = useState('9');
    const [isPlaying, setIsPlaying] = useState(false);

    const generateSteps = (arrStr: string, targetStr: string): Step[] => {
        const arr = arrStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
        const targetVal = parseInt(targetStr);
        const steps: Step[] = [];
        const map: { [key: number]: number } = {};

        if (isNaN(targetVal)) return [{
            description: "Please enter a valid target number.",
            currentIndex: -1,
            map: {},
            found: false,
            pair: [],
            jsLine: 0,
            pyLine: 0
        }];

        // Initial setup
        steps.push({
            description: `Target sum is ${targetVal}. Start iterating through the array.`,
            currentIndex: -1,
            map: {},
            found: false,
            pair: [],
            jsLine: 2,
            pyLine: 2
        });

        for (let i = 0; i < arr.length; i++) {
            const currentNum = arr[i];
            const needed = targetVal - currentNum;

            // Step 1: Current inspection
            steps.push({
                description: `Checking index ${i}: Value is ${currentNum}. Complement needed: ${targetVal} - ${currentNum} = ${needed}`,
                currentIndex: i,
                map: { ...map },
                found: false,
                pair: [],
                checkingComplement: needed,
                jsLine: 4,
                pyLine: 4
            });

            // Step 2: Check map
            if (map[needed] !== undefined) {
                steps.push({
                    description: `Found! ${needed} exists in the map at index ${map[needed]}. Pair found: (${map[needed]}, ${i})`,
                    currentIndex: i,
                    map: { ...map },
                    found: true,
                    pair: [map[needed], i],
                    jsLine: 6,
                    pyLine: 6
                });
                return steps;
            }

            // Step 3: Add to map
            map[currentNum] = i;
            steps.push({
                description: `${needed} not found. Add current value ${currentNum} (index ${i}) to the map.`,
                currentIndex: i,
                map: { ...map },
                found: false,
                pair: [],
                jsLine: 8,
                pyLine: 7
            });
        }

        steps.push({
            description: "Finished entire array. No pair found that adds up to the target.",
            currentIndex: arr.length,
            map: { ...map },
            found: false,
            pair: [],
            jsLine: 10,
            pyLine: 8
        });

        return steps;
    };

    const [steps, setSteps] = useState<Step[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setSteps(generateSteps(arrayInput, targetInput));
        setCurrentStep(0);
        setIsPlaying(false);
    }, [arrayInput, targetInput]);

    const currentStepData = steps[currentStep] || {
        description: "Initializing...",
        currentIndex: -1,
        map: {},
        found: false,
        pair: [],
        jsLine: 0,
        pyLine: 0
    };

    const parsedArray = arrayInput.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    const parsedTarget = parseInt(targetInput);

    const jsCode = [
        "function twoSum(nums, target) {",
        "  const prevValues = {};",
        "  for (let i = 0; i < nums.length; i++) {",
        "    const complement = target - nums[i];",
        "    if (prevValues[complement] !== undefined) {",
        "      return [prevValues[complement], i];",
        "    }",
        "    prevValues[nums[i]] = i;",
        "  }",
        "}"
    ];

    const pyCode = [
        "def two_sum(nums, target):",
        "    prev_map = {}",
        "    for i, n in enumerate(nums):",
        "        diff = target - n",
        "        if diff in prev_map:",
        "            return [prev_map[diff], i]",
        "        prev_map[n] = i",
        "    return []"
    ];

    const code = language === 'javascript' ? jsCode : pyCode;
    const currentLine = language === 'javascript' ? currentStepData.jsLine : currentStepData.pyLine;

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
            interval = setInterval(() => {
                setCurrentStep(prev => {
                    if (prev >= steps.length - 1) {
                        setIsPlaying(false);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);
        } else if (currentStep >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps.length]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <div className="h-screen bg-slate-950 text-white overflow-hidden flex flex-col font-sans">
            <Header />

            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black pt-20 pb-6 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

                <div className="h-full w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 relative z-10">

                    {/* Controls & Code */}
                    <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                    Two Sum
                                </h1>
                                <button onClick={() => setIsModalOpen(true)} className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                                    <HelpCircle size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                                            <Target size={12} className="text-emerald-400" /> Target Sum
                                        </span>
                                    </div>
                                    <input
                                        type="number"
                                        value={targetInput}
                                        onChange={(e) => setTargetInput(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xl font-bold text-emerald-400 outline-none focus:border-emerald-500/50 transition-all"
                                        placeholder="Enter target..."
                                    />
                                </div>

                                <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-2">
                                        Input Array (Comma Separated)
                                    </span>
                                    <input
                                        type="text"
                                        value={arrayInput}
                                        onChange={(e) => setArrayInput(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2 font-mono text-sm text-white outline-none focus:border-blue-500/50 transition-all"
                                        placeholder="e.g. 2, 7, 11, 15"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                <button onClick={handleReset} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center justify-center"><RotateCcw size={20} /></button>
                                <button onClick={handlePrevious} disabled={currentStep === 0} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"><ChevronLeft size={24} /></button>
                                <button onClick={togglePlay} disabled={currentStepData.found} className={`p-3 rounded-xl ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-emerald-900/20`}>
                                    {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                                </button>
                                <button onClick={handleNext} disabled={currentStepData.found} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"><ChevronRight size={24} /></button>
                            </div>
                        </div>

                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex-1 flex flex-col min-h-[300px]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <Code size={18} />
                                    <h3 className="font-bold text-sm uppercase tracking-wider">Implementation</h3>
                                </div>
                                <div className="flex bg-slate-800 rounded p-1">
                                    <button className={`px-2 py-0.5 text-[10px] rounded ${language === 'javascript' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`} onClick={() => setLanguage('javascript')}>JS</button>
                                    <button className={`px-2 py-0.5 text-[10px] rounded ${language === 'python' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`} onClick={() => setLanguage('python')}>PY</button>
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
                                                backgroundColor: lineNumber === currentLine ? 'rgba(16, 185, 129, 0.15)' : undefined,
                                                display: 'block',
                                                width: '100%',
                                                borderLeft: lineNumber === currentLine ? '3px solid #10b981' : '3px solid transparent'
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
                    <div className="flex flex-col gap-6 overflow-hidden">

                        {/* Status Message */}
                        <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6">
                            <motion.div
                                key={currentStepData.description}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 text-emerald-100 italic"
                            >
                                <div className="p-2 bg-emerald-500/20 rounded-full"><Info size={20} className="text-emerald-400" /></div>
                                <span className="text-lg">{currentStepData.description}</span>
                            </motion.div>
                        </div>

                        <div className="flex-1 grid grid-rows-[1fr_200px] gap-6 overflow-hidden">
                            {/* Array Visualizer */}
                            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center relative">
                                <div className="text-xs text-slate-500 uppercase tracking-widest mb-8">Array Traversal</div>
                                <div className="flex gap-4">
                                    {parsedArray.map((val: number, idx: number) => {
                                        const isCurrent = idx === currentStepData.currentIndex;
                                        const isPair = currentStepData.pair.includes(idx);
                                        const isVisited = idx < currentStepData.currentIndex && !isPair;

                                        return (
                                            <motion.div
                                                key={idx}
                                                animate={{
                                                    scale: isCurrent ? 1.2 : (isPair ? 1.15 : 1),
                                                    y: isCurrent ? -10 : 0
                                                }}
                                                className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 text-xl font-bold transition-colors ${isPair ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]' :
                                                    isCurrent ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]' :
                                                        isVisited ? 'bg-slate-800/50 border-white/5 text-slate-600' :
                                                            'bg-slate-800 border-white/10 text-slate-300'
                                                    }`}
                                            >
                                                {val}
                                                {isCurrent && <div className="absolute -top-10 text-[10px] font-black text-blue-400">CHECKING</div>}
                                                {isPair && <div className="absolute -top-10 text-[10px] font-black text-emerald-400">MATCH!</div>}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Hash Map Visualizer */}
                            <div className="bg-slate-900/70 border border-white/10 rounded-3xl p-6 flex flex-col">
                                <div className="flex items-center gap-2 mb-4">
                                    <Hash size={16} className="text-emerald-400" />
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Hash Map (Previous Values)</h4>
                                </div>
                                <div className="flex-1 flex gap-3 overflow-x-auto custom-scrollbar items-center">
                                    {Object.entries(currentStepData.map).length === 0 ? (
                                        <div className="text-slate-600 text-sm italic w-full text-center">Map is currently empty...</div>
                                    ) : (
                                        Object.entries(currentStepData.map).map(([key, value]) => (
                                            <motion.div
                                                key={key}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className={`flex flex-col items-center gap-1 min-w-[80px] p-3 rounded-xl border border-white/5 bg-slate-800/50 ${Number(key) === currentStepData.checkingComplement ? 'border-emerald-500 ring-2 ring-emerald-500/20' : ''
                                                    }`}
                                            >
                                                <div className="text-xs text-slate-500 font-mono">key: <span className="text-white font-bold">{key}</span></div>
                                                <div className="text-xs text-slate-500 font-mono">val: <span className="text-emerald-400 font-bold">{value}</span></div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <DSAExplanationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Two Sum Algorithm"
                description="The most efficient way to find a pair of numbers in an array that add up to a specific target."
                concept="Using a Hash Map (Object/Map), we store each number we've visited as a key and its index as the value. For every new number, we check if its 'complement' (Target - Current) already exists in our map. This transforms a potential O(n²) nested loop into a single O(n) pass."
                efficiency="By trading a bit of memory (Space O(n)) we achieve optimal time complexity (Time O(n))."
                useCases={[
                    "Finding matching pairs in transaction history",
                    "Stock market analysis for buy/sell pairs",
                    "Database query optimization for joined results"
                ]}
                timeComplexity="O(n)"
                spaceComplexity="O(n)"
                complexityNotes="One-pass hash table approach"
                interviewTips={[
                    "Mention the trade-off between nested loops (O(n²)) and Hash Map (O(n)).",
                    "Always ask if the array is sorted (if so, two pointers is O(1) space).",
                    "Consider edge cases like negative numbers or duplicate values."
                ]}
                color="green"
            />
        </div>
    );
};

export default TwoSumVisualizer;
