import React, { useState, useEffect } from 'react';
import { AgentDesign } from '../types';
import { Save, ArrowRight, ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { getAgentDesignFeedback } from '../services/geminiService';

interface WizardProps {
  onComplete: () => void;
  savedDesign: AgentDesign;
  onSave: (design: AgentDesign) => void;
}

const steps = ["인식(Perception)", "분석(Analysis)", "추론(Reasoning)", "행동(Action)", "검토(Review)"];

const Wizard: React.FC<WizardProps> = ({ onComplete, savedDesign, onSave }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [design, setDesign] = useState<AgentDesign>(savedDesign);
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  useEffect(() => {
    setDesign(savedDesign);
  }, [savedDesign]);

  const updateField = (section: keyof AgentDesign, field: string, value: any) => {
    const updated = {
      ...design,
      [section]: {
        //@ts-ignore
        ...design[section],
        [field]: value
      }
    };
    setDesign(updated);
    // Auto save to local storage via parent
    onSave(updated);
  };

  const updateRootField = (field: keyof AgentDesign, value: any) => {
    const updated = { ...design, [field]: value };
    setDesign(updated);
    onSave(updated);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const handleFinish = async () => {
    setIsLoadingFeedback(true);
    const feedback = await getAgentDesignFeedback(design);
    setAiFeedback(feedback);
    setIsLoadingFeedback(false);
    onComplete();
  };

  const downloadTxt = () => {
    const text = `
    프로젝트 위저드: 지능형 에이전트 설계서
    ------------------------------------------------------
    프로젝트 이름: ${design.name}
    
    1. 인식 (PERCEPTION - SENSORS)
    센서 목록: ${design.perception.sensors.join(', ')}
    데이터 유형: ${design.perception.dataTypes.join(', ')}
    설치 위치: ${design.perception.location}
    
    2. 분석 (ANALYSIS - LOGIC)
    임계값(Threshold): ${design.analysis.threshold}
    논리 규칙: ${design.analysis.logic}
    
    3. 추론 (REASONING - DECISION)
    전략: ${design.reasoning.strategy}
    결정 내용: ${design.reasoning.decision}
    
    4. 행동 (ACTION - ACTUATORS)
    액추에이터: ${design.action.actuators.join(', ')}
    행동 설명: ${design.action.feedback}
    
    특성 (CHARACTERISTICS)
    ${design.characteristics.join(', ')}
    
    ------------------------------------------------------
    작성자: 학생
    생성일: ${new Date().toLocaleDateString()}
    `;
    
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "water_agent_design.txt";
    document.body.appendChild(element);
    element.click();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-blue-800">1단계: 인식 (Sense)</h3>
            <p className="text-sm text-slate-600">수질을 파악하기 위해 에이전트는 어떤 데이터를 수집해야 할까요?</p>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">프로젝트 이름</label>
              <input 
                type="text" 
                value={design.name}
                onChange={(e) => updateRootField('name', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="예: 우리 동네 하천 지킴이 2024"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">센서 선택</label>
              <div className="flex flex-wrap gap-2">
                {['pH 센서', '탁도 센서', '수온 센서', '용존 산소량(DO) 센서'].map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      const current = design.perception.sensors;
                      const newVal = current.includes(s) ? current.filter(i => i !== s) : [...current, s];
                      updateField('perception', 'sensors', newVal);
                    }}
                    className={`px-3 py-1 rounded-full text-sm border ${design.perception.sensors.includes(s) ? 'bg-blue-600 text-white' : 'bg-white text-slate-600'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">센서 설치 위치</label>
              <input 
                type="text" 
                value={design.perception.location}
                onChange={(e) => updateField('perception', 'location', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="예: 취수장 입구 파이프"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-purple-800">2단계: 분석 (Think - Analyze)</h3>
            <p className="text-sm text-slate-600">수집된 원시 데이터(Raw Data)를 어떻게 해석할까요?</p>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">임계값(Threshold) 정의</label>
              <textarea 
                value={design.analysis.threshold}
                onChange={(e) => updateField('analysis', 'threshold', e.target.value)}
                className="w-full p-2 border rounded h-20"
                placeholder="예: pH는 6.5에서 8.5 사이여야 한다. 탁도는 50 NTU 미만이어야 한다."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">분석 논리 (If-Then 규칙)</label>
              <input 
                type="text" 
                value={design.analysis.logic}
                onChange={(e) => updateField('analysis', 'logic', e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="예: 만약 (pH < 6.5) 또는 (탁도 > 50) 이면 상태 = 위험(DANGER)"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-indigo-800">3단계: 추론 (Think - Decide)</h3>
            <p className="text-sm text-slate-600">분석 결과에 따라 어떤 결정을 내려야 할까요?</p>

            <div className="space-y-2">
              <label className="block text-sm font-medium">의사결정 전략</label>
              <select 
                value={design.reasoning.strategy}
                onChange={(e) => updateField('reasoning', 'strategy', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">전략을 선택하세요...</option>
                <option value="Conservative (Safety First)">보수적 전략 (안전 제일 - 의심되면 차단)</option>
                <option value="Optimized (Minimize downtime)">최적화 전략 (확실한 경우에만 차단)</option>
                <option value="Monitoring Only">단순 모니터링 (행동하지 않고 기록만 함)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">구체적인 결정 내용</label>
              <textarea 
                value={design.reasoning.decision}
                onChange={(e) => updateField('reasoning', 'decision', e.target.value)}
                className="w-full p-2 border rounded h-20"
                placeholder="예: 상태가 '위험'이면 즉시 차단 절차를 시작한다."
              />
            </div>
            
            <div className="space-y-2 border-t pt-4">
               <label className="block text-sm font-medium mb-2">에이전트 특성 체크리스트</label>
               <div className="grid grid-cols-2 gap-2">
                 {['자율성(Autonomy)', '반응성(Reactivity)', '능동성(Pro-activeness)', '사회성(Social Ability)'].map(char => (
                   <label key={char} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-slate-50">
                     <input 
                        type="checkbox"
                        checked={design.characteristics.includes(char)}
                        onChange={(e) => {
                           const current = design.characteristics;
                           const newVal = e.target.checked 
                             ? [...current, char]
                             : current.filter(c => c !== char);
                           updateRootField('characteristics', newVal);
                        }}
                        className="rounded text-blue-600"
                     />
                     <span className="text-sm">{char}</span>
                   </label>
                 ))}
               </div>
               {design.characteristics.includes('자율성(Autonomy)') && <p className="text-xs text-green-600 italic">"좋은 선택입니다! 에이전트가 인간의 지속적인 개입 없이 작동합니다."</p>}
               {design.characteristics.includes('사회성(Social Ability)') && <p className="text-xs text-green-600 italic">"당신의 에이전트는 다른 시스템이나 사람과 소통하나요?"</p>}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-lg font-bold text-yellow-700">4단계: 행동 (Act)</h3>
            <p className="text-sm text-slate-600">에이전트는 환경에 어떤 영향을 미치나요?</p>

             <div className="space-y-2">
              <label className="block text-sm font-medium">액추에이터 선택</label>
              <div className="flex flex-wrap gap-2">
                {['모터 밸브', '경보 사이렌', '펌프', 'SMS 문자 알림', 'LCD 디스플레이'].map(a => (
                  <button
                    key={a}
                    onClick={() => {
                      const current = design.action.actuators;
                      const newVal = current.includes(a) ? current.filter(i => i !== a) : [...current, a];
                      updateField('action', 'actuators', newVal);
                    }}
                    className={`px-3 py-1 rounded-full text-sm border ${design.action.actuators.includes(a) ? 'bg-yellow-500 text-white' : 'bg-white text-slate-600'}`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">행동 상세 설명</label>
               <textarea 
                value={design.action.feedback}
                onChange={(e) => updateField('action', 'feedback', e.target.value)}
                className="w-full p-2 border rounded h-20"
                placeholder="예: 유입 밸브를 닫고 안전 관리자에게 문자를 보낸다."
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-fadeIn">
             <div className="text-center">
               <h3 className="text-2xl font-bold text-slate-800">설계 검토</h3>
               <p className="text-slate-600">최종 제출 전 설계도를 확인하세요.</p>
             </div>

             <div className="bg-slate-50 p-6 rounded-lg border text-sm space-y-4 font-mono">
                <div>
                   <strong className="block text-slate-500">프로젝트</strong>
                   {design.name}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong className="block text-slate-500">센서(입력)</strong>
                    {design.perception.sensors.join(', ') || '선택 안함'}
                  </div>
                  <div>
                    <strong className="block text-slate-500">액추에이터(출력)</strong>
                    {design.action.actuators.join(', ') || '선택 안함'}
                  </div>
                </div>
                <div>
                   <strong className="block text-slate-500">논리</strong>
                   {design.analysis.logic || '정의되지 않음'}
                </div>
             </div>
             
             <div className="flex flex-col gap-3">
               {!aiFeedback && (
                 <button 
                  onClick={handleFinish}
                  disabled={isLoadingFeedback}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2"
                 >
                   {isLoadingFeedback ? <RefreshCw className="animate-spin" /> : "제출 및 AI 코치 피드백 받기"}
                 </button>
               )}
               
               {isLoadingFeedback && <div className="text-center text-slate-500 text-sm">AI 코치가 당신의 설계를 분석 중입니다...</div>}

               {aiFeedback && (
                 <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg animate-fadeIn">
                    <h4 className="font-bold text-indigo-900 flex items-center gap-2 mb-2">
                      <span className="text-xl">🤖</span> AI 코치 피드백
                    </h4>
                    <div className="text-indigo-800 text-sm whitespace-pre-line leading-relaxed">
                      {aiFeedback}
                    </div>
                 </div>
               )}

               {aiFeedback && (
                 <button 
                  onClick={downloadTxt}
                  className="w-full py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-all flex justify-center items-center gap-2"
                 >
                   <Download className="w-5 h-5" /> 설계서 다운로드 (.txt)
                 </button>
               )}
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100">
       {/* Progress Bar */}
       <div className="h-2 bg-slate-100 flex">
         {steps.map((_, idx) => (
           <div 
            key={idx}
            className={`flex-1 transition-all duration-500 ${idx <= currentStep ? 'bg-blue-600' : 'bg-slate-200'}`}
           />
         ))}
       </div>

       <div className="p-8 min-h-[500px] flex flex-col">
         <div className="flex-1">
           {renderStep()}
         </div>

         {/* Navigation */}
         <div className="mt-8 flex justify-between items-center pt-6 border-t">
           <button 
             onClick={handlePrev}
             disabled={currentStep === 0}
             className={`flex items-center gap-1 text-slate-600 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-600 font-medium`}
           >
             <ArrowLeft className="w-4 h-4" /> 뒤로
           </button>
           
           <div className="text-xs text-slate-400 font-mono">
             {steps.length}단계 중 {currentStep + 1}단계
           </div>

           {currentStep < steps.length - 1 ? (
              <button 
              onClick={handleNext}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors"
            >
              다음 <ArrowRight className="w-4 h-4" />
            </button>
           ) : null}
         </div>
       </div>
    </div>
  );
};

export default Wizard;