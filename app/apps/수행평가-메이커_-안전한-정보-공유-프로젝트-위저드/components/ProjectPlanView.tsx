import React from 'react';
import { ProjectState, DataItem, ProcessingMethod } from '../types';
import { PROCESSING_DESCRIPTIONS } from '../constants';

interface ProjectPlanViewProps {
  project: ProjectState;
  dataItems: DataItem[];
  feedback?: string;
}

export const ProjectPlanView: React.FC<ProjectPlanViewProps> = ({ project, dataItems, feedback }) => {
  const selectedItems = dataItems.filter(d => project.selectedDataIds.includes(d.id));

  return (
    <div className="bg-white p-8 border border-gray-300 shadow-sm max-w-[210mm] mx-auto min-h-[297mm] text-sm print:shadow-none print:border-none">
      <div className="border-b-2 border-gray-800 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">안전한 정보 공유 프로젝트 계획서</h1>
          <p className="text-gray-500 mt-2">고등학교 1학년 정보 - 데이터와 보안</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">작성일</div>
          <div className="font-medium">{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Section 1: Overview */}
        <section>
          <h2 className="text-lg font-bold bg-slate-100 p-2 border-l-4 border-blue-500 mb-3">1. 프로젝트 개요</h2>
          <div className="grid grid-cols-4 gap-4 border border-gray-200 p-4 rounded-lg">
            <div className="col-span-1 font-semibold text-gray-700">주제</div>
            <div className="col-span-3 text-gray-900">{project.topic}</div>
            
            <div className="col-span-1 font-semibold text-gray-700">공개 범위</div>
            <div className="col-span-3 text-gray-900">
              <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold mr-2">
                {project.disclosureScope}
              </span>
            </div>
            
            <div className="col-span-1 font-semibold text-gray-700">목적 및 설명</div>
            <div className="col-span-3 text-gray-900 whitespace-pre-wrap">{project.description}</div>
          </div>
        </section>

        {/* Section 2: Data & Processing */}
        <section>
          <h2 className="text-lg font-bold bg-slate-100 p-2 border-l-4 border-green-500 mb-3">2. 데이터 수집 및 처리 설계</h2>
          <table className="w-full border-collapse border border-gray-200 text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 border border-gray-200 w-1/4">데이터 항목</th>
                <th className="p-3 border border-gray-200 w-1/4">유형</th>
                <th className="p-3 border border-gray-200 w-1/4">처리 방법</th>
                <th className="p-3 border border-gray-200 w-1/4">비고</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map(item => {
                const method = project.processingMethods[item.id] || ProcessingMethod.NONE;
                return (
                  <tr key={item.id}>
                    <td className="p-3 border border-gray-200 font-medium">{item.name}</td>
                    <td className="p-3 border border-gray-200 text-gray-600">{item.category}</td>
                    <td className="p-3 border border-gray-200">
                      <span className={`text-xs px-2 py-1 rounded ${
                        method === ProcessingMethod.NONE ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {method.split(' ')[0]}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-200 text-xs text-gray-500">
                      {PROCESSING_DESCRIPTIONS[method].substring(0, 20)}...
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Section 3: Scores */}
        <section>
          <h2 className="text-lg font-bold bg-slate-100 p-2 border-l-4 border-purple-500 mb-3">3. 안전성 및 유용성 평가</h2>
          <div className="flex gap-4">
            <div className="flex-1 border border-gray-200 p-4 rounded-lg text-center">
              <div className="text-gray-500 text-sm mb-1">안전 점수</div>
              <div className="text-3xl font-bold text-blue-600">{project.safetyScore}점</div>
              <div className="text-xs text-gray-400 mt-2">높을수록 개인정보 보호가 잘 됨</div>
            </div>
            <div className="flex-1 border border-gray-200 p-4 rounded-lg text-center">
              <div className="text-gray-500 text-sm mb-1">유용성 점수</div>
              <div className="text-3xl font-bold text-purple-600">{project.utilityScore}점</div>
              <div className="text-xs text-gray-400 mt-2">높을수록 데이터 가치가 높음</div>
            </div>
          </div>
        </section>
        
        {/* Section 4: AI Feedback */}
        {feedback && (
           <section className="print:block">
            <h2 className="text-lg font-bold bg-slate-100 p-2 border-l-4 border-amber-500 mb-3">4. 전문가(AI) 피드백 & 위험 시나리오</h2>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-gray-800 text-sm whitespace-pre-line">
              {feedback}
            </div>
           </section>
        )}
      </div>

      <div className="mt-12 text-center text-gray-400 text-xs border-t pt-4">
        위 계획서는 교육용으로 생성되었으며, 실제 법적 효력은 없습니다.<br/>
        Generated by 수행평가 메이커: 안전한 정보 공유 프로젝트 위저드
      </div>
    </div>
  );
};