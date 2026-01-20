import React, { useState, useEffect, useCallback } from 'react';
import { generateMystery } from '../../services/sortingAlgorithms';
import { getAlgorithmHint } from '../../services/geminiService';
import Visualizer from '../Visualizer';
import { AlgorithmType, ArraySnapshot } from '../../types';
import { RefreshCw, Play, SkipForward, HelpCircle, Trophy, Clock, CheckCircle2, XCircle } from 'lucide-react';

const SimulationTab: React.FC = () => {
  const [mystery, setMystery] = useState<ReturnType<typeof generateMystery> | null>(null);
  const [userGuess, setUserGuess] = useState<AlgorithmType | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [stepPreview, setStepPreview] = useState<number>(0); // For showing next steps after solving

  const startNewRound = useCallback(() => {
    const newMystery = generateMystery();
    setMystery(newMystery);
    setUserGuess(null);
    setFeedback(null);
    setIsCorrect(null);
    setHint(null);
    setStepPreview(newMystery.mysteryIndex);
  }, []);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleGuess = (guess: AlgorithmType) => {
    if (!mystery) return;
    setUserGuess(guess);
    
    if (guess === mystery.type) {
      setIsCorrect(true);
      setStreak(s => s + 1);
      
      // Construct logic-based feedback
      let logicText = "";
      switch(mystery.type) {
          case AlgorithmType.Bubble: logicText = "정답입니다! 가장 큰 원소가 끝으로 거품처럼 이동하고 있습니다."; break;
          case AlgorithmType.Selection: logicText = "정답입니다! 정렬된 부분이 앞에서부터(왼쪽) 만들어지고 있습니다."; break;
          case AlgorithmType.Insertion: logicText = "정답입니다! 원소가 왼쪽의 정렬된 부분 배열에 삽입되고 있습니다."; break;
          case AlgorithmType.Quick: logicText = "정답입니다! 배열이 피벗을 기준으로 분할되고 있습니다."; break;
      }
      setFeedback(logicText);
    } else {
      setIsCorrect(false);
      setStreak(0);
      setFeedback("틀렸습니다. 정렬된 부분과 정렬되지 않은 부분을 자세히 살펴보세요.");
    }
  };

  const fetchHint = async () => {
    if (!mystery) return;
    setLoadingHint(true);
    const hintText = await getAlgorithmHint(mystery.type, mystery.snapshot.array, mystery.snapshot.sortedIndices);
    setHint(hintText);
    setLoadingHint(false);
  };

  const showNextStep = () => {
      if (!mystery) return;
      if (stepPreview < mystery.fullHistory.length - 1) {
          setStepPreview(p => p + 1);
      }
  };

  if (!mystery) return <div className="p-8 text-center">미스터리 로딩 중...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header / Stats */}
      <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border border-slate-700">
        <div className="flex items-center gap-2 text-amber-400">
            <Trophy size={20} />
            <span className="font-bold text-lg">연속 정답: {streak}</span>
        </div>
        <button 
            onClick={startNewRound}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors text-sm"
        >
            <RefreshCw size={14} /> 새로운 사건
        </button>
      </div>

      {/* Main Visualization */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 shadow-xl">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span className="bg-blue-600 text-xs px-2 py-1 rounded text-white">사건 파일 #{Math.floor(Math.random() * 9000) + 1000}</span>
                증거 분석
            </h2>
            <div className="text-slate-400 text-sm font-mono">
                단계 {stepPreview + 1} / {mystery.fullHistory.length}
            </div>
        </div>
        
        <Visualizer snapshot={mystery.fullHistory[stepPreview]} />
        
        {/* Controls for Post-Solve Analysis */}
        {isCorrect && (
            <div className="mt-4 flex justify-center">
                <button 
                    onClick={showNextStep}
                    className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                    <Play size={16} /> 다음 단계 예측 (클릭하여 진행)
                </button>
            </div>
        )}
      </div>

      {/* Detective Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guessing Panel */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold mb-4 text-slate-200">알고리즘 식별</h3>
            <div className="grid grid-cols-2 gap-3">
                {Object.values(AlgorithmType).map((algo) => (
                    <button
                        key={algo}
                        onClick={() => handleGuess(algo)}
                        disabled={isCorrect === true}
                        className={`p-3 rounded-lg text-sm font-semibold transition-all border-2
                            ${userGuess === algo 
                                ? (isCorrect ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-red-500 bg-red-500/20 text-red-300')
                                : 'border-slate-600 bg-slate-700 hover:border-blue-400 text-slate-300'
                            }
                        `}
                    >
                        {algo}
                    </button>
                ))}
            </div>
        </div>

        {/* Info & Hints Panel */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col justify-between">
             <div>
                <h3 className="text-lg font-semibold mb-2 text-slate-200">수사 일지</h3>
                {!feedback && !userGuess && (
                    <p className="text-slate-400 text-sm">수사관의 분석을 기다리는 중...</p>
                )}
                {feedback && (
                    <div className={`flex items-start gap-3 p-3 rounded-lg ${isCorrect ? 'bg-emerald-900/30 text-emerald-200' : 'bg-red-900/30 text-red-200'}`}>
                        {isCorrect ? <CheckCircle2 className="shrink-0 mt-0.5" size={18}/> : <XCircle className="shrink-0 mt-0.5" size={18}/>}
                        <p className="text-sm">{feedback}</p>
                    </div>
                )}
             </div>

             <div className="mt-4">
                 {hint && (
                     <div className="mb-3 p-3 bg-indigo-900/30 border border-indigo-700/50 rounded text-indigo-200 text-sm italic">
                         "팁: {hint}"
                     </div>
                 )}
                 <button 
                    onClick={fetchHint}
                    disabled={loadingHint || isCorrect === true}
                    className="w-full py-2 flex items-center justify-center gap-2 text-indigo-300 hover:text-indigo-100 disabled:opacity-50"
                 >
                    <HelpCircle size={16} />
                    {loadingHint ? "AI 자문 구하는 중..." : "힌트 요청"}
                 </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;