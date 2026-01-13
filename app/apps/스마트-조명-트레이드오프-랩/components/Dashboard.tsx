import React from 'react';
import { Award, TrendingUp, Calendar, Grid, BarChart2 } from 'lucide-react';
import { UserProgress, Design, Badge } from '../types';
import { BADGES } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardProps {
  progress: UserProgress;
  designs: Design[];
}

const Dashboard: React.FC<DashboardProps> = ({ progress, designs }) => {
  const earnedBadgeIds = new Set(progress.badges);
  const recentDesigns = designs.slice(0, 3);

  // Data for comparison chart
  const comparisonData = recentDesigns.map((d, idx) => ({
    name: `설계 ${idx + 1}`,
    에너지: d.scores.energy,
    편의성: d.scores.convenience,
    프라이버시: d.scores.privacy,
  })).reverse(); // Show oldest to newest in chart left to right

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Award className="text-yellow-500" />} label="레벨" value={`Lv.${progress.level}`} />
        <StatCard icon={<Grid className="text-blue-500" />} label="설계 제출" value={`${progress.designsCount}회`} />
        <StatCard icon={<TrendingUp className="text-green-500" />} label="경험치" value={`${progress.xp} XP`} />
        <StatCard icon={<Calendar className="text-purple-500" />} label="연속 접속" value={`${progress.streak}일`} />
      </div>

      {/* Comparison Section */}
      {recentDesigns.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart2 className="text-indigo-600" /> 최근 설계안 비교
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="에너지" fill="#10b981" />
                <Bar dataKey="편의성" fill="#3b82f6" />
                <Bar dataKey="프라이버시" fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentDesigns.map((d) => (
                  <div key={d.id} className="text-sm p-3 bg-slate-50 rounded border border-slate-100">
                      <div className="font-bold text-slate-700 truncate">{d.name}</div>
                      <div className="text-slate-500 text-xs mt-1 line-clamp-2">"{d.reflection}"</div>
                      <div className="text-xs text-slate-400 mt-2">{new Date(d.timestamp).toLocaleDateString()}</div>
                  </div>
              ))}
          </div>
        </div>
      )}

      {/* Badges */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6">획득한 배지</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map((badge) => {
            const isEarned = earnedBadgeIds.has(badge.id);
            return (
              <div 
                key={badge.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  isEarned 
                    ? 'bg-indigo-50 border-indigo-200' 
                    : 'bg-slate-50 border-slate-100 opacity-60 grayscale'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm ${
                    isEarned ? 'bg-white text-indigo-600' : 'bg-slate-200 text-slate-400'
                }`}>
                    <BadgeIcon name={badge.icon} />
                </div>
                <div>
                  <h4 className={`font-bold ${isEarned ? 'text-indigo-900' : 'text-slate-500'}`}>{badge.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Simple generic icon mapper
const BadgeIcon = ({ name }: { name: string }) => {
    // Icons are already imported in parent or mapped here if dynamic import was possible.
    // For simplicity, using simple mapping logic or just returning a generic icon if complexity is high.
    // Since we import Lucide icons in parent, we could pass the component, but string mapping is safer for JSON data.
    return <Award />; 
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-lg font-bold text-slate-800">{value}</div>
    </div>
  </div>
);

export default Dashboard;
