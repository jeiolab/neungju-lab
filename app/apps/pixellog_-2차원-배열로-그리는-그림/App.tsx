import React, { useState } from 'react';
import { Layers, Play, GraduationCap, Image as ImageIcon, HelpCircle, Puzzle } from 'lucide-react';
import { TabView } from './types';
import { TheoryTab } from './tabs/TheoryTab';
import { SimulationTab } from './tabs/SimulationTab';
import { QuizTab } from './tabs/QuizTab';
import { GalleryTab } from './tabs/GalleryTab';
import { MysteryTab } from './tabs/MysteryTab';

function App() {
  const [activeTab, setActiveTab] = useState<TabView>(TabView.THEORY);

  const renderContent = () => {
    switch (activeTab) {
      case TabView.THEORY: return <TheoryTab />;
      case TabView.SIMULATION: return <SimulationTab />;
      case TabView.QUIZ: return <QuizTab />;
      case TabView.GALLERY: return <GalleryTab />;
      case TabView.MYSTERY: return <MysteryTab />;
      default: return <TheoryTab />;
    }
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: TabView, icon: React.ElementType, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`
        flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium
        ${activeTab === tab 
          ? 'bg-blue-600 text-white shadow-lg scale-105' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }
      `}
    >
      <Icon size={18} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-mono text-lg text-white shadow-lg">
              P
            </div>
            <span className="text-gray-900">
              PixelLog
            </span>
          </div>
          
          <nav className="flex gap-1 md:gap-2">
            <NavButton tab={TabView.THEORY} icon={GraduationCap} label="이론" />
            <NavButton tab={TabView.SIMULATION} icon={Play} label="실습" />
            <NavButton tab={TabView.QUIZ} icon={Puzzle} label="퀴즈" />
            <NavButton tab={TabView.MYSTERY} icon={HelpCircle} label="미스터리" />
            <NavButton tab={TabView.GALLERY} icon={ImageIcon} label="갤러리" />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto bg-slate-50">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;