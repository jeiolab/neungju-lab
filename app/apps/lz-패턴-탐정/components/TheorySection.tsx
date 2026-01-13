import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Scissors, Files } from 'lucide-react';

const TheorySection: React.FC = () => {
  const [vote, setVote] = useState<string | null>(null);

  const cards = [
    {
      title: 'LZ 압축이란?',
      icon: <Files className="w-6 h-6 text-blue-500" />,
      content: 'LZ(Lempel-Ziv) 압축은 데이터 안에서 **"반복되는 패턴"**을 찾아, 그것을 **"이전에 나온 위치와 길이"**로 바꿔 적는 방법입니다. 마치 "방금 말한 거 3글자!"라고 줄여 말하는 것과 같아요.',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: '핵심 키워드',
      icon: <Scissors className="w-6 h-6 text-green-500" />,
      content: (
        <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
          <li><strong>거리 (Distance):</strong> 현재 위치에서 얼마나 '뒤'로 가야 패턴이 있나요?</li>
          <li><strong>길이 (Length):</strong> 몇 글자가 똑같은가요?</li>
          <li><strong>토큰 (Token):</strong> &lt;거리, 길이&gt; 쌍으로 치환된 형태</li>
        </ul>
      ),
      color: 'bg-green-50 border-green-200'
    },
    {
      title: '흔한 오해',
      icon: <BookOpen className="w-6 h-6 text-purple-500" />,
      content: '반드시 바로 옆에 붙어 있어야만 압축되는 게 아닙니다! 정해진 범위(윈도우) 안이라면, 꽤 멀리 떨어져 있어도 참조해서 가져올 수 있습니다.',
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">LZ 패턴 탐정 입문</h2>
        <p className="text-slate-600">반복을 찾아내어 데이터를 다이어트 시키는 비밀 요원이 되어보세요.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className={`p-6 rounded-2xl border-2 ${card.color} shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                {card.icon}
              </div>
              <h3 className="font-bold text-lg text-slate-800">{card.title}</h3>
            </div>
            <div className="text-slate-700 leading-relaxed">
              {card.content}
            </div>
          </div>
        ))}
      </div>

      {/* Visual Example */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200">
        <h3 className="text-lg font-bold mb-4 text-slate-800">🔍 시각적 예시</h3>
        <div className="font-mono text-xl md:text-2xl bg-slate-900 text-slate-200 p-6 rounded-xl overflow-x-auto whitespace-nowrap flex items-center space-x-1">
           <span>COCOA </span>
           <span className="relative group cursor-help text-yellow-400 font-bold border-b-2 border-yellow-400">
             COCOA
             <div className="absolute -top-12 left-0 w-max bg-yellow-100 text-yellow-900 text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
               이전 COCOA와 동일!
             </div>
           </span>
           <ArrowLeft className="text-slate-500 mx-2" />
           <span className="text-green-400">&lt;6, 5&gt;</span>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          "COCOA"라는 단어가 6칸 뒤에 다시 5글자 길이로 등장했습니다. 
          따라서 두 번째 "COCOA"는 <strong>&lt;6, 5&gt;</strong>라는 짧은 코드로 바뀝니다.
        </p>
      </div>

      {/* Interactive Poll */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-2xl text-white">
        <h3 className="text-lg font-bold mb-2">🤔 잠깐! 예측해보기</h3>
        <p className="mb-4 text-indigo-100">"1234512345" 와 "1234567890" 중 어느 것이 LZ 압축이 더 잘 될까요?</p>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setVote('A')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${vote === 'A' ? 'bg-white text-indigo-600 border-white' : 'bg-transparent border-white/30 hover:bg-white/10'}`}
          >
            A. 1234512345
          </button>
          <button 
            onClick={() => setVote('B')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${vote === 'B' ? 'bg-white text-indigo-600 border-white' : 'bg-transparent border-white/30 hover:bg-white/10'}`}
          >
            B. 1234567890
          </button>
        </div>
        
        {vote && (
          <div className="mt-4 p-4 bg-black/20 rounded-lg animate-in fade-in">
            {vote === 'A' ? (
              <p>✅ <strong>정답입니다!</strong> "12345"가 그대로 반복되므로 뒷부분을 &lt;5, 5&gt;로 완벽하게 치환할 수 있어요.</p>
            ) : (
              <p>❌ <strong>아쉽네요.</strong> B는 반복되는 부분이 전혀 없어서 LZ 압축 효과가 없습니다. 정답은 A입니다!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TheorySection;