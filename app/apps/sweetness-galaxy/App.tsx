import React, { useState } from 'react';
import { LayoutDashboard, Beaker, GraduationCap, Telescope, Award } from 'lucide-react';
import TheoryTab from './components/TheoryTab';
import LabFruit from './components/LabFruit';
import LabCity from './components/LabCity';
import QuizTab from './components/QuizTab';
import GalaxyDex from './components/GalaxyDex';
import { AppTab, LabMode } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.THEORY);
  const [labMode, setLabMode] = useState<LabMode>(LabMode.FRUIT);
  const [badgeEarned, setBadgeEarned] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight hidden sm:block">
              당도와 은하의 비밀
            </h1>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight sm:hidden">
              Sweetness & Galaxy
            </h1>
          </div>
          
          {badgeEarned && (
            <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold animate-bounce-short">
              <Award className="w-4 h-4" />
              <span>데이터 마스터</span>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Menu */}
      <div className="max-w-4xl mx-auto px-4 border-t border-slate-200">
        <div className="flex justify-around items-center py-2">
          <button 
            onClick={() => setActiveTab(AppTab.THEORY)}
            className={`flex flex-col items-center py-2 px-2 flex-1 transition-colors ${activeTab === AppTab.THEORY ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <GraduationCap className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">이론</span>
          </button>
          
          <button 
            onClick={() => setActiveTab(AppTab.LAB)}
            className={`flex flex-col items-center py-2 px-2 flex-1 transition-colors ${activeTab === AppTab.LAB ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <Beaker className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">실험실</span>
          </button>
          
          <button 
            onClick={() => setActiveTab(AppTab.QUIZ)}
            className={`flex flex-col items-center py-2 px-2 flex-1 transition-colors ${activeTab === AppTab.QUIZ ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">퀴즈</span>
          </button>
          
          <button 
            onClick={() => setActiveTab(AppTab.GALAXY)}
            className={`flex flex-col items-center py-2 px-2 flex-1 transition-colors ${activeTab === AppTab.GALAXY ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <Telescope className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-medium">은하</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto pt-6">
        {activeTab === AppTab.THEORY && <TheoryTab />}
        
        {activeTab === AppTab.LAB && (
          <div className="space-y-6 px-4 animate-fadeIn">
            {/* Lab Switcher */}
            <div className="flex p-1 bg-slate-200 rounded-xl mb-6">
              <button
                onClick={() => setLabMode(LabMode.FRUIT)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  labMode === LabMode.FRUIT ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                🍎 과일 분류기
              </button>
              <button
                onClick={() => setLabMode(LabMode.CITY)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  labMode === LabMode.CITY ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                🏙️ 도시 계획
              </button>
            </div>
            
            {labMode === LabMode.FRUIT ? <LabFruit /> : <LabCity />}
          </div>
        )}

        {activeTab === AppTab.QUIZ && <QuizTab onBadgeEarned={() => setBadgeEarned(true)} />}
        
        {activeTab === AppTab.GALAXY && <GalaxyDex />}
      </main>

      {/* Tailwind Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-short {
          animation: bounce-short 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default App;