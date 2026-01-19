import React, { useState } from 'react';
import { UserProfile } from '../types';
import { MessageSquare, CheckSquare } from 'lucide-react';

interface Props {
  profile: UserProfile;
  saveReflection: (type: string, content: string) => void;
}

const ReflectionTab: React.FC<Props> = ({ profile, saveReflection }) => {
  const [activeType, setActiveType] = useState('condition');
  const [content, setContent] = useState('');
  
  const prompts: Record<string, { title: string; desc: string; placeholder: string }> = {
    condition: {
      title: '조건 바꾸기',
      desc: '학교 급식 에이전트가 있는데, "알러지 정보"가 누락되면 어떻게 행동할까요?',
      placeholder: '예: 알러지 정보가 없으면, 모든 학생에게 동일한 배식을 하다가 사고가 날 수 있다...'
    },
    counter: {
      title: '반례 찾기',
      desc: '모든 "자율주행 시스템"은 지능 에이전트일까요? 규칙 기반 자율주행도 있지 않을까요?',
      placeholder: '예: 바닥의 검은 선만 따라가는 라인트레이서는 자율 주행하지만, 학습하지 않으므로...'
    },
    design: {
      title: '적용 설계하기',
      desc: '여러분의 방을 청소하는 지능 에이전트를 상상해보세요. 센서와 액추에이터는 무엇인가요?',
      placeholder: '센서: 먼지 감지 카메라, 액추에이터: 흡입 모터와 바퀴...'
    }
  };

  const savedContent = profile.reflections[activeType] || '';

  const handleSubmit = () => {
    if(!content) return;
    saveReflection(activeType, content);
    alert('생각이 저장되었습니다! (+점수)');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(prompts).map(([key, data]) => (
          <button
            key={key}
            onClick={() => { setActiveType(key); setContent(profile.reflections[key] || ''); }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              activeType === key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {data.title}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{prompts[activeType].title}</h3>
        <p className="text-gray-600 mb-4 text-sm bg-indigo-50 p-3 rounded-lg border border-indigo-100">
           <MessageSquare className="inline w-4 h-4 mr-1 text-indigo-500" />
           {prompts[activeType].desc}
        </p>

        {savedContent ? (
          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
            <h4 className="text-green-800 font-bold text-sm mb-2 flex items-center gap-1">
              <CheckSquare className="w-4 h-4" /> 제출 완료
            </h4>
            <p className="text-gray-700 whitespace-pre-wrap">{savedContent}</p>
            <button 
              onClick={() => { saveReflection(activeType, ''); setContent(savedContent); }}
              className="mt-3 text-xs text-gray-400 underline hover:text-gray-600"
            >
              수정하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              className="w-full h-40 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-sm"
              placeholder={prompts[activeType].placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500">자기 점검 루브릭</p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" className="rounded text-indigo-600" /> 내용이 명확한가요?
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" className="rounded text-indigo-600" /> 배운 개념(센서/학습 등)을 사용했나요?
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!content}
              className="w-full bg-indigo-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              제출하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionTab;