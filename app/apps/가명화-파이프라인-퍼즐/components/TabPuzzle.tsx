import React, { useState } from 'react';
import { INITIAL_PUZZLE_STEPS } from '../constants';
import { PuzzleStep, SimulationResult } from '../types';
import { ArrowDown, GripVertical, AlertTriangle, CheckCircle, BarChart3, RefreshCw } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea, Label } from 'recharts';

const TabPuzzle: React.FC = () => {
  const [steps, setSteps] = useState<PuzzleStep[]>(INITIAL_PUZZLE_STEPS);
  const [result, setResult] = useState<SimulationResult | null>(null);

  // Simple swap logic for reordering without heavy DnD libs
  const moveStep = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) return;
    
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
    setSteps(newSteps);
    setResult(null); // Reset result on change
  };

  const updateOption = (stepIndex: number, optionIndex: number) => {
    const newSteps = [...steps];
    newSteps[stepIndex].selectedOptionIndex = optionIndex;
    setSteps(newSteps);
    setResult(null);
  };

  const calculateSimulation = () => {
    let risk = 50; // Base risk
    let utility = 50; // Base utility
    const feedback: string[] = [];
    let correctOrder = true;

    // Check Order (Simplified: Ideal order is s1 -> s2 -> ... -> s7)
    // We penalize if "Remove identifiers" (s3) comes AFTER "Public Scope" (s5)
    const s3Index = steps.findIndex(s => s.id === 's3');
    const s5Index = steps.findIndex(s => s.id === 's5');

    if (s3Index > s5Index) {
      feedback.push("⚠️ 경고: 식별자를 제거하기 전에 공개 범위를 설정했습니다. 매우 위험합니다!");
      risk += 40;
      correctOrder = false;
    }

    // Calculate effects from options
    steps.forEach(step => {
      const selected = step.options[step.selectedOptionIndex];
      risk += selected.riskEffect;
      utility += selected.utilityEffect;
    });

    // Clamp values
    risk = Math.max(0, Math.min(100, risk));
    utility = Math.max(0, Math.min(100, utility));

    // Generate score
    let score = 0;
    if (correctOrder && risk < 40 && utility > 40) score = 3;
    else if (correctOrder && risk < 60) score = 2;
    else score = 1;

    if (score === 3) feedback.push("🎉 훌륭합니다! 안전과 활용의 균형을 잘 맞췄습니다.");
    if (risk > 70) feedback.push("🚨 재식별 위험이 너무 높습니다. 식별자 제거 단계를 강화하세요.");
    if (utility < 30) feedback.push("📉 데이터가 너무 많이 손상되어 활용 가치가 낮습니다.");

    setResult({ risk, utility, feedback, score });
  };

  const chartData = result ? [{ x: result.risk, y: result.utility }] : [];

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Column: Puzzle Interface */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">데이터 처리 파이프라인 구성</h2>
          <button 
            onClick={() => { setSteps(INITIAL_PUZZLE_STEPS); setResult(null); }}
            className="text-sm text-slate-500 flex items-center gap-1 hover:text-blue-600"
          >
            <RefreshCw size={14} /> 초기화
          </button>
        </div>
        
        <p className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
          순서를 위아래로 조정하고, 각 단계의 세부 설정을 선택하세요. <br/>
          목표: <b>학교 주변 안전지도 설문 데이터</b> 공유하기
        </p>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.id} className="relative group">
              {index > 0 && <div className="absolute -top-3 left-6 w-0.5 h-3 bg-slate-300 z-0 mx-auto" />}
              
              <div className="relative z-10 bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-blue-400 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1 pt-1 text-slate-400">
                    <button onClick={() => moveStep(index, 'up')} disabled={index === 0} className="hover:text-blue-600 disabled:opacity-30"><ArrowDown className="rotate-180 w-4 h-4" /></button>
                    <GripVertical className="w-4 h-4 cursor-grab active:cursor-grabbing" />
                    <button onClick={() => moveStep(index, 'down')} disabled={index === steps.length - 1} className="hover:text-blue-600 disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{step.title}</h3>
                    <p className="text-xs text-slate-500 mb-2">{step.description}</p>
                    
                    <select 
                      className="w-full text-sm p-2 bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      value={step.selectedOptionIndex}
                      onChange={(e) => updateOption(index, Number(e.target.value))}
                    >
                      {step.options.map((opt, optIndex) => (
                        <option key={optIndex} value={optIndex}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={calculateSimulation}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <BarChart3 />
          결과 시뮬레이션 실행
        </button>
      </div>

      {/* Right Column: Results & Analysis */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800">분석 리포트</h2>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-[400px]">
          <h3 className="text-center font-semibold mb-4 text-slate-600">위험도 vs 유용성 매트릭스</h3>
          <ResponsiveContainer width="100%" height="90%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="위험도" unit="점" domain={[0, 100]} label={{ value: "재식별 위험도", position: "insideBottom", offset: -10 }} />
              <YAxis type="number" dataKey="y" name="유용성" unit="점" domain={[0, 100]} label={{ value: "데이터 유용성", angle: -90, position: "insideLeft" }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              
              {/* Zones */}
              <ReferenceArea x1={0} x2={40} y1={60} y2={100} stroke="none" fill="rgba(34, 197, 94, 0.1)" />
              <ReferenceArea x1={70} x2={100} y1={0} y2={100} stroke="none" fill="rgba(239, 68, 68, 0.1)" />
              
              <Scatter name="내 결과" data={chartData} fill="#4f46e5" shape="star" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {result ? (
          <div className="space-y-4 animate-fade-in">
            <div className="flex gap-4">
              <div className="flex-1 bg-rose-50 p-4 rounded-xl border border-rose-100 text-center">
                <span className="block text-sm text-rose-600 font-bold uppercase">Risk</span>
                <span className="text-3xl font-black text-rose-700">{result.risk}</span>
                <span className="text-xs text-rose-400">/ 100</span>
              </div>
              <div className="flex-1 bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                <span className="block text-sm text-emerald-600 font-bold uppercase">Utility</span>
                <span className="text-3xl font-black text-emerald-700">{result.utility}</span>
                <span className="text-xs text-emerald-400">/ 100</span>
              </div>
            </div>

            <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg">
              <h4 className="font-bold flex items-center gap-2 mb-4 text-yellow-400">
                {result.score >= 3 ? '⭐⭐⭐' : result.score === 2 ? '⭐⭐' : '⭐'} 평가 결과
              </h4>
              <ul className="space-y-2">
                {result.feedback.map((msg, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
                    {msg}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="h-40 flex flex-col items-center justify-center text-slate-400 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300">
            <AlertTriangle className="mb-2" />
            <p>시뮬레이션을 실행하면 결과가 표시됩니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabPuzzle;