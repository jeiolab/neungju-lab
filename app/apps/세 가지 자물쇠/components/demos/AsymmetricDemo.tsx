import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, LockOpen, Key, Box, ArrowRight, RefreshCcw } from 'lucide-react';
import Character from '../Character';
import { explainConcept } from '../../services/geminiService';

const AsymmetricDemo: React.FC = () => {
  const [step, setStep] = useState(0);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExpl, setLoadingExpl] = useState(false);

  const handleNext = () => {
    setStep((prev) => (prev < 4 ? prev + 1 : 0));
    setExplanation(null);
  };

  const getStepTitle = () => {
    switch (step) {
      case 0: return "1. 키 쌍 생성";
      case 1: return "2. 공개키 배포";
      case 2: return "3. 공개키로 암호화";
      case 3: return "4. 안전한 전송";
      case 4: return "5. 개인키로 복호화";
      default: return "";
    }
  };

  const getStepDesc = () => {
    switch (step) {
      case 0: return "Bob이 '공개키(초록 자물쇠)'와 '개인키(빨간 열쇠)'를 만듭니다.";
      case 1: return "Bob은 누구나 쓸 수 있게 '공개키'를 세상에 뿌립니다. Alice가 이를 가져옵니다.";
      case 2: return "Alice는 Bob의 공개키로 상자를 잠급니다. 이제 Bob 외에는 아무도 열 수 없습니다.";
      case 3: return "상자가 전송됩니다. Hacker가 가로채도 개인키가 없어서 열 수 없습니다.";
      case 4: return "Bob은 자신만 가진 '개인키'로 상자를 엽니다.";
      default: return "";
    }
  };

  const askAI = async () => {
    setLoadingExpl(true);
    const text = await explainConcept("공개키 암호화 방식", getStepDesc());
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
          <Character type="ALICE" label="Alice" isActive={step === 2} />
          
          <div className="flex-1 relative flex justify-center items-center h-full mx-4">
             {/* Path */}
             <div className="absolute w-full h-1 bg-slate-100 rounded z-0"></div>

             {/* Public Key (Green Lock) Animation */}
             <AnimatePresence>
              {(step >= 1 && step <= 2) && (
                 <motion.div
                  className="absolute z-20 text-green-500"
                  initial={{ x: 150, opacity: 0 }}
                  animate={{ 
                    x: step === 1 ? -150 : -150,
                    opacity: 1,
                    scale: step === 2 ? 0 : 1 // Disappears into box
                  }}
                  transition={{ duration: 1.2, type: 'spring' }}
                 >
                   <div className="flex flex-col items-center">
                    <LockOpen size={32} />
                    <span className="text-xs font-bold mt-1">공개키</span>
                   </div>
                 </motion.div>
              )}
             </AnimatePresence>

             {/* The Box */}
             <motion.div
               className="absolute z-10 flex flex-col items-center"
               initial={{ x: -150, opacity: 0 }}
               animate={{ 
                 x: step <= 2 ? -150 : 150, // Moves to Bob
                 opacity: step >= 1 ? 1 : 0
               }}
               transition={{ duration: 1.5 }}
             >
                <Box size={64} className="text-amber-700 fill-amber-100" />
                {/* Locked State Indicator */}
                {step >= 2 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-green-100 rounded-full p-1 shadow-md border border-green-200"
                  >
                    <Lock size={20} className="text-green-600" />
                  </motion.div>
                )}
             </motion.div>

             {/* Hacker Attempt */}
             <AnimatePresence>
               {step === 3 && (
                 <motion.div
                   className="absolute z-0 top-[-40px]"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0 }}
                 >
                   <Character type="HACKER" label="Hacker" className="scale-75 opacity-50 grayscale" />
                   <div className="mt-1 bg-slate-200 text-slate-600 px-2 py-1 text-xs rounded text-center">
                     열 수 없음
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          <div className="relative">
            <Character type="BOB" label="Bob" isActive={step === 0 || step === 4} />
            {/* Private Key Display */}
            <motion.div 
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-1 text-red-500 text-xs font-bold whitespace-nowrap"
              animate={{ opacity: step === 4 ? 1 : 0.5 }}
            >
              <Key size={14} /> 개인키 보유
            </motion.div>
          </div>
        </div>
      </div>

       {/* Controls */}
       <div className="flex gap-4 mt-6">
        <button
          onClick={handleNext}
          className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-purple-700 active:scale-95 transition-all flex items-center gap-2"
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

export default AsymmetricDemo;