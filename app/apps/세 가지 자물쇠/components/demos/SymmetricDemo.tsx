import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Key, Box, ArrowRight, ShieldAlert } from 'lucide-react';
import Character from '../Character';
import { explainConcept } from '../../services/geminiService';

const SymmetricDemo: React.FC = () => {
  const [step, setStep] = useState(0);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExpl, setLoadingExpl] = useState(false);

  const handleNext = () => {
    setStep((prev) => (prev < 4 ? prev + 1 : 0));
    setExplanation(null);
  };

  const getStepTitle = () => {
    switch (step) {
      case 0: return "1. 암호화 준비";
      case 1: return "2. 자물쇠 잠그기";
      case 2: return "3. 열쇠 배달 (위험!)";
      case 3: return "4. 도청 위기";
      case 4: return "5. 수신 및 복호화";
      default: return "";
    }
  };

  const getStepDesc = () => {
    switch (step) {
      case 0: return "Alice가 소중한 물건을 상자에 넣습니다.";
      case 1: return "Alice가 '황금 열쇠'로 상자를 잠급니다. 이 열쇠가 있어야만 열 수 있습니다.";
      case 2: return "Bob이 상자를 열려면 열쇠가 필요합니다. Alice가 열쇠를 보냅니다.";
      case 3: return "경고! 열쇠를 보내는 도중 Hacker가 이를 훔쳐볼 수 있습니다 (키 배송 문제).";
      case 4: return "Bob이 무사히 열쇠를 받았다면 상자를 열 수 있습니다.";
      default: return "";
    }
  };

  const askAI = async () => {
    setLoadingExpl(true);
    const text = await explainConcept("대칭키 암호화의 키 배송 문제", getStepDesc());
    setExplanation(text);
    setLoadingExpl(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full border border-slate-200 relative overflow-hidden min-h-[400px]">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800">{getStepTitle()}</h2>
          <p className="text-slate-600 mt-2">{getStepDesc()}</p>
        </div>

        {/* Animation Stage */}
        <div className="flex justify-between items-center px-8 mt-12 relative h-40">
          {/* Alice Area */}
          <div className="relative z-10">
             <Character type="ALICE" label="Alice" isActive={step === 0 || step === 1} />
          </div>

          {/* Center Stage (Transfer) */}
          <div className="flex-1 relative flex justify-center items-center h-full mx-4">
            
            {/* The Box */}
            <motion.div
              className="absolute z-20 flex flex-col items-center"
              initial={{ x: -200, opacity: 0 }}
              animate={{ 
                x: step === 0 || step === 1 ? -150 : (step >= 2 ? 150 : 0),
                opacity: 1
              }}
              transition={{ duration: 1 }}
            >
              <Box size={64} className="text-amber-700 fill-amber-100" />
              {step >= 1 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
                >
                  <Lock size={20} className="text-red-500" />
                </motion.div>
              )}
            </motion.div>

            {/* The Key */}
            <AnimatePresence>
              {step >= 1 && (
                <motion.div
                  className="absolute z-30 text-yellow-500 drop-shadow-md cursor-grab active:cursor-grabbing"
                  initial={{ x: -150, y: 30 }}
                  animate={{ 
                    x: step === 1 ? -150 : (step === 2 || step === 3 ? 0 : 150),
                    y: step === 3 ? -50 : 30, // Moves up slightly when hacker appears
                    rotate: step === 3 ? 180 : 0
                  }}
                  transition={{ duration: 1.5, type: "spring" }}
                >
                  <Key size={40} fill="currentColor" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hacker */}
            <AnimatePresence>
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute z-0 flex flex-col items-center top-[-20px]"
                >
                  <Character type="HACKER" label="Hacker" className="scale-75 opacity-80" />
                  <div className="mt-2 bg-red-100 text-red-600 px-3 py-1 rounded text-xs font-bold animate-pulse">
                    키 발견!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

             {/* Connection Line */}
             <div className="absolute w-full h-1 bg-slate-100 rounded z-0 top-1/2 transform -translate-y-1/2"></div>
             <motion.div 
                className="absolute h-1 bg-blue-200 rounded z-0 top-1/2 transform -translate-y-1/2 left-0"
                initial={{ width: "0%" }}
                animate={{ width: step >= 4 ? "100%" : (step >= 2 ? "50%" : "0%") }}
                transition={{ duration: 1 }}
             />

          </div>

          {/* Bob Area */}
          <div className="relative z-10">
            <Character type="BOB" label="Bob" isActive={step === 4} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleNext}
          className="bg-slate-800 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-slate-700 active:scale-95 transition-all flex items-center gap-2"
        >
          {step === 4 ? "처음으로" : "다음 단계"} <ArrowRight size={18} />
        </button>

        <button
          onClick={askAI}
          disabled={loadingExpl}
          className="bg-indigo-100 text-indigo-700 px-6 py-3 rounded-full font-bold shadow-sm hover:bg-indigo-200 active:scale-95 transition-all flex items-center gap-2 border border-indigo-200"
        >
          {loadingExpl ? "생각중..." : "AI 선생님 설명듣기"}
        </button>
      </div>

      {/* AI Explanation Area */}
      {explanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-indigo-50 border border-indigo-100 p-6 rounded-xl w-full text-indigo-900 leading-relaxed shadow-sm"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <h4 className="font-bold mb-1">AI 선생님의 한마디:</h4>
              <p>{explanation}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SymmetricDemo;