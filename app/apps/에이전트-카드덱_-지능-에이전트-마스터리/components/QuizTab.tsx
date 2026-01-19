import React, { useState } from 'react';
import { QuizQuestion, UserProfile } from '../types';
import { QUIZ_BANK } from '../constants';
import { CheckCircle, XCircle, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onQuizComplete: (score: number, passed: boolean) => void;
  saveWrongNote: (question: QuizQuestion) => void;
}

const QuizTab: React.FC<Props> = ({ profile, onQuizComplete, saveWrongNote }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [feedbackState, setFeedbackState] = useState<'none' | 'correct' | 'wrong' | 'retry'>('none');
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [retryMode, setRetryMode] = useState(false); // If true, showing the retry question

  const currentQ = retryMode 
    ? { ...QUIZ_BANK[currentQuestionIndex], ...QUIZ_BANK[currentQuestionIndex].retryQuestion, id: 'retry-' + QUIZ_BANK[currentQuestionIndex].id } as QuizQuestion
    : QUIZ_BANK[currentQuestionIndex];

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    if (isCorrect) {
      if (!retryMode) setScore(s => s + 10); // Don't give points for retry question to keep it simple, or give partial? Let's give points only for main.
      setFeedbackState('correct');
    } else {
      setFeedbackState('wrong');
      if (!retryMode) saveWrongNote(QUIZ_BANK[currentQuestionIndex]);
    }
  };

  const handleNext = () => {
    setFeedbackState('none');
    setSelectedAnswer('');
    
    // Logic: If main question wrong -> Go to retry mode. If retry mode done -> Go to next main question.
    if (feedbackState === 'wrong' && !retryMode && QUIZ_BANK[currentQuestionIndex].retryQuestion) {
        setRetryMode(true);
        return;
    }

    setRetryMode(false);
    if (currentQuestionIndex < QUIZ_BANK.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      onQuizComplete(score, score >= 70);
    }
  };

  if (quizFinished) {
    return (
      <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">퀴즈 종료!</h2>
        <div className="text-6xl font-black text-indigo-600 mb-6">{score}점</div>
        <p className="text-gray-600 mb-8">
          {score >= 70 ? '🎉 훌륭합니다! 개념을 잘 이해하고 있네요.' : '💪 조금 더 복습이 필요해요. 오답노트를 확인해보세요.'}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
        >
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-indigo-600 h-2 rounded-full transition-all" 
          style={{ width: `${((currentQuestionIndex) / QUIZ_BANK.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <span className={`text-xs font-bold px-2 py-1 rounded ${retryMode ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
            {retryMode ? '재도전 문제' : `Q${currentQuestionIndex + 1}`}
          </span>
          <span className="text-xs font-medium text-gray-400">
             난이도: {QUIZ_BANK[currentQuestionIndex].difficulty.toUpperCase()}
          </span>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {currentQ.type === 'multiple' && currentQ.options?.map((option) => (
              <button
                key={option}
                onClick={() => feedbackState === 'none' && setSelectedAnswer(option)}
                disabled={feedbackState !== 'none'}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedAnswer === option 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500' 
                    : 'border-gray-200 hover:bg-gray-50'
                } ${feedbackState !== 'none' && option === currentQ.correctAnswer ? 'bg-green-100 border-green-500 !text-green-800' : ''}
                  ${feedbackState === 'wrong' && selectedAnswer === option ? 'bg-red-100 border-red-500 !text-red-800' : ''}
                `}
              >
                {option}
              </button>
            ))}

            {currentQ.type === 'short' && (
              <input 
                type="text" 
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={feedbackState !== 'none'}
                placeholder="답을 입력하세요"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            )}
          </div>
        </div>

        {/* Feedback Section */}
        {feedbackState !== 'none' && (
          <div className={`p-6 border-t animate-in fade-in slide-in-from-bottom-4 duration-300 ${feedbackState === 'correct' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
             <div className="flex items-start gap-3 mb-4">
               {feedbackState === 'correct' ? <CheckCircle className="text-green-500 w-6 h-6 flex-shrink-0" /> : <XCircle className="text-red-500 w-6 h-6 flex-shrink-0" />}
               <div>
                 <h4 className={`font-bold text-lg mb-1 ${feedbackState === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                   {feedbackState === 'correct' ? '정답입니다!' : '아쉽네요, 틀렸습니다.'}
                 </h4>
                 {feedbackState === 'wrong' && (
                   <div className="space-y-2 text-sm text-red-700">
                     <p><strong>이유:</strong> {QUIZ_BANK[currentQuestionIndex].explanation}</p>
                     <p className="bg-white bg-opacity-50 p-2 rounded"><strong>교정:</strong> {QUIZ_BANK[currentQuestionIndex].correction}</p>
                   </div>
                 )}
               </div>
             </div>
             
             <button 
               onClick={handleNext}
               className={`w-full py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 ${feedbackState === 'correct' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
             >
               {feedbackState === 'wrong' && !retryMode && QUIZ_BANK[currentQuestionIndex].retryQuestion ? (
                  <>비슷한 문제로 재도전 <RefreshCw className="w-4 h-4" /></>
               ) : (
                  <>다음 문제 <ArrowRight className="w-4 h-4" /></>
               )}
             </button>
          </div>
        )}

        {/* Action Button (Submit) */}
        {feedbackState === 'none' && (
          <div className="p-6 border-t bg-gray-50">
            <button 
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="w-full bg-indigo-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              정답 확인하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;