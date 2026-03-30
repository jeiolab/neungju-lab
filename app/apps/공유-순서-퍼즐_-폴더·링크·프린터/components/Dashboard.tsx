import React from 'react';
import { UserStats, PuzzleScenario } from '../types';
import { BADGES } from '../constants';
import { Award, Zap, BookOpen, Star } from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
  puzzles: PuzzleScenario[];
  onStartPuzzle: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, puzzles, onStartPuzzle }) => {
  const progressPercent = Math.min(100, (stats.score / 500) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex items-center space-x-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Star size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500">총 점수</p>
            <p className="text-xl font-bold text-gray-800">{stats.score}점</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-green-100 flex items-center space-x-3">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500">레벨</p>
            <p className="text-xl font-bold text-gray-800">Lv. {stats.level}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-100 flex items-center space-x-3">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500">연속 학습</p>
            <p className="text-xl font-bold text-gray-800">{stats.streakDays}일째</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100 flex items-center space-x-3">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500">완료한 퍼즐</p>
            <p className="text-xl font-bold text-gray-800">{stats.solvedPuzzles.length} / {puzzles.length}</p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Award className="mr-2 text-yellow-500" /> 나의 배지 컬렉션
        </h3>
        <div className="flex flex-wrap gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = stats.badges.includes(badge.id);
            return (
              <div key={badge.id} className={`flex flex-col items-center p-3 rounded-lg border w-28 text-center transition-all ${isUnlocked ? 'bg-yellow-50 border-yellow-200 opacity-100 scale-105' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'}`}>
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className="text-xs font-bold text-gray-800">{badge.name}</div>
                <div className="text-[10px] text-gray-500 mt-1">{badge.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Puzzle Selection */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">도전할 퍼즐 선택</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {puzzles.map((puzzle) => {
            const isSolved = stats.solvedPuzzles.includes(puzzle.id);
            return (
              <div 
                key={puzzle.id} 
                className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer hover:shadow-md ${isSolved ? 'border-green-200 bg-green-50' : 'border-blue-100 bg-white hover:border-blue-300'}`}
                onClick={() => onStartPuzzle(puzzle.id)}
              >
                {isSolved && <div className="absolute top-3 right-3 text-green-600"><Award size={20} /></div>}
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${
                  puzzle.category === 'Windows' ? 'bg-blue-100 text-blue-700' :
                  puzzle.category === 'Printer' ? 'bg-orange-100 text-orange-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {puzzle.category}
                </span>
                <h4 className="font-bold text-gray-800 mb-1">{puzzle.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{puzzle.description}</p>
                <div className="mt-4 text-xs font-medium text-blue-600">
                  {isSolved ? '다시 풀기' : '시작하기 →'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;