import React from 'react';
import { UserProject } from '../types';
import { FileText, Copy } from 'lucide-react';

interface SummaryReportProps {
  project: UserProject;
}

export const SummaryReport: React.FC<SummaryReportProps> = ({ project }) => {
  const generateMarkdown = () => {
    return `
# [정보과학 수행평가] 삽입 정렬 프로젝트 보고서

## 1. 문제 정의
${project.problemDefinition || '(내용 없음)'}

## 2. 정렬 알고리즘 선택 이유
본 프로젝트는 **삽입 정렬(Insertion Sort)**을 사용하여 데이터를 정리합니다. 
이 알고리즘은 **이미 정렬된 부분(Sorted)**과 **정렬되지 않은 부분(Unsorted)**으로 나누어, 새로운 데이터를 적절한 위치에 끼워 넣는 방식입니다.
특히, 플레이리스트처럼 **데이터 개수가 적거나(Small Dataset)**, 이미 **거의 정렬된 상태(Almost Sorted)**에서 데이터를 추가할 때 매우 효율적(O(n))이기 때문에 선택했습니다.

## 3. 정렬 기준 설계
- **1순위 기준**: ${project.criteria.primary.toUpperCase()} (${project.criteria.primaryOrder === 'asc' ? '오름차순' : '내림차순'})
- **안정성(Stability)**: 삽입 정렬은 안정 정렬이므로, 선호도가 같은 곡들은 기존의 입력 순서나 2순위 기준을 유지할 수 있어 플레이리스트 정리에 적합합니다.

## 4. 알고리즘 적용 과정 (나만의 설명)
${project.explanation || '(내용 없음)'}

## 5. 결과 및 성찰
${project.reflection || '(내용 없음)'}

---
*위 문서는 '삽입 정렬 프로젝트 위저드' 앱을 통해 자동 생성되었습니다.*
    `.trim();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    alert('클립보드에 복사되었습니다.');
  };

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
            <FileText className="text-indigo-600" /> 수행평가 제출용 요약
        </h3>
        <button 
            onClick={handleCopy}
            className="text-sm flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-medium px-3 py-1 rounded hover:bg-slate-200 transition-colors"
        >
            <Copy size={16} /> 복사하기
        </button>
      </div>
      <pre className="bg-white p-4 rounded-lg border border-slate-300 text-sm overflow-x-auto whitespace-pre-wrap font-mono text-slate-700 leading-relaxed shadow-inner">
        {generateMarkdown()}
      </pre>
      <p className="text-xs text-slate-400 mt-2 text-right">
        * 이 텍스트를 복사하여 한글/Word 문서에 붙여넣으세요.
      </p>
    </div>
  );
};