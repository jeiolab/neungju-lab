import React, { useState } from 'react';
import { Save, MessageSquare } from 'lucide-react';

interface ReflectionTabProps {
  onSave: () => void;
}

const ReflectionTab: React.FC<ReflectionTabProps> = ({ onSave }) => {
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: ''
  });
  const [summary, setSummary] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const questions = [
    { key: 'q1', q: "오늘 실험에서 '편리함'과 '안전함' 사이의 관계는 어땠나요?" },
    { key: 'q2', q: "만약 내가 만든 IoT 시스템이 오작동한다면 어떤 문제가 생길까요?" },
    { key: 'q3', q: "미래의 우리 교실에 꼭 필요한 센서는 무엇일까요?" }
  ];

  const handleInputChange = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSummarizeAndSave = () => {
    if (!answers.q1 || !answers.q2 || !answers.q3) {
      alert("모든 질문에 답을 적어주세요!");
      return;
    }

    // Local Rule-based Summary Logic
    // Extracts key concepts or simply formats the user's input into a statement.
    const keySentences = [
      answers.q1.split(/[.!?]/)[0], // First sentence of answer 1
      answers.q3.split(/[.!?]/)[0]  // First sentence of answer 3
    ].filter(Boolean).join(" 그리고 ");

    setSummary(`"나는 ${keySentences}(이)라고 생각한다."`);
    setIsSaved(true);
    onSave();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-2">생각 정리하기</h2>
        <p className="text-slate-600">실험을 통해 느낀 점을 기록하고 나만의 IoT 철학을 만들어보세요.</p>
      </div>

      <div className="space-y-4">
        {questions.map((item, idx) => (
          <div key={item.key} className="bg-white p-5 rounded-xl border border-slate-200 focus-within:border-indigo-400 transition-colors">
            <label className="block font-bold text-slate-700 mb-3">
              Q{idx + 1}. {item.q}
            </label>
            <textarea
              className="w-full h-24 p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none text-sm"
              placeholder="여기에 생각을 적어보세요..."
              value={(answers as any)[item.key]}
              onChange={(e) => handleInputChange(item.key, e.target.value)}
              disabled={isSaved}
            />
          </div>
        ))}
      </div>

      {!isSaved ? (
        <button
          onClick={handleSummarizeAndSave}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
        >
          <Save size={20} /> 저장하고 내 주장 요약하기
        </button>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center animate-fade-in-up">
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <MessageSquare className="text-emerald-500" size={32} />
            </div>
          </div>
          <h3 className="font-bold text-emerald-800 mb-2">작성 완료! 오늘의 한 줄 요약</h3>
          <p className="text-lg font-medium text-slate-800 italic bg-white p-4 rounded-xl shadow-sm">
            {summary}
          </p>
          <p className="text-xs text-slate-400 mt-4">생각해볼 문제 답변이 저장되었습니다.</p>
        </div>
      )}
    </div>
  );
};

export default ReflectionTab;
