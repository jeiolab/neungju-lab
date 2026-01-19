import React, { useState, useEffect } from 'react';
import { MissionData, MissionType } from '../types';
import { generateDailyMission } from '../services/geminiService';
import { getTodayString, selectDailyMissionType } from '../utils';

interface Props {
  onComplete: (success: boolean, tags: string[]) => void;
  completedToday: boolean;
}

const DailyMission: React.FC<Props> = ({ onComplete, completedToday }) => {
  const [mission, setMission] = useState<MissionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [userSelection, setUserSelection] = useState<any>(null); // Type depends on mission
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [pipelineOrder, setPipelineOrder] = useState<number[]>([0, 1, 2]);

  useEffect(() => {
    loadMission();
  }, []);

  const loadMission = async () => {
    setLoading(true);
    try {
      const today = getTodayString();
      const type = selectDailyMissionType(today);
      
      // Check local storage or cache here could be an optimization, skipping for simplicity
      const data = await generateDailyMission(today, type);
      setMission(data);
      // Reset state for new mission
      setPipelineOrder([0, 1, 2]);
      setUserSelection(null);
    } catch (e) {
      console.error(e);
      alert("미션을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handlePipelineMove = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...pipelineOrder];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex >= 0 && swapIndex < newOrder.length) {
      [newOrder[index], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[index]];
      setPipelineOrder(newOrder);
    }
  };

  const checkAnswer = () => {
    if (!mission) return;
    let correct = false;

    switch (mission.type) {
      case MissionType.OX_REASON:
        if (userSelection && 
            userSelection.answer === mission.correctAnswer.answer && 
            Number(userSelection.reasonIndex) === Number(mission.correctAnswer.reasonIndex)) {
          correct = true;
        }
        break;
      case MissionType.CLASSIFICATION:
      case MissionType.DATA_ISSUE:
        if (Number(userSelection) === Number(mission.correctAnswer)) {
          correct = true;
        }
        break;
      case MissionType.PIPELINE_PUZZLE:
        if (JSON.stringify(pipelineOrder) === JSON.stringify(mission.correctAnswer)) {
          correct = true;
        }
        break;
    }

    setIsCorrect(correct);
    setFeedback(correct ? "정답입니다! 완벽해요." : "아쉽네요. 다시 한번 생각해볼까요?");
    
    // Call parent handler
    if (!completedToday) {
       onComplete(correct, mission.conceptTags);
    }
  };

  if (loading) return <div className="p-8 text-center text-indigo-600 animate-pulse">오늘의 미션을 생성 중입니다...</div>;
  if (!mission) return <div className="p-8 text-center text-gray-500">미션을 로드할 수 없습니다.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
      <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold">📅 오늘의 미션: {getTodayString()}</h2>
        <span className="text-xs bg-indigo-500 px-2 py-1 rounded-full border border-indigo-400">{mission.type}</span>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2 text-slate-800">{mission.title}</h3>
        <p className="text-slate-600 mb-6">{mission.description}</p>

        {/* Mission Content Area */}
        <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-100">
          
          {mission.type === MissionType.OX_REASON && (
            <div className="space-y-4">
              <p className="font-medium text-lg">{mission.content.question}</p>
              <div className="flex space-x-4 justify-center">
                {mission.content.options.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => setUserSelection({ ...userSelection, answer: opt })}
                    className={`w-16 h-16 rounded-full text-2xl font-bold border-2 transition-colors ${
                      userSelection?.answer === opt 
                      ? 'bg-indigo-100 border-indigo-500 text-indigo-700' 
                      : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {userSelection?.answer && (
                <div className="mt-4">
                  <p className="text-sm text-slate-500 mb-2">이유를 선택하세요:</p>
                  <div className="space-y-2">
                    {mission.content.reasonOptions.map((reason: string, idx: number) => (
                      <div 
                        key={idx} 
                        onClick={() => setUserSelection({ ...userSelection, reasonIndex: idx })}
                        className={`p-3 rounded cursor-pointer border ${
                          userSelection?.reasonIndex === idx
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {(mission.type === MissionType.CLASSIFICATION || mission.type === MissionType.DATA_ISSUE) && (
            <div className="space-y-4">
              <p className="font-medium">{mission.content.scenario}</p>
              <div className="grid gap-2">
                {mission.type === MissionType.CLASSIFICATION && mission.content.options.map((opt: string, idx: number) => (
                   <button
                   key={idx}
                   onClick={() => setUserSelection(idx)}
                   className={`p-3 rounded text-left border transition-colors ${
                     userSelection === idx
                     ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                     : 'bg-white border-slate-200 hover:bg-slate-50'
                   }`}
                 >
                   {opt}
                 </button>
                ))}
                {mission.type === MissionType.DATA_ISSUE && mission.content.issueOptions.map((opt: string, idx: number) => (
                   <button
                   key={idx}
                   onClick={() => setUserSelection(idx)}
                   className={`p-3 rounded text-left border transition-colors ${
                     userSelection === idx
                     ? 'bg-indigo-50 border-indigo-500 text-indigo-900'
                     : 'bg-white border-slate-200 hover:bg-slate-50'
                   }`}
                 >
                   {opt}
                 </button>
                ))}
              </div>
            </div>
          )}

          {mission.type === MissionType.PIPELINE_PUZZLE && (
            <div className="space-y-4">
              <p className="font-medium mb-2">목표: {mission.content.goal}</p>
              <p className="text-sm text-slate-500 mb-2">순서대로 정렬하세요:</p>
              <div className="space-y-2">
                {pipelineOrder.map((stepIndex, renderIndex) => (
                  <div key={stepIndex} className="flex items-center space-x-2 bg-white p-3 rounded border border-slate-200 shadow-sm">
                    <div className="flex flex-col space-y-1">
                      <button 
                        disabled={renderIndex === 0}
                        onClick={() => handlePipelineMove(renderIndex, 'up')}
                        className="text-slate-400 hover:text-indigo-600 disabled:opacity-30"
                      >▲</button>
                      <button 
                        disabled={renderIndex === pipelineOrder.length - 1}
                        onClick={() => handlePipelineMove(renderIndex, 'down')}
                        className="text-slate-400 hover:text-indigo-600 disabled:opacity-30"
                      >▼</button>
                    </div>
                    <span className="font-medium text-slate-700">{renderIndex + 1}.</span>
                    <span className="flex-1">{mission.content.steps[stepIndex]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Feedback Section */}
        {feedback && (
          <div className={`p-4 rounded-lg mb-4 ${isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
            <p className="font-bold mb-1">{feedback}</p>
            <p className="text-sm opacity-90">{mission.explanation}</p>
          </div>
        )}

        <button
          onClick={checkAnswer}
          disabled={completedToday && isCorrect === true}
          className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-transform transform active:scale-95 ${
            completedToday && isCorrect 
            ? 'bg-slate-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
          }`}
        >
          {completedToday && isCorrect ? '오늘의 미션 완료!' : '결과 확인하기'}
        </button>
      </div>
    </div>
  );
};

export default DailyMission;
