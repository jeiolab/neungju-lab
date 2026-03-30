import React from 'react';
import { Network, Gamepad2, BookOpen, Settings, Trophy } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: '대시보드', icon: Trophy },
    { id: 'theory', label: '개념 학습', icon: BookOpen },
    { id: 'sim', label: '시뮬레이터', icon: Settings },
    { id: 'game', label: '판별전 (게임)', icon: Gamepad2 },
    { id: 'quiz', label: '퀴즈', icon: Network },
  ];

  return (
    <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <Network className="w-6 h-6" />
            <h1 className="text-lg font-bold truncate md:text-xl">전송 방식 판별전</h1>
          </div>
        </div>
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-1 px-3 py-2 rounded-md whitespace-nowrap transition-colors ${
                activeTab === item.id
                  ? 'bg-white text-indigo-700 font-medium'
                  : 'text-indigo-100 hover:bg-indigo-500'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
