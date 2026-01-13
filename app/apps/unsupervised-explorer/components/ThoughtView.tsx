import React, { useState, useEffect } from 'react';
import { THOUGHT_PROMPTS } from '../constants';
import { ThoughtEntry } from '../types';
import { PenTool, Save, Award, History } from 'lucide-react';

const ThoughtView: React.FC = () => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [entries, setEntries] = useState<ThoughtEntry[]>(() => {
    const saved = localStorage.getItem('thoughtEntries');
    return saved ? JSON.parse(saved) : [];
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  const prompt = THOUGHT_PROMPTS[currentPromptIndex];

  useEffect(() => {
    localStorage.setItem('thoughtEntries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = () => {
    if (answer.trim().length < 5) {
      alert("조금 더 구체적으로 적어볼까요? (5글자 이상)");
      return;
    }

    // Simple keyword matching for feedback
    const matchedKeywords = prompt.keywords.filter(k => answer.includes(k));
    const isGoodAnswer = matchedKeywords.length > 0;

    let feedbackMsg = "";
    if (isGoodAnswer) {
      feedbackMsg = `멋진 생각이에요! '${matchedKeywords.join(', ')}' 같은 핵심 내용을 잘 짚어주었네요. 탐험가 배지 획득에 한 걸음 더 가까워졌어요!`;
    } else {
      feedbackMsg = "흥미로운 의견이네요! 비지도학습의 '특징'이나 '군집'과 연결지어 생각해보면 더 좋을 것 같아요.";
    }
    setFeedback(feedbackMsg);

    const newEntry: ThoughtEntry = {
      id: Date.now().toString(),
      question: prompt.question,
      answer: answer,
      feedback: feedbackMsg,
      date: new Date().toLocaleDateString()
    };

    setEntries([newEntry, ...entries]);
    setAnswer("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input Section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <PenTool className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">생각해볼 문제</h2>
          </div>
          
          <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-200">
             <p className="font-medium text-slate-800 leading-relaxed">
               Q. {prompt.question}
             </p>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="여기에 자유롭게 내 생각을 적어보세요..."
            className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none text-slate-700"
          />

          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-2">
               {THOUGHT_PROMPTS.map((_, idx) => (
                 <button 
                  key={idx}
                  onClick={() => {
                    setCurrentPromptIndex(idx);
                    setFeedback(null);
                    setAnswer("");
                  }}
                  className={`w-2 h-2 rounded-full ${idx === currentPromptIndex ? 'bg-indigo-600' : 'bg-slate-200'}`}
                 />
               ))}
            </div>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md"
            >
              <Save className="w-4 h-4" /> 저장하기
            </button>
          </div>

          {feedback && (
            <div className="mt-6 p-4 bg-indigo-50 text-indigo-800 rounded-xl animate-fade-in border border-indigo-100 flex gap-3">
               <Award className="w-6 h-6 shrink-0 text-indigo-500" />
               <p className="text-sm font-medium">{feedback}</p>
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      <div className="lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
           <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
             <History className="w-5 h-5 text-slate-400" /> 내 생각 노트
           </h3>
           <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
             {entries.length === 0 ? (
               <p className="text-slate-400 text-sm text-center py-8">아직 작성된 노트가 없습니다.</p>
             ) : (
               entries.map(entry => (
                 <div key={entry.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                   <div className="text-xs text-slate-400 mb-1">{entry.date}</div>
                   <p className="font-bold text-slate-700 mb-2 line-clamp-2">{entry.question}</p>
                   <p className="text-slate-600">{entry.answer}</p>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ThoughtView;
