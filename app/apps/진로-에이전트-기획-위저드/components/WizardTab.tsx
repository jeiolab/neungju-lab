import React, { useState } from 'react';
import { JOB_INTERESTS, AGENT_TASK_OPTIONS, DATA_TYPE_OPTIONS, RISK_OPTIONS, HUMAN_TASK_OPTIONS, WizardState } from '../types';
import { ArrowRight, ArrowLeft, Save, RefreshCw, Clipboard, FlaskConical } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface WizardTabProps {
  savedData: WizardState | null;
  onSave: (data: WizardState) => void;
  onComplete: (score: number, ethics: boolean) => void;
}

const WizardTab: React.FC<WizardTabProps> = ({ savedData, onSave, onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardState>(savedData || {
    interest: '',
    agentTasks: [],
    dataTypes: [],
    risks: [],
    humanTasks: [],
    completed: false
  });

  // Simulation State
  const [simSensitivity, setSimSensitivity] = useState(5);
  const [simVerification, setSimVerification] = useState(5);

  const updateField = (field: keyof WizardState, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof WizardState, item: string) => {
    const current = data[field] as string[];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateField(field, updated);
  };

  const calculateScore = () => {
    let score = 0;
    const feedback = [];
    let passedEthics = false;

    // 1. Problem Definition (Interest & Tasks)
    if (data.interest && data.agentTasks.length > 0) score += 20;

    // 2. Data & Risk Management
    const hasSensitiveData = data.dataTypes.some(d => 
      DATA_TYPE_OPTIONS.find(opt => opt.value === d)?.sensitive
    );
    const hasPrivacyRisk = data.risks.some(r => r.includes('개인정보'));
    
    // Bonus: Identified privacy risk when using sensitive data
    if (hasSensitiveData && hasPrivacyRisk) score += 10;
    else if (hasSensitiveData && !hasPrivacyRisk) feedback.push("민감한 데이터를 쓰지만 개인정보 위험을 선택하지 않았습니다.");

    // 3. Human Role (Critical)
    const essentialHumanTasks = ['최종 결정 (진로 선택)', '정보 검증 (AI가 준 정보 사실 확인)', '윤리 점검 (편향성 확인)'];
    const selectedEssential = data.humanTasks.filter(t => essentialHumanTasks.includes(t));
    
    if (selectedEssential.length >= 2) {
      score += 40;
      passedEthics = true;
    } else {
      feedback.push("인간의 역할 중 '결정', '검증', '윤리' 중 2개 이상이 포함되어야 합니다.");
    }

    if (data.humanTasks.includes('AI 서버 관리') || data.humanTasks.includes('데이터 입력 (단순 반복)')) {
      // Small penalty or no points for purely functional tasks over cognitive ones
      feedback.push("인간의 역할이 단순 관리나 입력에 치중되지 않았나요?");
    } else {
      score += 10;
    }

    // 4. Verification Plan Check
    const hasVerification = data.humanTasks.some(t => t.includes('검증'));
    if (hasVerification) score += 20;
    else feedback.push("AI가 내놓은 결과를 '검증'하는 단계가 누락되었습니다.");

    return { score: Math.min(score, 100), feedback, passedEthics };
  };

  const handleComplete = () => {
    const { score, passedEthics } = calculateScore();
    updateField('completed', true);
    onSave({ ...data, completed: true });
    onComplete(score, passedEthics);
    setStep(5); // Go to results
  };

  const copyToClipboard = () => {
    const text = `
[진로 에이전트 기획서]
1. 관심 분야: ${data.interest}
2. 에이전트 역할: ${data.agentTasks.join(', ')}
3. 활용 데이터: ${data.dataTypes.map(d => DATA_TYPE_OPTIONS.find(opt => opt.value === d)?.label).join(', ')}
4. 예상 위험: ${data.risks.join(', ')}
5. 인간의 역할: ${data.humanTasks.join(', ')}
    `.trim();
    navigator.clipboard.writeText(text);
    alert('기획서가 클립보드에 복사되었습니다.');
  };

  // Simulation Logic
  const simTrust = Math.min(100, Math.max(0, (simVerification * 8) + (10 - simSensitivity) * 2));
  const simRisk = Math.min(100, Math.max(0, (simSensitivity * 8) - (simVerification * 2)));
  
  const simData = [
    { name: '신뢰도', value: simTrust, fill: '#4f46e5' },
    { name: '위험도', value: simRisk, fill: '#ef4444' }
  ];

  // Render Steps
  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-gray-800">1. 어떤 분야의 진로를 고민 중인가요?</h3>
            <div className="grid grid-cols-2 gap-3">
              {JOB_INTERESTS.map(job => (
                <button
                  key={job}
                  onClick={() => updateField('interest', job)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    data.interest === job 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200' 
                    : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {job}
                </button>
              ))}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-gray-800">2. 에이전트에게 어떤 일을 시킬까요? (최대 3개)</h3>
            <div className="space-y-2">
              {AGENT_TASK_OPTIONS.map(task => (
                <label key={task} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.agentTasks.includes(task)}
                    onChange={() => {
                      if (data.agentTasks.includes(task)) toggleArrayItem('agentTasks', task);
                      else if (data.agentTasks.length < 3) toggleArrayItem('agentTasks', task);
                    }}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">{task}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-right">{data.agentTasks.length}/3 선택됨</p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">3. 어떤 데이터가 필요한가요?</h3>
              <div className="space-y-2">
                {DATA_TYPE_OPTIONS.map(opt => (
                  <label key={opt.value} className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer ${opt.sensitive ? 'bg-red-50 border-red-100' : 'hover:bg-gray-50'}`}>
                    <input
                      type="checkbox"
                      checked={data.dataTypes.includes(opt.value)}
                      onChange={() => toggleArrayItem('dataTypes', opt.value)}
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className={opt.sensitive ? 'text-red-800 font-medium' : 'text-gray-700'}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">4. 예상되는 위험은 무엇인가요? (1~2개)</h3>
              <div className="space-y-2">
                {RISK_OPTIONS.map(risk => (
                  <label key={risk} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.risks.includes(risk)}
                      onChange={() => {
                        if (data.risks.includes(risk)) toggleArrayItem('risks', risk);
                        else if (data.risks.length < 2) toggleArrayItem('risks', risk);
                      }}
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <span className="text-gray-700">{risk}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-bold text-gray-800">5. ★ 가장 중요: 인간은 무슨 일을 하나요?</h3>
            <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              Tip: AI가 하지 못하는 윤리적 판단, 검증, 최종 책임을 포함해야 좋은 점수를 받습니다.
            </p>
            <div className="space-y-2">
              {HUMAN_TASK_OPTIONS.map(task => (
                <label key={task} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.humanTasks.includes(task)}
                    onChange={() => {
                      if (data.humanTasks.includes(task)) toggleArrayItem('humanTasks', task);
                      else if (data.humanTasks.length < 3) toggleArrayItem('humanTasks', task);
                    }}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">{task}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-right">{data.humanTasks.length}/3 선택됨</p>
          </div>
        );
      case 5: // Result View
        const result = calculateScore();
        return (
          <div className="space-y-8 animate-in zoom-in-95 duration-300">
            {/* Score Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
              <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                <h3 className="font-bold text-lg">기획서 평가 결과</h3>
                <span className="text-2xl font-bold">{result.score}점</span>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Clipboard size={18}/> 개선 체크리스트
                  </h4>
                  {result.feedback.length === 0 ? (
                    <p className="text-green-600 flex items-center gap-2"><Clipboard size={16}/> 완벽합니다! 인간의 역할과 윤리적 고려가 잘 설계되었습니다.</p>
                  ) : (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-red-600">
                      {result.feedback.map((fb, i) => <li key={i}>{fb}</li>)}
                    </ul>
                  )}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2 border border-gray-200">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">분야</span>
                    <span className="font-medium text-gray-900">{data.interest}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">AI 역할</span>
                    <span className="font-medium text-gray-900 text-right">{data.agentTasks.join(', ')}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">인간 역할</span>
                    <span className="font-medium text-indigo-700 text-right">{data.humanTasks.join(', ')}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={copyToClipboard} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center justify-center gap-2">
                    <Clipboard size={16}/> 텍스트 복사
                  </button>
                  <button onClick={() => setStep(0)} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium flex items-center justify-center gap-2">
                    <RefreshCw size={16}/> 다시 기획하기
                  </button>
                </div>
              </div>
            </div>

            {/* Simulation Micro-Experiment */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                <FlaskConical className="text-indigo-500"/> 시뮬레이션: 데이터 민감도와 검증의 관계
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                슬라이더를 조절하여 데이터의 민감도와 인간의 검증 강도가 결과(신뢰도/위험)에 어떤 영향을 미치는지 확인해보세요.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                      <span>데이터 민감도 (개인정보 등)</span>
                      <span className="text-indigo-600">{simSensitivity}단계</span>
                    </label>
                    <input 
                      type="range" min="1" max="10" 
                      value={simSensitivity} 
                      onChange={(e) => setSimSensitivity(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">높을수록 유출 시 위험이 커집니다.</p>
                  </div>
                  <div>
                    <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                      <span>인간의 검증 강도</span>
                      <span className="text-indigo-600">{simVerification}단계</span>
                    </label>
                    <input 
                      type="range" min="1" max="10" 
                      value={simVerification} 
                      onChange={(e) => setSimVerification(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">높을수록 오류를 잘 잡아냅니다.</p>
                  </div>
                </div>

                <div className="h-48 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={simData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" width={50} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {simData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                   </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                 <strong className="block mb-1 text-gray-900">분석 리포트:</strong>
                 {simRisk > 70 ? (
                   <span className="text-red-600 font-bold">⚠️ 경고: 위험도가 매우 높습니다. 검증 강도를 높이거나 민감한 데이터 사용을 줄여야 합니다.</span>
                 ) : simTrust > 70 ? (
                   <span className="text-blue-600 font-bold">✅ 안정적: 인간의 검증이 충분하여 신뢰할 수 있는 시스템입니다.</span>
                 ) : (
                   <span className="text-gray-600">보통: 균형이 필요합니다. 검증을 조금 더 강화하는 것을 추천합니다.</span>
                 )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      {step < 5 && (
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Step {step + 1}</span>
            <span>Step 5</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${((step + 1) / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {renderStep()}

      {/* Navigation Buttons */}
      {step < 5 && (
        <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className={`flex items-center text-gray-600 font-medium px-4 py-2 rounded hover:bg-gray-100 ${step === 0 ? 'opacity-0' : ''}`}
          >
            <ArrowLeft size={16} className="mr-2" /> 이전
          </button>
          
          <button
            onClick={() => {
              if (step === 3) handleComplete();
              else setStep(s => s + 1);
            }}
            disabled={(step === 0 && !data.interest) || (step === 1 && data.agentTasks.length === 0)}
            className="flex items-center bg-indigo-600 text-white font-bold px-6 py-2 rounded-lg shadow hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition"
          >
            {step === 3 ? '결과 보기' : '다음'} <ArrowRight size={16} className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default WizardTab;