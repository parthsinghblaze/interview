import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Edit3, Zap } from 'lucide-react';

const FactorsVisualizer = () => {
  // Initial number to check
  const [inputNumber, setInputNumber] = useState(24);
  const [isEditing, setIsEditing] = useState(false);
  const [tempInput, setTempInput] = useState('24');
  const [useOptimized, setUseOptimized] = useState(true);

  // Generate steps for the current number
  const generateSteps = (num, optimized = true) => {
    const steps = [
      {
        description: `Finding all factors of ${num}`,
        stage: 'init',
        number: num,
        currentDivisor: null,
        factors: [],
        checking: null,
        isDivisible: null,
        remainder: null,
        limit: optimized ? Math.sqrt(num) : num,
        jsLine: 0,
        pyLine: 0,
        optimized: optimized
      }
    ];

    if (optimized) {
      steps.push({
        description: `Optimization: Check divisors from 1 to √${num} ≈ ${Math.floor(Math.sqrt(num))}`,
        stage: 'optimize',
        number: num,
        currentDivisor: null,
        factors: [],
        checking: null,
        isDivisible: null,
        remainder: null,
        limit: Math.sqrt(num),
        jsLine: 2,
        pyLine: 2,
        optimized: optimized
      });
    }

    const factors = [];
    const limit = optimized ? Math.sqrt(num) : num;

    for (let i = 1; i <= limit; i++) {
      const remainder = num % i;
      const isDivisible = remainder === 0;

      // Step: Checking divisor
      steps.push({
        description: `Check if ${i} divides ${num}`,
        stage: 'checking',
        number: num,
        currentDivisor: i,
        factors: [...factors],
        checking: i,
        isDivisible: null,
        remainder: null,
        limit: limit,
        jsLine: 3,
        pyLine: 3,
        optimized: optimized
      });

      // Step: Division result
      steps.push({
        description: `${num} ÷ ${i} = ${Math.floor(num / i)} remainder ${remainder}`,
        stage: 'dividing',
        number: num,
        currentDivisor: i,
        factors: [...factors],
        checking: i,
        isDivisible: isDivisible,
        remainder: remainder,
        quotient: Math.floor(num / i),
        limit: limit,
        jsLine: 3,
        pyLine: 3,
        optimized: optimized
      });

      if (isDivisible) {
        if (optimized) {
          // Add both factors
          const pair = num / i;
          if (i === pair) {
            factors.push(i);
            steps.push({
              description: `${i} is a factor! (${i} × ${i} = ${num})`,
              stage: 'found',
              number: num,
              currentDivisor: i,
              factors: [...factors],
              checking: i,
              isDivisible: true,
              remainder: 0,
              quotient: pair,
              newFactor: i,
              limit: limit,
              jsLine: 4,
              pyLine: 4,
              optimized: optimized
            });
          } else {
            factors.push(i);
            factors.push(pair);
            factors.sort((a, b) => a - b);
            steps.push({
              description: `Found factor pair: ${i} and ${pair} (${i} × ${pair} = ${num})`,
              stage: 'found',
              number: num,
              currentDivisor: i,
              factors: [...factors],
              checking: i,
              isDivisible: true,
              remainder: 0,
              quotient: pair,
              newFactor: i,
              newPair: pair,
              limit: limit,
              jsLine: 4,
              pyLine: 4,
              optimized: optimized
            });
          }
        } else {
          factors.push(i);
          steps.push({
            description: `${i} is a factor!`,
            stage: 'found',
            number: num,
            currentDivisor: i,
            factors: [...factors],
            checking: i,
            isDivisible: true,
            remainder: 0,
            quotient: num / i,
            newFactor: i,
            limit: limit,
            jsLine: 4,
            pyLine: 4,
            optimized: optimized
          });
        }
      } else {
        steps.push({
          description: `${i} is not a factor (remainder = ${remainder})`,
          stage: 'not_found',
          number: num,
          currentDivisor: i,
          factors: [...factors],
          checking: i,
          isDivisible: false,
          remainder: remainder,
          limit: limit,
          jsLine: 3,
          pyLine: 3,
          optimized: optimized
        });
      }
    }

    // Final result
    steps.push({
      description: `Complete! Found ${factors.length} factor${factors.length !== 1 ? 's' : ''}: [${factors.join(', ')}]`,
      stage: 'result',
      number: num,
      currentDivisor: null,
      factors: factors,
      checking: null,
      isDivisible: null,
      remainder: null,
      completed: true,
      limit: limit,
      jsLine: 6,
      pyLine: 6,
      optimized: optimized
    });

    return steps;
  };

  const [steps, setSteps] = useState(generateSteps(inputNumber, useOptimized));
  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState('javascript');

  const currentStepData = steps[currentStep];

  // JavaScript code - Optimized
  const jsCodeOptimized = [
    "function findFactors(num) {",
    "  const factors = [];",
    "  const limit = Math.sqrt(num);",
    "  for (let i = 1; i <= limit; i++) {",
    "    if (num % i === 0) {",
    "      factors.push(i);",
    "      if (i !== num / i) {",
    "        factors.push(num / i);",
    "      }",
    "    }",
    "  }",
    "  return factors.sort((a, b) => a - b);",
    "}"
  ];

  // JavaScript code - Simple
  const jsCodeSimple = [
    "function findFactors(num) {",
    "  const factors = [];",
    "  for (let i = 1; i <= num; i++) {",
    "    if (num % i === 0) {",
    "      factors.push(i);",
    "    }",
    "  }",
    "  return factors;",
    "}"
  ];

  // Python code - Optimized
  const pyCodeOptimized = [
    "def find_factors(num):",
    "    factors = []",
    "    limit = int(num ** 0.5)",
    "    for i in range(1, limit + 1):",
    "        if num % i == 0:",
    "            factors.append(i)",
    "            if i != num // i:",
    "                factors.append(num // i)",
    "    return sorted(factors)"
  ];

  // Python code - Simple
  const pyCodeSimple = [
    "def find_factors(num):",
    "    factors = []",
    "    for i in range(1, num + 1):",
    "        if num % i == 0:",
    "            factors.append(i)",
    "    return factors"
  ];

  const getCode = () => {
    if (language === 'javascript') {
      return useOptimized ? jsCodeOptimized : jsCodeSimple;
    } else {
      return useOptimized ? pyCodeOptimized : pyCodeSimple;
    }
  };

  const code = getCode();
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

  const handleNumberChange = () => {
    const newNum = parseInt(tempInput);
    if (!isNaN(newNum) && newNum > 0 && newNum <= 10000) {
      setInputNumber(newNum);
      setSteps(generateSteps(newNum, useOptimized));
      setCurrentStep(0);
      setIsEditing(false);
    }
  };

  const handleOptimizationToggle = () => {
    const newOptimized = !useOptimized;
    setUseOptimized(newOptimized);
    setSteps(generateSteps(inputNumber, newOptimized));
    setCurrentStep(0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNumberChange();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Factors Finder</h1>
          <p className="text-blue-300">Visual Step-by-Step Algorithm</p>
          
          {/* Number Input */}
          <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-white border-2 border-blue-500 focus:outline-none focus:border-cyan-500 w-32"
                  autoFocus
                />
                <button
                  onClick={handleNumberChange}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Find
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setTempInput(inputNumber.toString());
                  }}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-white">Number: {inputNumber}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                >
                  <Edit3 size={18} />
                </button>
              </div>
            )}

            {/* Optimization Toggle */}
            <button
              onClick={handleOptimizationToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all transform hover:scale-105 ${
                useOptimized
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
              <Zap size={18} />
              {useOptimized ? 'Optimized O(√n)' : 'Simple O(n)'}
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Visualization */}
          <div className="space-y-6">
            {/* Number Display */}
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Target Number</h2>
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-400 mb-2">
                  {currentStepData.number}
                </div>
                {currentStepData.limit && (
                  <div className="text-sm text-blue-300">
                    {useOptimized 
                      ? `Checking up to √${inputNumber} ≈ ${Math.floor(currentStepData.limit)}`
                      : `Checking from 1 to ${inputNumber}`
                    }
                  </div>
                )}
              </div>
            </div>

            {/* Current Check */}
            {currentStepData.checking !== null && (
              <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-4">Current Check</h2>
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-lg p-4">
                    <div className="text-center mb-3">
                      <span className="text-3xl font-bold text-white">
                        {currentStepData.number}
                      </span>
                      <span className="text-2xl text-blue-300 mx-2">÷</span>
                      <span className="text-3xl font-bold text-yellow-400">
                        {currentStepData.checking}
                      </span>
                    </div>
                    
                    {currentStepData.quotient !== undefined && (
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="bg-slate-800 rounded p-3 text-center">
                          <div className="text-xs text-blue-300 mb-1">Quotient</div>
                          <div className="text-xl font-bold text-white">{currentStepData.quotient}</div>
                        </div>
                        <div className="bg-slate-800 rounded p-3 text-center">
                          <div className="text-xs text-blue-300 mb-1">Remainder</div>
                          <div className={`text-xl font-bold ${
                            currentStepData.remainder === 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {currentStepData.remainder}
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStepData.isDivisible !== null && (
                      <div className={`mt-4 p-3 rounded text-center font-semibold ${
                        currentStepData.isDivisible
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {currentStepData.isDivisible ? '✓ Is a factor!' : '✗ Not a factor'}
                      </div>
                    )}

                    {currentStepData.newPair && (
                      <div className="mt-3 p-3 bg-blue-500/20 rounded text-center">
                        <div className="text-sm text-blue-300 mb-1">Factor Pair Found</div>
                        <div className="text-lg font-bold text-white">
                          {currentStepData.checking} × {currentStepData.newPair} = {currentStepData.number}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Factors Found */}
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4">
                Factors Found ({currentStepData.factors.length})
              </h2>
              
              {currentStepData.factors.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  No factors found yet...
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {currentStepData.factors.map((factor, idx) => (
                    <div
                      key={idx}
                      className={`px-4 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                        factor === currentStepData.newFactor || factor === currentStepData.newPair
                          ? 'bg-green-500 text-white scale-110 shadow-lg shadow-green-500/50'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {factor}
                    </div>
                  ))}
                </div>
              )}

              {currentStepData.factors.length > 0 && (
                <div className="mt-4 p-3 bg-slate-900 rounded">
                  <p className="text-sm text-blue-300">
                    Factors: [{currentStepData.factors.join(', ')}]
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Code & Controls */}
          <div className="space-y-6">
            {/* Code Display */}
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
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
              
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto">
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
              <p className="text-blue-200 text-lg leading-relaxed">{currentStepData.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">Progress</span>
                <span className="text-blue-300">
                  Step {currentStep + 1} / {steps.length}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
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
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg
                    hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95"
                >
                  <RotateCcw size={20} />
                  Reset
                </button>

                <button
                  onClick={handleAutoPlay}
                  disabled={currentStep === steps.length - 1}
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg
                    hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed
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
                  <p className="text-green-400 font-bold text-lg">✓ Algorithm Complete!</p>
                  <p className="text-green-300 text-sm mt-1">
                    Found {currentStepData.factors.length} factor{currentStepData.factors.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info & Examples */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Algorithm Info */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">About Factors</h2>
            <div className="text-blue-200 space-y-2 text-sm">
              <p>
                A <strong>factor</strong> of a number is any integer that divides it evenly (remainder = 0).
              </p>
              <p className="mt-3">
                <strong>Optimization:</strong> We only need to check up to √n because factors come in pairs.
                If a × b = n and a ≤ √n, then b ≥ √n.
              </p>
              <p className="mt-3 font-mono bg-slate-900 p-3 rounded">
                Example: 24 has factors [1, 2, 3, 4, 6, 8, 12, 24]<br/>
                Pairs: (1,24), (2,12), (3,8), (4,6)
              </p>
            </div>
          </div>

          {/* Examples */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Try These Numbers</h2>
            <div className="grid grid-cols-3 gap-3">
              {[12, 24, 36, 48, 60, 100, 144, 200, 999].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setInputNumber(num);
                    setSteps(generateSteps(num, useOptimized));
                    setCurrentStep(0);
                    setTempInput(num.toString());
                  }}
                  className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-blue-600 
                    transition-all transform hover:scale-105 active:scale-95 font-mono"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Complexity */}
        <div className="mt-6 bg-slate-800 rounded-lg p-6 shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Algorithm Complexity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-blue-300 text-sm mb-1">Time (Optimized)</p>
              <p className="text-white font-mono text-xl font-bold">O(√n)</p>
              <p className="text-blue-200 text-xs mt-1">Check up to square root</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-blue-300 text-sm mb-1">Time (Simple)</p>
              <p className="text-white font-mono text-xl font-bold">O(n)</p>
              <p className="text-blue-200 text-xs mt-1">Check all numbers</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-blue-300 text-sm mb-1">Space Complexity</p>
              <p className="text-white font-mono text-xl font-bold">O(k)</p>
              <p className="text-blue-200 text-xs mt-1">k = number of factors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactorsVisualizer;
