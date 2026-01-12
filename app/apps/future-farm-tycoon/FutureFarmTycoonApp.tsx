'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { TabId } from './types';
import ConceptTab from './components/ConceptTab';
import SimulationTab from './components/SimulationTab';
import MoreInfoTab from './components/MoreInfoTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import { BookOpen, Cpu, Gamepad2, Lightbulb, MessageSquare } from 'lucide-react';

const FutureFarmTycoonApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('concept');

  const renderContent = () => {
    switch (activeTab) {
      case 'concept': return <ConceptTab />;
      case 'simulation': return <SimulationTab />;
      case 'more-info': return <MoreInfoTab />;
      case 'quiz': return <QuizTab />;
      case 'reflection': return <ReflectionTab />;
      default: return <ConceptTab />;
    }
  };

  const NavButton: React.FC<{ id: TabId; label: string; icon: React.ReactNode }> = ({ id, label, icon }) => {
    return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
        ${activeTab === id 
          ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/10' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
        }`}
    >
      <span className={activeTab === id ? 'text-blue-600' : 'text-slate-400'}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
    );
  };

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
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">미래 농장 타이쿤</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">디지털 기술(빅데이터, 센서, AI)을 활용한 스마트 팜 경영 시뮬레이션 웹 앱입니다.</p>
                </div>
              </div>
            </div>
          </header>

          <div className="min-h-screen bg-slate-50">
            {/* Navigation */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex space-x-1 overflow-x-auto no-scrollbar items-center justify-center h-[60px] py-2">
                  <NavButton id="concept" label="개념 학습" icon={<BookOpen size={18}/>} />
                  <NavButton id="simulation" label="경영 게임" icon={<Gamepad2 size={18}/>} />
                  <NavButton id="more-info" label="더 알아보기" icon={<Lightbulb size={18}/>} />
                  <NavButton id="quiz" label="퀴즈" icon={<Cpu size={18}/>} />
                  <NavButton id="reflection" label="생각 나누기" icon={<MessageSquare size={18}/>} />
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
              <div className="animate-fade-in-up">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FutureFarmTycoonApp;

