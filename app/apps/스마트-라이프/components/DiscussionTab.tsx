import React, { useState, useEffect } from 'react';
import { MessageSquare, Save, Trash2, WifiOff } from 'lucide-react';
import { Comment } from '../types';

const DiscussionTab: React.FC = () => {
  const [input, setInput] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  // Load comments from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('smartLifeComments');
    if (saved) {
      try {
        setComments(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load comments", e);
      }
    }
  }, []);

  // Save to local storage whenever comments change
  useEffect(() => {
    localStorage.setItem('smartLifeComments', JSON.stringify(comments));
  }, [comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newComment: Comment = {
      id: Date.now(),
      text: input,
      date: new Date().toLocaleDateString()
    };

    setComments([newComment, ...comments]);
    setInput('');
  };

  const handleDelete = (id: number) => {
    setComments(comments.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white text-center">
          <WifiOff className="w-12 h-12 mx-auto mb-4 text-purple-200" />
          <h2 className="text-2xl font-bold mb-2">생각해볼 문제</h2>
          <p className="text-purple-100">
            "만약 오늘 하루 인터넷이 완전히 끊긴다면,<br/>나의 하루는 어떻게 변할까요?"
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 bg-gray-50 border-b">
          <label className="block text-sm font-bold text-gray-700 mb-2">나의 의견 남기기</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="친구들과 연락은 어떻게 할까요? 숙제는?"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
              disabled={!input.trim()}
            >
              <Save className="w-4 h-4" /> 저장
            </button>
          </div>
        </form>

        <div className="bg-white min-h-[300px] p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            작성된 의견 ({comments.length})
          </h3>

          {comments.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              아직 작성된 의견이 없어요.<br/>첫 번째 의견을 남겨주세요!
            </div>
          ) : (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li key={comment.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-start group hover:bg-white hover:shadow-md transition-all">
                  <div>
                    <p className="text-gray-800 font-medium leading-relaxed">{comment.text}</p>
                    <span className="text-xs text-gray-400 mt-2 block">{comment.date}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionTab;