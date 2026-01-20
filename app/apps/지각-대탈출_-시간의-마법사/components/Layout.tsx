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

  const renderContent = () => {
    return <ActiveComponent />;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <span className="text-2xl">🧙‍♂️</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">지각 대탈출: 시간의 마법사</h1>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200 shadow-sm overflow-x-auto sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 flex gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};