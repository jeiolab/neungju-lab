import React, { useState } from 'react';
import { Lock, Cpu, Globe, Hash } from 'lucide-react';

export const DigitalLanguage: React.FC = () => {
  const [text, setText] = useState('HI');
  
  const toBinary = (char: string) => {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="bg-cyber-800 p-6 rounded-xl border border-cyber-700">
        <h2 className="text-2xl font-bold text-cyber-400 mb-4 flex items-center gap-2">
          <Hash /> 기계의 언어 (Digital Language)
        </h2>
        <p className="text-slate-300 leading-relaxed">
          안녕! 선배로서 가장 먼저 알려줄 건, 컴퓨터는 'A', 'B', 'C' 같은 걸 모른다는 거야. 
          컴퓨터는 오직 <b>전압이 높음(1)</b>과 <b>낮음(0)</b>만 이해해. 
          네가 보는 화면의 이미지, 텍스트, 영상 모두 실제로는 0과 1의 거대한 바다일 뿐이지.
        </p>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">아스키(ASCII) 코드 변환기</h3>
        <p className="text-sm text-slate-400 mb-4">짧은 영어 단어를 입력해서 컴퓨터가 어떻게 저장하는지 확인해봐:</p>
        <input 
          type="text" 
          maxLength={5}
          value={text}
          onChange={(e) => setText(e.target.value.toUpperCase())}
          className="bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded mb-4 w-full font-mono tracking-widest uppercase"
        />
        <div className="space-y-2">
          {text.split('').map((char, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-cyber-900 rounded border border-cyber-800/50">
              <span className="font-bold text-2xl text-cyber-accent w-12">{char}</span>
              <span className="font-mono text-slate-400 text-sm">ASCII: {char.charCodeAt(0)}</span>
              <span className="font-mono text-green-400 text-lg tracking-widest">{toBinary(char)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ModernCrypto: React.FC = () => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-cyber-400 flex items-center gap-2">
          <Lock /> XOR에서 AES까지
        </h2>
        <p className="text-slate-300">
          방금 우린 8비트 블록을 가지고 놀았어. 하지만 은행 앱 보안 같은 실제 암호화는 훨씬 더 큰 블록을 사용해.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-cyber-800 p-5 rounded-lg border border-cyber-700">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Cpu size={18} /> DES (데이터 암호화 표준)
            </h3>
            <p className="text-sm text-slate-400">
              옛날 표준이야. <b>64비트 블록</b>과 56비트 키를 썼어. 
              요즘 컴퓨터는 너무 빨라서 모든 키를 다 대입해보면 몇 시간 만에 뚫려버려!
            </p>
          </div>

          <div className="bg-cyber-800 p-5 rounded-lg border border-cyber-700">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Globe size={18} /> AES (고급 암호화 표준)
            </h3>
            <p className="text-sm text-slate-400">
              현재의 표준이야. <b>128비트 블록</b>을 처리해. 
              단순히 XOR만 하는 게 아니라, 비트를 섞고(Shuffle), 열을 섞고, 바이트를 바꿔치기해.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mt-8">왜 블록 암호일까?</h3>
        <ul className="list-disc pl-5 text-slate-300 space-y-2">
          <li>
            <b>효율성:</b> 컴퓨터는 고정된 크기(64비트, 128비트 프로세서)를 처리하는 걸 좋아하거든.
          </li>
          <li>
            <b>쇄도 효과(Avalanche Effect):</b> AES 같은 현대 알고리즘은 입력에서 비트 하나만 바뀌어도 출력의 절반 이상이 완전히 바뀌어버려. 예측할 수 없게 만드는 거지.
          </li>
        </ul>
      </div>
    </div>
  );
};