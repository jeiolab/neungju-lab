import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Plus, Trash2, Code, BookOpen, Brain, MessageSquare, ChevronRight, CheckCircle, AlertCircle, Award, Bot } from 'lucide-react';
import { LEVELS, QUIZZES, XP_TITLES } from './constants';
import { CellType, CommandType, Direction, GameStatus, LogEntry, RobotState } from './types';
import GridBoard from './components/GridBoard';
import { askGeminiCoach } from './services/geminiService';

// --- Helper Functions ---

const rotateLeft = (dir: Direction): Direction => {
  const order = [Direction.NORTH, Direction.WEST, Direction.SOUTH, Direction.EAST];
  return order[(order.indexOf(dir) + 1) % 4];
};

const rotateRight = (dir: Direction): Direction => {
  const order = [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST];
  return order[(order.indexOf(dir) + 1) % 4];
};

const getNextPosition = (x: number, y: number, dir: Direction): { x: number, y: number } => {
  switch (dir) {
    case Direction.NORTH: return { x, y: y - 1 };
    case Direction.EAST: return { x: x + 1, y };
    case Direction.SOUTH: return { x, y: y + 1 };
    case Direction.WEST: return { x: x - 1, y };
  }
};

const App: React.FC = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState(0); // 0: Sim, 1: Theory, 2: Quiz, 3: Think
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [userXP, setUserXP] = useState(0);
  
  // Simulation State
  const [commands, setCommands] = useState<CommandType[]>([]);
  const [grid, setGrid] = useState<number[][]>(LEVELS[0].grid);
  const [robot, setRobot] = useState<RobotState>(LEVELS[0].startPos);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Think Tab State
  const [thinkQuery, setThinkQuery] = useState('');
  const [thinkAnswer, setThinkAnswer] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Derived
  const currentLevel = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];
  const userTitle = XP_TITLES.find(t => userXP >= t.xp && (XP_TITLES[XP_TITLES.indexOf(t) + 1]?.xp > userXP || !XP_TITLES[XP_TITLES.indexOf(t) + 1]))?.title || XP_TITLES[0].title;

  // --- Effects ---
  useEffect(() => {
    resetLevel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevelId]);

  // --- Simulation Logic ---

  const addLog = (message: string, type: 'info' | 'error' | 'success') => {
    const id = Date.now().toString() + Math.random();
    setLogs(prev => [...prev, { id, message, type }]);
  };

  const resetLevel = () => {
    setGrid(currentLevel.grid.map(row => [...row])); // Deep copy
    setRobot({ ...currentLevel.startPos });
    setStatus(GameStatus.IDLE);
    setLogs([{ id: 'init', message: `레벨 ${currentLevel.id} 로드됨. 코드 대기 중...`, type: 'info' }]);
  };

  const addCommand = (cmd: CommandType) => {
    if (status === GameStatus.RUNNING) return;
    if (commands.length >= currentLevel.maxCommands) {
      addLog("명령어 최대 개수 도달!", "error");
      return;
    }
    setCommands(prev => [...prev, cmd]);
  };

  const removeCommand = (index: number) => {
    if (status === GameStatus.RUNNING) return;
    setCommands(prev => prev.filter((_, i) => i !== index));
  };

  const parseCommands = (): CommandType[] => {
    // Unroll loops for execution
    const executionQueue: CommandType[] = [];
    let i = 0;
    while (i < commands.length) {
      if (commands[i] === CommandType.LOOP_START) {
        // Find matching end
        let loopEndIndex = -1;
        let depth = 1;
        for (let j = i + 1; j < commands.length; j++) {
          if (commands[j] === CommandType.LOOP_START) depth++;
          if (commands[j] === CommandType.LOOP_END) depth--;
          if (depth === 0) {
            loopEndIndex = j;
            break;
          }
        }

        if (loopEndIndex !== -1) {
          const loopBody = commands.slice(i + 1, loopEndIndex);
          // Repeat 3 times for simplicity in this kids app
          for (let r = 0; r < 3; r++) {
            executionQueue.push(...loopBody);
          }
          i = loopEndIndex + 1;
        } else {
          // Unclosed loop, just ignore or treat as no-op
          i++;
        }
      } else if (commands[i] === CommandType.LOOP_END) {
        // Stray end loop
        i++;
      } else {
        executionQueue.push(commands[i]);
        i++;
      }
    }
    return executionQueue;
  };

  const runSimulation = async () => {
    if (commands.length === 0) {
      addLog("실행할 명령어가 없습니다!", "error");
      return;
    }

    // Reset grid/robot to start state before running
    const initialGrid = currentLevel.grid.map(row => [...row]);
    setGrid(initialGrid);
    let currentRobot = { ...currentLevel.startPos };
    setRobot(currentRobot);
    
    setStatus(GameStatus.RUNNING);
    setLogs([{ id: 'start', message: '시뮬레이션 시작...', type: 'info' }]);

    const executionQueue = parseCommands();

    for (let i = 0; i < executionQueue.length; i++) {
      await new Promise(r => setTimeout(r, 600)); // Animation delay

      const cmd = executionQueue[i];
      let error = null;

      switch (cmd) {
        case CommandType.MOVE_FORWARD: {
          const next = getNextPosition(currentRobot.x, currentRobot.y, currentRobot.direction);
          // Check Bounds
          if (next.y < 0 || next.y >= initialGrid.length || next.x < 0 || next.x >= initialGrid[0].length) {
            error = "오류(IndexError): 로봇이 경로를 이탈했습니다!";
          } else if (initialGrid[next.y][next.x] === CellType.WALL) {
            error = "충돌(Collision): 로봇이 벽에 부딪혔습니다!";
          } else {
            currentRobot = { ...currentRobot, x: next.x, y: next.y };
            setRobot(currentRobot);
            addLog(`이동함: [${next.y}, ${next.x}]`, 'info');
          }
          break;
        }
        case CommandType.TURN_LEFT:
          currentRobot = { ...currentRobot, direction: rotateLeft(currentRobot.direction) };
          setRobot(currentRobot);
          addLog("왼쪽으로 회전", 'info');
          break;
        case CommandType.TURN_RIGHT:
          currentRobot = { ...currentRobot, direction: rotateRight(currentRobot.direction) };
          setRobot(currentRobot);
          addLog("오른쪽으로 회전", 'info');
          break;
        case CommandType.SERVE: {
          const cell = initialGrid[currentRobot.y][currentRobot.x];
          if (cell === CellType.STUDENT) {
            initialGrid[currentRobot.y][currentRobot.x] = CellType.SERVED;
            setGrid([...initialGrid]);
            addLog("급식 배식 성공!", 'success');
            // Check win condition immediately
            const remaining = initialGrid.flat().filter(c => c === CellType.STUDENT).length;
            if (remaining === 0) {
               addLog("레벨 완료! 모든 학생에게 배식했습니다.", 'success');
               setStatus(GameStatus.COMPLETED);
               setUserXP(prev => prev + 20);
               return; // Stop execution
            }
          } else if (cell === CellType.SERVED) {
             addLog("경고: 이미 급식을 받은 학생입니다.", 'info');
          } else {
            error = "논리 오류(LogicError): 배식할 학생이 없습니다!";
          }
          break;
        }
      }

      if (error) {
        addLog(error, 'error');
        setStatus(GameStatus.FAILED);
        return;
      }
    }

    // End of queue check
    const remainingStudents = initialGrid.flat().filter(c => c === CellType.STUDENT).length;
    if (remainingStudents === 0) {
      setStatus(GameStatus.COMPLETED);
      addLog("시뮬레이션 종료. 성공!", 'success');
      setUserXP(prev => prev + 20);
    } else {
      setStatus(GameStatus.FAILED);
      addLog(`시뮬레이션 종료. 배고픈 학생 ${remainingStudents}명이 남았습니다.`, 'error');
    }
  };

  const handleGeminiAsk = async () => {
    if (!thinkQuery.trim()) return;
    setIsThinking(true);
    const answer = await askGeminiCoach(thinkQuery);
    setThinkAnswer(answer);
    setIsThinking(false);
  };

  // --- Render Helpers ---

  const renderTabButton = (index: number, label: string, Icon: any) => (
    <button
      onClick={() => setActiveTab(index)}
      className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-semibold transition-colors whitespace-nowrap ${
        activeTab === index 
          ? 'border-blue-600 text-blue-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Code className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">학교 급식 로봇</h1>
              <p className="text-xs text-gray-500">RPA 코딩 코치</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <div className="text-right">
                <div className="text-xs text-gray-400">현재 등급</div>
                <div className="font-bold text-blue-600 flex items-center space-x-1">
                   <Award size={16} />
                   <span>{userTitle}</span>
                </div>
             </div>
             <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
               {userXP} XP
             </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex overflow-x-auto no-scrollbar">
          {renderTabButton(0, "시뮬레이션", Play)}
          {renderTabButton(1, "이론 학습", BookOpen)}
          {renderTabButton(2, "퀴즈", CheckCircle)}
          {renderTabButton(3, "질문하기", Brain)}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        
        {/* Tab 0: Simulation */}
        {activeTab === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            
            {/* Left: Command Palette & Controls */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-gray-700">레벨 선택</h2>
                  <span className="text-sm text-gray-400">{currentLevelId}/{LEVELS.length}</span>
                </div>
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {LEVELS.map(l => (
                    <button 
                      key={l.id}
                      onClick={() => setCurrentLevelId(l.id)}
                      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold transition-colors ${currentLevelId === l.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                    >
                      {l.id}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">{currentLevel.description}</p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">명령어</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => addCommand(CommandType.MOVE_FORWARD)} className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors">
                    <span className="font-mono text-sm">앞으로</span>
                  </button>
                  <button onClick={() => addCommand(CommandType.SERVE)} className="flex items-center justify-center space-x-2 bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 border border-green-200 transition-colors">
                     <span className="font-mono text-sm">배식하기</span>
                  </button>
                  <button onClick={() => addCommand(CommandType.TURN_LEFT)} className="flex items-center justify-center space-x-2 bg-gray-50 text-gray-700 py-2 rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors">
                     <span className="font-mono text-sm">왼쪽 회전</span>
                  </button>
                  <button onClick={() => addCommand(CommandType.TURN_RIGHT)} className="flex items-center justify-center space-x-2 bg-gray-50 text-gray-700 py-2 rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors">
                     <span className="font-mono text-sm">오른쪽 회전</span>
                  </button>
                  <button onClick={() => addCommand(CommandType.LOOP_START)} className="flex items-center justify-center space-x-2 bg-purple-50 text-purple-700 py-2 rounded-lg hover:bg-purple-100 border border-purple-200 transition-colors">
                     <span className="font-mono text-sm">반복 시작</span>
                  </button>
                  <button onClick={() => addCommand(CommandType.LOOP_END)} className="flex items-center justify-center space-x-2 bg-purple-50 text-purple-700 py-2 rounded-lg hover:bg-purple-100 border border-purple-200 transition-colors">
                     <span className="font-mono text-sm">반복 종료</span>
                  </button>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center justify-between">
                 <button 
                  onClick={resetLevel}
                  disabled={status === GameStatus.RUNNING}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2"
                 >
                   <RotateCcw size={18} />
                   <span>초기화</span>
                 </button>
                 <button 
                  onClick={runSimulation}
                  disabled={status === GameStatus.RUNNING}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-bold shadow-sm transition-all ${status === GameStatus.RUNNING ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                 >
                   <Play size={18} />
                   <span>{status === GameStatus.RUNNING ? '실행 중...' : '실행'}</span>
                 </button>
              </div>
            </div>

            {/* Middle: Grid & Output */}
            <div className="lg:col-span-2 flex flex-col space-y-6">
               {/* Program Pipeline */}
               <div className="bg-slate-800 p-4 rounded-xl shadow-sm overflow-x-auto">
                 <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">나의 알고리즘</h3>
                 <div className="flex space-x-2 min-w-max">
                   {commands.length === 0 && <span className="text-slate-500 italic text-sm">명령어를 드래그하거나 버튼을 클릭하세요...</span>}
                   {commands.map((cmd, idx) => (
                     <div key={idx} className="relative group">
                        <div className={`px-3 py-1.5 rounded-md text-xs font-mono border whitespace-nowrap
                          ${cmd.includes('LOOP') ? 'bg-purple-600 text-white border-purple-400' : 'bg-blue-600 text-white border-blue-400'}
                        `}>
                          {cmd.replace('MOVE_FORWARD', '앞으로')
                              .replace('SERVE', '배식')
                              .replace('TURN_LEFT', '왼쪽')
                              .replace('TURN_RIGHT', '오른쪽')
                              .replace('LOOP_START', '반복 시작')
                              .replace('LOOP_END', '반복 끝')}
                        </div>
                        {status !== GameStatus.RUNNING && (
                          <button 
                            onClick={() => removeCommand(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={10} />
                          </button>
                        )}
                     </div>
                   ))}
                 </div>
               </div>

               {/* Game Area */}
               <div className="flex-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
                 <GridBoard grid={grid} robot={robot} />
                 
                 {/* Status Overlay */}
                 {status === GameStatus.COMPLETED && (
                   <div className="mt-6 bg-green-100 text-green-800 px-6 py-3 rounded-lg flex items-center animate-bounce">
                     <Award className="mr-2" /> 레벨 성공! +20 XP
                   </div>
                 )}
                 {status === GameStatus.FAILED && (
                   <div className="mt-6 bg-red-100 text-red-800 px-6 py-3 rounded-lg flex items-center">
                     <AlertCircle className="mr-2" /> 알고리즘 실패. 로그를 확인하세요!
                   </div>
                 )}
               </div>

               {/* Console Log */}
               <div className="bg-black rounded-xl p-4 h-48 overflow-y-auto font-mono text-sm border border-gray-800 shadow-inner">
                 <div className="text-gray-500 mb-2 border-b border-gray-800 pb-1">실행 로그</div>
                 {logs.map((log) => (
                   <div key={log.id} className={`mb-1 ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : 'text-blue-300'}`}>
                     <span className="opacity-50 mr-2">{'>'}</span>{log.message}
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* Tab 1: Theory */}
        {activeTab === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                <Code size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">순차 구조 (Sequence)</h3>
              <p className="text-gray-600 text-sm">
                로봇은 명령어를 위에서 아래로 차례대로 실행합니다. "이동" 후 "배식"하라고 명령하면, 로봇은 절대 이동하기 전에 배식하지 않습니다. 이것을 <span className="font-bold text-blue-600">순차(Sequence)</span>라고 합니다.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                <RotateCcw size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">반복 구조 (Loop)</h3>
              <p className="text-gray-600 text-sm">
                "이동, 이동, 이동"을 계속 쓰는 대신 <span className="font-bold text-purple-600">반복문(Loop)</span>을 사용할 수 있습니다. 반복문은 로봇에게 "이 행동을 X번 반복해"라고 말해줍니다. 코드가 훨씬 짧고 똑똑해지죠!
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 text-orange-600">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">2차원 배열 (격자 지도)</h3>
              <p className="text-gray-600 text-sm">
                급식실 지도는 <span className="font-bold text-orange-600">2차원 배열</span>입니다. 리스트 안에 리스트가 있는 형태죠.
                <br/>
                <code className="bg-gray-100 px-1 rounded text-xs">grid[행][열]</code>
                <br/>
                만약 로봇이 지도 밖의 번호로 가면, 오류(IndexError)가 발생하며 멈춥니다.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Quiz */}
        {activeTab === 2 && (
          <div className="max-w-2xl mx-auto space-y-8">
            {QUIZZES.map((q, idx) => (
              <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-wide">질문 {idx + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{q.question}</h3>
                {q.codeSnippet && (
                  <pre className="bg-gray-100 p-3 rounded-lg text-sm font-mono text-gray-700 mb-4 border border-gray-200 whitespace-pre-wrap">
                    {q.codeSnippet}
                  </pre>
                )}
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => (
                    <button 
                      key={optIdx}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm text-gray-700"
                      onClick={() => alert(optIdx === q.correctAnswer ? "정답입니다! " + q.explanation : "다시 시도해보세요!")}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Think & Ask (Gemini) */}
        {activeTab === 3 && (
          <div className="max-w-3xl mx-auto">
             <div className="bg-indigo-600 rounded-2xl p-8 text-white mb-8">
                <h2 className="text-2xl font-bold mb-2 flex items-center">
                  <Brain className="mr-2" /> RPA 코치에게 물어보세요
                </h2>
                <p className="text-indigo-100 mb-6">
                  알고리즘, 로봇 경로 최적화, 혹은 실제 로봇이 어떻게 작동하는지 궁금한가요? 아래에 질문해보세요!
                </p>
                
                <div className="space-y-4">
                  <div className="relative">
                    <textarea
                      value={thinkQuery}
                      onChange={(e) => setThinkQuery(e.target.value)}
                      placeholder="예: 모든 학생에게 가장 빨리 가는 방법은 무엇인가요?"
                      className="w-full p-4 rounded-xl text-gray-900 focus:ring-4 focus:ring-indigo-300 outline-none h-32 resize-none"
                    />
                    <button 
                      onClick={handleGeminiAsk}
                      disabled={isThinking || !thinkQuery.trim()}
                      className="absolute bottom-3 right-3 bg-indigo-800 hover:bg-indigo-900 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center disabled:opacity-50"
                    >
                      {isThinking ? '생각 중...' : '질문하기'} <MessageSquare size={16} className="ml-2" />
                    </button>
                  </div>
                </div>
             </div>

             {thinkAnswer && (
               <div className="bg-white border-l-4 border-indigo-500 p-6 rounded-r-xl shadow-sm">
                 <h3 className="font-bold text-gray-800 mb-2 flex items-center">
                   <Bot className="mr-2 text-indigo-500" /> 코치의 답변:
                 </h3>
                 <div className="prose text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
                   {thinkAnswer}
                 </div>
               </div>
             )}

             <div className="mt-8">
               <h3 className="font-bold text-gray-700 mb-4">생각해 볼 문제:</h3>
               <div className="bg-white p-6 rounded-xl border border-yellow-200 bg-yellow-50">
                 <h4 className="font-bold text-yellow-800 mb-2">떠돌이 로봇 문제 (Traveling Salesman Problem)</h4>
                 <p className="text-sm text-yellow-900">
                   만약 교실에 학생 5명이 무작위로 흩어져 있다면, 가장 가까운 학생에게 먼저 가는 게 좋을까요? 아니면 전체 경로를 미리 계획하는 게 좋을까요?
                   <br/><br/>
                   AI 코치에게 물어보세요: <i>"외판원 순회 문제(Traveling Salesman Problem)가 뭐야?"</i>
                 </p>
               </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;