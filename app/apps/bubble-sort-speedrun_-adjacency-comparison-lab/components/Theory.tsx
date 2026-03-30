import React, { useState } from 'react';
import { HelpCircle, Check, X } from 'lucide-react';

const Theory: React.FC = () => {
  const [oxResults, setOxResults] = useState<{ [key: number]: boolean | null }>({ 1: null, 2: null, 3: null });

  const handleOx = (id: number, answer: boolean) => {
    // Answers: 1=O, 2=O, 3=X
    const correctAnswers: {[key: number]: boolean} = { 1: true, 2: true, 3: false };
    setOxResults(prev => ({ ...prev, [id]: answer === correctAnswers[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Concept Card */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 p-4 text-white">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <HelpCircle size={24} /> 버블 정렬(Bubble Sort)이란?
            </h2>
        </div>
        <div className="p-6 space-y-4">
            <p className="leading-relaxed text-slate-700">
                <strong className="text-indigo-600">인접한 두 자료를 비교</strong>하여 크기 순서대로 되어 있지 않으면 
                서로 <strong className="text-rose-600">교환(Swap)</strong>하는 과정을 반복하여 정렬하는 알고리즘입니다.
            </p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-600">
                <p>1. 물 속의 거품이 수면 위로 올라오는 것처럼, <strong>가장 큰 값이 뒤쪽(오른쪽)으로 이동</strong>합니다.</p>
                <p>2. 1회전(Pass)이 끝날 때마다 가장 큰 값이 맨 뒤에 <strong>확정(Fixed)</strong>됩니다.</p>
            </div>
        </div>
      </section>

      {/* Formula Card */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">🔢 비교 횟수 공식</h3>
            <div className="bg-indigo-50 p-4 rounded-lg text-center mb-4">
                <span className="text-2xl font-mono font-bold text-indigo-700">
                    Sum = n(n-1) / 2
                </span>
            </div>
            <p className="text-sm text-slate-600">
                데이터가 n개일 때:<br/>
                1회전: (n-1)번 비교<br/>
                2회전: (n-2)번 비교<br/>
                ...<br/>
                마지막: 1번 비교<br/>
                <span className="text-slate-400 text-xs mt-2 block">등차수열의 합 공식과 같습니다.</span>
            </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">💡 시간 복잡도</h3>
            <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500">최악의 경우</span>
                <span className="font-mono font-bold text-rose-600">O(n²)</span>
            </div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500">평균적인 경우</span>
                <span className="font-mono font-bold text-amber-600">O(n²)</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-slate-500">최선의 경우*</span>
                <span className="font-mono font-bold text-emerald-600">O(n)</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">* 이미 정렬된 상태에서 '교환 여부'를 체크할 때</p>
        </div>
      </section>

      {/* Mini Quiz */}
      <section className="bg-slate-800 text-white rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-yellow-400">더 알아보기: 왜 느릴까? OX 퀴즈</h3>
        <div className="space-y-4">
            {[
                { id: 1, q: "버블 정렬은 교환 횟수가 많아질수록 느려진다." },
                { id: 2, q: "자료의 개수가 2배가 되면 시간은 약 4배 걸린다." },
                { id: 3, q: "가장 작은 값이 맨 뒤에 있으면 1회전 만에 맨 앞으로 온다." }
            ].map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-slate-700 rounded-lg">
                    <span className="text-sm">{item.id}. {item.q}</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => handleOx(item.id, true)}
                            className={`w-10 h-10 rounded font-bold transition-colors ${oxResults[item.id] === true ? 'bg-emerald-500' : oxResults[item.id] === false ? 'opacity-50' : 'bg-slate-600 hover:bg-slate-500'}`}
                        >O</button>
                        <button 
                            onClick={() => handleOx(item.id, false)}
                            className={`w-10 h-10 rounded font-bold transition-colors ${oxResults[item.id] === true ? 'bg-emerald-500' : oxResults[item.id] === false ? 'bg-rose-500' : 'bg-slate-600 hover:bg-slate-500'}`}
                        >X</button>
                    </div>
                    {oxResults[item.id] !== null && (
                        <div className="text-xs font-bold animate-fade-in">
                            {oxResults[item.id] ? <span className="text-emerald-400">정답!</span> : <span className="text-rose-400">오답</span>}
                        </div>
                    )}
                </div>
            ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">* 3번 해설: 가장 작은 값은 1회전에 한 칸씩만 앞으로 이동합니다. (거북이 데이터 문제)</p>
      </section>
      
      {/* Reflective Question */}
      <section className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-bold text-lg mb-4">🤔 생각해볼 문제</h3>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                    만약 "큰 값"을 뒤로 보내는 게 아니라 "작은 값"을 앞으로 보낸다면 코드를 어떻게 바꿔야 할까요?
                </label>
                <textarea 
                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                    rows={3} 
                    placeholder="예: 비교 방향을 뒤에서부터 하거나..."
                />
            </div>
            <div className="flex items-center gap-2">
                <input type="checkbox" id="self-check" className="w-4 h-4 text-indigo-600 rounded" />
                <label htmlFor="self-check" className="text-sm text-slate-600">내 생각과 시뮬레이션 결과를 비교해보았습니다.</label>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Theory;
