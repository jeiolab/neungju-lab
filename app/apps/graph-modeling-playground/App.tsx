import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Lightbulb, 
  BookOpen, 
  Trophy, 
  MoreHorizontal, 
  Plus, 
  Play, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  BrainCircuit,
  Star
} from 'lucide-react';
import { GraphData, Node, Edge, SimulationResult, UserStats, RelationType, ProblemStep, FeedbackData } from './types';
import GraphVisualizer from './components/GraphVisualizer';
import { loadGraph, saveGraph, loadStats, saveStats } from './services/storageService';
import { generateCoachFeedback } from './services/geminiService';

// --- Constants ---
const RELATIONS: { type: RelationType; label: string; defaultWeight: number }[] = [
  { type: 'BEST_FRIEND', label: '절친', defaultWeight: 0.8 },
  { type: 'CLASSMATE', label: '같은 반', defaultWeight: 0.4 },
  { type: 'CLUB_MEMBER', label: '같은 동아리', defaultWeight: 0.6 },
  { type: 'FRIEND_OF_FRIEND', label: '친구의 친구', defaultWeight: 0.2 },
];

const TABS = [
  { id: 'theory', label: '개념', icon: BookOpen },
  { id: 'sim', label: '실험', icon: Network },
  { id: 'deep', label: '더보기', icon: Lightbulb },
  { id: 'quiz', label: '퀴즈', icon: CheckCircle2 },
];

// --- Main Component ---
export default function App() {
  const [activeTab, setActiveTab] = useState('sim');
  const [graph, setGraph] = useState<GraphData>({ nodes: [], edges: [] });
  const [stats, setStats] = useState<UserStats>({
    streak: 0, lastLogin: '', badges: [], totalSimulations: 0, masteryScore: 0, wrongNotes: []
  });

  // Init
  useEffect(() => {
    setGraph(loadGraph());
    setStats(loadStats());
  }, []);

  // Save on change
  useEffect(() => {
    if (graph.nodes.length > 0) saveGraph(graph);
  }, [graph]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Network size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 leading-tight">그래프 모델링 놀이터</h1>
            <p className="text-xs text-slate-500">인맥으로 홍보하기</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full border border-orange-100 text-sm font-medium">
            <span role="img" aria-label="fire">🔥</span> {stats.streak}일 연속
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 text-sm font-medium">
            <Trophy size={14} /> 뱃지 {stats.badges.length}개
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex relative">
        {/* Left Navigation */}
        <nav className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-6 shrink-0 z-10">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-16 ${
                activeTab === tab.id 
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-200' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="flex-1 bg-slate-50 relative overflow-hidden">
          {activeTab === 'theory' && <TheoryTab />}
          {activeTab === 'sim' && <SimulationTab graph={graph} setGraph={setGraph} stats={stats} setStats={setStats} />}
          {activeTab === 'deep' && <DeepDiveTab />}
          {activeTab === 'quiz' && <QuizTab stats={stats} setStats={setStats} />}
        </div>
      </main>
    </div>
  );
}

