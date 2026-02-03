'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TSVisualizer from '../../components/TSVisualizer';
import { Code, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UtilityTypesPage() {
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
                        title="Utility Types: Transformations"
                        description="TypeScript provide several global utility types to facilitate common type transformations. These are purely compile-time constructs that help you derive new types from existing ones without repeating code."
                        tsCode={`interface Todo {
  title: string;
  desc: string;
}

// All properties optional
const partialTodo: Partial<Todo> = {
  title: 'Learn TS'
};

// Only specified properties
const titleOnly: Pick<Todo, 'title'> = {
  title: 'Partial is cool'
};

// Immutable properties
const fixed: Readonly<Todo> = {
  title: 'Static',
  desc: 'Fixed'
};`}
                        jsCode={`var partialTodo = {
    title: 'Learn TS'
};

var titleOnly = {
    title: 'Partial is cool'
};

var fixed = {
    title: 'Static',
    desc: 'Fixed'
};`}
                        concepts={[
                            {
                                title: "DRY Principle",
                                desc: "Utility types prevent you from redefining similar shapes manually, making your code easier to maintain."
                            },
                            {
                                title: "Derivation",
                                desc: "You define the 'Source of Truth' once (Todo) and derive variations (Partial, Readonly) as needed."
                            },
                            {
                                title: "Meta-Logic",
                                desc: "Utilities use advanced TS features like Mapped Types and Conditional Types under the hood."
                            }
                        ]}
                        explanation={[
                            "Defines a base 'Todo' interface with required fields.",
                            "'Partial<Todo>' makes both 'title' and 'desc' optional (adds '?').",
                            "'Pick<Todo, 'title'>' creates a type that ONLY has the 'title' property.",
                            "'Readonly<Todo>' makes all properties unchangeable after initialization (compile-time only).",
                            "In JavaScript, none of these restrictions exist. All objects are just plain, mutable key-value pairs."
                        ]}
                    />

                    {/* Common Utilities Table */}
                    <div className="mt-20">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Essential Utility Types</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { name: 'Omit<T, K>', desc: 'Constructs a type by picking all properties from T and then removing K.', example: "Omit<User, 'password'>" },
                                { name: 'Record<K, T>', desc: 'Constructs an object type whose property keys are K and values are T.', example: "Record<string, number>" },
                                { name: 'Required<T>', desc: 'Constructs a type consisting of all properties of T set to required.', example: "Required<PartialUser>" },
                                { name: 'ReturnType<T>', desc: 'Obtains the return type of a function type.', example: "ReturnType<typeof fn>" },
                            ].map((util, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 flex flex-col">
                                    <div className="text-blue-600 dark:text-blue-400 font-mono font-bold mb-2">{util.name}</div>
                                    <p className="text-gray-600 dark:text-slate-400 text-sm mb-4">{util.desc}</p>
                                    <div className="mt-auto text-[10px] uppercase tracking-widest text-gray-400 dark:text-slate-600 font-bold">
                                        Example: {util.example}
                                    </div>
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
