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
        flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 font-bold text-sm
        ${activeTab === tab 
          ? 'bg-white text-blue-600 shadow-md scale-105' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
        }
      `}
    >
      <Icon size={18} className={activeTab === tab ? 'fill-current opacity-20' : ''} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center font-mono text-xl text-white shadow-lg shadow-blue-200">
              P
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">PixelLog</h1>
              <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">2차원 배열로 그리는 그림</p>
            </div>
          </div>
          
          <nav className="flex gap-1 bg-gray-100/80 p-1.5 rounded-xl border border-gray-200">
            <NavButton tab={TabView.THEORY} icon={GraduationCap} label="이론" />
            <NavButton tab={TabView.SIMULATION} icon={Play} label="실습" />
            <NavButton tab={TabView.QUIZ} icon={Puzzle} label="퀴즈" />
            <NavButton tab={TabView.MYSTERY} icon={HelpCircle} label="미스터리" />
            <NavButton tab={TabView.GALLERY} icon={ImageIcon} label="갤러리" />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;