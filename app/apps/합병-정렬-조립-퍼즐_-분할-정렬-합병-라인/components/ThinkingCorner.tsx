import React, { useState } from 'react';
import { getThinkingFeedback } from '../services/geminiService';

const ThinkingCorner: React.FC = () => {
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!answer.trim()) return;
        setIsLoading(true);
        const fb = await getThinkingFeedback(answer, "학교 축제 부스에 주문이 동시에 1000개가 몰렸습니다. 합병 정렬의 분할 정복 방식을 이용하여 친구 4명과 함께 이 주문서를 어떻게 효율적으로 처리할 수 있을까요?");
        setFeedback(fb);
        setIsLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 mt-8">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100 shadow-sm">
                <h2 className="text-2xl font-bold text-indigo-900 mb-4">🧠 생각해볼 문제: 주문 폭주 상황!</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">
                    학교 축제 부스에 주문이 동시에 <strong>1000개</strong>가 몰렸습니다! 혼자서는 도저히 정렬할 수 없네요.
                    <br/>
                    합병 정렬의 <strong>'분할 정복'</strong> 아이디어를 사용하여, 
                    <strong>친구 4명</strong>과 함께 이 주문서들을 어떻게 나눠서 처리하고 합칠지 전략을 적어보세요.
                </p>

                <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="예: 주문서를 250개씩 4묶음으로 나누어 각자 정렬한 뒤..."
                    className="w-full h-32 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none mb-4"
                />

                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || !answer.trim()}
                        className={`px-6 py-2 rounded-lg font-bold text-white transition-colors
                            ${isLoading || !answer.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
                        `}
                    >
                        {isLoading ? 'AI 코치가 분석 중...' : '코치에게 피드백 받기'}
                    </button>
                </div>

                {feedback && (
                    <div className="mt-6 bg-white p-6 rounded-xl border-l-4 border-indigo-500 shadow-sm animate-fade-in">
                        <h4 className="font-bold text-indigo-800 mb-2">AI 코치의 피드백</h4>
                        <p className="text-gray-700">{feedback}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThinkingCorner;
