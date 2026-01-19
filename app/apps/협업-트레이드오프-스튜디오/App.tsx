import React, { useState, useEffect } from 'react';
import { ScenarioType, UserStats } from './types';
import { getStats, getWrongNoteIds } from './utils/storage';
import { THEORY_CARDS } from './constants';
import SimulationTab from './components/SimulationTab';
import QuizTab from './components/QuizTab';
import { 
  LayoutDashboard, 
  FlaskConical, 
  BookOpen, 
  BrainCircuit, 
  PenTool, 
  Award, 
  Flame,
  ChevronRight
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'intro' | 'simulation' | 'theory' | 'quiz' | 'reflection'>('intro');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>(ScenarioType.REPORT);
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, [activeTab]); // Refresh stats when switching tabs

  const renderIntro = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-indigo-600 text-white p-8 rounded-3xl shadow-xl shadow-indigo-200">
        <h1 className="text-3xl font-black mb-2">협업 트레이드오프 스튜디오</h1>
        <p className="opacity-90">인간과 AI의 역할을 균형 있게 배치하는 의사결정 코치입니다.</p>
        <div className="mt-6 flex flex-wrap gap-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">#효율성</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">#품질</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">#윤리</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(ScenarioType).map((sc) => (
          <button
            key={sc}
            onClick={() => {
              setSelectedScenario(sc);
              setActiveTab('simulation');
            }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-500 hover:shadow-md transition-all text-left group"
          >
            <div className="flex justify-between items-center mb-2">
               <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded font-bold">시나리오</span>
               <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">{sc}</h3>
            <p className="text-sm text-slate-500 mt-1">이 상황에서 역할을 분배해보세요.</p>
          </button>
        ))}
      </div>

      {stats && (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-around">
            <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                   <Flame className="w-3 h-3 text-orange-500" /> 스트릭
                </div>
                <span className="text-xl font-black text-slate-800">{stats.streak}일</span>
            </div>
            <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                   <Award className="w-3 h-3 text-yellow-500" /> 배지
                </div>
                <span className="text-xl font-black text-slate-800">{stats.badges.length}개</span>
            </div>
             <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-xs mb-1">
                   <FlaskConical className="w-3 h-3 text-blue-500" /> 시뮬
                </div>
                <span className="text-xl font-black text-slate-800">{stats.simulationCount}회</span>
            </div>
        </div>
      )}
    </div>
  );

  const renderTheory = () => (
    <div className="grid grid-cols-1 gap-4 animate-slideUp">
      <div className="bg-blue-50 p-6 rounded-2xl mb-4 border border-blue-100">
        <h2 className="text-xl font-bold text-blue-900 mb-2">더 알아보기</h2>
        <p className="text-blue-700 text-sm">왜 협업이 필요할까요? 카드들을 읽고 개념을 정리해보세요.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {THEORY_CARDS.map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">{i+1}</span>
              {card.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{card.content}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReflection = () => {
      const history = localStorage.getItem('tradeoff_runs_v1') ? JSON.parse(localStorage.getItem('tradeoff_runs_v1')!) : [];
      const lastRun = history[0];
      
      return (
        <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-indigo-600" />
                    생각해볼 문제
                </h2>
                
                {!lastRun ? (
                    <div className="text-center py-10">
                        <p className="text-slate-400">먼저 시뮬레이션을 진행해주세요!</p>
                        <button 
                            onClick={() => setActiveTab('simulation')}
                            className="mt-4 text-indigo-600 font-bold hover:underline"
                        >
                            시뮬레이션 하러 가기
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-4 rounded-xl text-sm border border-slate-200">
                            <span className="font-bold block text-slate-700 mb-1">최근 시뮬레이션 결과 요약</span>
                            <p>AI 활용도 {lastRun.input.aiUsage}%, 검증 시간 {lastRun.input.verificationTime}%를 선택하여 총점 {lastRun.scores.total}점을 받았습니다.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">
                                Q. 본인이 선택한 AI 활용 비율이 적절했다고 생각하나요? 그 이유는 무엇인가요? (효율성과 품질 관점에서)
                            </label>
                            <textarea className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px] text-sm" placeholder="예: AI를 70% 활용해 초안을 빠르게 작성하고, 남은 시간 30%를 검증에 써서 효율과 품질을 모두 잡으려 했다..."></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">
                                Q. 만약 팀원이 '시간이 없으니 민감 데이터를 그냥 AI에 넣자'고 한다면 어떻게 설득하겠습니까?
                            </label>
                            <textarea className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px] text-sm" placeholder="예: 개인정보 유출은 돌이킬 수 없는 윤리적 문제이므로, 조금 늦더라도 비식별화 처리를 해야 한다고 설득하겠다..."></textarea>
                        </div>
                        
                        <button className="px-6 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-900 transition-colors">
                            에세이 저장하기 (로컬)
                        </button>
                    </div>
                )}
            </div>

            {/* Recommended Learning based on Wrong Notes */}
            {getWrongNoteIds().length > 0 && (
                 <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                     <h3 className="font-bold text-red-800 mb-2">💊 맞춤 처방: 취약 개념 복습</h3>
                     <p className="text-sm text-red-600 mb-4">퀴즈에서 자주 틀린 부분입니다.</p>
                     <button 
                        onClick={() => setActiveTab('theory')}
                        className="text-sm font-bold text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                     >
                        이론 카드 다시 보기
                     </button>
                 </div>
            )}
        </div>
      );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <div className="max-w-3xl mx-auto min-h-screen flex flex-col md:flex-row">
        
        {/* Desktop Sidebar / Mobile Bottom Nav */}
        <nav className="md:w-64 bg-white md:min-h-screen border-r border-slate-200 fixed bottom-0 w-full md:relative z-10 flex md:flex-col justify-around md:justify-start p-2 md:p-6 shadow-top md:shadow-none">
           <div className="hidden md:block mb-8">
              <span className="text-xl font-black text-indigo-600">Trade-off</span>
           </div>
           
           {[
             { id: 'intro', label: '홈', icon: LayoutDashboard },
             { id: 'simulation', label: '시뮬레이션', icon: FlaskConical },
             { id: 'theory', label: '이론 카드', icon: BookOpen },
             { id: 'quiz', label: '퀴즈', icon: BrainCircuit },
             { id: 'reflection', label: '성찰', icon: PenTool },
           ].map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id as any)}
               className={`flex flex-col md:flex-row items-center md:gap-3 p-2 md:px-4 md:py-3 rounded-xl transition-all ${
                 activeTab === item.id 
                   ? 'text-indigo-600 md:bg-indigo-50 font-bold' 
                   : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
               }`}
             >
               <item.icon className={`w-6 h-6 md:w-5 md:h-5 ${activeTab === item.id ? 'fill-current opacity-20' : ''}`} />
               <span className="text-[10px] md:text-sm mt-1 md:mt-0">{item.label}</span>
             </button>
           ))}
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
          <div className="max-w-2xl mx-auto">
            {activeTab === 'intro' && renderIntro()}
            {activeTab === 'simulation' && <SimulationTab scenario={selectedScenario} />}
            {activeTab === 'theory' && renderTheory()}
            {activeTab === 'quiz' && <QuizTab />}
            {activeTab === 'reflection' && renderReflection()}
          </div>
        </main>

      </div>
    </div>
  );
};

export default App;