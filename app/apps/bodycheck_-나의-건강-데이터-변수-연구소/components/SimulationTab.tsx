import React, { useState, useEffect } from 'react';
import { UserStats } from '../types';
import { ArrowRight, Play, RotateCcw, Monitor } from 'lucide-react';
import { addXP } from '../services/storageService';

interface SimulationTabProps {
  onXpGain: (amount: number) => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ onXpGain }) => {
  const [name, setName] = useState('');
  const [heightStr, setHeightStr] = useState('');
  const [weightStr, setWeightStr] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  
  const [hasRun, setHasRun] = useState(false);

  // Derived values for code visualization
  const heightFloat = parseFloat(heightStr);
  const weightFloat = parseFloat(weightStr);

  const calculateBMI = () => {
    if (!heightStr || !weightStr) return;

    const h = parseFloat(heightStr);
    const w = parseFloat(weightStr);
    
    // Logic: weight / (height/100)^2
    const calculatedBmi = w / Math.pow(h / 100, 2);
    setBmi(calculatedBmi);

    let resultStatus = '';
    let resultHealthy = false;

    if (calculatedBmi < 18.5) {
      resultStatus = '저체중';
      resultHealthy = false;
    } else if (calculatedBmi < 23) {
      resultStatus = '정상';
      resultHealthy = true;
    } else if (calculatedBmi < 25) {
      resultStatus = '과체중';
      resultHealthy = false;
    } else {
      resultStatus = '비만';
      resultHealthy = false;
    }

    setStatus(resultStatus);
    setIsHealthy(resultHealthy);

    if (!hasRun) {
      onXpGain(50); // First run bonus
      setHasRun(true);
    }
  };

  const reset = () => {
    setName('');
    setHeightStr('');
    setWeightStr('');
    setBmi(null);
    setStatus('');
    setIsHealthy(null);
    setHasRun(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Left Panel: Input Form */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg mr-2 text-sm">Input</span>
            데이터 입력
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                이름 <span className="text-xs text-green-600 bg-green-100 px-1 rounded ml-1">str</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 김코딩"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  키 (cm) <span className="text-xs text-orange-600 bg-orange-100 px-1 rounded ml-1">float</span>
                </label>
                <input
                  type="number"
                  value={heightStr}
                  onChange={(e) => setHeightStr(e.target.value)}
                  placeholder="175.5"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  몸무게 (kg) <span className="text-xs text-orange-600 bg-orange-100 px-1 rounded ml-1">float</span>
                </label>
                <input
                  type="number"
                  value={weightStr}
                  onChange={(e) => setWeightStr(e.target.value)}
                  placeholder="68.2"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <button
              onClick={calculateBMI}
              disabled={!name || !heightStr || !weightStr}
              className={`w-full py-3 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all
                ${(!name || !heightStr || !weightStr) 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'}
              `}
            >
              <Play size={20} fill="currentColor" />
              <span>BMI 계산 및 변수 생성</span>
            </button>
          </div>
        </div>

        {/* Experiment Section */}
        {bmi !== null && (
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-slideUp">
             <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-lg text-slate-800">결과 확인</h3>
               <button onClick={reset} className="text-slate-500 hover:text-slate-800 text-sm flex items-center">
                 <RotateCcw size={14} className="mr-1" /> 초기화
               </button>
             </div>
             <div className="flex items-center space-x-4">
               <div className="text-center p-4 bg-slate-50 rounded-xl flex-1">
                 <span className="block text-sm text-slate-500">BMI 지수</span>
                 <span className="text-2xl font-black text-slate-800">{bmi.toFixed(2)}</span>
               </div>
               <ArrowRight className="text-slate-300" />
               <div className="text-center p-4 bg-slate-50 rounded-xl flex-1">
                 <span className="block text-sm text-slate-500">비만도 판정</span>
                 <span className={`text-2xl font-black ${isHealthy ? 'text-emerald-500' : 'text-orange-500'}`}>
                   {status}
                 </span>
               </div>
             </div>
             
             <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                💡 <strong>Tip:</strong> 키/몸무게 입력값은 처음엔 문자열(String)로 들어오지만, 
                계산을 위해 <code>float</code>(실수)로 변환되어 처리됩니다.
             </div>
           </div>
        )}
      </div>

      {/* Right Panel: Code Viewer */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[600px] lg:h-auto">
        <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center text-slate-400 text-sm">
             <Monitor size={14} className="mr-2" />
             <span>data_analysis.py</span>
          </div>
        </div>
        
        <div className="p-6 font-mono text-sm sm:text-base overflow-y-auto custom-scrollbar flex-1 bg-slate-900 text-slate-300">
          <div className="space-y-1">
            <p className="text-slate-500"># 1. 사용자 정보를 변수에 저장합니다.</p>
            <p>
              <span className="text-blue-400">name</span> = 
              <span className="text-green-400"> "{name || '...'}"</span> 
              <span className="text-slate-500 ml-4">// type: str (문자열)</span>
            </p>
            <p>
              <span className="text-blue-400">height</span> = 
              <span className="text-orange-400"> {heightStr ? heightFloat : '...'}</span> 
              <span className="text-slate-500 ml-4">// type: float (실수)</span>
            </p>
            <p>
              <span className="text-blue-400">weight</span> = 
              <span className="text-orange-400"> {weightStr ? weightFloat : '...'}</span> 
              <span className="text-slate-500 ml-4">// type: float (실수)</span>
            </p>

            <br />
            <p className="text-slate-500"># 2. BMI를 계산합니다. (수식 연산)</p>
            <p>
              <span className="text-purple-400">bmi</span> = 
              <span className="text-blue-400"> weight</span> / 
              (<span className="text-blue-400">height</span> / <span className="text-orange-400">100</span>) ** <span className="text-orange-400">2</span>
            </p>
            {bmi !== null && (
              <p className="animate-fadeIn">
                 <span className="text-slate-500"># 결과: </span> 
                 <span className="text-orange-400">{bmi.toFixed(5)}...</span>
                 <span className="text-slate-500 ml-4">// type: float</span>
              </p>
            )}

            <br />
            <p className="text-slate-500"># 3. 비만도를 판정합니다.</p>
            {status ? (
                <>
                <p className="animate-fadeIn">
                    <span className="text-blue-400">status</span> = 
                    <span className="text-green-400"> "{status}"</span>
                    <span className="text-slate-500 ml-4">// type: str</span>
                </p>
                <p className="animate-fadeIn">
                    <span className="text-blue-400">is_healthy</span> = 
                    <span className="text-purple-400"> {isHealthy ? 'True' : 'False'}</span>
                    <span className="text-slate-500 ml-4">// type: bool</span>
                </p>
                </>
            ) : (
                <p className="text-slate-600">...계산 대기 중...</p>
            )}
            
            <br />
            <div className="border-t border-slate-700 pt-4 mt-4">
                <p className="text-slate-500"># 메모리 구조 시각화</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="border border-slate-700 p-2 rounded bg-slate-800">
                        <div className="text-xs text-slate-400">변수명</div>
                        <div className="text-blue-300">name</div>
                    </div>
                    <div className="border border-slate-700 p-2 rounded bg-slate-800">
                        <div className="text-xs text-slate-400">값 (Data)</div>
                        <div className="text-green-400 truncate">"{name}"</div>
                    </div>
                     <div className="border border-slate-700 p-2 rounded bg-slate-800">
                        <div className="text-xs text-slate-400">변수명</div>
                        <div className="text-blue-300">is_healthy</div>
                    </div>
                    <div className="border border-slate-700 p-2 rounded bg-slate-800">
                        <div className="text-xs text-slate-400">값 (Data)</div>
                        <div className="text-purple-400">{isHealthy === null ? 'None' : isHealthy.toString()}</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;
