import React, { useState } from 'react';

const DiscussionTab: React.FC = () => {
  const [globalBuff, setGlobalBuff] = useState(0);
  const [instances, setInstances] = useState([
    { id: 1, name: 'Hero A', localBuff: 0 },
    { id: 2, name: 'Hero B', localBuff: 0 },
  ]);

  const toggleGlobalBuff = () => {
    setGlobalBuff(prev => prev === 0 ? 10 : 0);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
       <div className="text-center">
        <h2 className="text-3xl font-bold text-indigo-600">생각해볼 문제 (Thinking Deeper)</h2>
        <p className="text-gray-600 mt-2 text-lg">
           클래스 변수 vs 인스턴스 변수
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">시나리오</h3>
          <p className="text-gray-700 mb-6">
              만약 "블러드 문" 이벤트가 발생해서 <strong>모든</strong> 히어로의 공격력을 올려야 한다면?
              한 명씩 일일이 수정해야 할까요? 아니면 더 좋은 방법이 있을까요?
          </p>

          <div className="grid md:grid-cols-2 gap-8">
              {/* Simulation */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                      <span className="text-purple-600 font-mono">class Hero:</span>
                      <button 
                        onClick={toggleGlobalBuff}
                        className={`px-3 py-1 rounded text-xs font-bold ${globalBuff > 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-200 text-gray-600'}`}
                      >
                        {globalBuff > 0 ? '블러드 문 끄기' : '블러드 문 켜기'}
                      </button>
                  </div>
                  <div className="font-mono text-sm mb-4">
                      <div className="text-gray-500"># 클래스 변수 (모두가 공유)</div>
                      <div className={globalBuff > 0 ? "text-red-600 font-bold" : "text-gray-400"}>
                          global_damage_bonus = {globalBuff}
                      </div>
                  </div>
                  
                  <div className="space-y-2">
                      {instances.map(inst => (
                          <div key={inst.id} className="bg-white p-2 rounded border border-gray-200 flex justify-between items-center">
                              <span className="text-indigo-600">{inst.name}</span>
                              <div className="text-xs">
                                  <span className="text-gray-500">총 데미지: </span>
                                  <span className="text-gray-900 font-bold">{10 + inst.localBuff + globalBuff}</span>
                                  <span className="text-gray-400 ml-1">(10 + {globalBuff})</span>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              {/* Explanation */}
              <div className="space-y-4">
                  <div>
                      <h4 className="font-bold text-purple-600">클래스 변수 (Class Variables)</h4>
                      <p className="text-sm text-gray-700">
                          클래스 내부에 정의하지만 <code className="bg-gray-100 px-1 rounded">__init__</code> 밖에 있습니다.
                          모든 인스턴스가 이 값을 <strong>공유</strong>합니다. 하나를 바꾸면 모두에게 적용됩니다.
                      </p>
                  </div>
                  <div>
                      <h4 className="font-bold text-emerald-600">인스턴스 변수 (Instance Variables)</h4>
                      <p className="text-sm text-gray-700">
                          <code className="bg-gray-100 px-1 rounded">__init__</code> 안에서 <code className="text-indigo-600">self</code>를 사용해 정의합니다.
                          각 객체마다 <strong>고유한</strong> 값을 가집니다.
                      </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200 mt-4">
                      <p className="text-xs text-blue-700 italic">
                          "우주의 법칙(Class)을 바꾸려면 클래스 변수를, 한 사람(Instance)을 바꾸려면 인스턴스 변수를 사용하세요."
                      </p>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default DiscussionTab;