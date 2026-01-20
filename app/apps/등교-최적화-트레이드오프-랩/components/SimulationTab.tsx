import React, { useState, useEffect, useMemo } from 'react';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip 
} from 'recharts';
import { TRANSPORT_MODES } from '../constants';
import { TransportType, SimulationState, SimulationResult } from '../types';
import { Footprints, Bike, Bus, Car, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Props {
  onSimulationComplete: (result: SimulationResult) => void;
}

const SimulationTab: React.FC<Props> = ({ onSimulationComplete }) => {
  const [state, setState] = useState<SimulationState>({
    wokeUpLate: false,
    transportType: 'WALK',
    prepTimeModifier: 0,
    distance: 3 // Default 3km
  });

  // Derived calculations
  const calculateResult = (): SimulationResult => {
    const mode = TRANSPORT_MODES[state.transportType];
    
    // Time Calculation
    const basePrepTime = 30; // minutes
    const actualPrepTime = Math.max(5, basePrepTime - state.prepTimeModifier); // Min 5 min prep
    
    // Speed: Walk ~4km/h -> 15 min/km. Multiplier 1 = 15min. Multiplier 8 = ~2min/km (Taxi)
    // Simplified logic for education:
    const baseMinutesPerKm = 15;
    const travelTime = Math.round((baseMinutesPerKm / mode.speedMultiplier) * state.distance);
    
    // Normal Wake up: 7:00 AM. Late: 7:30 AM.
    const wakeUpHour = state.wokeUpLate ? 7 : 7;
    const wakeUpMinute = state.wokeUpLate ? 30 : 0;
    
    const totalMinutesNeeded = actualPrepTime + travelTime;
    
    // Arrival Time
    let arrivalHour = wakeUpHour;
    let arrivalMinute = wakeUpMinute + totalMinutesNeeded;
    while (arrivalMinute >= 60) {
      arrivalHour++;
      arrivalMinute -= 60;
    }
    
    const arrivalTimeStr = `${String(arrivalHour).padStart(2, '0')}:${String(arrivalMinute).padStart(2, '0')}`;
    
    // Check Late (Late if after 8:30)
    const isLate = (arrivalHour > 8) || (arrivalHour === 8 && arrivalMinute > 30);
    
    // Scores
    const totalCost = mode.costPerKm * state.distance;
    
    // Normalize scores (0-100). Higher is better.
    // Time Score: 100 if on time. Subtract 10 per minute late.
    let minutesLate = 0;
    if (isLate) {
       minutesLate = ((arrivalHour - 8) * 60 + arrivalMinute) - 30;
    }
    const timeScore = Math.max(0, 100 - (minutesLate * 5));
    
    // Cost Score: 0 won = 100. 10000 won = 0.
    const costScore = Math.max(0, 100 - (totalCost / 100));
    
    // Env Score: Mode score * 10
    const envScore = mode.carbonScore * 10;
    
    // Safety Penalty
    const safetyRating = mode.safetyScore;
    
    // Balance Score (Harmonic mean-ish or Average with penalty)
    const balanceScore = Math.round((timeScore + costScore + envScore) / 3);

    return {
      arrivalTime: arrivalTimeStr,
      isLate,
      totalCost,
      carbonEmissions: 10 - mode.carbonScore, // for visual representation
      safetyRating,
      timeScore,
      costScore,
      envScore,
      balanceScore,
      transportType: state.transportType
    };
  };

  const result = useMemo(calculateResult, [state]);

  useEffect(() => {
    // Notify parent to unlock badges/streak
    onSimulationComplete(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.arrivalTime, result.totalCost, result.transportType]); 
  // Trigger on significant changes, not every slider drag frame if possible, 
  // but for React simplicity, dependency on result fields works well.

  const chartData = [
    { subject: '시간 효율', A: result.timeScore, fullMark: 100 },
    { subject: '비용 절약', A: result.costScore, fullMark: 100 },
    { subject: '환경 보호', A: result.envScore, fullMark: 100 },
    { subject: '안전', A: result.safetyRating * 10, fullMark: 100 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      {/* Input Section */}
      <div className="space-y-6">
        
        {/* Scenario Toggle */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="text-amber-500 w-5 h-5" />
            1. 현재 상황 입력
          </h3>
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
            <span className="text-slate-600">오늘 늦잠을 잤나요? (+30분)</span>
            <button 
              onClick={() => setState(s => ({ ...s, wokeUpLate: !s.wokeUpLate }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.wokeUpLate ? 'bg-red-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition transition-transform ${state.wokeUpLate ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Transport Selection */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Footprints className="text-blue-500 w-5 h-5" />
            2. 이동 수단 선택 (변수 조작)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(TRANSPORT_MODES) as TransportType[]).map(type => (
              <button
                key={type}
                onClick={() => setState(s => ({ ...s, transportType: type }))}
                className={`p-3 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all ${state.transportType === type ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-blue-200'}`}
              >
                {type === 'WALK' && <Footprints className="w-6 h-6 text-slate-600" />}
                {type === 'BIKE' && <Bike className="w-6 h-6 text-slate-600" />}
                {type === 'BUS' && <Bus className="w-6 h-6 text-slate-600" />}
                {type === 'TAXI' && <Car className="w-6 h-6 text-slate-600" />}
                <span className="font-medium text-sm text-slate-700">{TRANSPORT_MODES[type].name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preparation Time Slider */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            <Clock className="text-purple-500 w-5 h-5" />
            3. 준비 시간 단축
          </h3>
          <div className="mb-2 flex justify-between text-sm text-slate-600">
            <span>여유롭게 (30분)</span>
            <span>급하게 (5분)</span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            step="5"
            value={state.prepTimeModifier}
            onChange={(e) => setState(s => ({ ...s, prepTimeModifier: parseInt(e.target.value) }))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <p className="text-center mt-2 font-mono text-purple-700">
            현재 준비 시간: {30 - state.prepTimeModifier}분
          </p>
        </div>
      </div>

      {/* Result Section */}
      <div className="space-y-6">
        
        {/* Model Table */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-3">📊 등교 시간 모델링 표</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                <tr>
                  <th className="px-4 py-2">단계</th>
                  <th className="px-4 py-2">시각/소요</th>
                  <th className="px-4 py-2">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-2 font-medium">기상</td>
                  <td className="px-4 py-2">{state.wokeUpLate ? '07:30' : '07:00'}</td>
                  <td className="px-4 py-2 text-slate-500">{state.wokeUpLate ? '늦잠 (+30m)' : '정상'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">준비</td>
                  <td className="px-4 py-2">{30 - state.prepTimeModifier}분</td>
                  <td className="px-4 py-2 text-slate-500">
                    {state.prepTimeModifier > 15 ? '매우 급함' : '보통'}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">이동 ({state.distance}km)</td>
                  <td className="px-4 py-2">
                    {Math.round((15 / TRANSPORT_MODES[state.transportType].speedMultiplier) * state.distance)}분
                  </td>
                  <td className="px-4 py-2 text-slate-500">{TRANSPORT_MODES[state.transportType].name}</td>
                </tr>
                <tr className={result.isLate ? "bg-red-50" : "bg-green-50"}>
                  <td className="px-4 py-2 font-bold text-slate-800">도착</td>
                  <td className="px-4 py-2 font-bold text-slate-800">{result.arrivalTime}</td>
                  <td className="px-4 py-2 font-bold">
                    {result.isLate ? 
                      <span className="text-red-600 flex items-center gap-1"><AlertTriangle size={14}/> 지각!</span> : 
                      <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14}/> 성공!</span>
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Trade-off Chart */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 h-64 flex flex-col">
           <h3 className="font-bold text-slate-700 mb-2">⚖️ 트레이드오프 분석 (균형: {result.balanceScore}점)</h3>
           <div className="flex-1 w-full h-full min-h-0">
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                 <PolarGrid />
                 <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
                 <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false}/>
                 <Radar
                   name="현재 계획"
                   dataKey="A"
                   stroke="#3b82f6"
                   fill="#3b82f6"
                   fillOpacity={0.6}
                 />
                 <Tooltip />
               </RadarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* 3-Line Feedback */}
        <div className="bg-slate-800 p-5 rounded-xl shadow-sm border border-slate-700 text-slate-100 font-mono text-sm">
           <h4 className="text-yellow-400 font-bold mb-2">🤖 랩 조교 피드백</h4>
           <p><span className="text-slate-400">원인:</span> {state.wokeUpLate ? "늦잠을 자서 시간이 부족합니다." : "기상 시간은 충분합니다."}</p>
           <p><span className="text-slate-400">선택:</span> {TRANSPORT_MODES[state.transportType].name}로 이동하여 {result.totalCost}원을 씁니다.</p>
           <p><span className="text-slate-400">결과:</span> {result.isLate ? "여전히 지각입니다. 더 빠른 수단이나 준비 시간 단축이 필요해요!" : "지각은 면했지만 트레이드오프를 확인해보세요."}</p>
        </div>

      </div>
    </div>
  );
};

export default SimulationTab;