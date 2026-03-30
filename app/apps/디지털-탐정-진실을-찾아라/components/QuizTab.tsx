import React, { useState } from 'react';
import { INITIAL_QUIZ } from '../constants';
import { QuizQuestion } from '../types';
import { generateQuizQuestionWithGemini } from '../services/geminiService';
import { Check, X, RefreshCw, Loader2, BrainCircuit } from 'lucide-react';

const QuizTab: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>(INITIAL_QUIZ[0]);
  const [revealed, setRevealed] = useState(false);
  const [userGuess, setUserGuess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);

  const handleAnswer = (guess: boolean) => {
    setUserGuess(guess);
    setRevealed(true);
    if (guess === currentQuestion.isTruth) {
        setStreak(prev => prev + 1);
    } else {
        setStreak(0);
    }
  };

  const loadNextQuestion = async () => {
    setLoading(true);
    setRevealed(false);
    setUserGuess(null);
    
    // Try to get a question from Gemini
    const newQuestion = await generateQuizQuestionWithGemini();
    
    if (newQuestion) {
        setCurrentQuestion(newQuestion);
    } else {
        // Fallback to rotating through static questions randomly
        const randomIndex = Math.floor(Math.random() * INITIAL_QUIZ.length);
        setCurrentQuestion(INITIAL_QUIZ[randomIndex]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-blue-400" />
            진실 혹은 거짓
          </h2>
          <div className="text-sm font-mono text-blue-200">
             연속 정답: {streak}회
          </div>
        </div>

        <div className="p-8 text-center">
          <div className="mb-2 text-sm uppercase tracking-wide text-gray-500 font-bold">Headline</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-8 leading-snug">
            "{currentQuestion.headline}"
          </h3>

          {loading ? (
             <div className="h-48 flex items-center justify-center">
                 <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
             </div>
          ) : !revealed ? (
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 max-w-[160px] py-4 rounded-xl border-2 border-green-500 text-green-600 hover:bg-green-50 font-bold text-lg flex flex-col items-center gap-2 transition-all"
              >
                <Check className="w-8 h-8" />
                진실 (Truth)
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 max-w-[160px] py-4 rounded-xl border-2 border-red-500 text-red-600 hover:bg-red-50 font-bold text-lg flex flex-col items-center gap-2 transition-all"
              >
                <X className="w-8 h-8" />
                거짓 (Fake)
              </button>
            </div>
          ) : (
            <div className="animate-fade-in-up">
               <div className={`text-4xl font-black mb-4 ${currentQuestion.isTruth === userGuess ? 'text-green-500' : 'text-red-500'}`}>
                   {currentQuestion.isTruth === userGuess ? "정답입니다! 🎉" : "틀렸습니다 😢"}
               </div>
               <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
                   <p className="font-bold text-gray-900 mb-2">해설:</p>
                   <p className="text-gray-700">{currentQuestion.explanation}</p>
                   <p className="mt-4 text-sm font-bold text-gray-500">
                       실제 정답: <span className={currentQuestion.isTruth ? 'text-green-600' : 'text-red-600'}>{currentQuestion.isTruth ? '진실' : '거짓'}</span>
                   </p>
               </div>
               
               <button 
                onClick={loadNextQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2 mx-auto transition-colors"
               >
                   <RefreshCw className="w-5 h-5" />
                   다음 문제 도전
               </button>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-center text-gray-400 text-xs mt-4">
        * AI가 실시간으로 문제를 생성할 수 있습니다.
      </p>
    </div>
  );
};

export default QuizTab;