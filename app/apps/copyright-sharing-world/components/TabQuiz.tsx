import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { Timer, Trophy, AlertCircle, ArrowRight } from 'lucide-react';

const TabQuiz: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    let timer: any;
    if (started && !finished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && started) {
      setFinished(true);
    }
    return () => clearInterval(timer);
  }, [started, finished, timeLeft]);

  const handleAnswer = (optionIndex: number) => {
    const isCorrect = optionIndex === QUIZ_QUESTIONS[currentQIndex].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
        setCurrentQIndex(prev => prev + 1);
      } else {
        setFinished(true);
      }
    }, 800);
  };

  const startQuiz = () => {
    setStarted(true);
    setFinished(false);
    setScore(0);
    setCurrentQIndex(0);
    setTimeLeft(30);
    setFeedback(null);
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-xl p-8 text-center">
        <Trophy className="w-20 h-20 text-blue-600 mb-6" />
        <h2 className="text-3xl font-bold text-slate-900 mb-4">CCL 스피드 퀴즈</h2>
        <p className="text-slate-600 mb-8 max-w-md">
          아이콘을 보고 의미를 맞추세요! 제한시간 30초 안에 얼마나 많은 문제를 맞출 수 있을까요?
        </p>
        <button 
          onClick={startQuiz}
          className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 shadow-lg hover:scale-105 transition-all"
        >
          도전 시작!
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">퀴즈 종료!</h2>
        <div className="text-6xl font-black text-slate-900 mb-4">{score * 100}점</div>
        <p className="text-slate-600 mb-8">
          총 {QUIZ_QUESTIONS.length}문제 중 {score}문제를 맞췄습니다.
        </p>
        <button 
          onClick={() => setStarted(false)}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700"
        >
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  const currentQ = QUIZ_QUESTIONS[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 bg-slate-100 p-4 rounded-xl">
        <div className="flex items-center gap-2 font-bold text-slate-700">
          <Timer className={timeLeft < 10 ? "text-red-500 animate-pulse" : "text-slate-500"} />
          <span>{timeLeft}초</span>
        </div>
        <div className="text-sm font-medium text-slate-500">
          문제 {currentQIndex + 1} / {QUIZ_QUESTIONS.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border-b-8 border-slate-200 relative overflow-hidden">
        {feedback && (
          <div className={`absolute inset-0 flex items-center justify-center z-10 bg-opacity-90 transition-opacity ${feedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
            {feedback === 'correct' ? (
              <div className="text-white text-4xl font-black animate-bounce">정답! ⭕</div>
            ) : (
              <div className="text-white text-4xl font-black animate-pulse">땡! ❌</div>
            )}
          </div>
        )}

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4 border-4 border-blue-600">
            <span className="text-3xl font-bold text-slate-900">{currentQ.symbol}</span>
          </div>
          <h3 className="text-xl font-bold text-center text-slate-800">{currentQ.question}</h3>
        </div>

        <div className="grid gap-3">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-blue-600 hover:bg-blue-50 transition-all font-medium text-slate-700 group flex items-center justify-between"
            >
              <span>{idx + 1}. {option}</span>
              <ArrowRight className="opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity" size={16} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabQuiz;