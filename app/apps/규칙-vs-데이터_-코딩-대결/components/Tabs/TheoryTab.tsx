import React, { useEffect } from 'react';
import { THEORY_CONTENT } from '../../constants';
import { ScrollText, BrainCircuit, ArrowRight, CheckCircle2 } from 'lucide-react';

interface TheoryTabProps {
  onComplete: () => void;
}

const TheoryTab: React.FC<TheoryTabProps> = ({ onComplete }) => {
  
  useEffect(() => {
    // Mark as viewed immediately for demo purposes, 
    // or add a button "I understand" to trigger it.
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">어떻게 문제를 해결할까?</h2>
        <p className="text-slate-600">전통적 방식과 기계학습의 접근 방식을 비교해봅시다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Traditional Card */}
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-blue-500 p-6 flex flex-col items-center">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <ScrollText className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-blue-700 mb-2">{THEORY_CONTENT.traditional.title}</h3>
          <p className="text-center text-slate-600 mb-6">{THEORY_CONTENT.traditional.desc}</p>
          
          <div className="flex flex-col items-center space-y-2 w-full">
            <div className="bg-slate-100 px-4 py-2 rounded-lg w-full text-center font-medium">1. {THEORY_CONTENT.traditional.process[0]}</div>
            <ArrowRight className="text-slate-400 rotate-90 md:rotate-90" />
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full text-center font-bold shadow-md">2. {THEORY_CONTENT.traditional.process[1]}</div>
            <ArrowRight className="text-slate-400 rotate-90 md:rotate-90" />
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg w-full text-center font-medium">3. {THEORY_CONTENT.traditional.process[2]}</div>
          </div>
        </div>

        {/* ML Card */}
        <div className="bg-white rounded-xl shadow-lg border-t-4 border-purple-500 p-6 flex flex-col items-center">
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <BrainCircuit className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-purple-700 mb-2">{THEORY_CONTENT.ml.title}</h3>
          <p className="text-center text-slate-600 mb-6">{THEORY_CONTENT.ml.desc}</p>
          
          <div className="flex flex-col items-center space-y-2 w-full">
            <div className="flex w-full gap-2">
              <div className="bg-slate-100 px-2 py-2 rounded-lg flex-1 text-center font-medium text-sm">1. {THEORY_CONTENT.ml.process[0]}</div>
              <div className="bg-slate-100 px-2 py-2 rounded-lg flex-1 text-center font-medium text-sm">2. {THEORY_CONTENT.ml.process[1]}</div>
            </div>
            <ArrowRight className="text-slate-400 rotate-90 md:rotate-90" />
            <div className="bg-purple-600 text-white px-4 py-2 rounded-lg w-full text-center font-bold shadow-md animate-pulse">3. {THEORY_CONTENT.ml.process[2]}</div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-amber-800">핵심 포인트</h4>
          <p className="text-amber-700 text-sm">
            기계학습은 규칙이 없는 것이 아닙니다! <br/>
            단지 <strong>사람이 규칙을 직접 짜지 않고</strong>, 컴퓨터가 수많은 데이터를 보고 <strong>스스로 규칙(모델)을 만들어내는 것</strong>입니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TheoryTab;
