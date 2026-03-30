import React, { useState } from 'react';
import { ProjectData, Stakeholder } from '../types';
import { SCENARIOS, RISKS } from '../constants';
import { getProjectFeedback } from '../services/geminiService';
import { ArrowRight, ArrowLeft, Printer, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const STEPS = ['문제 선택', '이해관계자', 'DNPC 설계', '위험 관리', '성찰 & 완료'];

export const Tab5Wizard: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ProjectData>({
    scenarioId: "",
    title: "",
    stakeholders: [],
    dnpc: { device: "", network: "", platform: "", service: "" },
    risks: [],
    reflection: ""
  });
  const [aiFeedback, setAiFeedback] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleScenarioChange = (id: string) => {
    const scenario = SCENARIOS.find(s => s.id === id);
    if (scenario) {
      setData({
        ...data,
        scenarioId: id,
        title: scenario.title,
        dnpc: { ...scenario.defaultDNPC } // Auto-fill DNPC
      });
    }
  };

  const toggleStakeholder = (s: Stakeholder) => {
    const newStakeholders = data.stakeholders.includes(s)
      ? data.stakeholders.filter(item => item !== s)
      : [...data.stakeholders, s];
    setData({ ...data, stakeholders: newStakeholders });
  };

  const toggleRisk = (r: string) => {
    const newRisks = data.risks.includes(r)
      ? data.risks.filter(item => item !== r)
      : [...data.risks, r];
    setData({ ...data, risks: newRisks });
  };

  const handleAiCheck = async () => {
    setLoadingAi(true);
    const feedback = await getProjectFeedback(data);
    setAiFeedback(feedback);
    setLoadingAi(false);
    onComplete(); // Give XP for completing the check
  };

  const handlePrint = () => {
    window.print();
  };

  if (showReport) {
    return (
      <div className="bg-white min-h-screen p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center no-print mb-8">
            <button onClick={() => setShowReport(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg">← 수정하기</button>
            <button onClick={handlePrint} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700">
                <Printer size={20}/> 설계서 인쇄
            </button>
        </div>

        {/* Report Content */}
        <div className="border-2 border-slate-800 p-8 print:border-none print:p-0">
            <header className="text-center border-b-2 border-slate-800 pb-6 mb-6">
                <h1 className="text-3xl font-black text-slate-900 mb-2">스마트시티 문제해결 설계서</h1>
                <p className="text-slate-600">이름: _______________ &nbsp;&nbsp; 날짜: _______________</p>
            </header>

            <section className="mb-8">
                <h2 className="text-xl font-bold border-l-4 border-indigo-600 pl-3 mb-4 bg-indigo-50 py-1">1. 문제 정의</h2>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="font-bold text-lg mb-2">{data.title}</p>
                    <p className="text-sm text-slate-600">이해관계자: {data.stakeholders.join(", ")}</p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold border-l-4 border-indigo-600 pl-3 mb-4 bg-indigo-50 py-1">2. 스마트 서비스 구성 (DNPC)</h2>
                <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="p-4 border rounded-lg bg-white">
                        <div className="text-xs font-bold text-slate-400 mb-1">D (Device)</div>
                        <div className="font-bold text-indigo-700 break-keep">{data.dnpc.device}</div>
                    </div>
                    <div className="p-4 border rounded-lg bg-white">
                        <div className="text-xs font-bold text-slate-400 mb-1">N (Network)</div>
                        <div className="font-bold text-indigo-700 break-keep">{data.dnpc.network}</div>
                    </div>
                    <div className="p-4 border rounded-lg bg-white">
                        <div className="text-xs font-bold text-slate-400 mb-1">P (Platform)</div>
                        <div className="font-bold text-indigo-700 break-keep">{data.dnpc.platform}</div>
                    </div>
                    <div className="p-4 border rounded-lg bg-white">
                        <div className="text-xs font-bold text-slate-400 mb-1">S (Service)</div>
                        <div className="font-bold text-indigo-700 break-keep">{data.dnpc.service}</div>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold border-l-4 border-indigo-600 pl-3 mb-4 bg-indigo-50 py-1">3. 위험 관리 & 보안</h2>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {data.risks.map((r, i) => <li key={i}>{r}</li>)}
                    {data.risks.length === 0 && <li className="text-slate-400">선택된 위험 요소가 없습니다.</li>}
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold border-l-4 border-indigo-600 pl-3 mb-4 bg-indigo-50 py-1">4. 나의 성찰</h2>
                <div className="p-4 bg-slate-50 rounded-lg min-h-[100px] text-slate-800 whitespace-pre-wrap">
                    {data.reflection}
                </div>
            </section>

            {aiFeedback && (
                 <section className="mb-8 print:hidden">
                    <h2 className="text-xl font-bold border-l-4 border-purple-600 pl-3 mb-4 bg-purple-50 py-1 flex items-center gap-2">
                        <Sparkles size={20} className="text-purple-600"/> AI 코치 피드백
                    </h2>
                    <div className="p-4 bg-purple-50 rounded-lg text-purple-900 border border-purple-200 whitespace-pre-wrap text-sm leading-relaxed">
                        {aiFeedback}
                    </div>
                 </section>
            )}

            <footer className="text-center text-xs text-slate-400 mt-12 pt-4 border-t">
                스마트시티 위저드 - 교육용 프로젝트 설계 도구
            </footer>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Stepper */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 transform -translate-y-1/2"></div>
        {STEPS.map((label, idx) => (
            <div key={idx} className={`flex flex-col items-center gap-2 bg-slate-50 px-2 ${step >= idx ? 'text-indigo-600' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= idx ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {idx + 1}
                </div>
                <span className="text-xs font-bold hidden sm:block">{label}</span>
            </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-indigo-50 p-8 min-h-[400px] flex flex-col">
        {step === 0 && (
            <div className="animate-fade-in flex-1">
                <h2 className="text-2xl font-bold mb-6">어떤 문제를 해결해볼까요?</h2>
                <div className="grid grid-cols-1 gap-4">
                    {SCENARIOS.map(s => (
                        <button
                            key={s.id}
                            onClick={() => handleScenarioChange(s.id)}
                            className={`text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${data.scenarioId === s.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200'}`}
                        >
                            <h3 className="font-bold text-lg text-slate-800">{s.title}</h3>
                            <p className="text-sm text-slate-500">{s.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {step === 1 && (
            <div className="animate-fade-in flex-1">
                <h2 className="text-2xl font-bold mb-6">누가 이 서비스를 이용하나요? (다중 선택)</h2>
                <div className="flex flex-wrap gap-4">
                    {Object.values(Stakeholder).map((s) => (
                        <button
                            key={s}
                            onClick={() => toggleStakeholder(s)}
                            className={`px-6 py-3 rounded-full font-bold border-2 transition-all ${
                                data.stakeholders.includes(s) 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' 
                                : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                <p className="mt-4 text-slate-500 text-sm">💡 다양한 입장에서 생각해야 좋은 서비스를 만들 수 있어요.</p>
            </div>
        )}

        {step === 2 && (
             <div className="animate-fade-in flex-1">
                <h2 className="text-2xl font-bold mb-2">DNPC 구조 설계</h2>
                <p className="text-slate-500 mb-6 text-sm">기본값이 자동으로 입력되었습니다. 내 아이디어에 맞게 수정해보세요.</p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-indigo-700 mb-1">Device (디바이스)</label>
                        <input 
                            value={data.dnpc.device} 
                            onChange={(e) => setData({...data, dnpc: {...data.dnpc, device: e.target.value}})}
                            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="예: 온도 센서, CCTV"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-indigo-700 mb-1">Network (네트워크)</label>
                        <input 
                            value={data.dnpc.network} 
                            onChange={(e) => setData({...data, dnpc: {...data.dnpc, network: e.target.value}})}
                            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="예: 5G, Wi-Fi"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-indigo-700 mb-1">Platform (플랫폼)</label>
                        <input 
                            value={data.dnpc.platform} 
                            onChange={(e) => setData({...data, dnpc: {...data.dnpc, platform: e.target.value}})}
                            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="예: 도시 데이터 허브"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-indigo-700 mb-1">Service (서비스)</label>
                        <input 
                            value={data.dnpc.service} 
                            onChange={(e) => setData({...data, dnpc: {...data.dnpc, service: e.target.value}})}
                            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="예: 알림 앱, 전광판"
                        />
                    </div>
                </div>
            </div>
        )}

        {step === 3 && (
             <div className="animate-fade-in flex-1">
                <h2 className="text-2xl font-bold mb-6">예상되는 위험을 체크하세요</h2>
                <div className="space-y-3">
                    {RISKS.map((r, i) => (
                        <label key={i} className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:bg-red-50 cursor-pointer transition-colors">
                            <input 
                                type="checkbox" 
                                checked={data.risks.includes(r)}
                                onChange={() => toggleRisk(r)}
                                className="w-5 h-5 accent-red-500"
                            />
                            <span className="text-slate-700">{r}</span>
                        </label>
                    ))}
                </div>
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg flex gap-3 text-sm text-yellow-800">
                    <AlertTriangle className="shrink-0"/>
                    편리함 뒤에는 항상 보안 위험이 따릅니다. 꼼꼼히 체크해보세요!
                </div>
             </div>
        )}

        {step === 4 && (
             <div className="animate-fade-in flex-1">
                <h2 className="text-2xl font-bold mb-4">마지막 성찰 & 피드백</h2>
                <p className="text-slate-600 mb-2 text-sm">이 프로젝트를 통해 우리 동네가 어떻게 긍정적으로 변할까요? (100자 이상)</p>
                <textarea 
                    value={data.reflection}
                    onChange={(e) => setData({...data, reflection: e.target.value})}
                    className="w-full h-32 p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 mb-4 resize-none"
                    placeholder="예: 불법 주정차가 사라져서 초등학생 동생이 안전하게 학교에 갈 수 있을 것 같아요."
                />
                
                {!aiFeedback ? (
                     <button 
                        onClick={handleAiCheck}
                        disabled={loadingAi || data.reflection.length < 10}
                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                     >
                        {loadingAi ? (
                            <span className="animate-pulse">AI 선생님이 분석 중입니다...</span>
                        ) : (
                            <>
                                <Sparkles size={20}/> AI 코치에게 피드백 받기
                            </>
                        )}
                     </button>
                ) : (
                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 animate-slide-up">
                        <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2"><CheckCircle size={18}/> AI 코치의 조언</h3>
                        <p className="text-purple-800 text-sm whitespace-pre-wrap">{aiFeedback}</p>
                    </div>
                )}
             </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-4 border-t border-slate-100">
            <button 
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="px-6 py-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 font-bold flex items-center gap-2"
            >
                <ArrowLeft size={18} /> 이전
            </button>
            
            {step < STEPS.length - 1 ? (
                <button 
                    onClick={() => setStep(step + 1)}
                    disabled={step === 0 && !data.scenarioId}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2 disabled:bg-slate-300"
                >
                    다음 <ArrowRight size={18} />
                </button>
            ) : (
                <button 
                    onClick={() => setShowReport(true)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 shadow-lg"
                >
                    <Printer size={18} /> 최종 결과 보기
                </button>
            )}
        </div>
      </div>
    </div>
  );
};