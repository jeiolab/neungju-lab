import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

const ConceptCard = ({ title, children, icon }: { title: string; children?: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-4 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 mb-3">
      {icon && <span className="text-brand-600">{icon}</span>}
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    </div>
    <div className="text-slate-600 leading-relaxed">{children}</div>
  </div>
);

const TheoryTab: React.FC = () => {
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <ConceptCard title="회귀(Regression)란?" icon={<ArrowRight className="w-5 h-5" />}>
          <p>
            <strong className="text-brand-600">연속적인 숫자</strong>를 예측하는 방법이에요.
            입력값(X)이 변할 때 결과값(Y)이 어떻게 변하는지 패턴(선)을 찾습니다.
          </p>
          <div className="mt-4 bg-slate-50 p-3 rounded text-sm">
            <p className="font-semibold">예시:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>공부 시간(시간) → 시험 점수(점)</li>
              <li>전기 사용량(kWh) → 탄소 배출량(kg)</li>
              <li>아파트 평수(평) → 매매 가격(원)</li>
            </ul>
          </div>
        </ConceptCard>

        <ConceptCard title="핵심 키워드" icon={<CheckCircle2 className="w-5 h-5" />}>
          <ul className="space-y-3">
            <li>
              <span className="font-bold text-slate-800">오차(Error):</span> 실제값과 예측값의 차이.
              <br/><span className="text-xs text-slate-500">목표: 이 오차를 최소한으로 줄이는 선을 찾는 것!</span>
            </li>
            <li>
              <span className="font-bold text-slate-800">회귀선:</span> 데이터를 가장 잘 설명하는 직선.
              <br/><span className="text-xs text-slate-500">y = ax + b (a: 기울기, b: 절편)</span>
            </li>
            <li>
              <span className="font-bold text-slate-800">연속값:</span> 키, 몸무게, 온도처럼 끊어지지 않고 이어지는 값.
            </li>
          </ul>
        </ConceptCard>
      </div>

      <ConceptCard title="흔한 오해 바로잡기 🙅‍♂️">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <p className="mb-2">
              "내 점수가 <strong>A등급</strong>인지 <strong>B등급</strong>인지 맞추는 건 회귀일까요?"
            </p>
            <p className="text-brand-600 font-bold">아니요! 그건 '분류(Classification)'입니다.</p>
            <p className="text-sm text-slate-500 mt-1">
              회귀는 "85.5점", "92점" 같은 <span className="underline">구체적인 숫자</span>를 맞추는 것입니다.
            </p>
          </div>
          <div className="flex-shrink-0 bg-slate-100 p-4 rounded-lg text-sm text-center">
            <div className="mb-2 font-bold">비교</div>
            <div className="text-green-600">회귀: 내일 기온은 23.5도</div>
            <div className="text-orange-500">분류: 내일은 '더움/추움'</div>
          </div>
        </div>
      </ConceptCard>

      <div className="bg-brand-50 p-6 rounded-xl border border-brand-100">
        <h3 className="text-lg font-bold text-brand-900 mb-4">⏱ 10초 체크 질문</h3>
        <p className="mb-4 text-brand-800">다음 중 '회귀' 문제가 <strong>아닌</strong> 것은?</p>
        
        <div className="grid gap-2">
          <button 
            onClick={() => setQuizAnswer('correct')}
            className={`p-3 text-left rounded border ${quizAnswer === 'correct' ? 'bg-green-100 border-green-500 text-green-800' : 'bg-white border-brand-200 hover:bg-brand-100'}`}
          >
            1. 강아지 사진을 보고 '푸들'인지 '진돗개'인지 맞추기
          </button>
          <button 
            onClick={() => setQuizAnswer('wrong1')}
            className={`p-3 text-left rounded border ${quizAnswer === 'wrong1' ? 'bg-red-100 border-red-500 text-red-800' : 'bg-white border-brand-200 hover:bg-brand-100'}`}
          >
            2. 지난달 매출을 보고 이번 달 매출액(원) 예측하기
          </button>
          <button 
            onClick={() => setQuizAnswer('wrong2')}
            className={`p-3 text-left rounded border ${quizAnswer === 'wrong2' ? 'bg-red-100 border-red-500 text-red-800' : 'bg-white border-brand-200 hover:bg-brand-100'}`}
          >
            3. 속도에 따른 제동 거리(m) 예측하기
          </button>
        </div>
        
        {quizAnswer === 'correct' && (
          <div className="mt-4 flex items-center gap-2 text-green-700 font-bold animate-pulse">
            <CheckCircle2 className="w-5 h-5" /> 정답! 이건 '분류' 문제입니다.
          </div>
        )}
        {quizAnswer && quizAnswer !== 'correct' && (
           <div className="mt-4 flex items-center gap-2 text-red-600 font-bold">
            <XCircle className="w-5 h-5" /> 땡! 매출액, 거리는 연속적인 숫자라 회귀 문제입니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default TheoryTab;