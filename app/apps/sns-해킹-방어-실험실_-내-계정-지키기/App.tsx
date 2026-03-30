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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">SNS 방어 실험실</h1>
              <p className="text-xs text-slate-500 hidden sm:block">내 계정 지키기 프로젝트</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-orange-600">{progress.streak}일</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-slate-200 bg-white overflow-x-auto">
          <div className="max-w-6xl mx-auto px-4 flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Main Content */}
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
    </div>
  );
}

export default App;