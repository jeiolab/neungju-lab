import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QUIZ_DATA } from '../constants';
import { Check, X, RotateCcw } from 'lucide-react';

const QuizTab: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const question = QUIZ_DATA[currentQuestion];
  const isFinished = currentQuestion >= QUIZ_DATA.length;

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent multi-click
    setSelectedOption(index);
    setShowResult(true);

    if (index === question.correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    setCurrentQuestion(prev => prev + 1);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setShowResult(false);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-800 p-10 rounded-2xl border border-purple-500 shadow-2xl max-w-md w-full"
        >
          <h2 className="text-3xl font-bold text-white mb-4">퀴즈 완료!</h2>
          <div className="text-6xl mb-6">🏆</div>
          <p className="text-slate-300 mb-6">당신의 점수는?</p>
          <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-8">
            {score} / {QUIZ_DATA.length}
          </p>
          <button 
            onClick={resetQuiz}
            className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition-colors"
          >
            <RotateCcw size={20} /> 다시 도전하기
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <span className="text-slate-400 font-mono">Question {currentQuestion + 1} / {QUIZ_DATA.length}</span>
        <span className="bg-slate-800 px-3 py-1 rounded-full text-purple-400 font-bold border border-slate-700">
          Score: {score}
        </span>
      </div>

      <motion.div
        key={currentQuestion}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -50, opacity: 0 }}
        className="bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700"
      >
        <h3 className="text-xl font-bold text-white mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            let buttonStyle = "bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-200";
            
            if (selectedOption !== null) {
              if (index === question.correctIndex) {
                buttonStyle = "bg-emerald-600/20 border-emerald-500 text-emerald-200";
              } else if (index === selectedOption) {
                buttonStyle = "bg-red-600/20 border-red-500 text-red-200";
              } else {
                buttonStyle = "bg-slate-800 border-slate-800 text-slate-500 cursor-not-allowed";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={selectedOption !== null}
                className={`w-full p-4 text-left rounded-xl border transition-all duration-200 flex justify-between items-center ${buttonStyle}`}
              >
                <span>{option}</span>
                {selectedOption !== null && index === question.correctIndex && <Check size={20} />}
                {selectedOption !== null && index === selectedOption && index !== question.correctIndex && <X size={20} />}
              </button>
            );
          })}
        </div>

        {showResult && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6 pt-6 border-t border-slate-700"
          >
            <p className="text-slate-300 font-medium mb-4">
              <span className="text-purple-400 font-bold">해설:</span> {question.explanation}
            </p>
            <button
              onClick={handleNext}
              className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold float-right transition-colors"
            >
              다음 문제 →
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default QuizTab;
