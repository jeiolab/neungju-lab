import React, { useState, useEffect } from 'react';
import { generateThinkingProblem } from '../services/geminiService';
import { Lightbulb } from 'lucide-react';

interface ThinkingTabProps {
  level: string;
}

const ThinkingTab: React.FC<ThinkingTabProps> = ({ level }) => {
  const [problem, setProblem] = useState<string>('');
  const [userAnswer, setUserAnswer] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadProblem = async () => {
      const p = await generateThinkingProblem(level);
      setProblem(p);
    };
    loadProblem();
  }, [level]);

  const handleSave = () => {
    if (!userAnswer.trim()) return;
    setSaved(true);
    // In a real app, save to DB or LocalStorage
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-yellow-100 rounded-full">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">생각해볼 문제</h2>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-slate-700 mb-2">오늘의 탐구 주제 ({level})</h3>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg italic text-slate-600 min-h-[80px] flex items-center">
          {problem || "문제를 불러오는 중..."}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-600 mb-2">나의 생각 정리하기</label>
        <textarea
          className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
          placeholder="이 문제에 대한 자신의 생각을 자유롭게 서술해보세요."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={saved}
        ></textarea>
      </div>

      <div className="text-right">
        <button 
          onClick={handleSave}
          disabled={saved || !userAnswer}
          className={`px-6 py-2 rounded-lg font-bold transition-all ${
            saved 
              ? 'bg-green-500 text-white cursor-default' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {saved ? '저장됨' : '저장하기'}
        </button>
      </div>
      
      {saved && (
        <p className="mt-4 text-center text-sm text-slate-400">
          훌륭한 생각입니다! 나중에 '오답노트 및 기록' 탭에서 다시 볼 수 있습니다.
        </p>
      )}
    </div>
  );
};

export default ThinkingTab;