import React, { useState } from 'react';

const QUIZ_DATA = [
  { id: 'iot', term: '사물인터넷(IoT)', desc: '센서를 통해 온도, 습도 등 데이터를 수집하고 인터넷으로 연결하는 기술' },
  { id: 'bigdata', term: '빅데이터', desc: '수집된 방대한 데이터를 분석하여 최적의 사육 환경 패턴을 찾는 기술' },
  { id: 'cloud', term: '클라우드', desc: '데이터를 인터넷 서버에 저장하여 언제 어디서든 접속해 관리하는 기술' },
  { id: 'ai', term: '인공지능(AI)', desc: '데이터를 학습하여 스스로 판단하고(질병 진단 등) 제어하는 기술' },
];

const QuizTab: React.FC = () => {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrongShake, setWrongShake] = useState(false);

  // Shuffle descriptions on mount (omitted for simplicity, assuming fixed order is okay for MVP, 
  // but let's just reverse them to make it slightly challenging)
  const [shuffledDescs] = useState(() => [...QUIZ_DATA].sort(() => Math.random() - 0.5));

  const handleTermClick = (id: string) => {
    if (matched.includes(id)) return;
    setSelectedTerm(id);
  };

  const handleDescClick = (id: string) => {
    if (matched.includes(id)) return;
    
    if (selectedTerm === id) {
      setMatched([...matched, id]);
      setSelectedTerm(null);
    } else {
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 500);
      setSelectedTerm(null);
    }
  };

  const isComplete = matched.length === QUIZ_DATA.length;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🧩 스마트 기술 용어 짝맞추기</h2>
      <p className="text-center text-gray-600 mb-8">왼쪽의 용어를 클릭하고, 맞는 설명을 오른쪽에서 찾아주세요!</p>

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${wrongShake ? 'animate-pulse' : ''}`}>
        
        {/* Terms Column */}
        <div className="space-y-4">
          {QUIZ_DATA.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTermClick(item.id)}
              disabled={matched.includes(item.id)}
              className={`w-full p-4 rounded-xl text-left font-bold transition-all transform hover:scale-105
                ${matched.includes(item.id) 
                  ? 'bg-gray-200 text-gray-400 border-2 border-transparent' 
                  : selectedTerm === item.id 
                    ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-800 shadow-md' 
                    : 'bg-white border-2 border-gray-200 hover:border-emerald-300 text-gray-700 shadow-sm'
                }`}
            >
              {matched.includes(item.id) ? '✅ ' : ''}{item.term}
            </button>
          ))}
        </div>

        {/* Definitions Column */}
        <div className="space-y-4">
          {shuffledDescs.map((item) => (
            <button
              key={item.id}
              onClick={() => handleDescClick(item.id)}
              disabled={matched.includes(item.id)}
              className={`w-full p-4 rounded-xl text-left text-sm transition-all
                ${matched.includes(item.id)
                  ? 'bg-gray-200 text-gray-400 border-2 border-transparent'
                  : selectedTerm 
                    ? 'bg-white border-2 border-dashed border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 cursor-pointer animate-pulse'
                    : 'bg-white border-2 border-gray-200 text-gray-600'
                }`}
            >
              {item.desc}
            </button>
          ))}
        </div>
      </div>

      {isComplete && (
        <div className="mt-10 p-6 bg-emerald-100 rounded-xl text-center animate-bounce">
          <h3 className="text-2xl font-bold text-emerald-800">🎉 축하합니다! 모든 용어를 마스터하셨네요!</h3>
          <p className="text-emerald-700 mt-2">이제 여러분은 스마트 팜 전문가입니다.</p>
        </div>
      )}
    </div>
  );
};

export default QuizTab;