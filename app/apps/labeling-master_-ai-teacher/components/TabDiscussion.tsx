import React, { useState } from 'react';
import { MessageSquare, Eye, Edit3 } from 'lucide-react';

const TabDiscussion: React.FC = () => {
  const [input, setInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="max-w-3xl mx-auto p-6 animate-fade-in">
        <div className="flex items-center space-x-2 text-indigo-600 mb-6">
            <MessageSquare className="w-6 h-6" />
            <h2 className="text-2xl font-bold">생각해볼 문제</h2>
        </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-50">
        <div className="p-8 bg-indigo-600 text-white">
          <h3 className="text-xl font-bold mb-2">Q. 만약 정답을 잘못 알려주면 AI는 어떻게 될까요?</h3>
          <p className="text-indigo-100 opacity-90">
            "사과" 사진을 보여주면서 계속 "바나나"라고 가르친다면, AI 모델은 나중에 어떤 판단을 내리게 될까요? 
            'GIGO(Garbage In, Garbage Out)' 원리와 연관지어 자유롭게 적어보세요.
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Edit3 className="w-4 h-4 mr-2" />
                나의 생각
            </label>
            <textarea
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all outline-none resize-none h-32"
              placeholder="여기에 생각을 적어보세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center space-x-2"
            >
              <Eye className="w-5 h-5" />
              <span>모범 답안 확인하기</span>
            </button>
          ) : (
            <div className="bg-green-50 p-6 rounded-xl border border-green-200 animate-fade-in">
              <h4 className="text-green-800 font-bold mb-2">🤖 모범 답안</h4>
              <p className="text-green-700 leading-relaxed">
                지도학습 모델은 주어진 데이터를 '진리'로 믿고 학습합니다. 만약 잘못된 레이블(정답)을 학습시키면, 
                AI는 잘못된 판단 기준을 갖게 되어 실전에서도 틀린 답을 내놓게 됩니다. 
                이를 <span className="font-bold">"Garbage In, Garbage Out (쓰레기가 들어가면 쓰레기가 나온다)"</span>라고 합니다. 
                따라서 데이터의 품질과 정확한 라벨링이 AI 성능의 핵심입니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabDiscussion;