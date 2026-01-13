import React from 'react';
import { ThreatRecord } from '../types';
import { ShieldCheck, Skull, HelpCircle, SearchX } from 'lucide-react';

interface Props {
  records: ThreatRecord[];
}

const ThreatEncyclopedia: React.FC<Props> = ({ records }) => {
  if (records.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-slate-500">
            <SearchX size={64} className="mb-4 opacity-50" />
            <p className="text-xl">수집된 위협 데이터가 없습니다.</p>
            <p className="text-sm">실전 방어 시뮬레이션을 진행하여 데이터를 수집하세요.</p>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-purple-400 mb-8 text-center">위협 도감 (Threat Log)</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {records.map((record, idx) => (
          <div key={idx} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 flex flex-col md:flex-row">
            {/* Outcome Indicator */}
            <div className={`w-full md:w-4 flex items-center justify-center md:block ${
                record.outcome === 'INFECTED' ? 'bg-red-500' :
                record.outcome === 'DEFENDED' ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>

            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className={`inline-block px-2 py-1 text-xs font-bold rounded mb-2 ${
                            record.scenario.isSmishing ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'
                        }`}>
                            {record.scenario.isSmishing ? '⚠️ 악성 스미싱' : '✅ 정상 메시지'}
                        </span>
                        <h3 className="text-lg font-bold text-white">{record.scenario.sender}</h3>
                    </div>
                    <div className="text-slate-400 text-xs text-right">
                        {new Date(record.timestamp).toLocaleString()}
                        <div className="flex items-center justify-end gap-1 mt-1 font-bold">
                            {record.outcome === 'INFECTED' && <><Skull size={16} className="text-red-500"/> <span className="text-red-500">감염됨</span></>}
                            {record.outcome === 'DEFENDED' && <><ShieldCheck size={16} className="text-green-500"/> <span className="text-green-500">방어 성공</span></>}
                            {record.outcome === 'MISSED' && <><HelpCircle size={16} className="text-yellow-500"/> <span className="text-yellow-500">놓침/오판</span></>}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg text-slate-300 font-mono text-sm mb-4 border border-slate-700">
                    "{record.scenario.content}"
                </div>

                <div className="text-sm text-slate-400">
                    <strong className="text-purple-300">전문가 분석:</strong> {record.scenario.explanation}
                </div>
                {record.scenario.clues.length > 0 && (
                    <div className="mt-2 text-xs text-slate-500">
                        단서: {record.scenario.clues.join(', ')}
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThreatEncyclopedia;