'use client'

import React, { useState } from 'react';
import { TabId, QuizQuestion, ChatMessage } from './types';
import { QUIZ_DATA } from './constants';
import SimulationTab from './components/SimulationTab';
import { getElevatorFeedback } from './services/geminiService';
import { BookOpen, PlayCircle, Layers, HelpCircle, Lightbulb, ChefHat, Check, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('simulation');

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Think State
  const [thinkInput, setThinkInput] = useState('');
  const [thinkResponse, setThinkResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleQuizAnswer = (optionIndex: number) => {
    if (quizAnswered !== null) return;
    setQuizAnswered(optionIndex);
    setShowExplanation(true);
    if (optionIndex === QUIZ_DATA[quizIndex].correctIndex) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuiz = () => {
    if (quizIndex < QUIZ_DATA.length - 1) {
      setQuizIndex(prev => prev + 1);
      setQuizAnswered(null);
      setShowExplanation(false);
    }
  };

  const handleThinkSubmit = async () => {
    if (!thinkInput.trim()) return;
    setIsThinking(true);
    const feedback = await getElevatorFeedback(thinkInput);
    setThinkResponse(feedback);
    setIsThinking(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'theory':
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100">
              <h2 className="text-2xl font-bold text-orange-600 mb-4">알고리즘이란?</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                알고리즘은 <strong>어떤 문제를 해결하기 위해 정해진 일련의 절차나 방법</strong>을 말합니다. 
                라면을 끓이는 레시피도, 학교 가는 길을 찾는 것도 모두 알고리즘입니다.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-orange-50 p-4 rounded-xl">
                  <h3 className="font-bold text-orange-800 mb-2">1. 입력 (Input)</h3>
                  <p className="text-sm text-gray-600">알고리즘을 시작하기 위해 필요한 재료나 정보입니다. (예: 물, 라면, 스프)</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl">
                  <h3 className="font-bold text-orange-800 mb-2">2. 처리 (Process)</h3>
                  <p className="text-sm text-gray-600">입력을 결과로 만들기 위해 수행하는 단계들입니다. (예: 끓이기, 젓기)</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl">
                  <h3 className="font-bold text-orange-800 mb-2">3. 출력 (Output)</h3>
                  <p className="text-sm text-gray-600">알고리즘 수행 후 얻게 되는 결과물입니다. (예: 맛있는 라면)</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">순서도(Flowchart) 기호 배우기</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                   <div className="w-24 h-12 rounded-full border-2 border-gray-800 flex items-center justify-center bg-gray-50 text-xs font-bold">시작/끝</div>
                   <div>
                     <h4 className="font-bold">단말 (Terminal)</h4>
                     <p className="text-sm text-gray-600">알고리즘의 시작과 끝을 알립니다.</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                   <div className="w-24 h-12 border-2 border-gray-800 flex items-center justify-center bg-blue-50 text-xs font-bold">라면 넣기</div>
                   <div>
                     <h4 className="font-bold">처리 (Process)</h4>
                     <p className="text-sm text-gray-600">실제로 어떤 행동을 하거나 계산을 하는 단계입니다.</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                   <div className="w-24 h-12 border-2 border-gray-800 transform rotate-0 flex items-center justify-center bg-purple-50 text-xs font-bold clip-diamond" style={{clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'}}>물 끓음?</div>
                   <div>
                     <h4 className="font-bold">판단 (Decision)</h4>
                     <p className="text-sm text-gray-600">조건(Yes/No)에 따라 다른 길로 가야 할 때 사용합니다.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'simulation':
        return <SimulationTab />;

      case 'learn':
        return (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
             <h2 className="text-2xl font-bold text-gray-800 mb-6">레시피 vs 프로그래밍 코드</h2>
             <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h3 className="text-xl font-bold text-orange-600 bg-orange-50 p-2 rounded inline-block">요리 레시피</h3>
                  <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm leading-relaxed border border-gray-200">
                    1. 냄비에 물 500ml를 넣는다.<br/>
                    2. 가스불을 켠다.<br/>
                    3. <span className="text-red-500 font-bold">만약(if)</span> 물이 끓으면:<br/>
                    &nbsp;&nbsp;&nbsp;- 면을 넣는다.<br/>
                    &nbsp;&nbsp;&nbsp;- 스프를 넣는다.<br/>
                    4. <span className="text-red-500 font-bold">아니면(else):</span><br/>
                    &nbsp;&nbsp;&nbsp;- 계속 기다린다.<br/>
                    5. 3분 뒤 불을 끈다.
                  </div>
               </div>
               <div className="space-y-4">
                  <h3 className="text-xl font-bold text-blue-600 bg-blue-50 p-2 rounded inline-block">프로그래밍 코드 (JavaScript)</h3>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm leading-relaxed shadow-inner">
                    <span className="text-purple-400">let</span> water = 500;<br/>
                    stove.<span className="text-blue-300">turnOn</span>();<br/><br/>
                    <span className="text-pink-400">if</span> (water.<span className="text-blue-300">isBoiling</span>()) {'{'}<br/>
                    &nbsp;&nbsp;pot.<span className="text-blue-300">add</span>(noodles);<br/>
                    &nbsp;&nbsp;pot.<span className="text-blue-300">add</span>(soup);<br/>
                    {'}'} <span className="text-pink-400">else</span> {'{'}<br/>
                    &nbsp;&nbsp;wait();<br/>
                    {'}'}<br/><br/>
                    stove.<span className="text-blue-300">turnOff</span>();
                  </div>
               </div>
             </div>
             <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="text-green-800 font-medium">
                  💡 <strong>핵심 포인트:</strong> 컴퓨터는 우리가 대충 말하면 알아듣지 못해요. 
                  "적당히 끓으면 넣어" 대신 "물이 100도가 되면 넣어"처럼 정확하게 명령해야 합니다. 
                  이것이 바로 <strong>절차적 사고</strong>입니다.
                </p>
             </div>
          </div>
        );

      case 'quiz':
        const currentQ = QUIZ_DATA[quizIndex];
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gray-100">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-300"
                    style={{ width: `${((quizIndex + 1) / QUIZ_DATA.length) * 100}%` }}
                  />
               </div>
               
               <div className="flex justify-between items-center mb-6 mt-2">
                 <span className="text-sm font-bold text-orange-500">QUIZ {quizIndex + 1} / {QUIZ_DATA.length}</span>
                 <span className="text-sm font-bold text-gray-500">점수: {quizScore}0점</span>
               </div>

               <h2 className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">
                 {currentQ.question}
               </h2>

               <div className="space-y-3">
                 {currentQ.options.map((option, idx) => {
                   let btnClass = "w-full p-4 rounded-xl border-2 text-left font-medium transition-all ";
                   if (quizAnswered === null) {
                     btnClass += "border-gray-100 hover:border-orange-300 hover:bg-orange-50 text-gray-600";
                   } else {
                     if (idx === currentQ.correctIndex) {
                       btnClass += "border-green-500 bg-green-50 text-green-700";
                     } else if (idx === quizAnswered) {
                       btnClass += "border-red-500 bg-red-50 text-red-700";
                     } else {
                       btnClass += "border-gray-100 text-gray-400 opacity-50";
                     }
                   }
                   
                   return (
                     <button
                       key={idx}
                       onClick={() => handleQuizAnswer(idx)}
                       disabled={quizAnswered !== null}
                       className={btnClass}
                     >
                       <div className="flex justify-between items-center">
                         <span>{option}</span>
                         {quizAnswered !== null && idx === currentQ.correctIndex && <Check size={20}/>}
                         {quizAnswered !== null && idx === quizAnswered && idx !== currentQ.correctIndex && <X size={20}/>}
                       </div>
                     </button>
                   );
                 })}
               </div>

               {showExplanation && (
                 <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-fade-in">
                   <h4 className="font-bold text-blue-800 mb-1">정답 해설</h4>
                   <p className="text-blue-700 text-sm">{currentQ.explanation}</p>
                   
                   {quizIndex < QUIZ_DATA.length - 1 ? (
                     <button 
                       onClick={nextQuiz}
                       className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                     >
                       다음 문제
                     </button>
                   ) : (
                      <div className="mt-4 text-center font-bold text-lg text-orange-600">
                        모든 퀴즈를 풀었습니다! 🎉
                      </div>
                   )}
                 </div>
               )}
            </div>
          </div>
        );

      case 'think':
        return (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Lightbulb className="text-yellow-300" />
                생각해볼 문제
              </h2>
              <p className="opacity-90 leading-relaxed mb-6">
                라면 끓이기보다 더 복잡한 알고리즘은 무엇이 있을까요?<br/>
                <strong>엘리베이터</strong>는 어떤 순서로 움직일까요? <br/>
                버튼을 누르면 무조건 이동할까요? 문이 열려있다면요?
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                <label className="block text-sm font-bold text-indigo-100 mb-2">
                  여러분이 생각하는 엘리베이터의 작동 규칙을 적어보세요.
                </label>
                <textarea 
                  value={thinkInput}
                  onChange={(e) => setThinkInput(e.target.value)}
                  placeholder="예: 1층에서 버튼을 누르면, 엘리베이터가 현재 층을 확인하고..."
                  className="w-full h-32 p-4 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-3"
                />
                <div className="flex justify-end">
                  <button 
                    onClick={handleThinkSubmit}
                    disabled={isThinking || !thinkInput.trim()}
                    className={`px-6 py-2 rounded-lg font-bold transition-all ${isThinking ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-400 text-indigo-900 hover:bg-yellow-300'}`}
                  >
                    {isThinking ? '선생님이 생각 중...' : '피드백 받기'}
                  </button>
                </div>
              </div>
            </div>

            {thinkResponse && (
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 animate-slide-up">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <ChefHat className="text-purple-600" size={24}/>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">알고리즘 선생님의 피드백</h4>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {thinkResponse}
                      </p>
                    </div>
                 </div>
               </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 text-gray-800 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-orange-500 p-2 rounded-lg text-white">
                <ChefHat size={24} />
             </div>
             <h1 className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">
               라면 요리사: <span className="text-orange-600">레시피 알고리즘</span>
             </h1>
          </div>
          
          <nav className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto max-w-[60vw] scrollbar-hide">
            {[
              { id: 'theory', label: '개념', icon: BookOpen },
              { id: 'simulation', label: '실습', icon: PlayCircle },
              { id: 'learn', label: '심화', icon: Layers },
              { id: 'quiz', label: '퀴즈', icon: HelpCircle },
              { id: 'think', label: '토론', icon: Lightbulb },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap
                  ${activeTab === tab.id ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}
                `}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-6">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        <p>© 2024 Algorithm Chef Education. Powered by React & Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
