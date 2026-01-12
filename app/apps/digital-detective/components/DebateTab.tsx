import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

const DebateTab: React.FC = () => {
  const [data, setData] = useState([
    { name: '찬성 (규제 필요)', votes: 120 },
    { name: '반대 (자유 보장)', votes: 85 },
  ]);
  const [hasVoted, setHasVoted] = useState(false);
  const [comments, setComments] = useState<string[]>([
      "익명성은 마녀사냥의 도구로 변질되었다.",
      "표현의 자유를 억압해서는 안 된다.",
      "책임 없는 자유는 방종이다."
  ]);
  const [input, setInput] = useState("");

  const handleVote = (index: number) => {
    if (hasVoted) return;
    const newData = [...data];
    newData[index].votes += 1;
    setData(newData);
    setHasVoted(true);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(input.trim()) {
          setComments(prev => [input, ...prev]);
          setInput("");
      }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">오늘의 토론</h2>
        <p className="text-lg font-medium text-gray-700 mb-6">
          "인터넷 실명제, 다시 도입해야 할까요?"
        </p>

        <div className="h-64 w-full mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="votes" barSize={40} radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {!hasVoted ? (
            <div className="flex gap-4 justify-center">
                <button 
                    onClick={() => handleVote(0)}
                    className="flex-1 bg-blue-50 border border-blue-200 text-blue-700 py-3 rounded-lg hover:bg-blue-100 font-bold flex justify-center items-center gap-2"
                >
                    <ThumbsUp className="w-5 h-5"/> 찬성 (규제 필요)
                </button>
                <button 
                    onClick={() => handleVote(1)}
                    className="flex-1 bg-red-50 border border-red-200 text-red-700 py-3 rounded-lg hover:bg-red-100 font-bold flex justify-center items-center gap-2"
                >
                    <ThumbsDown className="w-5 h-5"/> 반대 (자유 보장)
                </button>
            </div>
        ) : (
            <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-600">
                투표에 참여해주셔서 감사합니다!
            </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-500"/>
              학생들의 의견
          </h3>
          
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-6">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="나의 의견을 짧게 남겨보세요..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700"
              >
                  등록
              </button>
          </form>

          <div className="space-y-3">
              {comments.map((comment, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 text-sm">
                      {comment}
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

export default DebateTab;