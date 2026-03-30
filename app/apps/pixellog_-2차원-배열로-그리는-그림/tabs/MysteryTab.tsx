import React, { useState } from 'react';
import { GridData } from '../types';
import { Eye, EyeOff, Lightbulb } from 'lucide-react';
import { PixelGrid } from '../components/PixelGrid';
import { generateMysteryHint } from '../services/geminiService';

const MYSTERY_DATA: { name: string, data: GridData } = {
  name: "스마일",
  data: [
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0]
  ]
};

export const MysteryTab: React.FC = () => {
  const [revealed, setRevealed] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);

  const getHint = async () => {
    setLoadingHint(true);
    const h = await generateMysteryHint(MYSTERY_DATA.data);
    setHint(h);
    setLoadingHint(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-white mb-2">미스터리 코드</h2>
      <p className="text-slate-400 mb-8">아래의 배열 데이터만 보고 어떤 그림인지 맞춰보세요!</p>

      <div className="w-full bg-slate-950 p-6 rounded-xl font-mono text-sm md:text-base text-slate-300 border border-slate-800 shadow-inner mb-8 overflow-x-auto">
        <div className="text-purple-400 mb-2">const <span className="text-yellow-300">mystery_art</span> = [</div>
        {MYSTERY_DATA.data.map((row, i) => (
          <div key={i} className="pl-4">
            <span className="text-blue-400">[</span>
            {row.join(", ")}
            <span className="text-blue-400">],</span>
          </div>
        ))}
        <div className="text-purple-400 mt-2">];</div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => setRevealed(!revealed)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20"
        >
          {revealed ? <><EyeOff /> 정답 숨기기</> : <><Eye /> 정답 확인하기</>}
        </button>
        
        <button 
           onClick={getHint}
           disabled={loadingHint || hint !== null}
           className="flex items-center gap-2 px-6 py-3 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border border-yellow-600/50 rounded-lg font-bold transition-all"
        >
           <Lightbulb size={20} />
           {loadingHint ? "생성 중..." : "AI 힌트 보기"}
        </button>
      </div>

      {hint && (
          <div className="mt-6 p-4 bg-yellow-900/10 border border-yellow-800/50 rounded-lg text-yellow-200 animate-fade-in-up">
              💡 힌트: {hint}
          </div>
      )}

      {revealed && (
        <div className="mt-12 animate-fade-in-up flex flex-col items-center">
          <div className="text-2xl font-bold text-white mb-4">{MYSTERY_DATA.name}</div>
          <PixelGrid data={MYSTERY_DATA.data} readonly showLabels={false} />
        </div>
      )}
    </div>
  );
};