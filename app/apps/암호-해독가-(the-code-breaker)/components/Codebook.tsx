import React, { useState } from 'react';

export const Codebook: React.FC = () => {
  const [input, setInput] = useState('Code');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">표준 코드북 레퍼런스</h2>
      
      <div className="mb-8">
        <label className="text-slate-700 text-sm font-semibold">테스트 신호</label>
        <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-300 text-slate-800 p-3 mt-1 rounded-lg focus:border-indigo-500 outline-none"
            placeholder="변환할 텍스트를 입력하세요..."
            maxLength={15}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                    <th className="p-4 font-semibold">문자</th>
                    <th className="p-4 font-semibold">ASCII (10진수)</th>
                    <th className="p-4 font-semibold">16진수 (Hex)</th>
                    <th className="p-4 font-semibold">2진수 (8-bit)</th>
                </tr>
            </thead>
            <tbody>
                {input.split('').map((char, i) => {
                    const code = char.charCodeAt(0);
                    return (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 font-mono">
                            <td className="p-4 text-slate-800 text-lg font-bold">'{char}'</td>
                            <td className="p-4 text-blue-600">{code}</td>
                            <td className="p-4 text-yellow-600">0x{code.toString(16).toUpperCase().padStart(2, '0')}</td>
                            <td className="p-4 text-indigo-600">{code.toString(2).padStart(8, '0')}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg text-sm text-slate-700">
        <strong>참고:</strong> 표준 아스키(ASCII)는 7비트(0-127)를 사용하며, 확장 아스키는 8비트(0-255)를 사용합니다. 
        컴퓨터는 보통 문자를 1바이트(8비트)로 저장합니다. 허프만 코딩은 자주 나오는 문자에 더 짧은 비트를 부여하여 이 고정된 크기를 줄이는 기술입니다.
      </div>
    </div>
  );
};