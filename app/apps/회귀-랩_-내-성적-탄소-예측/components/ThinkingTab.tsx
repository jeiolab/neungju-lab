import React from 'react';
import { Lightbulb, MessageCircle } from 'lucide-react';

const ThinkingTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-8 rounded-2xl border border-amber-200">
        <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-3 mb-4">
          <Lightbulb className="w-8 h-8" />
          생각해볼 문제
        </h2>
        <p className="text-amber-800">
          AI 모델을 만드는 개발자라면 이런 고민을 꼭 해야 합니다. 정답은 없어요!
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            1. 이상치(Outlier) 처리
          </h3>
          <p className="text-slate-600 mb-4">
            만약 우리 반 전교 1등이 공부를 하나도 안 했는데 100점을 맞았다면, 
            이 데이터를 학습에 포함시켜야 할까요, 빼야 할까요?
          </p>
          <textarea 
            className="w-full p-3 border rounded-lg bg-slate-50 text-sm focus:ring-2 ring-brand-500 outline-none" 
            rows={3}
            placeholder="나의 생각 적어보기..." 
          />
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            2. 모델의 반례 찾기
          </h3>
          <p className="text-slate-600 mb-4">
            "공부 시간이 늘었는데 점수가 오히려 떨어졌다"는 데이터가 수집되었습니다.
            어떤 이유가 있을 수 있을까요? (힌트: 잠을 못 잤다거나...)
            이런 변수를 모델에 어떻게 추가하면 좋을까요?
          </p>
           <textarea 
            className="w-full p-3 border rounded-lg bg-slate-50 text-sm focus:ring-2 ring-brand-500 outline-none" 
            rows={3}
            placeholder="나의 생각 적어보기..." 
          />
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            3. 윤리적 설계 (적용하기)
          </h3>
          <p className="text-slate-600 mb-4">
            우리 반 성적 예측 모델을 만들기 위해 설문조사를 하려고 합니다.
            친구들의 기분이 나쁘지 않도록 <strong>익명성</strong>을 보장하고, 
            <strong>객관적인 데이터</strong>만 수집하려면 질문지를 어떻게 만들어야 할까요?
          </p>
           <textarea 
            className="w-full p-3 border rounded-lg bg-slate-50 text-sm focus:ring-2 ring-brand-500 outline-none" 
            rows={3}
            placeholder="예: 이름 대신 닉네임 사용, 주관적 감정 대신 시간 측정..." 
          />
        </div>
      </div>
    </div>
  );
};

export default ThinkingTab;