import React from 'react';
import { CONCEPTS } from '../constants';
import { UserState } from '../types';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  userState: UserState;
  onUpdateWeakness: (concept: string) => void;
}

export const TabConcepts: React.FC<Props> = ({ userState, onUpdateWeakness }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-500" />
          연구원님, IoT 해부학 개론입니다.
        </h2>
        <p className="text-slate-600">
          사물인터넷(IoT) 시스템은 크게 네 가지 단계(DNPC)로 이루어집니다. 
          각 단계가 원활하게 연결되어야 스마트워치가 '꿀잠' 여부를 알려줄 수 있죠.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONCEPTS.map((c) => {
          const isWeak = userState.weakConcept === c.title;
          return (
            <div 
              key={c.step} 
              className={`relative p-5 rounded-xl border-2 transition-all cursor-pointer ${
                isWeak ? 'border-red-400 bg-red-50' : 'border-slate-100 bg-white hover:border-indigo-200'
              }`}
              onClick={() => onUpdateWeakness(c.title)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-slate-50 rounded-lg">{c.icon}</div>
                <div className="text-xs font-bold text-slate-400 px-2 py-1 bg-slate-100 rounded-full">STEP {c.step}</div>
              </div>
              <h3 className="font-bold text-lg text-slate-800">{c.title}</h3>
              <p className="text-sm text-indigo-600 font-medium mb-2">({c.dnpc})</p>
              <p className="text-sm text-slate-600 leading-relaxed">{c.desc}</p>
              
              <div className="absolute top-4 right-4">
                 {isWeak ? (
                   <span className="text-xs text-red-500 font-bold flex items-center gap-1">
                     <HelpCircle size={14}/> 헷갈림
                   </span>
                 ) : (
                   <span className="text-xs text-slate-300">클릭하여 체크</span>
                 )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-indigo-50 p-4 rounded-xl text-center text-sm text-indigo-800 font-medium">
        💡 팁: 이해하기 가장 어려운 단계를 클릭해서 표시해두세요. 퀴즈에서 집중 공략합니다!
      </div>
    </div>
  );
};