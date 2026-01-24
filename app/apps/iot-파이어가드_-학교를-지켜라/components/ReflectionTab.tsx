import React, { useState } from 'react';
import { getExpertFeedback } from '../services/geminiService';
import { Bot, Send, Loader2, Save } from 'lucide-react';

const ReflectionTab: React.FC = () => {
  const [notes, setNotes] = useState<string>(() => localStorage.getItem('fireguard_notes') || "");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    localStorage.setItem('fireguard_notes', notes);
    alert("메모가 저장되었습니다.");
  };

  const handleGetFeedback = async () => {
    if (!notes.trim()) return;
    setIsLoading(true);
    setFeedback(null);
    
    try {
      const result = await getExpertFeedback(notes);
      setFeedback(result);
    } catch (error) {
      setFeedback("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      {/* Input Section */}
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex-1 flex flex-col">
          <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <span className="text-2xl">🤔</span> 엔지니어 노트
          </h2>
          <p className="text-slate-500 text-sm mb-4">
            오작동(False Alarm)은 실제 화재가 아닌데 경보가 울리는 것입니다.<br/>
            <strong>오작동을 줄이려면 조건문에 어떤 내용을 추가하면 좋을까요?</strong> 아이디어를 적어보세요.
          </p>
          <textarea
            className="w-full flex-1 p-4 rounded-lg bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-700 leading-relaxed"
            placeholder="예: 온도가 50도 이상이면서, 동시에 연기도 감지될 때만 울리도록 한다. 또는 온도가 급격히 오르는지 확인한다."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
            >
              <Save size={18} /> 저장
            </button>
            <button
              onClick={handleGetFeedback}
              disabled={isLoading || !notes.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Bot size={18} />}
              수석 엔지니어에게 피드백 받기
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="flex flex-col">
        {feedback ? (
          <div className="bg-indigo-50 rounded-xl shadow-inner p-6 border border-indigo-100 flex-1 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-indigo-900">수석 엔지니어의 피드백</h3>
                <p className="text-xs text-indigo-500">Gemini AI Analysis</p>
              </div>
            </div>
            <div className="prose prose-sm text-indigo-800 bg-white/50 p-4 rounded-lg leading-relaxed whitespace-pre-line">
              {feedback}
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <Bot size={48} className="mb-4 opacity-20" />
            <p>
              왼쪽에 아이디어를 적고<br/>
              <strong>피드백 받기</strong> 버튼을 눌러보세요.<br/>
              AI 전문가가 조언해드립니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionTab;
