import React, { useState, useEffect } from 'react';
import { Brain, Check, X, Trophy, RefreshCw, Timer } from 'lucide-react';
import { QUIZ_DATA, OX_QUIZ_DATA } from '../constants';
import { QuizQuestion } from '../types';

const QuizTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'main' | 'ox'>('main');

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-gray-200 pb-2">
        <button 
          onClick={() => setActiveSubTab('main')}
          className={`px-4 py-2 font-bold transition-colors ${activeSubTab === 'main' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          개념 퀴즈
        </button>
        <button 
          onClick={() => setActiveSubTab('ox')}
          className={`px-4 py-2 font-bold transition-colors ${activeSubTab === 'ox' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          5초 O/X 챌린지
        </button>
      </div>

      {activeSubTab === 'main' ? <MainQuiz /> : <OXChallenge />}
    </div>
  );
};

const MainQuiz: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = QUIZ_DATA[currentQIndex];

  const handleAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    const correct = idx === question.correctIndex;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentQIndex + 1 < QUIZ_DATA.length) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 text-center animate-fade-in shadow-lg">
        <Trophy className="w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">퀴즈 완료!</h2>
        <p className="text-gray-600 mb-6">당신의 점수는 <span className="text-blue-600 text-xl font-bold">{score} / {QUIZ_DATA.length}</span> 입니다.</p>
        <button onClick={resetQuiz} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold transition">
          <RefreshCw className="w-4 h-4" /> 다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-lg max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-blue-600 font-mono text-sm">Question {currentQIndex + 1} / {QUIZ_DATA.length}</span>
        <span className="text-gray-500 text-sm">Score: {score}</span>
      </div>
      
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 leading-relaxed whitespace-pre-wrap">{question.question}</h3>
      
      <div className="space-y-3">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            disabled={selectedOption !== null}
            className={`w-full p-4 text-left rounded-lg border transition-all flex items-center justify-between group
              ${selectedOption === null 
                ? 'bg-gray-50 border-gray-300 hover:border-blue-500 hover:bg-blue-50' 
                : idx === question.correctIndex
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : selectedOption === idx
                    ? 'bg-red-50 border-red-500 text-red-600'
                    : 'bg-gray-50 border-gray-300 opacity-50'
              }
            `}
          >
            <span>{opt}</span>
            {selectedOption !== null && idx === question.correctIndex && <Check className="w-5 h-5" />}
            {selectedOption === idx && idx !== question.correctIndex && <X className="w-5 h-5" />}
          </button>
        ))}
      </div>

      {selectedOption !== null && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
          <p className={`font-bold mb-2 ${isCorrect ? 'text-green-700' : 'text-red-600'}`}>
            {isCorrect ? '정답입니다!' : '아쉽네요.'}
          </p>
          <p className="text-gray-700 text-sm">{question.explanation}</p>
          <button 
            onClick={nextQuestion}
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-500 transition w-full md:w-auto"
          >
            {currentQIndex + 1 === QUIZ_DATA.length ? '결과 보기' : '다음 문제'}
          </button>
        </div>
      )}
    </div>
  );
};

const OXChallenge: React.FC = () => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'end'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Fix: Use ReturnType<typeof setTimeout> instead of NodeJS.Timeout to avoid namespace error
    let timer: ReturnType<typeof setTimeout>;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleAnswer(null); // Timeout treated as wrong
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState]);

  const startGame = () => {
    setGameState('playing');
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(5);
  };

  const handleAnswer = (userAnswer: boolean | null) => {
    const isCorrect = userAnswer === OX_QUIZ_DATA[currentIndex].a;
    if (isCorrect) setScore(s => s + 1);

    if (currentIndex + 1 < OX_QUIZ_DATA.length) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(5);
    } else {
      setGameState('end');
    }
  };

  if (gameState === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200 text-center shadow-lg">
        <Timer className="w-16 h-16 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">5초 스피드 O/X 퀴즈</h2>
        <p className="text-gray-600 mb-6">한 문제당 5초가 주어집니다. <br/>순발력을 발휘해 보세요!</p>
        <button onClick={startGame} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-bold hover:scale-105 transition transform">
          도전 시작!
        </button>
      </div>
    );
  }

  if (gameState === 'end') {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200 text-center shadow-lg">
        <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">챌린지 종료</h2>
        <p className="text-xl mb-6">최종 점수: <span className="text-blue-600 font-bold">{score}</span> / {OX_QUIZ_DATA.length}</p>
        <button onClick={startGame} className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-bold transition">
          <RefreshCw className="w-4 h-4" /> 다시하기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 text-center max-w-2xl mx-auto relative overflow-hidden shadow-lg">
      <div className="absolute top-0 left-0 h-2 bg-blue-600 transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / 5) * 100}%` }}></div>
      
      <div className="flex justify-between text-sm text-gray-500 mb-8 mt-2">
        <span>Q {currentIndex + 1} / {OX_QUIZ_DATA.length}</span>
        <span className={`font-bold ${timeLeft <= 2 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>{timeLeft}초 남음</span>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-12 min-h-[80px] flex items-center justify-center">
        {OX_QUIZ_DATA[currentIndex].q}
      </h3>

      <div className="flex gap-4 justify-center">
        <button onClick={() => handleAnswer(true)} className="w-32 h-32 rounded-full border-4 border-blue-500 text-blue-600 text-5xl font-bold hover:bg-blue-500 hover:text-white transition flex items-center justify-center">O</button>
        <button onClick={() => handleAnswer(false)} className="w-32 h-32 rounded-full border-4 border-red-500 text-red-600 text-5xl font-bold hover:bg-red-500 hover:text-white transition flex items-center justify-center">X</button>
      </div>
    </div>
  );
};

export default QuizTab;