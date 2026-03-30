import React, { useState } from 'react';
import { generateReflectionFeedback } from '../services/geminiService';
import { MessageSquare, Sparkles } from 'lucide-react';

const Reflection: React.FC = () => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const question = {
    title: '우리 반 진로 추천 앱 설계하기',
    context: '여러분이 우리 반 친구들을 위한 진로 추천 앱을 만든다고 가정해봅시다. 친구들의 성적, 동아리 활동, 평소 관심사 데이터를 수집해야 합니다. 하지만 어떤 친구들은 자신의 성적이 공개되거나 서버에 저장되는 것을 싫어할 수 있습니다.',
    prompt: '친구들의 불안감을 해소하면서도, 정확한 진로 추천을 해주기 위해 어떤 "기술적 장치"나 "운영 규칙"을 도입하시겠습니까? 구체적으로 적어보세요.'
  };

  const handleSubmit = async () => {
    if (!userAnswer.trim()) return;
    setLoading(true);
    const result = await generateReflectionFeedback(
      "진로 추천 앱",
      userAnswer,
      question.prompt
    );
    setFeedback(result);
    setLoading(false);
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
        <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold mb-4">
          심화 탐구
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{question.title}</h2>
        <div className="bg-slate-50 p-4 rounded-lg text-slate-700 mb-6 text-sm leading-relaxed border-l-4 border-indigo-400">
          <p className="mb-2 font-medium">{question.context}</p>
          <p className="font-bold text-indigo-700">{question.prompt}</p>
        </div>

        <textarea
          className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none min-h-[150px] resize-none text-slate-700"
          placeholder="여기에 생각을 자유롭게 적어보세요..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={loading || feedback !== null}
        />

        <div className="mt-4 flex justify-end">
          {!feedback ? (
            <button
              onClick={handleSubmit}
              disabled={loading || !userAnswer.trim()}
              className={`flex items-center px-6 py-3 rounded-lg font-bold text-white transition-all ${loading || !userAnswer.trim() ? 'bg-slate-300' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'}`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  AI 선생님이 읽고 있어요...
                </>
              ) : (
                <>
                  <MessageSquare size={18} className="mr-2" />
                  제출하고 피드백 받기
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => { setFeedback(null); setUserAnswer(''); }}
              className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300"
            >
              다른 답변 써보기
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100 shadow-inner animate-slide-up">
          <div className="flex items-center mb-4">
            <div className="bg-white p-2 rounded-full shadow-sm mr-3">
              <Sparkles className="text-indigo-500" size={24} />
            </div>
            <h3 className="font-bold text-xl text-indigo-900">AI 선생님의 피드백</h3>
          </div>
          <div className="prose prose-sm text-slate-700 max-w-none whitespace-pre-wrap leading-relaxed">
            {feedback}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reflection;