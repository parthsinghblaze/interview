'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TSVisualizer from '../../components/TSVisualizer';
import { motion } from 'framer-motion';
import { Box, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EnumsPage() {
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
                        title="Enums: Named Constants"
                        description="Unlike Interfaces, Enums are one of the few TypeScript features that actually generate real JavaScript code. They create an object that maps names to values, and sometimes values back to names (Reverse Mapping)."
                        tsCode={`enum Role {
  Admin,
  Editor,
  Viewer
}

const myRole = Role.Admin;
console.log(Role[0]); // 'Admin'`}
                        jsCode={`var Role;
(function (Role) {
    Role[Role["Admin"] = 0] = "Admin";
    Role[Role["Editor"] = 1] = "Editor";
    Role[Role["Viewer"] = 2] = "Viewer";
})(Role || (Role = {}));

var myRole = Role.Admin;
console.log(Role[0]);`}
                        concepts={[
                            {
                                title: "Reverse Mapping",
                                desc: "Numeric enums allow you to get the name from the value (Role[0]) and the value from the name (Role.Admin)."
                            },
                            {
                                title: "Runtime Object",
                                desc: "Enums exist in your final JS bundle as an IIFE that populates an object."
                            },
                            {
                                title: "Auto-Increment",
                                desc: "If you don't assign values, TypeScript starts at 0 and increments by 1 for each member."
                            }
                        ]}
                        explanation={[
                            "The TypeScript enum 'Role' defines three states. Without values, TS assigns 0, 1, and 2.",
                            "In JavaScript, an 'Immediately Invoked Function Expression' (IIFE) is used to create the 'Role' object safely.",
                            "The line 'Role[Role['Admin'] = 0] = 'Admin'' is a trick that sets both 'Role.Admin = 0' and 'Role[0] = 'Admin''.",
                            "This bidirectional mapping is what allows 'Reverse Mapping' to work in numeric enums.",
                            "String enums (e.g., Admin = 'ADMIN') do NOT support reverse mapping and produce simpler JS code."
                        ]}
                    />

                    {/* Additional Content: const enum */}
                    <div className="mt-20">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">The 'const enum' Optimization</h3>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800">
                            <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                                If you want the safety of an enum but don't want the extra object in your JS bundle, you can use a <code className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-blue-500">const enum</code>. These are completely removed and values are inlined.
                            </p>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest">TS Input</h4>
                                    <div className="p-4 bg-slate-900 rounded-xl font-mono text-sm">
                                        <code className="text-slate-300">
                                            const enum Status {'{'}<br />
                                            &nbsp;&nbsp;Success = 1,<br />
                                            &nbsp;&nbsp;Error = 0<br />
                                            {'}'}<br /><br />
                                            const current = Status.Success;
                                        </code>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-yellow-500 uppercase tracking-widest">JS Output</h4>
                                    <div className="p-4 bg-slate-900 rounded-xl font-mono text-sm border-2 border-emerald-500/20">
                                        <code className="text-slate-300">
                                            <span className="text-slate-500">// No Role object created!</span><br />
                                            var current = 1; <span className="text-emerald-400">// Inlined!</span>
                                        </code>
                                    </div>
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
