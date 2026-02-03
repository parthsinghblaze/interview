'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, ChevronRight, ChevronLeft, Code, BookOpen, Lightbulb, AlertCircle, RotateCcw } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function ThisKeywordPage() {
    const [activeExample, setActiveExample] = useState(0);

    const examples = [
        {
            title: "Default Binding",
            code: `function showThis() {
  console.log(this);
}

showThis(); 
// Window object (browser) 
// or undefined (strict mode)`,
            thisValue: "window / undefined",
            binding: "Default",
            explanation: "When called without context, 'this' points to global object (window in browsers) or undefined in strict mode."
        },
        {
            title: "Implicit Binding",
            code: `const person = {
  name: 'John',
  greet: function() {
    console.log(this.name);
  }
};

person.greet(); // 'John'`,
            thisValue: "person object",
            binding: "Implicit",
            explanation: "When a function is called as a method of an object, 'this' refers to that object."
        },
        {
            title: "Explicit Binding (call/apply/bind)",
            code: `function greet() {
  console.log(\`Hello, \${this.name}\`);
}

const user = { name: 'John' };

greet.call(user);  // 'Hello, John'
greet.apply(user); // 'Hello, John'

const boundGreet = greet.bind(user);
boundGreet(); // 'Hello, John'`,
            thisValue: "user object",
            binding: "Explicit",
            explanation: "You can explicitly set 'this' using call(), apply(), or bind() methods."
        },
        {
            title: "New Binding (Constructor)",
            code: `function Person(name) {
  this.name = name;
}

const john = new Person('John');
console.log(john.name); // 'John'`,
            thisValue: "new object",
            binding: "New",
            explanation: "When called with 'new', JavaScript creates a new object and sets 'this' to that object."
        },
        {
            title: "Arrow Functions (Lexical)",
            code: `const person = {
  name: 'John',
  greet: function() {
    const inner = () => {
      console.log(this.name);
    };
    inner();
  }
};

person.greet(); // 'John'`,
            thisValue: "inherited from outer scope",
            binding: "Lexical",
            explanation: "Arrow functions don't have their own 'this'. They inherit it from the surrounding scope (lexical binding)."
        }
    ];

    const currentExample = examples[activeExample];

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Header />

            {/* Full Screen Layout */}
            <div className="pt-20 min-h-[calc(100vh-5rem)] flex">

                {/* Left Sidebar */}
                <div className="w-80 bg-slate-900 border-r border-slate-700 p-6 overflow-y-auto">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Target className="text-blue-400" size={40} />
                            <h1 className="text-3xl font-bold">"this" Keyword</h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Master how JavaScript determines 'this' at call-site
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <BookOpen className="text-blue-400" size={22} />
                            <h3 className="text-base font-bold text-blue-400 uppercase">Interview Answer</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            "'this' is determined by HOW a function is CALLED, not where it's written. It depends on 4 binding rules: new, explicit (call/apply/bind), implicit (object method), or default (global/undefined)."
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="text-yellow-400" size={22} />
                            <h3 className="text-base font-bold text-yellow-400 uppercase">Golden Rule</h3>
                        </div>
                        <p className="text-slate-200 text-base leading-relaxed">
                            Look at the call-site (where function is invoked), not where it's defined. The call-site determines what 'this' will be.
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="text-purple-400" size={22} />
                            <h3 className="text-base font-bold text-purple-400 uppercase">Priority Order</h3>
                        </div>
                        <ul className="space-y-3 text-slate-200 text-base">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400 font-bold">1.</span>
                                <div>
                                    <strong className="text-blue-400">new:</strong> Creates new object
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400 font-bold">2.</span>
                                <div>
                                    <strong className="text-green-400">Explicit:</strong> call/apply/bind
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-orange-400 font-bold">3.</span>
                                <div>
                                    <strong className="text-orange-400">Implicit:</strong> Object method
                                </div>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-slate-400 font-bold">4.</span>
                                <div>
                                    <strong className="text-slate-400">Default:</strong> Global/undefined
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-400 mb-3 uppercase">Arrow Functions</h4>
                        <p className="text-slate-400 text-xs">
                            Arrow functions ignore these rules! They use lexical scoping - inheriting 'this' from their outer scope.
                        </p>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex-1 flex flex-col bg-slate-950">

                    {/* Example Tabs */}
                    <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
                        <div className="flex gap-2 overflow-x-auto">
                            {examples.map((ex, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveExample(idx)}
                                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeExample === idx
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {ex.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Code Display */}
                    <div className="bg-slate-900/50 flex flex-col" style={{ height: '40vh' }}>
                        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-700 bg-slate-900">
                            <Code className="text-blue-400" size={20} />
                            <h3 className="text-lg font-bold">Code Example</h3>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <SyntaxHighlighter
                                language="javascript"
                                style={atomDark}
                                customStyle={{
                                    margin: 0,
                                    padding: '2rem',
                                    fontSize: '1.1rem',
                                    lineHeight: '1.8',
                                    backgroundColor: 'transparent'
                                }}
                            >
                                {currentExample.code}
                            </SyntaxHighlighter>
                        </div>
                    </div>

                    {/* Visualization */}
                    <div className="flex-1 bg-slate-900 px-8 py-6 overflow-y-auto border-t border-slate-700">
                        <div className="max-w-5xl mx-auto">
                            <h3 className="text-xl font-bold mb-8">Understanding 'this' Binding</h3>

                            <motion.div
                                key={activeExample}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Binding Type */}
                                <div className="bg-blue-500/10 border-2 border-blue-500 rounded-2xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-slate-400 mb-1">Binding Type</div>
                                            <div className="text-2xl font-bold text-blue-400">{currentExample.binding} Binding</div>
                                        </div>
                                        <Target className="text-blue-400" size={48} />
                                    </div>
                                </div>

                                {/* This Value */}
                                <div className="bg-slate-950 rounded-xl p-6 border border-slate-700">
                                    <div className="text-sm text-slate-500 mb-2">'this' refers to:</div>
                                    <div className="font-mono text-2xl text-green-400">{currentExample.thisValue}</div>
                                </div>

                                {/* Explanation */}
                                <div className="bg-slate-950/50 rounded-xl p-6 border-2 border-slate-700">
                                    <h4 className="text-lg font-semibold text-white mb-3">What's Happening:</h4>
                                    <p className="text-slate-300 text-base leading-relaxed">
                                        {currentExample.explanation}
                                    </p>
                                </div>

                                {/* Visual Diagram */}
                                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-500/30">
                                    <h4 className="text-base font-semibold text-blue-400 mb-4">Call-Site Visualization:</h4>
                                    <div className="space-y-3 text-sm">
                                        {activeExample === 0 && (
                                            <div className="font-mono text-slate-300">
                                                <div>showThis() <span className="text-blue-400">←</span> No context</div>
                                                <div className="ml-8 text-slate-500">↓</div>
                                                <div className="ml-8">this = <span className="text-orange-400">window</span> (or <span className="text-red-400">undefined</span> in strict mode)</div>
                                            </div>
                                        )}
                                        {activeExample === 1 && (
                                            <div className="font-mono text-slate-300">
                                                <div>person.greet() <span className="text-blue-400">←</span> Object method</div>
                                                <div className="ml-8 text-slate-500">↓</div>
                                                <div className="ml-8">this = <span className="text-green-400">person</span></div>
                                            </div>
                                        )}
                                        {activeExample === 2 && (
                                            <div className="font-mono text-slate-300">
                                                <div>greet.call(user) <span className="text-blue-400">←</span> Explicit binding</div>
                                                <div className="ml-8 text-slate-500">↓</div>
                                                <div className="ml-8">this = <span className="text-green-400">user</span></div>
                                            </div>
                                        )}
                                        {activeExample === 3 && (
                                            <div className="font-mono text-slate-300">
                                                <div>new Person('John') <span className="text-blue-400">←</span> Constructor call</div>
                                                <div className="ml-8 text-slate-500">↓</div>
                                                <div className="ml-8">this = <span className="text-green-400">new empty object { }</span></div>
                                            </div>
                                        )}
                                        {activeExample === 4 && (
                                            <div className="font-mono text-slate-300">
                                                <div>Arrow function <span className="text-blue-400">←</span> Lexical scope</div>
                                                <div className="ml-8 text-slate-500">↓</div>
                                                <div className="ml-8">this = <span className="text-purple-400">inherited from outer scope (person)</span></div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Key Takeaway */}
                                <div className="mt-6 p-5 bg-blue-500/10 rounded-xl border-2 border-blue-500/30">
                                    <h4 className="text-base font-semibold text-blue-400 mb-2 flex items-center gap-2">
                                        <span>💡</span> Key Takeaway
                                    </h4>
                                    <p className="text-slate-300 text-base">
                                        {activeExample === 4
                                            ? "Arrow functions are special - they don't follow the 4 binding rules. They always use lexical scoping!"
                                            : "Always look at HOW the function is called, not WHERE it's defined. The call-site determines 'this'."
                                        }
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
