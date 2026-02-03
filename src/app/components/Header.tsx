'use client';

import React, { useState } from 'react';
import { Moon, Sun, Menu, X, Code, Terminal, Box, Layers, Server, Database, ChevronDown, Cpu } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { toggleTheme } from '../../lib/features/theme/themeSlice';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Search from './Search';

const Header = () => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.theme.mode);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const mainNavItems = [
        { name: 'DSA', icon: Code, href: '/dsa', active: true },
        { name: 'JavaScript', icon: Terminal, href: '/javascript', active: true },
        { name: 'TypeScript', icon: Cpu, href: '/typescript', active: true },
    ];

    const moreTopics = [
        { name: 'React', icon: Box, href: '#', active: false },
        { name: 'Next.js', icon: Layers, href: '#', active: false },
        { name: 'Node.js', icon: Server, href: '#', active: false },
        { name: 'Database', icon: Database, href: '#', active: false },
    ];

    const allNavItems = [...mainNavItems, ...moreTopics];

    const isActive = (path: string) => pathname === path;

    return (
        <header className="fixed w-full top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
                            <Terminal className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            CodeVisualizer
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
                        {mainNavItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                                    ${isActive(item.href)
                                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800/50'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}

                        {/* More Topics Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                                More <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform" />
                            </button>
                            <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                                <div className="p-2 space-y-1">
                                    {moreTopics.map((item) => (
                                        <div key={item.name}>
                                            {item.active ? (
                                                <Link
                                                    href={item.href}
                                                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    {item.name}
                                                </Link>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60"
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    {item.name}
                                                    <span className="ml-auto text-[10px] bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Soon</span>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Search />
                        {/* Theme Toggle */}
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                <Moon className="h-5 w-5" />
                            ) : (
                                <Sun className="h-5 w-5 text-orange-500" />
                            )}
                        </button>

                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={() => dispatch(toggleTheme())}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-yellow-400"
                        >
                            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-orange-500" />}
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-4">
                            <div className="px-4">
                                <Search />
                            </div>
                            <div className="space-y-2">
                                {allNavItems.map((item) => (
                                    <div key={item.name} className="relative">
                                        {item.active ? (
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium
                        ${isActive(item.href)
                                                        ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-600 dark:text-gray-300'
                                                    }`}
                                            >
                                                <item.icon className="h-5 w-5" />
                                                {item.name}
                                            </Link>
                                        ) : (
                                            <button
                                                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                            >
                                                <item.icon className="h-5 w-5" />
                                                {item.name}
                                                <span className="ml-auto text-xs bg-gray-100 dark:bg-slate-800 text-gray-500 px-2 py-1 rounded">
                                                    Soon
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
