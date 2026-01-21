import React from 'react';
import { Card } from '../ui/Card';
import { Shield, Lock, EyeOff, FileText } from 'lucide-react';

export const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">데이터 프라이버시 이해하기</h2>
        <p className="text-slate-600">스마트 교실 프로젝트를 맡기 전, 반드시 알아야 할 기초 개념입니다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold">개인식별정보 (PII)</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            살아있는 개인에 관한 정보로서 개인을 알아볼 수 있는 정보, 또는 다른 정보와 결합하여 쉽게 알아볼 수 있는 정보를 말합니다.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-500 list-disc list-inside">
            <li>직접 식별: 이름, 주민등록번호, 여권번호</li>
            <li>간접 식별: 생년월일 + 우편번호 + 성별</li>
          </ul>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-teal-100 rounded-full text-teal-600">
              <EyeOff size={24} />
            </div>
            <h3 className="text-xl font-bold">비식별화 기술</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            데이터에서 개인을 식별할 수 있는 요소를 제거하거나 변형하는 기술입니다.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-500">
            <li><strong className="text-slate-700">마스킹 (Masking):</strong> 데이터의 일부를 가림 (예: 김XX).</li>
            <li><strong className="text-slate-700">총계처리 (Aggregation):</strong> 개별 값이 아닌 합계/평균 표시.</li>
            <li><strong className="text-slate-700">가명처리 (Pseudonymization):</strong> 이름을 코드로 대체.</li>
          </ul>
        </Card>

        <Card className="hover:shadow-md transition-shadow md:col-span-2">
           <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-bold">트레이드오프(Trade-off) 딜레마</h3>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
                <p className="text-slate-600 mb-4">
                    데이터 PM으로서 당신은 항상 두 가지 가치 사이에서 줄타기를 해야 합니다.
                </p>
                <div className="flex justify-between items-center text-sm font-semibold text-slate-500 bg-slate-100 p-4 rounded-lg">
                    <span>높은 유용성 (편리함)</span>
                    <span className="h-0.5 w-16 bg-slate-300 mx-2"></span>
                    <span className="text-rose-500">높은 프라이버시 위험</span>
                </div>
                <div className="flex justify-between items-center text-sm font-semibold text-slate-500 bg-slate-100 p-4 rounded-lg mt-2">
                    <span>낮은 유용성 (불편함)</span>
                    <span className="h-0.5 w-16 bg-slate-300 mx-2"></span>
                    <span className="text-teal-500">안전한 프라이버시</span>
                </div>
            </div>
            <div className="flex-1 text-sm bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2">예시:</h4>
                <p className="mb-2"><strong>목표:</strong> 버스 노선 개선하기</p>
                <p className="mb-1">❌ <strong>위험:</strong> 모든 학생의 GPS를 초 단위로 추적.</p>
                <p>✅ <strong>안전:</strong> 동별 거주 학생 수만 카운트.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};