import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Trophy } from 'lucide-react';
import { QUIZ_DATA } from '../constants';
import { QuizQuestion, QuizType } from '../types';
import { addXP, loadUserStats, saveUserStats, checkBadges } from '../services/storageService';

interface Props {
  onUpdateStats: () => void;
}

const QuizSection: React.FC<Props> = ({ onUpdateStats }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = QUIZ_DATA[currentIdx];

  const handleSubmit = () => {
    if (!selectedAnswer.trim()) return;

    // Determine correctness
    let correct = false;
    if (question.type === QuizType.OX || question.type === QuizType.MULTIPLE_CHOICE) {
      correct = selectedAnswer === question.correctAnswer;
    } else {
      // For short answer/essay, basic loose matching for demo
      correct = selectedAnswer.toLowerCase().includes(question.correctAnswer.toLowerCase()) || selectedAnswer.length > 5;
    }

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      setScore(prev => prev + 10);
      addXP(5);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_DATA.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer('');
      setIsSubmitted(false);
      setIsCorrect(false);
    } else {
      setShowResult(true);
      
      // Save Quiz Stats
      const stats = loadUserStats();
      if (score > stats.quizScore) {
          stats.quizScore = score;
          saveUserStats(stats);
      }
      checkBadges(stats);
      onUpdateStats();
    }
  };

  if (showResult) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 animate-fade-in">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-indigo-100">
           <div className="bg-yellow-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
             <Trophy size={48} className="text-yellow-600" />
           </div>
           <h2 className="text-3xl font-bold text-slate-800 mb-2">퀴즈 완료!</h2>
           <p className="text-slate-500 mb-8">당신의 점수는...</p>
           <div className="text-6xl font-black text-indigo-600 mb-8">{score}점</div>
           
           <button 
             onClick={() => window.location.reload()} 
             className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg"
           >
             처음으로 돌아가기
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
           <span className={`px-2 py-1 rounded text-xs text-white ${
             question.difficulty === 'easy' ? 'bg-green-500' : 
             question.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
           }`}>
             {question.difficulty.toUpperCase()}
           </span>
           <span>문제 {currentIdx + 1} / {QUIZ_DATA.length}</span>
        </h2>
        <span className="text-indigo-600 font-bold">{score} 점</span>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="p-8">
          <p className="text-lg font-medium text-slate-800 mb-6 leading-relaxed">
            {question.question}
          </p>

          <div className="space-y-4">
            {question.type === QuizType.OX && (
              <div className="grid grid-cols-2 gap-4">
                {['O', 'X'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => !isSubmitted && setSelectedAnswer(opt)}
                    className={`py-6 rounded-xl border-2 text-2xl font-bold transition-all
                      ${selectedAnswer === opt 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                        : 'border-slate-200 hover:border-indigo-300 text-slate-400'}
                      ${isSubmitted ? 'cursor-not-allowed opacity-50' : ''}
                    `}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {question.type === QuizType.MULTIPLE_CHOICE && (
              <div className="space-y-2">
                {question.options?.map(opt => (
                  <button
                    key={opt}
                    onClick={() => !isSubmitted && setSelectedAnswer(opt)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all
                      ${selectedAnswer === opt 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-slate-200 hover:border-indigo-300 text-slate-600'}
                      ${isSubmitted ? 'cursor-not-allowed opacity-80' : ''}
                    `}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {(question.type === QuizType.SHORT_ANSWER || question.type === QuizType.ESSAY) && (
              <textarea
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={isSubmitted}
                placeholder="답안을 입력하세요..."
                className="w-full p-4 rounded-lg border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 resize-none h-32"
              />
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end">
           {!isSubmitted ? (
             <button
               onClick={handleSubmit}
               className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition"
             >
               정답 확인
             </button>
           ) : (
             <button
               onClick={handleNext}
               className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-800 transition flex items-center"
             >
               다음 문제 <CheckCircle2 size={18} className="ml-2"/>
             </button>
           )}
        </div>
      </div>

      {/* Feedback Area */}
      {isSubmitted && (
        <div className={`mt-6 p-6 rounded-xl border animate-fade-in-up flex gap-4 ${
          isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
           <div className="flex-shrink-0 mt-1">
             {isCorrect ? <CheckCircle2 className="text-green-600" size={24}/> : <XCircle className="text-red-600" size={24}/>}
           </div>
           <div>
             <h4 className={`font-bold text-lg mb-1 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
               {isCorrect ? '정답입니다!' : '아쉽네요!'}
             </h4>
             <p className={`text-sm mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
               정답: {question.correctAnswer}
             </p>
             <div className="bg-white/60 p-3 rounded-lg text-slate-700 text-sm">
               <span className="font-bold mr-1">해설:</span> {question.explanation}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default QuizSection;
