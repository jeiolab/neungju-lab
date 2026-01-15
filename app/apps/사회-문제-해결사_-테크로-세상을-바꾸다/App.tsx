import React, { useState, useEffect } from 'react';
import { PROBLEMS, BADGES } from './constants';
import { Problem, Tab, Block, BlockType } from './types';
import { BlockIcon } from './components/BlockIcon';
import { evaluateIdea } from './services/geminiService';
import { 
  CheckCircle, ArrowRight, LayoutGrid, Lightbulb, 
  BookOpen, PlayCircle, Award, RotateCcw, AlertTriangle 
} from 'lucide-react';

export default function App() {
  const [currentProblem, setCurrentProblem] = useState<Problem>(PROBLEMS[0]);
  const [activeTab, setActiveTab] = useState<Tab>('intro');
  const [pipeline, setPipeline] = useState<Block[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean>(false);
  
  // Idea form state
  const [ideaText, setIdeaText] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Initialize pipeline with empty slots or just empty array
  // We will use a drag and drop approach or click-to-add
  
  const handleProblemChange = (problem: Problem) => {
    setCurrentProblem(problem);
    setActiveTab('intro');
    setPipeline([]);
    setFeedbackMessage(null);
    setQuizAnswered(false);
    setQuizCorrect(false);
    setIdeaText('');
    setAiFeedback('');
  };

  const handleBlockAdd = (block: Block) => {
    if (pipeline.length >= currentProblem.correctSequence.length) {
      setFeedbackMessage("블록을 더 이상 추가할 수 없습니다. 필요 없는 블록을 제거해주세요.");
      return;
    }
    setPipeline([...pipeline, block]);
    setFeedbackMessage(null);
  };

  const handleBlockRemove = (index: number) => {
    const newPipeline = [...pipeline];
    newPipeline.splice(index, 1);
    setPipeline(newPipeline);
    setFeedbackMessage(null);
  };

  const checkSolution = () => {
    const currentIds = pipeline.map(b => b.id);
    const correctIds = currentProblem.correctSequence;

    if (currentIds.length !== correctIds.length) {
      setFeedbackMessage(`블록 개수가 맞지 않습니다. ${correctIds.length}개의 단계가 필요합니다.`);
      return;
    }

    let isCorrect = true;
    let errorStepIndex = -1;

    for (let i = 0; i < correctIds.length; i++) {
      if (currentIds[i] !== correctIds[i]) {
        isCorrect = false;
        errorStepIndex = i;
        break;
      }
    }

    if (isCorrect) {
      if (!solvedProblems.includes(currentProblem.id)) {
        setSolvedProblems([...solvedProblems, currentProblem.id]);
      }
      setActiveTab('success');
    } else {
      // Intelligent Error Feedback
      const errorBlock = pipeline[errorStepIndex];
      const correctBlockType = currentProblem.availableBlocks.find(b => b.id === correctIds[errorStepIndex])?.type;
      
      let msg = "순서가 올바르지 않습니다.";
      if (errorStepIndex === 0 && correctBlockType === BlockType.SENSOR) {
        msg = "첫 번째 단계는 데이터를 수집하는 '센서'가 필요합니다.";
      } else if (correctBlockType === BlockType.NETWORK) {
        msg = "데이터를 수집했다면, 전송할 '네트워크'가 필요합니다.";
      } else if (correctBlockType === BlockType.PROCESS) {
        msg = "데이터를 전송했다면, 이를 분석할 '서버'나 'AI'가 필요합니다.";
      } else if (correctBlockType === BlockType.ACTION) {
        msg = "분석이 끝났다면, 실제로 문제를 해결할 '행동'이 필요합니다.";
      }
      
      setFeedbackMessage(`오류 발생! ${errorStepIndex + 1}단계: ${msg}`);
    }
  };

  const submitIdea = async () => {
    if (!ideaText.trim()) return;
    setIsAiLoading(true);
    const response = await evaluateIdea(currentProblem.title, ideaText);
    setAiFeedback(response);
    setIsAiLoading(false);
  };

  const currentBadge = BADGES.slice().reverse().find(b => solvedProblems.length >= b.requirement);

  // --- Render Components ---

  const renderSidebar = () => (
    <div className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-slate-100">
        <h1 className="text-xl font-bold text-teal-600 flex items-center gap-2">
          <Lightbulb className="fill-current" />
          문제 해결사
        </h1>
        <p className="text-xs text-slate-500 mt-1">테크로 세상을 바꾸다</p>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">해결할 과제</h3>
        <div className="space-y-2">
          {PROBLEMS.map(p => (
            <button
              key={p.id}
              onClick={() => handleProblemChange(p)}
              className={`w-full text-left p-3 rounded-lg transition-all border ${
                currentProblem.id === p.id 
                  ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500' 
                  : 'bg-white border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${currentProblem.id === p.id ? 'text-teal-800' : 'text-slate-700'}`}>
                  {p.title}
                </span>
                {solvedProblems.includes(p.id) && <CheckCircle size={16} className="text-green-500" />}
              </div>
              <div className="text-xs text-slate-500 line-clamp-1">{p.shortDescription}</div>
            </button>
          ))}
        </div>

        <div className="mt-8">
           <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">나의 성과</h3>
           <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
             <div className="text-3xl font-bold text-slate-800">{solvedProblems.length}</div>
             <div className="text-xs text-slate-500">해결한 문제</div>
             {currentBadge && (
               <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-center gap-2 text-amber-500 font-bold text-sm animate-pulse">
                 <BlockIcon name={currentBadge.icon} size={18} />
                 {currentBadge.name} 획득!
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );

  const renderIntroTab = () => (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <img src={currentProblem.imageUrl} alt={currentProblem.title} className="w-full h-48 object-cover" />
        <div className="p-6">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
            currentProblem.difficulty === 'easy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            난이도: {currentProblem.difficulty === 'easy' ? '쉬움' : '어려움'}
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{currentProblem.title}</h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-6">
            {currentProblem.fullDescription}
          </p>
          <button 
            onClick={() => setActiveTab('build')}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            솔루션 설계 시작하기 <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );

  const renderBuildTab = () => (
    <div className="h-full flex flex-col md:flex-row gap-6 p-4 max-w-6xl mx-auto w-full">
      {/* Toolbox */}
      <div className="w-full md:w-1/3 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <LayoutGrid size={18} /> 사용 가능한 기술 블록
          </h3>
          <p className="text-xs text-slate-500 mt-1">클릭하여 파이프라인에 추가하세요.</p>
        </div>
        <div className="p-4 grid grid-cols-1 gap-3 overflow-y-auto flex-1">
          {currentProblem.availableBlocks.map(block => (
            <button
              key={block.id}
              onClick={() => handleBlockAdd(block)}
              className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-teal-400 hover:shadow-md transition-all text-left group"
            >
              <div className={`p-2 rounded-lg ${
                block.type === BlockType.SENSOR ? 'bg-blue-100 text-blue-600' :
                block.type === BlockType.NETWORK ? 'bg-purple-100 text-purple-600' :
                block.type === BlockType.PROCESS ? 'bg-orange-100 text-orange-600' :
                block.type === BlockType.ACTION ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
              }`}>
                <BlockIcon name={block.icon} size={20} />
              </div>
              <div>
                <div className="font-semibold text-slate-800">{block.name}</div>
                <div className="text-xs text-slate-500">{block.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="flex-1 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col relative overflow-hidden">
        <div className="p-4 flex justify-between items-center bg-white/50 backdrop-blur-sm border-b border-slate-200 z-10">
          <h3 className="font-bold text-slate-700">솔루션 파이프라인</h3>
          <div className="text-xs font-mono text-slate-500 bg-slate-200 px-2 py-1 rounded">
            {pipeline.length} / {currentProblem.correctSequence.length} 단계
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center space-y-2">
          {pipeline.length === 0 && (
            <div className="text-center text-slate-400 py-10">
              <RotateCcw size={48} className="mx-auto mb-4 opacity-20" />
              <p>왼쪽에서 블록을 선택해<br/>순서대로 조립해주세요.</p>
            </div>
          )}

          {pipeline.map((block, index) => (
            <React.Fragment key={`${block.id}-${index}`}>
              {/* Arrow Connector */}
              {index > 0 && (
                <div className="h-8 w-0.5 bg-slate-300 relative">
                  <div className="absolute -bottom-1 -left-1.5 text-slate-300">▼</div>
                </div>
              )}
              
              {/* Block Item */}
              <div className="relative group w-full max-w-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-200 z-10 relative">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                     {index + 1}
                   </div>
                   <div className={`p-2 rounded-lg ${
                      block.type === BlockType.SENSOR ? 'bg-blue-50 text-blue-600' :
                      block.type === BlockType.NETWORK ? 'bg-purple-50 text-purple-600' :
                      block.type === BlockType.PROCESS ? 'bg-orange-50 text-orange-600' :
                      'bg-green-50 text-green-600'
                   }`}>
                     <BlockIcon name={block.icon} />
                   </div>
                   <div className="flex-1">
                     <div className="font-bold text-slate-800">{block.name}</div>
                     <div className="text-xs text-slate-500 capitalize">{block.type}</div>
                   </div>
                   <button 
                    onClick={() => handleBlockRemove(index)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-2"
                   >
                     <BlockIcon name="XCircle" size={20} />
                   </button>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Feedback Area */}
        {feedbackMessage && (
          <div className="absolute bottom-20 left-4 right-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-3 shadow-lg animate-in slide-in-from-bottom-5">
            <AlertTriangle className="flex-shrink-0" />
            <p className="text-sm font-medium">{feedbackMessage}</p>
          </div>
        )}

        <div className="p-4 bg-white border-t border-slate-200 z-10">
          <button 
            onClick={checkSolution}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-md transition-all active:scale-95"
          >
            솔루션 실행하기
          </button>
        </div>
      </div>
    </div>
  );

  const renderSuccessTab = () => (
    <div className="max-w-2xl mx-auto py-8 px-4 text-center animate-in zoom-in duration-300">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Award size={48} />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">문제 해결 성공!</h2>
      <p className="text-slate-600 mb-8">
        축하합니다! 사회 문제를 해결할 완벽한 디지털 솔루션을 설계하셨습니다.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left mb-6">
        <h3 className="font-bold text-teal-700 mb-2">기대 효과</h3>
        <p className="text-slate-700 leading-relaxed">{currentProblem.successMessage}</p>
      </div>

      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left mb-8">
        <h3 className="font-bold text-slate-700 mb-2">사회적 가치</h3>
        <p className="text-slate-600 text-sm">{currentProblem.socialValue}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setActiveTab('quiz')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl"
        >
          확인 문제 풀기
        </button>
        <button 
          onClick={() => setActiveTab('idea')}
          className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl"
        >
          나만의 아이디어 제안
        </button>
      </div>
    </div>
  );

  const renderQuizTab = () => (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen /> 핵심 개념 퀴즈
          </h2>
        </div>
        <div className="p-8">
          <p className="text-lg font-medium text-slate-800 mb-6">
            Q. {currentProblem.quiz.question}
          </p>

          <div className="space-y-3">
            {currentProblem.quiz.options.map((option, idx) => (
              <button
                key={idx}
                disabled={quizAnswered}
                onClick={() => {
                  setQuizAnswered(true);
                  setQuizCorrect(idx === currentProblem.quiz.correctIndex);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  quizAnswered
                    ? idx === currentProblem.quiz.correctIndex
                      ? 'bg-green-100 border-green-500 ring-1 ring-green-500'
                      : 'bg-slate-50 border-slate-200 opacity-50'
                    : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                     quizAnswered && idx === currentProblem.quiz.correctIndex ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={quizAnswered && idx === currentProblem.quiz.correctIndex ? 'font-bold text-green-800' : 'text-slate-700'}>
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {quizAnswered && (
            <div className={`mt-6 p-4 rounded-lg animate-in fade-in ${quizCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <div className="font-bold mb-1">
                {quizCorrect ? '정답입니다! 👏' : '아쉽네요. 다시 생각해볼까요?'}
              </div>
              <p className="text-sm">{currentProblem.quiz.explanation}</p>
            </div>
          )}
          
          {quizAnswered && quizCorrect && (
            <button 
              onClick={() => setActiveTab('idea')}
              className="mt-6 w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700"
            >
              다음 단계로
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderIdeaTab = () => (
    <div className="max-w-2xl mx-auto py-8 px-4">
       <h2 className="text-2xl font-bold text-slate-800 mb-2">나만의 아이디어 제안</h2>
       <p className="text-slate-600 mb-6">
         우리가 해결한 문제 외에도, 기술로 해결하고 싶은 다른 사회 문제가 있나요?
         AI 멘토에게 아이디어를 들려주세요.
       </p>

       <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
         <label className="block text-sm font-bold text-slate-700 mb-2">
           어떤 문제와 기술을 사용하고 싶나요?
         </label>
         <textarea
           value={ideaText}
           onChange={(e) => setIdeaText(e.target.value)}
           placeholder="예: 시각장애인을 위해 카메라가 달린 안경이 앞의 물체를 읽어주는 기술을 만들고 싶어요."
           className="w-full p-4 rounded-xl border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 min-h-[120px] resize-none mb-4"
         />
         <button
           onClick={submitIdea}
           disabled={isAiLoading || !ideaText}
           className="w-full bg-indigo-600 disabled:bg-slate-300 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
         >
           {isAiLoading ? (
             <>
               <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
               AI 멘토가 분석 중...
             </>
           ) : (
             <>
               <Lightbulb size={18} /> 아이디어 평가받기
             </>
           )}
         </button>
       </div>

       {aiFeedback && (
         <div className="mt-6 bg-indigo-50 border border-indigo-100 p-6 rounded-2xl animate-in slide-in-from-bottom-4">
           <h3 className="font-bold text-indigo-800 flex items-center gap-2 mb-4">
             <BlockIcon name="CheckCircle" className="text-indigo-600" />
             AI 멘토의 피드백
           </h3>
           <div className="prose prose-sm text-indigo-900 whitespace-pre-wrap leading-relaxed">
             {aiFeedback}
           </div>
         </div>
       )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center">
        <h1 className="font-bold text-teal-600">사회 문제 해결사</h1>
        <div className="text-xs bg-slate-100 px-2 py-1 rounded">
          {solvedProblems.length} 완료
        </div>
      </div>

      {renderSidebar()}

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navigation for Tabs within a Problem context */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 overflow-x-auto no-scrollbar">
           {[
             { id: 'intro', label: '1. 문제 확인', icon: 'HelpCircle' },
             { id: 'build', label: '2. 솔루션 조립', icon: 'Cpu' },
             { id: 'success', label: '3. 성공 사례', icon: 'Award' },
             { id: 'quiz', label: '4. 확인 문제', icon: 'BookOpen' },
             { id: 'idea', label: '5. 아이디어', icon: 'Lightbulb' }
           ].map((tab) => {
             const isDisabled = (tab.id === 'success' || tab.id === 'quiz' || tab.id === 'idea') && !solvedProblems.includes(currentProblem.id);
             return (
               <button
                key={tab.id}
                onClick={() => !isDisabled && setActiveTab(tab.id as Tab)}
                disabled={isDisabled}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-teal-100 text-teal-700' 
                    : isDisabled 
                      ? 'text-slate-300 cursor-not-allowed' 
                      : 'text-slate-500 hover:bg-slate-100'
                }`}
               >
                 <BlockIcon name={tab.icon} size={16} />
                 {tab.label}
               </button>
             );
           })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 relative">
          {activeTab === 'intro' && renderIntroTab()}
          {activeTab === 'build' && renderBuildTab()}
          {activeTab === 'success' && renderSuccessTab()}
          {activeTab === 'quiz' && renderQuizTab()}
          {activeTab === 'idea' && renderIdeaTab()}
        </div>
      </main>
    </div>
  );
}