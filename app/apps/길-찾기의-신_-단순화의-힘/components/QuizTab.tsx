import React, { useState } from 'react';
import { generateQuizQuestion } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { Brain, ArrowRight, Check, X } from 'lucide-react';

const QuizTab: React.FC = () => {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);

  const loadQuestion = async (difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    setLoading(true);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setQuestion(null);
    
    const q = await generateQuizQuestion(difficulty);
    if (q) {
      setQuestion(q);
    } else {
        // Fallback question if API fails
        setQuestion({
            question: "다음 중 '모델링(Modeling)'의 올바른 정의는 무엇인가요?",
            options: [
                "현실의 모든 정보를 빠짐없이 기록하는 것",
                "복잡한 문제를 해결하기 위해 불필요한 세부 사항을 제거하고 단순화하는 것",
                "컴퓨터의 성능을 최대한 높이는 기술",
                "지도를 예쁘게 꾸미는 디자인 과정"
            ],
            correctAnswer: 1,
            explanation: "모델링은 복잡한 현실 세계를 문제 해결에 필요한 핵심 요소만 뽑아 단순화(추상화)하는 과정입니다."
        });
    }
    setLoading(false);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || !question) return;
    setSelectedAnswer(index);
    const correct = index === question.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            <Brain className="w-6 h-6" /> 개념 확인 퀴즈
        </h2>
        <div className="text-indigo-600 font-semibold">
            연속 정답: {streak} 🔥
        </div>
      </div>

      {!question && !loading && (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-6">추상화와 모델링에 대한 이해도를 테스트해보세요.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => loadQuestion('easy')} className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600">초급</button>
            <button onClick={() => loadQuestion('medium')} className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">중급</button>
            <button onClick={() => loadQuestion('hard')} className="px-6 py-3 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600">고급</button>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-20 text-gray-500">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          AI가 문제를 출제하고 있습니다...
        </div>
      )}

      {question && !loading && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 leading-relaxed">
              Q. {question.question}
            </h3>
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === null 
                        ? 'border-gray-100 hover:border-blue-300 hover:bg-blue-50' 
                        : idx === question.correctAnswer
                            ? 'border-green-500 bg-green-50 text-green-900'
                            : idx === selectedAnswer
                                ? 'border-red-500 bg-red-50 text-red-900'
                                : 'border-gray-100 text-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 mr-3 font-bold text-sm">
                        {idx + 1}
                    </span>
                    {option}
                    {selectedAnswer !== null && idx === question.correctAnswer && <Check className="ml-auto w-5 h-5 text-green-600" />}
                    {selectedAnswer !== null && idx === selectedAnswer && idx !== question.correctAnswer && <X className="ml-auto w-5 h-5 text-red-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedAnswer !== null && (
            <div className={`mt-6 p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-red-50'}`}>
               <p className="font-bold mb-2">
                 {isCorrect ? "정답입니다! 🎉" : "아쉽네요. 다시 생각해보세요."}
               </p>
               <p className="text-gray-700 text-sm leading-relaxed">
                 {question.explanation}
               </p>
               <button 
                onClick={() => setQuestion(null)}
                className="mt-4 flex items-center text-blue-600 font-semibold hover:underline"
               >
                다음 문제 풀기 <ArrowRight className="w-4 h-4 ml-1" />
               </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizTab;