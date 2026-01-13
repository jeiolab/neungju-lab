import React, { useState } from 'react';
import { ArrowRight, AlertTriangle } from 'lucide-react';

export const DeepDiveTab: React.FC = () => {
  const [outputA, setOutputA] = useState<string[]>([]);
  const [outputB, setOutputB] = useState<string[]>([]);

  // Simulation inputs for this experiment
  const score = 85; 

  const runScenarioA = () => {
    // Scenario A: IF - IF (Independent)
    const logs = [];
    if (score >= 80) logs.push("우수상 후보입니다.");
    if (score >= 60) logs.push("합격입니다.");
    // Both are true for 85
    setOutputA(logs);
  };

  const runScenarioB = () => {
    // Scenario B: IF - ELIF (Dependent)
    const logs = [];
    if (score >= 80) {
      logs.push("우수상 후보입니다.");
    } else if (score >= 60) {
      logs.push("합격입니다.");
    }
    // Only first true block runs
    setOutputB(logs);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">실험: if를 여러 번 쓰는 것 vs elif</h2>
        <p className="text-slate-600 mb-6">
          점수가 <span className="font-bold text-indigo-600">{score}점</span>일 때, 두 코드의 결과가 어떻게 다를까요?
          직접 실행 버튼을 눌러보세요.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Case A */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-slate-100 p-3 font-bold text-slate-700 flex justify-between items-center">
              <span>CASE A: if 만 나열</span>
              <button onClick={runScenarioA} className="bg-white text-xs px-2 py-1 rounded border shadow-sm hover:bg-slate-50">실행</button>
            </div>
            <div className="p-4 bg-slate-800 text-white font-mono text-sm space-y-1">
              <p><span className="text-purple-400">if</span> score &ge; 80:</p>
              <p className="pl-4 text-green-300">print("우수상 후보")</p>
              <p><span className="text-purple-400">if</span> score &ge; 60:</p>
              <p className="pl-4 text-green-300">print("합격")</p>
            </div>
            <div className="p-4 bg-orange-50 min-h-[80px]">
              <p className="text-xs font-bold text-slate-400 mb-1">출력 결과:</p>
              {outputA.map((line, i) => (
                <p key={i} className="text-orange-800 font-bold">"{line}"</p>
              ))}
              {outputA.length === 2 && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  <AlertTriangle size={12}/> 두 번 출력됨! (독립 실행)
                </p>
              )}
            </div>
          </div>

          {/* Case B */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-slate-100 p-3 font-bold text-slate-700 flex justify-between items-center">
              <span>CASE B: if - elif 구조</span>
              <button onClick={runScenarioB} className="bg-white text-xs px-2 py-1 rounded border shadow-sm hover:bg-slate-50">실행</button>
            </div>
            <div className="p-4 bg-slate-800 text-white font-mono text-sm space-y-1">
              <p><span className="text-purple-400">if</span> score &ge; 80:</p>
              <p className="pl-4 text-green-300">print("우수상 후보")</p>
              <p><span className="text-purple-400">elif</span> score &ge; 60:</p>
              <p className="pl-4 text-green-300">print("합격")</p>
            </div>
            <div className="p-4 bg-indigo-50 min-h-[80px]">
              <p className="text-xs font-bold text-slate-400 mb-1">출력 결과:</p>
              {outputB.map((line, i) => (
                <p key={i} className="text-indigo-800 font-bold">"{line}"</p>
              ))}
              {outputB.length === 1 && (
                <p className="text-xs text-indigo-500 mt-2 flex items-center gap-1">
                  <ArrowRight size={12}/> 하나만 출력됨 (상호 배타적)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-lg mb-4">💡 용어 사전: 연산자</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded">
            <span className="block font-bold text-indigo-600 mb-1">비교 연산자</span>
            <ul className="text-sm space-y-1 text-slate-700">
              <li><code>==</code> : 같다</li>
              <li><code>!=</code> : 다르다</li>
              <li><code>&gt;, &lt;</code> : 크다, 작다</li>
              <li><code>&ge;, &le;</code> : 이상, 이하 (경계 포함!)</li>
            </ul>
          </div>
          <div className="p-3 bg-slate-50 rounded">
            <span className="block font-bold text-indigo-600 mb-1">논리 연산자</span>
            <ul className="text-sm space-y-1 text-slate-700">
              <li><code>and</code> : 둘 다 참이어야 참</li>
              <li><code>or</code> : 둘 중 하나만 참이어도 참</li>
              <li><code>not</code> : 참/거짓 반대로</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
