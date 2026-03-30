import React, { useState } from 'react';
import { getReflectionFeedback } from '../services/geminiService';
import { MessageSquare, Sparkles } from 'lucide-react';

const ReflectionTab: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const aiResponse = await getReflectionFeedback(input);
    setResponse(aiResponse || '');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-100 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MessageSquare className="text-indigo-600" />
          생각해보기
        </h2>
        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
          "내가 열심히 만든 발표 자료나 찍은 사진이 <br/>
          <span className="font-bold text-indigo-700">나의 동의 없이</span> 다른 단톡방에 퍼졌다면 기분이 어떨까? <br/>
          그리고 어떻게 대처해야 현명할까?"
        </p>

        <textarea
          className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none min-h-[150px] bg-white resize-none shadow-inner"
          placeholder="여기에 너의 생각과 대처 방법을 적어봐..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                선생님 생각 중...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                선생님께 의견 묻기
              </>
            )}
          </button>
        </div>
      </div>

      {response && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 animate-slide-up">
          <h3 className="font-bold text-indigo-900 mb-2 text-lg">👨‍🏫 선생님의 피드백</h3>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{response}</p>
        </div>
      )}
    </div>
  );
};

export default ReflectionTab;
