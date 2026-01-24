import React, { useState } from 'react';
import { Tab } from './types';
import { TabTheory } from './components/TabTheory';
import { TabGame } from './components/TabGame';
import { TabMoreInfo } from './components/TabMoreInfo';
import { TabQuiz } from './components/TabQuiz';
import { TabReflection } from './components/TabReflection';
import { Sprout, BookOpen, Gamepad2, Rocket, HelpCircle, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.GAME);

  const renderTab = () => {
    switch (activeTab) {
      case Tab.THEORY: return <TabTheory />;
      case Tab.GAME: return <TabGame />;
      case Tab.MORE_INFO: return <TabMoreInfo />;
      case Tab.QUIZ: return <TabQuiz />;
      case Tab.REFLECTION: return <TabReflection />;
      default: return <TabGame />;
    }
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center gap-1 p-2 min-w-[64px] rounded-lg transition-all duration-200 
        ${activeTab === tab 
          ? 'text-green-700 bg-green-100 font-bold scale-105 shadow-sm' 
          : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'}`}
    >
      <Icon size={24} strokeWidth={activeTab === tab ? 2.5 : 2} />
      <span className="text-xs">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f4] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="bg-green-600 p-2 rounded-lg text-white">
                    <Sprout size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-extrabold text-stone-800 tracking-tight">비트 팜</h1>
                    <p className="text-[10px] font-medium text-stone-500 -mt-1">내 손안의 농장</p>
                </div>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-2">
                <NavButton tab={Tab.THEORY} icon={BookOpen} label="이론 학습" />
                <NavButton tab={Tab.GAME} icon={Gamepad2} label="농장 실습" />
                <NavButton tab={Tab.MORE_INFO} icon={Rocket} label="미래 기술" />
                <NavButton tab={Tab.QUIZ} icon={HelpCircle} label="퀴즈" />
                <NavButton tab={Tab.REFLECTION} icon={MessageCircle} label="생각하기" />
            </nav>
        </div>
      </header>

      {/* Mobile Nav (Bottom Sticky) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-stone-200 z-50 flex justify-around p-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <NavButton tab={Tab.THEORY} icon={BookOpen} label="이론" />
        <NavButton tab={Tab.GAME} icon={Gamepad2} label="실습" />
        <NavButton tab={Tab.MORE_INFO} icon={Rocket} label="미래" />
        <NavButton tab={Tab.QUIZ} icon={HelpCircle} label="퀴즈" />
        <NavButton tab={Tab.REFLECTION} icon={MessageCircle} label="생각" />
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 pb-24 md:pb-8">
        {renderTab()}
      </main>
    </div>
  );
};

export default App;
