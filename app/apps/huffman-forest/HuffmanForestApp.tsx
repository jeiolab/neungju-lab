'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppStep, FrequencyMap, HuffmanNode } from './types';
import { getFrequency } from './utils/huffmanLogic';
import InputStage from './views/InputStage';
import FrequencyStage from './views/FrequencyStage';
import TreeStage from './views/TreeStage';
import ResultStage from './views/ResultStage';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const HuffmanForestApp: React.FC = () => {
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
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
          {/* Internal Header */}
          <header className="p-4 md:p-6 flex items-center justify-between mb-6 -mx-6 -mt-6 px-6 pt-6 border-b border-slate-200">
            <button 
              onClick={resetApp} 
              className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">허프만 코딩</h1>
                <p className="text-sm text-slate-500 leading-tight mt-0.5">신비한 숲 테마로 허프만 코딩을 시각화를 통해 배우는 게임화된 교육 앱입니다.</p>
              </div>
            </button>
            <div className="hidden md:flex gap-2">
               {['입력', '분석', '나무 심기', '결과'].map((label, idx) => {
                 const stepIdx = ['INPUT', 'FREQUENCY', 'TREE_BUILD', 'RESULT'].indexOf(step);
                 return (
                   <div key={label} className={`px-3 py-1 rounded-full text-sm font-bold ${idx === stepIdx ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600'}`}>
                     {idx + 1}. {label}
                   </div>
                 );
               })}
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex flex-col items-center justify-center p-4 md:p-8 min-h-[calc(100vh-300px)]">
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HuffmanForestApp;

