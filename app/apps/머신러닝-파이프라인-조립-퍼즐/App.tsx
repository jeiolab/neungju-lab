import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Puzzle, 
  FlaskConical, 
  BrainCircuit, 
  Menu, 
  CheckCircle, 
  AlertTriangle, 
  RotateCcw,
  Trophy,
  ChevronRight,
  ChevronDown,
  Search,
  MessageSquare,
  ArrowRight,
  Database,
  Rocket
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { PIPELINE_STAGES, QUIZ_DATA, DICTIONARY_DATA } from './constants';
import { Stage, UserState, ViewState, SimulationConfig, SimulationResult } from './types';
import { Button, Card, Badge } from './components/UIComponents';
import { evaluateThought } from './services/geminiService';

// --- Sub-components for Views ---

const TheoryView = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
    {PIPELINE_STAGES.map((stage, idx) => {
        const Icon = stage.iconName === 'Database' ? Database : 
                     stage.iconName === 'BrainCircuit' ? BrainCircuit :
                     stage.iconName === 'FlaskConical' ? FlaskConical : Rocket;
        return (
            <Card key={stage.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                    <Icon size={24} />
                    </div>
                    <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="text-sm bg-slate-100 px-2 py-0.5 rounded text-slate-500">Step {idx + 1}</span>
                        {stage.title}
                    </h3>
                    <p className="text-slate-600 mt-2 text-sm leading-relaxed">{stage.description}</p>
                    <div className="mt-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">핵심 체크리스트</h4>
                        <ul className="text-sm space-y-1">
                            {stage.correctChecklist.map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-slate-700">
                                    <CheckCircle size={14} className="text-emerald-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    </div>
                </div>
            </Card>
        )
    })}
  </div>
);

const PuzzleView = ({ onComplete }: { onComplete: (score: number) => void }) => {
  // Simple state for ordering: list of stage IDs
  const [order, setOrder] = useState<string[]>(['step-2', 'step-4', 'step-1', 'step-3']); // Randomized initially
  const [selectedChecks, setSelectedChecks] = useState<Record<string, string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<{score: number, message: string} | null>(null);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...order];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setOrder(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === order.length - 1) return;
    const newOrder = [...order];
    [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    setOrder(newOrder);
  };

  const toggleCheck = (stageId: string, item: string) => {
    if (submitted) return;
    setSelectedChecks(prev => {
      const current = prev[stageId] || [];
      const exists = current.includes(item);
      if (exists) return { ...prev, [stageId]: current.filter(i => i !== item) };
      return { ...prev, [stageId]: [...current, item] };
    });
  };

  const checkAnswer = () => {
    let score = 0;
    const correctOrder = ['step-1', 'step-2', 'step-3', 'step-4'];
    
    // 1. Order Check (50 pts)
    let orderScore = 0;
    let isOrderCorrect = true;
    order.forEach((id, idx) => {
      if (id === correctOrder[idx]) orderScore += 12.5;
      else isOrderCorrect = false;
    });
    
    // 2. Checklist Check (50 pts)
    let checkScore = 0;
    PIPELINE_STAGES.forEach(stage => {
      const userSelected = selectedChecks[stage.id] || [];
      const correct = stage.correctChecklist;
      // Precision/Recall simplified: Lose points for wrong picks, gain for right picks
      const stageMatches = userSelected.filter(i => correct.includes(i)).length;
      const stageWrongs = userSelected.filter(i => !correct.includes(i)).length;
      
      // Max score per stage is 12.5
      // Each correct item is worth ~4pts (if 3 items). Penalty for wrong items.
      const itemValue = 12.5 / correct.length;
      let stageS = (stageMatches * itemValue) - (stageWrongs * 2); 
      if (stageS < 0) stageS = 0;
      checkScore += stageS;
    });

    const totalScore = Math.round(orderScore + checkScore);
    
    let msg = "";
    if (totalScore === 100) msg = "완벽합니다! 파이프라인 마스터시군요! 🏆";
    else if (!isOrderCorrect) msg = "순서가 뒤죽박죽입니다. 데이터 흐름을 다시 생각해보세요!";
    else if (totalScore > 80) msg = "순서는 완벽한데, 세부 체크리스트를 조금 더 다듬어볼까요?";
    else msg = "아직 조금 헷갈리시나요? 이론을 다시 복습해보세요!";

    setFeedback({ score: totalScore, message: msg });
    setSubmitted(true);
    if (totalScore === 100) onComplete(totalScore);
  };

  const reset = () => {
    setOrder(['step-3', 'step-1', 'step-4', 'step-2']);
    setSelectedChecks({});
    setSubmitted(false);
    setFeedback(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
        <h4 className="font-bold text-blue-800">미션: ML 파이프라인 조립하기</h4>
        <p className="text-sm text-blue-600 mt-1">1. 카드를 위아래로 움직여 올바른 순서를 맞추세요.<br/>2. 각 단계에 꼭 필요한 항목을 체크하세요.</p>
      </div>

      <div className="space-y-4">
        {order.map((id, index) => {
          const stage = PIPELINE_STAGES.find(s => s.id === id)!;
          const Icon = stage.iconName === 'Database' ? Database : 
                     stage.iconName === 'BrainCircuit' ? BrainCircuit :
                     stage.iconName === 'FlaskConical' ? FlaskConical : Rocket;
          return (
            <div key={id} className={`bg-white border-2 rounded-xl p-4 transition-all ${submitted && feedback?.score === 100 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded text-slate-600 font-bold w-8 h-8 flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div className={`p-2 rounded-lg ${submitted ? 'bg-transparent' : 'bg-indigo-50 text-indigo-600'}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-lg">{stage.title}</h3>
                </div>
                {!submitted && (
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveUp(index)} disabled={index === 0} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30">▲</button>
                    <button onClick={() => moveDown(index)} disabled={index === 3} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30">▼</button>
                  </div>
                )}
              </div>
              
              <div className="pl-12 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stage.checklistItems.map((item) => (
                   <label key={item} className={`flex items-center gap-2 p-2 rounded cursor-pointer border ${
                     submitted && stage.correctChecklist.includes(item) ? 'bg-emerald-100 border-emerald-300' :
                     submitted && !stage.correctChecklist.includes(item) && (selectedChecks[id] || []).includes(item) ? 'bg-red-100 border-red-300' :
                     (selectedChecks[id] || []).includes(item) ? 'bg-indigo-50 border-indigo-200' : 'border-slate-100 hover:bg-slate-50'
                   }`}>
                     <input 
                       type="checkbox" 
                       checked={(selectedChecks[id] || []).includes(item)}
                       onChange={() => toggleCheck(id, item)}
                       disabled={submitted}
                       className="w-4 h-4 accent-indigo-600"
                     />
                     <span className="text-sm">{item}</span>
                   </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4">
         {feedback ? (
           <div className="flex-1 mr-4">
             <div className="font-bold text-xl mb-1">점수: {feedback.score}점</div>
             <p className={`text-sm ${feedback.score === 100 ? 'text-emerald-600' : 'text-red-500'}`}>{feedback.message}</p>
           </div>
         ) : <div className="flex-1"></div>}
         
         {!submitted ? (
            <Button onClick={checkAnswer}>제출 및 채점</Button>
         ) : (
            <Button onClick={reset} variant="secondary"><RotateCcw size={16}/> 다시하기</Button>
         )}
      </div>
    </div>
  );
};

const SimulationView = () => {
  const [config, setConfig] = useState<SimulationConfig>({
    removeOutliers: false,
    testSplitRatio: 20
  });
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Logic for "Fake" Simulation
      let train = 0;
      let test = 0;
      let status: 'bad' | 'good' | 'excellent' = 'bad';
      let fb = "";

      if (!config.removeOutliers) {
        // No outlier removal: High train error potential, low test score due to noise
        train = 92; 
        test = 65;
        status = 'bad';
        fb = "이상치(Noise)가 섞여 있어 모델이 엉뚱한 패턴까지 학습했습니다. 실전(Test) 점수가 뚝 떨어졌네요! (과대적합 위험)";
      } else {
        if (config.testSplitRatio === 20) {
           // Outlier removed, small test set. High scores but maybe variance
           train = 95;
           test = 88;
           status = 'good';
           fb = "좋습니다! 이상치를 제거하니 성능이 올랐습니다. 테스트 셋이 20%라 약간의 검증 불안정성은 있을 수 있습니다.";
        } else {
           // Outlier removed, large test set (40%). Harder to train (less data), but very robust test score.
           train = 91; // Less training data
           test = 90; // Very reliable evaluation
           status = 'excellent';
           fb = "훌륭합니다! 전처리도 깔끔하고, 테스트 데이터를 충분히 확보(40%)하여 신뢰할 수 있는 모델 성능을 얻었습니다.";
        }
      }

      setResult({ trainingScore: train, testScore: test, feedback: fb, status });
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Controls */}
      <Card title="실험실 제어판" className="h-fit">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">1. 데이터 전처리</label>
            <div className="flex gap-2">
               <button 
                onClick={() => setConfig(prev => ({...prev, removeOutliers: false}))}
                className={`flex-1 py-2 px-3 rounded border text-sm ${!config.removeOutliers ? 'bg-red-100 border-red-300 text-red-800 font-bold' : 'bg-white border-slate-200'}`}
               >
                 그대로 사용 (Raw)
               </button>
               <button 
                 onClick={() => setConfig(prev => ({...prev, removeOutliers: true}))}
                 className={`flex-1 py-2 px-3 rounded border text-sm ${config.removeOutliers ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold' : 'bg-white border-slate-200'}`}
               >
                 이상치 제거 (Clean)
               </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">2. 데이터 분할 (Test 비율)</label>
            <div className="w-full bg-slate-200 rounded-full h-4 relative overflow-hidden">
               <div className="bg-indigo-500 h-full absolute left-0 transition-all duration-300" style={{ width: `${100 - config.testSplitRatio}%` }}></div>
               <div className="bg-amber-400 h-full absolute right-0 transition-all duration-300" style={{ width: `${config.testSplitRatio}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono">
               <span>Train: {100 - config.testSplitRatio}%</span>
               <span>Test: {config.testSplitRatio}%</span>
            </div>
            <div className="flex gap-2 mt-2">
                <button onClick={() => setConfig(prev => ({...prev, testSplitRatio: 20}))} className={`text-xs px-2 py-1 rounded border ${config.testSplitRatio === 20 ? 'bg-amber-100 border-amber-300' : ''}`}>20% (일반적)</button>
                <button onClick={() => setConfig(prev => ({...prev, testSplitRatio: 40}))} className={`text-xs px-2 py-1 rounded border ${config.testSplitRatio === 40 ? 'bg-amber-100 border-amber-300' : ''}`}>40% (보수적)</button>
            </div>
          </div>

          <Button onClick={runSimulation} disabled={isSimulating} className="w-full">
            {isSimulating ? "모델 학습 중..." : "실험 시작"}
          </Button>
        </div>
      </Card>

      {/* Visualization */}
      <div className="lg:col-span-2 space-y-6">
        <Card title="성능 리포트" className="min-h-[300px] flex flex-col justify-center">
           {result ? (
             <div className="animate-fade-in">
               <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: '학습(Train)', score: result.trainingScore, fill: '#6366f1' },
                    { name: '평가(Test)', score: result.testScore, fill: '#fbbf24' }
                  ]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Legend />
                    <ReferenceLine y={90} label="Target" stroke="red" strokeDasharray="3 3" />
                    <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
               </div>
               
               <div className={`mt-6 p-4 rounded-lg border flex gap-3 items-start ${
                 result.status === 'bad' ? 'bg-red-50 border-red-200 text-red-800' :
                 result.status === 'good' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                 'bg-emerald-50 border-emerald-200 text-emerald-800'
               }`}>
                 {result.status === 'bad' ? <AlertTriangle className="shrink-0" /> : <CheckCircle className="shrink-0" />}
                 <div>
                   <h4 className="font-bold mb-1">AI 코치의 피드백</h4>
                   <p className="text-sm">{result.feedback}</p>
                 </div>
               </div>
             </div>
           ) : (
             <div className="text-center text-slate-400 py-12">
               <FlaskConical size={48} className="mx-auto mb-4 opacity-50" />
               <p>왼쪽 제어판에서 설정을 마치고<br/>실험을 시작해주세요.</p>
             </div>
           )}
        </Card>
      </div>
    </div>
  );
};

const QuizView = ({ onComplete }: { onComplete: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (optionIdx: number) => {
    if (showExplanation) return;
    const isCorrect = optionIdx === QUIZ_DATA[currentIndex].correctAnswer;
    if (isCorrect) setScore(s => s + 1);
    
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIdx;
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (currentIndex < QUIZ_DATA.length - 1) {
      setCurrentIndex(c => c + 1);
      setShowExplanation(false);
    } else {
      setShowResult(true);
      onComplete();
    }
  };

  if (showResult) {
    return (
      <div className="text-center py-10 max-w-2xl mx-auto">
         <Trophy size={64} className="mx-auto text-yellow-500 mb-6" />
         <h2 className="text-3xl font-bold mb-2">퀴즈 완료!</h2>
         <p className="text-xl text-slate-600 mb-8">당신의 점수는 <span className="text-indigo-600 font-bold">{score} / {QUIZ_DATA.length}</span> 입니다.</p>
         
         <div className="bg-slate-50 rounded-xl p-6 text-left space-y-4 mb-8">
            <h3 className="font-bold text-lg border-b pb-2 mb-4">오답 노트 & 학습 가이드</h3>
            {QUIZ_DATA.map((q, idx) => {
               const userAnswer = answers[idx];
               if (userAnswer === q.correctAnswer) return null;
               return (
                 <div key={q.id} className="p-3 bg-white border rounded-lg shadow-sm">
                    <div className="flex gap-2 items-start text-sm text-red-500 font-bold mb-1">
                       <AlertTriangle size={14} className="mt-0.5" /> 문제 {idx + 1}: {q.relatedConcept}
                    </div>
                    <p className="font-medium text-slate-800 mb-2">{q.question}</p>
                    <p className="text-sm text-slate-600 bg-slate-100 p-2 rounded">💡 {q.explanation}</p>
                 </div>
               );
            })}
            {score === QUIZ_DATA.length && <p className="text-center text-emerald-600 font-medium">틀린 문제가 없습니다! 완벽해요! 🎉</p>}
         </div>

         <Button onClick={() => {
            setCurrentIndex(0);
            setScore(0);
            setShowResult(false);
            setAnswers([]);
            setShowExplanation(false);
         }}>다시 도전하기</Button>
      </div>
    );
  }

  const q = QUIZ_DATA[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex justify-between items-center text-sm font-medium text-slate-500">
        <span>문제 {currentIndex + 1} / {QUIZ_DATA.length}</span>
        <span>현재 점수: {score}</span>
      </div>
      
      <div className="w-full bg-slate-200 h-2 rounded-full mb-8">
        <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${((currentIndex) / QUIZ_DATA.length) * 100}%` }}></div>
      </div>

      <Card className="mb-6">
         <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">{q.question}</h3>
         <div className="space-y-3">
            {q.options.map((opt, idx) => (
              <button 
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showExplanation}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all flex justify-between items-center ${
                    showExplanation 
                      ? idx === q.correctAnswer 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold' 
                        : idx === answers[currentIndex] 
                            ? 'border-red-400 bg-red-50 text-red-800' 
                            : 'border-slate-100 opacity-50'
                      : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'
                }`}
              >
                {opt}
                {showExplanation && idx === q.correctAnswer && <CheckCircle size={20} className="text-emerald-500"/>}
              </button>
            ))}
         </div>
      </Card>

      {showExplanation && (
        <div className="animate-slide-up bg-indigo-50 border border-indigo-100 p-5 rounded-xl mb-6">
           <div className="flex gap-2 items-center font-bold text-indigo-800 mb-2">
             <BookOpen size={18} /> 해설
           </div>
           <p className="text-indigo-900 leading-relaxed">{q.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={nextQuestion} disabled={!showExplanation}>
           {currentIndex === QUIZ_DATA.length - 1 ? "결과 보기" : "다음 문제"} <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
};

const DictionaryView = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState<string>("All");
    
    const categories = ["All", "Preprocessing", "Model", "Parameter", "General"];
    
    const filteredData = DICTIONARY_DATA.filter(item => {
        const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || item.definition.includes(searchTerm);
        const matchesFilter = filter === "All" || item.category === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="용어 검색 (예: 과적합, 이상치)" 
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setFilter(cat)}
                            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                                filter === cat ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredData.map((item, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-lg text-slate-800">{item.term}</h4>
                            <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-500 uppercase">{item.category}</span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{item.definition}</p>
                    </div>
                ))}
                {filteredData.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-400">
                        검색 결과가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
};

const ThinkView = () => {
    const questions = [
        "전처리 단계를 아예 생략하고 학습을 진행하면 어떤 문제가 발생할까요?",
        "테스트 데이터로 모델을 학습시켜버렸을 때 왜 '위험'하다고 할까요?",
        "학교 주변 미세먼지를 예측하는 파이프라인을 만든다면 어떤 데이터를 수집해야 할까요?",
        "모델의 정확도가 99.9%라면 무조건 좋은 모델일까요? 어떤 함정이 있을 수 있을까요?"
    ];

    const [selectedQ, setSelectedQ] = useState(questions[0]);
    const [userAnswer, setUserAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!userAnswer.trim()) return;
        setLoading(true);
        setFeedback(null);
        
        const response = await evaluateThought(selectedQ, userAnswer);
        setFeedback(response);
        setLoading(false);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Card title="생각해볼 문제">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">질문 선택</label>
                    <div className="relative">
                        <select 
                            className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
                            value={selectedQ}
                            onChange={(e) => {
                                setSelectedQ(e.target.value);
                                setFeedback(null);
                                setUserAnswer("");
                            }}
                        >
                            {questions.map((q, i) => <option key={i} value={q}>{q}</option>)}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
                           <ChevronDown size={16} />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">나의 생각 적기</label>
                    <textarea 
                        className="w-full h-32 p-4 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all resize-none"
                        placeholder="자유롭게 생각을 적어보세요. AI 코치가 피드백을 드립니다."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={loading || userAnswer.length < 5}>
                        {loading ? "AI 코치가 분석 중..." : "제출하고 피드백 받기"}
                    </Button>
                </div>
            </Card>

            {feedback && (
                <div className="animate-slide-up bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <BrainCircuit size={100} className="text-indigo-900" />
                    </div>
                    <div className="flex gap-3 relative z-10">
                        <div className="bg-white p-2 rounded-full h-fit shadow-sm text-indigo-600">
                             <MessageSquare size={24} />
                        </div>
                        <div className="space-y-2">
                             <h4 className="font-bold text-indigo-900 text-lg">AI 코치의 피드백</h4>
                             <p className="text-slate-800 whitespace-pre-line leading-relaxed">{feedback}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main App Component ---

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [userState, setUserState] = useState<UserState>({
    score: 0,
    completedPuzzle: false,
    completedQuiz: false,
    puzzleAttempts: 0,
    badges: [],
    weaknessTags: []
  });

  const handlePuzzleComplete = (score: number) => {
    setUserState(prev => {
        const newBadges = [...prev.badges];
        if (score === 100 && !newBadges.includes("파이프라인 마스터")) {
            newBadges.push("파이프라인 마스터");
        }
        return { ...prev, completedPuzzle: true, badges: newBadges };
    });
  };

  const handleQuizComplete = () => {
    setUserState(prev => ({ ...prev, completedQuiz: true }));
  };

  const menuItems = [
    { id: 'theory', label: '학습하기', icon: BookOpen },
    { id: 'puzzle', label: '파이프라인 퍼즐', icon: Puzzle },
    { id: 'simulation', label: '실험실', icon: FlaskConical },
    { id: 'quiz', label: '퀴즈', icon: CheckCircle },
    { id: 'think', label: '생각 넓히기', icon: BrainCircuit },
    { id: 'dictionary', label: '용어 사전', icon: Search },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden md:flex z-10">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            ML 파이프라인<br/>조립 퍼즐 🧩
          </h1>
          <p className="text-xs text-slate-400 mt-2">v1.0.0 • AI Coach</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                currentView === item.id 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-2">
                <Trophy size={16} className="text-yellow-600" />
                <span className="text-sm font-bold text-slate-700">나의 배지</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {userState.badges.length > 0 ? (
                    userState.badges.map(b => <Badge key={b} label={b} color="yellow" />)
                ) : (
                    <span className="text-xs text-slate-400">아직 배지가 없어요.</span>
                )}
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
             <h1 className="font-bold text-indigo-700">ML 파이프라인 퍼즐</h1>
             <button onClick={() => setCurrentView(currentView === 'dashboard' ? 'theory' : 'dashboard')} className="p-2">
                 <Menu size={24} />
             </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
           {/* Mobile Menu Overlay */}
           <div className={`md:hidden absolute inset-0 bg-white z-50 p-6 space-y-4 transition-transform duration-300 ${currentView === 'dashboard' ? 'translate-x-0' : 'translate-x-full hidden'}`}>
                <h2 className="text-xl font-bold mb-6">메뉴</h2>
                {menuItems.map(item => (
                    <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as ViewState)}
                    className="w-full flex items-center gap-4 px-4 py-4 rounded-xl bg-slate-50 font-bold text-lg text-slate-700 border border-slate-100 shadow-sm"
                    >
                    <div className="p-2 bg-white rounded-lg text-indigo-600"><item.icon size={24} /></div>
                    {item.label}
                    </button>
                ))}
           </div>

           <div className="max-w-5xl mx-auto h-full pb-20">
             <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    {menuItems.find(i => i.id === currentView)?.icon && React.createElement(menuItems.find(i => i.id === currentView)!.icon, {size: 28, className: "text-indigo-600"})}
                    {menuItems.find(i => i.id === currentView)?.label || "대시보드"}
                </h2>
                {currentView === 'puzzle' && <Badge label="Game Mode" color="green" />}
                {currentView === 'theory' && <Badge label="Learn Mode" color="blue" />}
             </div>

             <div className="bg-white/50 backdrop-blur-sm rounded-xl p-1 min-h-full">
                {currentView === 'theory' && <TheoryView />}
                {currentView === 'puzzle' && <PuzzleView onComplete={handlePuzzleComplete} />}
                {currentView === 'simulation' && <SimulationView />}
                {currentView === 'quiz' && <QuizView onComplete={handleQuizComplete} />}
                {currentView === 'dictionary' && <DictionaryView />}
                {currentView === 'think' && <ThinkView />}
                {currentView === 'dashboard' && <div className="text-center mt-20 text-slate-400">메뉴를 선택해주세요</div>}
             </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default App;