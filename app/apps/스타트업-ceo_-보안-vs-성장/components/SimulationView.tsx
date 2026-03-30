import React from 'react';
import { Scenario, Choice, LogEntry } from '../types';
import { Loader2 } from 'lucide-react';

interface Props {
  scenario: Scenario | null;
  loading: boolean;
  onChoice: (choice: Choice) => void;
  logs: LogEntry[];
  gameOver: boolean;
  onRestart: () => void;
}

const SimulationView: React.FC<Props> = ({ scenario, loading, onChoice, logs, gameOver, onRestart }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-400">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p>자문단과 상의 중 (시나리오 생성 중)...</p>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center space-y-6">
        <h2 className="text-3xl font-bold text-white">시뮬레이션 종료</h2>
        <p className="text-slate-400 max-w-md">CEO로서의 임기가 끝났습니다. 리포트 탭에서 성과 분석을 확인하세요.</p>
        <button 
          onClick={onRestart}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors"
        >
          새로운 회사 시작하기
        </button>
      </div>
    );
  }

  if (!scenario) return <div>시나리오 로드 중 오류가 발생했습니다.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Main Scenario Card */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
           <h2 className="text-2xl font-bold text-white mb-2">{scenario.title}</h2>
           <p className="text-slate-300 text-lg leading-relaxed mb-8">{scenario.description}</p>
           
           <div className="space-y-3">
             {scenario.choices.map((choice) => (
               <button
                 key={choice.id}
                 onClick={() => onChoice(choice)}
                 className="w-full text-left p-4 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 hover:border-indigo-400 transition-all group"
               >
                 <div className="flex justify-between items-center">
                   <span className="font-semibold text-slate-100 group-hover:text-white">선택 {choice.id}: {choice.text}</span>
                   {/* Hints about impact */}
                   <div className="flex gap-2 text-xs opacity-50 group-hover:opacity-100">
                      {choice.effect.security !== undefined && choice.effect.security !== 0 && (
                        <span className={choice.effect.security > 0 ? 'text-blue-300' : 'text-red-300'}>
                          보안 {choice.effect.security > 0 ? '+' : ''}{choice.effect.security}
                        </span>
                      )}
                      {choice.effect.budget !== undefined && choice.effect.budget !== 0 && (
                        <span className={choice.effect.budget > 0 ? 'text-green-300' : 'text-red-300'}>
                          $
                        </span>
                      )}
                   </div>
                 </div>
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* Right: Event Log */}
      <div className="lg:col-span-1">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-full max-h-[500px] flex flex-col">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            시스템 로그
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide pr-2">
            {logs.slice().reverse().map((log, idx) => (
              <div key={idx} className={`text-sm p-3 rounded bg-slate-800/50 border-l-2 ${
                log.type === 'danger' ? 'border-red-500 text-red-200' :
                log.type === 'success' ? 'border-green-500 text-green-200' :
                'border-blue-500 text-slate-300'
              }`}>
                <span className="text-xs font-mono opacity-50 block mb-1">{log.week}주차</span>
                {log.message}
              </div>
            ))}
            {logs.length === 0 && <p className="text-slate-600 italic text-center text-sm mt-10">시뮬레이션 초기화 완료.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationView;