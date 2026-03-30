import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Package, 
  ArrowRight, 
  Timer, 
  RotateCcw, 
  TrendingUp, 
  Box,
  FileText,
  Search
} from 'lucide-react';
import { GoogleGenAI } from "@/lib/genai-browser-shim";
import { 
  COST_SORT_BASE, 
  COST_LINEAR_PER_ITEM, 
  COST_BINARY_PER_ITEM 
} from '../types';

// Icons for the grid
const PackageIcon: React.FC<{ active: boolean, found: boolean }> = ({ active, found }) => (
  <div className={`
    w-6 h-6 sm:w-8 sm:h-8 rounded flex items-center justify-center transition-all duration-300
    ${found ? 'bg-green-500 scale-110' : active ? 'bg-amber-400 scale-105' : 'bg-slate-200'}
  `}>
    <Package size={16} className={`${found || active ? 'text-white' : 'text-slate-400'}`} />
  </div>
);

const SimulationTab: React.FC = () => {
  // Config State
  const [packageCount, setPackageCount] = useState<number>(100);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  
  // Simulation State
  const [searchCount, setSearchCount] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [logs, setLogs] = useState<{ count: number; currentCost: number; unsortedCost: number; sortedCost: number }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeBoxIndex, setActiveBoxIndex] = useState<number | null>(null);
  
  // AI Report State
  const [reportLoading, setReportLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [managementScore, setManagementScore] = useState<number>(100);

  // Initialize logs
  useEffect(() => {
    resetSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageCount]);

  const resetSimulation = () => {
    setSearchCount(0);
    setTotalTime(0);
    setLogs([{ count: 0, currentCost: 0, unsortedCost: 0, sortedCost: COST_SORT_BASE }]);
    setIsSorted(false);
    setIsSearching(false);
    setActiveBoxIndex(null);
    setReport(null);
    setManagementScore(100);
  };

  const calculateCost = (count: number, sorted: boolean) => {
    if (sorted) {
      // One time Sort Cost + (Searches * Binary Cost)
      return COST_SORT_BASE + (count * COST_BINARY_PER_ITEM);
    } else {
      // Searches * Linear Cost
      return count * COST_LINEAR_PER_ITEM;
    }
  };

  const handleSortToggle = () => {
    if (searchCount > 0) {
      if(!window.confirm("정렬 상태를 변경하면 시뮬레이션이 초기화됩니다. 계속하시겠습니까?")) return;
      resetSimulation();
    }
    setIsSorted(!isSorted);
  };

  const executeSearch = (batchSize: number = 1) => {
    if (isSearching) return;
    setIsSearching(true);
    
    // Simulate visual "search" delay for UX
    let steps = 0;
    const maxSteps = 5;
    
    const interval = setInterval(() => {
      steps++;
      // Randomly highlight boxes to simulate "looking"
      setActiveBoxIndex(Math.floor(Math.random() * Math.min(20, packageCount)));

      if (steps >= maxSteps) {
        clearInterval(interval);
        setActiveBoxIndex(null); // Found it!
        finalizeSearch(batchSize);
        setIsSearching(false);
      }
    }, 100);
  };

  const finalizeSearch = (batchSize: number) => {
    const newCount = searchCount + batchSize;
    const newTotalTime = calculateCost(newCount, isSorted);
    
    // Calculate comparison data for the chart
    const unsortedCost = calculateCost(newCount, false);
    const sortedCost = calculateCost(newCount, true);

    setSearchCount(newCount);
    setTotalTime(newTotalTime);
    
    setLogs(prev => [
      ...prev, 
      { 
        count: newCount, 
        currentCost: newTotalTime,
        unsortedCost: unsortedCost,
        sortedCost: sortedCost
      }
    ]);

    // Simple gamification logic
    // If sorted and count is high, score up. If unsorted and count is high, score down.
    if (newCount > 50 && !isSorted) {
      setManagementScore(prev => Math.max(0, prev - 5));
    } else if (newCount > 50 && isSorted) {
      setManagementScore(prev => Math.min(100, prev + 2));
    }
  };

  const generateWeeklyReport = async () => {
    if (!(process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "")) {
      alert("API Key is missing.");
      return;
    }

    setReportLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "") });
      
      const prompt = `
        당신은 물류 센터 수석 컨설턴트입니다. 아래 시뮬레이션 데이터를 바탕으로 관리자(사용자)에게 짧고 전문적인 주간 리포트를 작성해주세요.
        
        [데이터]
        - 총 택배 수량: ${packageCount}개
        - 최종 상태: ${isSorted ? '정렬됨 (비용 지불함)' : '정렬 안 됨 (순차 탐색)'}
        - 총 검색 횟수: ${searchCount}회
        - 총 소요 시간 비용: ${totalTime}ms
        
        [가이드라인]
        1. 효율성 평가: 현재 검색 횟수에서 올바른 전략(정렬 vs 비정렬)을 선택했는지 분석하세요. (분기점: 약 50회 검색)
        2. 조언: 앞으로 검색이 더 늘어날 경우 혹은 줄어들 경우 어떻게 해야 할지 조언하세요.
        3. 어조: 정중하지만 핵심을 찌르는 비즈니스 톤. 한국어로 작성.
        4. 길이: 3문장 내외로 요약.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setReport(response.text || null);
    } catch (error) {
      console.error("Error generating report:", error);
      setReport("리포트 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Left Panel: Controls & Visuals */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Settings Card */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Box className="mr-2 text-amber-600" /> 창고 설정
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">택배 데이터 양 (N)</label>
              <div className="flex space-x-2">
                {[10, 100, 1000].map(val => (
                  <button
                    key={val}
                    onClick={() => {
                      if (searchCount === 0 || window.confirm("설정을 바꾸면 리셋됩니다.")) {
                        setPackageCount(val);
                      }
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
                      packageCount === val 
                        ? 'bg-amber-100 border-amber-500 text-amber-800' 
                        : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {val}개
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-600">데이터 정렬 여부</label>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">비용: {COST_SORT_BASE}ms</span>
              </div>
              <button
                onClick={handleSortToggle}
                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all border-2 ${
                  isSorted 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400'
                }`}
              >
                {isSorted ? (
                  <><span>✅ 정렬 완료 (이진 탐색 준비됨)</span></>
                ) : (
                  <><span>⬜ 정렬 안 됨 (순차 탐색 모드)</span></>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white p-5 rounded-xl border border-amber-100 shadow-md">
           <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Search className="mr-2 text-amber-600" /> 검색 작업 수행
          </h2>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => executeSearch(1)}
              disabled={isSearching}
              className="bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-lg font-bold shadow-sm active:transform active:scale-95 transition-all disabled:opacity-50 flex flex-col items-center justify-center"
            >
              <span>1건 찾기</span>
              <span className="text-xs font-normal opacity-80">고객 1명 방문</span>
            </button>
            <button
              onClick={() => executeSearch(10)}
              disabled={isSearching}
              className="bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-lg font-bold shadow-sm active:transform active:scale-95 transition-all disabled:opacity-50 flex flex-col items-center justify-center"
            >
              <span>10건 찾기</span>
              <span className="text-xs font-normal opacity-80">주문 폭주</span>
            </button>
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <div className="text-center">
              <p className="text-xs text-slate-500">누적 검색</p>
              <p className="text-2xl font-black text-slate-800">{searchCount}<span className="text-sm font-normal text-slate-500"> 회</span></p>
            </div>
             <div className="text-center">
              <p className="text-xs text-slate-500">총 소요 시간(비용)</p>
              <p className={`text-2xl font-black ${totalTime > 2000 ? 'text-red-500' : 'text-slate-800'}`}>
                {totalTime}<span className="text-sm font-normal text-slate-500"> ms</span>
              </p>
            </div>
            <button 
              onClick={resetSimulation}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              title="리셋"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* Visualizer (Mini) */}
        <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 overflow-hidden relative min-h-[120px]">
          <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Warehouse Visualization (First 20 Items)</p>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {Array.from({ length: Math.min(20, packageCount) }).map((_, i) => (
              <PackageIcon 
                key={i} 
                active={activeBoxIndex === i} 
                found={false}
              />
            ))}
            {packageCount > 20 && <span className="text-slate-400 text-xs self-center">... +{packageCount - 20} more</span>}
          </div>
          {isSearching && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
              <div className="bg-white px-4 py-2 rounded-full shadow-lg font-bold text-amber-600 animate-pulse">
                찾는 중...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Analytics & Report */}
      <div className="lg:col-span-7 space-y-6 flex flex-col">
        
        {/* Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-grow min-h-[300px]">
          <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center">
            <TrendingUp className="mr-2 text-blue-600" /> 효율성 분석 그래프
          </h2>
          <p className="text-sm text-slate-500 mb-6">검색 횟수가 늘어날수록 어떤 전략이 유리한지 확인하세요.</p>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="count" 
                  label={{ value: '검색 횟수', position: 'insideBottomRight', offset: -5 }} 
                  fontSize={12}
                />
                <YAxis 
                  label={{ value: '총 소요시간 (ms)', angle: -90, position: 'insideLeft' }} 
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="unsortedCost" 
                  name="정렬 안 함 (순차 탐색)" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="sortedCost" 
                  name="정렬 함 (이진 탐색)" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={false}
                />
                {/* Current Path */}
                 <Line 
                  type="stepAfter" 
                  dataKey="currentCost" 
                  name="내 현재 비용" 
                  stroke="#d97706" 
                  strokeWidth={4}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Report Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-5 rounded-xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-bold flex items-center text-white">
                  <FileText className="mr-2 text-amber-400" /> 주간 리포트
                </h2>
                <p className="text-slate-400 text-sm">경영 점수: <span className={`font-bold ${managementScore > 80 ? 'text-green-400' : 'text-amber-400'}`}>{managementScore}점</span></p>
              </div>
              <button 
                onClick={generateWeeklyReport}
                disabled={reportLoading || searchCount === 0}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 rounded-lg text-sm font-bold transition-colors shadow-lg"
              >
                {reportLoading ? '작성 중...' : '리포트 생성'}
              </button>
            </div>
            
            <div className="bg-white/10 rounded-lg p-4 min-h-[100px] text-sm leading-relaxed backdrop-blur-sm border border-white/10">
              {report ? (
                <div className="whitespace-pre-wrap animate-fade-in">{report}</div>
              ) : (
                <div className="text-slate-400 italic text-center py-4">
                  {searchCount === 0 ? "시뮬레이션을 시작하면 리포트를 받을 수 있습니다." : "컨설턴트에게 리포트를 요청해보세요."}
                </div>
              )}
            </div>
          </div>
          
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        </div>

      </div>
    </div>
  );
};

export default SimulationTab;