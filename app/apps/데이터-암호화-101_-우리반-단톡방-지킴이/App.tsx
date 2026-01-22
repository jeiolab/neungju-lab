import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Search, 
  HelpCircle, 
  PenTool, 
  Trophy, 
  Flame, 
  Star,
  Lock,
  Unlock,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronRight,
  Info
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { CONCEPTS, QUIZ_QUESTIONS, BADGES } from './constants';
import { UserState, Concept, QuizQuestion, Badge } from './types';

// --- Components ---

// 1. Layout Header
const Header = ({ state }: { state: UserState }) => (
  <div className="bg-white shadow-sm p-4 sticky top-0 z-50">
    <div className="max-w-4xl mx-auto flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="text-indigo-600" />
          데이터 암호화 101
        </h1>
        <p className="text-xs text-slate-500 hidden sm:block">우리반 단톡방 지킴이</p>
      </div>
      <div className="flex gap-4 text-sm font-medium">
        <div className="flex items-center gap-1 text-orange-500">
          <Flame size={18} fill="currentColor" />
          <span>{state.streak}일</span>
        </div>
        <div className="flex items-center gap-1 text-blue-600">
          <Star size={18} fill="currentColor" />
          <span>Lv.{state.level}</span>
        </div>
        <div className="flex items-center gap-1 text-green-600">
          <Trophy size={18} />
          <span>{state.score}점</span>
        </div>
      </div>
    </div>
  </div>
);

