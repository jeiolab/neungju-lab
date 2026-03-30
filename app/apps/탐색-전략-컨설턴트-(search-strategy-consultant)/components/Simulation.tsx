import React, { useState, useEffect, useMemo } from 'react';
import { Scenario, SimulationState, AlgorithmType, SimulationMetrics } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Play, RotateCcw, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';
import { getConsultantReport } from '../services/geminiService';

interface Props {
  scenario: Scenario;
  onComplete: (metrics: SimulationMetrics, algorithm: AlgorithmType) => void;
}

const Simulation: React.FC<Props> = ({ scenario, onComplete }) => {
  const [state, setState] = useState<SimulationState>({
    selectedScenarioId: scenario.id,
    dataSize: scenario.defaultDataSize,
    isSorted: scenario.defaultIsSorted,
    updateFreq: scenario.defaultUpdateFreq,
    searchFreq: scenario.defaultSearchFreq,
    selectedAlgorithm: null,
  });

  const [report, setReport] = useState<string>("");
  const [loadingReport, setLoadingReport] = useState(false);

  // Reset state when scenario changes
  useEffect(() => {
    setState({
      selectedScenarioId: scenario.id,
      dataSize: scenario.defaultDataSize,
      isSorted: scenario.defaultIsSorted,
      updateFreq: scenario.defaultUpdateFreq,
      searchFreq: scenario.defaultSearchFreq,
      selectedAlgorithm: null,
    });
    setReport("");
  }, [scenario]);

  const calculateMetrics = (algo: AlgorithmType): SimulationMetrics => {
    // Heuristic Logic for Trade-offs
    // Normalize inputs 0-100

    const N = state.dataSize; // 0-100
    const Updates = state.updateFreq; // 0-100
    const Searches = state.searchFreq; // 0-100

    let speedScore = 0;
    let prepCost = 0; // 0 is best, 100 is worst
    let maintenanceCost = 0; // 0 is best, 100 is worst

    if (algo === 'linear') {
      // Speed: O(N). If N is big, Speed is low.
      speedScore = 100 - N; 
      // Prep: None.
      prepCost = 0;
      // Maintenance: Very Low (Append).
      maintenanceCost = 5;
    } else if (algo === 'binary') {
      if (!state.isSorted) {
        // Impossible state practically, but if forced:
        speedScore = 0; // Can't work
        prepCost = 100; // Need to sort first!
        maintenanceCost = 0;
      } else {
        // Speed: O(log N). Very fast even if N is big.
        speedScore = 95;
        // Prep: Already sorted.
        prepCost = 0;
        // Maintenance: High. Inserting into sorted array is O(N).
        maintenanceCost = Updates; 
      }
    } else if (algo === 'sort_binary') {
        // Speed: Fast search.
        speedScore = 95;
        // Prep: Huge cost to sort initially.
        prepCost = Math.max(20, N * 0.8); 
        // Maintenance: High.
        maintenanceCost = Updates;
    }

    // Suitability Calculation
    // We want high Speed, Low Costs.
    // However, if searches are rare, Speed matters less.
    // If updates are rare, Maintenance matters less.
    
    const searchWeight = Math.max(0.1, Searches / 100);
    const updateWeight = Math.max(0.1, Updates / 100);

    const weightedSpeed = speedScore * searchWeight;
    const weightedMaintenance = (100 - maintenanceCost) * updateWeight; 
    const weightedPrep = (100 - prepCost);

    // Simplify for display: Suitability is an aggregate
    let totalSuitability = (weightedSpeed + weightedMaintenance + weightedPrep) / 3;
    
    // Penalize illegal moves
    if (algo === 'binary' && !state.isSorted) totalSuitability = 0;

    // Normalize to 0-100 range visually
    totalSuitability = Math.min(100, Math.max(0, totalSuitability * 1.5)); 

    return { speedScore, prepCost, maintenanceCost, totalSuitability };
  };

  const metrics = useMemo(() => {
    return {
      linear: calculateMetrics('linear'),
      binary: calculateMetrics('binary'),
      sort_binary: calculateMetrics('sort_binary'),
    };
  }, [state]);

  const handleSelect = async (algo: AlgorithmType) => {
    if (algo === 'binary' && !state.isSorted) {
      alert("데이터가 정렬되어 있지 않아 이진 탐색을 바로 사용할 수 없습니다! '정렬 후 이진 탐색'을 선택하거나 데이터를 정렬하세요.");
      return;
    }

    setState(prev => ({ ...prev, selectedAlgorithm: algo }));
    setLoadingReport(true);
    
    const aiResponse = await getConsultantReport(scenario, state, metrics);
    setReport(aiResponse);
    setLoadingReport(false);

    onComplete(metrics[algo], algo);
  };

  const chartData = [
    { subject: '속도(Speed)', A: metrics.linear.speedScore, B: state.isSorted ? metrics.binary.speedScore : 0, C: metrics.sort_binary.speedScore, fullMark: 100 },
    { subject: '준비효율(Prep)', A: 100 - metrics.linear.prepCost, B: state.isSorted ? 100 - metrics.binary.prepCost : 0, C: 100 - metrics.sort_binary.prepCost, fullMark: 100 },
    { subject: '유지효율(Maint)', A: 100 - metrics.linear.maintenanceCost, B: state.isSorted ? 100 - metrics.binary.maintenanceCost : 0, C: 100 - metrics.sort_binary.maintenanceCost, fullMark: 100 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-1 space-y-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          조건 설정
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">데이터 크기 (Data Size): {state.dataSize}</label>
          <input 
            type="range" min="1" max="100" value={state.dataSize} 
            onChange={(e) => setState({...state, dataSize: parseInt(e.target.value)})}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Small</span><span>Huge</span></div>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
          <span className="text-sm font-medium text-slate-700">현재 데이터 정렬 상태</span>
          <button 
            onClick={() => setState({...state, isSorted: !state.isSorted})}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${state.isSorted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {state.isSorted ? '정렬됨 (Sorted)' : '무작위 (Unsorted)'}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">업데이트 빈도 (추가/삭제): {state.updateFreq}</label>
          <input 
            type="range" min="0" max="100" value={state.updateFreq} 
            onChange={(e) => setState({...state, updateFreq: parseInt(e.target.value)})}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Static</span><span>Volatile</span></div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">검색 빈도: {state.searchFreq}</label>
          <input 
            type="range" min="0" max="100" value={state.searchFreq} 
            onChange={(e) => setState({...state, searchFreq: parseInt(e.target.value)})}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1"><span>Rare</span><span>Constant</span></div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">전략 선택</p>
            <button 
                onClick={() => handleSelect('linear')}
                className={`w-full p-3 rounded-lg text-left flex items-center justify-between transition-all ${state.selectedAlgorithm === 'linear' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}
            >
                <div>
                    <span className="block font-bold">순차 탐색 (Linear)</span>
                    <span className="text-xs opacity-80">그냥 처음부터 끝까지 찾기</span>
                </div>
                {state.selectedAlgorithm === 'linear' && <CheckCircle className="w-5 h-5" />}
            </button>
            <button 
                onClick={() => handleSelect('binary')}
                disabled={!state.isSorted}
                className={`w-full p-3 rounded-lg text-left flex items-center justify-between transition-all ${!state.isSorted ? 'opacity-50 cursor-not-allowed bg-slate-100' : state.selectedAlgorithm === 'binary' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}
            >
                <div>
                    <span className="block font-bold">이진 탐색 (Binary)</span>
                    <span className="text-xs opacity-80">반씩 쪼개며 찾기 (정렬 필수)</span>
                </div>
                {state.selectedAlgorithm === 'binary' && <CheckCircle className="w-5 h-5" />}
            </button>
            <button 
                onClick={() => handleSelect('sort_binary')}
                className={`w-full p-3 rounded-lg text-left flex items-center justify-between transition-all ${state.selectedAlgorithm === 'sort_binary' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}
            >
                <div>
                    <span className="block font-bold">정렬 후 이진 탐색</span>
                    <span className="text-xs opacity-80">먼저 정렬하고 이진 탐색 사용</span>
                </div>
                {state.selectedAlgorithm === 'sort_binary' && <CheckCircle className="w-5 h-5" />}
            </button>
        </div>
      </div>

      {/* Visualization */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-96 flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4">트레이드오프 레이더 (높을수록 좋음)</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="순차 탐색" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    <Radar name="이진 탐색 (정렬됨)" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                    <Radar name="정렬 후 이진" dataKey="C" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
                    <Legend />
                    <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-slate-400 mt-2">
                *준비효율/유지효율은 비용이 낮을수록 점수가 높게 표시됩니다.
            </p>
        </div>

        {/* AI Report */}
        <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <BookOpen className="w-24 h-24" />
            </div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <span className="bg-indigo-500 p-1 rounded">AI</span> 
                컨설턴트 리포트
            </h3>
            <div className="min-h-[100px] text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                {!state.selectedAlgorithm ? (
                    "왼쪽에서 전략을 선택하면 분석이 시작됩니다..."
                ) : loadingReport ? (
                    <div className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        데이터 분석 중...
                    </div>
                ) : (
                    report
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
