import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { GoalType, SimulationConfig, SimulationResult } from '../types';
import { getSimulationFeedback } from '../services/geminiService';

interface Props {
  onSaveResult: (result: SimulationResult) => void;
  savedResults: SimulationResult[];
}

const Simulation: React.FC<Props> = ({ onSaveResult, savedResults }) => {
  const [config, setConfig] = useState<SimulationConfig>({
    autonomy: 50,
    cooperation: 50,
    goal: GoalType.SAFETY,
  });
  
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Local Logic Calculation
  const calculateResult = async () => {
    setLoading(true);
    let idealAutonomy = 50;
    let idealCooperation = 50;
    let maxScore = 100;

    // Define heuristics based on Goal
    switch (config.goal) {
      case GoalType.SAFETY:
        idealAutonomy = 30; // Too much autonomy risks breaking safety protocols
        idealCooperation = 90; // Communication is key for safety
        break;
      case GoalType.CONGESTION:
        idealAutonomy = 80; // Fast local decisions needed
        idealCooperation = 80; // Must sync with others to balance load
        break;
      case GoalType.SATISFACTION:
        idealAutonomy = 90; // Personalized service requires high autonomy
        idealCooperation = 60; // Moderate cooperation needed
        break;
    }

    const diffA = Math.abs(idealAutonomy - config.autonomy);
    const diffC = Math.abs(idealCooperation - config.cooperation);
    
    // Simple penalty algorithm
    let calcScore = maxScore - (diffA * 0.6) - (diffC * 0.4);
    
    // Additional Penalty for dangerous combos
    if (config.goal === GoalType.SAFETY && config.autonomy > 80) {
      calcScore -= 15; // Penalty: Too autonomous in safety mode is dangerous
    }
    
    calcScore = Math.max(0, Math.round(calcScore));
    setCurrentScore(calcScore);

    // Get AI Feedback
    const aiFeedback = await getSimulationFeedback(config, calcScore);
    setFeedback(aiFeedback);
    setLoading(false);
  };

  const handleSave = () => {
    if (currentScore !== null) {
      onSaveResult({
        score: currentScore,
        feedback,
        config: { ...config },
        timestamp: Date.now()
      });
      alert("설계안이 저장되었습니다!");
    }
  };

  const chartData = [
    { subject: '자율성', A: config.autonomy, fullMark: 100 },
    { subject: '협력성', A: config.cooperation, fullMark: 100 },
    { subject: '목표달성력(예측)', A: currentScore || 0, fullMark: 100 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
        <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">🎛️ 에이전트 설계 패널</h3>
        
        {/* Goal Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">운영 목표 선택</label>
          <select 
            value={config.goal}
            onChange={(e) => setConfig({...config, goal: e.target.value as GoalType})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {Object.values(GoalType).map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {config.goal === GoalType.SAFETY && "안전 규정을 최우선으로 준수합니다."}
            {config.goal === GoalType.CONGESTION && "병목 현상을 줄이기 위해 빠르게 움직입니다."}
            {config.goal === GoalType.SATISFACTION && "방문객 개개인의 요구를 들어줍니다."}
          </p>
        </div>

        {/* Sliders */}
        <div>
          <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
            <span>자율성 (Autonomy)</span>
            <span className="text-indigo-600 font-bold">{config.autonomy}%</span>
          </label>
          <input 
            type="range" min="0" max="100" 
            value={config.autonomy} 
            onChange={(e) => setConfig({...config, autonomy: Number(e.target.value)})}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        <div>
          <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
            <span>협력성 (Cooperation)</span>
            <span className="text-indigo-600 font-bold">{config.cooperation}%</span>
          </label>
          <input 
            type="range" min="0" max="100" 
            value={config.cooperation} 
            onChange={(e) => setConfig({...config, cooperation: Number(e.target.value)})}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        <button 
          onClick={calculateResult}
          disabled={loading}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-md transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
          }`}
        >
          {loading ? "AI 분석 중..." : "🚀 시뮬레이션 실행"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Results Panel */}
        <div className="bg-white p-6 rounded-xl shadow-md min-h-[400px] flex flex-col">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 시뮬레이션 결과</h3>
          
          {currentScore !== null ? (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6 bg-indigo-50 p-4 rounded-lg">
                <span className="text-lg font-medium text-gray-700">운영 점수</span>
                <span className={`text-4xl font-extrabold ${currentScore >= 80 ? 'text-green-600' : currentScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {currentScore}점
                </span>
              </div>

              <div className="h-48 w-full mb-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Agent" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex-1">
                <h4 className="font-bold text-gray-700 mb-2">🤖 AI 코치 피드백</h4>
                <div className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                  {feedback}
                </div>
              </div>

              <button 
                onClick={handleSave}
                className="mt-4 w-full py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg font-bold hover:bg-indigo-50 transition-colors"
              >
                💾 설계 저장하기
              </button>
            </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
               <div className="text-6xl mb-4">🎮</div>
               <p>설계를 마치고 실행 버튼을 눌러주세요.</p>
             </div>
          )}
        </div>

        {/* Saved Designs */}
        {savedResults.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📂 저장된 설계 (TOP 3)</h3>
            <div className="space-y-3">
              {savedResults.slice().sort((a,b) => b.score - a.score).slice(0,3).map((res, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                  <div>
                    <span className="font-bold text-indigo-800 text-sm">{res.config.goal}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      (자율 {res.config.autonomy} / 협력 {res.config.cooperation})
                    </span>
                  </div>
                  <span className="font-bold text-gray-800">{res.score}점</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulation;