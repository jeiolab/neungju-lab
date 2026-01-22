import React, { useState } from 'react';
import { Tab } from './types';
import { CaesarTab } from './components/CaesarTab';
import { ScytaleTab } from './components/ScytaleTab';
import { QuizTab } from './components/QuizTab';
import { EducationTab } from './components/EducationTab';
import { Scroll, KeyRound, BrainCircuit, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CAESAR);

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-stone-800 font-sans selection:bg-amber-200">
      {/* Header */}
      <header className="bg-stone-900 text-amber-50 shadow-lg border-b-4 border-amber-600 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-600 p-2 rounded-lg shadow-inner">
               <Scroll className="text-stone-900" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-wide text-amber-500">고전 암호 해독가</h1>
              <p className="text-xs text-stone-400">CLASSICAL CIPHER DECRYPTOR</p>
            </div>
          </div>
          <div className="hidden md:block text-sm text-stone-400 italic font-serif">
             "역사를 잊은 민족에게 보안은 없다." - 역사 탐정
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-stone-200 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab(Tab.CAESAR)}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-200 font-bold ${
              activeTab === Tab.CAESAR 
              ? 'bg-white text-amber-700 shadow-md transform scale-[1.02]' 
              : 'text-stone-500 hover:text-stone-700 hover:bg-stone-300'
            }`}
          >
            <KeyRound size={18} className="mr-2" /> 카이사르 (Caesar)
          </button>
          
          <button
            onClick={() => setActiveTab(Tab.SCYTALE)}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-200 font-bold ${
              activeTab === Tab.SCYTALE 
              ? 'bg-white text-amber-700 shadow-md transform scale-[1.02]' 
              : 'text-stone-500 hover:text-stone-700 hover:bg-stone-300'
            }`}
          >
            <Scroll size={18} className="mr-2" /> 스키테일 (Scytale)
          </button>
          
          <button
            onClick={() => setActiveTab(Tab.QUIZ)}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-200 font-bold ${
              activeTab === Tab.QUIZ 
              ? 'bg-white text-amber-700 shadow-md transform scale-[1.02]' 
              : 'text-stone-500 hover:text-stone-700 hover:bg-stone-300'
            }`}
          >
            <BrainCircuit size={18} className="mr-2" /> 해독 챌린지
          </button>

          <button
            onClick={() => setActiveTab(Tab.ANALYSIS)}
            className={`flex-1 flex items-center justify-center py-3 px-4 rounded-lg transition-all duration-200 font-bold ${
              activeTab === Tab.ANALYSIS 
              ? 'bg-white text-amber-700 shadow-md transform scale-[1.02]' 
              : 'text-stone-500 hover:text-stone-700 hover:bg-stone-300'
            }`}
          >
            <GraduationCap size={18} className="mr-2" /> 원리 & 분석
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === Tab.CAESAR && <CaesarTab />}
          {activeTab === Tab.SCYTALE && <ScytaleTab />}
          {activeTab === Tab.QUIZ && <QuizTab />}
          {activeTab === Tab.ANALYSIS && <EducationTab />}
        </div>

      </main>
    </div>
  );
};

export default App;