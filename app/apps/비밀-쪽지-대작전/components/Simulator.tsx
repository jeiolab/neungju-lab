import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock, Unlock, RefreshCw } from 'lucide-react';

interface SimulatorProps {
  onComplete: () => void;
}

const Simulator: React.FC<SimulatorProps> = ({ onComplete }) => {
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [key, setKey] = useState<number>(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Simple Caesar Cipher Logic for Demo
  const processText = (text: string, shift: number, direction: 1 | -1) => {
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      // Shift visible characters only to avoid control chars
      if (code >= 32 && code <= 126) {
         // ASCII range
         let newCode = code + (shift * direction);
         if(newCode > 126) newCode = 32 + (newCode - 127);
         if(newCode < 32) newCode = 126 - (32 - newCode);
         return String.fromCharCode(newCode);
      }
      // For Korean and others, just simple shift for visual effect
      return String.fromCharCode(code + (shift * direction));
    }).join('');
  };

  const handleAction = () => {
    if (!plaintext && mode === 'encrypt') return;
    if (!ciphertext && mode === 'decrypt') return;

    setIsAnimating(true);
    
    setTimeout(() => {
      if (mode === 'encrypt') {
        setCiphertext(processText(plaintext, key, 1));
      } else {
        setPlaintext(processText(ciphertext, key, -1));
      }
      setIsAnimating(false);
      onComplete(); // Mark as interacted
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <RefreshCw className="animate-spin-slow" /> 쪽지 변환기 (Simulator)
        </h2>
        <p className="text-indigo-200">
          평문을 넣고 키를 설정해서 암호문을 만들어보자. 반대로도 가능해!
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        
        {/* Key Control */}
        <div className="mb-8 flex items-center justify-center gap-4 bg-slate-100 p-4 rounded-lg">
          <label className="font-bold text-slate-700">비밀 키(Key) 설정:</label>
          <input 
            type="number" 
            value={key}
            onChange={(e) => setKey(parseInt(e.target.value) || 0)}
            className="w-20 p-2 text-center border-2 border-indigo-300 rounded-md font-mono text-lg focus:outline-none focus:border-indigo-500"
          />
          <span className="text-sm text-slate-500">(숫자만큼 글자가 밀려!)</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          
          {/* Plaintext Area */}
          <div className="w-full flex-1">
            <label className="block text-sm font-bold text-green-700 mb-2 flex items-center gap-1">
              <Unlock size={16}/> 평문 (Plaintext)
            </label>
            <textarea
              value={plaintext}
              onChange={(e) => {
                  setPlaintext(e.target.value);
                  if(mode === 'decrypt') setCiphertext(''); // Clear opposite if editing
              }}
              placeholder="친구에게 보낼 비밀 메시지를 입력해봐!"
              className="w-full h-32 p-4 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all resize-none"
              disabled={mode === 'decrypt' && isAnimating}
            />
          </div>

          {/* Action Area */}
          <div className="flex flex-col items-center gap-4">
             <button
               onClick={() => {
                 setMode('encrypt');
                 handleAction();
               }}
               disabled={isAnimating || !plaintext}
               className={`w-32 py-3 rounded-lg font-bold text-white shadow-md transition-all flex items-center justify-center gap-2
                 ${isAnimating && mode === 'encrypt' ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-105'}
               `}
             >
               {isAnimating && mode === 'encrypt' ? '변환 중...' : <>암호화 <ArrowRight size={18}/></>}
             </button>

             <button
               onClick={() => {
                 setMode('decrypt');
                 handleAction();
               }}
               disabled={isAnimating || !ciphertext}
               className={`w-32 py-3 rounded-lg font-bold text-white shadow-md transition-all flex items-center justify-center gap-2
                 ${isAnimating && mode === 'decrypt' ? 'bg-slate-400' : 'bg-pink-600 hover:bg-pink-700 hover:scale-105'}
               `}
             >
               {isAnimating && mode === 'decrypt' ? '복구 중...' : <><ArrowRight size={18} className="rotate-180"/> 복호화</>}
             </button>
          </div>

          {/* Ciphertext Area */}
          <div className="w-full flex-1">
            <label className="block text-sm font-bold text-red-700 mb-2 flex items-center gap-1">
              <Lock size={16}/> 암호문 (Ciphertext)
            </label>
            <textarea
              value={ciphertext}
              onChange={(e) => {
                  setCiphertext(e.target.value);
                  if(mode === 'encrypt') setPlaintext('');
              }}
              placeholder="알 수 없는 외계어가 나타날 거야..."
              className="w-full h-32 p-4 border-2 border-red-200 rounded-xl bg-red-50 font-mono text-red-800 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all resize-none"
              disabled={mode === 'encrypt' && isAnimating}
            />
          </div>
        </div>

        {isAnimating && (
           <div className="mt-6 text-center text-indigo-500 font-bold animate-pulse">
             키 값 {key}을(를) 적용해서 글자를 뒤섞는 중... 🌪️
           </div>
        )}
      </div>
    </div>
  );
};

export default Simulator;