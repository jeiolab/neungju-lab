import React, { useEffect, useState } from 'react';
import { DatasetStats } from '../types';
import { generateAnalysisReport } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2, RefreshCw, Award } from 'lucide-react';

interface Props {
  stats: DatasetStats;
  onRestart: () => void;
}

const ResultStage: React.FC<Props> = ({ stats, onRestart }) => {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      const text = await generateAnalysisReport(stats);
      setReport(text);
      setLoading(false);
    };
    fetchReport();
  }, [stats]);

  const chartData = [
    { name: '초기 품질', score: Math.max(0, 100 - (stats.initialErrors * 15)) }, // Arbitrary formula for demo
    { name: '최종 품질', score: stats.qualityScore },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
          <Award className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">분석 완료!</h2>
        <p className="text-xl text-gray-600">이제 데이터셋이 AI 학습을 위해 준비되었습니다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Metric Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">품질 개선</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={60}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#94a3b8' : '#22c55e'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-500 px-4">
                <span>전: 엉망진창</span>
                <span>후: 깔끔함</span>
            </div>
        </div>

        {/* AI Report Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 bg-gradient-to-br from-white to-blue-50/50">
           <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
             <span className="mr-2">✨</span> AI 멘토 피드백
           </h3>
           
           {loading ? (
             <div className="h-48 flex items-center justify-center text-blue-500">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-3 font-medium">성과 분석 중...</span>
             </div>
           ) : (
             <div className="prose prose-sm prose-blue max-w-none">
               <div dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
             </div>
           )}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
        >
          <RefreshCw className="w-5 h-5" />
          <span>새 시뮬레이션 시작</span>
        </button>
      </div>
    </div>
  );
};

export default ResultStage;
