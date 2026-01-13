import React, { useState, useEffect } from 'react';
import { Tab, Point } from './types';
import { generateRandomPoints } from './utils/knn';
import SimulationCanvas from './components/SimulationCanvas';
import { Award, Brain, Target, BookOpen, Microscope, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY);
  const [k, setK] = useState<number>(3);
  const [simulationCount, setSimulationCount] = useState<number>(0);
  const [hasBadge, setHasBadge] = useState<boolean>(false);
  const [points, setPoints] = useState<Point[]>([]);

  // Initialize
  useEffect(() => {
    const savedK = localStorage.getItem('knn-k-value');
    if (savedK) setK(parseInt(savedK, 10));

    // Initial points for simulation
    setPoints(generateRandomPoints(25, 400, 300));
  }, []);

  useEffect(() => {
    localStorage.setItem('knn-k-value', k.toString());
  }, [k]);

  useEffect(() => {
    if (simulationCount >= 10 && !hasBadge) {
      setHasBadge(true);
      // Could show a toast notification here
    }
  }, [simulationCount, hasBadge]);

  const handleSimulationRun = () => {
    setSimulationCount((prev) => prev + 1);
  };

  const handleKChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setK(parseInt(e.target.value, 10));
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="text-blue-500" />
              이론: 유유상종의 법칙
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">k-NN이란?</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                <strong>k-Nearest Neighbors (최근접 이웃)</strong> 알고리즘은 데이터를 분류할 때, 
                가장 가까이에 있는 데이터들이 무엇인지 보고 판단하는 방법입니다.
                <br/>
                쉽게 말해, <span className="text-blue-600 font-bold">"내 친구들을 보면 내가 누구인지 알 수 있다"</span>는 원리죠.
              </p>
              <div className="flex gap-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-700">
                <div className="flex-1">
                  <span className="font-bold text-indigo-600 block mb-1">1. 거리 계산</span>
                  새로운 데이터와 기존 데이터 사이의 거리를 잽니다 (주로 유클리드 거리).
                </div>
                <div className="flex-1 border-l border-slate-200 pl-4">
                  <span className="font-bold text-indigo-600 block mb-1">2. 이웃 선택</span>
                  가장 가까운 <strong>k</strong>개의 데이터를 고릅니다.
                </div>
                <div className="flex-1 border-l border-slate-200 pl-4">
                  <span className="font-bold text-indigo-600 block mb-1">3. 다수결</span>
                  이웃 중 더 많은 쪽의 색깔(클래스)을 따라갑니다.
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">하이퍼파라미터 k</h3>
              <p className="text-blue-700 text-sm">
                k는 우리가 직접 정해줘야 하는 숫자입니다. k가 작으면 예민해지고, k가 크면 둔감해집니다.
                시뮬레이션 탭에서 직접 k를 바꿔보며 느껴보세요!
              </p>
            </div>
          </div>
        );

      case Tab.SIMULATION:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Target className="text-red-500" />
              시뮬레이션: 이웃 찾기
            </h2>
            
            <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200">
              <div className="mb-6 px-2">
                <label className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">이웃의 수 (k): {k}</span>
                    <span className="text-xs text-slate-500">슬라이더를 움직여보세요</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="15" 
                    step="2" 
                    value={k} 
                    onChange={handleKChange}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1 (민감함)</span>
                    <span>15 (둔감함)</span>
                  </div>
                </label>
              </div>

              <SimulationCanvas 
                k={k} 
                points={points} 
                setPoints={setPoints} 
                onSimulationRun={handleSimulationRun} 
              />
              
              <div className="mt-4 text-center text-sm text-slate-500">
                캔버스의 빈 공간을 클릭하여 새로운 데이터를 추가해보세요.
              </div>
            </div>

            {hasBadge && (
               <div className="flex items-center justify-center gap-2 p-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200">
                 <Award className="text-yellow-500" />
                 <span className="font-bold">축하합니다! '이웃 탐험가' 배지를 획득하셨습니다.</span>
               </div>
            )}
          </div>
        );

      case Tab.DEEP_DIVE:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Microscope className="text-purple-500" />
              더 알아보기: k값의 딜레마
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow border border-slate-200">
                <h3 className="font-bold text-red-600 mb-2 flex items-center gap-2">
                  k = 1 (과적합 위험)
                </h3>
                <p className="text-sm text-slate-600 mb-4 h-20">
                  가장 가까운 단 하나의 점만 보고 결정합니다. 
                  노이즈(이상한 데이터)까지 따라가버려서 경계가 매우 꼬불꼬불하고 불안정합니다.
                  이를 <strong>Overfitting(과적합)</strong>이라고 합니다.
                </p>
                <div className="relative aspect-video bg-slate-100 rounded border border-slate-200 flex items-center justify-center overflow-hidden">
                   {/* Visual representation for K=1 */}
                   <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/400/300?blur=5')] bg-cover"></div>
                   <div className="z-10 text-center p-2">
                     <div className="w-4 h-4 rounded-full bg-red-500 inline-block m-1"></div>
                     <div className="w-4 h-4 rounded-full bg-blue-500 inline-block m-1"></div>
                     <div className="text-xs font-bold text-slate-800">예민한 경계선</div>
                   </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl shadow border border-slate-200">
                <h3 className="font-bold text-blue-600 mb-2 flex items-center gap-2">
                  k = 매우 큼 (과소적합 위험)
                </h3>
                <p className="text-sm text-slate-600 mb-4 h-20">
                  너무 많은 이웃을 봅니다. 지역적인 특성을 무시하고, 전체 데이터에서 더 많은 색깔로 무조건 분류하려 합니다.
                  이를 <strong>Underfitting(과소적합)</strong>이라고 합니다.
                </p>
                 <div className="relative aspect-video bg-slate-100 rounded border border-slate-200 flex items-center justify-center overflow-hidden">
                   {/* Visual representation for Large K */}
                   <div className="absolute inset-0 opacity-20 bg-slate-300"></div>
                   <div className="z-10 text-center p-2">
                     <div className="w-32 h-32 rounded-full border-4 border-dashed border-slate-400 flex items-center justify-center">
                       <span className="text-xs font-bold text-slate-500">너무 넓은 범위</span>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        );

      case Tab.QUIZ:
        return (
          <QuizTab />
        );

      case Tab.REFLECTION:
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Brain className="text-green-500" />
              생각해볼 문제
            </h2>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                "가장 친한 친구 3명의 평균 점수가 내 점수?"
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                k-NN 알고리즘은 실제로 추천 시스템이나 성적 예측 등에 사용될 수 있습니다. 
                만약 학교에서 선생님이 <strong>"너와 가장 친하게 지내는(거리가 가까운) 친구 3명의 성적 평균으로 너의 다음 시험 점수를 예측하겠다"</strong>라고 한다면 어떨까요?
              </p>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-bold text-indigo-600 mb-2">장점은 무엇일까요?</h4>
                  <textarea 
                    className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                    placeholder="예: 비슷한 성향의 친구들은 공부 습관도 비슷할 수 있으니까..."
                    rows={2}
                  />
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-bold text-indigo-600 mb-2">단점(한계)은 무엇일까요?</h4>
                  <textarea 
                     className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                    placeholder="예: 친하다고 해서 공부 실력까지 똑같지는 않을 수 있으니까..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-2xl mx-auto shadow-2xl min-w-[360px]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-800 flex items-center justify-between">
          <span>내 이웃은 누구? <span className="text-blue-500 font-normal text-sm ml-1">k-NN Sim</span></span>
          {hasBadge && <Award className="text-yellow-500 animate-bounce" title="이웃 탐험가 배지 획득!" />}
        </h1>
        <div className="text-xs text-slate-500 mt-1">
          시뮬레이션 횟수: {simulationCount}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-slate-200 pb-safe">
        <div className="flex justify-around items-center h-16">
          <TabButton 
            active={activeTab === Tab.THEORY} 
            onClick={() => setActiveTab(Tab.THEORY)} 
            icon={<BookOpen size={20} />} 
            label="이론" 
          />
          <TabButton 
            active={activeTab === Tab.SIMULATION} 
            onClick={() => setActiveTab(Tab.SIMULATION)} 
            icon={<Target size={20} />} 
            label="실습" 
          />
          <TabButton 
            active={activeTab === Tab.DEEP_DIVE} 
            onClick={() => setActiveTab(Tab.DEEP_DIVE)} 
            icon={<Microscope size={20} />} 
            label="심화" 
          />
          <TabButton 
            active={activeTab === Tab.QUIZ} 
            onClick={() => setActiveTab(Tab.QUIZ)} 
            icon={<HelpCircle size={20} />} 
            label="퀴즈" 
          />
          <TabButton 
            active={activeTab === Tab.REFLECTION} 
            onClick={() => setActiveTab(Tab.REFLECTION)} 
            icon={<Brain size={20} />} 
            label="생각" 
          />
        </div>
      </nav>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
      active ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
    }`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

// Quiz Tab Component
const QuizTab: React.FC = () => {
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  
  // Fixed scenario for Quiz
  const quizPoints: Point[] = [
    { id: 'q1', x: 100, y: 100, type: 'red' },
    { id: 'q2', x: 120, y: 110, type: 'red' },
    { id: 'q3', x: 280, y: 200, type: 'blue' },
    { id: 'q4', x: 290, y: 210, type: 'blue' },
    { id: 'q5', x: 200, y: 150, type: 'blue' }, // The critical neighbor
  ];
  const quizTarget = { x: 190, y: 140 }; // Close to the blue one in the middle

  const handleAnswer = (choice: 'red' | 'blue') => {
    // For K=3: Neighbors are q5(blue), q2(red), q1(red)? Let's check visually or logically.
    // q5 is (200,150) -> dist ~14
    // q2 is (120,110) -> dist ~ sqrt(70^2 + 30^2) = sqrt(4900+900) ~ 76
    // Actually wait, let's make it clearer.
    // Closest are q5(blue), and maybe q1/q2 far away?
    // Let's rely on the simulation canvas to show the truth.
    
    // Logic: Closest 3.
    // Target (190, 140).
    // q5 (200, 150) -> dist 14.1 (Blue)
    // q2 (120, 110) -> dist 76 (Red)
    // q1 (100, 100) -> dist 98 (Red)
    // q3 (280, 200) -> dist 108 (Blue)
    
    // So neighbors are q5, q2, q1. 
    // Colors: Blue, Red, Red.
    // Result: Red wins!
    
    const correct = choice === 'red';
    setAnswered(true);
    setIsCorrect(correct);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <HelpCircle className="text-orange-500" />
        퀴즈: k=3일 때 결과는?
      </h2>
      
      <div className="bg-white p-4 rounded-xl shadow border border-slate-200">
        <div className="mb-4 text-sm text-slate-600">
          아래 상황에서 <strong>k=3</strong>일 때, 별(Star)은 어떤 팀으로 분류될까요?
          <br/>
          (연결선을 잘 보고 다수결로 판단해보세요!)
        </div>

        <div className="pointer-events-none">
          <SimulationCanvas 
             k={3}
             points={quizPoints}
             setPoints={() => {}} 
             onSimulationRun={() => {}}
             interactive={false}
             predefinedTarget={quizTarget}
             showControls={false}
          />
        </div>

        {!answered ? (
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button 
              onClick={() => handleAnswer('red')}
              className="py-3 rounded-lg bg-red-100 text-red-700 font-bold hover:bg-red-200 transition border border-red-200"
            >
              빨강 팀
            </button>
            <button 
              onClick={() => handleAnswer('blue')}
              className="py-3 rounded-lg bg-blue-100 text-blue-700 font-bold hover:bg-blue-200 transition border border-blue-200"
            >
              파랑 팀
            </button>
          </div>
        ) : (
          <div className={`mt-6 p-4 rounded-lg text-center ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <div className="font-bold text-lg mb-1">
              {isCorrect ? "정답입니다! 🎉" : "아쉽네요! 😅"}
            </div>
            <p className="text-sm">
              가장 가까운 3개 점은 <span className="text-blue-600 font-bold">파랑 1개</span>, <span className="text-red-600 font-bold">빨강 2개</span>입니다.
              따라서 다수결로 <strong>빨강 팀</strong>이 됩니다.
            </p>
            <button 
              onClick={() => setAnswered(false)}
              className="mt-3 text-xs underline opacity-70 hover:opacity-100"
            >
              다시 풀기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
