'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Tab } from './types';
import TheoryView from './components/TheoryView';
import SimulationView from './components/SimulationView';
import NewsView from './components/NewsView';
import QuizView from './components/QuizView';
import EssayView from './components/EssayView';
import { BookOpen, Activity, Globe, HelpCircle, PenTool, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ThreatDatabaseApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('simulation');

  const tabs = [
    { id: 'theory', label: '이론 학습', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'simulation', label: '방어 시뮬레이션', icon: <Activity className="w-4 h-4" /> },
    { id: 'news', label: '보안 뉴스', icon: <Globe className="w-4 h-4" /> },
    { id: 'quiz', label: '공격 일지', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'essay', label: '생각해볼 문제', icon: <PenTool className="w-4 h-4" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <TheoryView />;
      case 'simulation': return <SimulationView />;
      case 'news': return <NewsView />;
      case 'quiz': return <QuizView />;
      case 'essay': return <EssayView />;
      default: return <SimulationView />;
    }
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
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">위협 데이터베이스</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">사이버 보안 위협과 방어 메커니즘을 학습하는 대화형 교육 시뮬레이터입니다.</p>
                </div>
              </div>
            </div>
          </header>

          {/* Navigation */}
          <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-6">
            <nav className="flex space-x-1 overflow-x-auto no-scrollbar items-center justify-center h-[60px] py-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/10' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
            </nav>
          </div>

          {/* Content */}
          <div className="min-h-screen flex flex-col font-sans">
            <div className="flex-1 overflow-y-auto bg-slate-50">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full py-6"
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThreatDatabaseApp;

