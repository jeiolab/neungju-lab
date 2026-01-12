import React, { useState } from 'react';
import { ALPHABET } from '../types';
import { 
  Anchor, Aperture, Activity, Award, Banana, Beaker, Bell, 
  Binary, Bird, Bitcoin, Bluetooth, Bomb, Bone, Box, Briefcase, 
  Bug, Cake, Camera, Candy, Car, Cat, Check, Cherry, ChevronUp, Circle, Cloud
} from 'lucide-react';

// Map A-Z to specific icons to simulate a symbol cipher
const ICON_MAP: Record<string, React.ReactNode> = {
  A: <Anchor />, B: <Bird />, C: <Cat />, D: <Cloud />, E: <Activity />,
  F: <Beaker />, G: <Bomb />, H: <Bone />, I: <Bug />, J: <Banana />,
  K: <Briefcase />, L: <Bell />, M: <Bitcoin />, N: <Binary />, O: <Box />,
  P: <Aperture />, Q: <Award />, R: <Cake />, S: <Camera />, T: <Candy />,
  U: <Car />, V: <Check />, W: <Cherry />, X: <ChevronUp />, Y: <Circle />, Z: <Bluetooth />
};

const SymbolTab: React.FC = () => {
  const [input, setInput] = useState('SHERLOCK');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Intro */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">심볼 치환 암호 (Symbol Substitution)</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
           셜록 홈즈의 "춤추는 사람 그림"에서 영감을 받은 모드입니다. 
           카이사르 암호처럼 알파벳 순서를 미는 것이 아니라, 각 글자를 고유한 그림으로 1:1 교환합니다.
        </p>
      </div>

      {/* Interactive Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Input */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <label className="block text-sm font-semibold text-slate-600 mb-4">
                메시지 입력 (영어)
            </label>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-40 bg-slate-50 p-4 rounded-xl border border-slate-300 focus:border-purple-500 outline-none font-mono text-2xl resize-none text-slate-900 placeholder-slate-400"
                placeholder="여기에 입력하세요..."
            />
        </div>

        {/* Output (Symbols) */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden min-h-[250px] flex items-center justify-center">
            <div className="flex flex-wrap gap-4 justify-center items-center z-10 p-4">
                {input.toUpperCase().split('').map((char, idx) => {
                    const isAlpha = ALPHABET.includes(char);
                    
                    if (!isAlpha) {
                        // Preserve spaces and punctuation
                        if (char === ' ') return <div key={idx} className="w-8"></div>;
                        return <span key={idx} className="text-slate-800 font-bold text-3xl font-mono">{char}</span>;
                    }

                    return (
                        <div key={idx} className="flex flex-col items-center gap-1 group">
                             <div className="w-12 h-12 flex items-center justify-center text-slate-700 transform transition-transform group-hover:scale-125 duration-300">
                                {ICON_MAP[char]}
                             </div>
                             {/* Hover reveal */}
                             <div className="h-4 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                {char}
                             </div>
                        </div>
                    );
                })}
                {input.length === 0 && (
                    <span className="text-slate-400 italic">심볼이 여기에 나타납니다...</span>
                )}
            </div>
        </div>
      </div>

      {/* Reference Key */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-600 uppercase mb-4">참조표 (Reference Key)</h3>
        <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-4">
            {ALPHABET.map(letter => (
                <div key={letter} className="flex flex-col items-center gap-2 p-2 bg-white rounded hover:bg-slate-50 transition-colors border border-slate-200 hover:border-slate-300">
                    <span className="text-xs text-slate-600 font-mono">{letter}</span>
                    <div className="text-slate-700 w-6 h-6 flex items-center justify-center">
                        {React.cloneElement(ICON_MAP[letter] as React.ReactElement, { size: 20 })}
                    </div>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default SymbolTab;