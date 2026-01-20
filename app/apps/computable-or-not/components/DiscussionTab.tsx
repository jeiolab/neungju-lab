import React, { useState, useEffect } from 'react';
import { getDiscussionTopic } from '../services/geminiService';
import { MessageSquare, Lightbulb } from 'lucide-react';

export const DiscussionTab: React.FC = () => {
    const [topic, setTopic] = useState<string>("로딩 중...");

    useEffect(() => {
        const loadTopic = async () => {
            const t = await getDiscussionTopic();
            setTopic(t);
        }
        loadTopic();
    }, []);

    return (
        <div className="p-6 space-y-6">
             <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-2 mb-4 opacity-90">
                    <Lightbulb size={20} />
                    <h2 className="font-bold">오늘의 생각해볼 문제</h2>
                </div>
                <p className="text-lg font-medium leading-relaxed">
                    "{topic}"
                </p>
             </div>

             <div className="space-y-4">
                 <h3 className="font-bold text-slate-700 flex items-center">
                    <MessageSquare size={18} className="mr-2"/> 
                    심화 사고력 훈련
                 </h3>
                 
                 <div className="bg-white p-5 rounded-xl border border-slate-200">
                     <h4 className="font-bold text-sm mb-2 text-indigo-600">1. 조건 바꾸기</h4>
                     <p className="text-xs text-slate-600 mb-2">데이터를 더 많이 주면 해결 불가능했던 문제가 가능해질까요?</p>
                     <textarea className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm" placeholder="내 생각 적어보기..." rows={3}></textarea>
                 </div>

                 <div className="bg-white p-5 rounded-xl border border-slate-200">
                     <h4 className="font-bold text-sm mb-2 text-indigo-600">2. 반례 찾기</h4>
                     <p className="text-xs text-slate-600 mb-2">컴퓨터로 해결 가능해 보이지만, 윤리적/물리적 제약 때문에 불가능한 사례는?</p>
                     <textarea className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm" placeholder="내 생각 적어보기..." rows={3}></textarea>
                 </div>
             </div>
        </div>
    );
};
