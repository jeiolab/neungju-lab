import React from 'react';

export default function ReflectionTab() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">🕵️ 수사 일지 (Reflection)</h2>
        <p className="text-slate-400">오늘의 수사를 통해 무엇을 느꼈는지 기록해봅시다.</p>
      </div>

      <QuestionCard 
        title="Q1. 임계값(Threshold)의 딜레마"
        desc="게임을 하면서 기준을 너무 낮추거나 높였을 때 어떤 문제가 생겼나요? 완벽한 기준이라는 것이 존재할까요?"
      />

      <QuestionCard 
        title="Q2. 튀는 점은 항상 나쁜가?"
        desc="'이상치'는 제거해야 할 오류일까요, 아니면 특별한 가치를 지닌 발견일까요? 상황에 따라 어떻게 다를지 적어보세요."
      />

      <QuestionCard 
        title="Q3. 나만의 경보 시스템 설계"
        desc="여러분이 학교 환경 데이터를 관리하는 책임자라면, 어떤 데이터(예: 소음, 온도)를 감시하고 어떤 규칙으로 '경보'를 울리겠습니까?"
      />

      <div className="bg-gradient-to-r from-indigo-900/50 to-slate-900/50 p-6 rounded-xl border border-indigo-500/30 text-center mt-12">
        <h3 className="text-lg font-bold text-white mb-2">🎉 오늘의 임무 완료!</h3>
        <p className="text-slate-300 text-sm">
          비지도 학습의 핵심인 '이상치 탐지'를 마스터하셨군요.<br/>
          세상을 보는 눈이 조금 더 예리해졌기를 바랍니다.
        </p>
      </div>
    </div>
  );
}

const QuestionCard = ({ title, desc }: { title: string; desc: string }) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
    <h3 className="text-lg font-bold text-indigo-400 mb-2">{title}</h3>
    <p className="text-slate-300 text-sm mb-4 leading-relaxed">{desc}</p>
    <textarea 
      className="w-full h-24 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none placeholder-slate-600"
      placeholder="여기에 생각을 자유롭게 적어보세요..."
    ></textarea>
  </div>
);
