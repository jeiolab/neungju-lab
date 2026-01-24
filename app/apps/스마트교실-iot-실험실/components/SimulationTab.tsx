import React, { useState } from 'react';
import { Wind, Coffee, Bell, AlertTriangle, Play, RefreshCw, CheckCircle } from 'lucide-react';
import { SimulationResult, Scenario } from '../types';

interface SimulationTabProps {
  onComplete: (id: string, score: number) => void;
  stamps: Record<string, number>;
}

const scenarios: Scenario[] = [
  { id: 'air', title: '자동 환기 시스템', description: '교실 공기가 나빠지면 자동으로 창문을 엽니다.', icon: 'Wind' },
  { id: 'kiosk', title: '급식실 혼잡도 알림', description: '사람이 붐비면 앱으로 대기 시간을 알려줍니다.', icon: 'Coffee' },
  { id: 'home', title: '스마트홈 안심 알림', description: '집에 낯선 움직임이 감지되면 부모님께 알립니다.', icon: 'Bell' },
];

const SimulationTab: React.FC<SimulationTabProps> = ({ onComplete, stamps }) => {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [sensitivity, setSensitivity] = useState(50);
  const [automation, setAutomation] = useState(50);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setResult(null);

    // Micro-simulation delay
    setTimeout(() => {
      // Logic:
      // Convenience increases with Automation
      // Safety depends on Sensitivity (Too low = missed danger, Too high = false alarm stress)
      // Dependency increases with Automation
      
      const convenienceScore = Math.min(100, Math.round(automation * 0.8 + sensitivity * 0.2));
      
      // Safety optimal at sensitivity 60-80. 
      // If sens < 40: Danger! (Missed detection). 
      // If sens > 90: Annoyance (False alarm), slightly lowers safety perception.
      let safetyScore = 0;
      if (sensitivity < 40) safetyScore = sensitivity * 1.5; // 0-60
      else if (sensitivity > 90) safetyScore = 80 - (sensitivity - 90) * 2; // Penalty for too sensitive
      else safetyScore = 80 + (sensitivity - 60); // Peak around here
      
      // Add automation bonus to safety, but if automation is 100, risk of failure exists
      safetyScore += automation * 0.1;
      safetyScore = Math.min(100, Math.round(safetyScore));

      const dependencyRisk = Math.round(automation * 0.9 + (100 - sensitivity) * 0.1);

      const feedback = [];
      if (sensitivity < 30) feedback.push("⚠️ 센서가 둔감해서 중요한 신호를 놓쳤어요!");
      if (sensitivity > 85) feedback.push("📢 너무 예민해서 별일 아닌데도 계속 알림이 울려요.");
      if (automation > 80) feedback.push("🤖 기계에 너무 의존하고 있어요. 고장나면 어떡하죠?");
      if (automation < 30) feedback.push("✋ 수동 조작이 많아서 조금 불편하네요.");
      if (convenienceScore > 80 && safetyScore > 80) feedback.push("🌟 훌륭한 밸런스입니다! 편리하고 안전해요.");

      const finalResult = {
        convenience: convenienceScore,
        safety: safetyScore,
        dependency: dependencyRisk,
        feedback: feedback.length > 0 ? feedback : ["무난한 설정입니다."]
      };

      setResult(finalResult);
      setIsSimulating(false);
      
      // Calculate total score (avg of conv + safety)
      const totalScore = Math.round((convenienceScore + safetyScore) / 2);
      if (activeScenario) onComplete(activeScenario, totalScore);

    }, 1500);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wind': return <Wind />;
      case 'Coffee': return <Coffee />;
      case 'Bell': return <Bell />;
      default: return <AlertTriangle />;
    }
  };

  if (!activeScenario) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">실험 시나리오 선택</h2>
          <p className="text-slate-600">어떤 상황을 시뮬레이션 해볼까요?</p>
        </div>
        <div className="grid gap-4">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveScenario(s.id);
                setResult(null);
                setSensitivity(50);
                setAutomation(50);
              }}
              className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left"
            >
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                {getIcon(s.icon)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.description}</p>
              </div>
              {stamps[s.id] && (
                <div className="text-center">
                  <div className="text-xs text-slate-400">최고점수</div>
                  <div className="font-bold text-emerald-600 text-lg">{stamps[s.id]}</div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentScenarioData = scenarios.find(s => s.id === activeScenario);

  return (
    <div className="space-y-6">
      <button 
        onClick={() => setActiveScenario(null)}
        className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1"
      >
        ← 시나리오 목록으로
      </button>

      <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
                {getIcon(currentScenarioData?.icon || '')}
                <h2 className="text-2xl font-bold">{currentScenarioData?.title}</h2>
            </div>
            <p className="opacity-90">{currentScenarioData?.description}</p>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] opacity-20 transform scale-150">
            {getIcon(currentScenarioData?.icon || '')}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <h3 className="font-bold text-lg border-b pb-2">설정 조작</h3>
          
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium text-slate-700">📡 센서 민감도</label>
              <span className="text-indigo-600 font-bold">{sensitivity}%</span>
            </div>
            <input 
              type="range" min="1" max="100" value={sensitivity} 
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-xs text-slate-400 mt-1">낮으면 둔감하고, 높으면 예민하게 반응합니다.</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="font-medium text-slate-700">⚙️ 자동화 강도</label>
              <span className="text-indigo-600 font-bold">{automation}%</span>
            </div>
            <input 
              type="range" min="1" max="100" value={automation} 
              onChange={(e) => setAutomation(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-xs text-slate-400 mt-1">기계가 알아서 처리하는 비율입니다.</p>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSimulating ? <RefreshCw className="animate-spin" /> : <Play fill="currentColor" />}
            {isSimulating ? '데이터 분석 중...' : '실험 시작'}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {!result && !isSimulating && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 min-h-[300px]">
              <AlertTriangle size={48} className="mb-2 opacity-50" />
              <p>설정을 마치고 실험을 시작하세요.</p>
            </div>
          )}

          {result && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col animate-fade-in-up">
              <h3 className="font-bold text-lg mb-4">실험 결과 분석</h3>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                <ResultCard label="편의성" score={result.convenience} color="bg-blue-500" />
                <ResultCard label="안전성" score={result.safety} color="bg-emerald-500" />
                <ResultCard label="과의존 위험" score={result.dependency} color="bg-rose-500" isRisk />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex-1">
                <h4 className="font-bold text-sm text-slate-500 mb-2">AI 코치 피드백</h4>
                <ul className="space-y-2">
                  {result.feedback.map((text, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle size={16} className="mt-0.5 text-indigo-500 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultCard = ({ label, score, color, isRisk = false }: { label: string, score: number, color: string, isRisk?: boolean }) => (
  <div className="flex flex-col items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
    <span className="text-xs text-slate-500 mb-1">{label}</span>
    <div className={`text-2xl font-bold ${isRisk && score > 70 ? 'text-rose-600' : 'text-slate-800'}`}>
      {score}
    </div>
    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${score}%` }}></div>
    </div>
  </div>
);

export default SimulationTab;
