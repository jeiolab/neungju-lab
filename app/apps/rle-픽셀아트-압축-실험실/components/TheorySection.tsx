import React, { useState } from 'react';
import { Button } from './Button';

export const TheorySection: React.FC = () => {
  const [prediction, setPrediction] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Concept Cards */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-blue-600 mb-2">런 길이 부호화 (RLE)</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            "Run-Length Encoding"은 연속된 같은 데이터를 '값'과 '길이'로 묶어 표현하는 방식입니다.
            <br />
            <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-xs mt-2 inline-block">
              AAAABBB → A4B3
            </span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-green-600 mb-2">무손실 압축</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            데이터를 압축했다가 풀어도 원본과 <span className="font-bold">완벽하게 똑같은</span> 상태로 돌아옵니다.
            이미지가 깨지거나 흐려지지 않습니다.
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
        <h3 className="font-bold text-indigo-900 mb-4">💡 예측해보기</h3>
        <p className="text-sm text-indigo-800 mb-4">
          내가 복잡한 체크 무늬를 그리면 RLE 압축률은 어떻게 될까요?
        </p>
        
        <div className="flex gap-3">
          <Button 
            variant={prediction === 'good' ? 'primary' : 'secondary'} 
            onClick={() => setPrediction('good')}
            className="flex-1"
          >
            엄청 줄어든다 (좋음)
          </Button>
          <Button 
            variant={prediction === 'bad' ? 'primary' : 'secondary'} 
            onClick={() => setPrediction('bad')}
            className="flex-1"
          >
            오히려 커진다 (나쁨)
          </Button>
        </div>

        {prediction && (
          <div className="mt-4 p-3 bg-white rounded border border-indigo-100 text-sm animate-pulse">
            {prediction === 'good' 
              ? "🤔 음... 체크 무늬는 색이 계속 바뀌어서 연속된 구간이 적지 않을까요?" 
              : "✅ 정답! 색이 자주 바뀌면 '색+숫자'를 계속 기록해야 해서 오히려 용량이 커질 수 있습니다!"}
          </div>
        )}
      </div>
    </div>
  );
};