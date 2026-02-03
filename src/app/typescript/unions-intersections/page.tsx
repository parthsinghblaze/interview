'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TSVisualizer from '../../components/TSVisualizer';
import { Type, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UnionsIntersectionsPage() {
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
                        title="Unions & Intersections"
                        description="TypeScript allows you to compose types using logic. Union types (|) say an object can be one of several types. Intersection types (&) say an object must satisfy all types."
                        tsCode={`type ErrorCode = number | string;

function printError(code: ErrorCode) {
  console.log('Error: ' + code);
}

interface Person { name: string; }
interface Employee { id: number; }

type StaffMember = Person & Employee;

const parth: StaffMember = {
  name: 'Parth',
  id: 101
};`}
                        jsCode={`function printError(code) {
    console.log('Error: ' + code);
}

var parth = {
    name: 'Parth',
    id: 101
};`}
                        concepts={[
                            {
                                title: "Type Composition",
                                desc: "Union types (|) act like a logical 'OR', while Intersection types (&) act like a logical 'AND'."
                            },
                            {
                                title: "Discrimination",
                                desc: "TypeScript uses 'literal' properties to narrow down which part of a union type is being used."
                            },
                            {
                                title: "Runtime Vanishing",
                                desc: "In JS, there is no difference between a combined object and a simple literal object."
                            }
                        ]}
                        explanation={[
                            "Defines 'ErrorCode' as a union of 'number' or 'string'.",
                            "The 'printError' function safely accepts either type, removed to just 'code' in JS.",
                            "Defines 'StaffMember' by intersecting 'Person' and 'Employee' shapes.",
                            "TypeScript forces 'parth' to have both 'name' and 'id' properties.",
                            "The JavaScript output completely loses memory of these combined definitions; it's just plain data."
                        ]}
                    />

                    {/* Discriminated Unions */}
                    <div className="mt-20">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Discriminated Unions</h3>
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800">
                            <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                                This is the most powerful use of unions. By using a literal "type" property, you can help TS narrow down exactly which object you are working with.
                            </p>
                            <div className="p-6 bg-slate-900 rounded-2xl font-mono text-sm overflow-x-auto">
                                <code className="text-slate-300">
                                    interface Success {'{'}<br />
                                    &nbsp;&nbsp;kind: <span className="text-orange-300">'success'</span>;<br />
                                    &nbsp;&nbsp;data: string;<br />
                                    {'}'}<br /><br />
                                    interface Error {'{'}<br />
                                    &nbsp;&nbsp;kind: <span className="text-orange-300">'error'</span>;<br />
                                    &nbsp;&nbsp;message: string;<br />
                                    {'}'}<br /><br />
                                    type Result = Success | Error;<br /><br />
                                    function handle(res: Result) {'{'}<br />
                                    &nbsp;&nbsp;if (res.kind === <span className="text-orange-300">'success'</span>) {'{'}<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;console.log(res.data); <span className="text-slate-500">// Safe!</span><br />
                                    &nbsp;&nbsp;{'}'} else {'{'}<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;console.log(res.message); <span className="text-slate-500">// Safe!</span><br />
                                    &nbsp;&nbsp;{'}'}<br />
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
