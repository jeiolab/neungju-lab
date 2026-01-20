import React from 'react';
import { Layers, Box, Grid3X3, ArrowRight } from 'lucide-react';

const ConceptCard = ({ title, icon, desc, visual }: { title: string, icon: React.ReactNode, desc: string, visual: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
    </div>
    <p className="text-slate-600 mb-6 min-h-[3rem] text-sm">{desc}</p>
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex justify-center items-center h-32">
      {visual}
    </div>
  </div>
);

const TabConcepts: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">데이터의 차원(Dimension) 이해하기</h2>
        <p className="text-slate-600">
          우리가 사는 세상의 데이터를 컴퓨터는 어떻게 저장할까요? <br/>
          점(0차원)부터 입체(3차원)까지의 확장을 알아봅시다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ConceptCard
          title="1차원: 리스트 (List)"
          icon={<Layers size={24} />}
          desc="한 줄로 늘어선 데이터입니다. 기차의 객실이나 아파트 한 층의 호수와 같습니다."
          visual={
            <div className="flex gap-1">
              {[10, 20, 30].map((n, i) => (
                <div key={i} className="w-10 h-10 bg-blue-100 border-2 border-blue-400 flex items-center justify-center font-mono text-sm rounded">
                  {n}
                </div>
              ))}
            </div>
          }
        />
        <ConceptCard
          title="2차원: 행렬 (Matrix)"
          icon={<Grid3X3 size={24} />}
          desc="행(Row)과 열(Column)이 있는 표 구조입니다. 교실 좌석표나 엑셀 시트가 대표적입니다."
          visual={
            <div className="grid grid-cols-2 gap-1">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="w-10 h-10 bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center font-mono text-sm rounded">
                  {n}
                </div>
              ))}
            </div>
          }
        />
        <ConceptCard
          title="3차원: 텐서 (Tensor)"
          icon={<Box size={24} />}
          desc="2차원 표가 여러 장 겹쳐진 형태입니다. 컬러 이미지(R,G,B 채널)나 시간별 점수표 모음입니다."
          visual={
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-12 h-12 bg-amber-100 border-2 border-amber-400 z-10 rounded shadow-sm"></div>
              <div className="absolute top-2 left-2 w-12 h-12 bg-amber-200 border-2 border-amber-500 z-20 rounded shadow-sm"></div>
              <div className="absolute top-4 left-4 w-12 h-12 bg-amber-300 border-2 border-amber-600 z-30 flex items-center justify-center text-xs font-bold rounded shadow-sm">3D</div>
            </div>
          }
        />
      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl flex items-start gap-4">
        <div className="bg-white p-2 rounded-full shadow-sm text-indigo-600 mt-1">
          <ArrowRight size={20} />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900 mb-1">핵심 요약: 인덱싱 규칙</h4>
          <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
            <li>1차원: <code className="bg-white px-1 rounded text-indigo-600">a[i]</code> (i번째 요소)</li>
            <li>2차원: <code className="bg-white px-1 rounded text-indigo-600">a[행][열]</code> (몇 번째 줄, 몇 번째 칸)</li>
            <li>컴퓨터의 숫자는 <strong>0부터 시작</strong>한다는 점을 잊지 마세요!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TabConcepts;