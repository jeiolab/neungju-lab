import React from 'react';
import { ExternalLink, Quote, UserCircle } from 'lucide-react';

const ResourcesTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold font-serif text-slate-800">더 알아보기</h2>
        <p className="text-slate-500 mt-2">선배들의 이야기와 유용한 사이트를 참고해보세요.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Useful Links */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
             <ExternalLink className="w-5 h-5 text-blue-600" />
             추천 사이트
          </h3>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <a href="https://www.career.go.kr" target="_blank" rel="noreferrer" className="text-blue-700 font-bold hover:underline">커리어넷 (Career.go.kr)</a>
                  <p className="text-slate-500 text-sm mt-1">교육부에서 제공하는 진로 정보망. 직업 적성 검사와 상담이 가능해요.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                <div>
                  <a href="https://www.work.go.kr" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold hover:underline">워크넷 (Work.go.kr)</a>
                  <p className="text-slate-500 text-sm mt-1">고용노동부의 취업 정보 사이트. 청소년 심리검사도 무료입니다.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Interviews */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-700 flex items-center gap-2">
             <Quote className="w-5 h-5 text-amber-500" />
             선배들의 한마디 (가상)
          </h3>
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <UserCircle className="w-8 h-8 text-slate-300" />
                <div>
                  <p className="font-bold text-slate-800 text-sm">김태호 (고2, AI 동아리장)</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm italic">
                "처음엔 코딩이 어렵게만 느껴졌는데, 제가 좋아하는 게임을 직접 만들어보면서 흥미를 느꼈어요. 기술은 도구일 뿐, 중요한 건 무엇을 만들고 싶은가 하는 상상력인 것 같아요."
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <UserCircle className="w-8 h-8 text-slate-300" />
                <div>
                  <p className="font-bold text-slate-800 text-sm">이수민 (고1, 미래 예술가 지망)</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm italic">
                "그림 그리는 걸 좋아하는데, 요즘은 태블릿으로 그리고 AI로 채색도 해봐요. 전통적인 미술과 기술을 합치니 저만의 스타일이 생기는 것 같아 뿌듯합니다."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesTab;