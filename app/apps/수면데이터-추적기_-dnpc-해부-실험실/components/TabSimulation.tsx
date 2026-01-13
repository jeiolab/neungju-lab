import React, { useState, useEffect } from 'react';
import { GaugeChart } from './GaugeChart';
import { ExperimentLog, UserState } from '../types';
import { Save, RefreshCw, Beaker } from 'lucide-react';

interface Props {
  userState: UserState;
  onCompleteExperiment: (log: ExperimentLog) => void;
}

export const TabSimulation: React.FC<Props> = ({ userState, onCompleteExperiment }) => {
  const [interval, setIntervalVal] = useState(30); // 1-60s
  const [delay, setDelay] = useState(2); // 0-5s
  const [reliability, setReliability] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulation Logic
  useEffect(() => {
    // Simple algorithm:
    // Interval: 1s is best. 60s is worst. 
    // Delay: 0s is best. 5s is worst.
    
    // Interval penalty: Non-linear. Small intervals are good, large degrade fast.
    const intervalScore = Math.max(0, 100 - (interval * 1.5));
    
    // Delay penalty: 1s delay is bad for real-time.
    const delayScore = Math.max(0, 100 - (delay * 15));

    // Weighted average
    const result = Math.round((intervalScore * 0.6) + (delayScore * 0.4));
    setReliability(result);

    // Generate Feedback
    const lines = [];
    
    // Line 1: Effect
    if (result >= 80) lines.push("🟢 훌륭합니다! 신뢰도가 매우 높습니다.");
    else if (result >= 50) lines.push("🟡 신뢰도가 보통 수준입니다. 조금 더 개선이 필요해요.");
    else lines.push("🔴 신뢰도가 위험 수준입니다! 분석이 불가능합니다.");

    // Line 2: Reason
    if (interval > 10) lines.push(`👉 샘플링 간격(${interval}초)이 너무 길어 수면 단계의 미세한 변화를 놓치고 있습니다.`);
    else if (delay > 2) lines.push(`👉 전송 지연(${delay}초)으로 인해 데이터가 제때 서버에 도착하지 못해 분석이 밀리고 있습니다.`);
    else lines.push("👉 현재 설정은 데이터의 양과 전송 속도가 아주 적절한 균형을 이루고 있습니다.");

    // Line 3: Recommendation
    if (result < 80) {
      if (interval > 10) lines.push("💡 다음 실험: 샘플링 간격을 5초 이하로 줄여보세요.");
      else lines.push("💡 다음 실험: 네트워크 환경을 개선하여 지연 시간을 줄여보세요.");
    } else {
      lines.push("💡 도전: 신뢰도를 유지하면서 배터리 절약을 위해 간격을 조금 늘려볼까요?");
    }

    setFeedback(lines);
  }, [interval, delay]);

  const handleRunExperiment = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      const newLog: ExperimentLog = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        samplingInterval: interval,
        transmissionDelay: delay,
        reliability: reliability,
        note: feedback[0]
      };
      onCompleteExperiment(newLog);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8">
        {/* Controls */}
        <div className="flex-1 space-y-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-bold text-slate-700">📡 샘플링 간격 (데이터 수집)</label>
              <span className="text-indigo-600 font-mono font-bold">{interval}초</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="60" 
              value={interval} 
              onChange={(e) => setIntervalVal(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-xs text-slate-500 mt-1">센서가 데이터를 얼마나 자주 측정할까요?</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="font-bold text-slate-700">🐢 전송 지연 (데이터 전송)</label>
              <span className="text-indigo-600 font-mono font-bold">{delay}초</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="5" 
              step="0.5"
              value={delay} 
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-xs text-slate-500 mt-1">네트워크 문제로 데이터가 얼마나 늦게 도착할까요?</p>
          </div>

          <button 
            onClick={handleRunExperiment}
            disabled={isSimulating}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-md transition-all flex justify-center items-center gap-2 ${
              isSimulating ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {isSimulating ? <RefreshCw className="animate-spin" /> : <Beaker />}
            {isSimulating ? '실험 분석 중...' : '실험 결과 기록하기'}
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="w-full max-w-xs">
            <GaugeChart value={reliability} />
          </div>
          
          <div className="w-full mt-4 space-y-3 bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Lab Coach Feedback</h4>
            {feedback.map((line, idx) => (
              <p key={idx} className={`text-sm ${idx === 0 ? 'font-bold text-slate-800' : 'text-slate-600'}`}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Save className="w-5 h-5 text-indigo-500" />
          나의 실험 노트
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">시간</th>
                <th className="px-4 py-3">간격</th>
                <th className="px-4 py-3">지연</th>
                <th className="px-4 py-3">신뢰도</th>
                <th className="px-4 py-3 rounded-r-lg">비고</th>
              </tr>
            </thead>
            <tbody>
              {userState.experimentLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400 italic">
                    아직 진행된 실험이 없습니다. 위에서 실험을 시작해보세요!
                  </td>
                </tr>
              ) : (
                userState.experimentLogs.slice().reverse().map((log) => (
                  <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3">{log.timestamp}</td>
                    <td className="px-4 py-3">{log.samplingInterval}s</td>
                    <td className="px-4 py-3">{log.transmissionDelay}s</td>
                    <td className="px-4 py-3 font-bold" style={{
                      color: log.reliability > 80 ? '#16a34a' : log.reliability > 50 ? '#ca8a04' : '#dc2626'
                    }}>{log.reliability}%</td>
                    <td className="px-4 py-3 truncate max-w-xs">{log.note}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};