import React, { useState } from 'react';
import { ProjectData, ProjectTemplate } from '../types';
import { TEMPLATES, PROTECTION_MEASURES } from '../constants';
import { generateOnePageSummary } from '../services/geminiService';
import { AlertCircle, ArrowRight, Check, Copy, Download, ShieldCheck, ChevronLeft } from 'lucide-react';

export const Wizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [project, setProject] = useState<ProjectData>({
    templateId: '',
    goal: '',
    collectedData: [],
    sharingScope: 'class',
    protectionMeasures: [],
    outputFormat: 'report',
    isMinimizationChecked: false
  });
  
  const [summary, setSummary] = useState<string>("");
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const handleTemplateSelect = (t: ProjectTemplate) => {
    setProject({
      ...project,
      templateId: t.id,
      goal: t.defaultGoal,
      collectedData: [], // reset
    });
    setStep(2);
  };

  const toggleData = (item: string) => {
    const newData = project.collectedData.includes(item)
      ? project.collectedData.filter(d => d !== item)
      : [...project.collectedData, item];
    setProject({...project, collectedData: newData});
  };

  const toggleProtection = (id: string) => {
    const newMeasures = project.protectionMeasures.includes(id)
      ? project.protectionMeasures.filter(m => m !== id)
      : [...project.protectionMeasures, id];
    setProject({...project, protectionMeasures: newMeasures});
  };

  const finishWizard = async () => {
    setStep(6); // Result View
    setIsLoadingSummary(true);
    const result = await generateOnePageSummary(project);
    setSummary(result);
    setIsLoadingSummary(false);
  };

  const getMarkdown = () => {
    const template = TEMPLATES.find(t => t.id === project.templateId);
    return `
# 📑 프로젝트 설계서: ${template?.title}

## 1. 프로젝트 목표
${project.goal}

## 2. 수집 데이터 (최소 수집 원칙 준수)
${project.collectedData.map(d => `- [x] ${d}`).join('\n')}

## 3. 공유 및 보호 계획
- **공유 범위**: ${project.sharingScope === 'class' ? '우리 반' : project.sharingScope === 'grade' ? '학년 전체' : project.sharingScope === 'school' ? '학교 전체' : '외부 공개'}
- **보호 조치**:
${project.protectionMeasures.map(pm => {
  const label = PROTECTION_MEASURES.find(m => m.id === pm)?.label;
  return `  - ${label}`;
}).join('\n')}

## 4. 산출물 형태
- ${project.outputFormat === 'report' ? '보고서' : project.outputFormat === 'poster' ? '포스터' : '웹페이지'}

---
*위 계획은 정보 보호와 공유의 균형을 고려하여 작성되었습니다.*
    `.trim();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getMarkdown());
    alert("설계서가 클립보드에 복사되었습니다!");
  };

  // Step 1: Template
  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">어떤 프로젝트를 계획 중인가요?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TEMPLATES.map(t => (
            <button key={t.id} onClick={() => handleTemplateSelect(t)} className="bg-white p-6 rounded-xl shadow hover:ring-2 ring-indigo-500 transition text-left h-full flex flex-col">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-indigo-600 font-bold text-xl">
                {t.title[0]}
              </div>
              <h3 className="font-bold text-lg mb-2">{t.title}</h3>
              <p className="text-sm text-gray-500 flex-grow">{t.description}</p>
              <div className="mt-4 text-indigo-600 text-sm font-semibold flex items-center">
                선택하기 <ArrowRight size={16} className="ml-1"/>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentTemplate = TEMPLATES.find(t => t.id === project.templateId);

  // Step 6: Result
  if (step === 6) {
    const safetyScore = (project.protectionMeasures.length * 20) + (project.sharingScope !== 'public' ? 20 : 0) + (project.isMinimizationChecked ? 20 : 0);
    
    return (
      <div className="max-w-4xl mx-auto p-6 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <ShieldCheck className="mr-2" /> 프로젝트 설계 완료!
              </h2>
              <p className="opacity-80 mt-1">안전성 점수: {Math.min(100, safetyScore)}점</p>
            </div>
            <div className="flex gap-2">
               {project.isMinimizationChecked && <span className="bg-green-500 px-3 py-1 rounded-full text-xs font-bold">최소수집 달성</span>}
               {project.protectionMeasures.length >= 2 && <span className="bg-blue-500 px-3 py-1 rounded-full text-xs font-bold">보호조치 우수</span>}
            </div>
          </div>
          
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-700">📜 설계서 미리보기 (Markdown)</h3>
                <button onClick={copyToClipboard} className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded flex items-center text-gray-700">
                  <Copy size={14} className="mr-1"/> 복사
                </button>
              </div>
              <pre className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 whitespace-pre-wrap overflow-auto h-96 border font-mono">
                {getMarkdown()}
              </pre>
            </div>

            <div className="flex flex-col">
              <h3 className="font-bold text-lg text-gray-700 mb-4">🤖 AI 발표 요약 (Gemini)</h3>
              <div className="bg-indigo-50 p-6 rounded-lg flex-grow border border-indigo-100">
                {isLoadingSummary ? (
                  <div className="flex flex-col items-center justify-center h-full text-indigo-400">
                     <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-2"></div>
                     <p className="text-sm">발표용 요약본을 생성하고 있습니다...</p>
                  </div>
                ) : (
                  <div className="prose prose-sm text-indigo-900 whitespace-pre-line">
                    {summary}
                  </div>
                )}
              </div>
              <div className="mt-4 text-xs text-gray-400 text-center">
                * 생성된 요약은 참고용으로 활용하세요.
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 border-t flex justify-center">
            <button onClick={() => setStep(1)} className="text-gray-600 hover:text-gray-900 font-medium">
              새로운 프로젝트 만들기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Common Layout for Steps 2-5
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>단계 {step - 1} / 4</span>
          <span>{Math.round(((step - 1) / 4) * 100)}% 완료</span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{width: `${((step - 1) / 4) * 100}%`}}></div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg min-h-[400px] flex flex-col">
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-2">무엇을 수집하나요?</h2>
            <p className="text-gray-500 mb-6 text-sm">목적 달성에 꼭 필요한 정보만 선택하세요 (최소 수집 원칙).</p>
            <div className="space-y-3 flex-grow">
              {currentTemplate?.suggestedData.map((item, idx) => (
                <label key={idx} className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${project.collectedData.includes(item) ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'}`}>
                  <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" 
                    checked={project.collectedData.includes(item)}
                    onChange={() => toggleData(item)}
                  />
                  <span className="ml-3 font-medium text-gray-700">{item}</span>
                </label>
              ))}
              <div className="mt-6 pt-4 border-t">
                 <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={project.isMinimizationChecked} onChange={(e) => setProject({...project, isMinimizationChecked: e.target.checked})} className="mr-2"/>
                    <span className="text-sm font-semibold text-gray-600">위 항목들은 프로젝트 목표 달성에 반드시 필요한 최소한의 정보입니까?</span>
                 </label>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-2">누구와 공유하나요?</h2>
            <p className="text-gray-500 mb-6 text-sm">공유 범위가 넓어질수록 파급력은 커지지만 위험도 증가합니다.</p>
            <div className="space-y-4 flex-grow">
              {['class', 'grade', 'school', 'public'].map((scope) => (
                <label key={scope} className={`flex items-center p-4 border rounded-xl cursor-pointer ${project.sharingScope === scope ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'hover:bg-gray-50'}`}>
                  <input type="radio" name="scope" className="w-5 h-5 text-blue-600"
                    checked={project.sharingScope === scope}
                    onChange={() => setProject({...project, sharingScope: scope as any})}
                  />
                  <div className="ml-3">
                    <span className="block font-bold text-gray-800">
                      {scope === 'class' ? '우리 반 (Class)' : scope === 'grade' ? '학년 전체 (Grade)' : scope === 'school' ? '학교 전체 (School)' : '외부 공개 (Public)'}
                    </span>
                    <span className="text-xs text-gray-500">
                       {scope === 'public' ? '⚠️ 주의: 전 세계 누구나 볼 수 있습니다.' : '안전한 내부 공유입니다.'}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-2xl font-bold mb-2">어떻게 보호할까요?</h2>
            <p className="text-gray-500 mb-6 text-sm">개인정보 보호와 저작권 준수를 위한 조치를 선택하세요.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-grow content-start">
              {PROTECTION_MEASURES.map((pm) => (
                <button key={pm.id} onClick={() => toggleProtection(pm.id)}
                  className={`p-3 border rounded-lg text-sm text-left transition ${project.protectionMeasures.includes(pm.id) ? 'bg-green-50 border-green-500 text-green-800 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center">
                     <div className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${project.protectionMeasures.includes(pm.id) ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>
                        {project.protectionMeasures.includes(pm.id) && <Check size={12} className="text-white"/>}
                     </div>
                     {pm.label}
                  </div>
                </button>
              ))}
              {project.protectionMeasures.length === 0 && (
                <div className="col-span-2 mt-4 p-3 bg-red-50 text-red-600 text-sm rounded flex items-center">
                  <AlertCircle size={16} className="mr-2"/> 최소 1개 이상의 보호 조치를 선택하는 것이 좋습니다.
                </div>
              )}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="text-2xl font-bold mb-2">결과물은 어떤 형태인가요?</h2>
            <div className="flex-grow grid grid-cols-3 gap-4 mt-6">
               {[
                 {id: 'report', label: '보고서', icon: '📝'},
                 {id: 'poster', label: '포스터', icon: '🎨'},
                 {id: 'webpage', label: '웹사이트', icon: '🌐'}
               ].map(opt => (
                 <button key={opt.id} onClick={() => setProject({...project, outputFormat: opt.id as any})}
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl transition ${project.outputFormat === opt.id ? 'bg-indigo-600 text-white shadow-lg transform scale-105' : 'hover:bg-gray-50 text-gray-600'}`}
                 >
                    <div className="text-4xl mb-2">{opt.icon}</div>
                    <div className="font-bold">{opt.label}</div>
                 </button>
               ))}
            </div>
          </>
        )}

        <div className="mt-8 flex justify-between pt-6 border-t">
          <button 
            onClick={() => setStep(step - 1)} 
            className="flex items-center text-gray-500 hover:text-gray-800 px-4 py-2"
          >
            <ChevronLeft size={20} className="mr-1"/> 이전
          </button>
          
          <button 
            onClick={() => step === 5 ? finishWizard() : setStep(step + 1)}
            disabled={step === 2 && !project.isMinimizationChecked}
            className={`flex items-center px-6 py-2 rounded-full font-bold text-white transition-all shadow-md
              ${step === 2 && !project.isMinimizationChecked ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
            `}
          >
            {step === 5 ? '완료 및 결과 보기' : '다음'} 
            {step !== 5 && <ArrowRight size={20} className="ml-1"/>}
          </button>
        </div>
      </div>
    </div>
  );
};
