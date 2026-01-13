import React, { useState } from 'react';
import { Bot, BrainCircuit, CheckCircle2 } from 'lucide-react';

const TheorySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'INTELLIGENT'>('GENERAL');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-900 text-white">
          <h2 className="text-2xl font-bold mb-2">에이전트 분류 기준</h2>
          <p className="text-slate-300">어떤 기준으로 봇을 감별해야 할까요?</p>
        </div>

        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('GENERAL')}
            className={`flex-1 py-4 text-center font-bold transition-colors flex items-center justify-center gap-2
              ${activeTab === 'GENERAL' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Bot size={20} />
            일반 에이전트 (규칙봇)
          </button>
          <button
            onClick={() => setActiveTab('INTELLIGENT')}
            className={`flex-1 py-4 text-center font-bold transition-colors flex items-center justify-center gap-2
              ${activeTab === 'INTELLIGENT' ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <BrainCircuit size={20} />
            지능 에이전트 (지능봇)
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'GENERAL' ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
                  <span className="font-bold text-lg">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">단순 규칙 (If-Then)</h3>
                  <p className="text-slate-600">"만약 ~하면, 무조건 ~해라"라는 정해진 규칙만 따릅니다.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
                  <span className="font-bold text-lg">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">반사적 행동</h3>
                  <p className="text-slate-600">입력이 들어오면 즉시 반응합니다. 고민(추론)하거나 학습하지 않습니다.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
                  <span className="font-bold text-lg">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">예시</h3>
                  <p className="text-slate-600">자동문, 구형 온도조절기, 자판기, 두더지 잡기 게임기</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-2 rounded-lg text-purple-600 mt-1">
                  <span className="font-bold text-lg">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">학습과 적응 (Learning)</h3>
                  <p className="text-slate-600">과거의 데이터나 경험을 통해 성능이 점점 좋아집니다.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-2 rounded-lg text-purple-600 mt-1">
                  <span className="font-bold text-lg">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">목표와 추론 (Goal & Reasoning)</h3>
                  <p className="text-slate-600">복잡한 상황에서 목표를 달성하기 위해 최적의 행동을 스스로 판단합니다.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-2 rounded-lg text-purple-600 mt-1">
                  <span className="font-bold text-lg">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">예시</h3>
                  <p className="text-slate-600">자율주행차, 알파고, 넷플릭스 추천 시스템, 로봇청소기(매핑기능)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-green-50 p-4 rounded-xl border border-green-200 flex items-start gap-3">
        <CheckCircle2 className="text-green-600 shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-green-800">10초 핵심 체크</h4>
          <p className="text-green-700 text-sm">
            "규칙이 바뀌지 않으면 일반, 경험을 통해 똑똑해지면 지능!" 이것만 기억하세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TheorySection;