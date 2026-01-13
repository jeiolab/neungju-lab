import React, { useState, useEffect } from 'react';
import { ProjectStage, Role, SimulationState } from '../types';
import { getSimulationFeedback } from '../services/geminiService';
import { User, Bot, Users, Play, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';

const STAGES = [ProjectStage.PLANNING, ProjectStage.DESIGN, ProjectStage.VERIFICATION, ProjectStage.PRODUCTION];

// Game Logic Configuration
const SCORING = {
  [ProjectStage.PLANNING]: {
    [Role.HUMAN]: { eff: 25, risk: 0, msg: "인간의 창의성이 빛을 발합니다!" },
    [Role.AI]: { eff: 10, risk: 15, msg: "AI는 기존 데이터에 갇혀 혁신적인 기획을 하지 못했습니다." },
    [Role.COLLAB]: { eff: 20, risk: 5, msg: "무난한 시작이나, 너무 많은 데이터가 직관을 방해했습니다." }
  },
  [ProjectStage.DESIGN]: {
    [Role.HUMAN]: { eff: 10, risk: 5, msg: "인간이 설계하기엔 너무 복잡한 패턴입니다. 시간이 지체됩니다." },
    [Role.AI]: { eff: 25, risk: 5, msg: "AI가 최적의 설계도를 순식간에 생성했습니다!" },
    [Role.COLLAB]: { eff: 25, risk: 0, msg: "AI의 설계와 인간의 감독이 완벽한 조화를 이룹니다." }
  },
  [ProjectStage.VERIFICATION]: {
    [Role.HUMAN]: { eff: 10, risk: 10, msg: "인간의 눈으로 모든 오류를 찾기엔 역부족입니다." },
    [Role.AI]: { eff: 25, risk: 10, msg: "빠르지만, 윤리적 결함이나 미묘한 엣지 케이스를 놓쳤을 수 있습니다." },
    [Role.COLLAB]: { eff: 25, risk: -5, msg: "AI가 스크리닝하고 인간이 최종 검수하여 완벽합니다." }
  },
  [ProjectStage.PRODUCTION]: {
    [Role.HUMAN]: { eff: 25, risk: 0, msg: "책임감 있는 결정으로 프로젝트를 안정적으로 마무리합니다." },
    [Role.AI]: { eff: 15, risk: 30, msg: "중대한 생산 결정을 AI에게 맡기는 것은 매우 위험합니다!" },
    [Role.COLLAB]: { eff: 20, risk: 5, msg: "데이터 기반의 의사결정을 인간이 최종 승인합니다. 훌륭합니다." }
  }
};

const SimulationTab: React.FC = () => {
  const [gameState, setGameState] = useState<SimulationState>({
    currentStageIndex: 0,
    efficiency: 0,
    risk: 0,
    history: [],
    isComplete: false,
    eventLog: [],
  });
  
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChoice = (role: Role) => {
    const currentStage = STAGES[gameState.currentStageIndex];
    const outcome = SCORING[currentStage][role];

    const nextState = {
      ...gameState,
      efficiency: Math.min(100, gameState.efficiency + outcome.eff),
      risk: Math.max(0, Math.min(100, gameState.risk + outcome.risk)),
      history: [...gameState.history, { 
        stage: currentStage, 
        choice: role, 
        efficiencyDelta: outcome.eff, 
        riskDelta: outcome.risk 
      }],
      eventLog: [`[${currentStage}] ${outcome.msg}`, ...gameState.eventLog],
    };

    if (gameState.currentStageIndex >= STAGES.length - 1) {
      nextState.isComplete = true;
      finishSimulation(nextState);
    } else {
      nextState.currentStageIndex += 1;
    }

    setGameState(nextState);
  };

  const finishSimulation = async (finalState: SimulationState) => {
    setLoading(true);
    const feedbackText = await getSimulationFeedback(
      finalState.history,
      finalState.efficiency,
      finalState.risk
    );
    setFeedback(feedbackText);
    setLoading(false);
  };

  const resetGame = () => {
    setGameState({
      currentStageIndex: 0,
      efficiency: 0,
      risk: 0,
      history: [],
      isComplete: false,
      eventLog: [],
    });
    setFeedback("");
  };

  const currentStage = STAGES[gameState.currentStageIndex];
  const progress = ((gameState.currentStageIndex) / STAGES.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">프로젝트 진행률</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${gameState.isComplete ? 100 : progress}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">효율성 (Efficiency)</p>
          <div className="flex items-center mt-1">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
              <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${gameState.efficiency}%` }}></div>
            </div>
            <span className="text-green-600 font-bold">{gameState.efficiency}%</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">리스크 (Risk)</p>
          <div className="flex items-center mt-1">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
              <div className={`h-2.5 rounded-full transition-all duration-500 ${gameState.risk > 50 ? 'bg-red-500' : 'bg-orange-400'}`} style={{ width: `${gameState.risk}%` }}></div>
            </div>
            <span className={`font-bold ${gameState.risk > 50 ? 'text-red-500' : 'text-orange-500'}`}>{gameState.risk}%</span>
          </div>
        </div>
      </div>

      {!gameState.isComplete ? (
        /* Game Area */
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <span className="text-sm font-semibold text-blue-600 tracking-wider uppercase">Current Stage</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{currentStage}</h2>
            </div>
            <div className="bg-white p-2 rounded-lg shadow-sm">
               {gameState.currentStageIndex === 0 && <span className="text-3xl">📝</span>}
               {gameState.currentStageIndex === 1 && <span className="text-3xl">📐</span>}
               {gameState.currentStageIndex === 2 && <span className="text-3xl">🔍</span>}
               {gameState.currentStageIndex === 3 && <span className="text-3xl">🏭</span>}
            </div>
          </div>
          
          <div className="p-8">
            <p className="text-lg text-gray-600 mb-8 text-center">
              이 단계의 책임자를 선택하세요.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                onClick={() => handleChoice(Role.HUMAN)}
                className="group relative flex flex-col items-center p-6 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">인간 (Human)</h3>
                <p className="text-xs text-gray-500 mt-2 text-center">창의성, 직관, 윤리적 책임</p>
              </button>

              <button 
                onClick={() => handleChoice(Role.COLLAB)}
                className="group relative flex flex-col items-center p-6 border-2 border-gray-100 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">협업 (Team)</h3>
                <p className="text-xs text-gray-500 mt-2 text-center">상호 보완, 시너지 극대화</p>
              </button>

              <button 
                onClick={() => handleChoice(Role.AI)}
                className="group relative flex flex-col items-center p-6 border-2 border-gray-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Bot className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">AI (Tool)</h3>
                <p className="text-xs text-gray-500 mt-2 text-center">데이터 분석, 반복 작업, 속도</p>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Result Area */
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-2">프로젝트 완료!</h2>
            <p className="opacity-90">당신의 프로젝트 관리 능력은?</p>
            
            <div className="mt-6 flex justify-center items-center space-x-2">
              {gameState.efficiency >= 80 && gameState.risk <= 30 ? (
                <span className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold shadow-lg flex items-center">
                  <span className="mr-2">🏆</span> 전설의 PM
                </span>
              ) : gameState.risk > 60 ? (
                <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" /> 프로젝트 실패 위기
                </span>
              ) : (
                <span className="bg-white/20 px-4 py-2 rounded-full font-bold backdrop-blur-sm">
                  성장하는 PM
                </span>
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                AI 분석 피드백
              </h3>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-gray-700 leading-relaxed min-h-[100px]">
                {loading ? (
                  <div className="flex items-center justify-center space-x-2 text-gray-400">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <span>AI가 결과를 분석 중입니다...</span>
                  </div>
                ) : (
                  feedback
                )}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">로그 (Log)</h3>
              <ul className="space-y-2">
                {gameState.eventLog.map((log, idx) => (
                  <li key={idx} className="text-sm text-gray-600 border-l-2 border-blue-200 pl-3 py-1">
                    {log}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center">
              <button 
                onClick={resetGame}
                className="flex items-center space-x-2 px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <RotateCcw className="w-5 h-5" />
                <span>새 프로젝트 시작하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationTab;