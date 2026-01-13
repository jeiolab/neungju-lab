import React, { useState, useEffect } from 'react';
import { BookOpen, Brain, MessageSquare, Award, CheckCircle2, ChevronRight, XCircle, RotateCcw, Lightbulb, LayoutGrid } from 'lucide-react';
import { TabView, UserStats, Concept, QuizQuestion, ThinkingPrompt, Difficulty } from './types';
import { CONCEPTS, LEVEL_THRESHOLDS, MAX_LEVEL, OX_QUIZ_DATA, QUIZ_QUESTIONS, THINKING_PROMPTS } from './constants';

// --- Components ---

const ProgressBar = ({ current, max, color = 'bg-blue-500' }: { current: number; max: number; color?: string }) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div className={`h-2.5 rounded-full transition-all duration-500 ${color}`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const BadgeModal = ({ level, onClose }: { level: number; onClose: () => void }) => {
  const titles = ["", "초보 에이전트", "학습 에이전트", "스마트 에이전트", "전문가 에이전트", "마스터 에이전트"];
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform transition-all scale-100">
        <Award className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">레벨 업!</h2>
        <p className="text-gray-600 mb-4">축하합니다! <br/><span className="font-bold text-blue-600 text-lg">Lv.{level} {titles[level]}</span>가 되었습니다.</p>
        <button onClick={onClose} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors">
          확인
        </button>
      </div>
    </div>
  );
};

// --- Tabs ---

