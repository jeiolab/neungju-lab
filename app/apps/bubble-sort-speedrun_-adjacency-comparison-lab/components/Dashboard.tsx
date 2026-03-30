import React from 'react';
import { UserData } from '../types';
import { BADGES } from '../constants';
import { Trophy, Flame, History, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  userData: UserData;
}

const Dashboard: React.FC<DashboardProps> = ({ userData }) => {
  // Prepare data for chart (Last 5 attempts)
  const chartData = userData.history.slice(-5).map((h, idx) => ({
    name: `시도 ${idx + 1}`,
    swaps: h.swaps,
    comparisons: h.comparisons
  }));

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-indigo-600 text-white p-4 rounded-xl shadow-md">
            <div className="flex items-center gap-2 opacity-80 mb-1">
                <Trophy size={16} /> 레벨
            </div>
            <div className="text-3xl font-bold">{userData.level}</div>
            <div className="text-xs mt-1 bg-indigo-700 rounded-full h-2 w-full overflow-hidden">
                <div className="bg-yellow-400 h-full" style={{ width: `${(userData.xp % 100)}%` }}></div>
            </div>
        </div>
        <div className="bg-white text-slate-800 p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 text-rose-500 font-bold mb-1">
                <Flame size={16} /> 스트릭
            </div>
            <div className="text-3xl font-bold">{userData.streak}일</div>
            <div className="text-xs text-slate-400 mt-1">연속 접속 중</div>
        </div>
        <div className="bg-white text-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 col-span-2">
            <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2">
                <Award size={16} /> 보유 배지
            </div>
            <div className="flex gap-2 flex-wrap">
                {userData.badges.length > 0 ? (
                    userData.badges.map(badgeId => {
                        const b = BADGES.find(x => x.id === badgeId);
                        return (
                            <div key={badgeId} title={b?.desc} className="bg-slate-100 px-3 py-1 rounded-full text-sm border border-slate-200 flex items-center gap-1 cursor-help">
                                <span>{b?.icon}</span>
                                <span>{b?.name}</span>
                            </div>
                        )
                    })
                ) : (
                    <span className="text-slate-400 text-sm">아직 획득한 배지가 없습니다.</span>
                )}
            </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <History size={20} /> 최근 활동 분석
        </h3>
        <div className="h-64 w-full">
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" fontSize={12} stroke="#94a3b8" />
                        <YAxis fontSize={12} stroke="#94a3b8" />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                            cursor={{fill: '#f1f5f9'}}
                        />
                        <Bar dataKey="comparisons" name="비교 횟수" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="swaps" name="교환 횟수" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                    아직 데이터가 없습니다. 시뮬레이션을 완료해보세요!
                </div>
            )}
        </div>
      </div>

      {/* Mastery (Simplified) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">개념 마스터리</h3>
        <div className="space-y-4">
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">개념 이해</span>
                    <span className="font-bold text-indigo-600">{userData.mastery.concept}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${userData.mastery.concept}%` }}></div>
                </div>
            </div>
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">작동 원리 (기계적)</span>
                    <span className="font-bold text-emerald-600">{userData.mastery.mechanism}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${userData.mastery.mechanism}%` }}></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
