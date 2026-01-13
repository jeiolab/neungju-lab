import React, { useState, useEffect } from 'react';
import { WizardData, Capability } from '../types';
import { INITIAL_CAPABILITIES } from '../constants';

interface WizardProps {
  data: WizardData;
  onUpdate: (data: WizardData) => void;
  onCompleteStep: (step: number) => void;
  onFinish: () => void;
}

export const Wizard: React.FC<WizardProps> = ({ data, onUpdate, onCompleteStep, onFinish }) => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    onCompleteStep(step);
    if (step < 4) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  const isStepValid = () => {
    if (step === 1) return data.targetJob.trim().length > 0 && data.jobReason.trim().length > 0;
    if (step === 2) return data.capabilities.some(c => c.selected);
    if (step === 3) return data.requirements && data.duties && data.longTermGoal;
    if (step === 4) return data.searchWhere && data.searchWhen && data.searchWhat;
    return false;
  };

  const toggleCapability = (id: string) => {
    const updated = data.capabilities.map(c => 
      c.id === id ? { ...c, selected: !c.selected } : c
    );
    onUpdate({ ...data, capabilities: updated });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Stepper */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
        {[1, 2, 3, 4].map(num => (
          <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${step >= num ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 border border-slate-300'}`}>
            {num}
          </div>
        ))}
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100 min-h-[400px]">
        {/* Step 1: Job Selection */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">🎯 1. 관심 직업 정하기</h2>
            <p className="text-slate-500">본인이 가장 관심 있는 직업이나 분야를 하나 정해주세요.</p>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">희망 직업/분야</label>
              <input 
                type="text" 
                value={data.targetJob} 
                onChange={(e) => onUpdate({...data, targetJob: e.target.value})}
                placeholder="예: 인공지능 개발자, 디지털 마케터"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">선택 이유 (1문장)</label>
              <textarea 
                value={data.jobReason} 
                onChange={(e) => onUpdate({...data, jobReason: e.target.value})}
                placeholder="이 직업을 선택한 이유는..."
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-24"
              />
            </div>
          </div>
        )}

        {/* Step 2: Capabilities */}
        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">⚡ 2. 필요 역량 선택</h2>
            <p className="text-slate-500">이 직업을 갖기 위해 필요한 핵심 역량을 모두 골라주세요.</p>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-700">공통 필수 역량</h3>
              <div className="flex flex-wrap gap-2">
                {data.capabilities.filter(c => c.category === 'general').map(c => (
                  <button 
                    key={c.id}
                    onClick={() => toggleCapability(c.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${c.selected ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {c.selected && '✓ '} {c.name}
                  </button>
                ))}
              </div>

              <h3 className="font-semibold text-indigo-700 mt-4">직무 특화 역량</h3>
              <div className="flex flex-wrap gap-2">
                {data.capabilities.filter(c => c.category === 'specialized').map(c => (
                  <button 
                    key={c.id}
                    onClick={() => toggleCapability(c.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${c.selected ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {c.selected && '✓ '} {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Card Details */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">📋 3. 상세 요건 정리</h2>
            <p className="text-slate-500">직업 카드 템플릿을 완성해보세요.</p>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">자격 요건 (학력/자격증)</label>
                <input 
                  type="text" 
                  value={data.requirements} 
                  onChange={(e) => onUpdate({...data, requirements: e.target.value})}
                  placeholder="예: 관련 학과 전공, 정보처리기사 자격증"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">주요 직무 (하는 일)</label>
                <input 
                  type="text" 
                  value={data.duties} 
                  onChange={(e) => onUpdate({...data, duties: e.target.value})}
                  placeholder="예: 고객 데이터 분석 및 인사이트 도출"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">장기 목표 (비전)</label>
                <input 
                  type="text" 
                  value={data.longTermGoal} 
                  onChange={(e) => onUpdate({...data, longTermGoal: e.target.value})}
                  placeholder="예: 10년 뒤 업계 최고의 전문가 되기"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Search Plan */}
        {step === 4 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">🔍 4. 정보 탐색 계획</h2>
            <p className="text-slate-500">구체적인 실행 계획(Action Plan)을 세웁니다.</p>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
               <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase">Where (어디서)</label>
                    <input 
                      type="text" 
                      value={data.searchWhere} 
                      onChange={(e) => onUpdate({...data, searchWhere: e.target.value})}
                      placeholder="예: 워크넷, 커리어넷, 대학교 홈페이지"
                      className="w-full p-2 mt-1 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase">When (언제)</label>
                    <input 
                      type="text" 
                      value={data.searchWhen} 
                      onChange={(e) => onUpdate({...data, searchWhen: e.target.value})}
                      placeholder="예: 이번 주말까지, 매주 금요일"
                      className="w-full p-2 mt-1 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase">What (무엇을)</label>
                    <input 
                      type="text" 
                      value={data.searchWhat} 
                      onChange={(e) => onUpdate({...data, searchWhat: e.target.value})}
                      placeholder="예: 관련 학과 커리큘럼, 최근 채용 공고 연봉 정보"
                      className="w-full p-2 mt-1 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
               </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
           {step > 1 && (
             <button 
               onClick={() => setStep(step - 1)}
               className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
             >
               이전
             </button>
           )}
           <div className="flex-1"></div>
           <button 
             onClick={handleNext}
             disabled={!isStepValid()}
             className={`px-8 py-2 rounded-lg font-bold shadow-md transition-all ${isStepValid() ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
           >
             {step === 4 ? '완료 및 산출물 보기' : '다음 단계'}
           </button>
        </div>
      </div>
    </div>
  );
};
