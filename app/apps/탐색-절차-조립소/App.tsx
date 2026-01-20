'use client'

import React, { useState, useEffect } from 'react';
import { Reorder } from 'framer-motion';
import { ALGORITHMS, SAMPLE_ARRAY, SAMPLE_GRAPH, QUIZ_DATA } from './constants';
import { AlgorithmType, PuzzleBlock, QuizQuestion, UserProgress } from './types';
import { getReflectionFeedback, generateScenario } from './services/geminiService';
import { Trophy, Play, RotateCcw, HelpCircle, Brain, CheckCircle, XCircle, ChevronRight, Menu } from 'lucide-react';

// --- Sub-components (Internal to keep file count low as requested) ---

// 1. Puzzle Block Component
const PuzzleItem: React.FC<{ item: PuzzleBlock; onEdit: (id: string, text: string) => void }> = ({ item, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.description || item.text);

  const handleBlur = () => {
    setIsEditing(false);
    onEdit(item.id, editText);
  };

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-3 cursor-grab active:cursor-grabbing flex items-center justify-between group hover:border-blue-300 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold">
          ::
        </div>
        {isEditing ? (
            <input 
                autoFocus
                className="border-b border-blue-500 outline-none text-sm w-full"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            />
        ) : (
             <div className="flex flex-col">
                <span className="font-medium text-slate-700">{item.text}</span>
                {item.description && item.description !== item.text && (
                    <span className="text-xs text-blue-600 mt-1">📝 {item.description}</span>
                )}
             </div>
        )}
      </div>
      <button 
        onClick={() => setIsEditing(!isEditing)}
        className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 hover:text-blue-500"
      >
        편집
      </button>
    </Reorder.Item>
  );
};

