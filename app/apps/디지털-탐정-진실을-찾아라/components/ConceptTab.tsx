import React from 'react';
import { Fingerprint, MonitorX, FileWarning, ShieldAlert } from 'lucide-react';

const concepts = [
  {
    id: 1,
    title: '딥페이크 (Deepfake)',
    icon: <MonitorX className="w-8 h-8 text-purple-600" />,
    desc: 'AI 기술을 이용해 특정 인물의 얼굴이나 목소리를 합성하는 기술입니다. 가짜 뉴스를 만들거나 타인을 사칭하는 범죄에 악용될 수 있어 주의가 필요합니다.'
  },
  {
    id: 2,
    title: '저작권 & CCL',
    icon: <FileWarning className="w-8 h-8 text-blue-600" />,
    desc: '창작물에 대한 권리입니다. 인터넷의 이미지나 글을 함부로 퍼가면 안 됩니다. CCL(Creative Commons License) 표시를 확인하여 이용 범위를 지켜야 합니다.'
  },
  {
    id: 3,
    title: '사이버 불링',
    icon: <ShieldAlert className="w-8 h-8 text-red-600" />,
    desc: '메신저, SNS 등 사이버 공간에서 특정 대상을 집요하게 괴롭히는 행위입니다. 익명성에 숨은 언어 폭력도 명백한 범죄임을 기억하세요.'
  },
  {
    id: 4,
    title: '디지털 발자국',
    icon: <Fingerprint className="w-8 h-8 text-green-600" />,
    desc: '인터넷 사용 기록은 발자국처럼 영원히 남습니다. 한 번 올린 사진이나 글은 완전히 삭제하기 어려우므로 신중하게 업로드해야 합니다.'
  }
];

const ConceptTab: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">디지털 세상의 핵심 개념</h2>
        <p className="text-gray-600 mb-6">
          디지털 탐정이 되기 위해 꼭 알아야 할 4가지 핵심 수칙입니다.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {concepts.map((item) => (
            <div key={item.id} className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gray-50 hover:bg-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed pl-12">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConceptTab;