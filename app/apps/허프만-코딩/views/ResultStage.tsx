import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import { HuffmanNode, CodeMap } from '../types';
import { assignCodesToTree, generateCodes, stringToBinary, stringToAsciiBinary } from '../utils/huffmanLogic';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import FruitNode from '../components/FruitNode';

interface ResultStageProps {
  root: HuffmanNode;
  originalText: string;
  onReset: () => void;
}

// Tree with labels (0/1) renderer
const LabeledTreeRenderer: React.FC<{ node: HuffmanNode }> = ({ node }) => {
  return (
    <div className="flex flex-col items-center relative z-10">
      <FruitNode node={node} isResult />
      
      {(node.left || node.right) && (
        <div className="flex items-start justify-center mt-12 relative w-full">
           {/* SVG Lines - Orthogonal Style */}
           <svg className="absolute top-[-3rem] left-0 w-full h-12 pointer-events-none z-0" style={{ overflow: 'visible' }}>
             {/* Main Stem */}
             <line x1="50%" y1="0" x2="50%" y2="50%" stroke="#78350f" strokeWidth="4" />
             {/* Horizontal Bar */}
             <line x1="25%" y1="50%" x2="75%" y2="50%" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
             {/* Left Leg */}
             {node.left && <line x1="25%" y1="50%" x2="25%" y2="100%" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />}
             {/* Right Leg */}
             {node.right && <line x1="75%" y1="50%" x2="75%" y2="100%" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />}
           </svg>

          <div className="flex w-full justify-center gap-4 md:gap-12">
            <div className="flex-1 flex justify-center relative">
              {node.left && (
                <>
                  {/* Label 0: Positioned on the left vertical leg */}
                  <div className="absolute top-[-1.8rem] left-[50%] -translate-x-1/2 z-20">
                     <div className="bg-emerald-100 text-emerald-800 text-sm font-bold w-6 h-7 flex items-center justify-center rounded-md border-2 border-emerald-300 shadow-sm">
                       0
                     </div>
                  </div>
                  <LabeledTreeRenderer node={node.left} />
                </>
              )}
            </div>
            <div className="flex-1 flex justify-center relative">
              {node.right && (
                <>
                  {/* Label 1: Positioned on the right vertical leg */}
                  <div className="absolute top-[-1.8rem] left-[50%] -translate-x-1/2 z-20">
                     <div className="bg-amber-100 text-amber-800 text-sm font-bold w-6 h-7 flex items-center justify-center rounded-md border-2 border-amber-300 shadow-sm">
                       1
                     </div>
                  </div>
                  <LabeledTreeRenderer node={node.right} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ResultStage: React.FC<ResultStageProps> = ({ root, originalText, onReset }) => {
  const [codeMap, setCodeMap] = useState<CodeMap>({});
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    assignCodesToTree(root);
    const map = generateCodes(root);
    setCodeMap(map);
  }, [root]);

  const huffmanBits = stringToBinary(originalText, codeMap).length;
  const asciiBits = originalText.length * 8;
  const compressionRatio = Math.round((1 - huffmanBits / asciiBits) * 100);

  const chartData = [
    { name: 'ASCII', bits: asciiBits, fill: '#94a3b8' },
    { name: 'Huffman', bits: huffmanBits, fill: '#d97706' },
  ];

  const handleQuizSubmit = () => {
    const correctAnswer = stringToBinary(originalText, codeMap);
    if (quizAnswer.trim() === correctAnswer) {
      setQuizResult('correct');
    } else {
      setQuizResult('wrong');
    }
  };

  return (
    <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-6 pb-12 items-start">
      
      {/* Left Column: The Tree & Codes */}
      <div className="flex-[2] w-full flex flex-col gap-6">
        
        {/* Tree Container */}
        <div className="bg-white rounded-3xl border-4 border-green-200 p-6 md:p-8 shadow-sm overflow-x-auto relative min-h-[400px]">
          <div className="absolute top-4 left-4 bg-green-100 px-3 py-1 rounded-full text-green-800 font-bold text-sm z-30">
             🌲 완성된 코드 나무
          </div>
          <div className="min-w-[400px] flex justify-center pt-8">
             <LabeledTreeRenderer node={root} />
          </div>
        </div>

        {/* Code Map Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {Object.entries(codeMap).map(([char, code]) => (
            <motion.div 
              key={char} 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="bg-white p-3 rounded-xl border-2 border-green-100 shadow-sm flex flex-col items-center hover:border-amber-300 transition-colors"
            >
              <span className="font-extrabold text-green-800 text-xl">{char}</span>
              <span className="font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-sm mt-1">{code}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Column: Stats & Quiz */}
      <div className="flex-1 w-full flex flex-col gap-6 sticky top-4">
        
        {/* Efficiency Chart */}
        <div className="bg-white p-6 rounded-3xl border-2 border-green-100 shadow-lg">
          <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
            📊 압축 효율 분석
          </h3>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" barSize={20}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px'}} />
                <Bar dataKey="bits" radius={[0, 10, 10, 0]} background={{ fill: '#f1f5f9', radius: [0, 10, 10, 0] }}>
                   <LabelList dataKey="bits" position="right" fill="#64748b" fontSize={12} formatter={(val: number) => `${val} bit`} />
                   {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center mt-2">
            <span className="text-green-800 text-sm">총 크기가</span>
            <strong className="text-2xl text-amber-600 mx-2">{compressionRatio}%</strong>
            <span className="text-green-800 text-sm">줄어들었어요!</span>
          </div>
        </div>

        {/* Quiz Section */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">📝</div>
          <h3 className="text-xl font-bold mb-2">도전! 코딩 퀴즈</h3>
          <p className="text-emerald-100 text-sm mb-4">
            <span className="font-bold text-white text-lg mx-1">"{originalText}"</span> 
            를 0과 1로 바꿔보세요.
          </p>
          
          <div className="relative mb-4">
            <input 
              type="text" 
              value={quizAnswer}
              onChange={(e) => {
                setQuizAnswer(e.target.value.replace(/[^01]/g, ''));
                setQuizResult(null);
              }}
              placeholder="예: 001001..."
              className="w-full pl-4 pr-10 py-3 rounded-xl text-green-900 font-mono text-lg placeholder-green-300 focus:outline-none focus:ring-4 focus:ring-amber-400 shadow-inner"
            />
          </div>
          
          {quizResult === null && (
             <button 
               onClick={handleQuizSubmit}
               className="w-full bg-amber-500 hover:bg-amber-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg border-b-4 border-amber-700 active:scale-95"
             >
               정답 확인하기
             </button>
          )}

          {quizResult === 'correct' && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/20 p-4 rounded-xl backdrop-blur-sm border border-white/30">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="text-yellow-300 w-8 h-8" />
                <span className="font-bold text-lg">정답입니다!</span>
              </div>
              <p className="text-sm text-emerald-100">허프만 코딩의 원리를 완벽하게 이해하셨네요!</p>
            </motion.div>
          )}

          {quizResult === 'wrong' && (
             <motion.div initial={{ x: -10 }} animate={{ x: 0 }} className="bg-red-500/20 p-4 rounded-xl backdrop-blur-sm border border-red-400/30">
               <div className="flex items-center gap-3 mb-2">
                 <XCircle className="text-red-200 w-6 h-6" />
                 <span className="font-bold">앗, 다시 한번!</span>
               </div>
               <button 
                onClick={() => setQuizResult(null)}
                className="text-sm underline text-emerald-200 hover:text-white"
               >
                 다시 시도하기
               </button>
             </motion.div>
          )}
        </div>

        <Button variant="secondary" onClick={onReset} className="w-full py-4 bg-white hover:bg-green-50 !text-green-700 !border-green-200">
          <RotateCcw size={18} /> 처음으로 돌아가기
        </Button>
      </div>
    </div>
  );
};

export default ResultStage;