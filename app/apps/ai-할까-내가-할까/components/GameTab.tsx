import React, { useState, useEffect } from 'react';
import { Mission, Role, ConditionTag, UserState, Badge } from '../types';
import { MISSIONS, BADGES } from '../constants';
import { Check, X, AlertCircle } from 'lucide-react';

interface GameTabProps {
  userState: UserState;
  updateState: (newState: Partial<UserState>) => void;
}

const CONDITIONS: { label: string; value: ConditionTag }[] = [
  { label: '데이터', value: 'DATA' },
  { label: '감정/공감', value: 'EMOTION' },
  { label: '책임/윤리', value: 'ETHICS' }, // Merged for simplicity UI
  { label: '창의성', value: 'CREATIVITY' },
  { label: '검증필요', value: 'VERIFICATION' },
];

const GameTab: React.FC<GameTabProps> = ({ userState, updateState }) => {
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<ConditionTag | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'SUCCESS' | 'PARTIAL' | 'FAIL'; msg: string; detail: string } | null>(null);
  const [dailySeed, setDailySeed] = useState<string>('');

  // Daily Mission Logic
  useEffect(() => {
    const today = new Date().toDateString();
    setDailySeed(today);
    loadNewMission();
  }, []);

  const loadNewMission = () => {
    // Randomly pick a mission not in recent history ideally, but for now simple random
    const randomIndex = Math.floor(Math.random() * MISSIONS.length);
    setCurrentMission(MISSIONS[randomIndex]);
    setSelectedRole(null);
    setSelectedCondition(null);
    setFeedback(null);
  };

  const handleJudge = () => {
    if (!currentMission || !selectedRole || !selectedCondition) return;

    const isRoleCorrect = currentMission.correctRole === selectedRole;
    // Condition is lenient: if the selected condition is ONE OF the correct conditions
    const isConditionCorrect = currentMission.correctConditions.includes(selectedCondition) || 
                               (selectedCondition === 'ETHICS' && currentMission.correctConditions.includes('RESPONSIBILITY')); // Mapping UI 'Ethics' to both

    let scoreToAdd = 0;
    let feedbackType: 'SUCCESS' | 'PARTIAL' | 'FAIL' = 'FAIL';
    let feedbackMsg = "아쉬워요!";
    
    if (isRoleCorrect && isConditionCorrect) {
      scoreToAdd = 10;
      feedbackType = 'SUCCESS';
      feedbackMsg = "정확한 판단입니다! 완벽해요!";
    } else if (isRoleCorrect) {
      scoreToAdd = 7;
      feedbackType = 'PARTIAL';
      feedbackMsg = "판단은 맞았지만, 핵심 이유(조건)가 조금 달라요.";
    } else if (isConditionCorrect) {
      scoreToAdd = 4;
      feedbackType = 'PARTIAL';
      feedbackMsg = "역할 판단은 틀렸지만, 중요한 조건을 잘 짚었어요!";
    } else {
      feedbackMsg = "역할과 조건 모두 다시 생각해볼까요?";
    }

    // Update State
    const newStreak = scoreToAdd >= 7 ? userState.streak + 1 : 0;
    const newHistory = [...userState.history, { missionId: currentMission.id, isCorrect: scoreToAdd >= 7, timestamp: Date.now() }];
    
    // Check Badges
    const currentTempState = { ...userState, score: userState.score + scoreToAdd, streak: newStreak, history: newHistory };
    const newBadges = [...userState.badges];
    BADGES.forEach(b => {
      if (!userState.badges.includes(b.id) && b.condition(currentTempState)) {
        newBadges.push(b.id);
        alert(`🏆 배지 획득: ${b.name}`);
      }
    });

    updateState({
      score: userState.score + scoreToAdd,
      streak: newStreak,
      history: newHistory,
      badges: newBadges,
      incorrectTags: isConditionCorrect ? userState.incorrectTags : {
        ...userState.incorrectTags,
        [selectedCondition]: (userState.incorrectTags[selectedCondition] || 0) + 1
      }
    });

    setFeedback({
      type: feedbackType,
      msg: feedbackMsg,
      detail: currentMission.explanation
    });
  };

  if (!currentMission) return <div className="p-10 text-center">미션 로딩 중...</div>;

  return (
    <div className="max-w-xl mx-auto p-4 pb-24">
      {/* Header Stats */}
      <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm mb-6">
        <div className="text-sm font-bold text-gray-500">🔥 연속 {userState.streak}문제</div>
        <div className="text-xl font-black text-indigo-600">{userState.score}점</div>
      </div>

      {/* Mission Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 border border-gray-100">
        <div className="bg-indigo-600 p-4 text-white">
          <div className="text-xs font-bold opacity-80 mb-1">MISSION #{currentMission.id}</div>
          <h2 className="text-2xl font-bold">{currentMission.title}</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-700 text-lg font-medium leading-relaxed">
            {currentMission.description}
          </p>
        </div>
      </div>

      {/* Inputs */}
      {!feedback ? (
        <div className="space-y-6 animate-pop">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2">누가 더 잘할까?</label>
            <div className="grid grid-cols-3 gap-3">
              {(['AI', 'HUMAN', 'CONDITIONAL'] as Role[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`py-3 rounded-lg font-bold border-2 transition-colors ${
                    selectedRole === role 
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                      : 'border-gray-200 bg-white text-gray-500 hover:border-indigo-200'
                  }`}
                >
                  {role === 'AI' ? '🤖 AI' : role === 'HUMAN' ? '🧑 인간' : '⚖️ 조건부'}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-500 mb-2">가장 핵심적인 조건은?</label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond.value}
                  onClick={() => setSelectedCondition(cond.value)}
                  className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${
                    selectedCondition === cond.value
                      ? 'bg-pink-500 text-white border-pink-500'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-pink-300'
                  }`}
                >
                  {cond.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleJudge}
            disabled={!selectedRole || !selectedCondition}
            className={`w-full py-4 rounded-xl text-lg font-black shadow-lg transition-transform active:scale-95 ${
              selectedRole && selectedCondition
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            판결 내리기
          </button>
        </div>
      ) : (
        /* Feedback Modal/Area */
        <div className="bg-white rounded-xl p-6 shadow-xl border-2 border-indigo-100 animate-pop">
          <div className="flex items-center mb-4">
            {feedback.type === 'SUCCESS' ? (
              <div className="bg-green-100 p-2 rounded-full mr-3"><Check className="text-green-600" /></div>
            ) : feedback.type === 'PARTIAL' ? (
               <div className="bg-yellow-100 p-2 rounded-full mr-3"><AlertCircle className="text-yellow-600" /></div>
            ) : (
              <div className="bg-red-100 p-2 rounded-full mr-3"><X className="text-red-600" /></div>
            )}
            <h3 className="text-xl font-bold">{feedback.msg}</h3>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-gray-700 leading-relaxed">
            <span className="font-bold text-indigo-600">해설: </span>
            {feedback.detail}
          </div>

          <div className="flex justify-end">
             <button
              onClick={loadNewMission}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-indigo-700 transition-colors"
            >
              다음 미션 도전!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameTab;
