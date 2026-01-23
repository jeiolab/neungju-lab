import React, { useState } from 'react';
import { AppState, TabId } from './types';
import { QUIZ_DATA, THINK_SCENARIOS } from './constants';
import { SimulationTab } from './components/SimulationTab';
import { Button } from './components/ui/Button';
import { 
  BookOpen, 
  Cpu, 
  HelpCircle, 
  BrainCircuit, 
  Award, 
  Trophy,
  Info,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentTab: 'concept',
    score: 0,
    badges: [],
    streak: 1,
    completedPuzzle: false,
    puzzleTime: 0
  });

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizResult, setShowQuizResult] = useState(false);

  const handlePuzzleComplete = (score: number) => {
    setState(prev => ({
      ...prev,
      score: Math.max(prev.score, score),
      completedPuzzle: true,
      badges: prev.badges.includes("초보 엔지니어") ? prev.badges : [...prev.badges, "초보 엔지니어"]
    }));
  };

  const checkQuiz = () => {
    setShowQuizResult(true);
    const correctCount = QUIZ_DATA.filter(q => quizAnswers[q.id] === q.correctIndex).length;
    if (correctCount === QUIZ_DATA.length && !state.badges.includes("지식 마스터")) {
      setState(prev => ({ ...prev, badges: [...prev.badges, "지식 마스터"] }));
    }
  };

  const tabs: { id: TabId; label: string; icon: React.FC<any> }[] = [
    { id: 'concept', label: '개념 연구소', icon: BookOpen },
    { id: 'simulation', label: '암호 조립 라인', icon: Cpu },
    { id: 'learn', label: '더 알아보기', icon: Info },
    { id: 'quiz', label: '보안 퀴즈', icon: HelpCircle },
    { id: 'think', label: '생각해보기', icon: BrainCircuit },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-10 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-600 p-2 rounded-lg">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-none">XOR 블록암호 조립소</h1>
              <span className="text-xs text-slate-500">Interactive Crypto Factory</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
               <Trophy className="w-4 h-4 text-amber-600" />
               <span className="text-sm font-bold text-slate-800">{state.score}점</span>
             </div>
             {state.badges.map(badge => (
               <div key={badge} className="flex items-center gap-1 bg-cyan-50 text-cyan-700 px-2 py-1 rounded text-xs border border-cyan-200">
                 <Award className="w-3 h-3" /> {badge}
               </div>
             ))}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="max-w-6xl mx-auto px-4 mt-2 flex overflow-x-auto no-scrollbar gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = state.currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setState(prev => ({ ...prev, currentTab: tab.id }))}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'border-cyan-600 text-cyan-700 bg-cyan-50/80' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Concept Tab */}
        {state.currentTab === 'concept' && (
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-cyan-700 mb-4">블록 암호란?</h2>
                <p className="text-slate-700 leading-relaxed">
                  긴 데이터를 일정한 크기의 <strong>'블록(Block)'</strong>으로 나누어 처리하는 암호화 방식입니다.
                  마치 공장에서 긴 철판을 일정한 크기로 잘라 가공하는 것과 비슷합니다.
                </p>
                <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-600 flex justify-center gap-2 border border-slate-100">
                  <div className="bg-slate-200 px-3 py-1 rounded font-medium">평문</div>
                  <span className="text-slate-400">➜</span>
                  <div className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded font-medium">블록1</div>
                  <div className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded font-medium">블록2</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-amber-700 mb-4">XOR (배타적 논리합)</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  두 비트가 서로 <strong>다를 때만 1</strong>이 되는 연산입니다. 암호학에서 가장 사랑받는 연산자입니다.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-slate-400"/> 0 XOR 0 = 0 (같음)</li>
                  <li className="flex items-center"><ChevronRight className="w-4 h-4 mr-1 text-slate-400"/> 1 XOR 1 = 0 (같음)</li>
                  <li className="flex items-center font-medium text-slate-800"><ChevronRight className="w-4 h-4 mr-1 text-cyan-500"/> 0 XOR 1 = 1 (다름)</li>
                  <li className="flex items-center font-medium text-slate-800"><ChevronRight className="w-4 h-4 mr-1 text-cyan-500"/> 1 XOR 0 = 1 (다름)</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
               <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 p-6 rounded-2xl border-2 border-indigo-200 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 bg-indigo-200/50 rounded-full blur-2xl"></div>
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">미션: 암호화 공정 라인 구축</h2>
                 <p className="text-slate-600 mb-6">
                   '암호 조립 라인' 탭으로 이동하여 흩어진 공정 부품을 올바른 순서대로 배치하세요.
                 </p>
                 <Button onClick={() => setState(prev => ({...prev, currentTab: 'simulation'}))}>
                   실습 시작하기 <ChevronRight className="ml-1 w-4 h-4" />
                 </Button>
               </div>

               <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                 <h2 className="text-xl font-bold text-rose-700 mb-4">패딩 (Padding)</h2>
                 <p className="text-slate-700 leading-relaxed">
                   블록 크기가 8칸인데 데이터가 5칸밖에 없다면? <br/>
                   나머지 3칸을 약속된 값으로 채워주는 작업입니다. 이것이 없으면 블록 암호 기계가 작동하지 않습니다!
                 </p>
               </div>
            </div>
          </div>
        )}

        {/* Simulation Tab */}
        {state.currentTab === 'simulation' && (
          <div className="animate-in slide-in-from-right-4 duration-500">
             <div className="mb-6">
               <h2 className="text-2xl font-bold text-slate-800">암호화 공정 라인</h2>
               <p className="text-slate-600">부품을 순서대로 배치하여 'LOVE'를 암호화하세요.</p>
             </div>
             <SimulationTab onComplete={handlePuzzleComplete} isCompleted={state.completedPuzzle} />
          </div>
        )}

        {/* Learn More Tab */}
        {state.currentTab === 'learn' && (
           <div className="space-y-6 animate-in fade-in duration-500">
             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
               <h2 className="text-2xl font-bold text-cyan-700 mb-6">왜 블록으로 나눌까요?</h2>
               <div className="prose max-w-none text-slate-700">
                 <p>
                   데이터 스트림을 한 번에 처리하는 방식(스트림 암호)도 있지만, 블록 암호는 데이터를 덩어리로 묶어
                   복잡한 수학적 연산(혼돈과 확산)을 적용하기 유리합니다.
                 </p>
                 <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
                     <div className="text-3xl mb-2">📦</div>
                     <div className="font-bold text-slate-800">효율성</div>
                     <div className="text-sm text-slate-600">CPU가 데이터를 처리하기 좋은 단위</div>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
                     <div className="text-3xl mb-2">🛡️</div>
                     <div className="font-bold text-slate-800">확산 효과</div>
                     <div className="text-sm text-slate-600">1비트만 바뀌어도 블록 전체가 변함</div>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
                     <div className="text-3xl mb-2">🔄</div>
                     <div className="font-bold text-slate-800">운영 모드</div>
                     <div className="text-sm text-slate-600">블록 간의 연결 고리(CBC 등) 활용 가능</div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        )}

        {/* Quiz Tab */}
        {state.currentTab === 'quiz' && (
          <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">보안 엔지니어 자격 시험</h2>
            <div className="space-y-6">
              {QUIZ_DATA.map((q) => {
                const isCorrect = showQuizResult && quizAnswers[q.id] === q.correctIndex;
                const isWrong = showQuizResult && quizAnswers[q.id] !== undefined && quizAnswers[q.id] !== q.correctIndex;
                
                return (
                  <div key={q.id} className={`bg-white p-6 rounded-xl border shadow-sm ${isCorrect ? 'border-green-400' : isWrong ? 'border-rose-400' : 'border-slate-200'}`}>
                    <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-start">
                      <span className="bg-slate-100 text-slate-600 px-2 rounded mr-3 text-sm py-1">Q{q.id}</span>
                      {q.question}
                    </h3>
                    <div className="space-y-2">
                      {q.options.map((opt, idx) => (
                        <button
                          key={idx}
                          disabled={showQuizResult}
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: idx }))}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            quizAnswers[q.id] === idx 
                              ? 'bg-cyan-50 border-cyan-500 text-cyan-900' 
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          } ${showQuizResult && idx === q.correctIndex ? 'ring-2 ring-green-500' : ''}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {showQuizResult && (
                      <div className={`mt-4 text-sm p-3 rounded-lg ${isCorrect ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                        <strong>{isCorrect ? '정답입니다!' : '오답입니다.'}</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-8 text-center pb-8">
              {!showQuizResult ? (
                <Button size="lg" onClick={checkQuiz} disabled={Object.keys(quizAnswers).length < QUIZ_DATA.length}>
                  결과 확인하기
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => { setShowQuizResult(false); setQuizAnswers({}); }}>
                  다시 풀기
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Think Tab */}
        {state.currentTab === 'think' && (
          <div className="animate-in fade-in duration-500">
             <div className="grid md:grid-cols-3 gap-6">
                {THINK_SCENARIOS.map((scenario) => (
                  <div key={scenario.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full hover:border-cyan-400 transition-colors group">
                    <div className="mb-4 bg-cyan-50 w-10 h-10 rounded-full flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform border border-cyan-100">
                      <BrainCircuit size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">{scenario.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 flex-grow">{scenario.content}</p>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <p className="text-cyan-700 font-bold text-xs uppercase mb-1">토론 주제</p>
                      <p className="text-slate-700 text-sm">{scenario.question}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;