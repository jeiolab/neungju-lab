import React from 'react';
import { QuizQuestion, ModuleType } from '../types';
import { MODULE_INFO } from '../constants';
import { AlertCircle, Trash2 } from 'lucide-react';

interface Props {
  incorrectQuestions: QuizQuestion[];
  onClear: () => void;
}

const ReviewNote: React.FC<Props> = ({ incorrectQuestions, onClear }) => {
  if (incorrectQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-white rounded-xl border border-slate-200 shadow-sm">
        <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
        <p>오답 기록이 없다. 완벽하다, 훈련병!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">오답 노트 ({incorrectQuestions.length})</h2>
        <button 
          onClick={onClear}
          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> 기록 초기화
        </button>
      </div>

      <div className="grid gap-4">
        {incorrectQuestions.map((q, idx) => (
          <div key={`${q.id}-${idx}`} className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {MODULE_INFO[q.moduleId].title}
              </span>
              <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                오답
              </span>
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-3">{q.question}</h3>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-green-700 font-bold mb-1">✅ 정답 및 해설</p>
              <p className="text-slate-700 text-sm leading-relaxed">{q.explanation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewNote;