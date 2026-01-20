import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

const Simulation: React.FC = () => {
  const [data, setData] = useState<number[]>([]);
  const [isSorted, setIsSorted] = useState(false);
  const [target, setTarget] = useState<number>(0);
  const [searchSteps, setSearchSteps] = useState<number[]>([]);
  const [searchResult, setSearchResult] = useState<'FOUND' | 'NOT_FOUND' | null>(null);
  const [message, setMessage] = useState('');

  const generateData = () => {
    const newData = Array.from({ length: 10 }, () => Math.floor(Math.random() * 99) + 1);
    setData(newData);
    setIsSorted(false);
    setTarget(newData[Math.floor(Math.random() * newData.length)]); // Ensure target exists mostly
    setSearchSteps([]);
    setSearchResult(null);
    setMessage('데이터가 무작위로 생성되었습니다.');
  };

  useEffect(() => {
    generateData();
  }, []);

  const toggleSort = () => {
    if (isSorted) {
      // Shuffle
      setData([...data].sort(() => Math.random() - 0.5));
      setIsSorted(false);
      setMessage('데이터 순서를 섞었습니다.');
    } else {
      setData([...data].sort((a, b) => a - b));
      setIsSorted(true);
      setMessage('데이터를 오름차순 정렬했습니다.');
    }
    setSearchSteps([]);
    setSearchResult(null);
  };

  const runLinearSearch = async () => {
    setSearchSteps([]);
    setSearchResult(null);
    setMessage('순차 탐색(Linear Search) 시작...');
    
    let found = false;
    for (let i = 0; i < data.length; i++) {
      await new Promise(r => setTimeout(r, 300)); // Animation delay
      setSearchSteps(prev => [...prev, i]);
      if (data[i] === target) {
        setSearchResult('FOUND');
        setMessage(`순차 탐색: ${i + 1}번 만에 찾았습니다! (데이터 상태 무관)`);
        found = true;
        break;
      }
    }
    if (!found) {
        setSearchResult('NOT_FOUND');
        setMessage('값을 찾지 못했습니다.');
    }
  };

  const runBinarySearch = async () => {
    if (!isSorted) {
      setMessage('❌ 이진 탐색 불가능! 데이터가 정렬되어 있지 않습니다.');
      setSearchResult('NOT_FOUND');
      return;
    }

    setSearchSteps([]);
    setSearchResult(null);
    setMessage('이진 탐색(Binary Search) 시작...');

    let low = 0;
    let high = data.length - 1;
    let found = false;

    while (low <= high) {
      await new Promise(r => setTimeout(r, 600)); // Slower animation for binary
      const mid = Math.floor((low + high) / 2);
      setSearchSteps(prev => [...prev, mid]);

      if (data[mid] === target) {
        setSearchResult('FOUND');
        setMessage(`이진 탐색: ${Math.floor(Math.log2(data.length)) + 1}번 이내로 찾았습니다! (매우 빠름)`);
        found = true;
        break;
      } else if (data[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    if (!found) {
        setSearchResult('NOT_FOUND');
        setMessage('값을 찾지 못했습니다.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto border border-indigo-100">
      <h3 className="text-lg font-bold text-indigo-800 mb-4 flex items-center">
        <RefreshCw className="w-5 h-5 mr-2" /> 마이크로 실험실: 정렬 스위치
      </h3>
      
      <div className="flex justify-between items-center mb-6 bg-slate-100 p-4 rounded-lg">
        <div className="text-sm font-medium">찾는 값: <span className="text-red-600 text-xl font-bold">{target}</span></div>
        <button 
          onClick={generateData}
          className="text-xs bg-slate-300 hover:bg-slate-400 px-3 py-1 rounded transition"
        >
          새 데이터
        </button>
      </div>

      {/* Visualizer */}
      <div className="flex justify-center space-x-2 mb-8 h-24 items-end">
        {data.map((val, idx) => {
          const isActive = searchSteps.includes(idx);
          const isTarget = val === target;
          let barColor = isSorted ? 'bg-blue-400' : 'bg-orange-400';
          if (isActive) barColor = 'bg-yellow-400 ring-2 ring-yellow-600';
          if (isActive && isTarget) barColor = 'bg-green-500 ring-4 ring-green-300';

          return (
            <div key={idx} className="flex flex-col items-center w-8 transition-all duration-300">
              <span className="text-xs mb-1 text-slate-500">{idx}</span>
              <div 
                className={`w-full rounded-t-md flex items-end justify-center text-white font-bold text-xs ${barColor} transition-all duration-300`}
                style={{ height: `${val * 1.5}px`, minHeight: '24px' }}
              >
                {val}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
        <button
          onClick={toggleSort}
          className={`px-4 py-2 rounded-lg font-bold shadow-sm transition-colors w-full md:w-auto ${
            isSorted ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          {isSorted ? '정렬 해제 (Shuffle)' : '정렬 하기 (Sort)'}
        </button>

        <div className="h-8 w-px bg-slate-300 hidden md:block"></div>

        <button
          onClick={runLinearSearch}
          className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 w-full md:w-auto"
        >
          순차 탐색 시도
        </button>
        <button
          onClick={runBinarySearch}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md w-full md:w-auto flex items-center justify-center gap-2"
        >
          이진 탐색 시도 {isSorted ? <CheckCircle size={16}/> : <XCircle size={16}/>}
        </button>
      </div>

      <div className={`p-4 rounded-lg text-center font-medium min-h-[60px] flex items-center justify-center ${
        searchResult === 'FOUND' ? 'bg-green-100 text-green-800' : 
        searchResult === 'NOT_FOUND' ? 'bg-red-100 text-red-800' : 
        'bg-slate-50 text-slate-600'
      }`}>
        {message}
      </div>
    </div>
  );
};

export default Simulation;