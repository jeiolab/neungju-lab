import React, { useState } from 'react';
import { QuizQuestion, UserState } from '../types';
import { QUIZ_BANK } from '../constants';
import { Check, X, RefreshCw, ChevronRight } from 'lucide-react';

interface QuizViewProps {
  user: UserState;
  onComplete: (score: number, wrongAnswers: any[]) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ user, onComplete }) => {
  const [questions] = useState<QuizQuestion[]>(() => {
    // Logic to select 4 easy, 4 medium, 2 hard randomly
    const easy = QUIZ_BANK.filter(q => q.difficulty === 'easy').sort(() => 0.5 - Math.random()).slice(0, 4);
    const medium = QUIZ_BANK.filter(q => q.difficulty === 'medium').sort(() => 0.5 - Math.random()).slice(0, 4);
    const hard = QUIZ_BANK.filter(q => q.difficulty === 'hard').sort(() => 0.5 - Math.random()).slice(0, 2);
    return [...easy, ...medium, ...hard];
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<any[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSubmit = () => {
    let correct = false;
    
    if (currentQ.type === 'multiple') {
      correct = selectedAnswer === currentQ.answerKey;
    } else {
      // Simple keyword matching for short/narrative
      const answerKeys = Array.isArray(currentQ.answerKey) ? currentQ.answerKey : [currentQ.answerKey];
      correct = answerKeys.some(key => selectedAnswer.includes(key));
    }

    setIsCorrect(correct);
    setShowFeedback(true);
    if (correct) setScore(s => s + 10);
    else {
      setWrongAnswers(prev => [...prev, {
        questionId: currentQ.id,
        timestamp: Date.now(),
        wrongAnswer: selectedAnswer
      }]);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
    } else {
      setQuizFinished(true);
      onComplete(score, wrongAnswers);
    }
  };

  if (quizFinished) {
    return (
      <div className="bg-white p-8 rounded-xl text-center shadow-sm border border-gray-200">
        <div className="text-6xl mb-4">{score >= 70 ? '🎉' : '📚'}</div>
        <h2 className="text-2xl font-bold mb-2">퀴즈 완료!</h2>
        <p className="text-gray-600 mb-6">총점: <span className="text-indigo-600 font-bold text-xl">{score}</span> / 100</p>
        
        {wrongAnswers.length > 0 && (
          <div className="bg-orange-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-bold text-orange-800 mb-2">오답 노트 ({wrongAnswers.length}개)</h3>
            <p className="text-sm text-orange-700">틀린 문제는 오답노트에 자동 저장되었습니다. '더 알아보기' 탭에서 복습하세요.</p>
          </div>
        )}

        <button 
          onClick={() => window.location.reload()} 
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
        >
          다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Progress */}
      <div className="bg-gray-100 h-2 w-full">
        <div 
          className="bg-indigo-500 h-full transition-all duration-300" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
            currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {currentQ.difficulty === 'easy' ? '쉬움' : currentQ.difficulty === 'medium' ? '보통' : '도전'}
          </span>
          <span className="text-gray-400 text-sm font-mono">{currentIndex + 1}/{questions.length}</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-6 min-h-[3.5rem]">{currentQ.question}</h3>

        {!showFeedback ? (
          <div className="space-y-3">
            {currentQ.type === 'multiple' ? (
              currentQ.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(opt)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === opt 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-100 hover:border-gray-200 text-gray-600'
                  }`}
                >
                  {opt}
                </button>
              ))
            ) : (
              <textarea
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder="답안을 입력하세요..."
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-0 resize-none h-32"
              />
            )}
            
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="w-full mt-4 bg-gray-900 text-white py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-black transition-colors"
            >
              제출하기
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <div className={`p-5 rounded-lg mb-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? <Check className="text-green-600" /> : <X className="text-red-600" />}
                <span className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? '정답입니다!' : '오답입니다.'}
                </span>
              </div>
              
              {!isCorrect && (
                <div className="space-y-2 mt-3 text-sm">
                   <p className="font-bold text-gray-700">왜 틀렸을까?</p>
                   <p className="text-gray-600">{currentQ.feedback.reason}</p>
                   <div className="border-t border-red-200 my-2"></div>
                   <p className="font-bold text-gray-700">핵심 정리</p>
                   <p className="text-indigo-600 font-medium">{currentQ.feedback.correction}</p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleNext}
              className="w-full flex items-center justify-center bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
            >
              다음 문제 <ChevronRight className="ml-2" size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;