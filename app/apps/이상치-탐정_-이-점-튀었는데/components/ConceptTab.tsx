import React from 'react';
import { Target, Users, Search, ArrowRight } from 'lucide-react';
import { Tab } from '../types';

interface Props {
  changeTab: (tab: Tab) => void;
}

export default function ConceptTab({ changeTab }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-indigo-400">🕵️ 탐정님, 환영합니다!</h2>
        <p className="text-slate-300 mb-4 leading-relaxed">
          자네가 이번에 새로 온 신입 탐정인가? 반갑네.<br/>
          우리의 임무는 <strong className="text-white">"이상치(Anomaly)"</strong>를 찾아내는 거야.<br/>
          남들과 다르게 행동하거나, 패턴에서 심하게 벗어난 데이터를 찾는 거지.
        </p>
        <button 
          onClick={() => changeTab('game')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition flex items-center gap-2"
        >
          바로 수사 시작하기 <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card 
          icon={<Target className="text-red-400" size={32} />}
          title="이상치란?"
          desc="전체 데이터의 패턴이나 분포에서 눈에 띄게 벗어난 관측값을 말해요. 마치 흰 양 떼 속에 있는 검은 양처럼요."
        />
        <Card 
          icon={<Users className="text-green-400" size={32} />}
          title="비지도 학습"
          desc="정답(Label)이 없는 상태에서 데이터의 특성만으로 '정상'과 '이상'을 구분해요. 우리는 데이터의 '거리'를 이용할 겁니다."
        />
        <Card 
          icon={<Search className="text-blue-400" size={32} />}
          title="정답이 없다?"
          desc="이상치 탐지는 OX 퀴즈가 아니에요. '어떤 기준'을 세우느냐에 따라 이상치가 될 수도, 아닐 수도 있답니다."
        />
      </div>

      <div className="bg-slate-800/50 p-6 rounded-xl border border-dashed border-slate-600">
        <h3 className="text-lg font-bold text-slate-200 mb-2">💡 수사 팁</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-400 text-sm">
          <li>데이터의 <strong>중심(평균)</strong>에서 얼마나 멀리 떨어져 있는지 확인하세요.</li>
          <li><strong>임계값(Threshold)</strong>을 너무 낮추면 정상 데이터도 의심하게 되고(False Positive), 너무 높이면 범인을 놓칩니다(False Negative).</li>
          <li>거리 측정 방식(유클리디안 vs 맨해튼)에 따라 범인이 달라질 수 있어요.</li>
        </ul>
      </div>
    </div>
  );
}

const Card = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-indigo-500 transition-colors">
    <div className="mb-3">{icon}</div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);
