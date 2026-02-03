'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, CheckCircle2, Zap, Clock, Database, BrainCircuit } from 'lucide-react';

interface ExplanationSection {
    title: string;
    content: React.ReactNode;
}

interface DSAExplanationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    concept: string;
    efficiency: string;
    useCases: string[];
    timeComplexity: string;
    spaceComplexity: string;
    complexityNotes?: string;
    interviewTips: string[];
    color?: 'blue' | 'purple' | 'rose' | 'green';
}

const DSAExplanationModal: React.FC<DSAExplanationModalProps> = ({
    isOpen,
    onClose,
    title,
    concept,
    efficiency,
    useCases,
    timeComplexity,
    spaceComplexity,
    complexityNotes,
    interviewTips,
    color = 'blue'
}) => {
    const colorClasses = {
        blue: 'text-blue-400 bg-blue-500/20 border-blue-500/30 ring-blue-500/10',
        purple: 'text-purple-400 bg-purple-500/20 border-purple-500/30 ring-purple-500/10',
        rose: 'text-rose-400 bg-rose-500/20 border-rose-500/30 ring-rose-500/10',
        green: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30 ring-emerald-500/10'
    };

    const headerGradient = {
        blue: 'from-blue-500/10',
        purple: 'from-purple-500/10',
        rose: 'from-rose-500/10',
        green: 'from-emerald-500/10'
    };

    const buttonBg = {
        blue: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20',
        purple: 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20',
        rose: 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20',
        green: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'
    };

    const accentColor = {
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
        rose: 'bg-rose-500',
        green: 'bg-emerald-500'
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-slate-900 border border-white/10 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r ${headerGradient[color]} to-transparent`}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${colorClasses[color].split(' ')[1]} ${colorClasses[color].split(' ')[0]}`}>
                                    <BrainCircuit size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white leading-tight">{title}</h2>
                                    <p className="text-slate-400 text-sm">Algorithm Deep Dive</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 text-slate-400 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-10">
                            {/* Concept Section */}
                            <section>
                                <h3 className={`${colorClasses[color].split(' ')[0]} font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2`}>
                                    <HelpCircle size={16} />
                                    The Core Concept
                                </h3>
                                <p className="text-slate-300 leading-relaxed text-lg">
                                    {concept}
                                </p>
                            </section>

                            {/* Efficiency & Use Cases */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5">
                                    <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                                        <CheckCircle2 size={18} className="text-green-400" />
                                        Performance Hit
                                    </h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {efficiency}
                                    </p>
                                </div>
                                <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5">
                                    <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                                        <Zap size={18} className="text-amber-400" />
                                        Real-world Utility
                                    </h4>
                                    <ul className="space-y-2">
                                        {useCases.map((useCase, idx) => (
                                            <li key={idx} className="text-slate-400 text-xs flex gap-2">
                                                <div className="w-1 h-1 rounded-full bg-slate-600 mt-1.5 shrink-0"></div>
                                                {useCase}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>

                            {/* Big O Analysis */}
                            <section>
                                <h3 className={`${colorClasses[color].split(' ')[0]} font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2`}>
                                    <Clock size={16} />
                                    Computational Complexity
                                </h3>
                                <div className="bg-slate-950 rounded-2xl p-6 border border-white/10 relative overflow-hidden group">
                                    <div className={`absolute top-0 right-0 w-32 h-32 ${accentColor[color]} opacity-[0.03] rounded-full -mr-16 -mt-16 blur-2xl group-hover:opacity-[0.05] transition-opacity`}></div>
                                    <div className="grid grid-cols-2 gap-8 relative z-10">
                                        <div className="space-y-1">
                                            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Time Complexity</span>
                                            <div className="text-3xl font-mono text-white tracking-tighter">{timeComplexity}</div>
                                        </div>
                                        <div className="space-y-1 border-l border-white/5 pl-8">
                                            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Space Complexity</span>
                                            <div className="text-3xl font-mono text-white tracking-tighter">{spaceComplexity}</div>
                                        </div>
                                    </div>
                                    {complexityNotes && (
                                        <p className="text-[10px] text-slate-500 italic mt-4 font-mono border-t border-white/5 pt-3">
                                            {complexityNotes}
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* Interview Tips */}
                            <section>
                                <h3 className={`${colorClasses[color].split(' ')[0]} font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2`}>
                                    <Database size={16} />
                                    Interview Strategy
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {interviewTips.map((tip, idx) => (
                                        <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-800/30 border border-white/5 hover:bg-slate-800/50 transition-colors group">
                                            <div className={`w-6 h-6 rounded-full ${colorClasses[color].split(' ')[1]} ${colorClasses[color].split(' ')[0]} flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}>
                                                {idx + 1}
                                            </div>
                                            <span className="text-slate-300 text-sm leading-relaxed">{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/5 bg-slate-950/50">
                            <button
                                onClick={onClose}
                                className={`w-full py-4 ${buttonBg[color]} text-white font-bold rounded-2xl transition-all shadow-lg transform active:scale-[0.98]`}
                            >
                                Understood, back to code!
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DSAExplanationModal;
