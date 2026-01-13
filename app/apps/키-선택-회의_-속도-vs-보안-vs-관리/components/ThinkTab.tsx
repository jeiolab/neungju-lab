import React, { useState } from 'react';
import { PenTool, Lightbulb, AlertTriangle } from 'lucide-react';

const ThinkTab: React.FC = () => {
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '' });

  const handleChange = (key: string, val: string) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-8 pb-20 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-2">🤔 생각해볼 문제</h2>
        <p className="text-slate-600">정답은 없습니다. 나만의 보안 철학을 세워보세요.</p>
      </div>

      <div className="space-y-6">
        {/* Q1: Constraint Change */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-3 text-indigo-600 font-bold">
            <PenTool size={20} />
            <h3>조건 바꾸기</h3>
          </div>
          <p className="text-slate-800 font-medium mb-4">
            만약 10년 뒤 양자 컴퓨터가 상용화되어 현재의 공개키 암호가 뚫린다면, 
            우리는 어떤 방식으로 학교 성적표를 전송해야 할까요?
          </p>
          <textarea 
            className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            placeholder="내 생각 적어보기..."
            value={answers.q1}
            onChange={(e) => handleChange('q1', e.target.value)}
          />
        </div>

        {/* Q2: Counter Example */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-3 text-amber-600 font-bold">
            <AlertTriangle size={20} />
            <h3>반례 찾기</h3>
          </div>
          <p className="text-slate-800 font-medium mb-4">
            "보안은 강력할수록 좋다"는 말이 항상 참일까요? 
            재난 상황에서 구조대가 잠긴 문을 열어야 할 때처럼, 보안이 방해가 되는 상황은 무엇이 있을까요?
          </p>
          <textarea 
            className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none"
            placeholder="내 생각 적어보기..."
            value={answers.q2}
            onChange={(e) => handleChange('q2', e.target.value)}
          />
        </div>

        {/* Q3: Design */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-3 text-emerald-600 font-bold">
            <Lightbulb size={20} />
            <h3>서비스 설계</h3>
          </div>
          <p className="text-slate-800 font-medium mb-4">
            우리 학교만의 '익명 신고 앱'을 만든다고 가정해봅시다. 
            신고자의 익명성은 보장하면서(Hash?), 장난 신고는 막으려면(Auth?) 어떤 키 조합을 써야 할까요?
          </p>
          <textarea 
            className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            placeholder="내 생각 적어보기..."
            value={answers.q3}
            onChange={(e) => handleChange('q3', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ThinkTab;