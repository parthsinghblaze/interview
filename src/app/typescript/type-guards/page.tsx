'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TSVisualizer from '../../components/TSVisualizer';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TypeGuardsPage() {
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
                        title="Type Guards: Narrowing"
                        description="Type guards are expressions that perform a runtime check that guarantees a type in some scope. TypeScript 'listens' to these checks to narrow down types automatically."
                        tsCode={`function printValue(val: string | number) {
  if (typeof val === 'string') {
    // TS knows 'val' is string here
    console.log(val.toUpperCase());
  } else {
    // TS knows 'val' is number here
    console.log(val.toFixed(2));
  }
}

class Bird { fly() {} }
function action(animal: any) {
  if (animal instanceof Bird) {
    animal.fly();
  }
}`}
                        jsCode={`function printValue(val) {
    if (typeof val === 'string') {
        console.log(val.toUpperCase());
    }
    else {
        console.log(val.toFixed(2));
    }
}

var Bird = (function () {
    function Bird() { }
    Bird.prototype.fly = function () { };
    return Bird;
}());

function action(animal) {
    if (animal instanceof Bird) {
        animal.fly();
    }
}`}
                        concepts={[
                            {
                                title: "Narrowing",
                                desc: "Moving from a 'broader' type (string | number) to a 'narrow' type (string) based on code logic."
                            },
                            {
                                title: "Runtime Proof",
                                desc: "Guards use real JS operators like 'typeof' and 'instanceof' that exist at runtime."
                            },
                            {
                                title: "Exhaustiveness",
                                desc: "If you check for all possibilities in a union, TS can tell if you've missed a case."
                            }
                        ]}
                        explanation={[
                            "Defines a function taking a union type 'string | number'.",
                            "The 'if (typeof val === 'string')' block is a standard JS check.",
                            "TypeScript understands this check and enables string-specific methods inside the block.",
                            "In the 'else' block, TS automatically infers that if it's not a string, it MUST be a number.",
                            "The JS output is identical to the input logic because type guards bridge the gap between compile-time and runtime."
                        ]}
                    />

                    {/* Custom Type Predicates */}
                    <div className="mt-20">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Custom Type Predicates</h3>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800">
                            <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                                You can also define your own type guards using the <code className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-blue-500">parameter is Type</code> syntax.
                            </p>
                            <div className="p-6 bg-slate-900 rounded-2xl font-mono text-sm overflow-x-auto">
                                <code className="text-slate-300">
                                    interface Cat {'{'} meow: () ={' > '} void {'}'}<br /><br />
                                    function <span className="text-blue-400">isCat</span>(pet: any): pet <span className="text-emerald-400">is</span> Cat {'{'}<br />
                                    &nbsp;&nbsp;return (pet <span className="text-blue-400">as</span> Cat).meow !== undefined;<br />
                                    {'}'}<br /><br />
                                    if (isCat(myPet)) {'{'}<br />
                                    &nbsp;&nbsp;myPet.meow(); <span className="text-slate-500">// TypeScript is happy!</span><br />
                                    {'}'}
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
