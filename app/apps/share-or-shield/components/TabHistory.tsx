import React from 'react';
import { GameHistoryItem, ClassificationType } from '../types';

interface TabHistoryProps {
  history: GameHistoryItem[];
}

const TabHistory: React.FC<TabHistoryProps> = ({ history }) => {
  const reversedHistory = [...history].reverse();
  const total = history.length;
  const correct = history.filter(h => h.userChoice === h.correctType).length;
  const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);

  return (
    <div className="h-full overflow-y-auto p-6 pb-24">
       <header className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2 font-tech">LOGS</h1>
        <div className="flex gap-4">
             <div className="bg-slate-800 p-3 rounded-lg flex-1 border border-slate-700">
                 <div className="text-xs text-slate-400">ACCURACY</div>
                 <div className={`text-xl font-bold ${accuracy > 80 ? 'text-green-400' : 'text-white'}`}>{accuracy}%</div>
             </div>
             <div className="bg-slate-800 p-3 rounded-lg flex-1 border border-slate-700">
                 <div className="text-xs text-slate-400">TOTAL</div>
                 <div className="text-xl font-bold text-white">{total}</div>
             </div>
        </div>
      </header>

      <div className="space-y-3">
        {reversedHistory.length === 0 && (
            <div className="text-center text-slate-500 py-10">
                기록된 데이터가 없습니다.
            </div>
        )}
        {reversedHistory.map((item, idx) => {
            const isCorrect = item.userChoice === item.correctType;
            return (
                <div key={idx} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-12 rounded-full ${item.correctType === ClassificationType.SHIELD ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                        <div>
                            <div className="font-bold text-slate-200">{item.cardTitle}</div>
                            <div className="text-xs text-slate-500">
                                정답: {item.correctType} | 선택: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>{item.userChoice}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-xl">
                        {isCorrect ? <i className="fas fa-check text-green-500"></i> : <i className="fas fa-xmark text-red-500"></i>}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default TabHistory;
