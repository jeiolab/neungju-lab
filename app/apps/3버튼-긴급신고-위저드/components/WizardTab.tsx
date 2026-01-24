import React, { useState } from 'react';
import { WizardData, ProjectSpec } from '../types';
import { saveSpec, awardBadge, updateXP } from '../services/storageService';
import { ArrowRight, CheckCircle, Save, Ambulance, Flame, ShieldAlert, MapPin, RefreshCw } from 'lucide-react';

interface WizardTabProps {
  onComplete: () => void;
}

const INITIAL_DATA: WizardData = {
  scenario: '',
  buttonMapping: 'standard',
  commGroup: '',
  locationMode: 'random',
  testCases: ['', '', '']
};

export const WizardTab: React.FC<WizardTabProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const [generatedSpec, setGeneratedSpec] = useState<ProjectSpec | null>(null);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else generateSpec();
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const generateSpec = () => {
    const newSpec: ProjectSpec = {
      id: Date.now().toString(),
      data: { ...data },
      timestamp: Date.now()
    };
    saveSpec(newSpec);
    setGeneratedSpec(newSpec);
    
    // Rewards
    updateXP(50);
    awardBadge("ARCHITECT");
    if (data.testCases.every(tc => tc.length > 10)) {
      awardBadge("TESTER");
    }
    
    onComplete();
  };

  const steps = [
    "상황 설정", "로직 설계", "통신 설정", "위치 설정", "테스트"
  ];

  if (generatedSpec) {
    return (
      <div className="max-w-4xl mx-auto p-6 animate-fade-in">
        <div className="bg-white rounded-xl shadow-2xl border-t-8 border-indigo-600 overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">프로젝트 설계서</h2>
                <p className="text-gray-500 text-sm mt-1">Generated ID: {generatedSpec.id}</p>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                승인됨 (Approved)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <Section title="1. 문제 정의 및 상황">
                  <p className="text-gray-700">사용 시나리오: <strong>{data.scenario}</strong></p>
                  <p className="text-gray-600 mt-1">이 시스템은 고위험 환경에서 소리 없이 구조 요청을 보내기 위해 설계되었습니다.</p>
                </Section>
                
                <Section title="2. 입력/처리 로직 (알고리즘)">
                   <ul className="space-y-2">
                     <li className="flex items-center gap-2"><span className="w-6 h-6 bg-green-100 rounded flex items-center justify-center text-green-700 font-bold">A</span> → 의료/구급 (그룹 10)</li>
                     <li className="flex items-center gap-2"><span className="w-6 h-6 bg-red-100 rounded flex items-center justify-center text-red-700 font-bold">B</span> → 화재/소방 (그룹 20)</li>
                     <li className="flex items-center gap-2"><span className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-700 font-bold">A+B</span> → 경찰/치안 (그룹 30)</li>
                   </ul>
                </Section>
              </div>

              <div className="space-y-4">
                <Section title="3. 위치 전송 프로토콜">
                   <p className="text-gray-700">방식: <strong>{data.locationMode === 'random' ? '자동 가상 위치 생성' : '수동 구역 코드 입력'}</strong></p>
                   <p className="text-xs text-gray-500 italic mt-1">*개인정보 보호를 위해 실제 GPS는 비활성화됨.</p>
                </Section>

                <Section title="4. 테스트 계획">
                  <ul className="list-decimal list-inside space-y-1 text-gray-700">
                    {data.testCases.map((tc, i) => (
                      <li key={i}>{tc || "지정되지 않음"}</li>
                    ))}
                  </ul>
                </Section>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-4">
              <button 
                onClick={() => {
                   setGeneratedSpec(null);
                   setStep(0);
                   setData(INITIAL_DATA);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                새로 만들기
              </button>
              <button 
                onClick={() => window.print()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
              >
                <Save className="w-4 h-4" /> PDF 저장 / 인쇄
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Stepper */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded"></div>
        {steps.map((s, i) => (
          <div key={i} className={`flex flex-col items-center gap-2 bg-white px-2`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
               i <= step ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 text-gray-400'
             }`}>
               {i + 1}
             </div>
             <span className={`text-xs ${i <= step ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>{s}</span>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg min-h-[400px] flex flex-col justify-between">
        
        {/* STEP 1: SCENARIO */}
        {step === 0 && (
          <div className="space-y-6 animate-slide-in">
            <h3 className="text-xl font-bold text-gray-800">1. 상황 선택 (Scenario)</h3>
            <p className="text-gray-600">이 장치는 주로 어디서 사용되나요? 긴급도와 오작동 위험을 고려해야 합니다.</p>
            <div className="grid gap-4">
              {['학교 (School Campus)', '집/요양 시설 (Home/Elderly Care)', '공공 거리 (Public Street)'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setData({...data, scenario: opt})}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    data.scenario === opt 
                    ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-800">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: BUTTON LOGIC */}
        {step === 1 && (
          <div className="space-y-6 animate-slide-in">
             <h3 className="text-xl font-bold text-gray-800">2. 입력 로직 확인</h3>
             <p className="text-gray-600">3버튼 시스템의 표준 하드웨어 매핑을 확인하고 동의해주세요.</p>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <LogicCard icon={<Ambulance className="w-8 h-8 text-green-600" />} button="A" action="의료 (Medical)" color="green" />
                <LogicCard icon={<Flame className="w-8 h-8 text-red-600" />} button="B" action="화재 (Fire)" color="red" />
                <LogicCard icon={<ShieldAlert className="w-8 h-8 text-blue-600" />} button="A + B" action="경찰 (Police)" color="blue" />
             </div>

             <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-800 text-sm">
               <input 
                 type="checkbox" 
                 id="confirmLogic"
                 checked={data.buttonMapping === 'standard'}
                 onChange={() => setData({...data, buttonMapping: 'standard'})}
                 className="w-5 h-5 text-indigo-600 rounded"
               />
               <label htmlFor="confirmLogic">오작동 방지를 위해 경찰 호출 시 '동시 누르기(A+B)'가 필요함을 확인했습니다.</label>
             </div>
          </div>
        )}

        {/* STEP 3: COMMUNICATION GROUPS */}
        {step === 2 && (
          <div className="space-y-6 animate-slide-in">
            <h3 className="text-xl font-bold text-gray-800">3. 라디오 그룹 설정</h3>
            <p className="text-gray-600">긴급 통신을 위한 표준 라디오 그룹을 선택하세요.</p>
            
            <div className="space-y-3">
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${data.commGroup === 'standard' ? 'border-green-500 bg-green-50' : ''}`}>
                <input 
                  type="radio" 
                  name="comm" 
                  checked={data.commGroup === 'standard'}
                  onChange={() => setData({...data, commGroup: 'standard'})}
                  className="mr-3"
                />
                <div>
                  <div className="font-bold">표준 프로토콜 (10/20/30)</div>
                  <div className="text-xs text-gray-500">10=의료, 20=화재, 30=경찰</div>
                </div>
              </label>

              <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${data.commGroup === 'mixed' ? 'border-red-500 bg-red-50' : ''}`}>
                <input 
                  type="radio" 
                  name="comm" 
                  checked={data.commGroup === 'mixed'}
                  onChange={() => setData({...data, commGroup: 'mixed'})}
                  className="mr-3"
                />
                <div>
                  <div className="font-bold">무작위 프로토콜 (혼합)</div>
                  <div className="text-xs text-gray-500">긴급 상황 상호운용성을 위해 권장되지 않습니다.</div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 4: LOCATION */}
        {step === 3 && (
          <div className="space-y-6 animate-slide-in">
            <h3 className="text-xl font-bold text-gray-800">4. 위치 전략</h3>
            <p className="text-gray-600">실제 GPS가 없을 때, 장치가 위치를 어떻게 알릴까요?</p>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setData({...data, locationMode: 'random'})}
                className={`p-6 rounded-lg border-2 flex flex-col items-center gap-3 ${
                  data.locationMode === 'random' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'
                }`}
              >
                <RefreshCw className="w-8 h-8" />
                <span className="font-bold">랜덤 시뮬레이션</span>
                <span className="text-xs text-center">"Zone-A1", "Zone-B2" 등 자동 생성</span>
              </button>

              <button
                onClick={() => setData({...data, locationMode: 'manual'})}
                className={`p-6 rounded-lg border-2 flex flex-col items-center gap-3 ${
                  data.locationMode === 'manual' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'
                }`}
              >
                <MapPin className="w-8 h-8" />
                <span className="font-bold">사용자 직접 입력</span>
                <span className="text-xs text-center">고정된 구역 코드 직접 입력 (예: "ROOM-101")</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: TEST CASES */}
        {step === 4 && (
          <div className="space-y-6 animate-slide-in">
            <h3 className="text-xl font-bold text-gray-800">5. 테스트 케이스 작성</h3>
            <p className="text-gray-600">시스템이 정상 작동하는지 검증하기 위한 시나리오 3개를 작성하세요. <br/><span className="text-xs text-gray-400">예: "버튼 A를 누르면, 그룹 10 신호가 수신되어야 한다."</span></p>

            <div className="space-y-4">
              {[0, 1, 2].map(idx => (
                <div key={idx}>
                  <label className="text-xs font-bold text-gray-500 uppercase">테스트 케이스 {idx + 1}</label>
                  <input
                    type="text"
                    value={data.testCases[idx]}
                    onChange={(e) => {
                      const newCases = [...data.testCases] as [string, string, string];
                      newCases[idx] = e.target.value;
                      setData({...data, testCases: newCases});
                    }}
                    placeholder={`테스트 시나리오 #${idx + 1} 입력...`}
                    className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTROLS */}
        <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
          <button 
            onClick={handleBack} 
            disabled={step === 0}
            className={`px-6 py-2 rounded-lg font-medium ${step === 0 ? 'opacity-0' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            이전
          </button>
          
          <button 
            onClick={handleNext}
            disabled={
              (step === 0 && !data.scenario) ||
              (step === 2 && !data.commGroup) ||
              (step === 4 && data.testCases.some(tc => tc.trim() === ''))
            }
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            {step === 4 ? '설계 완료' : '다음 단계'}
            {step !== 4 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const Section: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
    <h4 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-2">{title}</h4>
    <div className="text-sm">{children}</div>
  </div>
);

const LogicCard: React.FC<{icon: React.ReactNode, button: string, action: string, color: string}> = ({icon, button, action, color}) => (
  <div className={`flex flex-col items-center p-4 border rounded-xl bg-${color}-50 border-${color}-100`}>
    <div className="mb-2">{icon}</div>
    <div className="font-black text-xl text-gray-800">{button}</div>
    <div className={`text-${color}-700 font-medium`}>{action}</div>
  </div>
);