// --- Tab: Theory ---
const TheoryTab = () => {
  const [step, setStep] = useState(0);
  const concepts = [
    { title: "모델링이란?", text: "복잡한 현실을 단순하게 만드는 거예요. 점심 메뉴 같은 복잡한 건 무시하고, 오직 '누가 누구를 아는지'에만 집중하는 거죠." },
    { title: "노드(점)와 엣지(선)", text: "우리의 모델에서 사람은 '노드(동그라미)'이고, 관계는 '엣지(선)'입니다. 이 둘이 모여 '그래프'를 만들어요." },
    { title: "왜 그래프인가요?", text: "단순한 목록이나 표와 달리, 그래프는 연결의 흐름을 보여줍니다. 이걸 통해 '마당발(핵심 인물)'을 쉽게 찾을 수 있죠!" }
  ];

  return (
    <div className="p-10 h-full overflow-y-auto flex flex-col items-center justify-center max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center max-w-lg w-full">
        <div className="mb-6 flex justify-center text-indigo-500">
           {step === 0 ? <BrainCircuit size={64} /> : step === 1 ? <Network size={64} /> : <Lightbulb size={64} />}
        </div>
        <h2 className="text-2xl font-bold mb-4">{concepts[step].title}</h2>
        <p className="text-slate-600 text-lg mb-8 leading-relaxed word-keep-all">{concepts[step].text}</p>
        
        <div className="flex justify-between items-center mt-8">
          <button 
            disabled={step === 0}
            onClick={() => setStep(s => s - 1)}
            className="text-slate-400 hover:text-slate-800 disabled:opacity-30 font-medium"
          >
            이전
          </button>
          <div className="flex gap-2">
            {concepts.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            ))}
          </div>
          <button 
             disabled={step === concepts.length - 1}
             onClick={() => setStep(s => s + 1)}
             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-all disabled:opacity-50 disabled:shadow-none"
          >
            다음 개념
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Tab: Simulation (Core) ---
const SimulationTab = ({ graph, setGraph, stats, setStats }: any) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [weights, setWeights] = useState<Record<RelationType, number>>({
    BEST_FRIEND: 0.8, CLASSMATE: 0.4, CLUB_MEMBER: 0.6, FRIEND_OF_FRIEND: 0.2
  });
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [currentStep, setCurrentStep] = useState<ProblemStep>(ProblemStep.COLLECT);

  // New Node Form
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newEdgeTarget, setNewEdgeTarget] = useState("");
  const [newEdgeType, setNewEdgeType] = useState<RelationType>('CLASSMATE');

  const addNode = () => {
    if (!newNodeLabel.trim()) return;
    const newId = Date.now().toString();
    const newNode: Node = { id: newId, label: newNodeLabel };
    
    let newEdges = [...graph.edges];
    if (newEdgeTarget && graph.nodes.find((n: Node) => n.id === newEdgeTarget)) {
      newEdges.push({
        source: newId,
        target: newEdgeTarget,
        type: newEdgeType,
        weight: weights[newEdgeType]
      });
    }

    setGraph({
      nodes: [...graph.nodes, newNode],
      edges: newEdges
    });
    setNewNodeLabel("");
    setCurrentStep(ProblemStep.MODEL); // Move step
  };

  const runSimulation = async () => {
    if (!selectedNode) return;
    setCurrentStep(ProblemStep.COMPARE);

    // Simple BFS with probability spread
    const reached = new Set<string>();
    const queue: { id: string; prob: number }[] = [{ id: selectedNode, prob: 1.0 }];
    reached.add(selectedNode);

    let totalReachValue = 0;

    // Simulate diffusion (simplified)
    while (queue.length > 0) {
      const current = queue.shift()!;
      totalReachValue += current.prob; // Expected value accumulation

      // Find neighbors
      const neighbors = graph.edges.filter((e: any) => e.source.id === current.id || e.target.id === current.id);
      
      for (const edge of neighbors) {
        const neighborId = edge.source.id === current.id ? edge.target.id : edge.source.id;
        if (!reached.has(neighborId)) {
          // Calculate transmission probability
          const weight = weights[edge.type as RelationType] || 0.3;
          const nextProb = current.prob * weight;
          
          if (nextProb > 0.1) { // Threshold to stop infinite minimal spread
             reached.add(neighborId);
             queue.push({ id: neighborId, prob: nextProb });
          }
        }
      }
    }

    const result: SimulationResult = {
      reachedNodes: Array.from(reached),
      totalReach: Math.round(totalReachValue * 10) / 10,
      steps: reached.size,
      startNodeId: selectedNode
    };
    setSimulationResult(result);
    setFeedback(null);
    setLoadingFeedback(true);

    // Call Gemini
    const startNodeLabel = graph.nodes.find((n: Node) => n.id === selectedNode)?.label || "알 수 없음";
    const aiFeedback = await generateCoachFeedback(graph, result, startNodeLabel);
    setFeedback(aiFeedback);
    setLoadingFeedback(false);
    
    // Update Stats
    setStats((prev: UserStats) => ({
      ...prev,
      totalSimulations: prev.totalSimulations + 1
    }));
    
    // Check badging
    if (graph.nodes.length >= 10 && !stats.badges.includes("Networker")) {
        setStats((prev: UserStats) => ({...prev, badges: [...prev.badges, "Networker"]}));
    }
  };

  // Calculate stats for Table View
  const nodeStats = graph.nodes.map((node: Node) => {
    const degree = graph.edges.filter((e: any) => e.source.id === node.id || e.target.id === node.id).length;
    return { ...node, degree };
  }).sort((a: any, b: any) => b.degree - a.degree);

  return (
    <div className="flex h-full">
      {/* Left: Controls & Stats */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
        {/* Step Progress */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">문제 분해 단계</span>
          </div>
          <div className="flex gap-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
             {Object.values(ProblemStep).map((step, idx) => {
               const isActive = Object.values(ProblemStep).indexOf(currentStep) >= idx;
               return <div key={step} className={`flex-1 ${isActive ? 'bg-indigo-500' : 'bg-slate-200'}`} />
             })}
          </div>
          <div className="mt-1 text-xs text-indigo-600 font-medium text-right">{currentStep}</div>
        </div>

        {/* Input Section */}
        <div className="p-5 border-b border-slate-100">
           <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
             <Plus size={16} /> 친구 추가
           </h3>
           <div className="space-y-3">
             <input 
                type="text" 
                placeholder="별명 (실명은 안돼요!)" 
                className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={newNodeLabel}
                onChange={e => setNewNodeLabel(e.target.value)}
             />
             <div className="flex gap-2">
                <select 
                  className="flex-1 p-2 border border-slate-300 rounded-lg text-sm bg-white"
                  value={newEdgeTarget}
                  onChange={e => setNewEdgeTarget(e.target.value)}
                >
                  <option value="">연결 없음</option>
                  {graph.nodes.map((n: Node) => (
                    <option key={n.id} value={n.id}>{n.label}와(과) 연결</option>
                  ))}
                </select>
             </div>
             {newEdgeTarget && (
                <select 
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
                  value={newEdgeType}
                  onChange={e => setNewEdgeType(e.target.value as RelationType)}
                >
                   {RELATIONS.map(r => (
                     <option key={r.type} value={r.type}>{r.label}</option>
                   ))}
                </select>
             )}
             <button 
               onClick={addNode}
               className="w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
             >
               노드 추가하기
             </button>
           </div>
        </div>

        {/* Simulation Controls */}
        <div className="p-5 flex-1">
           <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
             <Play size={16} /> 시뮬레이션
           </h3>
           
           {selectedNode ? (
             <div className="space-y-4">
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                  <span className="text-xs text-indigo-500 uppercase font-bold">홍보 시작할 친구</span>
                  <div className="font-semibold text-indigo-900">
                    {graph.nodes.find((n: Node) => n.id === selectedNode)?.label}
                  </div>
                </div>

                <div className="space-y-2">
                   <p className="text-xs font-semibold text-slate-500">관계별 전달 확률</p>
                   {RELATIONS.map(r => (
                     <div key={r.type} className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 w-24 truncate">{r.label}</span>
                        <input 
                          type="range" min="0" max="1" step="0.1"
                          value={weights[r.type]}
                          onChange={(e) => setWeights({...weights, [r.type]: parseFloat(e.target.value)})}
                          className="flex-1 accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs font-mono w-8 text-right">{Math.round(weights[r.type] * 100)}%</span>
                     </div>
                   ))}
                </div>

                <button 
                  onClick={runSimulation}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  실험 시작 <Play size={16} fill="currentColor" />
                </button>
             </div>
           ) : (
             <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm break-keep">
                그래프에서 실험을 시작할 친구(노드)를 선택해주세요.
             </div>
           )}

           {/* Results Preview (Table View) */}
           <div className="mt-8">
              <h4 className="font-bold text-xs text-slate-500 uppercase mb-2">추천 후보 (연결 수 기준)</h4>
              <div className="space-y-2">
                 {nodeStats.slice(0, 3).map((n: any, idx: number) => (
                   <div key={n.id} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100">
                      <div className="flex items-center gap-2">
                         <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">{idx + 1}</span>
                         <span className="text-sm font-medium">{n.label}</span>
                      </div>
                      <span className="text-xs font-mono text-slate-500">{n.degree}개 연결</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Right: Graph Area */}
      <div className="flex-1 relative flex flex-col">
        <GraphVisualizer 
          data={graph} 
          activeNodeId={selectedNode || undefined}
          reachedNodes={simulationResult?.reachedNodes}
          onNodeClick={(id) => {
            setSelectedNode(id);
            setSimulationResult(null); // Reset result on new selection
            setFeedback(null);
          }}
        />
        
        {/* Floating Feedback Card */}
        {simulationResult && (
           <div className="absolute bottom-6 right-6 w-80 bg-white/95 backdrop-blur shadow-xl rounded-xl border border-slate-200 overflow-hidden animate-slide-up">
              <div className="bg-indigo-600 px-4 py-2 flex justify-between items-center">
                 <span className="text-white font-bold text-sm">실험 결과</span>
                 <button onClick={() => setSimulationResult(null)} className="text-white/80 hover:text-white"><XCircle size={16} /></button>
              </div>
              <div className="p-4">
                 <div className="flex justify-between items-end mb-4 border-b border-slate-100 pb-4">
                    <div>
                      <div className="text-3xl font-black text-slate-800">{simulationResult.totalReach}</div>
                      <div className="text-xs text-slate-500 font-medium uppercase">예상 도달 인원</div>
                    </div>
                    <div className="text-right">
                       <div className="text-lg font-bold text-slate-700">{Math.round((simulationResult.reachedNodes.length / graph.nodes.length) * 100)}%</div>
                       <div className="text-xs text-slate-500 font-medium uppercase">도달률</div>
                    </div>
                 </div>

                 {loadingFeedback ? (
                   <div className="flex items-center gap-2 text-sm text-slate-500 animate-pulse">
                      <Star size={16} className="text-yellow-400" /> AI 코치가 분석 중입니다...
                   </div>
                 ) : feedback ? (
                   <div className="space-y-3">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">코치 피드백</div>
                      <div className="bg-green-50 p-2 rounded border border-green-100 text-xs text-green-800">
                        <span className="font-bold">유리한 점:</span> {feedback.whyGood}
                      </div>
                      <div className="bg-red-50 p-2 rounded border border-red-100 text-xs text-red-800">
                        <span className="font-bold">병목 구간:</span> {feedback.bottleneck}
                      </div>
                      <div className="bg-blue-50 p-2 rounded border border-blue-100 text-xs text-blue-800 flex gap-2 items-start">
                        <Lightbulb size={12} className="shrink-0 mt-0.5" />
                        <span>{feedback.suggestion}</span>
                      </div>
                   </div>
                 ) : (
                    <div className="text-xs text-slate-400 italic">
                       스마트 피드백을 위해 API 키가 필요해요!
                    </div>
                 )}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

// --- Tab: Deep Dive ---
const DeepDiveTab = () => {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">트리 vs 그래프: 언제 쓸까?</h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="h-40 bg-indigo-50 rounded-lg mb-4 flex items-center justify-center border border-indigo-100">
               {/* Simple SVG Tree */}
               <svg width="200" height="150" viewBox="0 0 200 150">
                  <circle cx="100" cy="20" r="10" fill="#6366f1" />
                  <circle cx="60" cy="80" r="10" fill="#818cf8" />
                  <circle cx="140" cy="80" r="10" fill="#818cf8" />
                  <circle cx="40" cy="130" r="10" fill="#a5b4fc" />
                  <circle cx="80" cy="130" r="10" fill="#a5b4fc" />
                  <line x1="100" y1="20" x2="60" y2="80" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="100" y1="20" x2="140" y2="80" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="60" y1="80" x2="40" y2="130" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="60" y1="80" x2="80" y2="130" stroke="#cbd5e1" strokeWidth="2" />
               </svg>
            </div>
            <h3 className="text-xl font-bold text-indigo-700 mb-2">트리(Tree) 구조</h3>
            <p className="text-slate-600 text-sm mb-4">계층적이에요. 뿌리(Root)는 하나고, 순환(Loop)이 없어요. 조직도나 폴더 정리에 좋아요.</p>
            <ul className="text-sm space-y-1 text-slate-500 list-disc list-inside">
               <li>회사 조직도</li>
               <li>가계도 (족보)</li>
               <li>컴퓨터 파일 시스템</li>
            </ul>
         </div>

         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="h-40 bg-orange-50 rounded-lg mb-4 flex items-center justify-center border border-orange-100">
               {/* Simple SVG Graph */}
               <svg width="200" height="150" viewBox="0 0 200 150">
                  <circle cx="100" cy="20" r="10" fill="#f97316" />
                  <circle cx="50" cy="90" r="10" fill="#fb923c" />
                  <circle cx="150" cy="90" r="10" fill="#fb923c" />
                  <circle cx="100" cy="130" r="10" fill="#fdba74" />
                  <line x1="100" y1="20" x2="50" y2="90" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="100" y1="20" x2="150" y2="90" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="50" y1="90" x2="150" y2="90" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="50" y1="90" x2="100" y2="130" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="150" y1="90" x2="100" y2="130" stroke="#cbd5e1" strokeWidth="2" />
               </svg>
            </div>
            <h3 className="text-xl font-bold text-orange-700 mb-2">그래프(Graph) 구조</h3>
            <p className="text-slate-600 text-sm mb-4">그물망처럼 연결돼요. 순환할 수 있고, 복잡한 관계 표현에 좋아요.</p>
            <ul className="text-sm space-y-1 text-slate-500 list-disc list-inside">
               <li>소셜 네트워크 (SNS)</li>
               <li>지하철 노선도</li>
               <li>인터넷 링크 연결</li>
            </ul>
         </div>
      </div>
    </div>
  );
}

// --- Tab: Quiz ---
const QuizTab = ({ stats, setStats }: any) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    { 
      q: "지하철 노선도를 표현하기에 가장 적합한 데이터 구조는?", 
      opts: ["리스트(List)", "트리(Tree)", "그래프(Graph)", "표(Table)"], 
      ans: 2,
      expl: "지하철역은 서로 복잡하게 연결되어 있고 순환선(2호선)도 있어서 그래프가 딱이에요!"
    },
    { 
      q: "A와 B가 친구이고, B와 C가 친구라면, A와 C는 연결되어 있나요?", 
      opts: ["네, 직접 연결됨", "아니요", "네, 간접적으로 연결됨", "확률에 따라 다름"], 
      ans: 2,
      expl: "A는 B를 통해 C와 '간접적'으로 연결되어 있어요. 이를 '경로(Path)'라고 해요."
    },
    { 
      q: "우리 시뮬레이션에서 '관계별 가중치'는 무엇을 의미하나요?", 
      opts: ["사람의 몸무게", "정보가 전달될 확률", "친구의 수", "물리적 거리"], 
      ans: 1,
      expl: "가중치(0.0 ~ 1.0)는 한 노드에서 다른 노드로 정보가 전달될 가능성(확률)을 의미해요."
    }
  ];

  const handleAnswer = (idx: number) => {
    setSelected(idx);
    setShowResult(true);
    if (idx !== questions[currentQ].ans) {
       setStats((prev: any) => ({...prev, wrongNotes: [...prev.wrongNotes, currentQ]}));
    } else {
       // Simple mastery increment
       setStats((prev: any) => ({...prev, masteryScore: Math.min(100, prev.masteryScore + 10)}));
    }
    saveStats(stats);
  };

  const next = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col items-center justify-center max-w-2xl mx-auto">
       <div className="w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-slate-800">퀴즈 도전</h2>
             <span className="text-sm font-medium text-slate-400">문제 {currentQ + 1}/{questions.length}</span>
          </div>
          
          <p className="text-lg mb-8 font-medium text-slate-700 break-keep">{questions[currentQ].q}</p>
          
          <div className="space-y-3">
             {questions[currentQ].opts.map((opt, i) => (
               <button
                 key={i}
                 disabled={showResult}
                 onClick={() => handleAnswer(i)}
                 className={`w-full p-4 rounded-xl text-left transition-all border ${
                   showResult 
                     ? i === questions[currentQ].ans 
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : i === selected 
                           ? 'bg-red-100 border-red-300 text-red-800'
                           : 'bg-slate-50 border-slate-100 opacity-50'
                     : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                 }`}
               >
                 {opt}
               </button>
             ))}
          </div>

          {showResult && (
             <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 font-medium">
                  {selected === questions[currentQ].ans ? "정답입니다! 🎉" : "아쉽네요. 😅"}
                </p>
                <p className="text-sm text-blue-700 mt-1 break-keep">{questions[currentQ].expl}</p>
                
                {currentQ < questions.length - 1 && (
                  <button onClick={next} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                    다음 문제
                  </button>
                )}
             </div>
          )}
       </div>
    </div>
  );
};