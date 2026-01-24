import React, { useState } from 'react';
import { gradeReflection } from '../services/geminiService';
import { Send, Bot, Loader2 } from 'lucide-react';

const REFLECTION_QUESTIONS = [
  { id: 'design', label: '설계형', text: "온도가 아니라 '빛 밝기'로 경보 시스템을 만든다면, 어두울 때(밤) 경보를 울리려면 조건식을 어떻게 바꿔야 할까요?" },
  { id: 'counter', label: '반례찾기', text: "그룹 번호도 맞고 온도도 높은데 경보가 울리지 않았습니다. 어떤 하드웨어적인 원인이 있을까요? (배터리 등 제외)" },
  { id: 'apply', label: '응용하기', text: "여러 대의 송신 마이크로비트가 하나의 수신 마이크로비트에게 데이터를 보낼 때, '누가 보냈는지' 구분하려면 어떻게 해야 할까요?" }
];

const ReflectionTab: React.FC = () => {
  const [selectedQ, setSelectedQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGrade = async () => {
    if (!answer.trim()) return;
    
    setIsLoading(true);
    setFeedback(null);
    
    const currentQ = REFLECTION_QUESTIONS[selectedQ];
    const result = await gradeReflection(currentQ.text, answer);
    
    setFeedback(result ?? null);
    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
        <h2 className="font-bold text-indigo-700">생각해볼 문제 (AI 코치)</h2>
        <p className="text-sm text-indigo-600">서술형 답안을 작성하면 AI 튜터가 피드백을 해줍니다.</p>
      </div>

      {/* Question Select */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {REFLECTION_QUESTIONS.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => { setSelectedQ(idx); setFeedback(null); setAnswer(''); }}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${selectedQ === idx ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
          >
            {q.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{REFLECTION_QUESTIONS[selectedQ].text}</h3>
        
        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-gray-700"
          placeholder="여기에 답변을 작성하세요..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        ></textarea>

        <div className="mt-4 flex justify-end">
          <button 
            onClick={handleGrade}
            disabled={isLoading || !answer.trim()}
            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-400 transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            AI 피드백 받기
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm animate-fadeIn">
          <div className="flex items-start space-x-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <Bot className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-bold text-indigo-900 mb-2">AI 튜터의 피드백</h4>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{feedback}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReflectionTab;