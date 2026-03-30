import React, { useState } from 'react';
import { Screen } from './types';
import { QUIZ_DATA } from './constants';
import { Simulation } from './components/Simulation';
import { Reflection } from './components/Reflection';
import { BookOpen, Gamepad2, BrainCircuit, CheckSquare, Trophy, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('HOME');
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const renderContent = () => {
    switch (currentScreen) {
      case 'HOME':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4 max-w-2xl">
              <div className="bg-indigo-100 text-indigo-700 w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-indigo-200 shadow-xl">
                 <BrainCircuit className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                트리 빌더: <span className="text-indigo-600">루브릭 퍼즐</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                인공지능이 데이터를 분류하는 방법, <br className="hidden md:block" />
                <strong>의사결정트리(Decision Tree)</strong>를 직접 만들며 배워보세요!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mt-8">
              <button 
                onClick={() => setCurrentScreen('THEORY')}
                className="group relative p-6 bg-white rounded-2xl border-2 border-slate-100 hover:border-indigo-500 shadow-sm hover:shadow-md transition-all text-left"
              >
                <div className="absolute top-6 right-6 text-slate-300 group-hover:text-indigo-500 transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">1. 개념 익히기</h3>
                <p className="text-slate-500 text-sm">트리, 노드, 리프... 용어가 낯선가요? 1분 만에 핵심만 쏙쏙!</p>
              </button>

              <button 
                onClick={() => setCurrentScreen('SIMULATION')}
                className="group relative p-6 bg-white rounded-2xl border-2 border-slate-100 hover:border-green-500 shadow-sm hover:shadow-md transition-all text-left"
              >
                <div className="absolute top-6 right-6 text-slate-300 group-hover:text-green-500 transition-colors">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">2. 실전 트리 만들기</h3>
                <p className="text-slate-500 text-sm">질문 카드를 조합해서 최고의 수행평가 채점 기준을 만들어보세요.</p>
              </button>
            </div>
          </div>
        );

      case 'THEORY':
        return (
          <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              핵심 개념 카드
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 font-bold text-xl">🌲</div>
                <h3 className="text-xl font-bold mb-2">의사결정트리란?</h3>
                <p className="text-slate-600 leading-relaxed">
                  스무고개 게임과 같아요! <br/>
                  데이터(학생 과제)를 <strong>"예/아니오"</strong> 질문을 통해 계속 쪼개서, 
                  마지막에 정답(A/B/C 등급)을 맞추는 지도학습 알고리즘입니다.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4 font-bold text-xl">🌿</div>
                <h3 className="text-xl font-bold mb-2">루트(Root)와 리프(Leaf)</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex gap-2">
                    <span className="font-bold text-purple-700">루트:</span>
                    <span>트리의 맨 꼭대기 시작 질문 (가장 중요한 기준!)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-green-700">리프:</span>
                    <span>더 이상 질문하지 않고 결론(등급)을 내리는 끝부분</span>
                  </li>
                </ul>
              </div>

              {/* Card 3 - Misconception */}
              <div className="bg-amber-50 p-6 rounded-2xl shadow-sm border border-amber-200 md:col-span-2">
                <h3 className="text-xl font-bold mb-2 text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  잠깐! 질문이 많으면 무조건 좋을까요?
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  아니요! 너무 꼬치꼬치 캐물으면(트리가 깊어지면) 
                  <strong>'과대적합(Overfitting)'</strong>이 발생해요. <br/>
                  마치 "안경 쓰고 파란 옷 입은 철수"만 기억해서, "안경 쓴 영희"는 못 알아보는 것과 같죠.
                  <strong>적당한 깊이(Depth)</strong>가 중요합니다!
                </p>
              </div>
            </div>
            
            <div className="text-center pt-8">
              <button 
                onClick={() => setCurrentScreen('SIMULATION')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                이제 직접 만들어볼까요? 👉
              </button>
            </div>
          </div>
        );

      case 'SIMULATION':
        return <Simulation />;

      case 'QUIZ':
        return (
          <div className="max-w-2xl mx-auto p-6 animate-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-emerald-600" />
              10초 퀴즈
            </h2>
            <div className="space-y-8">
              {QUIZ_DATA.map((q, idx) => (
                <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-lg mb-4 flex gap-2">
                    <span className="text-emerald-600">Q{idx+1}.</span>
                    {q.question}
                  </h3>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => {
                          if (quizCompleted) return;
                          if (optIdx + 1 === q.correctAnswer) {
                            alert("정답입니다! 🎉\n\n" + q.explanation);
                            setQuizScore(s => s + 1);
                          } else {
                            alert("틀렸습니다 😅\n\n정답은: " + q.options[q.correctAnswer - 1] + "\n\n" + q.explanation);
                          }
                        }}
                        className="w-full text-left p-3 rounded-lg border border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-colors"
                      >
                        {optIdx + 1}. {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'REFLECTION':
        return <Reflection />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 font-bold text-xl text-slate-800 cursor-pointer"
            onClick={() => setCurrentScreen('HOME')}
          >
            <span className="text-2xl">🌳</span>
            <span className="hidden sm:inline">TreeBuilder</span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'THEORY', label: '개념', icon: BookOpen },
              { id: 'SIMULATION', label: '퍼즐', icon: Gamepad2 },
              { id: 'QUIZ', label: '퀴즈', icon: CheckSquare },
              { id: 'REFLECTION', label: '생각하기', icon: Trophy },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentScreen(item.id as Screen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === item.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6">
        {renderContent()}
      </main>

    </div>
  );
};

export default App;
