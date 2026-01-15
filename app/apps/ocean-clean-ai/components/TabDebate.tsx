import React, { useState } from 'react';
import { DebateComment } from '../types';
import { MessageSquare, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { summarizeDebate } from '../services/geminiService';

const TabDebate: React.FC = () => {
  const [comments, setComments] = useState<DebateComment[]>([
    { id: '1', author: 'User1', text: 'AI는 코드일 뿐입니다. 감정이 없어요.', side: 'con', timestamp: Date.now() },
    { id: '2', author: 'User2', text: '스스로 판단을 내린다면 권리가 필요합니다.', side: 'pro', timestamp: Date.now() },
  ]);
  const [newComment, setNewComment] = useState('');
  const [side, setSide] = useState<'pro' | 'con'>('pro');
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const votes = {
    pro: comments.filter(c => c.side === 'pro').length,
    con: comments.filter(c => c.side === 'con').length,
  };

  const chartData = [
    { name: '찬성 (권리 부여)', votes: votes.pro },
    { name: '반대 (도구일 뿐)', votes: votes.con },
  ];

  const handlePost = () => {
    if (!newComment.trim()) return;
    const comment: DebateComment = {
      id: Date.now().toString(),
      author: '나',
      text: newComment,
      side,
      timestamp: Date.now()
    };
    setComments([...comments, comment]);
    setNewComment('');
    setSummary(null); // Invalidate old summary
  };

  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    const proTexts = comments.filter(c => c.side === 'pro').map(c => c.text);
    const conTexts = comments.filter(c => c.side === 'con').map(c => c.text);
    
    const result = await summarizeDebate("AI에게 인격권/권리를 부여해야 할까요?", proTexts, conTexts);
    setSummary(result);
    setIsSummarizing(false);
  };

  return (
    <div className="grid md:grid-cols-12 gap-6 h-full">
      {/* Left: Voting & Stats */}
      <div className="md:col-span-5 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-2">주제: AI 인격권</h2>
          <p className="text-slate-600 text-sm mb-6">
            여러분이 바다를 청소하기 위해 훈련시킨 AI가 스스로 판단하고 행동하게 된다면, 법적인 '인격'이나 권리를 주어야 할까요?
          </p>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" fontSize={12} stroke="#64748b" />
                <YAxis allowDecimals={false} fontSize={12} stroke="#64748b" />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
          <div className="flex items-start gap-3">
             <div className="bg-white p-2 rounded-full shadow-sm text-indigo-500">
               <Sparkles className="w-5 h-5" />
             </div>
             <div>
               <h3 className="font-bold text-indigo-900">AI 중재자</h3>
               <p className="text-xs text-indigo-700 mb-3">Gemini가 생성한 토론 요약을 확인하세요.</p>
               
               {!summary ? (
                 <button 
                   onClick={handleGenerateSummary}
                   disabled={isSummarizing}
                   className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                 >
                   {isSummarizing ? '분석 중...' : '분석 생성'}
                 </button>
               ) : (
                 <div className="mt-2 text-sm text-indigo-800 italic bg-white/50 p-3 rounded-lg border border-indigo-100">
                    "{summary}"
                    <button onClick={() => setSummary(null)} className="block mt-2 text-xs text-indigo-500 hover:underline">초기화</button>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Right: Discussion */}
      <div className="md:col-span-7 flex flex-col h-[600px] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
             <h3 className="font-bold text-slate-700 flex items-center gap-2">
                 <MessageSquare className="w-4 h-4" /> 실시간 토론
             </h3>
             <span className="text-xs text-slate-400">{comments.length}개의 의견</span>
         </div>
         
         <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.map((c) => (
              <div key={c.id} className={`flex gap-3 ${c.author === '나' ? 'flex-row-reverse' : ''}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white ${c.side === 'pro' ? 'bg-blue-500' : 'bg-red-500'}`}>
                    {c.side === 'pro' ? 'Y' : 'N'}
                 </div>
                 <div className={`max-w-[80%] p-3 rounded-xl text-sm ${c.author === '나' ? 'bg-slate-100 text-slate-800 rounded-tr-none' : 'bg-white border border-slate-100 shadow-sm rounded-tl-none'}`}>
                    <p className="font-bold text-xs mb-1 text-slate-400">{c.author}</p>
                    <p>{c.text}</p>
                 </div>
              </div>
            ))}
         </div>

         <div className="p-4 bg-slate-50 border-t border-slate-100">
             <div className="flex gap-2 mb-2">
                 <button 
                    onClick={() => setSide('pro')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${side === 'pro' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' : 'bg-white text-slate-500 border hover:bg-slate-50'}`}
                 >
                    <ThumbsUp className="w-4 h-4" /> 찬성
                 </button>
                 <button 
                    onClick={() => setSide('con')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${side === 'con' ? 'bg-red-100 text-red-700 ring-2 ring-red-500' : 'bg-white text-slate-500 border hover:bg-slate-50'}`}
                 >
                    <ThumbsDown className="w-4 h-4" /> 반대
                 </button>
             </div>
             <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={newComment}
                   onChange={(e) => setNewComment(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handlePost()}
                   placeholder="의견을 작성하세요..."
                   className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
                 <button 
                   onClick={handlePost}
                   className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700"
                 >
                   전송
                 </button>
             </div>
         </div>
      </div>
    </div>
  );
};

export default TabDebate;