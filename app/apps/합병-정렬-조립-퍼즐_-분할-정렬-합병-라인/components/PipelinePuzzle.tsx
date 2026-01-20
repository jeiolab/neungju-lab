import React, { useState } from 'react';
import { PIPELINE_STEPS } from '../constants';
import { PipelineStep, UserStats } from '../types';
import { motion, Reorder } from 'framer-motion';

interface Props {
  userStats: UserStats;
  updateStats: (newStats: Partial<UserStats>) => void;
}

const PipelinePuzzle: React.FC<Props> = ({ userStats, updateStats }) => {
  // Shuffle initially
  const [items, setItems] = useState<PipelineStep[]>(() => {
    return [...PIPELINE_STEPS].sort(() => Math.random() - 0.5);
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const checkOrder = () => {
    const correctOrderIds = ['1', '2', '3', '4']; // Based on ID definition in constants
    
    // Allow left/right sort to be swapped (2 then 3, OR 3 then 2)
    // Actually standard merge sort usually calls left then right, but conceptually they are independent.
    // However, for strict puzzle logic, let's enforce: Split -> Sort Left -> Sort Right -> Merge.
    
    const currentIds = items.map(i => i.id);
    const isCorrect = 
        currentIds[0] === '1' && 
        currentIds[3] === '4' && 
        ((currentIds[1] === '2' && currentIds[2] === '3') || (currentIds[1] === '3' && currentIds[2] === '2'));

    if (isCorrect) {
      setFeedback("정답입니다! 분할하고, 각각 정렬을 맡기고, 마지막에 합치는 완벽한 흐름입니다.");
      setIsSuccess(true);
      if (!isSuccess) { // Prevent double counting
        updateStats({
            xp: userStats.xp + 100,
            completedPuzzles: userStats.completedPuzzles + 1
        });
      }
    } else {
        setIsSuccess(false);
        // Provide specific feedback
        if (currentIds[0] !== '1') {
            setFeedback("힌트: 정렬을 시작하려면 먼저 리스트를 어떻게 해야 할까요? (분할 정복)");
        } else if (currentIds[3] !== '4') {
            setFeedback("힌트: 정렬된 부분들을 가지고 마지막에 무엇을 해야 전체가 정렬될까요?");
        } else {
            setFeedback("힌트: 분할한 뒤에는 각 부분을 정렬해야 합니다.");
        }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">알고리즘 파이프라인 조립</h2>
        <p className="text-gray-600 mb-6">
          주문 폭주를 해결하기 위한 <strong>합병 정렬(Merge Sort)</strong>의 처리 순서를 올바르게 나열해주세요.
          카드를 드래그하여 순서를 바꿀 수 있습니다.
        </p>

        <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3 mb-8">
          {items.map((item) => (
            <Reorder.Item key={item.id} value={item}>
              <div className={`p-4 rounded-xl border-2 cursor-grab active:cursor-grabbing shadow-sm flex items-center gap-4 transition-colors
                ${isSuccess ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-blue-300'}
              `}>
                <div className="text-2xl opacity-50 select-none">☰</div>
                <div>
                    <h3 className="font-bold text-lg">{item.label}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <div className="flex flex-col items-center gap-4">
            <button 
                onClick={checkOrder}
                className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-transform active:scale-95
                    ${isSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}
                `}
            >
                {isSuccess ? "조립 성공! (다시 섞기 없음)" : "파이프라인 가동 (검사)"}
            </button>
            
            {feedback && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg w-full text-center font-medium
                        ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-700'}
                    `}
                >
                    {feedback}
                </motion.div>
            )}
        </div>
      </div>
      
      {/* Trade-off Card */}
      <div className="mt-8 bg-yellow-50 p-6 rounded-xl border border-yellow-200">
        <h3 className="font-bold text-yellow-800 text-lg mb-2">💡 트레이드오프 카드: 공간 복잡도</h3>
        <p className="text-yellow-900 text-sm">
            합병 정렬은 매우 빠르고 안정적이지만, <strong>합병(Merge)</strong> 단계에서 
            임시로 데이터를 저장할 <strong>추가 메모리 공간(배열)</strong>이 필요합니다. 
            (공간 복잡도 O(N)). 
            <br/>
            주문서가 너무 많아 책상이 좁다면 곤란할 수 있겠죠?
        </p>
      </div>
    </div>
  );
};

export default PipelinePuzzle;
