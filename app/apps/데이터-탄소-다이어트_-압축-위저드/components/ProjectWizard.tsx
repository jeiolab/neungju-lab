import React, { useState } from 'react';
import { ProjectDraft, CompressionType } from '../types';
import { saveProject } from '../services/storageService';
import { Save, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

interface ProjectWizardProps {
  onComplete: (project: ProjectDraft) => void;
}

const ProjectWizard: React.FC<ProjectWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ProjectDraft>>({
    currentHabits: [],
    strategyReason: [],
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const updateField = (key: keyof ProjectDraft, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: 'currentHabits' | 'strategyReason', item: string) => {
    setFormData(prev => {
      const list = prev[key] || [];
      if (list.includes(item)) {
        return { ...prev, [key]: list.filter(i => i !== item) };
      }
      return { ...prev, [key]: [...list, item] };
    });
  };

  const handleSubmit = () => {
    const finalProject: ProjectDraft = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      goal: formData.goal || '',
      targetData: formData.targetData || '',
      currentHabits: formData.currentHabits || [],
      strategy: formData.strategy || CompressionType.HYBRID,
      strategyReason: formData.strategyReason || [],
      executionPlan: formData.executionPlan || '',
      expectedEffect: formData.expectedEffect || '',
    };
    saveProject(finalProject);
    onComplete(finalProject);
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-emerald-800">1. 프로젝트 목표 설정</h3>
      <div className="grid grid-cols-2 gap-4">
        {['저장공간 절약', '전송 시간 단축', '데이터 품질 유지', '보안 및 공유 편의'].map(opt => (
          <button
            key={opt}
            onClick={() => updateField('goal', opt)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              formData.goal === opt ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-emerald-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-emerald-800">2. 다이어트 대상 데이터</h3>
      <div className="grid grid-cols-2 gap-4">
        {['사진 (갤러리/클라우드)', '동영상 (강의/촬영)', '음원/녹음 파일', '문서 (과제/PDF)'].map(opt => (
          <button
            key={opt}
            onClick={() => updateField('targetData', opt)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              formData.targetData === opt ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-emerald-800">3. 현재 나의 습관 점검</h3>
      <p className="text-gray-600 mb-4">해당되는 것을 모두 선택하세요.</p>
      <div className="space-y-3">
        {['모든 파일을 원본 그대로 공유한다', '필요 없는 연사(연속 촬영) 사진도 보관한다', '같은 파일을 여러 곳(카톡, 드라이브)에 둔다', '화질 설정을 항상 "최고"로 둔다'].map(habit => (
          <label key={habit} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={formData.currentHabits?.includes(habit)}
              onChange={() => toggleArrayItem('currentHabits', habit)}
              className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <span>{habit}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-emerald-800">4. 압축 전략 선택</h3>
      <div className="flex flex-col space-y-4">
        {Object.values(CompressionType).map(type => (
          <button
            key={type}
            onClick={() => updateField('strategy', type)}
            className={`p-4 rounded-xl border-2 flex justify-between items-center transition-all ${
              formData.strategy === type ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
            }`}
          >
            <span className="font-medium">{type}</span>
            {formData.strategy === type && <CheckCircle className="w-5 h-5 text-indigo-600" />}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <p className="font-semibold mb-2">선택 근거 (다중 선택)</p>
        <div className="space-y-2">
           {['원본 보존이 필수적이라서', '사람 눈/귀로 구분이 안 돼서', '용량을 최대로 줄여야 해서', '장기 보관용이라서'].map(reason => (
             <label key={reason} className="flex items-center space-x-2">
               <input 
                  type="checkbox"
                  checked={formData.strategyReason?.includes(reason)}
                  onChange={() => toggleArrayItem('strategyReason', reason)}
                  className="rounded text-indigo-600"
               />
               <span className="text-sm">{reason}</span>
             </label>
           ))}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-bold text-emerald-800">5. 실행 계획 및 예상 효과</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">구체적 실행 계획 (3줄 요약)</label>
        <textarea
          value={formData.executionPlan || ''}
          onChange={(e) => updateField('executionPlan', e.target.value)}
          placeholder="예: 1. 갤러리 정리 앱 설치 2. 중복 사진 삭제 3. 클라우드 업로드 시 '저장 용량 절약' 옵션 켜기"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 h-32"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">예상되는 긍정적 효과</label>
        <select
          value={formData.expectedEffect || ''}
          onChange={(e) => updateField('expectedEffect', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        >
          <option value="">선택하세요</option>
          <option value="저장공간 30% 이상 확보">저장공간 30% 이상 확보</option>
          <option value="데이터 전송 속도 2배 향상">데이터 전송 속도 2배 향상</option>
          <option value="데이터 요금 절약">데이터 요금 절약</option>
          <option value="디지털 탄소 발자국 감소 기여">디지털 탄소 발자국 감소 기여</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Save className="w-6 h-6" /> 프로젝트 위저드
        </h2>
        <span className="text-emerald-100 font-mono">Step {step}/5</span>
      </div>
      
      <div className="p-8 min-h-[400px]">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </div>

      <div className="p-6 bg-gray-50 border-t flex justify-between">
        <button
          onClick={handlePrev}
          disabled={step === 1}
          className={`flex items-center px-4 py-2 rounded-lg font-medium ${step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> 이전
        </button>
        
        {step < 5 ? (
          <button
            onClick={handleNext}
            className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            다음 <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            프로젝트 생성 완료! <Save className="w-4 h-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectWizard;