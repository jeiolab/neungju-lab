import React from 'react';
import { ChefHat, Award } from 'lucide-react';

interface Props {
  badgeEarned: boolean;
}

export const Header: React.FC<Props> = ({ badgeEarned }) => {
  return (
    <header className="bg-white border-b border-orange-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-full">
            <ChefHat className="text-orange-600 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">데이터 셰프</h1>
            <p className="text-xs text-gray-500 font-medium">AI 요리하기 프로젝트</p>
          </div>
        </div>

        {badgeEarned ? (
          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border border-yellow-200 animate-bounce">
            <Award className="text-yellow-600" />
            <span className="font-bold text-yellow-800 text-sm">마스터 셰프</span>
          </div>
        ) : (
          <div className="text-sm text-gray-400 font-medium hidden sm:block">
            실습을 완벽하게 끝내고 배지를 획득하세요!
          </div>
        )}
      </div>
    </header>
  );
};