import React, { useState } from 'react';
import { PenTool, Save } from 'lucide-react';

export const ThoughtTab: React.FC = () => {
  const [thoughts, setThoughts] = useState({
    condition: '',
    counter: '',
    design: ''
  });

  const handleChange = (field: string, val: string) => {
    setThoughts(prev => ({...prev, [field]: val}));
  };

  const handleSave = () => {
    // In a real app, save to DB. Here we just show a visual cue.
    alert("생각이 저장되었습니다! (로컬 세션)");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-gray-800">🤔 생각해볼 문제</h2>
        <p className="text-gray-600">분류 모델을 더 깊이 이해하기 위해 직접 설계자가 되어보세요.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2 text-indigo-700">
          1. 조건 바꾸기
        </h3>
        <p className="text-gray-700 font-medium bg-gray-50 p-3 rounded-lg">
          "만약 데이터 노이즈가 30%로 매우 높다면, 스팸을 걸러내기 위해 어떤 특징(Feature)을 더 추가하면 좋을까요?"
        </p>
        <textarea 
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-32"
          placeholder="예: 보낸 사람의 평판 점수, 이메일 본문의 오타 개수 등..."
          value={thoughts.condition}
          onChange={(e) => handleChange('condition', e.target.value)}
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2 text-indigo-700">
          2. 반례 찾기
        </h3>
        <p className="text-gray-700 font-medium bg-gray-50 p-3 rounded-lg">
          "정상 메일인데도 '쿠폰'이나 '무료' 같은 단어가 들어가는 경우는 어떤 상황일까요?"
        </p>
        <textarea 
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-32"
          placeholder="예: 친구가 보내준 치킨 쿠폰 선물 메일..."
          value={thoughts.counter}
          onChange={(e) => handleChange('counter', e.target.value)}
        />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2 text-indigo-700">
          3. 적용 설계
        </h3>
        <p className="text-gray-700 font-medium bg-gray-50 p-3 rounded-lg">
          "학교 홈페이지 공지사항을 [학사 / 장학 / 행사]로 자동 분류하려고 합니다. 어떤 특징 5개를 사용할까요?"
        </p>
        <textarea 
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-32"
          placeholder="1. 제목에 '장학금' 포함 여부..."
          value={thoughts.design}
          onChange={(e) => handleChange('design', e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors"
        >
          <Save size={18} /> 내 생각 저장하기
        </button>
      </div>
    </div>
  );
};