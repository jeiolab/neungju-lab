import React, { useEffect, useState } from 'react';
import { generateCertificateMessage } from '../services/geminiService';
import { ShieldCheck, Award } from 'lucide-react';

interface CertificateProps {
  score: number;
  timeRemaining: number;
  totalTime: number;
  onRestart: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ score, timeRemaining, totalTime, onRestart }) => {
  const [message, setMessage] = useState("수료증 복호화 중...");

  const timeSpent = totalTime - timeRemaining;
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;
  const timeStr = `${minutes}분 ${seconds}초`;

  useEffect(() => {
    generateCertificateMessage(score, timeStr).then(setMessage);
  }, [score, timeStr]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white p-4 md:p-6 lg:p-8 animate-fade-in">
      <div className="max-w-2xl w-full bg-white border-2 md:border-4 border-double border-blue-200 p-6 md:p-8 lg:p-10 rounded-xl shadow-sm relative overflow-hidden text-center">
        
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 bg-blue-50 rounded-br-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-blue-50 rounded-tl-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          <ShieldCheck className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-blue-600 mb-4 md:mb-6 drop-shadow-lg" />
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 mb-2 uppercase tracking-wider">
            인증됨
          </h1>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 mb-6 md:mb-8 tracking-wide">
            정보 보안 전문가
          </h2>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent my-4 md:my-6"></div>

          <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6 md:mb-8 italic px-2">
            "{message}"
          </p>

          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8 w-full max-w-md mb-6 md:mb-8">
            <div className="bg-slate-50 p-3 md:p-4 rounded border border-slate-200">
              <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">최종 점수</div>
              <div className="text-2xl md:text-3xl font-bold text-blue-600 font-mono">{score.toLocaleString()}</div>
            </div>
            <div className="bg-slate-50 p-3 md:p-4 rounded border border-slate-200">
              <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">소요 시간</div>
              <div className="text-2xl md:text-3xl font-bold text-blue-600 font-mono">{timeStr}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 md:mb-8">
             <Award className="w-4 h-4 md:w-5 md:h-5 text-blue-600 shrink-0"/>
             <span className="text-sm md:text-base text-blue-600 font-semibold tracking-wide">화이트 해커 아카데미</span>
          </div>

          <button 
            onClick={onRestart}
            className="px-6 md:px-8 py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-md transition-all text-sm md:text-base"
          >
            새로운 작전 시작
          </button>
        </div>
      </div>
    </div>
  );
};