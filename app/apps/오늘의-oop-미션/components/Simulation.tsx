import React, { useState } from 'react';
import { Plus, Trash2, Zap } from 'lucide-react';

interface GameEntity {
  id: number;
  name: string;
  hp: number;
  mana: number;
}

const Simulation: React.FC = () => {
  const [instances, setInstances] = useState<GameEntity[]>([
    { id: 1, name: 'Hero_01', hp: 100, mana: 50 },
  ]);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [actionLog, setActionLog] = useState<string[]>([]);

  const createInstance = () => {
    const newId = Date.now();
    const newEntity = {
      id: newId,
      name: `Hero_0${instances.length + 1}`,
      hp: 100,
      mana: 50
    };
    setInstances([...instances, newEntity]);
    setActionLog(prev => [`새 인스턴스 생성됨: ${newEntity.name}`, ...prev]);
  };

  const modifyInstance = (type: 'damage' | 'heal' | 'spell') => {
    setInstances(prev => prev.map(inst => {
      if (inst.id === selectedId) {
        let newLog = '';
        const updated = { ...inst };
        
        switch(type) {
            case 'damage':
                updated.hp = Math.max(0, inst.hp - 20);
                newLog = `${inst.name} 피해 입음 (-20). 현재 HP: ${updated.hp}`;
                break;
            case 'heal':
                updated.hp = Math.min(100, inst.hp + 20);
                newLog = `${inst.name} 회복함 (+20). 현재 HP: ${updated.hp}`;
                break;
            case 'spell':
                if (inst.mana >= 10) {
                    updated.mana -= 10;
                    newLog = `${inst.name} 스킬 사용 (-10 Mana). 현재 Mana: ${updated.mana}`;
                } else {
                    newLog = `${inst.name} 스킬 사용 실패 (마나 부족)!`;
                }
                break;
        }
        setActionLog(prev => [newLog, ...prev]);
        return updated;
      }
      return inst;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">마이크로 실험: 인스턴스 독립성</h2>
        <p className="text-gray-600 mb-6">
          객체(인스턴스)가 서로 다른 메모리를 가진다는 것을 눈으로 확인해보세요. 
          여러 영웅을 생성하고, 한 영웅의 상태를 변경해도 다른 영웅은 영향을 받지 않습니다.
        </p>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">타겟 인스턴스 선택</label>
            <select 
                className="w-full p-2 border rounded bg-white"
                value={selectedId}
                onChange={(e) => setSelectedId(Number(e.target.value))}
            >
                {instances.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name} (HP: {inst.hp})</option>
                ))}
            </select>
          </div>
          <div className="flex items-end space-x-2">
             <button onClick={() => modifyInstance('damage')} className="px-4 py-2 bg-red-100 text-red-700 rounded font-medium hover:bg-red-200 transition">
                피해 (-20 HP)
             </button>
             <button onClick={() => modifyInstance('heal')} className="px-4 py-2 bg-green-100 text-green-700 rounded font-medium hover:bg-green-200 transition">
                회복 (+20 HP)
             </button>
             <button onClick={() => modifyInstance('spell')} className="px-4 py-2 bg-blue-100 text-blue-700 rounded font-medium hover:bg-blue-200 transition">
                마법 (-10 Mana)
             </button>
          </div>
        </div>

        {/* Visualization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {instances.map(inst => (
                <div 
                    key={inst.id} 
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${inst.id === selectedId ? 'border-indigo-500 shadow-md transform scale-105' : 'border-gray-200 bg-gray-50 opacity-80'}`}
                    onClick={() => setSelectedId(inst.id)}
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-700">{inst.name}</span>
                        {inst.id === selectedId && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">선택됨</span>}
                    </div>
                    
                    {/* HP Bar */}
                    <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                            <span>HP</span>
                            <span>{inst.hp}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${inst.hp}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Mana Bar */}
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span>Mana</span>
                            <span>{inst.mana}/50</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${(inst.mana / 50) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Add New */}
            <button 
                onClick={createInstance}
                className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 transition min-h-[140px]"
            >
                <Plus className="w-8 h-8 mb-2" />
                <span className="font-medium">새 인스턴스</span>
            </button>
        </div>
      </div>

      {/* Log */}
      <div className="bg-gray-900 p-4 rounded-xl text-xs font-mono text-green-400 h-32 overflow-y-auto">
         {actionLog.length === 0 ? (
             <span className="text-gray-600 opacity-50">시스템 준비 완료. 대기 중...</span>
         ) : (
            actionLog.map((log, i) => (
                <div key={i} className="mb-1 border-b border-gray-800 pb-1 last:border-0">
                    <span className="text-gray-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                    {log}
                </div>
            ))
         )}
      </div>
    </div>
  );
};

export default Simulation;