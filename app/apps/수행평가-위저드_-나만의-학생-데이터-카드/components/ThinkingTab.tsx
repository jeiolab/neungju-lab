import React, { useState } from 'react';
import { Microscope, AlertTriangle } from 'lucide-react';

const ThinkingTab: React.FC = () => {
  const [experiment, setExperiment] = useState({ type: 'int', value: '', result: '', status: 'idle' });

  const runExperiment = () => {
    const { type, value } = experiment;
    let res = "";
    let status = "success"; // success | error | warning

    if (type === 'int') {
      if (value.includes('.')) {
        res = "Error: 정수형(int) 변수에 소수점을 넣으려고 했습니다. (값의 손실 또는 타입 에러)";
        status = "error";
      } else if (value.includes('"')) {
        res = "Error: 따옴표가 있는 값은 문자열입니다. int() 함수로 변환이 필요합니다.";
        status = "error";
      } else {
        res = `Success: 변수에 숫자 ${value}가 완벽하게 저장됩니다.`;
      }
    } else if (type === 'float') {
      if (!value.includes('.')) {
        res = `Warning: ${value} 입력 시 ${value}.0 으로 저장됩니다.`;
        status = "warning";
      } else {
        res = "Success: 실수형 데이터로 저장되었습니다.";
      }
    } else if (type === 'str') {
       if (!value.startsWith('"') && !value.startsWith("'")) {
         res = "Error: 파이썬 코드에서 문자열은 반드시 따옴표가 필요합니다.";
         status = "error";
       } else {
         res = "Success: 문자열이 정상적으로 저장됩니다.";
       }
    }

    setExperiment({ ...experiment, result: res, status });
  };

  return (
    <div className="space-y-8">
      {/* Micro Experiment */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
          <Microscope className="w-5 h-5" /> 마이크로 실험실
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          "만약 정수(int) 변수에 3.5를 넣으면 어떻게 될까?" 직접 실험해보세요.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <select 
            className="p-2 border rounded bg-slate-50"
            value={experiment.type}
            onChange={(e) => setExperiment({...experiment, type: e.target.value, result: '', status: 'idle'})}
          >
            <option value="int">변수 타입: int (정수)</option>
            <option value="float">변수 타입: float (실수)</option>
            <option value="str">변수 타입: str (문자)</option>
          </select>
          <input 
            type="text" 
            placeholder="넣을 값 입력 (예: 3.5, '안녕')" 
            className="flex-1 p-2 border rounded font-mono"
            value={experiment.value}
            onChange={(e) => setExperiment({...experiment, value: e.target.value})}
          />
          <button 
            onClick={runExperiment}
            className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700"
          >
            실험하기
          </button>
        </div>

        {experiment.status !== 'idle' && (
          <div className={`p-4 rounded text-sm font-mono ${
            experiment.status === 'success' ? 'bg-green-100 text-green-800' :
            experiment.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {experiment.result}
          </div>
        )}
      </section>

      {/* Scenarios */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
          <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> 반례 찾기
          </h4>
          <p className="text-sm text-orange-800 mb-3 font-medium">Q. 다음 코드가 오류가 나는 이유는?</p>
          <div className="bg-white p-3 rounded border border-orange-200 font-mono text-xs text-slate-600 mb-3">
            my_club = 로봇동아리<br/>
            print(my_club)
          </div>
          <details className="text-sm text-slate-600 cursor-pointer">
            <summary className="font-bold hover:text-indigo-600">정답 보기</summary>
            <p className="mt-2 pl-2 border-l-2 border-slate-300">
              '로봇동아리' 양쪽에 따옴표(" ")가 없습니다. 파이썬은 따옴표가 없으면 변수 이름으로 착각합니다.
            </p>
          </details>
        </div>

        <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
          <h4 className="font-bold text-purple-900 mb-2">🤔 생각해보기</h4>
          <p className="text-sm text-purple-800 mb-3 font-medium">Q. 전화번호(01012345678)는 어떤 자료형이 좋을까?</p>
          <details className="text-sm text-slate-600 cursor-pointer">
            <summary className="font-bold hover:text-indigo-600">힌트 보기</summary>
            <p className="mt-2 pl-2 border-l-2 border-slate-300">
              숫자로 보이지만, 맨 앞의 '0'이 사라지면 안 되고, 더하기/빼기 계산을 할 일이 없습니다. 그렇다면...? (정답: str)
            </p>
          </details>
        </div>
      </section>
    </div>
  );
};

export default ThinkingTab;