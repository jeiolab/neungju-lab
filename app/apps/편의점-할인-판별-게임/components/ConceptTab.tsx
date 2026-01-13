import React, { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

const ConceptCard = ({ title, symbol, desc, example, type }: { title: string, symbol: string, desc: string, example: string, type: 'compare' | 'logic' | 'membership' }) => (
  <div className={`p-4 rounded-xl border-2 shadow-sm ${type === 'compare' ? 'border-blue-200 bg-blue-50' : type === 'logic' ? 'border-purple-200 bg-purple-50' : 'border-green-200 bg-green-50'}`}>
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-bold text-lg text-gray-800">{title}</h3>
      <span className="text-2xl font-mono font-bold text-gray-600 bg-white px-2 py-1 rounded">{symbol}</span>
    </div>
    <p className="text-sm text-gray-600 mb-3">{desc}</p>
    <div className="bg-white p-2 rounded text-sm font-mono text-gray-700">
      Eg. {example}
    </div>
  </div>
);

const MiniQuiz = () => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const checkAnswer = (ans: boolean) => {
    setFeedback(ans ? "정답입니다! 둘 다 참이어야 참이 됩니다." : "틀렸습니다. OR 연산자는 하나만 참이어도 참입니다.");
  };

  return (
    <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-orange-500" />
        개념 확인 질문
      </h4>
      <p className="mb-4 text-gray-700">"조건 A와 조건 B가 <strong>모두 참(True)</strong>일 때만 결과가 참이 되는 연산자는?"</p>
      <div className="flex gap-3">
        <button onClick={() => checkAnswer(true)} className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-bold transition">AND</button>
        <button onClick={() => checkAnswer(false)} className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-bold transition">OR</button>
      </div>
      {feedback && (
        <div className={`mt-3 text-sm font-bold ${feedback.startsWith('정답') ? 'text-green-600' : 'text-red-500'}`}>
          {feedback}
        </div>
      )}
    </div>
  );
};

const ConceptTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">판별의 기초: 조건식</h2>
        <p className="text-gray-600">컴퓨터는 상황을 True(참) 또는 False(거짓)로만 판단합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ConceptCard 
          title="같다 (Equal)" 
          symbol="==" 
          desc="좌우의 값이 같으면 참" 
          example="price == 1000" 
          type="compare"
        />
        <ConceptCard 
          title="다르다 (Not Equal)" 
          symbol="!=" 
          desc="좌우의 값이 다르면 참" 
          example="gender != 'M'" 
          type="compare"
        />
        <ConceptCard 
          title="크거나 같다" 
          symbol=">=" 
          desc="왼쪽이 오른쪽보다 크거나 같으면 참" 
          example="age >= 19" 
          type="compare"
        />
        <ConceptCard 
          title="그리고 (AND)" 
          symbol="and" 
          desc="양쪽 조건이 모두 참이어야 참" 
          example="member and coupon" 
          type="logic"
        />
        <ConceptCard 
          title="또는 (OR)" 
          symbol="or" 
          desc="하나라도 참이면 참" 
          example="cash or card" 
          type="logic"
        />
         <ConceptCard 
          title="포함 (IN)" 
          symbol="in" 
          desc="오른쪽 목록에 왼쪽 값이 있으면 참" 
          example="'Cola' in menu" 
          type="membership"
        />
      </div>

      <MiniQuiz />
      
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 flex items-start gap-3 mt-4">
        <div className="mt-1"><ArrowRight className="w-4 h-4" /></div>
        <div>
            <strong>팁:</strong> 프로그래밍에서 '='는 '같다'가 아니라 '대입(저장)'을 의미합니다. 비교할 때는 꼭 '=='를 써야 해요!
        </div>
      </div>
    </div>
  );
};

export default ConceptTab;