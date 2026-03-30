import React, { useState } from 'react';
import { Wifi, Server, Cpu, Database, ArrowRight } from 'lucide-react';

interface TheoryTabProps {
  onComplete: () => void;
}

const TheoryTab: React.FC<TheoryTabProps> = ({ onComplete }) => {
  const [readCards, setReadCards] = useState<number[]>([]);

  const concepts = [
    {
      id: 1,
      title: "1. 사물인터넷(IoT)이란?",
      desc: "세상의 모든 사물들이 인터넷으로 연결되어 서로 대화하는 기술입니다. 책상, 가방, 전등이 '스마트'해지는 비결이죠.",
      icon: <Wifi className="text-blue-500" size={32} />,
      color: "bg-blue-50 border-blue-200"
    },
    {
      id: 2,
      title: "2. 센서(Sensor)",
      desc: "사람의 눈, 코, 귀처럼 주변 환경을 감지하는 도구입니다. 온도, 습도, 움직임, 공기질 등을 숫자로 바꿔줍니다.",
      icon: <Cpu className="text-green-500" size={32} />,
      color: "bg-green-50 border-green-200"
    },
    {
      id: 3,
      title: "3. 클라우드 & 데이터",
      desc: "센서가 모은 정보를 저장하고 분석하는 거대한 인터넷 창고입니다. 여기서 '어떻게 행동할지' 판단합니다.",
      icon: <Server className="text-purple-500" size={32} />,
      color: "bg-purple-50 border-purple-200"
    },
    {
      id: 4,
      title: "4. 액추에이터(행동)",
      desc: "판단된 결과에 따라 실제로 움직이는 장치입니다. 창문을 열거나, 에어컨을 켜거나, 경보를 울립니다.",
      icon: <Database className="text-rose-500" size={32} />,
      color: "bg-rose-50 border-rose-200"
    }
  ];

  const handleRead = (id: number) => {
    if (!readCards.includes(id)) {
      const newRead = [...readCards, id];
      setReadCards(newRead);
      if (newRead.length === concepts.length) {
        onComplete();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-2">디지털 세상의 원리</h2>
        <p className="text-slate-600">
          우리가 편리하게 쓰는 스마트 기기들은 <span className="font-bold text-indigo-600">센서 → 네트워크 → 판단 → 행동</span>의 과정을 거칩니다.
          아래 카드를 눌러 개념을 익혀보세요!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {concepts.map((card) => (
          <button
            key={card.id}
            onClick={() => handleRead(card.id)}
            className={`text-left p-5 rounded-xl border-2 transition-all hover:shadow-md ${
              readCards.includes(card.id) ? 'opacity-60 grayscale' : 'opacity-100'
            } ${card.color}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">{card.icon}</div>
              {readCards.includes(card.id) && <span className="text-xs font-bold bg-slate-200 px-2 py-1 rounded">학습완료</span>}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">{card.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
          </button>
        ))}
      </div>
      
      {readCards.length === concepts.length && (
        <div className="bg-indigo-600 text-white p-4 rounded-xl text-center animate-bounce">
          <p className="font-bold">모든 개념 학습 완료! 🎉</p>
          <p className="text-sm opacity-90">이제 '실험' 탭으로 이동해서 직접 IoT를 만들어보세요.</p>
        </div>
      )}
    </div>
  );
};

export default TheoryTab;
