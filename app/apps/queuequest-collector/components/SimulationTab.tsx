import React, { useState, useEffect } from 'react';
import { PROBLEMS, METRICS, METHODS } from '../constants';
import { SimulationPlan, UserProfile } from '../types';
import { calculateXP, saveProfile } from '../utils';
import { AlertTriangle, CheckCircle, HelpCircle, ArrowRight, Save, RotateCcw } from 'lucide-react';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  difficulty: string;
}

const SimulationTab: React.FC<Props> = ({ profile, setProfile, difficulty }) => {
  const [step, setStep] = useState(1);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  
  const [plan, setPlan] = useState<SimulationPlan>({
    problem: PROBLEMS[0].id,
    metrics: [],
    dataType: 'structured',
    method: '',
    duration: 1,
    sampleSize: 50,
    timeSlots: [],
    ethics: { privacy: false, copyright: false, consent: false }
  });

  // Bias & Logic Checks
  useEffect(() => {
    const newWarnings: string[] = [];

    // Step 3: Sampling Bias Checks
    if (step === 3) {
      if (plan.timeSlots.length === 1) {
        newWarnings.push("⚠️ 대표성 경고: 특정 시간대(1개)만 선택하면 전체 상황을 설명하기 어렵습니다.");
      }
      if (plan.sampleSize < 30) {
        newWarnings.push("⚠️ 통계적 유의성: 표본 크기가 너무 작습니다 (최소 30명 권장).");
      }
      if (plan.duration < 3) {
        newWarnings.push("⚠️ 기간 경고: 하루 이틀 데이터로는 '우연'일 가능성을 배제하기 어렵습니다.");
      }
    }

    // Data Type Mismatch Hints
    if (step === 2) {
      const selectedMetrics = METRICS.filter(m => plan.metrics.includes(m.id));
      const needsUnstructured = selectedMetrics.some(m => m.id === 'satisfaction' && plan.dataType === 'structured');
      const needsStructured = selectedMetrics.some(m => m.recommendedType === 'structured' && plan.dataType === 'unstructured');

      if (needsStructured && plan.dataType === 'unstructured') {
         newWarnings.push("💡 팁: 대기시간, 인원 수 등은 '정형 데이터(숫자)'로 수집하는 것이 분석에 유리합니다.");
      }
    }

    setWarnings(newWarnings);
  }, [plan, step]);

  const handleNext = () => {
    if (step === 1 && plan.metrics.length === 0) return alert("최소 1개의 목표 지표를 선택해주세요!");
    if (step === 2 && !plan.method) return alert("수집 방법을 선택해주세요!");
    if (step === 3 && plan.timeSlots.length === 0) return alert("최소 1개의 시간대를 선택해주세요!");
    if (step === 4) {
       // Check ethics
       const ethicsCount = Object.values(plan.ethics).filter(Boolean).length;
       if (ethicsCount < 3) {
           if(!confirm("윤리 체크리스트를 모두 확인하지 않았습니다. 그래도 진행할까요? (감점 요인)")) return;
       }
       finishWizard();
       return;
    }
    setStep(s => s + 1);
  };

  const finishWizard = () => {
    setCompleted(true);
    let xpGain = 50;
    const badges: string[] = [...profile.badges];
    
    // Logic for rewards
    if (warnings.length === 0) xpGain += 50; // Bonus for good sampling
    if (Object.values(plan.ethics).every(Boolean)) {
        xpGain += 30;
        if (!badges.includes('ethical_master')) badges.push('ethical_master');
    }
    if (!badges.includes('first_plan')) badges.push('first_plan');

    // Save Plan locally
    localStorage.setItem('queuequest_last_plan', JSON.stringify(plan));
    
    // Update Profile
    const newProfile = calculateXP({ ...profile, badges }, xpGain);
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const reset = () => {
    setStep(1);
    setCompleted(false);
    setWarnings([]);
    setPlan({
      problem: PROBLEMS[0].id,
      metrics: [],
      dataType: 'structured',
      method: '',
      duration: 1,
      sampleSize: 50,
      timeSlots: [],
      ethics: { privacy: false, copyright: false, consent: false }
    });
  };

  if (completed) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg border border-indigo-100 animate-fade-in">
        <div className="text-center mb-6">
            <div className="inline-block p-3 bg-green-100 rounded-full text-green-600 mb-2">
                <CheckCircle size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">설계 완료! (Mission Complete)</h2>
            <p className="text-slate-600">성공적으로 데이터 수집 계획서를 작성했습니다.</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 font-mono text-sm">
            <h3 className="font-bold text-indigo-600 mb-2 border-b pb-1">📜 수집 설계서</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <span className="text-slate-500 block">문제 상황</span>
                    <span className="font-semibold">{PROBLEMS.find(p => p.id === plan.problem)?.label}</span>
                </div>
                <div>
                    <span className="text-slate-500 block">수집 방법</span>
                    <span className="font-semibold">{METHODS.find(m => m.id === plan.method)?.label}</span>
                </div>
                <div>
                    <span className="text-slate-500 block">데이터 유형</span>
                    <span className="font-semibold">{plan.dataType === 'structured' ? '정형 (Structured)' : '비정형 (Unstructured)'}</span>
                </div>
                <div>
                    <span className="text-slate-500 block">표본 설계</span>
                    <span className="font-semibold">{plan.duration}일간 / {plan.sampleSize}명</span>
                </div>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-200">
                <span className="text-slate-500 block">수집할 항목 (Fields)</span>
                <div className="flex flex-wrap gap-2 mt-1">
                    {plan.metrics.map(m => (
                        <span key={m} className="px-2 py-1 bg-white border border-slate-300 rounded text-xs">
                            {METRICS.find(metric => metric.id === m)?.label}
                        </span>
                    ))}
                    {plan.metrics.includes('waitTime') && <span className="px-2 py-1 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded text-xs">+ 관측시각</span>}
                </div>
            </div>
        </div>
        
        <button onClick={reset} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
            <RotateCcw size={20} /> 새 계획 세우기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
          <span>문제 정의</span>
          <span>방법 선택</span>
          <span>표본/편향</span>
          <span>윤리 점검</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 min-h-[400px] relative">
        {/* Step 1: Problem & Metrics */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm">Step 1</span>
                어떤 문제를 해결할까요?
            </h2>
            
            <label className="block mb-2 font-medium text-slate-700">문제 상황 선택</label>
            <select 
                value={plan.problem} 
                onChange={(e) => setPlan({...plan, problem: e.target.value})}
                className="w-full p-3 border border-slate-300 rounded-lg mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
                {PROBLEMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>

            <label className="block mb-2 font-medium text-slate-700">무엇을 측정할까요? (목표 지표)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {METRICS.map(m => (
                    <label key={m.id} className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${plan.metrics.includes(m.id) ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'hover:bg-slate-50'}`}>
                        <input 
                            type="checkbox" 
                            checked={plan.metrics.includes(m.id)}
                            onChange={() => {
                                const newMetrics = plan.metrics.includes(m.id) 
                                    ? plan.metrics.filter(id => id !== m.id)
                                    : [...plan.metrics, m.id];
                                setPlan({...plan, metrics: newMetrics});
                            }}
                            className="w-4 h-4 text-indigo-600 mr-3"
                        />
                        {m.label}
                    </label>
                ))}
            </div>
          </div>
        )}

        {/* Step 2: Data Type & Method */}
        {step === 2 && (
          <div className="animate-fade-in">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm">Step 2</span>
                데이터는 어떤 형태인가요?
            </h2>

            <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                {(['structured', 'unstructured'] as const).map(type => (
                    <button
                        key={type}
                        onClick={() => setPlan({...plan, dataType: type})}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition ${plan.dataType === type ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}
                    >
                        {type === 'structured' ? '정형 (Structured)' : '비정형 (Unstructured)'}
                    </button>
                ))}
            </div>

            <h3 className="font-bold text-slate-700 mb-3">수집 방법 선택</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {METHODS.map(method => (
                    <button
                        key={method.id}
                        disabled={method.disabled}
                        onClick={() => setPlan({...plan, method: method.id})}
                        className={`p-3 rounded-xl border text-left transition flex flex-col gap-2 ${
                            plan.method === method.id 
                                ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200' 
                                : method.disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:border-indigo-300 hover:shadow-sm'
                        }`}
                    >
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                            <div className="font-bold text-sm text-slate-800">{method.label}</div>
                            <div className="text-xs text-slate-500">{method.desc}</div>
                        </div>
                    </button>
                ))}
            </div>
          </div>
        )}

        {/* Step 3: Sampling & Bias */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm">Step 3</span>
                누구를, 언제 조사하나요?
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">조사 기간 (일)</label>
                    <input 
                        type="range" min="1" max="14" 
                        value={plan.duration} 
                        onChange={(e) => setPlan({...plan, duration: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="text-right text-indigo-600 font-bold">{plan.duration}일</div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">표본 크기 (명/건)</label>
                    <input 
                        type="range" min="10" max="300" step="10"
                        value={plan.sampleSize} 
                        onChange={(e) => setPlan({...plan, sampleSize: parseInt(e.target.value)})}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                     <div className="text-right text-indigo-600 font-bold">{plan.sampleSize}명</div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">조사 시간대 (중복 선택)</label>
                    <div className="flex gap-2">
                        {['아침(등교)', '점심시간', '방과후'].map(slot => (
                            <button
                                key={slot}
                                onClick={() => {
                                    const newSlots = plan.timeSlots.includes(slot)
                                        ? plan.timeSlots.filter(s => s !== slot)
                                        : [...plan.timeSlots, slot];
                                    setPlan({...plan, timeSlots: newSlots});
                                }}
                                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition ${
                                    plan.timeSlots.includes(slot) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                                }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* Step 4: Ethics */}
        {step === 4 && (
          <div className="animate-fade-in">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm">Step 4</span>
                윤리적 문제가 없나요?
            </h2>
            <div className="space-y-3">
                <label className="flex items-start p-4 bg-slate-50 rounded-lg border cursor-pointer hover:bg-white transition">
                    <input 
                        type="checkbox" 
                        checked={plan.ethics.consent}
                        onChange={(e) => setPlan({...plan, ethics: {...plan.ethics, consent: e.target.checked}})}
                        className="mt-1 w-5 h-5 text-indigo-600 rounded" 
                    />
                    <div className="ml-3">
                        <span className="font-bold text-slate-800 block">동의 획득 (Consent)</span>
                        <span className="text-sm text-slate-500">조사 대상에게 수집 목적을 알리고 동의를 받겠습니다.</span>
                    </div>
                </label>
                <label className="flex items-start p-4 bg-slate-50 rounded-lg border cursor-pointer hover:bg-white transition">
                    <input 
                        type="checkbox" 
                        checked={plan.ethics.privacy}
                        onChange={(e) => setPlan({...plan, ethics: {...plan.ethics, privacy: e.target.checked}})}
                        className="mt-1 w-5 h-5 text-indigo-600 rounded" 
                    />
                    <div className="ml-3">
                        <span className="font-bold text-slate-800 block">개인정보 보호 (Privacy)</span>
                        <span className="text-sm text-slate-500">이름 등 민감한 정보는 수집하지 않거나 익명화하겠습니다.</span>
                    </div>
                </label>
                <label className="flex items-start p-4 bg-slate-50 rounded-lg border cursor-pointer hover:bg-white transition">
                    <input 
                        type="checkbox" 
                        checked={plan.ethics.copyright}
                        onChange={(e) => setPlan({...plan, ethics: {...plan.ethics, copyright: e.target.checked}})}
                        className="mt-1 w-5 h-5 text-indigo-600 rounded" 
                    />
                    <div className="ml-3">
                        <span className="font-bold text-slate-800 block">규정 준수 (Compliance)</span>
                        <span className="text-sm text-slate-500">학교 규정과 저작권을 위반하지 않겠습니다.</span>
                    </div>
                </label>
            </div>
          </div>
        )}

        {/* Warnings Display (Sticky Bottom of Card) */}
        {warnings.length > 0 && (
            <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r text-sm">
                <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} /> 코치님의 조언 (수정이 필요해요!)
                </h4>
                <ul className="space-y-1 text-amber-800 list-disc list-inside">
                    {warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
            </div>
        )}

        <div className="mt-8 flex justify-end">
             <button 
                onClick={handleNext}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition-transform hover:-translate-y-0.5 active:translate-y-0"
             >
                {step === 4 ? '계획서 제출하기' : '다음 단계'} <ArrowRight size={20} />
             </button>
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;