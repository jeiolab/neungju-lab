import React, { useState, useEffect } from 'react';
import { UserStats } from './types';
import { getStats } from './services/storageService';
import ConceptTab from './components/ConceptTab';
import GameTab from './components/GameTab';
import AdvancedTab from './components/AdvancedTab';
import QuizTab from './components/QuizTab';
import EssayTab from './components/EssayTab';
import { BookOpen, Gamepad2, Microscope, PenTool, CheckSquare, Award, Flame } from 'lucide-react';

const App: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(getStats());
  const [activeTab, setActiveTab] = useState<string>('concept');

  // Stats display helper
  const StatBadge = ({ icon: Icon, value, color }: { icon: any, value: string | number, color: string }) => (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 shadow-sm border border-gray-100 text-xs font-bold ${color}`}>
      <Icon className="w-4 h-4" />
      <span>{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
              CS
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-none">편의점 로직 게임</h1>
              <span className="text-xs text-gray-500">할인 판별 알고리즘</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <StatBadge icon={Award} value={`${stats.points} Pt`} color="text-blue-600" />
            <StatBadge icon={Flame} value={stats.streak} color="text-orange-500" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Navigation */}
        <nav className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
          {[
            { id: 'concept', label: '개념 학습', icon: BookOpen },
            { id: 'game', label: '실전 게임', icon: Gamepad2 },
            { id: 'advanced', label: '심화 연구', icon: Microscope },
            { id: 'quiz', label: '퀴즈', icon: CheckSquare },
            { id: 'essay', label: '생각하기', icon: PenTool },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-md scale-105' 
                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'concept' && <ConceptTab />}
          {activeTab === 'game' && <GameTab stats={stats} onStatsUpdate={setStats} />}
          {activeTab === 'advanced' && <AdvancedTab />}
          {activeTab === 'quiz' && <QuizTab stats={stats} onStatsUpdate={setStats} />}
          {activeTab === 'essay' && <EssayTab />}
        </div>
      </main>

    </div>
  );
};

export default App;