import React, { useState, useEffect } from 'react';
import { UserStats, SavedThinkAnswer } from '../types';
import { loadThinkAnswers, saveThinkAnswer } from '../services/storage';
import { PenTool, Save, Check } from 'lucide-react';

interface Question {
  id: string;
  title: string;
  desc: string;
}

const QUESTIONS: Question[] = [
  { 
    id: 't1', 
    title: '조건 바꾸기', 
    desc: '만약 정수(int)와 실수(float)의 구분이 없다면, 어떤 문제가 생길까요? 메모리를 생각하며 적어보세요.' 
  },
  { 
    id: 't2', 
    title: '반례 찾기', 
    desc: '"숫자로 되어 있으면 무조건 더하기가 가능하다"는 말은 왜 틀렸을까요? 파이썬 코드를 예로 들어 반박해보세요.' 
  },
  { 
    id: 't3', 
    title: '적용 설계하기', 
    desc: '학교 성적표 앱을 만든다면, 학생 이름, 점수, 합격여부는 각각 어떤 자료형이 적합할까요? 이유와 함께 적어보세요.' 
  }
];

const TabThink: React.FC = () => {
  const [answers, setAnswers] = useState<SavedThinkAnswer[]>([]);
  const [currentInput, setCurrentInput] = useState<Record<string, string>>({});
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loaded = loadThinkAnswers();
    setAnswers(loaded);
    const initialInputs: Record<string, string> = {};
    loaded.forEach(a => initialInputs[a.questionId] = a.answer);
    setCurrentInput(initialInputs);
  }, []);

  const handleSave = (qid: string) => {
    const val = currentInput[qid] || '';
    if (!val.trim()) return;

    const newAns: SavedThinkAnswer = {
      questionId: qid,
      answer: val,
      updatedAt: Date.now()
    };
    saveThinkAnswer(newAns);
    setSavedStatus({ ...savedStatus, [qid]: true });
    
    setTimeout(() => {
        setSavedStatus(prev => ({ ...prev, [qid]: false }));
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
       <div className="text-center mb-8">
         <h2 className="text-2xl font-bold text-slate-800">생각해볼 문제</h2>
         <p className="text-slate-500">정답이 없는 열린 질문입니다. 논리적으로 서술해보세요.</p>
       </div>

       {QUESTIONS.map(q => (
         <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-50 border-b border-slate-100">
               <div className="flex items-center gap-2 mb-2">
                 <PenTool className="text-indigo-500" size={20} />
                 <h3 className="font-bold text-lg text-slate-800">{q.title}</h3>
               </div>
               <p className="text-slate-600 text-sm leading-relaxed">{q.desc}</p>
            </div>
            <div className="p-5">
               <textarea 
                 className="w-full h-32 p-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
                 placeholder="여기에 생각을 적어보세요..."
                 value={currentInput[q.id] || ''}
                 onChange={(e) => setCurrentInput({ ...currentInput, [q.id]: e.target.value })}
               />
               <div className="flex justify-end mt-3">
                 <button 
                   onClick={() => handleSave(q.id)}
                   className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${savedStatus[q.id] ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                 >
                   {savedStatus[q.id] ? <><Check size={16}/> 저장됨</> : <><Save size={16}/> 저장하기</>}
                 </button>
               </div>
            </div>
         </div>
       ))}
    </div>
  );
};

export default TabThink;