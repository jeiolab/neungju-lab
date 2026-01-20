import React, { useState } from 'react';
import { ArrowDown, Check } from 'lucide-react';

const InheritanceTab: React.FC = () => {
  const [selectedSubclass, setSelectedSubclass] = useState<'Warrior' | 'Berserker' | null>(null);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-indigo-400">상속 (Inheritance)</h2>
        <p className="text-slate-400 mt-2">
          코드를 복사/붙여넣기 하지 마세요! 기존 클래스의 기능을 그대로 물려받아 새로운 기능을 추가합니다.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Base Class */}
        <div className="w-64 bg-slate-800 border-2 border-indigo-500 rounded-xl p-4 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">부모 클래스 (Parent)</div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Character (캐릭터)</h3>
            <div className="bg-slate-900 rounded p-2 text-xs font-mono text-slate-300 space-y-1">
                <p>self.hp = 100</p>
                <p>def move(): pass</p>
                <p>def attack(): pass</p>
            </div>
        </div>

        <ArrowDown size={32} className="text-slate-500" />

        <div className="grid grid-cols-2 gap-12">
            {/* Subclass 1 */}
            <div 
                className={`w-64 border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedSubclass === 'Warrior' ? 'bg-slate-700 border-emerald-500 scale-105' : 'bg-slate-800 border-slate-600 hover:border-slate-500'}`}
                onClick={() => setSelectedSubclass('Warrior')}
            >
                <h3 className="text-xl font-bold text-emerald-400 text-center mb-2">Warrior (전사)</h3>
                <div className="text-xs text-center text-slate-400 mb-2">(Character 상속 받음)</div>
                <div className="bg-slate-900 rounded p-2 text-xs font-mono text-slate-300 space-y-1">
                    <p className="text-slate-500"># hp, move, attack 보유</p>
                    <p className="text-emerald-300">def defend(): ...</p>
                    <p className="text-emerald-300">self.armor = 50</p>
                </div>
            </div>

             {/* Subclass 2 */}
             <div 
                className={`w-64 border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedSubclass === 'Berserker' ? 'bg-slate-700 border-red-500 scale-105' : 'bg-slate-800 border-slate-600 hover:border-slate-500'}`}
                onClick={() => setSelectedSubclass('Berserker')}
            >
                <h3 className="text-xl font-bold text-red-400 text-center mb-2">Berserker (광전사)</h3>
                <div className="text-xs text-center text-slate-400 mb-2">(Character 상속 받음)</div>
                <div className="bg-slate-900 rounded p-2 text-xs font-mono text-slate-300 space-y-1">
                    <p className="text-slate-500"># hp, move, attack 보유</p>
                    <p className="text-red-300">def rage(): ...</p>
                    <p className="text-red-300"># attack 메소드 덮어쓰기!</p>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 min-h-[150px] flex items-center justify-center">
         {!selectedSubclass ? (
             <p className="text-slate-500 italic">서브 클래스를 선택하여 코드 구조를 확인하세요.</p>
         ) : (
             <div className="font-mono text-sm w-full max-w-md">
                 <div className="text-purple-400">class <span className="text-yellow-300">{selectedSubclass}</span>(<span className="text-yellow-300">Character</span>):</div>
                 <div className="pl-4">
                     <span className="text-purple-400">def</span> <span className="text-blue-300">__init__</span>(self, name):
                 </div>
                 <div className="pl-8 text-slate-400">
                     super().__init__(name) <span className="text-slate-500"># 부모 초기화 실행</span>
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