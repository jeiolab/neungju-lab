import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart, ReferenceLine } from 'recharts';
import { Play, RotateCcw, Plus, Trash2, Trophy, Info } from 'lucide-react';
import { DataPoint } from '../types';

// 초기 데이터
const INITIAL_DATA: DataPoint[] = [
  { id: 1, x: 1, y: 20 },
  { id: 2, x: 2, y: 35 },
  { id: 3, x: 3, y: 45 },
  { id: 4, x: 5, y: 60 },
  { id: 5, x: 7, y: 85 },
  { id: 6, x: 8, y: 80 },
  { id: 7, x: 9, y: 95 },
];

const SimulationTab: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>(INITIAL_DATA);
  const [slope, setSlope] = useState<number>(1);
  const [intercept, setIntercept] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [isBestLineShown, setIsBestLineShown] = useState(false);

  // 로컬 스토리지에서 최고 기록 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('linear-regression-best-score');
    if (saved) setBestScore(parseFloat(saved));
  }, []);

  // 최소 제곱법으로 최적의 a, b 계산
  const optimalParams = useMemo(() => {
    const n = data.length;
    if (n === 0) return { a: 0, b: 0 };

    const sumX = data.reduce((acc, p) => acc + p.x, 0);
    const sumY = data.reduce((acc, p) => acc + p.y, 0);
    const sumXY = data.reduce((acc, p) => acc + p.x * p.y, 0);
    const sumX2 = data.reduce((acc, p) => acc + p.x * p.x, 0);

    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) return { a: 0, b: 0 };

    const a = (n * sumXY - sumX * sumY) / denominator;
    const b = (sumY - a * sumX) / n;

    return { a, b };
  }, [data]);

  // MSE (평균 제곱 오차) 계산
  const currentMSE = useMemo(() => {
    if (data.length === 0) return 0;
    const sumSquaredErrors = data.reduce((acc, p) => {
      const predicted = slope * p.x + intercept;
      return acc + Math.pow(p.y - predicted, 2);
    }, 0);
    return sumSquaredErrors / data.length;
  }, [data, slope, intercept]);

  // 차트용 라인 데이터 생성 (x=0 ~ x=12)
  const lineData = useMemo(() => {
    return [
      { x: 0, predictedY: intercept },
      { x: 12, predictedY: slope * 12 + intercept },
    ];
  }, [slope, intercept]);

  const optimalLineData = useMemo(() => {
    return [
      { x: 0, optimalY: optimalParams.b },
      { x: 12, optimalY: optimalParams.a * 12 + optimalParams.b },
    ];
  }, [optimalParams]);

  // 핸들러
  const handleSlopeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlope(parseFloat(e.target.value));
    setIsBestLineShown(false);
  };

  const handleInterceptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIntercept(parseFloat(e.target.value));
    setIsBestLineShown(false);
  };

  const handleShowAnswer = () => {
    setSlope(Number(optimalParams.a.toFixed(2)));
    setIntercept(Number(optimalParams.b.toFixed(2)));
    setIsBestLineShown(true);
  };

  const handleReset = () => {
    setData(INITIAL_DATA);
    setSlope(1);
    setIntercept(0);
    setIsBestLineShown(false);
  };

  const handleAddPoint = () => {
    const newX = Math.floor(Math.random() * 10) + 1;
    const newY = Math.floor(Math.random() * 80) + 10;
    const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
    setData([...data, { id: newId, x: newX, y: newY }]);
  };

  const handleRemovePoint = () => {
    if (data.length > 0) {
      setData(data.slice(0, -1));
    }
  };

  // 최고 기록 갱신 (사용자가 직접 조작했을 때만, 정답 보기 제외)
  useEffect(() => {
    if (!isBestLineShown && data.length > 2) {
      // MSE가 작을수록 좋음. 
      // 간단한 게임화를 위해: 정답과의 근접도를 점수화하거나 단순히 최저 MSE 저장
      // 여기서는 최저 MSE 저장
      if (bestScore === null || currentMSE < bestScore) {
        setBestScore(currentMSE);
        localStorage.setItem('linear-regression-best-score', currentMSE.toFixed(2));
      }
    }
  }, [currentMSE, isBestLineShown, data.length, bestScore]);

  // MSE 상태에 따른 색상
  const getScoreColor = (mse: number) => {
    if (mse < 50) return 'text-green-600';
    if (mse < 200) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-full">
      {/* 왼쪽: 컨트롤 패널 */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            미션: 오차를 줄여라!
          </h3>
          
          <div className="space-y-4">
             <div className="bg-gray-50 p-4 rounded-xl text-center">
              <span className="text-gray-500 text-sm uppercase font-bold tracking-wider">현재 오차 (MSE)</span>
              <div className={`text-4xl font-black transition-colors duration-300 ${getScoreColor(currentMSE)}`}>
                {currentMSE.toFixed(1)}
              </div>
              <p className="text-xs text-gray-400 mt-1">낮을수록 정확합니다!</p>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 px-2">
               <span>내 최고 기록 (최소 오차)</span>
               <span className="font-bold text-indigo-600">{bestScore !== null ? bestScore.toFixed(1) : '-'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div>
            <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>기울기 (a): {slope}</span>
            </label>
            <input
              type="range"
              min="-5"
              max="15"
              step="0.1"
              value={slope}
              onChange={handleSlopeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div>
            <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>y절편 (b): {intercept}</span>
            </label>
            <input
              type="range"
              min="-20"
              max="100"
              step="1"
              value={intercept}
              onChange={handleInterceptChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
             <div className="flex gap-2">
                <button 
                  onClick={handleShowAnswer}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" /> 정답 보기
                </button>
                <button 
                  onClick={handleReset}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 py-2.5 px-4 rounded-lg transition"
                  title="초기화"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
             </div>
             <p className="text-xs text-gray-400 text-center">정답 보기 시 기록은 갱신되지 않습니다.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
           <h4 className="text-sm font-bold text-gray-700 mb-3">데이터 조작</h4>
           <div className="flex gap-2">
             <button 
                onClick={handleAddPoint}
                className="flex-1 border border-dashed border-gray-300 hover:border-indigo-500 hover:text-indigo-600 text-gray-500 py-2 rounded-lg text-sm transition flex items-center justify-center gap-1"
             >
                <Plus className="w-4 h-4" /> 추가
             </button>
             <button 
                onClick={handleRemovePoint}
                className="flex-1 border border-dashed border-gray-300 hover:border-red-500 hover:text-red-600 text-gray-500 py-2 rounded-lg text-sm transition flex items-center justify-center gap-1"
             >
                <Trash2 className="w-4 h-4" /> 삭제
             </button>
           </div>
        </div>
      </div>

      {/* 오른쪽: 차트 */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="flex justify-between items-center mb-6">
           <h2 className="font-bold text-gray-800 text-lg">공부 시간(x) vs 성적(y)</h2>
           <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                 <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                 <span className="text-gray-600">내 직선</span>
              </div>
              <div className="flex items-center gap-1">
                 <div className="w-3 h-3 rounded-full bg-indigo-400 opacity-50"></div>
                 <span className="text-gray-600">데이터 점</span>
              </div>
           </div>
        </div>
        
        <div className="flex-1 min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="x" 
                type="number" 
                domain={[0, 12]} 
                label={{ value: '공부 시간 (시간)', position: 'bottom', offset: 0 }} 
                allowDataOverflow={false}
              />
              <YAxis 
                dataKey="y" 
                type="number" 
                domain={[0, 100]} 
                label={{ value: '시험 성적 (점)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              
              {/* 사용자 조작 라인 */}
              <Line 
                data={lineData} 
                dataKey="predictedY" 
                stroke="#4f46e5" 
                strokeWidth={3} 
                dot={false} 
                activeDot={false}
                isAnimationActive={false}
              />

              {/* 정답 라인 (숨김 처리 가능) */}
              {isBestLineShown && (
                 <Line 
                  data={optimalLineData} 
                  dataKey="optimalY" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false} 
                  activeDot={false}
                />
              )}

              {/* 데이터 산점도 */}
              <Scatter name="Students" data={data} fill="#6366f1" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg flex gap-3 items-start">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
               <p className="font-semibold mb-1">탐정의 팁:</p>
               <p>점들의 한가운데를 관통해야 오차가 줄어듭니다. 직선이 모든 점과의 거리 합을 최소화할 때까지 슬라이더를 움직여보세요!</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;