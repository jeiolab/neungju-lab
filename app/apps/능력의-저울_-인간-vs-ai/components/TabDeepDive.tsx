import React from 'react';
import { Brain, AlertTriangle, Battery } from 'lucide-react';

const TabDeepDive: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-2">🧠 심화 학습: 감성 컴퓨팅과 한계</h2>

      <section className="bg-slate-800 p-6 rounded-xl border-l-4 border-pink-500">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="text-pink-400 w-8 h-8" />
          <h3 className="text-xl font-bold text-white">감성 컴퓨팅 (Affective Computing)</h3>
        </div>
        <p className="text-slate-300 leading-relaxed">
          감성 컴퓨팅은 컴퓨터가 인간의 감정을 <strong>인지(Recognize), 해석(Interpret), 처리(Process)</strong>할 수 있도록 하는 기술입니다.
          <br /><br />
          예를 들어, 카메라가 사용자의 표정을 읽어 "지금 슬퍼 보이시네요"라고 말하거나, 
          스마트 워치가 심박수를 분석해 스트레스 지수를 알려주는 기술이 이에 해당합니다.
          하지만 이것은 감정을 <strong>데이터로 분석</strong>하는 것이지, 기계가 실제로 <strong>슬픔을 느끼는 것(Feeling)</strong>은 아닙니다.
        </p>
      </section>

      <section className="bg-slate-800 p-6 rounded-xl border-l-4 border-yellow-500">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-yellow-400 w-8 h-8" />
          <h3 className="text-xl font-bold text-white">AI의 한계점 (Moravec's Paradox)</h3>
        </div>
        <p className="text-slate-300 leading-relaxed mb-4">
          <strong>모라벡의 역설:</strong> "인간에게 쉬운 것은 컴퓨터에게 어렵고, 인간에게 어려운 것은 컴퓨터에게 쉽다."
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 p-4 rounded">
            <h4 className="font-bold text-green-400 mb-2">인간에게 쉬운 것 (AI에게 어려움)</h4>
            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
              <li>걷기, 물건 집기 (감각 운동)</li>
              <li>상대방의 의도 파악하기 (직관)</li>
              <li>상식적인 추론</li>
            </ul>
          </div>
          <div className="bg-slate-900 p-4 rounded">
            <h4 className="font-bold text-blue-400 mb-2">인간에게 어려운 것 (AI에게 쉬움)</h4>
            <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
              <li>복잡한 수학 계산</li>
              <li>체스, 바둑 등 논리 게임</li>
              <li>수만 장의 문서 검색</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-800 p-6 rounded-xl border-l-4 border-red-500">
        <div className="flex items-center gap-3 mb-4">
          <Battery className="text-red-400 w-8 h-8" />
          <h3 className="text-xl font-bold text-white">에너지와 효율성</h3>
        </div>
        <p className="text-slate-300 leading-relaxed">
          인간의 뇌는 전구 하나 정도(약 20W)의 에너지로 엄청난 창의력과 판단을 수행합니다. 
          반면, 알파고와 같은 거대 AI 모델을 학습시키고 운영하는 데는 <strong>중소도시 전체가 사용하는 전력량</strong>이 필요합니다. 
          효율성 측면에서 생물학적 뇌는 여전히 압도적인 우위를 점하고 있습니다.
        </p>
      </section>
    </div>
  );
};

export default TabDeepDive;