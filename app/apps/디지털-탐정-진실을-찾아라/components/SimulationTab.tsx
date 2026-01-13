import React, { useState } from 'react';
import { CASES } from '../constants';
import { Case, StoryStep, DetectiveLevel } from '../types';
import { Search, CheckCircle, AlertTriangle, RefreshCw, Trophy } from 'lucide-react';

const SimulationTab: React.FC = () => {
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ msg: string; isPositive: boolean } | null>(null);
  const [completedCases, setCompletedCases] = useState<string[]>([]);

  const activeCase: Case | undefined = CASES.find(c => c.id === activeCaseId);
  const currentStep: StoryStep | undefined = activeCase?.steps[currentStepId || ''];

  const handleStartCase = (caseId: string) => {
    setActiveCaseId(caseId);
    const selectedCase = CASES.find(c => c.id === caseId);
    setCurrentStepId(selectedCase?.initialStepId || null);
    setHistory([]);
    setFeedback(null);
  };

  const handleChoice = (choiceId: string) => {
    if (!currentStep) return;
    const choice = currentStep.choices.find(c => c.id === choiceId);
    if (!choice) return;

    setScore(prev => prev + choice.scoreDelta);
    setFeedback({
      msg: choice.feedback,
      isPositive: choice.isCorrect
    });

    if (choice.nextStepId) {
      setTimeout(() => {
        setCurrentStepId(choice.nextStepId!);
        setFeedback(null);
      }, 2500); // Give time to read feedback
    } else {
      // End of case
      setTimeout(() => {
        if (activeCaseId && !completedCases.includes(activeCaseId)) {
            setCompletedCases(prev => [...prev, activeCaseId]);
        }
        setActiveCaseId(null);
        setCurrentStepId(null);
        setFeedback(null);
      }, 3000);
    }
  };

  const getDetectiveLevel = () => {
    if (score >= 80) return DetectiveLevel.MASTER;
    if (score >= 50) return DetectiveLevel.SENIOR;
    if (score >= 20) return DetectiveLevel.JUNIOR;
    return DetectiveLevel.ROOKIE;
  };

  if (activeCase && currentStep) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Search className="w-5 h-5" />
              수사 중: {activeCase.title}
            </h3>
            <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold">
              현재 점수: {score}
            </span>
          </div>

          <div className="p-6">
             {/* Progress Bar placeholder or Visual */}
             {currentStep.image && (
                 <div className="mb-6 rounded-lg overflow-hidden h-48 bg-gray-100 relative">
                     <img src={currentStep.image} alt="Situation" className="w-full h-full object-cover" />
                 </div>
             )}

            <div className="mb-8">
              <p className="text-xl leading-relaxed font-medium text-gray-800">
                {currentStep.text}
              </p>
            </div>

            {feedback ? (
              <div className={`p-4 rounded-lg text-center animate-bounce ${feedback.isPositive ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                <div className="flex justify-center mb-2">
                  {feedback.isPositive ? <CheckCircle className="w-8 h-8"/> : <AlertTriangle className="w-8 h-8"/>}
                </div>
                <p className="font-bold text-lg">{feedback.msg}</p>
                <p className="text-sm mt-2 text-gray-600">잠시 후 다음 장면으로 넘어갑니다...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentStep.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoice(choice.id)}
                    className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 font-medium text-gray-700 flex justify-between items-center group"
                  >
                    <span>{choice.text}</span>
                    <span className="opacity-0 group-hover:opacity-100 text-blue-500">👉</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Case Selection Screen
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
        <h2 className="text-2xl font-bold mb-2">사건 파일</h2>
        <p className="text-gray-600">해결하고 싶은 사건을 선택하세요.</p>
        <div className="mt-4 inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-gray-700">{getDetectiveLevel()}</span>
            <span className="text-gray-400 text-sm"> (점수: {score})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CASES.map((item) => {
            const isCompleted = completedCases.includes(item.id);
            return (
                <div key={item.id} className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all duration-300 hover:shadow-md ${isCompleted ? 'border-green-400 opacity-80' : 'border-gray-100 hover:border-blue-400'}`}>
                    <div className="h-32 bg-gray-200 relative">
                        <img src={`https://picsum.photos/seed/${item.id}/400/200?grayscale`} alt={item.title} className="w-full h-full object-cover opacity-80" />
                        {isCompleted && (
                            <div className="absolute inset-0 bg-green-900/40 flex items-center justify-center">
                                <span className="text-white font-bold text-lg border-2 border-white px-4 py-1 rounded uppercase tracking-widest">해결 완료</span>
                            </div>
                        )}
                    </div>
                    <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 h-10 line-clamp-2">{item.description}</p>
                    <button
                        onClick={() => handleStartCase(item.id)}
                        className={`w-full py-2 rounded-lg font-bold transition-colors ${isCompleted ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                    >
                        {isCompleted ? '다시 수사하기' : '수사 시작'}
                    </button>
                    </div>
                </div>
            );
        })}
      </div>

      {completedCases.length === 3 && (
          <div className="text-center p-8 bg-blue-50 rounded-xl border border-blue-100">
              <h3 className="text-2xl font-bold text-blue-900 mb-2">🎉 모든 사건을 해결했습니다!</h3>
              <p className="text-blue-700">당신은 이제 진정한 디지털 탐정입니다. 퀴즈 탭에서 실력을 확인해보세요!</p>
          </div>
      )}
    </div>
  );
};

export default SimulationTab;