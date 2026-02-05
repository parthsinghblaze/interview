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
    Zap,
    Info,
    HelpCircle,
    Search,
    Database,
    Binary,
    ArrowRight,
    ChevronDown,
    Hash
} from 'lucide-react';
import Header from '../../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DSAExplanationModal from '../../components/DSAExplanationModal';

const NumberFrequencyVisualizer = () => {
    // Initial State
    const [arrayN, setArrayN] = useState([5, 3, 2, 2, 1, 5, 5, 1, 5, 10]);
    const [arrayM, setArrayM] = useState([10, 11, 1, 9, 5]);
    const [mode, setMode] = useState<'brute' | 'optimal' | 'map'>('map'); // Default to Map as requested
    const [isEditing, setIsEditing] = useState(false);
    const [tempNInput, setTempNInput] = useState('5, 3, 2, 2, 1, 5, 5, 1, 5, 10');
    const [tempMInput, setTempMInput] = useState('10, 11, 1, 9, 5');
    const [isPlaying, setIsPlaying] = useState(false);
    const [language, setLanguage] = useState<'javascript' | 'python'>('python');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Step Generation
    const generateSteps = (nArr: number[], mArr: number[], algoMode: 'brute' | 'optimal' | 'map') => {
        const steps = [];
        const n = [...nArr];
        const m = [...mArr];

        if (algoMode === 'brute') {
            // Brute Force: for each m, scan n
            steps.push({
                description: "BRUTE FORCE: We will iterate through each element in M and count its occurrences in N.",
                arrayN: [...n],
                arrayM: [...m],
                currentMIdx: -1,
                currentNIdx: -1,
                results: {} as Record<number, number>,
                jsLine: 1,
                pyLine: 1
            });

            const results: Record<number, number> = {};

            for (let i = 0; i < m.length; i++) {
                const target = m[i];
                let count = 0;

                steps.push({
                    description: `Processing query: ${target}. Reset count to 0.`,
                    arrayN: [...n],
                    arrayM: [...m],
                    currentMIdx: i,
                    currentNIdx: -1,
                    results: { ...results },
                    jsLine: 2,
                    pyLine: 2
                });

                for (let j = 0; j < n.length; j++) {
                    const isMatch = n[j] === target;
                    if (isMatch) count++;

                    steps.push({
                        description: `Comparing target ${target} with N[${j}] (${n[j]}).${isMatch ? ' MATCH! Count -> ' + count : ''}`,
                        arrayN: [...n],
                        arrayM: [...m],
                        currentMIdx: i,
                        currentNIdx: j,
                        isMatch,
                        results: { ...results },
                        jsLine: 4,
                        pyLine: 4
                    });
                }

                results[target] = count;
                steps.push({
                    description: `Finished scanning N for ${target}. Result: ${count}`,
                    arrayN: [...n],
                    arrayM: [...m],
                    currentMIdx: i,
                    currentNIdx: -1,
                    results: { ...results },
                    jsLine: 6,
                    pyLine: 6
                });
            }
        } else if (algoMode === 'optimal') {
            // Optimal: Frequency Array (Hash-list)
            const hashList = new Array(11).fill(0); // 0 to 10

            steps.push({
                description: "OPTIMAL (ARRAY): First, we pre-count all frequencies in N using a fixed-size array.",
                arrayN: [...n],
                arrayM: [...m],
                hashList: [...hashList],
                currentNIdx: -1,
                currentMIdx: -1,
                phase: 'PRECOUNT',
                jsLine: 1,
                pyLine: 1
            });

            // Phase 1: Pre-count
            for (let i = 0; i < n.length; i++) {
                const val = n[i];
                if (val >= 0 && val <= 10) {
                    hashList[val]++;
                }
                steps.push({
                    description: `Reading N[${i}] = ${val}. Incrementing hash-list[${val}] to ${hashList[val]}.`,
                    arrayN: [...n],
                    arrayM: [...m],
                    hashList: [...hashList],
                    currentNIdx: i,
                    currentMIdx: -1,
                    phase: 'PRECOUNT',
                    highlightHashIdx: val,
                    jsLine: 4,
                    pyLine: 4
                });
            }

            steps.push({
                description: "Pre-counting complete! Now we can answer each query in M instantly.",
                arrayN: [...n],
                arrayM: [...m],
                hashList: [...hashList],
                currentNIdx: -1,
                currentMIdx: -1,
                phase: 'QUERY_START',
                jsLine: 6,
                pyLine: 6
            });

            // Phase 2: Queries
            const results: Record<number, number> = {};
            for (let i = 0; i < m.length; i++) {
                const query = m[i];
                const res = (query >= 1 && query <= 10) ? hashList[query] : 0;
                results[query] = res;

                steps.push({
                    description: `Query ${query}: Lookup hash-list[${query}] -> Result: ${res}`,
                    arrayN: [...n],
                    arrayM: [...m],
                    hashList: [...hashList],
                    currentNIdx: -1,
                    currentMIdx: i,
                    highlightHashIdx: query >= 1 && query <= 10 ? query : -1,
                    phase: 'QUERYING',
                    results: { ...results },
                    jsLine: 8,
                    pyLine: 8
                });
            }
        } else {
            // Dictionary / HashMap Solution
            const freqMap: Record<number, number> = {};

            steps.push({
                description: "HASH MAP: Uses a Dictionary (Object) to count frequencies. Works for ANY number range.",
                arrayN: [...n],
                arrayM: [...m],
                freqMap: { ...freqMap },
                currentNIdx: -1,
                currentMIdx: -1,
                phase: 'PRECOUNT',
                jsLine: 2,
                pyLine: 4 // "freq_dict = defaultdict(int)"
            });

            // Phase 1: Pre-count
            for (let i = 0; i < n.length; i++) {
                const val = n[i];
                freqMap[val] = (freqMap[val] || 0) + 1;

                steps.push({
                    description: `Reading N[${i}] = ${val}. Update Map: Key ${val} -> Count ${freqMap[val]}`,
                    arrayN: [...n],
                    arrayM: [...m],
                    freqMap: { ...freqMap },
                    currentNIdx: i,
                    currentMIdx: -1,
                    phase: 'PRECOUNT',
                    highlightMapKey: val,
                    jsLine: 6,
                    pyLine: 7 // "freq_dict[num] += 1"
                });
            }

            steps.push({
                description: "Map built! Now we query against the dictionary keys.",
                arrayN: [...n],
                arrayM: [...m],
                freqMap: { ...freqMap },
                currentNIdx: -1,
                currentMIdx: -1,
                phase: 'QUERY_START',
                jsLine: 9,
                pyLine: 9
            });

            // Phase 2: Queries
            const results: Record<number, number> = {};
            for (let i = 0; i < m.length; i++) {
                const query = m[i];
                const res = freqMap[query] || 0;
                results[query] = res;

                steps.push({
                    description: `Query ${query}: Check map key '${query}' -> ${res > 0 ? 'Found ' + res : 'Not Found (0)'}`,
                    arrayN: [...n],
                    arrayM: [...m],
                    freqMap: { ...freqMap },
                    currentNIdx: -1,
                    currentMIdx: i,
                    phase: 'QUERYING',
                    highlightMapKey: query,
                    results: { ...results },
                    jsLine: 11,
                    pyLine: 10 // "print(freq_dict[num])"
                });
            }
        }

        steps.push({
            description: "All queries processed successfully!",
            arrayN: [...n],
            arrayM: [...m],
            // Preserve final state based on mode
            hashList: algoMode === 'optimal' ? (steps[steps.length - 1] as any).hashList : undefined,
            freqMap: algoMode === 'map' ? (steps[steps.length - 1] as any).freqMap : undefined,
            results: (steps[steps.length - 1] as any).results,
            completed: true,
            jsLine: algoMode === 'brute' ? 6 : (algoMode === 'optimal' ? 8 : 11),
            pyLine: algoMode === 'brute' ? 6 : (algoMode === 'optimal' ? 8 : 10)
        });

        return steps;
    };

    const [steps, setSteps] = useState(generateSteps(arrayN, arrayM, mode));
    const [currentStep, setCurrentStep] = useState(0);

    const currentStepData = { ...steps[currentStep] };

    // Code Snippets
    const jsBrute = [
        "for (let num of m) {",
        "  let count = 0;",
        "  for (let n of n_arr) {",
        "    if (n === num) count++;",
        "  }",
        "  console.log(count);",
        "}"
    ];

    const jsOptimal = [
        "// Fixed Array (Range 0-10)",
        "const freq = new Array(11).fill(0);",
        "for (let n of n_arr) {",
        "  if (n <= 10) freq[n]++;",
        "}",
        "for (let q of m) {",
        "  console.log(freq[q] || 0);",
        "}"
    ];

    const jsMap = [
        "const freqMap = {};",
        "// 1. Build Frequency Map",
        "for (let num of n_arr) {",
        "  freqMap[num] = (freqMap[num] || 0) + 1;",
        "}",
        "// 2. Query Map",
        "for (let q of m) {",
        "  console.log(freqMap[q] || 0);",
        "}"
    ];

    const pyBrute = [
        "for num in m:",
        "    count = 0",
        "    for n_val in n_arr:",
        "        if n_val == num:",
        "            count += 1",
        "    print(count)"
    ];

    const pyOptimal = [
        "# Fixed Array 0-10",
        "freq = [0] * 11",
        "for n in n_arr:",
        "    if n <= 10: freq[n] += 1",
        "for q in m:",
        "    print(freq[q] if 0<=q<=10 else 0)"
    ];

    const pyMap = [
        "from collections import defaultdict",
        "",
        "# 1. Build Frequency Map",
        "freq_dict = defaultdict(int)",
        "",
        "for num in n:",
        "    freq_dict[num] += 1",
        "",
        "# 2. Query for each number in m",
        "for num in m:",
        "    print(freq_dict[num])"
    ];

    const code = mode === 'brute' ? (language === 'javascript' ? jsBrute : pyBrute) :
        mode === 'optimal' ? (language === 'javascript' ? jsOptimal : pyOptimal) :
            (language === 'javascript' ? jsMap : pyMap);

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
        const newN = tempNInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        const newM = tempMInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));

        setArrayN(newN);
        setArrayM(newM);
        setSteps(generateSteps(newN, newM, mode));
        setCurrentStep(0);
        setIsEditing(false);
        setIsPlaying(false);
    };

    const handleModeChange = (newMode: 'brute' | 'optimal' | 'map') => {
        setMode(newMode);
        setSteps(generateSteps(arrayN, arrayM, newMode));
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

            osc.onended = () => {
                ctx.close();
            }

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
        if (!isPlaying && currentStep === 0) return;

        const step = steps[currentStep] as any;

        if (step.isMatch) {
            playTone(880, 'sine', 0.1);
        } else if (mode === 'map' && step.phase === 'PRECOUNT') {
            // Map build sound
            playTone(400, 'triangle', 0.05);
        } else if (step.phase === 'QUERYING') {
            // Query sound
            playTone(600, 'sine', 0.1);
        } else {
            playTone(200, 'sine', 0.02);
        }
    }, [currentStep, isPlaying]);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-indigo-500/30">
            <Header />

            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-black pt-20 pb-6 px-4 md:px-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

                <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 relative z-10">

                    {/* LEFT COLUMN: Controller & Code */}
                    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">

                        {/* 1. Controller Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex flex-col">
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                        Find Duplicate Number Count
                                    </h1>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Frequency Smasher</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-2 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                    >
                                        <HelpCircle size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Algorithm Mode Selection */}
                            <div className="flex bg-slate-800/50 p-1 rounded-xl mb-6 border border-white/5">
                                <button onClick={() => handleModeChange('brute')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'brute' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                                    Brute
                                </button>
                                <button onClick={() => handleModeChange('optimal')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'optimal' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                                    Array
                                </button>
                                <button onClick={() => handleModeChange('map')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === 'map' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                                    HashMap
                                </button>
                            </div>

                            {/* Input Section */}
                            <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 mb-6">
                                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Configuration</span>
                                    <Edit3 size={14} className="text-slate-600 cursor-pointer" onClick={() => setIsEditing(!isEditing)} />
                                </div>

                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Array N (Source)</label>
                                            <input type="text" value={tempNInput} onChange={(e) => setTempNInput(e.target.value)} className="w-full bg-slate-900 border border-blue-500/50 rounded-lg px-3 py-2 text-white outline-none font-mono text-xs" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Array M (Queries)</label>
                                            <input type="text" value={tempMInput} onChange={(e) => setTempMInput(e.target.value)} className="w-full bg-slate-900 border border-blue-500/50 rounded-lg px-3 py-2 text-white outline-none font-mono text-xs" />
                                        </div>
                                        <button onClick={handleInputChange} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 text-sm font-medium transition-colors">Apply Data</button>
                                    </div>
                                ) : (
                                    <div className="space-y-3 cursor-pointer group" onClick={() => setIsEditing(true)}>
                                        <div>
                                            <span className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Source (N)</span>
                                            <p className="text-sm font-bold font-mono text-white truncate text-blue-100">[{arrayN.join(', ')}]</p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Queries (M)</span>
                                            <p className="text-sm font-bold font-mono text-white truncate text-blue-100">[{arrayM.join(', ')}]</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Playback Controls */}
                            <div className="grid grid-cols-4 gap-2">
                                <button onClick={handleReset} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center justify-center"><RotateCcw size={20} /></button>
                                <button onClick={handlePrevious} disabled={currentStep === 0} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"><ChevronLeft size={24} /></button>
                                <button onClick={() => setIsPlaying(!isPlaying)} disabled={currentStepData.completed} className={`p-3 rounded-xl ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-blue-900/20`}>
                                    {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                                </button>
                                <button onClick={handleNext} disabled={currentStepData.completed} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"><ChevronRight size={24} /></button>
                            </div>
                        </div>

                        {/* 2. Code Display */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex-1 flex flex-col min-h-[350px]">
                            <div className="flex items-center gap-2 mb-4 text-blue-400 border-b border-white/5 pb-2">
                                <Code size={18} />
                                <h3 className="font-bold text-sm uppercase tracking-wider">Algorithm Logic</h3>
                            </div>
                            <div className="relative flex-1 min-h-0 flex flex-col">
                                <div className="absolute top-0 right-0 p-2 z-10 w-full flex justify-end pointer-events-none">
                                    <div className="flex bg-slate-900/80 rounded p-1 border border-white/10 backdrop-blur-sm pointer-events-auto">
                                        <button className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${language === 'javascript' ? 'bg-blue-600 text-white' : 'text-slate-500'}`} onClick={() => setLanguage('javascript')}>JS</button>
                                        <button className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${language === 'python' ? 'bg-blue-600 text-white' : 'text-slate-500'}`} onClick={() => setLanguage('python')}>PY</button>
                                    </div>
                                </div>
                                <div className="flex-1 rounded-xl overflow-hidden border border-slate-700/50 shadow-inner bg-[#1e1e1e] relative">
                                    <div className="absolute inset-0 overflow-auto custom-scrollbar">
                                        <SyntaxHighlighter
                                            language={language}
                                            style={atomDark}
                                            showLineNumbers={true}
                                            wrapLines={true}
                                            customStyle={{ margin: 0, padding: '1.5rem', minHeight: '100%', fontSize: '0.85rem' }}
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
                    </div>

                    {/* RIGHT COLUMN: Visualization */}
                    <div className="flex flex-col gap-6">

                        {/* 1. Animation Stage */}
                        <div className="min-h-[600px] lg:flex-grow bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-4 md:p-8 relative overflow-visible flex flex-col items-center">

                            {/* Step Description */}
                            <div className="w-full text-center mb-10 relative z-20">
                                <motion.div
                                    key={currentStepData.description}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-block bg-slate-800/80 border border-blue-500/30 rounded-2xl md:rounded-full px-4 md:px-6 py-2 shadow-lg"
                                >
                                    <p className="text-xs md:text-sm lg:text-base font-medium text-blue-100 flex items-center gap-3">
                                        <Info size={16} className="text-blue-400 shrink-0" />
                                        {currentStepData.description}
                                    </p>
                                </motion.div>
                            </div>

                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none"></div>

                            {/* Main Visualization Area */}
                            <div className="flex-1 w-full flex flex-col gap-10 relative z-10 overflow-hidden">

                                {/* Source View */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-2">
                                        <Database size={12} /> Source Array (N)
                                    </div>
                                    <div className="flex flex-wrap gap-2 md:gap-3 p-4 bg-slate-800/30 rounded-2xl border border-white/5 justify-center">
                                        {arrayN.map((val, idx) => {
                                            const isProcessing = (currentStepData as any).currentNIdx === idx;
                                            return (
                                                <motion.div
                                                    key={idx}
                                                    animate={{
                                                        scale: isProcessing ? 1.2 : 1,
                                                        backgroundColor: isProcessing ? 'rgba(59, 130, 246, 0.3)' : 'rgba(15, 23, 42, 0.5)',
                                                        borderColor: isProcessing ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)'
                                                    }}
                                                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl border flex items-center justify-center font-mono font-bold text-white relative shadow-lg"
                                                >
                                                    {val}
                                                    {isProcessing && (
                                                        <motion.div layoutId="pointer-n" className="absolute -top-8 text-blue-400">
                                                            <ChevronDown size={24} strokeWidth={3} />
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* HashMap / Array View */}
                                {mode !== 'brute' && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-2">
                                            {mode === 'optimal' ? <Binary size={12} /> : <Hash size={12} />}
                                            {mode === 'optimal' ? 'Hash List (Array 0-10)' : 'Frequency Dictionary (Hash Map)'}
                                        </div>

                                        {mode === 'optimal' ? (
                                            // Array Visualization
                                            <div className="grid grid-cols-6 md:grid-cols-11 gap-2 p-4 bg-slate-800/30 rounded-2xl border border-white/5">
                                                {[...Array(11)].map((_, idx) => {
                                                    const counts = (currentStepData as any).hashList || [];
                                                    const count = counts[idx] || 0;
                                                    const isHighlighted = (currentStepData as any).highlightHashIdx === idx;
                                                    return (
                                                        <motion.div
                                                            key={idx}
                                                            animate={{
                                                                scale: isHighlighted ? 1.15 : 1,
                                                                borderColor: isHighlighted ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)',
                                                                backgroundColor: isHighlighted ? 'rgba(59, 130, 246, 0.15)' : 'transparent'
                                                            }}
                                                            className="flex flex-col items-center bg-slate-950/50 rounded-xl border p-2 transition-all duration-300"
                                                        >
                                                            <span className="text-[10px] text-slate-500 mb-1 font-mono">[{idx}]</span>
                                                            <span className={`text-lg font-bold font-mono ${count > 0 ? 'text-cyan-400' : 'text-slate-700'}`}>{count}</span>
                                                        </motion.div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            // HashMap Visualization
                                            <div className="flex flex-wrap gap-4 p-4 bg-slate-800/30 rounded-2xl border border-white/5 min-h-[100px] justify-center">
                                                <AnimatePresence>
                                                    {Object.entries((currentStepData as any).freqMap || {}).map(([key, count], i) => {
                                                        const isHighlighted = (currentStepData as any).highlightMapKey == key;
                                                        return (
                                                            <motion.div
                                                                key={key}
                                                                initial={{ scale: 0, opacity: 0 }}
                                                                animate={{ scale: isHighlighted ? 1.1 : 1, opacity: 1, backgroundColor: isHighlighted ? 'rgba(59, 130, 246, 0.15)' : 'rgba(15, 23, 42, 0.5)' }}
                                                                className={`flex flex-col items-center rounded-xl border ${isHighlighted ? 'border-blue-400' : 'border-slate-700'} p-3 min-w-[60px]`}
                                                            >
                                                                <span className="text-[10px] text-slate-400 uppercase font-bold mb-1">Key {key}</span>
                                                                <div className="w-full h-px bg-slate-700 mb-1"></div>
                                                                <span className="text-xl font-bold text-cyan-400">{count as number}</span>
                                                            </motion.div>
                                                        );
                                                    })}
                                                    {Object.keys((currentStepData as any).freqMap || {}).length === 0 && (
                                                        <div className="text-slate-600 text-sm italic py-4">Dictionary is empty...</div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Queries View */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-2">
                                        <Search size={12} /> Queries (M)
                                    </div>
                                    <div className="flex flex-wrap gap-4 md:gap-6 p-6 bg-slate-800/30 rounded-3xl border border-white/5 justify-center">
                                        {arrayM.map((val, idx) => {
                                            const isQuerying = (currentStepData as any).currentMIdx === idx;
                                            const results = (currentStepData as any).results || {};
                                            const result = results[val];

                                            return (
                                                <motion.div
                                                    key={idx}
                                                    animate={{
                                                        scale: isQuerying ? 1.2 : 1,
                                                        backgroundColor: isQuerying ? 'rgba(59, 130, 246, 0.2)' : 'rgba(2, 6, 23, 0.5)',
                                                        borderColor: isQuerying ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)'
                                                    }}
                                                    className="min-w-[70px] md:min-w-[90px] h-20 md:h-24 rounded-2xl border flex flex-col items-center justify-center p-2 relative shadow-2xl transition-all"
                                                >
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase">Query</span>
                                                    <span className="text-xl md:text-2xl font-bold font-mono text-white mb-1">{val}</span>
                                                    <div className="w-full h-px bg-white/5 my-1" />
                                                    <span className="text-xs font-bold text-cyan-400 font-mono">
                                                        {result !== undefined ? `Count: ${result}` : '?'}
                                                    </span>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Stats Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl sticky bottom-4 lg:relative lg:bottom-0">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Source Size</span>
                                    <span className="text-xl md:text-2xl font-bold text-blue-400">{arrayN.length}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Queries</span>
                                    <span className="text-xl md:text-2xl font-bold text-cyan-400">{arrayM.length}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Time TC</span>
                                    <span className="text-xl md:text-2xl font-bold text-purple-400">
                                        O({mode === 'brute' ? 'N × M' : 'N + M'})
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Space SC</span>
                                    <span className="text-xl md:text-2xl font-bold text-emerald-400">
                                        O({mode === 'brute' ? '1' : mode === 'optimal' ? 'Range' : 'U'})
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <DSAExplanationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Number Frequency Pattern"
                description="Optimize query response times for counting element occurrences using Frequency Arrays or HashMaps."
                concept="To avoid re-scanning the array for every query (Brute Force), we can pre-process the data. We count all items once and store them in a fast-lookup structure: either an Array (if numbers are small/bounded) or a HashMap (for any data)."
                efficiency="Brute force is O(N*M). Using a Map/Array reduces this to O(N + M) because we scan the source once (N) and then each query is O(1) or O(1 average)."
                useCases={[
                    "Finding duplicates in data",
                    "Counting votes in an election",
                    "Analyzing word frequency in text",
                    "Optimizing repeated search queries"
                ]}
                timeComplexity="O(N + M)"
                spaceComplexity="O(U) where U is unique elements"
                complexityNotes="For the Hash Map, space depends on unique elements. For Fixed Array, space depends on the number range."
                interviewTips={[
                    "Always ask about constraints: 'What is the range of numbers?'",
                    "If range is small (e.g. 1-100), use an Array (faster, less overhead).",
                    "If range is large (e.g. 1-10^9) or unknown, use a HashMap (Dictionary).",
                    "In Python, 'collections.Counter' or 'defaultdict' is the standard way to do this."
                ]}
                color="blue"
            />
        </div>
    );
};

export default NumberFrequencyVisualizer;
