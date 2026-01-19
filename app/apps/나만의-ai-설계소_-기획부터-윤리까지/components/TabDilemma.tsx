import React, { useState } from 'react';
import { Truck, Users, User, MessageSquare } from 'lucide-react';
import { discussDilemma } from '../services/gemini';

const TabDilemma: React.FC = () => {
  const [selection, setSelection] = useState<'passengers' | 'pedestrians' | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const scenario = "자율주행차가 100km/h로 주행 중입니다. 갑자기 무단횡단하는 보행자 5명이 나타났습니다. 브레이크가 고장났습니다. 핸들을 꺾으면 벽에 부딪혀 탑승자(나) 1명이 사망하고, 그대로 가면 보행자 5명이 사망합니다.";

  const handleChoose = async (choice: 'passengers' | 'pedestrians') => {
    setSelection(choice);
    setLoading(true);
    setAnalysis(null);
    
    const choiceText = choice === 'passengers' 
      ? "핸들을 꺾지 않고 직진하여 보행자 5명을 희생시키고 탑승자 1명을 살린다." 
      : "핸들을 꺾어 벽에 충돌해 탑승자 1명을 희생시키고 보행자 5명을 살린다.";

    const result = await discussDilemma(choiceText, scenario);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-3xl font-bold mb-4">트롤리 딜레마 (Trolley Problem)</h2>
        <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          {scenario}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => handleChoose('passengers')}
          className={`group p-8 rounded-xl border-4 transition-all flex flex-col items-center gap-4 ${
            selection === 'passengers' 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-slate-200 hover:border-blue-300 bg-white'
          }`}
        >
          <div className="bg-blue-100 p-4 rounded-full group-hover:scale-110 transition-transform">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-2">직진한다</h3>
            <p className="text-slate-500 text-sm">보행자 5명 사망 / 탑승자 1명 생존</p>
          </div>
        </button>

        <button
          onClick={() => handleChoose('pedestrians')}
          className={`group p-8 rounded-xl border-4 transition-all flex flex-col items-center gap-4 ${
            selection === 'pedestrians' 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-slate-200 hover:border-indigo-300 bg-white'
          }`}
        >
          <div className="bg-indigo-100 p-4 rounded-full group-hover:scale-110 transition-transform">
            <Users className="w-10 h-10 text-indigo-600" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-2">핸들을 꺾는다</h3>
            <p className="text-slate-500 text-sm">탑승자 1명 사망 / 보행자 5명 생존</p>
          </div>
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
           <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-indigo-600 mb-2"></div>
           <p className="text-slate-500">AI 윤리 위원회가 당신의 결정을 분석 중입니다...</p>
        </div>
      )}

      {analysis && (
        <div className="bg-white border-l-4 border-purple-500 shadow-lg rounded-r-xl p-6 animate-fade-in">
          <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" /> AI 윤리 분석 결과
          </h3>
          <p className="text-slate-700 leading-relaxed whitespace-pre-line">
            {analysis}
          </p>
        </div>
      )}
    </div>
  );
};

export default TabDilemma;