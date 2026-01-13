import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

const TabDiscussion: React.FC = () => {
  const [comment, setComment] = useState('');
  const [posts, setPosts] = useState([
    { id: 1, author: '김급식', text: "매점 빵 재고 데이터를 실시간으로 보여주는 앱이 있으면 좋겠어요!", likes: 5 },
    { id: 2, author: '영양사쌤', text: "잔반 데이터를 보면 학생들이 어떤 메뉴를 싫어하는지 바로 알 수 있어 도움이 많이 됩니다.", likes: 12 },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    const newPost = {
      id: Date.now(),
      author: '나(탐정)',
      text: comment,
      likes: 0
    };
    
    setPosts([newPost, ...posts]);
    setComment('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-indigo-600 text-white p-8 rounded-3xl text-center shadow-lg">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-80" />
        <h2 className="text-2xl font-bold mb-2">오늘의 토론 주제</h2>
        <p className="text-indigo-100 text-lg font-medium">
          "만약 학교 매점의 판매 데이터를 수집한다면,<br/> 
          어떤 방법이 가장 효율적일까요?"
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input 
            type="text" 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="탐정님의 의견을 남겨주세요..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 font-bold"
          >
            <Send className="w-4 h-4" /> 등록
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-slate-800">{post.author}</span>
              <span className="text-xs text-slate-400">방금 전</span>
            </div>
            <p className="text-slate-600">{post.text}</p>
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
               <span>❤️ 좋아요 {post.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabDiscussion;
