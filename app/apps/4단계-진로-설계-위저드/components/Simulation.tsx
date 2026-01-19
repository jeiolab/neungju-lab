import React, { useState } from 'react';
import { evaluateSimulation } from '../services/geminiService';

export const Simulation: React.FC = () => {
  const [scenario, setScenario] = useState("매일 1시간씩 코딩 공부를 한다.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);

  const handleSimulate = async () => {
    if (!scenario.trim()) return;
    setLoading(true);
    const res = await evaluateSimulation(scenario);
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
       <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-2xl text-white shadow-lg">
         <h2 className="text-2xl font-bold mb-2">🧪 진로 실험실</h2>
         <p className="opacity-90">내 계획의 한 요소를 바꾸면 성공 확률이 어떻게 달라질까요? AI가 예측해드립니다.</p>
       </div>

       <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <label className="block text-sm font-bold text-slate-700 mb-2">실험 조건 입력 (가정)</label>
         <div className="flex gap-2">
           <input 
             type="text"
             value={scenario}
             onChange={(e) => setScenario(e.target.value)}
             className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
             placeholder="예: 자격증 준비 기간을 1년에서 3개월로 줄인다."
           />
           <button 
             onClick={handleSimulate}
             disabled={loading || !process.env.API_KEY}
             className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 transition-colors"
           >
             {loading ? '분석 중...' : '실험 시작'}
           </button>
         </div>
         {!process.env.API_KEY && (
           <p className="text-red-500 text-xs mt-2">* API Key가 설정되지 않아 데모 모드로 작동하지 않을 수 있습니다.</p>
         )}
       </div>

       {result && (
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-lg animate-fade-in-up">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-bold text-slate-800">분석 결과</h3>
             <span className={`text-2xl font-black ${result.score > 70 ? 'text-green-600' : result.score > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
               현실성 {result.score}점
             </span>
           </div>
           
           <div className="w-full bg-slate-100 rounded-full h-4 mb-6">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ${result.score > 70 ? 'bg-green-500' : result.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${result.score}%` }}
              ></div>
           </div>

           <div className="bg-purple-50 p-4 rounded-lg text-purple-900 border border-purple-100">
             <p className="font-medium">💡 AI 코치의 피드백:</p>
             <p className="mt-1 text-sm leading-relaxed">{result.feedback}</p>
           </div>
         </div>
       )}
    </div>
  );
};
