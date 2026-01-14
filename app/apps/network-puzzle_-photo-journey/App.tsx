import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Puzzle, 
  Search, 
  CheckCircle, 
  BrainCircuit, 
  Trophy, 
  Menu, 
  X,
  Share2,
  RefreshCw,
  Globe,
  Server,
  MapPin,
  Package,
  Router as RouterIcon,
  Layers,
  ChevronRight,
  Lightbulb,
  Award,
  AlertTriangle
} from 'lucide-react';
import { CONCEPT_CARDS, PUZZLE_STEPS, QUIZ_DATA, THINKING_PROMPTS } from './constants';
import { ConceptCard, PuzzleStep, QuizQuestion, Tab, UserState } from './types';
import Button from './components/Button';
import { evaluateThinkingAnswer, generateNetworkStory } from './services/geminiService';

// --- Icons Map ---
const iconMap: Record<string, React.ReactNode> = {
  globe: <Globe className="w-6 h-6" />,
  server: <Server className="w-6 h-6" />,
  'map-pin': <MapPin className="w-6 h-6" />,
  package: <Package className="w-6 h-6" />,
  router: <RouterIcon className="w-6 h-6" />,
  layers: <Layers className="w-6 h-6" />,
};

const App: React.FC = () => {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CONCEPT);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // User Progress
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('net_app4_mastery');
    return saved ? JSON.parse(saved) : {
      score: 0,
      level: 1,
      streak: 1,
      badges: [],
      puzzleHistory: [],
      wrongNotes: []
    };
  });

  // Puzzle State
  const [puzzleItems, setPuzzleItems] = useState<PuzzleStep[]>([]); // Current workspace
  const [availableItems, setAvailableItems] = useState<PuzzleStep[]>(PUZZLE_STEPS); // Available to pick
  const [puzzleFeedback, setPuzzleFeedback] = useState<string | null>(null);
  const [packetSize, setPacketSize] = useState<500 | 1500>(1500);

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, any>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Thinking State
  const [thinkingAnswers, setThinkingAnswers] = useState<Record<string, string>>({});
  const [thinkingFeedback, setThinkingFeedback] = useState<Record<string, string>>({});
  const [isThinkingLoading, setIsThinkingLoading] = useState<string | null>(null);

  // Story State
  const [storyProtagonist, setStoryProtagonist] = useState('');
  const [storyDestination, setStoryDestination] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [isStoryLoading, setIsStoryLoading] = useState(false);

  // Effects
  useEffect(() => {
    localStorage.setItem('net_app4_mastery', JSON.stringify(userState));
  }, [userState]);

  // --- Helper Functions ---
  const addScore = (points: number) => {
    setUserState(prev => {
      const newScore = prev.score + points;
      const newLevel = Math.floor(newScore / 100) + 1;
      const newBadges = [...prev.badges];
      
      if (newLevel > prev.level) {
        // Level up logic handled by render
      }
      
      if (points >= 50 && !newBadges.includes('퍼즐 장인')) {
        newBadges.push('퍼즐 장인');
      }

      return { ...prev, score: newScore, level: newLevel, badges: newBadges };
    });
  };

  // --- Tab Rendering Components ---

  // 1. Concept Tab
  const renderConceptTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 animate-fade-in">
      {CONCEPT_CARDS.map((card) => (
        <div key={card.id} className={`rounded-xl border-l-4 shadow-md p-6 bg-white hover:shadow-lg transition-all ${card.color.replace('text', 'border')}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">{card.title}</h3>
            <div className={`p-2 rounded-full ${card.color.split(' ')[0]}`}>
              {iconMap[card.icon]}
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">{card.content}</p>
        </div>
      ))}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4 bg-blue-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2" /> 핵심 포인트
        </h3>
        <p className="text-blue-800">
          도메인은 주소, DNS는 전화번호부, IP는 실제 위치, 패킷은 택배 상자라고 생각하면 쉽습니다!
        </p>
      </div>
    </div>
  );

  // 2. Puzzle Tab
  const handlePuzzleDrop = (step: PuzzleStep) => {
    setPuzzleItems([...puzzleItems, step]);
    setAvailableItems(availableItems.filter(i => i.id !== step.id));
    setPuzzleFeedback(null);
  };

  const handlePuzzleRemove = (step: PuzzleStep) => {
    setAvailableItems([...availableItems, step]);
    setPuzzleItems(puzzleItems.filter(i => i.id !== step.id));
    setPuzzleFeedback(null);
  };

  const checkPuzzle = () => {
    const correctOrder = PUZZLE_STEPS.map(s => s.id).join(',');
    const userOrder = puzzleItems.map(s => s.id).join(',');

    if (puzzleItems.length !== PUZZLE_STEPS.length) {
      setPuzzleFeedback("모든 단계를 순서대로 배치해주세요!");
      return;
    }

    if (correctOrder === userOrder) {
      setPuzzleFeedback("✅ 전송 성공! 완벽한 순서입니다.");
      addScore(50);
      setUserState(prev => ({
        ...prev, 
        puzzleHistory: [...prev.puzzleHistory, { date: new Date().toISOString(), success: true }]
      }));
    } else {
      setPuzzleFeedback("❌ 전송 실패. 순서를 다시 확인해보세요. (힌트: 주소 입력이 먼저입니다)");
    }
  };

  const resetPuzzle = () => {
    setPuzzleItems([]);
    setAvailableItems(PUZZLE_STEPS);
    setPuzzleFeedback(null);
  };

  const renderPuzzleTab = () => (
    <div className="flex flex-col gap-6 p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Puzzle className="w-6 h-6 text-indigo-600" />
            데이터 전송 파이프라인 조립
          </h2>
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
            <span className="text-sm font-medium text-gray-600">패킷 크기 설정:</span>
            <button 
              onClick={() => setPacketSize(500)}
              className={`px-3 py-1 rounded text-sm ${packetSize === 500 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            >
              500 Byte (안전)
            </button>
            <button 
               onClick={() => setPacketSize(1500)}
               className={`px-3 py-1 rounded text-sm ${packetSize === 1500 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            >
              1500 Byte (고속)
            </button>
          </div>
        </div>

        {/* Drop Zone */}
        <div className="min-h-[120px] bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 p-4 mb-6 flex items-center overflow-x-auto gap-4">
           {puzzleItems.length === 0 && (
             <p className="text-gray-400 w-full text-center">아래 카드를 클릭하여 순서대로 이곳에 배치하세요.</p>
           )}
           {puzzleItems.map((item, index) => (
             <div key={item.id} className="relative flex-shrink-0">
                <div 
                  onClick={() => handlePuzzleRemove(item)}
                  className="w-32 h-32 bg-white border-2 border-indigo-200 rounded-lg flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                >
                  <span className="text-xs font-bold text-gray-400 absolute top-2 left-2">{index + 1}</span>
                  <span className="font-bold text-center text-indigo-900 text-sm mb-1">{item.label}</span>
                  <span className="text-[10px] text-gray-500 text-center leading-tight">{item.description}</span>
                </div>
                {index < puzzleItems.length - 1 && (
                  <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                )}
             </div>
           ))}
        </div>

        {/* Feedback Area */}
        {puzzleFeedback && (
          <div className={`p-4 rounded-lg mb-6 text-center font-bold ${puzzleFeedback.includes('성공') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {puzzleFeedback}
            {puzzleFeedback.includes('성공') && (
              <p className="text-sm font-normal mt-1">
                {packetSize === 500 ? "작은 패킷으로 안정적으로 도착했습니다!" : "큰 패킷으로 빠르게 도착했지만, 회선이 불안정했다면 위험했을 수 있어요."}
              </p>
            )}
          </div>
        )}

        {/* Source Items */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {availableItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handlePuzzleDrop(item)}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-indigo-500 transition-all text-left group"
            >
              <span className="font-bold text-gray-800 group-hover:text-indigo-600">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={resetPuzzle}>초기화</Button>
          <Button onClick={checkPuzzle} disabled={puzzleItems.length === 0}>전송 시작</Button>
        </div>
      </div>
    </div>
  );

  // 3. Deep Dive Tab
  const renderDeepDiveTab = () => (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">🏫 우리 학교 EBS 접속 비밀</h2>
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="font-mono text-lg text-blue-700 mb-2">www.ebs.co.kr</p>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li><span className="font-bold">kr:</span> 대한민국(Korea)을 의미하는 국가 도메인</li>
              <li><span className="font-bold">co:</span> 기업/상업(Company)을 의미</li>
              <li><span className="font-bold">ebs:</span> 기관 이름</li>
              <li><span className="font-bold">www:</span> 호스트 이름 (웹 서버)</li>
            </ul>
          </div>
          <p className="text-gray-600">
            브라우저 주소창에 <code className="bg-gray-100 px-1 py-0.5 rounded">www.ebs.co.kr</code>을 치면, 
            가장 먼저 <strong>로컬 DNS 캐시</strong>를 확인하고, 없으면 <strong>ISP(KT, SK, LG 등)의 DNS 서버</strong>에 물어봅니다.
          </p>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
        <h3 className="text-xl font-bold text-emerald-900 mb-4">미니 OX 퀴즈</h3>
        <div className="space-y-3">
          {[
            { q: "전 세계 DNS 서버가 모두 고장나면 인터넷 접속이 불가능하다?", a: false, exp: "IP 주소를 직접 입력하면 접속 가능합니다!" },
            { q: "라우터는 고장난 경로를 피해 다른 길을 찾아준다?", a: true, exp: "네, 최적의 경로를 동적으로 탐색합니다." },
            { q: "패킷은 항상 보낸 순서대로 도착한다?", a: false, exp: "경로에 따라 도착 순서가 뒤바뀔 수 있어 재조립이 필요합니다." }
          ].map((item, idx) => (
             <details key={idx} className="group bg-white rounded-lg p-3 cursor-pointer shadow-sm">
               <summary className="font-medium flex justify-between items-center list-none">
                 <span>Q. {item.q}</span>
                 <span className="text-emerald-600 text-sm group-open:hidden">정답 보기</span>
               </summary>
               <div className="mt-2 pt-2 border-t border-gray-100 text-gray-700">
                 <span className={`font-bold mr-2 ${item.a ? 'text-blue-600' : 'text-red-600'}`}>
                   {item.a ? 'O' : 'X'}
                 </span>
                 {item.exp}
               </div>
             </details>
          ))}
        </div>
      </div>
    </div>
  );

  // 4. Quiz Tab
  const handleQuizAnswer = (qId: number, answer: any) => {
    setQuizAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const submitQuiz = () => {
    let score = 0;
    const wrong: number[] = [];
    
    QUIZ_DATA.forEach(q => {
      const userAns = quizAnswers[q.id];
      let correct = false;
      
      if (q.type === 'ordering') {
        correct = JSON.stringify(userAns) === JSON.stringify(q.correctAnswer);
      } else if (q.type === 'essay') {
         // Simple length check for essay demo, usually manual or AI graded
         correct = userAns && userAns.length > 10; 
      } else {
        correct = userAns === q.correctAnswer;
      }

      if (correct) score += 10;
      else wrong.push(q.id);
    });

    addScore(score);
    setUserState(prev => ({ ...prev, wrongNotes: Array.from(new Set([...prev.wrongNotes, ...wrong])) }));
    setQuizSubmitted(true);
  };

  const renderQuizTab = () => (
    <div className="max-w-2xl mx-auto p-4">
      {!quizSubmitted ? (
        <div className="space-y-6">
          {QUIZ_DATA.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <span className="text-xs font-bold text-indigo-500 uppercase mb-1 block">Question {idx + 1}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{q.question}</h3>
              
              {q.type === 'multiple_choice' && (
                <div className="space-y-2">
                  {q.options?.map(opt => (
                    <label key={opt} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                      <input 
                        type="radio" 
                        name={`q-${q.id}`} 
                        value={opt}
                        checked={quizAnswers[q.id] === opt}
                        onChange={() => handleQuizAnswer(q.id, opt)}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'short_answer' && (
                <input 
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="답을 입력하세요"
                  value={quizAnswers[q.id] || ''}
                  onChange={(e) => handleQuizAnswer(q.id, e.target.value)}
                />
              )}

              {/* Simplified ordering for quiz demo */}
              {q.type === 'ordering' && (
                <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                  <p className="mb-2">순서대로 버튼을 클릭하여 선택하세요 (데모: 객관식처럼 정답을 선택)</p>
                   {/* In a full implementation, this would be a draggable list. Keeping it simple for the single file constraint */}
                   <div className="flex flex-wrap gap-2">
                     {/* Temporary simple input for ordering */}
                     <select 
                       className="w-full p-2 border rounded"
                       onChange={(e) => handleQuizAnswer(q.id, e.target.value.split(','))}
                     >
                       <option value="">선택하세요</option>
                       <option value={q.correctAnswer.toString()}>{(q.correctAnswer as string[]).join(' -> ')}</option>
                       <option value={q.options?.join(',')}>{(q.options as string[]).join(' -> ')}</option>
                     </select>
                   </div>
                </div>
              )}

              {q.type === 'essay' && (
                <textarea 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none h-24"
                  placeholder="자유롭게 서술하세요..."
                  value={quizAnswers[q.id] || ''}
                  onChange={(e) => handleQuizAnswer(q.id, e.target.value)}
                />
              )}
            </div>
          ))}
          <Button onClick={submitQuiz} className="w-full" size="lg">제출하기</Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">퀴즈 완료!</h2>
          <p className="text-gray-600 mb-6">결과를 확인하고 오답노트에 추가했습니다.</p>
          <div className="text-left bg-gray-50 p-4 rounded-lg mb-6 max-h-96 overflow-y-auto">
             {QUIZ_DATA.map(q => {
               const isCorrect = q.type === 'essay' ? true : JSON.stringify(quizAnswers[q.id]) === JSON.stringify(q.correctAnswer);
               return (
                 <div key={q.id} className={`mb-4 p-3 rounded border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                   <p className="font-bold text-sm mb-1">{q.question}</p>
                   <p className="text-sm">정답: {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(' -> ') : q.correctAnswer}</p>
                   {!isCorrect && <p className="text-sm text-red-600 mt-1">내가 쓴 답: {Array.isArray(quizAnswers[q.id]) ? quizAnswers[q.id].join(' -> ') : quizAnswers[q.id]}</p>}
                   <p className="text-xs text-gray-500 mt-2 bg-white p-2 rounded">{q.explanation}</p>
                 </div>
               );
             })}
          </div>
          <Button onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); setCurrentQuizIndex(0); }}>다시 도전하기</Button>
        </div>
      )}
    </div>
  );

  // 5. Thinking Tab
  const handleThinkingSubmit = async (promptId: string, question: string) => {
    const answer = thinkingAnswers[promptId];
    if (!answer) return;

    setIsThinkingLoading(promptId);
    const feedback = await evaluateThinkingAnswer(question, answer);
    setThinkingFeedback(prev => ({ ...prev, [promptId]: feedback }));
    setIsThinkingLoading(null);
    addScore(20);
  };

  const renderThinkingTab = () => (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white mb-6">
        <h2 className="text-2xl font-bold mb-2">🤔 깊게 생각하기</h2>
        <p className="opacity-90">단순 암기가 아닌, 네트워크의 원리를 응용해보는 시간입니다. AI 선생님이 피드백을 해드려요.</p>
      </div>
      
      {THINKING_PROMPTS.map(prompt => (
        <div key={prompt.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">{prompt.title}</h3>
            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${prompt.type === 'condition' ? 'bg-blue-100 text-blue-700' : prompt.type === 'counter' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
              {prompt.type}
            </span>
          </div>
          <div className="p-6">
            <p className="text-gray-800 mb-4 font-medium">{prompt.question}</p>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[100px] mb-4"
              placeholder="여기에 생각을 적어보세요..."
              value={thinkingAnswers[prompt.id] || ''}
              onChange={(e) => setThinkingAnswers(prev => ({ ...prev, [prompt.id]: e.target.value }))}
            />
            
            {thinkingFeedback[prompt.id] ? (
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 animate-fade-in">
                <h4 className="font-bold text-indigo-900 mb-2 flex items-center">
                  <BrainCircuit className="w-4 h-4 mr-2" /> AI 선생님 피드백
                </h4>
                <p className="text-indigo-800 text-sm whitespace-pre-line">{thinkingFeedback[prompt.id]}</p>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button 
                  onClick={() => handleThinkingSubmit(prompt.id, prompt.question)}
                  disabled={isThinkingLoading === prompt.id || !thinkingAnswers[prompt.id]}
                  size="sm"
                >
                  {isThinkingLoading === prompt.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : "제출하고 피드백 받기"}
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // 6. Story Tab (Add-on)
  const handleStoryGenerate = async () => {
    if(!storyProtagonist || !storyDestination) return;
    setIsStoryLoading(true);
    const story = await generateNetworkStory(storyProtagonist, storyDestination);
    setGeneratedStory(story);
    setIsStoryLoading(false);
  };

  const renderStoryTab = () => (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-pink-500 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6" /> 나만의 전송 이야기
          </h2>
          <p className="mt-2 opacity-90">내가 정한 주인공이 인터넷 세상을 여행하는 이야기를 만들어보세요!</p>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">주인공 이름 (패킷)</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-lg"
                placeholder="예: 꼬마 냥이 사진"
                value={storyProtagonist}
                onChange={(e) => setStoryProtagonist(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">목적지</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-lg"
                placeholder="예: 미국 친구의 스마트폰"
                value={storyDestination}
                onChange={(e) => setStoryDestination(e.target.value)}
              />
            </div>
          </div>

          <Button 
            onClick={handleStoryGenerate} 
            disabled={isStoryLoading || !storyProtagonist || !storyDestination}
            className="w-full bg-pink-500 hover:bg-pink-600 focus:ring-pink-400"
          >
            {isStoryLoading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : "이야기 생성하기 ✨"}
          </Button>

          {generatedStory && (
            <div className="mt-6 bg-pink-50 p-6 rounded-xl border border-pink-100 animate-fade-in relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-300 to-purple-300 rounded-t-xl"></div>
               <p className="text-gray-800 leading-loose text-lg font-medium whitespace-pre-wrap">{generatedStory}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">네트워크 순서 퍼즐</h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1">
            {[
              { id: Tab.CONCEPT, label: '이론 학습', icon: BookOpen },
              { id: Tab.PUZZLE, label: '실습 퍼즐', icon: Puzzle },
              { id: Tab.DEEP_DIVE, label: '더 알아보기', icon: Search },
              { id: Tab.QUIZ, label: '퀴즈', icon: CheckCircle },
              { id: Tab.THINKING, label: '심화 탐구', icon: BrainCircuit },
              { id: Tab.STORY, label: '스토리', icon: Share2 }, // using Share2 as placeholder for Fun
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === tab.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* User Status */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs text-gray-500">Lv.{userState.level}</span>
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-gray-900">{userState.score}</span>
              </div>
            </div>
            
            <button 
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {[
                { id: Tab.CONCEPT, label: '이론 학습' },
                { id: Tab.PUZZLE, label: '실습 퍼즐' },
                { id: Tab.DEEP_DIVE, label: '더 알아보기' },
                { id: Tab.QUIZ, label: '퀴즈' },
                { id: Tab.THINKING, label: '심화 탐구' },
                { id: Tab.STORY, label: '나만의 이야기' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as Tab);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                    activeTab === tab.id 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full py-6">
        {activeTab === Tab.CONCEPT && renderConceptTab()}
        {activeTab === Tab.PUZZLE && renderPuzzleTab()}
        {activeTab === Tab.DEEP_DIVE && renderDeepDiveTab()}
        {activeTab === Tab.QUIZ && renderQuizTab()}
        {activeTab === Tab.THINKING && renderThinkingTab()}
        {activeTab === Tab.STORY && renderStoryTab()}
      </main>

      {/* Footer / Badge Toast area */}
      {userState.badges.length > 0 && (
         <div className="fixed bottom-4 right-4 flex flex-col gap-2 pointer-events-none">
           {/* Just showing the latest badge for demo purposes */}
           <div className="bg-white shadow-lg rounded-full px-4 py-2 border border-amber-200 flex items-center gap-2 animate-bounce">
             <Award className="w-5 h-5 text-amber-500" />
             <span className="text-sm font-bold text-gray-800">획득 배지: {userState.badges[userState.badges.length - 1]}</span>
           </div>
         </div>
      )}
    </div>
  );
};

export default App;