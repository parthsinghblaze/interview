'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Database, TrendingUp, Zap, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ComplexityPage = () => {
    const [inputSize, setInputSize] = useState(10);
    const [activeTab, setActiveTab] = useState<'time' | 'space'>('time');

    // Calculate operations for different complexities
    const calculateOps = (n: number) => ({
        O1: 1,
        Ologn: Math.ceil(Math.log2(n)),
        On: n,
        Onlogn: Math.ceil(n * Math.log2(n)),
        On2: n * n,
        On3: n * n * n
    });

    const ops = calculateOps(inputSize);

    const timeComplexities = [
        {
            notation: 'O(1)',
            name: 'Constant Time',
            description: 'Operations take the same time regardless of input size',
            color: 'emerald',
            example: 'Array access by index',
            code: 'arr[0]',
            operations: ops.O1,
            icon: Zap
        },
        {
            notation: 'O(log n)',
            name: 'Logarithmic Time',
            description: 'Operations grow slowly as input increases',
            color: 'blue',
            example: 'Binary Search',
            code: 'binarySearch(arr, target)',
            operations: ops.Ologn,
            icon: TrendingUp
        },
        {
            notation: 'O(n)',
            name: 'Linear Time',
            description: 'Operations grow proportionally with input',
            color: 'cyan',
            example: 'Loop through array',
            code: 'for (let i = 0; i < n; i++)',
            operations: ops.On,
            icon: ArrowRight
        },
        {
            notation: 'O(n log n)',
            name: 'Linearithmic Time',
            description: 'Efficient sorting algorithms',
            color: 'yellow',
            example: 'Merge Sort, Quick Sort',
            code: 'mergeSort(arr)',
            operations: ops.Onlogn,
            icon: TrendingUp
        },
        {
            notation: 'O(n²)',
            name: 'Quadratic Time',
            description: 'Nested loops over input',
            color: 'orange',
            example: 'Bubble Sort',
            code: 'for i, for j nested',
            operations: ops.On2,
            icon: AlertCircle
        },
        {
            notation: 'O(n³)',
            name: 'Cubic Time',
            description: 'Triple nested loops',
            color: 'red',
            example: 'Matrix multiplication',
            code: 'for i, for j, for k',
            operations: ops.On3,
            icon: AlertCircle
        }
    ];

    const spaceComplexities = [
        {
            notation: 'O(1)',
            name: 'Constant Space',
            description: 'Uses fixed amount of memory',
            color: 'emerald',
            example: 'Few variables',
            code: 'let sum = 0; let max = arr[0];',
            visual: Array(3).fill(1)
        },
        {
            notation: 'O(n)',
            name: 'Linear Space',
            description: 'Memory grows with input size',
            color: 'blue',
            example: 'Copy of array',
            code: 'let copy = [...arr];',
            visual: Array(inputSize > 20 ? 20 : inputSize).fill(1)
        },
        {
            notation: 'O(log n)',
            name: 'Logarithmic Space',
            description: 'Memory grows slowly',
            color: 'cyan',
            example: 'Recursive call stack',
            code: 'function recurse(n) {...}',
            visual: Array(Math.ceil(Math.log2(inputSize)) || 1).fill(1)
        },
        {
            notation: 'O(n²)',
            name: 'Quadratic Space',
            description: 'Space grows quadratically',
            color: 'orange',
            example: '2D matrix',
            code: 'let matrix = Array(n).fill(Array(n));',
            visual: Array(Math.min(inputSize, 10)).fill(1)
        }
    ];

    const getMaxHeight = () => {
        const maxOps = Math.max(ops.O1, ops.Ologn, ops.On, ops.Onlogn, ops.On2);
        return maxOps > 0 ? maxOps : 100;
    };

    const maxHeight = getMaxHeight();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            <Header />

            <main className="pt-24 pb-20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                                Algorithm Complexity
                            </h1>
                            <p className="text-lg md:text-xl text-blue-300 max-w-3xl mx-auto px-4">
                                Understanding how algorithms scale with input size - the foundation of writing efficient code
                            </p>
                        </motion.div>
                    </div>

                    {/* Definitions Section - Full Screen */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        {/* Time Complexity Definition */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-blue-900/40 to-slate-900 rounded-2xl p-8 border border-blue-500/30 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-blue-500/20 rounded-xl">
                                    <Clock size={32} className="text-blue-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">Time Complexity</h2>
                            </div>

                            {/* Interview Term */}
                            <div className="mb-6">
                                <div className="inline-block px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-xs font-semibold mb-3">
                                    📝 INTERVIEW DEFINITION
                                </div>
                                <p className="text-lg text-blue-100 leading-relaxed border-l-4 border-blue-500 pl-4 italic">
                                    "Time complexity is a measure of the amount of time an algorithm takes to complete as a function of the input size,
                                    typically expressed using Big O notation to describe the worst-case scenario."
                                </p>
                            </div>

                            {/* Simple English */}
                            <div className="mb-6">
                                <div className="inline-block px-3 py-1 bg-cyan-500/20 rounded-full text-cyan-300 text-xs font-semibold mb-3">
                                    💬 IN SIMPLE ENGLISH
                                </div>
                                <p className="text-lg text-slate-200 leading-relaxed">
                                    Time complexity tells you <strong className="text-cyan-400">how slow your code gets</strong> when you give it more data.
                                    It's like asking: "If I double the input, will my code take twice as long, or 100 times longer?"
                                </p>
                            </div>

                            {/* Real-World Analogy */}
                            <div className="mb-6">
                                <div className="inline-block px-3 py-1 bg-green-500/20 rounded-full text-green-300 text-xs font-semibold mb-3">
                                    🌍 REAL-WORLD ANALOGY
                                </div>
                                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-700">
                                    <p className="text-slate-300 leading-relaxed">
                                        Imagine finding a book in a library:
                                    </p>
                                    <ul className="mt-3 space-y-2 text-slate-400">
                                        <li className="flex gap-2">
                                            <span className="text-emerald-400">•</span>
                                            <span><strong className="text-white">O(1)</strong>: You know the exact shelf location</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-blue-400">•</span>
                                            <span><strong className="text-white">O(log n)</strong>: You use the index to narrow down sections</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-orange-400">•</span>
                                            <span><strong className="text-white">O(n)</strong>: You check every single book one by one</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Key Points */}
                            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                                <h4 className="text-sm font-bold text-blue-300 mb-3 uppercase tracking-wider">Why It Matters</h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                        <span>Helps predict how your code performs with large datasets</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                        <span>Critical for passing technical interviews at top companies</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                        <span>Enables you to choose the right algorithm for the job</span>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>

                        {/* Space Complexity Definition */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-br from-purple-900/40 to-slate-900 rounded-2xl p-8 border border-purple-500/30 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-purple-500/20 rounded-xl">
                                    <Database size={32} className="text-purple-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">Space Complexity</h2>
                            </div>

                            {/* Interview Term */}
                            <div className="mb-6">
                                <div className="inline-block px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-xs font-semibold mb-3">
                                    📝 INTERVIEW DEFINITION
                                </div>
                                <p className="text-lg text-purple-100 leading-relaxed border-l-4 border-purple-500 pl-4 italic">
                                    "Space complexity is the total amount of memory space required by an algorithm to execute,
                                    including both the input data and any auxiliary space used during computation."
                                </p>
                            </div>

                            {/* Simple English */}
                            <div className="mb-6">
                                <div className="inline-block px-3 py-1 bg-pink-500/20 rounded-full text-pink-300 text-xs font-semibold mb-3">
                                    💬 IN SIMPLE ENGLISH
                                </div>
                                <p className="text-lg text-slate-200 leading-relaxed">
                                    Space complexity measures <strong className="text-pink-400">how much memory (RAM) your program needs</strong> to run.
                                    It's like asking: "How many sticky notes do I need while solving this problem?"
                                </p>
                            </div>

                            {/* Real-World Analogy */}
                            <div className="mb-6">
                                <div className="inline-block px-3 py-1 bg-green-500/20 rounded-full text-green-300 text-xs font-semibold mb-3">
                                    🌍 REAL-WORLD ANALOGY
                                </div>
                                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-700">
                                    <p className="text-slate-300 leading-relaxed">
                                        Think of organizing photos on your desk:
                                    </p>
                                    <ul className="mt-3 space-y-2 text-slate-400">
                                        <li className="flex gap-2">
                                            <span className="text-emerald-400">•</span>
                                            <span><strong className="text-white">O(1)</strong>: Flip through them one by one (no extra space)</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-blue-400">•</span>
                                            <span><strong className="text-white">O(n)</strong>: Make a complete copy to sort (needs 2x desk space)</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-orange-400">•</span>
                                            <span><strong className="text-white">O(n²)</strong>: Create a comparison matrix (needs huge table)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Key Points */}
                            <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                                <h4 className="text-sm font-bold text-purple-300 mb-3 uppercase tracking-wider">Why It Matters</h4>
                                <ul className="space-y-2 text-sm text-slate-300">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                        <span>Prevents your application from crashing due to memory limits</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                        <span>Crucial for mobile apps and embedded systems with limited RAM</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                                        <span>Common interview question: "Can you optimize space usage?"</span>
                                    </li>
                                </ul>
                            </div>
                        </motion.div>
                    </div>

                    {/* Big O Notation Quick Reference */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700 mb-16"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Zap className="text-yellow-400" />
                            Big O Notation Quick Reference
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { notation: 'O(1)', name: 'Constant', color: 'emerald', speed: 'Excellent' },
                                { notation: 'O(log n)', name: 'Logarithmic', color: 'blue', speed: 'Great' },
                                { notation: 'O(n)', name: 'Linear', color: 'cyan', speed: 'Good' },
                                { notation: 'O(n log n)', name: 'Linearithmic', color: 'yellow', speed: 'Fair' },
                                { notation: 'O(n²)', name: 'Quadratic', color: 'orange', speed: 'Poor' },
                                { notation: 'O(2ⁿ)', name: 'Exponential', color: 'red', speed: 'Terrible' }
                            ].map((item, idx) => (
                                <div key={idx} className={`flex items-center justify-between bg-slate-950/50 p-4 rounded-xl border border-${item.color}-500/20`}>
                                    <div>
                                        <div className="font-mono font-bold text-white mb-1">{item.notation}</div>
                                        <div className="text-sm text-slate-400">{item.name}</div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-${item.color}-500/20 text-${item.color}-400`}>
                                        {item.speed}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <p className="text-sm text-blue-200">
                                <strong className="text-blue-400">Pro Tip:</strong> When analyzing complexity, focus on the <strong>dominant term</strong> as input grows.
                                Constants and lower-order terms are dropped: O(3n² + 5n + 10) → <strong>O(n²)</strong>
                            </p>
                        </div>
                    </motion.div>

                    {/* Tab Selector */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                        <button
                            onClick={() => setActiveTab('time')}
                            className={`flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all ${activeTab === 'time'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            <Clock size={20} className="md:w-6 md:h-6" />
                            Time Complexity
                        </button>
                        <button
                            onClick={() => setActiveTab('space')}
                            className={`flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-all ${activeTab === 'space'
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            <Database size={20} className="md:w-6 md:h-6" />
                            Space Complexity
                        </button>
                    </div>

                    {activeTab === 'time' ? (
                        <>
                            {/* Input Size Slider */}
                            <div className="bg-slate-900 rounded-2xl p-8 mb-12 border border-slate-800">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-white font-semibold text-lg">Input Size (n)</label>
                                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                        {inputSize}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={inputSize}
                                    onChange={(e) => setInputSize(parseInt(e.target.value))}
                                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between text-slate-500 text-sm mt-2">
                                    <span>1</span>
                                    <span>50</span>
                                    <span>100</span>
                                </div>
                            </div>

                            {/* Growth Visualization */}
                            <div className="bg-slate-900 rounded-2xl p-4 md:p-8 mb-12 border border-slate-800 overflow-x-auto">
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Operations Growth Comparison</h2>
                                <div className="flex items-end justify-around gap-2 md:gap-4 h-80 min-w-[600px] md:min-w-0 bg-slate-950/50 p-4 md:p-6 rounded-xl border border-slate-800">
                                    {timeComplexities.map((complexity) => {
                                        const height = (complexity.operations / maxHeight) * 100;
                                        const isTooBig = complexity.operations > 1000;

                                        return (
                                            <div key={complexity.notation} className="flex flex-col items-center gap-3 flex-1">
                                                <div className="text-center min-h-[60px]">
                                                    <div className={`text-xs md:text-sm font-mono font-bold mb-1 text-${complexity.color}-400`}>
                                                        {complexity.notation}
                                                    </div>
                                                    <div className="text-lg md:text-2xl font-bold text-white">
                                                        {isTooBig ? '∞' : complexity.operations.toLocaleString()}
                                                    </div>
                                                    <div className="text-[10px] md:text-xs text-slate-500">ops</div>
                                                </div>
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: isTooBig ? '100%' : `${Math.min(height, 100)}%` }}
                                                    transition={{ duration: 0.5 }}
                                                    className={`w-full rounded-t-xl bg-gradient-to-t from-${complexity.color}-600 to-${complexity.color}-400 min-h-[20px] relative shadow-lg`}
                                                    style={{
                                                        background: isTooBig
                                                            ? `linear-gradient(to top, rgb(239, 68, 68), rgb(248, 113, 113))`
                                                            : undefined
                                                    }}
                                                >
                                                    {isTooBig && (
                                                        <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] md:text-xs font-bold rotate-90 md:rotate-0">
                                                            Too Large!
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Complexity Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {timeComplexities.map((complexity, idx) => (
                                    <motion.div
                                        key={complexity.notation}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-blue-500/50 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 bg-${complexity.color}-500/20 rounded-lg`}>
                                                <complexity.icon className={`text-${complexity.color}-400`} size={24} />
                                            </div>
                                            <span className="text-sm font-mono bg-slate-800 px-3 py-1 rounded text-blue-300">
                                                {complexity.notation}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2">{complexity.name}</h3>
                                        <p className="text-slate-400 text-sm mb-4">{complexity.description}</p>
                                        <div className="bg-slate-950 rounded-lg p-3 mb-3">
                                            <div className="text-xs text-slate-500 mb-1">Example:</div>
                                            <div className="text-sm text-cyan-400 font-mono">{complexity.code}</div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">For n = {inputSize}</span>
                                            <span className="text-lg font-bold text-white">{complexity.operations.toLocaleString()} ops</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Real-World Examples */}
                            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
                                <h2 className="text-2xl font-bold text-white mb-6">Common Algorithm Complexities</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { algo: 'Array Access', complexity: 'O(1)', color: 'emerald' },
                                        { algo: 'Binary Search', complexity: 'O(log n)', color: 'blue' },
                                        { algo: 'Linear Search', complexity: 'O(n)', color: 'cyan' },
                                        { algo: 'Merge Sort', complexity: 'O(n log n)', color: 'yellow' },
                                        { algo: 'Bubble Sort', complexity: 'O(n²)', color: 'orange' },
                                        { algo: 'Fibonacci (naive)', complexity: 'O(2ⁿ)', color: 'red' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                                            <span className="text-white font-medium">{item.algo}</span>
                                            <span className={`px-3 py-1 bg-${item.color}-500/20 text-${item.color}-400 rounded font-mono text-sm`}>
                                                {item.complexity}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Space Complexity Section */}
                            <div className="bg-slate-900 rounded-2xl p-8 mb-12 border border-slate-800">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-white font-semibold text-lg">Input Size (n)</label>
                                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        {inputSize}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={inputSize}
                                    onChange={(e) => setInputSize(parseInt(e.target.value))}
                                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                            </div>

                            {/* Space Complexity Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                                {spaceComplexities.map((complexity, idx) => (
                                    <motion.div
                                        key={complexity.notation}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-slate-900 rounded-xl p-6 border border-slate-800"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-bold text-white">{complexity.name}</h3>
                                            <span className="text-sm font-mono bg-slate-800 px-3 py-1 rounded text-purple-300">
                                                {complexity.notation}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 text-sm mb-4">{complexity.description}</p>

                                        {/* Memory Visualization */}
                                        <div className="bg-slate-950 rounded-lg p-4 mb-4 min-h-[120px]">
                                            <div className="text-xs text-slate-500 mb-3">Memory Usage:</div>
                                            <div className="flex flex-wrap gap-1">
                                                {complexity.visual.map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className={`w-6 h-6 bg-gradient-to-br from-${complexity.color}-500 to-${complexity.color}-600 rounded shadow-lg`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-2">
                                                {complexity.visual.length} memory unit{complexity.visual.length !== 1 ? 's' : ''}
                                            </div>
                                        </div>

                                        <div className="bg-slate-950 rounded-lg p-3">
                                            <div className="text-xs text-slate-500 mb-1">Code Example:</div>
                                            <div className="text-sm text-cyan-400 font-mono">{complexity.code}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Space Complexity Examples */}
                            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">
                                <h2 className="text-2xl font-bold text-white mb-6">Space Complexity in Practice</h2>
                                <div className="space-y-4">
                                    {[
                                        {
                                            scenario: 'In-place sorting (variables only)',
                                            space: 'O(1)',
                                            color: 'emerald',
                                            icon: CheckCircle
                                        },
                                        {
                                            scenario: 'Copying an array',
                                            space: 'O(n)',
                                            color: 'blue',
                                            icon: Database
                                        },
                                        {
                                            scenario: 'Recursive call stack (balanced tree)',
                                            space: 'O(log n)',
                                            color: 'cyan',
                                            icon: TrendingUp
                                        },
                                        {
                                            scenario: 'Creating a 2D matrix',
                                            space: 'O(n²)',
                                            color: 'orange',
                                            icon: AlertCircle
                                        }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <item.icon className={`text-${item.color}-400`} size={20} />
                                                <span className="text-white">{item.scenario}</span>
                                            </div>
                                            <span className={`px-3 py-1 bg-${item.color}-500/20 text-${item.color}-400 rounded font-mono text-sm`}>
                                                {item.space}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Key Takeaways */}
                    <div className="mt-12 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/30">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Zap className="text-yellow-400" />
                            Key Takeaways
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4 text-slate-300">
                            <div className="flex gap-3">
                                <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={20} />
                                <p>Big O notation describes the <strong>worst-case</strong> growth rate of algorithms</p>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={20} />
                                <p>Focus on the <strong>dominant term</strong> - constants and smaller terms don't matter</p>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={20} />
                                <p>Time complexity measures <strong>how long</strong> an algorithm takes</p>
                            </div>
                            <div className="flex gap-3">
                                <CheckCircle className="text-green-400 flex-shrink-0 mt-1" size={20} />
                                <p>Space complexity measures <strong>how much memory</strong> is used</p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ComplexityPage;
