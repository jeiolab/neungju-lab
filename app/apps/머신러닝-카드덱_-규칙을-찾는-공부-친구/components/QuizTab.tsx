import React, { useState } from 'react';
import { QuizQuestion, UserState } from '../types';
import { QUIZ_QUESTIONS, CONCEPTS } from '../constants';
import { Play, Check, X, RefreshCw, AlertCircle } from 'lucide-react';

interface QuizTabProps {
  userState: UserState;
  onQuizComplete: (result: { questionId: string; isCorrect: boolean }[]) => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ userState, onQuizComplete }) => {
  const [mode, setMode] = useState<'menu' | 'quiz' | 'result' | 'wrong_note'>('menu');
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // qId -> answer
  const [results, setResults] = useState<{ questionId: string; isCorrect: boolean }[]>([]);

  const startQuiz = (difficulty: 'easy' | 'normal' | 'hard') => {
    // Filter by difficulty and take random 5 questions (or all if less than 5)
    // For this demo, let's take all matching difficulty to keep it simple, or mix.
    // Requirement says "Total 10 questions" in general, let's pick based on difficulty but mix a bit if needed.
    // Let's strictly follow difficulty for now.
    const questions = QUIZ_QUESTIONS.filter(q => q.difficulty === difficulty);
    // Shuffle
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled);
    setCurrentIndex(0);
    setAnswers({});
    setResults([]);
    setMode('quiz');
  };

  const handleAnswer = (option: string) => {
    const q = currentQuestions[currentIndex];
    setAnswers(prev => ({ ...prev, [q.id]: option }));
  };

  const nextQuestion = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const newResults = currentQuestions.map(q => ({
      questionId: q.id,
      isCorrect: answers[q.id] === q.correctAnswer
    }));
    setResults(newResults);
    onQuizComplete(newResults);
    setMode('result');
  };

  const getConceptName = (id: string) => CONCEPTS.find(c => c.id === id)?.title || id;

  const renderMenu = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
        <h2 className="text-xl font-bold mb-4">실력 점검 퀴즈</h2>
        <p className="text-gray-500 mb-6 text-sm">난이도를 선택해 도전하세요!</p>
        
        <div className="space-y-3">
          {(['easy', 'normal', 'hard'] as const).map(diff => (
            <button
              key={diff}
              onClick={() => startQuiz(diff)}
              className={`w-full py-3 rounded-lg border-2 font-bold transition-all flex items-center justify-center gap-2 ${
                diff === 'easy' ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100' :
                diff === 'normal' ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100' :
                'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              <Play size={16} fill="currentColor" />
              {diff === 'easy' ? '쉬움 (기본 개념)' : diff === 'normal' ? '보통 (응용력)' : '도전 (심화)'}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setMode('wrong_note')}
        className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-gray-700 font-medium flex justify-between items-center hover:bg-gray-50"
      >
        <span>📓 오답 노트</span>
        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
           {userState.quizHistory.filter(h => !h.isCorrect).length}개
        </span>
      </button>
    </div>
  );

  const renderQuiz = () => {
    const question = currentQuestions[currentIndex];
    const selected = answers[question.id];

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden min-h-[400px] flex flex-col">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2">
            <div 
                className="bg-indigo-600 h-2 transition-all duration-300" 
                style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
            ></div>
        </div>

        <div className="p-6 flex-1">
            <div className="flex justify-between mb-4 text-xs text-gray-400 font-bold uppercase tracking-wide">
                <span>Q.{currentIndex + 1}</span>
                <span>{question.difficulty}</span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-800 mb-8 leading-relaxed">
                {question.question}
            </h3>

            <div className="space-y-3">
                {question.options?.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            selected === opt 
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-bold' 
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button
                disabled={!selected}
                onClick={nextQuestion}
                className={`w-full py-3 rounded-lg font-bold shadow-sm transition-colors ${
                    selected ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
                {currentIndex === currentQuestions.length - 1 ? '제출하기' : '다음 문제'}
            </button>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const correctCount = results.filter(r => r.isCorrect).length;
    const score = Math.round((correctCount / results.length) * 100);

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {score >= 80 ? <span className="text-4xl">🎉</span> : <span className="text-4xl">💪</span>}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{score}점</h2>
        <p className="text-gray-500 mb-6">{score >= 80 ? '훌륭해요! 개념 마스터!' : '조금만 더 힘내봐요!'}</p>
        
        <div className="text-left space-y-4 mb-8">
            {currentQuestions.map((q, idx) => {
                const isCorrect = results[idx].isCorrect;
                return (
                    <div key={q.id} className={`p-3 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                        <div className="flex items-start gap-2">
                            {isCorrect ? <Check className="text-green-600 w-5 h-5 mt-0.5" /> : <X className="text-red-600 w-5 h-5 mt-0.5" />}
                            <div>
                                <p className="text-sm font-bold text-gray-800 mb-1">{q.question}</p>
                                {!isCorrect && (
                                    <div className="text-xs text-red-700 mt-1">
                                        <span className="font-bold">정답:</span> {q.correctAnswer} <br/>
                                        <span className="font-bold">해설:</span> {q.explanation}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        <button
            onClick={() => setMode('menu')}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center justify-center gap-2"
        >
            <RefreshCw size={18} /> 다시 도전하기
        </button>
      </div>
    );
  };

  const renderWrongNote = () => {
      // Get unique IDs of wrong questions from history
      const wrongHistory = userState.quizHistory.filter(h => !h.isCorrect);
      // Deduplicate by questionId, taking the latest attempt date is complex, just simple dedup list
      const wrongIds = Array.from(new Set(wrongHistory.map(h => h.questionId)));
      
      const wrongQuestions = QUIZ_QUESTIONS.filter(q => wrongIds.includes(q.id));

      return (
        <div className="pb-20">
            <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setMode('menu')} className="text-gray-500 hover:text-gray-800">
                     &larr; 뒤로
                </button>
                <h2 className="text-xl font-bold">오답 노트</h2>
            </div>
            
            {wrongQuestions.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    <Check className="w-12 h-12 mx-auto mb-2 text-green-300"/>
                    <p>틀린 문제가 없습니다. 완벽해요!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {wrongQuestions.map(q => (
                        <div key={q.id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-400">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                    {getConceptName(q.relatedConceptId)}
                                </span>
                                {q.misconceptionType && (
                                    <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100">
                                        오개념: {q.misconceptionType}
                                    </span>
                                )}
                            </div>
                            <p className="font-bold text-gray-800 mb-2">{q.question}</p>
                            <div className="text-sm bg-gray-50 p-3 rounded">
                                <p className="text-green-700 font-bold mb-1">정답: {q.correctAnswer}</p>
                                <p className="text-gray-600">{q.explanation}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      );
  };

  return (
    <div>
      {mode === 'menu' && renderMenu()}
      {mode === 'quiz' && renderQuiz()}
      {mode === 'result' && renderResult()}
      {mode === 'wrong_note' && renderWrongNote()}
    </div>
  );
};

export default QuizTab;
