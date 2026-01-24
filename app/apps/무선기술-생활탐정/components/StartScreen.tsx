import React from 'react';
import { Radio, Search } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-indigo-600 p-4 rounded-2xl shadow-lg">
              <Search className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-pink-500 p-2 rounded-xl shadow-md">
              <Radio className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">무선기술 생활탐정</h1>
        <p className="text-slate-500 mb-8">
          상황에 딱 맞는 무선 통신 기술을 찾아라!<br/>
          <span className="text-sm text-indigo-500 font-medium">고1 정보 교과 과정 맞춤</span>
        </p>

        <div className="space-y-4 text-left bg-slate-50 p-4 rounded-xl mb-8 border border-slate-200">
          <h3 className="font-semibold text-slate-700">🕵️ 탐정 규칙</h3>
          <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
            <li>상황 카드를 보고 기술(Wi-Fi 등)을 선택하세요.</li>
            <li>왜 그 기술인지 <strong>이유(거리, 속도 등)</strong>를 체크하세요.</li>
            <li>기술 정답: 70점 / 이유 적중: 최대 30점</li>
          </ul>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-md active:scale-95"
        >
          수사 시작하기
        </button>
      </div>
    </div>
  );
};

export default StartScreen;