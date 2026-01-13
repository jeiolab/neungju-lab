import React from 'react';
import { School, Search, Book } from 'lucide-react';

const CASES = [
  {
    title: "학급 단톡방 반 배정표 공유",
    desc: "학기 초 반 배정표를 사진 찍어 단톡방에 올림. 이름과 생년월일이 모두 포함됨.",
    verdict: "주의 필요",
    solution: "이름을 제외한 다른 정보는 가리거나, 학교 공식 공지 링크를 공유하는 것이 바람직함.",
  },
  {
    title: "SNS 챌린지 영상",
    desc: "교복을 입고 춤추는 영상을 틱톡에 올림. 배경에 아파트 동호수가 찍힘.",
    verdict: "위험",
    solution: "배경으로 거주지가 노출되면 스토킹 위험이 있음. 촬영 장소를 신중히 선택해야 함.",
  },
  {
    title: "수행평가 결과물 공유",
    desc: "조별 과제 PPT를 블로그에 업로드. 조원들의 실명이 표지에 적혀있음.",
    verdict: "조건부 공유",
    solution: "조원들의 동의를 구하고, 동의하지 않은 친구의 이름은 익명(OOO) 처리 후 업로드.",
  },
];

const DICTIONARY = [
  { term: '가명처리', def: '개인정보의 일부를 삭제하거나 대체하여, 추가 정보 없이는 특정 개인을 알아볼 수 없도록 처리하는 것.' },
  { term: '익명처리', def: '시간, 비용, 기술 등을 합리적으로 고려할 때 더 이상 개인을 알아볼 수 없도록 정보를 처리하는 것.' },
  { term: '초상권', def: '자기의 얼굴이나 모습이 함부로 촬영되거나 공표되지 않을 권리.' },
];

const TabMoreInfo: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* School Life Cases */}
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <School className="w-6 h-6 text-blue-600" />
          학교생활 실전 사례
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CASES.map((c, i) => (
            <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className={`text-xs font-bold px-2 py-1 rounded inline-block mb-2 ${
                c.verdict === '위험' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {c.verdict}
              </div>
              <h4 className="font-bold text-slate-800 mb-2">{c.title}</h4>
              <p className="text-sm text-slate-600 mb-3">{c.desc}</p>
              <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-700 border border-slate-100">
                <strong>💡 해결:</strong> {c.solution}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mini Dictionary */}
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Book className="w-6 h-6 text-blue-600" />
          미니 용어 사전
        </h3>
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {DICTIONARY.map((d, i) => (
            <div key={i} className="p-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <span className="font-bold text-blue-800 min-w-[100px]">{d.term}</span>
              <span className="text-sm text-slate-600">{d.def}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TabMoreInfo;
