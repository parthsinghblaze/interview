'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';
import { Target, ArrowLeft, User, Code, Pointer, MousePointer } from 'lucide-react';
import Link from 'next/link';

export default function ThisKeywordPage() {
    const [activeExample, setActiveExample] = useState(0);

    const examples = [
        {
            title: "Default Binding (Global Context)",
            code: `function showThis() {
  console.log(this);
}

showThis(); // Window object (browser) or undefined (strict mode)`,
            explanation: "When a function is called without any context, 'this' points to the global object (window in browsers). In strict mode, it's undefined."
        },
        {
            title: "Implicit Binding (Object Method)",
            code: `const person = {
  name: 'Parth',
  greet: function() {
    console.log(this.name);
  }
};

person.greet(); // 'Parth'`,
            explanation: "When a function is called as a method of an object, 'this' refers to that object."
        },
        {
            title: "Explicit Binding (call, apply, bind)",
            code: `function greet() {
  console.log(\`Hello, \${this.name}\`);
}

const user = { name: 'Parth' };

greet.call(user);  // 'Hello, Parth'
greet.apply(user); // 'Hello, Parth'

const boundGreet = greet.bind(user);
boundGreet(); // 'Hello, Parth'`,
            explanation: "You can explicitly tell a function what 'this' should be using call(), apply(), or bind()."
        },
        {
            title: "New Binding (Constructor)",
            code: `function Person(name) {
  this.name = name;
}

const parth = new Person('Parth');
console.log(parth.name); // 'Parth'`,
            explanation: "When a function is called with 'new', JavaScript creates a new object and sets 'this' to that object."
        },
        {
            title: "Arrow Functions (Lexical this)",
            code: `const person = {
  name: 'Parth',
  greet: function() {
    const inner = () => {
      console.log(this.name);
    };
    inner();
  }
};

person.greet(); // 'Parth'`,
            explanation: "Arrow functions don't have their own 'this'. They inherit 'this' from the surrounding scope where they were defined."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
            <Header />

            <main className="pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="mb-8">
                        <Link
                            href="/javascript"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to JavaScript
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center p-3 mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                            <Target className="text-blue-600 dark:text-blue-400" size={40} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Understanding "this" Keyword
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            The "this" keyword is one of the most confusing parts of JavaScript. It doesn't refer to the function itself - it refers to the context in which the function was called.
                        </p>
                    </div>

                    {/* The Golden Rule */}
                    <div className="mb-16 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-3xl p-8 border-2 border-yellow-200 dark:border-yellow-500/30">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Pointer className="text-yellow-600 dark:text-yellow-400" />
                            The Golden Rule
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-slate-300 mb-4">
                            <strong>"this" is NOT determined by WHERE the function is written. It's determined by HOW and WHERE the function is CALLED.</strong>
                        </p>
                        <p className="text-gray-600 dark:text-slate-400">
                            This is called the "call-site" - the location in code where a function is invoked. The call-site determines what "this" will be.
                        </p>
                    </div>

                    {/* Interactive Examples */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">The 5 Binding Rules</h2>

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto">
                            {examples.map((example, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveExample(idx)}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${activeExample === idx
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                                        }`}
                                >
                                    {idx + 1}. {example.title.split('(')[0]}
                                </button>
                            ))}
                        </div>

                        {/* Active Example */}
                        <motion.div
                            key={activeExample}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-800 shadow-xl"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {examples[activeExample].title}
                            </h3>

                            <div className="bg-slate-900 rounded-xl p-6 mb-6 overflow-x-auto">
                                <pre className="text-sm font-mono">
                                    <code className="text-slate-300">{examples[activeExample].code}</code>
                                </pre>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-500/30">
                                <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                                    <strong>What's happening:</strong> {examples[activeExample].explanation}
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Priority Order */}
                    <div className="mb-16 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Binding Priority (Highest to Lowest)
                        </h2>
                        <div className="space-y-4">
                            {[
                                { num: 1, name: 'new binding', desc: 'Was the function called with "new"?' },
                                { num: 2, name: 'Explicit binding', desc: 'Was .call(), .apply(), or .bind() used?' },
                                { num: 3, name: 'Implicit binding', desc: 'Was it called as an object method?' },
                                { num: 4, name: 'Default binding', desc: 'Falls back to global object or undefined' }
                            ].map((rule) => (
                                <div key={rule.num} className="flex gap-4 items-start">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                        {rule.num}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white capitalize">{rule.name}</h4>
                                        <p className="text-sm text-gray-600 dark:text-slate-400">{rule.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interview Tips */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 border border-purple-200 dark:border-purple-500/30">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            💡 Common Interview Questions
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">❓ What is "this" in setTimeout?</h4>
                                <p className="text-sm text-gray-600 dark:text-slate-400">
                                    In setTimeout, "this" defaults to the global object because the callback is executed in the global scope. Use arrow functions or .bind() to preserve context.
                                </p>
                            </div>
                            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">❓ Arrow functions and "this"?</h4>
                                <p className="text-sm text-gray-600 dark:text-slate-400">
                                    Arrow functions don't have their own "this". They capture it from the surrounding scope when they're created (lexical binding).
                                </p>
                            </div>
                            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">❓ Difference: call vs apply vs bind?</h4>
                                <p className="text-sm text-gray-600 dark:text-slate-400">
                                    call() and apply() invoke immediately (apply takes array of args). bind() returns a new function with "this" permanently bound.
                                </p>
                            </div>
                            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2">❓ "this" in event handlers?</h4>
                                <p className="text-sm text-gray-600 dark:text-slate-400">
                                    In regular functions, "this" refers to the element that triggered the event. Arrow functions preserve the outer context.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
