import React, { useState, useMemo } from 'react';
import { Bit } from '../types';
import { ByteBlock } from './BitVisualizer';
import { ArrowDown, RefreshCcw } from 'lucide-react';

const INITIAL_BITS_8: Bit[] = [0, 0, 0, 0, 0, 0, 0, 0];

export const XorLab: React.FC = () => {
  const [inputBits, setInputBits] = useState<Bit[]>([0, 1, 0, 1, 0, 0, 1, 1]);
  const [keyBits, setKeyBits] = useState<Bit[]>([1, 1, 0, 0, 1, 0, 1, 0]);

  const toggleBit = (setter: React.Dispatch<React.SetStateAction<Bit[]>>, current: Bit[], index: number) => {
    const newBits = [...current];
    newBits[index] = newBits[index] === 0 ? 1 : 0;
    setter(newBits);
  };

  const resultBits = useMemo(() => {
    return inputBits.map((b, i) => (b ^ keyBits[i]) as Bit);
  }, [inputBits, keyBits]);

  // Reverse Logic: Use the Result as the new Input to show decryption
  const handleDecryptSimulation = () => {
    setInputBits([...resultBits]);
    // Key stays the same
  };

  const randomize = () => {
    setInputBits(Array.from({ length: 8 }, () => Math.random() > 0.5 ? 1 : 0));
    setKeyBits(Array.from({ length: 8 }, () => Math.random() > 0.5 ? 1 : 0));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <span className="text-3xl">🧪</span> XOR 실험실
          </h2>
          <button 
            onClick={randomize}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm transition-colors border border-indigo-200"
          >
            <RefreshCcw size={16} /> 무작위 섞기
          </button>
        </div>

        <p className="text-slate-700 mb-6">
          "실험실에 온 걸 환영해! 여기선 <b>다르면 1</b>, <b>같으면 0</b>이야. 
          입력값(Input)이나 키(Key) 블록을 클릭해서 결과가 어떻게 바뀌는지 확인해봐. 
          이게 바로 블록 암호의 핵심이야."
        </p>

        <div className="flex flex-col items-center gap-4">
          <ByteBlock 
            bits={inputBits} 
            label="평문 (Input)" 
            interactive 
            setBits={(i) => toggleBit(setInputBits, inputBits, i)} 
          />
          
          <div className="text-indigo-600 font-bold text-xl flex items-center gap-2">
            <ArrowDown /> XOR (⊕) <ArrowDown />
          </div>

          <ByteBlock 
            bits={keyBits} 
            label="비밀 키 (Key)" 
            interactive 
            setBits={(i) => toggleBit(setKeyBits, keyBits, i)} 
          />

          <div className="text-indigo-600 font-bold text-xl">
             <ArrowDown /> EQUALS (=) <ArrowDown />
          </div>

          <ByteBlock 
            bits={resultBits} 
            label="암호문 (Result)" 
            isResult
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-4">복호화(되돌리기) 확인</h3>
        <p className="text-slate-600 mb-4">
          블록 암호는 반드시 되돌릴 수 있어야 해. **결과(Result)**와 **키(Key)**를 다시 XOR하면, 원래의 **입력값(Input)**이 나와야 하거든.
        </p>
        <button 
          onClick={handleDecryptSimulation}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all shadow-md"
        >
          결과를 입력으로 옮기기 (복호화 시뮬레이션)
        </button>
      </div>
    </div>
  );
};