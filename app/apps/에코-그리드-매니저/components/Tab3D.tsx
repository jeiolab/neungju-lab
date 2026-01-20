import React, { useState } from 'react';
import { Layers } from 'lucide-react';

const Tab3D: React.FC = () => {
  const [activeFloor, setActiveFloor] = useState(0);
  const floors = [0, 1, 2]; // 3 floors

  return (
    <div className="h-full p-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            <Layers className="text-indigo-600" /> 3차원으로 확장하기
          </h2>
          <p className="mt-2 text-indigo-800">
            단일 그리드 <code>map[row][col]</code>은 한 층만 표현할 때 적합합니다. 
            하지만 학교는 여러 층으로 되어 있죠! 여기에 새로운 차원인 <strong>층(Floor)</strong>을 추가해 봅시다.
          </p>
          <div className="mt-4 bg-white p-3 rounded-lg border border-indigo-100 font-mono text-sm text-center text-indigo-600 shadow-sm">
            trashAmount = schoolData[<span className="font-bold text-purple-600">{activeFloor}</span>][row][col]
          </div>
        </div>

        {/* Visual Stack */}
        <div className="relative h-64 w-full flex items-center justify-center perspective-1000">
           {/* Floors */}
           {floors.map((floor, idx) => (
             <div 
                key={floor}
                onClick={() => setActiveFloor(floor)}
                className={`
                    absolute w-48 h-48 border-2 rounded-xl transition-all duration-500 cursor-pointer flex items-center justify-center
                    ${activeFloor === floor 
                        ? 'bg-purple-100 border-purple-500 shadow-xl opacity-100 z-10 scale-105' 
                        : 'bg-white border-gray-300 opacity-60 hover:opacity-80 scale-95'}
                `}
                style={{
                    transform: `translateY(${idx * -40 + 60}px) scale(${1 - idx * 0.05})`,
                    zIndex: floors.length - idx
                }}
             >
                <div className="text-center">
                    <span className="block text-lg font-bold text-gray-700">{floor}층</span>
                    <div className="grid grid-cols-2 gap-1 mt-2 opacity-50">
                        <div className="w-6 h-6 border bg-gray-100"></div>
                        <div className="w-6 h-6 border bg-gray-100"></div>
                        <div className="w-6 h-6 border bg-gray-100"></div>
                        <div className="w-6 h-6 border bg-gray-100"></div>
                    </div>
                </div>
             </div>
           ))}
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
            <p className="text-gray-600 mb-2">선택된 층 인덱스:</p>
            <div className="flex justify-center gap-2">
                {floors.map(f => (
                    <button
                        key={f}
                        onClick={() => setActiveFloor(f)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFloor === f ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {f}층
                    </button>
                ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">
                행(Row)과 열(Column)의 구조는 동일하지만, 층(Floor) 인덱스에 따라 데이터가 어떻게 달라지는지 확인해보세요.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Tab3D;