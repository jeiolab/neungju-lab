import React, { useState, useEffect } from 'react';
import { GameCard, RiskLevel, Channel, Difficulty } from '../types';
import { GAME_CARDS } from '../constants';
import { ArrowRight, AlertTriangle, ShieldCheck, HelpCircle, XCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  onScoreUpdate: (xp: number, isCorrect: boolean, tags: string[]) => void;
  isSchoolMode: boolean;
}

const TabGame: React.FC<Props> = ({ onScoreUpdate, isSchoolMode }) => {
  const [currentCards, setCurrentCards] = useState<GameCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'feedback' | 'finished'>('playing');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [result, setResult] = useState<{
    correctRisk: boolean;
    correctReasonsCount: number;
    scoreEarned: number;
  } | null>(null);

  // Initialize Game
  useEffect(() => {
    startNewGame();
  }, [isSchoolMode]);

  const startNewGame = () => {
    let pool = [...GAME_CARDS];
    if (isSchoolMode) {
      pool = pool.filter(c => c.channel === '단톡' || c.sender.includes('선생님') || c.text.includes('학교'));
    }
    // Shuffle and pick 6
    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, 6);
    setCurrentCards(shuffled);
    setCurrentIndex(0);
    setGameStatus('playing');
    resetTurn();
  };

  const resetTurn = () => {
    setSelectedRisk(null);
    setSelectedReasons([]);
    setResult(null);
    setGameStatus('playing');
  };

  const handleReasonToggle = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(prev => prev.filter(r => r !== reason));
    } else {
      setSelectedReasons(prev => [...prev, reason]);
    }
  };

  const submitAnswer = () => {
    if (!selectedRisk || selectedReasons.length === 0) {
      alert("위험도와 이유를 최소 1개 이상 선택해주세요!");
      return;
    }

    const card = currentCards[currentIndex];
    const isRiskCorrect = selectedRisk === card.riskLabel;
    
    // Check reasons overlap
    const correctReasons = card.redFlags;
    const matchedReasons = selectedReasons.filter(r => correctReasons.includes(r));
    const isBonus = matchedReasons.length >= 2 || (card.redFlags.length < 2 && matchedReasons.length === card.redFlags.length);

    let score = 0;
    if (isRiskCorrect) score += 10;
    if (isRiskCorrect && isBonus) score += 5;

    setResult({
      correctRisk: isRiskCorrect,
      correctReasonsCount: matchedReasons.length,
      scoreEarned: score
    });

    onScoreUpdate(score, isRiskCorrect, card.conceptTags);
    setGameStatus('feedback');
  };

  const nextCard = () => {
    if (currentIndex < currentCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetTurn();
    } else {
      setGameStatus('finished');
    }
  };

  if (currentCards.length === 0) return <div className="text-center p-10">로딩 중...</div>;
  if (gameStatus === 'finished') {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">훈련 완료!</h2>
        <p className="text-slate-600 mb-6">오늘의 탐정 활동을 성공적으로 마쳤습니다.</p>
        <button 
          onClick={startNewGame}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  const card = currentCards[currentIndex];

  return (
    <div className="max-w-md mx-auto pb-10">
      {/* Progress Bar */}
      <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
        <span>CASE {currentIndex + 1}/{currentCards.length}</span>
        <span className={`${card.difficulty === '도전' ? 'text-red-500' : 'text-blue-500'}`}>{card.difficulty} 난이도</span>
      </div>
      <div className="w-full bg-slate-200 h-2 rounded-full mb-6">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex) / currentCards.length) * 100}%` }}
        ></div>
      </div>

      {/* Message Card UI */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden mb-6">
        <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
            <span className="font-bold text-slate-700 flex items-center gap-2">
                {card.channel === '문자' && <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded">SMS</span>}
                {card.channel === 'DM' && <span className="bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded">DM</span>}
                {card.channel === '단톡' && <span className="bg-yellow-400 text-white text-[10px] px-1.5 py-0.5 rounded">KaTalk</span>}
                {card.sender}
            </span>
            <span className="text-xs text-slate-400">방금 전</span>
        </div>
        <div className="p-6">
            <p className="text-slate-800 text-lg leading-relaxed whitespace-pre-line font-medium">
                {card.text}
            </p>
        </div>
      </div>

      {/* Game Controls - Playing State */}
      {gameStatus === 'playing' && (
        <div className="space-y-6 animate-fade-in">
          {/* Risk Selection */}
          <div className="grid grid-cols-3 gap-3">
            {(['안전', '조건부', '위험'] as RiskLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedRisk(level)}
                className={`py-3 rounded-xl font-bold border-2 transition-all ${
                  selectedRisk === level
                    ? level === '안전' ? 'bg-green-100 border-green-500 text-green-700'
                    : level === '위험' ? 'bg-red-100 border-red-500 text-red-700'
                    : 'bg-yellow-100 border-yellow-500 text-yellow-700'
                    : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Reason Selection */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">판단 근거 (복수 선택)</h3>
            <div className="grid grid-cols-1 gap-2">
              {card.allReasons.map((reason, idx) => (
                <button
                  key={idx}
                  onClick={() => handleReasonToggle(reason)}
                  className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${
                    selectedReasons.includes(reason)
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-slate-50 text-slate-600 border border-transparent hover:bg-slate-100'
                  }`}
                >
                  {reason}
                  {selectedReasons.includes(reason) && <CheckCircle2 size={16} />}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={submitAnswer}
            disabled={!selectedRisk || selectedReasons.length === 0}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
          >
            판결 내리기
          </button>
        </div>
      )}

      {/* Feedback State */}
      {gameStatus === 'feedback' && result && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                {result.correctRisk ? (
                    <div className="text-green-600 flex items-center font-bold text-xl">
                        <CheckCircle2 className="mr-2" size={28} /> 정답!
                    </div>
                ) : (
                    <div className="text-red-500 flex items-center font-bold text-xl">
                        <XCircle className="mr-2" size={28} /> 오답
                    </div>
                )}
            </div>
            {result.scoreEarned > 0 && (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                    +{result.scoreEarned} XP
                </span>
            )}
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-xl text-sm">
                <p className="font-bold text-slate-700 mb-1">🧐 탐정 노트</p>
                <p className="text-slate-600">{card.explanation}</p>
            </div>

            <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">놓친 의심 신호 (Red Flags)</p>
                <div className="flex flex-wrap gap-2">
                    {card.redFlags.map(flag => (
                        <span key={flag} className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-bold border border-red-100">
                            {flag}
                        </span>
                    ))}
                </div>
            </div>

             <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <p className="font-bold text-indigo-800 text-sm mb-1 flex items-center">
                    <ShieldCheck size={16} className="mr-1"/> 행동 지침
                </p>
                <p className="text-indigo-700 text-sm font-medium">{card.bestAction}</p>
            </div>
          </div>

          <button
            onClick={nextCard}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            다음 사건으로 <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TabGame;