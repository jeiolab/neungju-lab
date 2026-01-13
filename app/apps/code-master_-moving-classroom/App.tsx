import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, HelpCircle, Layout, Code as CodeIcon, BookOpen, ShieldAlert, CheckCircle, XCircle, Trash2, ArrowDown, Move } from 'lucide-react';
import { TabId, Stage, CodeBlock, BlockType } from './types';
import { STAGES, BLOCKS, QUIZZES } from './constants';
import { getHintFromGemini, getSecurityScenario } from './services/geminiService';
import { SimulationViewer } from './components/SimulationViewer';

// Helper component for Tab Navigation
const NavButton = ({ id, label, icon: Icon, active, onClick }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
      active
        ? 'border-blue-600 text-blue-600 bg-blue-50'
        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
    }`}
  >
    <Icon size={18} />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>(TabId.THEORY);
  const [currentStageId, setCurrentStageId] = useState<number>(1);
  const [workspace, setWorkspace] = useState<CodeBlock[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<'idle' | 'success' | 'fail'>('idle');
  const [failCount, setFailCount] = useState(0);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  
  // Simulation State
  const [simState, setSimState] = useState(STAGES[0].initialState);
  
  // Security Tab State
  const [hackScenario, setHackScenario] = useState("");
  const [hackLoading, setHackLoading] = useState(false);

  const currentStage = STAGES.find(s => s.id === currentStageId) || STAGES[0];

  useEffect(() => {
    // Reset workspace when stage changes
    setWorkspace([]);
    setExecutionResult('idle');
    setFailCount(0);
    setAiHint(null);
    setSimState(currentStage.initialState);
  }, [currentStageId]);

  // Puzzle Logic
  const addToWorkspace = (block: CodeBlock) => {
    if (isRunning) return;
    setWorkspace(prev => [...prev, { ...block, id: `${block.id}-${Date.now()}` }]); // Unique ID for workspace instances
    setExecutionResult('idle');
  };

  const removeFromWorkspace = (index: number) => {
    if (isRunning) return;
    setWorkspace(prev => prev.filter((_, i) => i !== index));
    setExecutionResult('idle');
  };
  
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (isRunning) return;
    const newWorkspace = [...workspace];
    if (direction === 'up' && index > 0) {
      [newWorkspace[index], newWorkspace[index - 1]] = [newWorkspace[index - 1], newWorkspace[index]];
    } else if (direction === 'down' && index < newWorkspace.length - 1) {
      [newWorkspace[index], newWorkspace[index + 1]] = [newWorkspace[index + 1], newWorkspace[index]];
    }
    setWorkspace(newWorkspace);
  };

  const runCode = async () => {
    setIsRunning(true);
    setExecutionResult('idle');
    setAiHint(null);

    // Validate Sequence
    // Extract base IDs (removing timestamp suffix)
    const currentIds = workspace.map(b => b.id.split('-')[0]);
    
    // Check if current sequence matches any valid sequence
    const isValid = currentStage.correctSequenceIds.some(validSeq => {
      if (validSeq.length !== currentIds.length) return false;
      return validSeq.every((id, index) => id === currentIds[index]);
    });

    // Simulate "Processing" time
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isValid) {
      setExecutionResult('success');
      // Update simulation state based on logic
      if (currentStageId === 1) {
         setSimState(prev => ({ ...prev, fanOn: true }));
      } else if (currentStageId === 2) {
         setSimState(prev => ({ ...prev, lightOn: true }));
      }
    } else {
      setExecutionResult('fail');
      setFailCount(prev => prev + 1);
      // Generate hint automatically on 3rd fail
      if (failCount + 1 >= 3) {
        requestHint();
      }
    }
    setIsRunning(false);
  };

  const requestHint = async () => {
    setHintLoading(true);
    const hint = await getHintFromGemini(workspace, currentStage.mission);
    setAiHint(hint);
    setHintLoading(false);
  };
  
  const requestHackScenario = async () => {
    setHackLoading(true);
    const result = await getSecurityScenario("해커가 교실의 온도 센서와 조명 제어권을 탈취했다!");
    setHackScenario(result);
    setHackLoading(false);
  };

  // --- TAB CONTENT RENDERING ---

  const renderTheory = () => (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800">코딩의 기초: 3가지 핵심 구조</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <ArrowDown size={24} />
          </div>
          <h3 className="text-lg font-bold text-center mb-2">순차 (Sequence)</h3>
          <p className="text-slate-600 text-sm text-center">
            명령어가 위에서 아래로 차례대로 실행되는 구조입니다. 요리법처럼 순서가 중요해요!
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <HelpCircle size={24} />
          </div>
          <h3 className="text-lg font-bold text-center mb-2">선택 (Selection)</h3>
          <p className="text-slate-600 text-sm text-center">
            조건에 따라 다른 길로 가는 것입니다. "만약 비가 온다면 우산을 써라" 처럼요.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <RotateCcw size={24} />
          </div>
          <h3 className="text-lg font-bold text-center mb-2">반복 (Repetition)</h3>
          <p className="text-slate-600 text-sm text-center">
            같은 일을 여러 번 계속하는 것입니다. 청소가 끝날 때까지 빗자루질을 반복해라!
          </p>
        </div>
      </div>
      <div className="mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
        <h3 className="font-bold text-yellow-800 mb-2">💡 오늘의 미션</h3>
        <p className="text-yellow-700">
          스마트 교실의 자동화 시스템을 구축해야 합니다. 먼저 <strong>순차</strong>와 <strong>선택</strong> 구조를 사용하여 선풍기와 조명을 제어해보세요.
        </p>
        <button 
          onClick={() => setActiveTab(TabId.PUZZLE)}
          className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-sm"
        >
          미션 시작하기
        </button>
      </div>
    </div>
  );

  const renderPuzzle = () => (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
      {/* Sidebar / Toolbox */}
      <div className="w-full md:w-1/4 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <h3 className="font-bold text-slate-700">부품 상자 (Toolbox)</h3>
          <p className="text-xs text-slate-500 mt-1">블록을 클릭하여 작업 공간에 추가하세요.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {currentStage.availableBlocks.map((block) => (
            <button
              key={block.id}
              onClick={() => addToWorkspace(block)}
              disabled={isRunning}
              className={`w-full text-left px-4 py-3 rounded-lg border-l-4 shadow-sm transition-transform hover:translate-x-1 active:scale-95 text-sm font-medium
                ${block.type === BlockType.START ? 'bg-yellow-100 border-yellow-400 text-yellow-900' : ''}
                ${block.type === BlockType.SENSOR ? 'bg-blue-100 border-blue-400 text-blue-900' : ''}
                ${block.type === BlockType.LOGIC ? 'bg-purple-100 border-purple-400 text-purple-900' : ''}
                ${block.type === BlockType.ACTION ? 'bg-green-100 border-green-400 text-green-900' : ''}
              `}
            >
              {block.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Mission Header */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-lg text-slate-800">{currentStage.title}</h2>
            <p className="text-slate-600 text-sm">{currentStage.mission}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentStageId(1)} 
              className={`px-3 py-1 rounded text-xs ${currentStageId === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}
            >
              1단계
            </button>
            <button 
              onClick={() => setCurrentStageId(2)} 
              className={`px-3 py-1 rounded text-xs ${currentStageId === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}
            >
              2단계
            </button>
          </div>
        </div>

        {/* Coding Area */}
        <div className="flex-1 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 relative flex flex-col overflow-hidden">
           <div className="p-2 bg-slate-200/50 text-xs text-center text-slate-500 font-mono uppercase tracking-widest">
             Workspace / Main.py
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-1">
             {workspace.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 pointer-events-none">
                 <Move size={48} className="mb-2 opacity-20" />
                 <p>블록을 여기로 추가하세요</p>
               </div>
             )}
             
             {workspace.map((block, idx) => (
                <div key={block.id} className="flex items-center group">
                  <div className="flex flex-col gap-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveBlock(idx, 'up')} className="p-1 hover:bg-slate-200 rounded"><ArrowDown className="rotate-180" size={12}/></button>
                    <button onClick={() => moveBlock(idx, 'down')} className="p-1 hover:bg-slate-200 rounded"><ArrowDown size={12}/></button>
                  </div>
                  <div className={`flex-1 relative px-4 py-3 rounded-lg border-l-4 shadow-sm flex justify-between items-center
                    ${block.type === BlockType.START ? 'bg-yellow-100 border-yellow-400 text-yellow-900 rounded-t-xl mt-2' : ''}
                    ${block.type === BlockType.SENSOR ? 'bg-blue-100 border-blue-400 text-blue-900 ml-0' : ''}
                    ${block.type === BlockType.LOGIC ? 'bg-purple-100 border-purple-400 text-purple-900 ml-0' : ''}
                    ${block.type === BlockType.ACTION ? 'bg-green-100 border-green-400 text-green-900 ml-8' : ''} 
                    ${block.type === BlockType.ELSE ? 'bg-purple-100 border-purple-400 text-purple-900 ml-0' : ''}
                  `}>
                    <span className="font-mono text-sm">{block.label}</span>
                    <button onClick={() => removeFromWorkspace(idx)} className="text-slate-400 hover:text-red-500 ml-2">
                      <Trash2 size={16} />
                    </button>
                    
                    {/* Connector visual hint */}
                    {(block.type === BlockType.LOGIC || block.type === BlockType.ELSE) && (
                      <div className="absolute -bottom-3 left-4 w-4 h-4 bg-purple-100 border-l-4 border-purple-400 z-10 clip-path-notch"></div>
                    )}
                  </div>
                </div>
             ))}
           </div>
        </div>

        {/* Action Bar */}
        <div className="h-16 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-between px-6">
           <button 
             onClick={() => setWorkspace([])}
             className="text-slate-500 hover:text-red-500 text-sm flex items-center gap-1"
             disabled={isRunning}
           >
             <RotateCcw size={16} /> 초기화
           </button>

           <div className="flex items-center gap-4">
             {/* Feedback Area */}
             {executionResult === 'success' && (
                <span className="text-green-600 font-bold flex items-center gap-1 animate-bounce">
                  <CheckCircle size={18} /> 성공! 미션 완료!
                </span>
             )}
             {executionResult === 'fail' && (
                <span className="text-red-500 font-bold flex items-center gap-1 animate-shake">
                  <XCircle size={18} /> 오류! 다시 확인해보세요.
                </span>
             )}

             <button 
               onClick={runCode}
               disabled={isRunning || workspace.length === 0}
               className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold shadow-md transition-all
                 ${isRunning ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'}
               `}
             >
               <Play size={20} fill="currentColor" />
               {isRunning ? '실행 중...' : '코드 실행'}
             </button>
           </div>
        </div>
      </div>

      {/* Right Sidebar: Visuals & Hints */}
      <div className="w-full md:w-1/4 flex flex-col gap-4">
         <SimulationViewer 
           stageId={currentStageId}
           isRunning={isRunning}
           fanOn={simState.fanOn ?? false}
           lightOn={simState.lightOn ?? false}
           temperature={simState.temperature ?? 25}
           motion={simState.motion ?? false}
         />

         {/* Hint / AI Console */}
         <div className="flex-1 bg-slate-900 rounded-xl p-4 text-green-400 font-mono text-xs overflow-y-auto shadow-inner border-2 border-slate-700">
           <div className="mb-2 border-b border-slate-700 pb-2 flex justify-between items-center">
             <span>TERMINAL_OUTPUT</span>
             <div className="flex gap-1">
               <div className="w-2 h-2 rounded-full bg-red-500"></div>
               <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
             </div>
           </div>
           
           <div className="space-y-2">
             <p className="opacity-50">{'>'} System initialized.</p>
             <p className="opacity-50">{'>'} Waiting for code input...</p>
             {isRunning && <p className="text-yellow-300">{'>'} Compiling blocks...</p>}
             {executionResult === 'success' && <p className="text-green-300 font-bold">{'>'} Execution Successful!</p>}
             {executionResult === 'fail' && (
               <>
                 <p className="text-red-400">{'>'} Logic Error Detected.</p>
                 {failCount >= 1 && <p className="text-slate-400 mt-2">Tip: 순서가 논리적인지 확인해보세요.</p>}
               </>
             )}
             
             {/* AI Hint Section */}
             {(failCount >= 2 || aiHint) && (
               <div className="mt-4 pt-4 border-t border-slate-700">
                 <button 
                   onClick={requestHint}
                   disabled={hintLoading}
                   className="mb-2 text-blue-300 hover:text-blue-200 underline cursor-pointer"
                 >
                   {hintLoading ? '[AI 튜터에게 물어보는 중...]' : '[AI 튜터 힌트 요청하기]'}
                 </button>
                 {aiHint && (
                   <p className="text-white bg-slate-800 p-2 rounded border-l-2 border-blue-500 animate-fadeIn">
                     AI Tutor: {aiHint}
                   </p>
                 )}
               </div>
             )}
           </div>
         </div>
      </div>
    </div>
  );

  const renderComparison = () => (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">블록 코딩 vs 텍스트 코딩</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Block View */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Layout size={20}/> 블록 코딩 (Blockly/Scratch)</h3>
          <div className="space-y-2 opacity-90 pointer-events-none select-none">
             {[BLOCKS.START, BLOCKS.READ_TEMP, BLOCKS.IF_TEMP_HIGH, BLOCKS.FAN_ON].map((block, i) => (
                <div key={i} className={`px-4 py-2 rounded-lg border-l-4 shadow-sm text-sm font-medium
                  ${block.type === BlockType.START ? 'bg-yellow-100 border-yellow-400 text-yellow-900 rounded-t-xl' : ''}
                  ${block.type === BlockType.SENSOR ? 'bg-blue-100 border-blue-400 text-blue-900 ml-0' : ''}
                  ${block.type === BlockType.LOGIC ? 'bg-purple-100 border-purple-400 text-purple-900 ml-0' : ''}
                  ${block.type === BlockType.ACTION ? 'bg-green-100 border-green-400 text-green-900 ml-8' : ''}
                `}>
                  {block.label}
                </div>
             ))}
          </div>
          <p className="mt-6 text-sm text-slate-500">
            블록 코딩은 레고처럼 조각을 맞추기 때문에 문법 오류(오타)가 발생하지 않아 논리에 집중하기 좋습니다.
          </p>
        </div>

        {/* Python View */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 text-slate-300 font-mono text-sm relative">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-slate-100"><CodeIcon size={20}/> 파이썬 (Python)</h3>
          <div className="space-y-1">
            <p><span className="text-purple-400">def</span> <span className="text-blue-400">main</span>():</p>
            <p className="pl-4">temp = sensor.read_temperature()</p>
            <p className="pl-4"><span className="text-purple-400">if</span> temp {'>'} <span className="text-orange-400">25</span>:</p>
            <p className="pl-8">actuator.fan.on()</p>
            <p className="pl-4"><span className="text-purple-400">else</span>:</p>
            <p className="pl-8">actuator.fan.off()</p>
          </div>
          
          <div className="absolute top-6 right-6 text-xs text-slate-500 border border-slate-600 px-2 py-1 rounded">
             main.py
          </div>

          <p className="mt-8 text-xs text-slate-500 pt-4 border-t border-slate-700">
            실제 현장에서는 파이썬 같은 텍스트 언어를 사용하여 더 복잡하고 정교한 프로그램을 만듭니다. 하지만 기본 논리는 블록 코딩과 똑같습니다!
          </p>
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => (
     <div className="p-6 max-w-2xl mx-auto">
       <h2 className="text-2xl font-bold text-slate-800 mb-6">코딩 지식 체크!</h2>
       <div className="space-y-6">
         {QUIZZES.map((q, idx) => (
           <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="flex items-start gap-3 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">Q{idx+1}</span>
                <p className="font-medium text-lg text-slate-800">{q.question}</p>
             </div>
             
             {q.type === 'choice' && (
               <div className="grid grid-cols-1 gap-2">
                 {q.options?.map((opt, i) => (
                   <button 
                     key={i} 
                     className="text-left px-4 py-3 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                     onClick={(e) => {
                        const btn = e.currentTarget;
                        if (opt === q.answer) {
                          btn.classList.add('bg-green-100', 'border-green-500');
                          btn.innerHTML += ' ✅';
                        } else {
                          btn.classList.add('bg-red-50', 'border-red-300');
                          btn.innerHTML += ' ❌';
                        }
                     }}
                   >
                     {opt}
                   </button>
                 ))}
               </div>
             )}
           </div>
         ))}
       </div>
     </div>
  );

  const renderReflection = () => (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center space-y-6">
         <ShieldAlert size={64} className="mx-auto text-red-500" />
         <h2 className="text-2xl font-bold text-red-800">만약 우리 교실이 해킹당한다면?</h2>
         <p className="text-red-700">
           사물인터넷(IoT) 기술은 편리하지만, 보안이 약하면 위험할 수 있습니다. 
           누군가 교실의 제어권을 가져간다면 어떤 일이 벌어질까요?
         </p>
         
         <div className="flex justify-center">
            <button 
              onClick={requestHackScenario}
              disabled={hackLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold shadow transition-transform hover:scale-105"
            >
              {hackLoading ? '시뮬레이션 생성 중...' : '해킹 시나리오 보기 (AI)'}
            </button>
         </div>

         {hackScenario && (
           <div className="mt-6 bg-white p-6 rounded-lg border border-red-100 text-left animate-fadeIn shadow-inner">
             <h4 className="font-bold text-slate-800 mb-2">🚨 보안 경고 시뮬레이션</h4>
             <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{hackScenario}</p>
             <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
               팁: 비밀번호를 주기적으로 바꾸고, 외부 네트워크 접속을 차단하는 것이 중요합니다.
             </div>
           </div>
         )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
            <CodeIcon size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Code Master</h1>
            <p className="text-xs text-slate-500">움직이는 교실: IoT 코딩 체험</p>
          </div>
        </div>
        
        <div className="text-xs font-mono bg-slate-100 px-3 py-1 rounded text-slate-500 hidden md:block">
           v1.0.0 | React + Gemini
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-2 sm:px-6 flex overflow-x-auto no-scrollbar">
        <NavButton id={TabId.THEORY} label="이론 학습" icon={BookOpen} active={activeTab === TabId.THEORY} onClick={setActiveTab} />
        <NavButton id={TabId.PUZZLE} label="코딩 퍼즐" icon={Layout} active={activeTab === TabId.PUZZLE} onClick={setActiveTab} />
        <NavButton id={TabId.COMPARE} label="코드 비교" icon={CodeIcon} active={activeTab === TabId.COMPARE} onClick={setActiveTab} />
        <NavButton id={TabId.QUIZ} label="퀴즈" icon={HelpCircle} active={activeTab === TabId.QUIZ} onClick={setActiveTab} />
        <NavButton id={TabId.REFLECTION} label="보안 이슈" icon={ShieldAlert} active={activeTab === TabId.REFLECTION} onClick={setActiveTab} />
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50/50">
        {activeTab === TabId.THEORY && renderTheory()}
        {activeTab === TabId.PUZZLE && renderPuzzle()}
        {activeTab === TabId.COMPARE && renderComparison()}
        {activeTab === TabId.QUIZ && renderQuiz()}
        {activeTab === TabId.REFLECTION && renderReflection()}
      </main>
    </div>
  );
};

export default App;
