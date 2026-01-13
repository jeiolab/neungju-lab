import React from 'react';
import { UserStats } from '../types';
import { Award, Flame, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
    stats: UserStats;
    onStartNew: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, onStartNew }) => {
    
    const data = [
        { name: '완료', value: stats.projectsCompleted },
        { name: '목표', value: 5 - stats.projectsCompleted > 0 ? 5 - stats.projectsCompleted : 0 },
    ];
    const COLORS = ['#3b82f6', '#e5e7eb'];

    return (
        <div className="p-4 md:p-8 space-y-8 animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">나의 연구실 🧪</h1>
                <p className="text-gray-500">지속가능한 미래를 위한 AI 프로젝트 현황입니다.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Level Card */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-indigo-100 font-medium mb-1">현재 레벨</p>
                            <h2 className="text-4xl font-black">Lv. {stats.level}</h2>
                        </div>
                        <Award size={40} className="text-yellow-300" />
                    </div>
                    <div className="mt-6 bg-white/20 rounded-full h-2 overflow-hidden">
                        <div className="bg-yellow-300 h-full w-[60%]"></div>
                    </div>
                    <p className="text-xs mt-2 text-indigo-100">다음 레벨까지 40 XP 남음</p>
                </div>

                {/* Streak Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                     <div className="flex justify-between items-center">
                        <h3 className="text-gray-500 font-medium">연속 탐구일</h3>
                        <Flame className={`text-orange-500 ${stats.streak > 0 ? 'animate-pulse' : ''}`} size={32} />
                    </div>
                    <div className="text-center py-4">
                        <span className="text-5xl font-bold text-gray-800">{stats.streak}</span>
                        <span className="text-gray-400 ml-2">일 째</span>
                    </div>
                    <p className="text-center text-sm text-gray-400">매일 조금씩 성장하고 있어요!</p>
                </div>

                {/* Project Stats Chart */}
                 <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-gray-500 font-medium mb-2">프로젝트 달성률</h3>
                    <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                     <p className="text-center text-sm font-bold text-blue-600">{stats.projectsCompleted}개 완료!</p>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Zap size={20} className="text-yellow-500"/> 보유 배지
                </h3>
                <div className="flex flex-wrap gap-4">
                    {stats.badges.length > 0 ? stats.badges.map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-full text-sm font-bold shadow-sm">
                            🏅 {badge}
                        </div>
                    )) : (
                        <p className="text-gray-400 text-sm">아직 획득한 배지가 없습니다. 첫 프로젝트를 완료해보세요!</p>
                    )}
                </div>
            </div>

            <div className="mt-12 text-center">
                <button 
                    onClick={onStartNew}
                    className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl hover:bg-blue-700 hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                    + 새 프로젝트 시작하기
                </button>
            </div>
        </div>
    );
};