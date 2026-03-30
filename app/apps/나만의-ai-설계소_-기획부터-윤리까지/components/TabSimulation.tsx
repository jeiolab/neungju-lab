import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Save, AlertOctagon, Wand2, Check } from 'lucide-react';
import { TOPICS, FEATURES, MODELS, SimulationState } from '../types';
import { generateAIProposal } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

const TabSimulation: React.FC = () => {
  const [state, setState] = useState<SimulationState>({
    step: 1,
    topic: null,
    features: [],
    modelType: null,
    ethicalChecks: [],
    generatedProposal: null,
    isGenerating: false,
  });

  const [warnings, setWarnings] = useState<string[]>([]);

  const handleNext = async () => {
    if (state.step === 2) {
      // Step 2 Logic Check: Hiring + Sensitive Data
      const currentWarnings = [];
      if (state.topic === 'hiring' && (state.features.includes('gender') || state.features.includes('age') || state.features.includes('address'))) {
        currentWarnings.push("⚠️ 경고: 채용 AI에 성별, 나이, 거주지 정보를 포함하면 차별적 결과(편향성)를 초래할 수 있습니다.");
      }
      if (state.topic === 'finance' && state.features.includes('address')) {
         currentWarnings.push("⚠️ 주의: 거주지에 따른 대출 금리 차별(Redlining) 문제가 발생할 수 있습니다.");
      }
      setWarnings(currentWarnings);
    }
    
    if (state.step === 3) {
      // Auto-recommend check (just internal consistency, user can override)
    }

    if (state.step === 4) {
      // Generate Proposal
      setState(prev => ({ ...prev, isGenerating: true }));
      const proposal = await generateAIProposal(
        TOPICS.find(t => t.id === state.topic)?.name || 'Unknown',
        state.features.map(f => FEATURES.find(feat => feat.id === f)?.name || f),
        MODELS.find(m => m.id === state.modelType)?.name || 'Unknown',
        state.ethicalChecks
      );
      setState(prev => ({ ...prev, generatedProposal: proposal, isGenerating: false, step: prev.step + 1 }));
      return;
    }

    setState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  };

  const toggleFeature = (id: string) => {
    setState(prev => ({
      ...prev,
      features: prev.features.includes(id) 
        ? prev.features.filter(f => f !== id) 
        : [...prev.features, id]
    }));
  };

  const toggleEthics = (check: string) => {
    setState(prev => ({
      ...prev,
      ethicalChecks: prev.ethicalChecks.includes(check)
        ? prev.ethicalChecks.filter(c => c !== check)
        : [...prev.ethicalChecks, check]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2 text-sm font-medium text-slate-500">
          <span>주제 선정</span>
          <span>데이터 정의</span>
          <span>모델 선택</span>
          <span>윤리 점검</span>
          <span>결과</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${(state.step / 5) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 min-h-[400px] flex flex-col p-6">
        
        {/* Step 1: Topic */}
        {state.step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">1. 어떤 AI를 만드시겠습니까?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TOPICS.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => setState(prev => ({ ...prev, topic: topic.id }))}
                  className={`p-6 rounded-lg border-2 text-left transition-all ${
                    state.topic === topic.id 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-lg mb-1">{topic.name}</div>
                  <div className="text-slate-500 text-sm">{topic.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Features */}
        {state.step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">2. 학습에 사용할 데이터(Feature)를 고르세요.</h2>
            <p className="text-slate-500 mb-6">AI가 판단의 근거로 사용할 속성들입니다. (다중 선택 가능)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {FEATURES.map(feature => (
                <button
                  key={feature.id}
                  onClick={() => toggleFeature(feature.id)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    state.features.includes(feature.id)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {feature.name}
                </button>
              ))}
            </div>
            
            {/* Dynamic Warnings */}
            {state.topic === 'hiring' && state.features.some(f => ['gender', 'age', 'address'].includes(f)) && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r">
                <div className="flex items-center gap-2 text-red-700 font-bold mb-1">
                  <AlertOctagon size={20} /> 편향성 경고!
                </div>
                <p className="text-red-600 text-sm">
                  선택하신 데이터(성별, 나이, 거주지)는 직무 능력과 직접적 관련이 적으며, 
                  과거의 사회적 차별을 AI가 그대로 학습할 위험이 있습니다.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Model */}
        {state.step === 3 && (
          <div className="animate-fade-in">
             <h2 className="text-2xl font-bold mb-4">3. 적합한 AI 모델을 선택하세요.</h2>
             <div className="bg-blue-50 p-4 rounded-lg mb-6">
               <span className="font-bold text-blue-800">💡 아키텍트의 추천: </span>
               <span className="text-blue-700">
                 {state.topic && TOPICS.find(t => t.id === state.topic)?.type === 'classification' 
                   ? "'분류 (Classification)' 모델이 적합합니다. (예/아니오 결정)" 
                   : "'회귀 (Regression)' 모델이 적합합니다. (수치 예측)"}
               </span>
             </div>
             <div className="grid md:grid-cols-2 gap-4">
               {MODELS.map(model => (
                 <button
                  key={model.id}
                  onClick={() => setState(prev => ({ ...prev, modelType: model.id as any }))}
                  className={`p-6 rounded-lg border-2 text-left ${
                    state.modelType === model.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-indigo-200'
                  }`}
                 >
                   <div className="font-bold text-lg mb-2">{model.name}</div>
                   <div className="text-slate-600 text-sm">{model.desc}</div>
                 </button>
               ))}
             </div>
          </div>
        )}

        {/* Step 4: Ethical Checklist */}
        {state.step === 4 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">4. 마지막 윤리 점검 (Checklist)</h2>
            <div className="space-y-3">
              {[
                "학습 데이터에 편향성이 없는지 검토했나요?",
                "AI의 판단 결과를 사용자에게 설명할 수 있나요? (XAI)",
                "개인정보 보호 조치(비식별화 등)를 취했나요?",
                "모델의 오작동 시 책임 소재를 정의했나요?"
              ].map((check, idx) => (
                <label key={idx} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    checked={state.ethicalChecks.includes(check)}
                    onChange={() => toggleEthics(check)}
                  />
                  <span className="text-slate-700">{check}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Result */}
        {state.step === 5 && (
          <div className="animate-fade-in flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Check className="text-green-500" /> 기획서 생성 완료
            </h2>
            {state.isGenerating ? (
              <div className="flex flex-col items-center justify-center flex-1 py-12">
                <Wand2 className="animate-spin text-indigo-500 w-12 h-12 mb-4" />
                <p className="text-slate-600 font-medium">AI 아키텍트가 기획서를 작성 중입니다...</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto bg-slate-50 p-6 rounded-lg border border-slate-200 prose prose-slate max-w-none">
                <ReactMarkdown>{state.generatedProposal || ''}</ReactMarkdown>
              </div>
            )}
            
            <div className="mt-4 flex justify-end gap-2">
               <button 
                onClick={() => {
                  navigator.clipboard.writeText(state.generatedProposal || '');
                  alert("클립보드에 복사되었습니다!");
                }}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-300"
               >
                 <Save size={18} /> 복사하기
               </button>
               <button 
                onClick={() => setState({ step: 1, topic: null, features: [], modelType: null, ethicalChecks: [], generatedProposal: null, isGenerating: false })}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
               >
                 새 프로젝트 시작
               </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {state.step < 5 && (
          <div className="mt-auto pt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={state.step === 1}
              className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                state.step === 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft size={20} className="mr-1" /> 이전
            </button>
            
            <button
              onClick={handleNext}
              disabled={
                (state.step === 1 && !state.topic) ||
                (state.step === 2 && state.features.length === 0) ||
                (state.step === 3 && !state.modelType)
              }
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              {state.step === 4 ? '기획서 생성' : '다음'} <ChevronRight size={20} className="ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabSimulation;