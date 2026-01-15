import React from 'react';
import { UserState } from '../types';
import { Trophy, Star, Flame } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: UserState;
  activeTab: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, activeTab }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20 md:pb-0 font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold text-indigo-600 leading-tight">디지털 사회 마스터</h1>
          <p className="text-xs text-gray-500 hidden sm:block">고1 사회탐구 개념 완성</p>
        </div>
        
        <div className="flex items-center space-x-3 text-sm font-medium">
          <div className="flex items-center text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
            <Flame className="w-4 h-4 mr-1" />
            <span>{user.streak}일</span>
          </div>
          <div className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 mr-1" />
            <span>Lv.{user.level}</span>
          </div>
          <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
            <span className="text-xs mr-1">XP</span>
            <span>{user.xp}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;