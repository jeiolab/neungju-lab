'use client'

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { TheoryTab } from './components/TheoryTab';
import { SimulationTab } from './components/SimulationTab';
import { EfficiencyTab } from './components/EfficiencyTab';
import { QuizTab } from './components/QuizTab';
import { ReflectionTab } from './components/ReflectionTab';
import { Tab } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.THEORY);
  const [totalScore, setTotalScore] = useState(0);

  const handleScoreUpdate = (points: number) => {
    setTotalScore(prev => prev + points);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />
      
      <main className="flex-1 overflow-y-auto">
        <div className="py-6">
          {currentTab === Tab.THEORY && <TheoryTab />}
          {currentTab === Tab.SIMULATION && <SimulationTab onScoreUpdate={handleScoreUpdate} />}
          {currentTab === Tab.EFFICIENCY && <EfficiencyTab />}
          {currentTab === Tab.QUIZ && <QuizTab />}
          {currentTab === Tab.REFLECTION && <ReflectionTab />}
        </div>
      </main>

      {/* Floating Strategy Score (Global) */}
      <div className="fixed bottom-6 right-6 bg-slate-900/90 backdrop-blur text-white px-4 py-3 rounded-full shadow-lg border border-slate-700 z-40 hidden md:flex items-center gap-3">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">총 전략 점수</span>
        <span className="text-xl font-bold text-indigo-400">{totalScore}</span>
      </div>
    </div>
  );
}