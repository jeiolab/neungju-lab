import React, { useState, useEffect } from 'react';
import { ProjectState, ProjectTopic, DataCategory, ProcessingMethod, DisclosureScope } from '../types';
import { DATA_ITEMS, TOPICS } from '../constants';
import { AlertCircle, CheckCircle, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { evaluateDescription } from '../services/geminiService';

interface TabWizardProps {
  project: ProjectState;
  setProject: React.Dispatch<React.SetStateAction<ProjectState>>;
}

export const TabWizard: React.FC<TabWizardProps> = ({ project, setProject }) => {
  const [step, setStep] = useState(1);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Helper: Calculate Scores
  const calculateScores = (currProject: ProjectState) => {
    let sScore = 100;
    let uScore = 60; // Base utility

    // Safety Calculation
    currProject.selectedDataIds.forEach(id => {
      const item = DATA_ITEMS.find(d => d.id === id);
      const method = currProject.processingMethods[id] || ProcessingMethod.NONE;

      if (item?.category === DataCategory.SENSITIVE && method === ProcessingMethod.NONE) {
        sScore -= 30; // Sensitive data raw = huge penalty
      } else if (method === ProcessingMethod.NONE) {
        sScore -= 10;
      }
      
      if (method === ProcessingMethod.ANONYMIZATION) {
        sScore += 5;
      }
    });

    if (currProject.disclosureScope === DisclosureScope.PUBLIC) sScore -= 20;
    if (currProject.disclosureScope === DisclosureScope.SCHOOL) sScore -= 10;

    // Utility Calculation
    uScore += (currProject.selectedDataIds.length * 5); // More data = more utility (naively)
    if (currProject.description.length > 20) uScore += 10;
    
    // Penalize utility if everything is anonymized/deleted
    const allAnonymized = currProject.selectedDataIds.every(id => currProject.processingMethods[id] === ProcessingMethod.ANONYMIZATION);
    if (allAnonymized && currProject.selectedDataIds.length > 0) uScore -= 30;

    setProject(prev => ({
      ...prev,
      safetyScore: Math.max(0, Math.min(100, sScore)),
      utilityScore: Math.max(0, Math.min(100, uScore))
    }));
  };

  useEffect(() => {
    calculateScores(project);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.selectedDataIds, project.processingMethods, project.disclosureScope, project.description]);


  const handleDataSelect = (id: string) => {
    const item = DATA_ITEMS.find(d => d.id === id);
    if (item?.isDirectIdentifier) {
      setWarningMsg(`'${item.name}'은(는) 직접식별정보입니다! 학교 프로젝트에서는 수집하지 않는 것이 원칙입니다. 대신 '가명'이나 'ID'를 사용하세요.`);
      return;
    }
    
    setWarningMsg(null);
    setProject(prev => {
      const exists = prev.selectedDataIds.includes(id);
      const newIds = exists ? prev.selectedDataIds.filter(d => d !== id) : [...prev.selectedDataIds, id];
      
      // Initialize method to Pseudonym for safety default, or remove if deselected
      const newMethods = { ...prev.processingMethods };
      if (!exists) {
        newMethods[id] = ProcessingMethod.PSEUDONYM;
      } else {
        delete newMethods[id];
      }
      
      return { ...prev, selectedDataIds: newIds, processingMethods: newMethods };
    });
  };

  const handleMethodChange = (id: string, method: ProcessingMethod) => {
    setProject(prev => ({
      ...prev,
      processingMethods: { ...prev.processingMethods, [id]: method }
    }));
  };

  const checkAiFeedback = async () => {
    if (project.description.length < 5) return;
    setIsAiLoading(true);
    const result = await evaluateDescription(project.description, project.topic);
    setAiFeedback(result);
    setIsAiLoading(false);
  };

  // Step Renderers
  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-800">1단계: 프로젝트 주제 선택</h3>
      <p className="text-slate-500">무엇에 대해 조사하고 싶나요?</p>
      <div className="grid gap-3">
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => setProject(prev => ({ ...prev, topic: t }))}
            className={`p-4 rounded-lg border-2 text-left transition-all ${
              project.topic === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-800">2단계: 데이터 항목 선택</h3>
      <p className="text-slate-500">어떤 정보를 수집할 것인가요? (개인정보 포함 시 주의!)</p>
      
      {warningMsg && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center gap-2 animate-bounce">
          <ShieldAlert size={20} />
          <span>{warningMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {DATA_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleDataSelect(item.id)}
            className={`p-3 rounded-lg border text-left text-sm flex justify-between items-center ${
              project.selectedDataIds.includes(item.id) 
                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{item.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
               item.category === DataCategory.IDENTIFIER ? 'bg-red-100 text-red-800' : 
               item.category === DataCategory.SENSITIVE ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
            }`}>
              {item.category.split('(')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-800">3단계: 데이터 처리 방법</h3>
      <p className="text-slate-500">수집한 데이터를 안전하게 처리하세요.</p>
      
      <div className="space-y-4">
        {project.selectedDataIds.map(id => {
          const item = DATA_ITEMS.find(d => d.id === id);
          if (!item) return null;
          return (
            <div key={id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">{item.name}</span>
                <span className="text-xs text-gray-400">{item.category}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {Object.values(ProcessingMethod).map(method => (
                  <button
                    key={method}
                    onClick={() => handleMethodChange(id, method)}
                    className={`text-xs px-3 py-2 rounded-md border transition-colors ${
                      project.processingMethods[id] === method
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {method.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        {project.selectedDataIds.length === 0 && <div className="text-center text-gray-400 py-10">선택한 데이터가 없습니다. 이전 단계로 돌아가세요.</div>}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-slate-800">4단계: 공개 범위 및 설명</h3>
      <p className="text-slate-500">누구와 공유할 것이며, 왜 필요한가요?</p>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">공개 범위</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.values(DisclosureScope).map(scope => (
            <button
              key={scope}
              onClick={() => setProject(prev => ({...prev, disclosureScope: scope}))}
              className={`p-2 text-sm rounded border ${
                project.disclosureScope === scope ? 'bg-purple-600 text-white border-purple-600' : 'bg-white hover:bg-gray-50'
              }`}
            >
              {scope}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">프로젝트 설명 (활용 목적)</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
          placeholder="예: 급식 메뉴 개선을 위해 학생들의 선호도를 파악하고자 함."
          value={project.description}
          onChange={(e) => setProject(prev => ({...prev, description: e.target.value}))}
        />
        <button 
          onClick={checkAiFeedback}
          disabled={isAiLoading || project.description.length < 5}
          className="mt-2 text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded hover:bg-amber-200 disabled:opacity-50 transition-colors"
        >
          {isAiLoading ? "AI 분석 중..." : "✨ AI 피드백 받기"}
        </button>
        {aiFeedback && (
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-900 animate-fadeIn">
            <strong>AI Feedback:</strong> {aiFeedback}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
      {/* Wizard Header */}
      <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex gap-2">
           {[1, 2, 3, 4].map(s => (
             <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
               step === s ? 'bg-blue-600 text-white' : step > s ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
             }`}>
               {step > s ? <CheckCircle size={16} /> : s}
             </div>
           ))}
        </div>
        <div className="flex gap-4 text-sm">
           <div className="flex flex-col items-end">
             <span className="text-gray-500 text-xs">안전 점수</span>
             <span className={`font-bold ${project.safetyScore > 80 ? 'text-green-600' : 'text-orange-500'}`}>{project.safetyScore}점</span>
           </div>
           <div className="flex flex-col items-end">
             <span className="text-gray-500 text-xs">유용성</span>
             <span className="font-bold text-purple-600">{project.utilityScore}점</span>
           </div>
        </div>
      </div>

      {/* Wizard Content */}
      <div className="p-6 flex-1 overflow-y-auto">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>

      {/* Wizard Footer */}
      <div className="p-4 border-t border-slate-100 flex justify-between">
        <button
          onClick={() => setStep(prev => Math.max(1, prev - 1))}
          disabled={step === 1}
          className="px-4 py-2 flex items-center gap-2 text-slate-600 hover:text-slate-900 disabled:opacity-30"
        >
          <ArrowLeft size={18} /> 이전
        </button>
        <button
          onClick={() => setStep(prev => Math.min(4, prev + 1))}
          disabled={step === 4}
          className={`px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors ${step === 4 ? 'hidden' : ''}`}
        >
          다음 <ArrowRight size={18} />
        </button>
        {step === 4 && (
          <div className="text-green-600 font-bold flex items-center gap-2">
            설계 완료! 상단 탭에서 출력 가능
          </div>
        )}
      </div>
    </div>
  );
};