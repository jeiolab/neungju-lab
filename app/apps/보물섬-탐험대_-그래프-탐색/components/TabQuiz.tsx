import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { fetchDynamicQuiz } from '../services/geminiService';
import { HelpCircle, CheckCircle, XCircle, BrainCircuit } from 'lucide-react';

const TabQuiz: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [dynamicQuestion, setDynamicQuestion] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeQuestion = dynamicQuestion || QUIZ_QUESTIONS[currentQIndex];

  const handleOptionClick = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowResult(false);
    setDynamicQuestion(null);
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
        // Reset to beginning if needed, or handle end state
        setCurrentQIndex(0);
    }
  };

  const loadAIQuestion = async () => {
      setIsLoading(true);
      setShowResult(false);
      setSelectedOption(null);
      const q = await fetchDynamicQuiz();
      if(q) {
          setDynamicQuestion(q);
      }
      setIsLoading(false);
  };

  const isCorrect = selectedOption === activeQuestion.answer;

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold text-gray-800">탐험 지식 퀴즈</h2>
         {!dynamicQuestion && (
             <span className="text-gray-500 font-bold">문제 {currentQIndex + 1} / {QUIZ_QUESTIONS.length}</span>
         )}
         {dynamicQuestion && (
             <span className="text-purple-600 font-bold flex items-center gap-1"><BrainCircuit size={16}/> AI 문제</span>
         )}
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 bg-gradient-to-br from-blue-50 to-white">
          <h3 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
             Q. {activeQuestion.question}
          </h3>

          <div className="space-y-3">
            {activeQuestion.options.map((opt: string, idx: number) => {
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium ";
              if (showResult) {
                if (idx === activeQuestion.answer) btnClass += "border-green-500 bg-green-50 text-green-700";
                else if (idx === selectedOption) btnClass += "border-red-500 bg-red-50 text-red-700";
                else btnClass += "border-gray-200 opacity-50";
              } else {
                btnClass += "border-gray-200 hover:border-ocean hover:bg-blue-50 text-gray-700";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={showResult}
                  className={btnClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {showResult && idx === activeQuestion.answer && <CheckCircle className="text-green-500" />}
                    {showResult && idx === selectedOption && idx !== activeQuestion.answer && <XCircle className="text-red-500" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {showResult && (
          <div className={`p-6 border-t ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="flex items-start gap-3">
                {isCorrect ? <CheckCircle className="text-green-600 shrink-0 mt-1" /> : <HelpCircle className="text-red-600 shrink-0 mt-1" />}
                <div>
                    <h4 className={`font-bold text-lg mb-1 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {isCorrect ? "정답입니다!" : "아쉽네요!"}
                    </h4>
                    <p className="text-gray-700">{activeQuestion.explanation}</p>
                </div>
            </div>
            <div className="mt-6 flex gap-3">
                <button
                    onClick={nextQuestion}
                    className="flex-1 bg-ocean hover:bg-teal-500 text-white font-bold py-3 rounded-lg shadow transition-colors"
                >
                    다음 기본 문제
                </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <button
            onClick={loadAIQuestion}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full font-bold shadow-lg hover:bg-purple-700 transition-transform active:scale-95 disabled:opacity-70"
        >
            {isLoading ? "AI가 문제를 만드는 중..." : <><BrainCircuit size={20}/> 새로운 AI 문제 도전하기</>}
        </button>
      </div>
    </div>
  );
};

export default TabQuiz;