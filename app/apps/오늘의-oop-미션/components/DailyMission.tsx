import React, { useState } from 'react';
import { Mission, MissionType } from '../types';
import { CheckCircle, XCircle, AlertTriangle, Code, ArrowRight } from 'lucide-react';

interface DailyMissionProps {
  mission: Mission;
  onComplete: (success: boolean) => void;
  isCompletedToday: boolean;
}

const DailyMission: React.FC<DailyMissionProps> = ({ mission, onComplete, isCompletedToday }) => {
  const [userFix, setUserFix] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [showSolution, setShowSolution] = useState(false);

  const handleSubmit = () => {
    if (userFix.length < 5) {
      alert("수정 내용을 조금 더 구체적으로 적어주세요.");
      return;
    }
    // AI 분석 대신 사용자의 자기 평가를 유도하는 로직
    setShowSolution(true);
  };

  const handleSelfVerify = (success: boolean) => {
    setStatus(success ? 'success' : 'fail');
    onComplete(success);
  };

  if (isCompletedToday && !showSolution) {
    // If returning user
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">미션 완료!</h2>
        <p className="text-gray-600 mt-2">오늘의 디버깅 챌린지를 이미 해결하셨습니다.</p>
        <button 
            onClick={() => setShowSolution(true)}
            className="mt-4 text-indigo-600 hover:text-indigo-800 underline"
        >
            해설 다시 보기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 rounded-xl text-white shadow-lg">
        <div className="flex items-center space-x-2 mb-2 opacity-80">
          <AlertTriangle className="w-5 h-5" />
          <span className="uppercase tracking-wider text-xs font-bold">오늘의 버그 리포트</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">{mission.title}</h2>
        <p className="text-indigo-100">{mission.context}</p>
        <div className="mt-4 inline-block bg-indigo-800 px-3 py-1 rounded-full text-xs font-mono">
            유형: {mission.type}
        </div>
      </div>

      {/* Code Area */}
      <div className="bg-gray-900 rounded-xl p-4 shadow-inner border border-gray-700 overflow-x-auto">
        <div className="flex items-center space-x-2 mb-2 border-b border-gray-700 pb-2">
          <Code className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-400">buggy_script.js</span>
        </div>
        <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
          {mission.buggyCode}
        </pre>
      </div>

      {/* Interaction Area */}
      {!showSolution ? (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">어떻게 수정하시겠습니까?</h3>
          <p className="text-sm text-gray-500 mb-4">해결 방법이나 코드를 1~2문장으로 요약해 주세요.</p>
          <textarea
            value={userFix}
            onChange={(e) => setUserFix(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none mb-4 font-mono text-sm"
            rows={3}
            placeholder="// 예: 화살표 함수를 사용해서 this를 고정한다..."
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>수정 제안하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
           {/* Solution Reveal */}
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
             <h3 className="text-lg font-bold text-green-800 mb-2">진단 및 해설</h3>
             <div className="space-y-4">
                 <div>
                    <span className="font-bold text-red-600 text-xs uppercase">버그 원인</span>
                    <p className="text-gray-700 text-sm mt-1">{mission.bugDescription}</p>
                 </div>
                 <div>
                    <span className="font-bold text-green-600 text-xs uppercase">해결책</span>
                    <p className="text-gray-700 text-sm mt-1">{mission.fixExplanation}</p>
                 </div>
             </div>
             <div className="mt-4 bg-gray-900 p-4 rounded-lg">
                <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap">
                    {mission.correctedCode}
                </pre>
             </div>
          </div>

          {status === 'idle' && (
             <div className="bg-white p-6 rounded-xl shadow text-center">
                 <p className="mb-4 font-medium text-gray-800">문제를 올바르게 파악하셨나요?</p>
                 <div className="flex justify-center space-x-4">
                     <button 
                        onClick={() => handleSelfVerify(true)}
                        className="flex items-center space-x-2 px-6 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 font-bold"
                     >
                        <CheckCircle className="w-5 h-5"/> <span>네, 맞혔습니다!</span>
                     </button>
                     <button 
                        onClick={() => handleSelfVerify(false)}
                        className="flex items-center space-x-2 px-6 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 font-bold"
                     >
                        <XCircle className="w-5 h-5"/> <span>아니요, 틀렸습니다.</span>
                     </button>
                 </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyMission;