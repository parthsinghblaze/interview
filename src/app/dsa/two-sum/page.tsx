'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause, Code, Info, HelpCircle, Hash, Target, Search, ArrowRight, Database } from 'lucide-react';
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

    // Sound Effects
    const playTone = (freq: number, type: 'sine' | 'square' | 'triangle' = 'sine', duration: number = 0.1) => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.onended = () => ctx.close();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            console.error("Audio play failed", e);
        }
    };

    useEffect(() => {
        if ((!isPlaying && currentStep === 0) || currentStep >= steps.length) return;

        const interval = setInterval(() => {
            if (isPlaying && currentStep < steps.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else if (currentStep >= steps.length - 1) {
                setIsPlaying(false);
            }
        }, 1000);

        // Sound Triggers
        if (isPlaying || currentStep > 0) {
            const step = steps[currentStep] as any;
            if (step.description.includes('Found!')) {
                // Success Pair Found
                playTone(600, 'sine', 0.1);
                setTimeout(() => playTone(800, 'sine', 0.2), 100);
            } else if (step.description.includes('not found')) {
                // Added to map
                playTone(200, 'square', 0.05);
            } else if (step.found === false && step.currentIndex !== -1) {
                // Just checking
                playTone(300, 'sine', 0.05);
            }
        }

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps]);

    const togglePlay = () => setIsPlaying(!isPlaying);

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
                    <div className="flex flex-col gap-6">

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

                        <div className="flex flex-col gap-6 overflow-visible">
                            {/* Array Visualizer */}
                            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-4 md:p-8 flex flex-col items-center justify-center relative min-h-[250px] shadow-2xl">
                                <div className="absolute top-4 left-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Memory Array (Reading)</div>
                                <div className="w-full overflow-visible pt-16 pb-6 custom-scrollbar">
                                    <div className="flex gap-4 justify-start md:justify-center min-w-max px-4">
                                        {parsedArray.map((val: number, idx: number) => {
                                            const isCurrent = idx === currentStepData.currentIndex;
                                            const isPair = currentStepData.pair.includes(idx);
                                            const isVisited = idx < currentStepData.currentIndex && !isPair;

                                            return (
                                                <motion.div
                                                    key={idx}
                                                    layout
                                                    animate={{
                                                        scale: isCurrent ? 1.25 : (isPair ? 1.15 : 1),
                                                        y: isCurrent ? -10 : 0
                                                    }}
                                                    className={`w-14 md:w-20 h-14 md:h-20 rounded-2xl flex items-center justify-center border-2 text-xl md:text-2xl font-black transition-all duration-500 relative ${isPair ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]' :
                                                        isCurrent ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]' :
                                                            isVisited ? 'bg-slate-800/30 border-white/5 text-slate-700' :
                                                                'bg-slate-800 border-slate-700 text-slate-300'
                                                        }`}
                                                >
                                                    {val}
                                                    {isCurrent && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="absolute -top-12 px-3 py-1 bg-blue-500 text-white text-[10px] whitespace-nowrap font-black rounded-lg shadow-lg shadow-blue-500/20"
                                                        >
                                                            NOW CHECKING
                                                        </motion.div>
                                                    )}
                                                    {isPair && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute -top-12 px-3 py-1 bg-emerald-500 text-white text-[10px] whitespace-nowrap font-black rounded-lg shadow-lg shadow-emerald-500/20"
                                                        >
                                                            PAIR FOUND!
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* New Thinking Engine Hub */}
                            {currentStepData.currentIndex >= 0 && !currentStepData.found && (
                                <div className="flex flex-col items-center gap-6 py-6">
                                    {/* 3-Step Algorithm Path */}
                                    <div className="flex items-center gap-4 mb-2">
                                        {[
                                            { label: '1. READ', active: true, color: 'text-blue-400' },
                                            { label: '2. COMPUTE', active: true, color: 'text-emerald-400' },
                                            { label: '3. LOOKUP', active: true, color: 'text-purple-400' }
                                        ].map((step, i) => (
                                            <React.Fragment key={i}>
                                                <div className={`px-3 py-1 rounded-full text-[9px] font-black border ${step.active ? 'bg-slate-900 border-white/20 ' + step.color : 'bg-slate-950 border-white/5 text-slate-700'
                                                    }`}>
                                                    {step.label}
                                                </div>
                                                {i < 2 && <div className="w-4 h-px bg-slate-800" />}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-4 bg-slate-900 border border-slate-800 px-10 py-8 rounded-[3rem] shadow-2xl relative overflow-hidden group"
                                    >
                                        {/* Internal Scanning Glow */}
                                        <motion.div
                                            animate={{ x: [-500, 500] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent pointer-events-none"
                                        />

                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Step 1: Get Value</span>
                                            <div className="text-4xl font-black text-blue-400">{parsedArray[currentStepData.currentIndex]}</div>
                                        </div>

                                        <div className="text-3xl font-bold text-slate-700 mx-4">→</div>

                                        <div className="flex flex-col items-center relative">
                                            <div className="absolute -top-12 px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[9px] font-black tracking-widest shadow-lg shadow-emerald-500/20 animate-bounce">
                                                WHAT DO WE NEED?
                                            </div>
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Step 2: Subtraction</span>
                                            <div className="text-4xl font-black text-emerald-400">
                                                {parsedTarget} - {parsedArray[currentStepData.currentIndex]} = <span className="underline decoration-wavy">{currentStepData.checkingComplement}</span>
                                            </div>
                                        </div>

                                        <div className="text-3xl font-bold text-slate-700 mx-4">→</div>

                                        <div className="flex flex-col items-center">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Step 3: Map Check</span>
                                            <div className="p-3 bg-slate-800 rounded-2xl border border-white/5">
                                                <Search className="text-slate-400 animate-pulse" size={24} />
                                            </div>
                                        </div>
                                    </motion.div>

                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Checking Memory For {currentStepData.checkingComplement}...</span>
                                        <motion.div
                                            animate={{ y: [0, 8, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="text-emerald-500/50"
                                        >
                                            <ArrowRight size={32} className="rotate-90" />
                                        </motion.div>
                                    </div>
                                </div>
                            )}

                            {/* Hash Map Visualizer */}
                            <div className="bg-slate-900 border-2 border-slate-800 rounded-[3rem] p-10 flex flex-col relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                                <div className="absolute top-6 right-10 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">O(1) Instant Lookup</span>
                                </div>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                        <Database size={24} className="text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black uppercase tracking-tight text-white leading-none">The Hash Map</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Our algorithmic memory</p>
                                    </div>
                                </div>
                                <div className="flex-1 flex gap-4 overflow-x-auto px-4 py-6 custom-scrollbar items-center min-h-[120px]">
                                    <AnimatePresence>
                                        {Object.entries(currentStepData.map).length === 0 ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-slate-600 text-sm font-medium italic w-full text-center flex flex-col items-center gap-2"
                                            >
                                                <div className="w-12 h-1 bg-slate-800 rounded-full" />
                                                No numbers seen yet. Storing history to avoid nested loops...
                                            </motion.div>
                                        ) : (
                                            Object.entries(currentStepData.map).map(([key, value]) => {
                                                const isNeeded = Number(key) === currentStepData.checkingComplement;
                                                return (
                                                    <motion.div
                                                        key={key}
                                                        layout
                                                        initial={{ scale: 0.5, opacity: 0, x: -20 }}
                                                        animate={{
                                                            scale: isNeeded ? 1.15 : 1,
                                                            opacity: 1,
                                                            x: 0,
                                                            borderColor: isNeeded ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.05)',
                                                            backgroundColor: isNeeded ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.6)'
                                                        }}
                                                        className={`flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-2xl border transition-all duration-300 relative group shadow-xl`}
                                                    >
                                                        {isNeeded && (
                                                            <div className="absolute -top-3 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded-full shadow-lg shadow-emerald-500/20">
                                                                MATCH!
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mb-1">Value</span>
                                                            <span className={`text-xl font-black ${isNeeded ? 'text-emerald-400' : 'text-white'}`}>{key}</span>
                                                        </div>
                                                        <div className="w-full h-px bg-white/5" />
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter mb-1">Index</span>
                                                            <span className="text-sm font-bold text-slate-400">{value}</span>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })
                                        )}
                                    </AnimatePresence>
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
