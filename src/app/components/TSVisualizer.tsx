'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code, ArrowRight, Zap, Shield, HelpCircle } from 'lucide-react';

interface TSVisualizerProps {
    title: string;
    description: string;
    tsCode: string;
    jsCode: string;
    explanation: string[];
    concepts: { title: string; desc: string }[];
}

const TSVisualizer: React.FC<TSVisualizerProps> = ({
    title,
    description,
    tsCode,
    jsCode,
    explanation,
    concepts
}) => {
    return (
        <div className="space-y-12">
            {/* Header section with description */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
                <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed max-w-3xl">
                    {description}
                </p>
            </div>

            {/* Visualizer Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
                {/* TS Side */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col h-full bg-slate-900 rounded-3xl overflow-hidden border border-blue-500/30 shadow-2xl shadow-blue-500/10"
                >
                    <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="text-sm font-mono text-blue-400 uppercase tracking-widest font-bold">input.ts</span>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">TypeScript Source</span>
                    </div>
                    <div className="p-8 flex-grow overflow-auto">
                        <pre className="text-sm md:text-base font-mono leading-relaxed">
                            <code className="text-slate-300">
                                {tsCode.split('\n').map((line, i) => (
                                    <div key={i} className="flex">
                                        <span className="text-slate-600 mr-6 select-none text-right w-4">{i + 1}</span>
                                        <span dangerouslySetInnerHTML={{
                                            __html: line
                                                .replace(/\b(interface|class|enum|const|let|var|function|return|as)\b/g, '<span class="text-blue-400">$1</span>')
                                                .replace(/\b(string|number|boolean|any|void)\b/g, '<span class="text-emerald-400">$1</span>')
                                                .replace(/: ([A-Z][a-zA-Z]*)/g, ': <span class="text-emerald-400">$1</span>')
                                                .replace(/'([^']*)'/g, '<span class="text-orange-300">\'$1\'</span>')
                                        }} />
                                    </div>
                                ))}
                            </code>
                        </pre>
                    </div>
                </motion.div>

                {/* Connection Arrow (Desktop) */}
                <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-slate-900 rounded-full border-2 border-gray-200 dark:border-slate-800 items-center justify-center shadow-lg">
                    <ArrowRight className="text-blue-500 animate-pulse" />
                </div>

                {/* JS Side */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col h-full bg-slate-900 rounded-3xl overflow-hidden border border-yellow-500/30 shadow-2xl shadow-yellow-500/10"
                >
                    <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span className="text-sm font-mono text-yellow-500 uppercase tracking-widest font-bold">output.js</span>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">JavaScript Output</span>
                    </div>
                    <div className="p-8 flex-grow overflow-auto">
                        <pre className="text-sm md:text-base font-mono leading-relaxed">
                            <code className="text-slate-300">
                                {jsCode.split('\n').map((line, i) => (
                                    <div key={i} className="flex">
                                        <span className="text-slate-600 mr-6 select-none text-right w-4">{i + 1}</span>
                                        <span dangerouslySetInnerHTML={{
                                            __html: line
                                                .replace(/\b(var|let|const|function|return|class|constructor)\b/g, '<span class="text-yellow-500/80">$1</span>')
                                                .replace(/'([^']*)'/g, '<span class="text-orange-300">\'$1\'</span>')
                                        }} />
                                    </div>
                                ))}
                            </code>
                        </pre>
                    </div>
                </motion.div>
            </div>

            {/* Explanation Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Concepts Column */}
                <div className="md:col-span-1 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Zap size={20} className="text-blue-500" />
                        Key Takeaways
                    </h3>
                    <div className="space-y-3">
                        {concepts.map((concept, i) => (
                            <div key={i} className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/20">
                                <h4 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-1">{concept.title}</h4>
                                <p className="text-xs text-blue-600/80 dark:text-blue-200/60 leading-relaxed">{concept.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step by Step Explanation */}
                <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <HelpCircle size={20} className="text-emerald-500" />
                        What's happening?
                    </h3>
                    <div className="space-y-6">
                        {explanation.map((text, i) => (
                            <div key={i} className="flex gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-gray-500">
                                    {i + 1}
                                </span>
                                <p className="text-gray-600 dark:text-slate-400 leading-relaxed">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TSVisualizer;
