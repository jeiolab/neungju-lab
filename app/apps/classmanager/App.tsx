import React, { useState } from 'react';
import { TheoryTab } from './components/TheoryTab';
import { SimulationTab } from './components/SimulationTab';
import { QuizTab } from './components/QuizTab';
import { MoreInfoTab } from './components/MoreInfoTab';
import { AICoach } from './components/AICoach';
import { Tab } from './types';
import { BookOpen, Calculator, BrainCircuit, GraduationCap, MessageSquareText } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('theory');

  const renderContent = () => {
    switch (activeTab) {
      case 'theory': return <TheoryTab />;
      case 'simulation': return <SimulationTab />;
      case 'quiz': return <QuizTab />;
      case 'more': return <MoreInfoTab />;
      case 'coach': return <AICoach />;
      default: return <TheoryTab />;
    }
  };

  const navItems = [
    { id: 'theory', label: '개념 학습', icon: BookOpen },
    { id: 'simulation', label: '실습', icon: Calculator },
    { id: 'quiz', label: '확인 문제', icon: BrainCircuit },
    { id: 'more', label: '심화 학습', icon: GraduationCap },
    { id: 'coach', label: '정보샘과 상담', icon: MessageSquareText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm/50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('theory')}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Calculator className="w-6 h-6" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900">ClassManager</h1>
              <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">2차원 데이터 마스터</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 bg-gray-100/50 p-1.5 rounded-xl border border-gray-100">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as Tab)}
                  className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? 'fill-current opacity-20' : ''}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;