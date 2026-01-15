import React, { useState, useEffect } from 'react';
import { ProjectDraft, SDG, WizardStep } from '../types';
import { SDGS, ROLE_CARDS } from '../constants';
import { generateAIFeedback, suggestDataSources } from '../services/geminiService';
import { AlertCircle, Check, ChevronLeft, ChevronRight, Save, Printer, Lightbulb, Users, AlertTriangle } from 'lucide-react';

interface WizardProps {
  onComplete: (project: ProjectDraft) => void;
  initialDraft?: ProjectDraft;
}

const INITIAL_DRAFT: ProjectDraft = {
  topic: '',
  sdgId: null,
  problemCurrent: '',
  problemGoal: '',
  dataFeatures: '',
  dataLabels: '',
  dataCollectionMethod: '',
  isDataSufficient: null,
  modelType: null,
  evalMetrics: '',
  ethicsCheck: { privacy: false, bias: false, transparency: false },
  criticalThinking: { condition: '', counterExample: '', application: '' }
};

const PII_REGEX = {
  residentNumber: /\d{6}[-~]\d{7}/,
  phoneNumber: /01[016789][-~.]?\d{3,4}[-~.]?\d{4}/,
};

export const Wizard: React.FC<WizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState<WizardStep>('intro');
  const [draft, setDraft] = useState<ProjectDraft>(INITIAL_DRAFT);
  const [warning, setWarning] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [dataSourceSuggestion, setDataSourceSuggestion] = useState<string | null>(null);

  // Auto-save draft to local storage
  useEffect(() => {
    localStorage.setItem('temp_project_draft', JSON.stringify(draft));
  }, [draft]);

  const checkForPII = (text: string): boolean => {
    if (PII_REGEX.residentNumber.test(text)) return true;
    if (PII_REGEX.phoneNumber.test(text)) return true;
    return false;
  };

  const handleChange = (field: keyof ProjectDraft, value: any) => {
    if (typeof value === 'string' && checkForPII(value)) {
      setWarning("개인정보(전화번호, 주민번호 등)는 입력할 수 없습니다!");
      return;
    }
    setWarning(null);
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: keyof ProjectDraft, child: string, value: any) => {
    setDraft(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [child]: value
      }
    }));
  };

  const handleDataSufficientCheck = async (isSufficient: boolean) => {
      handleChange('isDataSufficient', isSufficient);
      if (!isSufficient && process.env.API_KEY) {
          setIsLoadingAI(true);
          const suggestion = await suggestDataSources(draft.topic);
          setDataSourceSuggestion(suggestion);
          setIsLoadingAI(false);
      }
  };

  const handleRequestFeedback = async () => {
    setIsLoadingAI(true);
    try {
      const feedback = await generateAIFeedback(draft);
      setAiFeedback(feedback);
    } catch (e) {
      setAiFeedback("AI 피드백을 불러올 수 없습니다. API 키를 확인해주세요.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const steps: WizardStep[] = ['intro', 'sdg', 'problem', 'data', 'model', 'eval', 'ethics', 'review'];
  
  const nextStep = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1]);
  };
  
  const prevStep = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) setStep(steps[currentIndex - 1]);
  };

  const renderIntro = () => (
    <div className="space-y-6 text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-blue-600">AI 프로젝트 기획 위저드</h2>
      <p className="text-gray-600 text-lg">
        반갑습니다! 당신의 멘토가 되어 세상을 바꾸는 AI 프로젝트 설계를 도와드릴게요.<br/>
        문제를 정의하고, 데이터를 모으고, 해결책을 만들어봅시다.
      </p>
      <div className="flex justify-center gap-4 py-8">
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 w-64">
          <div className="text-4xl mb-2">🌱</div>
          <h3 className="font-bold">문제 정의</h3>
          <p className="text-sm text-gray-500">무엇을 해결하고 싶나요?</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 w-64">
           <div className="text-4xl mb-2">📊</div>
          <h3 className="font-bold">데이터 설계</h3>
          <p className="text-sm text-gray-500">어떤 재료가 필요한가요?</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 w-64">
           <div className="text-4xl mb-2">🤖</div>
          <h3 className="font-bold">모델 & 윤리</h3>
          <p className="text-sm text-gray-500">어떻게 만들고 평가할까요?</p>
        </div>
      </div>
       <div className="max-w-md mx-auto">
        <label className="block text-left text-sm font-medium text-gray-700 mb-1">먼저, 프로젝트 주제를 한 문장으로 적어보세요.</label>
        <input 
            type="text" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="예: 우리 학교 급식 잔반 줄이기 프로젝트"
            value={draft.topic}
            onChange={(e) => handleChange('topic', e.target.value)}
        />
      </div>
      <button onClick={nextStep} disabled={!draft.topic} className="btn-primary mt-8">시작하기</button>
    </div>
  );

  const renderSDG = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">어떤 지속가능발전목표(SDGs)와 관련이 있나요?</h2>
      <p className="text-gray-500">해당하는 목표를 하나 선택해주세요.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[60vh] overflow-y-auto p-2">
        {SDGS.map((sdg) => (
          <button
            key={sdg.id}
            onClick={() => handleChange('sdgId', sdg.id)}
            className={`p-3 rounded-lg text-white text-left transition-transform hover:scale-105 ${sdg.color} ${draft.sdgId === sdg.id ? 'ring-4 ring-offset-2 ring-gray-800 scale-105' : 'opacity-80 hover:opacity-100'}`}
          >
            <div className="font-bold text-lg">{sdg.id}</div>
            <div className="text-sm leading-tight">{sdg.name}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderProblem = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">문제를 명확하게 정의해봅시다.</h2>
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h4 className="font-bold text-blue-800 mb-1">💡 멘토의 팁</h4>
        <p className="text-sm text-blue-700">
          "그냥 불편하다"보다는 "현재는 ~상태인데, 미래에 ~상태가 되길 원한다"고 구체적으로 적어보세요.
        </p>
      </div>

      <div>
        <label className="block font-medium mb-2">현재 상태 (Current State)</label>
        <textarea 
          className="w-full p-3 border rounded-lg h-24" 
          placeholder="예: 학생들이 급식 맛을 몰라서 많이 버리고, 처리 비용이 연간 1천만원 발생함."
          value={draft.problemCurrent}
          onChange={(e) => handleChange('problemCurrent', e.target.value)}
        />
      </div>
      
      <div>
        <label className="block font-medium mb-2">목표 상태 (Goal State)</label>
        <textarea 
          className="w-full p-3 border rounded-lg h-24" 
          placeholder="예: 오늘의 메뉴 사진과 AI 선호도 예측을 보여줘서 잔반을 20% 줄임."
          value={draft.problemGoal}
          onChange={(e) => handleChange('problemGoal', e.target.value)}
        />
      </div>
    </div>
  );

  const renderData = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">데이터는 AI의 연료입니다.</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-2">특성 (Features - 입력)</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-lg"
            placeholder="예: 날짜, 메뉴명, 날씨, 칼로리"
            value={draft.dataFeatures}
            onChange={(e) => handleChange('dataFeatures', e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-2">레이블 (Labels - 정답)</label>
          <input 
            type="text" 
            className="w-full p-3 border rounded-lg"
            placeholder="예: 잔반량(kg) 또는 선호도(좋음/나쁨)"
            value={draft.dataLabels}
            onChange={(e) => handleChange('dataLabels', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2">데이터 수집 방법</label>
        <select 
            className="w-full p-3 border rounded-lg"
            value={draft.dataCollectionMethod}
            onChange={(e) => handleChange('dataCollectionMethod', e.target.value)}
        >
            <option value="">선택해주세요</option>
            <option value="public">공공데이터 포털 (기존 데이터)</option>
            <option value="sensor">센서/카메라 직접 측정</option>
            <option value="survey">설문조사 (구글 폼 등)</option>
            <option value="crawling">웹 크롤링</option>
        </select>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="font-medium mb-2">충분한 양질의 데이터를 구할 수 있나요?</p>
        <div className="flex gap-4">
          <button 
            onClick={() => handleDataSufficientCheck(true)}
            className={`flex-1 py-2 rounded-lg border ${draft.isDataSufficient === true ? 'bg-green-100 border-green-500 text-green-700 font-bold' : 'bg-white hover:bg-gray-50'}`}
          >
            네, 충분합니다
          </button>
          <button 
            onClick={() => handleDataSufficientCheck(false)}
            className={`flex-1 py-2 rounded-lg border ${draft.isDataSufficient === false ? 'bg-red-100 border-red-500 text-red-700 font-bold' : 'bg-white hover:bg-gray-50'}`}
          >
            아니요, 부족합니다
          </button>
        </div>
        {draft.isDataSufficient === false && (
            <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded border border-yellow-200 text-sm">
                <p className="font-bold flex items-center gap-2"><Lightbulb size={16}/> 데이터가 부족하다면?</p>
                <ul className="list-disc ml-5 mt-1 space-y-1">
                    <li>직접 설문조사를 만들어보세요.</li>
                    <li>비슷한 문제의 오픈 데이터셋(Kaggle 등)을 찾아보세요.</li>
                    <li>규칙 기반(Rule-based) 시스템으로 시작해 데이터를 모으는 것도 방법입니다.</li>
                </ul>
                {isLoadingAI && <div className="mt-2 text-gray-500">AI가 대안을 생각 중입니다...</div>}
                {dataSourceSuggestion && (
                    <div className="mt-3 p-3 bg-white rounded border border-yellow-300 text-gray-700 whitespace-pre-wrap">
                        {dataSourceSuggestion}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );

  const renderModel = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">어떤 AI 모델을 사용할까요?</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { id: 'regression', icon: '📈', title: '회귀 (Regression)', desc: '숫자를 예측합니다.\n(예: 내일 기온, 잔반 무게)' },
          { id: 'classification', icon: '🏷️', title: '분류 (Classification)', desc: '카테고리를 맞춥니다.\n(예: 스팸/햄, 개/고양이)' },
          { id: 'clustering', icon: '🧩', title: '군집 (Clustering)', desc: '비슷한 것끼리 묶습니다.\n(예: 고객 성향 그룹화)' }
        ].map(type => (
          <button
            key={type.id}
            onClick={() => handleChange('modelType', type.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${draft.modelType === type.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 bg-white'}`}
          >
            <div className="text-3xl mb-2">{type.icon}</div>
            <div className="font-bold text-lg mb-1">{type.title}</div>
            <div className="text-sm text-gray-500 whitespace-pre-line">{type.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderEval = () => (
     <div className="space-y-6">
      <h2 className="text-2xl font-bold">평가 및 검증 계획</h2>
      <p className="text-gray-600">만든 모델이 잘 작동하는지 어떻게 알 수 있을까요?</p>
      
      <div>
        <label className="block font-medium mb-2">평가 지표 (Metrics)</label>
        <input 
            type="text" 
            className="w-full p-3 border rounded-lg"
            placeholder="예: 정확도(Accuracy), 오차(MSE), 정밀도(Precision)"
            value={draft.evalMetrics}
            onChange={(e) => handleChange('evalMetrics', e.target.value)}
        />
      </div>

      <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
        <h3 className="font-bold text-purple-800 mb-3">🤔 생각해볼 문제 (Critical Thinking)</h3>
        <div className="space-y-4">
            <div>
                <label className="text-sm font-bold text-purple-700 block mb-1">어떤 조건에서 모델이 실패할 수 있나요?</label>
                <input 
                    type="text" 
                    className="w-full p-2 border border-purple-200 rounded text-sm"
                    placeholder="예: 조명이 너무 어두우면 잔반 사진을 인식 못함"
                    value={draft.criticalThinking.condition}
                    onChange={(e) => handleNestedChange('criticalThinking', 'condition', e.target.value)}
                />
            </div>
            <div>
                <label className="text-sm font-bold text-purple-700 block mb-1">오류가 발생했을 때의 대책은?</label>
                 <input 
                    type="text" 
                    className="w-full p-2 border border-purple-200 rounded text-sm"
                    placeholder="예: 수동 입력 버튼을 제공함"
                    value={draft.criticalThinking.counterExample}
                    onChange={(e) => handleNestedChange('criticalThinking', 'counterExample', e.target.value)}
                />
            </div>
        </div>
      </div>
    </div>
  );

  const renderEthics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">윤리 체크리스트</h2>
      <p className="text-gray-600">AI는 강력한 도구인 만큼 책임감 있게 사용해야 합니다.</p>

      <div className="space-y-3">
        {[
            { key: 'privacy', label: '개인정보 보호', desc: '이름, 전화번호 등 민감한 정보를 수집하지 않거나 익명화했나요?' },
            { key: 'bias', label: '편향성 방지', desc: '데이터가 특정 성별, 연령, 지역에 치우치지 않았나요?' },
            { key: 'transparency', label: '투명성 및 설명 가능성', desc: 'AI가 왜 그런 결과를 냈는지 설명할 수 있나요?' }
        ].map((item) => (
             <label key={item.key} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input 
                    type="checkbox" 
                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    checked={draft.ethicsCheck[item.key as keyof typeof draft.ethicsCheck]}
                    onChange={(e) => handleNestedChange('ethicsCheck', item.key, e.target.checked)}
                />
                <div>
                    <div className="font-bold">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
            </label>
        ))}
      </div>
      
      {(!draft.ethicsCheck.privacy || !draft.ethicsCheck.bias) && (
          <div className="flex items-center gap-2 text-red-500 text-sm font-bold animate-pulse">
              <AlertTriangle size={16}/>
              윤리적 검토를 완료해야 프로젝트를 진행할 수 있습니다.
          </div>
      )}
    </div>
  );

  const renderReview = () => {
    const selectedSdg = SDGS.find(s => s.id === draft.sdgId);
    
    return (
    <div className="space-y-6 print-section">
      <div className="flex justify-between items-center no-print">
        <h2 className="text-2xl font-bold">기획서 검토 및 완성</h2>
        <div className="flex gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100">
                <Printer size={18}/> PDF 저장
            </button>
            <button onClick={() => onComplete(draft)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow-md">
                <Save size={18}/> 프로젝트 완료
            </button>
        </div>
      </div>

      <div className="border-2 border-gray-800 p-8 bg-white shadow-lg" id="print-area">
        <h1 className="text-3xl font-black text-center mb-6 underline decoration-4 decoration-blue-200">
            {draft.topic || '제목 미정'}
        </h1>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded border">
                <h3 className="font-bold text-gray-500 text-sm mb-1">관련 SDGs</h3>
                {selectedSdg ? (
                    <span className={`inline-block px-2 py-1 rounded text-white text-sm font-bold ${selectedSdg.color}`}>
                        #{selectedSdg.id}. {selectedSdg.name}
                    </span>
                ) : <span className="text-gray-400">선택 안함</span>}
            </div>
             <div className="p-4 bg-gray-50 rounded border">
                <h3 className="font-bold text-gray-500 text-sm mb-1">모델 유형</h3>
                <span className="font-bold text-lg">
                    {draft.modelType === 'regression' && '📈 회귀 (예측)'}
                    {draft.modelType === 'classification' && '🏷️ 분류 (판별)'}
                    {draft.modelType === 'clustering' && '🧩 군집 (그룹화)'}
                    {!draft.modelType && '-'}
                </span>
            </div>
        </div>

        <section className="mb-6">
            <h3 className="text-xl font-bold border-b-2 border-gray-200 mb-3 pb-1">1. 문제 정의</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <span className="font-bold text-red-600">AS-IS (현재)</span>
                    <p className="p-3 bg-red-50 rounded mt-1 min-h-[80px] text-sm">{draft.problemCurrent}</p>
                </div>
                <div>
                    <span className="font-bold text-blue-600">TO-BE (목표)</span>
                    <p className="p-3 bg-blue-50 rounded mt-1 min-h-[80px] text-sm">{draft.problemGoal}</p>
                </div>
            </div>
        </section>

        <section className="mb-6">
            <h3 className="text-xl font-bold border-b-2 border-gray-200 mb-3 pb-1">2. 데이터 전략</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><strong>특성(Features):</strong> {draft.dataFeatures}</li>
                <li><strong>정답(Labels):</strong> {draft.dataLabels}</li>
                <li><strong>수집 방법:</strong> {draft.dataCollectionMethod === 'public' ? '공공데이터' : draft.dataCollectionMethod === 'survey' ? '설문조사' : draft.dataCollectionMethod}</li>
            </ul>
        </section>

         <section className="mb-6">
            <h3 className="text-xl font-bold border-b-2 border-gray-200 mb-3 pb-1">3. 평가 및 윤리</h3>
            <div className="text-sm space-y-2">
                <p><strong>평가 지표:</strong> {draft.evalMetrics}</p>
                <div className="flex gap-2 mt-2">
                    {draft.ethicsCheck.privacy && <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs border border-green-200">✅ 개인정보 보호</span>}
                    {draft.ethicsCheck.bias && <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs border border-green-200">✅ 편향성 점검</span>}
                </div>
            </div>
        </section>
        
        <section className="mb-6 no-print">
             <h3 className="text-xl font-bold border-b-2 border-gray-200 mb-3 pb-1 flex items-center gap-2">
                <Users size={20}/> 모둠 역할 분담 추천
             </h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ROLE_CARDS.map((role, idx) => (
                    <div key={idx} className="p-2 border rounded bg-gray-50 text-xs">
                        <strong className="block">{role.title}</strong>
                        <span className="text-gray-500">{role.desc}</span>
                    </div>
                ))}
             </div>
        </section>

        <div className="mt-8 no-print border-t pt-6">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    ✨ AI 멘토 피드백
                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">Beta</span>
                </h3>
                <button 
                    onClick={handleRequestFeedback} 
                    disabled={isLoadingAI}
                    className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 disabled:bg-gray-300"
                >
                    {isLoadingAI ? '분석 중...' : '피드백 요청하기'}
                </button>
             </div>
             {aiFeedback && (
                 <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-sm whitespace-pre-wrap animate-fade-in">
                     {aiFeedback}
                 </div>
             )}
             {!aiFeedback && !isLoadingAI && (
                 <p className="text-sm text-gray-400">버튼을 누르면 AI가 기획서를 분석하여 조언을 해줍니다.</p>
             )}
        </div>
      </div>
    </div>
  )};

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Progress Bar */}
      <div className="mb-8 no-print">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
           <span>진행률</span>
           <span>{Math.round((steps.indexOf(step) / (steps.length - 1)) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${(steps.indexOf(step) / (steps.length - 1)) * 100}%` }}
            ></div>
        </div>
      </div>

      {warning && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg flex items-center gap-2 animate-bounce">
            <AlertCircle /> {warning}
        </div>
      )}

      {/* Step Content */}
      <div className="min-h-[400px] bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-slate-100">
        {step === 'intro' && renderIntro()}
        {step === 'sdg' && renderSDG()}
        {step === 'problem' && renderProblem()}
        {step === 'data' && renderData()}
        {step === 'model' && renderModel()}
        {step === 'eval' && renderEval()}
        {step === 'ethics' && renderEthics()}
        {step === 'review' && renderReview()}
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between mt-6 no-print">
        <button 
            onClick={prevStep} 
            disabled={step === 'intro'}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
            <ChevronLeft size={20} /> 이전
        </button>
        
        {step !== 'review' && (
             <button 
                onClick={nextStep}
                disabled={step === 'ethics' && (!draft.ethicsCheck.privacy || !draft.ethicsCheck.bias)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                다음 <ChevronRight size={20} />
            </button>
        )}
      </div>
    </div>
  );
};