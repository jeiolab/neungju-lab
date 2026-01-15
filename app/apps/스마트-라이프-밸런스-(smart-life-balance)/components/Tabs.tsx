import React, { useState, useEffect } from 'react';
import { CASE_STUDIES, QUIZ_DATA } from '../constants';
import { DebateEntry, QuizQuestion } from '../types';
import { getDebateFeedback } from '../services/geminiService';
import { BookOpen, AlertTriangle, CheckCircle, XCircle, MessageSquare, Send, BrainCircuit, Shield, Eye, Zap } from 'lucide-react';

// --- TAB 1: Theory ---
export const TheoryTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">디지털 세상의 명과 암</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          기술은 우리에게 엄청난 편리함을 주지만, 동시에 소중한 프라이버시를 위협하기도 합니다.
          이 두 가치 사이에서 균형을 잡는 것이 '디지털 시민성'의 핵심입니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold">편리함 (Convenience)</h3>
          </div>
          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-2"><CheckCircle size={18} className="text-blue-500 mt-1 flex-shrink-0"/> 시간과 비용 절약</li>
            <li className="flex gap-2"><CheckCircle size={18} className="text-blue-500 mt-1 flex-shrink-0"/> 맞춤형 서비스 제공</li>
            <li className="flex gap-2"><CheckCircle size={18} className="text-blue-500 mt-1 flex-shrink-0"/> 업무 및 생활 효율성 증대</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border-t-4 border-green-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold">프라이버시 (Privacy)</h3>
          </div>
           <ul className="space-y-3 text-slate-700">
            <li className="flex gap-2"><AlertTriangle size={18} className="text-green-500 mt-1 flex-shrink-0"/> 개인 정보 유출 위험</li>
            <li className="flex gap-2"><AlertTriangle size={18} className="text-green-500 mt-1 flex-shrink-0"/> 감시 사회(Panopticon) 우려</li>
            <li className="flex gap-2"><AlertTriangle size={18} className="text-green-500 mt-1 flex-shrink-0"/> 데이터의 상업적 악용</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-800 text-white p-8 rounded-2xl mt-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BrainCircuit /> 트레이드오프(Trade-off) 란?</h3>
        <p className="leading-relaxed opacity-90">
          두 가지 목표가 서로 상충하여, 한쪽을 얻으려면 다른 한쪽을 희생해야 하는 관계를 말합니다.
          보안을 강화하면 절차가 복잡해져 불편해지고(불편함 증가), 반대로 인증 절차를 없애면 매우 편하지만 해킹 위험이 높아집니다(보안 감소).
          우리는 매 순간 이 사이에서 선택을 내리고 있습니다.
        </p>
      </div>
    </div>
  );
};

