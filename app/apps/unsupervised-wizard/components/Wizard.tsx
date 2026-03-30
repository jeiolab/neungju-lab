import React, { useState } from 'react';
import { WizardData, ProjectTheme, MethodType, UserProgress } from '../types';
import { THEMES } from '../constants';
import { AlertTriangle, ChevronRight, Check, ShieldCheck } from 'lucide-react';

interface WizardProps {
  onComplete: (data: WizardData) => void;
  onStepComplete: (points: number) => void;
  userProgress: UserProgress;
}

const PII_REGEX = /(01[016789]-?[0-9]{3,4}-?[0-9]{4})|(\d{6}-?[1-4]\d{6})|([가-힣]{2,4}(?!\s?(학교|고등학교)))/g;
// Note: Name regex is simple for demo. 

const Wizard: React.FC<WizardProps> = ({ onComplete, onStepComplete, userProgress }) => {
  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState<ProjectTheme>(ProjectTheme.STUDY);
  const [data, setData] = useState<WizardData>({
    theme: ProjectTheme.STUDY,
    problem: '',
    attributes: [],
    method: MethodType.CLUSTERING,
    successCriteria: [],
    interpretation: ''
  });
  const [piiWarning, setPiiWarning] = useState<string | null>(null);

  const checkPII = (text: string) => {
    if (PII_REGEX.test(text)) {
        // Simple heuristic check: if it looks like a phone number or ID
        if (text.match(/01[016789]/) || text.match(/\d{6}-?[1-4]/)) {
             return true;
        }
    }
    return false;
  };

  const handleNext = () => {
    // Validation
    if (step === 1 && data.problem.length < 10) {
        alert("문제 정의를 10자 이상 구체적으로 적어주세요.");
        return;
    }
    if (step === 2 && data.attributes.length < 2) {
        alert("속성을 2개 이상 선택해주세요.");
        return;
    }
    if (step === 4 && data.successCriteria.length === 0) {
        alert("성공 기준을 하나 이상 선택해주세요.");
        return;
    }
    if (step === 5) {
        if (data.interpretation.length < 20) {
            alert("해석을 20자 이상 작성해주세요.");
            return;
        }
        if (checkPII(data.interpretation)) {
            setPiiWarning("개인정보(전화번호, 주민번호 등)가 포함된 것으로 보입니다. 수정해주세요.");
            return;
        }
        setPiiWarning(null);
        onComplete(data);
    }
    
    onStepComplete(15);
    if (step < 5) setStep(step + 1);
  };

  const handleThemeSelect = (t: ProjectTheme) => {
    setTheme(t);
    setData(prev => ({
        ...prev, 
        theme: t, 
        attributes: [], 
        method: THEMES[t].defaultMethod
    }));
  };

  const handleAttributeToggle = (attr: string) => {
    setData(prev => {
        const exists = prev.attributes.includes(attr);
        if (exists) return { ...prev, attributes: prev.attributes.filter(a => a !== attr) };
        if (prev.attributes.length >= 5) return prev; // Max 5
        return { ...prev, attributes: [...prev.attributes, attr] };
    });
  };

  const generateAutoDraft = () => {
    // Determine template based on method
    let draft = "";
    const attrs = data.attributes.join(', ');
    
    if (data.method === MethodType.CLUSTERING) {
        draft = `분석 결과, (${attrs}) 속성을 기준으로 데이터를 군집화했을 때, 크게 3가지 유형으로 나뉘었습니다. A그룹은 ~한 특징을 보이고, B그룹은 ~한 특징을 보입니다. 이를 통해 우리 반 학생들의 생활 패턴이 다양함을 알 수 있습니다.`;
    } else if (data.method === MethodType.OUTLIER) {
        draft = `(${attrs}) 데이터를 분석한 결과, 일반적인 범위를 벗어나는 이상치 데이터가 N개 발견되었습니다. 이는 센서 오류이거나 환기가 시급한 상황일 수 있습니다.`;
    } else {
        draft = `(${attrs})의 분포를 밀도 추정으로 시각화한 결과, 특정 시간대와 구간에 데이터가 집중되어 있음을 확인했습니다. 이는 학생들이 선호하는 패턴이 뚜렷하다는 것을 의미합니다.`;
    }
    setData(prev => ({ ...prev, interpretation: draft }));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">
      {/* Header / Progress */}
      <div className="bg-slate-900 text-white p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">🛠️ 프로젝트 설계 위저드</h2>
            <span className="bg-indigo-600 px-3 py-1 rounded-full text-sm font-bold">Step {step}/5</span>
        </div>
        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-green-400 h-full transition-all duration-500" style={{ width: `${(step/5)*100}%` }}></div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-8 overflow-y-auto">
        
        {/* Step 1: Theme & Problem */}
        {step === 1 && (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">1. 주제 선택</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.entries(THEMES).map(([key, val]) => (
                            <button 
                                key={key}
                                onClick={() => handleThemeSelect(key as ProjectTheme)}
                                className={`p-4 rounded-xl border-2 text-left transition-all
                                    ${theme === key ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-slate-200 hover:border-slate-300'}
                                `}
                            >
                                <div className="font-bold text-slate-800 mb-1">{val.label}</div>
                                <div className="text-xs text-slate-500 leading-snug">{val.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">2. 문제 정의</h3>
                    <p className="text-sm text-slate-500 mb-2">이 프로젝트를 통해 무엇을 알고 싶나요? (2문장 이내)</p>
                    <textarea 
                        className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                        rows={3}
                        placeholder="예: 우리 반 친구들의 수면 시간과 성적 사이에는 어떤 학습 패턴 그룹이 존재하는지 알고 싶다."
                        value={data.problem}
                        onChange={(e) => setData({...data, problem: e.target.value})}
                    />
                </div>
            </div>
        )}

        {/* Step 2: Attributes */}
        {step === 2 && (
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">어떤 데이터를 사용할까요? (3~5개 선택)</h3>
                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg mb-4 flex items-start gap-2 text-sm">
                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                    <span>개인정보(이름, 전화번호, 학번 등)는 포함할 수 없습니다. 비식별화된 데이터만 선택하세요.</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {THEMES[theme].safeAttributes.map((attr) => (
                        <label key={attr} className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                            <input 
                                type="checkbox" 
                                checked={data.attributes.includes(attr)}
                                onChange={() => handleAttributeToggle(attr)}
                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            />
                            <span className="ml-3 font-medium text-slate-700">{attr}</span>
                        </label>
                    ))}
                </div>
            </div>
        )}

        {/* Step 3: Method */}
        {step === 3 && (
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-800">어떤 방법으로 분석할까요?</h3>
                <div className="grid grid-cols-1 gap-4">
                    {Object.values(MethodType).map((m) => (
                        <label key={m} className={`flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all ${data.method === m ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}>
                            <input 
                                type="radio" 
                                name="method"
                                checked={data.method === m}
                                onChange={() => setData({...data, method: m})}
                                className="w-5 h-5 text-indigo-600"
                            />
                            <div className="ml-4">
                                <span className="block font-bold text-slate-800 text-lg">{m}</span>
                                <span className="text-sm text-slate-500">
                                    {m === MethodType.CLUSTERING && "데이터를 비슷한 특성끼리 그룹화합니다."}
                                    {m === MethodType.OUTLIER && "일반적이지 않은 예외 데이터를 찾아냅니다."}
                                    {m === MethodType.DENSITY && "데이터가 어디에 집중되어 있는지 파악합니다."}
                                </span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        )}

        {/* Step 4: Criteria */}
        {step === 4 && (
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">프로젝트 성공 기준은 무엇인가요?</h3>
                <div className="space-y-3">
                    {["결과를 직관적으로 해석할 수 있는가? (해석 가능성)", "실생활(학교 생활) 개선에 도움이 되는가? (유용성)", "개인정보를 침해하지 않았는가? (윤리)", "데이터의 특징을 잘 반영했는가?"].map((crit, idx) => (
                        <label key={idx} className="flex items-center p-3 hover:bg-slate-50 rounded-lg">
                            <input 
                                type="checkbox"
                                checked={data.successCriteria.includes(crit)}
                                onChange={(e) => {
                                    if(e.target.checked) setData({...data, successCriteria: [...data.successCriteria, crit]});
                                    else setData({...data, successCriteria: data.successCriteria.filter(c => c !== crit)});
                                }}
                                className="w-5 h-5 text-indigo-600 rounded"
                            />
                            <span className="ml-3 text-slate-700">{crit}</span>
                        </label>
                    ))}
                </div>
            </div>
        )}

        {/* Step 5: Interpretation */}
        {step === 5 && (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">결과 해석 (초안 작성)</h3>
                    <button 
                        onClick={generateAutoDraft}
                        className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold hover:bg-indigo-200"
                    >
                        ✨ AI 자동 생성 (Rule-based)
                    </button>
                </div>
                
                <textarea 
                    className="w-full p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 h-40"
                    placeholder="분석 결과를 바탕으로 발견한 점을 적어보세요."
                    value={data.interpretation}
                    onChange={(e) => setData({...data, interpretation: e.target.value})}
                />
                
                {piiWarning && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        {piiWarning}
                    </div>
                )}

                <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600">
                    <strong>💡 팁:</strong> "A그룹은 공부 시간은 길지만 수면 시간이 부족한 '벼락치기형'으로 보인다" 처럼 구체적으로 해석해보세요.
                </div>
            </div>
        )}

      </div>

      {/* Footer Controls */}
      <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between">
        {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg">
                이전
            </button>
        ) : <div></div>}
        
        <button 
            onClick={handleNext}
            className="flex items-center px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg transition-transform active:scale-95"
        >
            {step === 5 ? '완료 및 보고서 생성' : '다음 단계'}
            {step < 5 && <ChevronRight className="ml-2 w-5 h-5" />}
            {step === 5 && <Check className="ml-2 w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default Wizard;
