import React, { useEffect, useState } from 'react';
import { DynamicIcon } from './Icons';

export const ThinkView: React.FC = () => {
  const [thought, setThought] = useState('');
  const [savedStatus, setSavedStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    const savedThought = localStorage.getItem('infoSec_thought');
    if (savedThought) {
      setThought(savedThought);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('infoSec_thought', thought);
    setSavedStatus('saved');
    setTimeout(() => setSavedStatus('idle'), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <DynamicIcon name="BrainCircuit" className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">생각해볼 문제</h2>
        </div>
        <p className="text-lg text-indigo-100 leading-relaxed font-medium">
          "보안이 너무 강하면 사용하기 불편해질까?"
        </p>
        <p className="mt-4 text-sm text-indigo-200">
          비밀번호를 아주 복잡하게 만들거나, 매번 2단계 인증을 해야 한다면 보안은 강력해지지만 사용자는 불편함을 느낄 수 있습니다. 보안성과 편의성(Usability) 사이의 균형을 어떻게 맞추면 좋을지 자유롭게 적어보세요.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <label className="block text-slate-700 font-bold mb-2" htmlFor="thought-area">
          나의 생각 기록장
        </label>
        <textarea
          id="thought-area"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-slate-700"
          placeholder="여기에 자유롭게 작성하세요... (작성한 내용은 브라우저에 저장됩니다)"
        />
        
        <div className="mt-4 flex justify-between items-center">
          <span className={`text-sm font-medium transition-colors ${savedStatus === 'saved' ? 'text-green-600' : 'text-transparent'}`}>
            <span className="flex items-center gap-1">
              <DynamicIcon name="CheckCircle" size={16} />
              저장되었습니다!
            </span>
          </span>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
          >
            <DynamicIcon name="Lock" size={18} />
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};
