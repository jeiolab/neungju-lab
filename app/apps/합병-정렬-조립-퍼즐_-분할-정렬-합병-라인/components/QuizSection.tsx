import React, { useState, useEffect } from 'react';
import { UserStats, QuizQuestion } from '../types';
import { INITIAL_QUIZ_QUESTIONS } from '../constants';
import { generateQuizQuestion } from '../services/geminiService';
import { motion } from 'framer-motion';

interface Props {
  userStats: UserStats;
  updateStats: (newStats: Partial<UserStats>) => void;
}

const QuizSection: React.FC<Props> = ({ userStats, updateStats }) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState('');

  const loadNewQuestion = async () => {
    setLoading(true);
    setSelectedOption(null);
    setIsAnswered(false);
    setFeedback('');
    
    // Try to get from AI, fallback to random static
    try {
        const question = await generateQuizQuestion('medium');
        if (question) {
            setCurrentQuestion(question);
        } else {
            throw new Error("AI failed");
        }
    } catch (e) {
        // Fallback
        const randomQ = INITIAL_QUIZ_QUESTIONS[Math.floor(Math.random() * INITIAL_QUIZ_QUESTIONS.length)];
        setCurrentQuestion(randomQ);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadNewQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (option: string) => {
    if (isAnswered || !currentQuestion) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    const isCorrect = option === currentQuestion.correctAnswer;
    
    if (isCorrect) {
        setFeedback("정답입니다! " + currentQuestion.explanation);
        updateStats({
            xp: userStats.xp + 20,
            // Simple logic to add to history would go here in a real app
        });
    } else {
        setFeedback("오답입니다. " + currentQuestion.explanation);
    }
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">AI가 새로운 퀴즈를 출제 중입니다...</span>
        </div>
    );
  }

  if (!currentQuestion) return <div>문제를 불러올 수 없습니다.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
            <h2 className="text-xl font-bold">확인 퀴즈</h2>
            <p className="text-blue-100 text-sm mt-1">개념을 확실히 이해했는지 확인해보세요.</p>
        </div>
        
        <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6 leading-relaxed">
                Q. {currentQuestion.question}
            </h3>
            
            <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                    let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
                    
                    if (isAnswered) {
                        if (option === currentQuestion.correctAnswer) {
                            btnClass += "bg-green-100 border-green-500 text-green-900";
                        } else if (option === selectedOption) {
                            btnClass += "bg-red-100 border-red-500 text-red-900";
                        } else {
                            btnClass += "bg-gray-50 border-gray-100 text-gray-400";
                        }
                    } else {
                        btnClass += "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700";
                    }

                    return (
                        <button 
                            key={idx}
                            onClick={() => handleAnswer(option)}
                            disabled={isAnswered}
                            className={btnClass}
                        >
                            <span className="inline-block w-6 font-bold mr-2">{String.fromCharCode(65+idx)}.</span>
                            {option}
                        </button>
                    );
                })}
            </div>

            {isAnswered && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                    <p className="font-bold text-gray-800 mb-1">해설</p>
                    <p className="text-gray-600">{currentQuestion.explanation}</p>
                    
                    <button 
                        onClick={loadNewQuestion}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700"
                    >
                        다음 문제 도전
                    </button>
                </motion.div>
            )}
        </div>
      </div>
    </div>
  );
};

export default QuizSection;
