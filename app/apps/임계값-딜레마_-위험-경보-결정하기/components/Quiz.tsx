import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { HelpCircle, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';

export const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    if (showExplanation) return;
    
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    
    if (optionIndex === QUIZ_DATA[currentQuestion].correctIndex) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setSelectedOption(null);
    if (currentQuestion < QUIZ_DATA.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsFinished(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setIsFinished(false);
    setShowExplanation(false);
    setSelectedOption(null);
  };

  if (isFinished) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-3xl shadow-xl text-center border border-slate-100">
        <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🏆</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">퀴즈 완료!</h2>
        <p className="text-slate-600 mb-6">당신의 최종 점수는?</p>
        <div className="text-5xl font-black text-brand-600 mb-8">{score * 20}점</div>
        
        <div className="bg-slate-50 p-4 rounded-xl mb-6 text-sm text-slate-600">
          {score === 5 ? "완벽합니다! 임계값의 마스터시군요." : 
           score >= 3 ? "훌륭해요! 트레이드오프 개념을 잘 이해하셨네요." : 
           "조금 더 연습이 필요해요. 개념 카드를 다시 읽어볼까요?"}
        </div>

        <button 
          onClick={restartQuiz}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw size={18} /> 다시 도전하기
        </button>
      </div>
    );
  }

  const question = QUIZ_DATA[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full mb-6">
        <div 
          className="bg-brand-500 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${((currentQuestion) / QUIZ_DATA.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
            <span className="font-bold text-slate-500">Q{currentQuestion + 1}</span>
            <span className="bg-brand-100 text-brand-700 text-xs px-2 py-1 rounded-lg font-bold">점수: {score * 20}</span>
        </div>
        
        <div className="p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 leading-relaxed">
                {question.question}
            </h3>

            <div className="space-y-3">
                {question.options.map((option, idx) => {
                    let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium ";
                    if (showExplanation) {
                        if (idx === question.correctIndex) btnClass += "border-green-500 bg-green-50 text-green-800";
                        else if (idx === selectedOption) btnClass += "border-red-500 bg-red-50 text-red-800";
                        else btnClass += "border-slate-100 text-slate-400 opacity-50";
                    } else {
                        btnClass += "border-slate-100 hover:border-brand-300 hover:bg-brand-50 text-slate-700";
                    }

                    return (
                        <button 
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={showExplanation}
                            className={btnClass}
                        >
                            <div className="flex justify-between items-center">
                                <span>{option}</span>
                                {showExplanation && idx === question.correctIndex && <CheckCircle className="text-green-600" size={20} />}
                                {showExplanation && idx === selectedOption && idx !== question.correctIndex && <AlertCircle className="text-red-600" size={20} />}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Explanation Footer */}
        {showExplanation && (
            <div className={`p-6 border-t ${selectedOption === question.correctIndex ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
                <div className="flex gap-3">
                    <HelpCircle className={selectedOption === question.correctIndex ? "text-green-600" : "text-orange-600"} />
                    <div>
                        <p className={`font-bold mb-1 ${selectedOption === question.correctIndex ? "text-green-800" : "text-orange-800"}`}>
                            {selectedOption === question.correctIndex ? "정답입니다!" : "아쉽네요!"}
                        </p>
                        <p className="text-slate-700 text-sm leading-relaxed">{question.explanation}</p>
                    </div>
                </div>
                <button 
                    onClick={nextQuestion}
                    className="mt-4 w-full bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-slate-900 transition-colors"
                >
                    다음 문제
                </button>
            </div>
        )}
      </div>
    </div>
  );
};