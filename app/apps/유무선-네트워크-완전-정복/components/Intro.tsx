import React from 'react';
import { ArrowRight, Wifi, Cable } from 'lucide-react';

interface IntroProps {
  onStart: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-10 animate-fade-in">
      <div className="text-center space-y-4 mb-10">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold tracking-wider mb-2">
          고등학교 정보 - 네트워크 기초
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
          학교 컴퓨터실 vs<br />
          카페 노트북
        </h1>
        <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed">
          왜 어떤 곳은 선을 연결하고,<br/>어떤 곳은 비밀번호만 입력할까요?
        </p>
      </div>

      {/* Illustration Cards */}
      <div className="grid grid-cols-2 gap-4 w-full mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
            <Cable className="w-6 h-6 text-slate-600" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-slate-800">학교 컴퓨터실</h3>
            <p className="text-xs text-slate-500 mt-1">뒤엉킨 선들의 정글</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Wifi className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-slate-800">스타벅스</h3>
            <p className="text-xs text-slate-500 mt-1">자유로운 에어팟 감성</p>
          </div>
        </div>
      </div>

      <button
        onClick={onStart}
        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 w-full max-w-xs"
      >
        학습 시작하기
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};