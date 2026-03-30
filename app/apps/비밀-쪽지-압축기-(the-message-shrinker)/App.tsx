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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Lock className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600">
                  비밀 쪽지 압축기
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">The Message Shrinker</p>
              </div>
            </div>

            {/* Stats - Desktop */}
            <div className="hidden md:flex gap-4 text-sm font-medium">
              <div className="flex items-center gap-1 text-indigo-600">
                <Award size={18} />
                <span>{level}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <span>XP: {xp}</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    activeTab === item.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-2 space-y-1">
            {/* Mobile Stats */}
            <div className="flex gap-4 text-sm font-medium pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1 text-indigo-600">
                <Award size={16} />
                <span>{level}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <span>XP: {xp}</span>
              </div>
            </div>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {activeTab === Tab.OPERATION && (
          <OperationTab onCompressSuccess={() => addXp(5)} />
        )}
        {activeTab === Tab.PRINCIPLES && <PrinciplesTab />}
        {activeTab === Tab.ARCHIVES && <ArchivesTab />}
        {activeTab === Tab.EXAM && (
          <ExamTab onScoreUpdate={(score) => addXp(score)} />
        )}
        {activeTab === Tab.THINK_TANK && <ThinkTankTab />}
      </main>
    </div>
  );
};

export default App;