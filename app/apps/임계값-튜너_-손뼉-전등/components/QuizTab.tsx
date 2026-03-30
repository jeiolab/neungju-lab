import React, { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { QUIZ_DATA } from '../constants';
import * as storageService from '../services/storageService';

const QuizTab: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [history, setHistory] = useState<boolean[]>([]);

  const handleOptionClick = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
    setShowResult(true);

    const isCorrect = idx === QUIZ_DATA[currentQuestionIdx].answer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setHistory(prev => [...prev, isCorrect]);
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < QUIZ_DATA.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
      storageService.saveQuizScore(score + (showResult && selectedOption === QUIZ_DATA[currentQuestionIdx].answer ? 1 : 0));
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setQuizFinished(false);
    setHistory([]);
  };

  if (quizFinished) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">퀴즈 종료!</h2>
        <div className="text-6xl font-bold text-indigo-600 mb-6">{score} / {QUIZ_DATA.length}</div>
        <p className="text-slate-600 mb-8">
          {score === QUIZ_DATA.length ? "완벽합니다! 개념을 완전히 마스터하셨네요." : "오답노트를 확인하고 다시 도전해보세요."}
        </p>
        
        <div className="flex justify-center gap-4">
             <button 
                onClick={resetQuiz}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
            >
                <RefreshCw size={20} /> 다시 풀기
            </button>
        </div>
      </div>
    );
  }

  const question = QUIZ_DATA[currentQuestionIdx];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-slate-500">Question {currentQuestionIdx + 1} / {QUIZ_DATA.length}</span>
        <span className="text-sm font-bold text-indigo-600">점수: {score}</span>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium ";
            
            if (showResult) {
               if (idx === question.answer) btnClass += "border-green-500 bg-green-50 text-green-700";
               else if (idx === selectedOption) btnClass += "border-red-500 bg-red-50 text-red-700";
               else btnClass += "border-slate-100 text-slate-400";
            } else {
               btnClass += "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-700";
            }

            return (
              <button 
                key={idx} 
                onClick={() => handleOptionClick(idx)}
                disabled={showResult}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && idx === question.answer && <CheckCircle size={20} className="text-green-600" />}
                    {showResult && idx === selectedOption && idx !== question.answer && <XCircle size={20} className="text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showResult && (
        <div className="bg-slate-100 p-6 rounded-xl animate-fade-in mb-6">
           <h4 className="font-bold text-slate-800 mb-2">💡 해설</h4>
           <p className="text-slate-600">{question.explanation}</p>
        </div>
      )}

      {showResult && (
        <div className="flex justify-end">
          <button 
            onClick={nextQuestion}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg"
          >
            {currentQuestionIdx === QUIZ_DATA.length - 1 ? "결과 보기" : "다음 문제"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizTab;