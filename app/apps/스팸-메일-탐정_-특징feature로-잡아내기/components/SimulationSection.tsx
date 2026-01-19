import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Save, BarChart3, AlertCircle } from 'lucide-react';
import { SimulationConfig, SimulationResult } from '../types';
import { generateMockData, runSimulation } from '../services/dataService';
import { loadHistory, saveHistory, addXP, loadUserStats, saveUserStats, checkBadges } from '../services/storageService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  onUpdateStats: () => void;
}

const SimulationSection: React.FC<Props> = ({ onUpdateStats }) => {
  const [config, setConfig] = useState<SimulationConfig>({
    dataCount: 50,
    useKeyword: false,
    useLinks: false,
    useExclamation: false,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [accuracyHistory, setAccuracyHistory] = useState<{run: number, acc: number}[]>([]);

  useEffect(() => {
    const saved = loadHistory();
    if (saved) {
      setResult(saved);
      setConfig(saved.config);
    }
  }, []);

  const handleRun = () => {
    setIsAnimating(true);
    
    // Simulate processing time
    setTimeout(() => {
      const data = generateMockData(config.dataCount);
      const simResult = runSimulation(data, config);
      
      const newResult: SimulationResult = {
        accuracy: simResult.accuracy,
        timestamp: Date.now(),
        config: { ...config },
        feedback: simResult.details
      };

      setResult(newResult);
      
      // Update history for chart
      setAccuracyHistory(prev => [...prev.slice(-9), { run: prev.length + 1, acc: simResult.accuracy }]);

      // Update User Stats
      const stats = loadUserStats();
      stats.simulationCount += 1;
      if (simResult.accuracy >= 80) {
        stats.highAccuracyCount += 1;
      }
      saveUserStats(stats);
      addXP(10); // +10 XP per run
      checkBadges(stats);
      onUpdateStats();

      setIsAnimating(false);
    }, 800);
  };

  const handleSave = () => {
    if (result) {
      saveHistory(result);
      alert("현재 설정과 결과가 저장되었습니다.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
             <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded mr-2"><RotateCcw size={18} /></span>
             실험 설정
          </h3>
          
          <div className="space-y-6">
            {/* Slider */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                학습 데이터 개수: <span className="text-indigo-600 font-bold">{config.dataCount}개</span>
              </label>
              <input
                type="range"
                min="20"
                max="200"
                step="10"
                value={config.dataCount}
                onChange={(e) => setConfig({ ...config, dataCount: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>20 (빠름/부정확)</span>
                <span>200 (안정적)</span>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-3">사용할 특징 (Features)</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-slate-100 p-1 rounded transition">
                  <input
                    type="checkbox"
                    checked={config.useKeyword}
                    onChange={(e) => setConfig({ ...config, useKeyword: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="text-slate-700 text-sm">"무료/당첨" 단어 포함 여부</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-slate-100 p-1 rounded transition">
                  <input
                    type="checkbox"
                    checked={config.useLinks}
                    onChange={(e) => setConfig({ ...config, useLinks: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="text-slate-700 text-sm">메일 내 링크 개수</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-slate-100 p-1 rounded transition">
                  <input
                    type="checkbox"
                    checked={config.useExclamation}
                    onChange={(e) => setConfig({ ...config, useExclamation: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="text-slate-700 text-sm">느낌표(!!!) 개수</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleRun}
              disabled={isAnimating || (!config.useKeyword && !config.useLinks && !config.useExclamation)}
              className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all flex justify-center items-center gap-2
                ${isAnimating 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-95'}`}
            >
              {isAnimating ? '학습 중...' : <><Play size={20} /> 학습 및 분류 시작</>}
            </button>
            
            {(!config.useKeyword && !config.useLinks && !config.useExclamation) && (
              <p className="text-xs text-red-500 flex items-center"><AlertCircle size={12} className="mr-1"/> 최소 1개 이상의 특징을 선택하세요.</p>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="md:col-span-2 space-y-6">
          {/* Main Monitor */}
          <div className="bg-slate-900 text-green-400 p-6 rounded-xl shadow-lg font-mono relative overflow-hidden min-h-[300px] flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-2">
               <span className="flex items-center gap-2"><BarChart3 size={18}/> RESULT_MONITOR_v1.0</span>
               {result && <button onClick={handleSave} className="text-slate-400 hover:text-white flex items-center gap-1 text-sm"><Save size={14}/> 저장</button>}
            </div>

            {result ? (
              <div className="flex-1 flex flex-col justify-between animate-fade-in-up">
                <div className="text-center py-4">
                  <p className="text-slate-400 text-sm mb-2">CLASSIFICATION ACCURACY</p>
                  <div className="text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                    {result.accuracy}%
                  </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded border-l-4 border-green-500 my-4 space-y-2">
                  <h4 className="text-white font-bold mb-2">시스템 피드백</h4>
                  {result.feedback.map((line, idx) => (
                    <p key={idx} className="text-sm text-green-300 flex items-start gap-2">
                      <span className="mt-1 opacity-50">»</span> {line}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-600 flex-col gap-3">
                <div className="w-16 h-16 border-4 border-slate-700 border-t-slate-500 rounded-full animate-spin"></div>
                <p>Waiting for input...</p>
              </div>
            )}
          </div>

          {/* Mini Chart */}
          {accuracyHistory.length > 0 && (
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 h-48">
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Accuracy Trend</p>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={accuracyHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                    <XAxis dataKey="run" hide />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}}
                      itemStyle={{color: '#4ade80'}}
                    />
                    <Area type="monotone" dataKey="acc" stroke="#4f46e5" fill="#e0e7ff" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationSection;
