'use client';

import React, { useState, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Play,
    Pause,
    Code,
    HelpCircle,
    LayoutGrid,
    ArrowRight,
    Search
} from 'lucide-react';
import Header from '../../components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DSAExplanationModal from '../../components/DSAExplanationModal';

const SpiralMatrixVisualizer = () => {
    // Initial 5x5 matrix as requested
    const initialMatrix = [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15],
        [16, 17, 18, 19, 20],
        [21, 22, 23, 24, 25]
    ];

    const [matrix, setMatrix] = useState(initialMatrix);
    const [isPlaying, setIsPlaying] = useState(false);
    const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
    const [isModalOpen, setIsModalOpen] = useState(false);

    interface Step {
        description: string;
        matrix: number[][];
        result: number[];
        activeCell: { r: number, c: number } | null;
        boundaries: { top: number, bottom: number, left: number, right: number };
        jsLine: number;
        pyLine: number;
        completed?: boolean;
    }

    // Step Generation Logic
    const generateSteps = (m: number[][]): Step[] => {
        const steps: Step[] = [];
        const res: number[] = [];
        if (m.length === 0) return [];

        let top = 0;
        let bottom = m.length - 1;
        let left = 0;
        let right = m[0].length - 1;

        // Initial State
        steps.push({
            description: "Start: Initialize boundaries (Top, Bottom, Left, Right)",
            matrix: m,
            result: [],
            activeCell: null as { r: number, c: number } | null,
            boundaries: { top, bottom, left, right },
            jsLine: 1,
            pyLine: 1
        });

        while (top <= bottom && left <= right) {
            // Traverse Right
            for (let i = left; i <= right; i++) {
                res.push(m[top][i]);
                steps.push({
                    description: `Moving Right: row ${top}, column ${i}`,
                    matrix: m,
                    result: [...res],
                    activeCell: { r: top, c: i },
                    boundaries: { top, bottom, left, right },
                    jsLine: 3,
                    pyLine: 4
                });
            }
            top++;
            steps.push({
                description: "Finished top row. Increment top boundary.",
                matrix: m,
                result: [...res],
                activeCell: null,
                boundaries: { top, bottom, left, right },
                jsLine: 5,
                pyLine: 5
            });

            // Traverse Down
            if (top <= bottom) {
                for (let i = top; i <= bottom; i++) {
                    res.push(m[i][right]);
                    steps.push({
                        description: `Moving Down: column ${right}, row ${i}`,
                        matrix: m,
                        result: [...res],
                        activeCell: { r: i, c: right },
                        boundaries: { top, bottom, left, right },
                        jsLine: 6,
                        pyLine: 7
                    });
                }
                right--;
                steps.push({
                    description: "Finished right column. Decrement right boundary.",
                    matrix: m,
                    result: [...res],
                    activeCell: null,
                    boundaries: { top, bottom, left, right },
                    jsLine: 8,
                    pyLine: 8
                });
            }

            // Traverse Left
            if (top <= bottom && left <= right) {
                for (let i = right; i >= left; i--) {
                    res.push(m[bottom][i]);
                    steps.push({
                        description: `Moving Left: row ${bottom}, column ${i}`,
                        matrix: m,
                        result: [...res],
                        activeCell: { r: bottom, c: i },
                        boundaries: { top, bottom, left, right },
                        jsLine: 9,
                        pyLine: 10
                    });
                }
                bottom--;
                steps.push({
                    description: "Finished bottom row. Decrement bottom boundary.",
                    matrix: m,
                    result: [...res],
                    activeCell: null,
                    boundaries: { top, bottom, left, right },
                    jsLine: 11,
                    pyLine: 11
                });
            }

            // Traverse Up
            if (left <= right && top <= bottom) {
                for (let i = bottom; i >= top; i--) {
                    res.push(m[i][left]);
                    steps.push({
                        description: `Moving Up: column ${left}, row ${i}`,
                        matrix: m,
                        result: [...res],
                        activeCell: { r: i, c: left },
                        boundaries: { top, bottom, left, right },
                        jsLine: 12,
                        pyLine: 13
                    });
                }
                left++;
                steps.push({
                    description: "Finished left column. Increment left boundary.",
                    matrix: m,
                    result: [...res],
                    activeCell: null,
                    boundaries: { top, bottom, left, right },
                    jsLine: 14,
                    pyLine: 14
                });
            }
        }

        steps.push({
            description: "Spiral traversal complete!",
            matrix: m,
            result: [...res],
            activeCell: null,
            boundaries: { top, bottom, left, right },
            completed: true,
            jsLine: 16,
            pyLine: 15
        });

        return steps;
    };

    const [steps, setSteps] = useState(generateSteps(matrix));
    const [currentStep, setCurrentStep] = useState(0);
    const currentStepData = { ...steps[currentStep], completed: currentStep === steps.length - 1 };

    // Code Snippets
    const jsCode = [
        "function spiralOrder(matrix) {",
        "  let top = 0, bottom = matrix.length - 1;",
        "  let left = 0, right = matrix[0].length - 1;",
        "  while (top <= bottom && left <= right) {",
        "    for (let i = left; i <= right; i++) res.push(matrix[top][i]);",
        "    top++;",
        "    for (let i = top; i <= bottom; i++) res.push(matrix[i][right]);",
        "    right--;",
        "    if (top <= bottom) {",
        "      for (let i = right; i >= left; i--) res.push(matrix[bottom][i]);",
        "      bottom--;",
        "    }",
        "    if (left <= right) {",
        "      for (let i = bottom; i >= top; i--) res.push(matrix[i][left]);",
        "      left++;",
        "    }",
        "  }",
        "}"
    ];

    const pyCode = [
        "def spiralOrder(matrix):",
        "    top, bottom = 0, len(matrix) - 1",
        "    left, right = 0, len(matrix[0]) - 1",
        "    while top <= bottom and left <= right:",
        "        for i in range(left, right + 1): res.append(matrix[top][i])",
        "        top += 1",
        "        for i in range(top, bottom + 1): res.append(matrix[i][right])",
        "        right -= 1",
        "        if top <= bottom:",
        "            for i in range(right, left - 1, -1): res.append(matrix[bottom][i])",
        "            bottom -= 1",
        "        if left <= right:",
        "            for i in range(bottom, top - 1, -1): res.append(matrix[i][left])",
        "            left += 1",
        "    return res"
    ];

    const code = language === 'javascript' ? jsCode : pyCode;
    const currentLine = language === 'javascript' ? currentStepData.jsLine : currentStepData.pyLine;

    // Controls
    const handleNext = () => { if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1); };
    const handlePrevious = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
    const handleReset = () => { setCurrentStep(0); setIsPlaying(false); };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && currentStep < steps.length - 1) {
            interval = setInterval(() => {
                setCurrentStep(prev => prev + 1);
            }, 500);
        } else if (currentStep >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps.length]);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans selection:bg-amber-500/30">
            <Header />

            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-slate-950 to-black pt-20 pb-6 px-4 md:px-6">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

                <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 relative z-10">

                    {/* LEFT COLUMN */}
                    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">

                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                                    Spiral Matrix
                                </h1>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="p-2 rounded-full bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
                                    >
                                        <HelpCircle size={20} />
                                    </button>
                                    <div className="px-2 py-1 rounded bg-slate-800 border border-white/10 text-xs font-mono text-slate-400">
                                        v1.0
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 mb-6">
                                <button onClick={handleReset} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center justify-center"><RotateCcw size={20} /></button>
                                <button onClick={handlePrevious} disabled={currentStep === 0} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"><ChevronLeft size={24} /></button>
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    disabled={currentStepData.completed}
                                    className={`p-3 rounded-xl ${isPlaying ? 'bg-orange-600 hover:bg-orange-500' : 'bg-amber-600 hover:bg-amber-500'} text-white transition-all flex items-center justify-center shadow-lg shadow-amber-900/20`}
                                >
                                    {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
                                </button>
                                <button onClick={handleNext} disabled={currentStepData.completed} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white transition-all flex items-center justify-center"><ChevronRight size={24} /></button>
                            </div>

                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex-1 flex flex-col min-h-[400px]">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-amber-400">
                                    <Code size={18} />
                                    <h3 className="font-bold text-sm uppercase tracking-wider">Algorithm</h3>
                                </div>
                                <div className="flex bg-slate-800 rounded p-1 border border-white/5">
                                    <button className={`px-2 py-1 text-[10px] font-bold rounded ${language === 'javascript' ? 'bg-amber-600 text-white' : 'text-slate-500'}`} onClick={() => setLanguage('javascript')}>JS</button>
                                    <button className={`px-2 py-1 text-[10px] font-bold rounded ${language === 'python' ? 'bg-amber-600 text-white' : 'text-slate-500'}`} onClick={() => setLanguage('python')}>PY</button>
                                </div>
                            </div>
                            <div className="flex-1 rounded-xl overflow-hidden border border-white/5 bg-[#1e1e1e]">
                                <SyntaxHighlighter
                                    language={language}
                                    style={atomDark}
                                    showLineNumbers={true}
                                    wrapLines={true}
                                    lineProps={(lineNumber: number) => ({
                                        style: {
                                            display: 'block',
                                            width: '100%',
                                            backgroundColor: lineNumber === currentLine ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                                            borderLeft: lineNumber === currentLine ? '3px solid #f59e0b' : '3px solid transparent'
                                        }
                                    })}
                                    customStyle={{ margin: 0, padding: '1rem', height: '100%', fontSize: '0.8rem' }}
                                >
                                    {code.join('\n')}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="flex flex-col gap-6">

                        <div className="min-h-[500px] lg:flex-grow bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-4 md:p-8 relative flex flex-col items-center justify-center overflow-visible">

                            {/* Narrator */}
                            <div className="absolute top-8 left-0 right-0 flex justify-center z-20">
                                <motion.div
                                    key={currentStepData.description}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="px-4 md:px-6 py-2 bg-slate-800/90 border border-amber-500/30 rounded-2xl md:rounded-full text-amber-100 font-medium shadow-2xl backdrop-blur-md flex items-center gap-3"
                                >
                                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                                    <span className="text-sm md:text-base">{currentStepData.description}</span>
                                </motion.div>
                            </div>

                            {/* Matrix Grid */}
                            <div className="relative z-10 flex flex-col items-center gap-8">
                                <div
                                    className="grid gap-2 md:gap-3 p-4 bg-slate-800/30 rounded-3xl border border-white/5 shadow-inner"
                                    style={{ gridTemplateColumns: `repeat(${matrix[0].length}, minmax(0, 1fr))` }}
                                >
                                    {matrix.map((row, rIdx) =>
                                        row.map((val, cIdx) => {
                                            const isActive = currentStepData.activeCell?.r === rIdx && currentStepData.activeCell?.c === cIdx;
                                            const isVisited = currentStepData.result.includes(val);

                                            return (
                                                <motion.div
                                                    key={`${rIdx}-${cIdx}`}
                                                    layout
                                                    className={`w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-sm md:text-xl font-bold transition-all duration-300 ${isActive
                                                        ? 'bg-amber-500 text-slate-950 scale-110 shadow-[0_0_30px_rgba(245,158,11,0.5)] z-20'
                                                        : isVisited
                                                            ? 'bg-slate-700/50 text-slate-400 scale-95 opacity-50'
                                                            : 'bg-slate-800 border border-white/5 text-slate-100'
                                                        }`}
                                                >
                                                    {val}
                                                </motion.div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Result List */}
                                <div className="max-w-3xl w-full">
                                    <div className="flex items-center gap-2 mb-3 text-slate-500">
                                        <ArrowRight size={14} />
                                        <span className="text-[10px] uppercase tracking-widest font-bold">Spiral Result Output</span>
                                    </div>
                                    <div className="flex flex-nowrap md:flex-wrap gap-2 p-4 bg-slate-950/80 border border-white/5 rounded-2xl min-h-[60px] shadow-inner overflow-x-auto pb-4 custom-scrollbar">
                                        <AnimatePresence mode="popLayout">
                                            {currentStepData.result.map((val, idx) => (
                                                <motion.div
                                                    key={`res-${val}-${idx}`}
                                                    initial={{ opacity: 0, scale: 0.5, x: 20 }}
                                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                                    className="w-8 h-8 md:w-10 md:h-10 shrink-0 flex items-center justify-center bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg font-mono font-bold text-xs md:text-sm"
                                                >
                                                    {val}
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        {currentStepData.result.length === 0 && (
                                            <div className="flex items-center text-slate-700 italic text-sm px-2">Ready to traverse...</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl sticky bottom-4 lg:relative lg:bottom-0">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-slate-800/40 rounded-2xl p-3 border border-white/5 flex flex-col justify-center">
                                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter mb-1">Matrix Size</span>
                                    <span className="text-lg md:text-xl font-bold text-amber-400">{matrix.length} × {matrix[0].length}</span>
                                </div>
                                <div className="bg-slate-800/40 rounded-2xl p-3 border border-white/5 flex flex-col justify-center">
                                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter mb-1">Traversed</span>
                                    <span className="text-lg md:text-xl font-bold text-orange-400">{currentStepData.result.length} / {matrix.length * matrix[0].length}</span>
                                </div>
                                <div className="bg-slate-800/40 rounded-2xl p-3 border border-white/5 flex flex-col justify-center">
                                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter mb-1">Time</span>
                                    <span className="text-lg md:text-xl font-bold text-cyan-400">O(R × C)</span>
                                </div>
                                <div className="bg-slate-800/40 rounded-2xl p-3 border border-white/5 flex flex-col justify-center">
                                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-tighter mb-1">Space</span>
                                    <span className="text-lg md:text-xl font-bold text-purple-400">O(1)</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <DSAExplanationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Spiral Matrix"
                description="Traverse a 2D matrix in a spiral clock-wise order."
                concept="The algorithm uses four markers (Top, Bottom, Left, Right) to keep track of the remaining boundaries. It moves systematically: Right along top, Down along right, Left along bottom, and Up along left, shrinking the 'active' matrix space at each complete side."
                efficiency="Every element of the matrix is visited exactly once. If the matrix has M rows and N columns, the total operations are M * N."
                useCases={[
                    "Rendering pixel data in specific visual patterns",
                    "Print layouts for multi-page documents",
                    "Data compression techniques for images"
                ]}
                timeComplexity="O(M × N)"
                spaceComplexity="O(1)"
                complexityNotes="M = rows, N = columns. We don't count the output array as extra space."
                interviewTips={[
                    "Always define the four boundaries clearly: top, bottom, left, right.",
                    "Be careful with the 'if (top <= bottom)' check inside the loop to avoid double-printing rows/cols.",
                    "Mention that this pattern can also be implemented recursively, though iterative is usually preferred for space efficiency."
                ]}
                color="rose"
            />
        </div>
    );
};

export default SpiralMatrixVisualizer;
