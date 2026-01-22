import React from 'react';
import { TECH_INFO } from '../constants';
import { Shield, Key, FileDigit, Shuffle, Lock, Unlock } from 'lucide-react';

const TechComparison: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6" />
          암호 기술 총정리
        </h2>
        <p className="text-slate-300 mb-6">
          상황에 맞는 최적의 방패를 고르기 위해 각 기술의 특징을 숙지하십시오.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TECH_INFO.map((tech) => (
            <div key={tech.id} className="bg-slate-700 rounded-lg p-5 flex flex-col h-full hover:bg-slate-650 transition-colors border border-slate-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-slate-900 rounded-full text-blue-400">
                  {tech.id === 'symmetric' && <Key className="w-6 h-6" />}
                  {tech.id === 'asymmetric' && <div className="flex"><Key className="w-4 h-4" /><Key className="w-4 h-4 text-yellow-400 -ml-1" /></div>}
                  {tech.id === 'hash' && <FileDigit className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-bold text-white">{tech.name}</h3>
              </div>
              
              <p className="text-slate-300 text-sm mb-4 min-h-[40px]">{tech.description}</p>
              
              <div className="mb-4 flex-grow">
                <h4 className="font-semibold text-green-400 text-sm mb-2 flex items-center gap-1">
                   <Unlock className="w-3 h-3" /> 장점
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 mb-3">
                  {tech.pros.map((pro, idx) => <li key={idx}>{pro}</li>)}
                </ul>

                <h4 className="font-semibold text-red-400 text-sm mb-2 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> 단점
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {tech.cons.map((con, idx) => <li key={idx}>{con}</li>)}
                </ul>
              </div>

              <div className="bg-slate-800 p-3 rounded text-xs border border-slate-600">
                <span className="text-blue-300 font-bold">추천 상황:</span> {tech.bestUse}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Visual Analogy Section */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">💡 쉬운 비유 (Analogy)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 p-4 rounded-lg">
            <h4 className="text-blue-400 font-bold mb-2">대칭키 = 현관 열쇠</h4>
            <p className="text-sm text-slate-400">가족끼리 똑같은 열쇠를 복사해서 가짐. 열쇠를 잃어버리면 도둑이 듦. 열쇠 전달이 어려움.</p>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg">
            <h4 className="text-yellow-400 font-bold mb-2">공개키 = 자물쇠와 열쇠</h4>
            <p className="text-sm text-slate-400">누구나 내 우체통에 편지를 넣을 수 있음(공개키-자물쇠). 하지만 꺼내는 건 나만 가능(개인키-열쇠).</p>
          </div>
          <div className="bg-slate-900 p-4 rounded-lg">
            <h4 className="text-purple-400 font-bold mb-2">해시 = 지문</h4>
            <p className="text-sm text-slate-400">사람은 달라도 지문은 고유함. 지문만 보고 사람의 얼굴을 그려낼 수는 없음(복호화 불가).</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechComparison;