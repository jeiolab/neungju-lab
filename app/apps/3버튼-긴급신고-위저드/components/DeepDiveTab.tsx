import React, { useState } from 'react';
import { AlertTriangle, ThumbsUp, ThumbsDown } from 'lucide-react';

export const DeepDiveTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 grid gap-6 md:grid-cols-2">
      <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ThumbsUp className="w-5 h-5 text-green-500" />
          재난 대응 자동화의 장점
        </h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li><strong>속도 (Speed):</strong> 전자 신호는 사람이 전화로 상황을 설명하는 것보다 훨씬 빠릅니다.</li>
          <li><strong>명확성 (Clarity):</strong> 미리 약속된 코드(예: 그룹 10=의료)를 사용하므로 공포 상황에서 발생할 수 있는 의사소통 오류가 없습니다.</li>
          <li><strong>접근성 (Accessibility):</strong> 연기, 부상, 위협 등으로 말을 할 수 없는 상황에서도 구조를 요청할 수 있습니다.</li>
        </ul>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-red-500">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ThumbsDown className="w-5 h-5 text-red-500" />
          위험 요소 및 고려사항
        </h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li><strong>오작동 (False Positives):</strong> 실수로 버튼을 누르면 긴급 구조 자원이 낭비될 수 있습니다.</li>
          <li><strong>전력 의존 (Dependence on Power):</strong> 배터리가 방전되면 구조 요청을 보낼 방법이 없습니다.</li>
          <li><strong>뉘앙스 부족 (Lack of Nuance):</strong> "화재"라는 신호는 보내지만, "작은 쓰레기통 불"인지 "건물 전체 화재"인지 구분하기 어렵습니다.</li>
        </ul>
      </div>

      <div className="md:col-span-2 bg-yellow-50 p-6 rounded-xl border border-yellow-200">
         <h3 className="text-lg font-bold text-yellow-900 mb-2 flex items-center gap-2">
           <AlertTriangle className="w-5 h-5" />
           심화 탐구: 오작동 방지 (Fail-Safes)
         </h3>
         <p className="text-yellow-800 text-sm mb-4">
           엔지니어들은 실수로 인한 신고(오작동)를 막기 위해 다음과 같은 기술을 사용합니다:
         </p>
         <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded shadow-sm text-center">
              <div className="font-bold text-gray-800">길게 누르기</div>
              <div className="text-xs text-gray-500">3초 이상 눌러야 작동</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm text-center">
              <div className="font-bold text-gray-800">버튼 조합</div>
              <div className="text-xs text-gray-500">A와 B를 동시에 누름</div>
            </div>
            <div className="bg-white p-3 rounded shadow-sm text-center">
              <div className="font-bold text-gray-800">햅틱 확인</div>
              <div className="text-xs text-gray-500">신호 전송 전 진동 알림</div>
            </div>
         </div>
      </div>
    </div>
  );
};