const ConceptTab = ({ onRead }: { onRead: (id: string) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const concept = CONCEPTS[currentIndex];

  const handleNext = () => {
    onRead(concept.id);
    setCurrentIndex((prev) => (prev + 1) % CONCEPTS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CONCEPTS.length) % CONCEPTS.length);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-8 px-4">
      <div className="relative bg-white w-full max-w-4xl min-h-[500px] rounded-3xl shadow-xl p-8 md:p-12 flex flex-col justify-between border border-gray-100 transition-all">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <span className="bg-blue-50 text-blue-700 text-sm font-bold px-4 py-1.5 rounded-full border border-blue-100">
              Concept Card {currentIndex + 1} / {CONCEPTS.length}
            </span>
            <Brain className="text-blue-500 w-8 h-8" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Content */}
            <div className="flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight break-keep">
                {concept.title}
              </h2>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">정의</h3>
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed font-medium">
                  {concept.definition}
                </p>
              </div>
            </div>

            {/* Right Content */}
            <div className="space-y-6 flex flex-col justify-center">
              <div className="transform transition-all hover:-translate-y-1 duration-300">
                <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wider mb-2 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1"/> 예시
                </h3>
                <p className="bg-green-50 border border-green-100 p-5 rounded-2xl text-green-800 text-base md:text-lg shadow-sm">
                  {concept.example}
                </p>
              </div>
              
              <div className="transform transition-all hover:-translate-y-1 duration-300">
                <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-2 flex items-center">
                  <XCircle className="w-4 h-4 mr-1"/> 오개념 주의
                </h3>
                <p className="bg-red-50 border border-red-100 p-5 rounded-2xl text-red-800 text-base md:text-lg shadow-sm">
                  {concept.misconception}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-100">
          <button 
            onClick={handlePrev} 
            className="px-6 py-3 text-gray-500 hover:text-gray-800 font-medium transition-colors hover:bg-gray-50 rounded-lg"
          >
            이전 카드
          </button>
          <div className="flex space-x-2">
            {CONCEPTS.map((_, idx) => (
              <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-blue-500 w-6' : 'bg-gray-200'}`} />
            ))}
          </div>
          <button 
            onClick={handleNext} 
            className="flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-blue-200"
          >
            다음 <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

const OXQuizTab = ({ onCorrect }: { onCorrect: () => void }) => {
  const [qIndex, setQIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg: string } | null>(null);

  const currentQ = OX_QUIZ_DATA[qIndex];

  const handleAnswer = (answer: boolean) => {
    if (feedback) return; 

    const isCorrect = currentQ.a === answer;
    setFeedback({
      isCorrect,
      msg: isCorrect ? "정답입니다! +10 XP" : `틀렸습니다. ${currentQ.exp}`
    });

    if (isCorrect) onCorrect();
  };

  const nextQuestion = () => {
    setFeedback(null);
    setQIndex((prev) => (prev + 1) % OX_QUIZ_DATA.length);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full py-8 px-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10 md:p-16 text-center min-h-[500px] flex flex-col justify-center relative overflow-hidden border border-gray-100">
        {feedback && (
          <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm p-6 animate-fadeIn`}>
             {feedback.isCorrect ? (
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                 <CheckCircle2 className="w-10 h-10 text-green-600" />
               </div>
             ) : (
               <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                 <XCircle className="w-10 h-10 text-red-600" />
               </div>
             )}
             <p className={`text-3xl font-bold mb-3 ${feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
               {feedback.isCorrect ? "Correct!" : "Wrong!"}
             </p>
             <p className="text-gray-600 mb-8 text-lg max-w-lg">{feedback.msg}</p>
             <button onClick={nextQuestion} className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all transform hover:scale-105 shadow-lg">
               다음 문제 풀기
             </button>
          </div>
        )}

        <div className="mb-8">
          <span className="text-blue-600 bg-blue-50 px-4 py-2 rounded-lg font-bold tracking-widest text-sm uppercase">OX Quiz #{currentQ.id}</span>
        </div>
        
        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-16 leading-snug break-keep">
          "{currentQ.q}"
        </h3>

        <div className="flex gap-8 justify-center">
          <button 
            onClick={() => handleAnswer(true)}
            className="group relative w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-blue-100 text-blue-500 hover:bg-blue-600 hover:border-blue-600 hover:text-white text-5xl font-bold transition-all flex items-center justify-center shadow-sm hover:shadow-blue-200 hover:shadow-xl"
          >
            <span className="relative z-10">O</span>
          </button>
          <button 
            onClick={() => handleAnswer(false)}
            className="group relative w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-red-100 text-red-500 hover:bg-red-600 hover:border-red-600 hover:text-white text-5xl font-bold transition-all flex items-center justify-center shadow-sm hover:shadow-red-200 hover:shadow-xl"
          >
            <span className="relative z-10">X</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const DictionaryTab = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-8 px-4 h-full">
      <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mr-4">
           <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">심화 학습 사전</h2>
          <p className="text-gray-500 text-sm">지능 에이전트에 대한 더 깊은 지식</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold text-blue-700 mb-4 pb-2 border-b border-blue-50">지능 에이전트 vs 일반 프로그램</h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            일반 프로그램은 개발자가 미리 정해둔 규칙(if-then)에 따라서만 동작합니다. 
            반면, <strong>지능 에이전트</strong>는 학습과 추론을 통해 예상하지 못한 새로운 상황에서도 스스로 최적의 행동을 찾아냅니다.
          </p>
          <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 border border-gray-100">
            <span className="font-bold text-gray-800 block mb-1">💡 예시 비교</span>
            일반 세탁기(시간 설정대로만 작동) vs <br/>AI 세탁기(옷감의 무게와 오염도를 스스로 판단)
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-2">
          <h3 className="text-xl font-bold text-blue-700 mb-6 pb-2 border-b border-blue-50">4대 특성 심층 분석</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
              <strong className="text-indigo-900 block text-lg mb-2">1. 자율성 (Autonomy)</strong>
              <span className="text-indigo-800 text-sm leading-relaxed">배터리가 없을 때 스스로 충전하는 로봇청소기처럼, 인간의 개입 없이 스스로 제어권을 가집니다.</span>
            </div>
            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
              <strong className="text-green-900 block text-lg mb-2">2. 반응성 (Reactivity)</strong>
              <span className="text-green-800 text-sm leading-relaxed">센서로 환경을 끊임없이 감지합니다. 자율주행차가 장애물을 피하는 것은 반응성의 대표적 예시입니다.</span>
            </div>
            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-100">
              <strong className="text-yellow-900 block text-lg mb-2">3. 능동성 (Pro-activeness)</strong>
              <span className="text-yellow-800 text-sm leading-relaxed">단순 반응을 넘어, '목표'를 향해 먼저 행동합니다. 사용자가 명령하기 전에 제안하는 AI 비서가 예입니다.</span>
            </div>
             <div className="p-4 rounded-xl bg-red-50 border border-red-100">
              <strong className="text-red-900 block text-lg mb-2">4. 사회성 (Social Ability)</strong>
              <span className="text-red-800 text-sm leading-relaxed">에이전트 통신 언어(ACL)를 사용하여 정보를 교환합니다. 다수의 드론이 협력하여 군집 비행을 하는 것이 사회성입니다.</span>
            </div>
          </div>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
           <h3 className="text-xl font-bold text-blue-700 mb-4 pb-2 border-b border-blue-50">교과서 밖 지식: 튜링 테스트</h3>
           <p className="text-gray-600 leading-relaxed">
             앨런 튜링이 제안한 인공지능 판별법입니다. 질문자가 컴퓨터와 대화를 나눴을 때, 상대가 사람인지 컴퓨터인지 구별할 수 없다면 그 컴퓨터는 '지능이 있다'고 간주합니다. 오늘날의 챗봇은 이 튜링 테스트에 끊임없이 도전하고 있습니다.
           </p>
        </section>
      </div>
    </div>
  );
};

const QuizTestTab = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const startQuiz = (diff: Difficulty) => {
    let pool = [...QUIZ_QUESTIONS];
    pool.sort((a, b) => (a.difficulty === diff ? -1 : 1));
    const selected = pool.slice(0, 10).sort(() => Math.random() - 0.5);
    setQuestions(selected);
    setDifficulty(diff);
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleSelect = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    const isCorrect = idx === questions[currentIndex].correctIndex;
    if (isCorrect) setScore(s => s + 1);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setShowResult(true);
      onComplete(score + (selectedAnswer === questions[currentIndex].correctIndex ? 0 : 0)); 
    }
  };

  if (!difficulty) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-12 px-4">
        <div className="max-w-4xl w-full text-center">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">실전 능력 테스트</h2>
            <p className="text-xl text-gray-500">도전할 난이도를 선택하세요. 10문제가 출제됩니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['하', '중', '상'] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => startQuiz(d)}
                className={`group p-8 rounded-3xl border-2 text-2xl font-bold transition-all hover:-translate-y-2 hover:shadow-xl
                  ${d === '하' ? 'border-green-200 bg-green-50 hover:bg-green-500 hover:border-green-500 hover:text-white text-green-700' : ''}
                  ${d === '중' ? 'border-blue-200 bg-blue-50 hover:bg-blue-500 hover:border-blue-500 hover:text-white text-blue-700' : ''}
                  ${d === '상' ? 'border-purple-200 bg-purple-50 hover:bg-purple-500 hover:border-purple-500 hover:text-white text-purple-700' : ''}
                `}
              >
                <span className="block mb-2 text-sm opacity-60 font-medium tracking-widest">DIFFICULTY</span>
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-12 px-4 animate-fadeIn">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-lg w-full border border-gray-100">
          <Award className="w-32 h-32 text-yellow-500 mx-auto mb-8 animate-bounce" />
          <h2 className="text-4xl font-bold text-gray-800 mb-4">테스트 완료!</h2>
          <p className="text-gray-500 text-lg mb-8">당신의 지능 에이전트 이해도는?</p>
          <div className="text-7xl font-black text-blue-600 mb-2">{score * 10}</div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Points Scored</div>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-8">
            <p className="text-gray-600 font-medium">획득 경험치: <span className="text-blue-600 font-bold">+{score * 20} XP</span></p>
          </div>

          <button 
            onClick={() => setDifficulty(null)}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center text-lg shadow-lg shadow-blue-200"
          >
            <RotateCcw className="w-5 h-5 mr-2" /> 다른 난이도 도전하기
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 h-full flex flex-col">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col flex-1">
        {/* Header */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
           <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                ${currentQ.difficulty === '하' ? 'bg-green-100 text-green-700' : 
                  currentQ.difficulty === '중' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                {currentQ.difficulty} Level
              </span>
              <span className="text-gray-400 font-medium">Question {currentIndex + 1} of {questions.length}</span>
           </div>
           <div className="text-blue-600 font-bold">Score: {score}</div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 leading-snug">
            {currentQ.question}
          </h3>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {currentQ.options.map((opt, idx) => {
              let stateClass = "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300";
              if (selectedAnswer !== null) {
                if (idx === currentQ.correctIndex) stateClass = "bg-green-50 border-green-500 text-green-800 ring-1 ring-green-500";
                else if (idx === selectedAnswer) stateClass = "bg-red-50 border-red-500 text-red-800 ring-1 ring-red-500";
                else stateClass = "bg-gray-50 border-gray-100 text-gray-300";
              }
              
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selectedAnswer !== null}
                  className={`p-6 rounded-2xl border-2 text-left transition-all font-medium text-lg flex items-center ${stateClass}`}
                >
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 text-sm font-bold flex-shrink-0
                     ${selectedAnswer !== null && idx === currentQ.correctIndex ? 'border-green-600 bg-green-200 text-green-800' : 'border-gray-300 text-gray-400'}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="bg-blue-50 p-6 rounded-2xl animate-fadeIn border border-blue-100">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                   <p className="font-bold text-blue-900 mb-1">해설</p>
                   <p className="text-blue-800 leading-relaxed">{currentQ.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-end">
           {selectedAnswer !== null ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg flex items-center"
            >
              {currentIndex < questions.length - 1 ? "다음 문제" : "결과 확인"} <ChevronRight className="ml-2 w-4 h-4"/>
            </button>
           ) : (
             <div className="text-gray-400 text-sm font-medium italic">정답을 선택해주세요.</div>
           )}
        </div>
      </div>
    </div>
  );
};

const ThinkingTab = ({ onSave }: { onSave: () => void }) => {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const prompt = THINKING_PROMPTS[index];

  const handleSave = () => {
    if (answer.trim().length < 10) {
      alert("최소 10자 이상 적어주세요!");
      return;
    }
    onSave();
    setAnswer("");
    alert("생각이 기록되었습니다! +15 XP");
    setIndex((prev) => (prev + 1) % THINKING_PROMPTS.length);
  };

  return (
    <div className="flex justify-center py-12 px-4 h-full w-full">
      <div className="bg-white p-10 md:p-12 rounded-[2rem] shadow-xl border border-gray-100 max-w-4xl w-full flex flex-col md:flex-row gap-12">
        {/* Left: Prompt */}
        <div className="md:w-1/3 flex flex-col">
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 p-3 rounded-2xl mr-4">
              <Lightbulb className="text-purple-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">생각 넓히기</h2>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100 flex-1">
             <div className="text-purple-400 font-bold text-xs uppercase tracking-widest mb-2">Topic #{prompt.id}</div>
             <h3 className="font-bold text-purple-900 text-xl mb-4 leading-tight">{prompt.title}</h3>
             <p className="text-purple-800 leading-relaxed">
               {prompt.prompt}
             </p>
          </div>
        </div>

        {/* Right: Input */}
        <div className="md:w-2/3 flex flex-col">
          <label className="text-gray-500 font-bold mb-3 block text-sm">나의 생각 작성하기</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="자유롭게 자신의 생각을 적어보세요. (최소 10자)"
            className="w-full flex-1 p-6 rounded-3xl border-2 border-gray-100 resize-none focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 bg-gray-50 text-gray-700 mb-6 transition-all text-lg leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-purple-200 hover:-translate-y-1"
            >
              기록 저장하고 XP 받기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<TabView>(TabView.CONCEPT);
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    conceptsRead: [],
    quizzesSolved: 0,
    unlockedBadges: []
  });
  const [showLevelModal, setShowLevelModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('intelligent-agent-mastery');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('intelligent-agent-mastery', JSON.stringify(stats));
  }, [stats]);

  const addXp = (amount: number) => {
    setStats(prev => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      
      for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (newXp >= LEVEL_THRESHOLDS[i]) {
          const calculatedLevel = i + 1;
          if (calculatedLevel > prev.level) {
            newLevel = calculatedLevel;
            setShowLevelModal(true);
          }
          break;
        }
      }

      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  const handleConceptRead = (id: string) => {
    if (!stats.conceptsRead.includes(id)) {
      setStats(prev => ({ ...prev, conceptsRead: [...prev.conceptsRead, id] }));
      addXp(10);
    }
  };

  const navItems = [
    { id: TabView.CONCEPT, label: '개념 학습', icon: Brain },
    { id: TabView.OX, label: 'OX 퀴즈', icon: CheckCircle2 },
    { id: TabView.DICTIONARY, label: '심화 사전', icon: BookOpen },
    { id: TabView.TEST, label: '실전 테스트', icon: Award },
    { id: TabView.THINKING, label: '생각 넓히기', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
      {/* Web Header (Top Navigation) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm/50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
           {/* Logo Section */}
           <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab(TabView.CONCEPT)}>
             <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
               <Brain className="w-6 h-6" />
             </div>
             <div className="hidden md:block">
               <h1 className="text-xl font-bold text-gray-900">지능 에이전트</h1>
               <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Concept Master</p>
             </div>
           </div>

           {/* Desktop Navigation */}
           <nav className="hidden md:flex space-x-1 bg-gray-100/50 p-1.5 rounded-xl border border-gray-100">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === item.id 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
                >
                  <item.icon className={`w-4 h-4 mr-2 ${activeTab === item.id ? 'fill-current opacity-20' : ''}`} />
                  {item.label}
                </button>
              ))}
           </nav>

           {/* User Stats */}
           <div className="flex items-center pl-6">
              <div className="flex flex-col items-end mr-3">
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level {stats.level}</span>
                 <span className="text-sm font-bold text-gray-800">{stats.xp} XP</span>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-gray-100 p-1">
                 <div className="w-full h-full bg-gray-100 rounded-full overflow-hidden relative">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-blue-500 transition-all duration-1000"
                      style={{ height: `${Math.min(100, (stats.xp / (LEVEL_THRESHOLDS[stats.level] || 9999)) * 100)}%` }} 
                    />
                 </div>
              </div>
           </div>
        </div>
        
        {/* Mobile Navigation (Horizontal Scroll) */}
        <div className="md:hidden overflow-x-auto border-t border-gray-100 no-scrollbar">
           <div className="flex px-4 py-2 space-x-2 min-w-max">
             {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' 
                      : 'bg-white text-gray-500 border-gray-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
           </div>
        </div>
      </header>

      {/* Main Content Area - Full Width/Height for Web */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 md:pt-12">
        {activeTab === TabView.CONCEPT && <ConceptTab onRead={handleConceptRead} />}
        {activeTab === TabView.OX && <OXQuizTab onCorrect={() => addXp(10)} />}
        {activeTab === TabView.DICTIONARY && <DictionaryTab />}
        {activeTab === TabView.TEST && <QuizTestTab onComplete={(score) => addXp(score * 20)} />}
        {activeTab === TabView.THINKING && <ThinkingTab onSave={() => addXp(15)} />}
      </main>

      {/* Footer info for web */}
      <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-200 mt-auto bg-white">
        <p>© 2024 Intelligent Agent Master. Educational Purpose Only.</p>
      </footer>

      {/* Level Up Modal */}
      {showLevelModal && (
        <BadgeModal level={stats.level} onClose={() => setShowLevelModal(false)} />
      )}
    </div>
  );
}
