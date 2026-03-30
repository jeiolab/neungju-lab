import React from 'react';
import { Scroll, Sword } from 'lucide-react';

interface HistoryProps {
  onComplete: () => void;
}

const History: React.FC<HistoryProps> = ({ onComplete }) => {
  return (
    <div className="space-y-6">
       <div className="bg-amber-900 text-amber-50 p-6 rounded-2xl shadow-lg border-b-4 border-amber-700">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Scroll /> 역사 속의 암호
        </h2>
        <p className="opacity-90">
          암호는 컴퓨터가 발명되기 수천 년 전부터 전쟁과 외교에서 사용되었어.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Scytale */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
          <div className="h-40 bg-slate-200 flex items-center justify-center relative">
             <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{backgroundImage: 'url(https://picsum.photos/400/300?grayscale)'}}></div>
             <span className="relative z-10 bg-black/50 text-white px-4 py-1 rounded-full font-bold">BC 400년경</span>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Sword size={20} /> 스파르타의 스키테일
            </h3>
            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
              가죽 끈을 특정 굵기의 막대봉(스키테일)에 감아서 글을 쓰고, 
              풀어서 보내면 아무도 못 읽어. 받는 사람도 <strong>똑같은 굵기의 막대봉(키)</strong>이 있어야만 읽을 수 있었지.
            </p>
            <div className="bg-amber-50 p-3 rounded text-xs text-amber-800 font-medium">
              💡 원리: 글자의 순서를 바꾸는 '전치 암호'
            </div>
          </div>
        </div>

        {/* Caesar */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
          <div className="h-40 bg-slate-200 flex items-center justify-center relative">
             <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{backgroundImage: 'url(https://picsum.photos/401/300?grayscale)'}}></div>
             <span className="relative z-10 bg-black/50 text-white px-4 py-1 rounded-full font-bold">BC 50년경</span>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Sword size={20} /> 카이사르(시저) 암호
            </h3>
            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
              로마의 황제 카이사르는 가족들과 비밀 편지를 주고받을 때 알파벳을 3칸씩 밀어서 썼대.
              A를 D로, B를 E로 바꾸는 식이지. 우리가 방금 시뮬레이터에서 해본 게 바로 이거야!
            </p>
            <div className="bg-indigo-50 p-3 rounded text-xs text-indigo-800 font-medium">
              💡 원리: 글자를 다른 글자로 바꾸는 '치환 암호'
            </div>
          </div>
        </div>
      </div>

       <div className="flex justify-center mt-8">
        <button
          onClick={onComplete}
          className="bg-amber-700 hover:bg-amber-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105"
        >
          역사 공부 완료! 퀴즈 풀러 가자 🏹
        </button>
      </div>
    </div>
  );
};

export default History;