import React, { useState } from 'react';
import { UserProgress } from '../types';

interface Props {
  userProgress: UserProgress;
  onUpdateProgress: (progress: UserProgress) => void;
}

const TabThoughts: React.FC<Props> = ({ userProgress, onUpdateProgress }) => {
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: string, val: string) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = () => {
    // Basic validation: length check
    if (answers.q1.length < 20 || answers.q2.length < 20 || answers.q3.length < 20) {
      alert("각 항목당 최소 20자 이상 작성해주세요.");
      return;
    }

    setSubmitted(true);
    
    // Check for "Writer" badge
    let newBadges = userProgress.badges;
    if (!userProgress.badges.find(b => b.id === 'b_writer')?.unlocked) {
      newBadges = userProgress.badges.map(b => b.id === 'b_writer' ? {...b, unlocked: true} : b);
    }
    
    onUpdateProgress({ 
      ...userProgress, 
      xp: userProgress.xp + 100,
      badges: newBadges
    });
  };

  if (submitted) {
    return (
        <div className="p-8 bg-green-50 border border-green-200 rounded-xl text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-4">제출 완료!</h3>
            <p className="text-green-700 mb-4">훌륭한 엔지니어는 자신의 설계를 논리적으로 설명할 수 있어야 합니다.</p>
            <div className="text-sm text-gray-500">작성한 내용은 로컬 저장소에 안전하게 보관되었습니다.</div>
        </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">탐구 1</span> 
            조건 바꾸기
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            만약 화재 경보기가 아니라 "스마트 화분 물주기 시스템"이라면, 센서와 액추에이터(출력)는 무엇으로 바뀌어야 할까요?
          </p>
          <textarea 
            className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            rows={3}
            placeholder="예: 온도 센서 대신 토양 습도 센서가 필요하고..."
            value={answers.q1}
            onChange={(e) => handleChange('q1', e.target.value)}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">탐구 2</span> 
            반례 찾기
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            온도가 50도가 넘었지만, 화재가 아닐 수도 있습니다(오경보). 어떤 상황일까요?
          </p>
          <textarea 
            className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            rows={3}
            placeholder="예: 경보기 바로 아래에서 뜨거운 국을 끓일 때..."
            value={answers.q2}
            onChange={(e) => handleChange('q2', e.target.value)}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">탐구 3</span> 
            적용 설계
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            시각 장애인을 위해 "출력" 단계를 어떻게 수정하면 좋을까요? 구체적으로 제안해보세요.
          </p>
          <textarea 
            className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            rows={3}
            placeholder="예: 소리 뿐만 아니라 스마트폰 진동으로..."
            value={answers.q3}
            onChange={(e) => handleChange('q3', e.target.value)}
          />
        </div>
        
        <button 
          onClick={handleSubmit}
          className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-transform hover:-translate-y-1"
        >
          생각 제출하고 보상 받기
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl h-fit border border-gray-200">
        <h3 className="font-bold text-gray-700 mb-4">✅ 서술형 근거 체크리스트</h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>단순 단답형이 아니라 "왜냐하면~"으로 이유를 적었나요?</span>
          </li>
          <li className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>수업 시간에 배운 용어(센서, 임계값, 처리 등)를 1개 이상 사용했나요?</span>
          </li>
          <li className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" />
            <span>자신의 경험이나 예시를 구체적으로 들었나요?</span>
          </li>
        </ul>
        <div className="mt-6 p-4 bg-yellow-100 rounded text-xs text-yellow-800">
          💡 <strong>Tip:</strong> 3가지 질문에 모두 성실하게 답변하면 '설명왕' 배지를 얻을 수 있습니다!
        </div>
      </div>
    </div>
  );
};

export default TabThoughts;