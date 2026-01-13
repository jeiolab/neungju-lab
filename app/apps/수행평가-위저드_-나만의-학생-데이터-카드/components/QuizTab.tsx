import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { QuizQuestion } from '../types';
import { HelpCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface Props {
  onComplete: (score: number) => void;
}

const QuizTab: React.FC<Props> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);

  const question = QUIZ_DATA[currentIdx];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === question.answer) {
      setScore(prev => prev + 1);
    } else {
      setWrongAnswers(prev => [...prev, question.id]);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < QUIZ_DATA.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onComplete(score * 10); // 10 XP per correct answer
    }
  };

  const retry = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
    setWrongAnswers([]);
  };

  if (showResult) {
    return (
      <div className="text-center py-10 animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">퀴즈 종료!</h2>
        <div className="text-6xl font-black text-indigo-600 mb-2">{score * 10}점</div>
        <p className="text-slate-500 mb-8">{QUIZ_DATA.length}문제 중 {score}문제를 맞혔습니다.</p>
        
        {wrongAnswers.length > 0 && (
          <div className="bg-red-50 p-6 rounded-xl text-left max-w-lg mx-auto mb-8 border border-red-100">
            <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> 오답 노트
            </h3>
            <ul className="space-y-4">
              {wrongAnswers.map(qid => {
                const q = QUIZ_DATA.find(item => item.id === qid)!;
                return (
                  <li key={qid} className="border-b border-red-100 last:border-0 pb-2 last:pb-0">
                    <p className="font-medium text-slate-800 text-sm mb-1">Q. {q.question}</p>
                    <p className="text-xs text-red-600">정답: {q.options[q.answer]}</p>
                    <p className="text-xs text-slate-500 mt-1">{q.explanation}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <button 
          onClick={retry}
          className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" /> 다시 도전하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center text-sm font-medium text-slate-500">
        <span>Question {currentIdx + 1} / {QUIZ_DATA.length}</span>
        <span>점수: {score * 10}</span>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 mb-6 min-h-[200px]">
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-xl text-left border-2 transition-all relative ${
                isAnswered
                  ? idx === question.answer
                    ? "bg-green-50 border-green-500 text-green-800"
                    : idx === selectedOption
                    ? "bg-red-50 border-red-500 text-red-800"
                    : "bg-slate-50 border-slate-100 opacity-50"
                  : "bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50"
              }`}
            >
              <span className="font-bold mr-2">{idx + 1}.</span> {opt}
              {isAnswered && idx === question.answer && (
                <CheckCircle className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-green-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {isAnswered && (
        <div className="animate-fade-in mb-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-blue-800 text-sm mb-1">해설</p>
            <p className="text-blue-700 text-sm leading-relaxed">{question.explanation}</p>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={nextQuestion}
          disabled={!isAnswered}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {currentIdx === QUIZ_DATA.length - 1 ? "결과 보기" : "다음 문제"}
        </button>
      </div>
    </div>
  );
};

export default QuizTab;