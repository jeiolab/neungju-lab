import React, { useState } from 'react';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';

interface InputStageProps {
  onSubmit: (text: string) => void;
}

const InputStage: React.FC<InputStageProps> = ({ onSubmit }) => {
  const [input, setInput] = useState("BANANA");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = input.trim().toUpperCase().replace(/[^A-Z]/g, ''); // Only letters
    
    if (cleanInput.length < 2) {
      setError("최소 2글자 이상 입력해주세요!");
      return;
    }
    if (cleanInput.length > 10) {
      setError("실습을 위해 10글자까지만 입력해주세요! (너무 길면 나무가 복잡해져요)");
      return;
    }
    if (new Set(cleanInput.split('')).size < 2) {
        setError("서로 다른 글자가 2개 이상 필요해요!");
        return;
    }

    onSubmit(cleanInput);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center w-full max-w-lg p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border-4 border-green-100"
    >
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-3xl">
        🌳
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-4 text-center">
        단어의 숲으로 떠나요!
      </h2>
      <p className="text-green-600 mb-8 text-center break-keep">
        알파벳들이 모여있는 숲이에요.<br/>
        어떤 단어를 압축해볼까요?
      </p>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value.toUpperCase());
              setError("");
            }}
            placeholder="예: BANANA"
            className="w-full px-6 py-4 text-xl font-bold text-center text-green-900 bg-green-50 border-2 border-green-300 rounded-2xl focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all uppercase placeholder-green-300"
          />
          <button 
            type="button" 
            onClick={() => setInput("BANANA")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-600 p-2"
            title="기본값 복원"
          >
            <RefreshCcw size={18} />
          </button>
        </div>
        
        {error && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-red-500 text-sm font-bold text-center"
          >
            {error}
          </motion.p>
        )}

        <Button type="submit" className="w-full text-lg mt-2">
          숲으로 입장하기
        </Button>
      </form>
    </motion.div>
  );
};

export default InputStage;