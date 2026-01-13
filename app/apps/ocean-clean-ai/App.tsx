import React, { useState } from 'react';
import Header from './components/Header';
import TabSocial from './components/TabSocial';
import TabAILab from './components/TabAILab';
import TabDebate from './components/TabDebate';
import { AppState, Badge } from './types';
import { LayoutDashboard, Beaker, MessageCircle } from 'lucide-react';

const INITIAL_BADGES: Badge[] = [
  { id: 'env_guardian', name: '환경 지킴이', description: '바다 100m² 정화', icon: '🛡️', unlocked: false },
  { id: 'tech_pioneer', name: '기술 선구자', description: '정확도 80% 이상 모델 학습', icon: '🦾', unlocked: false },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'social' | 'lab' | 'debate'>('social');
  const [appState, setAppState] = useState<AppState>({
    cleanedArea: 0,
    badges: INITIAL_BADGES,
  });

  const handleScoreUpdate = (points: number) => {
    setAppState(prev => {
      const newArea = prev.cleanedArea + points;
      let newBadges = [...prev.badges];
      
      // Check Badge Logic
      if (newArea >= 100 && !newBadges.find(b => b.id === 'env_guardian')?.unlocked) {
        newBadges = newBadges.map(b => b.id === 'env_guardian' ? { ...b, unlocked: true } : b);
      }

      return { ...prev, cleanedArea: newArea, badges: newBadges };
    });
  };

  const handleBadgeUnlock = (badgeId: string) => {
    setAppState(prev => ({
        ...prev,
        badges: prev.badges.map(b => b.id === badgeId ? { ...b, unlocked: true } : b)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header cleanedArea={appState.cleanedArea} badges={appState.badges} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
            <button 
              onClick={() => setActiveTab('social')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'social' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> 사회 문제
            </button>
            <button 
              onClick={() => setActiveTab('lab')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'lab' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Beaker className="w-4 h-4" /> AI 설계실
            </button>
            <button 
              onClick={() => setActiveTab('debate')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'debate' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <MessageCircle className="w-4 h-4" /> 배틀 토론
            </button>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="min-h-[600px]">
          {activeTab === 'social' && <TabSocial />}
          {activeTab === 'lab' && (
            <TabAILab 
                onScoreUpdate={handleScoreUpdate} 
                onBadgeUnlock={handleBadgeUnlock} 
            />
          )}
          {activeTab === 'debate' && <TabDebate />}
        </div>
      </main>
    </div>
  );
}