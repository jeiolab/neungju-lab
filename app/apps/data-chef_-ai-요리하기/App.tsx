import React, { useState } from 'react';
import { TabType } from './types';
import { Header } from './components/Header';
import { Glossary } from './components/Glossary';
import { TheoryTab } from './components/tabs/TheoryTab';
import { SimulationTab } from './components/tabs/SimulationTab';
import { DeepDiveTab } from './components/tabs/TabDeepDive';
import { QuizTab } from './components/tabs/TabQuiz';
import { EthicsTab } from './components/tabs/TabEthics';
import { BookOpen, Gamepad2, Brain, HelpCircle, Scale } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('theory');
  const [badgeEarned, setBadgeEarned] = useState(false);
  const [glossaryTerm, setGlossaryTerm] = useState<string | null>(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  const handleOpenGlossary = (term?: string) => {
    setGlossaryTerm(term || null);
    setIsGlossaryOpen(true);
  };

  const handleSimulationComplete = (score: number) => {
    if (score === 100) {
      setBadgeEarned(true);
    }
  };

  const tabs = [
    { id: 'theory', label: '개념 익히기', icon: <BookOpen size={18} /> },
    { id: 'simulation', label: 'AI 요리 실습', icon: <Gamepad2 size={18} /> },
    { id: 'deepdive', label: '더 알아보기', icon: <Brain size={18} /> },
    { id: 'quiz', label: '퀴즈', icon: <HelpCircle size={18} /> },
    { id: 'ethics', label: 'AI 윤리', icon: <Scale size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-amber-50/50 pb-12">
      <Header badgeEarned={badgeEarned} />

      <main className="max-w-6xl mx-auto px-4 mt-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-orange-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[500px]">
          {activeTab === 'theory' && <TheoryTab onTermClick={handleOpenGlossary} />}
          {activeTab === 'simulation' && <SimulationTab onComplete={handleSimulationComplete} />}
          {activeTab === 'deepdive' && <DeepDiveTab />}
          {activeTab === 'quiz' && <QuizTab />}
          {activeTab === 'ethics' && <EthicsTab />}
        </div>
      </main>

      {/* Floating Glossary Button */}
      <button 
        onClick={() => handleOpenGlossary()}
        className="fixed bottom-6 right-6 bg-white border-2 border-orange-500 text-orange-600 p-4 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-all z-30 flex items-center gap-2 font-bold"
      >
        <BookOpen size={20} />
        <span className="hidden sm:inline">용어 사전</span>
      </button>

      {/* Glossary Modal */}
      <Glossary 
        isOpen={isGlossaryOpen} 
        onClose={() => setIsGlossaryOpen(false)} 
        selectedTerm={glossaryTerm} 
      />
    </div>
  );
}