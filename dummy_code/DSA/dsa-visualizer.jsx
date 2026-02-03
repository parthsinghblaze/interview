import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play } from 'lucide-react';

const DSAVisualizer = () => {
  // Sample array to visualize
  const initialArray = [3, 7, 2, 9, 1, 5, 8, 4];
  
  // Algorithm steps
  const steps = [
    {
      description: "Initialize: Set max to first element",
      currentIndex: 0,
      maxIndex: 0,
      maxValue: initialArray[0],
      comparing: null,
      jsLine: 1,
      pyLine: 1
    },
    ...initialArray.slice(1).map((_, idx) => {
      const actualIdx = idx + 1;
      const prevMax = Math.max(...initialArray.slice(0, actualIdx));
      const prevMaxIdx = initialArray.indexOf(prevMax);
      const currentValue = initialArray[actualIdx];
      
      return {
        description: `Compare arr[${actualIdx}] (${currentValue}) with current max (${prevMax})`,
        currentIndex: actualIdx,
        maxIndex: currentValue > prevMax ? actualIdx : prevMaxIdx,
        maxValue: Math.max(currentValue, prevMax),
        comparing: actualIdx,
        jsLine: currentValue > prevMax ? 3 : 2,
        pyLine: currentValue > prevMax ? 3 : 2
      };
    }),
    {
      description: `Algorithm Complete! Maximum value is ${Math.max(...initialArray)}`,
      currentIndex: initialArray.length - 1,
      maxIndex: initialArray.indexOf(Math.max(...initialArray)),
      maxValue: Math.max(...initialArray),
      comparing: null,
      completed: true,
      jsLine: 5,
      pyLine: 5
    }
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState('javascript');

  const currentStepData = steps[currentStep];

  // JavaScript code
  const jsCode = [
    "function findMax(arr) {",
    "  let max = arr[0];",
    "  for (let i = 1; i < arr.length; i++) {",
    "    if (arr[i] > max) {",
    "      max = arr[i];",
    "    }",
    "  }",
    "  return max;",
    "}"
  ];

  // Python code
  const pyCode = [
    "def find_max(arr):",
    "    max_val = arr[0]",
    "    for i in range(1, len(arr)):",
    "        if arr[i] > max_val:",
    "            max_val = arr[i]",
    "    return max_val"
  ];

  const code = language === 'javascript' ? jsCode : pyCode;
  const currentLine = language === 'javascript' ? currentStepData.jsLine : currentStepData.pyLine;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
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

  const handleAutoPlay = () => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= steps.length) {
        clearInterval(interval);
      } else {
        setCurrentStep(step);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">DSA Visualizer</h1>
          <p className="text-purple-300">Find Maximum Number in Array</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Visualization */}
          <div className="space-y-6">
            {/* Array Visualization */}
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Array Visualization</h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {initialArray.map((value, idx) => (
                  <div
                    key={idx}
                    className={`
                      relative w-16 h-16 flex flex-col items-center justify-center rounded-lg
                      transition-all duration-300 transform
                      ${idx === currentStepData.maxIndex 
                        ? 'bg-green-500 scale-110 shadow-lg shadow-green-500/50' 
                        : idx === currentStepData.comparing 
                        ? 'bg-yellow-500 scale-105 shadow-lg shadow-yellow-500/50' 
                        : idx <= currentStepData.currentIndex
                        ? 'bg-slate-600'
                        : 'bg-slate-700 opacity-50'
                      }
                    `}
                  >
                    <span className="text-xs text-white/60 absolute -top-5">
                      [{idx}]
                    </span>
                    <span className="text-xl font-bold text-white">{value}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex gap-4 justify-center mt-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-white">Current Max</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-white">Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-600 rounded"></div>
                  <span className="text-white">Visited</span>
                </div>
              </div>
            </div>

            {/* Current State Info */}
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Current State</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                  <span className="text-purple-300">Current Index:</span>
                  <span className="text-white font-mono font-bold">{currentStepData.currentIndex}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                  <span className="text-purple-300">Max Value:</span>
                  <span className="text-green-400 font-mono font-bold text-xl">{currentStepData.maxValue}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                  <span className="text-purple-300">Max Index:</span>
                  <span className="text-white font-mono font-bold">{currentStepData.maxIndex}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Code & Controls */}
          <div className="space-y-6">
            {/* Code Display */}
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Code</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('javascript')}
                    className={`px-4 py-2 rounded transition-colors ${
                      language === 'javascript'
                        ? 'bg-yellow-500 text-slate-900'
                        : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                  >
                    JavaScript
                  </button>
                  <button
                    onClick={() => setLanguage('python')}
                    className={`px-4 py-2 rounded transition-colors ${
                      language === 'python'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                  >
                    Python
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                {code.map((line, idx) => (
                  <div
                    key={idx}
                    className={`
                      py-1 px-2 rounded transition-all duration-200
                      ${idx === currentLine 
                        ? 'bg-yellow-500/20 border-l-4 border-yellow-500' 
                        : ''
                      }
                    `}
                  >
                    <span className="text-slate-500 mr-4 select-none">{idx + 1}</span>
                    <span className={idx === currentLine ? 'text-yellow-300' : 'text-slate-300'}>
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Description */}
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Step Description</h2>
              <p className="text-purple-200 text-lg">{currentStepData.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">Progress</span>
                <span className="text-purple-300">
                  Step {currentStep + 1} / {steps.length}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg
                    hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all transform hover:scale-105 active:scale-95"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>
                
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg
                    hover:bg-purple-700 transition-all transform hover:scale-105 active:scale-95"
                >
                  <RotateCcw size={20} />
                  Reset
                </button>

                <button
                  onClick={handleAutoPlay}
                  disabled={currentStep === steps.length - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg
                    hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all transform hover:scale-105 active:scale-95"
                >
                  <Play size={20} />
                  Auto Play
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg
                    hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all transform hover:scale-105 active:scale-95"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Completion Badge */}
              {currentStepData.completed && (
                <div className="mt-4 p-4 bg-green-500/20 border-2 border-green-500 rounded-lg text-center">
                  <p className="text-green-400 font-bold text-lg">✓ Algorithm Completed!</p>
                  <p className="text-green-300 text-sm mt-1">
                    Maximum value found: {currentStepData.maxValue}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Complexity Analysis */}
        <div className="mt-6 bg-slate-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Algorithm Complexity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-purple-300 text-sm mb-1">Time Complexity</p>
              <p className="text-white font-mono text-xl font-bold">O(n)</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-purple-300 text-sm mb-1">Space Complexity</p>
              <p className="text-white font-mono text-xl font-bold">O(1)</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-purple-300 text-sm mb-1">Array Size</p>
              <p className="text-white font-mono text-xl font-bold">{initialArray.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DSAVisualizer;
