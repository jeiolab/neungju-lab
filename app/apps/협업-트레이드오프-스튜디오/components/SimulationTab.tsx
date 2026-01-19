import React, { useState, useEffect } from 'react';
import { SimulationState, SimulationResult, ScenarioType, RoleItem, AssignmentState } from '../types';
import { calculateScore } from '../utils/simulationLogic';
import { saveSimulation, getSimulations } from '../utils/storage';
import { ROLE_POOL_ITEMS } from '../constants';
import { RefreshCw, AlertTriangle, ShieldCheck, Zap, Layers, GripVertical, CheckCircle2 } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface SimulationTabProps {
  scenario: ScenarioType;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ scenario }) => {
  const [state, setState] = useState<SimulationState>({
    aiUsage: 50,
    verificationTime: 50,
    isSensitive: false,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [history, setHistory] = useState<SimulationResult[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Role Assignment State
  const [assignment, setAssignment] = useState<AssignmentState>({
    pool: [...ROLE_POOL_ITEMS],
    human: [],
    ai: [],
    verification: [],
    data: []
  });

  useEffect(() => {
    setHistory(getSimulations().slice(0, 5));
  }, []);

  const handleRunSimulation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const newResult = calculateScore(state, scenario);
      setResult(newResult);
      saveSimulation(newResult);
      setHistory(prev => [newResult, ...prev].slice(0, 5));
      setIsAnimating(false);
    }, 600);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Simple Click-to-move implementation for drag-and-drop simulation
  const moveRole = (id: string, targetCategory: keyof AssignmentState) => {
    // Find item
    let item: RoleItem | undefined;
    let sourceCategory: keyof AssignmentState = 'pool';

    // Search in all categories
    const categories: (keyof AssignmentState)[] = ['pool', 'human', 'ai', 'verification', 'data'];
    for (const cat of categories) {
      const found = assignment[cat].find(x => x.id === id);
      if (found) {
        item = found;
        sourceCategory = cat;
        break;
      }
    }

    if (!item || sourceCategory === targetCategory) return;

    setAssignment(prev => ({
      ...prev,
      [sourceCategory]: prev[sourceCategory].filter(x => x.id !== id),
      [targetCategory]: [...prev[targetCategory], item!]
    }));
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Input Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          트레이드오프 시뮬레이션: {scenario}
        </h2>
        
        <div className="space-y-6">
          {/* Slider 1: AI Usage */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">🤖 AI 활용도 (자동화 수준)</label>
              <span className="text-sm font-bold text-indigo-600">{state.aiUsage}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={state.aiUsage}
              onChange={(e) => setState({ ...state, aiUsage: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-xs text-slate-500 mt-1">높을수록 속도는 빠르지만 의존도가 높아집니다.</p>
          </div>

          {/* Slider 2: Verification Time */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">🕵️ 검증 시간 (인간의 개입)</label>
              <span className="text-sm font-bold text-green-600">{state.verificationTime}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={state.verificationTime}
              onChange={(e) => setState({ ...state, verificationTime: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <p className="text-xs text-slate-500 mt-1">높을수록 품질과 윤리성이 확보되지만 시간이 걸립니다.</p>
          </div>

          {/* Toggle: Data Sensitivity */}
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`w-5 h-5 ${state.isSensitive ? 'text-red-500' : 'text-slate-400'}`} />
              <div>
                <span className="text-sm font-bold text-slate-800">민감 데이터 포함 여부</span>
                <p className="text-xs text-slate-500">개인정보, 성적, 얼굴 사진 등</p>
              </div>
            </div>
            <button
              onClick={() => setState({ ...state, isSensitive: !state.isSensitive })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.isSensitive ? 'bg-red-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${state.isSensitive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isAnimating}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all active:scale-95 flex justify-center items-center gap-2 shadow-lg shadow-indigo-200"
          >
            {isAnimating ? <RefreshCw className="animate-spin w-5 h-5" /> : '결과 확인하기'}
          </button>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 animate-slideUp">
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Left: Chart & Score */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48">
                 <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                    { subject: '효율', A: result.scores.efficiency, fullMark: 100 },
                    { subject: '품질', A: result.scores.quality, fullMark: 100 },
                    { subject: '윤리', A: result.scores.ethics, fullMark: 100 },
                  ]}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="A" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-800 bg-white/80 px-2 rounded-lg">{result.scores.total}점</span>
                </div>
              </div>
            </div>

            {/* Right: Feedback */}
            <div className="flex-[2] space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-blue-800 text-sm">효율 ({result.scores.efficiency}점)</span>
                </div>
                <p className="text-sm text-slate-700">{result.feedback.efficiency}</p>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span className="font-bold text-purple-800 text-sm">품질 ({result.scores.quality}점)</span>
                </div>
                <p className="text-sm text-slate-700">{result.feedback.quality}</p>
              </div>

              <div className={`p-3 rounded-lg border-l-4 ${result.scores.ethics < 50 ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className={`w-4 h-4 ${result.scores.ethics < 50 ? 'text-red-600' : 'text-green-600'}`} />
                  <span className={`font-bold text-sm ${result.scores.ethics < 50 ? 'text-red-800' : 'text-green-800'}`}>윤리 ({result.scores.ethics}점)</span>
                </div>
                <p className="text-sm text-slate-700">{result.feedback.ethics}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Timeline */}
      {history.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">📜 최근 선택 기록</h3>
          <div className="space-y-3">
            {history.map((h, i) => (
              <div key={h.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs">{new Date(h.timestamp).toLocaleTimeString()} - {h.scenario}</span>
                  <div className="flex gap-2 mt-1">
                    <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs">효율 {h.scores.efficiency}</span>
                    <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-xs">품질 {h.scores.quality}</span>
                    <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-xs">윤리 {h.scores.ethics}</span>
                  </div>
                </div>
                <span className={`font-bold text-lg ${getScoreColor(h.scores.total)}`}>{h.scores.total}점</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add-on: Role Assignment Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100">
         <h3 className="text-lg font-bold text-slate-800 mb-2">📋 역할 분담표 생성기 (Beta)</h3>
         <p className="text-sm text-slate-500 mb-4">역할 카드를 클릭하여 알맞은 담당자에게 배정해보세요.</p>
         
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {(['human', 'ai', 'verification', 'data'] as const).map(cat => (
              <div key={cat} className="bg-slate-50 p-3 rounded-lg min-h-[120px] border border-slate-200">
                <h4 className="font-bold text-sm text-slate-600 mb-2 capitalize border-b border-slate-200 pb-1">
                   {cat === 'human' ? '👤 인간(협력)' : cat === 'ai' ? '🤖 AI(생성)' : cat === 'verification' ? '🕵️ 검증 담당' : '📂 자료 담당'}
                </h4>
                <div className="space-y-2">
                  {assignment[cat].map(item => (
                    <button 
                      key={item.id} 
                      onClick={() => moveRole(item.id, 'pool')}
                      className="w-full text-left bg-white text-xs p-2 rounded shadow-sm border border-slate-100 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      {item.name}
                    </button>
                  ))}
                  {assignment[cat].length === 0 && <span className="text-xs text-slate-300 italic">비어있음</span>}
                </div>
              </div>
            ))}
         </div>

         <div className="bg-indigo-50 p-4 rounded-xl">
           <h4 className="text-xs font-bold text-indigo-800 mb-2 uppercase tracking-wider">역할 카드 풀 (클릭하여 배정)</h4>
           <div className="flex flex-wrap gap-2">
             {assignment.pool.map(item => (
               <button
                 key={item.id}
                 onClick={() => {
                    // Simple logic to suggest category, cycle through or prompt could be better but keeping simple:
                    // Default to 'human' or 'ai' based on type, user then moves them. 
                    // To keep UI simple: clicking in pool sends to 'human' if human type, 'ai' if ai type initially.
                    // User can then move between categories if needed? Actually let's just make it simple: 
                    // Open a small dialog or just cycle? 
                    // Let's implement cycling: Pool -> Human -> AI -> Verification -> Data -> Pool
                    // Or better: Just provide buttons in the item? No, too cluttered.
                    // Let's just default assign to Human/AI then let user refine.
                    moveRole(item.id, item.type === 'human' ? 'human' : 'ai');
                 }}
                 className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm text-xs font-medium text-slate-700 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
               >
                 <GripVertical className="w-3 h-3 text-slate-400" />
                 {item.name}
               </button>
             ))}
              {assignment.pool.length === 0 && <span className="text-xs text-indigo-400">모든 역할이 배정되었습니다!</span>}
           </div>
           <p className="text-[10px] text-indigo-400 mt-2 text-right">* 배정된 카드를 클릭하면 다시 풀로 돌아갑니다.</p>
         </div>
      </div>
    </div>
  );
};

export default SimulationTab;