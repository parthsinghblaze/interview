import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Edit3 } from 'lucide-react';

const ArmstrongVisualizer = () => {
  // Initial number to check
  const [inputNumber, setInputNumber] = useState(153);
  const [isEditing, setIsEditing] = useState(false);
  const [tempInput, setTempInput] = useState('153');

  // Generate steps for the current number
  const generateSteps = (num) => {
    const numStr = num.toString();
    const digits = numStr.split('').map(Number);
    const numDigits = digits.length;
    
    const steps = [
      {
        description: `Starting: Check if ${num} is an Armstrong number`,
        stage: 'init',
        number: num,
        digits: [],
        numDigits: 0,
        powers: [],
        sum: 0,
        jsLine: 0,
        pyLine: 0
      },
      {
        description: `Extract digits from ${num}: [${digits.join(', ')}]`,
        stage: 'extract',
        number: num,
        digits: digits,
        numDigits: numDigits,
        powers: [],
        sum: 0,
        highlightDigit: null,
        jsLine: 2,
        pyLine: 2
      },
      {
        description: `Count number of digits: ${numDigits}`,
        stage: 'count',
        number: num,
        digits: digits,
        numDigits: numDigits,
        powers: [],
        sum: 0,
        jsLine: 3,
        pyLine: 3
      }
    ];

    // Add steps for each digit calculation
    let runningSum = 0;
    digits.forEach((digit, idx) => {
      const power = Math.pow(digit, numDigits);
      runningSum += power;
      
      steps.push({
        description: `Calculate ${digit}^${numDigits} = ${power}`,
        stage: 'calculate',
        number: num,
        digits: digits,
        numDigits: numDigits,
        powers: digits.slice(0, idx + 1).map(d => Math.pow(d, numDigits)),
        currentDigit: digit,
        currentPower: power,
        highlightDigit: idx,
        sum: runningSum,
        jsLine: 5,
        pyLine: 5
      });
    });

    // Final comparison
    const isArmstrong = runningSum === num;
    steps.push({
      description: `Sum = ${runningSum}. ${isArmstrong ? `${runningSum} = ${num}. ✓ Armstrong Number!` : `${runningSum} ≠ ${num}. ✗ Not an Armstrong Number`}`,
      stage: 'result',
      number: num,
      digits: digits,
      numDigits: numDigits,
      powers: digits.map(d => Math.pow(d, numDigits)),
      sum: runningSum,
      isArmstrong: isArmstrong,
      completed: true,
      jsLine: 8,
      pyLine: 7
    });

    return steps;
  };

  const [steps, setSteps] = useState(generateSteps(inputNumber));
  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState('javascript');

  const currentStepData = steps[currentStep];

  // JavaScript code
  const jsCode = [
    "function isArmstrong(num) {",
    "  const numStr = num.toString();",
    "  const digits = numStr.split('').map(Number);",
    "  const numDigits = digits.length;",
    "  let sum = 0;",
    "  for (let digit of digits) {",
    "    sum += Math.pow(digit, numDigits);",
    "  }",
    "  return sum === num;",
    "}"
  ];

  // Python code
  const pyCode = [
    "def is_armstrong(num):",
    "    num_str = str(num)",
    "    digits = [int(d) for d in num_str]",
    "    num_digits = len(digits)",
    "    total = 0",
    "    for digit in digits:",
    "        total += digit ** num_digits",
    "    return total == num"
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
    }, 1500);
  };

  const handleNumberChange = () => {
    const newNum = parseInt(tempInput);
    if (!isNaN(newNum) && newNum > 0 && newNum < 1000000) {
      setInputNumber(newNum);
      setSteps(generateSteps(newNum));
      setCurrentStep(0);
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNumberChange();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Armstrong Number Checker</h1>
          <p className="text-purple-300">Visual Step-by-Step Algorithm</p>
          
          {/* Number Input */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-white border-2 border-purple-500 focus:outline-none focus:border-pink-500 w-32"
                  autoFocus
                />
                <button
                  onClick={handleNumberChange}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Check
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
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105"
                >
                  <Edit3 size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Visualization */}
          <div className="space-y-6">
            {/* Number Display */}
            <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-white mb-4">Original Number</h2>
              <div className="text-center">
                <div className="text-6xl font-bold text-purple-400 mb-2">
                  {currentStepData.number}
                </div>
                <div className="text-sm text-purple-300">
                  {currentStepData.numDigits > 0 && `${currentStepData.numDigits} digit${currentStepData.numDigits > 1 ? 's' : ''}`}
                </div>
              </div>
            </div>

            {/* Digits Visualization */}
            {currentStepData.digits.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-4">Digits Breakdown</h2>
                <div className="flex flex-wrap gap-4 justify-center">
                  {currentStepData.digits.map((digit, idx) => (
                    <div
                      key={idx}
                      className={`
                        relative flex flex-col items-center p-4 rounded-lg transition-all duration-300
                        ${idx === currentStepData.highlightDigit
                          ? 'bg-yellow-500 scale-110 shadow-lg shadow-yellow-500/50'
                          : currentStepData.powers[idx] !== undefined
                          ? 'bg-green-600'
                          : 'bg-slate-700'
                        }
                      `}
                    >
                      <span className="text-xs text-white/60 mb-1">Index {idx}</span>
                      <span className="text-3xl font-bold text-white">{digit}</span>
                      {currentStepData.numDigits > 0 && (
                        <span className="text-xs text-white/80 mt-2">
                          {digit}^{currentStepData.numDigits}
                        </span>
                      )}
                      {currentStepData.powers[idx] !== undefined && (
                        <span className="text-sm font-bold text-white mt-1">
                          = {currentStepData.powers[idx]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                {currentStepData.stage === 'calculate' && (
                  <div className="flex gap-4 justify-center mt-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-white">Calculating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-600 rounded"></div>
                      <span className="text-white">Calculated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-slate-700 rounded"></div>
                      <span className="text-white">Pending</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Current Calculation */}
            {currentStepData.stage === 'calculate' && (
              <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-4">Current Calculation</h2>
                <div className="bg-slate-900 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">
                      {currentStepData.currentDigit}^{currentStepData.numDigits} = {currentStepData.currentPower}
                    </div>
                    <div className="text-purple-300 text-sm">
                      Running Sum: {currentStepData.sum}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sum Display */}
            {currentStepData.sum > 0 && (
              <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-4">Sum of Powers</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                    <span className="text-purple-300">Total Sum:</span>
                    <span className="text-white font-mono font-bold text-2xl">{currentStepData.sum}</span>
                  </div>
                  
                  {currentStepData.stage === 'result' && (
                    <div className="flex justify-between items-center p-3 bg-slate-700 rounded">
                      <span className="text-purple-300">Original Number:</span>
                      <span className="text-white font-mono font-bold text-2xl">{currentStepData.number}</span>
                    </div>
                  )}

                  {currentStepData.powers.length > 0 && (
                    <div className="p-3 bg-slate-900 rounded">
                      <p className="text-xs text-purple-300 mb-2">Calculation:</p>
                      <p className="text-white font-mono text-sm break-all">
                        {currentStepData.powers.join(' + ')} = {currentStepData.sum}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
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
              <p className="text-purple-200 text-lg leading-relaxed">{currentStepData.description}</p>
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
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
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
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg
                    hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
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

              {/* Result Badge */}
              {currentStepData.completed && (
                <div className={`mt-4 p-4 rounded-lg text-center border-2 ${
                  currentStepData.isArmstrong
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-red-500/20 border-red-500'
                }`}>
                  <p className={`font-bold text-lg ${
                    currentStepData.isArmstrong ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {currentStepData.isArmstrong ? '✓ Is an Armstrong Number!' : '✗ Not an Armstrong Number'}
                  </p>
                  <p className={`text-sm mt-1 ${
                    currentStepData.isArmstrong ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {currentStepData.sum} {currentStepData.isArmstrong ? '=' : '≠'} {currentStepData.number}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Examples & Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Algorithm Info */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">About Armstrong Numbers</h2>
            <div className="text-purple-200 space-y-2 text-sm">
              <p>
                An <strong>Armstrong number</strong> (narcissistic number) is a number that equals 
                the sum of its digits each raised to the power of the number of digits.
              </p>
              <p className="mt-3 font-mono bg-slate-900 p-3 rounded">
                Example: 153 = 1³ + 5³ + 3³ = 1 + 125 + 27
              </p>
            </div>
          </div>

          {/* Examples */}
          <div className="bg-slate-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Try These Numbers</h2>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 153, 370, 371, 407, 1634, 9474, 123].map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setInputNumber(num);
                    setSteps(generateSteps(num));
                    setCurrentStep(0);
                    setTempInput(num.toString());
                  }}
                  className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-purple-600 
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-purple-300 text-sm mb-1">Time Complexity</p>
              <p className="text-white font-mono text-xl font-bold">O(d)</p>
              <p className="text-purple-200 text-xs mt-1">where d = number of digits</p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-purple-300 text-sm mb-1">Space Complexity</p>
              <p className="text-white font-mono text-xl font-bold">O(d)</p>
              <p className="text-purple-200 text-xs mt-1">for storing digit array</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArmstrongVisualizer;
