'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { ConceptView } from './components/ConceptView';
import { SimulationView } from './components/SimulationView';
import { LearnMoreView } from './components/LearnMoreView';
import { QuizView } from './components/QuizView';
import { ThinkView } from './components/ThinkView';
import { DynamicIcon } from './components/Icons';
import { Tab } from './types';

const InfoProtectionCastleApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CONCEPT);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light">
      <Header />
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-grow">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:p-8">
          {/* Internal Header */}
          <header className="bg-white border-b border-slate-200 mb-0 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white relative shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L15 9L22 10L17 15L18 22L12 19L6 22L7 15L2 10L9 9L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 text-[8px]">+</span>
                  <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-white rounded-full"></span>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">정보 보호의 성</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">성 방어 비유를 통해 CIA 삼각형(기밀성, 무결성, 가용성)을 학습하는 인터랙티브 교육 앱입니다.</p>
                </div>
              </div>
            </div>
          </header>

          <div className="min-h-screen bg-slate-50">
            {/* Navigation Only - Title removed to avoid duplication */}
            <div className="bg-white shadow-sm sticky top-0 z-50 mb-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar items-center justify-center h-[60px] py-2">
                  {[
                    { id: Tab.CONCEPT, label: '이론 개념', icon: 'BookOpen' },
                    { id: Tab.SIMULATION, label: '성 지키기 (게임)', icon: 'Sword' },
                    { id: Tab.LEARN_MORE, label: '더 알아보기', icon: 'Shield' },
                    { id: Tab.QUIZ, label: '퀴즈', icon: 'CheckCircle' },
                    { id: Tab.THINK, label: '생각해보기', icon: 'BrainCircuit' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                        ${activeTab === tab.id 
                          ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/10' 
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      <DynamicIcon name={tab.icon} className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {activeTab === Tab.CONCEPT && <ConceptView />}
              {activeTab === Tab.SIMULATION && <SimulationView onNavigate={setActiveTab} />}
              {activeTab === Tab.LEARN_MORE && <LearnMoreView />}
              {activeTab === Tab.QUIZ && <QuizView />}
              {activeTab === Tab.THINK && <ThinkView />}
            </main>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InfoProtectionCastleApp;

