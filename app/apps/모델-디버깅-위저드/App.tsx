
import React, { useState, useEffect, useCallback } from 'react';
import { Settings, PlayCircle, BarChart2, AlertCircle, RefreshCw, Trophy, BookOpen } from 'lucide-react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ProblemType, DataSize, NoiseLevel, SimulationState, SimulationResult } from './types';
import { calculatePerformance, generateConfusionMatrix } from './services/simulation';
import { getCoachFeedback } from './services/gemini';
import { ConceptCard } from './components/ConceptCard';
import { QuizSection } from './components/QuizSection';

const DEFAULT_STATE: SimulationState = {
  problemType: ProblemType.CLASSIFICATION,
  dataSize: DataSize.MEDIUM,
  noiseLevel: NoiseLevel.LOW,
  splitRatio: 0.8,
  modelComplexity: 3,
};

function App() {
  const [mode, setMode] = useState<'wizard' | 'quiz'>('wizard');
  const [state, setState] = useState<SimulationState>(DEFAULT_STATE);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [coachMessage, setCoachMessage] = useState<string>("설정을 조절해서 모델 훈련을 시작해보세요!");
  const [history, setHistory] = useState<{ complexity: number; train: number; test: number }[]>([]);
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [missionCompleted, setMissionCompleted] = useState(false);

  // Update simulation whenever state changes
  useEffect(() => {
    const res = calculatePerformance(state);
    setResult(res);

    // Update history for chart
    setHistory(prev => {
      // If we change problem/data/noise, reset history to show clear curve for current "environment"
      // But if we just change complexity, append to history to show the curve
      // For simplicity in this app, we will generate the full curve for the current environment dynamically 
      // instead of relying on user history, so the user sees the potential outcome immediately.
      return []; 
    });

  }, [state.problemType, state.dataSize, state.noiseLevel, state.splitRatio, state.modelComplexity]);

  // Debounced Coach Feedback
  useEffect(() => {
    if (!result) return;
    
    // Mission Check
    if (result.testScore > 0.82 && Math.abs(result.trainScore - result.testScore) < 0.1) {
      setMissionCompleted(true);
    } else {
      setMissionCompleted(false);
    }

    const timer = setTimeout(async () => {
      setLoadingCoach(true);
      const feedback = await getCoachFeedback(state, result);
      setCoachMessage(feedback);
      setLoadingCoach(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [state, result]);


  // Generate data for the chart based on CURRENT environment settings, varying only complexity
  const chartData = Array.from({ length: 10 }, (_, i) => {
    const complexity = i + 1;
    const sim = calculatePerformance({ ...state, modelComplexity: complexity });
    return {
      complexity,
      Train: parseFloat(sim.trainScore.toFixed(2)),
      Test: parseFloat(sim.testScore.toFixed(2)),
      isCurrent: complexity === state.modelComplexity
    };
  });

  const confusionMatrix = result && state.problemType === ProblemType.CLASSIFICATION 
    ? generateConfusionMatrix(result.testScore, 100) 
    : null;

  const handleReset = () => {
    setState(DEFAULT_STATE);
    setMissionCompleted(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">모델 디버깅 위저드</h1>
              <p className="text-xs text-indigo-100 opacity-90">지도학습 파이프라인 코치</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setMode('wizard')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'wizard' ? 'bg-white text-indigo-600' : 'text-white hover:bg-indigo-500'}`}
            >
              시뮬레이션
            </button>
            <button 
              onClick={() => setMode('quiz')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'quiz' ? 'bg-white text-indigo-600' : 'text-white hover:bg-indigo-500'}`}
            >
              퀴즈 도전
            </button>
          </div>
        </div>
      </header>

      {mode === 'quiz' ? (
        <QuizSection onComplete={(score) => {
          alert(`퀴즈 완료! 당신의 점수: ${score}/5`);
          setMode('wizard');
        }} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Mission Card */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className={`w-5 h-5 ${missionCompleted ? 'text-yellow-500' : 'text-slate-400'}`} />
                <h2 className="font-bold text-slate-800">현재 미션</h2>
              </div>
              <p className="text-sm text-slate-600 mb-2">
                목표: <strong>테스트 점수 {'>'} 82%</strong> 달성하고 격차를 {'<'} 10%로 유지하세요.
              </p>
              {missionCompleted ? (
                <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" /> 미션 성공!
                </div>
              ) : (
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${(result?.testScore || 0) * 100}%` }}></div>
                </div>
              )}
            </div>

            {/* Wizard Controls */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-500" /> 파이프라인 설정
                </h2>
                <button onClick={handleReset} className="text-xs text-slate-500 flex items-center gap-1 hover:text-indigo-600">
                  <RefreshCw className="w-3 h-3" /> 초기화
                </button>
              </div>

              {/* 1. Problem Type */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">1. 문제 유형 (Problem Type)</label>
                <div className="grid grid-cols-2 gap-2">
                  {[ProblemType.CLASSIFICATION, ProblemType.REGRESSION].map((t) => (
                    <button
                      key={t}
                      onClick={() => setState({ ...state, problemType: t })}
                      className={`py-2 px-3 text-sm rounded-lg border ${
                        state.problemType === t 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Data Size */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">2. 데이터 크기 (Data Size)</label>
                <select 
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                  value={state.dataSize}
                  onChange={(e) => setState({...state, dataSize: e.target.value as DataSize})}
                >
                  {Object.values(DataSize).map(ds => <option key={ds} value={ds}>{ds}</option>)}
                </select>
                <p className="text-xs text-slate-500">데이터가 많을수록 과적합을 줄이는 데 도움이 됩니다.</p>
              </div>

              {/* 3. Noise Level */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">3. 데이터 품질 (노이즈)</label>
                <div className="flex gap-2">
                  {Object.values(NoiseLevel).map((nl) => (
                    <button
                      key={nl}
                      onClick={() => setState({ ...state, noiseLevel: nl })}
                      className={`flex-1 py-2 text-xs rounded-lg border ${
                        state.noiseLevel === nl
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                          : 'border-slate-200 text-slate-500'
                      }`}
                    >
                      {nl.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

               {/* 4. Split Ratio */}
               <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">4. 훈련/테스트 비율 (Train/Test Split)</label>
                <input 
                  type="range" min="0.5" max="0.95" step="0.05"
                  value={state.splitRatio}
                  onChange={(e) => setState({...state, splitRatio: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>훈련(Train): {(state.splitRatio * 100).toFixed(0)}%</span>
                  <span>테스트(Test): {((1 - state.splitRatio) * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                 <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <label className="text-sm font-bold text-indigo-900 block mb-2">
                      5. 모델 복잡도 (트리 깊이)
                    </label>
                    <input 
                      type="range" min="1" max="10" step="1"
                      value={state.modelComplexity}
                      onChange={(e) => setState({...state, modelComplexity: parseInt(e.target.value)})}
                      className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-indigo-600 mt-1 font-medium">
                      <span>단순함 (1)</span>
                      <span>현재 깊이: {state.modelComplexity}</span>
                      <span>복잡함 (10)</span>
                    </div>
                 </div>
              </div>

            </div>
          </div>

          {/* Right Column: Visualization & Results */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Coach Feedback */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
               <div className="relative z-10 flex gap-4">
                  <div className="bg-white/20 p-3 rounded-full h-fit">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">AI 코치</h3>
                    <p className={`text-indigo-100 leading-relaxed ${loadingCoach ? 'animate-pulse' : ''}`}>
                      {loadingCoach ? "파이프라인 분석 중..." : `"${coachMessage}"`}
                    </p>
                  </div>
               </div>
               <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-1/4 translate-x-1/4">
                 <Settings className="w-64 h-64" />
               </div>
            </div>

            {/* Main Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-indigo-500" />
                  성능 곡선 (Performance Curve)
                </h3>
                <div className="flex gap-4 text-sm">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                      <span className="text-slate-600">훈련 (Train)</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-slate-600">테스트 (Test)</span>
                   </div>
                </div>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="complexity" 
                      stroke="#94a3b8" 
                      label={{ value: '모델 복잡도 (트리 깊이)', position: 'insideBottom', offset: -5, fontSize: 12 }} 
                    />
                    <YAxis 
                      domain={[0, 1]} 
                      stroke="#94a3b8"
                      tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                    />
                    <Tooltip 
                      formatter={(val: number) => [`${(val * 100).toFixed(1)}%`]}
                      labelFormatter={(val) => `깊이: ${val}`}
                      contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="Train" stroke="#6366f1" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="Test" stroke="#10b981" strokeWidth={3} dot={false} />
                    {/* Current Position Marker */}
                    <Line 
                      type="monotone" 
                      dataKey={(pt) => pt.isCurrent ? pt.Test : null} 
                      stroke="transparent" 
                      dot={{ r: 6, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }} 
                      activeDot={false}
                    />
                     <Line 
                      type="monotone" 
                      dataKey={(pt) => pt.isCurrent ? pt.Train : null} 
                      stroke="transparent" 
                      dot={{ r: 6, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }} 
                      activeDot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-slate-400 mt-2">
                X축: 모델 복잡도 | Y축: 정확도 점수
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Detailed Metrics */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                <h3 className="font-bold text-slate-800 mb-4">현재 성능 지표</h3>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 uppercase font-bold">훈련 (Training)</p>
                    <p className="text-2xl font-black text-indigo-600">{(result?.trainScore! * 100).toFixed(1)}%</p>
                  </div>
                  <div className="h-8 w-px bg-slate-200"></div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 uppercase font-bold">테스트 (Testing)</p>
                    <p className="text-2xl font-black text-emerald-500">{(result?.testScore! * 100).toFixed(1)}%</p>
                  </div>
                </div>

                <div className={`p-3 rounded-lg text-sm font-medium border ${
                  result?.status === 'good' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  result?.status === 'underfitting' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  'bg-red-50 text-red-700 border-red-200'
                }`}>
                  상태: {result?.message}
                </div>
              </div>

              {/* Confusion Matrix or Educational Info */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                 <h3 className="font-bold text-slate-800 mb-4">
                    {state.problemType === ProblemType.CLASSIFICATION ? "시각적 평가 (테스트 세트)" : "평가 (Evaluation)"}
                 </h3>
                 
                 {state.problemType === ProblemType.CLASSIFICATION && confusionMatrix ? (
                   <div className="grid grid-cols-2 gap-2 text-center h-full pb-2">
                      <div className="bg-emerald-100 p-2 rounded flex flex-col justify-center">
                        <span className="text-xs font-bold text-emerald-800">정답 (TP)</span>
                        <span className="text-xl font-bold text-emerald-900">{confusionMatrix.tp}</span>
                      </div>
                      <div className="bg-red-100 p-2 rounded flex flex-col justify-center">
                        <span className="text-xs font-bold text-red-800">오류 (FP)</span>
                        <span className="text-xl font-bold text-red-900">{confusionMatrix.fp}</span>
                      </div>
                      <div className="bg-red-100 p-2 rounded flex flex-col justify-center">
                        <span className="text-xs font-bold text-red-800">오류 (FN)</span>
                        <span className="text-xl font-bold text-red-900">{confusionMatrix.fn}</span>
                      </div>
                      <div className="bg-emerald-100 p-2 rounded flex flex-col justify-center">
                        <span className="text-xs font-bold text-emerald-800">정답 (TN)</span>
                        <span className="text-xl font-bold text-emerald-900">{confusionMatrix.tn}</span>
                      </div>
                   </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
                       <p>회귀(Regression) 분석 중</p>
                       <p className="mt-2">평균 절대 오차(MAE): {((1 - (result?.testScore || 0)) * 100).toFixed(1)}</p>
                    </div>
                 )}
              </div>
            </div>

            {/* Concept Cards */}
            <div className="space-y-4">
              <ConceptCard 
                type="tip"
                title="지도학습 개념 (Supervised Learning)"
                description="우리는 '훈련 데이터'(답안지 포함)로 모델을 가르치지만, 평가는 '테스트 데이터'(새로운 문제)로 합니다. 훈련만 잘한다면 학습이 아니라 암기입니다!"
              />
              {result?.status === 'severe_overfitting' && (
                <ConceptCard 
                  type="warning"
                  title="치명적 오류: 과적합 (Overfitting)"
                  description="데이터 양이나 품질에 비해 모델이 너무 복잡합니다. 마치 우연한 노이즈에서 음모론을 찾아내는 것과 같습니다. 트리를 단순화하거나 깨끗한 데이터를 더 모으세요."
                />
              )}
               {result?.status === 'underfitting' && (
                <ConceptCard 
                  type="warning"
                  title="과소적합 감지됨 (Underfitting)"
                  description="모델이 너무 단순합니다. 달력만 보고 날씨를 예측하려는 것과 같습니다. 복잡도를 높여 더 많은 패턴을 포착하세요."
                />
              )}
            </div>

          </div>
        </main>
      )}
    </div>
  );
}

export default App;
