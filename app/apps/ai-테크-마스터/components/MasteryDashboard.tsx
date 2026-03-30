import React from 'react';
import { MasteryState } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, AlertCircle, RefreshCw } from 'lucide-react';

interface MasteryDashboardProps {
  mastery: MasteryState;
  resetMastery: () => void;
}

const MasteryDashboard: React.FC<MasteryDashboardProps> = ({ mastery, resetMastery }) => {
  const data = [
    { name: 'Vision', score: mastery.VISION, color: '#3b82f6' },
    { name: 'NLP', score: mastery.NLP, color: '#22c55e' },
    { name: 'GenAI', score: mastery.GEN_AI, color: '#a855f7' },
  ];

  const getLowestScore = () => {
    const entries = Object.entries(mastery) as [string, number][];
    entries.sort((a, b) => a[1] - b[1]);
    return entries[0];
  };

  const [weakestSubject, weakestScore] = getLowestScore();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900">내 학습 현황</h3>
        <button onClick={resetMastery} className="text-gray-400 hover:text-gray-600" title="초기화">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4 flex-1">
        <h4 className="font-bold text-gray-700 text-sm">마스터리 배지</h4>
        <div className="flex gap-2">
            {mastery.VISION >= 80 && (
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center" title="Vision Master">
                    <Trophy size={16} />
                </div>
            )}
             {mastery.NLP >= 80 && (
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center" title="NLP Master">
                    <Trophy size={16} />
                </div>
            )}
             {mastery.GEN_AI >= 80 && (
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center" title="GenAI Master">
                    <Trophy size={16} />
                </div>
            )}
            {mastery.VISION < 80 && mastery.NLP < 80 && mastery.GEN_AI < 80 && (
                <span className="text-xs text-gray-400">아직 획득한 배지가 없습니다. (80점 이상)</span>
            )}
        </div>

        {weakestScore < 50 && (
            <div className="mt-6 bg-red-50 p-4 rounded-xl border border-red-100">
                <div className="flex items-center text-red-700 font-bold text-sm mb-1">
                    <AlertCircle size={16} className="mr-2" />
                    취약점 분석
                </div>
                <p className="text-xs text-red-600 leading-relaxed">
                    <strong>{weakestSubject}</strong> 분야의 이해도가 낮습니다. 
                    관련 퀴즈나 시뮬레이션을 다시 복습해보세요.
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default MasteryDashboard;