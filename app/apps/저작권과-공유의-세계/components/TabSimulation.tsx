import React, { useState } from 'react';
import { SCENARIOS } from '../constants';
import { Gavel, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

const TabSimulation: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isJudgeMode, setIsJudgeMode] = useState(true); // true: voting, false: result
  const [animation, setAnimation] = useState(false);
  const [userVerdict, setUserVerdict] = useState<'guilty' | 'innocent' | null>(null);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const currentScenario = SCENARIOS[currentIndex];

  const handleVerdict = (verdict: 'guilty' | 'innocent') => {
    setAnimation(true);
    setUserVerdict(verdict);
    
    // Play sound effect could go here
    
    setTimeout(() => {
      setAnimation(false);
      setIsJudgeMode(false);
      if (verdict === currentScenario.verdict) {
        setScore(prev => prev + 1);
      }
    }, 600);
  };

  const nextScenario = () => {
    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsJudgeMode(true);
      setUserVerdict(null);
    } else {
      setGameFinished(true);
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setIsJudgeMode(true);
    setUserVerdict(null);
    setScore(0);
    setGameFinished(false);
  };

  if (gameFinished) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-2xl mx-auto border-t-8 border-amber-500">
        <div className="mb-6">
          <Gavel className="w-20 h-20 mx-auto text-amber-500 mb-4" />
          <h2 className="text-3xl font-bold text-slate-800 mb-2">재판 종료</h2>
          <p className="text-slate-500">모든 사건의 판결이 끝났습니다.</p>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-8 mb-8">
          <div className="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-2">최종 점수</div>
          <div className="text-5xl font-black text-slate-900">
            {score} / {SCENARIOS.length}
          </div>
          <p className="mt-4 text-slate-600">
            {score === SCENARIOS.length 
              ? "완벽합니다! 당신은 저작권법 마스터 판사입니다." 
              : score >= 3 
              ? "훌륭한 판결이었습니다. 조금만 더 공부하면 완벽할 거예요!" 
              : "저작권 공부가 더 필요해 보입니다. 다시 도전해보세요!"}
          </p>
        </div>

        <button 
          onClick={resetGame}
          className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
        >
          <RotateCcw size={20} />
          다시 시작하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header / Progress */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
          <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-sm">CASE #{currentIndex + 1}</span>
          AI 판사 시뮬레이션
        </h2>
        <div className="text-sm font-medium text-slate-500">
          남은 사건: {SCENARIOS.length - currentIndex}개
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 min-h-[400px] flex flex-col relative">
        {/* Scenario Content */}
        <div className="p-8 flex-grow">
          <div className="mb-2">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              currentScenario.difficulty === '쉬움' ? 'bg-green-100 text-green-700' :
              currentScenario.difficulty === '보통' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              난이도: {currentScenario.difficulty}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-6">{currentScenario.title}</h3>
          
          <div className="bg-slate-50 p-6 rounded-xl border-l-4 border-slate-400 mb-8">
            <p className="text-lg leading-relaxed text-slate-700">
              {currentScenario.description}
            </p>
          </div>

          {/* Judge Controls */}
          {isJudgeMode ? (
            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => handleVerdict('innocent')}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                <CheckCircle className="group-hover:scale-110 transition-transform" />
                무죄 (Innocent)
              </button>
              
              {/* Gavel Animation Overlay */}
              <div className="relative flex items-center justify-center w-20">
                 <Gavel 
                  size={48} 
                  className={`text-slate-300 ${animation ? 'gavel-animation text-amber-600' : ''}`} 
                 />
              </div>

              <button
                onClick={() => handleVerdict('guilty')}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                <XCircle className="group-hover:scale-110 transition-transform" />
                유죄 (Guilty)
              </button>
            </div>
          ) : (
            // Result View
            <div className="animate-fade-in mt-8">
               <div className={`p-6 rounded-xl text-center mb-6 relative overflow-hidden ${
                 userVerdict === currentScenario.verdict ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
               }`}>
                 {/* Stamp Effect */}
                 <div className={`absolute top-2 right-4 border-4 p-2 font-black text-2xl uppercase tracking-widest opacity-20 rotate-[-10deg] select-none stamp-animation ${
                    currentScenario.verdict === 'guilty' ? 'border-red-600 text-red-600' : 'border-green-600 text-green-600'
                 }`}>
                   {currentScenario.verdict === 'guilty' ? 'GUILTY' : 'INNOCENT'}
                 </div>

                 <h4 className={`text-2xl font-bold mb-2 ${
                   userVerdict === currentScenario.verdict ? 'text-green-700' : 'text-red-700'
                 }`}>
                   {userVerdict === currentScenario.verdict ? '정답입니다!' : '오답입니다!'}
                 </h4>
                 <p className="text-slate-600">
                   당신의 판결: <span className="font-bold">{userVerdict === 'guilty' ? '유죄' : '무죄'}</span> 
                   {' / '}
                   AI 정답: <span className="font-bold">{currentScenario.verdict === 'guilty' ? '유죄' : '무죄'}</span>
                 </p>
               </div>
               
               <div className="bg-slate-800 text-slate-100 p-6 rounded-xl mb-6">
                 <h5 className="font-bold text-amber-400 mb-2 flex items-center gap-2">
                   <Gavel size={16} />
                   판결문
                 </h5>
                 <p className="leading-relaxed">
                   {currentScenario.explanation}
                 </p>
               </div>

               <div className="text-right">
                 <button 
                  onClick={nextScenario}
                  className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-700 inline-flex items-center gap-2 shadow-lg"
                 >
                   다음 사건으로
                   <ArrowRight size={18} />
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabSimulation;