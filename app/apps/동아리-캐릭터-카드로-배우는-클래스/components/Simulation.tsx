import React, { useState } from 'react';
import { CharacterInstance } from '../types';
import { PlusCircle, Trash2, Zap, Shield, RotateCcw } from 'lucide-react';

export const Simulation: React.FC = () => {
  const [instances, setInstances] = useState<CharacterInstance[]>([]);
  const [nextId, setNextId] = useState(1);
  const [classTemplate, setClassTemplate] = useState({
    defaultRole: "부원",
    defaultHp: 100
  });

  const addInstance = () => {
    if (instances.length >= 5) return;
    const newInstance: CharacterInstance = {
      id: nextId,
      name: `부원 ${nextId}`,
      role: classTemplate.defaultRole,
      level: 1,
      hp: classTemplate.defaultHp
    };
    setInstances([...instances, newInstance]);
    setNextId(nextId + 1);
  };

  const removeInstance = (id: number) => {
    setInstances(instances.filter(i => i.id !== id));
  };

  const updateInstance = (id: number, field: keyof CharacterInstance, value: any) => {
    setInstances(instances.map(inst => 
      inst.id === id ? { ...inst, [field]: value } : inst
    ));
  };

  const resetAll = () => {
    setInstances([]);
    setNextId(1);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">마이크로 실험실</h2>
        <p className="text-slate-600 text-sm mb-4">
          '동아리 부원(Member)' 클래스(설계도)를 이용해 실제 부원(인스턴스)을 생성해보세요.
          각 부원의 상태를 변경하며 독립성을 확인해보세요.
        </p>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-500 mr-4">
             <span className="font-bold text-slate-700">Class: Member</span>
          </div>
          <button
            onClick={addInstance}
            disabled={instances.length >= 5}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            new Member() ({instances.length}/5)
          </button>
          <button
            onClick={resetAll}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            초기화
          </button>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-[300px] content-start">
          {instances.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl h-64">
               <p className="mb-2">생성된 인스턴스가 없습니다.</p>
               <p className="text-sm">상단 버튼을 눌러 부원을 추가해보세요!</p>
             </div>
          )}
          {instances.map((inst) => (
            <div key={inst.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative group animate-popIn">
              <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                      ID:{inst.id}
                    </div>
                    <div>
                      <input 
                        type="text" 
                        value={inst.name}
                        onChange={(e) => updateInstance(inst.id, 'name', e.target.value)}
                        className="font-bold text-slate-800 w-24 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none text-sm"
                      />
                    </div>
                 </div>
                 <button onClick={() => removeInstance(inst.id)} className="text-slate-400 hover:text-red-500 p-1">
                   <Trash2 className="w-4 h-4" />
                 </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Zap className="w-3 h-3" /> 레벨</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateInstance(inst.id, 'level', Math.max(1, inst.level - 1))}
                      className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                    >-</button>
                    <span className="w-4 text-center text-sm font-bold text-indigo-600">{inst.level}</span>
                    <button 
                      onClick={() => updateInstance(inst.id, 'level', inst.level + 1)}
                      className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
                    >+</button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Shield className="w-3 h-3" /> 체력</span>
                  <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, inst.hp))}%` }}></div>
                  </div>
                </div>
                <div className="flex justify-end gap-1">
                    <button 
                      onClick={() => updateInstance(inst.id, 'hp', Math.max(0, inst.hp - 10))}
                      className="text-[10px] px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                    >피격 (-10)</button>
                     <button 
                      onClick={() => updateInstance(inst.id, 'hp', Math.min(100, inst.hp + 10))}
                      className="text-[10px] px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100"
                    >회복 (+10)</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Section */}
        <div className="mt-6 bg-slate-800 text-slate-200 p-4 rounded-xl text-sm leading-relaxed space-y-2">
            <p>📊 <span className="font-bold text-white">분석 리포트</span></p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
               <li>클래스(설계도)는 1개이지만, 인스턴스(실물)는 현재 <span className="text-yellow-400 font-bold">{instances.length}개</span>입니다.</li>
               <li>
                 {instances.length > 1 
                   ? "각 부원의 레벨이나 체력을 바꿔보세요. 다른 부원에게는 영향을 주지 않죠?" 
                   : "인스턴스를 2개 이상 만들어보세요. 서로 값이 공유되는지 독립적인지 확인할 수 있습니다."}
               </li>
               <li className="text-indigo-300">핵심: 인스턴스는 각자 독립적인 '상태(메모리)'를 가집니다.</li>
            </ul>
        </div>
      </div>
    </div>
  );
};
