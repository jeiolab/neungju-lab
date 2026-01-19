import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { getContextualQuizFeedback } from '../services/geminiService';
import { CheckCircle, XCircle, BrainCircuit } from 'lucide-react';

const TabQuiz: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  const question = QUIZ_DATA[currentQIndex];

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const checkAnswer = async () => {
    setShowResult(true);
    if (selectedOption !== null && selectedOption !== question.correctAnswer) {
      setLoadingAi(true);
      const feedback = await getContextualQuizFeedback(
        question.question,
        question.options[selectedOption],
        question.options[question.correctAnswer]
      );
      setAiFeedback(feedback);
      setLoadingAi(false);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < QUIZ_DATA.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowResult(false);
      setAiFeedback("");
    } else {
      alert("모든 퀴즈를 완료했습니다!");
      setCurrentQIndex(0);
      setSelectedOption(null);
      setShowResult(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex justify-between items-center text-slate-500 mb-6">
        <span className="font-bold text-indigo-600">Question {currentQIndex + 1} / {QUIZ_DATA.length}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          question.difficulty === '쉬움' ? 'bg-green-100 text-green-700' :
          question.difficulty === '보통' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {question.difficulty}
        </span>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 leading-snug">{question.question}</h2>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          let stateStyle = "border-slate-200 hover:border-blue-400 bg-white";
          if (showResult) {
            if (index === question.correctAnswer) stateStyle = "border-green-500 bg-green-50 text-green-800";
            else if (index === selectedOption) stateStyle = "border-red-500 bg-red-50 text-red-800";
            else stateStyle = "opacity-50 border-slate-100";
          } else if (selectedOption === index) {
            stateStyle = "border-blue-600 bg-blue-50 ring-1 ring-blue-600";
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all ${stateStyle} flex justify-between items-center`}
            >
              <span>{option}</span>
              {showResult && index === question.correctAnswer && <CheckCircle className="text-green-600" />}
              {showResult && index === selectedOption && index !== question.correctAnswer && <XCircle className="text-red-600" />}
            </button>
          );
        })}
      </div>

      {!showResult ? (
        <button
          onClick={checkAnswer}
          disabled={selectedOption === null}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-lg transition-colors"
        >
          정답 확인
        </button>
      ) : (
        <div className="space-y-4 animate-fade-in">
           {selectedOption !== question.correctAnswer && (
              <div className="bg-slate-800 text-slate-200 p-5 rounded-xl text-sm relative overflow-hidden">
                 <div className="flex items-center gap-2 font-bold text-indigo-300 mb-2">
                    <BrainCircuit size={16}/> AI 튜터의 해설
                 </div>
                 {loadingAi ? (
                    <div className="animate-pulse">해설을 생성하고 있습니다...</div>
                 ) : (
                    <p>{aiFeedback}</p>
                 )}
              </div>
           )}
           
           <div className="bg-blue-50 p-4 rounded-xl text-blue-900 text-sm">
              <span className="font-bold">기본 해설: </span> {question.explanation}
           </div>

           <button
             onClick={nextQuestion}
             className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors"
           >
             다음 문제
           </button>
        </div>
      )}
    </div>
  );
};

export default TabQuiz;