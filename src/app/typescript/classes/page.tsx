'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TSVisualizer from '../../components/TSVisualizer';
import { Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ClassesPage() {
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
                        title="Classes & Modifiers"
                        description="TypeScript adds access modifiers (public, private, protected) to classes. Interestingly, these modifiers don't exist in traditional JavaScript classes and are purely for developer safety."
                        tsCode={`class Account {
  private balance: number;
  public owner: string;

  constructor(owner: string, initial: number) {
    this.owner = owner;
    this.balance = initial;
  }

  protected getBalance() {
    return this.balance;
  }
}

const acc = new Account('Parth', 100);
// acc.balance -> Error!`}
                        jsCode={`var Account = (function () {
    function Account(owner, initial) {
        this.owner = owner;
        this.balance = initial;
    }
    Account.prototype.getBalance = function () {
        return this.balance;
    };
    return Account;
}());

var acc = new Account('Parth', 100);
// acc.balance -> works (runtime)!`}
                        concepts={[
                            {
                                title: "Soft Privacy",
                                desc: "TS 'private' only stops you at compile-time. At runtime in JS, everything is public unless using # syntax."
                            },
                            {
                                title: "Access Control",
                                desc: "Encapsulation is enforced by the IDE and compiler, preventing developers from reaching internal state."
                            },
                            {
                                title: "Prototype Polish",
                                desc: "Classic TS compilation (to ES5) uses prototypes and IIFEs to create the class-like structure."
                            }
                        ]}
                        explanation={[
                            "Defines a class with 'private' and 'protected' members.",
                            "The constructor initializes the fields as usual.",
                            "When compiled to older JS (ES5), the class becomes an IIFE returning a function.",
                            "Crucially, the 'private' keyword completely disappears. Any JS code can access 'acc.balance' at runtime.",
                            "For 'Real' runtime privacy, TypeScript now supports the native JS '#' private fields syntax."
                        ]}
                    />

                    {/* Parameter Properties */}
                    <div className="mt-20">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Parameter Properties Optimization</h3>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800">
                            <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                                TypeScript provides a shorthand to define and initialize class members in the constructor arguments directly.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest">Shorthand TS</h4>
                                    <div className="p-4 bg-slate-900 rounded-xl font-mono text-sm leading-relaxed">
                                        <code className="text-slate-300">
                                            class User {'{'}<br />
                                            &nbsp;&nbsp;constructor(<br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">public</span> name: string,<br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">private</span> id: number<br />
                                            &nbsp;&nbsp;) {'{}'}<br />
                                            {'}'}
                                        </code>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h4 className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                                        <Zap size={20} />
                                        Automatic Generation
                                    </h4>
                                    <p className="text-gray-600 dark:text-slate-400 text-sm italic">
                                        TypeScript automatically generates 'this.name = name' and 'this.id = id' in the output JS constructor, even though the body is empty ('{ }').
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
