import React, { useEffect, useState } from 'react';
import { UserHistory, Badge } from '../types';
import { BADGES } from '../constants';
import { History, Award } from 'lucide-react';

interface DashboardProps {
  onStart: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStart }) => {
  const [history, setHistory] = useState<UserHistory[]>([]);
  const [badges, setBadges] = useState<Badge[]>(BADGES);

  useEffect(() => {
    // Load History
    const storedHistory = JSON.parse(localStorage.getItem('sim_history') || '[]');
    setHistory(storedHistory);

    // Calculate Badges (Simple logic demo)
    if (storedHistory.length > 0) {
      setBadges(prev => prev.map(b => b.id === 'beginner' ? { ...b, unlocked: true } : b));
    }
    const hasBalanced = storedHistory.some((h: UserHistory) => h.score.balance > 80);
    if (hasBalanced) {
      setBadges(prev => prev.map(b => b.id === 'balance_king' ? { ...b, unlocked: true } : b));
    }
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-2">환영합니다! 👋</h2>
        <p className="opacity-90 mb-6">데이터 공유의 딜레마를 직접 체험하고, 현명한 의사결정을 내려보세요.</p>
        <button 
          onClick={onStart}
          className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-lg shadow hover:bg-indigo-50 transition-colors"
        >
          시뮬레이션 시작하기
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Badges */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <Award className="mr-2 text-yellow-500"/> 나의 배지
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {badges.map(badge => (
              <div 
                key={badge.id} 
                className={`p-3 rounded-lg border ${badge.unlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-100 opacity-50'}`}
              >
                <div className="text-2xl mb-1 grayscale-[0]">{badge.unlocked ? badge.icon : '🔒'}</div>
                <div className="font-bold text-sm text-slate-800">{badge.name}</div>
                <div className="text-xs text-slate-500 leading-tight mt-1">{badge.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <History className="mr-2 text-slate-500"/> 최근 활동 기록
          </h3>
          {history.length === 0 ? (
            <div className="text-center text-slate-400 py-8 text-sm">
              아직 기록이 없습니다.<br/>첫 시뮬레이션을 진행해보세요!
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {history.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100 text-sm">
                   <div>
                     <span className="font-bold text-slate-700 block">{item.scenarioId === 'career' ? '진로 앱' : item.scenarioId === 'health' ? '건강 앱' : '교통 앱'}</span>
                     <span className="text-slate-400 text-xs">{new Date(item.date).toLocaleDateString()}</span>
                   </div>
                   <div className="text-right">
                     <span className="block font-bold text-indigo-600">균형 {item.score.balance}점</span>
                     <span className="text-xs text-slate-500">위험 {item.score.risk} / 편의 {item.score.convenience}</span>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;