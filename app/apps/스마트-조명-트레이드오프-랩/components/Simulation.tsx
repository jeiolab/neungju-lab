import React, { useState, useEffect, useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Save, AlertTriangle, Lightbulb, Zap, Eye, Cpu, Radio } from 'lucide-react';
import { SimulationParams, SimulationScores, Design, LocationType } from '../types';
import { LOCATIONS } from '../constants';

interface SimulationProps {
  onSave: (design: Design) => void;
}

const Simulation: React.FC<SimulationProps> = ({ onSave }) => {
  const [params, setParams] = useState<SimulationParams>({
    sensitivity: 50,
    duration: 30,
    brightness: 80,
    location: 'hallway',
  });

  const [scores, setScores] = useState<SimulationScores>({ energy: 0, convenience: 0, privacy: 0 });
  const [reflection, setReflection] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Core Logic: Calculate Trade-offs
  useEffect(() => {
    const { sensitivity, duration, brightness, location } = params;
    const locData = LOCATIONS[location];

    // Energy Score: Lower brightness, shorter duration, lower sensitivity (less false triggers) is better
    // Base 100. Deduct based on usage.
    let energy = 100;
    energy -= (brightness / 100) * 30; // Max 30 deduction
    energy -= (duration / 300) * 30;   // Max 30 deduction (300s max)
    energy -= (sensitivity / 100) * 20; // Max 20 deduction (false positives waste energy)
    energy = energy / locData.energyWeight; // Location penalty
    energy = Math.min(100, Math.max(0, energy));

    // Convenience Score: Higher brightness, longer duration, higher sensitivity is better
    let convenience = 0;
    convenience += (brightness / 100) * 30;
    convenience += (duration / 60) * 30; // Optimized for ~60s being "good enough" for most
    if (convenience > 30) convenience = 30 + (duration / 300) * 10; // Diminishing returns on duration
    convenience += (sensitivity / 100) * 40;
    convenience = Math.min(100, Math.max(0, convenience));

    // Privacy Score: Higher sensitivity in private areas = Bad.
    let privacy = 100;
    const falsePositiveRisk = (sensitivity / 100) * (sensitivity / 100) * 40; // Quadratic penalty
    privacy -= falsePositiveRisk * locData.privacyWeight;
    
    // Duration penalty for privacy (staying on too long when nobody is there makes people wonder)
    if (duration > 120) privacy -= 10;
    
    privacy = Math.min(100, Math.max(0, privacy));

    setScores({
      energy: Math.round(energy),
      convenience: Math.round(convenience),
      privacy: Math.round(privacy),
    });
  }, [params]);

  const chartData = useMemo(() => [
    { subject: '에너지 절감', A: scores.energy, fullMark: 100 },
    { subject: '편의성', A: scores.convenience, fullMark: 100 },
    { subject: '프라이버시', A: scores.privacy, fullMark: 100 },
  ], [scores]);

  const handleSave = () => {
    if (!reflection.trim()) {
      alert("설계 제안서(근거)를 3문장 이상 작성해주세요.");
      return;
    }
    const newDesign: Design = {
      id: Date.now().toString(),
      name: `${LOCATIONS[params.location].label} 설계안 #${Date.now().toString().slice(-4)}`,
      params: { ...params },
      scores: { ...scores },
      reflection,
      timestamp: Date.now(),
    };
    onSave(newDesign);
    setReflection('');
    alert("설계안이 저장되었습니다!");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Cpu className="text-indigo-600" /> 설계 파라미터 설정
          </h2>
          
          <div className="space-y-6">
            {/* Location Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">설치 장소</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(LOCATIONS) as LocationType[]).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setParams({ ...params, location: loc })}
                    className={`p-2 rounded-lg text-sm font-medium transition-all ${
                      params.location === loc
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {LOCATIONS[loc].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sensitivity */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  <Radio size={16} /> 감지 민감도 (거리)
                </label>
                <span className="text-sm text-indigo-600 font-bold">{params.sensitivity}% (약 {(params.sensitivity * 0.07).toFixed(1)}m)</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={params.sensitivity}
                onChange={(e) => setParams({ ...params, sensitivity: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-xs text-slate-500 mt-1">민감도가 높으면 멀리서도 켜지지만, 오작동 확률도 높아집니다.</p>
            </div>

            {/* Duration */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  <Zap size={16} /> 점등 유지 시간
                </label>
                <span className="text-sm text-indigo-600 font-bold">{params.duration}초</span>
              </div>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={params.duration}
                onChange={(e) => setParams({ ...params, duration: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Brightness */}
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                  <Lightbulb size={16} /> LED 밝기
                </label>
                <span className="text-sm text-indigo-600 font-bold">{params.brightness}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={params.brightness}
                onChange={(e) => setParams({ ...params, brightness: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          {/* Virtual Circuit Visualization */}
          <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
             <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Virtual Circuit Diagram</h3>
             <div className="flex items-center justify-between text-xs font-mono">
                <div className="text-center">
                   <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-colors ${params.sensitivity > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-200'}`}>
                      <Radio size={16} />
                   </div>
                   <div className="mt-1">PIR Sensor</div>
                   <div className="text-slate-400">Input (D13)</div>
                </div>
                <div className="flex-1 h-0.5 bg-slate-300 mx-2 relative">
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] bg-white px-1 border rounded text-slate-500">MCU Processing</div>
                </div>
                <div className="text-center">
                   <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center transition-colors shadow-lg`} style={{
                      backgroundColor: `rgba(255, 193, 7, ${params.brightness/100})`,
                      boxShadow: `0 0 ${params.brightness/5}px rgba(255, 193, 7, 0.8)`
                   }}>
                      <Lightbulb size={16} className={params.brightness > 20 ? 'text-white' : 'text-slate-600'} />
                   </div>
                   <div className="mt-1">LED Bulb</div>
                   <div className="text-slate-400">Output (D2)</div>
                </div>
             </div>
          </div>
        </div>

        {/* Visualization & Feedback */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center min-h-[300px]">
            <h2 className="text-xl font-bold text-slate-800 mb-2 w-full">트레이드오프 분석</h2>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 'bold' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                  <Radar
                    name="설계 점수"
                    dataKey="A"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fill="#6366f1"
                    fillOpacity={0.4}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full mt-4">
              <ScoreCard label="에너지" score={scores.energy} color="bg-emerald-50 text-emerald-700" />
              <ScoreCard label="편의성" score={scores.convenience} color="bg-blue-50 text-blue-700" />
              <ScoreCard label="프라이버시" score={scores.privacy} color="bg-rose-50 text-rose-700" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Eye className="text-indigo-600" /> 실시간 피드백
            </h2>
            <ul className="space-y-2 text-sm text-slate-600">
              {scores.privacy < 50 && params.location === 'restroom' && (
                <li className="flex items-start gap-2 text-rose-600 font-medium">
                  <AlertTriangle size={16} className="mt-0.5" />
                  경고: 화장실 민감도가 너무 높아 오작동 시 프라이버시 침해 우려가 있습니다.
                </li>
              )}
              {scores.energy < 50 && (
                <li className="flex items-start gap-2 text-amber-600">
                  <Lightbulb size={16} className="mt-0.5" />
                  팁: 유지 시간을 조금 줄이면 에너지 효율이 크게 오를 수 있습니다.
                </li>
              )}
              {scores.convenience < 40 && (
                <li className="flex items-start gap-2 text-blue-600">
                  <Zap size={16} className="mt-0.5" />
                  팁: 너무 빨리 꺼지면 사용자가 불편할 수 있습니다.
                </li>
              )}
              {scores.energy > 80 && scores.convenience > 70 && scores.privacy > 70 && (
                 <li className="flex items-start gap-2 text-emerald-600 font-bold">
                 <Save size={16} className="mt-0.5" />
                 훌륭한 균형입니다! 지금 설계안을 저장해보세요.
               </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Proposal Input */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4">설계 제안서 작성</h2>
        <p className="text-sm text-slate-500 mb-2">
          위의 설정을 선택한 이유를 3가지 측면(에너지, 편의, 사생활)에서 3문장 이상 서술하세요.
        </p>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
          placeholder="예: 화장실이라 프라이버시가 중요해 민감도를 낮췄지만, 불편함을 줄이기 위해 유지 시간을 60초로 넉넉하게 잡았습니다..."
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={!reflection.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={18} /> 설계안 제출 및 저장
          </button>
        </div>
      </div>
    </div>
  );
};

const ScoreCard = ({ label, score, color }: { label: string; score: number; color: string }) => (
  <div className={`p-3 rounded-lg text-center ${color}`}>
    <div className="text-xs opacity-80 uppercase tracking-wide">{label}</div>
    <div className="text-2xl font-bold">{score}</div>
  </div>
);

export default Simulation;
