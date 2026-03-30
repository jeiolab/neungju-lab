import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_DATA } from '../constants';
import { CheckCircle, XCircle, ChevronRight, RotateCcw } from 'lucide-react';

interface Props {
  onQuizComplete: (score: number) => void;
}

const QuizModule: React.FC<Props> = ({ onQuizComplete }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState<{q: QuizQuestion, correct: boolean}[]>([]);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === QUIZ_DATA[currentQuestionIdx].correctIndex;
    if (isCorrect) setScore(prev => prev + 20); // 5 questions * 20 = 100
    
    setHistory(prev => [...prev, {
        q: QUIZ_DATA[currentQuestionIdx],
        correct: isCorrect
    }]);
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < QUIZ_DATA.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onQuizComplete(score + (selectedOption === QUIZ_DATA[currentQuestionIdx].correctIndex ? 20 : 0));
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
    setHistory([]);
  };

  if (showResult) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h2 className="text-2xl font-bold text-center mb-6">퀴즈 결과</h2>
        <div className="text-center mb-8">
            <div className="text-6xl font-bold text-blue-600 mb-2">{score}점</div>
            <p className="text-slate-500">총 {QUIZ_DATA.length}문제 중 {score/20}문제 정답</p>
        </div>

        <div className="space-y-4 mb-8">
            {history.map((item, idx) => (
                <div key={idx} className={`p-4 rounded-lg border ${item.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-2">
                        {item.correct ? <CheckCircle className="text-green-500 mt-1 shrink-0" size={18}/> : <XCircle className="text-red-500 mt-1 shrink-0" size={18}/>}
                        <div>
                            <p className="font-medium text-slate-800 text-sm">{item.q.question}</p>
                            {!item.correct && (
                                <p className="text-xs text-red-600 mt-1">정답: {item.q.options[item.q.correctIndex]}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-1 bg-white/50 p-2 rounded">{item.q.explanation}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <button 
            onClick={resetQuiz}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
            <RotateCcw size={20}/> 다시 도전하기
        </button>
      </div>
    );
  }

  const question = QUIZ_DATA[currentQuestionIdx];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 min-h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-semibold text-blue-600">Question {currentQuestionIdx + 1}/{QUIZ_DATA.length}</span>
        <span className="text-sm text-slate-400">현재 점수: {score}</span>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-6">{question.question}</h3>

      <div className="space-y-3 flex-1">
        {question.options.map((opt, idx) => {
            let btnClass = "w-full text-left p-4 rounded-lg border transition-all ";
            if (isAnswered) {
                if (idx === question.correctIndex) btnClass += "bg-green-100 border-green-400 text-green-800";
                else if (idx === selectedOption) btnClass += "bg-red-100 border-red-400 text-red-800";
                else btnClass += "bg-slate-50 border-slate-200 text-slate-400";
            } else {
                btnClass += "bg-white border-slate-200 hover:bg-slate-50 hover:border-blue-300";
            }

            return (
                <button 
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={btnClass}
                >
                    <div className="flex justify-between items-center">
                        <span>{opt}</span>
                        {isAnswered && idx === question.correctIndex && <CheckCircle size={18} className="text-green-600"/>}
                        {isAnswered && idx === selectedOption && idx !== question.correctIndex && <XCircle size={18} className="text-red-600"/>}
                    </div>
                </button>
            );
        })}
      </div>

      {isAnswered && (
          <div className="mt-6 animate-fade-in">
              <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm text-blue-800 border border-blue-100">
                  <span className="font-bold">해설:</span> {question.explanation}
              </div>
              <button 
                onClick={nextQuestion}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                  {currentQuestionIdx === QUIZ_DATA.length - 1 ? "결과 보기" : "다음 문제"} <ChevronRight size={20}/>
              </button>
          </div>
      )}
    </div>
  );
};

export default QuizModule;