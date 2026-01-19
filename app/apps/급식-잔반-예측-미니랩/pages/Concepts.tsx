import React from 'react';
import { ArrowDown, Database, Brain, Search, CheckCircle } from 'lucide-react';

const ConceptCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-slate-800">{title}</h3>
    </div>
    <div className="text-slate-600 text-sm leading-relaxed space-y-2">
      {children}
    </div>
  </div>
);

const Concepts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800">데이터 과학의 핵심 개념</h2>
        <p className="text-slate-500">실험 전에 꼭 알아야 할 용어들을 정리했어요.</p>
      </div>

      <ConceptCard title="회귀(Regression)란?" icon={<TrendingUpIcon />}>
        <p>
          <strong>"과거의 데이터로 미래의 숫자를 맞추는 마법"</strong>
        </p>
        <p>
          회귀는 데이터들 사이의 관계(패턴)를 선이나 곡선으로 그려내는 기술입니다.
          <br/>
          예: "오늘 메뉴가 맛있는 돈가스면(X), 잔반량(Y)은 줄어들 것이다."
        </p>
      </ConceptCard>

      <div className="relative pl-4 border-l-2 border-indigo-200 space-y-8 my-8">
        <div className="relative">
          <div className="absolute -left-[21px] top-0 bg-indigo-600 w-4 h-4 rounded-full border-4 border-slate-50" />
          <h4 className="font-bold text-slate-800 mb-1">1. 문제 정의</h4>
          <p className="text-sm text-slate-500">무엇을 예측하고 싶은가요? (예: 내일 급식 잔반량)</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[21px] top-0 bg-indigo-400 w-4 h-4 rounded-full border-4 border-slate-50" />
          <h4 className="font-bold text-slate-800 mb-1">2. 데이터 수집 & 전처리</h4>
          <p className="text-sm text-slate-500">메뉴 선호도, 날씨, 요일 데이터를 모으고 이상한 값(노이즈)을 다듬습니다.</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[21px] top-0 bg-indigo-400 w-4 h-4 rounded-full border-4 border-slate-50" />
          <h4 className="font-bold text-slate-800 mb-1">3. 모델 학습 (Training)</h4>
          <p className="text-sm text-slate-500">데이터의 패턴을 가장 잘 설명하는 선(함수)을 찾습니다. 컴퓨터가 공부하는 시간!</p>
        </div>
        <div className="relative">
          <div className="absolute -left-[21px] top-0 bg-green-500 w-4 h-4 rounded-full border-4 border-slate-50" />
          <h4 className="font-bold text-slate-800 mb-1">4. 평가 (Evaluation)</h4>
          <p className="text-sm text-slate-500">학습에 안 쓴 데이터(검증셋)로 시험을 봅니다. 오차(MAE)가 작을수록 좋습니다.</p>
        </div>
      </div>

      <ConceptCard title="과적합(Overfitting)" icon={<Brain className="w-6 h-6"/>}>
        <p className="font-bold text-red-500">"너무 달달 외워서 응용을 못하는 상태"</p>
        <p>
          모델이 학습 데이터의 사소한 노이즈까지 다 외워버리면, 정작 새로운 데이터에서는 엉뚱한 예측을 합니다.
          너무 복잡한 모델(구불구불한 곡선)을 쓸 때 자주 발생해요.
        </p>
      </ConceptCard>

      <ConceptCard title="데이터의 중요성" icon={<Database className="w-6 h-6"/>}>
        <p>
          <strong>Garbage In, Garbage Out (쓰레기가 들어가면 쓰레기가 나온다)</strong>
        </p>
        <p>
          아무리 좋은 AI 모델도 데이터가 엉망이면(노이즈가 많거나, 양이 너무 적으면) 제대로 예측할 수 없습니다.
          실험실에서 '데이터 양'을 늘리거나 줄여보며 차이를 느껴보세요.
        </p>
      </ConceptCard>
    </div>
  );
};

const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
)

export default Concepts;