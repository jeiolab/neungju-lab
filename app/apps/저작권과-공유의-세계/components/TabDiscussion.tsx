import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, User } from 'lucide-react';

const TabDiscussion: React.FC = () => {
  const [votes, setVotes] = useState({ yes: 124, no: 89 });
  const [hasVoted, setHasVoted] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, user: "학생1", text: "AI도 데이터를 학습했으니 창작 아닐까요?", side: 'yes' },
    { id: 2, user: "디자이너", text: "인간의 감정과 의도가 없으므로 도구일 뿐입니다.", side: 'no' },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleVote = (side: 'yes' | 'no') => {
    if (hasVoted) return;
    setVotes(prev => ({ ...prev, [side]: prev[side] + 1 }));
    setHasVoted(true);
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => [...prev, {
      id: Date.now(),
      user: "나",
      text: newComment,
      side: 'neutral'
    }]);
    setNewComment("");
  };

  const totalVotes = votes.yes + votes.no;
  const yesPercent = Math.round((votes.yes / totalVotes) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <section className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
          <MessageSquare className="text-amber-500" />
          생각해볼 문제
        </h2>
        <h3 className="text-xl md:text-3xl font-black mb-6 leading-tight">
          "AI가 그린 그림의 저작권,<br />AI에게 주어야 할까?"
        </h3>
        
        <div className="mb-8">
          <div className="flex justify-between text-sm font-bold mb-2 px-2">
            <span className="text-green-400">찬성 {yesPercent}%</span>
            <span className="text-red-400">반대 {100 - yesPercent}%</span>
          </div>
          <div className="h-6 bg-slate-700 rounded-full overflow-hidden flex">
            <div style={{ width: `${yesPercent}%` }} className="bg-green-500 h-full transition-all duration-1000"></div>
            <div style={{ width: `${100 - yesPercent}%` }} className="bg-red-500 h-full transition-all duration-1000"></div>
          </div>
        </div>

        {!hasVoted ? (
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => handleVote('yes')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-transform hover:scale-105"
            >
              <ThumbsUp size={18} /> 찬성 (있다)
            </button>
            <button 
              onClick={() => handleVote('no')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-transform hover:scale-105"
            >
              <ThumbsDown size={18} /> 반대 (없다)
            </button>
          </div>
        ) : (
          <div className="text-amber-400 font-bold animate-fade-in">
            투표에 참여해주셔서 감사합니다!
          </div>
        )}
      </section>

      <section className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-bold text-slate-800 mb-4">토론 댓글</h3>
        <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-slate-500" />
              </div>
              <div className="bg-slate-50 p-3 rounded-lg rounded-tl-none flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700">{comment.user}</span>
                  {comment.side !== 'neutral' && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${comment.side === 'yes' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {comment.side === 'yes' ? '찬성' : '반대'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={submitComment} className="flex gap-2">
          <input 
            type="text" 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="의견을 남겨주세요..."
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-amber-500"
          />
          <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800">
            등록
          </button>
        </form>
      </section>
    </div>
  );
};

export default TabDiscussion;