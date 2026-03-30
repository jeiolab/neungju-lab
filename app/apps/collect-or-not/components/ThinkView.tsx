import React, { useState } from 'react';
import { Save } from 'lucide-react';

export const ThinkView: React.FC = () => {
  const [input, setInput] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!input.trim()) return;
    // Mock save logic
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 h-full overflow-y-auto pb-24 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">생각해볼 문제</h2>
      
      <div className="space-y-6">
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-yellow-400">
          <h3 className="font-bold text-lg mb-2">🚀 동아리 프로젝트 설계</h3>
          <p className="text-gray-600 text-sm mb-4">
            여러분의 동아리(스포츠, 환경, 학교생활 등)에서 해결하고 싶은 문제를 하나 정하고, 
            이를 위해 <b>어떤 데이터를, 어떻게 수집할지</b> 설계해보세요.
          </p>
          <ul className="text-xs text-gray-500 list-disc ml-4 space-y-1">
             <li>데이터 종류: 정형 vs 비정형</li>
             <li>수집 방법: 센서, 설문, 웹 크롤링 등</li>
             <li>주의할 점: 개인정보, 표본 편향 등</li>
          </ul>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">나의 설계안 작성</label>
            <textarea 
                className="w-full h-40 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-sm"
                placeholder="예: 우리 학교 급식 잔반 줄이기 프로젝트. 매일 잔반통 무게를 센서로 측정(정형/직접/센서)하고, 학생들의 선호 메뉴를 설문(비정형/직접/설문)으로 조사한다..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
        </div>

        <button 
            onClick={handleSave}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
        >
            <Save size={18} /> {saved ? '저장 완료!' : '내 생각 저장하기'}
        </button>
      </div>
    </div>
  );
};