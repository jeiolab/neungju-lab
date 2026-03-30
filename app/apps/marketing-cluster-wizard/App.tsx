import React, { useState } from 'react';
import { LayoutDashboard, PieChart, BookOpen, BrainCircuit, Lightbulb } from 'lucide-react';
import Basics from './components/Basics';
import Simulation from './components/Simulation';
import Cases from './components/Cases';
import Quiz from './components/Quiz';
import Reflection from './components/Reflection';
import { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.SIMULATION);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.BASICS: return <Basics />;
      case Tab.SIMULATION: return <Simulation />;
      case Tab.CASES: return <Cases />;
      case Tab.QUIZ: return <Quiz />;
      case Tab.REFLECTION: return <Reflection />;
      default: return <Simulation />;
    }
  };

  const navItems = [
    { id: Tab.BASICS, label: '마케팅 기초', icon: <BookOpen className="w-5 h-5" /> },
    { id: Tab.SIMULATION, label: '사이즈 분석 프로젝트', icon: <PieChart className="w-5 h-5" /> },
    { id: Tab.CASES, label: '성공 사례', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: Tab.QUIZ, label: '실전 퀴즈', icon: <BrainCircuit className="w-5 h-5" /> },
    { id: Tab.REFLECTION, label: '아이디어 제안', icon: <Lightbulb className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-72 bg-white border-r border-gray-200 flex-shrink-0 z-10">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
               <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">Marketing Wizard</h1>
              <p className="text-xs text-gray-500">AI Mentor for Beginners</p>
            </div>
          </div>
        </div>
        
        <ul className="p-4 space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <span className={`mr-3 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="p-6 mt-auto hidden md:block">
           <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
             <p className="text-xs opacity-80 mb-1">Weekly Challenge</p>
             <p className="text-sm font-bold">군집 분석 완료하고<br/>수료증 받기</p>
             <div className="mt-3 w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
               <div className="bg-white h-full w-2/3"></div>
             </div>
           </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen">
        <header className="bg-white border-b border-gray-200 p-6 sticky top-0 z-20 shadow-sm md:hidden">
          <h2 className="font-bold text-gray-800">
             {navItems.find(i => i.id === activeTab)?.label}
          </h2>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
