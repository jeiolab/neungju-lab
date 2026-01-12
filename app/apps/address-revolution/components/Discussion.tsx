import React, { useState } from 'react';
import { SectionTitle } from './SectionTitle';
import { MessageCircle, Lightbulb, Send } from 'lucide-react';

export const Discussion: React.FC = () => {
  const [comment, setComment] = useState('');
  const [submittedComments, setSubmittedComments] = useState<string[]>([
    "모든 전자기기에 IP가 생긴다면 스마트 홈 구축이 훨씬 쉬워질 것 같아요.",
    "IPv6가 보안이 더 강력하다니 안심이 됩니다."
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittedComments([comment, ...submittedComments]);
    setComment('');
  };

  return (
    <section id="discussion" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[2.5rem] p-8 sm:p-16 text-white overflow-hidden relative">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-blue-500 rounded-full blur-[100px] opacity-30"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-30"></div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-blue-200 mb-6 border border-white/10">
              <Lightbulb size={18} />
              <span className="text-sm font-semibold">생각해보기</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
              IoT 시대,<br/>
              왜 이렇게 많은 주소가 필요할까요?
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              냉장고, 시계, 자동차, 심지어 신발까지 인터넷에 연결되는 사물인터넷(IoT) 시대가 오고 있습니다. 
              만약 IPv4(43억 개)를 계속 쓴다면 어떤 문제가 발생할지, IPv6가 우리의 삶을 어떻게 바꿀지 자유롭게 생각해보세요.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col h-full">
            <h3 className="flex items-center gap-2 font-bold text-xl mb-6">
              <MessageCircle size={24} className="text-blue-300" />
              토론 게시판
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-6 max-h-[300px] pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {submittedComments.map((c, idx) => (
                <div key={idx} className="bg-black/20 p-4 rounded-xl animate-fade-in-up">
                  <p className="text-sm text-blue-50">{c}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="relative">
              <input 
                type="text" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="여러분의 생각을 적어보세요..." 
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};