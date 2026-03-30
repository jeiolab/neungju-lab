import React from 'react';
import { GameStats } from '../types';
import { Shield, Users, DollarSign, Smile } from 'lucide-react';

interface Props {
  stats: GameStats;
}

const StatItem: React.FC<{ icon: React.ReactNode; label: string; value: number; max?: number; color: string }> = ({ icon, label, value, max = 100, color }) => {
  // Budget is special, it doesn't really have a 'max' for the bar, but we scale it for display
  const percentage = label === '자금' ? Math.min((value / 20000) * 100, 100) : Math.min(value, 100);
  
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between text-xs font-medium text-slate-300">
        <span className="flex items-center gap-1">{icon} {label}</span>
        <span>{label === '자금' ? `$${value}` : value}</span>
      </div>
      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500`} 
          style={{ width: `${Math.max(0, percentage)}%` }}
        />
      </div>
    </div>
  );
};

const StatsBar: React.FC<Props> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg mb-6">
      <StatItem 
        icon={<Shield size={14} />} 
        label="보안" 
        value={stats.security} 
        color={stats.security < 30 ? 'bg-red-500' : 'bg-blue-500'} 
      />
      <StatItem 
        icon={<Users size={14} />} 
        label="유저 수" 
        value={stats.users} 
        max={10000}
        color="bg-green-500" 
      />
      <StatItem 
        icon={<DollarSign size={14} />} 
        label="자금" 
        value={stats.budget} 
        color={stats.budget < 2000 ? 'bg-red-500' : 'bg-yellow-500'} 
      />
      <StatItem 
        icon={<Smile size={14} />} 
        label="직원 만족도" 
        value={stats.happiness} 
        color={stats.happiness < 40 ? 'bg-orange-500' : 'bg-purple-500'} 
      />
    </div>
  );
};

export default StatsBar;