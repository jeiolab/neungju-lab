import React from 'react';
import { Award, Lock } from 'lucide-react';

interface BadgeDisplayProps {
  unlockedBadges: string[];
}

const ALL_BADGES = [
  { id: 'Learner', name: '호기심 대장', description: '모든 개념 카드 읽기' },
  { id: 'Normalization Master', name: '정규화 마스터', description: '비표준 데이터에서 정규화 사용' },
  { id: 'K-Tuner', name: 'K-튜너', description: '높은 k값 실험해보기' },
  { id: 'Quiz Whiz', name: '퀴즈 천재', description: '퀴즈 완료하기' },
];

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ unlockedBadges }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
        <Award size={16} /> 나의 배지 보관함
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {ALL_BADGES.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          return (
            <div 
              key={badge.id}
              className={`p-3 rounded-lg border flex flex-col items-center text-center transition-all ${
                isUnlocked 
                  ? 'bg-yellow-50 border-yellow-200 shadow-sm' 
                  : 'bg-gray-50 border-gray-100 opacity-60 grayscale'
              }`}
            >
              <div className={`p-2 rounded-full mb-2 ${isUnlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-200 text-gray-400'}`}>
                {isUnlocked ? <Award size={20} /> : <Lock size={20} />}
              </div>
              <span className={`text-xs font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                {badge.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgeDisplay;