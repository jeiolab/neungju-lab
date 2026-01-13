import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { CheckCircle, XCircle, HelpCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Quiz: React.FC = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const question = QUIZ_DATA[currentQuestionIdx];

  const handleOptionClick = (idx: number) => {
    if (showExplanation) return; // Prevent changing after answer
    setSelectedOption(idx);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setCurrentQuestionIdx((prev) => (prev + 1) % QUIZ_DATA.length);
  };

  const isCorrect = selectedOption === question.correctIndex;

  return (
    <div className="mt-12 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="text-indigo-600" />
        <h2 className="text-2xl font-bold text-slate-800">퀴즈 풀기</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-indigo-100 p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-indigo-500 tracking-wider uppercase">문제 {currentQuestionIdx + 1} / {QUIZ_DATA.length}</span>
            <div className="flex gap-1">
                {QUIZ_DATA.map((_, i) => (
                    <div key={i} className={`h-1.5 w-6 rounded-full ${i === currentQuestionIdx ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                ))}
            </div>
        </div>

        <h3 className="text-lg font-semibold text-slate-800 mb-6">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let stateClass = "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50";
            if (showExplanation) {
                if (idx === question.correctIndex) {
                    stateClass = "border-green-500 bg-green-50 ring-1 ring-green-500";
                } else if (idx === selectedOption) {
                    stateClass = "border-red-300 bg-red-50";
                } else {
                    stateClass = "border-slate-100 opacity-50";
                }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={showExplanation}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between group ${stateClass}`}
              >
                <span className={`${showExplanation && idx === question.correctIndex ? 'font-semibold text-green-900' : 'text-slate-700'}`}>
                    {option}
                </span>
                {showExplanation && idx === question.correctIndex && <CheckCircle className="w-5 h-5 text-green-600" />}
                {showExplanation && idx === selectedOption && idx !== question.correctIndex && <XCircle className="w-5 h-5 text-red-500" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 overflow-hidden"
            >
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                <p className="font-bold mb-1">{isCorrect ? '정답입니다!' : '틀렸습니다.'}</p>
                <p className="text-sm leading-relaxed">{question.explanation}</p>
              </div>
              
              <button 
                onClick={handleNext}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                다음 문제 <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;