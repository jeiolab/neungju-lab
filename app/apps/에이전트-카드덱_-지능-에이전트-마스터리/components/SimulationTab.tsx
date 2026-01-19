import React, { useState, useEffect } from 'react';

const SimulationTab: React.FC = () => {
  const [complexity, setComplexity] = useState<'low' | 'high'>('low');
  const [mode, setMode] = useState<'rules' | 'learning'>('rules');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ score: number; message: string; sub: string } | null>(null);

  const runSimulation = () => {
    setIsRunning(true);
    setProgress(0);
    setResult(null);
  };

  useEffect(() => {
    if (isRunning) {
      if (progress < 100) {
        const timer = setTimeout(() => setProgress(prev => prev + 5), 50);
        return () => clearTimeout(timer);
      } else {
        setIsRunning(false);
        calculateResult();
      }
    }
  }, [isRunning, progress]);

  const calculateResult = () => {
    if (complexity === 'low' && mode === 'rules') {
      setResult({
        score: 95,
        message: "성공! (안정적)",
        sub: "단순한 환경에서는 미리 정해진 규칙(If-Then)만으로도 충분히 잘 작동합니다."
      });
    } else if (complexity === 'high' && mode === 'rules') {
      setResult({
        score: 30,
        message: "실패! (충돌 발생)",
        sub: "복잡하고 예상치 못한 변수가 많은 환경에서는 규칙만으로 대응하기 어렵습니다. 에러가 발생합니다."
      });
    } else if (complexity === 'low' && mode === 'learning') {
      setResult({
        score: 85,
        message: "성공 (하지만 낭비)",
        sub: "성공했지만, 단순한 일에 복잡한 학습 모델을 쓰는 것은 자원 낭비일 수 있습니다."
      });
    } else { // high + learning
      setResult({
        score: 92,
        message: "성공! (적응 완료)",
        sub: "초기엔 실수가 있었지만, 학습과 추론을 통해 환경 변화에 적응하여 목표를 달성했습니다."
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">지능 에이전트 실험실</h2>
      <p className="text-gray-600 mb-6">환경과 에이전트의 종류를 조합하여 어떤 결과가 나오는지 확인해보세요.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">1. 환경 설정 (복잡도)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setComplexity('low')}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${complexity === 'low' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-500'}`}
              >
                단순한 복도
              </button>
              <button
                onClick={() => setComplexity('high')}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${complexity === 'high' ? 'bg-purple-100 border-purple-500 text-purple-700' : 'border-gray-200 text-gray-500'}`}
              >
                혼잡한 교실
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">2. 에이전트 설정</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMode('rules')}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${mode === 'rules' ? 'bg-orange-100 border-orange-500 text-orange-700' : 'border-gray-200 text-gray-500'}`}
              >
                규칙 기반 (단순)
              </button>
              <button
                onClick={() => setMode('learning')}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${mode === 'learning' ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-200 text-gray-500'}`}
              >
                학습/추론 기반 (지능)
              </button>
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={isRunning}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-md transition-all ${isRunning ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
          >
            {isRunning ? '시뮬레이션 실행 중...' : '결과 확인하기'}
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center border border-gray-100 min-h-[300px]">
          {isRunning ? (
            <div className="w-full max-w-xs space-y-4">
               <div className="text-center text-sm text-gray-500 font-medium">에이전트가 환경을 탐색 중입니다...</div>
               <div className="w-full bg-gray-200 rounded-full h-4">
                 <div className="bg-indigo-500 h-4 rounded-full transition-all duration-75" style={{ width: `${progress}%` }}></div>
               </div>
            </div>
          ) : result ? (
            <div className="text-center animate-in fade-in zoom-in duration-300">
               <div className={`text-5xl font-black mb-2 ${result.score > 80 ? 'text-green-500' : 'text-red-500'}`}>
                 {result.score}점
               </div>
               <h3 className="text-xl font-bold text-gray-800 mb-2">{result.message}</h3>
               <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                 {result.sub}
               </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">🧪</div>
              <p>조건을 선택하고<br/>시뮬레이션을 시작하세요</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;