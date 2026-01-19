import React, { useState, useEffect } from 'react';
import { SCENARIOS, MODEL_SPECS } from '../constants';
import { Scenario, DataCondition, TaskType, ModelType, SimulationResult } from '../types';
import { generateCoachFeedback, evaluateThought } from '../services/geminiService';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Brain, Database, Gauge, Scale, Send, RefreshCw, ChevronRight } from 'lucide-react';

interface SimulationProps {
  onComplete: (score: number, scenarioId: string) => void;
}

const Simulation: React.FC<SimulationProps> = ({ onComplete }) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [weights, setWeights] = useState({ acc: 50, exp: 50, cost: 50 });
  const [dataCondition, setDataCondition] = useState<DataCondition>('Sufficient');
  const [selectedTask, setSelectedTask] = useState<TaskType>('Regression');
  const [selectedModel, setSelectedModel] = useState<ModelType>('LinearRegression');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [userThought, setUserThought] = useState("");
  const [thoughtFeedback, setThoughtFeedback] = useState("");

  // Randomize daily constraint or highlight
  useEffect(() => {
    // Reset state when mounting
  }, []);

  const handleScenarioSelect = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setResult(null);
    setThoughtFeedback("");
    setUserThought("");
  };

  const calculateScore = () => {
    if (!selectedScenario) return;

    setLoading(true);

    // 1. Task Match Score (40%)
    let taskScore = 0;
    if (selectedTask === selectedScenario.correctTask) {
      taskScore = 100;
    } else {
      taskScore = 0; // Wrong tool for the job
    }

    // 2. Data Penalty (20%)
    let dataScore = 100;
    if (dataCondition === 'Insufficient') dataScore = 40;
    if (dataCondition === 'Noisy') dataScore = 60;

    // 3. Constraint Alignment (40%)
    // Get specs of selected model
    const specs = MODEL_SPECS[selectedModel as keyof typeof MODEL_SPECS] || { acc: 50, exp: 50, cost: 50 };
    
    // Calculate how well the model fits the user's desired weights
    // If user wants High Accuracy, and Model has High Accuracy -> Good.
    // We normalize the difference.
    const accFit = 100 - Math.abs(weights.acc - specs.acc);
    const expFit = 100 - Math.abs(weights.exp - specs.exp);
    // Cost: If user sets High Weight on Cost (meaning they care about it), 
    // and Model Cost is Low (Good), that's a match. 
    // Usually "Weight on Cost" means "I want Low Cost".
    // Model Cost 10 = Cheap, 90 = Expensive.
    // If User Weight Cost = 100 (Critical), Model Cost = 10 -> Score High.
    const costFit = 100 - Math.abs(weights.cost - (100 - specs.cost)); // Invert model cost for scoring

    const alignmentScore = (accFit + expFit + costFit) / 3;

    // Final Weighted Score
    const finalScore = (taskScore * 0.4) + (dataScore * 0.2) + (alignmentScore * 0.4);

    // AI Feedback Generation
    generateCoachFeedback(
      selectedScenario,
      weights,
      dataCondition,
      selectedTask,
      selectedModel,
      Math.round(finalScore)
    ).then((feedback) => {
        setResult({
          score: Math.round(finalScore),
          balanceScore: Math.round(alignmentScore),
          explanationScore: 0,
          feedback: feedback,
          metrics: {
            accuracy: specs.acc * (dataCondition === 'Sufficient' ? 1 : dataCondition === 'Noisy' ? 0.7 : 0.4),
            explainability: specs.exp,
            cost: specs.cost
          }
        });
        setLoading(false);
        onComplete(Math.round(finalScore), selectedScenario.id);
    });
  };

  const handleThoughtSubmit = async () => {
    if(!selectedScenario || !userThought) return;
    const feedback = await evaluateThought(selectedScenario.title, userThought);
    setThoughtFeedback(feedback);
  };

  if (!selectedScenario) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">상황 카드 선택</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioSelect(scenario)}
              className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg ${
                scenario.category === 'School' ? 'border-blue-200 bg-blue-50 hover:border-blue-400' :
                scenario.category === 'Life' ? 'border-green-200 bg-green-50 hover:border-green-400' :
                'border-purple-200 bg-purple-50 hover:border-purple-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                   scenario.category === 'School' ? 'bg-blue-200 text-blue-800' :
                   scenario.category === 'Life' ? 'bg-green-200 text-green-800' :
                   'bg-purple-200 text-purple-800'
                }`}>
                  {scenario.category}
                </span>
                <span className="text-xs text-slate-500">난이도 {'★'.repeat(scenario.difficulty)}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{scenario.title}</h3>
              <p className="text-sm text-slate-600 line-clamp-2">{scenario.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 h-full overflow-y-auto">
      {/* Left Panel: Inputs */}
      <div className="w-full md:w-1/2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <button onClick={() => setSelectedScenario(null)} className="text-sm text-slate-400 hover:text-slate-600 mb-2">← 목록으로 돌아가기</button>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedScenario.title}</h2>
          <p className="text-slate-600 mb-4">{selectedScenario.description}</p>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 text-sm text-amber-800 mb-4">
             <strong>미션:</strong> 이 문제를 해결하기 위한 최적의 모델을 설계하세요.
          </div>
        </div>

        {/* Inputs */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div>
            <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Scale size={18} /> 목표 설정 (가중치)
            </h3>
            <div className="space-y-4">
              {[
                { label: '정확도 (Accuracy)', key: 'acc', color: 'accent-blue-500' },
                { label: '설명 가능성 (Explainability)', key: 'exp', color: 'accent-green-500' },
                { label: '개발 비용/시간 (Cost)', key: 'cost', color: 'accent-red-500' }
              ].map((item) => (
                <div key={item.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.label}</span>
                    <span className="font-mono">{weights[item.key as keyof typeof weights]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights[item.key as keyof typeof weights]}
                    onChange={(e) => setWeights({ ...weights, [item.key]: parseInt(e.target.value) })}
                    className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer ${item.color}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">데이터 상태</label>
               <select
                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                value={dataCondition}
                onChange={(e) => setDataCondition(e.target.value as DataCondition)}
               >
                 <option value="Sufficient">충분함</option>
                 <option value="Insufficient">부족함 (데이터 적음)</option>
                 <option value="Noisy">노이즈 많음 (오류 포함)</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">해결 방식 (Task)</label>
               <select
                className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value as TaskType)}
               >
                 <option value="Regression">회귀 (값 예측)</option>
                 <option value="Classification">분류 (그룹 구분)</option>
                 <option value="Clustering">군집화 (패턴 발견)</option>
               </select>
             </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-slate-700 mb-2">알고리즘 선택</label>
             <select
              className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as ModelType)}
             >
               <option value="LinearRegression">선형 회귀 (단순, 설명 쉬움)</option>
               <option value="LogisticRegression">로지스틱 회귀 (이진 분류)</option>
               <option value="DecisionTree">의사결정 나무 (규칙 기반)</option>
               <option value="RandomForest">랜덤 포레스트 (강력, 복잡)</option>
               <option value="KMeans">K-평균 (단순 군집화)</option>
             </select>
          </div>

          <button
            onClick={calculateScore}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 disabled:bg-indigo-300"
          >
            {loading ? <RefreshCw className="animate-spin" /> : <><Brain size={20} /> 시뮬레이션 실행</>}
          </button>
        </div>
      </div>

      {/* Right Panel: Results */}
      <div className="w-full md:w-1/2 space-y-6">
        {result ? (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-slate-800">시뮬레이션 결과</h3>
               <div className="text-3xl font-black text-indigo-600">{result.score}<span className="text-sm text-slate-400 font-normal">/100</span></div>
            </div>

            {/* Chart */}
            <div className="h-64 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                  { subject: '정확도', A: result.metrics.accuracy, fullMark: 100 },
                  { subject: '설명력', A: result.metrics.explainability, fullMark: 100 },
                  { subject: '저비용', A: 100 - result.metrics.cost, fullMark: 100 }, // Higher is better (cheaper)
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="My Choice" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* AI Feedback */}
            <div className="space-y-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-900 text-sm mb-1">👍 강점 (Strength)</h4>
                <p className="text-sm text-blue-800">{result.feedback.strength}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                <h4 className="font-bold text-red-900 text-sm mb-1">⚠️ 약점 (Weakness)</h4>
                <p className="text-sm text-red-800">{result.feedback.weakness}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                <h4 className="font-bold text-green-900 text-sm mb-1">💡 코치 추천 (Tip)</h4>
                <p className="text-sm text-green-800">{result.feedback.recommendation}</p>
              </div>
            </div>

            {/* Thought Process */}
            <div className="border-t pt-4">
              <h4 className="font-bold text-slate-800 mb-2">🤔 생각해볼 문제</h4>
              <p className="text-sm text-slate-600 mb-2">
                이 상황에서 데이터를 더 확보할 수 없다면, 어떻게 성능을 개선할 수 있을까요?
              </p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={userThought}
                  onChange={(e) => setUserThought(e.target.value)}
                  placeholder="자신의 생각을 적어보세요..."
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                />
                <button 
                  onClick={handleThoughtSubmit}
                  className="bg-slate-800 text-white p-2 rounded-lg hover:bg-slate-700"
                >
                  <Send size={16} />
                </button>
              </div>
              {thoughtFeedback && (
                 <div className="mt-2 text-sm text-indigo-700 bg-indigo-50 p-2 rounded">
                    {thoughtFeedback}
                 </div>
              )}
            </div>
          </div>
        ) : (
           <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
             <Gauge size={48} className="mb-4 opacity-50" />
             <p>왼쪽 패널에서 조건을 설정하고<br/>시뮬레이션을 시작하세요.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default Simulation;