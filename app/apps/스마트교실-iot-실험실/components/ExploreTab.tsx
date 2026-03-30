import React, { useState } from 'react';
import { Sprout, Zap, HeartPulse, ChevronDown, ChevronUp } from 'lucide-react';

interface ExploreTabProps {
  onQuizComplete: () => void;
}

const topics = [
  {
    id: 1,
    title: "스마트 팜 (Smart Farm)",
    icon: <Sprout className="text-green-600" />,
    desc: "농업에 IoT를 접목하여, 비닐하우스의 온도와 습도를 자동으로 조절하고 작물에게 최적의 환경을 제공합니다.",
    detail: "센서가 토양 수분을 감지하면 클라우드가 분석하여 자동으로 물을 줍니다. 농부님들은 스마트폰으로 농장 상태를 확인하고 제어할 수 있어 노동력이 절감됩니다."
  },
  {
    id: 2,
    title: "스마트 그리드 (Smart Grid)",
    icon: <Zap className="text-yellow-600" />,
    desc: "전기 공급자와 소비자가 정보를 실시간으로 교환하여 에너지를 효율적으로 사용하는 지능형 전력망입니다.",
    detail: "전기 요금이 싼 시간에 전기를 저장했다가 비싼 시간에 사용하거나, 남는 전기를 이웃에게 팔 수도 있습니다. 블랙아웃(대정전)을 막는 데 큰 도움이 됩니다."
  },
  {
    id: 3,
    title: "원격 의료 (Telemedicine)",
    icon: <HeartPulse className="text-rose-600" />,
    desc: "웨어러블 기기(스마트워치 등)를 통해 환자의 건강 상태를 의사에게 전송하고 진료를 받는 서비스입니다.",
    detail: "심박수, 혈당 등을 실시간으로 모니터링하여 위급 상황 시 바로 구급차가 출동할 수 있습니다. 병원에 가기 힘든 도서 산간 지역 주민들에게 큰 도움이 됩니다."
  }
];

const oxQuiz = [
  { q: "스마트팜은 농부가 직접 하루 종일 물을 줘야 한다?", a: false, expl: "아닙니다! 센서가 감지하고 자동으로 물을 줍니다." },
  { q: "스마트 그리드는 전기를 효율적으로 쓰게 도와준다?", a: true, expl: "맞습니다! 에너지 낭비를 줄여줍니다." },
  { q: "원격 의료를 위해서는 인터넷 연결이 필요 없다?", a: false, expl: "아닙니다. 데이터 전송을 위해 네트워크가 필수입니다." }
];

const ExploreTab: React.FC<ExploreTabProps> = ({ onQuizComplete }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [showResult, setShowResult] = useState<boolean | null>(null); // true: correct, false: wrong, null: hidden
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswer = (userAnswer: boolean) => {
    const isCorrect = userAnswer === oxQuiz[quizIndex].a;
    setShowResult(isCorrect);
    
    setTimeout(() => {
      setShowResult(null);
      if (quizIndex < oxQuiz.length - 1) {
        setQuizIndex(prev => prev + 1);
      } else {
        setQuizFinished(true);
        onQuizComplete();
      }
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">더 넓은 세상의 IoT</h2>
        <div className="grid gap-4">
          {topics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <button 
                onClick={() => setExpandedId(expandedId === topic.id ? null : topic.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 rounded-lg">{topic.icon}</div>
                  <div>
                    <h3 className="font-bold text-slate-800">{topic.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{topic.desc}</p>
                  </div>
                </div>
                {expandedId === topic.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </button>
              {expandedId === topic.id && (
                <div className="p-4 bg-indigo-50 text-sm text-slate-700 leading-relaxed border-t border-indigo-100">
                  {topic.detail}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
           ⚡ 미니 OX 퀴즈
        </h3>
        
        {!quizFinished ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <p className="text-lg font-medium mb-8 text-center">{oxQuiz[quizIndex].q}</p>
            
            {showResult === null ? (
              <div className="flex gap-4">
                <button onClick={() => handleAnswer(true)} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold transition-transform active:scale-95 shadow-lg">O (맞다)</button>
                <button onClick={() => handleAnswer(false)} className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 rounded-xl font-bold transition-transform active:scale-95 shadow-lg">X (아니다)</button>
              </div>
            ) : (
              <div className={`p-4 rounded-xl text-center font-bold ${showResult ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                {showResult ? "정답입니다! 👏" : "틀렸습니다. 😅"}
                <p className="text-sm font-normal mt-2 opacity-90">{oxQuiz[quizIndex].expl}</p>
              </div>
            )}
            <div className="mt-4 text-center text-xs opacity-60">{quizIndex + 1} / {oxQuiz.length}</div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🏆</div>
            <p className="font-bold text-xl">퀴즈 완료!</p>
            <p className="text-sm opacity-80 mt-2">IoT 전문가에 한 걸음 더 가까워졌네요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreTab;
