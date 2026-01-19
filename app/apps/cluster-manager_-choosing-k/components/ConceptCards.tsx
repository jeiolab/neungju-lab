import React from 'react';
import { Network, Split, BrainCircuit } from 'lucide-react';

const ConceptCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {/* Card 1 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:border-indigo-200 transition-colors">
        <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-indigo-600">
          <Network size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">군집화(Clustering)란?</h3>
        <p className="text-gray-600 leading-relaxed">
          비슷한 특성을 가진 데이터끼리 묶어주는 기술입니다. 정답(Label)이 없는 '비지도 학습'의 대표적인 방법이죠. 
          <br/><br/>
          <span className="text-sm bg-gray-100 px-2 py-1 rounded">예시</span> 넷플릭스가 시청 패턴이 비슷한 사람들을 그룹으로 묶는 것!
        </p>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:border-indigo-200 transition-colors">
        <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-purple-600">
          <Split size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">K의 의미</h3>
        <p className="text-gray-600 leading-relaxed">
          데이터를 <strong>몇 개의 그룹</strong>으로 나눌지 결정하는 숫자입니다.
          <br/><br/>
          K가 작으면? <span className="text-green-600 font-medium">단순하고 이해하기 쉬움</span>
          <br/>
          K가 크면? <span className="text-blue-600 font-medium">세밀하고 정교함</span>
        </p>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:border-indigo-200 transition-colors">
        <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-orange-600">
          <BrainCircuit size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">정답은 없다?</h3>
        <p className="text-gray-600 leading-relaxed">
          지도학습과 달리 '정답'이 없습니다. 상황에 따라 최적의 K가 다릅니다.
          <br/><br/>
          우리는 <span className="font-bold text-gray-800">해석 가능성</span>(설명하기 쉬운가?)과 <span className="font-bold text-gray-800">성능</span>(잘 뭉쳤는가?) 사이에서 줄다리기를 해야 합니다.
        </p>
      </div>
    </div>
  );
};

export default ConceptCards;