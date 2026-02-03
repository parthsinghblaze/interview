'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';
import { Layers, ArrowLeft, Link2, Users } from 'lucide-react';
import Link from 'next/link';

export default function PrototypesPage() {
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
                        <div className="inline-flex items-center justify-center p-3 mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
                            <Layers className="text-purple-600 dark:text-purple-400" size={40} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Prototypes & Inheritance
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            JavaScript doesn't have traditional classes. Instead, it uses prototypes to share properties and methods between objects. This is called "prototypal inheritance".
                        </p>
                    </div>

                    {/* Simple Explanation */}
                    <div className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 border-2 border-blue-200 dark:border-blue-500/30">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            What is a Prototype? (Simple Explanation)
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-slate-300 mb-4 leading-relaxed">
                            Think of a prototype as a <strong>backup object</strong>. When you try to access a property on an object and it doesn't exist, JavaScript automatically looks at the object's prototype to find it.
                        </p>
                        <div className="bg-white dark:bg-slate-900 rounded-xl p-6">
                            <pre className="text-sm font-mono text-slate-300">
                                {`const person = {
  name: 'Parth'
};

// JavaScript automatically adds person.__proto__
console.log(person.__proto__); // Object.prototype

// Methods like toString() come from the prototype
console.log(person.toString()); // '[object Object]'`}
                            </pre>
                        </div>
                    </div>

                    {/* Prototype Chain Visualization */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            The Prototype Chain
                        </h2>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800">
                            <p className="text-gray-600 dark:text-slate-400 mb-8">
                                When you access a property, JavaScript searches in this order:
                            </p>

                            <div className="space-y-6">
                                {[
                                    { level: 'Object itself', example: 'person.name', desc: "First, check if the property exists directly on the object" },
                                    { level: 'Object.__proto__', example: 'Person.prototype', desc: "If not found, check the object's prototype" },
                                    { level: 'Prototype.__proto__', example: 'Object.prototype', desc: "If still not found, check the prototype's prototype" },
                                    { level: 'null', example: 'End of chain', desc: "If we reach null, the property doesn't exist" }
                                ].map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                                                {idx + 1}
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">{step.level}</h4>
                                                <code className="text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-purple-600 dark:text-purple-400">
                                                    {step.example}
                                                </code>
                                            </div>
                                            <p className="text-gray-600 dark:text-slate-400">{step.desc}</p>
                                        </div>
                                        {idx < 3 && (
                                            <div className="flex-shrink-0 text-purple-400 text-2xl">↓</div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* __proto__ vs prototype */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                            __proto__ vs prototype (The Confusion!)
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-500/30">
                                <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
                                    <Link2 size={24} />
                                    __proto__
                                </h3>
                                <p className="text-gray-700 dark:text-slate-300 mb-4">
                                    Every object has this. It points to the prototype object that was used to create it.
                                </p>
                                <div className="bg-slate-900 rounded-xl p-4">
                                    <pre className="text-xs font-mono text-slate-300">
                                        {`const obj = {};
console.log(obj.__proto__);
// Object.prototype`}
                                    </pre>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-slate-400 mt-4">
                                    ✅ ALL objects have __proto__
                                </p>
                            </div>

                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-500/30">
                                <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-4 flex items-center gap-2">
                                    <Users size={24} />
                                    prototype
                                </h3>
                                <p className="text-gray-700 dark:text-slate-300 mb-4">
                                    Only functions have this. It's the object that will become __proto__ for objects created with "new".
                                </p>
                                <div className="bg-slate-900 rounded-xl p-4">
                                    <pre className="text-xs font-mono text-slate-300">
                                        {`function Person() {}
console.log(Person.prototype);
// { constructor: Person }`}
                                    </pre>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-slate-400 mt-4">
                                    ✅ Only FUNCTIONS have .prototype
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Practical Example */}
                    <div className="mb-16 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Real Example: Creating Objects with Shared Methods
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 dark:text-slate-500 mb-2 uppercase">❌ Bad Way (Each object gets its own copy)</h4>
                                <div className="bg-slate-900 rounded-xl p-6">
                                    <pre className="text-sm font-mono text-slate-300">
                                        {`function Person(name) {
  this.name = name;
  this.greet = function() { // ❌ New function for EVERY instance!
    console.log('Hi, I am ' + this.name);
  };
}

const p1 = new Person('Parth');
const p2 = new Person('John');
console.log(p1.greet === p2.greet); // false (wasteful!)`}
                                    </pre>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-emerald-500 mb-2 uppercase">✅ Good Way (Share method via prototype)</h4>
                                <div className="bg-slate-900 rounded-xl p-6">
                                    <pre className="text-sm font-mono text-slate-300">
                                        {`function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() { // ✅ Shared across all instances!
  console.log('Hi, I am ' + this.name);
};

const p1 = new Person('Parth');
const p2 = new Person('John');
console.log(p1.greet === p2.greet); // true (efficient!)`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Object.create */}
                    <div className="mb-16 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl p-8 border border-emerald-200 dark:border-emerald-500/30">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Object.create() - Pure Prototypal Inheritance
                        </h2>
                        <p className="text-gray-700 dark:text-slate-300 mb-6 leading-relaxed">
                            This is the clearest way to set up prototypal inheritance without using constructors.
                        </p>
                        <div className="bg-slate-900 rounded-xl p-6">
                            <pre className="text-sm font-mono text-slate-300">
                                {`const personPrototype = {
  greet: function() {
    console.log(\`Hi, I'm \${this.name}\`);
  }
};

// Create a new object with personPrototype as its __proto__
const parth = Object.create(personPrototype);
parth.name = 'Parth';

parth.greet(); // 'Hi, I'm Parth'
console.log(parth.__proto__ === personPrototype); // true`}
                            </pre>
                        </div>
                    </div>

                    {/* Interview Tips */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-3xl p-8 border border-orange-200 dark:border-orange-500/30">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            💡 Common Interview Questions
                        </h2>
                        <div className="space-y-6">
                            {[
                                {
                                    q: "What happens when you access a property that doesn't exist?",
                                    a: "JavaScript looks up the prototype chain. If it reaches null without finding it, returns undefined."
                                },
                                {
                                    q: "Can you change an object's prototype after creation?",
                                    a: "Yes, using Object.setPrototypeOf(), but it's slow and not recommended. Use Object.create() instead."
                                },
                                {
                                    q: "What's the difference between __proto__ and prototype?",
                                    a: "__proto__ is on ALL objects and points to their prototype. .prototype is only on functions and is used when creating new objects with 'new'."
                                },
                                {
                                    q: "How do you check if a property is directly on an object vs inherited?",
                                    a: "Use hasOwnProperty(): obj.hasOwnProperty('name')"
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900/50 p-6 rounded-xl">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">❓ {item.q}</h4>
                                    <p className="text-gray-600 dark:text-slate-400">💡 {item.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
