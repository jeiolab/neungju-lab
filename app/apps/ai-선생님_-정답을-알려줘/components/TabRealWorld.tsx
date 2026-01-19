import React from 'react';
import { Mail, ScanLine, Music, ShoppingCart } from 'lucide-react';

const TabRealWorld: React.FC = () => {
  const examples = [
    {
      icon: <Mail className="w-8 h-8 text-blue-500" />,
      title: "스팸 메일 필터",
      desc: "수많은 이메일에 '스팸' 또는 '정상'이라는 딱지(레이블)를 붙여 학습시켰습니다. 이제 새로운 메일이 오면 내용을 보고 분류합니다."
    },
    {
      icon: <ScanLine className="w-8 h-8 text-green-500" />,
      title: "얼굴 인식 잠금해제",
      desc: "내 얼굴 사진(정답)을 미리 등록해두면, 스마트폰이 카메라에 비친 얼굴이 주인인지 아닌지 판단합니다."
    },
    {
      icon: <Music className="w-8 h-8 text-pink-500" />,
      title: "음악 추천 시스템",
      desc: "내가 '좋아요'를 누른 노래들의 특징을 학습하여, 내가 좋아할 만한 새로운 노래를 찾아줍니다."
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-orange-500" />,
      title: "상품 가격 예측",
      desc: "과거의 판매 데이터를 학습하여 다음 달에 물건이 얼마나 팔릴지 숫자로 예측(회귀)합니다."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">우리 주변의 지도학습</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {examples.map((ex, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex items-start gap-4">
            <div className="p-4 bg-gray-50 rounded-xl shrink-0">
              {ex.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{ex.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{ex.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabRealWorld;