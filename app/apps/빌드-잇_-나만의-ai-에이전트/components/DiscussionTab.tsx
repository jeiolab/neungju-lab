import React from 'react';
import { MessageCircle, Heart, ShieldAlert } from 'lucide-react';

export const DiscussionTab: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-3xl text-white shadow-xl text-center">
        <Heart className="w-16 h-16 mx-auto mb-4 text-pink-300 animate-pulse" />
        <h2 className="text-3xl font-bold mb-4">오늘의 토론 주제</h2>
        <p className="text-xl font-medium opacity-90">
          "로봇 고양이가 실제 고양이를 대체할 수 있을까요?"
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
          <ShieldAlert className="w-5 h-5 mr-2 text-orange-500" /> 생각해 볼 문제들
        </h3>
        
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold">A</div>
            <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none">
              <p className="text-slate-800 font-medium mb-1">감정적 교감</p>
              <p className="text-slate-600 text-sm">
                로봇은 털 알레르기도 없고, 밥을 주지 않아도 죽지 않습니다. 하지만 로봇이 꼬리를 흔들 때, 그것은 정말로 기뻐서일까요, 아니면 프로그램된 코드일까요? 가짜 감정도 우리에게 위로가 될까요?
              </p>
            </div>
          </div>

          <div className="flex gap-4 flex-row-reverse">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600 font-bold">B</div>
            <div className="bg-slate-50 p-4 rounded-2xl rounded-tr-none text-right">
              <p className="text-slate-800 font-medium mb-1">책임감</p>
              <p className="text-slate-600 text-sm">
                생명을 키우는 것은 책임감을 배우는 과정이기도 합니다. 고장이 나면 수리하거나 버릴 수 있는 로봇 반려동물을 통해 우리는 생명의 소중함을 배울 수 있을까요?
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm mb-4">친구들과 이야기해보고, 나만의 결론을 내려보세요.</p>
          <div className="inline-flex gap-4">
             <button className="px-6 py-2 rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium transition-colors">
               대체할 수 있다 (기술 긍정)
             </button>
             <button className="px-6 py-2 rounded-full border border-pink-200 text-pink-600 hover:bg-pink-50 font-medium transition-colors">
               대체할 수 없다 (생명 존중)
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};