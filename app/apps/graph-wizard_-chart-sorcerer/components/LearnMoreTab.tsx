import React from 'react';
import { motion } from 'framer-motion';

const LearnMoreTab: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-2">인포그래픽 vs 데이터 시각화</h2>
        <p className="text-slate-400">비슷해 보이지만 다른 두 가지 마법의 차이를 알아볼까요?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-slate-800 rounded-2xl p-8 border-t-4 border-blue-500 shadow-xl"
        >
          <div className="text-5xl mb-6 text-center">🎨</div>
          <h3 className="text-2xl font-bold text-blue-400 mb-4 text-center">인포그래픽 (Infographic)</h3>
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>목적:</strong> 특정 정보를 쉽고 빠르게 전달하고 설득하는 것.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>특징:</strong> 편집자의 의도가 강하게 반영되며, 그림과 텍스트가 조화롭게 배치됨.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 font-bold">•</span>
              <span><strong>예시:</strong> 지하철 노선도, 사용 설명서, 환경 보호 포스터.</span>
            </li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 rounded-2xl p-8 border-t-4 border-purple-500 shadow-xl"
        >
          <div className="text-5xl mb-6 text-center">📊</div>
          <h3 className="text-2xl font-bold text-purple-400 mb-4 text-center">데이터 시각화 (Data Viz)</h3>
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-start gap-3">
              <span className="text-purple-500 font-bold">•</span>
              <span><strong>목적:</strong> 데이터 속에 숨겨진 패턴이나 의미를 발견하는 것.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-500 font-bold">•</span>
              <span><strong>특징:</strong> 객관적인 수치를 그래프(도표) 형태로 자동화하여 보여줌.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-500 font-bold">•</span>
              <span><strong>예시:</strong> 주식 차트, 코로나 확진자 추이 그래프, 기상 지도.</span>
            </li>
          </ul>
        </motion.div>
      </div>

      <div className="mt-12 bg-slate-900/50 p-6 rounded-xl text-center border border-slate-700">
        <p className="text-slate-400">
          <span className="text-white font-bold">마법사의 한마디:</span> 인포그래픽은 <span className="text-blue-400">이야기</span>를 들려주고, 데이터 시각화는 <span className="text-purple-400">증거</span>를 보여줍니다.
        </p>
      </div>
    </div>
  );
};

export default LearnMoreTab;
