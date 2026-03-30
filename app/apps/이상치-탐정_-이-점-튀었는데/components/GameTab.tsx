import React, { useState, useEffect, useCallback } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, ZAxis } from 'recharts';
import { Play, RotateCcw, Award, Settings2, Pause } from 'lucide-react';
import { DatasetType, DistanceMetric, DataPoint } from '../types';

interface Props {
  unlockBadge: (badge: string) => void;
}

const DATA_CONFIG = {
  [DatasetType.STUDY_SLEEP]: {
    name: '공부시간 vs 수면시간',
    xLabel: '공부 시간(시간)',
    yLabel: '수면 시간(시간)',
    xDomain: [0, 14],
    yDomain: [0, 12],
    correlation: -0.8 // Negative correlation
  },
  [DatasetType.LATENESS_DISTANCE]: {
    name: '등교 거리 vs 지각 횟수',
    xLabel: '등교 거리(km)',
    yLabel: '지각 횟수(회)',
    xDomain: [0, 20],
    yDomain: [0, 10],
    correlation: 0.6 // Positive correlation
  },
  [DatasetType.CO2_WINDOW]: {
    name: '창문 열림 vs 교실 CO₂',
    xLabel: '창문 개방(분/시)',
    yLabel: 'CO₂ 농도(ppm)',
    xDomain: [0, 60],
    yDomain: [400, 2000],
    correlation: -0.9 // Strong negative
  }
};

