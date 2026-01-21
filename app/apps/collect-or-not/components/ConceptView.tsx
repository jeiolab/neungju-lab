import React from 'react';
import { Database, FileText, Eye, Cpu, Globe, Share2, ClipboardList } from 'lucide-react';

export const ConceptView: React.FC = () => {
  return (
    <div className="p-4 space-y-6 pb-24 overflow-y-auto h-full">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-indigo-800">1. 데이터 유형</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <Database className="text-blue-500" />
              <h3 className="font-bold text-lg">정형 데이터 (Structured)</h3>
            </div>
            <p className="text-sm text-gray-600">행과 열로 정리된 데이터. 엑셀, DB, CSV 등.</p>
            <div className="mt-2 text-xs bg-blue-50 p-2 rounded">
              예: 키, 몸무게, 기온, 점수, GPS 좌표
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border-l-4 border-purple-500">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-purple-500" />
              <h3 className="font-bold text-lg">비정형 데이터 (Unstructured)</h3>
            </div>
            <p className="text-sm text-gray-600">구조화되지 않은 형태. 분석을 위해 처리가 필요함.</p>
            <div className="mt-2 text-xs bg-purple-50 p-2 rounded">
              예: 댓글, 이미지, 동영상, 음성 파일
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-indigo-800">2. 수집 방법</h2>
        <div className="space-y-3">
          <MethodCard 
            icon={<ClipboardList className="w-5 h-5 text-green-600" />}
            title="설문 (Survey)"
            desc="질문지를 통해 사람들의 생각이나 의견을 묻는 방법"
            badge="직접"
          />
          <MethodCard 
            icon={<Eye className="w-5 h-5 text-orange-600" />}
            title="관찰 (Observation)"
            desc="사람의 감각으로 현상을 직접 보고 기록하는 방법"
            badge="직접"
          />
          <MethodCard 
            icon={<Cpu className="w-5 h-5 text-red-600" />}
            title="센서 (Sensor)"
            desc="기계 장치를 이용해 환경 데이터를 자동 측정하는 방법"
            badge="직접"
          />
          <MethodCard 
            icon={<Share2 className="w-5 h-5 text-blue-600" />}
            title="공유 데이터 (Shared Data)"
            desc="공공데이터 포털 등 이미 공개된 데이터를 가져오는 것"
            badge="공유"
          />
           <MethodCard 
            icon={<Globe className="w-5 h-5 text-gray-600" />}
            title="웹 수집 (Crawling)"
            desc="인터넷 웹페이지의 텍스트나 이미지를 프로그램으로 수집"
            badge="직접/공유"
          />
        </div>
      </div>
    </div>
  );
};

const MethodCard: React.FC<{icon: React.ReactNode, title: string, desc: string, badge: string}> = ({icon, title, desc, badge}) => (
  <div className="bg-white p-4 rounded-xl shadow flex items-start gap-3">
    <div className="mt-1">{icon}</div>
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-800">{title}</h3>
        <span className="text-xs font-semibold px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">{badge}</span>
      </div>
      <p className="text-sm text-gray-600 mt-1 leading-snug">{desc}</p>
    </div>
  </div>
);