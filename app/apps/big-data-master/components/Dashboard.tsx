import React from 'react';
import { JobTitle } from '../types';
import { Award, Database, Zap, Layers } from 'lucide-react';

interface DashboardProps {
  score: number;
  level: number;
  title: JobTitle;
  volume: number;
  velocity: number;
  variety: number;
}

const StatBar: React.FC<{ label: string; value: number; max: number; icon: React.ReactNode; color: string; unit: string }> = ({ label, value, max, icon, color, unit }) => (
  <div className="flex flex-col w-full px-2">
    <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
      <div className="flex items-center gap-1">
        {icon}
        <span>{label}</span>
      </div>
      <span>{value}{unit}</span>
    </div>
    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-500 ease-out`} 
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ score, level, title, volume, velocity, variety }) => {
  return (
    <div className="fixed top-0 left-0 w-full p-4 z-50 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl p-4 flex flex-col md:flex-row gap-4 text-white pointer-events-auto">
        
        {/* Profile / Level Section */}
        <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-700 pb-4 md:pb-0 md:pr-6 min-w-[200px]">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
            <Award className="text-white" size={24} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold uppercase">Current Rank</div>
            <div className="text-sm font-bold text-cyan-400">{title}</div>
            <div className="text-xs text-slate-300">Score: {score}</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatBar 
            label="Volume (규모)" 
            value={volume} 
            max={100} 
            unit="PB" 
            icon={<Database size={12}/>} 
            color="bg-purple-500" 
          />
          <StatBar 
            label="Velocity (속도)" 
            value={velocity} 
            max={500} 
            unit="ms" 
            icon={<Zap size={12}/>} 
            color="bg-yellow-500" 
          />
          <StatBar 
            label="Variety (다양성)" 
            value={variety} 
            max={100} 
            unit="점" 
            icon={<Layers size={12}/>} 
            color="bg-pink-500" 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;