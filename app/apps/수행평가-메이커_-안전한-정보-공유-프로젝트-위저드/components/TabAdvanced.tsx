import React, { useState } from 'react';
import { ProjectState } from '../types';
import { generateRiskScenario } from '../services/geminiService';
import { BrainCircuit, Lightbulb, ShieldCheck } from 'lucide-react';

interface TabAdvancedProps {
  project: ProjectState;
}

export const TabAdvanced: React.FC<TabAdvancedProps> = ({ project }) => {
  const [scenario, setScenario] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateRiskScenario(project);
    setScenario(result || '');
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg">
        <h2 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
          <BrainCircuit /> 심화 탐구: 반례 찾기
        </h2>
        <p className="text-indigo-700 text-sm mt-1">
          내가 설계한 프로젝트가 정말 안전할까요? 공개 범위를 넓히거나 데이터가 결합되었을 때 발생할 수 있는 문제를 AI와 함께 예측해봅니다.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">현재 나의 설계</h3>
        <div className="grid grid-cols-3 gap-4 text-sm mb-6">
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-gray-500 text-xs">주제</div>
            <div className="font-medium truncate">{project.topic}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-gray-500 text-xs">데이터 수</div>
            <div className="font-medium">{project.selectedDataIds.length}개 항목</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-gray-500 text-xs">공개 범위</div>
            <div className="font-medium">{project.disclosureScope}</div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || project.selectedDataIds.length === 0}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex justify-center items-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-pulse">AI가 시나리오 생성 중...</span>
          ) : (
            <>
              <Lightbulb size={20} /> 취약점 분석 요청하기 (Gemini)
            </>
          )}
        </button>

        {scenario && (
          <div className="mt-6 animate-fadeIn">
            <h4 className="font-bold text-red-600 mb-2 flex items-center gap-2">
              <ShieldCheck /> AI 분석 리포트
            </h4>
            <div className="bg-red-50 p-5 rounded-lg border border-red-100 text-gray-800 leading-relaxed whitespace-pre-line text-sm">
              {scenario}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-3">생각해보기</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
          <li>만약 이 데이터를 다른 반 친구가 본다면 기분이 어떨까요?</li>
          <li>이 데이터가 10년 뒤에도 인터넷에 남아있다면 문제가 없을까요?</li>
          <li>가명처리를 했더라도, 우리 학교 학생 수(모수)가 적어서 누군지 추측할 수 있지 않을까요?</li>
        </ul>
      </div>
    </div>
  );
};