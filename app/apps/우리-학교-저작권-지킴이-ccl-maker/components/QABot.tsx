import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { askCopyrightQuestion } from '../services/geminiService';

const QABot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer(null);
    
    const result = await askCopyrightQuestion(question);
    setAnswer(result);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 transition z-50 hover:scale-110 duration-200"
        title="저작권 질문하기"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-yellow-300" />
                <h3 className="font-bold">저작권 지킴이에게 물어보세요</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-700 p-1 rounded">
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-slate-50 min-h-[300px]">
              {!answer && !loading && (
                <div className="text-center text-slate-500 mt-10">
                  <p className="mb-2">"무료 폰트는 영상에 써도 되나요?"</p>
                  <p className="mb-2">"연예인 사진을 그려도 되나요?"</p>
                  <p className="text-sm mt-4">궁금한 점을 입력하면 AI가 답변해드립니다.</p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-indigo-600">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <span className="text-sm font-medium">답변을 생각하는 중...</span>
                </div>
              )}

              {answer && (
                <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                  <p className="font-bold text-indigo-900 mb-2 text-sm">Q. {question}</p>
                  <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{answer}</div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="질문을 입력하세요..."
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  disabled={loading || !question.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 disabled:opacity-50 disabled:hover:bg-indigo-100 transition"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default QABot;