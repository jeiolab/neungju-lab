import React, { useState } from 'react';
import { evaluateDesignThinking } from '../services/geminiService';
import { Lightbulb, Send, Loader2 } from 'lucide-react';

const ThinkingTab: React.FC = () => {
  const [activeProblem, setActiveProblem] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; score: number } | null>(null);

  const problems = [
    {
      type: '조건 바꾸기',
      title: '인터넷 없는 결제 시스템?',
      question: '학교 축제 매점에서 WiFi나 LTE가 고장 나서 인터넷이 아예 안 되는 상황입니다. 그래도 결제가 가능하게 하려면 어떤 기술 조합이 필요할까요? 그 이유는?',
    },
    {
      type: '반례 찾기',
      title: 'RFID는 양방향 통신일까?',
      question: '"RFID는 리더기와 태그가 서로 데이터를 주고받으니 양방향 통신이다"라는 주장에 대해 반박하거나 동의해보세요. (힌트: 태그에 배터리가 있나요?)',
    },
    {
      type: '적용 설계',
      title: '자동 출석 시스템 설계',
      question: '학생들이 교실 문을 통과하기만 해도 자동으로 출석이 체크되는 시스템을 만들고 싶습니다. 어떤 기술을 사용해야 하며, 발생할 수 있는 문제점(오류 등)은 무엇일까요?',
    },
  ];

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    setLoading(true);
    const result = await evaluateDesignThinking(problems[activeProblem].type, answer);
    setFeedback({ text: result.feedback, score: result.score });
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto animate-fadeIn">
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
        {problems.map((p, idx) => (
          <button
            key={idx}
            onClick={() => { setActiveProblem(idx); setFeedback(null); setAnswer(''); }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition
              ${activeProblem === idx 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}
            `}
          >
            {p.type}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-start mb-4">
          <div className="bg-yellow-100 p-2 rounded-full mr-3">
            <Lightbulb className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{problems[activeProblem].title}</h3>
            <p className="text-gray-600 mt-2 leading-relaxed">
              {problems[activeProblem].question}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="여기에 생각을 자유롭게 적어보세요..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            disabled={loading || feedback !== null}
          />
          
          {!feedback && (
            <button
              onClick={handleSubmit}
              disabled={loading || !answer.trim()}
              className={`mt-4 w-full flex items-center justify-center py-3 rounded-lg font-bold text-white transition
                ${loading || !answer.trim() ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  AI 선생님이 채점 중...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  제출하고 피드백 받기
                </>
              )}
            </button>
          )}

          {feedback && (
            <div className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-100 animate-fadeIn">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-indigo-900 text-lg">AI 코치의 피드백</span>
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {feedback.score}점
                </span>
              </div>
              <p className="text-gray-800 leading-relaxed">{feedback.text}</p>
              <button 
                onClick={() => { setFeedback(null); setAnswer(''); }}
                className="mt-4 text-indigo-600 font-semibold hover:text-indigo-800 text-sm"
              >
                다시 작성하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThinkingTab;
