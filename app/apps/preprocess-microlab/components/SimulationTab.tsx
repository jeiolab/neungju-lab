import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Play, RotateCcw, MessageCircle } from 'lucide-react';
import { MissingValueStrategy, UserState, SimulationResult } from '../types';
import { processExperiment } from '../services/dataService';
import { analyzeStudentReflection } from '../services/geminiService';
import { BADGES } from '../constants';

interface Props {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
}

const SimulationTab: React.FC<Props> = ({ userState, setUserState }) => {
  const [missingStrat, setMissingStrat] = useState<MissingValueStrategy>(MissingValueStrategy.DROP);
  const [outlierThreshold, setOutlierThreshold] = useState<number>(0);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [reflection, setReflection] = useState("");
  const [reflectionStatus, setReflectionStatus] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const [reflectionFeedback, setReflectionFeedback] = useState<string | null>(null);

  const handleRun = () => {
    const output = processExperiment(missingStrat, outlierThreshold);
    setResult(output.result);
    setReflectionStatus('idle');
    setReflectionFeedback(null);
    setReflection("");

    // Gamification Updates
    const newStrategies = [...userState.strategiesUsed];
    if (!newStrategies.includes(missingStrat)) {
      newStrategies.push(missingStrat);
    }

    const newBadges = [...userState.badges];
    if (newStrategies.length === 4 && !newBadges.includes(BADGES.MISSING_TAMER.id)) {
      newBadges.push(BADGES.MISSING_TAMER.id);
    }
    if (outlierThreshold > 0 && outlierThreshold < 100 && outlierThreshold !== 50 && !newBadges.includes(BADGES.OUTLIER_KING.id)) {
        // Simple logic: if they played with sliders somewhat seriously
         newBadges.push(BADGES.OUTLIER_KING.id);
    }

    setUserState(prev => ({
      ...prev,
      xp: prev.xp + 10,
      experimentsRun: prev.experimentsRun + 1,
      strategiesUsed: newStrategies,
      badges: newBadges
    }));
  };

  const handleReflectionSubmit = async () => {
    if (!reflection.trim() || !result) return;
    setReflectionStatus('analyzing');

    const context = `결측치처리: ${missingStrat}, 이상치강도: ${outlierThreshold}, 결과: 원래평균 ${result.originalMean.toFixed(1)} -> 보정평균 ${result.cleanedMean.toFixed(1)}`;
    const analysis = await analyzeStudentReflection(context, reflection);

    setReflectionFeedback(analysis.feedback);
    setReflectionStatus('done');
    
    if (analysis.score > 60) {
       setUserState(prev => ({
           ...prev,
           xp: prev.xp + 20,
           badges: prev.badges.includes(BADGES.THINKER.id) ? prev.badges : [...prev.badges, BADGES.THINKER.id]
       }));
    }
  };

  const chartData = result ? [
    { name: 'Original (Dirty)', value: result.originalMean },
    { name: 'Processed (Clean)', value: result.cleanedMean }
  ] : [];

  return (
    <div className="grid lg:grid-cols-12 gap-6 pb-20">
      {/* Controls Area */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4 text-slate-800">1. 결측치 처리 (Missing Values)</h3>
          <p className="text-sm text-slate-500 mb-3">키 정보가 없는 학생을 어떻게 할까요?</p>
          <div className="relative">
            <select
              value={missingStrat}
              onChange={(e) => setMissingStrat(e.target.value as MissingValueStrategy)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="DROP">삭제 (Drop)</option>
              <option value="MEAN">평균값 채우기 (Mean)</option>
              <option value="MEDIAN">중앙값 채우기 (Median)</option>
              <option value="MODE">최빈값 채우기 (Mode)</option>
            </select>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-4 text-slate-800">2. 이상치 제거 (Outliers)</h3>
          <p className="text-sm text-slate-500 mb-3">이상한 값(999cm 등)을 얼마나 강하게 잡을까요?</p>
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={outlierThreshold}
              onChange={(e) => setOutlierThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>유지 (0)</span>
              <span>적당히 (50)</span>
              <span>강하게 제거 (100)</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleRun}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Play className="w-5 h-5" /> 실험 실행 (Run)
        </button>
      </div>

      {/* Results Area */}
      <div className="lg:col-span-8 space-y-6">
        {result ? (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             {/* Chart */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
                <h3 className="text-lg font-bold text-slate-800 mb-4">평균 키 변화 (cm)</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[140, 200]} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <ReferenceLine y={170} label="Actual Avg (~170)" stroke="red" strokeDasharray="3 3" />
                    <Bar dataKey="value" fill="#6366f1" barSize={60} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>

             {/* 3-Line Feedback */}
             <div className="grid md:grid-cols-3 gap-4">
               <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                 <span className="text-xs font-bold text-blue-500 uppercase">변화 (Change)</span>
                 <p className="mt-1 text-sm font-medium text-blue-900">{result.feedback.change}</p>
               </div>
               <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                 <span className="text-xs font-bold text-amber-500 uppercase">이유 (Why)</span>
                 <p className="mt-1 text-sm font-medium text-amber-900">{result.feedback.reason}</p>
               </div>
               <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                 <span className="text-xs font-bold text-emerald-500 uppercase">다음 단계 (Next)</span>
                 <p className="mt-1 text-sm font-medium text-emerald-900">{result.feedback.nextStep}</p>
               </div>
             </div>

             {/* Stats Summary */}
             <div className="flex gap-4 text-sm text-slate-500 justify-center">
                <span>원본 데이터: {result.originalCount}개</span>
                <span>•</span>
                <span>삭제됨: {result.droppedCount}개</span>
                <span>•</span>
                <span>최종 데이터: {result.cleanedCount}개</span>
             </div>

             {/* Reflection Mini-Game */}
             <div className="bg-white p-5 rounded-xl border border-slate-200 mt-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-indigo-500" />
                    왜 이런 결과가 나왔을까요?
                </h4>
                <p className="text-xs text-slate-500 mb-3">한 문장으로 적으면 보너스 경험치를 얻을 수 있어요!</p>
                
                {reflectionStatus === 'done' ? (
                     <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 animate-in fade-in">
                         <p className="font-bold text-indigo-600 mb-1">AI 선생님 피드백:</p>
                         {reflectionFeedback}
                     </div>
                ) : (
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="예: 이상치를 제거하지 않아서 평균이 높아졌어요."
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                            disabled={reflectionStatus === 'analyzing'}
                        />
                        <button 
                            onClick={handleReflectionSubmit}
                            disabled={reflectionStatus === 'analyzing' || !reflection}
                            className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 disabled:opacity-50"
                        >
                            {reflectionStatus === 'analyzing' ? '분석 중...' : '제출'}
                        </button>
                    </div>
                )}
             </div>

          </div>
        ) : (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 text-slate-400">
             <RotateCcw className="w-12 h-12 mb-4 opacity-50" />
             <p className="font-medium">왼쪽에서 옵션을 선택하고<br/>'실험 실행' 버튼을 눌러보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimulationTab;
