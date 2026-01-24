import React, { useState } from 'react';
import { Tab } from './types';
import { SimulationGame } from './components/SimulationGame';
import { QuizGame } from './components/QuizGame';
import { TheoryContent, TipsContent, ReflectionContent } from './components/TheoryContent';
import { Shield, BookOpen, Smartphone, BrainCircuit, Info, Siren } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY:
        return <TheoryContent />;
      case Tab.SIMULATION:
        return <SimulationGame />;
      case Tab.TIPS:
        return <TipsContent />;
      case Tab.QUIZ:
        return <QuizGame />;
      case Tab.REFLECTION:
        return <ReflectionContent />;
      default:
        return <TheoryContent />;
    }
  };

  const navItems = [
    { id: Tab.THEORY, label: '개념', icon: BookOpen },
    { id: Tab.SIMULATION, label: '실전', icon: Shield },
    { id: Tab.TIPS, label: '팁', icon: Smartphone },
    { id: Tab.QUIZ, label: '퀴즈', icon: BrainCircuit },
    { id: Tab.REFLECTION, label: '생각', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-gradient-to-br from-blue-600 to-sky-500 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <Shield className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-xl font-black tracking-tighter text-slate-900">디지털 보안관</h1>
                <p className="text-xs text-blue-600 font-mono font-bold">CODE NAME: ANTI-HACK</p>
             </div>
          </div>
          <div className="hidden sm:block text-xs text-slate-500 text-right">
             <p>학교 정보 보안 동아리</p>
             <p>Official Training App</p>
          </div>
        </div>
      </header>

      {/* Navigation (Mobile Sticky / Desktop Centered) */}
      <nav className="bg-white border-b border-slate-200 sticky top-[73px] z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-2 overflow-x-auto no-scrollbar">
           <div className="flex justify-around sm:justify-start sm:gap-2 min-w-max p-2">
             {navItems.map((item) => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-bold whitespace-nowrap ${
                   activeTab === item.id 
                     ? 'bg-blue-600 text-white shadow-md' 
                     : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                 }`}
               >
                 <item.icon className="w-4 h-4" />
                 {item.label}
               </button>
             ))}
           </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 pb-24">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;