import React, { useState } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

const AdvancedTab: React.FC = () => {
  const [inputA, setInputA] = useState('Apple');
  const [inputB, setInputB] = useState('apple');
  const [listStr, setListStr] = useState('Banana, Apple, Kiwi');

  const listArray = listStr.split(',').map(s => s.trim());
  const isInList = listArray.includes(inputA);
  const isEqual = inputA === inputB;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <h3 className="font-bold text-yellow-800 text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          컴퓨터는 'Apple'과 'apple'을 다르게 봅니다!
        </h3>
        <p className="text-yellow-700 mt-1">
          사용자 입력은 공백, 대소문자 차이로 인해 의도치 않게 <code className="font-mono bg-yellow-100 px-1 rounded">False</code>가 될 수 있습니다.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-4">문자열 비교 실험실</h4>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">입력값 A</label>
            <input 
              type="text" value={inputA} onChange={e => setInputA(e.target.value)}
              className="w-full p-3 border rounded-lg font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-1">입력값 B</label>
            <input 
              type="text" value={inputB} onChange={e => setInputB(e.target.value)}
              className="w-full p-3 border rounded-lg font-mono"
            />
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg font-mono text-center mb-6">
          <div className="text-gray-500 text-xs mb-1">Logic: inputA == inputB</div>
          <div className="text-xl font-bold flex items-center justify-center gap-2">
            '{inputA}' == '{inputB}' 
            <span className="text-gray-400">➜</span> 
            {isEqual ? <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded">True</span> : <span className="text-red-500 bg-red-100 px-2 py-0.5 rounded">False</span>}
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <h4 className="font-bold text-gray-800 mb-4">IN 연산자 실험 (포함 여부)</h4>
        <div className="mb-4">
           <label className="block text-sm font-bold text-gray-500 mb-1">리스트 (쉼표로 구분)</label>
           <input 
              type="text" value={listStr} onChange={e => setListStr(e.target.value)}
              className="w-full p-3 border rounded-lg font-mono"
            />
             <div className="text-xs text-gray-400 mt-1">실제 배열: {JSON.stringify(listArray)}</div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg font-mono text-center">
          <div className="text-gray-500 text-xs mb-1">Logic: inputA in List</div>
          <div className="text-xl font-bold flex items-center justify-center gap-2">
            '{inputA}' in List
            <span className="text-gray-400">➜</span> 
            {isInList ? <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded">True</span> : <span className="text-red-500 bg-red-100 px-2 py-0.5 rounded">False</span>}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
        <h4 className="font-bold text-blue-900 mb-2">해결책: 데이터 정규화 (Normalization)</h4>
        <p className="text-blue-800 text-sm leading-relaxed">
            1. <strong>Trim()</strong>: 앞뒤 공백 제거<br/>
            2. <strong>Lower()</strong>: 모든 문자를 소문자로 변환<br/>
            <br/>
            예시: <code className="bg-white px-1 rounded text-blue-600">input.trim().toLowerCase() == target.trim().toLowerCase()</code>
        </p>
      </div>
    </div>
  );
};

export default AdvancedTab;