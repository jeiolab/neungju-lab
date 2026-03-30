import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Props {
  onStart: (name: string) => void;
}

const WelcomeScreen: React.FC<Props> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-amber-100 p-4 rounded-full">
            <Search className="w-12 h-12 text-amber-600" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2">급식실 탐정</h1>
        <h2 className="text-xl font-medium text-slate-600 mb-6">데이터 수집 대작전</h2>
        
        <p className="text-slate-500 mb-8">
          학교 급식실의 미스터리를 풀 준비가 되셨나요? <br/>
          탐정님의 이름을 알려주세요!
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="탐정 이름 입력"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-lg"
            maxLength={10}
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition transform hover:scale-105 active:scale-95 shadow-lg"
          >
            수사 시작하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeScreen;
