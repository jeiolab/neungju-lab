import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: "왜 해시는 복호화가 안 되나요?",
    a: "해시 함수는 '믹서기'와 같습니다. 믹서기에 과일을 갈고 나면 다시 원래 과일 모양으로 되돌릴 수 없죠. 수학적으로 정보의 일부를 버리고 압축하기 때문에 역연산이 불가능하도록 설계되었습니다."
  },
  {
    q: "HTTPS는 왜 돈이 드나요?",
    a: "과거에는 인증서를 발급받는 데 비용이 많이 들었지만, 지금은 'Let's Encrypt' 같은 무료 인증서 기관이 있어서 누구나 무료로 HTTPS를 적용할 수 있습니다. 보안은 이제 선택이 아닌 필수이기 때문입니다."
  },
  {
    q: "소금(Salt)이 뭐예요?",
    a: "같은 비밀번호('1234')라도 해시값은 항상 똑같습니다. 해커들은 미리 계산된 표(레인보우 테이블)를 이용해 이를 뚫을 수 있습니다. 그래서 비밀번호 뒤에 무작위 문자열(소금)을 붙여서('1234+xg2a') 해시하면, 해시값이 완전히 달라져서 공격을 막을 수 있습니다."
  },
  {
    q: "내 앱은 아무도 안 쓸 텐데 보안이 필요한가요?",
    a: "'Security by Obscurity(숨기는 것으로 보안)'는 잘못된 생각입니다. 자동화된 봇들은 인터넷상의 모든 취약한 서버를 무작위로 스캔합니다. 사용자가 1명이라도 있다면 그 사람의 정보를 지키는 것이 개발자의 윤리입니다."
  }
];

const TabLearnMore: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
        <HelpCircle className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">더 알아보기 (FAQ)</h2>
        <p className="text-gray-600">
          보안 공부를 하다 보면 생기는 궁금증들을 모았습니다.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <button 
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <span className="flex items-center gap-3">
                <span className="text-indigo-600 text-xl">Q.</span>
                {faq.q}
              </span>
              {openIdx === idx ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
            </button>
            {openIdx === idx && (
               <div className="p-5 pt-0 bg-gray-50 border-t border-gray-100 text-gray-700 leading-relaxed animate-fadeIn">
                 <div className="flex gap-3 pt-4">
                    <span className="text-green-600 font-bold text-xl">A.</span>
                    <p>{faq.a}</p>
                 </div>
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabLearnMore;
