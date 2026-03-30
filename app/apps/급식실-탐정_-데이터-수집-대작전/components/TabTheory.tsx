import React from 'react';
import { Database, FileText, User, Globe } from 'lucide-react';

const TabTheory: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4">🕵️‍♂️ 수사 일지: 데이터 수집의 기초</h2>
        <p className="text-slate-600">
          탐정님, 사건 해결을 위해선 정확한 증거(데이터)가 필요합니다. 
          데이터를 모으는 방법과 종류를 먼저 알아봅시다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1: Direct vs Indirect */}
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <User className="w-6 h-6" /> 직접 수집 vs <Globe className="w-6 h-6" /> 간접 수집
          </h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <span className="font-bold text-indigo-600 block mb-1">직접 수집 (Primary Data)</span>
              <p className="text-sm text-slate-600">내가 연구 목적을 위해 직접 조사하거나 측정해서 얻는 데이터.</p>
              <ul className="text-sm text-slate-500 mt-2 list-disc pl-4">
                <li>설문조사, 인터뷰</li>
                <li>센서 측정 (온도, 무게 등)</li>
                <li>실험 및 관찰</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <span className="font-bold text-teal-600 block mb-1">간접 수집 (Secondary Data)</span>
              <p className="text-sm text-slate-600">이미 다른 목적(정부, 기업 등)으로 만들어진 데이터를 가져다 쓰는 것.</p>
              <ul className="text-sm text-slate-500 mt-2 list-disc pl-4">
                <li>공공데이터 (기상청, 통계청)</li>
                <li>뉴스 기사, 논문</li>
                <li>웹 크롤링 (인터넷 정보 수집)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Card 2: Structured vs Unstructured */}
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
          <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
            <Database className="w-6 h-6" /> 정형 vs <FileText className="w-6 h-6" /> 비정형
          </h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <span className="font-bold text-amber-600 block mb-1">정형 데이터 (Structured)</span>
              <p className="text-sm text-slate-600">행과 열(표)로 정리되어 있어 계산이 쉬운 데이터.</p>
              <ul className="text-sm text-slate-500 mt-2 list-disc pl-4">
                <li>엑셀 파일 (.csv, .xlsx)</li>
                <li>학생 키, 몸무게, 시험 점수</li>
                <li>급식실 입장 시간 로그</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <span className="font-bold text-rose-600 block mb-1">비정형 데이터 (Unstructured)</span>
              <p className="text-sm text-slate-600">형태가 정해져 있지 않아 바로 계산하기 어려운 데이터.</p>
              <ul className="text-sm text-slate-500 mt-2 list-disc pl-4">
                <li>이미지(CCTV), 동영상</li>
                <li>오디오(녹음 파일)</li>
                <li>소셜 미디어 댓글(텍스트)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabTheory;
