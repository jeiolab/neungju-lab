import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Cpu, 
  Layout, 
  Lightbulb, 
  Map, 
  User, 
  CheckCircle,
  Trophy,
  Flame,
  ChevronRight,
  BrainCircuit,
  Save,
  RotateCcw,
  Share2
} from 'lucide-react';
import { 
  Tab, 
  UserProfile, 
  WizardData, 
  ProjectPlan, 
  SimulationState, 
  QuizQuestion 
} from './types';
import { THEORY_CARDS, CAREER_CARDS, QUIZ_DATA } from './constants';
import { generateProjectPlanAI } from './services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

// --- Sub-components (defined in same file for brevity as per instructions structure) ---

const TheoryTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
    {THEORY_CARDS.map((card, idx) => (
      <div key={idx} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-blue-500">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{card.title}</h3>
          <div className="p-2 bg-blue-100 rounded-full text-blue-600">
             {/* Simple icon mapping based on index/name since we can't dynamic import easily here */}
             <Cpu size={24} />
          </div>
        </div>
        <p className="text-gray-600 mb-4 h-20">{card.desc}</p>
        <div>
          <h4 className="text-sm font-semibold text-gray-500 mb-2">필요 핵심 역량</h4>
          <div className="flex flex-wrap gap-2">
            {card.skills.map((skill, sIdx) => (
              <span key={sIdx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const SimulationTab = () => {
  const [state, setState] = useState<SimulationState>({
    dataQuality: false,
    ethicsCheck: false,
    feasibility: false,
    teamRole: false,
    feedback: "프로젝트 점검을 시작해보세요.",
    score: 0
  });

  useEffect(() => {
    let s = 0;
    if (state.dataQuality) s += 25;
    if (state.ethicsCheck) s += 25;
    if (state.feasibility) s += 25;
    if (state.teamRole) s += 25;
    
    let fb = "";
    if (s === 100) fb = "완벽한 계획입니다! 바로 실행에 옮겨도 좋겠어요.";
    else if (s >= 75) fb = "훌륭합니다. 부족한 한 가지를 보완해볼까요?";
    else if (s >= 50) fb = "기본적인 구조는 잡혔네요. 디테일을 챙겨보세요.";
    else fb = "아직 준비 단계군요. 체크리스트를 하나씩 확인해보세요.";
    
    setState(prev => ({ ...prev, score: s, feedback: fb }));
  }, [state.dataQuality, state.ethicsCheck, state.feasibility, state.teamRole]);

  const toggle = (key: keyof SimulationState) => {
    setState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const data = [
    { name: '점수', value: state.score },
    { name: '남은 점수', value: 100 - state.score },
  ];
  const COLORS = ['#10B981', '#E5E7EB'];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1 bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <CheckCircle className="text-green-500" /> 프로젝트 파이프라인 점검
        </h3>
        <div className="space-y-4">
          <div onClick={() => toggle('dataQuality')} className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${state.dataQuality ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${state.dataQuality ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {state.dataQuality && <CheckCircle size={16} className="text-white" />}
              </div>
              <span className="font-medium">데이터의 출처가 명확하고 신뢰할 수 있나요?</span>
            </div>
          </div>
          <div onClick={() => toggle('ethicsCheck')} className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${state.ethicsCheck ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${state.ethicsCheck ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {state.ethicsCheck && <CheckCircle size={16} className="text-white" />}
              </div>
              <span className="font-medium">개인정보 보호 등 윤리적 문제를 검토했나요?</span>
            </div>
          </div>
          <div onClick={() => toggle('feasibility')} className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${state.feasibility ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
             <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${state.feasibility ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {state.feasibility && <CheckCircle size={16} className="text-white" />}
              </div>
              <span className="font-medium">학생 수준에서 실현 가능한 기술과 예산인가요?</span>
            </div>
          </div>
           <div onClick={() => toggle('teamRole')} className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${state.teamRole ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
             <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${state.teamRole ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {state.teamRole && <CheckCircle size={16} className="text-white" />}
              </div>
              <span className="font-medium">나의 강점을 살릴 수 있는 역할인가요?</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold text-gray-700 mb-2">실현 가능성 점수</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-gray-700">
                {state.score}점
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg w-full text-center">
          <p className="text-gray-800 font-medium">{state.feedback}</p>
        </div>
      </div>
    </div>
  );
};

const ExploreTab = ({ onSaveInterest }: { onSaveInterest: (job: string) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {CAREER_CARDS.map((card) => (
      <div key={card.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:border-purple-300 transition-all group">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-purple-700 group-hover:text-purple-900">{card.title}</h3>
          <button 
            onClick={() => onSaveInterest(card.title)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="관심 저장"
          >
            <Flame size={20} />
          </button>
        </div>
        <p className="text-gray-600 text-sm mb-4 min-h-[40px]">{card.description}</p>
        
        <div className="mb-4">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tech Stack</h4>
          <div className="flex gap-2">
            {card.techStack.map(ts => (
              <span key={ts} className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded border border-purple-100">{ts}</span>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <h4 className="text-xs font-bold text-gray-500 mb-1 flex items-center gap-1">
            <SchoolIcon size={12} /> 학교에서 해볼 수 있는 활동
          </h4>
          <p className="text-sm text-gray-700">{card.schoolActivity}</p>
        </div>
      </div>
    ))}
  </div>
);

// Helper for ExploreTab
const SchoolIcon = ({size}: {size: number}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M18 5v17"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>
)

const QuizTab = ({ onComplete }: { onComplete: (score: number) => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);

  const handleAnswer = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
    setIsAnswered(true);

    if (optionIdx === QUIZ_DATA[currentIdx].correctAnswer) {
      setScore(prev => prev + 1);
    } else {
      setWrongAnswers(prev => [...prev, QUIZ_DATA[currentIdx].id]);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < QUIZ_DATA.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onComplete(score + (selectedOption === QUIZ_DATA[currentIdx].correctAnswer ? 1 : 0));
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setWrongAnswers([]);
  };

  if (showResult) {
    const finalScore = score;
    return (
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-lg mx-auto">
        <Trophy size={64} className="mx-auto text-yellow-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">퀴즈 완료!</h2>
        <p className="text-gray-600 mb-6">당신의 점수는 <span className="text-primary font-bold text-xl">{finalScore * 10}점</span> 입니다.</p>
        
        {wrongAnswers.length > 0 && (
          <div className="text-left bg-red-50 p-4 rounded-lg mb-6 max-h-60 overflow-y-auto">
            <h4 className="font-bold text-red-600 mb-2">오답 노트</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              {QUIZ_DATA.filter(q => wrongAnswers.includes(q.id)).map(q => (
                <li key={q.id}>• {q.question} <span className="text-gray-500">(정답: {q.options[q.correctAnswer]})</span></li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={resetQuiz} className="bg-primary text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 mx-auto">
          <RotateCcw size={18} /> 다시 도전하기
        </button>
      </div>
    );
  }

  const question = QUIZ_DATA[currentIdx];

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-blue-500">QUESTION {currentIdx + 1} / {QUIZ_DATA.length}</span>
        <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-500">{question.category} 영역</span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-8 min-h-[3.5rem]">{question.question}</h3>

      <div className="space-y-3 mb-8">
        {question.options.map((opt, idx) => {
          let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
          if (isAnswered) {
            if (idx === question.correctAnswer) btnClass += "border-green-500 bg-green-50 text-green-700";
            else if (idx === selectedOption) btnClass += "border-red-500 bg-red-50 text-red-700";
            else btnClass += "border-gray-200 text-gray-400";
          } else {
            btnClass += "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
          }

          return (
            <button key={idx} disabled={isAnswered} onClick={() => handleAnswer(idx)} className={btnClass}>
              {idx + 1}. {opt}
            </button>
          )
        })}
      </div>

      {isAnswered && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg text-blue-800 text-sm">
          <p className="font-bold mb-1">💡 해설</p>
          {question.explanation}
        </div>
      )}

      <div className="flex justify-end">
        <button 
          onClick={nextQuestion} 
          disabled={!isAnswered}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-colors ${!isAnswered ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-blue-600'}`}
        >
          {currentIdx === QUIZ_DATA.length - 1 ? "결과 보기" : "다음 문제"} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

const ThinkTab = () => {
  const [answers, setAnswers] = useState({ q1: '', q2: '', manifesto: '' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('thinkAnswers', JSON.stringify(answers));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  useEffect(() => {
    const savedData = localStorage.getItem('thinkAnswers');
    if (savedData) setAnswers(JSON.parse(savedData));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold mb-3 text-gray-800">Q1. 디지털 기술이 나의 희망 직업을 어떻게 바꿀까요?</h3>
          <textarea 
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
            placeholder="예: 의사라면 AI가 진단을 돕고, 나는 환자의 심리적 케어에 더 집중할 것 같다."
            value={answers.q1}
            onChange={(e) => setAnswers({...answers, q1: e.target.value})}
          />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold mb-3 text-gray-800">Q2. 기술 발전으로 인해 사라질 수 있는 것은 무엇이며, 우리는 무엇을 지켜야 할까요?</h3>
          <textarea 
             className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
             placeholder="예: 손글씨나 대면 대화가 줄어들 것 같다. 인간적인 유대감을 지키기 위해 노력해야 한다."
             value={answers.q2}
             onChange={(e) => setAnswers({...answers, q2: e.target.value})}
          />
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-xl shadow-xl text-white flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Flame className="text-yellow-300" /> 나의 진로 선언문</h2>
        <p className="text-indigo-100 mb-6 text-sm">앞으로의 디지털 시대에 나는 어떤 태도로 진로를 개척해 나갈지 2문장으로 선언해보세요.</p>
        
        <textarea 
          className="w-full bg-white/10 border border-white/20 rounded-lg p-6 text-white placeholder-indigo-200 text-lg font-medium leading-relaxed focus:ring-2 focus:ring-white/50 outline-none h-48 resize-none mb-6"
          placeholder="나는 AI 기술을 도구로 활용하되, 인간만이 가진 공감 능력을 잃지 않는 OOO 전문가가 되겠습니다."
          value={answers.manifesto}
          onChange={(e) => setAnswers({...answers, manifesto: e.target.value})}
        />

        <button 
          onClick={handleSave}
          className="w-full bg-white text-indigo-600 font-bold py-3 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
        >
          {saved ? <CheckCircle size={20} /> : <Save size={20} />}
          {saved ? "저장 완료!" : "선언문 저장하기"}
        </button>
      </div>
    </div>
  );
};

const WizardModal = ({ 
  isOpen, 
  onClose, 
  onGenerate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onGenerate: (plan: ProjectPlan) => void 
}) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({ interest: '', activity: '', resources: '', keyword: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setLoading(true);
      const plan = await generateProjectPlanAI(data);
      setLoading(false);
      onGenerate(plan);
      onClose();
      // Reset for next time
      setStep(1);
      setData({ interest: '', activity: '', resources: '', keyword: '' });
    }
  };

  const isStepValid = () => {
    if (step === 1) return data.interest.length > 0;
    if (step === 2) return data.activity.length > 0;
    if (step === 3) return data.resources.length > 0;
    if (step === 4) return data.keyword.length > 0;
    return false;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-primary p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BrainCircuit /> AI 진로 로드맵 위저드
          </h2>
          <p className="text-blue-100 text-sm mt-1">4단계만 거치면 수행평가 계획서가 뚝딱!</p>
        </div>
        
        <div className="p-8 min-h-[300px] flex flex-col justify-center">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">AI가 당신의 계획서를 작성중입니다...</p>
              <p className="text-gray-400 text-sm mt-2">최대 10초 정도 소요될 수 있습니다.</p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="animate-fade-in">
                  <label className="block text-gray-700 font-bold mb-4 text-lg">1. 가장 관심 있는 분야는?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['의료/헬스케어', '교육/에듀테크', '환경/에너지', '문화/예술', '법/행정', '제조/로봇'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => setData({...data, interest: opt})}
                        className={`p-3 rounded-lg border-2 transition-all ${data.interest === opt ? 'border-primary bg-blue-50 text-primary' : 'border-gray-200 hover:border-blue-300'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    placeholder="직접 입력하기"
                    className="w-full mt-4 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={data.interest}
                    onChange={(e) => setData({...data, interest: e.target.value})}
                  />
                </div>
              )}
              {step === 2 && (
                <div className="animate-fade-in">
                  <label className="block text-gray-700 font-bold mb-4 text-lg">2. 프로젝트에서 내가 하고 싶은 역할은?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['데이터 분석', '아이디어 기획', '자료 조사', '발표/스피치', '코딩/구현', '디자인'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => setData({...data, activity: opt})}
                        className={`p-3 rounded-lg border-2 text-sm transition-all ${data.activity === opt ? 'border-primary bg-blue-50 text-primary' : 'border-gray-200 hover:border-blue-300'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="animate-fade-in">
                  <label className="block text-gray-700 font-bold mb-4 text-lg">3. 활용할 수 있는 자원은?</label>
                  <input 
                    type="text" 
                    placeholder="예: 학교 컴퓨터실, 과학 동아리 친구, 통계청 사이트"
                    className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                    value={data.resources}
                    onChange={(e) => setData({...data, resources: e.target.value})}
                  />
                  <p className="text-gray-400 text-sm mt-2">구체적일수록 현실성 점수가 올라갑니다.</p>
                </div>
              )}
              {step === 4 && (
                <div className="animate-fade-in">
                  <label className="block text-gray-700 font-bold mb-4 text-lg">4. 프로젝트 주제 키워드는?</label>
                  <input 
                    type="text" 
                    placeholder="예: 급식실 잔반 줄이기, 노인 헬스케어 알림"
                    className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-lg font-medium"
                    value={data.keyword}
                    onChange={(e) => setData({...data, keyword: e.target.value})}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-between items-center">
           {!loading && (
             <>
                <div className="flex gap-1">
                  {[1,2,3,4].map(s => (
                    <div key={s} className={`w-2 h-2 rounded-full ${s <= step ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  ))}
                </div>
                <div className="flex gap-3">
                  {step > 1 && (
                    <button onClick={() => setStep(step - 1)} className="px-4 py-2 text-gray-500 hover:text-gray-800">이전</button>
                  )}
                  <button 
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className={`px-6 py-2 rounded-full font-bold text-white transition-colors ${!isStepValid() ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary hover:bg-blue-600'}`}
                  >
                    {step === 4 ? '생성하기' : '다음'}
                  </button>
                </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
};

const PlanViewer = ({ plan }: { plan: ProjectPlan }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-accent animate-slide-up">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">📄 나의 수행평가 계획서</h2>
        <button className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md text-gray-600 transition-colors">
          <Save size={16} /> 저장/내보내기
        </button>
      </div>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-bold text-accent mb-2">1. 문제 정의</h3>
          <p className="bg-gray-50 p-4 rounded-lg text-gray-700">{plan.problemDefinition}</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-accent mb-2">2. 선정 배경</h3>
          <p className="bg-gray-50 p-4 rounded-lg text-gray-700">{plan.background}</p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-accent mb-2">3. 데이터 활용 계획</h3>
          <p className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm">
            <span className="font-bold text-red-500 mr-2">[주의]</span>
            {plan.dataUsage}
          </p>
        </section>

        <section>
          <h3 className="text-lg font-bold text-accent mb-2">4. 해결 아이디어 단계</h3>
          <ol className="list-decimal list-inside bg-gray-50 p-4 rounded-lg space-y-2 text-gray-700">
            {plan.solutionSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section>
            <h3 className="text-lg font-bold text-blue-600 mb-2">긍정적 효과</h3>
            <ul className="list-disc list-inside bg-blue-50 p-4 rounded-lg text-gray-700 text-sm">
              {plan.expectedEffects.positive.map((eff, i) => <li key={i}>{eff}</li>)}
            </ul>
          </section>
          <section>
             <h3 className="text-lg font-bold text-red-500 mb-2">부정적 영향 및 대응</h3>
             <div className="bg-red-50 p-4 rounded-lg text-gray-700 text-sm">
               <p className="mb-2 font-medium">⚠️ {plan.expectedEffects.negative}</p>
               <p className="text-green-700">🛡️ {plan.expectedEffects.response}</p>
             </div>
          </section>
        </div>

        <section>
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <User size={20} /> 30초 발표 스크립트
          </h3>
          <div className="bg-gray-800 text-white p-6 rounded-lg font-medium italic relative">
            <span className="absolute top-4 left-4 text-4xl text-gray-600 opacity-50">"</span>
            <p className="relative z-10 pl-4">{plan.pitchScript}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.WIZARD);
  const [profile, setProfile] = useState<UserProfile>({
    name: "김학생",
    level: 1,
    xp: 200,
    streak: 3,
    lastLogin: new Date().toISOString(),
    badges: ["신입 기획자"]
  });
  const [generatedPlan, setGeneratedPlan] = useState<ProjectPlan | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Initialize: If no plan, prompt wizard
  useEffect(() => {
    // Only prompt wizard if we are on the wizard tab and haven't generated one yet
    // Actually, let's keep the wizard separate and accessible via button
    setActiveTab(Tab.THEORY); // Start at theory for education flow
  }, []);

  const handleQuizComplete = (score: number) => {
    // Simple gamification logic
    if (score >= 8) {
      if (!profile.badges.includes("퀴즈 마스터")) {
        setProfile(prev => ({ ...prev, badges: [...prev.badges, "퀴즈 마스터"], xp: prev.xp + 500 }));
        alert("축하합니다! '퀴즈 마스터' 배지를 획득했습니다!");
      }
    }
  };

  const tabs = [
    { id: Tab.THEORY, label: '이론 개념', icon: BookOpen },
    { id: Tab.SIMULATION, label: '시뮬레이션', icon: Layout },
    { id: Tab.EXPLORE, label: '더 알아보기', icon: Map },
    { id: Tab.QUIZ, label: '퀴즈', icon: Lightbulb },
    { id: Tab.THINK, label: '생각해보기', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-2 rounded-lg">
              <Map size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-800 hidden md:block">나의 디지털 진로 로드맵</h1>
            <h1 className="text-xl font-bold text-gray-800 md:hidden">진로 로드맵</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm">
                <Flame className="text-orange-500" size={16} />
                <span className="font-bold text-gray-700">{profile.streak}일 연속</span>
             </div>
             <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm cursor-help" title={`XP: ${profile.xp}`}>
                <Trophy className="text-yellow-500" size={16} />
                <span className="font-bold text-gray-700">Lv.{profile.level}</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all ${isActive ? 'bg-primary text-white shadow-md font-bold' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
          <button 
             onClick={() => { setActiveTab(Tab.WIZARD); setIsWizardOpen(true); }}
             className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all ml-auto ${activeTab === Tab.WIZARD ? 'bg-accent text-white shadow-md font-bold' : 'bg-gradient-to-r from-purple-500 to-accent text-white hover:opacity-90'}`}
          >
            <BrainCircuit size={18} />
            AI 계획서 위저드
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
           {activeTab === Tab.THEORY && <TheoryTab />}
           
           {activeTab === Tab.SIMULATION && <SimulationTab />}
           
           {activeTab === Tab.EXPLORE && (
             <ExploreTab onSaveInterest={(job) => alert(`'${job}'이(가) 관심 목록에 저장되었습니다.`)} />
           )}
           
           {activeTab === Tab.QUIZ && (
             <QuizTab onComplete={handleQuizComplete} />
           )}
           
           {activeTab === Tab.THINK && <ThinkTab />}

           {activeTab === Tab.WIZARD && (
             <div className="space-y-6">
                {!generatedPlan ? (
                  <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <BrainCircuit size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">아직 작성된 계획서가 없습니다.</h2>
                    <p className="text-gray-500 mb-8">AI 위저드를 통해 나만의 수행평가 계획서를 3분 만에 만들어보세요.</p>
                    <button 
                      onClick={() => setIsWizardOpen(true)}
                      className="px-8 py-4 bg-accent text-white rounded-full font-bold text-lg shadow-lg hover:bg-purple-700 transition-all hover:scale-105"
                    >
                      계획서 만들기 시작
                    </button>
                  </div>
                ) : (
                  <PlanViewer plan={generatedPlan} />
                )}
             </div>
           )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2024 Digital Career Roadmap. All rights reserved.</p>
          <p className="mt-2">본 서비스는 교육용 목적으로 제작되었으며, 생성된 내용은 참고용으로만 활용하세요.</p>
        </div>
      </footer>

      {/* Wizard Modal */}
      <WizardModal 
        isOpen={isWizardOpen} 
        onClose={() => { setIsWizardOpen(false); if(generatedPlan) setActiveTab(Tab.WIZARD); }} 
        onGenerate={(plan) => { setGeneratedPlan(plan); setActiveTab(Tab.WIZARD); }} 
      />
    </div>
  );
};

export default App;
