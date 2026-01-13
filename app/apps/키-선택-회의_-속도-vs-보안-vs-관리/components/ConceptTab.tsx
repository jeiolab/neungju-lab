import React from 'react';
import { CONCEPTS } from '../constants';
import { Lock, Key, Hash, Layers, Cpu } from 'lucide-react';

const icons = {
  lock: Lock,
  key: Key,
  hash: Hash,
  layers: Layers,
  cpu: Cpu
};

const ConceptTab: React.FC = () => {
  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-2">🔐 암호화 방식 한 장 요약</h2>
        <p className="text-slate-600">상황에 맞는 열쇠를 고르는 것이 보안의 핵심입니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONCEPTS.map((concept) => {
          const Icon = icons[concept.icon as keyof typeof icons] || Lock;
          return (
            <div key={concept.method} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-lg">{concept.method}</h3>
              </div>
              <p className="text-slate-800 font-medium mb-3 min-h-[3rem]">{concept.summary}</p>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <span className="text-green-600 font-bold min-w-[3rem]">장점</span>
                  <span className="text-slate-600">{concept.pros}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-500 font-bold min-w-[3rem]">단점</span>
                  <span className="text-slate-600">{concept.cons}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConceptTab;