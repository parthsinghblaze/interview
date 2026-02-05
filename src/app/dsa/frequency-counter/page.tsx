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
    MoveRight,
    HelpCircle,
    X,
    CheckCircle2,
    Search,
    Info,
    Database
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DSAExplanationModal from '../../components/DSAExplanationModal';

const FrequencyCounter = () => {
    // Initial State
    const [inputString, setInputString] = useState('apple');
    const [isEditing, setIsEditing] = useState(false);
    const [tempInput, setTempInput] = useState('apple');
    const [isPlaying, setIsPlaying] = useState(false);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Step Generation
    const generateSteps = (str: string) => {
        const steps = [];
        const chars = str.split('');
        const freqMap: Record<string, number> = {};

        // Initial step
        steps.push({
            description: `Start: Initialize empty frequency map for "${str}"`,
            str: str,
            currentIndex: -1,
            freqMap: { ...freqMap },
            highlightedChar: null as string | null,
            jsLine: 1,
            pyLine: 1
        });

        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];

            // Step: Checking character
            steps.push({
                description: `Checking character '${char}' at index ${i}`,
                str: str,
                currentIndex: i,
                freqMap: { ...freqMap },
                highlightedChar: char,
                jsLine: 2,
                pyLine: 2
            });

            // Update frequency
            freqMap[char] = (freqMap[char] || 0) + 1;

            // Step: Updated frequency
            steps.push({
                description: `Increment frequency of '${char}': ${freqMap[char]}`,
                str: str,
                currentIndex: i,
                freqMap: { ...freqMap },
                highlightedChar: char,
                jsLine: 3,
                pyLine: 4
            });
        }

        // Final step
        steps.push({
            description: `Finished processing all characters.`,
            str: str,
            currentIndex: chars.length,
            freqMap: { ...freqMap },
            highlightedChar: null,
            completed: true,
            jsLine: 5,
            pyLine: 5
        });

        return steps;
    };

    const [steps, setSteps] = useState(generateSteps(inputString));
    const [currentStep, setCurrentStep] = useState(0);

    const currentStepData = { ...steps[currentStep], completed: currentStep === steps.length - 1 };

    // Code Snippets
    const jsCode = [
        "function getFrequency(str) {",
        "  const freqMap = {};",
        "  for (let char of str) {",
        "    freqMap[char] = (freqMap[char] || 0) + 1;",
        "  }",
        "  return freqMap;",
        "}"
    ];

    const pyCode = [
        "def get_frequency(s):",
        "    freq_map = {}",
        "    for char in s:",
        "        freq_map[char] = freq_map.get(char, 0) + 1",
        "    return freq_map"
    ];

    const code = language === 'javascript' ? jsCode : pyCode;
    const currentLine = (currentStepData as any).jsLine;

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
        }, 800);

        // Sound Triggers
        if (isPlaying || currentStep > 0) {
            const step = steps[currentStep] as any;
            if (step.completed) {
                playTone(600, 'sine', 0.1);
                setTimeout(() => playTone(800, 'sine', 0.2), 100);
            } else if (step.highlightedChar) {
                // Determine pitch based on char code to give it some variety? Or just simple count up
                const count = step.freqMap[step.highlightedChar] || 0;
                playTone(200 + (count * 50), 'sine', 0.1); // Pitch rises with frequency count
            } else {
                playTone(150, 'sine', 0.05); // Standard tick
            }
        }

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps]);

    const handleInputApply = () => {
        if (tempInput.trim()) {
            setInputString(tempInput.trim());
            const newSteps = generateSteps(tempInput.trim());
            setSteps(newSteps);
            setCurrentStep(0);
            setIsEditing(false);
            setIsPlaying(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-rose-500/30">
            <Header />

            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900/10 via-slate-950 to-black pt-20 pb-6 px-4 md:px-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>

                <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 relative z-10">

                    {/* LEFT COLUMN: Controller */}
                    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">

                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
                                    Frequency Counter
                                </h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-2 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                                        title="Algorithm Explanation"
                                    >
                                        <HelpCircle size={20} />
                                    </button>
                                    <div className="px-2 py-1 rounded bg-slate-800 border border-white/10 text-xs font-mono text-slate-400">
                                        v1.0
                                    </div>
                                </div>
                            </div>

                            {/* Input Section */}
                            <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-slate-400 font-medium">Input String</span>
                                    <Search size={14} className="text-slate-600" />
                                </div>

                                {isEditing ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={tempInput}
                                            onChange={(e) => setTempInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleInputApply()}
                                            className="flex-1 bg-slate-900 border border-rose-500/50 rounded-lg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-rose-500/50 font-mono text-sm"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleInputApply}
                                            className="bg-rose-600 hover:bg-rose-500 text-white rounded-lg px-4 font-medium transition-colors"
                                        >
                                            Go
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between group cursor-pointer" onClick={() => setIsEditing(true)}>
                                        <span className="text-2xl font-bold font-mono tracking-tight text-white group-hover:text-rose-300 transition-colors">
                                            "{inputString}"
                                        </span>
                                        <Edit3 className="text-slate-500 group-hover:text-white transition-colors" size={20} />
                                    </div>
                                )}
                            </div>

                            {/* Playback Controls */}
                            <div className="grid grid-cols-4 gap-2">
                                <button onClick={handleReset} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center justify-center"><RotateCcw size={20} /></button>
                                <button onClick={handleNext} disabled={currentStep === 0} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"><ChevronLeft size={24} /></button>
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    disabled={currentStepData.completed}
                                    className={`p-3 rounded-xl ${isPlaying ? 'bg-amber-600 hover:bg-amber-500' : 'bg-rose-600 hover:bg-rose-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-rose-900/20`}
                                >
                                    {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                                </button>
                                <button onClick={handleNext} disabled={currentStepData.completed} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"><ChevronRight size={24} /></button>
                            </div>

                            {/* Progress */}
                            <div className="mt-6">
                                <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                                    <span>Chars Processed</span>
                                    <span>{Math.max(0, (currentStepData as any).currentIndex + 1)} / {inputString.length}</span>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-rose-500 to-orange-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(Math.max(0, (currentStepData as any).currentIndex + 1) / inputString.length) * 100}%` }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Code Display */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex-1 flex flex-col min-h-[300px]">
                            <div className="flex items-center gap-2 mb-4 text-rose-400">
                                <Code size={18} />
                                <h3 className="font-bold text-sm uppercase tracking-wider">Algorithm Code</h3>
                            </div>

                            <div className="relative flex-1 min-h-0 flex flex-col">
                                <div className="absolute top-0 right-0 p-2 z-10 w-full flex justify-end pointer-events-none">
                                    <div className="flex bg-slate-900/80 rounded p-1 border border-white/10 backdrop-blur-sm pointer-events-auto">
                                        <button className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${language === 'javascript' ? 'bg-rose-600 text-white' : 'text-slate-500'}`} onClick={() => setLanguage('javascript')}>JS</button>
                                        <button className={`px-3 py-1 text-[10px] font-bold rounded transition-all ${language === 'python' ? 'bg-rose-600 text-white' : 'text-slate-500'}`} onClick={() => setLanguage('python')}>PY</button>
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
                                                const currentLineNum = language === 'javascript' ? (currentStepData as any).jsLine : (currentStepData as any).pyLine;
                                                const isCurrentLine = lineNumber === currentLineNum;
                                                return {
                                                    style: {
                                                        backgroundColor: isCurrentLine ? 'rgba(225, 29, 72, 0.15)' : undefined,
                                                        display: 'block',
                                                        width: '100%',
                                                        borderLeft: isCurrentLine ? '3px solid #e11d48' : '3px solid transparent',
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
                        <div className="min-h-[500px] lg:flex-grow bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-4 md:p-8 relative overflow-visible flex flex-col">
                            {/* Step Description */}
                            <div className="w-full text-center mb-12 relative z-20">
                                <motion.div
                                    key={(currentStepData as any).description}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-block bg-slate-800/80 border border-rose-500/30 rounded-2xl md:rounded-full px-4 md:px-6 py-2 shadow-lg"
                                >
                                    <p className="text-sm md:text-lg font-medium text-rose-100 flex items-center gap-3">
                                        <Info size={18} className="text-rose-400 shrink-0" />
                                        {(currentStepData as any).description}
                                    </p>
                                </motion.div>
                            </div>

                            {/* Processing Lane */}
                            <div className="flex-1 flex flex-col items-center justify-center gap-16 relative z-10">
                                {/* Input String Visualization */}
                                <div className="w-full overflow-x-auto pt-12 pb-4 custom-scrollbar">
                                    <div className="flex gap-2 p-4 bg-slate-950/50 rounded-2xl border border-white/5 shadow-2xl min-w-max mx-auto">
                                        {inputString.split('').map((char, idx) => (
                                            <motion.div
                                                key={idx}
                                                animate={{
                                                    scale: (currentStepData as any).currentIndex === idx ? 1.2 : 1,
                                                    backgroundColor: (currentStepData as any).currentIndex === idx ? 'rgba(225, 29, 72, 0.3)' : 'rgba(30, 41, 59, 0.5)',
                                                    borderColor: (currentStepData as any).currentIndex === idx ? 'rgba(225, 29, 72, 0.5)' : 'rgba(255, 255, 255, 0.05)',
                                                }}
                                                className="w-10 h-10 md:w-16 md:h-16 rounded-xl border flex items-center justify-center font-mono text-xl md:text-2xl font-bold relative"
                                            >
                                                {char}
                                                {(currentStepData as any).currentIndex === idx && (
                                                    <motion.div
                                                        layoutId="pointer"
                                                        className="absolute -top-10 text-rose-500"
                                                        initial={{ y: 0 }}
                                                        animate={{ y: [0, -5, 0] }}
                                                        transition={{ repeat: Infinity, duration: 1 }}
                                                    >
                                                        <Zap size={20} className="md:w-6 md:h-6" fill="currentColor" />
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <MoveRight className="text-slate-700 animate-pulse rotate-90 lg:rotate-0" size={32} />

                                {/* Hash Map Visualization */}
                                <div className="w-full max-w-2xl bg-slate-800/30 rounded-3xl p-8 border border-white/5 relative overflow-hidden min-h-[200px]">
                                    <div className="flex-initial flex items-center gap-2 text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">
                                        <Database size={14} />
                                        Frequency Map
                                    </div>

                                    <div className="overflow-x-auto pb-4 custom-scrollbar">
                                        <div className="flex flex-nowrap md:grid md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                                            <AnimatePresence>
                                                {Object.entries((currentStepData as any).freqMap || {}).map(([char, count]) => (
                                                    <motion.div
                                                        key={char}
                                                        layout
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{
                                                            scale: (currentStepData as any).highlightedChar === char ? 1.1 : 1,
                                                            opacity: 1,
                                                            backgroundColor: (currentStepData as any).highlightedChar === char ? 'rgba(225, 29, 72, 0.2)' : 'rgba(30, 41, 59, 0.8)'
                                                        }}
                                                        className={`p-3 md:p-4 rounded-2xl border-2 shrink-0 flex flex-col items-center gap-1 transition-colors ${(currentStepData as any).highlightedChar === char ? 'border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.2)]' : 'border-white/5'}`}
                                                    >
                                                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">'{char}'</span>
                                                        <span className="text-xl md:text-3xl font-bold font-mono text-rose-400">{count as any}</span>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {Object.keys((currentStepData as any).freqMap || {}).length === 0 && (
                                        <div className="h-24 flex items-center justify-center text-slate-600 font-mono italic text-sm">
                                            Initializing map...
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Completion Badge */}
                            {(currentStepData as any).completed && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="mt-8 self-center px-8 py-4 bg-green-500/10 border border-green-500/50 text-green-300 rounded-full font-bold text-xl shadow-lg relative z-20"
                                >
                                    Analysis Complete!
                                </motion.div>
                            )}
                        </div>

                        {/* 2. Stats Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl sticky bottom-4 lg:relative lg:bottom-0">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Unique Chars</span>
                                    <span className="text-xl md:text-3xl font-bold text-rose-400">{Object.keys((currentStepData as any).freqMap || {}).length}</span>
                                </div>
                                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Max Freq</span>
                                    <span className="text-xl md:text-3xl font-bold text-orange-400">
                                        {Math.max(0, ...Object.values((currentStepData as any).freqMap || {}).map(v => v as number)) || 0}
                                    </span>
                                </div>
                                <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 p-3">
                                    <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1">Complexity</span>
                                    <span className="text-lg md:text-2xl font-bold text-cyan-400">O(n)</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <DSAExplanationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Frequency Counter"
                description="Analyze character occurrences using an efficient Hash Map (Object/Dict) pattern."
                concept="The Frequency Counter pattern uses an object or hash map to collect values and their frequencies, avoiding nested O(n²) loops."
                efficiency="By using a Hash Map, lookup and insertion both happen in O(1) average time, making the overall algorithm extremely efficient."
                useCases={[
                    "Anagram detection between two strings",
                    "Finding the first non-repeating character",
                    "Counting duplicate elements in large datasets"
                ]}
                timeComplexity="O(n)"
                spaceComplexity="O(k)"
                complexityNotes="n = string length, k = number of unique characters"
                interviewTips={[
                    "Clarify case sensitivity requirements early in the interview.",
                    "Mention how to handle non-alphanumeric characters like spaces.",
                    "Discuss the trade-off: O(k) space is usually acceptable for O(n) speed."
                ]}
                color="rose"
            />
        </div>
    );
};

export default FrequencyCounter;
