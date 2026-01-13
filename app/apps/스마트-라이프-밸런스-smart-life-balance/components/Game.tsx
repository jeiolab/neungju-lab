import React, { useState, useEffect } from 'react';
import { GameState, Scenario, EndingType } from '../types';
import { SCENARIOS } from '../constants';
import { getScenarioConsequence } from '../services/geminiService';
import { Trophy, Lock, Zap, RefreshCw } from 'lucide-react';

interface GameProps {
  onGameEnd: (ending: EndingType, score: { conv: number, priv: number }) => void;
}

const Game: React.FC<GameProps> = ({ onGameEnd }) => {
  const [gameState, setGameState] = useState<GameState>({
    currentScenarioIndex: 0,
    convenienceScore: 50,
    privacyScore: 50,
    isGameOver: false,
    history: []
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentScenario = SCENARIOS[gameState.currentScenarioIndex];

  // Helper to clamp scores between 0 and 100
  const clamp = (num: number) => Math.min(100, Math.max(0, num));

  const handleChoice = async (choiceKey: 'choiceA' | 'choiceB') => {
    setLoading(true);
    const choice = currentScenario[choiceKey];
    
    // Calculate new scores
    const newConv = clamp(gameState.convenienceScore + choice.convenienceChange);
    const newPriv = clamp(gameState.privacyScore + choice.privacyChange);

    // Get AI feedback
    const aiText = await getScenarioConsequence(currentScenario.title, choice.text);
    
    setFeedback(aiText);
    
    // Update State after a small delay to show feedback logic if needed, 
    // but here we wait for user to click "Next"
    setGameState(prev => ({
      ...prev,
      convenienceScore: newConv,
      privacyScore: newPriv,
      history: [...prev.history, {
        scenarioId: currentScenario.id,
        choice: choiceKey === 'choiceA' ? 'A' : 'B',
        consequence: aiText
      }]
    }));
    setLoading(false);
  };

  const nextScenario = () => {
    setFeedback(null);
    if (gameState.currentScenarioIndex < SCENARIOS.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentScenarioIndex: prev.currentScenarioIndex + 1
      }));
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    let ending: EndingType = 'SMART_CITIZEN';
    const { convenienceScore, privacyScore } = gameState;

    if (privacyScore >= 80 && convenienceScore < 40) {
      ending = 'INVISIBLE';
    } else if (convenienceScore >= 80 && privacyScore < 40) {
      ending = 'OPEN_DOOR';
    } else {
      ending = 'SMART_CITIZEN';
    }

    onGameEnd(ending, { conv: convenienceScore, priv: privacyScore });
  };

  const getBarColor = (score: number, type: 'conv' | 'priv') => {
    if (type === 'conv') return score > 70 ? 'bg-blue-500' : score < 30 ? 'bg-blue-200' : 'bg-blue-400';
    return score > 70 ? 'bg-green-500' : score < 30 ? 'bg-green-200' : 'bg-green-400';
  };

  if (feedback) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border-l-4 border-indigo-500">
          <h3 className="text-xl font-bold mb-4 text-slate-800">결과 확인</h3>
          <p className="text-slate-600 mb-6 text-lg leading-relaxed word-keep-all">
            {feedback}
          </p>
          
          <div className="flex gap-4 justify-center mb-6 text-sm font-medium">
             <div className="text-blue-600">편리함: {gameState.convenienceScore}</div>
             <div className="text-green-600">보안: {gameState.privacyScore}</div>
          </div>

          <button 
            onClick={nextScenario}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            다음 상황으로 <Zap size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col h-full">
      {/* HUD */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-col gap-4 sticky top-0 z-10">
        <div className="flex justify-between items-center text-sm text-slate-500">
          <span>시나리오 {gameState.currentScenarioIndex + 1} / {SCENARIOS.length}</span>
          <span>디지털 윤리 심판관 감시 중...</span>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-bold text-blue-700 flex items-center gap-1"><Zap size={16}/> 편리함</span>
              <span className="text-blue-700">{gameState.convenienceScore}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all duration-500 ${getBarColor(gameState.convenienceScore, 'conv')}`} 
                style={{ width: `${gameState.convenienceScore}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-bold text-green-700 flex items-center gap-1"><Lock size={16}/> 보안(프라이버시)</span>
              <span className="text-green-700">{gameState.privacyScore}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all duration-500 ${getBarColor(gameState.privacyScore, 'priv')}`} 
                style={{ width: `${gameState.privacyScore}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Card */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
          <div className="p-8 text-center bg-slate-50 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{currentScenario.title}</h2>
            <p className="text-lg text-slate-600 leading-relaxed word-keep-all">
              {currentScenario.description}
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleChoice('choiceA')}
              disabled={loading}
              className="group relative flex flex-col items-center justify-center p-6 border-2 border-blue-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center h-48"
            >
              <div className="absolute top-4 right-4 text-blue-400 opacity-50 group-hover:opacity-100">
                <Zap size={24} />
              </div>
              <span className="text-lg font-bold text-slate-800 mb-2">{currentScenario.choiceA.text}</span>
              <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded-full border border-slate-200">
                편리함 ▲ 보안 ▼
              </span>
            </button>

            <button
              onClick={() => handleChoice('choiceB')}
              disabled={loading}
              className="group relative flex flex-col items-center justify-center p-6 border-2 border-green-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-center h-48"
            >
               <div className="absolute top-4 right-4 text-green-400 opacity-50 group-hover:opacity-100">
                <Lock size={24} />
              </div>
              <span className="text-lg font-bold text-slate-800 mb-2">{currentScenario.choiceB.text}</span>
              <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded-full border border-slate-200">
                편리함 ▼ 보안 ▲
              </span>
            </button>
          </div>
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
              <RefreshCw className="animate-spin text-indigo-600 mb-2" size={32} />
              <p className="text-indigo-800 font-medium">심판관이 결과를 분석 중입니다...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;