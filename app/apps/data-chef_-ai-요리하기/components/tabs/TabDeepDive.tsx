import React from 'react';
import { Trash2, ArrowRight, Ban } from 'lucide-react';

export const DeepDiveTab: React.FC = () => {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-8 rounded-2xl border border-red-100 shadow-sm">
        <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center gap-2">
          <Ban className="w-8 h-8" /> Garbage In, Garbage Out (GIGO)
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <p className="text-lg text-gray-800 font-medium leading-relaxed">
              "쓰레기가 들어가면, 쓰레기가 나온다."
            </p>
            <p className="text-gray-600">
              컴퓨터 과학과 기계학습의 가장 중요한 원칙입니다. 아무리 좋은 모델(최신 오븐)을 써도, 데이터(재료)가 나쁘면 결과물은 엉망이 됩니다.
            </p>
            <div className="bg-white p-4 rounded-xl border border-red-200 mt-4">
              <h4 className="font-bold text-red-600 mb-2">실제 사례</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>편향된 데이터로 학습하여 특정 인종을 인식 못하는 AI</li>
                <li>오타가 많은 데이터로 학습하여 엉뚱한 답을 하는 챗봇</li>
                <li>오래된 과거 데이터로 주가를 예측하려다 실패한 금융 AI</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
             <div className="flex items-center gap-4 mb-2">
                <div className="bg-white p-4 rounded-full shadow-md border border-gray-200 text-center w-24">
                   <div className="text-3xl mb-1">🗑️</div>
                   <div className="text-xs font-bold text-gray-500">나쁜 데이터</div>
                </div>
                <ArrowRight className="text-gray-400" />
                <div className="bg-white p-4 rounded-full shadow-md border border-gray-200 text-center w-24">
                   <div className="text-3xl mb-1">🤖</div>
                   <div className="text-xs font-bold text-gray-500">AI 모델</div>
                </div>
                <ArrowRight className="text-gray-400" />
                <div className="bg-white p-4 rounded-full shadow-md border border-gray-200 text-center w-24">
                   <div className="text-3xl mb-1">💩</div>
                   <div className="text-xs font-bold text-gray-500">나쁜 결과</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};