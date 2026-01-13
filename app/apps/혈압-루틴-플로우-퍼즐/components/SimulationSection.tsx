import React, { useState, useEffect } from 'react';
import { Activity, Play, RotateCcw, Heart, AlertCircle, CheckCircle } from 'lucide-react';

interface SimulationSectionProps {
  levelId: number;
}

const SimulationSection: React.FC<SimulationSectionProps> = ({ levelId }) => {
  const [systolic, setSystolic] = useState<number>(120);
  const [diastolic, setDiastolic] = useState<number>(80);
  const [outputLog, setOutputLog] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');

  const addLog = (msg: string) => setOutputLog(prev => [...prev, msg]);

  const runSimulation = async () => {
    setIsRunning(true);
    setOutputLog([]);
    setCurrentStep('start');
    
    // Step 1: Start
    addLog("🔵 프로그램 시작");
    await wait(800);

    // Step 2: Input
    setCurrentStep('input');
    addLog(`📥 입력 받음: 수축기 ${systolic} / 이완기 ${diastolic}`);
    await wait(800);

    if (levelId === 1) {
      // Linear
      setCurrentStep('process');
      addLog(`🖨️ 결과 출력: ${systolic}/${diastolic}`);
    } else if (levelId === 2) {
      // Branching
      setCurrentStep('condition');
      addLog("❓ 조건 검사: 수축기 >= 140?");
      await wait(800);
      
      if (systolic >= 140) {
        addLog("👉 결과: 참(True)");
        setCurrentStep('branch_true');
        await wait(600);
        addLog("⚠️ [주의] 고혈압 의심! 관리 필요.");
      } else {
        addLog("👉 결과: 거짓(False)");
        setCurrentStep('branch_false');
        await wait(600);
        addLog("✅ [정상] 혈압이 정상 범위입니다.");
      }
    } else if (levelId === 3) {
      // Loop Simulation
      setCurrentStep('condition');
      addLog("❓ 조건 검사: 수축기 >= 140?");
      await wait(800);

      let currentSys = systolic;
      let loops = 0;

      while (currentSys >= 140 && loops < 2) {
        addLog("👉 결과: 참(True) - 수치가 높습니다.");
        setCurrentStep('process_loop');
        addLog("⏳ 10분 안정 취하는 중...");
        await wait(1000);
        
        loops++;
        // Simulate drop
        currentSys = Math.max(120, currentSys - 20); 
        addLog(`🔄 재측정 시도 (${loops}회차)...`);
        addLog(`📥 새로운 측정값: ${currentSys} / ${diastolic}`);
        
        setCurrentStep('condition');
        await wait(800);
      }

      if (currentSys >= 140) {
         addLog("🚫 여전히 높습니다. 의사와 상담하세요.");
      } else {
         addLog("✅ 안정 후 정상 수치로 돌아왔습니다.");
         setCurrentStep('process_end');
         addLog("📝 정상 기록 저장 완료.");
      }
    }

    await wait(800);
    setCurrentStep('end');
    addLog("🔴 프로그램 종료");
    setIsRunning(false);
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mt-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Activity className="text-rose-500" />
        로직 시뮬레이터
      </h3>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-sm font-medium text-slate-600 mb-2">
              수축기 혈압 (Systolic) 설정
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="90" 
                max="180" 
                value={systolic} 
                onChange={(e) => setSystolic(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <span className={`text-xl font-bold font-mono w-16 text-center ${systolic >= 140 ? 'text-red-500' : 'text-blue-500'}`}>
                {systolic}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              * 140 이상이면 고혈압 로직이 작동하는지 테스트해보세요.
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={isRunning}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2
              ${isRunning ? 'bg-slate-400 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600 active:scale-95'}
            `}
          >
            {isRunning ? (
              <>
                <RotateCcw className="animate-spin" /> 실행 중...
              </>
            ) : (
              <>
                <Play fill="currentColor" /> 시뮬레이션 실행
              </>
            )}
          </button>
        </div>

        {/* Console Output */}
        <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-green-400 h-64 overflow-y-auto shadow-inner border border-slate-700">
          <div className="flex items-center gap-2 border-b border-slate-700 pb-2 mb-2 text-slate-400 text-xs">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Simulation Console</span>
          </div>
          {outputLog.length === 0 ? (
            <p className="text-slate-600 italic">"시뮬레이션 실행" 버튼을 눌러 결과를 확인하세요.</p>
          ) : (
            <ul className="space-y-2">
              {outputLog.map((log, idx) => (
                <li key={idx} className="animate-fade-in flex items-start gap-2">
                  <span className="opacity-50 select-none">{`>`}</span>
                  {log}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationSection;