'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    RotateCcw,
    ChevronRight,
    ChevronLeft,
    Code,
    BookOpen,
    Lightbulb,
    AlertCircle,
    Shield,
    GitBranch,
    Hexagon,
    Cpu
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const OOPSVisualizer = () => {
    const [currentExample, setCurrentExample] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const examples = [
        {
            title: 'Classes & Objects',
            icon: <Box className="text-blue-400" />,
            simpleDef: "A Class is a blueprint (like a recipe), and an Object is the actual thing (like the cake) made from that blueprint.",
            analogy: "Think of an Architect's drawing (Class) vs. the actual House (Object) built using it.",
            code: `class Car {
  constructor(brand) {
    this.brand = brand;
  }
  drive() {
    return "🚗 " + this.brand + " is driving";
  }
}

const myCar = new Car("Tesla");
console.log(myCar.drive());`,
            steps: [
                {
                    line: 1,
                    description: 'Class is a blueprint for creating objects. It defines properties and methods.',
                    data: { type: 'Class Definition', name: 'Car' },
                    highlight: 'class'
                },
                {
                    line: 2,
                    description: 'The constructor initializes the object properties when "new" is called.',
                    data: { method: 'constructor', params: ['brand'] },
                    highlight: 'constructor'
                },
                {
                    line: 10,
                    description: 'Creating an instance (Object) from the Class blueprint.',
                    data: { instance: 'myCar', brand: 'Tesla', proto: 'Car.prototype' },
                    highlight: 'instance'
                },
                {
                    line: 11,
                    description: 'Calling a method on the instance. JS looks it up on the prototype.',
                    data: { call: 'drive()', target: 'myCar' },
                    output: '"🚗 Tesla is driving"',
                    highlight: 'method'
                }
            ],
            explanation: "Classes serve as detailed blueprints or templates that define the structure (properties) and behavior (methods) of an entity. Objects are the live instances created from these blueprints, holding their own unique data while sharing the same underlying logic defined in the Class."
        },
        {
            title: 'Inheritance',
            icon: <GitBranch className="text-green-400" />,
            simpleDef: "Inheritance allows one class to get methods and properties from another class, just like children inherit traits from parents.",
            analogy: "A 'Dog' is a 'Animal'. It gets all traits of Animal (eating, sleeping) and adds its own (barking).",
            code: `class Animal {
  eat() { return "Nom nom..."; }
}

class Dog extends Animal {
  bark() { return "Woof! 🐶"; }
}

const rex = new Dog();
console.log(rex.eat()); // Inherited method`,
            steps: [
                {
                    line: 1,
                    description: 'Define a parent (base) class with common functionality.',
                    data: { parent: 'Animal', methods: ['eat'] },
                    highlight: 'parent'
                },
                {
                    line: 5,
                    description: '"extends" creates a link between Dog and Animal.',
                    data: { child: 'Dog', parent: 'Animal', methods: ['bark'] },
                    highlight: 'extends'
                },
                {
                    line: 10,
                    description: 'Rex is a Dog, but also an Animal by inheritance.',
                    data: { instance: 'rex', type: 'Dog', inherits: 'Animal' },
                    highlight: 'instance'
                },
                {
                    line: 11,
                    description: 'Rex doesn\'t have "eat" directly, so it looks up the chain to Animal.',
                    data: { searching: 'eat', level: 'rex -> Dog -> Animal', found: true },
                    output: '"Nom nom..."',
                    highlight: 'lookup'
                }
            ],
            explanation: "Inheritance is a mechanism that allows a 'Child' class to acquire all the properties and methods of a 'Parent' class. This promotes code reusability and creates a hierarchical relationship between objects, where specialized classes can extend or override the functionality of more general ones via the Prototype Chain."
        },
        {
            title: 'Encapsulation',
            icon: <Shield className="text-purple-400" />,
            simpleDef: "Encapsulation is like a protective shield. It hides the internal data and only allows access through specific 'gates' (methods).",
            analogy: "Like a Medicine Capsule: You only see the capsule (interface), not the powder (private data) inside.",
            code: `class BankAccount {
  #balance = 0; // Private Field

  deposit(amount) {
    if (amount > 0) this.#balance += amount;
  }

  get balance() {
    return \`$\${this.#balance}\`;
  }
}

const acc = new BankAccount();
acc.deposit(100);
console.log(acc.#balance); // ❌ Syntax Error!`,
            steps: [
                {
                    line: 2,
                    description: 'The "#" prefix makes a field private. It cannot be accessed outside the class.',
                    data: { private: '#balance', access: 'Internal only' },
                    highlight: 'private'
                },
                {
                    line: 4,
                    description: 'Public methods act as "gatekeepers" to modify private data safely.',
                    data: { method: 'deposit', modifies: '#balance' },
                    highlight: 'gatekeeper'
                },
                {
                    line: 15,
                    description: 'Directly trying to access #balance from outside causes a syntax error.',
                    data: { attempt: 'acc.#balance', allowed: false },
                    output: 'Syntax Error 🛑',
                    highlight: 'error'
                }
            ],
            explanation: "Encapsulation is the practice of bundling data and the methods that operate on that data into a single unit (the class), while restricting direct access to some of the object's internal components. In JavaScript, this is achieved using private fields (starting with #) and getter/setter methods to provide controlled 'gatekeeper' access."
        },
        {
            title: 'Polymorphism',
            icon: <Hexagon className="text-orange-400" />,
            simpleDef: "Polymorphism means 'many forms'. It allows different objects to use the same method name but perform different actions.",
            analogy: "A 'Smart Remote' that has one 'Power' button. It turns on the TV, AC, or Fan differently depending on what you point at.",
            code: `class Shape {
  draw() { return "Drawing a shape..."; }
}

class Circle extends Shape {
  draw() { return "Drawing a circle ⚪"; }
}

class Square extends Shape {
  draw() { return "Drawing a square ⬛"; }
}

const shapes = [new Circle(), new Square()];
shapes.forEach(s => console.log(s.draw()));`,
            steps: [
                {
                    line: 2,
                    description: 'Base class defines a generic "draw" method.',
                    data: { class: 'Shape', method: 'draw' },
                    highlight: 'base'
                },
                {
                    line: 6,
                    description: 'Circle overrides (redefines) "draw" with its own behavior.',
                    data: { class: 'Circle', action: 'Redefine draw' },
                    highlight: 'override'
                },
                {
                    line: 14,
                    description: 'We treat both as "Shapes", but they behave differently when called.',
                    data: { loop: 'shapes', item1: 'Circle', item2: 'Square' },
                    output: '"Drawing a circle ⚪"',
                    highlight: 'dynamic'
                }
            ],
            explanation: "Polymorphism, meaning 'many forms', allows different objects to be treated as instances of the same general class through a common interface. It enables a single method name (like .draw()) to behave differently depending on which object it is called upon, allowing for flexible and dynamic code execution at runtime."
        },
        {
            title: 'Abstraction',
            icon: <Cpu className="text-pink-400" />,
            simpleDef: "Abstraction is about hiding complexity. It's like a TV remote: you only need to know which button to press, not how the internal circuitry works.",
            analogy: "A Coffee Machine: You press 'Start' (Interface). You don't need to know how the beans are ground or water is heated (Complexity).",
            code: `class CoffeeMachine {
  #grindBeans() { return "Grinding..."; }
  #heatWater() { return "Heating..."; }

  makeCoffee() {
    this.#grindBeans();
    this.#heatWater();
    return "☕ Coffee Ready!";
  }
}

const myMachine = new CoffeeMachine();
console.log(myMachine.makeCoffee());`,
            steps: [
                {
                    line: 2,
                    description: 'Complex internal methods are hidden (Private). The user doesn\'t see these.',
                    data: { internal: 'grindBeans', status: 'Hidden' },
                    highlight: 'hidden'
                },
                {
                    line: 5,
                    description: 'This is the "Interface". The only thing the user needs to know about.',
                    data: { public: 'makeCoffee', status: 'Exposed' },
                    highlight: 'interface'
                },
                {
                    line: 14,
                    description: 'User interacts with the simple interface, ignoring the complexity inside.',
                    data: { interaction: 'button press', result: 'Coffee' },
                    output: '"☕ Coffee Ready!"',
                    highlight: 'simple'
                }
            ],
            explanation: "Abstraction focuses on hiding the complex implementation details of a system and exposing only the necessary parts to the user. It reduces complexity and increases efficiency by providing a simple interface (like a remote control) that allows users to perform tasks without needing to understand the intricate internal machinery underneath."
        }
    ];

    const currentEx = examples[currentExample];
    const currentStepData = currentEx.steps[currentStep];

    const handleNext = () => {
        if (currentStep < currentEx.steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleReset = () => {
        setCurrentStep(0);
    };

    const changeExample = (index: number) => {
        setCurrentExample(index);
        setCurrentStep(0);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            <Header />

            <div className="pt-20 min-h-[calc(100vh-5rem)] flex flex-col md:flex-row divide-x divide-slate-800">
                {/* Left Sidebar - Theory & Context */}
                <aside className="w-full md:w-80 bg-slate-900 border-r border-slate-800 p-6 overflow-y-auto no-scrollbar">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Cpu className="text-blue-400" size={32} />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">OOPS</h1>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            Object-Oriented Programming: Organizing code into reusable "objects" rather than just functions.
                        </p>

                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                            <h4 className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">In Simple Terms</h4>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Imagine code is like building with LEGOs. Instead of one long instruction list, you have <strong>reusable blocks</strong> (Objects) that know how to do things.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <section>
                            <div className="flex items-center gap-2 mb-3">
                                <BookOpen className="text-blue-400" size={20} />
                                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest">The Core 4</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { name: 'Encapsulation', desc: 'Secure data' },
                                    { name: 'Inheritance', desc: 'Reuse code' },
                                    { name: 'Polymorphism', desc: 'Many forms' },
                                    { name: 'Abstraction', desc: 'Hide complexity' }
                                ].map((pill) => (
                                    <div key={pill.name} className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors group">
                                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{pill.name}</div>
                                        <div className="text-xs text-slate-500">{pill.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-blue-500/5 rounded-2xl p-4 border border-blue-500/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="text-yellow-400" size={18} />
                                <h4 className="text-sm font-bold text-yellow-400 uppercase">Pro Tip</h4>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed italic">
                                "JS uses Prototypes under the hood, even when using the 'class' syntax. Classes are mostly 'Syntactic Sugar' to make OOPS easier."
                            </p>
                        </section>

                        <section className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700">
                            <div className="flex items-center gap-2 mb-3 text-slate-400">
                                <AlertCircle size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Interview Fact</span>
                            </div>
                            <p className="text-xs text-slate-400">
                                ES6 Classes (2015) introduced this syntax. Before that, we used Constructor Functions and manual .prototype links.
                            </p>
                        </section>
                    </div>
                </aside>

                {/* Main Visualizer Area */}
                <main className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden">
                    {/* Background Decorative Gradients */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    {/* Navbar Tabs */}
                    <div className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 px-6 py-4 sticky top-0 z-10">
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {examples.map((ex, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => changeExample(idx)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${currentExample === idx
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                                        }`}
                                >
                                    {ex.icon}
                                    {ex.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid Layout Shell */}
                    <div className="flex-1 flex flex-col">
                        {/* Top Section: Definition (Left) & Code (Right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-b border-slate-800 min-h-[50vh]">
                            {/* Left: Enhanced Definition Section */}
                            <div className="border-r border-slate-800 bg-slate-900/40 backdrop-blur-sm p-10 flex flex-col justify-center relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 shadow-[0_0_20px_#3b82f6]" />
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-600/20 rounded-2xl border border-blue-500/30 shadow-inner">
                                            <BookOpen className="text-blue-400" size={24} />
                                        </div>
                                        <span className="text-xs font-black text-blue-500 uppercase tracking-[0.4em]">Full Definition</span>
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-[1.1]">
                                        {currentEx.explanation}
                                    </h2>
                                    <div className="flex items-start gap-4 p-5 bg-slate-900/60 rounded-3xl border border-slate-800 shadow-2xl">
                                        <Lightbulb className="text-yellow-400 shrink-0 mt-1" size={20} />
                                        <p className="text-sm md:text-base text-slate-300 leading-relaxed font-medium italic">
                                            "{currentEx.simpleDef}"
                                        </p>
                                    </div>
                                    <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-start gap-3">
                                        <Cpu className="text-blue-400 shrink-0 mt-1" size={16} />
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            {currentEx.analogy}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Code Playground */}
                            <div className="bg-slate-900/10 backdrop-blur-sm flex flex-col overflow-hidden">
                                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                                    <div className="flex items-center gap-2">
                                        <Code className="text-blue-400" size={18} />
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Class Playground</h3>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
                                    </div>
                                </div>
                                <div className="flex-1 overflow-auto no-scrollbar">
                                    <SyntaxHighlighter
                                        language="javascript"
                                        style={atomDark}
                                        showLineNumbers={true}
                                        customStyle={{
                                            margin: 0,
                                            padding: '2rem',
                                            fontSize: '1.1rem',
                                            lineHeight: '1.6',
                                            backgroundColor: 'transparent'
                                        }}
                                        lineProps={(lineNumber: number) => {
                                            const isCurrentLine = lineNumber === currentStepData.line;
                                            return {
                                                style: {
                                                    backgroundColor: isCurrentLine ? 'rgba(59, 130, 246, 0.15)' : undefined,
                                                    borderLeft: isCurrentLine ? '4px solid #3b82f6' : '4px solid transparent',
                                                    paddingLeft: '1rem',
                                                    transition: 'all 0.3s ease'
                                                }
                                            };
                                        }}
                                    >
                                        {currentEx.code}
                                    </SyntaxHighlighter>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Step Details (Left) & Visualization (Right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 flex-1 min-h-[45vh]">
                            {/* Left: Step Details & Execution Info */}
                            <div className="border-r border-slate-800 p-10 bg-slate-950 flex flex-col justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`${currentExample}-${currentStep}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-8 max-w-xl mx-auto lg:mx-0"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="px-4 py-1.5 rounded-full bg-blue-600 shadow-lg shadow-blue-500/20 text-white text-xs font-black uppercase tracking-[0.2em]">
                                                Step {currentStep + 1}
                                            </div>
                                            <div className="h-px flex-1 bg-slate-800" />
                                        </div>

                                        <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
                                            {currentStepData.description}
                                        </h2>

                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="p-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2 border-l-2 border-blue-500/30">
                                                Internal State Tracking
                                            </div>
                                            <div className="p-6 bg-slate-900/80 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
                                                {Object.entries(currentStepData.data).map(([key, val]) => (
                                                    <div key={key} className="flex items-center justify-between group">
                                                        <span className="text-slate-400 font-mono text-xs capitalize group-hover:text-blue-400 transition-colors">{key}:</span>
                                                        <span className="text-blue-400 font-bold bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-500/20 shadow-inner">
                                                            {Array.isArray(val) ? val.join(', ') : String(val)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {currentStepData.output && (
                                            <motion.div
                                                initial={{ scale: 0.95, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="bg-green-500/5 border-2 border-green-500/20 p-6 rounded-3xl flex items-center justify-between group shadow-xl"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Runtime Console</span>
                                                </div>
                                                <code className="text-green-400 font-mono text-lg font-bold bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                                                    {currentStepData.output}
                                                </code>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Right: Live Visual Engine & Controls */}
                            <div className="bg-slate-900/20 flex flex-col relative overflow-hidden">
                                {/* Decorative Grid for Visual area */}
                                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />

                                <div className="flex-1 flex items-center justify-center p-12 relative z-10">
                                    <VisualStage example={currentExample} step={currentStep} data={currentStepData} />

                                    <div className="absolute top-8 left-8 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                                        Visual Engine Live
                                    </div>
                                </div>

                                {/* Integrated Bottom Controls */}
                                <div className="p-8 relative z-10">
                                    <div className="flex items-center justify-between bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
                                        <button
                                            onClick={handleReset}
                                            className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-2xl transition-all active:scale-95 border border-slate-700"
                                            title="Reset"
                                        >
                                            <RotateCcw size={22} />
                                        </button>

                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={handlePrevious}
                                                disabled={currentStep === 0}
                                                className="p-5 bg-slate-800 hover:bg-slate-700 disabled:opacity-20 disabled:cursor-not-allowed text-white rounded-2xl transition-all border border-slate-700 active:scale-95"
                                            >
                                                <ChevronLeft size={24} strokeWidth={3} />
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                disabled={currentStep === currentEx.steps.length - 1}
                                                className="px-10 py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] flex items-center gap-4 active:scale-95"
                                            >
                                                NEXT STEP
                                                <ChevronRight size={24} strokeWidth={3} />
                                            </button>
                                        </div>

                                        <div className="hidden sm:block">
                                            <div className="flex gap-1.5 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700">
                                                {currentEx.steps.map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-2 rounded-full transition-all duration-500 ${i <= currentStep ? 'w-8 bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'w-2 bg-slate-700'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};

// Sub-component for dynamic visual stage
const VisualStage = ({ example, step, data }: any) => {
    return (
        <div className="w-full h-full flex items-center justify-center p-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${example}-${step}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full max-w-2xl"
                >
                    {example === 0 && <ClassesVisual step={step} data={data} />}
                    {example === 1 && <InheritanceVisual step={step} data={data} />}
                    {example === 2 && <EncapsulationVisual step={step} data={data} />}
                    {example === 3 && <PolymorphismVisual step={step} data={data} />}
                    {example === 4 && <AbstractionVisual step={step} data={data} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const ClassesVisual = ({ step, data }: any) => {
    return (
        <div className="flex flex-col items-center gap-12">
            <div className="flex gap-20 items-center justify-center w-full">
                {/* Class Blueprint */}
                <motion.div
                    animate={{ opacity: step >= 0 ? 1 : 0.3 }}
                    className={`relative w-48 h-56 border-2 rounded-2xl flex flex-col items-center p-4 transition-colors ${step === 0 ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'border-slate-800 bg-slate-900/50'}`}
                >
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Blueprint</div>
                    <Cpu className={`mb-4 ${step === 0 ? 'text-blue-400' : 'text-slate-600'}`} size={40} />
                    <div className="text-xl font-bold mb-4">Class Car</div>
                    <div className="w-full space-y-2">
                        <div className={`h-2 rounded-full ${step >= 1 ? 'bg-blue-500' : 'bg-slate-800'}`} />
                        <div className={`h-2 w-2/3 rounded-full ${step >= 1 ? 'bg-blue-400' : 'bg-slate-800'}`} />
                        <div className="h-2 w-1/2 bg-slate-800 rounded-full" />
                    </div>
                </motion.div>

                <ChevronRight
                    className={`text-slate-800 transition-colors duration-500 ${step >= 2 ? 'text-blue-500 animate-pulse' : ''}`}
                    size={48}
                    strokeWidth={1}
                />

                {/* Instance Object */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: step >= 2 ? 1 : 0.5, opacity: step >= 2 ? 1 : 0 }}
                    className={`relative w-48 h-56 border-2 rounded-2xl flex flex-col items-center p-4 transition-colors ${step === 2 || step === 3 ? 'border-green-500 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : 'border-slate-800 bg-slate-900/50'}`}
                >
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instance</div>
                    <Box className={`mb-4 ${step >= 2 ? 'text-green-400' : 'text-slate-600'}`} size={40} />
                    <div className="text-xl font-bold mb-2 text-center">myCar Object</div>
                    <div className="bg-slate-950/50 rounded-lg p-3 w-full border border-slate-800 font-mono text-[10px]">
                        <div className="flex justify-between">
                            <span className="text-slate-500">brand:</span>
                            <span className="text-green-400 italic">"Tesla"</span>
                        </div>
                    </div>
                </motion.div>
            </div>
            {step === 3 && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="px-6 py-3 bg-blue-500/20 border border-blue-500/50 rounded-2xl text-blue-400 font-bold italic shadow-xl"
                >
                    Executing drive()... Outputting "🚗 Tesla is driving"
                </motion.div>
            )}
        </div>
    );
};

const InheritanceVisual = ({ step, data }: any) => {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-8">
            <div className="relative flex flex-col gap-12">
                {/* Animal Class */}
                <motion.div
                    animate={{ scale: step === 3 ? 1.05 : 1, opacity: step >= 0 ? 1 : 0.4 }}
                    className={`w-40 p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${step === 0 || (step === 3 && data.found) ? 'border-green-400 bg-green-400/10' : 'border-slate-800 bg-slate-900'}`}
                >
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Base Class</div>
                    <span className="font-bold">Animal</span>
                    <div className="text-[10px] bg-slate-950 px-2 py-1 rounded text-green-300">.eat()</div>
                </motion.div>

                {/* Connection Line */}
                <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-0.5 h-12 bg-slate-800 overflow-hidden">
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: step >= 1 ? '100%' : 0 }}
                        className="w-full bg-blue-400 shadow-[0_0_10px_#60a5fa]"
                    />
                </div>

                {/* Dog Class */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: step >= 1 ? 0 : 20, opacity: step >= 1 ? 1 : 0, scale: step === 3 ? 1.05 : 1 }}
                    className={`w-40 p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${step === 1 ? 'border-blue-400 bg-blue-400/10' : 'border-slate-800 bg-slate-900'}`}
                >
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Child Class</div>
                    <span className="font-bold">Dog</span>
                    <div className="text-[10px] bg-slate-950 px-2 py-1 rounded text-blue-300">.bark()</div>
                </motion.div>

                {/* Inherited lookup arrow animation */}
                {step === 3 && (
                    <motion.div
                        initial={{ y: 150 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute left-1/2 -ml-2 text-orange-400"
                    >
                        <ChevronLeft size={16} className="rotate-90" strokeWidth={4} />
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-orange-500/20 border border-orange-500/50 p-3 rounded-xl flex items-center gap-3"
                    >
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                        <span className="text-xs font-bold text-orange-400">FOLLOWING PROTOTYPE CHAIN...</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const EncapsulationVisual = ({ step, data }: any) => {
    return (
        <div className="flex flex-col items-center gap-12">
            <div className="relative">
                {/* Vault Visual */}
                <motion.div
                    animate={{
                        rotate: step === 1 ? [0, 5, -5, 0] : 0,
                        scale: step === 2 ? 0.95 : 1
                    }}
                    className={`w-64 h-64 rounded-full border-8 border-slate-800 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${step === 2 ? 'border-red-500/50 bg-red-500/5' : 'bg-slate-900 shadow-2xl'}`}
                >
                    {/* Inner Core (Private) */}
                    <motion.div
                        animate={{
                            backgroundColor: step === 1 ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                            borderColor: step === 1 ? '#3b82f6' : '#334155'
                        }}
                        className="w-32 h-32 rounded-full border-4 border-dashed flex flex-col items-center justify-center relative z-10"
                    >
                        <Shield className={step === 2 ? 'text-red-400' : 'text-slate-600'} size={40} />
                        <div className="text-[10px] font-bold text-slate-500 uppercase mt-2">#balance</div>
                        <div className="font-mono text-lg font-bold text-blue-400">
                            {step >= 1 ? '$100' : '$0'}
                        </div>
                    </motion.div>

                    {/* Outer Ring (Public Interface) */}
                    <div className="absolute inset-0 border-r-4 border-slate-700/50 border-double rotate-45 pointer-events-none" />
                    <div className="absolute inset-0 border-l-4 border-slate-700/50 border-double -rotate-45 pointer-events-none" />
                </motion.div>

                {/* Laser Pointer (External Access) */}
                {step === 2 && (
                    <>
                        <motion.div
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 100, opacity: 1 }}
                            className="absolute top-1/2 right-0 w-32 h-0.5 bg-red-500 shadow-[0_0_15px_red] z-20"
                        />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute -right-40 top-1/2 -translate-y-1/2 bg-red-500/20 border border-red-500 rounded px-3 py-1 text-red-400 font-bold text-xs"
                        >
                            ACCESS BLOCKED 🚫
                        </motion.div>
                    </>
                )}
            </div>

            <div className="text-center">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Security Status</div>
                <div className={`px-4 py-2 rounded-full border text-sm font-bold ${step === 2 ? 'bg-red-500/10 border-red-500 text-red-400' : 'bg-green-500/10 border-green-500 text-green-400'}`}>
                    {step === 2 ? 'Private Field Security Check Failed' : 'Data Safely Encapsulated'}
                </div>
            </div>
        </div>
    );
};

const PolymorphismVisual = ({ step, data }: any) => {
    return (
        <div className="flex flex-col items-center gap-16">
            <div className="flex gap-12 items-end h-40">
                {/* Generic Shape */}
                <div className="flex flex-col items-center gap-4 opacity-40">
                    <Box size={40} />
                    <div className="text-[10px] font-bold uppercase tracking-widest">Base Shape</div>
                </div>

                <ChevronRight className="mb-10 text-slate-800" />

                {/* Circle */}
                <motion.div
                    animate={{
                        scale: step === 2 ? 1.2 : 1,
                        opacity: step >= 1 ? 1 : 0.4,
                        y: step === 2 ? -10 : 0
                    }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${step === 2 ? 'border-orange-500 bg-orange-500/10' : 'border-slate-800'}`}>
                        <div className="text-3xl">⚪</div>
                    </div>
                    <div className="text-xs font-bold font-mono">Circle.draw()</div>
                </motion.div>

                {/* Square */}
                <motion.div
                    animate={{
                        scale: step === 2 ? 1.2 : 1,
                        opacity: step >= 1 ? 1 : 0.4,
                        y: step === 2 ? -10 : 0
                    }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className={`w-20 h-20 rounded-xl border-4 flex items-center justify-center ${step === 2 ? 'border-orange-500 bg-orange-500/10' : 'border-slate-800'}`}>
                        <div className="text-3xl">⬛</div>
                    </div>
                    <div className="text-xs font-bold font-mono">Square.draw()</div>
                </motion.div>
            </div>

            {step === 2 && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex items-center gap-6"
                >
                    <div className="p-3 bg-orange-500/20 rounded-2xl">
                        <Hexagon className="text-orange-400" size={32} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-white mb-1 uppercase tracking-wider">Dynamic Dispatch</div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            One interface (draw), many behaviors. The correct method is selected at <span className="text-blue-400 italic font-bold">Runtime</span> based on the object's class.
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const AbstractionVisual = ({ step, data }: any) => {
    return (
        <div className="flex flex-col items-center gap-12">
            <div className="relative w-full max-w-md aspect-video bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center">
                {/* Internal Complexity (Blurred) */}
                <motion.div
                    animate={{
                        opacity: step === 2 ? 0.1 : 0.4,
                        filter: step === 2 ? 'blur(8px)' : 'blur(2px)'
                    }}
                    className="absolute inset-0 p-8 grid grid-cols-3 gap-4"
                >
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="bg-slate-800 rounded-lg animate-pulse" />
                    ))}
                </motion.div>

                {/* The "Interface" (Front & Center) */}
                <motion.div
                    animate={{
                        scale: step === 2 ? 1.1 : 1,
                        borderColor: step === 2 ? '#ec4899' : '#334155'
                    }}
                    className="relative z-10 p-8 bg-slate-950/80 border-2 rounded-2xl shadow-xl flex flex-col items-center gap-4"
                >
                    <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center border-2 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                        <Cpu className="text-pink-400" size={32} />
                    </div>
                    <div className="text-lg font-bold text-white tracking-widest uppercase">Coffee Machine</div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${step === 2 ? 'bg-pink-600 text-white shadow-[0_0_15px_pink]' : 'bg-slate-800 text-slate-400'}`}
                    >
                        {step === 2 ? 'COFFEE READY ☕' : 'PRESS START'}
                    </motion.button>
                </motion.div>

                {/* Labels */}
                <div className="absolute top-4 left-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Interface Area</div>
                <div className="absolute bottom-4 right-6 text-[10px] font-bold text-slate-700 uppercase tracking-widest">Complex Reality (Hidden)</div>
            </div>

            <div className="max-w-sm text-center">
                <p className="text-xs text-slate-400 leading-relaxed italic">
                    "The user only cares about the 'makeCoffee' button. The complex details of grinding and heating are hidden behind the wall of abstraction."
                </p>
            </div>
        </div>
    );
};

export default OOPSVisualizer;
