import React, { useState } from 'react';
import { Tab, AgentLevel } from './types';
import OperationTab from './components/OperationTab';
import PrinciplesTab from './components/PrinciplesTab';
import ArchivesTab from './components/ArchivesTab';
import ExamTab from './components/ExamTab';
import ThinkTankTab from './components/ThinkTankTab';
import { Shield, Book, FileText, Award, MessageCircle, Lock, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.OPERATION);
  const [xp, setXp] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine Level based on XP
  let level = AgentLevel.TRAINEE;
  let nextLevelXp = 50;
  if (xp >= 200) {
    level = AgentLevel.MASTER;
    nextLevelXp = 9999;
  } else if (xp >= 100) {
    level = AgentLevel.SENIOR;
    nextLevelXp = 200;
  } else if (xp >= 50) {
    level = AgentLevel.JUNIOR;
    nextLevelXp = 100;
  }

  const addXp = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  const navItems = [
    { id: Tab.OPERATION, label: '작전 개시', icon: <Shield size={18} /> },
    { id: Tab.PRINCIPLES, label: '원리 파악', icon: <Book size={18} /> },
    { id: Tab.ARCHIVES, label: '자료실', icon: <FileText size={18} /> },
    { id: Tab.EXAM, label: '승급 시험', icon: <Award size={18} /> },
    { id: Tab.THINK_TANK, label: '생각해보기', icon: <MessageCircle size={18} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Lock size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">
              비밀 쪽지 압축기
            </h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>

          {/* User Status */}
          <div className="hidden md:flex items-center gap-4 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-200">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">현재 등급</div>
              <div className="text-sm font-bold text-indigo-600">{level}</div>
            </div>
            <div className="w-px h-8 bg-slate-300"></div>
            <div>
               <div className="text-[10px] text-slate-500">XP: {xp}</div>
               <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                 <div 
                    className="h-full bg-indigo-500" 
                    style={{ width: `${Math.min(100, (xp / nextLevelXp) * 100)}%`}}
                 ></div>
               </div>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 space-y-1">
             {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === item.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
             <div className="pt-4 pb-2 border-t border-slate-200 mt-2">
                <div className="flex justify-between items-center text-sm px-2">
                   <span className="text-slate-600">{level}</span>
                   <span className="text-indigo-600 font-bold">{xp} XP</span>
                </div>
             </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
          {activeTab === Tab.OPERATION && (
            <OperationTab onCompressSuccess={() => addXp(5)} />
          )}
          {activeTab === Tab.PRINCIPLES && <PrinciplesTab />}
          {activeTab === Tab.ARCHIVES && <ArchivesTab />}
          {activeTab === Tab.EXAM && (
            <ExamTab onScoreUpdate={(score) => addXp(score)} />
          )}
          {activeTab === Tab.THINK_TANK && <ThinkTankTab />}
        </div>
      </main>
    </div>
  );
};

export default App;