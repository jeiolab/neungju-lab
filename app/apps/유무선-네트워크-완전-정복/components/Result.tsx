import React, { useEffect, useState } from 'react';
import { RotateCcw, Award, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultProps {
  score: number;
  onRestart: () => void;
}

export const Result: React.FC<ResultProps> = ({ score, onRestart }) => {
  const [grade, setGrade] = useState({ label: '', color: '', msg: '' });

  useEffect(() => {
    // Determine grade
    if (score >= 180) { // Max possible approx 200 (100 sim + 100 quiz)
       setGrade({ label: '네트워크 마스터', color: 'text-yellow-500', msg: '완벽합니다! 유무선 네트워크를 정복하셨군요.' });
       confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    } else if (score >= 100) {
       setGrade({ label: '우수 수료생', color: 'text-blue-500', msg: '잘했어요! 개념을 확실히 이해하고 있습니다.' });
       confetti({ particleCount: 50, spread: 50 });
    } else {
       setGrade({ label: '초보 엔지니어', color: 'text-green-500', msg: '수고했어요! 다시 한번 복습해볼까요?' });
    }
  }, [score]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 py-10 animate-fade-in text-center">
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <Award className={`w-24 h-24 ${grade.color} relative z-10`} />
      </div>

      <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
        {grade.label}
      </h1>
      <p className="text-slate-500 mb-8">{grade.msg}</p>

      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-lg w-full max-w-sm mb-8">
        <div className="text-sm text-slate-400 font-semibold uppercase tracking-wider mb-2">Total Score</div>
        <div className="text-5xl font-black text-slate-900 mb-4">{score}점</div>
        <div className="flex justify-center gap-1">
          {[...Array(5)].map((_, i) => (
             <Star 
               key={i} 
               className={`w-6 h-6 ${i < Math.round(score / 40) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
             />
          ))}
        </div>
      </div>

      <button
        onClick={onRestart}
        className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        처음부터 다시하기
      </button>
    </div>
  );
};