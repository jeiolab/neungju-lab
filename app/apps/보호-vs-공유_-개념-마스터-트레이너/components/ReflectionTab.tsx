import React, { useState } from 'react';
import { PenTool, Save } from 'lucide-react';

export const ReflectionTab: React.FC = () => {
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: ''
  });
  const [saved, setSaved] = useState({
    q1: false,
    q2: false,
    q3: false
  });

  const handleChange = (q: string, val: string) => {
    setAnswers(prev => ({ ...prev, [q]: val }));
    setSaved(prev => ({ ...prev, [q]: false }));
  };

  const handleSave = (q: string) => {
    // In a real app, save to localStorage here
    setSaved(prev => ({ ...prev, [q]: true }));
    setTimeout(() => setSaved(prev => ({ ...prev, [q]: false })), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">🤔 생각해볼 문제</h2>
      <p className="text-slate-600 text-sm mb-6">정답은 없습니다. 나만의 생각을 정리해보세요.</p>

      {/* Q1: Condition Change */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg mr-3">
            <PenTool size={20} />
          </div>
          <h3 className="font-bold text-slate-800">1. 조건 바꾸기</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
          만약 <strong>"모든 사람의 위치 정보가 실시간으로 공개된다면"</strong> 우리 사회는 어떻게 변할까요? 
          범죄 예방에 도움이 될까요, 아니면 자유가 침해될까요?
        </p>
        <textarea 
          className="w-full h-24 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
          placeholder="나의 생각을 적어보세요..."
          value={answers.q1}
          onChange={(e) => handleChange('q1', e.target.value)}
        />
        <div className="mt-3 flex justify-end">
          <button 
            onClick={() => handleSave('q1')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              saved.q1 ? 'bg-green-100 text-green-700' : 'bg-slate-800 text-white hover:bg-slate-900'
            }`}
          >
            {saved.q1 ? '저장됨' : <><Save size={16} className="mr-2" /> 저장하기</>}
          </button>
        </div>
      </div>

      {/* Q2: Counter Example */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mr-3">
            <PenTool size={20} />
          </div>
          <h3 className="font-bold text-slate-800">2. 반례 찾기</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
          "정보 공유는 언제나 옳다"라는 명제에 대한 <strong>반례(틀린 예시)</strong>를 들어보세요. 
          공유해서는 안 되는 상황은 언제일까요?
        </p>
        <textarea 
          className="w-full h-24 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-100 outline-none resize-none"
          placeholder="나의 생각을 적어보세요..."
          value={answers.q2}
          onChange={(e) => handleChange('q2', e.target.value)}
        />
        <div className="mt-3 flex justify-end">
          <button 
            onClick={() => handleSave('q2')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              saved.q2 ? 'bg-green-100 text-green-700' : 'bg-slate-800 text-white hover:bg-slate-900'
            }`}
          >
            {saved.q2 ? '저장됨' : <><Save size={16} className="mr-2" /> 저장하기</>}
          </button>
        </div>
      </div>
      
       {/* Q3: Application */}
       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg mr-3">
            <PenTool size={20} />
          </div>
          <h3 className="font-bold text-slate-800">3. 적용 설계하기</h3>
        </div>
        <p className="text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
          우리 반 단톡방에서 지켜야 할 <strong>"정보 보호 규칙 3가지"</strong>를 만들어보세요.
        </p>
        <textarea 
          className="w-full h-24 p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-100 outline-none resize-none"
          placeholder="1. ...&#10;2. ...&#10;3. ..."
          value={answers.q3}
          onChange={(e) => handleChange('q3', e.target.value)}
        />
        <div className="mt-3 flex justify-end">
          <button 
            onClick={() => handleSave('q3')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              saved.q3 ? 'bg-green-100 text-green-700' : 'bg-slate-800 text-white hover:bg-slate-900'
            }`}
          >
            {saved.q3 ? '저장됨' : <><Save size={16} className="mr-2" /> 저장하기</>}
          </button>
        </div>
      </div>

    </div>
  );
};