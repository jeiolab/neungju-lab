import React from 'react';
import { ExternalLink, FileText, Globe } from 'lucide-react';

export const TabLearnMore: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <h2 className="text-3xl font-serif font-bold text-gray-800 mb-6">더 알아보기: 최신 이슈와 법</h2>

      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">EU 인공지능 법 (AI Act)</h3>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            2024년, 유럽연합(EU)은 세계 최초로 포괄적인 AI 규제 법안을 통과시켰습니다. 
            이 법은 AI의 위험 수준을 4단계(허용 불가능, 고위험, 제한적 위험, 저위험)로 분류하여 차등 규제합니다.
            예를 들어, 인간의 행동을 조종하거나 사회적 점수(Social Scoring)를 매기는 AI는 '허용 불가능' 등급으로 전면 금지됩니다.
          </p>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-bold text-indigo-900 text-sm mb-1">왜 중요한가요?</h4>
            <p className="text-sm text-indigo-800">
              이 법은 '브뤼셀 효과'를 통해 전 세계 AI 규제의 표준이 될 가능성이 큽니다. 한국 기업들도 유럽에 AI를 수출하려면 이 기준을 따라야 합니다.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">딥페이크와 정보 인권</h3>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            딥페이크(Deepfake)는 딥러닝과 페이크의 합성어로, AI를 이용해 가짜 영상이나 목소리를 만드는 기술입니다.
            최근 선거 조작, 금융 사기, 디지털 성범죄 등에 악용되면서 심각한 사회 문제가 되고 있습니다.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 bg-gray-50 p-4 rounded-lg">
            <li><strong>워터마크 의무화:</strong> 구글, 오픈AI 등은 AI가 생성한 콘텐츠에 보이지 않는 표식(워터마크)을 넣기로 합의했습니다.</li>
            <li><strong>잊혀질 권리:</strong> AI 학습 데이터에 포함된 나의 개인정보를 삭제해달라고 요청할 수 있는 권리에 대한 논의가 활발합니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
