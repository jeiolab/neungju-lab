import React, { useState, useEffect, useCallback } from 'react';
import { SCENARIOS, DATA_CATEGORIES, PROTECTION_MEASURES } from '../constants';
import { Scenario, SimulationScores } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { analyzeSimulation } from '../services/geminiService';
import { Info, AlertTriangle, CheckCircle, BrainCircuit } from 'lucide-react';

const Simulation: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [selectedProtections, setSelectedProtections] = useState<string[]>([]);
  const [scores, setScores] = useState<SimulationScores>({ convenience: 0, risk: 0, publicGood: 0, balance: 0 });
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Score Calculation Logic
  const calculateScores = useCallback(() => {
    if (!selectedScenario) return;

    let convenience = 10; // Base score
    let risk = 5; // Base risk
    let publicGood = selectedScenario.basePublicGood;

    // Add Data Factors
    selectedData.forEach(id => {
      const item = DATA_CATEGORIES.find(d => d.id === id);
      if (item) {
        convenience += item.convenienceFactor;
        risk += item.riskFactor;
        publicGood += item.publicGoodFactor;
      }
    });

    // Apply Protection Factors
    selectedProtections.forEach(id => {
      const item = PROTECTION_MEASURES.find(p => p.id === id);
      if (item) {
        risk = Math.max(5, risk - item.riskReduction); // Cannot go below 5
        convenience = Math.max(10, convenience - item.convenienceCost);
      }
    });

    // Normalize to 0-100 scale roughly
    convenience = Math.min(100, convenience);
    risk = Math.min(100, risk);
    publicGood = Math.min(100, publicGood);

    // Calculate Balance (Standard Deviation-like logic inverse)
    // Low deviation = High Balance.
    const mean = (convenience + risk + publicGood) / 3;
    const variance = (Math.pow(convenience - mean, 2) + Math.pow(risk - mean, 2) + Math.pow(publicGood - mean, 2)) / 3;
    const deviation = Math.sqrt(variance);
    // Balance score: 100 minus deviation (capped). 
    // Ideally, we want high Convenience, Low Risk. 
    // "Balance" in this app context means finding the sweet spot. 
    // Let's define Balance Score as: (Convenience + PublicGood) - Risk. 
    // Or closer to instructions: "Minimize deviation" might imply 50/50/50 is best, but we want High Utility Low Risk.
    // Let's use a simple weighted score: (Convenience * 0.4 + PublicGood * 0.3 + (100 - Risk) * 0.3)
    const balance = Math.round((convenience * 0.4) + (publicGood * 0.3) + ((100 - risk) * 0.3));

    setScores({ convenience, risk, publicGood, balance });
  }, [selectedScenario, selectedData, selectedProtections]);

  useEffect(() => {
    calculateScores();
  }, [calculateScores]);

  const handleScenarioSelect = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setStep(2);
    // Reset selections
    setSelectedData([]);
    setSelectedProtections([]);
    setAiAnalysis('');
  };

  const toggleData = (id: string) => {
    setSelectedData(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleProtection = (id: string) => {
    setSelectedProtections(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleFinalize = async () => {
    setStep(3);
    if (selectedScenario) {
      // Save to local storage logic could go here
      const historyItem = {
        scenarioId: selectedScenario.id,
        score: scores,
        date: new Date().toISOString()
      };
      const existingHistory = JSON.parse(localStorage.getItem('sim_history') || '[]');
      localStorage.setItem('sim_history', JSON.stringify([historyItem, ...existingHistory]));

      // AI Analysis
      setIsAnalyzing(true);
      const analysis = await analyzeSimulation(
        selectedScenario.title,
        selectedData.map(d => DATA_CATEGORIES.find(x => x.id === d)?.label || ''),
        selectedProtections.map(p => PROTECTION_MEASURES.find(x => x.id === p)?.label || ''),
        scores
      );
      setAiAnalysis(analysis);
      setIsAnalyzing(false);
    }
  };

  // Chart Data
  const chartData = [
    { subject: '편의성 (정확도)', A: scores.convenience, fullMark: 100 },
    { subject: '위험도 (유출가능성)', A: scores.risk, fullMark: 100 },
    { subject: '공익성 (사회기여)', A: scores.publicGood, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          {step === 1 && "시나리오 선택"}
          {step === 2 && "데이터 및 보호설정"}
          {step === 3 && "결과 분석"}
        </h2>
        <div className="flex space-x-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-3 h-3 rounded-full ${step >= s ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SCENARIOS.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioSelect(scenario)}
              className="bg-white p-6 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:shadow-lg transition-all text-left flex flex-col h-full"
            >
              <span className="text-4xl mb-4 block">{scenario.icon}</span>
              <h3 className="font-bold text-lg mb-2">{scenario.title}</h3>
              <p className="text-slate-500 text-sm">{scenario.description}</p>
              <div className="mt-auto pt-4 text-xs font-semibold text-indigo-600 bg-indigo-50 inline-block px-2 py-1 rounded">
                공익 기여도 기본: {scenario.basePublicGood}점
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 2 && selectedScenario && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <Share2 className="mr-2 text-indigo-500" size={20}/> 1. 어떤 정보를 공유할까요?
              </h3>
              <div className="space-y-3">
                {DATA_CATEGORIES.map(item => (
                  <label key={item.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      checked={selectedData.includes(item.id)}
                      onChange={() => toggleData(item.id)}
                    />
                    <div>
                      <span className="font-medium text-slate-800">{item.label}</span>
                      <div className="flex space-x-2 mt-1">
                         <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">위험 +{item.riskFactor}</span>
                         <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">편의 +{item.convenienceFactor}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                <Shield className="mr-2 text-teal-500" size={20}/> 2. 어떻게 보호할까요?
              </h3>
              <div className="space-y-3">
                {PROTECTION_MEASURES.map(item => (
                  <label key={item.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                      checked={selectedProtections.includes(item.id)}
                      onChange={() => toggleProtection(item.id)}
                    />
                    <div>
                      <span className="font-medium text-slate-800">{item.label}</span>
                      <div className="flex space-x-2 mt-1">
                         <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">위험 감소 -{item.riskReduction}</span>
                         <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">편의 감소 -{item.convenienceCost}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <button 
              onClick={handleFinalize}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1"
            >
              결과 확인하기
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-4 h-fit">
             <h3 className="font-bold text-slate-800 mb-4 text-center">실시간 예측 점수</h3>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="내 선택" dataKey="A" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.6} />
                    <Legend />
                 </RadarChart>
               </ResponsiveContainer>
             </div>
             <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-xs text-green-700">편의성</div>
                  <div className="font-bold text-xl text-green-800">{scores.convenience}</div>
                </div>
                <div className="bg-red-50 p-2 rounded">
                  <div className="text-xs text-red-700">위험도</div>
                  <div className="font-bold text-xl text-red-800">{scores.risk}</div>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-xs text-blue-700">공익성</div>
                  <div className="font-bold text-xl text-blue-800">{scores.publicGood}</div>
                </div>
             </div>
             <div className="mt-4 text-center">
               <span className="text-sm text-slate-500">균형 점수</span>
               <div className="text-3xl font-black text-slate-800">{scores.balance}<span className="text-sm font-normal text-slate-400">/100</span></div>
             </div>
          </div>
        </div>
      )}

      {step === 3 && selectedScenario && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-indigo-500">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">당신의 선택 결과</h3>
            <p className="text-slate-600 mb-6">
              선택한 시나리오: <strong>{selectedScenario.title}</strong>
            </p>

            <div className="flex flex-col md:flex-row gap-8 items-center">
               <div className="w-full md:w-1/2 h-64">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="최종 결과" dataKey="A" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.6} />
                      <Legend />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>

               <div className="w-full md:w-1/2 space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center mb-2">
                      <BrainCircuit className="text-indigo-600 mr-2" size={20} />
                      <span className="font-bold text-slate-700">AI 분석 결과</span>
                    </div>
                    {isAnalyzing ? (
                      <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {aiAnalysis}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-red-50 rounded border border-red-100">
                      <div className="flex items-center text-red-700 font-bold mb-1">
                        <AlertTriangle size={16} className="mr-1"/> 위험 요인
                      </div>
                      <p className="text-xs text-red-600">
                        {scores.risk > 70 ? "민감한 정보가 많고 보호장치가 부족해요." : "보호장치를 적절히 선택하여 위험을 낮췄어요."}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded border border-green-100">
                      <div className="flex items-center text-green-700 font-bold mb-1">
                        <CheckCircle size={16} className="mr-1"/> 이득 요인
                      </div>
                      <p className="text-xs text-green-600">
                        {scores.convenience > 70 ? "많은 데이터를 제공하여 매우 정밀한 추천을 받아요." : "데이터 제공이 적어 추천이 부정확할 수 있어요."}
                      </p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button 
                onClick={() => { setStep(1); setScores({convenience:0, risk:0, publicGood:0, balance:0}); }}
                className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 mr-4"
              >
                다른 시나리오 해보기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper icon component since we can't import explicitly inside function
const Share2 = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
const Shield = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;

export default Simulation;