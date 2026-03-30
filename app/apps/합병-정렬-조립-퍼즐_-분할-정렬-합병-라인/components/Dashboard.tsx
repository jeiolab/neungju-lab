import React from 'react';
import { UserStats } from '../types';
import { BADGES } from '../constants';
import { motion } from 'framer-motion';

interface Props {
  userStats: UserStats;
}

const Dashboard: React.FC<Props> = ({ userStats }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <h2 className="text-3xl font-black mb-1">나의 코칭 현황</h2>
                <p className="opacity-80">합병 정렬 마스터를 향한 여정</p>
            </div>
            <div className="flex gap-8 text-center">
                <div>
                    <div className="text-4xl font-bold">{userStats.level}</div>
                    <div className="text-xs uppercase tracking-widest opacity-70">Level</div>
                </div>
                <div>
                    <div className="text-4xl font-bold">{userStats.xp}</div>
                    <div className="text-xs uppercase tracking-widest opacity-70">XP</div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">획득한 배지</h3>
            <div className="grid grid-cols-3 gap-4">
                {BADGES.map(badge => {
                    const isUnlocked = badge.condition(userStats);
                    return (
                        <div key={badge.id} className={`flex flex-col items-center p-3 rounded-lg border text-center
                            ${isUnlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-100 opacity-50 grayscale'}
                        `}>
                            <div className="text-3xl mb-2">{badge.icon}</div>
                            <div className="font-bold text-xs text-gray-800">{badge.name}</div>
                            {isUnlocked && <div className="text-[10px] text-yellow-600 mt-1">획득!</div>}
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">활동 기록</h3>
            <ul className="space-y-4">
                <li className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-600">완료한 퍼즐</span>
                    <span className="font-bold text-blue-600">{userStats.completedPuzzles}회</span>
                </li>
                <li className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-600">합병 게임 승리</span>
                    <span className="font-bold text-green-600">{userStats.mergeGameWins}회</span>
                </li>
                <li className="flex justify-between items-center border-b pb-2">
                    <span className="text-gray-600">최대 연속 합병 성공</span>
                    <span className="font-bold text-orange-600">{userStats.consecutiveMerges}회</span>
                </li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
