import React, { useEffect, useState } from 'react';
import { RankingRecord } from '../types';

const TabRanking: React.FC = () => {
  const [records, setRecords] = useState<RankingRecord[]>([]);

  useEffect(() => {
    const existing = localStorage.getItem('ranking');
    if (existing) {
      setRecords(JSON.parse(existing));
    }
  }, []);

  return (
    <div className="h-full overflow-y-auto p-6 pb-24">
      <header className="mb-8 text-center">
        <div className="w-16 h-16 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 text-3xl mb-4">
            <i className="fas fa-trophy"></i>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 font-tech">HALL OF FAME</h1>
        <p className="text-slate-400">데이터 센터 최고의 분류 요원</p>
      </header>

      <div className="space-y-4">
        {records.length === 0 ? (
            <div className="text-center text-slate-500 bg-slate-800/50 rounded-xl p-8 border border-slate-700">
                아직 등록된 랭킹이 없습니다.<br/>
                게임 탭에서 '랭킹 챌린지'에 도전하세요!
            </div>
        ) : (
            records.map((record, index) => (
                <div key={index} className="relative bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center gap-4 overflow-hidden group hover:border-amber-500/50 transition-colors">
                    <div className={`text-4xl font-black font-tech opacity-20 absolute -right-2 -bottom-4 group-hover:opacity-40 transition-opacity ${index === 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                        #{index + 1}
                    </div>
                    
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-lg
                        ${index === 0 ? 'bg-amber-400 text-amber-900' : 
                          index === 1 ? 'bg-slate-300 text-slate-900' : 
                          index === 2 ? 'bg-amber-700 text-amber-100' : 'bg-slate-700 text-slate-400'}`}>
                        {index + 1}
                    </div>

                    <div className="flex-1">
                        <div className="text-xs text-slate-500">{new Date(record.date).toLocaleDateString()}</div>
                        <div className="text-xl font-bold text-white">{record.score.toLocaleString()} pts</div>
                    </div>

                    <div className="text-right">
                        <div className="text-xs text-slate-500">MAX COMBO</div>
                        <div className="text-amber-400 font-bold font-tech">{record.comboMax}</div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default TabRanking;
