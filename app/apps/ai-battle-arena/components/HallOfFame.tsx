import React from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';

const HallOfFame: React.FC = () => {
  const MOCK_RANKINGS = [
    { name: "AlphaGo", score: 15400, level: 42 },
    { name: "DeepBlue", score: 12100, level: 35 },
    { name: "Watson", score: 9800, level: 28 },
    { name: "You (Current)", score: 0, level: 1, isMe: true }, // Placeholder
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24">
      <h2 className="text-2xl font-bold text-center text-white mb-8 flex items-center justify-center gap-2">
        <Crown className="text-yellow-500" /> 명예의 전당
      </h2>
      
      <div className="space-y-3">
        {MOCK_RANKINGS.map((rank, i) => (
          <div 
            key={i} 
            className={`flex items-center justify-between p-4 rounded-xl border ${rank.isMe ? 'bg-blue-900/30 border-blue-500/50' : 'bg-slate-800 border-slate-700'}`}
          >
            <div className="flex items-center gap-4">
              <div className="font-gaming text-2xl w-8 text-center text-slate-500">
                {i === 0 ? <Medal className="text-yellow-400 w-8 h-8 mx-auto" /> : 
                 i === 1 ? <Medal className="text-slate-300 w-8 h-8 mx-auto" /> :
                 i === 2 ? <Medal className="text-amber-600 w-8 h-8 mx-auto" /> :
                 i + 1}
              </div>
              <div>
                <div className={`font-bold ${rank.isMe ? 'text-blue-400' : 'text-white'}`}>{rank.name}</div>
                <div className="text-xs text-slate-500">Lv.{rank.level}</div>
              </div>
            </div>
            <div className="font-gaming text-xl text-yellow-500">
              {rank.score.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallOfFame;