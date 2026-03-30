import React from 'react';
import { GameState } from '../types';
import { Shield, Award } from 'lucide-react';

interface Props {
  gameState: GameState;
}

const GamificationBar: React.FC<Props> = ({ gameState }) => {
  const percentage = Math.min(100, (gameState.xp / gameState.maxXp) * 100);

  return (
    <div className="bg-slate-800 text-white p-4 sticky top-0 z-50 shadow-lg flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-full">
          <Shield size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg">쇼핑몰 보안 팀장</h1>
          <p className="text-xs text-slate-400">레벨 {gameState.level} - 보안 등급 {gameState.level === 1 ? '수습' : gameState.level < 3 ? '일반' : gameState.level < 5 ? '전문가' : '마스터'}</p>
        </div>
      </div>

      <div className="flex flex-col w-1/3 max-w-xs">
        <div className="flex justify-between text-xs mb-1">
          <span>XP: {gameState.xp} / {gameState.maxXp}</span>
          <span>Level Up!</span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-2.5">
          <div 
            className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="hidden md:flex items-center text-yellow-400">
        <Award className="mr-2" />
        <span className="font-bold">미션 진행중</span>
      </div>
    </div>
  );
};

export default GamificationBar;
