import React, { useState } from 'react';
import { Concept, QuizQuestion, Difficulty } from '../types';
import { generateQuiz } from '../services/geminiService';
import { Brain, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  concepts: Concept[];
  onCorrect: () => void;
  onIncorrect: () => void;
}

const QuizMode: React.FC<Props> = ({ concepts, onCorrect, onIncorrect }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [questionData, setQuestionData] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const loadNewQuestion = async (diff: Difficulty) => {
    setLoading(true);
    setDifficulty(diff);
    setQuestionData(null);
    setSelectedOption(null);
    setIsAnswered(false);

    const data = await generateQuiz(concepts, diff);
    setQuestionData(data);
    setLoading(false);
  };

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (questionData && index === questionData.correctAnswerIndex) {
      onCorrect();
    } else {
      onIncorrect();
    }
  };

  if (!questionData && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="bg-indigo-100 p-4 rounded-full mb-6">
          <Brain size={48} className="text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">실전 퀴즈 도전</h2>
        <p className="text-slate-500 mb-8">AI가 생성하는 맞춤형 문제를 풀어보세요.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-xl">
          <button onClick={() => loadNewQuestion('beginner')} className="p-4 bg-white border border-slate-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all shadow-sm">
            <div className="font-bold">초급 (Beginner)</div>
            <div className="text-xs text-slate-400 mt-1">용어 정의 중심</div>
          </button>
          <button onClick={() => loadNewQuestion('intermediate')} className="p-4 bg-white border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all shadow-sm">
            <div className="font-bold">중급 (Intermediate)</div>
            <div className="text-xs text-slate-400 mt-1">실생활 사례 중심</div>
          </button>
          <button onClick={() => loadNewQuestion('advanced')} className="p-4 bg-white border border-slate-200 rounded-xl hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all shadow-sm">
            <div className="font-bold">고급 (Advanced)</div>
            <div className="text-xs text-slate-400 mt-1">융합 및 사고력</div>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">선생님이 문제를 출제하고 있어요...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
          ${difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700' : 
            difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
          {difficulty}
        </span>
        <button onClick={() => loadNewQuestion(difficulty)} className="text-sm text-slate-400 hover:text-indigo-600">
          다른 문제 풀기
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-8 flex-1 overflow-y-auto">
        <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
          Q. {questionData?.question}
        </h3>

        <div className="space-y-3">
          {questionData?.options.map((option, idx) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all ";
            if (!isAnswered) {
              btnClass += "border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 cursor-pointer";
            } else {
              if (idx === questionData.correctAnswerIndex) {
                btnClass += "border-green-500 bg-green-50 text-green-800";
              } else if (idx === selectedOption) {
                btnClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                btnClass += "border-slate-100 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={btnClass}
              >
                <span className="inline-block w-6 font-bold opacity-50 mr-2">{idx + 1}.</span>
                {option}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-8 pt-6 border-t border-slate-100 animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-indigo-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-bold text-slate-800 mb-1">해설</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {questionData?.explanation}
                </p>
              </div>
            </div>
            <button 
              onClick={() => loadNewQuestion(difficulty)}
              className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex items-center justify-center gap-2"
            >
              다음 문제 <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizMode;
