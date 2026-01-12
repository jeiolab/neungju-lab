import React from 'react';

const Gallery: React.FC = () => {
  const examples = [
    {
      title: "히트맵 (Heatmap)",
      desc: "데이터의 밀도를 색상으로 표현해요. 온도가 높을수록 붉은색!",
      color: "bg-gradient-to-br from-blue-200 via-purple-200 to-red-400"
    },
    {
      title: "산점도 (Scatter Plot)",
      desc: "두 변수 간의 관계를 점으로 찍어 보여줘요. 키와 몸무게의 관계처럼요.",
      color: "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-slate-100 to-slate-200"
    },
    {
      title: "방사형 차트 (Radar Chart)",
      desc: "게임 캐릭터의 능력치(공격, 방어, 스피드 등)를 비교할 때 좋아요.",
      color: "bg-indigo-50"
    }
  ];

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6 text-slate-800">🖼️ 고급 시각화 갤러리</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {examples.map((ex, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-32 w-full ${ex.color} flex items-center justify-center`}>
              {/* Abstract visual representation */}
              <span className="text-4xl opacity-50">📊</span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-slate-800 mb-2">{ex.title}</h3>
              <p className="text-sm text-slate-600">{ex.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
