import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { SKILL_DATA, TOP_JOBS } from '../constants';
import { TrendingUp, Award } from 'lucide-react';

const FutureExplore: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Skills Chart Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-50">
        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
          <Award className="text-indigo-600 mr-2" />
          미래 인재 핵심 역량
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          단순 지식 암기보다는 창의력과 문제 해결 능력이 중요합니다.
        </p>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILL_DATA}>
              <PolarGrid stroke="#e0e7ff" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="중요도"
                dataKey="A"
                stroke="#4f46e5"
                strokeWidth={3}
                fill="#6366f1"
                fillOpacity={0.4}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 Jobs Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md">
        <h2 className="text-xl font-bold mb-6 flex items-center text-slate-900">
          <TrendingUp className="text-blue-600 mr-2" />
          미래 유망 직업 TOP 5
        </h2>
        
        <div className="space-y-4">
          {TOP_JOBS.map((job) => (
            <div key={job.rank} className="flex items-center bg-slate-50 border border-slate-200 p-4 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-colors">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-600 text-white font-black rounded-lg mr-4">
                {job.rank}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{job.name}</h3>
                <p className="text-slate-600 text-sm">{job.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FutureExplore;
