import React, { useState } from 'react';
import { TabType } from './types';
import ConceptTab from './components/ConceptTab';
import SimulationTab from './components/SimulationTab';
import ResourcesTab from './components/ResourcesTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import { Compass, BookOpen, Cpu, Link, CheckSquare, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 text-white p-2 rounded-lg">
              <Compass className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              나의 AI 진로 나침반
            </h1>
          </div>
          {/* Mobile menu could go here, for now simpler layout */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Navigation Tabs (Desktop & Mobile Scrollable) */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 no-scrollbar border-b border-slate-200">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-xl whitespace-nowrap transition-all font-medium text-sm ${
                activeTab === item.id
                  ? 'bg-white border-b-2 border-blue-600 text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Dynamic Content Area */}
        <div className="min-h-[600px]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;