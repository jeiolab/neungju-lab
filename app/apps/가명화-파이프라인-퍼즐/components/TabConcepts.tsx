import React, { useState } from 'react';
import { THEORY_CARDS } from '../constants';
import { User, Ghost, Scale, Shield, HelpCircle } from 'lucide-react';

const icons: Record<string, React.ReactNode> = {
  User: <User size={48} className="text-blue-500" />,
  Mask: <Shield size={48} className="text-green-500" />,
  Ghost: <Ghost size={48} className="text-purple-500" />,
  Scale: <Scale size={48} className="text-amber-500" />,
};

const TabConcepts: React.FC = () => {
  const [flippedId, setFlippedId] = useState<string | null>(null);

  const handleFlip = (id: string) => {
    setFlippedId(flippedId === id ? null : id);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">핵심 개념 카드</h2>
        <p className="text-slate-600">카드를 클릭하여 의미를 확인해보세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {THEORY_CARDS.map((card) => (
          <div
            key={card.id}
            onClick={() => handleFlip(card.id)}
            className="group relative h-64 w-full cursor-pointer perspective-1000"
          >
            <div
              className={`absolute inset-0 w-full h-full duration-500 preserve-3d transition-transform ${
                flippedId === card.id ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front */}
              <div className="absolute inset-0 w-full h-full bg-white rounded-2xl shadow-lg border-2 border-slate-100 flex flex-col items-center justify-center p-6 backface-hidden">
                <div className="mb-4 p-4 bg-slate-50 rounded-full">{icons[card.icon] || <HelpCircle />}</div>
                <h3 className="text-xl font-bold text-slate-800">{card.term}</h3>
                <p className="mt-2 text-sm text-slate-400">클릭해서 뒤집기</p>
              </div>

              {/* Back */}
              <div className="absolute inset-0 w-full h-full bg-indigo-600 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 rotate-y-180 backface-hidden text-white">
                <h3 className="text-xl font-bold mb-4">{card.term}</h3>
                <p className="text-center leading-relaxed font-light">{card.definition}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <HelpCircle size={20} />
          10초 생각하기
        </h3>
        <p className="text-blue-800">
          학교 앞 CCTV 영상은 개인정보일까요? 만약 사람 얼굴을 모두 모자이크 처리했다면 어떻게 부를까요?
        </p>
      </div>
    </div>
  );
};

export default TabConcepts;