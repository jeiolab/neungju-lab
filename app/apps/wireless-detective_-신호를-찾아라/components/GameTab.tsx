import React, { useState, useEffect, useCallback } from 'react';
import { SCENARIOS } from '../constants';
import { Scenario, TechType } from '../types';
import { Wifi, Bluetooth, SmartphoneNfc, Radio, Siren, Clock, Trophy } from 'lucide-react';

export const GameTab: React.FC = () => {
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'ENDED'>('IDLE');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

  const currentScenario: Scenario = SCENARIOS[currentScenarioIndex];

  const startGame = () => {
    setGameState('PLAYING');
    setScore(0);
    setCurrentScenarioIndex(0);
    setTimeLeft(60);
    setFeedback({ message: '', type: null });
  };

  const endGame = useCallback(() => {
    setGameState('ENDED');
  }, []);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, endGame]);

  const handleAnswer = (selectedTech: TechType) => {
    if (feedback.type !== null) return; // Prevent double clicking

    if (selectedTech === currentScenario.correctTech) {
      setScore((prev) => prev + 100);
      setFeedback({ message: '정답입니다! 정확한 분석이군요.', type: 'success' });
      
      setTimeout(() => {
        if (currentScenarioIndex < SCENARIOS.length - 1) {
          setCurrentScenarioIndex((prev) => prev + 1);
          setFeedback({ message: '', type: null });
        } else {
          endGame();
        }
      }, 1500);
    } else {
      const specificFeedback = currentScenario.wrongFeedback[selectedTech] || '그 기술은 이 상황에 맞지 않습니다.';
      setFeedback({ message: `오답! ${specificFeedback}`, type: 'error' });
      setTimeLeft((prev) => Math.max(0, prev - 5)); // Penalty

      setTimeout(() => {
        setFeedback({ message: '', type: null });
      }, 2500);
    }
  };

  if (gameState === 'IDLE') {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-8 animate-fadeIn py-12">
        <div className="relative">
          <div className="absolute -inset-1 bg-amber-200 rounded-full blur-md opacity-50 animate-pulse"></div>
          <div className="bg-white p-6 rounded-full shadow-lg relative z-10">
            <Siren size={64} className="text-amber-500" />
          </div>
        </div>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-800">사건 현장 출동 준비</h2>
          <p className="text-slate-600 max-w-md">
            일상 속에서 발생하는 무선 통신 사건들을 해결하세요.<br/>
            제한 시간 내에 올바른 기술을 찾아내야 합니다.
          </p>
        </div>
        <button
          onClick={startGame}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg shadow-lg shadow-blue-200 transition-all transform hover:scale-105"
        >
          수사 시작
        </button>
      </div>
    );
  }

  if (gameState === 'ENDED') {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fadeIn py-12">
        <Trophy size={64} className="text-amber-400 drop-shadow-md" />
        <h2 className="text-3xl font-bold text-slate-800">수사 종료</h2>
        <div className="text-center space-y-2">
          <p className="text-xl text-slate-500">최종 점수</p>
          <p className="text-5xl font-mono font-bold text-amber-600">{score}점</p>
        </div>
        <p className="text-slate-600 font-medium">
          {score >= 500 ? '전설적인 명탐정이군요!' : score >= 300 ? '훌륭한 수사관입니다.' : '조금 더 훈련이 필요합니다.'}
        </p>
        <button
          onClick={startGame}
          className="px-6 py-2 border border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-500 hover:bg-slate-50 rounded-lg transition-all"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6 animate-fadeIn">
      {/* HUD */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-amber-600 font-mono text-xl font-bold">
          <Clock size={20} />
          <span>{timeLeft}s</span>
        </div>
        <div className="text-slate-500 text-sm font-medium bg-slate-100 px-3 py-1 rounded-full">Case {currentScenarioIndex + 1} / {SCENARIOS.length}</div>
        <div className="font-mono text-xl text-blue-600 font-bold">{score} pts</div>
      </div>

      {/* Scenario Card */}
      <div className="bg-white text-slate-900 p-6 rounded-xl shadow-lg border border-slate-100 relative overflow-hidden min-h-[200px] flex flex-col justify-center">
        <div className="absolute top-0 left-0 w-2 h-full bg-slate-200"></div>
        <h3 className="text-lg font-bold text-slate-400 mb-2 uppercase tracking-widest flex items-center gap-2">
          <Siren size={16} /> 사건 개요
        </h3>
        <p className="text-2xl font-bold mb-4 leading-snug">{currentScenario.situation}</p>
        
        {/* Clue/Feedback Overlay */}
        {feedback.message && (
            <div className={`absolute inset-0 flex items-center justify-center p-6 text-center font-bold text-xl backdrop-blur-sm transition-all shadow-inner ${feedback.type === 'success' ? 'bg-green-100/90 text-green-800' : 'bg-red-100/90 text-red-800'}`}>
                {feedback.message}
            </div>
        )}
      </div>

      <div className="text-center text-slate-500 text-sm italic font-medium">
        단서: {currentScenario.clue}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        {[TechType.WIFI, TechType.BLUETOOTH, TechType.NFC, TechType.RFID].map((tech) => (
          <button
            key={tech}
            onClick={() => handleAnswer(tech)}
            disabled={feedback.type !== null}
            className="h-16 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 border border-slate-200 rounded-lg transition-all text-lg font-semibold text-slate-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {tech === TechType.WIFI && <Wifi size={20} />}
            {tech === TechType.BLUETOOTH && <Bluetooth size={20} />}
            {tech === TechType.NFC && <SmartphoneNfc size={20} />}
            {tech === TechType.RFID && <Radio size={20} />}
            {tech}
          </button>
        ))}
      </div>
    </div>
  );
};