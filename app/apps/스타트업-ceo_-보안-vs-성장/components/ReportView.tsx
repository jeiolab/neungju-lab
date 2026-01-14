import React, { useEffect, useState } from 'react';
import { GameStats, LogEntry } from '../types';
import { generateEndGameReport } from '../services/geminiService';
import { Loader2, FileText } from 'lucide-react';

interface Props {
  stats: GameStats;
  logs: LogEntry[];
  week: number;
}

const ReportView: React.FC<Props> = ({ stats, logs, week }) => {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      // Construct a summary string of logs
      const historyLog = logs.map(l => `${l.week}주차: ${l.message}`).join('\n');
      const result = await generateEndGameReport(stats, historyLog);
      setReport(result);
      setLoading(false);
    };

    if (!report && week > 1) {
      fetchReport();
    }
  }, [stats, logs, week, report]);

  return (
    <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
        <div className="p-3 bg-indigo-600 rounded-lg">
          <FileText className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">이사회 리포트</h2>
          <p className="text-slate-400">분기별 경영 성과 분석</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 p-4 rounded text-center">
          <p className="text-xs text-slate-500 uppercase">최종 보안 점수</p>
          <p className="text-xl font-bold text-blue-400">{stats.security}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded text-center">
          <p className="text-xs text-slate-500 uppercase">총 유저 수</p>
          <p className="text-xl font-bold text-green-400">{stats.users}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded text-center">
          <p className="text-xs text-slate-500 uppercase">최종 자금</p>
          <p className="text-xl font-bold text-yellow-400">${stats.budget}</p>
        </div>
        <div className="bg-slate-900 p-4 rounded text-center">
          <p className="text-xs text-slate-500 uppercase">직원 만족도</p>
          <p className="text-xl font-bold text-purple-400">{stats.happiness}%</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-500">
          <Loader2 className="animate-spin mr-2" /> AI 분석 생성 중...
        </div>
      ) : (
        <div className="prose prose-invert max-w-none">
           <h3 className="text-lg font-semibold text-indigo-300 mb-2">리더십 분석</h3>
           <div className="whitespace-pre-line text-slate-300 leading-relaxed bg-slate-700/30 p-6 rounded-lg border border-slate-600">
             {report || "게임을 플레이하면 리포트가 생성됩니다."}
           </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;