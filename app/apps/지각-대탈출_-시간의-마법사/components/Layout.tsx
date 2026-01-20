import React, { useState } from 'react';
import { BookOpen, Gamepad2, BrainCircuit, HelpCircle, Lightbulb } from 'lucide-react';
import { TabTheory } from './Tabs/TabTheory';
import { TabSimulation } from './Tabs/TabSimulation';
import { TabDeepDive } from './Tabs/TabDeepDive';
import { TabQuiz } from './Tabs/TabQuiz';
import { TabThink } from './Tabs/TabThink';

export const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: '이론', icon: BookOpen, component: TabTheory },
    { id: 1, label: '시뮬레이션', icon: Gamepad2, component: TabSimulation },
    { id: 2, label: '심화', icon: BrainCircuit, component: TabDeepDive },
    { id: 3, label: '퀴즈', icon: HelpCircle, component: TabQuiz },
    { id: 4, label: '토론', icon: Lightbulb, component: TabThink },
  ];

  const ActiveComponent = tabs[activeTab].component;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-20">
        <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <span className="text-2xl">🧙‍♂️</span> 지각 대탈출
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <ActiveComponent />
      </main>

      {/* Tab Navigation */}
      <nav className="bg-white border-t border-gray-200 px-2 py-2 flex justify-between items-center sticky bottom-0 z-30 pb-safe">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full py-2 rounded-xl transition-all duration-200 ${
                isActive ? 'text-blue-600 bg-blue-50 scale-105' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};