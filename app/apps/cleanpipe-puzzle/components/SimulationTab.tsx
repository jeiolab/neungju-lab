import React, { useState } from 'react';
import { STEPS } from '../constants';
import { generateRawData, processData } from '../services/dataEngine';
import { PipelineItem, StepType, SimulationResult, Difficulty } from '../types';
import { Play, RotateCcw, Plus, Trash2, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface SimulationTabProps {
  difficulty: Difficulty;
  onComplete: (score: number) => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ difficulty, onComplete }) => {
  const [pipeline, setPipeline] = useState<PipelineItem[]>([]);
  const [rawData] = useState(generateRawData());
  const [result, setResult] = useState<{ processedData: any[], stats: SimulationResult } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Available steps (filter based on difficulty if needed, currently showing all)
  const availableSteps = STEPS;

  const addToPipeline = (stepId: string) => {
    const stepDef = STEPS.find(s => s.id === stepId);
    if (!stepDef) return;
    
    // Check if already added (allow multiples? usually distinct steps for this level)
    if (pipeline.find(p => p.stepId === stepId)) return;

    setPipeline([...pipeline, {
      stepId: stepDef.id,
      stepType: stepDef.type,
      selectedOption: stepDef.options ? stepDef.options[0] : undefined, // Default option
      selectedReasonIndex: null
    }]);
    setResult(null); // Reset result on change
  };

  const removeFromPipeline = (index: number) => {
    const newPipeline = [...pipeline];
    newPipeline.splice(index, 1);
    setPipeline(newPipeline);
    setResult(null);
  };

  const updatePipelineItem = (index: number, field: keyof PipelineItem, value: any) => {
    const newPipeline = [...pipeline];
    newPipeline[index] = { ...newPipeline[index], [field]: value };
    setPipeline(newPipeline);
    setResult(null);
  };

  const runSimulation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const res = processData(rawData, pipeline);
      setResult({ processedData: res.processedData, stats: res.result });
      setIsProcessing(false);
      if (res.result.success) {
        onComplete(res.result.score);
      }
    }, 800);
  };

  const reset = () => {
    setPipeline([]);
    setResult(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Area */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">파이프라인 구축</h2>
          <p className="text-sm text-slate-500">데이터를 깨끗하게 만드는 단계를 순서대로 조립하세요.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="px-3 py-2 text-sm text-slate-600 bg-slate-100 rounded hover:bg-slate-200 flex items-center gap-1">
            <RotateCcw size={16} /> 초기화
          </button>
          <button 
            onClick={runSimulation}
            disabled={pipeline.length === 0 || isProcessing}
            className={`px-4 py-2 text-sm font-bold text-white rounded shadow-md flex items-center gap-2 transition-all
              ${pipeline.length === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'}
            `}
          >
            <Play size={18} /> {isProcessing ? '처리 중...' : '실행'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Available Steps */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            🧩 사용 가능한 도구
          </h3>
          <div className="space-y-2">
            {availableSteps.map(step => {
              const isAdded = pipeline.some(p => p.stepId === step.id);
              return (
                <button
                  key={step.id}
                  onClick={() => addToPipeline(step.id)}
                  disabled={isAdded}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center
                    ${isAdded 
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-default' 
                      : 'bg-white border-slate-200 shadow-sm hover:border-blue-400 hover:shadow-md text-slate-700'}
                  `}
                >
                  <span className="font-medium">{step.label}</span>
                  {!isAdded && <Plus size={16} className="text-blue-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Middle Column: Pipeline Assembly */}
        <div className="bg-blue-50 p-4 rounded-xl border-2 border-dashed border-blue-200 min-h-[400px]">
          <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
            🚀 나의 처리 파이프라인
          </h3>
          
          {pipeline.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-blue-300">
              <p>왼쪽에서 도구를 클릭하여 추가하세요</p>
            </div>
          ) : (
            <div className="space-y-3 relative">
               {/* Connecting Line visual */}
              <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-blue-200 -z-10"></div>
              
              {pipeline.map((item, idx) => {
                const def = STEPS.find(s => s.id === item.stepId)!;
                return (
                  <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 relative group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <span className="font-bold text-slate-800">{def.label}</span>
                      </div>
                      <button onClick={() => removeFromPipeline(idx)} className="text-slate-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Micro Options (if any) */}
                    {def.options && (
                      <div className="mb-2">
                         <label className="text-xs text-slate-500 block mb-1">처리 방법:</label>
                         <select 
                           className="w-full text-sm border-slate-200 rounded bg-slate-50 p-1"
                           value={item.selectedOption}
                           onChange={(e) => updatePipelineItem(idx, 'selectedOption', e.target.value)}
                         >
                           {def.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                         </select>
                      </div>
                    )}

                    {/* Reason Selector */}
                    <div>
                      <label className="text-xs text-slate-500 block mb-1">왜 이 단계인가요?</label>
                      <select 
                        className={`w-full text-sm border rounded p-1 ${item.selectedReasonIndex === null ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
                        value={item.selectedReasonIndex ?? ''}
                        onChange={(e) => updatePipelineItem(idx, 'selectedReasonIndex', parseInt(e.target.value))}
                      >
                        <option value="">이유를 선택하세요...</option>
                        {def.reasonOptions.map((opt, optIdx) => (
                          <option key={optIdx} value={optIdx}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Results & Preview */}
        <div className="space-y-6">
           {/* Result Feedback Card */}
           {result && (
             <div className={`p-4 rounded-xl border shadow-md ${result.stats.success ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-start gap-3">
                  {result.stats.success ? <CheckCircle className="text-green-600 shrink-0" /> : <AlertCircle className="text-amber-600 shrink-0" />}
                  <div>
                    <h4 className={`font-bold ${result.stats.success ? 'text-green-800' : 'text-amber-800'}`}>
                      {result.stats.success ? '성공!' : '다시 확인해보세요'}
                    </h4>
                    <p className="text-sm mt-1 text-slate-700">{result.stats.message}</p>
                    <div className="mt-3 flex gap-4 text-sm font-medium">
                       <span className="text-slate-600">점수: {result.stats.score}</span>
                       {result.stats.success && <span className="text-blue-600">XP +50 획득!</span>}
                    </div>
                  </div>
                </div>
             </div>
           )}

           {/* Data Stats */}
           {result && (
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-700 mb-2">데이터 변화 요약</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                   <div className="bg-slate-50 p-2 rounded">
                     <span className="text-slate-500">초기 데이터</span>
                     <p className="text-lg font-bold text-slate-800">{result.stats.dataStats.initialRows}행</p>
                   </div>
                   <div className="bg-blue-50 p-2 rounded">
                     <span className="text-blue-500">최종 데이터</span>
                     <p className="text-lg font-bold text-blue-800">{result.stats.dataStats.finalRows}행</p>
                   </div>
                </div>
                <div className="mt-3 text-xs text-slate-500 space-y-1">
                  <p>• 해결한 결측치: {result.stats.dataStats.missingFixed}개</p>
                  <p>• 처리한 이상치: {result.stats.dataStats.outliersFixed}개</p>
                  <p>• 제거한 중복: {result.stats.dataStats.duplicatesRemoved}개</p>
                </div>
             </div>
           )}

           {/* Data Preview Table */}
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-3 bg-slate-100 border-b border-slate-200 font-bold text-slate-700 text-sm flex justify-between items-center">
               <span>데이터 미리보기 ({result ? '처리 후' : '처리 전'})</span>
               {!result && <span className="text-xs font-normal text-red-500">결측치/이상치 포함됨</span>}
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-xs text-left">
                 <thead className="bg-slate-50 text-slate-500 uppercase">
                   <tr>
                     <th className="px-3 py-2">ID</th>
                     <th className="px-3 py-2">시간</th>
                     <th className="px-3 py-2">PM2.5</th>
                     <th className="px-3 py-2">PM10</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {(result ? result.processedData : rawData).slice(0, 8).map((row, i) => (
                     <tr key={i} className={`hover:bg-slate-50 ${(!result && (row.pm25 === null || row.pm25 > 500)) ? 'bg-red-50' : ''}`}>
                       <td className="px-3 py-2 font-mono">{row.id}</td>
                       <td className="px-3 py-2">{row.timestamp}</td>
                       <td className={`px-3 py-2 ${(!result && row.pm25 === null) ? 'text-red-500 font-bold' : ''}`}>
                         {row.pm25 === null ? 'NaN' : row.pm25}
                       </td>
                       <td className="px-3 py-2">{row.pm10 === null ? 'NaN' : row.pm10}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               <div className="p-2 text-center text-xs text-slate-400 bg-slate-50">
                 ... 전체 데이터 중 일부만 표시 ...
               </div>
             </div>
           </div>

           {/* Simple Chart */}
           {result && (
             <div className="h-40 bg-white rounded-xl border border-slate-200 p-2 shadow-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.processedData.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="id" tick={{fontSize: 10}} />
                    <YAxis tick={{fontSize: 10}} />
                    <Tooltip />
                    <Bar dataKey="pm25" fill="#3b82f6" name="PM2.5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;