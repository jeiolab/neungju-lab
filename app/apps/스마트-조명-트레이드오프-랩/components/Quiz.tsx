import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, BookOpen, AlertCircle } from 'lucide-react';
import { QUIZ_DATA } from '../constants';
import { QuizResult, QuizQuestion } from '../types';

interface QuizProps {
  onComplete: (result: QuizResult) => void;
  wrongNotes: number[];
}

const Quiz: React.FC<QuizProps> = ({ onComplete, wrongNotes }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(QUIZ_DATA.length).fill(-1));
  const [showResult, setShowResult] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'wrong'>('all');

  const questions = filterMode === 'wrong' 
    ? QUIZ_DATA.filter(q => wrongNotes.includes(q.id))
    : QUIZ_DATA;

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    // Reset when toggling modes
    setCurrentQuestionIndex(0);
    setAnswers(new Array(questions.length).fill(-1));
    setShowResult(false);
  }, [filterMode, questions.length]);

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
        <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-slate-800">오답 노트가 비어있습니다!</h3>
        <p className="text-slate-600 mt-2">모든 문제를 완벽하게 이해하셨군요.</p>
        <button 
          onClick={() => setFilterMode('all')}
          className="mt-6 text-indigo-600 font-medium hover:underline"
        >
          전체 퀴즈 다시 풀기
        </button>
      </div>
    );
  }

  const handleAnswer = (optionIndex: number) => {
    if (showResult) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    let score = 0;
    const wrongIds: number[] = [];
    answers.forEach((ans, idx) => {
      if (ans === questions[idx].correctAnswer) {
        score++;
      } else {
        wrongIds.push(questions[idx].id);
      }
    });
    return { score: (score / questions.length) * 100, wrongIds };
  };

  const handleFinish = () => {
    const { score, wrongIds } = calculateScore();
    setShowResult(true);
    if (filterMode === 'all') { // Only save results for full quiz attempts
        onComplete({
            date: Date.now(),
            score: Math.round(score),
            wrongAnswers: wrongIds
        });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="text-indigo-600" /> 
          {filterMode === 'all' ? 'IoT 시스템 설계 퀴즈' : '오답 노트 복습'}
        </h2>
        <div className="flex gap-2">
            <button 
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 text-sm rounded-full ${filterMode === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
                전체 문제
            </button>
            <button 
                onClick={() => setFilterMode('wrong')}
                className={`px-3 py-1 text-sm rounded-full ${filterMode === 'wrong' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
                오답만 보기 ({wrongNotes.length})
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2">
          <div 
            className="bg-indigo-600 h-2 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="p-8">
          <div className="flex justify-between text-sm text-slate-500 mb-4">
            <span>문제 {currentQuestionIndex + 1} / {questions.length}</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
              currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
              currentQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {currentQuestion.difficulty}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-6 leading-relaxed">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentQuestionIndex] === idx;
              const isCorrect = idx === currentQuestion.correctAnswer;
              
              let btnClass = "w-full text-left p-4 rounded-lg border transition-all text-slate-700 ";
              
              if (showResult) {
                if (isCorrect) btnClass += "bg-green-50 border-green-500 text-green-800 ";
                else if (isSelected && !isCorrect) btnClass += "bg-red-50 border-red-500 text-red-800 ";
                else btnClass += "border-slate-200 opacity-60 ";
              } else {
                if (isSelected) btnClass += "bg-indigo-50 border-indigo-500 text-indigo-900 ring-1 ring-indigo-500 ";
                else btnClass += "border-slate-200 hover:bg-slate-50 ";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={showResult}
                  className={btnClass}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                        isSelected || (showResult && isCorrect) ? 'border-current font-bold' : 'border-slate-300'
                    }`}>
                        {String.fromCharCode(65 + idx)}
                    </div>
                    {option}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-fadeIn">
              <div className="flex items-start gap-2">
                 <AlertCircle className="text-indigo-600 flex-shrink-0 mt-0.5" size={18} />
                 <div>
                    <span className="font-bold text-slate-800">해설: </span>
                    <span className="text-slate-700">{currentQuestion.explanation}</span>
                 </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            {showResult ? (
                 <div className="flex gap-4 w-full justify-end">
                    {currentQuestionIndex < questions.length - 1 ? (
                         <button 
                         onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                         className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
                       >
                         다음 문제
                       </button>
                    ) : (
                        <button 
                        onClick={() => {
                            setAnswers(new Array(questions.length).fill(-1));
                            setCurrentQuestionIndex(0);
                            setShowResult(false);
                        }}
                        className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900"
                      >
                        <RefreshCw size={18} /> 다시 풀기
                      </button>
                    )}
                 </div>
            ) : (
                <button
                onClick={handleNext}
                disabled={answers[currentQuestionIndex] === -1}
                className="ml-auto px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestionIndex === questions.length - 1 ? '채점하기' : '다음'}
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
