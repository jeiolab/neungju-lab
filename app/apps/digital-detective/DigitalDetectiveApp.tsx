'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ConceptTab from './components/ConceptTab';
import SimulationTab from './components/SimulationTab';
import MoreInfoTab from './components/MoreInfoTab';
import QuizTab from './components/QuizTab';
import DebateTab from './components/DebateTab';
import { TabId } from './types';
import { Book, Gamepad2, Info, CheckSquare, MessageCircle } from 'lucide-react';

const DigitalDetectiveApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('simulation');

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'concept', label: '개념 설명', icon: <Book className="w-4 h-4" /> },
    { id: 'simulation', label: '사건 해결', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'quiz', label: '팩트체크 퀴즈', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'debate', label: '토론장', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'more-info', label: '더 알아보기', icon: <Info className="w-4 h-4" /> },
  ];

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
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">디지털 탐정: 진실을 찾아라</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">디지털 리터러시 함양을 위한 인터랙티브 탐정 시뮬레이션 게임. 가짜 뉴스, 저작권, 사이버 윤리를 흥미로운 사건 해결 과정을 통해 학습합니다.</p>
                </div>
              </div>
            </div>
          </header>

          <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Tab Navigation */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-6">
              <nav className="flex space-x-1 overflow-x-auto no-scrollbar items-center justify-center h-[60px] py-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/10'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}>
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in pb-12">
              {activeTab === 'concept' && <ConceptTab />}
              {activeTab === 'simulation' && <SimulationTab />}
              {activeTab === 'quiz' && <QuizTab />}
              {activeTab === 'debate' && <DebateTab />}
              {activeTab === 'more-info' && <MoreInfoTab />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DigitalDetectiveApp;

