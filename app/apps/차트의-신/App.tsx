import React, { useState } from 'react';
import { ChartType, Mission, InsightResponse } from './types';
import { MISSIONS, CHART_INFO } from './constants';
import VizCanvas from './components/VizCanvas';
import DistortionDemo from './components/DistortionDemo';
import Gallery from './components/Gallery';
import { generateInsight, generateMission } from './services/geminiService';
import { BarChart, LineChart, PieChart, Cloud, ArrowRight, BrainCircuit, CheckCircle, XCircle, Sparkles, Loader2, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
  // Store dynamically generated missions here
  const [generatedMission, setGeneratedMission] = useState<Mission | null>(null);
  const [isGeneratingMission, setIsGeneratingMission] = useState(false);

  const [selectedChart, setSelectedChart] = useState<ChartType | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [aiInsight, setAiInsight] = useState<InsightResponse | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  // Determine which mission to display (Static or Generated)
  const activeMission = currentMissionIdx < MISSIONS.length 
    ? MISSIONS[currentMissionIdx] 
    : generatedMission;

  const handleChartSelect = async (type: ChartType) => {
    if (!activeMission) return;

    setSelectedChart(type);
    setAiInsight(null); // Reset previous insight
    
    // 1. Validation Logic
    const isSuccess = activeMission.correctCharts.includes(type);
    setIsCorrect(isSuccess);

    if (isSuccess) {
      setFeedback("완벽해요! 데이터의 특성을 정확히 파악했군요.");
      
      // 2. AI Insight Generation
      setIsLoadingInsight(true);
      const insight = await generateInsight(activeMission.dataContext, activeMission.data, type);
      setAiInsight(insight);
      setIsLoadingInsight(false);

    } else {
      // Educational feedback
      if (activeMission.bestChart === ChartType.PIE && type === ChartType.LINE) {
        setFeedback("음... 꺾은선 그래프는 '변화'를 보여줄 때 좋아요. 비율을 보기엔 적절하지 않아요.");
      } else if (activeMission.bestChart === ChartType.LINE && type === ChartType.PIE) {
        setFeedback("원 그래프는 전체 중 '비중'을 볼 때 써요. 시간의 흐름을 보기엔 어려워요.");
      } else if (activeMission.bestChart === ChartType.WORD_CLOUD) {
        setFeedback("텍스트 데이터는 빈도수를 글자 크기로 표현하는 방식이 더 효과적이에요.");
      } else {
        setFeedback("아쉽네요! 힌트를 읽고 다시 한번 골라볼까요?");
      }
    }
  };

  const nextMission = async () => {
    resetState();
    
    // If we have more static missions, go to next static
    if (currentMissionIdx < MISSIONS.length - 1) {
      setCurrentMissionIdx(prev => prev + 1);
    } 
    // If we are at the end of static missions (or already in generated mode), generate new one
    else {
      await refreshMission();
    }
  };

  const refreshMission = async () => {
    setIsGeneratingMission(true);
    resetState();
    
    // Force into infinite mode index if not already
    if (currentMissionIdx < MISSIONS.length) {
      setCurrentMissionIdx(MISSIONS.length);
    }
    
    const newMission = await generateMission();
    setGeneratedMission(newMission);
    setIsGeneratingMission(false);
  };

  const resetState = () => {
    setSelectedChart(null);
    setFeedback(null);
    setIsCorrect(null);
    setAiInsight(null);
  };

  const getIcon = (type: ChartType) => {
    switch (type) {
      case ChartType.BAR: return <BarChart className="w-6 h-6" />;
      case ChartType.LINE: return <LineChart className="w-6 h-6" />;
      case ChartType.PIE: return <PieChart className="w-6 h-6" />;
      case ChartType.WORD_CLOUD: return <Cloud className="w-6 h-6" />;
    }
  };

  // Loading Screen for New Mission
  if (isGeneratingMission || !activeMission) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-indigo-100 animate-pulse">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-indigo-600 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">새로운 의뢰인을 찾는 중...</h2>
          <p className="text-slate-500 mb-6">어떤 재미있는 데이터가 도착할까요? <br/>AI가 새로운 주제를 만들고 있습니다.</p>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-600 h-2 rounded-full w-1/2 animate-progress"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <BarChart size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">DataViz Master</h1>
          </div>
          <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
            {currentMissionIdx >= MISSIONS.length && (
              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">Infinite Mode</span>
            )}
            Mission {currentMissionIdx + 1}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Mission & Tools */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Mission Card */}
            <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
              <div className="bg-indigo-600 px-6 py-4 flex justify-between items-start">
                <div>
                  <h2 className="text-indigo-100 text-sm font-semibold uppercase tracking-wider mb-1">Current Mission</h2>
                  <p className="text-white text-xl font-bold">{activeMission.title}</p>
                </div>
                <button 
                  onClick={refreshMission}
                  className="group flex items-center gap-1 bg-indigo-500/50 hover:bg-indigo-500 text-indigo-100 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  title="다른 주제로 변경"
                >
                  <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                  주제 변경
                </button>
              </div>
              <div className="p-6">
                <div className="bg-indigo-50 p-4 rounded-lg mb-4 border border-indigo-100">
                  <p className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                    <span className="text-xl">📩</span> 클라이언트 요청
                  </p>
                  <p className="text-indigo-800 leading-relaxed">"{activeMission.clientRequest}"</p>
                </div>
                <p className="text-slate-600 mb-4 text-sm">{activeMission.description}</p>
                
                {/* Data Table Preview */}
                <div className="bg-slate-50 rounded border border-slate-200 p-3">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="py-1 text-slate-500">항목</th>
                        <th className="py-1 text-slate-500 text-right">값</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeMission.data.slice(0, 5).map((d, i) => (
                        <tr key={i}>
                          <td className="py-1 text-slate-700 font-medium">{d.name}</td>
                          <td className="py-1 text-slate-700 text-right">{d.value}</td>
                        </tr>
                      ))}
                      {activeMission.data.length > 5 && (
                        <tr><td colSpan={2} className="text-center text-xs text-slate-400 py-1">...</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Chart Selector */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-700 px-1">시각화 도구 선택</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(ChartType).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleChartSelect(type)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedChart === type
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md transform scale-105'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    {getIcon(type)}
                    <span className="mt-2 font-medium text-sm">{CHART_INFO[type].label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hint Box (Conditional) */}
            {selectedChart && !isCorrect && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 animate-fade-in">
                <p className="text-amber-800 text-sm font-medium">💡 힌트: {activeMission.hint}</p>
              </div>
            )}

          </div>

          {/* Right Column: Canvas & Feedback */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Viz Canvas Area */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-1 relative overflow-hidden min-h-[400px]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">
                    {selectedChart ? `${CHART_INFO[selectedChart].label} 미리보기` : '캔버스 대기중...'}
                  </h3>
                  {isCorrect !== null && (
                    <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${
                      isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {isCorrect ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                      {isCorrect ? '적합함' : '부적합'}
                    </span>
                  )}
                </div>

                <VizCanvas type={selectedChart} data={activeMission.data} />
                
                {/* Feedback Text */}
                {feedback && (
                  <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${
                    isCorrect ? 'bg-indigo-50 text-indigo-900' : 'bg-red-50 text-red-900'
                  }`}>
                    <div className="mt-1 flex-shrink-0">
                      {isCorrect ? '🎉' : '🤔'}
                    </div>
                    <p className="font-medium">{feedback}</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Insight Panel */}
            {isCorrect && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-xl animate-slide-up">
                <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit className="text-pink-400" />
                  <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                    AI 데이터 분석관
                  </h3>
                </div>
                
                {isLoadingInsight ? (
                  <div className="flex items-center gap-3 text-slate-300">
                    <Loader2 className="w-5 h-5 text-pink-400 animate-spin" />
                    데이터를 분석하고 있습니다...
                  </div>
                ) : aiInsight ? (
                  <div className="space-y-4">
                    <p className="text-lg leading-relaxed font-light">
                      "{aiInsight.analysis}"
                    </p>
                    <div className="flex justify-end">
                      <button 
                        onClick={nextMission}
                        className="bg-white text-indigo-900 hover:bg-indigo-50 px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        {currentMissionIdx < MISSIONS.length - 1 ? "다음 의뢰 받기" : "새로운 주제 받기 (무한 모드)"} <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Extra Features */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
               <DistortionDemo />
            </div>

          </div>
        </div>

        <Gallery />

      </main>
    </div>
  );
};

export default App;