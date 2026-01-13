import React, { useState } from 'react';
import { BookOpen, Star, RotateCcw } from 'lucide-react';

const LEVEL_TEXT = "학교종이 땡땡땡 어서모이자 선생님이 우리를 기다리신다 학교종이 땡땡땡 어서모이자 사이좋게 오늘도 공부를하자";
const TARGET_WORDS = ["학교종이", "땡땡땡", "어서모이자"];

const PrinciplesTab: React.FC = () => {
  const [dictionary, setDictionary] = useState<string[]>([]);
  const [displayText, setDisplayText] = useState<string>(LEVEL_TEXT);
  const [score, setScore] = useState(0);

  const addToDictionary = (word: string) => {
    if (dictionary.includes(word)) return;
    if (!TARGET_WORDS.includes(word)) {
        alert("이 단어는 반복되지 않아 사전에 등록할 효율이 낮습니다.");
        return;
    }

    const newDict = [...dictionary, word];
    setDictionary(newDict);
    
    // Replace logic
    const index = newDict.length; // 1-based index
    const token = `[사전:${index}]`;
    const newText = displayText.replaceAll(word, token);
    setDisplayText(newText);
    setScore(prev => prev + (word.length * 2));
  };

  const reset = () => {
    setDictionary([]);
    setDisplayText(LEVEL_TEXT);
    setScore(0);
  };

  // Simple word splitter for interaction
  const words = LEVEL_TEXT.split(' ');

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-blue-500 shadow-lg">
        <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <BookOpen size={24} />
          원리 파악: 패턴 사전 만들기
        </h2>
        <p className="text-slate-300 mt-2">
          자주 나오는 단어를 클릭해서 '사전'에 등록해보세요. 긴 단어를 등록할수록 압축률이 높아집니다!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Game Area */}
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-lg min-h-[300px]">
             <div className="flex justify-between items-center mb-4">
                <span className="text-slate-400 text-sm">현재 텍스트 상태:</span>
                <button onClick={reset} className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
                    <RotateCcw size={14} /> 초기화
                </button>
             </div>
             <p className="text-lg leading-loose break-keep font-mono">
                {displayText.split(' ').map((chunk, i) => {
                    const isToken = chunk.startsWith('[사전:');
                    if (isToken) {
                        return <span key={i} className="inline-block bg-blue-900 text-blue-300 px-2 rounded mx-1">{chunk}</span>
                    }
                    // For the original text parts, we need to map them back to clickable words if they haven't been replaced.
                    // This is a simplified view logic.
                    // If the chunk is still raw text, make it interactive if it's a target word.
                    const isTarget = TARGET_WORDS.some(t => chunk.includes(t));
                    
                    return (
                        <span 
                            key={i} 
                            onClick={() => addToDictionary(chunk)}
                            className={`inline-block mx-1 px-1 rounded transition-colors cursor-pointer ${
                                isTarget ? 'hover:bg-green-900/50 hover:text-green-300 border-b border-dashed border-slate-500' : ''
                            }`}
                        >
                            {chunk}
                        </span>
                    );
                })}
             </p>
          </div>
          
          <div className="bg-slate-800 p-4 rounded-lg">
            <h4 className="font-bold text-slate-300 mb-2">힌트: 반복되는 구절을 찾으세요</h4>
            <div className="flex gap-2 flex-wrap">
                {TARGET_WORDS.map(w => (
                    <span key={w} className="bg-slate-700 text-slate-400 text-xs px-2 py-1 rounded">{w}</span>
                ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
            {/* Score & Dictionary Panel */}
            <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">나의 사전</h3>
                    <div className="flex items-center gap-1 text-yellow-400 font-bold">
                        <Star fill="currentColor" size={16}/>
                        <span>{score} XP</span>
                    </div>
                </div>
                
                {dictionary.length === 0 ? (
                    <div className="text-slate-500 text-sm text-center py-8">
                        사전이 비어있습니다.<br/>텍스트에서 단어를 클릭하세요.
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {dictionary.map((word, idx) => (
                            <li key={idx} className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-700">
                                <span className="text-slate-300 font-mono text-sm">{idx + 1}. {word}</span>
                                <span className="text-xs text-green-500">등록됨</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30 text-sm text-blue-200">
                <p>
                    <strong>Lempel-Ziv 알고리즘</strong>은 이렇게 이전에 나온 문자열을 '사전'처럼 참조하여 데이터 길이를 줄입니다. GIF나 ZIP 파일이 이 원리를 사용해요!
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PrinciplesTab;