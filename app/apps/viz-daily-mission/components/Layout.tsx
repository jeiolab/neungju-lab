import React from 'react';
import { BookOpen, Activity, Lightbulb, ClipboardCheck, MessageSquare, Trophy } from 'lucide-react';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: number;
  setActiveTab: (idx: number) => void;
  profile: UserProfile;
}

const TABS = [
  { id: 0, label: '이론', icon: BookOpen },
  { id: 1, label: '오늘의 미션', icon: Activity },
  { id: 2, label: '더 알아보기', icon: ClipboardCheck },
  { id: 3, label: '퀴즈', icon: Lightbulb },
  { id: 4, label: '생각하기', icon: MessageSquare },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, profile }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-md bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-bold text-indigo-700">하루 1개 시각화</h1>
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full">
            <Trophy className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-indigo-900">{profile.streak}일 연속</span>
          </div>
        </div>
        <nav className="flex justify-between overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center min-w-[60px] p-2 rounded-lg transition-colors ${
                activeTab === tab.id ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md flex-1 p-4 pb-20">
        {children}
      </main>
    </div>
  );
};