'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TSVisualizer from '../../components/TSVisualizer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MappedTypesPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            <Header />

            <main className="pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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
                        title="Mapped Types: Property Logic"
                        description="Mapped types allow you to create new types by transforming the properties of an existing type. You can iterate over keys using the 'in keyof' syntax, similar to a loop for types."
                        tsCode={`interface Flags {
  darkMode: boolean;
  premium: boolean;
}

// Transform all booleans to functions
type FlagListeners = {
  [K in keyof Flags]: (value: boolean) => void;
};

const listeners: FlagListeners = {
  darkMode: (v) => console.log('Dark: ' + v),
  premium: (v) => console.log('Premium: ' + v)
};`}
                        jsCode={`var listeners = {
    darkMode: function (v) { 
        return console.log('Dark: ' + v); 
    },
    premium: function (v) { 
        return console.log('Premium: ' + v); 
    }
};`}
                        concepts={[
                            {
                                title: "Type Iteration",
                                desc: "The 'keyof' operator gets all property names, and 'in' iterates over them."
                            },
                            {
                                title: "Metaprogramming",
                                desc: "Mapped types allow you to program your types, creating complex relationships between different data shapes."
                            },
                            {
                                title: "Zero Runtime",
                                desc: "Since this is logic for the type system, it has no presence in the compiled JavaScript output."
                            }
                        ]}
                        explanation={[
                            "Defines a source interface 'Flags' with two boolean properties.",
                            "The 'FlagListeners' type uses a map: for every key 'K' in 'Flags', it creates a new property.",
                            "Instead of a boolean, the new property is a function signature '(value: boolean) => void'.",
                            "TypeScript ensures that if you add a property to 'Flags', you MUST add it to 'listeners' as well.",
                            "This 'Type-level logic' is completely resolved by the compiler, leaving only the literal object in JS."
                        ]}
                    />

                    {/* Mapping Modifiers */}
                    <div className="mt-20">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Mapping Modifiers (+/-)</h3>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800">
                            <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                                You can add or remove modifiers like <code className="text-blue-500">readonly</code> or <code className="text-blue-500">?</code> during the mapping process.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest text-center">Make Everything Required</h4>
                                    <div className="p-4 bg-slate-900 rounded-xl font-mono text-sm leading-loose">
                                        <code className="text-slate-300">
                                            type Concrete&lt;T&gt; = {'{'}<br />
                                            &nbsp;&nbsp;[P <span className="text-blue-400">in</span> <span className="text-emerald-400">keyof</span> T]<span className="text-orange-400">-?</span>: T[P];<br />
                                            {'}'};
                                        </code>
                                    </div>
                                    <p className="text-xs text-gray-500 text-center">The "-?" removes the optionality from every property.</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest text-center">Make Everything Readonly</h4>
                                    <div className="p-4 bg-slate-900 rounded-xl font-mono text-sm leading-loose">
                                        <code className="text-slate-300">
                                            type Locked&lt;T&gt; = {'{'}<br />
                                            &nbsp;&nbsp;<span className="text-blue-400">readonly</span> [P <span className="text-blue-400">in</span> <span className="text-emerald-400">keyof</span> T]: T[P];<br />
                                            {'}'};
                                        </code>
                                    </div>
                                    <p className="text-xs text-gray-500 text-center">Adds the 'readonly' modifier to every property during iteration.</p>
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

// Helper icons missing in imports
function Repeat(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m17 2 4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="m7 22-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
    )
}
