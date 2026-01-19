import React, { useState, useEffect } from 'react';
import { AppTab, ResearchState } from './types';
import { LEVEL_THRESHOLDS } from './constants';
import Header from './components/Header';
import Orange3Guide from './components/Orange3Guide';
import DataLab from './components/DataLab';
import ClimateMachine from './components/ClimateMachine';
import GlossaryModal from './components/GlossaryModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Guide);
  const [showGlossary, setShowGlossary] = useState(false);
  
  // Persisted or simple state for gamification
  const [researchState, setResearchState] = useState<ResearchState>({
    level: 1,
    xp: 0,
    maxXp: 100,
    completedTasks: []
  });

  const [notification, setNotification] = useState<string | null>(null);

  const handleXpGain = (amount: number, message: string) => {
    setResearchState(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let threshold = LEVEL_THRESHOLDS[prev.level];

      // Simple Level Up Logic
      if (newXp >= threshold) {
        newLevel += 1;
        // Keep overflow XP? For simplicity, we just cap or reset, but here let's accumulate.
      }
      
      return {
        ...prev,
        xp: newXp,
        level: newLevel
      };
    });

    setNotification(`+${amount} XP: ${message}`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Render specific tab
  const renderContent = () => {
    switch (activeTab) {
      case AppTab.Guide:
        return <Orange3Guide />;
      case AppTab.DataLab:
        return <DataLab onXpGain={handleXpGain} />;
      case AppTab.Climate:
        return <ClimateMachine onXpGain={handleXpGain} />;
      default:
        return <Orange3Guide />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-sky-200 selection:text-sky-900">
      <Header 
        currentTab={activeTab} 
        setTab={setActiveTab} 
        researchState={researchState}
        onOpenGlossary={() => setShowGlossary(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Page Title & Intro */}
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            {activeTab === AppTab.Guide && "데이터 분석가 가이드"}
            {activeTab === AppTab.DataLab && "펭귄 형태학 연구실"}
            {activeTab === AppTab.Climate && "기후 변화 예측 모델"}
          </h2>
          <p className="text-gray-500 mt-2">
            {activeTab === AppTab.Guide && "현장에 나가기 전에 연구에 필요한 도구 사용법을 익혀보세요."}
            {activeTab === AppTab.DataLab && "KNN 알고리즘을 사용하여 미확인 펭귄의 종을 분류해보세요."}
            {activeTab === AppTab.Climate && "과거 기온 데이터를 분석하고 미래의 지구 기온을 예측해보세요."}
          </p>
        </div>

        {renderContent()}
      </main>

      {/* Glossary Modal */}
      <GlossaryModal isOpen={showGlossary} onClose={() => setShowGlossary(false)} />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-bounce-in z-50">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="font-semibold">{notification}</span>
        </div>
      )}
    </div>
  );
};

export default App;