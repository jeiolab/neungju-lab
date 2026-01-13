import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SCENARIOS, DE_IDENTIFICATION_TEXT, SENSITIVE_WORDS, BADGES } from '../../constants';
import { Badge, Scenario, SimulationState } from '../../types';
import { Check, X, AlertTriangle, RefreshCw, Eye } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const SimulationTab: React.FC = () => {
  const [state, setState] = useState<SimulationState>({
    step: 0,
    utilityScore: 50,
    ethicsScore: 50,
    history: []
  });

  const [puzzleText, setPuzzleText] = useState<{ word: string; masked: boolean; isSensitive: boolean }[]>([]);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<Badge | null>(null);

  // Initialize Puzzle
  useEffect(() => {
    // Basic splitting by space/punctuation for the demo
    // In a real app, use a more robust tokenizer or predefined spans
    const words = DE_IDENTIFICATION_TEXT.split(/(\s+)/).map(w => {
      // Clean word for checking
      const cleanW = w.replace(/[,.]/g, '');
      const isSensitive = SENSITIVE_WORDS.some(sw => w.includes(sw));
      return { word: w, masked: false, isSensitive };
    });
    setPuzzleText(words);
  }, []);

  const handleStart = () => {
    setState({ step: 1, utilityScore: 50, ethicsScore: 50, history: [] });
    setPuzzleComplete(false);
    setEarnedBadge(null);
  };

  const handleChoice = (utilityImpact: number, ethicsImpact: number, feedback: string) => {
    setState(prev => ({
      ...prev,
      step: prev.step + 1,
      utilityScore: Math.min(100, Math.max(0, prev.utilityScore + utilityImpact)),
      ethicsScore: Math.min(100, Math.max(0, prev.ethicsScore + ethicsImpact)),
      history: [...prev.history, feedback]
    }));
  };

  const toggleMask = (index: number) => {
    if (state.step <= SCENARIOS.length) return; // Only allow during puzzle step

    const newText = [...puzzleText];
    // If it's whitespace, ignore
    if (!newText[index].word.trim()) return;

    newText[index].masked = !newText[index].masked;
    setPuzzleText(newText);

    // Check win condition
    const allSensitiveMasked = newText.filter(t => t.isSensitive).every(t => t.masked);
    // Optional: Penalize for over-masking (masking non-sensitive words)
    // For this simple version, we just check if sensitive ones are covered.
    
    if (allSensitiveMasked) {
      setPuzzleComplete(true);
    }
  };

  const finishGame = () => {
    // Add bonus for puzzle
    const finalEthics = puzzleComplete ? Math.min(100, state.ethicsScore + 10) : state.ethicsScore;
    
    // Determine Badge
    const badge = BADGES.find(b => b.condition(state.utilityScore, finalEthics)) || BADGES[3];
    setEarnedBadge(badge);
    setState(prev => ({ ...prev, ethicsScore: finalEthics, step: prev.step + 1 }));
  };

  // Render Logic
  const currentScenario = SCENARIOS[state.step - 1];
  const isScenarioPhase = state.step > 0 && state.step <= SCENARIOS.length;
  const isPuzzlePhase = state.step === SCENARIOS.length + 1;
  const isResultPhase = state.step > SCENARIOS.length + 1;

  // Chart Data
  const chartData = [
    { name: '편의성', value: state.utilityScore, fill: '#0ea5e9' },
    { name: '윤리', value: state.ethicsScore, fill: '#0d9488' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Score Header */}
      {state.step > 0 && (
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-10">
          <div className="flex gap-6 w-full">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-sky-600">편의성 (기능)</span>
                <span className="font-mono">{state.utilityScore}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${state.utilityScore}%` }}></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-teal-600">윤리 (프라이버시)</span>
                <span className="font-mono">{state.ethicsScore}%</span>
              </div>
               <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 transition-all duration-500" style={{ width: `${state.ethicsScore}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INTRO STEP */}
      {state.step === 0 && (
        <Card className="text-center py-12">
          <div className="text-6xl mb-6">🏙️</div>
          <h2 className="text-3xl font-bold mb-4">프로젝트: 스마트 교실</h2>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto">
            당신은 스마트 교실 구축 프로젝트의 PM으로 임명되었습니다. 이사회는 첨단 기능을 원하지만, 
            학부모회는 개인정보 보호를 걱정하며 당신의 결정을 지켜보고 있습니다.
            <br/><br/>
            현명한 결정을 내리고, 데이터를 안전하게 처리하여 최적의 균형을 찾아주세요.
          </p>
          <Button onClick={handleStart} className="mx-auto w-48 py-3 text-lg">프로젝트 시작</Button>
        </Card>
      )}

      {/* SCENARIO STEPS */}
      {isScenarioPhase && currentScenario && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                결정 {state.step} / {SCENARIOS.length}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-4">{currentScenario.title}</h3>
            <p className="text-slate-600 text-lg mb-8">{currentScenario.description}</p>
            
            <div className="grid gap-4">
              {currentScenario.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(option.utilityImpact, option.ethicsImpact, option.feedback)}
                  className="text-left p-4 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="font-bold text-slate-800 group-hover:text-blue-700">{option.label}</div>
                  <div className="text-xs text-slate-400 mt-1 flex gap-2">
                    {option.utilityImpact > 0 ? <span className="text-sky-600">편의성 +{option.utilityImpact}</span> : <span className="text-rose-400">편의성 {option.utilityImpact}</span>}
                    {option.ethicsImpact > 0 ? <span className="text-teal-600">윤리 +{option.ethicsImpact}</span> : <span className="text-rose-400">윤리 {option.ethicsImpact}</span>}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* PUZZLE STEP */}
      {isPuzzlePhase && (
        <div className="space-y-6 animate-in fade-in duration-500">
           <Card>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Eye size={20} />
                비식별화 미션
              </h3>
              <p className="text-slate-600">
                데이터셋을 외부에 공개하기 전에, <strong>민감한 개인정보</strong>를 모두 가려야 합니다.
                민감 정보(이름, 번호, 주소, 병명 등)를 클릭하여 마스킹(***) 처리하세요.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 font-mono text-lg leading-relaxed mb-6">
              {puzzleText.map((item, idx) => (
                <span
                  key={idx}
                  onClick={() => toggleMask(idx)}
                  className={`
                    cursor-pointer transition-colors px-0.5 rounded
                    ${item.masked ? 'bg-slate-800 text-slate-800 select-none' : 'hover:bg-yellow-200'}
                  `}
                >
                  {item.masked ? '****' : item.word}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-slate-500">
                {puzzleComplete ? (
                  <span className="text-green-600 flex items-center gap-1 font-bold"><Check size={16}/> 안전합니다! 제출 가능.</span>
                ) : (
                  <span className="text-amber-600 flex items-center gap-1"><AlertTriangle size={16}/> 민감 정보가 아직 보입니다.</span>
                )}
              </div>
              <Button disabled={!puzzleComplete} onClick={finishGame} variant={puzzleComplete ? 'primary' : 'outline'}>
                데이터셋 제출
              </Button>
            </div>
           </Card>
        </div>
      )}

      {/* RESULT STEP */}
      {isResultPhase && earnedBadge && (
        <div className="animate-in zoom-in duration-500">
          <Card className="text-center border-t-8 border-t-indigo-500">
            <div className="mb-6">
              <div className="text-6xl mb-4">{earnedBadge.icon}</div>
              <h2 className="text-3xl font-bold text-slate-900">{earnedBadge.name}</h2>
              <p className="text-slate-600 mt-2 text-lg">{earnedBadge.description}</p>
            </div>

            <div className="h-64 w-full mb-8">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="name" type="category" width={50} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="value" barSize={40} radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#64748b' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 text-left mb-6">
              <h4 className="font-bold text-sm text-slate-400 uppercase mb-3">결정 기록</h4>
              <ul className="space-y-2 text-sm text-slate-700">
                {state.history.map((h, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-slate-400">{i+1}.</span>
                    {h}
                  </li>
                ))}
                <li className="flex gap-2 font-semibold text-teal-700">
                  <span className="text-slate-400">{state.history.length + 1}.</span>
                  {puzzleComplete ? "성공적으로 민감 정보를 마스킹했습니다." : "데이터 보호에 실패했습니다."}
                </li>
              </ul>
            </div>

            <Button onClick={handleStart} variant="outline" className="mx-auto">
              <RefreshCw size={16} /> 시뮬레이션 다시하기
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};