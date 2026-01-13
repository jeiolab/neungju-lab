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
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 scale-105' 
          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
        }
      `}
    >
      <Icon size={18} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-mono text-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              P
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
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
      <main className="flex-1 relative overflow-y-auto">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-slate-600 text-sm">
        <p>© 2024 PixelLog Studio. 2차원 배열 교육용 시뮬레이터.</p>
      </footer>
    </div>
  );
}

export default App;