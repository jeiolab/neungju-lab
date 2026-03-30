import React from 'react';
import { motion } from 'framer-motion';

const TheoryTab: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 pb-24 md:pb-10 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 mb-8"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">단순 vs 지능형 에이전트</h1>
        <p className="text-gray-600 text-lg">시스템이 작동하는 두 가지 근본적인 방식을 비교해봅시다.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="bg-blue-500 p-5 text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              단순 에이전트 (Simple)
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">규칙 기반</span>
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <p className="text-gray-600 leading-relaxed">
              정해진 <strong>"만약 ~라면, ~한다(If-Then)"</strong> 규칙에 따라 작동합니다. 경험을 통해 배우거나 예상치 못한 상황에 대처할 수 없습니다.
            </p>
            <ul className="space-y-4">
              {[
                { label: '의사 결정', val: '미리 입력된 논리' },
                { label: '유연성', val: '낮음 (경직됨)' },
                { label: '학습 능력', val: '없음' },
                { label: '대표 예시', val: '자동문, 온도조절기' }
              ].map((item, idx) => (
                <li key={idx} className="flex justify-between border-b border-gray-100 pb-2 last:border-0">
                  <span className="font-semibold text-gray-500">{item.label}</span>
                  <span className="text-gray-900 font-medium">{item.val}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="bg-indigo-600 p-5 text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
              지능 에이전트 (Intelligent)
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">학습/적응형</span>
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <p className="text-gray-600 leading-relaxed">
              환경을 인식하고 추론하며, <strong>데이터로부터 학습</strong>하여 시간이 지날수록 성능을 향상시킵니다.
            </p>
            <ul className="space-y-4">
              {[
                { label: '의사 결정', val: '확률적 / 학습됨' },
                { label: '유연성', val: '높음 (적응함)' },
                { label: '학습 능력', val: '머신러닝 / AI' },
                { label: '대표 예시', val: '자율주행차, 알파고' }
              ].map((item, idx) => (
                <li key={idx} className="flex justify-between border-b border-gray-100 pb-2 last:border-0">
                  <span className="font-semibold text-gray-500">{item.label}</span>
                  <span className="text-gray-900 font-medium">{item.val}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg shadow-sm"
      >
        <h3 className="text-lg font-bold text-amber-800 mb-2">💡 핵심 요약</h3>
        <p className="text-amber-700">
          가장 큰 차이점은 <strong>자율성(Autonomy)</strong>과 <strong>적응성(Adaptability)</strong>입니다. 
          단순 에이전트는 시키는 대로만 하고, 지능 에이전트는 최선의 방법을 스스로 찾아냅니다.
        </p>
      </motion.div>
    </div>
  );
};

export default TheoryTab;