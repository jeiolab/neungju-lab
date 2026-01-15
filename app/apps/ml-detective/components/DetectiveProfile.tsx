import React from 'react';
import { UserStats, DetectiveRank } from '../types';
import { User, Award, CheckCircle } from 'lucide-react';

interface Props {
  stats: UserStats;
}

const DetectiveProfile: React.FC<Props> = ({ stats }) => {
  return (
    <div className="bg-sepia-900 border-2 border-sepia-400 p-4 rounded-lg shadow-lg text-sepia-100 mb-6 lg:mb-0 lg:w-64 flex-shrink-0">
      <div className="flex items-center space-x-3 border-b border-sepia-800 pb-4 mb-4">
        <div className="bg-sepia-400 p-2 rounded-full text-sepia-900">
          <User size={24} />
        </div>
        <div>
          <h3 className="font-serif font-bold text-lg">{stats.rank}</h3>
          <p className="text-xs text-sepia-300">소속: 기계학습 탐정 사무소</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="flex items-center text-sm"><Award size={16} className="mr-2"/> 명성 포인트</span>
          <span className="font-bold text-sepia-400">{stats.score}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center text-sm"><CheckCircle size={16} className="mr-2"/> 해결한 사건</span>
          <span className="font-bold text-sepia-400">{stats.solvedCount}</span>
        </div>
        
        {stats.consecutiveWins > 1 && (
          <div className="mt-4 bg-green-900/30 border border-green-700/50 p-2 rounded text-xs text-green-400 text-center">
            🔥 {stats.consecutiveWins}연속 정답 행진 중!
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-sepia-800">
          <p className="text-xs text-sepia-500 italic text-center">
            "데이터는 거짓말을 하지 않네. 거짓말을 하는 건 사람이지."
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetectiveProfile;