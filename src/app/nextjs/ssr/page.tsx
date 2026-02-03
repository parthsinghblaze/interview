'use client';

import React, { useState } from 'react';
import {
    Server,
    Zap,
    Search,
    Clock,
    CheckCircle,
    ArrowRight,
    Code,
    Terminal,
    Globe,
    Cpu,
    Database,
    HelpCircle,
    Activity,
    AlertCircle,
    TrendingUp,
    ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SSRPage = () => {
    const [activeTab, setActiveTab] = useState<'modern' | 'legacy'>('modern');

    const ssrCode = `// pages/index.js (Pages Router)
// This function name is reserved in Next.js
export async function getServerSideProps(context) {
  // context contains params, req, res, query, etc.
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();

  // Will be passed to the page component as props
  return { 
    props: { 
      data,
      fetchedAt: new Date().toISOString()
    } 
  };
}

export default function Home({ data, fetchedAt }) {
  return (
    <div>
      <h1>SSR with Pages Router</h1>
      <p>Data fetched at: {fetchedAt}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}`;

    const appRouterCode = `// app/page.js (App Router - Modern Way)
// Functions are async by default in Server Components
async function getData() {
  // fetch in Next.js is extended to support caching/revalidation
  const res = await fetch('https://api.example.com/data', { 
    cache: 'no-store' // Equivalent to SSR (Dynamic Rendering)
  });
  
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
}

export default async function Page() {
  const data = await getData(); 
  
  return (
    <main>
      <h1>Modern SSR (Dynamic Rendering)</h1>
      <section>
        {/* Render your data here */}
      </section>
    </main>
  );
}`;

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
            <Header />

            <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-12 p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 border border-white/10 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
                        <Server size={300} />
                    </div>

                    <div className="relative z-10 max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest border border-indigo-500/30">
                                Interview Deep-Dive
                            </span>
                            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold px-3 py-1 bg-white/5 rounded-full border border-white/5">
                                <Clock size={14} /> 12 min read
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-white via-indigo-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                            Server-Side Rendering
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed font-medium">
                            Master the art of generating dynamic HTML on the server. Learn why SSR is the
                            gold standard for SEO and performance in modern enterprise applications.
                        </p>
                    </div>
                </motion.div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left & Middle Column (Theoretical & Practical) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* The "Long Answer" Section */}
                        <section className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10">
                            <h2 className="text-3xl font-bold mb-10 flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400">
                                    <HelpCircle size={28} />
                                </div>
                                The Comprehensive Answer
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div className="relative pl-10">
                                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm">1</div>
                                        <h3 className="text-xl font-bold mb-3 text-slate-100">HTML Generation</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            Unlike Client-Side Rendering where the browser gets an empty shell, SSR builds the
                                            <strong className="text-indigo-300"> fully-formed HTML </strong> on the server for
                                            every single request.
                                        </p>
                                    </div>
                                    <div className="relative pl-10">
                                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm">2</div>
                                        <h3 className="text-xl font-bold mb-3 text-slate-100">Immediate Gratification</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            The browser receives the final UI instantly. This significantly reduces
                                            <strong className="text-indigo-300"> First Contentful Paint (FCP) </strong> and
                                            <strong className="text-indigo-300"> Largest Contentful Paint (LCP)</strong>.
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="relative pl-10">
                                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm">3</div>
                                        <h3 className="text-xl font-bold mb-3 text-slate-100">Elite SEO</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            Search engine crawlers (Google, Bing) don't need to execute JavaScript to understand
                                            your page. They see the content <strong className="text-indigo-300">immediately </strong>
                                            upon indexing.
                                        </p>
                                    </div>
                                    <div className="relative pl-10">
                                        <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-sm">4</div>
                                        <h3 className="text-xl font-bold mb-3 text-slate-100">Dynamic Context</h3>
                                        <p className="text-slate-400 leading-relaxed">
                                            SSR provides access to <strong className="text-indigo-300">Request Headers </strong>
                                            (Cookies, User-Agents) during the rendering phase, allowing for deeply personalized
                                            user experiences.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Implementation Playground */}
                        <section className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-10 overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                <div>
                                    <h2 className="text-3xl font-bold flex items-center gap-4">
                                        <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                                            <Terminal size={28} />
                                        </div>
                                        Implementation Patterns
                                    </h2>
                                    <p className="text-slate-500 mt-2 font-medium">Comparison between App Router and Pages Router</p>
                                </div>
                                <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-white/10 self-start">
                                    <button
                                        onClick={() => setActiveTab('modern')}
                                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'modern' ? 'bg-indigo-600 shadow-xl shadow-indigo-900/20' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        App Router (Dynamic)
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('legacy')}
                                        className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'legacy' ? 'bg-indigo-600 shadow-xl shadow-indigo-900/20' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        Pages Router (SSR)
                                    </button>
                                </div>
                            </div>

                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="rounded-[2rem] overflow-hidden border border-white/10 shadow-3xl group relative"
                            >
                                <div className="absolute top-4 right-6 text-[10px] font-black text-slate-700 uppercase tracking-widest group-hover:text-slate-500 transition-colors">
                                    {activeTab === 'modern' ? 'server-component.js' : 'pages/index.js'}
                                </div>
                                <SyntaxHighlighter
                                    language="javascript"
                                    style={atomDark}
                                    customStyle={{ margin: 0, padding: '3rem 2.5rem', fontSize: '0.95rem', background: '#0a0f1d' }}
                                >
                                    {activeTab === 'modern' ? appRouterCode : ssrCode}
                                </SyntaxHighlighter>
                            </motion.div>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex gap-4">
                                    <AlertCircle className="text-indigo-400 shrink-0" size={24} />
                                    <div>
                                        <h4 className="font-bold text-indigo-300 mb-1">Analytical Thinking</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            When asked to identify a performance bottleneck, check if the site is over-fetching in
                                            <code className="text-indigo-400"> getServerSideProps</code>. Large props objects can cause
                                            slow serialization and high memory usage.
                                        </p>
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex gap-4">
                                    <TrendingUp className="text-amber-400 shrink-0" size={24} />
                                    <div>
                                        <h4 className="font-bold text-amber-300 mb-1">Optimization Pro-Tip</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            Use <code className="text-amber-300">Streaming</code> with Suspense in the App Router to send parts
                                            of the UI as soon as they are ready, instead of waiting for the entire page data.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column (Sidebar Extras) */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* SSR Decision Matrix */}
                        <section className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/30">
                            <div className="absolute top-0 right-0 p-8 opacity-20 -rotate-12">
                                <ShieldCheck size={120} />
                            </div>
                            <h3 className="text-2xl font-black mb-6 relative z-10">When to use SSR?</h3>
                            <div className="space-y-4 relative z-10">
                                {[
                                    { label: 'E-Commerce', desc: 'Product listings & live filters' },
                                    { label: 'Dashboards', desc: 'Personalized user analytics' },
                                    { label: 'News/Media', desc: 'Real-time content updates' },
                                    { label: 'Auth Ready', desc: 'Pages requiring cookies/sessions' }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 border border-white/5 backdrop-blur-sm">
                                        <CheckCircle size={20} className="text-indigo-200 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-bold leading-tight">{item.label}</p>
                                            <p className="text-xs text-indigo-100/70 mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Interview Checklist (The "Killer" Questions) */}
                        <section className="bg-slate-900/80 border border-white/10 rounded-[2.5rem] p-10">
                            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                                <Database className="text-slate-400" size={24} />
                                Key Questions
                            </h3>
                            <div className="space-y-6">
                                {[
                                    {
                                        q: 'Hydration Mismatch?',
                                        a: 'When the server HTML differs from the first client render (e.g., using new Date() on client but not server).'
                                    },
                                    {
                                        q: 'SSR vs CSR?',
                                        a: 'SSR for SEO & First Load. CSR for highly interactive application shells like Spotify/Slack.'
                                    },
                                    {
                                        q: 'Edge Runtime?',
                                        a: 'Executing SSR at a CDN node closer to the user for <50ms TTFB.'
                                    }
                                ].map((check, i) => (
                                    <div key={i} className="p-5 rounded-2xl bg-slate-800/40 border border-white/5 hover:border-slate-700 transition-colors">
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">{check.q}</p>
                                        <p className="text-sm text-slate-300 leading-relaxed font-medium">{check.a}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Navigation */}
                        <Link href="/nextjs">
                            <motion.div
                                whileHover={{ x: 10 }}
                                className="group flex items-center justify-between p-8 rounded-[2rem] bg-slate-900 border border-white/5 hover:border-indigo-500/40 hover:bg-slate-800/80 transition-all cursor-pointer shadow-lg"
                            >
                                <div>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Back to Dashboard</p>
                                    <p className="text-2xl font-bold text-slate-100">Next.js Topics</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-indigo-600 transition-colors">
                                    <ArrowRight className="text-slate-400 group-hover:text-white transition-all" size={24} />
                                </div>
                            </motion.div>
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default SSRPage;
