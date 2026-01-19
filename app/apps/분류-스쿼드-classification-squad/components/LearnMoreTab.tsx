import React from 'react';
import { Brain, HeartPulse, Camera, MessageSquare } from 'lucide-react';

export const LearnMoreTab: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">분류(Classification)는 어디에 쓰일까?</h2>
        <div className="grid md:grid-cols-2 gap-4">
           <UseCaseCard 
              icon={<HeartPulse className="text-red-500" />} 
              title="의료 진단" 
              desc="X-ray 사진을 보고 폐렴(양성)인지 정상(음성)인지 분류합니다." 
           />
           <UseCaseCard 
              icon={<Camera className="text-blue-500" />} 
              title="이미지 인식" 
              desc="자율주행차가 표지판을 보고 '정지', '직진', '유턴' 중 하나로 분류합니다." 
           />
           <UseCaseCard 
              icon={<MessageSquare className="text-green-500" />} 
              title="감정 분석" 
              desc="댓글을 분석해 긍정/부정/중립으로 분류하여 여론을 파악합니다." 
           />
           <UseCaseCard 
              icon={<Brain className="text-purple-500" />} 
              title="질병 예측" 
              desc="유전자 데이터를 분석해 특정 질병 발병 위험군인지 분류합니다." 
           />
        </div>
      </section>

      <section className="bg-gray-900 text-gray-300 p-8 rounded-3xl">
        <h2 className="text-xl font-bold text-white mb-4">📝 미니 용어 사전</h2>
        <div className="space-y-4">
           <div>
             <span className="text-indigo-400 font-bold block mb-1">독립변수 (Independent Variable)</span>
             <p className="text-sm">예측의 재료가 되는 데이터. ($X$) 예: 이메일의 단어, 링크 수</p>
           </div>
           <div className="w-full h-px bg-gray-700" />
           <div>
             <span className="text-pink-400 font-bold block mb-1">종속변수 (Dependent Variable)</span>
             <p className="text-sm">우리가 예측하려는 정답. ($Y$) 예: 스팸 여부</p>
           </div>
           <div className="w-full h-px bg-gray-700" />
           <div>
             <span className="text-yellow-400 font-bold block mb-1">결정 경계 (Decision Boundary)</span>
             <p className="text-sm">데이터를 분류하기 위해 모델이 그은 가상의 선. 이 선을 넘으면 A, 아니면 B로 판단합니다.</p>
           </div>
        </div>
      </section>
    </div>
  );
};

const UseCaseCard: React.FC<{icon: React.ReactNode, title: string, desc: string}> = ({icon, title, desc}) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
     <div className="p-3 bg-gray-50 rounded-xl shrink-0">
        {icon}
     </div>
     <div>
        <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 leading-snug">{desc}</p>
     </div>
  </div>
);