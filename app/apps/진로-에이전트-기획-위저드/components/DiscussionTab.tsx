import React, { useState, useEffect } from 'react';

const DiscussionTab: React.FC = () => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const saved = localStorage.getItem('careerwizard_discussion_v1');
    if (saved) setAnswers(JSON.parse(saved));
  }, []);

  const handleChange = (id: number, text: string) => {
    const newAnswers = { ...answers, [id]: text };
    setAnswers(newAnswers);
    localStorage.setItem('careerwizard_discussion_v1', JSON.stringify(newAnswers));
  };

  const questions = [
    {
      id: 1,
      title: '조건 바꾸기',
      prompt: '만약 AI가 "가장 돈을 많이 버는 직업"만 추천하도록 프로그래밍된다면, 우리 사회의 직업 다양성은 어떻게 될까요?'
    },
    {
      id: 2,
      title: '반례 찾기',
      prompt: 'AI가 분석할 수 없는 "나만의 데이터"에는 무엇이 있을까요? (예: 내가 느끼는 보람, 순간적인 영감 등)'
    },
    {
      id: 3,
      title: '적용 설계',
      prompt: '나중에 직업인이 되었을 때, 당신의 분야에서 AI 동료를 쓴다면 어떤 일을 맡기고 어떤 일을 당신이 직접 할 것인가요?'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">생각해볼 문제</h2>
        <p className="text-gray-600">정답은 없습니다. 자유롭게 당신의 생각을 기록해보세요.</p>
      </div>

      <div className="space-y-6">
        {questions.map(q => (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-indigo-700 mb-2 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">Q{q.id}</span>
              {q.title}
            </h3>
            <p className="text-gray-700 font-medium mb-4">{q.prompt}</p>
            <textarea
              className="w-full p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-y min-h-[100px] text-sm"
              placeholder="여기에 생각을 적어주세요..."
              value={answers[q.id] || ''}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          </div>
        ))}
      </div>
      
      <div className="text-center text-xs text-gray-400 mt-8">
        작성된 내용은 브라우저에 자동 저장됩니다.
      </div>
    </div>
  );
};

export default DiscussionTab;