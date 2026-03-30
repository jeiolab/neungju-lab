import React, { useState } from 'react';
import { TabId } from './types';
import { LayoutDashboard, BookOpen, Search, GraduationCap, MessageCircle, Truck } from 'lucide-react';
import TheoryTab from './components/TheoryTab';
import SimulationTab from './components/SimulationTab';
import LearnMoreTab from './components/LearnMoreTab';
import QuizTab from './components/QuizTab';
import DiscussionTab from './components/DiscussionTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('simulation');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'theory':
        return <TheoryTab />;
      case 'simulation':
        return <SimulationTab />;
      case 'learn-more':
        return <LearnMoreTab />;
      case 'quiz':
        return <QuizTab />;
      case 'discussion':
        return <DiscussionTab />;
      default:
        return <SimulationTab />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-amber-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-none">알고리즘 배달부</h1>
                <p className="text-xs text-amber-100 mt-1">물류 센터 최적화 시뮬레이터</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto pb-1 no-scrollbar">
            <NavButton 
              active={activeTab === 'theory'} 
              onClick={() => setActiveTab('theory')} 
              icon={<BookOpen size={18} />} 
              label="이론 개념" 
            />
            <NavButton 
              active={activeTab === 'simulation'} 
              onClick={() => setActiveTab('simulation')} 
              icon={<LayoutDashboard size={18} />} 
              label="시뮬레이션" 
            />
            <NavButton 
              active={activeTab === 'learn-more'} 
              onClick={() => setActiveTab('learn-more')} 
              icon={<Search size={18} />} 
              label="더 알아보기" 
            />
            <NavButton 
              active={activeTab === 'quiz'} 
              onClick={() => setActiveTab('quiz')} 
              icon={<GraduationCap size={18} />} 
              label="퀴즈" 
            />
            <NavButton 
              active={activeTab === 'discussion'} 
              onClick={() => setActiveTab('discussion')} 
              icon={<MessageCircle size={18} />} 
              label="생각해보기" 
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[600px] p-6">
          {renderTabContent()}
        </div>
      </main>

    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2
      ${active 
        ? 'border-white text-white' 
        : 'border-transparent text-amber-100 hover:text-white hover:bg-white/10'
      }
    `}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;