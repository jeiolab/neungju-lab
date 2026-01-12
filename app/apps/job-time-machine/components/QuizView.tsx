import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { HelpCircle, Check, X, ArrowRight } from 'lucide-react';

const QuizView: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);

  const currentQuiz = QUIZ_DATA[currentStep];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer.replace(/\s/g, '') === currentQuiz.answer) {
      setResult('correct');
    } else {
      setResult('wrong');
    }
  };

  const handleNext = () => {
    if (currentStep < QUIZ_DATA.length - 1) {
      setCurrentStep(prev => prev + 1);
      setUserAnswer('');
      setResult(null);
      setShowHint(false);
    } else {
      alert("모든 퀴즈를 완료했습니다! 훌륭해요!");
      // Optionally reset
      setCurrentStep(0);
      setUserAnswer('');
      setResult(null);
      setShowHint(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in p-2">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-100">
        <div className="bg-blue-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">초성 퀴즈 타임!</h2>
          <p className="text-blue-100 text-sm mt-1">미래 기술 용어를 맞춰보세요 ({currentStep + 1}/{QUIZ_DATA.length})</p>
        </div>

        <div className="p-8 flex flex-col items-center">
          <div className="text-6xl font-black text-gray-800 tracking-widest mb-4">
            {currentQuiz.chosung}
          </div>

          {showHint && (
            <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg text-sm mb-6 animate-pulse">
              💡 힌트: {currentQuiz.hint}
            </div>
          )}

          {!showHint && !result && (
             <button 
              onClick={() => setShowHint(true)}
              className="text-gray-400 text-xs underline mb-6 hover:text-blue-600"
             >
               힌트 보기
             </button>
          )}

          {result === 'correct' ? (
            <div className="flex flex-col items-center animate-bounce-in">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <Check size={32} strokeWidth={4} />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-6">정답입니다!</h3>
              <div className="text-xl font-bold text-gray-700 mb-8">{currentQuiz.answer}</div>
              <button 
                onClick={handleNext}
                className="flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                <span>다음 문제</span>
                <ArrowRight size={20} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full">
              <div className="relative mb-6">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="정답을 입력하세요"
                  className={`w-full text-center text-xl p-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all
                    ${result === 'wrong' ? 'border-red-300 focus:ring-red-100 bg-red-50' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}
                  `}
                  autoFocus
                />
                {result === 'wrong' && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500">
                    <X size={24} />
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg active:scale-95 transform duration-100"
              >
                정답 확인
              </button>
              {result === 'wrong' && (
                <p className="text-red-500 text-center mt-4 text-sm font-medium animate-shake">
                  틀렸습니다. 다시 시도해보세요!
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizView;
