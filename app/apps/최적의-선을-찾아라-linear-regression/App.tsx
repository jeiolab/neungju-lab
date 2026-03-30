import React, { useState } from 'react';
import { LayoutDashboard, BookOpen, GitMerge, CheckSquare, MessageCircle, BarChart3 } from 'lucide-react';
import { Tab } from './types';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import AdvancedTab from './components/AdvancedTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY:
        return <TheoryTab />;
      case Tab.SIMULATION:
        return <SimulationTab />;
      case Tab.ADVANCED:
        return <AdvancedTab />;
      case Tab.QUIZ:
        return <QuizTab />;
      case Tab.REFLECTION:
        return <ReflectionTab />;
      default:
        return <TheoryTab />;
    }
  };

  const navItems = [
    { id: Tab.THEORY, label: '이론 개념', icon: BookOpen },
    { id: Tab.SIMULATION, label: '시뮬레이션', icon: LayoutDashboard },
    { id: Tab.ADVANCED, label: '더 알아보기', icon: GitMerge },
    { id: Tab.QUIZ, label: '퀴즈', icon: CheckSquare },
    { id: Tab.REFLECTION, label: '생각해보기', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                최적의 선을 찾아라! <span className="text-indigo-600 font-normal">Linear Regression</span>
              </h1>
            </div>
            
            <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === item.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          <p>© 2024 Linear Regression Playground. Built for Math Education.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;