import React, { useState } from 'react';
import { Tab } from './types';
import { RobotGame } from './components/RobotGame';
import { HanoiGame } from './components/HanoiGame';
import { TabTheory, TabAI, TabReflection } from './components/ContentTabs';
import { TabQuiz } from './components/QuizTab';
import { Book, Cpu, Gamepad2, BrainCircuit, MessageSquare, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY);
  const [simulationMode, setSimulationMode] = useState<'ROBOT' | 'HANOI'>('ROBOT');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY:
        return <TabTheory />;
      case Tab.SIMULATION:
        return (
          <div className="h-full flex flex-col">
            <div className="flex justify-center gap-4 p-4 bg-white border-b border-slate-200">
                <button 
                    onClick={() => setSimulationMode('ROBOT')}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${simulationMode === 'ROBOT' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                    🤖 로봇 패턴
                </button>
                <button 
                    onClick={() => setSimulationMode('HANOI')}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${simulationMode === 'HANOI' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                    🗼 하노이의 탑
                </button>
            </div>
            <div className="flex-1 overflow-hidden bg-slate-50 relative">
                {simulationMode === 'ROBOT' ? <RobotGame /> : <HanoiGame />}
            </div>
          </div>
        );
      case Tab.AI_INSIGHTS:
        return <TabAI />;
      case Tab.QUIZ:
        return <TabQuiz />;
      case Tab.REFLECTION:
        return <TabReflection />;
      default:
        return <div>Select a tab</div>;
    }
  };

  const NavItem = ({ tab, label, icon: Icon }: { tab: Tab, label: string, icon: any }) => (
    <button
      onClick={() => {
        setActiveTab(tab);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1
        ${activeTab === tab ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}
      `}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-50">
          <h1 className="font-bold text-lg text-slate-800">로봇 코딩 연구소</h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
              {isSidebarOpen ? <X /> : <Menu />}
          </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:relative top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-40 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:block pt-20 md:pt-0
      `}>
        <div className="p-6 border-b border-slate-100 hidden md:block">
            <h1 className="text-xl font-bold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                로봇 코딩 연구소
            </h1>
            <p className="text-xs text-slate-400 mt-1">패턴을 찾아라!</p>
        </div>

        <nav className="p-4">
            <NavItem tab={Tab.THEORY} label="이론 학습" icon={Book} />
            <NavItem tab={Tab.SIMULATION} label="시뮬레이션" icon={Gamepad2} />
            <NavItem tab={Tab.AI_INSIGHTS} label="AI 더 알아보기" icon={Cpu} />
            <NavItem tab={Tab.QUIZ} label="패턴 퀴즈" icon={BrainCircuit} />
            <NavItem tab={Tab.REFLECTION} label="생각해볼 문제" icon={MessageSquare} />
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 bg-slate-50">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                    S
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-700">학생 모드</p>
                    <p className="text-xs text-green-600">Online</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden relative pt-16 md:pt-0">
        {renderContent()}
      </main>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
      )}
    </div>
  );
};

export default App;
