import React from 'react';
import { MessageSquare, PenTool, Share2 } from 'lucide-react';

export const Discussion: React.FC = () => {
  return (
    <div className="grid gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">생각해볼 문제</h2>
        <p className="text-slate-600 text-sm mb-6">정답은 없습니다. 배운 내용을 바탕으로 자유롭게 고민해보세요.</p>

        <div className="space-y-6">
          <DiscussionCard 
            icon={<PenTool className="w-5 h-5 text-blue-500" />}
            title="조건 바꾸기"
            question="만약 '동아리원' 클래스에 '인사하기()' 메서드가 없다면, 100명의 인스턴스가 각각 인사를 하려 할 때 어떤 불편함이 생길까요?"
          />
          <DiscussionCard 
            icon={<Share2 className="w-5 h-5 text-purple-500" />}
            title="반례 찾기"
            question="우리가 배운 '붕어빵 틀' 비유는 클래스를 설명하기 좋지만, 완벽하지 않습니다. 소프트웨어의 클래스와 실제 붕어빵 틀의 결정적인 차이는 무엇일까요?"
          />
           <DiscussionCard 
            icon={<MessageSquare className="w-5 h-5 text-green-500" />}
            title="적용 설계하기"
            question="여러분이 즐겨하는 게임의 캐릭터를 클래스로 만든다면, 어떤 속성(변수)과 메서드(행동)를 정의하겠습니까?"
          />
        </div>
      </div>
    </div>
  );
};

const DiscussionCard: React.FC<{ icon: React.ReactNode, title: string, question: string }> = ({ icon, title, question }) => (
  <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div>
      <h3 className="font-bold text-slate-800 text-sm mb-1">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{question}</p>
      <textarea 
        className="mt-3 w-full text-sm p-3 rounded border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[80px]"
        placeholder="나의 생각을 정리해보세요..."
      ></textarea>
    </div>
  </div>
);
