import React from 'react';
import { GameState } from '../types';
import { Trophy, Flame, Star, Award } from 'lucide-react';

interface DashboardProps {
  gameState: GameState;
}

const Dashboard: React.FC<DashboardProps> = ({ gameState }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-slate-200">
      <div className="flex flex-wrap justify-between items-center gap-4">
        
        {/* Score & Level */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">감별사 등급</p>
            <p className="text-lg font-bold text-slate-800">Lv.{gameState.level}</p>
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-100 rounded-full text-yellow-600">
            <Star size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">현재 점수</p>
            <p className="text-lg font-bold text-slate-800">{gameState.score}점</p>
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-full ${gameState.streak > 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
            <Flame size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">연속 정답</p>
            <p className="text-lg font-bold text-slate-800">{gameState.streak}회</p>
          </div>
        </div>

        {/* Badge (Visual only for now) */}
        {gameState.badges.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <Award size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">최신 뱃지</p>
              <p className="text-sm font-bold text-slate-800">{gameState.badges[gameState.badges.length - 1]}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Progress Bar for Level */}
      <div className="mt-4 w-full bg-slate-100 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${Math.min((gameState.score % 100) / 100 * 100, 100)}%` }}
        ></div>
      </div>
      <p className="text-xs text-right text-slate-400 mt-1">다음 레벨까지 {100 - (gameState.score % 100)}점</p>
    </div>
  );
};

export default Dashboard;