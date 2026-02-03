'use client';

import React, { useState } from 'react';
import {
    Layout,
    Layers,
    Server,
    Zap,
    ArrowRight,
    ChevronLeft,
    CheckCircle,
    RotateCcw,
    Activity,
    Code,
    Terminal,
    Globe,
    Cpu,
    Database,
    HelpCircle,
    Smartphone,
    LayoutDashboard,
    FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const RoutingPage = () => {
    const [activeView, setActiveView] = useState<'app' | 'pages'>('app');

    const ComparisonData = {
        app: {
            title: 'Modern App Router',
            subtitle: 'Recommended for Next.js 13+',
            features: [
                { icon: Server, title: 'Server Components by Default', desc: 'Shift data fetching logic to the server, reducing client JS.' },
                { icon: Layout, title: 'Nested Layouts', desc: 'Easily share UI across segments without re-rendering.' },
                { icon: Zap, title: 'Streaming', desc: 'Send UI chunks to the browser as they are ready.' }
            ],
            code: `// app/dashboard/layout.js
export default function Layout({ children }) {
  return <section>{children}</section>;
}

// app/dashboard/page.js
export default async function Page() {
  const data = await fetchData();
  return <main>Dashboard Content</main>;
}`
        },
        pages: {
            title: 'Legacy Pages Router',
            subtitle: 'Classic File-based Routing',
            features: [
                { icon: FileText, title: 'File-based Routes', desc: 'Every file in /pages is a route.' },
                { icon: Database, title: 'getServerSideProps', desc: 'Classic SSR method for data fetching.' },
                { icon: Globe, title: 'Stable & Mature', desc: 'Decade-old battle-tested routing system.' }
            ],
            code: `// pages/dashboard.js
export async function getServerSideProps() {
  // Runs on server for every request
  return { props: { data: {} } };
}

export default function Page({ data }) {
  return <main>Dashboard Content</main>;
}`
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500/30">
            <Header />

            <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
                <div className="relative mb-16 p-12 rounded-[3.5rem] bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-white/5 overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                        <LayoutDashboard size={300} />
                    </div>
                    <div className="relative z-10 max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] border border-cyan-500/20">
                                Architecture Mastery
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black mb-8 leading-none tracking-tighter">
                            Routing in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Next.js</span>
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed font-medium">
                            Choose between the state-of-the-art **App Router** for performance or the
                            stable **Pages Router** for compatibility.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Comparison Explorer */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                                <h2 className="text-3xl font-black">Architectural Explorer</h2>
                                <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-white/10">
                                    <button
                                        onClick={() => setActiveView('app')}
                                        className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'app' ? 'bg-cyan-600 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        App Router
                                    </button>
                                    <button
                                        onClick={() => setActiveView('pages')}
                                        className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeView === 'pages' ? 'bg-cyan-600 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        Pages Router
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeView}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-6"
                                        >
                                            {ComparisonData[activeView].features.map((f, i) => (
                                                <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all">
                                                    <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                                                        <f.icon size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-100 mb-1">{f.title}</h4>
                                                        <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                                <div className="space-y-6">
                                    <div className="rounded-3xl overflow-hidden border border-white/10 shadow-3xl bg-[#0a0f1d] p-8">
                                        <SyntaxHighlighter
                                            language="javascript"
                                            style={atomDark}
                                            customStyle={{ margin: 0, padding: 0, fontSize: '0.9rem', backgroundColor: 'transparent' }}
                                        >
                                            {ComparisonData[activeView].code}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20">
                            <div className="flex items-center gap-4 mb-6">
                                <Activity className="text-indigo-400" />
                                <h3 className="text-xl font-bold">Key Performance Difference</h3>
                            </div>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                In the <strong className="text-indigo-300">App Router</strong>, the heavy lifting happens via React Server Components, meaning users download <strong className="text-indigo-300">less JavaScript</strong>. In the Pages Router, pages often include their entire dependency tree in the client bundle.
                            </p>
                        </div>
                    </div>

                    {/* Sidebar Questions */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="bg-slate-900/80 border border-white/10 rounded-[2.5rem] p-10">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-10 flex items-center gap-2">
                                <HelpCircle size={16} /> Interview Drills
                            </h3>
                            <div className="space-y-8">
                                {[
                                    { q: 'What is a Layout?', a: 'A UI that is shared between routes. It preserves state across navigations.' },
                                    { q: 'Hybrid Apps?', a: 'Yes, Next.js allows using both App Router and Pages Router in the same project.' },
                                    { q: 'Server-only code?', a: 'App Router allows you to mark code with "use server" to ensure it never hits the client.' }
                                ].map((drill, i) => (
                                    <div key={i} className="space-y-2">
                                        <p className="text-xs font-black text-cyan-500 uppercase tracking-tighter">{drill.q}</p>
                                        <p className="text-sm text-slate-400 font-medium leading-relaxed">{drill.a}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <Link href="/nextjs">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="p-8 rounded-[2rem] bg-white text-black font-black flex items-center justify-between cursor-pointer"
                            >
                                <span className="uppercase text-xs tracking-widest">Back to Core</span>
                                <ArrowRight size={20} />
                            </motion.div>
                        </Link>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default RoutingPage;
