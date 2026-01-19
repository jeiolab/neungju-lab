import React, { useState } from 'react';
import { THEORY_STAGES } from '../data';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { StageCard } from '../types';

const TheoryCard: React.FC<{ stage: StageCard }> = ({ stage }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-4 transition-all duration-300 hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
            ${stage.id === 'perception' ? 'bg-blue-500' : 
              stage.id === 'learning' ? 'bg-green-500' :
              stage.id === 'reasoning' ? 'bg-purple-500' : 'bg-red-500'
            }`}
          >
            {stage.title.split('.')[0]}
          </div>
          <h3 className="text-lg font-bold text-slate-800">{stage.title.split('. ')[1]}</h3>
        </div>
        {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
      </button>

      {isOpen && (
        <div className="p-4 pt-0 bg-slate-50 border-t border-slate-100">
          <p className="text-slate-700 mb-4 leading-relaxed mt-4">{stage.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {stage.keywords.map(k => (
              <span key={k} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs text-slate-500 font-medium">
                #{k}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
              <h4 className="flex items-center gap-2 text-sm font-bold text-red-700 mb-1">
                <AlertCircle className="w-4 h-4" /> 흔한 오해
              </h4>
              <p className="text-sm text-red-600">{stage.misconception}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <h4 className="flex items-center gap-2 text-sm font-bold text-blue-700 mb-1">
                <CheckCircle2 className="w-4 h-4" /> 예시
              </h4>
              <p className="text-sm text-blue-600">{stage.example}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ComparisonToggle = () => {
  const [mode, setMode] = useState<'AUTO_DOOR' | 'AI_ROBOT'>('AUTO_DOOR');

  return (
    <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🤔</span> 더 알아보기
      </h3>
      <p className="text-slate-600 mb-6">규칙 기반 시스템과 지능형 에이전트의 차이를 비교해보세요.</p>
      
      <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => setMode('AUTO_DOOR')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            mode === 'AUTO_DOOR' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          자동문 (단순 규칙)
        </button>
        <button
          onClick={() => setMode('AI_ROBOT')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            mode === 'AI_ROBOT' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          로봇청소기 (지능형)
        </button>
      </div>

      <div className="min-h-[120px]">
        {mode === 'AUTO_DOOR' ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-slate-200 p-3 rounded-full">🚪</div>
              <div>
                <h4 className="font-bold text-slate-800">단순 반사 (Reflex)</h4>
                <p className="text-sm text-slate-500">규칙: "사람이 감지되면 → 문을 연다"</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">
              입력에 대해 미리 정해진 행동만 수행합니다. 학습하거나 추론하지 않으므로, 상황이 변해도(예: 불이 났을 때) 똑같이 행동합니다. 지능적이라기보다는 '자동화'된 기계입니다.
            </p>
          </div>
        ) : (
          <div className="animate-fade-in">
             <div className="flex items-center gap-4 mb-3">
              <div className="bg-blue-100 p-3 rounded-full">🤖</div>
              <div>
                <h4 className="font-bold text-slate-800">지능형 에이전트</h4>
                <p className="text-sm text-slate-500">목표: "바닥을 깨끗하게 유지한다"</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm bg-blue-50 p-3 rounded-lg text-blue-800">
              환경을 인식하고, 지도를 '학습'하며, 효율적인 경로를 '추론'하여 행동합니다. 배터리가 없으면 청소를 중단하고 충전하러 가는 등 목표 달성을 위해 유연하게 판단합니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const TheorySection: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 md:pb-4">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">지능의 파이프라인</h1>
        <p className="text-slate-500">지능 에이전트가 생각하고 행동하는 4가지 핵심 단계를 알아보세요.</p>
      </header>

      <div>
        {THEORY_STAGES.map(stage => (
          <TheoryCard key={stage.id} stage={stage} />
        ))}
      </div>

      <ComparisonToggle />
    </div>
  );
};

export default TheorySection;
