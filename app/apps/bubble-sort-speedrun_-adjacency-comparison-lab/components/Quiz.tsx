import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_POOL } from '../constants';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';

interface QuizProps {
  onComplete: (score: number, wrongIds: number[]) => void;
  mistakeNoteIds: number[];
}

const Quiz: React.FC<QuizProps> = ({ onComplete, mistakeNoteIds }) => {
  const [currentStep, setCurrentStep] = useState<'SETUP' | 'QUIZ' | 'RESULT'>('SETUP');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState<number[]>([]);
  
  const startQuiz = (difficulty: 'ALL' | 'EASY' | 'MEDIUM' | 'HARD' | 'MISTAKE') => {
    let filtered: QuizQuestion[] = [];
    
    if (difficulty === 'MISTAKE') {
      filtered = QUIZ_POOL.filter(q => mistakeNoteIds.includes(q.id));
      if (filtered.length === 0) {
        alert("오답노트에 문제가 없습니다! 훌륭합니다.");
        return;
      }
    } else if (difficulty === 'ALL') {
      filtered = [...QUIZ_POOL].sort(() => 0.5 - Math.random()).slice(0, 5);
    } else {
      filtered = QUIZ_POOL.filter(q => q.difficulty === difficulty).sort(() => 0.5 - Math.random()).slice(0, 5);
    }

    setQuestions(filtered);
    setCurrentIndex(0);
    setScore(0);
    setWrongQuestions([]);
    setShowFeedback(false);
    setSelectedAnswer('');
    setCurrentStep('QUIZ');
  };

  const handleAnswer = () => {
    if (!selectedAnswer) return;
    
    const currentQ = questions[currentIndex];
    const isCorrect = selectedAnswer.trim().toLowerCase() === currentQ.correctAnswer.toLowerCase();
    
    if (isCorrect) {
      setScore(prev => prev + 10); // 10 points per question
    } else {
      setWrongQuestions(prev => [...prev, currentQ.id]);
    }
    
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setCurrentStep('RESULT');
    onComplete(score, wrongQuestions);
  };

  if (currentStep === 'SETUP') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-900">퀴즈 도전</h2>
        <div className="grid gap-4">
            <button onClick={() => startQuiz('EASY')} className="p-4 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-emerald-800 font-bold text-left transition-all">
                🌱 초급 (Easy)
                <span className="block text-sm font-normal text-emerald-600 mt-1">기본적인 비교와 교환 개념 확인</span>
            </button>
            <button onClick={() => startQuiz('MEDIUM')} className="p-4 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-indigo-800 font-bold text-left transition-all">
                🌿 중급 (Medium)
                <span className="block text-sm font-normal text-indigo-600 mt-1">회전 수, 비교 횟수 계산 등 심화</span>
            </button>
            <button onClick={() => startQuiz('HARD')} className="p-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-rose-800 font-bold text-left transition-all">
                🔥 고급 (Hard)
                <span className="block text-sm font-normal text-rose-600 mt-1">복잡도와 알고리즘 특성 완벽 이해</span>
            </button>
            <button onClick={() => startQuiz('MISTAKE')} className="p-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-800 font-bold text-left transition-all flex justify-between items-center">
                <span>📓 오답 노트 복습</span>
                <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded-full">{mistakeNoteIds.length} 문제</span>
            </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'RESULT') {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg border border-slate-200 text-center">
        <div className="mb-6">
            {score >= (questions.length * 10) * 0.8 ? (
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={40} />
                </div>
            ) : (
                <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={40} />
                </div>
            )}
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{score}점</h2>
            <p className="text-slate-500">총 {questions.length}문제 중 {score / 10}문제 정답</p>
        </div>
        <button 
            onClick={() => setCurrentStep('SETUP')}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
        >
            <RefreshCw size={18} /> 다시 도전하기
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-slate-200 min-h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <span className={`px-2 py-1 rounded text-xs font-bold 
            ${currentQ.difficulty === 'EASY' ? 'bg-emerald-100 text-emerald-700' : 
              currentQ.difficulty === 'MEDIUM' ? 'bg-indigo-100 text-indigo-700' : 
              'bg-rose-100 text-rose-700'}`}>
            {currentQ.difficulty}
        </span>
        <span className="text-slate-400 font-mono text-sm">
            Q {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
        {currentQ.question}
      </h3>

      <div className="flex-1 space-y-3">
        {currentQ.type === 'MULTIPLE_CHOICE' ? (
            currentQ.options.map((opt, idx) => (
                <button
                    key={idx}
                    onClick={() => !showFeedback && setSelectedAnswer(opt)}
                    disabled={showFeedback}
                    className={`w-full p-4 rounded-lg border text-left transition-all
                        ${showFeedback && opt === currentQ.correctAnswer ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : ''}
                        ${showFeedback && opt === selectedAnswer && opt !== currentQ.correctAnswer ? 'bg-rose-50 border-rose-500' : ''}
                        ${!showFeedback && selectedAnswer === opt ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 hover:bg-slate-50'}
                    `}
                >
                    {opt}
                </button>
            ))
        ) : (
            <input 
                type="text"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={showFeedback}
                placeholder="답안을 입력하세요"
                className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
        )}
      </div>

      {showFeedback && (
        <div className={`mt-6 p-4 rounded-lg border-l-4 ${isCorrect ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'}`}>
            <div className="flex items-center gap-2 font-bold mb-1">
                {isCorrect ? <><CheckCircle size={18} className="text-emerald-600"/> 정답입니다!</> : <><XCircle size={18} className="text-rose-600"/> 틀렸습니다.</>}
            </div>
            <p className="text-sm text-slate-600 mt-2">{currentQ.explanation}</p>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        {!showFeedback ? (
            <button 
                onClick={handleAnswer}
                disabled={!selectedAnswer}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
            >
                제출하기
            </button>
        ) : (
            <button 
                onClick={nextQuestion}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition-colors flex items-center gap-2"
            >
                다음 문제 <ArrowRight size={16} />
            </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;