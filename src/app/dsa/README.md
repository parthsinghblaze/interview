# DSA Visualizers & Development Guide

This directory contains the interactive visualizations for the algorithm interview preparation platform.

## Directory Structure
Each algorithm is self-contained in its own directory (e.g., `two-sum/`, `binary-search/`) with a `page.tsx` file responsible for the logic and rendering.

## Shared Standards
All visualizers must adhere to the **"Visualization Bro"** design aesthetic:
- **Dark Mode Only**: `bg-slate-950` base.
- **Gradient Accents**: Specific color themes per algo (e.g., `indigo` for Stack, `blue` for Binary Search).
- **Framer Motion**: For all state transitions (layout animations, entering/exiting elements).
- **Sound Effects**: Auditory feedback for all discrete steps.

## UI Layout Structure
The standard layout consists of a responsive Grid:
1. **Left Column** (Fixed width on Desktop):
   - **Controller Panel**: Inputs, Playback controls, Progress bar.
   - **Code Component**: `react-syntax-highlighter` displaying the algorithm code.
2. **Right Column** (Flexible):
   - **Visualization Stage**: The main area for animations (Bars, Nodes, Grids).
   - **Stats Panel**: Time/Space complexity and current status metrics.
3. **Modal**: `DSAExplanationModal` for theoretical depth.

## Implementation Template

When creating a new visualizer, copy this structure to ensure consistency.

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
    ChevronLeft, ChevronRight, RotateCcw, Play, Pause, 
    Code, Info, HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Header from '../../components/Header';
import DSAExplanationModal from '../../components/DSAExplanationModal';

// 1. Define Step Interface
interface Step {
    description: string;
    // ... algorithm specific state (indexes, values, flags)
    jsLine: number;
    pyLine: number;
    completed?: boolean;
}

const NewAlgoVisualizer = () => {
    // 2. State Management
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [steps, setSteps] = useState<Step[]>([]); 
    // ... input state

    // 3. Sound Effects (Standard Implementation)
    const playTone = (freq: number, type: 'sine' | 'square' | 'triangle' = 'sine', duration: number = 0.1) => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.onended = () => ctx.close();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            console.error("Audio play failed", e);
        }
    };

    // 4. Playback Logic
    useEffect(() => {
        if ((!isPlaying && currentStep === 0) || currentStep >= steps.length) return;

        const interval = setInterval(() => {
            if (isPlaying && currentStep < steps.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else if (currentStep >= steps.length - 1) {
                setIsPlaying(false);
            }
        }, 800); // Adjust speed as needed

        // Sound Triggers based on Step State
        if (isPlaying || currentStep > 0) {
            const step = steps[currentStep];
            if (step.completed) {
                playTone(600, 'sine', 0.1); 
                setTimeout(() => playTone(800, 'sine', 0.3), 100);
            } else if (step.description.includes('Found')) {
                playTone(500, 'sine', 0.1);
            } else {
                playTone(200, 'sine', 0.05); // Default tick
            }
        }

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps]);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
            <Header />
            <main className="flex-1 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black pt-20 pb-6 px-4 md:px-6">
                <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 relative z-10">
                    
                    {/* LEFT COLUMN: Controls */}
                    <div className="flex flex-col gap-6 lg:h-[calc(100vh-140px)] lg:overflow-y-auto custom-scrollbar">
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                             <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-6">Algorithm Name</h1>
                             {/* Input Controls Here */}
                             {/* Playback Buttons Here */}
                        </div>

                        {/* Code View */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex-1 flex flex-col min-h-[300px]">
                            {/* SyntaxHighlighter Here */}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Visualization */}
                    <div className="flex flex-col gap-6">
                        <div className="min-h-[500px] lg:flex-grow bg-slate-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-4 md:p-8 relative overflow-visible flex flex-col items-center">
                            {/* Render Visuals Here using Framer Motion */}
                        </div>

                        {/* Stats Panel */}
                        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                            {/* Complexity Stats Here */}
                        </div>
                    </div>
                </div>
            </main>
            <DSAExplanationModal isOpen={false} onClose={() => {}} title="Algo" description="" concept="" efficiency="" useCases={[]} timeComplexity="" spaceComplexity="" complexityNotes="" interviewTips={[]} color="indigo" />
        </div>
    );
};
```
