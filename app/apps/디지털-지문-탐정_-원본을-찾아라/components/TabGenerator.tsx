import React, { useState, useEffect } from 'react';
import { computeHash } from '../utils/crypto';
import { ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

const TabGenerator: React.FC = () => {
  const [inputA, setInputA] = useState('Hello World');
  const [inputB, setInputB] = useState('Hello World.');
  const [hashA, setHashA] = useState('');
  const [hashB, setHashB] = useState('');

  useEffect(() => {
    computeHash(inputA).then(setHashA);
  }, [inputA]);

  useEffect(() => {
    computeHash(inputB).then(setHashB);
  }, [inputB]);

  // Determine difference characters
  const renderHashDiff = (hash: string, otherHash: string) => {
    if (!otherHash) return <span className="font-mono text-sm break-all">{hash}</span>;

    const chars = hash.split('');
    const otherChars = otherHash.split('');

    return (
      <div className="font-mono text-sm break-all leading-6">
        {chars.map((char, index) => {
          const isMatch = otherChars[index] === char;
          return (
            <span
              key={index}
              className={`${
                isMatch ? 'text-slate-400' : 'text-red-600 font-bold bg-red-50'
              }`}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  const isIdentical = hashA === hashB;

  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">해시 생성 & 쇄도 효과 체험</h2>
        <p className="text-slate-600 mt-2">
          두 텍스트를 비교해보세요. 점 하나만 달라도 해시값은 완전히 달라집니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input A */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">원본 데이터 (Input A)</label>
          <textarea
            value={inputA}
            onChange={(e) => setInputA(e.target.value)}
            className="w-full h-32 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans resize-none transition-all"
            placeholder="Type something..."
          />
          <div className="mt-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">SHA-256 Hash Output</div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 min-h-[3rem] shadow-inner">
               {renderHashDiff(hashA, hashB)}
            </div>
          </div>
        </div>

        {/* Input B */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2">비교 데이터 (Input B)</label>
          <textarea
            value={inputB}
            onChange={(e) => setInputB(e.target.value)}
            className="w-full h-32 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans resize-none transition-all"
            placeholder="Type something..."
          />
          <div className="mt-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">SHA-256 Hash Output</div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 min-h-[3rem] shadow-inner">
              {renderHashDiff(hashB, hashA)}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Result */}
      <div className={`p-4 rounded-xl flex items-center justify-center space-x-3 transition-colors duration-500 ${isIdentical ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isIdentical ? (
          <>
            <CheckCircle2 size={24} />
            <span className="font-bold text-lg">완벽하게 일치합니다!</span>
          </>
        ) : (
          <>
            <AlertTriangle size={24} />
            <span className="font-bold text-lg">데이터가 다릅니다! (쇄도 효과 발생)</span>
          </>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
        <strong>관전 포인트:</strong> 위 텍스트 박스에서 <code>.</code> (마침표) 하나를 지우거나 추가해보세요. 
        해시값 전체가 붉은색으로 변하며 완전히 다른 값으로 바뀌는 것을 볼 수 있습니다. 
        이것이 바로 <strong>쇄도 효과(Avalanche Effect)</strong>입니다.
      </div>
    </div>
  );
};

export default TabGenerator;