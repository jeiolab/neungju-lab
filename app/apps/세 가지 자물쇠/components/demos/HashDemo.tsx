import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ArrowDown, Trash2, ShieldCheck, RefreshCw } from 'lucide-react';
import { explainConcept } from '../../services/geminiService';

const HashDemo: React.FC = () => {
  const [inputA, setInputA] = useState("Secret123");
  const [hashA, setHashA] = useState("");
  const [inputB, setInputB] = useState("Secret124"); // Just one char diff
  const [hashB, setHashB] = useState("");
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  // Simple SHA-256 simulation using Web Crypto API
  const calculateHash = async (text: string) => {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  useEffect(() => {
    const updateHashes = async () => {
      const hA = await calculateHash(inputA);
      const hB = await calculateHash(inputB);
      setHashA(hA);
      setHashB(hB);
    };
    updateHashes();
  }, [inputA, inputB]);

  const handleShredAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  const askAI = async () => {
     const text = await explainConcept("해시 함수의 눈사태 효과와 단방향성", "입력값이 조금만 바뀌어도 결과가 완전히 달라지며, 결과를 보고 입력을 유추할 수 없습니다.");
     setExplanation(text);
  };

  // Function to visualize diff (simple implementation)
  const renderHash = (hash: string, compareHash: string) => {
    return (
      <div className="break-all font-mono text-xs leading-4 tracking-tighter">
        {hash.split('').map((char, idx) => (
          <span key={idx} className={char !== compareHash[idx] ? "text-red-600 font-bold bg-red-50" : "text-slate-400"}>
            {char}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full border border-slate-200">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-800">해시 함수 (단방향 암호화)</h2>
          <p className="text-slate-600 mt-2">문서를 '분쇄기'에 넣는 것과 같습니다. 결과물(해시값)로는 원래 내용을 알 수 없습니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Simulation A */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full relative group">
              <label className="text-sm font-bold text-slate-500 mb-1 block">입력 1 (비밀번호)</label>
              <div className="flex items-center gap-2">
                 <input 
                  type="text" 
                  value={inputA}
                  onChange={(e) => setInputA(e.target.value)}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <ArrowDown className="text-orange-300 animate-bounce" />

            <div className="relative w-full bg-slate-100 p-4 rounded-lg border border-slate-200 min-h-[100px] flex items-center justify-center overflow-hidden">
               {/* Visual representation of shredding */}
               <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                 <Trash2 size={80} />
               </div>
               
               <div className="z-10 w-full">
                 <p className="text-xs text-slate-500 mb-1 text-center">SHA-256 출력값</p>
                 {renderHash(hashA, hashB)}
               </div>
            </div>
          </div>

          {/* Simulation B */}
           <div className="flex flex-col items-center gap-4">
            <div className="w-full">
              <label className="text-sm font-bold text-slate-500 mb-1 block">입력 2 (한 글자만 다름!)</label>
              <input 
                type="text" 
                value={inputB}
                onChange={(e) => setInputB(e.target.value)}
                className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors bg-orange-50"
              />
            </div>

            <ArrowDown className="text-orange-300 animate-bounce" />

            <div className="relative w-full bg-slate-100 p-4 rounded-lg border border-slate-200 min-h-[100px] flex items-center justify-center">
               <div className="z-10 w-full">
                 <p className="text-xs text-slate-500 mb-1 text-center">완전히 다른 해시값 (눈사태 효과)</p>
                 {renderHash(hashB, hashA)}
               </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 flex gap-3 items-start">
          <ShieldCheck className="shrink-0 mt-0.5" size={20} />
          <div>
            <strong>왜 비밀번호 저장에 쓸까요?</strong><br/>
            서버 관리자도 사용자의 비밀번호를 알 수 없어야 하기 때문입니다. 해시값만 저장하면, 해커가 DB를 털어도 원래 비밀번호를 복구할 수 없습니다.
          </div>
        </div>

      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={askAI}
          className="bg-indigo-100 text-indigo-700 px-6 py-3 rounded-full font-bold shadow-sm hover:bg-indigo-200 active:scale-95 transition-all flex items-center gap-2 border border-indigo-200"
        >
           AI 선생님 설명듣기
        </button>
      </div>

       {explanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-indigo-50 border border-indigo-100 p-6 rounded-xl w-full text-indigo-900 leading-relaxed shadow-sm"
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <h4 className="font-bold mb-1">AI 선생님의 한마디:</h4>
              <p>{explanation}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HashDemo;