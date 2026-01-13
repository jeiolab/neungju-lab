import React, { useState } from 'react';
import { Save, PenTool } from 'lucide-react';

const ReflectionTab: React.FC = () => {
  const [answers, setAnswers] = useState({
    q1: '',
    q2: ''
  });

  const handleChange = (key: string, val: string) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const save = () => {
    localStorage.setItem('reflection_answers', JSON.stringify(answers));
    alert('답변이 저장되었습니다.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div className="bg-gradient-to-r from-slate-800 to-indigo-900 text-white p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-2">생각해볼 문제 (Deep Thinking)</h2>
        <p className="text-slate-300">정답은 없습니다. 스스로 논리를 세워 작성해보세요.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <label className="block font-bold text-slate-800 text-lg mb-2">
            1. 조건 바꾸기
          </label>
          <p className="text-slate-600 mb-4 text-sm">
            만약 우리가 "최솟값"이 아니라 "최댓값"을 찾아서 맨 뒤로 보내는 방식으로 정렬한다면, 
            기존 선택 정렬 코드에서 무엇을 바꿔야 할까요? (변수, 인덱스 등)
          </p>
          <textarea
            value={answers.q1}
            onChange={e => handleChange('q1', e.target.value)}
            className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            placeholder="예: 최솟값 변수 대신 최댓값 변수를 쓰고, 교환 위치를..."
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <label className="block font-bold text-slate-800 text-lg mb-2">
            2. 적용 설계하기
          </label>
          <p className="text-slate-600 mb-4 text-sm">
            학교 급식 줄을 서는데, 선생님이 학생들의 키 순서대로 다시 세우려고 합니다. 
            선택 정렬 방식을 쓴다면 학생들에게 어떤 지시를 내려야 할까요? (현실 세계 적용)
          </p>
          <textarea
             value={answers.q2}
             onChange={e => handleChange('q2', e.target.value)}
             className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
             placeholder="예: 1. 맨 앞자리 학생부터 전체를 훑어 가장 작은 학생을..."
          />
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={save}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-md transition"
          >
            <Save size={18} /> 답변 저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReflectionTab;
