'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TSVisualizer from '../../components/TSVisualizer';
import { motion } from 'framer-motion';
import { Cpu, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GenericsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            <Header />

            <main className="pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumbs */}
                    <div className="mb-8">
                        <Link
                            href="/typescript"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to TypeScript
                        </Link>
                    </div>

                    <TSVisualizer
                        title="Generics: Reusable Safety"
                        description="Generics allow you to create components that work with multiple types without losing type safety. They are like 'variables' for your types, which are completely erased during compilation."
                        tsCode={`function wrapInArray<T>(item: T): T[] {
  return [item];
}

const numbers = wrapInArray<number>(10);
const strings = wrapInArray<string>('Hi');

// TypeScript knows 'numbers' is number[]
const first = numbers[0].toFixed(2);`}
                        jsCode={`function wrapInArray(item) {
  return [item];
}

var numbers = wrapInArray(10);
var strings = wrapInArray('Hi');

var first = numbers[0].toFixed(2);`}
                        concepts={[
                            {
                                title: "Type Parametrization",
                                desc: "The <T> is a placeholder that is swapped for a real type (like number or string) when the function is called."
                            },
                            {
                                title: "Inference",
                                desc: "TypeScript can often guess 'T' based on the argument passed, so you don't always have to write <number> explicitly."
                            },
                            {
                                title: "Identity Loss",
                                desc: "In JS, the function becomes a 'black box' that takes anything and returns an array of anything."
                            }
                        ]}
                        explanation={[
                            "Defines a generic function 'wrapInArray' with type parameter <T>.",
                            "TypeScript ensures that whatever type 'item' is, the return type must be an array of that same type.",
                            "When calling the function, we precisely define what 'T' is, or let TS infer it from the argument.",
                            "During compilation, all <T> syntax is stripped away. JavaScript handles the logic with dynamic types.",
                            "The resulting JS is ultra-clean, but we had full type safety while writing it!"
                        ]}
                    />

                    {/* Additional Content: Constraints */}
                    <div className="mt-20">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Generic Constraints</h3>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800">
                            <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                                Sometimes you don't want 'T' to be *anything*. You can use the <code className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-blue-500">extends</code> keyword to limit what types can be passed.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest">TS with Constraint</h4>
                                    <div className="p-4 bg-slate-900 rounded-xl font-mono text-sm">
                                        <code className="text-slate-300">
                                            interface HasLength {'{'}<br />
                                            &nbsp;&nbsp;length: number;<br />
                                            {'}'}<br /><br />
                                            function logLength&lt;T <span className="text-emerald-400">extends</span> HasLength&gt;(obj: T) {'{'}<br />
                                            &nbsp;&nbsp;console.log(obj.length);<br />
                                            {'}'}
                                        </code>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold mb-2">
                                        <Cpu size={20} />
                                        Safety Check
                                    </div>
                                    <p className="text-gray-600 dark:text-slate-400 text-sm">
                                        By constraining 'T' to 'HasLength', TypeScript ensures we can only pass objects that actually HAVE a length property (like strings or arrays). Passing a number would throw a compiler error.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
