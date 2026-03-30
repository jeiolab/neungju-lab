import React, { useState } from 'react';
import { QUIZ_DATA } from '../../constants';
import { updateXP, addBadge, recordQuizResult } from '../../services/storageService';
import { UserProgress, QuizQuestion } from '../../types';
import { AlertCircle, CheckCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface Props {
  progress: UserProgress;
  onUpdate: () => void;
}

const QuizTab: React.FC<Props> = ({ progress, onUpdate }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [feedback, setFeedback] = useState<QuizQuestion['feedback'] | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQ = QUIZ_DATA[currentQIndex];

  const handleSubmit = () => {
    let correct = false;
    const answer = currentQ.type === 'multiple' ? selectedOption : textAnswer;
    
    // Normalize logic
    if (currentQ.type === 'multiple') {
      correct = answer === currentQ.correctAnswer;
    } else {
      correct = textAnswer.trim() === currentQ.correctAnswer;
    }

    setIsCorrect(correct);
    recordQuizResult({
      questionId: currentQ.id,
      isCorrect: correct,
      userAnswer: answer || '',
      timestamp: Date.now()
    });

    if (correct) {
      setCorrectCount(prev => prev + 1);
      updateXP(20); // More XP for quiz
    } else {
      setFeedback(currentQ.feedback);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setTextAnswer('');
    setFeedback(null);
    setIsCorrect(null);

    if (currentQIndex < QUIZ_DATA.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      if (correctCount === QUIZ_DATA.length) {
        addBadge('퀴즈 만점자');
      }
      onUpdate();
    }
  };

  if (quizFinished) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-6">
        <div className="inline-block p-4 bg-indigo-100 rounded-full">
          <CheckCircle className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">퀴즈 완료!</h2>
        <p className="text-slate-600">
          총 {QUIZ_DATA.length}문제 중 <span className="font-bold text-indigo-600">{correctCount}</span>문제를 맞혔습니다.
        </p>
        <button
          onClick={() => {
            setQuizFinished(false);
            setCurrentQIndex(0);
            setCorrectCount(0);
          }}
          className="px-6 py-2 bg-slate-900 text-white rounded hover:bg-slate-800"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${((currentQIndex) / QUIZ_DATA.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <span className={`px-2 py-1 text-xs font-bold rounded uppercase
              ${currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }
            `}>
              {currentQ.difficulty}
            </span>
            <span className="text-slate-400 font-mono text-sm">Q.{currentQIndex + 1} / {QUIZ_DATA.length}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Question Input Area */}
          <div className="space-y-3">
            {currentQ.type === 'multiple' ? (
              currentQ.options?.map(opt => (
                <button
                  key={opt}
                  disabled={isCorrect !== null}
                  onClick={() => setSelectedOption(opt)}
                  className={`w-full p-4 text-left rounded-lg border transition-all
                    ${selectedOption === opt 
                      ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' 
                      : 'border-slate-200 hover:bg-slate-50'
                    }
                    ${isCorrect !== null && opt === currentQ.correctAnswer ? 'bg-green-50 border-green-500' : ''}
                    ${isCorrect === false && selectedOption === opt ? 'bg-red-50 border-red-500' : ''}
                  `}
                >
                  {opt}
                </button>
              ))
            ) : (
              <input
                type="text"
                disabled={isCorrect !== null}
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="답안을 입력하세요"
                className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            )}
          </div>

          {/* Feedback Section */}
          {isCorrect === false && feedback && (
            <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r text-sm space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 font-bold text-orange-800">
                <AlertCircle size={16} /> 오답 분석
              </div>
              <p><span className="font-semibold text-orange-900">왜 틀렸을까?</span> {feedback.reason}</p>
              <p><span className="font-semibold text-green-700">핵심 교정:</span> {feedback.correction}</p>
              <div className="mt-2 pt-2 border-t border-orange-100">
                <p className="font-bold text-indigo-800">재도전 문제: {feedback.retryQuestion}</p>
              </div>
            </div>
          )}

          {isCorrect === true && (
             <div className="mt-6 p-4 bg-green-50 text-green-800 rounded flex items-center gap-2 animate-bounce-short">
               <CheckCircle size={20} />
               <span className="font-bold">정답입니다!</span>
             </div>
          )}
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end">
          {isCorrect === null ? (
            <button
              onClick={handleSubmit}
              disabled={(!selectedOption && !textAnswer)}
              className="px-6 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              제출하기
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-slate-800 text-white rounded font-bold hover:bg-slate-900 flex items-center gap-2"
            >
              다음 문제 <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTab;
