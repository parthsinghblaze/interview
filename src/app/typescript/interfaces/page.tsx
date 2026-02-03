'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TSVisualizer from '../../components/TSVisualizer';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function InterfacesPage() {
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
                        title="Interfaces & Type Erasure"
                        description="Interfaces are the most common way to define the shape of an object in TypeScript. They exist purely for the compiler to catch errors. Once the code is compiled to JavaScript, they are completely erased."
                        tsCode={`interface User {
  id: number;
  name: string;
  email?: string;
}

function greet(user: User): string {
  return 'Hello, ' + user.name;
}

const me: User = {
  id: 1,
  name: 'Parth'
};

console.log(greet(me));`}
                        jsCode={`function greet(user) {
  return 'Hello, ' + user.name;
}

var me = {
  id: 1,
  name: 'Parth'
};

console.log(greet(me));`}
                        concepts={[
                            {
                                title: "Zero Runtime Cost",
                                desc: "Interfaces add no extra weight to your production build. They don't exist in the output .js file."
                            },
                            {
                                title: "Compilation Only",
                                desc: "The 'User' shape is checked by the compiler. If you miss a property, you get an error before the JS ever runs."
                            },
                            {
                                title: "Optional Props",
                                desc: "The '?' marks optional properties, which the compiler ensures you handle safely with checks like undefined."
                            }
                        ]}
                        explanation={[
                            "First, we define the 'User' interface. This tells TypeScript exactly what fields an object must have.",
                            "The 'greet' function explicitly asks for a 'User' type. This allows TS to know that 'user.name' is safe to access.",
                            "When the compiler runs, it strips away the 'interface' block entirely because JavaScript doesn't support interfaces.",
                            "All type annotations (like ': User' or ': string') are also removed, leaving clean, standard JavaScript.",
                            "The resulting code is exactly what you would write in vanilla JS, but with the confidence that it was checked for errors first."
                        ]}
                    />

                    {/* Additional Content */}
                    <div className="mt-20">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Declaration Merging</h3>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800">
                            <p className="text-gray-600 dark:text-slate-400 mb-6 font-medium">
                                One unique feature of Interfaces is that they can be defined multiple times and TypeScript will merge them into a single definition.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-900 rounded-xl font-mono text-sm">
                                        <code className="text-slate-300">
                                            interface Window {'{'}<br />
                                            &nbsp;&nbsp;title: string;<br />
                                            {'}'}<br /><br />
                                            interface Window {'{'}<br />
                                            &nbsp;&nbsp;isMaximized: boolean;<br />
                                            {'}'}
                                        </code>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                                        <Shield size={20} />
                                        Merged Result
                                    </div>
                                    <p className="text-gray-600 dark:text-slate-400 text-sm italic">
                                        The final 'Window' interface will have BOTH 'title' and 'isMaximized' properties. This is extremely useful for extending third-party libraries.
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
