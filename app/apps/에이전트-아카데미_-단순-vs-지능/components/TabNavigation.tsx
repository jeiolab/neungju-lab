import React from 'react';
import { BookOpen, Gamepad2, Database, HelpCircle, Lightbulb, Menu } from 'lucide-react';
import * as Icons from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'theory', label: '이론 학습', icon: BookOpen },
    { id: 'game', label: '분류 게임', icon: Gamepad2 },
    { id: 'encyclopedia', label: '사례 도감', icon: Database },
    { id: 'quiz', label: '핵심 퀴즈', icon: HelpCircle },
    { id: 'think', label: '발명가 모드', icon: Lightbulb },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 p-4 shrink-0">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <Icons.Bot size={24} />
          </div>
          <span className="font-bold text-xl text-gray-800 tracking-tight">에이전트 스쿨</span>
        </div>

        <div className="space-y-2 flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? 'text-indigo-600 bg-indigo-50 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe z-50">
        <div className="flex justify-around items-center p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'text-indigo-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default TabNavigation;