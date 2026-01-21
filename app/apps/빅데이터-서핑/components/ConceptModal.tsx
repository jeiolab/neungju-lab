import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';

interface ConceptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConceptModal: React.FC<ConceptModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="bg-slate-900 p-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpen className="text-cyan-400" />
                <h2 className="text-xl font-bold text-white">빅데이터 핵심 개념 (The 3 Vs)</h2>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition">
                <X />
              </button>
            </div>
            
            <div className="p-6 grid gap-6 bg-slate-50">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-purple-600 mb-2">1. 규모 (Volume)</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  기존의 방법으로는 저장, 관리, 분석하기 어려울 정도로 방대한 양의 데이터를 말합니다. 
                  테라바이트(TB)를 넘어 페타바이트(PB), 제타바이트(ZB) 단위로 측정됩니다.
                </p>
                <p className="mt-2 text-xs font-bold text-slate-500">예시: CCTV 녹화본, 유튜브 전체 영상</p>
              </div>

              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-yellow-600 mb-2">2. 속도 (Velocity)</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  데이터가 실시간으로 생성되고, 빠르게 유통되며 처리되어야 하는 속성을 의미합니다.
                  데이터의 발생 속도가 매우 빠르기 때문에 실시간 분석이 중요합니다.
                </p>
                <p className="mt-2 text-xs font-bold text-slate-500">예시: 센서 데이터, 실시간 검색어, 주식 시세</p>
              </div>

              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-pink-600 mb-2">3. 다양성 (Variety)</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  숫자나 문자 같은 정형 데이터뿐만 아니라, 영상, 음성, 텍스트, 위치 정보 등 
                  형태가 고정되지 않은 비정형 데이터까지 포함하는 특징입니다.
                </p>
                <p className="mt-2 text-xs font-bold text-slate-500">예시: SNS 사진, 카톡 대화 내용</p>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition"
              >
                학습 완료! 게임 시작하기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConceptModal;