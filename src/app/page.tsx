'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Layers, Code, Moon, ArrowRight, Lock, Database, Server, Box } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
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
      count: '3 Visualizers',
      href: '/dsa',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'react',
      title: 'React',
      description: 'Deep dive into hooks, rendering cycles, and state management.',
      icon: Box,
      status: 'coming-soon',
      href: '#',
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      id: 'nextjs',
      title: 'Next.js',
      description: 'Server components, routing, and modern full-stack patterns.',
      icon: Layers,
      status: 'coming-soon',
      href: '#',
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
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 dark:from-purple-900/40 dark:via-slate-900 dark:to-blue-900/40 z-0"></div>

        {/* Abstract Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 dark:bg-purple-700/20 rounded-full blur-3xl mix-blend-multiply animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300/30 dark:bg-blue-700/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
              Master Your Tech Interviews with <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Interactive Visualizations
              </span>
            </h1>

            <p className="mt-4 text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
              Visual learning platform for DSA, React, Next.js, Node.js & Database.
              Understand complex concepts through beautiful, interactive animations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dsa"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1"
              >
                Start Learning
              </Link>
              <button
                className="px-8 py-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-white font-semibold rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
                onClick={() => document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Topics
              </button>
            </div>
          </motion.div>

          {/* Floating Code/Graphic Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 relative mx-auto max-w-4xl"
          >
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 p-2 sm:p-4">
              <div className="flex gap-2 mb-4 px-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 font-mono text-sm text-left overflow-hidden">
                  <div className="flex justify-between items-center mb-2 border-b border-gray-200 dark:border-slate-800 pb-2">
                    <span className="text-gray-500 dark:text-slate-400">algorithm.js</span>
                    <span className="text-blue-500 text-xs">O(n)</span>
                  </div>
                  <pre className="text-gray-800 dark:text-gray-300">
                    <code>
                      <span className="text-purple-600 dark:text-purple-400">function</span> <span className="text-blue-600 dark:text-blue-400">findMax</span>(arr) {'{'}
                      {'\n  '}<span className="text-purple-600 dark:text-purple-400">let</span> max = arr[0];
                      {'\n  '}<span className="text-purple-600 dark:text-purple-400">for</span> (<span className="text-purple-600 dark:text-purple-400">let</span> i = 1; i &lt; arr.length; i++) {'{'}
                      {'\n    '}<span className="text-purple-600 dark:text-purple-400">if</span> (arr[i] &gt; max) {'{'}
                      {'\n      '}max = arr[i];
                      {'\n    '} {'}'}
                      {'\n  '} {'}'}
                      {'\n  '}<span className="text-purple-600 dark:text-purple-400">return</span> max;
                      {'\n}'}
                    </code>
                  </pre>
                </div>

                <div className="rounded-lg p-4 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900/50">
                  <div className="flex gap-2 items-end h-32 mb-4">
                    <motion.div
                      animate={{ height: ['20%', '100%', '20%'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-8 bg-blue-500 rounded-t-md"
                    ></motion.div>
                    <motion.div
                      animate={{ height: ['50%', '30%', '80%', '50%'] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="w-8 bg-purple-500 rounded-t-md"
                    ></motion.div>
                    <motion.div
                      animate={{ height: ['80%', '40%', '90%', '80%'] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="w-8 bg-pink-500 rounded-t-md"
                    ></motion.div>
                    <motion.div
                      animate={{ height: ['40%', '60%', '30%', '40%'] }}
                      transition={{ duration: 2.8, repeat: Infinity }}
                      className="w-8 bg-cyan-500 rounded-t-md"
                    ></motion.div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Visualizing Data Structures</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Learn With CodeVisualizer?</h2>
            <p className="mt-4 text-gray-600 dark:text-slate-400">We make complex concepts simple through visualization.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-xl hover:shadow-xl transition-shadow border border-transparent dark:border-slate-800 hover:border-gray-200 dark:hover:border-slate-700"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 
                  ${feature.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                  ${feature.color === 'purple' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                  ${feature.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : ''}
                  ${feature.color === 'orange' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                `}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section id="topics" className="py-20 bg-gray-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Topics</h2>
            <p className="mt-4 text-gray-600 dark:text-slate-400">Choose a path to master your technical skills.</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {topics.map((topic) => (
              <motion.div variants={item} key={topic.id}>
                <div className={`relative group h-full bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 ${topic.status === 'locked' ? 'opacity-75' : ''}`}>
                  {/* Card Header Gradient */}
                  <div className={`h-2 w-full bg-gradient-to-r ${topic.gradient}`}></div>

                  <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors`}>
                        <topic.icon size={28} />
                      </div>
                      {topic.status === 'coming-soon' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400">
                          <Lock size={12} /> Coming Soon
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 shadow-sm border border-green-200 dark:border-transparent">
                          {topic.count}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{topic.title}</h3>
                    <p className="text-gray-600 dark:text-slate-400 text-sm mb-6 flex-grow">{topic.description}</p>

                    {topic.status === 'active' ? (
                      <Link
                        href={topic.href}
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500 font-semibold rounded-lg hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 dark:hover:text-white transition-all group-hover:scale-[1.02]"
                      >
                        Start Learning <ArrowRight size={16} className="ml-2" />
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center justify-center w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 font-medium rounded-lg cursor-not-allowed border border-transparent"
                      >
                        Notify Me
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
