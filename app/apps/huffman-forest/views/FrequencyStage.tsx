import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import FruitNode from '../components/FruitNode';
import { FrequencyMap, HuffmanNode } from '../types';
import { createLeafNodes } from '../utils/huffmanLogic';

interface FrequencyStageProps {
  text: string;
  freqMap: FrequencyMap;
  onNext: () => void;
  onBack: () => void;
}

const FrequencyStage: React.FC<FrequencyStageProps> = ({ text, freqMap, onNext, onBack }) => {
  const nodes = createLeafNodes(freqMap);
  const totalChars = text.length;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-2">열매 수확하기</h2>
        <p className="text-slate-600 font-medium">
          "<span className="font-bold text-blue-600 text-xl mx-1">{text}</span>" 
          숲에서 어떤 열매가 가장 많이 열렸을까요?
        </p>
      </motion.div>

      {/* Visualization Area */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.1, type: "spring" }}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-slate-200 shadow-sm"
          >
            <FruitNode node={node} />
            <div className="text-center mt-2">
              <p className="text-sm text-slate-600 font-bold">{node.count}개 발견!</p>
              <div className="w-16 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(node.count / totalChars) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                  className="h-full bg-blue-600"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analysis Text */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-8 max-w-lg w-full text-center"
      >
        <p className="text-blue-900 leading-relaxed">
          와! <span className="font-bold text-blue-700">{nodes[nodes.length-1].char}</span>(이)가 
          가장 많이 나왔네요.<br/>
          반면 <span className="font-bold text-blue-700">{nodes[0].char}</span>(은)는 
          조금밖에 없어요.
        </p>
      </motion.div>

      <div className="flex gap-4">
        <Button variant="secondary" onClick={onBack}>다시 입력</Button>
        <Button onClick={onNext}>나무 만들기</Button>
      </div>
    </div>
  );
};

export default FrequencyStage;