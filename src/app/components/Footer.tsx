import React from 'react';
import { Terminal, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-lg">
                                <Terminal className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                CodeVisualizer
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-slate-400 max-w-sm mb-6">
                            Master technical interviews with interactive visualizations.
                            Built for developers, by developers.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Platform</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">DSA Visualizer</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Roadmap</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Challenges</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Pricing</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">About</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Blog</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Careers</a></li>
                            <li><a href="#" className="text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">Contact</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500 dark:text-slate-500">
                        © {new Date().getFullYear()} CodeVisualizer. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500 dark:text-slate-500">
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-900 dark:hover:text-white">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