// --- TAB 3: Case Studies ---
export const CaseStudiesTab: React.FC = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">사례 연구 (Case Studies)</h2>
      {CASE_STUDIES.map((c) => (
        <div key={c.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
          <button 
            onClick={() => setActiveId(activeId === c.id ? null : c.id)}
            className="w-full flex items-center justify-between p-6 hover:bg-slate-50 text-left"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{c.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                <p className="text-sm text-slate-500">{c.summary}</p>
              </div>
            </div>
            <div className={`transform transition-transform ${activeId === c.id ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </button>
          
          {activeId === c.id && (
            <div className="p-6 bg-slate-50 border-t border-slate-100 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-blue-600 mb-2">긍정적 측면 (Pros)</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                  {c.pros.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-red-600 mb-2">부정적 측면 (Cons)</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                  {c.cons.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// --- TAB 4: Quiz ---
export const QuizTab: React.FC = () => {
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [showResult, setShowResult] = useState<number | null>(null); // ID of question to show result for
  const [score, setScore] = useState(0);

  const handleAnswer = (qId: number, optionIdx: number) => {
    if (answers[qId] !== undefined) return; // Prevent re-answer
    setAnswers(prev => ({...prev, [qId]: optionIdx}));
    setShowResult(qId);

    if (QUIZ_DATA.find(q => q.id === qId)?.correctIndex === optionIdx) {
      setScore(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">디지털 윤리 퀴즈</h2>
        <div className="bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-bold">
          점수: {score} / {QUIZ_DATA.length}
        </div>
      </div>

      {QUIZ_DATA.map((q, idx) => {
        const isAnswered = answers[q.id] !== undefined;
        const isCorrect = answers[q.id] === q.correctIndex;
        
        return (
          <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 text-slate-800">Q{idx + 1}. {q.question}</h3>
            <div className="space-y-2 mb-4">
              {q.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(q.id, oIdx)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isAnswered
                      ? oIdx === q.correctIndex
                        ? 'bg-green-100 border-green-500 text-green-900 font-medium'
                        : answers[q.id] === oIdx
                          ? 'bg-red-100 border-red-500 text-red-900'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      : 'hover:bg-indigo-50 hover:border-indigo-300 border-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            
            {isAnswered && (
               <div className={`p-4 rounded-lg text-sm ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                 <p className="font-bold mb-1">{isCorrect ? '정답입니다! 🎉' : '오답입니다. 😅'}</p>
                 <p>{q.explanation}</p>
                 {!isCorrect && <p className="mt-2 text-xs font-semibold underline cursor-pointer" onClick={() => alert("오답노트에 저장되었습니다. (데모)")}>오답노트에 추가하기</p>}
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// --- TAB 5: Debate ---
export const DebateTab: React.FC = () => {
  const [topic, setTopic] = useState("범죄 예방을 위한 CCTV 전면 설치");
  const [opinion, setOpinion] = useState("");
  const [history, setHistory] = useState<DebateEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load local history on mount (mock)
    const saved = localStorage.getItem('debate_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opinion.trim()) return;

    setLoading(true);
    const feedback = await getDebateFeedback(topic, opinion);
    
    const newEntry: DebateEntry = {
      id: Date.now().toString(),
      topic,
      userOpinion: opinion,
      aiFeedback: feedback,
      timestamp: Date.now()
    };

    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    localStorage.setItem('debate_history', JSON.stringify(newHistory));
    setOpinion("");
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 h-full flex flex-col animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shrink-0">
        <div className="flex items-center gap-2 mb-2 opacity-90 text-sm font-semibold uppercase tracking-wider">
          <MessageSquare size={16}/> 오늘의 토론 주제
        </div>
        <h2 className="text-2xl font-bold">{topic}</h2>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {["CCTV 전면 설치", "잊혀질 권리", "노키즈존 AI 판독"].map(t => (
                <button key={t} onClick={() => setTopic(t)} className={`px-3 py-1 rounded-full text-xs whitespace-nowrap border ${topic === t ? 'bg-white text-indigo-600 border-white' : 'border-white/30 hover:bg-white/10'}`}>
                    {t}
                </button>
            ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {history.length === 0 && (
          <div className="text-center text-slate-400 py-10">
            아직 작성된 의견이 없습니다. 첫 번째 의견을 남겨보세요!
          </div>
        )}
        {history.map(entry => (
          <div key={entry.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
             <div className="flex justify-between items-start mb-2">
               <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">{entry.topic}</span>
               <span className="text-xs text-slate-400">{new Date(entry.timestamp).toLocaleTimeString()}</span>
             </div>
             <p className="text-slate-800 font-medium mb-3">{entry.userOpinion}</p>
             <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 border-l-4 border-purple-400">
               <span className="font-bold text-purple-600 block mb-1">🤖 AI 심판관의 피드백:</span>
               {entry.aiFeedback}
             </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="shrink-0 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-2">
        <input
          type="text"
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
          placeholder="주제에 대한 나의 생각을 자유롭게 적어보세요..."
          className="flex-1 bg-slate-50 border-0 rounded-lg px-4 focus:ring-2 focus:ring-indigo-500"
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={loading || !opinion.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg disabled:opacity-50 transition-colors"
        >
          {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
};
