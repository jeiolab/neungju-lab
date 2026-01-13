import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LearningCard, QuizQuestion, DictItem, Badge, 
  ProgressData, MotivationData, WrongNote, QuizRecord, CardProgress 
} from './types';
import { LEARNING_CARDS, QUIZ_POOL, DICTIONARY, BADGES } from './constants';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// --- Constants & Config ---
const STORAGE_KEYS = {
  PROGRESS: 'rolecards_progress_v1',
  QUIZ: 'rolecards_quiz_v1',
  WRONG: 'rolecards_wrongnote_v1',
  MOTIVATION: 'rolecards_motivation_v1',
  DICT_FAV: 'rolecards_dict_fav_v1',
};

const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1500, 2200, 3000, 4000];

// --- Helper Functions ---
const getTodayString = () => new Date().toISOString().split('T')[0];

const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const loadFromStorage = <T,>(key: string, defaultVal: T): T => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultVal;
};

// --- Components ---

const Header = ({ motivation }: { motivation: MotivationData }) => {
  const nextLevelXp = LEVEL_THRESHOLDS[motivation.level] || 9999;
  const prevLevelXp = LEVEL_THRESHOLDS[motivation.level - 1] || 0;
  const progressPercent = Math.min(100, Math.max(0, ((motivation.xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100));

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold text-slate-800">역할 레벨업 카드</h1>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-bold text-blue-600">LV.{motivation.level}</span>
            <span>XP {motivation.xp}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex flex-col items-end">
             <div className="text-xs font-semibold text-orange-500 flex items-center">
               🔥 {motivation.streak}일 연속
             </div>
             <div className="w-24 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
               <div 
                 className="h-full bg-blue-500 transition-all duration-500" 
                 style={{ width: `${progressPercent}%` }}
               />
             </div>
           </div>
        </div>
      </div>
    </header>
  );
};

// --- Tab 1: Learning Cards ---

const CardView = ({ 
  cards, progress, onUpdateProgress 
}: { 
  cards: LearningCard[], 
  progress: ProgressData, 
  onUpdateProgress: (id: string, scoreDelta: number) => void 
}) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [checkAnswer, setCheckAnswer] = useState<string>('');
  const [checkResult, setCheckResult] = useState<'correct' | 'incorrect' | null>(null);

  const activeCard = cards.find(c => c.id === activeCardId);

  const handleCheckSubmit = () => {
    if (!activeCard) return;
    const isCorrect = checkAnswer.trim().toLowerCase() === activeCard.checkQuestion.answer.toLowerCase();
    setCheckResult(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      onUpdateProgress(activeCard.id, 20); // Bonus for getting check question right
    } else {
      onUpdateProgress(activeCard.id, 5); // Consolation points
    }
  };

  const closeCard = () => {
    setActiveCardId(null);
    setCheckAnswer('');
    setCheckResult(null);
  };

  if (activeCard) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl flex flex-col">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <span className={`px-2 py-1 rounded text-xs font-bold 
                ${activeCard.category === 'intro' ? 'bg-yellow-100 text-yellow-700' : 
                  activeCard.category === 'weak' ? 'bg-green-100 text-green-700' :
                  activeCard.category === 'strong' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {activeCard.category.toUpperCase()}
              </span>
              <button onClick={closeCard} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">{activeCard.title}</h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">"{activeCard.definition}"</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 mb-2">핵심 키워드</h3>
              <div className="flex flex-wrap gap-2">
                {activeCard.keywords.map(k => (
                  <span key={k} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-700 shadow-sm">#{k}</span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-blue-600 mb-1">🏫 학교생활 예시</h3>
                <p className="text-slate-700 bg-blue-50 p-3 rounded-lg text-sm">{activeCard.example}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-500 mb-1">🙅 흔한 오해</h3>
                <div className="bg-red-50 p-3 rounded-lg text-sm">
                  <p className="text-red-800 font-medium mb-1">"{activeCard.misconception.statement}"</p>
                  <p className="text-slate-700">→ {activeCard.misconception.correction}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="font-bold text-slate-800 mb-3">⏱ 10초 체크!</h3>
              <p className="mb-4 text-sm text-slate-700">{activeCard.checkQuestion.question}</p>
              
              {!checkResult ? (
                <div className="flex gap-2">
                  {activeCard.checkQuestion.type === 'OX' ? (
                    <>
                      <button onClick={() => setCheckAnswer('O')} className={`flex-1 py-3 rounded-xl border ${checkAnswer === 'O' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>O</button>
                      <button onClick={() => setCheckAnswer('X')} className={`flex-1 py-3 rounded-xl border ${checkAnswer === 'X' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>X</button>
                    </>
                  ) : (
                    <input 
                      type="text" 
                      placeholder="정답 입력"
                      className="flex-1 p-3 border border-slate-200 rounded-xl"
                      value={checkAnswer}
                      onChange={(e) => setCheckAnswer(e.target.value)}
                    />
                  )}
                  <button 
                    onClick={handleCheckSubmit}
                    disabled={!checkAnswer}
                    className="bg-slate-800 text-white px-6 py-2 rounded-xl disabled:opacity-50 font-bold"
                  >
                    확인
                  </button>
                </div>
              ) : (
                <div className={`p-4 rounded-xl text-center font-bold ${checkResult === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {checkResult === 'correct' ? '정답입니다! (+20 XP)' : '틀렸습니다. 다시 카드를 읽어보세요.'}
                </div>
              )}
            </div>
            
            <button onClick={closeCard} className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200">
              목록으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      <h2 className="text-xl font-bold text-slate-800">학습 카드</h2>
      <div className="grid gap-4">
        {cards.map(card => {
          const p = progress[card.id] || { mastery: 0, learnCount: 0 };
          return (
            <div 
              key={card.id} 
              onClick={() => {
                setActiveCardId(card.id);
                onUpdateProgress(card.id, 5); // Just opening gives small XP
              }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-transform cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-200">
                <div className="bg-blue-500 w-full transition-all duration-700" style={{ height: `${p.mastery}%` }} />
              </div>
              <div className="pl-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-400 uppercase">{card.category}</span>
                  <span className="text-xs font-bold text-blue-600">{p.mastery}%</span>
                </div>
                <h3 className="font-bold text-lg text-slate-800">{card.title}</h3>
                <p className="text-sm text-slate-500 truncate mt-1">{card.definition}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Tab 2: Micro Lab ---

const LabTab = () => {
  const [dataVol, setDataVol] = useState(50);
  const [autonomy, setAutonomy] = useState(50);

  const getResult = () => {
    if (dataVol < 50 && autonomy < 50) return {
      title: "규칙 기반 시스템 (초기 AI)",
      desc: "사람이 정한 규칙대로만 움직여요.",
      role: "인간 90% / AI 10%",
      aiJob: "단순 반복 계산 및 규칙 이행",
      humanJob: "모든 규칙 설계 및 예외 처리",
      safety: "규칙 오류가 없는지 꼼꼼히 검증 필요!",
      color: "text-yellow-600 bg-yellow-50 border-yellow-200"
    };
    if (dataVol >= 50 && autonomy < 60) return {
      title: "약인공지능 (현재)",
      desc: "데이터를 통해 배우지만 특정 문제만 해결해요.",
      role: "인간 50% / AI 50%",
      aiJob: "데이터에서 패턴 발견 및 예측",
      humanJob: "학습 데이터 선별 및 결과 해석",
      safety: "데이터에 편향이 없는지 윤리 점검 필수!",
      color: "text-green-600 bg-green-50 border-green-200"
    };
    return {
      title: "강인공지능 (미래 위험)",
      desc: "많은 데이터로 스스로 판단까지 내려요.",
      role: "인간 20% / AI 80%",
      aiJob: "복잡한 문제 해결 및 자율 의사결정",
      humanJob: "AI의 통제권 관리 및 킬 스위치 확보",
      safety: "⚠️ 과의존 및 통제 불능 위험 경고!",
      color: "text-purple-600 bg-purple-50 border-purple-200"
    };
  };

  const result = getResult();

  return (
    <div className="p-4 space-y-6 pb-24">
      <h2 className="text-xl font-bold text-slate-800">마이크로 실험실 🧪</h2>
      <p className="text-sm text-slate-600">데이터 양과 자율성을 조절하여 AI의 형태와 역할 변화를 관찰해보세요.</p>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-8">
        <div>
          <div className="flex justify-between mb-2">
            <span className="font-bold text-slate-700">데이터 양</span>
            <span className="text-slate-500 text-sm">{dataVol < 30 ? '적음' : dataVol > 70 ? '많음' : '보통'}</span>
          </div>
          <input 
            type="range" min="0" max="100" value={dataVol} 
            onChange={(e) => setDataVol(Number(e.target.value))}
            className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="font-bold text-slate-700">자율성</span>
            <span className="text-slate-500 text-sm">{autonomy < 30 ? '낮음' : autonomy > 70 ? '높음' : '보통'}</span>
          </div>
          <input 
            type="range" min="0" max="100" value={autonomy} 
            onChange={(e) => setAutonomy(Number(e.target.value))}
            className="w-full accent-red-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className={`p-6 rounded-2xl border ${result.color} transition-all duration-500`}>
        <h3 className="text-lg font-bold mb-1">{result.title}</h3>
        <p className="text-sm opacity-80 mb-4">{result.desc}</p>
        
        <div className="bg-white/60 rounded-xl p-4 mb-4">
          <div className="text-center font-bold text-xl mb-1">{result.role}</div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
            <div className="bg-slate-500 h-full" style={{ width: result.role.split('%')[0].replace(/[^0-9]/g, '') + '%' }}></div>
            <div className="bg-blue-500 h-full flex-1"></div>
          </div>
        </div>

        <ul className="space-y-2 text-sm font-medium">
          <li className="flex gap-2"><span className="text-blue-600">🤖</span> {result.aiJob}</li>
          <li className="flex gap-2"><span className="text-slate-600">🧑</span> {result.humanJob}</li>
          <li className="flex gap-2"><span className="text-red-500">🛡</span> {result.safety}</li>
        </ul>
      </div>
    </div>
  );
};

// --- Tab 3: Dictionary ---

const DictTab = () => {
  const [favs, setFavs] = useState<string[]>(() => loadFromStorage(STORAGE_KEYS.DICT_FAV, []));
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFav = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newFavs = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
    setFavs(newFavs);
    saveToStorage(STORAGE_KEYS.DICT_FAV, newFavs);
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <h2 className="text-xl font-bold text-slate-800">용어 더 알아보기</h2>
      <div className="space-y-2">
        {DICTIONARY.map(item => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div 
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50"
            >
              <span className="font-bold text-slate-700">{item.term}</span>
              <div className="flex items-center gap-3">
                <button onClick={(e) => toggleFav(e, item.id)} className="text-xl">
                  {favs.includes(item.id) ? '⭐' : '☆'}
                </button>
                <span className="text-slate-400 text-xs">{openId === item.id ? '▲' : '▼'}</span>
              </div>
            </div>
            {openId === item.id && (
              <div className="px-4 pb-4 pt-0 text-sm text-slate-600 bg-slate-50 border-t border-slate-100">
                <div className="pt-3">{item.description}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Tab 4: Quiz ---

const QuizTab = ({ 
  onComplete 
}: { 
  onComplete: (score: number, wrongs: WrongNote[], difficulty: 'easy' | 'normal' | 'hard') => void 
}) => {
  const [stage, setStage] = useState<'menu' | 'quiz' | 'result'>('menu');
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]); // Current session answers
  const [feedback, setFeedback] = useState<null | { isCorrect: boolean, msg: string, correction: string }>(null);
  const [sessionWrongs, setSessionWrongs] = useState<WrongNote[]>([]);

  const startQuiz = (diff: 'easy' | 'normal' | 'hard') => {
    setDifficulty(diff);
    // Simple filter. In real app, randomize and pick 10.
    const qSet = QUIZ_POOL.filter(q => q.difficulty === diff).slice(0, 10); 
    setQuestions(qSet);
    setCurrentIndex(0);
    setUserAnswers([]);
    setFeedback(null);
    setSessionWrongs([]);
    setStage('quiz');
  };

  const handleAnswer = (answer: string) => {
    const q = questions[currentIndex];
    let isCorrect = false;

    if (q.type === 'multiple') {
      isCorrect = answer === q.correctAnswer;
    } else if (q.type === 'short') {
      const cleanAns = answer.trim().replace(/ /g, '').toLowerCase();
      const correctArr = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
      isCorrect = correctArr.some(c => c.replace(/ /g, '').toLowerCase() === cleanAns);
    } else if (q.type === 'essay') {
      // Rubric: length > 10 and contains at least 1 keyword
      isCorrect = answer.length > 10 && (q.keywords?.some(k => answer.includes(k)) ?? false);
    }

    const currentFeedback = {
      isCorrect,
      msg: isCorrect ? '정답입니다!' : q.explanation,
      correction: isCorrect ? '' : q.correction
    };
    
    setFeedback(currentFeedback);
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    if (!isCorrect) {
      setSessionWrongs(prev => [...prev, {
        questionId: q.id,
        timestamp: getTodayString(),
        userAnswer: answer,
        conceptTag: q.conceptTag,
        difficulty: q.difficulty,
        mastery: 0
      }]);
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const score = questions.reduce((acc, q, idx) => {
      // Re-evaluate or store correctness in state. 
      // For simplicity, checking sessionWrongs isn't perfect if we want partial credit for essays, 
      // but matching logic here:
      const wrong = sessionWrongs.find(w => w.questionId === q.id);
      return wrong ? acc : acc + 10; // 10 points per Q
    }, 0);
    
    onComplete(score, sessionWrongs, difficulty);
    setStage('result');
  };

  if (stage === 'menu') {
    return (
      <div className="p-4 space-y-6 pb-24 text-center">
        <h2 className="text-xl font-bold text-slate-800">도전! AI 역할 퀴즈</h2>
        <div className="space-y-3">
          <button onClick={() => startQuiz('easy')} className="w-full p-4 bg-green-100 text-green-800 rounded-xl font-bold hover:bg-green-200 transition">
            쉬움 (기초 개념)
          </button>
          <button onClick={() => startQuiz('normal')} className="w-full p-4 bg-blue-100 text-blue-800 rounded-xl font-bold hover:bg-blue-200 transition">
            보통 (응용 사례)
          </button>
          <button onClick={() => startQuiz('hard')} className="w-full p-4 bg-purple-100 text-purple-800 rounded-xl font-bold hover:bg-purple-200 transition">
            도전 (심화 사고)
          </button>
        </div>
      </div>
    );
  }

  if (stage === 'result') {
     const score = questions.length * 10 - sessionWrongs.length * 10;
     return (
       <div className="p-4 space-y-6 pb-24 text-center">
         <h2 className="text-2xl font-bold text-slate-800">퀴즈 결과</h2>
         <div className="text-6xl font-black text-blue-600 my-8">{score}점</div>
         <p className="text-slate-600 mb-6">
           {sessionWrongs.length === 0 ? "완벽해요! 모든 개념을 마스터했습니다. 🎉" : `${sessionWrongs.length}문제를 틀렸어요. 오답노트를 확인해보세요.`}
         </p>
         <button onClick={() => setStage('menu')} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold">돌아가기</button>
       </div>
     );
  }

  const q = questions[currentIndex];

  return (
    <div className="p-4 pb-24 max-w-md mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 text-xs font-bold text-slate-400">
        <span>{difficulty.toUpperCase()}</span>
        <span>{currentIndex + 1} / {questions.length}</span>
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-800 mb-6 leading-relaxed">{q.question}</h3>
        
        {!feedback && (
          <div className="space-y-3">
            {q.type === 'multiple' && q.options?.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => handleAnswer(String(i + 1))}
                className="w-full text-left p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition font-medium"
              >
                {opt}
              </button>
            ))}
            {q.type !== 'multiple' && (
              <div className="flex flex-col gap-3">
                {q.type === 'essay' && <p className="text-xs text-slate-500">*2문장 이상, 핵심 키워드 포함 시 정답</p>}
                <textarea 
                  className="w-full p-4 border border-slate-200 rounded-xl h-32 resize-none"
                  placeholder={q.type === 'short' ? "단답형 정답 입력" : "서술형 답안 입력"}
                  id="text-answer"
                />
                <button 
                  onClick={() => {
                    const el = document.getElementById('text-answer') as HTMLTextAreaElement;
                    if(el.value) handleAnswer(el.value);
                  }}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold"
                >
                  제출
                </button>
              </div>
            )}
          </div>
        )}

        {feedback && (
          <div className="space-y-4 animate-fade-in">
            <div className={`p-5 rounded-xl border ${feedback.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className={`font-bold text-lg mb-2 ${feedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {feedback.isCorrect ? '⭕ 정답입니다!' : '❌ 틀렸습니다'}
              </div>
              {!feedback.isCorrect && (
                <>
                  <p className="text-sm font-bold text-slate-700 mb-1">이유:</p>
                  <p className="text-sm text-slate-600 mb-3">{feedback.msg}</p>
                  <p className="text-sm font-bold text-slate-700 mb-1">교정:</p>
                  <p className="text-sm text-slate-600">{feedback.correction}</p>
                </>
              )}
            </div>
            
            {/* Retry Logic for simple reinforcement if wrong */}
            {!feedback.isCorrect && q.retryQuestion && (
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-blue-500 mb-2">🔄 재도전! (점수 없음)</p>
                <p className="text-sm font-medium mb-3">{q.retryQuestion.question}</p>
                {q.retryQuestion.type === 'OX' && (
                   <div className="flex gap-2">
                     <button className="flex-1 py-1 border rounded text-sm hover:bg-slate-50">O</button>
                     <button className="flex-1 py-1 border rounded text-sm hover:bg-slate-50">X</button>
                   </div>
                )}
              </div>
            )}

            <button onClick={nextQuestion} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold mt-4">
              {currentIndex < questions.length - 1 ? '다음 문제' : '결과 보기'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Tab 5: Think ---

const ThinkTab = ({ onUpdateProgress }: { onUpdateProgress: (tag: string, xp: number) => void }) => {
  const [text, setText] = useState('');
  const [checked, setChecked] = useState([false, false]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (text.length < 10) return;
    setSubmitted(true);
    onUpdateProgress('think', 30);
  };

  if (submitted) {
     return (
       <div className="p-8 text-center h-full flex flex-col justify-center">
         <div className="text-4xl mb-4">🤔 ✨</div>
         <h2 className="text-xl font-bold text-slate-800 mb-2">생각 정리 완료!</h2>
         <p className="text-slate-600">스스로 점검하며 AI 윤리관을 튼튼히 다졌습니다.</p>
         <button 
          onClick={() => { setSubmitted(false); setText(''); setChecked([false, false]); }}
          className="mt-8 text-blue-600 font-bold underline"
         >
           다른 주제 생각하기
         </button>
       </div>
     );
  }

  return (
    <div className="p-4 pb-24 space-y-6">
      <h2 className="text-xl font-bold text-slate-800">생각해볼 문제 🤔</h2>
      
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded mb-2">조건 바꾸기</span>
        <p className="font-medium text-slate-800 mb-4">
          만약 학교폭력을 감지하는 CCTV AI가 도입된다면, 
          학생들의 사생활 침해 논란을 막기 위해 인간(선생님, 학생)은 어떤 규칙을 정해야 할까?
        </p>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border border-slate-200 rounded-xl h-32 resize-none text-sm mb-4 focus:ring-2 ring-blue-500 outline-none"
          placeholder="나의 생각을 2~3문장으로 적어보세요."
        />
        
        <div className="space-y-2 mb-4">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" checked={checked[0]} onChange={() => setChecked([true, checked[1]])} className="accent-blue-600" />
            AI를 맹신하지 않고 인간의 검토 과정을 포함했나요?
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input type="checkbox" checked={checked[1]} onChange={() => setChecked([checked[0], true])} className="accent-blue-600" />
            개인정보 보호(얼굴 모자이크 등) 방법을 고려했나요?
          </label>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={!checked[0] || !checked[1] || text.length < 10}
          className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold disabled:opacity-50"
        >
          제출하고 XP 받기
        </button>
      </div>
    </div>
  );
};

// --- Main App Layout ---

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  
  // States
  const [progress, setProgress] = useState<ProgressData>(() => loadFromStorage(STORAGE_KEYS.PROGRESS, {}));
  const [motivation, setMotivation] = useState<MotivationData>(() => loadFromStorage(STORAGE_KEYS.MOTIVATION, {
    xp: 0, level: 1, badges: [], streak: 0, lastActivityDate: '', dailyActivities: 0
  }));
  const [wrongNotes, setWrongNotes] = useState<WrongNote[]>(() => loadFromStorage(STORAGE_KEYS.WRONG, []));

  // Persistence
  useEffect(() => saveToStorage(STORAGE_KEYS.PROGRESS, progress), [progress]);
  useEffect(() => saveToStorage(STORAGE_KEYS.MOTIVATION, motivation), [motivation]);
  useEffect(() => saveToStorage(STORAGE_KEYS.WRONG, wrongNotes), [wrongNotes]);

  // Gamification Logic
  const addXp = useCallback((amount: number) => {
    setMotivation(prev => {
      const newXp = prev.xp + amount;
      // Level Up Check
      let newLevel = prev.level;
      while (newLevel < LEVEL_THRESHOLDS.length && newXp >= LEVEL_THRESHOLDS[newLevel]) {
        newLevel++;
      }
      
      // Streak Check
      const today = getTodayString();
      let newStreak = prev.streak;
      let newDaily = prev.dailyActivities + 1;
      let newLastDate = prev.lastActivityDate;

      if (prev.lastActivityDate !== today) {
        newDaily = 1;
        // Check if yesterday was active
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (prev.lastActivityDate === yesterday.toISOString().split('T')[0]) {
          // kept streak
        } else {
          newStreak = 0; // reset if missed a day
        }
        newLastDate = today;
      }

      if (newDaily === 2) { // Threshold for streak increment
        newStreak += 1;
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        dailyActivities: newDaily,
        lastActivityDate: newLastDate
      };
    });
  }, []);

  const handleCardProgress = (id: string, xpBonus: number) => {
    setProgress(prev => ({
      ...prev,
      [id]: {
        mastery: Math.min(100, (prev[id]?.mastery || 0) + 25), // Increase mastery
        learnCount: (prev[id]?.learnCount || 0) + 1,
        lastLearned: new Date().toISOString()
      }
    }));
    addXp(xpBonus);
  };

  const handleQuizComplete = (score: number, newWrongs: WrongNote[], diff: string) => {
    addXp(score);
    setWrongNotes(prev => [...prev, ...newWrongs]);
  };

  // Badge Check Effect
  useEffect(() => {
    const newBadges = BADGES.filter(b => 
      !motivation.badges.includes(b.id) && b.condition(progress, motivation, wrongNotes)
    );
    if (newBadges.length > 0) {
      // Toast or Modal could go here. Simple alert for now as per constraints.
      // In a real app, use a toast component.
      setMotivation(prev => ({
        ...prev,
        badges: [...prev.badges, ...newBadges.map(b => b.id)]
      }));
    }
  }, [progress, motivation, wrongNotes]);

  // Recommended Widget (Add-on)
  const recommendations = Object.entries(progress)
    .sort(([, a], [, b]) => (a as CardProgress).mastery - (b as CardProgress).mastery)
    .slice(0, 1)
    .map(([id]) => LEARNING_CARDS.find(c => c.id === id)?.title)
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 mx-auto max-w-md shadow-2xl overflow-hidden relative">
      <Header motivation={motivation} />
      
      {recommendations.length > 0 && activeTab === 0 && (
        <div className="bg-orange-50 px-4 py-2 border-b border-orange-100 flex items-center justify-between">
          <span className="text-xs font-bold text-orange-700">🎯 오늘의 추천 학습: {recommendations[0]}</span>
          <span className="text-xs text-orange-400">Mastery Low</span>
        </div>
      )}

      <main className="flex-1 overflow-y-auto">
        {activeTab === 0 && <CardView cards={LEARNING_CARDS} progress={progress} onUpdateProgress={handleCardProgress} />}
        {activeTab === 1 && <LabTab />}
        {activeTab === 2 && <DictTab />}
        {activeTab === 3 && <QuizTab onComplete={handleQuizComplete} />}
        {activeTab === 4 && <ThinkTab onUpdateProgress={(tag, xp) => addXp(xp)} />}
      </main>

      {/* Tab Bar */}
      <nav className="bg-white border-t border-slate-200 sticky bottom-0 w-full z-50">
        <div className="flex justify-around items-center h-16">
          {[
            { label: '카드', icon: '🃏' },
            { label: '실험', icon: '🧪' },
            { label: '용어', icon: '📚' },
            { label: '퀴즈', icon: '✏️' },
            { label: '생각', icon: '🤔' },
          ].map((tab, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 
                ${activeTab === idx ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[10px] font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}