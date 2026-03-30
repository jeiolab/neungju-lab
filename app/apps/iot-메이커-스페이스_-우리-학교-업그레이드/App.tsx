import React, { useState } from 'react';
import { Tab } from './types';
import TabWizard from './components/TabWizard';
import TabTheory from './components/TabTheory';
import TabExamples from './components/TabExamples';
import TabQuiz from './components/TabQuiz';
import TabSecurity from './components/TabSecurity';
import { BookOpen, PenTool, LayoutGrid, BrainCircuit, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.WIZARD);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY:
        return <TabTheory />;
      case Tab.WIZARD:
        return <TabWizard />;
      case Tab.EXAMPLES:
        return <TabExamples />;
      case Tab.QUIZ:
        return <TabQuiz />;
      case Tab.SECURITY:
        return <TabSecurity />;
      default:
        return <TabWizard />;
    }
  };

  const navItems = [
    { id: Tab.THEORY, label: '이론 & 도감', icon: <BookOpen size={20} /> },
    { id: Tab.WIZARD, label: '설계하기', icon: <PenTool size={20} /> },
    { id: Tab.EXAMPLES, label: '사례 보기', icon: <LayoutGrid size={20} /> },
    { id: Tab.QUIZ, label: '센서 퀴즈', icon: <BrainCircuit size={20} /> },
    { id: Tab.SECURITY, label: '보안 & 윤리', icon: <ShieldCheck size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">IoT 메이커 스페이스</h1>
              <p className="text-indigo-200 text-xs">우리 학교 업그레이드 프로젝트</p>
            </div>
          </div>
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-indigo-100 hover:bg-indigo-500'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Nav (Bottom Sticky) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-30 px-2 py-2 flex justify-around shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg w-full ${
              activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;