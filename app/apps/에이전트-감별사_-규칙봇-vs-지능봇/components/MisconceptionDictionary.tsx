import React, { useState } from 'react';
import { MISCONCEPTIONS } from '../constants';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

const MisconceptionDictionary: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="text-orange-500" />
        <h2 className="text-xl font-bold text-slate-800">오답 유형 사전 (착각하기 쉬운 패턴)</h2>
      </div>
      
      <div className="space-y-3">
        {MISCONCEPTIONS.map((item) => (
          <div key={item.id} className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              <span className="font-bold text-slate-700">{item.title}</span>
              {openId === item.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
            </button>
            
            {openId === item.id && (
              <div className="p-4 bg-white animate-fade-in">
                <p className="text-red-500 font-medium mb-2 flex items-center gap-2 text-sm">
                   🚫 착각: {item.description}
                </p>
                <p className="text-green-600 font-medium flex items-center gap-2 text-sm">
                   ✅ 정답: {item.correction}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MisconceptionDictionary;