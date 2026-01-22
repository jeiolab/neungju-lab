import React, { useState } from 'react';
import { SCENARIOS } from '../constants';
import { TechType } from '../types';
import { User, Briefcase, Coins, CheckCircle, XCircle, ArrowRight, Activity, ShieldCheck } from 'lucide-react';

interface ConsultationGameProps {
  onGameComplete: (score: number) => void;
}

const ConsultationGame: React.FC<ConsultationGameProps> = ({ onGameComplete }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedTech, setSelectedTech] = useState<TechType | null>(null);
  const [budget, setBudget] = useState(50); // 0 to 100
  const [gameState, setGameState] = useState<'briefing' | 'decision' | 'result' | 'end'>('briefing');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const scenario = SCENARIOS[currentScenarioIndex];

  const handleTechSelect = (tech: TechType) => {
    setSelectedTech(tech);
  };

  const calculateScore = () => {
    let turnScore = 0;
    let turnFeedback = '';

    // 1. Tech Check
    const isCorrectTech = selectedTech === scenario.correctTech || (scenario.correctTech === 'hybrid' && (selectedTech === 'symmetric' || selectedTech === 'asymmetric'));
    
    // Special handling for Hybrid scenario (Bank)
    if (scenario.correctTech === 'hybrid') {
        if (selectedTech === 'hybrid') {
            turnScore += 50;
            turnFeedback = "완벽합니다! 하이브리드 방식이 가장 적합합니다.";
        } else {
             // Partial credit for components of hybrid
             turnScore += 20;
             turnFeedback = "나쁘지 않지만, 속도와 보안 두 마리 토끼를 다 잡으려면 '하이브리드' 방식이 더 좋습니다.";
        }
    } else if (selectedTech === scenario.correctTech) {
      turnScore += 50;
      turnFeedback = "정확한 기술 선택입니다!";
    } else {
      turnFeedback = "기술 선택이 아쉽습니다. 의뢰인의 요구사항을 다시 확인하세요.";
    }

    // 2. Budget Check
    // Low sensitivity: Wants high budget/quality.
    // High sensitivity: Wants low budget.
    let budgetScore = 0;
    if (scenario.budgetSensitivity === 'low') {
      if (budget >= 70) budgetScore = 20;
      else if (budget >= 40) budgetScore = 10;
      else {
        budgetScore = 0;
        turnFeedback += " (예산이 너무 적어 보안 시스템 구축에 실패할 뻔했습니다.)";
      }
    } else if (scenario.budgetSensitivity === 'high') {
      if (budget <= 40) budgetScore = 20;
      else if (budget <= 70) budgetScore = 10;
      else {
        budgetScore = 0;
        turnFeedback += " (필요 이상으로 비싼 장비를 구매하여 예산을 낭비했습니다.)";
      }
    } else {
      // Medium
      if (budget >= 30 && budget <= 80) budgetScore = 20;
      else budgetScore = 10;
    }

    turnScore += budgetScore;

    // Apply Score
    setScore(prev => prev + turnScore);
    setFeedback(`${turnFeedback} ${scenario.explanation}`);
    setGameState('result');
    
    const resultLog = `의뢰인 ${scenario.client}: ${turnScore}점 획득. (${selectedTech} 선택, 예산 ${budget}%)`;
    setHistory(prev => [...prev, resultLog]);
  };

  const nextScenario = () => {
    if (currentScenarioIndex + 1 < SCENARIOS.length) {
      setCurrentScenarioIndex(prev => prev + 1);
      setSelectedTech(null);
      setBudget(50);
      setGameState('briefing');
    } else {
      setGameState('end');
      onGameComplete(score);
    }
  };

  if (gameState === 'end') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <ShieldCheck className="w-24 h-24 text-indigo-600 mb-6" />
        <h2 className="text-3xl font-bold text-slate-900 mb-4">모든 의뢰 완료!</h2>
        <p className="text-xl text-slate-700 mb-8">당신의 최종 보안 점수는 <span className="text-indigo-600 font-bold">{score}점</span> 입니다.</p>
        <div className="bg-white border border-slate-200 shadow-lg p-6 rounded-xl text-left max-w-md w-full mb-8">
          <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">활동 기록</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            {history.map((log, idx) => <li key={idx} className="p-2 bg-slate-50 rounded">{log}</li>)}
          </ul>
        </div>
        <p className="text-slate-600 animate-pulse">상단의 '가이드북' 탭을 눌러 나만의 요약집을 생성해보세요!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6 bg-white border border-slate-200 shadow-sm p-4 rounded-xl">
        <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-full shadow-sm"><User className="text-white" /></div>
            <div>
                <p className="text-xs text-slate-500">의뢰인</p>
                <p className="font-bold text-slate-900">{scenario.client}</p>
            </div>
        </div>
        <div className="text-right">
             <p className="text-xs text-slate-500">현재 점수</p>
             <p className="font-bold text-indigo-600 text-xl">{score} 점</p>
        </div>
      </div>

      {gameState === 'briefing' && (
        <div className="bg-white border border-slate-200 shadow-lg p-8 rounded-xl">
           <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-indigo-600" /> 의뢰 내용
           </h2>
           <p className="text-lg text-slate-700 leading-relaxed mb-6 bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
             "{scenario.description}"
           </p>
           
           <div className="grid grid-cols-3 gap-4 mb-8">
             <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
                <span className="block text-xs text-slate-600 mb-1 font-medium">보안성 요구</span>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${scenario.reqSecurity * 10}%` }}></div>
                </div>
             </div>
             <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
                <span className="block text-xs text-slate-600 mb-1 font-medium">속도 요구</span>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${scenario.reqSpeed * 10}%` }}></div>
                </div>
             </div>
             <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
                <span className="block text-xs text-slate-600 mb-1 font-medium">편의성 요구</span>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${scenario.reqConvenience * 10}%` }}></div>
                </div>
             </div>
           </div>

           <button 
             onClick={() => setGameState('decision')}
             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-sm"
           >
             솔루션 설계 시작 <ArrowRight className="w-5 h-5" />
           </button>
        </div>
      )}

      {gameState === 'decision' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tech Selection */}
            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-xl">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">1. 기술 선택</h3>
                <div className="space-y-3">
                    {['symmetric', 'asymmetric', 'hash', 'hybrid'].map((tech) => (
                        <button
                            key={tech}
                            onClick={() => handleTechSelect(tech as TechType)}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${
                                selectedTech === tech 
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm' 
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700 hover:border-indigo-300'
                            }`}
                        >
                            <span className="font-bold block mb-1">
                                {tech === 'symmetric' && '대칭키 암호화'}
                                {tech === 'asymmetric' && '공개키 암호화'}
                                {tech === 'hash' && '해시 함수'}
                                {tech === 'hybrid' && '하이브리드 (대칭+공개)'}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Budget Allocation */}
            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-xl flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">2. 자원 배분 (예산/시간)</h3>
                    <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg mb-4 text-center">
                        <Coins className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                        <span className="text-3xl font-bold text-slate-900">{budget}</span>
                        <span className="text-sm text-slate-600 block mt-1 font-medium">
                            {budget < 30 ? '저예산 / 신속' : budget > 70 ? '고예산 / 정밀' : '균형 잡힘'}
                        </span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={budget} 
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                        <span>절약 중심</span>
                        <span>품질 중심</span>
                    </div>
                </div>

                <button 
                    onClick={calculateScore}
                    disabled={!selectedTech}
                    className={`w-full py-4 rounded-lg font-bold mt-6 transition-all ${
                        selectedTech 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transform hover:-translate-y-0.5' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    결재 상신 (제출)
                </button>
            </div>
        </div>
      )}

      {gameState === 'result' && (
        <div className="bg-white border border-slate-200 shadow-lg p-8 rounded-xl text-center animate-fade-in-up">
            <div className="mb-6">
                 {feedback.includes('아쉽습니다') || feedback.includes('실패') 
                 ? <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" /> 
                 : <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />}
                 
                 <h3 className="text-2xl font-bold text-slate-900 mb-2">결과 리포트</h3>
                 <p className="text-slate-700">{feedback}</p>
            </div>
            
            <div className="flex justify-center">
                <button 
                    onClick={nextScenario}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-all flex items-center gap-2 shadow-sm"
                >
                    {currentScenarioIndex + 1 < SCENARIOS.length ? '다음 의뢰 받기' : '최종 결과 보기'} <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationGame;