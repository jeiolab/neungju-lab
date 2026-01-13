import React, { useState, useEffect } from 'react';
import { Scale, Activity, CheckCircle, XCircle } from 'lucide-react';

const LabFruit: React.FC = () => {
  const [brix, setBrix] = useState<number>(10); // 0-20
  const [weight, setWeight] = useState<number>(300); // 0-1000g
  const [result, setResult] = useState<'pass' | 'fail'>('fail');
  const [probability, setProbability] = useState<number>(0);

  // Simple logistic regression simulation
  // Formula simulation: P = 1 / (1 + e^-(w1*brix + w2*weight + b))
  useEffect(() => {
    // Normalizing inputs roughly
    const normBrix = (brix - 10) / 5; // Center around 10
    const normWeight = (weight - 400) / 200; // Center around 400g

    // Hypothetical weights: Sweetness is more important
    const z = (1.5 * normBrix) + (0.5 * normWeight) - 0.5; 
    const p = 1 / (1 + Math.exp(-z));
    
    setProbability(p);
    setResult(p > 0.5 ? 'pass' : 'fail');
  }, [brix, weight]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <Scale className="w-6 h-6 text-orange-500" />
        <h3 className="text-xl font-bold text-slate-800">과일 분류기 (지도 학습)</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex justify-between">
              <span>당도 (Brix)</span>
              <span className="text-orange-600 font-bold">{brix} Bx</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="20" 
              step="0.5" 
              value={brix} 
              onChange={(e) => setBrix(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <p className="text-xs text-slate-500 mt-1">높을수록 달콤합니다.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex justify-between">
              <span>무게 (g)</span>
              <span className="text-blue-600 font-bold">{weight} g</span>
            </label>
            <input 
              type="range" 
              min="100" 
              max="1000" 
              step="10" 
              value={weight} 
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">적당한 무게가 상품성이 좋습니다.</p>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-600">
            <strong className="block mb-1">연구 노트:</strong>
            로지스틱 회귀 알고리즘이 당도와 무게를 분석하여 0과 1 사이의 확률을 계산합니다. 확률이 50%를 넘으면 "판매 가능"으로 분류합니다.
          </div>
        </div>

        {/* Visualization */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden">
          {/* S-Curve Visualization Background (simplified) */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <svg width="100%" height="100%">
               <path d="M0,100 C 150,100 150,0 300,0" stroke="black" fill="none" strokeWidth="2" />
             </svg>
          </div>

          <div className={`relative z-10 w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 ${
            result === 'pass' ? 'bg-green-100 ring-4 ring-green-400' : 'bg-red-100 ring-4 ring-red-400'
          }`}>
             {result === 'pass' ? (
               <CheckCircle className="w-20 h-20 text-green-600 animate-pulse" />
             ) : (
               <XCircle className="w-20 h-20 text-red-600" />
             )}
          </div>

          <div className="mt-6 text-center z-10">
            <div className="text-3xl font-black mb-1">
              {result === 'pass' ? 
                <span className="text-green-600">판매 가능</span> : 
                <span className="text-red-600">판매 불가</span>
              }
            </div>
            <div className="text-sm font-mono text-slate-500">
              판정 확률: {(probability * 100).toFixed(1)}%
            </div>
             <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all duration-300 ${probability > 0.5 ? 'bg-green-500' : 'bg-red-500'}`} 
                style={{ width: `${probability * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabFruit;