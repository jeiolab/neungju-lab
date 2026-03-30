import React from 'react';
import { BookOpen, AlertTriangle } from 'lucide-react';

const DeepDive: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="text-yellow-500" /> 트레이드오프 심화
        </h2>
        <div className="prose text-gray-600">
          <p className="mb-4">
            데이터 과학에서 가장 중요한 교훈 중 하나는 <strong>"모든 것을 만족시키는 모델은 없다"</strong>는 것입니다.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>과적합(Overfitting)의 위험:</strong> K를 너무 크게 잡으면(예: 데이터 개수만큼 K를 설정), 응집도 점수는 만점이 됩니다. 모든 데이터가 자기 자신만의 그룹을 가지니까요. 하지만 이건 '패턴'을 찾은 게 아니라 그냥 데이터를 외운 것에 불과합니다. 새로운 데이터가 들어오면 쓸모가 없죠.
            </li>
            <li>
              <strong>엘보우 기법(Elbow Method):</strong> 적절한 K를 찾기 위해 그래프를 그려보면, 성능(응집도)이 급격히 좋아지다가 꺾이는 '팔꿈치' 같은 지점이 나타납니다. 보통 그 지점이 효율적인 K값의 후보가 됩니다.
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-indigo-900 text-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-indigo-700 p-3 rounded-full">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">현업 사례: 옷 쇼핑몰</h3>
            <p className="text-indigo-200 text-sm">추천 시스템 적용 예시</p>
          </div>
        </div>
        <div className="space-y-4 text-indigo-100">
          <p>
            쇼핑몰에서 고객을 군집화할 때, <strong>K=5</strong>로 잡으면 '캐주얼파', '정장파' 등으로 쉽게 이름을 붙여 마케팅 이메일을 보낼 수 있습니다 (해석 용이).
          </p>
          <p>
            하지만 <strong>K=100</strong>으로 잡으면, 훨씬 정교하게 '검정색 오버핏 후드티 선호 그룹' 등을 찾을 수 있어 추천 정확도가 올라갑니다 (성능 우수).
          </p>
          <p className="bg-indigo-800 p-4 rounded-lg mt-4 border border-indigo-600 font-medium">
            결국 마케팅 팀이 "100개 그룹에 다 다른 메시지를 보낼 인력이 있나요?"라고 묻는다면, 성능을 포기하고 K를 줄여야 합니다. 이것이 현실의 데이터 과학입니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeepDive;