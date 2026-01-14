import React, { useState, useMemo } from 'react';
import { SCENARIOS, KNIGHTS } from '../constants';
import { SecurityType, Tab } from '../types';
import { DynamicIcon } from './Icons';

interface SimulationViewProps {
  onNavigate: (tab: Tab) => void;
}

// 랜덤 시나리오 선택 함수 (중복 방지)
const getRandomScenarios = (count: number): number[] => {
  const indices = Array.from({ length: SCENARIOS.length }, (_, i) => i);
  const selected: number[] = [];
  
  for (let i = 0; i < count && indices.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * indices.length);
    selected.push(indices[randomIndex]);
    indices.splice(randomIndex, 1);
  }
  
  return selected;
};

export const SimulationView: React.FC<SimulationViewProps> = ({ onNavigate }) => {
  // 랜덤으로 선택된 시나리오 인덱스 배열
  const [selectedScenarioIndices, setSelectedScenarioIndices] = useState(() => getRandomScenarios(Math.min(10, SCENARIOS.length)));
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const currentScenario = SCENARIOS[selectedScenarioIndices[currentScenarioIndex]];

  const handleDefense = (selectedType: SecurityType) => {
    if (selectedType === currentScenario.requiredDefense) {
      setFeedback({
        type: 'success',
        message: '방어 성공! 기사가 공격을 완벽하게 막아냈습니다.'
      });
      setScore(prev => prev + 20);
      
      // Next scenario logic
      setTimeout(() => {
        setFeedback(null);
        if (currentScenarioIndex < selectedScenarioIndices.length - 1) {
          setCurrentScenarioIndex(prev => prev + 1);
        } else {
          setIsGameOver(true);
        }
      }, 2000);
    } else {
      setFeedback({
        type: 'error',
        message: '성벽이 무너졌습니다! 잘못된 기사를 선택했습니다.'
      });
    }
  };

  const handleRestart = () => {
    // 새로운 랜덤 시나리오 선택
    setSelectedScenarioIndices(getRandomScenarios(Math.min(10, SCENARIOS.length)));
    setCurrentScenarioIndex(0);
    setScore(0);
    setIsGameOver(false);
    setFeedback(null);
  };

  if (isGameOver) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="inline-block p-6 rounded-full bg-yellow-100 mb-6">
          <DynamicIcon name="ShieldCheck" className="w-16 h-16 text-yellow-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">시뮬레이션 종료!</h2>
        <p className="text-xl text-slate-600 mb-8">
          당신의 점수는 <span className="font-bold text-blue-600 text-2xl">{score}</span>점 입니다.
        </p>
        <button
          onClick={handleRestart}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  // Defeat State - Requires Manual Action
  if (feedback?.type === 'error') {
     return (
       <div className="max-w-2xl mx-auto py-12 text-center animate-fade-in">
         <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 shadow-lg">
           <DynamicIcon name="AlertTriangle" className="w-20 h-20 text-red-500 mx-auto mb-6" />
           <h2 className="text-3xl font-bold text-red-600 mb-4">성벽이 함락되었습니다!</h2>
           <p className="text-lg text-slate-700 mb-8">
             "{currentScenario.title}" 공격은 현재 선택한 기사로는 막을 수 없습니다.<br/>
             정보 보호 개념을 다시 학습하고 돌아오세요.
           </p>
           
           <div className="flex gap-4 justify-center">
              <button
                onClick={() => setFeedback(null)}
                className="px-6 py-3 rounded-lg border-2 border-slate-300 text-slate-600 font-bold hover:bg-slate-100 transition-colors"
              >
                다시 시도
              </button>
              <button
                onClick={() => onNavigate(Tab.CONCEPT)}
                className="px-6 py-3 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-md flex items-center gap-2"
              >
                <DynamicIcon name="BookOpen" size={20}/>
                개념 학습하러 가기
              </button>
           </div>
         </div>
       </div>
     );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-2 rounded-lg">
            <span className="font-bold text-slate-500 text-sm">LEVEL</span>
            <span className="block text-xl font-bold text-slate-800">{currentScenarioIndex + 1} / {selectedScenarioIndices.length}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="font-bold text-slate-500 text-sm">SCORE</span>
          <span className="block text-xl font-bold text-blue-600">{score}</span>
        </div>
      </div>

      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
        {/* Scenario Header */}
        <div className="bg-slate-900 text-white p-6 text-center">
          <div className="flex justify-center mb-4">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              WARNING: ATTACK DETECTED
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-2">{currentScenario.title}</h3>
          <p className="text-slate-300 max-w-2xl mx-auto">{currentScenario.description}</p>
        </div>

        {/* Action Area */}
        <div className="flex-1 p-8 bg-slate-50 flex flex-col items-center justify-center">
            {feedback?.type === 'success' ? (
                <div className="text-center animate-bounce-in">
                    <DynamicIcon name="CheckCircle" className="w-24 h-24 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-green-600">{feedback.message}</h3>
                </div>
            ) : (
                <>
                    <p className="text-center text-slate-500 mb-8 font-medium">
                        성주님, 어떤 기사를 내보내어 이 공격을 막겠습니까?
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        {KNIGHTS.map((knight) => (
                        <button
                            key={knight.id}
                            onClick={() => handleDefense(knight.id)}
                            className="group bg-white p-6 rounded-xl shadow-md border-2 border-transparent hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
                        >
                            <div className={`${knight.color} p-4 rounded-full mb-4 group-hover:scale-110 transition-transform`}>
                                <DynamicIcon name={knight.iconName} className="text-white w-8 h-8" />
                            </div>
                            <h4 className="font-bold text-lg text-slate-800">{knight.koreanName}</h4>
                            <span className="text-xs text-slate-400 mt-1">{knight.id}</span>
                        </button>
                        ))}
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};
