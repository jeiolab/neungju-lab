import React from 'react';
import { Cpu, Radio, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

export const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Cpu className="w-8 h-8" />
            시스템 아키텍처: 무음 긴급 신고
          </h2>
          <p className="mt-2 text-indigo-100">
            말할 수 없는 상황에서 구조를 요청하는 시스템을 설계하는 법을 배워봅시다.
          </p>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-900 flex items-center gap-2">
                <Activity className="w-5 h-5" /> 요구사항 정의 (Requirements)
              </h3>
              <ul className="list-disc list-inside mt-2 text-blue-800 text-sm space-y-1">
                <li><strong>목표:</strong> 말 한마디 없이 긴급 구조 신호를 보낸다.</li>
                <li><strong>제약조건:</strong> 물리 버튼 2개(A, B)만 사용해야 한다.</li>
                <li><strong>개인정보:</strong> 실제 GPS 대신 가상 위치 코드를 사용한다.</li>
              </ul>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-bold text-orange-900 flex items-center gap-2">
                <Radio className="w-5 h-5" /> 통신 그룹 (Communication)
              </h3>
              <p className="text-sm text-orange-800 mt-2">
                IoT 무선 통신(예: 마이크로비트)에서는 "그룹"을 사용하여 채널을 분리합니다.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-bold text-white">
                <div className="bg-green-500 p-2 rounded">그룹 10<br/>의료/구급</div>
                <div className="bg-red-500 p-2 rounded">그룹 20<br/>화재/소방</div>
                <div className="bg-blue-500 p-2 rounded">그룹 30<br/>경찰/치안</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> 입력-처리-출력 (I-P-O)
                </h3>
                <div className="mt-4 flex flex-col items-center space-y-2 text-sm">
                  <div className="w-full bg-white border border-gray-300 p-2 rounded text-center shadow-sm">
                    <strong>입력 (Input):</strong> 버튼 A, B (누르는 시간, 조합)
                  </div>
                  <div className="h-4 w-0.5 bg-gray-300"></div>
                  <div className="w-full bg-yellow-50 border border-yellow-300 p-2 rounded text-center shadow-sm">
                    <strong>처리 (Process/Algorithm):</strong>
                    <br/>A 누름 → 그룹 10 전송
                    <br/>B 누름 → 그룹 20 전송
                    <br/>A+B 누름 → 그룹 30 전송
                  </div>
                  <div className="h-4 w-0.5 bg-gray-300"></div>
                  <div className="w-full bg-white border border-gray-300 p-2 rounded text-center shadow-sm">
                    <strong>출력 (Output):</strong> 무선 신호 + 위치 ID
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
