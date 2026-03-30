import React, { useState } from 'react';
import { QUIZZES } from '../constants';
import { Check, X, HelpCircle } from 'lucide-react';

interface Props {
  onCorrectAnswer: () => void;
}

const TabQuiz: React.FC<Props> = ({ onCorrectAnswer }) => {
  const [answered, setAnswered] = useState<Record<number, number>>({}); // questionId -> selectedOptionIndex

  const handleSelect = (qId: number, optionIndex: number, correctIndex: number) => {
    if (answered[qId] !== undefined) return;

    setAnswered(prev => ({ ...prev, [qId]: optionIndex }));
    
    if (optionIndex === correctIndex) {
      onCorrectAnswer();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">실전! AI 퀴즈</h2>
        <p className="text-slate-600 mt-2">배운 내용을 문제를 통해 확인해볼까요?</p>
      </div>

      <div className="space-y-6">
        {QUIZZES.map((quiz, index) => {
            const userChoice = answered[quiz.id];
            const isAnswered = userChoice !== undefined;
            const isCorrect = userChoice === quiz.correctAnswer;

            return (
                <div key={quiz.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-start gap-3 mb-4">
                        <span className="bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-lg text-sm whitespace-nowrap">Q{index + 1}</span>
                        <h3 className="font-bold text-lg text-slate-800 leading-snug">{quiz.question}</h3>
                    </div>

                    <div className="space-y-3 pl-0 md:pl-12">
                        {quiz.options.map((option, idx) => {
                            let itemClass = "w-full text-left p-3 rounded-lg border transition-all flex justify-between items-center ";
                            
                            if (isAnswered) {
                                if (idx === quiz.correctAnswer) {
                                    itemClass += "bg-green-50 border-green-500 text-green-700 font-medium";
                                } else if (idx === userChoice) {
                                    itemClass += "bg-red-50 border-red-500 text-red-700";
                                } else {
                                    itemClass += "border-slate-100 text-slate-400 opacity-50";
                                }
                            } else {
                                itemClass += "border-slate-200 hover:bg-indigo-50 hover:border-indigo-300";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleSelect(quiz.id, idx, quiz.correctAnswer)}
                                    disabled={isAnswered}
                                    className={itemClass}
                                >
                                    <span>{option}</span>
                                    {isAnswered && idx === quiz.correctAnswer && <Check size={18} />}
                                    {isAnswered && idx === userChoice && idx !== quiz.correctAnswer && <X size={18} />}
                                </button>
                            );
                        })}
                    </div>

                    {isAnswered && (
                        <div className={`mt-4 p-4 rounded-lg text-sm flex gap-3 ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-slate-100 text-slate-700'}`}>
                            <HelpCircle className="flex-shrink-0" size={20} />
                            <div>
                                <p className="font-bold mb-1">{isCorrect ? '정답입니다!' : '아쉽네요. 해설을 확인해보세요.'}</p>
                                <p>{quiz.explanation}</p>
                            </div>
                        </div>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default TabQuiz;