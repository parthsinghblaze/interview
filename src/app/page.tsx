'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Layers, Code, Moon, ArrowRight, Lock, Database, Server, Box, Terminal, Cpu, Zap, Search as SearchIcon, Maximize2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import Search from './components/Search';

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const features = [
    {
      icon: Play,
      title: 'Interactive Visualizations',
      description: 'Watch algorithms come to life with step-by-step animations and real-time state updates.',
      color: 'blue'
    },
    {
      icon: Layers,
      title: 'Step-by-Step Learning',
      description: 'Break down complex problems into manageable steps to truly understand the logic.',
      color: 'purple'
    },
    {
      icon: Code,
      title: 'Dual Language Support',
      description: 'Switch between JavaScript and Python implementations instantly to compare syntax.',
      color: 'green'
    },
    {
      icon: Moon,
      title: 'Dark & Light Themes',
      description: 'Optimized reading experience for late-night coding sessions or bright environments.',
      color: 'orange'
    }
  ];

  const topics = [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      description: 'Master the core of technical interviews with visual guides.',
      icon: Code,
      status: 'active',
      count: '7 Visualizers',
      href: '/dsa',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'javascript',
      title: 'JavaScript Deep Dive',
      description: 'Understand closures, hoisting, and the event loop.',
      icon: Terminal,
      status: 'active',
      count: '17 Concepts',
      href: '/javascript',
      gradient: 'from-yellow-400 to-yellow-600'
    },
    {
      id: 'typescript',
      title: 'TypeScript Mastery',
      description: 'Learn interfaces, generics, and type safety.',
      icon: Cpu,
      status: 'active',
      count: '8 Visualizers',
      href: '/typescript',
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'react',
      title: 'React Engineering',
      description: 'Deep dive into hooks, rendering cycles, and state management.',
      icon: Box,
      status: 'active',
      count: '12 Masterclasses',
      href: '/react',
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      id: 'nextjs',
      title: 'Next.js 15+',
      description: 'Server components, routing, and modern full-stack patterns.',
      icon: Layers,
      status: 'active',
      count: '8 Architectures',
      href: '/nextjs',
      gradient: 'from-slate-800 to-black'
    },
    {
      id: 'nodejs',
      title: 'Node.js',
      description: 'Event loop, streams, and scalable backend architecture.',
      icon: Server,
      status: 'coming-soon',
      href: '#',
      gradient: 'from-green-600 to-emerald-600'
    },
    {
      id: 'database',
      title: 'Database',
      description: 'Schema design, indexing strategies, and query optimization.',
      icon: Database,
      status: 'coming-soon',
      href: '#',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 dark:from-blue-600/5 dark:via-transparent dark:to-purple-600/5 z-0"></div>

        {/* Abstract Blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-soft-light animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-soft-light animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide uppercase mb-8 border border-blue-200 dark:border-blue-800"
            >
              <Zap size={14} className="fill-current" />
              <span>The Next Generation of Technical Learning</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <h1 className="text-5xl md:text-8xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-8">
                Learn Code Through <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                  Visual Mastery
                </span>
              </h1>

              <p className="mt-4 text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
                Experience technical concepts like never before. From <span className="text-blue-600 dark:text-blue-400">DSA</span> to <span className="text-purple-600 dark:text-purple-400">Advanced React Architectures</span>, we visualize the logic for you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Link
                  href="/dsa"
                  className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition-all transform hover:-translate-y-1 hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                  <Play size={20} className="fill-current" />
                  Explore Visualizers
                </Link>
                <button
                  className="px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-lg flex items-center gap-3"
                  onClick={() => document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Layers size={20} />
                  Browse Topics
                </button>
              </div>
            </motion.div>
          </div>

          {/* New IDE Visualization Section */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            className="relative mx-auto max-w-5xl"
          >
            {/* Glow effect behind IDE */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-[2rem] blur-2xl z-0"></div>

            <div className="relative z-10 bg-slate-950 rounded-[2rem] shadow-2xl border border-white/10 overflow-hidden group">
              {/* Window Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.4)]"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.4)]"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                </div>
                <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-800/50 border border-white/5 text-[10px] sm:text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span>Visualizing: BinarySearch.ts</span>
                  </div>
                  <div className="w-px h-3 bg-white/10"></div>
                  <span className="text-emerald-400/80">O(log n)</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                  <Maximize2 size={16} className="cursor-pointer hover:text-white transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] border-t border-white/5 bg-slate-950/80 backdrop-blur-3xl min-h-[400px]">
                {/* Code Panel */}
                <div className="p-6 sm:p-8 border-r border-white/5 font-mono text-sm leading-relaxed overflow-hidden">
                  <div className="space-y-1">
                    <div className="flex gap-4">
                      <span className="text-slate-700 w-4">1</span>
                      <span className="text-purple-400">function</span> <span className="text-blue-400">binarySearch</span>(arr, target) {'{'}
                    </div>
                    <div className="flex gap-4">
                      <span className="text-slate-700 w-4">2</span>
                      <span className="text-purple-400">  let</span> low = <span className="text-orange-400">0</span>;
                    </div>
                    <div className="flex gap-4">
                      <span className="text-slate-700 w-4">3</span>
                      <span className="text-purple-400">  let</span> high = arr.length - <span className="text-orange-400">1</span>;
                    </div>
                    <div className="flex gap-4 bg-blue-500/10 -mx-8 px-8 border-l-2 border-blue-500 py-1">
                      <span className="text-slate-700 w-4">4</span>
                      <span className="text-purple-400">  while</span> (low {"<="} high) {'{'}
                    </div>
                    <div className="flex gap-4">
                      <span className="text-slate-700 w-4">5</span>
                      <span className="text-purple-400">    const</span> mid = Math.floor((low + high) / <span className="text-orange-400">2</span>);
                    </div>
                    <div className="flex gap-4">
                      <span className="text-slate-700 w-4">6</span>
                      <span className="text-purple-400">    if</span> (arr[mid] === target) <span className="text-purple-400">return</span> mid;
                    </div>
                    <div className="flex gap-4">
                      <span className="text-slate-700 w-4">7</span>
                      <span className="text-purple-400">    else if</span> (arr[mid] {"<"} target) low = mid + <span className="text-orange-400">1</span>;
                    </div>
                    <div className="flex gap-4">
                      <span className="text-slate-700 w-4">8</span>
                      <span className="text-purple-400">    else</span> high = mid - <span className="text-orange-400">1</span>;
                    </div>
                    <div className="flex gap-4">
                      <span className="text-slate-700 w-4">9</span>
                      <span>  {'}'}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-slate-700 w-4">10</span>
                      <span className="text-purple-400">  return</span> -<span className="text-orange-400">1</span>;
                    </div>
                  </div>

                  {/* Terminal-like output */}
                  <div className="mt-8 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-emerald-400/80 mb-2">
                      <CheckCircle2 size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">State Log</span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex justify-between">
                        <span>Iterating mid: 4</span>
                        <span className="text-slate-400">low: 0, high: 9</span>
                      </div>
                      <div className="flex justify-between text-blue-400/80">
                        <span>Found mid {">"} target</span>
                        <span>high = 3</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visualization Panel */}
                <div className="p-8 flex flex-col items-center justify-center bg-slate-900/30 relative">
                  {/* Background grid for viz */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 0.5px, transparent 0.5px)', backgroundSize: '15px 15px' }}></div>

                  <div className="relative z-10 w-full flex flex-col items-center gap-12">
                    {/* Visualizer bars/elements */}
                    <div className="flex gap-2.5 items-end h-40">
                      {[65, 40, 85, 55, 100, 70, 45, 90, 35, 60].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 0.5 + i * 0.05, duration: 1, ease: "backOut" }}
                          className={`w-4 sm:w-6 rounded-t-lg shadow-lg relative group/bar ${i === 4 ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-slate-800 border border-white/5 opacity-50'}`}
                        >
                          {i === 4 && (
                            <motion.div
                              layoutId="pointer"
                              className="absolute -top-10 left-1/2 -translate-x-1/2 text-blue-400"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                              <SearchIcon size={20} className="fill-current" />
                            </motion.div>
                          )}
                          <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold ${i === 4 ? 'text-blue-400' : 'text-slate-600'}`}>
                            {i}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-4 flex gap-6 shadow-xl backdrop-blur-md">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Target</span>
                        <span className="text-xl font-bold font-mono text-emerald-400">42</span>
                      </div>
                      <div className="w-px h-10 bg-white/5"></div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Iterations</span>
                        <span className="text-xl font-bold font-mono text-blue-400">3</span>
                      </div>
                      <div className="w-px h-10 bg-white/5"></div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Recursion</span>
                        <span className="text-xl font-bold font-mono text-purple-400">No</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating decorative elements */}
                  <motion.div
                    animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute top-10 right-10 p-3 bg-slate-800/80 border border-white/10 rounded-xl shadow-2xl backdrop-blur-sm z-20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Cpu size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white leading-none">CPU Load</span>
                        <span className="text-[8px] text-slate-500">2.4ms lat</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Why Learn With CodeVisualizer?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">We bridge the gap between abstract theory and practical understanding through high-fidelity visualizations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group relative bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3
                  ${feature.color === 'blue' ? 'bg-blue-600 text-white shadow-blue-500/20' : ''}
                  ${feature.color === 'purple' ? 'bg-purple-600 text-white shadow-purple-500/20' : ''}
                  ${feature.color === 'green' ? 'bg-emerald-600 text-white shadow-emerald-500/20' : ''}
                  ${feature.color === 'orange' ? 'bg-orange-600 text-white shadow-orange-500/20' : ''}
                `}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>

                {/* Decorative glow on hover */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section id="topics" className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -mr-64 -mt-64"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] -ml-64 -mb-64"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Explore Knowledge Paths</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">Deep dive into specific technologies with curated visual learning experiences.</p>
            </div>

            <div className="w-full md:w-96">
              <div className="relative group">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/5 rounded-2xl focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all shadow-sm hover:shadow-md text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {topics
              .filter(topic =>
                topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                topic.description.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((topic) => (
                <motion.div variants={item} key={topic.id} className="h-full">
                  <div className={`relative group h-full bg-white dark:bg-slate-900/50 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col ${topic.status === 'locked' ? 'opacity-75' : ''}`}>
                    {/* Card Header Background */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${topic.gradient} opacity-[0.03] group-hover:opacity-[0.08] rounded-bl-[5rem] transition-opacity`}></div>

                    <div className="p-8 flex flex-col h-full relative z-10">
                      <div className="flex justify-between items-start mb-8">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${topic.gradient} text-white shadow-lg shadow-blue-500/20`}>
                          <topic.icon size={32} />
                        </div>
                        {topic.status === 'coming-soon' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400 border border-slate-200 dark:border-white/5 uppercase tracking-wider">
                            <Lock size={12} /> Coming Soon
                          </span>
                        ) : (
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">Duration</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-white/5 px-2 py-1 rounded-md">
                              {topic.count}
                            </span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{topic.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow leading-relaxed">{topic.description}</p>

                      {topic.status === 'active' ? (
                        <Link
                          href={topic.href}
                          className={`inline-flex items-center justify-center w-full px-6 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 dark:shadow-white/5`}
                        >
                          Access Curriculum <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center justify-center w-full px-6 py-4 bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 font-bold rounded-xl cursor-not-allowed border border-slate-200 dark:border-white/5"
                        >
                          Lock Feature
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
