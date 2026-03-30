import React, { useState, useEffect } from 'react';
import { CharterData, UserProgress, TOPIC_MAPPING } from '../types';
import { WIZARD_STEPS } from '../constants';
import { CharterPreview } from './CharterPreview';
import { checkForPII } from '../utils/piiGuard';
import { saveCharter } from '../services/storageService';
import { AlertCircle, ChevronLeft, ChevronRight, Save, Printer, ArrowRight } from 'lucide-react';

interface Props {
  initialData: CharterData;
  progress: UserProgress;
  onUpdateCharter: (data: CharterData) => void;
}

export const Wizard: React.FC<Props> = ({ initialData, progress, onUpdateCharter }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CharterData>(initialData);
  const [piiError, setPiiError] = useState<string | null>(null);

  const currentStepInfo = WIZARD_STEPS[step];
  
  // Check if current step was a "mistake" in the quiz
  const isMistakeTopic = currentStepInfo && progress.quizMistakes.includes(currentStepInfo.key);

  const handleOptionChange = (key: string, value: string, type: string) => {
    setData(prev => {
      const currentVal = (prev as any)[key];
      let newVal;
      
      if (type === 'checkbox') {
        if (currentVal.includes(value)) {
          newVal = currentVal.filter((v: string) => v !== value);
        } else {
          newVal = [...currentVal, value];
        }
      } else {
        newVal = value;
      }

      return { ...prev, [key]: newVal };
    });
  };

  const handleCustomRuleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const check = checkForPII(text);
    
    if (!check.safe) {
      setPiiError(`개인정보(${check.detected.join(', ')})가 감지되었습니다. 입력할 수 없습니다.`);
      // We don't update state if unsafe, or we could update with filtered text.
      // Let's just block update or strip it.
      // For UX, let's update with filtered text but warn.
      setData(prev => ({ ...prev, customRule: check.filteredText }));
    } else {
      setPiiError(null);
      setData(prev => ({ ...prev, customRule: text }));
    }
  };

  const save = () => {
    const finalData = { ...data, lastUpdated: Date.now() };
    onUpdateCharter(finalData);
    saveCharter(finalData);
    alert('저장되었습니다!');
  };

  const print = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left Column: Form */}
      <div className="w-full lg:w-1/2 flex flex-col no-print">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-grow">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Step {step + 1} / {WIZARD_STEPS.length + 1}</span>
              <span>{Math.round(((step + 1) / (WIZARD_STEPS.length + 1)) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-300" 
                style={{ width: `${((step + 1) / (WIZARD_STEPS.length + 1)) * 100}%` }}
              />
            </div>
          </div>

          {currentStepInfo ? (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">{currentStepInfo.title}</h2>
              <p className="text-slate-500 mb-6">{currentStepInfo.description}</p>
              
              {isMistakeTopic && (
                <div className="mb-6 bg-orange-50 border border-orange-200 text-orange-700 p-3 rounded-lg flex items-start gap-2 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="font-bold">퀴즈 오답 노트:</span> 이전에 이 부분에서 실수했었어요! 
                    헌장 내용을 꼼꼼히 확인하고 선택해주세요.
                  </div>
                </div>
              )}

              <div className="space-y-3 mb-8">
                {currentStepInfo.options.map((opt) => {
                  const currentVal = (data as any)[currentStepInfo.key];
                  const isSelected = currentStepInfo.type === 'checkbox' 
                    ? currentVal.includes(opt)
                    : currentVal === opt;

                  return (
                    <label 
                      key={opt}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                          : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type={currentStepInfo.type}
                        name={currentStepInfo.key}
                        value={opt}
                        checked={isSelected}
                        onChange={() => handleOptionChange(currentStepInfo.key, opt, currentStepInfo.type)}
                        className="w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-500 mr-3"
                      />
                      <span className="font-medium">{opt}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">추가 규칙 작성</h2>
              <p className="text-slate-500 mb-6">우리 반만의 특별한 규칙이 있다면 적어주세요.</p>
              
              <textarea 
                className="w-full h-40 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="예: 프로젝트 마감 3일 전에는 수정 금지..."
                value={data.customRule}
                onChange={handleCustomRuleChange}
              />
              {piiError && (
                 <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                   <AlertCircle className="w-4 h-4"/> {piiError}
                 </p>
              )}
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setStep(prev => Math.max(0, prev - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-3 text-slate-600 font-medium disabled:opacity-30 hover:bg-slate-100 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" /> 이전
          </button>
          
          <div className="flex gap-3">
             <button
              onClick={save}
              className="flex items-center gap-2 px-5 py-3 bg-white text-emerald-600 border border-emerald-200 font-medium rounded-lg hover:bg-emerald-50 transition"
            >
              <Save className="w-5 h-5" /> 저장
            </button>
            <button
              onClick={() => setStep(prev => Math.min(WIZARD_STEPS.length, prev + 1))}
              disabled={step === WIZARD_STEPS.length}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음 <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Preview */}
      <div className="w-full lg:w-1/2 bg-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center overflow-auto print:w-full print:bg-white print:p-0">
         <div className="no-print mb-4 flex justify-between w-full max-w-lg">
            <span className="text-slate-600 font-bold flex items-center gap-2">
              <Printer className="w-4 h-4" /> 미리보기
            </span>
            <button 
              onClick={print}
              className="text-indigo-600 text-sm font-bold hover:underline"
            >
              프린트하기
            </button>
         </div>
         <div className="w-full max-w-[210mm] bg-white shadow-2xl print:shadow-none mx-auto aspect-[1/1.414] overflow-hidden text-[10px] sm:text-xs md:text-sm print:text-base print:overflow-visible print:w-full">
            <CharterPreview data={data} />
         </div>
      </div>
    </div>
  );
};