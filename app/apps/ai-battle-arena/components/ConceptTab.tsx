import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Search, Database, Target } from 'lucide-react';

const ConceptTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold text-white">지도학습 <span className="text-slate-500 text-xl">VS</span> 비지도학습</h2>
        <p className="text-slate-400">AI 심판관이 정리해주는 핵심 차이점 비교</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Supervised */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 border-l-4 border-blue-500 rounded-r-xl p-6 shadow-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <Brain className="text-blue-400 w-8 h-8" />
            <h3 className="text-xl font-bold text-blue-400">지도학습 (Supervised)</h3>
          </div>
          <p className="text-sm text-slate-300 mb-4">"정답이 있는 문제집을 풀게 하여 학습시키는 방법"</p>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-blue-500 font-bold">데이터:</span> 입력(X) + 정답 레이블(Y)</li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">목적:</span> 미래 데이터의 정답 예측</li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">유형:</span> 분류(Classification), 회귀(Regression)</li>
          </ul>
        </motion.div>

        {/* Unsupervised */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 border-r-4 border-purple-500 rounded-l-xl p-6 shadow-lg text-right md:text-left"
        >
          <div className="flex items-center gap-3 mb-4 justify-end md:justify-start flex-row-reverse md:flex-row">
            <h3 className="text-xl font-bold text-purple-400">비지도학습 (Unsupervised)</h3>
            <Search className="text-purple-400 w-8 h-8" />
          </div>
          <p className="text-sm text-slate-300 mb-4">"정답 없이 데이터의 특성을 스스로 파악하게 하는 방법"</p>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2 justify-end md:justify-start">입력(X)만 있음 (정답 없음) <span className="text-purple-500 font-bold">:데이터</span></li>
            <li className="flex gap-2 justify-end md:justify-start">데이터의 숨겨진 구조 발견 <span className="text-purple-500 font-bold">:목적</span></li>
            <li className="flex gap-2 justify-end md:justify-start">군집화(Clustering), 차원 축소 <span className="text-purple-500 font-bold">:유형</span></li>
          </ul>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden"
      >
        <div className="bg-slate-800 p-3 border-b border-slate-700 font-bold text-center">심판관의 핵심 요약</div>
        <table className="w-full text-sm md:text-base">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400">
              <th className="p-3 text-center">비교 기준</th>
              <th className="p-3 text-center text-blue-400">지도학습</th>
              <th className="p-3 text-center text-purple-400">비지도학습</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            <tr>
              <td className="p-4 font-bold text-center bg-slate-800/30">핵심 키워드</td>
              <td className="p-4 text-center">예측 (Prediction)</td>
              <td className="p-4 text-center">발견 (Discovery)</td>
            </tr>
            <tr>
              <td className="p-4 font-bold text-center bg-slate-800/30">데이터</td>
              <td className="p-4 text-center flex flex-col items-center gap-1">
                <Database className="w-4 h-4 text-green-400" />
                <span>Labeled Data</span>
              </td>
              <td className="p-4 text-center flex flex-col items-center gap-1">
                <Database className="w-4 h-4 text-red-400" />
                <span>Unlabeled Data</span>
              </td>
            </tr>
            <tr>
              <td className="p-4 font-bold text-center bg-slate-800/30">대표 알고리즘</td>
              <td className="p-4 text-center">Linear Regression, SVM, Decision Tree</td>
              <td className="p-4 text-center">K-Means, PCA, Autoencoder</td>
            </tr>
          </tbody>
        </table>
      </motion.div>

      <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg flex items-start gap-4">
        <Target className="w-6 h-6 text-yellow-500 shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-yellow-500 mb-1">오개념 주의: 분류(Classification) vs 군집화(Clustering)</h4>
          <p className="text-sm text-yellow-200/80">
            둘 다 '나눈다'는 점에서 비슷해 보이지만, <br/>
            <strong>분류</strong>는 "이것은 A그룹이야"라고 정해진 답을 맞추는 것이고 (지도), <br/>
            <strong>군집화</strong>는 "얘네들끼리 비슷하네?"라며 스스로 묶는 것입니다 (비지도).
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConceptTab;