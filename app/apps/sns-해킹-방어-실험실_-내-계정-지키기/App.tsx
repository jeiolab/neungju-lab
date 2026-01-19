'use client';

import React, { useState, useEffect } from 'react';
import { TheoryTab } from './components/TheoryTab';
import { SimulationTab } from './components/SimulationTab';
import { ChecklistTab } from './components/ChecklistTab';
import { QuizTab } from './components/QuizTab';
import { ApplicationTab } from './components/ApplicationTab';
import { loadProgress, updateStreak } from './services/storage';
import { UserProgress } from './types';
import { BookOpen, ShieldAlert, CheckSquare, BrainCircuit, Users, Flame } from 'lucide-react';
import clsx from 'clsx';

type Tab = 'THEORY' | 'SIM' | 'CHECK' | 'QUIZ' | 'APP';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('SIM');
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    let p = loadProgress();
    p = updateStreak(p);
    setProgress(p);
  }, []);

  const handleSimComplete = (score: number) => {
      // Could update best score logic here
  };

  const tabs: {id: Tab, label: string, icon: React.ReactNode, desc: string}[] = [
    { id: 'SIM', label: '방어 실험실', icon: <ShieldAlert className="w-5 h-5" />, desc: '다양한 상황에서 보안 위험도를 측정하고 실험합니다.' },
    { id: 'THEORY', label: '개념 연구소', icon: <BookOpen className="w-5 h-5" />, desc: '정보 보호의 핵심 이론과 개념을 학습합니다.' },
    { id: 'CHECK', label: '보안 가이드', icon: <CheckSquare className="w-5 h-5" />, desc: '장소와 상황에 맞는 실천 수칙을 확인합니다.' },
    { id: 'QUIZ', label: '보안 퀴즈', icon: <BrainCircuit className="w-5 h-5" />, desc: '학습한 내용을 바탕으로 퀴즈에 도전하세요.' },
    { id: 'APP', label: '규칙 만들기', icon: <Users className="w-5 h-5" />, desc: '우리 반만의 SNS 사용 규칙을 정해봅니다.' },
  ];

  if (!progress) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 shadow-sm fixed h-full z-30">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-indigo-600" />
            <span>SNS 방어 실험실</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 pl-10">내 계정 지키기 프로젝트</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
           <div className="text-xs font-bold text-slate-400 px-4 py-2 uppercase tracking-wider">Menu</div>
           {tabs.map(tab => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left",
                  activeTab === tab.id 
                    ? "bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
             >
               <div className={clsx("p-1.5 rounded-lg transition-colors", activeTab === tab.id ? "bg-white text-indigo-600" : "bg-slate-100 text-slate-500")}>
                 {tab.icon}
               </div>
               <span>{tab.label}</span>
             </button>
           ))}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
           <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="bg-orange-50 p-2 rounded-full text-orange-500">
                 <Flame className="w-5 h-5" />
              </div>
              <div>
                 <div className="text-xs text-slate-500 font-medium">연속 접속</div>
                 <div className="text-lg font-black text-slate-800 leading-none mt-0.5">{progress.streak}일째</div>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-72 transition-all duration-300">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-indigo-600" />
                <h1 className="text-lg font-extrabold text-slate-900">SNS 방어 실험실</h1>
            </div>
             <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-orange-600">{progress.streak}일</span>
            </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 p-4 md:p-10 bg-slate-50">
          <div className="max-w-6xl mx-auto w-full space-y-6">
             {/* Desktop Page Title */}
             <div className="hidden md:block mb-8 pb-6 border-b border-slate-200">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-slate-500 mt-2 text-lg">
                  {tabs.find(t => t.id === activeTab)?.desc}
                </p>
             </div>

             <div className="animate-fade-in">
                {activeTab === 'THEORY' && <TheoryTab />}
                {activeTab === 'SIM' && <SimulationTab onSimulationComplete={handleSimComplete} />}
                {activeTab === 'CHECK' && <ChecklistTab />}
                {activeTab === 'QUIZ' && <QuizTab />}
                {activeTab === 'APP' && <ApplicationTab />}
             </div>
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden bg-white border-t border-slate-200 h-16 shrink-0 sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
             <div className="flex justify-around items-center h-full">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                            activeTab === tab.id ? "text-indigo-600 bg-indigo-50/50" : "text-slate-400 hover:bg-slate-50"
                        )}
                    >
                        {tab.icon}
                        <span className="text-[10px] font-medium">{tab.label}</span>
                    </button>
                ))}
            </div>
        </nav>
      </div>
    </div>
  );
}

export default App;