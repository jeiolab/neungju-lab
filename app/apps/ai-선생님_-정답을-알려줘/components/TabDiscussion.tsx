import React, { useState } from 'react';
import { generateBiasScenario } from '../services/geminiService';
import { Brain, MessageSquare, AlertTriangle } from 'lucide-react';

const TabDiscussion: React.FC = () => {
  const [scenario, setScenario] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateBiasScenario();
    setScenario(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl border border-amber-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-200 rounded-full text-amber-800">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">생각해 볼 문제: AI와 편향성</h2>
            <p className="text-gray-700 leading-relaxed">
              만약 우리가 AI에게 <strong>잘못된 세상의 모습</strong>만 가르치면 어떻게 될까요?<br/>
              지도학습은 데이터가 곧 선생님입니다. 선생님이 편견을 가지고 가르치면, 학생(AI)도 편견을 배웁니다.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-500" /> AI가 만드는 가상의 편향 시나리오
          </h3>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? '생성 중...' : '새로운 시나리오 만들기'}
          </button>
        </div>

        <div className="bg-gray-50 min-h-[200px] rounded-xl p-6 border border-gray-200">
          {scenario ? (
             <div className="prose prose-indigo max-w-none whitespace-pre-line text-gray-700">
               {scenario}
             </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <MessageSquare className="w-8 h-8 opacity-20" />
              <p>버튼을 눌러 AI 윤리 문제를 확인해보세요.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-6 rounded-xl">
            <h4 className="font-bold text-blue-800 mb-2">💡 편향을 줄이려면?</h4>
            <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
                <li>다양한 데이터를 수집해야 합니다.</li>
                <li>특정 집단에 치우치지 않았는지 검사해야 합니다.</li>
                <li>AI의 결정을 사람이 지속적으로 모니터링해야 합니다.</li>
            </ul>
        </div>
        <div className="bg-red-50 p-6 rounded-xl">
            <h4 className="font-bold text-red-800 mb-2">⚠️ Garbage In, Garbage Out</h4>
            <p className="text-red-900 text-sm">
                "쓰레기가 들어가면 쓰레기가 나온다"는 뜻입니다. 
                나쁜 데이터를 학습하면 나쁜 AI가 탄생합니다.
            </p>
        </div>
      </div>
    </div>
  );
};

export default TabDiscussion;