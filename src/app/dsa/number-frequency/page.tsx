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
    ChevronDown
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DSAExplanationModal from '../../components/DSAExplanationModal';

const NumberFrequencyVisualizer = () => {
    // Initial State
    const [arrayN, setArrayN] = useState([5, 3, 2, 2, 1, 5, 5, 1, 5, 10]);
    const [arrayM, setArrayM] = useState([10, 11, 1, 9, 5]);
    const [mode, setMode] = useState<'brute' | 'optimal'>('optimal');
    const [isEditing, setIsEditing] = useState(false);
    const [tempNInput, setTempNInput] = useState('5, 3, 2, 2, 1, 5, 5, 1, 5, 10');
    const [tempMInput, setTempMInput] = useState('10, 11, 1, 9, 5');
    const [isPlaying, setIsPlaying] = useState(false);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Step Generation
    const generateSteps = (nArr: number[], mArr: number[], algoMode: 'brute' | 'optimal') => {
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
        } else {
            // Optimal: Frequency Array (Hash-list)
            const hashList = new Array(11).fill(0); // 0 to 10

            steps.push({
                description: "OPTIMAL: First, we pre-count all frequencies in N using a hash-list (frequency array).",
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
                description: "Pre-counting complete! Now we can answer each query in M instantly using the hash-list.",
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
                    description: `Query ${query}: ${query >= 1 && query <= 10 ? 'Check hash-list[' + query + ']' : 'Out of range [1-10]'} -> Result: ${res}`,
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
        }

        steps.push({
            description: "All queries processed successfully!",
            arrayN: [...n],
            arrayM: [...m],
            completed: true,
            jsLine: 10,
            pyLine: 10
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
        "const hash_list = new Array(11).fill(0);",
        "for (let num of n_arr) {",
        "  if (num <= 10) hash_list[num]++;",
        "}",
        "for (let num of m) {",
        "  if (num < 1 || num > 10) console.log(0);",
        "  else console.log(hash_list[num]);",
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
        "hash_list = [0] * 11",
        "for num in n_arr:",
        "    if num <= 10: hash_list[num] += 1",
        "",
        "for num in m:",
        "    if num < 1 or num > 10:",
        "        print(0)",
        "    else:",
        "        print(hash_list[num])"
    ];

    const code = mode === 'brute'
        ? (language === 'javascript' ? jsBrute : pyBrute)
        : (language === 'javascript' ? jsOptimal : pyOptimal);

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
            interval = setInterval(handleNext, 800);
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

    const handleModeChange = (newMode: 'brute' | 'optimal') => {
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

            gain.gain.setValueAtTime(0.05, ctx.currentTime); // Lower volume to 0.05 for subtle effect
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
        if (!isPlaying && currentStep === 0) return; // Don't play on initial load reset

        const step = steps[currentStep] as any;

        // 1. Match Found (Brute Force)
        if (step.isMatch) {
            playTone(880, 'sine', 0.1); // High Ding (A5)
            setTimeout(() => playTone(1760, 'sine', 0.1), 50); // Octave up
        }
        // 2. Hash List Increment (Optimal Pre-count)
        else if (step.phase === 'PRECOUNT' && step.highlightHashIdx !== undefined) {
            // Pentatonic scaleish mapping
            const baseFreq = 300;
            playTone(baseFreq + (step.highlightHashIdx * 50), 'sine', 0.08);
        }
        // 3. Query Answered (Optimal Query) - Success sound
        else if (step.phase === 'QUERYING') {
            // Success Chord
            playTone(523.25, 'sine', 0.15); // C5
            setTimeout(() => playTone(659.25, 'sine', 0.15), 40); // E5
            setTimeout(() => playTone(783.99, 'sine', 0.2), 80); // G5
        }
        // 4. Standard Step (Scanning / Moving)
        else {
            playTone(200, 'triangle', 0.02); // Very short blip
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
                                        Number Frequency
                                    </h1>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Query Optimization</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-2 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                        title="Algorithm Explanation"
                                    >
                                        <HelpCircle size={20} />
                                    </button>
                                    <div className="px-2 py-1 rounded bg-slate-800 border border-white/10 text-xs font-mono text-slate-400">
                                        v1.0
                                    </div>
                                </div>
                            </div>

                            {/* Algorithm Mode Selection */}
                            <div className="flex bg-slate-800/50 p-1 rounded-xl mb-6 border border-white/5">
                                <button
                                    onClick={() => handleModeChange('optimal')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'optimal' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <Zap size={14} className={mode === 'optimal' ? 'fill-current' : ''} />
                                    Optimal
                                </button>
                                <button
                                    onClick={() => handleModeChange('brute')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'brute' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    <Search size={14} />
                                    Brute Force
                                </button>
                            </div>

                            {/* Input Section */}
                            <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 mb-6">
                                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Configuration</span>
                                    <Edit3 size={14} className="text-slate-600" />
                                </div>

                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Array N (Elements 1-10)</label>
                                            <input
                                                type="text"
                                                value={tempNInput}
                                                onChange={(e) => setTempNInput(e.target.value)}
                                                className="w-full bg-slate-900 border border-blue-500/50 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-xs"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Array M (Queries)</label>
                                            <input
                                                type="text"
                                                value={tempMInput}
                                                onChange={(e) => setTempMInput(e.target.value)}
                                                className="w-full bg-slate-900 border border-blue-500/50 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500/50 font-mono text-xs"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg py-2 text-sm font-medium transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleInputChange}
                                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 text-sm font-medium transition-colors"
                                            >
                                                Apply Data
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3 cursor-pointer group" onClick={() => setIsEditing(true)}>
                                        <div>
                                            <span className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Source (N)</span>
                                            <p className="text-sm font-bold font-mono text-white truncate truncate group-hover:text-blue-400 transition-colors">
                                                [{arrayN.join(', ')}]
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Queries (M)</span>
                                            <p className="text-sm font-bold font-mono text-white truncate group-hover:text-blue-400 transition-colors">
                                                [{arrayM.join(', ')}]
                                            </p>
                                        </div>
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
                                    className={`p-3 rounded-xl ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-blue-900/20`}
                                >
                                    {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                                </button>
                                <button onClick={handleNext} disabled={currentStepData.completed} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"><ChevronRight size={24} /></button>
                            </div>

                            {/* Progress */}
                            <div className="mt-6">
                                <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                                    <span>Algorithm Progress</span>
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
                                            customStyle={{
                                                margin: 0,
                                                padding: '1.5rem',
                                                minHeight: '100%',
                                                fontSize: '0.85rem',
                                                lineHeight: '1.6',
                                                backgroundColor: '#1e1e1e',
                                                fontFamily: 'var(--font-mono)'
                                            }}
                                            lineNumberStyle={{ minWidth: '2em', paddingRight: '1em', color: '#6e7681', textAlign: 'right' }}
                                            lineProps={(lineNumber: number) => {
                                                const isCurrentLine = lineNumber === currentLine;
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

                                {/* 1. Array N (Source) */}
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
                                                        <motion.div
                                                            layoutId="pointer-n"
                                                            className="absolute -top-8 text-blue-400 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                                                            initial={{ y: -5, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            exit={{ y: -5, opacity: 0 }}
                                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                        >
                                                            <ChevronDown size={24} strokeWidth={3} />
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Intermediate View: Hash List for Optimal mode */}
                                {mode === 'optimal' && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-2">
                                            <Binary size={12} /> Hash List (Pre-counted Frequency)
                                        </div>
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
                                                        {isHighlighted && (
                                                            <div className="absolute inset-0 bg-blue-500/10 blur-md rounded-xl" />
                                                        )}
                                                    </motion.div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Arrow divider for visual flow */}
                                <div className="flex justify-center -my-4 animate-pulse opacity-50">
                                    <ArrowRight className="rotate-90 text-slate-700" size={24} />
                                </div>

                                {/* 2. Array M (Queries) */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest pl-2">
                                        <Search size={12} /> Queries (M) & Global Results
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

                                                    {isQuerying && (
                                                        <motion.div
                                                            layoutId="query-indicator"
                                                            className="absolute -top-10 text-blue-400 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                                                            initial={{ y: -5 }}
                                                            animate={{ y: 0 }}
                                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                        >
                                                            <div className="flex flex-col items-center gap-1">
                                                                <span className="text-[10px] font-bold text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded-full border border-blue-500/30">NOW</span>
                                                                <ChevronDown size={28} strokeWidth={3} />
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Completion Badge */}
                            {(currentStepData as any).completed && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="mt-8 px-8 py-4 bg-green-500/10 border border-green-500/50 text-green-300 rounded-full font-bold text-xl shadow-lg relative z-20"
                                >
                                    Counting Complete!
                                </motion.div>
                            )}
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
                                        O({mode === 'optimal' ? 'N + M' : 'N × M'})
                                    </span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Space SC</span>
                                    <span className="text-xl md:text-2xl font-bold text-emerald-400">
                                        O({mode === 'optimal' ? 'MaxRange' : '1'})
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
                description="Optimize query response times for counting element occurrences using Frequency Arrays (Hashing)."
                concept="When we need to answer multiple frequency queries for a specific range of values, pre-calculating counts in a 'Hash List' reduces query time from O(N) to O(1)."
                efficiency="The Brute Force approach checks the entire source array for every single query, resulting in O(N*M). The Optimal approach processes the source array once O(N) and queries the results in O(1), leading to O(N+M)."
                useCases={[
                    "Real-time analytics dashboard counters",
                    "Validating character limits and counts",
                    "Finding most/least frequent items in a stream",
                    "Preparing data for O(1) constant-time lookups"
                ]}
                timeComplexity={mode === 'optimal' ? "O(N + M)" : "O(N × M)"}
                spaceComplexity={mode === 'optimal' ? "O(Range)" : "O(1)"}
                complexityNotes="N = source size, M = query count, Range = spread of values"
                interviewTips={[
                    "Identify the value range before choosing a Frequency Array (it works best for small, known ranges).",
                    "Mention that for extremely sparse data or large ranges, a Hash Map (Object/Map) is better than an array.",
                    "Normalize inputs: always handle values that might fall outside your hash-list index range."
                ]}
                color="blue"
            />
        </div>
    );
};

export default NumberFrequencyVisualizer;
