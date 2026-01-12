'use client';

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { TabType } from './types';
import ConceptTab from './components/ConceptTab';
import SimulationTab from './components/SimulationTab';
import ResourcesTab from './components/ResourcesTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import { BookOpen, Cpu, Link, CheckSquare, BrainCircuit } from 'lucide-react';

const MyAICareerCompassApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('simulation');

  const renderContent = () => {
    switch (activeTab) {
      case 'concept': return <ConceptTab />;
      case 'simulation': return <SimulationTab />;
      case 'resources': return <ResourcesTab />;
      case 'quiz': return <QuizTab />;
      case 'reflection': return <ReflectionTab />;
      default: return <SimulationTab />;
    }
  };

  const navItems: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'concept', label: '개념 이해', icon: BookOpen },
    { id: 'simulation', label: '진로 설계', icon: Cpu },
    { id: 'quiz', label: '준비도 체크', icon: CheckSquare },
    { id: 'resources', label: '더 알아보기', icon: Link },
    { id: 'reflection', label: '나의 다짐', icon: BrainCircuit },
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
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">나의 AI 진로 나침반</h1>
                  <p className="text-sm text-slate-500 leading-tight mt-0.5">디지털 시대에 맞는 나만의 진로를 설계하고 새로운 직업을 탐색하는 인터랙티브 진로 가이드 앱</p>
                </div>
              </div>
            </div>
          </header>

          <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
            {/* Navigation Tabs */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 mb-6">
              <nav className="flex space-x-1 overflow-x-auto no-scrollbar items-center justify-center h-[60px] py-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/10'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Dynamic Content Area */}
            <div className="min-h-[600px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyAICareerCompassApp;

