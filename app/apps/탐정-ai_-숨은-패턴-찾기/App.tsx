import React, { useState } from 'react';
import { Tab } from './types';
import { TabTheory } from './components/TabTheory';
import { KMeansVisualizer } from './components/KMeansVisualizer';
import { NewsGrouper } from './components/NewsGrouper';
import { TabRealWorld } from './components/TabRealWorld';
import { TabQuiz } from './components/TabQuiz';
import { TabDiscussion } from './components/TabDiscussion';
import { Search, BrainCircuit, PlayCircle, BookOpen, MessageCircle, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY:
        return <TabTheory />;
      case Tab.SIMULATION:
        return (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">데이터 탐정 실습실</h2>
            <KMeansVisualizer />
            <NewsGrouper />
          </div>
        );
      case Tab.REAL_WORLD:
        return <TabRealWorld />;
      case Tab.QUIZ:
        return <TabQuiz />;
      case Tab.DISCUSSION:
        return <TabDiscussion />;
      default:
        return <TabTheory />;
    }
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: Tab; icon: any; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center gap-1 py-3 px-4 rounded-xl transition-all duration-200 ${
        activeTab === tab 
          ? 'bg-blue-600 text-white shadow-md transform scale-105' 
          : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700'
      }`}
    >
      <Icon size={20} />
      <span className="text-xs font-bold">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Search size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">탐정 AI</h1>
              <p className="text-xs text-slate-500 font-medium">숨은 패턴 찾기 (비지도학습)</p>
            </div>
          </div>
          <div className="hidden md:block text-sm text-slate-500">
            데이터 과학 교육 시리즈 Lv.3
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 mb-24">
        {renderContent()}
      </main>

      {/* Bottom Navigation (Mobile Friendly) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-lg bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-2 z-50">
        <div className="grid grid-cols-5 gap-1">
          <NavButton tab={Tab.THEORY} icon={BookOpen} label="개념" />
          <NavButton tab={Tab.SIMULATION} icon={PlayCircle} label="실습" />
          <NavButton tab={Tab.REAL_WORLD} icon={BrainCircuit} label="사례" />
          <NavButton tab={Tab.QUIZ} icon={HelpCircle} label="퀴즈" />
          <NavButton tab={Tab.DISCUSSION} icon={MessageCircle} label="토론" />
        </div>
      </div>
    </div>
  );
};

export default App;