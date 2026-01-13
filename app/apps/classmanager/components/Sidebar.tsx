import React from 'react';
import { Tab } from '../types';
import { BookOpen, Calculator, BrainCircuit, GraduationCap, MessageSquareText } from 'lucide-react';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'theory', label: '1. 개념 학습', icon: BookOpen },
    { id: 'simulation', label: '2. 실습 (ClassManager)', icon: Calculator },
    { id: 'quiz', label: '3. 확인 문제', icon: BrainCircuit },
    { id: 'more', label: '4. 심화 학습', icon: GraduationCap },
    { id: 'coach', label: 'AI 부장님 상담', icon: MessageSquareText },
  ];

  return (
    <div className="w-64 bg-slate-850 text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold font-mono text-blue-400">ClassManager</h1>
        <p className="text-xs text-slate-400 mt-1">2차원 데이터 마스터</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as Tab)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-1'
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded-lg p-3 text-xs text-slate-400">
          <p className="mb-2">👨‍🏫 교육 정보부</p>
          <p>"행렬을 지배하는 자가 데이터를 지배한다."</p>
        </div>
      </div>
    </div>
  );
};