export default function GameTab({ unlockBadge }: Props) {
  const [datasetType, setDatasetType] = useState<DatasetType>(DatasetType.STUDY_SLEEP);
  const [threshold, setThreshold] = useState<number>(2.0); // Standard Deviations
  const [distanceMetric, setDistanceMetric] = useState<DistanceMetric>(DistanceMetric.EUCLIDEAN);
  
  const [data, setData] = useState<DataPoint[]>([]);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<{title: string, msg: string, type: 'success' | 'error' | 'info'} | null>(null);

  const generateData = useCallback(() => {
    const config = DATA_CONFIG[datasetType];
    const points: DataPoint[] = [];
    const count = Math.floor(Math.random() * 9) + 12; // 12-20 points
    
    // Generate correlated data
    for (let i = 0; i < count; i++) {
        // Simple linear generative model with noise
        let xNorm = Math.random(); 
        let error = (Math.random() - 0.5) * 0.5; // Noise
        let yNorm = xNorm * config.correlation + (config.correlation < 0 ? 1 : 0) + error;

        // Add some random outliers explicitly
        if (Math.random() < 0.15) {
            xNorm = Math.random();
            yNorm = Math.random(); // Complete random
        }

        // Clamp to 0-1
        yNorm = Math.max(0, Math.min(1, yNorm));

        // Scale to domain
        const x = xNorm * (config.xDomain[1] - config.xDomain[0]) + config.xDomain[0];
        const y = yNorm * (config.yDomain[1] - config.yDomain[0]) + config.yDomain[0];

        points.push({
            id: i,
            x: Number(x.toFixed(1)),
            y: Number(y.toFixed(0)),
            isAnomaly: false, // Calculated below
            userSelected: false,
            distance: 0
        });
    }

    // Calculate Statistics
    const meanX = points.reduce((sum, p) => sum + p.x, 0) / count;
    const meanY = points.reduce((sum, p) => sum + p.y, 0) / count;
    
    // Standard Deviations
    const sdX = Math.sqrt(points.reduce((sum, p) => sum + Math.pow(p.x - meanX, 2), 0) / count);
    const sdY = Math.sqrt(points.reduce((sum, p) => sum + Math.pow(p.y - meanY, 2), 0) / count);

    // Calculate Distance and determine Anomaly based on CURRENT threshold
    const processedPoints = points.map(p => {
        // Z-score like normalization for distance calculation
        const zX = (p.x - meanX) / (sdX || 1);
        const zY = (p.y - meanY) / (sdY || 1);
        
        let dist = 0;
        if (distanceMetric === DistanceMetric.EUCLIDEAN) {
            dist = Math.sqrt(zX * zX + zY * zY);
        } else {
            dist = Math.abs(zX) + Math.abs(zY);
        }

        return {
            ...p,
            distance: dist,
            isAnomaly: dist > threshold
        };
    });

    setData(processedPoints);
  }, [datasetType, threshold, distanceMetric]);

  // Timer
  useEffect(() => {
    let timer: number;
    if (isPlaying && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endRound(false);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // Initial load
  useEffect(() => {
    generateData();
  }, [generateData]);

  const startRound = () => {
    setRound(prev => prev < 10 ? prev + 1 : 1);
    if (round === 10) setScore(0); // Reset if restarting
    setTimeLeft(30);
    setIsPlaying(true);
    setFeedback(null);
    generateData();
  };

  const endRound = (manual: boolean) => {
    setIsPlaying(false);
    // Auto-reveal logic or just stop
    if (!manual) {
        setFeedback({
            title: "⏰ 시간 종료!",
            msg: "제한 시간이 다 되었습니다. 정확도 모드로 전환됩니다.",
            type: 'info'
        });
    }
  };

  const handlePointClick = (point: DataPoint) => {
    if (!isPlaying) {
        if (!feedback) {
            setFeedback({
                title: "⚠️ 게임 시작 필요",
                msg: "'라운드 시작' 버튼을 눌러주세요.",
                type: 'info'
            });
        }
        return;
    }

    if (point.userSelected) return; // Already clicked

    // Update selection visual
    const newData = data.map(p => p.id === point.id ? { ...p, userSelected: true } : p);
    setData(newData);

    // Check Logic
    if (point.isAnomaly) {
      // Correct!
      const bonus = combo * 10;
      setScore(prev => prev + 100 + bonus);
      setCombo(prev => prev + 1);
      setFeedback({
        title: "🎯 검거 성공!",
        msg: `임계값(${threshold}σ)을 벗어난 이상치를 찾았습니다! (+${100+bonus}점)`,
        type: 'success'
      });
      
      // Badges
      if (combo >= 2) unlockBadge("연속 정답자");
      if (datasetType === DatasetType.CO2_WINDOW) unlockBadge("환경 데이터 수호자");

    } else {
      // Wrong
      setCombo(0);
      setFeedback({
        title: "❌ 오판입니다!",
        msg: `이 점은 중심에서 거리가 ${point.distance.toFixed(2)}σ로, 현재 기준(${threshold}σ) 이내입니다.`,
        type: 'error'
      });
      
      // Helpful Hint logic
      if (point.distance > threshold * 0.8) {
         // Close call
         setFeedback(prev => ({ ...prev!, msg: prev!.msg + " (하지만 아주 아슬아슬했어요!)" }));
      } else {
         unlockBadge("실수는 성공의 어머니");
      }
    }

    // Check if all anomalies are found
    const remainingAnomalies = newData.filter(p => p.isAnomaly && !p.userSelected).length;
    if (remainingAnomalies === 0) {
        // Round Clear
        setIsPlaying(false);
        setFeedback({
            title: "🎉 라운드 클리어!",
            msg: "모든 이상치를 찾아냈습니다! 다음 라운드로 도전하세요.",
            type: 'success'
        });
    }
  };

  const config = DATA_CONFIG[datasetType];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left: Game Stats */}
        <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700">
           <div className="flex flex-col">
             <span className="text-xs text-slate-400">ROUND</span>
             <span className="text-xl font-mono font-bold text-white">{round} / 10</span>
           </div>
           <div className="flex flex-col items-center">
             <span className="text-xs text-slate-400">SCORE</span>
             <span className="text-2xl font-mono font-bold text-indigo-400">{score}</span>
           </div>
           <div className={`flex flex-col items-end ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-200'}`}>
             <span className="text-xs text-slate-400">TIME</span>
             <span className="text-xl font-mono font-bold">{timeLeft}s</span>
           </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
            {!isPlaying ? (
                <button 
                  onClick={startRound}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
                >
                  <Play size={20} fill="currentColor" /> {round > 1 ? '다음 라운드' : '수사 시작'}
                </button>
            ) : (
                 <button 
                  onClick={() => endRound(true)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 p-3 rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <Pause size={20} /> 일시 정지
                </button>
            )}
            <button 
                onClick={() => { setScore(0); setRound(1); setIsPlaying(false); generateData(); }}
                className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-400 hover:text-white"
                title="리셋"
            >
                <RotateCcw size={20} />
            </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-xl relative min-h-[400px]">
          <div className="absolute top-4 right-4 z-10 bg-slate-900/80 px-3 py-1 rounded-full text-xs text-slate-300 border border-slate-700 backdrop-blur-sm">
             {config.name}
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="x" 
                unit="" 
                domain={config.xDomain} 
                stroke="#94a3b8" 
                tick={{fill: '#94a3b8'}}
                label={{ value: config.xLabel, position: 'bottom', fill: '#94a3b8', offset: 0 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="y" 
                unit="" 
                domain={config.yDomain} 
                stroke="#94a3b8" 
                tick={{fill: '#94a3b8'}}
                label={{ value: config.yLabel, angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
              />
              <ZAxis range={[100, 100]} /> 
              {/* Tooltip disabled for game feel, or use custom */}
              
              <Scatter name="Points" data={data} onClick={(p: any) => handlePointClick(p.payload)}>
                {data.map((entry, index) => {
                    // Logic for coloring points
                    let fill = '#64748b'; // Default Slate-500
                    
                    if (entry.userSelected) {
                        if (entry.isAnomaly) fill = '#ef4444'; // Red-500 (Correct Anomaly)
                        else fill = '#fbbf24'; // Amber-400 (Mistake)
                    } else if (!isPlaying && entry.isAnomaly) {
                        fill = '#ef4444'; // Reveal missed anomalies after game
                        // Make them pulse? Not easy in Recharts directly without custom shape
                    }
                    
                    return <Cell key={`cell-${index}`} fill={fill} stroke="white" strokeWidth={2} cursor="pointer" />;
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>

           {/* Feedback Overlay */}
           {feedback && (
             <div className={`absolute bottom-4 left-4 right-4 p-4 rounded-lg border shadow-lg backdrop-blur-md animate-slide-up flex flex-col gap-1
                ${feedback.type === 'success' ? 'bg-green-900/80 border-green-500 text-green-100' : 
                  feedback.type === 'error' ? 'bg-red-900/80 border-red-500 text-red-100' : 
                  'bg-indigo-900/80 border-indigo-500 text-indigo-100'}`}>
                <div className="font-bold flex items-center gap-2">
                    {feedback.type === 'success' ? <Award size={18}/> : <Settings2 size={18}/>}
                    {feedback.title}
                </div>
                <div className="text-sm opacity-90">{feedback.msg}</div>
             </div>
           )}
        </div>

        {/* Settings Panel */}
        <div className="space-y-4">
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <Settings2 size={18} /> 탐지 도구 설정
                </h3>
                
                <div className="space-y-6">
                    {/* Dataset Selector */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">사건 파일 (데이터셋)</label>
                        <select 
                            value={datasetType}
                            onChange={(e) => {
                                setDatasetType(e.target.value as DatasetType);
                                if(isPlaying) endRound(true);
                            }}
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value={DatasetType.STUDY_SLEEP}>📚 공부 vs 수면 (역상관)</option>
                            <option value={DatasetType.LATENESS_DISTANCE}>🚌 거리 vs 지각 (양의상관)</option>
                            <option value={DatasetType.CO2_WINDOW}>🪟 환기 vs CO₂ (역상관)</option>
                        </select>
                    </div>

                    {/* Threshold Slider */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">이상치 기준 (표준편차 배수)</label>
                            <span className="text-indigo-400 font-mono font-bold bg-indigo-900/50 px-2 py-0.5 rounded text-xs">{threshold.toFixed(1)}σ</span>
                        </div>
                        <input 
                            type="range" 
                            min="1.0" 
                            max="3.0" 
                            step="0.1" 
                            value={threshold}
                            onChange={(e) => {
                                setThreshold(parseFloat(e.target.value));
                                // Live update logic is handled by useEffect
                            }}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                            <span>느슨함(1.0)</span>
                            <span>엄격함(3.0)</span>
                        </div>
                    </div>

                    {/* Distance Metric Toggle */}
                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">거리 측정 방식</label>
                        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-600">
                            <button 
                                onClick={() => setDistanceMetric(DistanceMetric.EUCLIDEAN)}
                                className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${distanceMetric === DistanceMetric.EUCLIDEAN ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                유클리드 (직선)
                            </button>
                            <button 
                                onClick={() => setDistanceMetric(DistanceMetric.MANHATTAN)}
                                className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${distanceMetric === DistanceMetric.MANHATTAN ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                맨해튼 (격자)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mini Legend */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-500 border border-white"></span>
                    <span>미확인 데이터</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 border border-white"></span>
                    <span>확인된 이상치 (성공)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400 border border-white"></span>
                    <span>잘못된 판단 (실패)</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
