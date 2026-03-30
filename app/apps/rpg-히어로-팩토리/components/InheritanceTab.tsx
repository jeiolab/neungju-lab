import React, { useState } from 'react';
import { ArrowDown, Check } from 'lucide-react';

const InheritanceTab: React.FC = () => {
  const [selectedSubclass, setSelectedSubclass] = useState<'Warrior' | 'Berserker' | null>(null);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-indigo-600">상속 (Inheritance)</h2>
        <p className="text-gray-600 mt-2">
          코드를 복사/붙여넣기 하지 마세요! 기존 클래스의 기능을 그대로 물려받아 새로운 기능을 추가합니다.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Base Class */}
        <div className="w-64 bg-white border-2 border-indigo-500 rounded-xl p-4 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">부모 클래스 (Parent)</div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Character (캐릭터)</h3>
            <div className="bg-gray-50 rounded p-2 text-xs font-mono text-gray-700 space-y-1">
                <p>self.hp = 100</p>
                <p>def move(): pass</p>
                <p>def attack(): pass</p>
            </div>
        </div>

        <ArrowDown size={32} className="text-gray-400" />

        <div className="grid grid-cols-2 gap-12">
            {/* Subclass 1 */}
            <div 
                className={`w-64 border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedSubclass === 'Warrior' ? 'bg-indigo-50 border-emerald-500 scale-105' : 'bg-white border-gray-300 hover:border-gray-400'}`}
                onClick={() => setSelectedSubclass('Warrior')}
            >
                <h3 className="text-xl font-bold text-emerald-600 text-center mb-2">Warrior (전사)</h3>
                <div className="text-xs text-center text-gray-500 mb-2">(Character 상속 받음)</div>
                <div className="bg-gray-50 rounded p-2 text-xs font-mono text-gray-700 space-y-1">
                    <p className="text-gray-500"># hp, move, attack 보유</p>
                    <p className="text-emerald-600">def defend(): ...</p>
                    <p className="text-emerald-600">self.armor = 50</p>
                </div>
            </div>

             {/* Subclass 2 */}
             <div 
                className={`w-64 border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedSubclass === 'Berserker' ? 'bg-red-50 border-red-500 scale-105' : 'bg-white border-gray-300 hover:border-gray-400'}`}
                onClick={() => setSelectedSubclass('Berserker')}
            >
                <h3 className="text-xl font-bold text-red-600 text-center mb-2">Berserker (광전사)</h3>
                <div className="text-xs text-center text-gray-500 mb-2">(Character 상속 받음)</div>
                <div className="bg-gray-50 rounded p-2 text-xs font-mono text-gray-700 space-y-1">
                    <p className="text-gray-500"># hp, move, attack 보유</p>
                    <p className="text-red-600">def rage(): ...</p>
                    <p className="text-red-600"># attack 메소드 덮어쓰기!</p>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 min-h-[150px] flex items-center justify-center">
         {!selectedSubclass ? (
             <p className="text-gray-500 italic">서브 클래스를 선택하여 코드 구조를 확인하세요.</p>
         ) : (
             <div className="font-mono text-sm w-full max-w-md">
                 <div className="text-purple-600">class <span className="text-yellow-600">{selectedSubclass}</span>(<span className="text-yellow-600">Character</span>):</div>
                 <div className="pl-4">
                     <span className="text-purple-600">def</span> <span className="text-blue-600">__init__</span>(self, name):
                 </div>
                 <div className="pl-8 text-gray-600">
                     super().__init__(name) <span className="text-gray-500"># 부모 초기화 실행</span>
                 </div>
                 {selectedSubclass === 'Warrior' ? (
                     <div className="pl-8 animate-fade-in">
                         self.armor = 50
                     </div>
                 ) : (
                     <div className="pl-8 animate-fade-in">
                        self.rage_meter = 0
                     </div>
                 )}
             </div>
         )}
      </div>
    </div>
  );
};

export default InheritanceTab;