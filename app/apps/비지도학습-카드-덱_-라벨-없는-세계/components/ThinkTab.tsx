import React, { useState } from 'react';
import { PenTool, MessageSquare, Award } from 'lucide-react';

const ThinkTab: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = () => {
    let score = 0;
    const feedbackParts = [];

    if (answer.length > 50) {
        score++;
        feedbackParts.push("충분한 길이로 설명을 시도했습니다.");
    }
    
    const keywords = ['라벨', '정답', '군집', '패턴', '구조', '탐색', '비슷'];
    const foundKeywords = keywords.filter(k => answer.includes(k));

    if (foundKeywords.length >= 2) {
        score++;
        feedbackParts.push(`핵심 키워드(${foundKeywords.join(', ')})를 잘 활용했습니다.`);
    }

    if (score >= 2) {
        setFeedback(`훌륭합니다! 논리적인 서술입니다. \n\n${feedbackParts.join(' ')}`);
    } else {
        setFeedback(`조금 더 구체적으로 적어볼까요? '라벨'이 없을 때 우리가 할 수 있는 일이 '탐색'이나 '묶기(군집)'라는 점을 포함해보세요. (50자 이상 권장)`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
        <PenTool className="w-5 h-5 text-indigo-600" />
        생각해볼 문제
      </h2>
      <p className="text-slate-600 mb-6 text-sm">
        비지도학습은 '선생님 없는 교실'과 같습니다. 만약 여러분이 
        <span className="font-bold text-indigo-700"> 외국어만 가득 적힌 책</span>을 
        사전(Label) 없이 해석해야 한다면, 어떤 방식으로 규칙을 찾을까요? 비지도학습의 원리를 적용해서 3문장 이내로 서술해보세요.
      </p>

      <textarea
        className="w-full p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none text-slate-700 text-sm leading-relaxed mb-4 resize-none"
        rows={5}
        placeholder="예: 단어의 반복 횟수를 세어보거나, 자주 같이 나오는 단어들을 묶어서 문맥을 유추할 것입니다..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      {feedback && (
        <div className={`p-4 rounded-lg mb-4 text-sm whitespace-pre-line ${feedback.includes('훌륭') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
          <div className="flex gap-2">
             {feedback.includes('훌륭') ? <Award className="w-5 h-5 shrink-0" /> : <MessageSquare className="w-5 h-5 shrink-0" />}
             {feedback}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors"
      >
        제출 및 피드백 받기
      </button>
    </div>
  );
};

export default ThinkTab;