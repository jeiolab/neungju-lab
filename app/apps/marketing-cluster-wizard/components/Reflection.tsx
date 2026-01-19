import React, { useState } from 'react';
import { Lightbulb, Send } from 'lucide-react';

const Reflection: React.FC = () => {
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIdea("");
      }, 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
      <div className="bg-yellow-50 border border-yellow-100 p-8 rounded-xl">
        <div className="flex items-start mb-4">
          <Lightbulb className="w-8 h-8 text-yellow-500 mr-3 flex-shrink-0" />
          <h2 className="text-2xl font-bold text-gray-800">생각해볼 문제 (Trade-off)</h2>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          우리는 방금 고객을 여러 군집(사이즈)으로 나누어 보았습니다. 
          하지만 군집의 개수를 정하는 것은 항상 <strong>Trade-off(상충 관계)</strong>가 있습니다.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 bg-white p-4 rounded-lg bg-opacity-60">
          <li><strong>군집이 너무 적으면?</strong> (예: Free 사이즈 하나) <br/> <span className="text-sm ml-6 text-gray-500">→ 생산은 쉽지만, 몸에 안 맞는 고객이 많아져 불만족 증가.</span></li>
          <li><strong>군집이 너무 많으면?</strong> (예: 10가지 사이즈) <br/> <span className="text-sm ml-6 text-gray-500">→ 고객 만족도는 높지만, 재고 관리 비용과 생산 복잡도가 폭증.</span></li>
        </ul>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">여러분의 아이디어를 제안해주세요</h3>
        <p className="text-gray-500 mb-6 text-sm">
          질문: "우리 반 친구들을 군집화한다면, '키/몸무게' 말고 어떤 기준(변수)을 쓰면 재미있을까요? 그 이유는?"
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-gray-50"
            placeholder="예: '게임하는 시간'과 '수면 시간'으로 나누어 보고 싶습니다. 왜냐하면..."
          />
          <div className="flex justify-end mt-3">
            <button 
              type="submit"
              className={`flex items-center px-6 py-2 rounded-lg font-semibold text-white transition-all ${submitted ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {submitted ? '제출 완료!' : (
                <>
                  <Send className="w-4 h-4 mr-2" /> 제출하기
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reflection;
