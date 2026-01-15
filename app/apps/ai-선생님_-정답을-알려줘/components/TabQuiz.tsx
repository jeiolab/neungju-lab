import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { generateExplanation } from '../services/geminiService';
import { HelpCircle, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

const TabQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [aiTip, setAiTip] = useState<string>("");

  const question = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelectedOption(idx);
  };

  const checkAnswer = async () => {
    const isCorrect = selectedOption === question.correctAnswer;
    if (isCorrect) setScore(prev => prev + 1);
    setShowResult(true);

    if (!isCorrect) {
        // Optional: Get tailored help from Gemini only on wrong answers to save tokens/time
        // For now, using static explanation mostly, but showing how to integrate.
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowResult(false);
    setAiTip("");
    setCurrentIdx(prev => prev + 1);
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setShowResult(false);
  };

  if (currentIdx >= QUIZ_QUESTIONS.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">퀴즈 완료! 🎉</h2>
        <div className="text-6xl font-black text-indigo-600 mb-6">
          {score} / {QUIZ_QUESTIONS.length}
        </div>
        <p className="text-gray-600 mb-8">
            {score === QUIZ_QUESTIONS.length ? "완벽합니다! 지도학습 마스터시네요." : "수고하셨습니다! 다시 복습해보는 건 어떨까요?"}
        </p>
        <button 
          onClick={resetQuiz}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
        >
          다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center text-gray-500 font-medium">
        <span>Question {currentIdx + 1} / {QUIZ_QUESTIONS.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let baseClasses = "w-full p-4 rounded-xl text-left border-2 transition-all flex items-center justify-between ";
            if (showResult) {
                if (idx === question.correctAnswer) baseClasses += "border-green-500 bg-green-50 text-green-800 ";
                else if (idx === selectedOption) baseClasses += "border-red-500 bg-red-50 text-red-800 ";
                else baseClasses += "border-gray-100 text-gray-400 ";
            } else {
                if (idx === selectedOption) baseClasses += "border-indigo-500 bg-indigo-50 text-indigo-800 ";
                else baseClasses += "border-gray-100 hover:border-indigo-200 hover:bg-gray-50 text-gray-700 ";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={baseClasses}
                disabled={showResult}
              >
                <span>{option}</span>
                {showResult && idx === question.correctAnswer && <CheckCircle2 className="text-green-600" />}
                {showResult && idx === selectedOption && idx !== question.correctAnswer && <XCircle className="text-red-600" />}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-fade-in-up">
            <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                    <span className="font-bold text-blue-800 block mb-1">해설</span>
                    <p className="text-blue-900 text-sm">{question.explanation}</p>
                </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          {!showResult ? (
            <button
              onClick={checkAnswer}
              disabled={selectedOption === null}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
                selectedOption === null 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
              }`}
            >
              정답 확인
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="w-full py-4 rounded-xl font-bold text-lg bg-gray-900 text-white hover:bg-black transition-colors shadow-md"
            >
              다음 문제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabQuiz;