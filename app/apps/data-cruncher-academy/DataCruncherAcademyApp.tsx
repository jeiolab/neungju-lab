'use client'

import React, { useState } from 'react';
import { LEVELS } from './constants';
import { UserProgress } from './types';
import { Simulation } from './components/Simulation';
import { Concepts } from './components/Concepts';
import { Quiz } from './components/Quiz';
import { Medal, BookOpen, FlaskConical, BrainCircuit } from 'lucide-react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const DataCruncherAcademyApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulation' | 'concepts' | 'quiz'>('simulation');
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0,
    level: 1,
    title: LEVELS[0].title,
    completedQuizzes: []
  });

  const updateProgress = (earnedXp: number, quizId?: string) => {
    setProgress(prev => {
      const newXp = prev.xp + earnedXp;
      // Calculate new level based on thresholds
      let newLevel = prev.level;
      let newTitle = prev.title;
      
      for (let i = 0; i < LEVELS.length; i++) {
        if (newXp >= LEVELS[i].threshold) {
          newLevel = i + 1;
          newTitle = LEVELS[i].title;
        }
      }

      const newCompleted = quizId ? [...prev.completedQuizzes, quizId] : prev.completedQuizzes;

      return {
        xp: newXp,
        level: newLevel,
        title: newTitle,
        completedQuizzes: newCompleted
      };
    });
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
          {/* Internal Header */}
          <header className="bg-white border-b border-slate-200 mb-6 pb-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  setActiveTab('simulation');
                  setProgress({
                    xp: 0,
                    level: 1,
                    title: LEVELS[0].title,
                    completedQuizzes: []
                  });
                }} 
                className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                  <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">용량을 줄여라!</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">데이터 압축의 원리를 실시간 시뮬레이션과 게임화된 퀴즈를 통해 배우는 인터랙티브 교육 플랫폼입니다.</p>
                </div>
              </button>
            </div>
          </header>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
              <button
                onClick={() => setActiveTab('simulation')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                  ${activeTab === 'simulation' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <FlaskConical size={16} /> 실습 시뮬레이터
              </button>
              <button
                onClick={() => setActiveTab('concepts')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                  ${activeTab === 'concepts' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <BookOpen size={16} /> 개념 배우기
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                  ${activeTab === 'quiz' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <BrainCircuit size={16} /> 퀴즈 도전
              </button>
            </div>
          </div>

          {/* Dynamic Content */}
          <div className="animate-fade-in-up">
            {activeTab === 'simulation' && (
              <Simulation onTaskComplete={updateProgress} />
            )}
            {activeTab === 'concepts' && (
              <Concepts />
            )}
            {activeTab === 'quiz' && (
              <Quiz 
                onComplete={(xp) => updateProgress(xp, `q-${Date.now()}`)} 
                completedQuizzes={progress.completedQuizzes}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DataCruncherAcademyApp;

