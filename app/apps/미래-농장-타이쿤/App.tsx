import React, { useState } from 'react';
import { TabId } from './types';
import ConceptTab from './components/ConceptTab';
import SimulationTab from './components/SimulationTab';
import MoreInfoTab from './components/MoreInfoTab';
import QuizTab from './components/QuizTab';
import ReflectionTab from './components/ReflectionTab';
import { BookOpen, Cpu, Gamepad2, Lightbulb, MessageSquare } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('concept');

  const renderContent = () => {
    switch (activeTab) {
      case 'concept': return <ConceptTab />;
      case 'simulation': return <SimulationTab />;
      case 'more-info': return <MoreInfoTab />;
      case 'quiz': return <QuizTab />;
      case 'reflection': return <ReflectionTab />;
      default: return <ConceptTab />;
    }
  };

  const NavButton: React.FC<{ id: TabId; label: string; icon: React.ReactNode }> = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200
        ${activeTab === id 
          ? 'bg-emerald-600 text-white shadow-md transform scale-105' 
          : 'bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
        }`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-green-50/50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
                <div className="bg-emerald-500 text-white p-2 rounded-lg">
                    <Cpu size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">미래 농장 타이쿤</h1>
                    <p className="text-xs text-gray-500 hidden sm:block">AI & Big Data Smart Farm Simulation</p>
                </div>
            </div>
            
            <nav className="flex space-x-2">
              <NavButton id="concept" label="개념 학습" icon={<BookOpen size={18}/>} />
              <NavButton id="simulation" label="경영 게임" icon={<Gamepad2 size={18}/>} />
              <NavButton id="more-info" label="더 알아보기" icon={<Lightbulb size={18}/>} />
              <NavButton id="quiz" label="퀴즈" icon={<Cpu size={18}/>} />
              <NavButton id="reflection" label="생각 나누기" icon={<MessageSquare size={18}/>} />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        <div className="animate-fade-in-up">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;