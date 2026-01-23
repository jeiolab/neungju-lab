import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppStep, FrequencyMap, HuffmanNode } from './types';
import { getFrequency } from './utils/huffmanLogic';
import InputStage from './views/InputStage';
import FrequencyStage from './views/FrequencyStage';
import TreeStage from './views/TreeStage';
import ResultStage from './views/ResultStage';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('INPUT');
  const [inputText, setInputText] = useState("");
  const [freqMap, setFreqMap] = useState<FrequencyMap>({});
  const [finalRoot, setFinalRoot] = useState<HuffmanNode | null>(null);

  const handleInputSubmit = (text: string) => {
    setInputText(text);
    setFreqMap(getFrequency(text));
    setStep('FREQUENCY');
  };

  const handleTreeComplete = (root: HuffmanNode) => {
    setFinalRoot(root);
    setStep('RESULT');
  };

  const resetApp = () => {
    setStep('INPUT');
    setInputText("");
    setFreqMap({});
    setFinalRoot(null);
  };

  return (
    <div className="min-h-screen bg-green-50 selection:bg-amber-200 selection:text-amber-900 overflow-x-hidden">
      {/* Header */}
      <header className="p-4 md:p-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌲</span>
          <h1 className="text-2xl md:text-3xl font-bold text-green-900 tracking-tight">
            신비한 허프만 숲
          </h1>
        </div>
        <div className="hidden md:flex gap-2">
           {['입력', '분석', '나무 심기', '결과'].map((label, idx) => {
             const stepIdx = ['INPUT', 'FREQUENCY', 'TREE_BUILD', 'RESULT'].indexOf(step);
             return (
               <div key={label} className={`px-3 py-1 rounded-full text-sm font-bold ${idx === stepIdx ? 'bg-green-600 text-white' : 'text-green-400'}`}>
                 {idx + 1}. {label}
               </div>
             );
           })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-col items-center justify-center p-4 md:p-8 min-h-[calc(100vh-100px)]">
        <AnimatePresence mode="wait">
          {step === 'INPUT' && (
            <motion.div key="input" exit={{ opacity: 0, scale: 0.9 }} className="w-full flex justify-center">
              <InputStage onSubmit={handleInputSubmit} />
            </motion.div>
          )}

          {step === 'FREQUENCY' && (
            <motion.div key="freq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center">
              <FrequencyStage 
                text={inputText} 
                freqMap={freqMap} 
                onNext={() => setStep('TREE_BUILD')}
                onBack={resetApp}
              />
            </motion.div>
          )}

          {step === 'TREE_BUILD' && (
            <motion.div key="tree" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center h-full">
              <TreeStage 
                freqMap={freqMap} 
                onComplete={handleTreeComplete} 
              />
            </motion.div>
          )}

          {step === 'RESULT' && finalRoot && (
            <motion.div key="result" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="w-full flex justify-center">
              <ResultStage 
                root={finalRoot} 
                originalText={inputText} 
                onReset={resetApp}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;