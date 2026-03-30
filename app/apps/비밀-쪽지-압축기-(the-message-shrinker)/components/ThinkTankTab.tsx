import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

const ThinkTankTab: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('message_shrinker_comments');
    if (saved) {
      setComments(JSON.parse(saved));
    } else {
        // Seed initial discussion
        const seeds = [
            { id: 1, author: '동아리장', text: "가나다라 처럼 반복이 없으면 허프만 코딩을 써야할까? 빈도수 체크해봐.", date: new Date().toLocaleString() }
        ];
        setComments(seeds);
        localStorage.setItem('message_shrinker_comments', JSON.stringify(seeds));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now(),
      author: '익명의 요원',
      text: newComment,
      date: new Date().toLocaleString()
    };

    const updated = [comment, ...comments];
    setComments(updated);
    localStorage.setItem('message_shrinker_comments', JSON.stringify(updated));
    setNewComment('');
  };

  const handleDelete = (id: number) => {
      const updated = comments.filter(c => c.id !== id);
      setComments(updated);
      localStorage.setItem('message_shrinker_comments', JSON.stringify(updated));
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border-l-4 border-pink-500 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <MessageSquare size={24} className="text-pink-600" />
          생각해보기 (Think Tank)
        </h2>
        <p className="text-slate-600 mt-2">
           "만약 '가나다라'처럼 반복이 없는 글만 있다면 어떻게 압축할까?"에 대한 의견을 남겨주세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
              <form onSubmit={handleSubmit} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm sticky top-6">
                  <label className="block text-slate-700 font-bold mb-2">의견 남기기</label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-800 h-32 resize-none focus:ring-2 focus:ring-pink-500 focus:outline-none mb-3"
                    placeholder="좋은 아이디어가 있나요?"
                  />
                  <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 rounded-lg flex justify-center items-center gap-2">
                      <Send size={18} /> 전송
                  </button>
              </form>
          </div>

          <div className="md:col-span-2 space-y-4 h-[500px] overflow-y-auto pr-2">
              {comments.map((comment) => (
                  <div key={comment.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group">
                      <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                                  {comment.author[0]}
                              </div>
                              <span className="font-bold text-slate-700">{comment.author}</span>
                          </div>
                          <span className="text-xs text-slate-500">{comment.date}</span>
                      </div>
                      <p className="text-slate-600 text-sm pl-10">{comment.text}</p>
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="text-slate-500 hover:text-red-600 text-xs mt-2 ml-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                      >
                          <Trash2 size={12} /> 삭제
                      </button>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default ThinkTankTab;