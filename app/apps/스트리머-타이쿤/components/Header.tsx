import React from 'react';
import { Tab } from '../types';
import { Tv, Users, Archive, BookOpen, GraduationCap, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
  subscribers: number;
}

const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, subscribers }) => {
  const tabs = [
    { id: Tab.STUDIO, label: '방송 스튜디오', icon: Tv },
    { id: Tab.ARCHIVE, label: '필름 보관소', icon: Archive },
    { id: Tab.MANUAL, label: '기술 매뉴얼', icon: BookOpen },
    { id: Tab.EXAM, label: '자격증 시험', icon: GraduationCap },
    { id: Tab.FUTURE, label: '미래 기술', icon: Sparkles },
  ];

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-4">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="bg-gradient-to-tr from-red-600 to-orange-500 p-2 rounded-lg">
               <Tv className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">스트리머 타이쿤</h1>
              <p className="text-xs text-slate-400">압축 기술의 달인</p>
            </div>
          </div>

          <div className="flex bg-slate-800 rounded-lg p-1 overflow-x-auto max-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  currentTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
            <Users className="w-4 h-4 text-green-400" />
            <span className="font-mono font-bold text-green-400">{subscribers.toLocaleString()}</span>
            <span className="text-xs text-slate-400">명</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;