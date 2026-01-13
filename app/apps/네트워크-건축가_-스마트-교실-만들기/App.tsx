import React, { useState } from 'react';
import { AppTab } from './types';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import LearnMoreTab from './components/LearnMoreTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import { Network, BookOpen, PenTool, BrainCircuit, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.THEORY);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.THEORY:
        return <TheoryTab />;
      case AppTab.SIMULATION:
        return <SimulationTab />;
      case AppTab.LEARN_MORE:
        return <LearnMoreTab />;
      case AppTab.QUIZ:
        return <QuizTab />;
      case AppTab.REFLECTION:
        return <ReflectionTab />;
      default:
        return <TheoryTab />;
    }
  };

  const navItems = [
    { id: AppTab.THEORY, label: '이론 학습', icon: BookOpen },
    { id: AppTab.SIMULATION, label: '실습하기', icon: Network },
    { id: AppTab.LEARN_MORE, label: '더 알아보기', icon: BrainCircuit },
    { id: AppTab.QUIZ, label: '퀴즈', icon: PenTool },
    { id: AppTab.REFLECTION, label: '생각해보기', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <Network className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-800">
                    네트워크<span className="text-indigo-600">건축가</span>
                </h1>
            </div>
            
            <nav className="hidden md:flex space-x-1">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center ${
                                isActive 
                                ? 'bg-indigo-50 text-indigo-700' 
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>
            {/* Mobile Menu Placeholder - simple hamburger for real app, hidden for now */}
            <div className="md:hidden text-xs text-slate-400">PC 화면 권장</div>
        </div>
        
        {/* Mobile Navigation Bar (Bottom fixed for mobile) */}
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-50 px-2 py-2 flex justify-between safe-area-bottom">
            {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex flex-col items-center justify-center w-full py-1 ${
                            isActive ? 'text-indigo-600' : 'text-slate-400'
                        }`}
                    >
                        <Icon className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                )
            })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 mb-16 md:mb-0">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center hidden md:block">
        <p className="text-slate-500 text-sm">
            Network Architect &copy; 2024. 교육 목적으로 제작되었습니다.
        </p>
      </footer>
    </div>
  );
};

export default App;