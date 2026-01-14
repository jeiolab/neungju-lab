import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { DynamicIcon } from './Icons';

// 랜덤 퀴즈 선택 함수 (중복 방지)
const getRandomQuestions = (count: number): number[] => {
  const indices = Array.from({ length: QUIZ_DATA.length }, (_, i) => i);
  const selected: number[] = [];
  
  for (let i = 0; i < count && indices.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * indices.length);
    selected.push(indices[randomIndex]);
    indices.splice(randomIndex, 1);
  }
  
  return selected;
};

export const QuizView: React.FC = () => {
  // 랜덤으로 선택된 퀴즈 인덱스 배열
  const [selectedQuestionIndices, setSelectedQuestionIndices] = useState(() => getRandomQuestions(Math.min(10, QUIZ_DATA.length)));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = QUIZ_DATA[selectedQuestionIndices[currentQuestionIndex]];

  const handleAnswer = (option: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuestionIndices.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRetry = () => {
    // 새로운 랜덤 퀴즈 선택
    setSelectedQuestionIndices(getRandomQuestions(Math.min(10, QUIZ_DATA.length)));
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 bg-white rounded-3xl shadow-xl border border-slate-200">
        <DynamicIcon name="BrainCircuit" className="w-20 h-20 text-blue-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-slate-800 mb-4">퀴즈 결과</h2>
        <div className="text-6xl font-bold text-blue-600 mb-4">{Math.round((score / selectedQuestionIndices.length) * 100)}점</div>
        <p className="text-slate-500 mb-8">총 {selectedQuestionIndices.length}문제 중 {score}문제를 맞추셨습니다!</p>
        <button
          onClick={handleRetry}
          className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
        >
          다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
          <span className="font-bold text-slate-500">QUESTION {currentQuestionIndex + 1} / {selectedQuestionIndices.length}</span>
          <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
            {currentQuestion.type === 'OX' ? 'O/X 퀴즈' : '객관식'}
          </span>
        </div>

        {/* Question */}
        <div className="p-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-8 leading-snug">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.type === 'OX' ? (
              <div className="flex gap-4">
                {['O', 'X'].map((option) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = option === currentQuestion.answer;
                    let btnClass = "flex-1 py-8 text-4xl font-bold rounded-xl border-2 transition-all ";
                    
                    if (isAnswered) {
                        if (isCorrect) btnClass += "bg-green-100 border-green-500 text-green-700 opacity-100";
                        else if (isSelected && !isCorrect) btnClass += "bg-red-100 border-red-500 text-red-700 opacity-100";
                        else btnClass += "bg-slate-50 border-slate-200 text-slate-300 opacity-50";
                    } else {
                        btnClass += "bg-white border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50";
                    }

                    return (
                        <button key={option} onClick={() => handleAnswer(option)} disabled={isAnswered} className={btnClass}>
                            {option}
                        </button>
                    )
                })}
              </div>
            ) : (
              currentQuestion.options?.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === currentQuestion.answer;
                
                let btnClass = "w-full text-left p-4 rounded-lg border-2 font-medium transition-all ";
                if (isAnswered) {
                    if (isCorrect) btnClass += "bg-green-50 border-green-500 text-green-700";
                    else if (isSelected) btnClass += "bg-red-50 border-red-500 text-red-700";
                    else btnClass += "bg-white border-slate-100 text-slate-400";
                } else {
                    btnClass += "bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50";
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                    className={btnClass}
                  >
                    {option}
                  </button>
                );
              })
            )}
          </div>

          {/* Feedback Area */}
          {isAnswered && (
            <div className={`mt-8 p-6 rounded-xl ${selectedAnswer === currentQuestion.answer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'} animate-fade-in`}>
              <div className="flex items-start gap-3">
                <DynamicIcon 
                  name={selectedAnswer === currentQuestion.answer ? "CheckCircle" : "XCircle"} 
                  className={selectedAnswer === currentQuestion.answer ? "text-green-600" : "text-red-600"}
                />
                <div>
                  <h4 className={`font-bold mb-1 ${selectedAnswer === currentQuestion.answer ? "text-green-800" : "text-red-800"}`}>
                    {selectedAnswer === currentQuestion.answer ? "정답입니다!" : "오답입니다."}
                  </h4>
                  <p className="text-slate-700">{currentQuestion.explanation}</p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={handleNext}
                  className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-700 transition-colors"
                >
                  {currentQuestionIndex < selectedQuestionIndices.length - 1 ? '다음 문제' : '결과 보기'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
