import React, { useState, useEffect } from 'react';
import { Mission, MissionOption, UserState } from '../types';
import { MISSIONS_POOL } from '../constants';
import { seededRandom, getTodaySeed } from '../utils';
import { updateStreak, saveStorage } from '../services/storageService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, Info, Send } from 'lucide-react';

interface TabMissionProps {
  userState: UserState;
  onUpdateState: (newState: UserState) => void;
}

const TabMission: React.FC<TabMissionProps> = ({ userState, onUpdateState }) => {
  const [mission, setMission] = useState<Mission | null>(null);
  const [selectedOption, setSelectedOption] = useState<MissionOption | null>(null);
  const [userReason, setUserReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Micro Experiment State
  const [dataShareLevel, setDataShareLevel] = useState(50);
  
  useEffect(() => {
    // Select daily mission based on seed
    const seed = getTodaySeed();
    const rng = seededRandom(seed);
    const missionIndex = rng.nextInt(0, MISSIONS_POOL.length);
    setMission(MISSIONS_POOL[missionIndex]);

    // Check if already completed today (simple check based on memory, real app would check ID in today's list)
    // Here we reset local UI state for simplicity on re-mount, 
    // but in a full app we'd load 'isSubmitted' from persistent store for *this specific mission*.
  }, []);

  const handleComplete = () => {
    if (!mission || !selectedOption) return;
    
    // Simple verification for "Reason" length
    if (userReason.trim().length < 5) {
      alert("이유를 5글자 이상 적어주세요!");
      return;
    }

    setIsSubmitted(true);
    
    // Update Global State only if Correct (or always? "Training" implies reward for effort)
    // Let's reward for completion regardless of correctness, but bonus for correct.
    const newState = updateStreak(userState);
    if (!newState.completedMissions.includes(mission.id)) {
        newState.completedMissions.push(mission.id);
    }
    onUpdateState(newState);
    saveStorage(newState);
  };

  // Micro Experiment Logic
  const getExperimentData = () => {
    // Simple formula: Benefit increases linearly, Risk increases exponentially
    const benefit = Math.min(100, Math.floor(dataShareLevel * 0.9 + 10));
    const risk = Math.min(100, Math.floor(Math.pow(dataShareLevel, 1.6) / 40)); 
    
    return [
      { name: '편익(Benefit)', score: benefit, color: '#3b82f6' }, // Blue
      { name: '위험(Risk)', score: risk, color: '#ef4444' },    // Red
    ];
  };

  const experimentFeedback = () => {
    if (dataShareLevel < 30) return { text: "불편하지만 안전해요. 서비스 이용에 제약이 있을 수 있어요.", role: "최소수집" };
    if (dataShareLevel < 70) return { text: "편익과 위험의 균형 구간입니다. 하지만 민감 정보는 주의하세요.", role: "동의/검증" };
    return { text: "매우 편리하지만, 당신의 모든 것이 기록되고 있습니다. 유출 시 치명적입니다.", role: "책임/신중" };
  };

  if (!mission) return <div>미션 로딩 중...</div>;

  return (
    <div className="space-y-8">
      {/* SECTION A: DAILY MISSION */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
          <h2 className="font-bold text-lg flex items-center gap-2">
            📅 오늘의 미션
          </h2>
          <div className="text-xs bg-indigo-500 px-2 py-1 rounded">
            Seed: {getTodaySeed()}
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold mb-2">
              상황
            </span>
            <p className="text-lg font-medium text-slate-800 leading-snug">
              {mission.situation}
            </p>
            <div className="flex gap-2 mt-3">
              {mission.tags.map(tag => (
                <span key={tag} className="text-xs text-rose-500 bg-rose-50 px-2 py-1 rounded border border-rose-100">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {!isSubmitted ? (
            <div className="space-y-4">
              <div className="space-y-3">
                {mission.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedOption(option)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedOption?.id === option.id
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                        : 'border-slate-100 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  내 선택의 이유 (한 문장)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userReason}
                    onChange={(e) => setUserReason(e.target.value)}
                    placeholder="예: 출처가 불분명해서 위험하다고 생각했다."
                    className="flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleComplete}
                    disabled={!selectedOption || !userReason}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                  >
                    완료 <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in space-y-6">
              <div className={`p-4 rounded-xl border ${
                selectedOption?.type === 'correct' ? 'bg-green-50 border-green-200 text-green-800' :
                selectedOption?.type === 'risky' ? 'bg-red-50 border-red-200 text-red-800' :
                'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <div className="flex items-start gap-3">
                  {selectedOption?.type === 'correct' ? <CheckCircle className="shrink-0" /> : <AlertTriangle className="shrink-0" />}
                  <div>
                    <h3 className="font-bold mb-1">
                      {selectedOption?.type === 'correct' ? '올바른 선택입니다!' :
                       selectedOption?.type === 'risky' ? '위험한 선택입니다!' : '애매한 선택입니다.'}
                    </h3>
                    <p className="text-sm opacity-90">{selectedOption?.feedback}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="text-sm font-bold text-slate-500 mb-2 uppercase">Best Practice: 좋은 이유 예시</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                  {mission.goodReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION B: MICRO EXPERIMENT */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          🧪 마이크로 실험실: 데이터 공유의 대가
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          "편리함(서비스 품질)을 위해 내 정보를 얼마나 제공하시겠습니까?"<br/>
          슬라이더를 움직여 AI에게 제공할 데이터 수준을 조절해보세요.
        </p>

        <div className="mb-8 px-2">
          <input
            type="range"
            min="0"
            max="100"
            value={dataShareLevel}
            onChange={(e) => setDataShareLevel(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
            <span>최소 제공 (0)</span>
            <span>완전 제공 (100)</span>
          </div>
          <div className="text-center mt-2 font-bold text-indigo-600">
            현재 공유 레벨: {dataShareLevel}
          </div>
        </div>

        <div className="h-48 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getExperimentData()} layout="vertical" margin={{ left: 40, right: 40 }}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#666' }}>
                {getExperimentData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm">
          <div className="flex items-start gap-3">
             <div className="bg-white p-2 rounded-full border border-slate-200 shrink-0">
               <Info size={16} className="text-indigo-500" />
             </div>
             <div className="space-y-1">
               <p><span className="font-bold text-slate-700">편익:</span> {dataShareLevel > 50 ? '높음 (맞춤형 추천, 빠른 처리)' : '낮음 (일반적인 결과)'}</p>
               <p><span className="font-bold text-slate-700">위험:</span> {dataShareLevel > 50 ? '높음 (개인 식별, 유출 시 타격 큼)' : '낮음 (안전함)'}</p>
               <p className="mt-2 text-indigo-700 font-bold border-t border-slate-200 pt-2">
                 💡 인간의 역할: {experimentFeedback().role} - "{experimentFeedback().text}"
               </p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TabMission;