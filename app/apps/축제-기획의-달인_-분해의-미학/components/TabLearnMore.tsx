import React from 'react';
import { ArrowRight, GitMerge, List } from 'lucide-react';

const TabLearnMore: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">더 알아보기: 프로젝트 관리의 세계</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4 text-blue-800">
            <div className="p-2 bg-white rounded-lg shadow-sm">
                <List size={24} />
            </div>
            <h3 className="text-xl font-bold">Waterfall (폭포수 모델)</h3>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            물이 위에서 아래로 떨어지듯, 기획 → 디자인 → 개발 → 테스트 순서로 
            단계를 철저히 밟아가는 방식입니다. 
            <br/><br/>
            <strong>장점:</strong> 일정이 명확하고 관리가 쉽습니다.<br/>
            <strong>단점:</strong> 중간에 변경사항을 반영하기 어렵습니다.
          </p>
          <div className="text-sm text-blue-600 font-semibold bg-blue-100 inline-block px-3 py-1 rounded-full">
            건축, 제조업, 학교 행사
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4 text-green-800">
            <div className="p-2 bg-white rounded-lg shadow-sm">
                <GitMerge size={24} />
            </div>
            <h3 className="text-xl font-bold">Agile (애자일)</h3>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            완벽한 계획보다 '빠른 실행과 수정'을 중시합니다. 
            짧은 주기로 결과물을 만들고 피드백을 받아 개선합니다.
            <br/><br/>
            <strong>장점:</strong> 변화에 유연하게 대처할 수 있습니다.<br/>
            <strong>단점:</strong> 전체 일정과 비용 예측이 어려울 수 있습니다.
          </p>
          <div className="text-sm text-green-600 font-semibold bg-green-100 inline-block px-3 py-1 rounded-full">
            앱 개발, 스타트업, 게임 제작
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-2">MECE 원칙 (Mutually Exclusive, Collectively Exhaustive)</h3>
        <p className="text-gray-600">
          문제를 쪼갤 때 지켜야 할 황금률입니다.
          <br/>
          <strong>"겹치지 않으면서, 빠짐없이"</strong> 나누라는 뜻입니다.
          <br/>
          예를 들어, 사람을 '남자'와 '학생'으로 나누면 겹치는 부분(남자 학생)이 생기므로 좋은 분류가 아닙니다.
        </p>
      </div>
    </div>
  );
};

export default TabLearnMore;