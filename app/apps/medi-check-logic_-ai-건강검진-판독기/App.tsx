import React, { useState, useEffect, useCallback } from 'react';
import { Activity, BookOpen, Brain, Code, PlayCircle, RotateCcw, Award, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { LogicBlock, Patient, SimulationResult, TabType, DiagnosisType, OperatorType, VariableType } from './types';
import { INITIAL_LOGIC_BLOCKS, SAMPLE_PATIENTS_NAMES, getStandardDiagnosis, DIAGNOSIS_COLORS } from './constants';
import LogicBuilder from './components/LogicBuilder';
import ResultsChart from './components/ResultsChart';
import QuizTab from './components/QuizTab';
import { analyzeLogicError, getThinkChallengeHint } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('simulation');
  const [logicBlocks, setLogicBlocks] = useState<LogicBlock[]>(INITIAL_LOGIC_BLOCKS);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [geminiFeedback, setGeminiFeedback] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [thinkHint, setThinkHint] = useState<string>("");
  const [loadingHint, setLoadingHint] = useState(false);

  // Generate new random patients
  const generatePatients = useCallback(() => {
    const newPatients: Patient[] = SAMPLE_PATIENTS_NAMES.map((name, i) => {
      // Skew distributions to ensure a mix of cases
      const systolic = Math.floor(Math.random() * (160 - 100) + 100); 
      const diastolic = Math.floor(Math.random() * (100 - 60) + 60);
      const bloodSugar = Math.floor(Math.random() * (150 - 70) + 70);
      
      return {
        id: `p-${i}`,
        name,
        systolic,
        diastolic,
        bloodSugar,
        trueDiagnosis: getStandardDiagnosis(systolic, diastolic),
      };
    });
    setPatients(newPatients);
    setResults([]);
    setGeminiFeedback(null);
  }, []);

  useEffect(() => {
    generatePatients();
  }, [generatePatients]);

  const runSimulation = async () => {
    setIsSimulating(true);
    setGeminiFeedback(null);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newResults: SimulationResult[] = patients.map(p => {
      let diagnosis = DiagnosisType.NORMAL; // Default (Else)

      // Execute Logic Blocks in order
      for (const block of logicBlocks) {
        let valueToCheck = 0;
        if (block.variable === VariableType.SYSTOLIC) valueToCheck = p.systolic;
        else if (block.variable === VariableType.DIASTOLIC) valueToCheck = p.diastolic;
        else if (block.variable === VariableType.BLOOD_SUGAR) valueToCheck = p.bloodSugar;

        let conditionMet = false;
        if (block.operator === OperatorType.GTE) {
          conditionMet = valueToCheck >= block.value;
        } else if (block.operator === OperatorType.LT) {
          conditionMet = valueToCheck < block.value;
        }

        if (conditionMet) {
          diagnosis = block.result;
          break; // Stop at first match (if-else if behavior)
        }
      }

      return {
        patientId: p.id,
        patientName: p.name,
        inputs: { systolic: p.systolic, diastolic: p.diastolic, bloodSugar: p.bloodSugar },
        userDiagnosis: diagnosis,
        correctDiagnosis: p.trueDiagnosis,
        isCorrect: diagnosis === p.trueDiagnosis,
        message: diagnosis === p.trueDiagnosis ? "정확한 진단입니다." : "오진단 발생!",
      };
    });

    setResults(newResults);
    setIsSimulating(false);

    // Calculate Streak & Feedback
    const allCorrect = newResults.every(r => r.isCorrect);
    if (allCorrect) {
      setStreak(prev => prev + newResults.length);
    } else {
      setStreak(0);
      // Call Gemini for educational feedback
      setGeminiFeedback("AI 분석 중...");
      const failed = newResults.filter(r => !r.isCorrect);
      analyzeLogicError(logicBlocks, failed).then(setGeminiFeedback);
    }
  };

  const handleGetHint = async () => {
      setLoadingHint(true);
      const hint = await getThinkChallengeHint("혈압과 혈당, 두 가지 조건이 모두 위험할 때만 경보를 울리려면 논리 연산자(AND/OR)를 어떻게 사용해야 할까요?");
      setThinkHint(hint);
      setLoadingHint(false);
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <Activity size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Medi-Check Logic</h1>
            <p className="text-xs text-slate-500 font-medium">AI 건강검진 알고리즘 개발실</p>
          </div>
        </div>

        {/* Streak Badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${streak >= 10 ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-300' : 'bg-slate-100 text-slate-500'}`}>
          <Award size={18} className={streak >= 10 ? 'fill-amber-500 text-amber-500' : ''} />
          <span className="font-bold text-sm">연속 성공: {streak}명</span>
          {streak >= 10 && <span className="ml-1 text-xs font-extrabold text-amber-600 animate-pulse">[AI 명의]</span>}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-20 bg-slate-900 flex flex-col items-center py-6 gap-6 shrink-0">
          <TabButton icon={<BookOpen />} label="이론" isActive={activeTab === 'theory'} onClick={() => setActiveTab('theory')} />
          <TabButton icon={<PlayCircle />} label="실습" isActive={activeTab === 'simulation'} onClick={() => setActiveTab('simulation')} />
          <TabButton icon={<Code />} label="퀴즈" isActive={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')} />
          <TabButton icon={<Brain />} label="생각" isActive={activeTab === 'think'} onClick={() => setActiveTab('think')} />
          <TabButton icon={<Info />} label="정보" isActive={activeTab === 'info'} onClick={() => setActiveTab('info')} />
        </nav>

        {/* Dynamic Tab Content */}
        <main className="flex-1 overflow-hidden relative">
          
          {/* Theory Tab */}
          {activeTab === 'theory' && (
            <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto custom-scrollbar">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">📚 다중 선택 구조 (if-elif-else)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-indigo-600 mb-2">IF (만약 ~라면)</h3>
                  <p className="text-slate-600 mb-4">가장 먼저 검사하는 조건입니다. 이 조건이 참(True)이면 아래 조건들은 무시하고 실행을 멈춥니다.</p>
                  <div className="bg-slate-100 p-3 rounded text-sm font-mono text-slate-700">
                    if 수축기 {'>='} 140:<br/>
                    &nbsp;&nbsp;결과 = "위험"
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-indigo-600 mb-2">ELSE IF (아니고 ~라면)</h3>
                  <p className="text-slate-600 mb-4">위의 조건이 거짓(False)일 때만 검사합니다. 여러 개를 연결하여 다양한 범위를 나눌 수 있습니다.</p>
                  <div className="bg-slate-100 p-3 rounded text-sm font-mono text-slate-700">
                    else if 수축기 {'>='} 120:<br/>
                    &nbsp;&nbsp;결과 = "주의"
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-2">
                  <h3 className="text-lg font-bold text-indigo-600 mb-2">순서의 중요성!</h3>
                  <p className="text-slate-600">
                    컴퓨터는 위에서 아래로 코드를 읽습니다. <br/>
                    만약 <strong>"120 이상(주의)"</strong>을 <strong>"140 이상(위험)"</strong>보다 먼저 검사하면 어떻게 될까요?<br/>
                    150인 환자도 "주의" 조건(120 이상)에 걸려버려서 "위험" 진단을 받지 못하게 됩니다. <br/>
                    <span className="text-rose-500 font-bold">따라서 더 좁고 강력한 조건을 먼저 작성해야 합니다!</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Simulation Tab */}
          {activeTab === 'simulation' && (
            <div className="flex h-full p-4 gap-4">
              {/* Left: Logic Builder */}
              <div className="w-1/3 min-w-[350px]">
                <LogicBuilder blocks={logicBlocks} setBlocks={setLogicBlocks} disabled={isSimulating} />
              </div>

              {/* Right: Simulation Area */}
              <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                {/* Visualizer & Controls */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                       🏥 환자 모니터링 & 결과 검증
                    </h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={generatePatients}
                        className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1 transition-colors"
                        disabled={isSimulating}
                      >
                        <RotateCcw size={16} /> 새로운 환자
                      </button>
                      <button 
                        onClick={runSimulation}
                        disabled={isSimulating}
                        className={`px-4 py-1.5 text-sm font-bold text-white rounded-lg shadow-md transition-all flex items-center gap-2 ${isSimulating ? 'bg-slate-400 cursor-wait' : 'bg-teal-500 hover:bg-teal-600 hover:shadow-lg'}`}
                      >
                        <PlayCircle size={18} /> {isSimulating ? '분석 중...' : '시뮬레이션 실행'}
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    {/* Chart Area - Full Width */}
                    <div className="w-full flex flex-col min-h-[320px]">
                      <ResultsChart patients={patients} results={results} />
                    </div>
                    
                    {/* Patient List - Below Chart */}
                    <div className="w-full flex flex-col gap-2 overflow-y-auto custom-scrollbar max-h-[200px]">
                      <h4 className="text-sm font-bold text-slate-700 mb-2">환자 목록</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {patients.map((p, idx) => {
                           const result = results.find(r => r.patientId === p.id);
                           const isDone = !!result;
                           
                           return (
                             <div key={p.id} className={`p-2 rounded-lg border flex items-center justify-between transition-all ${
                               isDone 
                                 ? result.isCorrect 
                                   ? 'bg-emerald-50 border-emerald-200' 
                                   : 'bg-rose-50 border-rose-200'
                                 : 'bg-slate-50 border-slate-200'
                             }`}>
                               <div className="flex-1 min-w-0">
                                 <div className="flex items-center gap-2">
                                   <span className="font-bold text-slate-700 text-sm truncate">{p.name}</span>
                                   {isDone && (
                                     result.isCorrect 
                                      ? <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
                                      : <AlertTriangle size={12} className="text-rose-500 flex-shrink-0" />
                                   )}
                                 </div>
                                 <div className="text-xs text-slate-500 mt-1">
                                   {p.systolic}/{p.diastolic} | {p.bloodSugar}
                                 </div>
                                 {isDone && (
                                   <div className={`text-xs font-bold mt-1 ${result.isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                                     {result.userDiagnosis}
                                   </div>
                                 )}
                               </div>
                             </div>
                           );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Feedback Area */}
                <div className={`bg-white p-4 rounded-xl shadow-sm border transition-all duration-500 overflow-y-auto custom-scrollbar ${geminiFeedback ? 'border-indigo-300 min-h-[150px] max-h-[200px]' : 'border-slate-200 min-h-[60px]'}`}>
                  <h4 className="text-sm font-bold text-indigo-700 flex items-center gap-2 mb-2">
                    <Brain size={16} /> AI 개발 팀장 피드백
                  </h4>
                  {geminiFeedback ? (
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {geminiFeedback}
                    </div>
                  ) : (
                     results.length > 0 && results.every(r => r.isCorrect) ? (
                        <p className="text-sm text-emerald-600 font-medium">완벽합니다! 모든 환자를 올바르게 진단했습니다. 배지를 향해 계속 도전하세요!</p>
                     ) : (
                        <p className="text-sm text-slate-400">시뮬레이션을 실행하면 분석 결과가 여기에 표시됩니다.</p>
                     )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && (
            <div className="h-full overflow-y-auto custom-scrollbar p-6">
              <QuizTab />
            </div>
          )}

           {/* Think Tab */}
           {activeTab === 'think' && (
            <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto custom-scrollbar">
               <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-amber-100 p-3 rounded-full text-amber-600">
                      <Brain size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">🤔 생각해볼 문제</h2>
                  </div>
                  
                  <div className="prose prose-slate max-w-none">
                    <p className="text-lg text-slate-700 mb-6">
                      지금까지는 혈압 하나만 가지고 조건을 만들었습니다. <br/>
                      하지만 실제 건강검진에서는 <strong>"고혈압이면서 동시에 당뇨병인 경우"</strong>를 가장 위험하게 봅니다.
                    </p>
                    
                    <div className="bg-slate-50 border-l-4 border-indigo-500 p-4 mb-6">
                      <h3 className="font-bold text-indigo-900 text-lg mb-2">미션</h3>
                      <p className="text-slate-700">
                        수축기 혈압이 140 이상이고 <strong>(AND)</strong> 혈당이 126 이상일 때만 <br/>
                        <span className="text-rose-600 font-bold">"초고위험군"</span>으로 분류하려면 코드를 어떻게 짜야 할까요?
                      </p>
                    </div>

                    <div className="flex gap-4 items-start">
                        <button 
                            onClick={handleGetHint} 
                            disabled={loadingHint}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                            {loadingHint ? '생각하는 중...' : '💡 AI 힌트 보기'}
                        </button>
                    </div>
                    
                    {thinkHint && (
                        <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100 animate-fade-in text-slate-800">
                            {thinkHint}
                        </div>
                    )}
                  </div>
               </div>
            </div>
          )}

          {/* Info Tab */}
          {activeTab === 'info' && (
            <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto custom-scrollbar">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">🏥 실제 의료 AI는 어떻게 작동할까요?</h2>
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">1. 규칙 기반 (Rule-based) 시스템</h3>
                        <p className="text-slate-600 mb-2">우리가 방금 만든 것과 같습니다. 의사들이 정해놓은 명확한 가이드라인(조건)을 컴퓨터에 입력하여 판단합니다.</p>
                        <p className="text-sm text-slate-500">장점: 결과의 이유를 명확히 설명할 수 있습니다. (설명 가능한 AI)<br/>단점: 규칙이 너무 복잡해지면 관리가 어렵습니다.</p>
                    </div>
                     <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">2. 머신러닝 (Machine Learning)</h3>
                        <p className="text-slate-600 mb-2">수십만 명의 환자 데이터를 컴퓨터에게 학습시켜, 컴퓨터가 스스로 패턴을 찾게 합니다.</p>
                        <p className="text-sm text-slate-500">예시: "이런 혈압 패턴을 가진 사람은 5년 뒤 뇌졸중 확률이 80%다" 같은 예측을 할 수 있습니다.</p>
                    </div>
                </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 w-full px-2 py-2 transition-all relative ${
      isActive ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
    }`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
    {isActive && <div className="absolute right-0 top-0 bottom-0 w-1 bg-teal-400 rounded-l-full" />}
  </button>
);

export default App;
