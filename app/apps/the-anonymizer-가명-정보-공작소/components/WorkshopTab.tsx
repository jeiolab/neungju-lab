'use client';

import React, { useState, useCallback } from 'react';
import { Mission, PipelineStep, Tool, RawDataField, EvaluationResult, DataCategory } from '../types';
import { evaluatePipeline } from '../services/geminiService';
import { Play, Trash2, RotateCcw, ShieldCheck, Database, CheckCircle, XCircle, ArrowRight, Loader2 } from 'lucide-react';

interface WorkshopProps {
  mission: Mission;
  tools: Tool[];
  onSuccess: (coins: number) => void;
}

const WorkshopTab: React.FC<WorkshopProps> = ({ mission, tools, onSuccess }) => {
  const [pipeline, setPipeline] = useState<PipelineStep[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const addToPipeline = (fieldId: string, toolId: string) => {
    // Replace existing tool for this field if exists, or add new
    setPipeline(prev => {
      const filtered = prev.filter(p => p.fieldId !== fieldId);
      return [...filtered, { fieldId, toolId }];
    });
  };

  const removeFromPipeline = (fieldId: string) => {
    setPipeline(prev => prev.filter(p => p.fieldId !== fieldId));
  };

  const runSimulation = useCallback(async () => {
    setIsProcessing(true);
    setResult(null);
    try {
      const evaluation = await evaluatePipeline(mission, pipeline, tools);
      setResult(evaluation);
      if (evaluation.isSuccess) {
        onSuccess(50); // Reward
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  }, [mission, pipeline, tools, onSuccess]);

  const reset = () => {
    setPipeline([]);
    setResult(null);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 p-4 overflow-y-auto">
      {/* Left: Data & Tools */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Mission Header */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            미션: {mission.title}
          </h2>
          <p className="text-sm text-slate-600 mt-1">{mission.description}</p>
          <div className="flex gap-4 mt-3 text-sm font-medium">
            <span className="text-green-600">목표 안전성: {mission.requiredSafety}</span>
            <span className="text-blue-600">목표 유용성: {mission.requiredUtility}</span>
          </div>
        </div>

        {/* Data Fields & Tool Selection */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex-1 overflow-y-auto">
          <h3 className="text-md font-semibold text-slate-700 mb-3">데이터 필드별 처리 도구 선택</h3>
          <div className="space-y-4">
            {mission.data.map((field) => {
              const activeStep = pipeline.find(p => p.fieldId === field.id);
              const activeTool = tools.find(t => t.id === activeStep?.toolId);

              return (
                <div key={field.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        field.category === DataCategory.IDENTIFIER ? 'bg-red-100 text-red-700' :
                        field.category === DataCategory.QUASI_IDENTIFIER ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {field.category}
                      </span>
                      <span className="font-medium text-slate-800">{field.name}: {field.value}</span>
                    </div>
                  </div>
                  
                  {/* Tool Selector for this field */}
                  <div className="flex flex-wrap gap-2">
                    {tools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => addToPipeline(field.id, tool.id)}
                        className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                          activeStep?.toolId === tool.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {tool.name}
                      </button>
                    ))}
                    {activeStep && (
                      <button
                        onClick={() => removeFromPipeline(field.id)}
                        className="text-xs px-2 py-1.5 text-red-500 hover:bg-red-50 rounded-md ml-auto"
                        title="초기화"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Pipeline Visualizer & Result */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-slate-800 text-slate-100 p-4 rounded-xl shadow-lg flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              가명 처리 시뮬레이터
            </h3>
            <div className="flex gap-2">
              <button onClick={reset} className="p-2 hover:bg-slate-700 rounded-lg transition-colors" title="초기화">
                <RotateCcw className="w-5 h-5 text-slate-400" />
              </button>
              <button 
                onClick={runSimulation}
                disabled={isProcessing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                  isProcessing 
                    ? 'bg-slate-600 cursor-not-allowed text-slate-400' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                }`}
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                처리 실행
              </button>
            </div>
          </div>

          <div className="flex-1 bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-auto border border-slate-700 relative">
            {!result && !isProcessing && (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                <Database className="w-12 h-12 opacity-20" />
                <p>처리 도구를 선택하고 실행을 눌러주세요.</p>
              </div>
            )}
            
            {isProcessing && (
              <div className="flex flex-col items-center justify-center h-full text-emerald-400 gap-4">
                 <Loader2 className="w-12 h-12 animate-spin" />
                 <p className="animate-pulse">데이터 가공 중...</p>
                 <div className="text-xs text-slate-500">법적 규제 검토 중 | 재식별 위험성 산출 중</div>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Score Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border-2 ${result.safetyScore >= mission.requiredSafety ? 'border-emerald-500/50 bg-emerald-900/20' : 'border-red-500/50 bg-red-900/20'}`}>
                    <div className="text-xs text-slate-400 mb-1">안전성 (Safety)</div>
                    <div className={`text-3xl font-bold ${result.safetyScore >= mission.requiredSafety ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.safetyScore}
                      <span className="text-sm font-normal text-slate-500 ml-1">/ {mission.requiredSafety}</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg border-2 ${result.utilityScore >= mission.requiredUtility ? 'border-blue-500/50 bg-blue-900/20' : 'border-red-500/50 bg-red-900/20'}`}>
                    <div className="text-xs text-slate-400 mb-1">유용성 (Utility)</div>
                    <div className={`text-3xl font-bold ${result.utilityScore >= mission.requiredUtility ? 'text-blue-400' : 'text-red-400'}`}>
                      {result.utilityScore}
                      <span className="text-sm font-normal text-slate-500 ml-1">/ {mission.requiredUtility}</span>
                    </div>
                  </div>
                </div>

                {/* Transformed Data Preview */}
                <div>
                  <h4 className="text-slate-300 font-semibold mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" /> 결과 데이터 미리보기
                  </h4>
                  <div className="bg-black/50 p-3 rounded text-green-300 whitespace-pre-wrap">
                    {JSON.stringify(result.transformedData, null, 2)}
                  </div>
                </div>

                {/* Feedback */}
                <div className={`p-3 rounded border-l-4 ${result.isSuccess ? 'border-emerald-500 bg-emerald-900/10' : 'border-red-500 bg-red-900/10'}`}>
                   <div className="flex items-start gap-2">
                      {result.isSuccess ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                      <div>
                        <p className="font-bold text-slate-200">{result.isSuccess ? "미션 성공!" : "미션 실패"}</p>
                        <p className="text-slate-400 mt-1">{result.feedback}</p>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopTab;
