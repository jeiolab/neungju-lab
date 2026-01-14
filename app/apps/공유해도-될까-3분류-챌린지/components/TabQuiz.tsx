import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { QuizQuestion } from '../types';
import { HelpCircle, Check, X, ArrowRight, RotateCcw } from 'lucide-react';

interface Props {
  onScoreUpdate: (points: number) => void;
  onWrongAnswer: (id: number) => void;
}

const TabQuiz: React.FC<Props> = ({ onScoreUpdate, onWrongAnswer }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [wrongList, setWrongList] = useState<number[]>([]);

  const currentQ = QUIZ_QUESTIONS[currentQIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;
    if (isCorrect) {
      setScore(s => s + 1);
      onScoreUpdate(5);
    } else {
      setWrongList(prev => [...prev, currentQ.id]);
      onWrongAnswer(currentQ.id);
    }
  };

  const handleNext = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(p => p + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      onScoreUpdate(20); // Completion Bonus
    }
  };

  const restartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
    setWrongList([]);
  };

  if (showResults) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">퀴즈 종료!</h2>
        <div className="text-6xl font-black text-blue-600 mb-4">{score * 10}점</div>
        <p className="text-slate-600">총 {QUIZ_QUESTIONS.length}문제 중 {score}문제를 맞혔습니다.</p>

        {wrongList.length > 0 && (
          <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-left max-w-2xl mx-auto">
            <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                <X className="w-5 h-5" />
                오답 노트 (다시 확인해보세요!)
            </h3>
            <ul className="space-y-2">
                {wrongList.map(id => {
                    const q = QUIZ_QUESTIONS.find(qq => qq.id === id);
                    return <li key={id} className="text-sm text-red-700 list-disc list-inside">{q?.question}</li>
                })}
            </ul>
          </div>
        )}

        <button onClick={restartQuiz} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 mx-auto">
          <RotateCcw className="w-5 h-5" /> 다시 풀기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center px-2">
        <span className="text-sm font-bold text-slate-500">Question {currentQIndex + 1} / {QUIZ_QUESTIONS.length}</span>
        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">난이도: {currentQ.difficulty}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium ";
            if (isAnswered) {
              if (idx === currentQ.correctIndex) btnClass += "bg-green-50 border-green-500 text-green-800";
              else if (idx === selectedOption) btnClass += "bg-red-50 border-red-500 text-red-800";
              else btnClass += "bg-white border-slate-100 text-slate-400 opacity-50";
            } else {
              btnClass += "bg-white border-slate-100 hover:border-blue-400 hover:bg-blue-50 text-slate-700";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isAnswered && idx === currentQ.correctIndex && <Check className="w-5 h-5 text-green-600" />}
                    {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && <X className="w-5 h-5 text-red-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 pt-6 border-t border-slate-100 animate-fade-in">
            <div className={`p-4 rounded-xl mb-4 ${selectedOption === currentQ.correctIndex ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <div className="font-bold mb-1">{selectedOption === currentQ.correctIndex ? '정답입니다!' : '틀렸습니다.'}</div>
                <p className="text-sm">{currentQ.explanation}</p>
            </div>
            <button
              onClick={handleNext}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex justify-center items-center gap-2"
            >
              다음 문제 <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabQuiz;
