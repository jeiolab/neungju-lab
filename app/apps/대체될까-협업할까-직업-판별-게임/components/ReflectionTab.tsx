import React, { useState, useEffect } from 'react';
import { Save, AlertTriangle, FileText, Lock } from 'lucide-react';

const REFLECTION_QUESTIONS = [
  {
    id: 'q1',
    title: '조건 바꾸기',
    prompt: '내가 관심 있는 직업에서 "가장 하기 싫은 반복 업무" 하나를 고르고, 만약 그것을 AI가 100% 대신 해준다면 남은 시간에 무엇을 하고 싶은지 적어보세요.',
    placeholder: '예: 의사라면 차트 기록 업무를 AI가 하고, 나는 환자와 더 대화하고 싶다.'
  },
  {
    id: 'q2',
    title: '적용 설계하기',
    prompt: '나의 진로 분야에서 "사람만이 할 수 있는 가치(Human Touch)"는 무엇일까요? 구체적인 상황을 상상해 보세요.',
    placeholder: '예: 호텔리어라면 고객이 아플 때 진심으로 걱정해주고 죽을 챙겨주는 서비스.'
  }
];

const ReflectionTab: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [savedTime, setSavedTime] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('careerJudge_reflection_v1');
    if (saved) {
      setAnswers(JSON.parse(saved));
    }
  }, []);

  const handleChange = (id: string, text: string) => {
    setAnswers(prev => ({ ...prev, [id]: text }));
  };

  const handleSave = () => {
    localStorage.setItem('careerJudge_reflection_v1', JSON.stringify(answers));
    const now = new Date().toLocaleTimeString();
    setSavedTime(now);
    setTimeout(() => setSavedTime(null), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-fade-in">
      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
        <div className="flex items-start space-x-3">
          <Lock className="text-orange-400 mt-1" size={20} />
          <div>
            <h2 className="text-lg font-bold text-orange-900 mb-1">🤔 나의 생각 정리</h2>
            <p className="text-sm text-orange-700">
              작성한 내용은 <strong>오직 내 기기(브라우저)에만 저장</strong>되며, 서버로 전송되지 않습니다. 
              솔직하게 적어보세요. (실명, 학교명은 적지 마세요!)
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {REFLECTION_QUESTIONS.map((q) => (
          <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="text-gray-400" size={18} />
              <h3 className="font-bold text-gray-800">{q.title}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
              {q.prompt}
            </p>
            <textarea
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[120px] text-sm leading-relaxed resize-none"
              placeholder={q.placeholder}
              value={answers[q.id] || ''}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 z-10 flex justify-center">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-gray-900 text-white px-8 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-all active:scale-95"
        >
          <Save size={18} />
          <span className="font-bold">내 생각 저장하기</span>
        </button>
      </div>

      {savedTime && (
        <div className="text-center text-xs text-green-600 font-medium animate-bounce">
          {savedTime}에 저장되었습니다!
        </div>
      )}
    </div>
  );
};

export default ReflectionTab;