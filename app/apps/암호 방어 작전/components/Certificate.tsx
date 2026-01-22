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
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6 animate-fade-in">
      <div className="max-w-2xl w-full bg-slate-900 border-4 border-double border-yellow-500/50 p-8 rounded-xl shadow-[0_0_50px_rgba(234,179,8,0.2)] relative overflow-hidden text-center">
        
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/10 rounded-br-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-tl-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          <ShieldCheck className="w-24 h-24 text-yellow-400 mb-6 drop-shadow-lg" />
          
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 mb-2 uppercase tracking-widest">
            인증됨
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-8 tracking-wider">
            정보 보안 전문가
          </h2>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent my-6"></div>

          <p className="text-slate-300 font-mono leading-relaxed mb-8 italic">
            "{message}"
          </p>

          <div className="grid grid-cols-2 gap-8 w-full max-w-md mb-8">
            <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
              <div className="text-slate-500 text-xs uppercase tracking-widest">최종 점수</div>
              <div className="text-3xl font-bold text-green-400 font-mono">{score}</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded border border-slate-700">
              <div className="text-slate-500 text-xs uppercase tracking-widest">소요 시간</div>
              <div className="text-3xl font-bold text-cyan-400 font-mono">{timeStr}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-8">
             <Award className="w-5 h-5 text-yellow-500"/>
             <span className="text-yellow-500 font-bold tracking-widest uppercase">화이트 해커 아카데미</span>
          </div>

          <button 
            onClick={onRestart}
            className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-lg transition-all"
          >
            새로운 작전 시작
          </button>
        </div>
      </div>
    </div>
  );
};