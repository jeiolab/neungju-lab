import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { UserProgress, QuizQuestion } from '../types';
import { Check, X, RefreshCw } from 'lucide-react';

interface QuizProps {
  onProgressUpdate: (newProgress: Partial<UserProgress>) => void;
  progress: UserProgress;
}

export const Quiz: React.FC<QuizProps> = ({ onProgressUpdate, progress }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = QUIZ_DATA[currentQuestionIndex];
  const isSolved = progress.solvedQuestions.includes(currentQuestion.id);

  const handleAnswerSubmit = () => {
    let isCorrect = false;

    if (currentQuestion.type === 'multiple') {
      isCorrect = selectedOption === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === 'short') {
       // Simple string matching logic for demo
       isCorrect = textAnswer.trim().toLowerCase() === String(currentQuestion.correctAnswer).toLowerCase();
       // Special case for O/X
       if (currentQuestion.correctAnswer === 'X' || currentQuestion.correctAnswer === 'O') {
           isCorrect = textAnswer.toUpperCase() === currentQuestion.correctAnswer;
       }
    } else {
        // Descriptive is always considered "reviewed" for this prototype
        isCorrect = true; 
    }

    setFeedback({
      isCorrect,
      message: isCorrect ? '정답입니다!' : '오답입니다. 다시 시도하거나 해설을 확인하세요.'
    });
    setShowExplanation(true);

    if (isCorrect && !isSolved) {
      onProgressUpdate({
        xp: progress.xp + 10,
        solvedQuestions: [...progress.solvedQuestions, currentQuestion.id],
        quizScore: progress.quizScore + 10
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_DATA.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetState();
    }
  };

  const resetState = () => {
    setSelectedOption(null);
    setTextAnswer('');
    setFeedback(null);
    setShowExplanation(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
            }`}>
                {currentQuestion.difficulty}
            </span>
            <span className="text-sm text-slate-400">문제 {currentQuestionIndex + 1} / {QUIZ_DATA.length}</span>
          </div>
          {isSolved && <span className="text-xs font-bold text-green-600 flex items-center gap-1"><Check className="w-3 h-3" /> 해결됨</span>}
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-4 mb-6">
          {currentQuestion.type === 'multiple' && currentQuestion.options?.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(idx)}
              disabled={showExplanation}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedOption === idx
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="font-bold mr-2 text-slate-400">{idx + 1}.</span> {opt}
            </button>
          ))}

          {(currentQuestion.type === 'short' || currentQuestion.type === 'descriptive') && (
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={showExplanation}
              placeholder={currentQuestion.type === 'short' ? "정답을 입력하세요 (예: O, X, 단어)" : "서술형 답변을 입력하세요..."}
              className="w-full p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[100px]"
            />
          )}
        </div>

        {feedback && (
          <div className={`p-4 rounded-lg mb-4 flex items-start gap-3 ${feedback.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {feedback.isCorrect ? <Check className="w-5 h-5 mt-0.5" /> : <X className="w-5 h-5 mt-0.5" />}
            <div>
              <p className="font-bold">{feedback.message}</p>
              {showExplanation && (
                 <p className="mt-2 text-sm opacity-90 border-t border-current/20 pt-2">
                   <span className="font-bold mr-1">해설:</span> {currentQuestion.explanation}
                 </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
            {!showExplanation ? (
                <button
                    onClick={handleAnswerSubmit}
                    disabled={currentQuestion.type === 'multiple' && selectedOption === null || (currentQuestion.type !== 'multiple' && !textAnswer)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-bold shadow-sm transition-colors"
                >
                    정답 확인
                </button>
            ) : (
                <button
                    onClick={handleNext}
                    disabled={currentQuestionIndex === QUIZ_DATA.length - 1}
                    className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-bold shadow-sm transition-colors flex items-center gap-2"
                >
                    다음 문제 {currentQuestionIndex < QUIZ_DATA.length - 1 && <ArrowRightIcon className="w-4 h-4"/>}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

// Quick helper icon
const ArrowRightIcon = ({className}:{className?:string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
)
