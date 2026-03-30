import React, { useState } from 'react';
import { Tab, SimulationState, QuizQuestion } from './types';
import { INITIAL_QUIZ, IOT_SCENARIOS, DEVICE_CONFIG } from './constants';
import { getReflectionFeedback } from './services/geminiService';
import SimulationCanvas from './components/SimulationCanvas';
import BadgeDisplay from './components/BadgeDisplay';
import { Layout, BookOpen, Cpu, HelpCircle, PenTool, CheckCircle, ChevronRight, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.THEORY);
  const [simState, setSimState] = useState<SimulationState>({
    devices: [],
    connections: [],
    score: 0,
    feedback: "",
    badges: []
  });

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});
  const [showQuizResult, setShowQuizResult] = useState(false);

  // Reflection State
  const [reflectionText, setReflectionText] = useState("");
  const [reflectionFeedback, setReflectionFeedback] = useState("");
  const [reflectionLoading, setReflectionLoading] = useState(false);

  const handleScoreUpdate = (score: number, feedback: string) => {
    setSimState(prev => ({ ...prev, score, feedback }));
  };

  const handleBadgeUnlock = (badge: string) => {
    setSimState(prev => {
      if (prev.badges.includes(badge)) return prev;
      return { ...prev, badges: [...prev.badges, badge] };
    });
  };

  const handleQuizSubmit = (id: number, answerIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [id]: answerIdx }));
  };

  const handleReflectionSubmit = async () => {
    if (!reflectionText.trim()) return;
    setReflectionLoading(true);
    const feedback = await getReflectionFeedback(reflectionText);
    setReflectionFeedback(feedback);
    setReflectionLoading(false);
    handleBadgeUnlock("깊은 사고");
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.THEORY:
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">네트워크 장비 알아보기</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(DEVICE_CONFIG).map(([type, config]) => (
                <div key={type} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex gap-4 items-start hover:shadow-md transition-shadow">
                  <div className="p-3 bg-indigo-50 rounded-lg">{config.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{config.label}</h3>
                    <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                        {type === 'ROUTER' && "서로 다른 네트워크를 연결해주는 관문(Gateway)입니다. 외부 인터넷과 학교 내부망을 이어줍니다."}
                        {type === 'SWITCH' && "여러 대의 컴퓨터나 프린터를 유선으로 연결하여 데이터를 효율적으로 전달하는 분배기입니다."}
                        {type === 'AP' && "유선 신호를 무선 신호(Wi-Fi)로 바꿔주어 노트북이나 태블릿이 선 없이 인터넷을 하게 해줍니다."}
                        {(type === 'PC' || type === 'LAPTOP' || type === 'TABLET') && "네트워크를 사용하는 최종 사용자 단말기입니다."}
                        {type === 'PRINTER' && "네트워크에 연결되어 여러 사람이 공유해서 사용할 수 있는 출력 장치입니다."}
                        {type === 'INTERNET' && "전 세계가 연결된 거대한 네트워크망입니다."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case Tab.SIMULATION:
        return (
          <div className="h-[calc(100vh-200px)] min-h-[600px] flex flex-col gap-4 animate-fade-in">
             <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">스마트 교실 네트워크 설계</h2>
                    <p className="text-slate-500 text-sm">드래그 앤 드롭으로 장비를 배치하고 선을 연결해보세요.</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-400 font-bold uppercase">Network Score</span>
                    <div className={`text-3xl font-black ${simState.score >= 80 ? 'text-green-600' : simState.score >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {simState.score} / 100
                    </div>
                </div>
             </div>
             <SimulationCanvas onScoreUpdate={handleScoreUpdate} onBadgeUnlock={handleBadgeUnlock} />
             {simState.feedback && (
                 <div className="bg-slate-800 text-slate-100 p-4 rounded-xl shadow-lg mt-2">
                     <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2"><CheckCircle size={16}/> 분석 결과 리포트</h4>
                     <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{simState.feedback}</pre>
                 </div>
             )}
          </div>
        );

      case Tab.IOT:
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
             <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-8 rounded-2xl text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-4">IoT가 만드는 미래 교실</h2>
                <p className="text-teal-100 text-lg">사물인터넷(IoT) 센서들이 네트워크에 연결되면, 교실은 스스로 생각하고 움직이는 스마트 공간이 됩니다.</p>
             </div>
             
             <div className="grid gap-6">
                {IOT_SCENARIOS.map((scenario, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border-l-4 border-teal-500 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{scenario.title}</h3>
                            <p className="text-slate-600 mb-4">{scenario.description}</p>
                            <span className="inline-block bg-teal-100 text-teal-800 text-xs px-3 py-1 rounded-full font-bold">
                                필요 장비: {scenario.device}
                            </span>
                        </div>
                        <div className="w-full md:w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center text-teal-300">
                            <Cpu size={48} />
                        </div>
                    </div>
                ))}
             </div>
          </div>
        );

      case Tab.QUIZ:
        const correctCount = INITIAL_QUIZ.filter(q => quizAnswers[q.id] === q.correctAnswer).length;
        
        return (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800">네트워크 마스터 퀴즈</h2>
                <p className="text-slate-500">배운 내용을 확인해보세요.</p>
            </div>

            <div className="space-y-6">
                {INITIAL_QUIZ.map((q, idx) => (
                    <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-lg mb-4 flex gap-2">
                            <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">{idx + 1}</span>
                            {q.question}
                        </h3>
                        <div className="space-y-2">
                            {q.options.map((opt, optIdx) => (
                                <button
                                    key={optIdx}
                                    onClick={() => !showQuizResult && handleQuizSubmit(q.id, optIdx)}
                                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                                        quizAnswers[q.id] === optIdx 
                                            ? 'bg-indigo-600 text-white border-indigo-600' 
                                            : 'bg-white hover:bg-slate-50 border-slate-200'
                                    } ${
                                        showQuizResult && q.correctAnswer === optIdx ? '!bg-green-500 !text-white !border-green-500' : ''
                                    } ${
                                        showQuizResult && quizAnswers[q.id] === optIdx && quizAnswers[q.id] !== q.correctAnswer ? '!bg-red-500 !text-white !border-red-500' : ''
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        {showQuizResult && (
                            <div className={`mt-4 p-4 rounded-lg text-sm ${quizAnswers[q.id] === q.correctAnswer ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                <p className="font-bold mb-1">{quizAnswers[q.id] === q.correctAnswer ? "정답입니다! 🎉" : "아쉬워요 😅"}</p>
                                <p>{q.explanation}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="text-center pb-8">
                {!showQuizResult ? (
                    <button 
                        onClick={() => {
                            setShowQuizResult(true);
                            if(Object.keys(quizAnswers).length === INITIAL_QUIZ.length) handleBadgeUnlock("퀴즈왕");
                        }}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 shadow-lg"
                    >
                        채점하기
                    </button>
                ) : (
                    <div className="text-xl font-bold text-slate-800">
                        총점: {correctCount} / {INITIAL_QUIZ.length}
                    </div>
                )}
            </div>
          </div>
        );

      case Tab.REFLECTION:
        return (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <PenTool className="text-indigo-500"/> 생각해볼 문제
                    </h2>
                    <p className="text-slate-600 mb-6 bg-slate-50 p-4 rounded-lg border-l-4 border-indigo-400">
                        "우리 학교 교실이나 컴퓨터실의 네트워크 장비들을 관찰해본 적이 있나요? 
                        현재 구성에서 불편한 점이나, 보안/속도 측면에서 개선하면 좋을 점 1가지를 적어보세요."
                    </p>
                    <textarea
                        value={reflectionText}
                        onChange={(e) => setReflectionText(e.target.value)}
                        placeholder="예: 우리 반은 AP가 복도 끝에 있어서 창가 쪽 자리는 와이파이가 잘 안 터져요. AP를 교실 중앙 천장으로 옮기면 좋겠습니다."
                        className="w-full h-40 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleReflectionSubmit}
                            disabled={reflectionLoading || !reflectionText}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                        >
                            {reflectionLoading ? "AI 분석 중..." : "제출하고 피드백 받기"}
                        </button>
                    </div>
                </div>

                {reflectionFeedback && (
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 rounded-2xl shadow-lg">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <Award className="text-yellow-300" /> 선생님(AI)의 피드백
                        </h3>
                        <p className="leading-relaxed opacity-90">{reflectionFeedback}</p>
                    </div>
                )}
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Layout size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Smart Class Builder</h1>
          </div>
          <nav className="hidden md:flex gap-1">
             {[
               { id: Tab.THEORY, icon: BookOpen, label: "개념 학습" },
               { id: Tab.SIMULATION, icon: PenTool, label: "설계 실습" },
               { id: Tab.IOT, icon: Cpu, label: "IoT 확장" },
               { id: Tab.QUIZ, icon: HelpCircle, label: "퀴즈" },
               { id: Tab.REFLECTION, icon: CheckCircle, label: "생각하기" },
             ].map(item => (
                 <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${
                        activeTab === item.id 
                            ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' 
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                 >
                    <item.icon size={16} />
                    {item.label}
                 </button>
             ))}
          </nav>
        </div>
        {/* Mobile Nav Scroller */}
        <div className="md:hidden overflow-x-auto flex gap-2 p-2 px-4 border-t border-slate-100">
            {[
               { id: Tab.THEORY, label: "개념" },
               { id: Tab.SIMULATION, label: "실습" },
               { id: Tab.IOT, label: "IoT" },
               { id: Tab.QUIZ, label: "퀴즈" },
               { id: Tab.REFLECTION, label: "생각" },
             ].map(item => (
                 <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                        activeTab === item.id ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                 >
                    {item.label}
                 </button>
             ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </main>

      <BadgeDisplay badges={simState.badges} />
    </div>
  );
};

export default App;

// Helper icons needed for BadgeDisplay inside App to avoid circular deps if extracted poorly, 
// but here used purely for UI within App structure.
import { Award } from 'lucide-react';
