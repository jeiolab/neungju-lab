'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, CheckSquare, Brain, Lightbulb, Trophy, Star, Award, Zap, ChevronRight, PieChart, Info, Save, RotateCcw } from 'lucide-react';
import { UserProfile, TheoryCardData, ProblemModel, SubProblem, Reflection } from './types';
import { THEORY_CARDS, QUIZ_POOL, BADGES, REFLECTION_PROMPTS } from './constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

// --- Helper Components ---

const Header = ({ profile }: { profile: UserProfile }) => (
  <div className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm border-b border-gray-200">
    <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg text-gray-800 hidden sm:block">분해 마스터</span>
      </div>
      
      <div className="flex items-center space-x-4 text-sm font-medium">
        <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
          <Zap className="w-4 h-4 mr-1 fill-yellow-600" />
          <span>{profile.streak}일 연속</span>
        </div>
        <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          <Star className="w-4 h-4 mr-1 fill-blue-600" />
          <span>Lv.{profile.level}</span>
        </div>
        <div className="flex items-center text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          <Trophy className="w-4 h-4 mr-1" />
          <span>{profile.xp} XP</span>
        </div>
      </div>
    </div>
  </div>
);

// --- Tab Components ---

const TheoryTab = ({ 
  addXp, 
  mastery, 
  updateMastery 
}: { 
  addXp: (amount: number) => void; 
  mastery: Record<string, number>;
  updateMastery: (id: string, val: number) => void;
}) => {
  const [activeCardId, setActiveCardId] = useState<string>(THEORY_CARDS[0].id);
  const [flipped, setFlipped] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState<string | null>(null);

  const activeCard = THEORY_CARDS.find(c => c.id === activeCardId) || THEORY_CARDS[0];
  const progress = mastery[activeCard.id] || 0;

  const handleCardComplete = () => {
    if (progress < 100) {
      updateMastery(activeCard.id, 100);
      addXp(20);
    }
  };

  const checkQuiz = (idx: number) => {
    if (quizAnswered) return;
    setQuizAnswered(idx === activeCard.quiz.correctIndex ? 'correct' : 'wrong');
    if (idx === activeCard.quiz.correctIndex) {
      handleCardComplete();
    }
  };

  return (
    <div className="space-y-6">
      {/* Concept Selector */}
      <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
        {THEORY_CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => { setActiveCardId(card.id); setFlipped(false); setQuizAnswered(null); }}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCardId === card.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {card.title}
            {(mastery[card.id] || 0) >= 100 && <CheckSquare className="w-3 h-3 ml-1 inline" />}
          </button>
        ))}
      </div>

      {/* Main Flashcard Area */}
      <div className="relative group perspective-1000 min-h-[400px]">
        <div className={`relative w-full h-full duration-500 preserve-3d transition-transform ${flipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front Side */}
          <div className="absolute w-full backface-hidden bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{activeCard.title}</h2>
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">개념 카드</div>
              </div>
              <p className="text-xl font-medium text-gray-700 mb-6 leading-relaxed">
                "{activeCard.definition}"
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {activeCard.keywords.map(k => (
                  <span key={k} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm">#{k}</span>
                ))}
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <h4 className="font-bold text-blue-800 text-sm mb-1">예시</h4>
                <p className="text-blue-900 text-sm">{activeCard.example}</p>
              </div>
            </div>
            <button 
              onClick={() => setFlipped(true)}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center"
            >
              심화 학습 & 10초 퀴즈 <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </div>

          {/* Back Side */}
          <div className="absolute w-full backface-hidden rotate-y-180 bg-slate-800 rounded-2xl shadow-xl p-8 text-white h-full flex flex-col">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2" /> 흔한 오해 바로잡기
              </h3>
              <div className="bg-slate-700/50 p-4 rounded-lg mb-6">
                <p className="text-red-300 text-sm mb-2">❌ {activeCard.misconception.wrong}</p>
                <p className="text-green-300 text-sm font-medium">✅ {activeCard.misconception.right}</p>
              </div>

              <h3 className="text-lg font-bold text-slate-300 mb-4">⚡ 10초 체크</h3>
              <p className="text-lg mb-4">{activeCard.quiz.question}</p>
              <div className="space-y-2">
                {activeCard.quiz.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => checkQuiz(idx)}
                    disabled={!!quizAnswered}
                    className={`w-full text-left p-3 rounded-lg transition-all text-sm ${
                      quizAnswered === 'correct' && idx === activeCard.quiz.correctIndex
                        ? 'bg-green-600 text-white'
                        : quizAnswered === 'wrong' && idx !== activeCard.quiz.correctIndex
                        ? 'bg-slate-700 text-gray-400'
                        : quizAnswered === 'wrong' && idx === activeCard.quiz.correctIndex
                        ? 'bg-green-600/50 text-white' 
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {quizAnswered === 'correct' && (
                <div className="mt-4 text-center text-green-400 font-bold animate-pulse">정답입니다! +20XP</div>
              )}
              {quizAnswered === 'wrong' && (
                <div className="mt-4 text-center text-red-400 font-bold">다시 생각해보세요.</div>
              )}
            </div>
            <button 
              onClick={() => setFlipped(false)}
              className="mt-6 w-full py-2 border border-slate-600 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
            >
              앞면으로 돌아가기
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const SimulationTab = ({ addXp, checkBadges }: { addXp: (n:number)=>void, checkBadges: (score: number) => void }) => {
  const [model, setModel] = useState<ProblemModel>({
    situation: '',
    constraints: [],
    goal: '',
    decompositionType: 'function',
    subProblems: [],
    checklistScores: { noOverlap: 0, includesOriginal: 0, clearOrder: 0, atomic: 0 }
  });

  const [step, setStep] = useState(1); // 1: Analysis, 2: Decompose, 3: Check, 4: Model
  const [tempConstraint, setTempConstraint] = useState('');
  const [viewMode, setViewMode] = useState<'table'|'tree'>('table');

  const updateSubProblem = (id: string, field: keyof SubProblem, value: string) => {
    setModel(prev => ({
      ...prev,
      subProblems: prev.subProblems.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const calculateScore = () => {
    const scores = model.checklistScores;
    const total = scores.noOverlap + scores.includesOriginal + scores.clearOrder + scores.atomic;
    return Math.round((total / 400) * 100);
  };

  const totalScore = calculateScore();

  useEffect(() => {
    if (totalScore === 100) checkBadges(100);
  }, [totalScore, checkBadges]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Stepper */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map(s => (
          <div key={s} 
            className={`flex flex-col items-center flex-1 ${step >= s ? 'text-indigo-600' : 'text-gray-400'}`}
            onClick={() => { if(step > s) setStep(s) }}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${step === s ? 'bg-indigo-600 text-white' : step > s ? 'bg-indigo-100' : 'bg-gray-200'}`}>
              {s}
            </div>
            <span className="text-xs font-medium">
              {s===1?'분석':s===2?'분해':s===3?'검증':s===4?'모델링':''}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-fade-in">
          <h3 className="text-lg font-bold mb-4 flex items-center"><Brain className="w-5 h-5 mr-2 text-indigo-500"/>문제 정의하기</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">현재 상태 (As-Is)</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="예: 동아리 홍보물이 없어서 신입생이 안 온다."
                value={model.situation}
                onChange={e => setModel({...model, situation: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">목표 상태 (To-Be)</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="예: 홍보물을 SNS에 올려 가입 문의 10건 받기"
                value={model.goal}
                onChange={e => setModel({...model, goal: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제약 조건 (Constraints)</label>
              <div className="flex space-x-2 mb-2">
                <input 
                  type="text" 
                  className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="예: 예산 0원, 마감 내일"
                  value={tempConstraint}
                  onChange={e => setTempConstraint(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && tempConstraint) {
                      setModel(prev => ({...prev, constraints: [...prev.constraints, tempConstraint]}));
                      setTempConstraint('');
                    }
                  }}
                />
                <button 
                  onClick={() => {
                     if(tempConstraint) {
                      setModel(prev => ({...prev, constraints: [...prev.constraints, tempConstraint]}));
                      setTempConstraint('');
                     }
                  }}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-bold"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {model.constraints.map((c, i) => (
                  <span key={i} className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs flex items-center">
                    {c}
                    <button onClick={() => setModel(prev => ({...prev, constraints: prev.constraints.filter((_, idx) => idx !== i)}))} className="ml-2 hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>
            <button 
              disabled={!model.situation || !model.goal}
              onClick={() => { setStep(2); addXp(10); }}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-gray-300 transition-colors"
            >
              다음: 문제 쪼개기
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-fade-in">
          <h3 className="text-lg font-bold mb-4 flex items-center"><PieChart className="w-5 h-5 mr-2 text-indigo-500"/>하위 문제 분해</h3>
          
          <div className="flex space-x-4 mb-6 text-sm">
            <button 
              onClick={() => setModel({...model, decompositionType: 'function'})}
              className={`flex-1 py-2 rounded-lg border ${model.decompositionType === 'function' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-200'}`}
            >
              기능/역할별로 쪼개기
            </button>
            <button 
              onClick={() => setModel({...model, decompositionType: 'size'})}
              className={`flex-1 py-2 rounded-lg border ${model.decompositionType === 'size' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-200'}`}
            >
              크기/단계별로 쪼개기
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {model.subProblems.map((p, idx) => (
              <div key={p.id} className="flex items-center space-x-2">
                <span className="text-gray-400 font-mono text-sm w-6">{idx + 1}.</span>
                <input 
                  value={p.text}
                  onChange={(e) => updateSubProblem(p.id, 'text', e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="하위 작업 입력..."
                />
                <button 
                  onClick={() => setModel(prev => ({...prev, subProblems: prev.subProblems.filter(sub => sub.id !== p.id)}))}
                  className="text-gray-400 hover:text-red-500 p-2"
                >
                  ×
                </button>
              </div>
            ))}
            <button 
              onClick={() => setModel(prev => ({...prev, subProblems: [...prev.subProblems, { id: Date.now().toString(), text: '', owner: '', time: '', dependency: '' }]}))}
              className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-indigo-400 hover:text-indigo-500 transition-colors text-sm font-bold"
            >
              + 하위 문제 추가
            </button>
          </div>

          <button 
             disabled={model.subProblems.length < 2}
             onClick={() => { setStep(3); addXp(10); }}
             className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-gray-300 transition-colors"
          >
            다음: 검증하기
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-fade-in">
          <h3 className="text-lg font-bold mb-4 flex items-center"><CheckSquare className="w-5 h-5 mr-2 text-indigo-500"/>잘 쪼개졌는지 확인</h3>
          
          <div className="space-y-6 mb-6">
            {[
              { key: 'noOverlap', label: '서로 겹치는 내용이 없나요? (ME)' },
              { key: 'includesOriginal', label: '합치면 원래 문제가 해결되나요? (CE)' },
              { key: 'clearOrder', label: '실행 순서가 명확한가요?' },
              { key: 'atomic', label: '더 이상 쪼갤 필요가 없을 만큼 작나요?' }
            ].map((criterion) => (
              <div key={criterion.key}>
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span>{criterion.label}</span>
                  <span className="text-indigo-600">{(model.checklistScores as any)[criterion.key]}점</span>
                </div>
                <input 
                  type="range" min="0" max="100" step="10"
                  value={(model.checklistScores as any)[criterion.key]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setModel(prev => ({
                      ...prev,
                      checklistScores: { ...prev.checklistScores, [criterion.key]: val }
                    }));
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center mb-6">
            <span className="font-bold text-gray-600">종합 점수</span>
            <span className={`text-2xl font-bold ${totalScore >= 80 ? 'text-green-600' : 'text-orange-500'}`}>
              {totalScore}점
            </span>
          </div>

          <button 
             onClick={() => { setStep(4); addXp(totalScore > 80 ? 30 : 10); }}
             className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            다음: 모델링 결과 보기
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold flex items-center"><Award className="w-5 h-5 mr-2 text-indigo-500"/>최종 모델</h3>
             <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode==='table'?'bg-white shadow text-indigo-600':'text-gray-500'}`}
                >
                  표
                </button>
                <button 
                  onClick={() => setViewMode('tree')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${viewMode==='tree'?'bg-white shadow text-indigo-600':'text-gray-500'}`}
                >
                  트리
                </button>
             </div>
          </div>

          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">작업 (Task)</th>
                    <th className="px-4 py-3">담당 (Who)</th>
                    <th className="px-4 py-3">시간 (Time)</th>
                    <th className="px-4 py-3 rounded-tr-lg">의존 (Dependency)</th>
                  </tr>
                </thead>
                <tbody>
                  {model.subProblems.map((p, idx) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{p.text || '(내용 없음)'}</td>
                      <td className="px-4 py-3">
                        <input 
                          type="text" placeholder="나"
                          className="w-full bg-transparent outline-none border-b border-transparent focus:border-indigo-300"
                          value={p.owner} onChange={e => updateSubProblem(p.id, 'owner', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="text" placeholder="10분"
                          className="w-full bg-transparent outline-none border-b border-transparent focus:border-indigo-300"
                          value={p.time} onChange={e => updateSubProblem(p.id, 'time', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="text" placeholder="선행작업"
                          className="w-full bg-transparent outline-none border-b border-transparent focus:border-indigo-300"
                          value={p.dependency} onChange={e => updateSubProblem(p.id, 'dependency', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="flex flex-col items-center py-8 bg-gray-50 rounded-lg overflow-x-auto">
                <div className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg mb-8">
                  {model.goal || '목표'}
                </div>
                <div className="relative flex justify-center gap-8 w-full px-4">
                   {/* Connection Lines simulation */}
                   <div className="absolute top-[-20px] left-0 w-full h-[20px] flex justify-center">
                     <div className="w-[80%] border-t-2 border-l-2 border-r-2 border-gray-300 h-full rounded-t-xl"></div>
                   </div>
                   {model.subProblems.map((p, idx) => (
                     <div key={p.id} className="flex flex-col items-center relative group">
                        <div className="w-0.5 h-6 bg-gray-300 mb-0"></div>
                        <div className="bg-white border-2 border-indigo-200 px-4 py-2 rounded-lg shadow-sm text-sm font-medium hover:border-indigo-500 hover:shadow-md transition-all text-center min-w-[100px]">
                           {p.text}
                           <div className="text-xs text-gray-400 mt-1">{p.time}</div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          )}

          <div className="mt-8 flex justify-end space-x-2">
            <button 
              onClick={() => {
                alert('저장되었습니다! (로컬 스토리지)');
                addXp(50);
                checkBadges(100);
              }}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
            >
              <Save className="w-4 h-4 mr-2"/> 학습 완료 및 저장
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const QuizTab = ({ addXp }: { addXp: (n:number)=>void }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number|null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean|null>(null);
  const [score, setScore] = useState(0);

  const question = QUIZ_POOL[currentQ];

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === question.correctIndex;
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 1);
      addXp(10);
    }
  };

  const nextQ = () => {
    setSelected(null);
    setIsCorrect(null);
    if (currentQ < QUIZ_POOL.length - 1) {
      setCurrentQ(c => c + 1);
    } else {
      // Reset
      setCurrentQ(0);
      setScore(0);
      alert(`퀴즈 완료! 총점: ${score + (isCorrect ? 1 : 0)} / ${QUIZ_POOL.length}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">확인 문제</h2>
        <span className="text-sm font-medium text-gray-500">{currentQ + 1} / {QUIZ_POOL.length}</span>
      </div>

      <div className="mb-8">
        <div className="text-lg font-medium text-gray-800 mb-6 leading-relaxed">
          <span className="text-indigo-600 font-bold mr-2">Q.</span>
          {question.question}
        </div>
        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selected !== null}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selected === idx
                  ? isCorrect
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-red-500 bg-red-50 text-red-700'
                  : selected !== null && idx === question.correctIndex
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {selected !== null && (
        <div className="animate-fade-in">
          <div className={`p-4 rounded-lg mb-6 text-sm ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <span className="font-bold mr-2">{isCorrect ? '정답!' : '오답'}</span>
            {question.explanation}
          </div>
          <button 
            onClick={nextQ}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            {currentQ === QUIZ_POOL.length - 1 ? '결과 보기' : '다음 문제'}
          </button>
        </div>
      )}
    </div>
  );
};

const ThinkTab = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {REFLECTION_PROMPTS.map((prompt, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
             <div className={`p-2 rounded-lg mr-3 ${prompt.type === 'condition' ? 'bg-blue-100 text-blue-600' : prompt.type === 'counterexample' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
               <Lightbulb className="w-5 h-5" />
             </div>
             <h3 className="text-lg font-bold text-gray-800">{prompt.title}</h3>
          </div>
          <p className="text-gray-600 mb-4 text-sm">{prompt.text}</p>
          <textarea 
            className="w-full p-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 text-sm min-h-[100px]"
            placeholder="나의 생각을 적어보세요..."
            value={answers[prompt.type] || ''}
            onChange={(e) => setAnswers({...answers, [prompt.type]: e.target.value})}
          />
        </div>
      ))}
      <div className="text-center p-4">
        <button 
          onClick={() => alert('생각이 저장되었습니다.')}
          className="bg-gray-800 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-900 transition-transform hover:scale-105"
        >
          생각 저장하기
        </button>
      </div>
    </div>
  );
}

// --- Main App ---

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('profile');
    return saved ? JSON.parse(saved) : {
      xp: 0,
      level: 1,
      streak: 1,
      lastStudyDate: new Date().toISOString().split('T')[0],
      badges: [],
      mastery: {}
    };
  });

  const [activeTab, setActiveTab] = useState<'theory' | 'sim' | 'quiz' | 'think'>('theory');

  // Persistence
  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  // Logic: XP & Level
  const addXp = useCallback((amount: number) => {
    setProfile(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(Math.sqrt(newXp) / 5) + 1;
      return { ...prev, xp: newXp, level: newLevel };
    });
  }, []);

  const updateMastery = (id: string, val: number) => {
    setProfile(prev => ({
       ...prev, 
       mastery: { ...prev.mastery, [id]: Math.max(prev.mastery[id] || 0, val) }
    }));
  };

  const checkBadges = (checklistScore: number) => {
    if (checklistScore === 100 && !profile.badges.includes('perfect_score')) {
       setProfile(prev => ({...prev, badges: [...prev.badges, 'perfect_score']}));
       alert('배지 획득: 백점 만점! 🏆');
    }
  };

  // Streak Logic on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastStudyDate !== today) {
      const last = new Date(profile.lastStudyDate);
      const curr = new Date(today);
      const diff = (curr.getTime() - last.getTime()) / (1000 * 3600 * 24);
      
      if (diff <= 1.5) { // Consecutive day (allowing some buffer)
         setProfile(p => ({ ...p, streak: p.streak + 1, lastStudyDate: today }));
      } else {
         setProfile(p => ({ ...p, streak: 1, lastStudyDate: today }));
      }
    }
  }, []);

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <Header profile={profile} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'theory' && <TheoryTab addXp={addXp} mastery={profile.mastery} updateMastery={updateMastery} />}
        {activeTab === 'sim' && <SimulationTab addXp={addXp} checkBadges={checkBadges} />}
        {activeTab === 'quiz' && <QuizTab addXp={addXp} />}
        {activeTab === 'think' && <ThinkTab />}
      </main>

      {/* Bottom Nav (Mobile) / Side Nav (Desktop - simplified to bottom for this example) */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe z-40">
        <div className="max-w-4xl mx-auto flex justify-around items-center h-16 px-2">
          <button 
            onClick={() => setActiveTab('theory')}
            className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'theory' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BookOpen className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">개념 학습</span>
          </button>
          <button 
            onClick={() => setActiveTab('sim')}
            className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'sim' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Zap className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">실습</span>
          </button>
          <button 
            onClick={() => setActiveTab('quiz')}
            className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'quiz' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <CheckSquare className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">퀴즈</span>
          </button>
          <button 
            onClick={() => setActiveTab('think')}
            className={`flex flex-col items-center justify-center w-full h-full ${activeTab === 'think' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Lightbulb className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">생각하기</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