// 2. Theory Tab
const TheoryTab = ({ 
  state, 
  updateMastery, 
  updateScore 
}: { 
  state: UserState; 
  updateMastery: (id: string, delta: number) => void;
  updateScore: (delta: number) => void;
}) => {
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [showCheck, setShowCheck] = useState(false);
  const [checkResult, setCheckResult] = useState<'correct' | 'wrong' | null>(null);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);

  const handleCardClick = (concept: Concept) => {
    setSelectedConcept(concept);
    setShowCheck(false);
    setCheckResult(null);
    setSelectedAnswerIndex(null);
  };

  const handleCheckAnswer = (idx: number) => {
    if (checkResult) return;
    setSelectedAnswerIndex(idx);
    const isCorrect = idx === selectedConcept?.checkQuestion.answerIndex;
    setCheckResult(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      updateMastery(selectedConcept!.id, 20); // Boost mastery
      updateScore(5);
    } else {
      updateMastery(selectedConcept!.id, -5);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">개념 마스터리</h2>
      
      {/* Concept Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CONCEPTS.map(concept => {
          const mastery = state.masteryByConcept[concept.id] || 0;
          return (
            <button
              key={concept.id}
              onClick={() => handleCardClick(concept)}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-500 hover:shadow-md transition text-left relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-800">{concept.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${mastery >= 80 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {mastery}%
                </span>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2">{concept.definition}</p>
              <div className="mt-4 flex gap-2 flex-wrap">
                {concept.keywords.map(k => (
                  <span key={k} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">#{k}</span>
                ))}
              </div>
              <div 
                className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-500" 
                style={{ width: `${mastery}%` }} 
              />
            </button>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedConcept && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 relative my-8">
            <button 
              onClick={() => setSelectedConcept(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <XCircle size={24} />
            </button>

            <h3 className="text-2xl font-bold text-indigo-700 mb-2">{selectedConcept.title}</h3>
            <p className="text-lg font-medium text-slate-800 mb-6">{selectedConcept.definition}</p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <Info size={16} /> 예시
                </h4>
                <p className="text-sm text-blue-900">{selectedConcept.example}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} /> 흔한 오해
                </h4>
                <p className="text-sm text-orange-900 font-bold mb-1">X {selectedConcept.misconception.myth}</p>
                <p className="text-sm text-orange-800">O {selectedConcept.misconception.truth}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              {!showCheck ? (
                <button 
                  onClick={() => setShowCheck(true)}
                  className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
                >
                  10초 체크 질문 풀기
                </button>
              ) : (
                <div className="animate-fade-in">
                  <p className="font-bold text-lg mb-4 text-center">Q. {selectedConcept.checkQuestion.question}</p>
                  <div className="space-y-2">
                    {selectedConcept.checkQuestion.options.map((opt, idx) => (
                      <button
                        key={idx}
                        disabled={!!checkResult}
                        onClick={() => handleCheckAnswer(idx)}
                        className={`w-full p-3 rounded-lg border text-left transition relative
                          ${checkResult 
                            ? idx === selectedConcept.checkQuestion.answerIndex 
                              ? 'bg-green-100 border-green-500 text-green-800' 
                              : idx === selectedAnswerIndex && checkResult === 'wrong' // Only highlight user's wrong choice if selected
                                ? 'bg-red-50 border-red-300' // Don't highlight other options as red
                                : 'bg-gray-50'
                            : 'hover:bg-slate-50 border-slate-200'
                          }
                        `}
                      >
                        {opt}
                        {checkResult && idx === selectedConcept.checkQuestion.answerIndex && (
                           <CheckCircle className="absolute right-4 top-3 text-green-600" size={20} />
                        )}
                      </button>
                    ))}
                  </div>
                  {checkResult === 'correct' && (
                    <div className="mt-4 text-center text-green-600 font-bold">정답입니다! (+5점)</div>
                  )}
                  {checkResult === 'wrong' && (
                    <div className="mt-4 text-center text-red-500 font-bold">아쉽네요! 개념을 다시 읽어보세요.</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Simulation Tab
const SimulationTab = ({ unlockBadge, updateScore }: { unlockBadge: (id: string) => void, updateScore: (delta: number) => void }) => {
  const [keyStrength, setKeyStrength] = useState(5); // 1-10
  const [isPublicWifi, setIsPublicWifi] = useState(true);
  const [calculated, setCalculated] = useState(false);

  const riskScore = Math.max(0, Math.min(100, 100 - (keyStrength * 7 + (!isPublicWifi ? 30 : 0))));

  const feedback = [];
  if (isPublicWifi) feedback.push("공용 와이파이는 해커가 패킷을 가로채기 쉽습니다.");
  else feedback.push("개인 데이터/보안 네트워크는 도청 위험이 낮습니다.");
  
  if (keyStrength < 4) feedback.push("키(비밀번호)가 너무 단순해 금방 뚫립니다.");
  else if (keyStrength < 8) feedback.push("적절한 키 길이지만, 주기적 변경이 필요합니다.");
  else feedback.push("매우 강력한 키를 사용 중입니다.");

  const handleSimulate = () => {
    setCalculated(true);
    updateScore(5);
    if (riskScore < 10) unlockBadge('b5'); // Unlock 'Sheriff' badge
  };

  const chartData = [{ name: 'Risk', value: riskScore, fill: riskScore > 70 ? '#ef4444' : riskScore > 30 ? '#f97316' : '#22c55e' }];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-10">
        <h2 className="text-2xl font-bold mb-2 text-slate-800">단톡방 유출 위험도 테스트</h2>
        <p className="text-slate-500 mb-8">상황을 설정하고 데이터가 얼마나 위험한지 확인해보세요.</p>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            {/* Controls */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                네트워크 환경
              </label>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setIsPublicWifi(true)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition ${isPublicWifi ? 'bg-white shadow text-red-500' : 'text-slate-500'}`}
                >
                  <Wifi size={18} /> 공용 와이파이
                </button>
                <button 
                  onClick={() => setIsPublicWifi(false)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition ${!isPublicWifi ? 'bg-white shadow text-green-600' : 'text-slate-500'}`}
                >
                  <ShieldCheck size={18} /> 개인 데이터
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                <span>키(비밀번호) 복잡도</span>
                <span className="text-indigo-600">{keyStrength}단계</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={keyStrength}
                onChange={(e) => setKeyStrength(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>"1234"</span>
                <span>"X9#mP2!z"</span>
              </div>
            </div>

            <button
              onClick={handleSimulate}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg"
            >
              위험도 분석하기
            </button>
          </div>

          {/* Results */}
          <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-6 border border-slate-100">
             <div className="h-48 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="70%" outerRadius="100%" data={chartData} startAngle={180} endAngle={0} barSize={20}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-8">
                  <span className="text-4xl font-bold text-slate-800">{calculated ? riskScore : '?'}</span>
                  <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Risk Index</span>
                </div>
             </div>
             
             {calculated && (
               <div className="mt-4 w-full animate-fade-in">
                 <h3 className={`font-bold text-lg mb-2 ${riskScore > 50 ? 'text-red-500' : 'text-green-600'}`}>
                   {riskScore > 70 ? '매우 위험!' : riskScore > 30 ? '주의 필요' : '안전함'}
                 </h3>
                 <ul className="text-sm text-slate-600 space-y-2 bg-white p-4 rounded-lg shadow-sm border">
                   {feedback.map((f, i) => (
                     <li key={i} className="flex items-start gap-2">
                       <ChevronRight size={16} className="mt-0.5 text-indigo-400 shrink-0" />
                       {f}
                     </li>
                   ))}
                 </ul>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Quiz Tab
const QuizTab = ({ 
  state, 
  updateScore, 
  addToWrongNote 
}: { 
  state: UserState; 
  updateScore: (delta: number) => void;
  addToWrongNote: (id: string) => void;
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong' | 'retry'>('idle');
  const [retryMode, setRetryMode] = useState(false);

  const question = QUIZ_QUESTIONS[currentQIndex];
  // If in retry mode, verify if retryQuestion exists, else fallback to main (should ideally exist)
  const activeQuestion = retryMode && question.retryQuestion 
    ? { ...question.retryQuestion, explanation: '다시 풀어보니 어떤가요?', correction: '' } 
    : question;

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === activeQuestion.correctIndex;

    if (isCorrect) {
      if (retryMode) {
        setFeedback('correct'); // Correct on retry
        setTimeout(nextQuestion, 1500);
      } else {
        updateScore(10);
        setFeedback('correct');
        setTimeout(nextQuestion, 1500);
      }
    } else {
      if (retryMode) {
        // Failed retry
        setFeedback('wrong');
        addToWrongNote(question.id);
        // Move on anyway after delay
        setTimeout(nextQuestion, 3000);
      } else {
        // First fail
        setFeedback('wrong');
        updateScore(-2); // Penalty
        addToWrongNote(question.id);
      }
    }
  };

  const handleRetry = () => {
    setRetryMode(true);
    setSelectedOption(null);
    setFeedback('idle');
  };

  const nextQuestion = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setFeedback('idle');
      setRetryMode(false);
    } else {
      alert("퀴즈 완료! 수고하셨습니다.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-2 bg-slate-100 w-full">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300" 
            style={{ width: `${((currentQIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">
              Q{currentQIndex + 1} {retryMode ? '(재도전)' : ''}
            </span>
            <span className="text-xs text-slate-400">
              {currentQIndex + 1} / {QUIZ_QUESTIONS.length}
            </span>
          </div>

          <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
            {activeQuestion.question}
          </h3>

          <div className="space-y-3 mb-6">
            {activeQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                disabled={feedback !== 'idle'}
                onClick={() => setSelectedOption(idx)}
                className={`w-full p-4 rounded-xl border-2 text-left transition font-medium
                  ${selectedOption === idx 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-800' 
                    : 'border-slate-100 hover:bg-slate-50 text-slate-600'
                  }
                  ${feedback === 'correct' && idx === activeQuestion.correctIndex ? 'bg-green-100 border-green-500' : ''}
                  ${feedback === 'wrong' && idx === selectedOption ? 'bg-red-50 border-red-300' : ''}
                `}
              >
                {opt}
              </button>
            ))}
          </div>

          {feedback === 'idle' && (
            <button 
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-indigo-700 transition"
            >
              제출하기
            </button>
          )}

          {feedback === 'correct' && (
             <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2 animate-bounce-short">
               <CheckCircle /> 정답입니다!
             </div>
          )}

          {feedback === 'wrong' && (
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 animate-fade-in">
              <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                <XCircle size={20} /> 오답입니다.
              </div>
              <p className="text-sm text-slate-700 mb-2 font-medium">이유: {question.explanation}</p>
              {!retryMode && (
                <>
                  <p className="text-sm text-indigo-600 mb-4 bg-indigo-50 p-2 rounded">💡 {question.correction}</p>
                  <button 
                    onClick={handleRetry}
                    className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={16} /> 다른 문제로 재도전 (복구 기회)
                  </button>
                </>
              )}
              {retryMode && (
                 <p className="text-sm text-red-500">재도전 실패. 오답노트에 추가되었습니다.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 5. Learn More & Reflection Tab (Combined for brevity in this demo, but logic separated)
const LearnMoreTab = () => (
  <div className="p-4 max-w-4xl mx-auto space-y-6">
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Search size={20} /> 실생활 암호화 체크리스트</h2>
      <ul className="space-y-3">
        {[
          'HTTPS (자물쇠 아이콘): 웹사이트 접속 시 통신 암호화',
          '카카오톡 비밀채팅: 종단간 암호화(End-to-End)',
          '공인인증서/패스: 전자서명을 통한 본인 인증',
          'QR코드 체크인: 개인정보를 해시값으로 변환하여 전송'
        ].map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-slate-700">
            <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
    
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-2">🎓 진로 가이드</h2>
      <p className="text-slate-300 mb-4 text-sm">정보 보안 전문가, 화이트 해커, 암호학자가 되고 싶다면?</p>
      <div className="flex gap-2 flex-wrap">
        <span className="bg-white/10 px-3 py-1 rounded-full text-xs">수학(정수론)</span>
        <span className="bg-white/10 px-3 py-1 rounded-full text-xs">네트워크</span>
        <span className="bg-white/10 px-3 py-1 rounded-full text-xs">운영체제</span>
        <span className="bg-white/10 px-3 py-1 rounded-full text-xs">윤리 의식</span>
      </div>
    </div>
  </div>
);

// 6. Reflection Tab
const ReflectionTab = ({ state, saveReflection }: { state: UserState, saveReflection: (id: string, text: string) => void }) => {
  const [text, setText] = useState("");
  
  const handleSave = () => {
    if (!text.trim()) return;
    saveReflection("ref_" + Date.now(), text);
    setText("");
    alert("생각이 저장되었습니다. (외부 전송 X)");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><PenTool size={20} /> 생각 정리하기</h2>
        <div className="bg-yellow-50 p-4 rounded-lg mb-4 text-sm text-yellow-800">
          <strong>미션:</strong> 만약 우리 반 단톡방 내용을 해커가 볼 수 있다면, 어떤 피해가 발생할까요? 구체적인 예시 1가지를 적어보세요.
        </div>
        <textarea 
          className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none bg-slate-50"
          placeholder="여기에 작성하세요..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button 
          onClick={handleSave}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition"
        >
          나만의 생각 저장하기
        </button>

        <div className="mt-8">
            <h3 className="font-bold text-slate-700 mb-2">지난 기록</h3>
            <div className="space-y-2">
                {Object.entries(state.reflectionAnswers).map(([key, val]) => (
                    <div key={key} className="p-3 bg-slate-50 rounded border text-sm text-slate-600">
                        {val}
                    </div>
                ))}
                {Object.keys(state.reflectionAnswers).length === 0 && <p className="text-xs text-slate-400">기록이 없습니다.</p>}
            </div>
        </div>
      </div>
    </div>
  );
};


// --- Main App ---

export default function App() {
  // State Initialization with LocalStorage
  const [activeTab, setActiveTab] = useState<'theory' | 'sim' | 'learn' | 'quiz' | 'reflection'>('theory');
  
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('cryptoApp_state');
    if (saved) return JSON.parse(saved);
    return {
      level: 1,
      score: 0,
      streak: 1,
      lastStudyDate: new Date().toDateString(),
      masteryByConcept: {},
      badges: [],
      wrongNoteItems: [],
      quizAttempts: {},
      reflectionAnswers: {}
    };
  });

  // Persist State
  useEffect(() => {
    localStorage.setItem('cryptoApp_state', JSON.stringify(userState));
  }, [userState]);

  // Streak Logic
  useEffect(() => {
    const today = new Date().toDateString();
    if (userState.lastStudyDate !== today) {
      setUserState(prev => ({
        ...prev,
        streak: prev.streak + 1,
        lastStudyDate: today
      }));
    }
  }, []);

  // Helpers
  const updateScore = (delta: number) => {
    setUserState(prev => {
      const newScore = Math.max(0, prev.score + delta);
      const newLevel = Math.floor(newScore / 100) + 1;
      return { ...prev, score: newScore, level: newLevel };
    });
  };

  const updateMastery = (conceptId: string, delta: number) => {
    setUserState(prev => {
      const current = prev.masteryByConcept[conceptId] || 0;
      const newVal = Math.max(0, Math.min(100, current + delta));
      return {
        ...prev,
        masteryByConcept: { ...prev.masteryByConcept, [conceptId]: newVal }
      };
    });
  };

  const unlockBadge = (id: string) => {
    if (!userState.badges.includes(id)) {
      setUserState(prev => ({ ...prev, badges: [...prev.badges, id] }));
      alert(`배지 획득! ${BADGES.find(b => b.id === id)?.name}`);
    }
  };

  const addToWrongNote = (id: string) => {
      setUserState(prev => ({
          ...prev,
          wrongNoteItems: Array.from(new Set([...prev.wrongNoteItems, id]))
      }));
  };

  const saveReflection = (id: string, text: string) => {
      setUserState(prev => ({
          ...prev,
          reflectionAnswers: { ...prev.reflectionAnswers, [id]: text }
      }));
  }

  // Check Badges on state change
  useEffect(() => {
    BADGES.forEach(badge => {
      if (!userState.badges.includes(badge.id) && badge.condition(userState)) {
        unlockBadge(badge.id);
      }
    });
  }, [userState.score, userState.masteryByConcept, userState.streak]);


  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <Header state={userState} />

      <main className="pt-6">
        {activeTab === 'theory' && <TheoryTab state={userState} updateMastery={updateMastery} updateScore={updateScore} />}
        {activeTab === 'sim' && <SimulationTab unlockBadge={unlockBadge} updateScore={updateScore} />}
        {activeTab === 'quiz' && <QuizTab state={userState} updateScore={updateScore} addToWrongNote={addToWrongNote} />}
        {activeTab === 'learn' && <LearnMoreTab />}
        {activeTab === 'reflection' && <ReflectionTab state={userState} saveReflection={saveReflection} />}
      </main>

      {/* Mobile/Bottom Nav (or simple tabs for desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center z-40 sm:top-20 sm:bottom-auto sm:border-t-0 sm:border-b sm:bg-transparent sm:justify-center sm:gap-4 sm:max-w-4xl sm:mx-auto">
        {[
          { id: 'theory', icon: BookOpen, label: '이론' },
          { id: 'sim', icon: RefreshCw, label: '실험' },
          { id: 'quiz', icon: HelpCircle, label: '퀴즈' },
          { id: 'learn', icon: Search, label: '더보기' },
          { id: 'reflection', icon: PenTool, label: '생각' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center p-2 rounded-lg transition sm:flex-row sm:gap-2 sm:px-4 sm:py-2
              ${activeTab === tab.id ? 'text-indigo-600 sm:bg-white sm:shadow-sm' : 'text-slate-400 hover:text-slate-600'}
            `}
          >
            <tab.icon size={20} />
            <span className="text-[10px] sm:text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}