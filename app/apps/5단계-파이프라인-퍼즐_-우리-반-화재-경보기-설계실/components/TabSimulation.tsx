import React, { useState, useMemo, useEffect } from 'react';
import { PipelineBlock, UserProgress } from '../types';
import { PUZZLE_BLOCKS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Play, RotateCcw, ArrowDown, ArrowUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  userProgress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
}

const TabSimulation: React.FC<Props> = ({ userProgress, onUpdateProgress }) => {
  // Puzzle State
  const [pipeline, setPipeline] = useState<PipelineBlock[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<PipelineBlock[]>(PUZZLE_BLOCKS);
  const [puzzleFeedback, setPuzzleFeedback] = useState<string>("");
  const [isPipelineValid, setIsPipelineValid] = useState(false);

  // Simulation State
  const [threshold, setThreshold] = useState(50);
  const [simData, setSimData] = useState<{ time: number; temp: number; alarm: boolean }[]>([]);
  const [simStats, setSimStats] = useState({ trueAlarms: 0, falseAlarms: 0, missedAlarms: 0 });
  
  // Generate Fake Data
  const generateData = () => {
    const data = [];
    let temp = 25;
    for (let i = 0; i <= 60; i++) {
      // Create some "fire" spikes and some "noise" spikes
      if (i > 20 && i < 25) temp += 10; // Fire starts
      else if (i > 25 && i < 35) temp += (Math.random() * 5); // Burning
      else if (i > 35 && i < 40) temp -= 8; // Extinguishing
      else temp = 25 + (Math.random() * 20 - 5); // Noise around 25 with spikes up to 45
      
      data.push({ time: i, temp: Math.round(temp), alarm: false });
    }
    return data;
  };

  const baseData = useMemo(() => generateData(), []);

  useEffect(() => {
    // Recalculate simulation result when threshold changes
    let falseA = 0;
    let trueA = 0;
    let missedA = 0;

    const processed = baseData.map(d => {
      const isDangerous = d.temp >= 50; // True Danger definition fixed by physics/scenario
      const isAlarm = d.temp >= threshold; // System logic
      
      if (isAlarm && !isDangerous) falseA++;
      if (isAlarm && isDangerous) trueA++;
      if (!isAlarm && isDangerous) missedA++;

      return { ...d, alarm: isAlarm };
    });

    setSimData(processed);
    setSimStats({ trueAlarms: trueA, falseAlarms: falseA, missedAlarms: missedA });

    // Badge Check: Zero False Alarms but MUST catch the fire (True Alarm > 0)
    if (falseA === 0 && trueA > 0 && !userProgress.badges.find(b => b.id === 'b_zero')?.unlocked) {
       // Ideally trigger badge unlock here, but for React safety, we'll prompt user to 'Save Result'
    }

  }, [threshold, baseData, userProgress.badges]);

  // Puzzle Logic
  const addToPipeline = (block: PipelineBlock) => {
    setPipeline([...pipeline, block]);
    setAvailableBlocks(availableBlocks.filter(b => b.id !== block.id));
    setPuzzleFeedback("");
    setIsPipelineValid(false);
  };

  const removeFromPipeline = (block: PipelineBlock) => {
    setAvailableBlocks([...availableBlocks, block]);
    setPipeline(pipeline.filter(b => b.id !== block.id));
    setPuzzleFeedback("");
    setIsPipelineValid(false);
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const newPipeline = [...pipeline];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newPipeline.length) return;
    
    [newPipeline[index], newPipeline[targetIndex]] = [newPipeline[targetIndex], newPipeline[index]];
    setPipeline(newPipeline);
    setIsPipelineValid(false);
  };

  const validatePipeline = () => {
    // Order: Sensor -> Send -> Recv -> Process -> Output
    const ids = pipeline.map(b => b.type);
    const correctOrder = ['sensor', 'comm_send', 'comm_recv', 'process', 'output'];
    
    let isValid = true;
    if (ids.length !== 5) isValid = false;
    else {
        for(let i=0; i<5; i++) {
            if (ids[i] !== correctOrder[i]) isValid = false;
        }
    }

    if (isValid) {
      setPuzzleFeedback("완벽합니다! 논리적인 순서로 설계되었습니다. (+100 XP)");
      setIsPipelineValid(true);
      if (!userProgress.badges.find(b => b.id === 'b_master')?.unlocked) {
        const newBadges = userProgress.badges.map(b => b.id === 'b_master' ? {...b, unlocked: true} : b);
        onUpdateProgress({ ...userProgress, xp: userProgress.xp + 100, badges: newBadges });
      } else {
        onUpdateProgress({ ...userProgress, xp: userProgress.xp + 10 });
      }
    } else {
      setPuzzleFeedback("순서가 논리적이지 않습니다. 데이터가 어디서 시작해서 어디로 가는지 생각해보세요.");
      onUpdateProgress({ ...userProgress, xp: Math.max(0, userProgress.xp - 5) }); // Penalty
    }
  };

  return (
    <div className="space-y-8">
      {/* Puzzle Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-blue-500">1단계</span> 파이프라인 조립
        </h2>
        <p className="text-gray-600 mb-4 text-sm">
          아래 부품을 클릭하여 오른쪽 슬롯에 올바른 순서대로 배치하세요. <br/>
          <span className="text-xs text-gray-400">힌트: 데이터는 물리량 측정부터 시작해 액추에이터 동작으로 끝납니다.</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Source */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[300px]">
            <h3 className="font-semibold text-gray-500 mb-3 text-sm">사용 가능한 부품</h3>
            <div className="space-y-2">
              {availableBlocks.map(block => (
                <button
                  key={block.id}
                  onClick={() => addToPipeline(block)}
                  className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded shadow-sm hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <span className="font-medium text-gray-700">{block.label}</span>
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">+</div>
                </button>
              ))}
              {availableBlocks.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-10">모든 부품을 사용했습니다.</div>
              )}
            </div>
          </div>

          {/* Target */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 min-h-[300px]">
            <h3 className="font-semibold text-blue-800 mb-3 text-sm">나의 설계도 (위에서 아래로 흐름)</h3>
            <div className="space-y-2">
              {pipeline.map((block, idx) => (
                <div key={block.id} className="relative group flex items-center gap-2">
                   <div className="flex flex-col gap-1">
                      {idx > 0 && <button onClick={() => moveBlock(idx, -1)} className="p-1 hover:bg-blue-200 rounded"><ArrowUp size={12}/></button>}
                      {idx < pipeline.length - 1 && <button onClick={() => moveBlock(idx, 1)} className="p-1 hover:bg-blue-200 rounded"><ArrowDown size={12}/></button>}
                   </div>
                   <div className="flex-1 p-3 bg-white border-l-4 border-l-blue-500 rounded shadow-sm flex justify-between items-center">
                      <div>
                        <span className="text-xs font-bold text-blue-500 block">Step {idx + 1}</span>
                        <span className="font-medium text-gray-800">{block.label}</span>
                      </div>
                      <button onClick={() => removeFromPipeline(block)} className="text-red-400 hover:text-red-600 p-1">×</button>
                   </div>
                   {idx < pipeline.length - 1 && (
                     <div className="absolute left-1/2 -bottom-3 w-0.5 h-4 bg-gray-300 -ml-[50%] z-0"></div>
                   )}
                </div>
              ))}
              {pipeline.length === 0 && (
                <div className="text-center text-blue-300 text-sm mt-10 border-2 border-dashed border-blue-200 rounded p-4">
                  왼쪽에서 부품을 가져오세요.
                </div>
              )}
            </div>
            
            {pipeline.length === 5 && (
              <button
                onClick={validatePipeline}
                className="w-full mt-6 py-3 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 transition-colors"
              >
                설계 검증하기
              </button>
            )}
            
            {puzzleFeedback && (
              <div className={`mt-4 p-3 rounded text-sm font-medium ${puzzleFeedback.includes('완벽') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {puzzleFeedback}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simulation Section */}
      {isPipelineValid && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
             <span className="text-orange-500">2단계</span> 미니 시뮬레이션
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" label={{ value: '시간(초)', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: '온도(℃)', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
                    <Tooltip />
                    <ReferenceLine y={threshold} label="임계값" stroke="red" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="temp" stroke="#8884d8" dot={false} strokeWidth={2} name="현재 온도" />
                    <ReferenceLine y={50} stroke="orange" label="실제 화재 위험선(50도)" strokeOpacity={0.5}/>
                  </LineChart>
                </ResponsiveContainer>
             </div>
             
             <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-bold text-gray-700 mb-2">임계값 설정 (Threshold)</label>
                  <input 
                    type="range" 
                    min="20" 
                    max="80" 
                    value={threshold} 
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>20℃ (민감)</span>
                    <span className="font-bold text-lg text-blue-600">{threshold}℃</span>
                    <span>80℃ (둔감)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-100">
                    <span className="text-sm font-medium text-gray-600">정상 작동 (화재 감지)</span>
                    <span className="font-bold text-green-600">{simStats.trueAlarms}회</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded border border-red-100">
                    <span className="text-sm font-medium text-gray-600">오경보 (False Alarm)</span>
                    <span className="font-bold text-red-600">{simStats.falseAlarms}회</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded border border-gray-200">
                    <span className="text-sm font-medium text-gray-600">미탐지 (화재인데 조용)</span>
                    <span className="font-bold text-gray-800">{simStats.missedAlarms}회</span>
                  </div>
                </div>

                <div className="text-xs bg-slate-800 text-white p-3 rounded">
                  <strong>AI 코치 피드백:</strong><br/>
                  {simStats.falseAlarms > 5 
                    ? "오경보가 너무 많습니다! 임계값을 조금 올려보세요."
                    : simStats.missedAlarms > 0
                    ? "위험합니다! 실제 화재를 감지하지 못하고 있어요. 임계값을 낮춰야 합니다."
                    : "훌륭합니다! 오경보는 최소화하고 화재는 정확히 감지하고 있군요."
                  }
                </div>
                
                {simStats.falseAlarms === 0 && simStats.trueAlarms > 0 && !userProgress.badges.find(b => b.id === 'b_zero')?.unlocked && (
                  <button 
                    onClick={() => {
                       const newBadges = userProgress.badges.map(b => b.id === 'b_zero' ? {...b, unlocked: true} : b);
                       onUpdateProgress({...userProgress, xp: userProgress.xp + 50, badges: newBadges});
                       alert("배지 획득: 오경보 0회!");
                    }}
                    className="w-full py-2 bg-yellow-400 text-yellow-900 font-bold rounded animate-bounce"
                  >
                    🏆 결과 저장하고 배지 받기
                  </button>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabSimulation;