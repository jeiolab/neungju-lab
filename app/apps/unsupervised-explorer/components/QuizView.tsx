import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizResult } from '../types';
import { QUIZ_DATA } from '../constants';
import { Check, X, AlertCircle, RefreshCcw, BookOpen } from 'lucide-react';

interface QuizViewProps {
  onProgress: (correctCount: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ onProgress }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>(() => {
    const saved = localStorage.getItem('quizHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [wrongMode, setWrongMode] = useState(false); // Mode to view wrong answer note

  const currentQuestion = QUIZ_DATA[currentQuestionIndex];

  useEffect(() => {
    // Save history whenever it updates
    localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
    const correctCount = quizHistory.filter(q => q.isCorrect).length;
    onProgress(correctCount);
  }, [quizHistory, onProgress]);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctAnswer;
    
    // Update history, avoiding duplicates for the same session/question logic if strictly needed,
    // but here we just append result for simplicity or update existing
    setQuizHistory(prev => {
      const filtered = prev.filter(p => p.questionId !== currentQuestion.id);
      return [...filtered, { questionId: currentQuestion.id, isCorrect, timestamp: Date.now() }];
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < QUIZ_DATA.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetState();
    } else {
      // Quiz Finished logic could go here
      alert("모든 문제를 풀었습니다! 오답 노트를 확인해보세요.");
    }
  };

  const resetState = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === '하') return 'bg-emerald-100 text-emerald-700';
    if (diff === '중') return 'bg-amber-100 text-amber-700';
    return 'bg-rose-100 text-rose-700';
  };

  // Wrong Answer Note View
  const renderWrongNote = () => {
    const wrongAnswers = quizHistory.filter(h => !h.isCorrect);
    const wrongQuestions = QUIZ_DATA.filter(q => wrongAnswers.some(w => w.questionId === q.id));

    if (wrongQuestions.length === 0) {
      return (
        <div className="text-center p-12 bg-white rounded-2xl border border-slate-100">
          <div className="inline-flex p-4 bg-green-50 rounded-full mb-4">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">틀린 문제가 없어요!</h3>
          <p className="text-slate-500 mt-2">완벽합니다. 모든 퀴즈를 맞추셨어요.</p>
          <button onClick={() => setWrongMode(false)} className="mt-6 px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg">
            퀴즈로 돌아가기
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-rose-500" /> 오답 노트
          </h3>
          <button onClick={() => setWrongMode(false)} className="text-sm text-slate-500 hover:text-slate-800">
            ← 퀴즈로 돌아가기
          </button>
        </div>
        {wrongQuestions.map(q => (
          <div key={q.id} className="bg-white p-6 rounded-xl border-l-4 border-rose-400 shadow-sm">
            <span className={`inline-block px-2 py-1 rounded text-xs font-bold mb-2 ${getDifficultyColor(q.difficulty)}`}>
              난이도 {q.difficulty}
            </span>
            <p className="font-bold text-slate-800 mb-2">Q. {q.question}</p>
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <span className="font-bold">정답:</span> {q.options[q.correctAnswer]}
            </div>
            <div className="mt-2 text-sm text-slate-600">
              <span className="font-bold">해설:</span> {q.explanation}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (wrongMode) return renderWrongNote();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Question</span>
            <div className="text-xl font-bold text-slate-800">
              {currentQuestionIndex + 1} <span className="text-slate-300">/ {QUIZ_DATA.length}</span>
            </div>
          </div>
          <button 
            onClick={() => setWrongMode(true)}
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <BookOpen className="w-4 h-4" /> 오답노트
          </button>
       </div>

       <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getDifficultyColor(currentQuestion.difficulty)}`}>
              {currentQuestion.difficulty}
            </span>
          </div>
          
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-snug">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              let optionClass = "border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
              if (isAnswered) {
                if (index === currentQuestion.correctAnswer) {
                  optionClass = "border-green-500 bg-green-50 text-green-700";
                } else if (index === selectedOption) {
                  optionClass = "border-rose-500 bg-rose-50 text-rose-700";
                } else {
                  optionClass = "border-slate-100 text-slate-400";
                }
              } else if (selectedOption === index) {
                 optionClass = "border-indigo-500 bg-indigo-50";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium ${optionClass}`}
                >
                  <div className="flex justify-between items-center">
                    <span>{option}</span>
                    {isAnswered && index === currentQuestion.correctAnswer && <Check className="w-5 h-5 text-green-600" />}
                    {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && <X className="w-5 h-5 text-rose-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-8 animate-fade-in">
              {selectedOption === currentQuestion.correctAnswer ? (
                 <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <p className="font-bold text-green-800 mb-1">정답입니다! 🎉</p>
                    <p className="text-green-700 text-sm">{currentQuestion.explanation}</p>
                 </div>
              ) : (
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <p className="font-bold text-rose-800 mb-1">아쉽네요!</p>
                  <p className="text-rose-700 text-sm mb-3">다시 한번 생각해보세요.</p>
                  
                  {!showHint ? (
                    <button 
                      onClick={() => setShowHint(true)}
                      className="text-sm text-rose-600 underline font-medium flex items-center gap-1"
                    >
                      <AlertCircle className="w-4 h-4" /> 힌트 보기
                    </button>
                  ) : (
                    <p className="text-sm text-rose-600 bg-white/50 p-2 rounded mt-2">
                      💡 힌트: {currentQuestion.hint}
                    </p>
                  )}
                  
                  <button 
                    onClick={() => {
                        setIsAnswered(false);
                        setSelectedOption(null);
                        setShowHint(false);
                    }}
                    className="mt-4 flex items-center gap-2 text-sm font-bold text-rose-700 hover:text-rose-900"
                  >
                    <RefreshCcw className="w-4 h-4" /> 재도전하기
                  </button>
                </div>
              )}

              {selectedOption === currentQuestion.correctAnswer && (
                 <div className="mt-6 flex justify-end">
                    <button 
                      onClick={nextQuestion}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all transform hover:translate-y-[-2px]"
                    >
                      {currentQuestionIndex < QUIZ_DATA.length - 1 ? '다음 문제' : '결과 보기'}
                    </button>
                 </div>
              )}
            </div>
          )}
       </div>
    </div>
  );
};

export default QuizView;
