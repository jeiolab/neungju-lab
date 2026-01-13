import React from 'react';
import { X, Save, ArrowRight, Lightbulb, Check, AlertCircle } from 'lucide-react';
import { Question, TechType } from '../types';

interface ResultModalProps {
  question: Question;
  userTech: string | null;
  score: number;
  isCorrect: boolean;
  onNext: () => void;
  onSaveNote: () => void;
  isSaved: boolean;
}

const ResultModal: React.FC<ResultModalProps> = ({
  question,
  userTech,
  score,
  isCorrect,
  onNext,
  onSaveNote,
  isSaved
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Score */}
        <div className={`p-6 text-center ${isCorrect ? 'bg-indigo-600' : 'bg-rose-500'}`}>
          <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-4 py-1 text-white text-sm font-medium mb-2">
            {isCorrect ? '정답입니다! 🎉' : '아쉬워요! 😅'}
          </div>
          <h2 className="text-5xl font-black text-white mb-1">{score}<span className="text-2xl opacity-80">점</span></h2>
          <p className="text-white/80 text-sm">
            {isCorrect ? '완벽한 추리였습니다.' : '다음엔 맞힐 수 있어요!'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Answer Compare */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl mb-6">
            <div className="text-center w-1/3">
              <div className="text-xs text-slate-400 mb-1">내 선택</div>
              <div className={`font-bold ${isCorrect ? 'text-indigo-600' : 'text-rose-500'}`}>
                {userTech}
              </div>
            </div>
            <ArrowRight className="text-slate-300" />
            <div className="text-center w-1/3">
              <div className="text-xs text-slate-400 mb-1">정답</div>
              <div className="font-bold text-indigo-600">
                {question.correctTech}
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-4 mb-6">
            <div>
              <h4 className="flex items-center text-sm font-bold text-slate-800 mb-2">
                <Check className="w-4 h-4 text-indigo-500 mr-1.5" />
                핵심 근거
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {question.explanation}
              </p>
            </div>
            
            <div>
              <h4 className="flex items-center text-sm font-bold text-slate-800 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500 mr-1.5" />
                탐정 노트 (Tip)
              </h4>
              <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                {question.tip}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onSaveNote}
              disabled={isSaved}
              className={`flex-1 flex items-center justify-center py-3.5 rounded-xl text-sm font-bold transition-colors
                ${isSaved 
                  ? 'bg-slate-100 text-slate-400' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaved ? '저장됨' : '오답 노트 저장'}
            </button>
            <button
              onClick={onNext}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200"
            >
              다음 문제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;