// 2. Simulation Visualizer
const SimulationViewer = ({ 
  algorithm, 
  stepIndex, 
  isPlaying,
  puzzleCorrect
}: { 
  algorithm: AlgorithmType; 
  stepIndex: number; 
  isPlaying: boolean;
  puzzleCorrect: boolean;
}) => {
    // Simple simulation logic states
    // In a real full app, this would be a complex state machine.
    // Here we act out a pre-recorded success path if the puzzle is correct.
    
    // Binary Search Logic Mock
    const bsTarget = 13;
    const bsStates = [
        { l: 0, h: 9, m: -1, msg: "초기화: Low=0, High=9" },
        { l: 0, h: 9, m: -1, msg: "Low(0) <= High(9) 이므로 진행" },
        { l: 0, h: 9, m: 4, msg: "Mid = (0+9)//2 = 4 (값: 9)" },
        { l: 0, h: 9, m: 4, msg: "9 < 13 이므로 Low 조정" },
        { l: 5, h: 9, m: 4, msg: "Low = Mid + 1 = 5" }, // Loop back
        { l: 5, h: 9, m: -1, msg: "Low(5) <= High(9) 이므로 진행" },
        { l: 5, h: 9, m: 7, msg: "Mid = (5+9)//2 = 7 (값: 15)" },
        { l: 5, h: 9, m: 7, msg: "15 > 13 이므로 High 조정" },
        { l: 5, h: 6, m: 7, msg: "High = Mid - 1 = 6" }, // Loop back
        { l: 5, h: 6, m: -1, msg: "Low(5) <= High(6) 이므로 진행" },
        { l: 5, h: 6, m: 5, msg: "Mid = (5+6)//2 = 5 (값: 11)" },
        { l: 5, h: 6, m: 5, msg: "11 < 13 이므로 Low 조정" },
        { l: 6, h: 6, m: 5, msg: "Low = Mid + 1 = 6" },
        { l: 6, h: 6, m: 6, msg: "Mid = (6+6)//2 = 6 (값: 13)" },
        { l: 6, h: 6, m: 6, msg: "값 13을 찾았습니다! 성공!" },
    ];

    // BFS/DFS Logic Mock
    // BFS: A -> B, C -> D, E, F, G
    const bfsOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    // DFS: A -> B -> D -> E -> C -> F -> G (Preorderish)
    const dfsOrder = ['A', 'B', 'D', 'E', 'C', 'F', 'G'];

    const currentState = algorithm === 'BINARY_SEARCH' 
        ? bsStates[Math.min(stepIndex, bsStates.length - 1)] 
        : null;

    const visitedNodes = algorithm === 'BFS' 
        ? bfsOrder.slice(0, Math.floor(stepIndex / 2) + 1)
        : algorithm === 'DFS' 
            ? dfsOrder.slice(0, Math.floor(stepIndex / 2) + 1)
            : [];

  return (
    <div className="w-full h-full bg-slate-900 rounded-xl p-6 relative overflow-hidden flex flex-col items-center justify-center">
      {!puzzleCorrect && (
          <div className="absolute inset-0 bg-slate-900/80 z-10 flex items-center justify-center text-center p-6">
              <div className="text-slate-300">
                  <p className="text-lg font-bold mb-2">🔒 시뮬레이션 잠김</p>
                  <p className="text-sm">왼쪽의 절차 퍼즐을 올바르게 완성하면<br/>시뮬레이션이 작동합니다.</p>
              </div>
          </div>
      )}

      {/* Binary Search Visualization */}
      {algorithm === 'BINARY_SEARCH' && (
        <div className="w-full">
            <div className="flex justify-center gap-2 mb-8">
                {SAMPLE_ARRAY.map((val, idx) => {
                    let status = "bg-slate-700 text-slate-400";
                    if (currentState) {
                        if (idx === currentState.m) status = "bg-yellow-500 text-black font-bold scale-110";
                        else if (idx >= currentState.l && idx <= currentState.h) status = "bg-blue-600 text-white";
                    }
                    return (
                        <div key={idx} className={`w-10 h-10 md:w-12 md:h-12 rounded flex items-center justify-center transition-all duration-300 ${status}`}>
                            {val}
                        </div>
                    );
                })}
            </div>
            <div className="bg-slate-800 p-4 rounded text-blue-200 font-mono text-center">
                Target: {bsTarget} | {currentState?.msg}
            </div>
        </div>
      )}

      {/* Graph Visualization (DFS/BFS) */}
      {(algorithm === 'DFS' || algorithm === 'BFS') && (
          <div className="relative w-[320px] h-[320px]">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {SAMPLE_GRAPH.edges.map((edge, i) => {
                      const source = SAMPLE_GRAPH.nodes.find(n => n.id === edge.source)!;
                      const target = SAMPLE_GRAPH.nodes.find(n => n.id === edge.target)!;
                      return (
                        <line 
                            key={i} 
                            x1={source.x} y1={source.y} 
                            x2={target.x} y2={target.y} 
                            stroke="#475569" 
                            strokeWidth="2" 
                        />
                      )
                  })}
              </svg>
              {SAMPLE_GRAPH.nodes.map((node) => {
                  const isVisited = visitedNodes.includes(node.id);
                  return (
                      <div 
                        key={node.id}
                        className={`absolute w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold transition-all duration-500
                            ${isVisited ? 'bg-green-500 border-green-400 text-white scale-110' : 'bg-slate-800 border-slate-600 text-slate-400'}
                        `}
                        style={{ left: node.x - 24, top: node.y - 24 }}
                      >
                          {node.label}
                      </div>
                  );
              })}
              <div className="absolute bottom-0 w-full text-center text-green-400 font-mono text-sm bg-slate-800/80 p-1 rounded">
                방문 순서: {visitedNodes.join(' -> ')}
              </div>
          </div>
      )}
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [currentAlgo, setCurrentAlgo] = useState<AlgorithmType>('BINARY_SEARCH');
  const [blocks, setBlocks] = useState<PuzzleBlock[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState("");
  const [simStep, setSimStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // AI Reflection State
  const [scenario, setScenario] = useState("");
  const [userThinkAnswer, setUserThinkAnswer] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Initial Load
  useEffect(() => {
    loadAlgorithm(currentAlgo);
    // Generate scenario on algo change
    generateScenario(ALGORITHMS[currentAlgo].title).then(result => setScenario(result || ""));
  }, [currentAlgo]);

  const loadAlgorithm = (algo: AlgorithmType) => {
    const original = ALGORITHMS[algo].blocks;
    // Shuffle
    const shuffled = [...original].sort(() => Math.random() - 0.5);
    setBlocks(shuffled);
    setIsCorrect(false);
    setSimStep(0);
    setIsPlaying(false);
    setHint("");
    setAiFeedback("");
    setUserThinkAnswer("");
  };

  const handleBlockEdit = (id: string, newText: string) => {
      setBlocks(prev => prev.map(b => b.id === id ? { ...b, description: newText } : b));
  };

  const checkOrder = () => {
    let correctCount = 0;
    let firstErrorIndex = -1;

    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].order === i) {
            correctCount++;
        } else if (firstErrorIndex === -1) {
            firstErrorIndex = i;
        }
    }

    if (correctCount === blocks.length) {
        setIsCorrect(true);
        setScore(prev => prev + 100);
        setHint("완벽합니다! 시뮬레이션을 실행해보세요.");
    } else {
        // Partial Score Logic
        // Calculate adjacent pairs correctness
        let pairScore = 0;
        for(let i=0; i < blocks.length - 1; i++) {
            if (blocks[i].order + 1 === blocks[i+1].order) pairScore++;
        }
        
        // Generate Hint
        const wrongBlock = blocks[firstErrorIndex];
        const correctBlockForSpot = ALGORITHMS[currentAlgo].blocks.find(b => b.order === firstErrorIndex);
        
        setHint(`❌ 순서가 틀렸어요. ${firstErrorIndex + 1}번째 단계에는 '${wrongBlock.text}'보다 먼저 와야 할 절차가 있습니다. (현재 인접 쌍 정답 수: ${pairScore})`);
    }
  };

  // Simulation Loop
  useEffect(() => {
    let interval: any;
    if (isPlaying && isCorrect) {
        interval = setInterval(() => {
            setSimStep(prev => prev + 1);
        }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isCorrect]);


  const submitReflection = async () => {
      if (!userThinkAnswer) return;
      setLoadingAi(true);
      const feedback = await getReflectionFeedback(ALGORITHMS[currentAlgo].title, scenario, userThinkAnswer);
      setAiFeedback(feedback || "피드백 생성 중 오류가 발생했습니다.");
      setLoadingAi(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Brain className="text-blue-600" />
                탐색 절차 조립소
            </h1>
            <p className="text-xs text-slate-500 mt-1">알고리즘은 절차다!</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
            {(Object.keys(ALGORITHMS) as AlgorithmType[]).map((algo) => (
                <button
                    key={algo}
                    onClick={() => setCurrentAlgo(algo)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors
                        ${currentAlgo === algo ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}
                    `}
                >
                    {ALGORITHMS[algo].title.split('(')[0]}
                    {currentAlgo === algo && <ChevronRight className="w-4 h-4" />}
                </button>
            ))}
        </nav>

        <div className="p-4 bg-slate-50 m-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="font-bold text-slate-700">내 점수</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{score} XP</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-20">
              <h2 className="text-2xl font-bold text-slate-800">{ALGORITHMS[currentAlgo].title}</h2>
              <p className="text-slate-500 mt-1">{ALGORITHMS[currentAlgo].desc}</p>
          </header>

          <main className="p-4 md:p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Puzzle Area */}
              <section>
                  <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                          1. 절차 조립 퍼즐
                          <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded">드래그 앤 드롭</span>
                      </h3>
                      <button 
                        onClick={checkOrder}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all
                            ${isCorrect ? 'bg-green-50 text-white cursor-default' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'}
                        `}
                        disabled={isCorrect}
                      >
                          {isCorrect ? <CheckCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          {isCorrect ? "조립 완료!" : "검증 하기"}
                      </button>
                  </div>

                  {hint && (
                      <div className={`mb-4 p-3 rounded text-sm ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                          {hint}
                      </div>
                  )}

                  <Reorder.Group axis="y" values={blocks} onReorder={setBlocks}>
                      {blocks.map((block) => (
                          <PuzzleItem key={block.id} item={block} onEdit={handleBlockEdit} />
                      ))}
                  </Reorder.Group>

                  {isCorrect && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
                          <strong>💡 Tip:</strong> 블록의 텍스트를 클릭하고 '편집'을 눌러 나만의 언어로 다시 정리해보세요. 메타인지에 도움이 됩니다!
                      </div>
                  )}
              </section>

              {/* Right Column: Simulation & Theory */}
              <section className="space-y-8">
                  {/* Simulation */}
                  <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg">2. 실행 시뮬레이션</h3>
                        {isCorrect && (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => { setIsPlaying(!isPlaying); }}
                                    className="p-2 bg-slate-200 rounded hover:bg-slate-300"
                                >
                                    {isPlaying ? "일시정지" : "재생"}
                                </button>
                                <button 
                                    onClick={() => { setSimStep(0); setIsPlaying(false); }}
                                    className="p-2 bg-slate-200 rounded hover:bg-slate-300"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                      </div>
                      <div className="aspect-video w-full shadow-lg rounded-xl">
                          <SimulationViewer 
                            algorithm={currentAlgo} 
                            stepIndex={simStep} 
                            isPlaying={isPlaying}
                            puzzleCorrect={isCorrect}
                          />
                      </div>
                  </div>

                  {/* AI Reflection Zone */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <Brain className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-slate-800">AI 코치의 생각 질문</h3>
                      </div>
                      
                      <div className="text-sm text-slate-600 mb-4 bg-slate-50 p-4 rounded-lg whitespace-pre-line">
                          {scenario || "로딩 중..."}
                      </div>

                      <div className="space-y-3">
                          <textarea 
                            className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-200 focus:border-purple-400 outline-none resize-none"
                            rows={3}
                            placeholder="이 알고리즘을 어떻게 적용할 수 있을까요?"
                            value={userThinkAnswer}
                            onChange={(e) => setUserThinkAnswer(e.target.value)}
                          />
                          <button 
                            onClick={submitReflection}
                            disabled={loadingAi || !userThinkAnswer}
                            className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 disabled:opacity-50 transition-colors"
                          >
                              {loadingAi ? "AI가 채점 중..." : "제출하고 피드백 받기"}
                          </button>
                      </div>

                      {aiFeedback && (
                          <div className="mt-4 p-4 bg-purple-50 text-purple-900 text-sm rounded-lg border border-purple-100 animate-fade-in">
                              <h4 className="font-bold mb-1">🤖 AI 코치 피드백:</h4>
                              {aiFeedback}
                          </div>
                      )}
                  </div>
              </section>

          </main>

          {/* Quiz Section (Footer Area) */}
          <footer className="bg-slate-900 text-slate-300 py-12 px-8 mt-12">
              <div className="max-w-4xl mx-auto">
                  <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                      <HelpCircle />
                      개념 확인 퀴즈
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {QUIZ_DATA.slice(0, 4).map((q) => (
                          <div key={q.id} className="bg-slate-800 p-5 rounded-lg border border-slate-700">
                              <p className="font-medium text-white mb-3">Q. {q.question}</p>
                              <div className="space-y-2">
                                  {q.options.map((opt, idx) => (
                                      <button 
                                        key={idx}
                                        className="block w-full text-left text-sm px-3 py-2 rounded hover:bg-slate-700 transition-colors"
                                        onClick={() => {
                                            if (idx === q.correctAnswer) {
                                                alert("정답입니다! " + q.explanation);
                                                setScore(s => s + 10);
                                            } else {
                                                alert("오답입니다. 다시 생각해보세요.");
                                            }
                                        }}
                                      >
                                          {idx + 1}. {opt}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </footer>
      </div>
    </div>
  );
}